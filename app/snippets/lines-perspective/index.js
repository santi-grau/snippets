import { Scene, WebGLRenderer, OrthographicCamera, Mesh, BufferGeometry, Vector3, LineSegments, BufferAttribute, PerspectiveCamera, ShaderMaterial, Points, SphereBufferGeometry, DoubleSide, BoxBufferGeometry, TorusBufferGeometry, MeshBasicMaterial } from 'three'
import lineShader from './line.*'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'

class Geo extends Points{
    constructor(){
        super()

        this.res = 128
        this.depth = 1

        var vs = [], uvs = [], indices = [], counter = 0
        for( var h = 0 ; h < this.depth ; h++ ){
            for( var i = 0 ; i < this.res ; i++ ){
                for( var j = 0 ; j < 1 ; j++ ){
                    // var offset = i / this.res * Math.random()
                    var offset = 0
                    vs.push(  offset + i / ( this.res - 1 ) - 0.5, -1.1 , h / this.depth  )
                    uvs.push( i / this.res, j / this.res )
                    // indices.push( counter * 2 + 1, counter * 2 )
                    counter++
                }
            }
        }

        this.geometry = new BufferGeometry();
        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) )
        this.geometry.setAttribute( 'uv', new BufferAttribute( new Float32Array( uvs ), 2 ) )
        
        // this.geometry = new SphereBufferGeometry( 0.5, 128, 128)
        // this.geometry = new TorusBufferGeometry(0.5,0.1, 64, 256)
        
        // this.geometry.setIndex( new BufferAttribute( new Uint16Array( indices ), 1 ) )

        this.material = new ShaderMaterial( {
            uniforms : {
                time : { value : 0 }
            },
            transparent : true,
            side : DoubleSide,
            // wireframe : true,
            // depthTest : false,
            // depthWrite : false,
            vertexShader : lineShader.vert,
            fragmentShader : lineShader.frag
        })
        
    }

    step( time ){
        this.material.uniforms.time.value += 0.01
    }
}

class Snippet{
    constructor(){
       
        this.node = document.getElementById( 'main' )
        this.camera = new PerspectiveCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true } )
        this.node.appendChild( this.renderer.domElement )

        this.geo = new Geo()
        this.scene.add( this.geo )

        
        this.onResize()

        this.composer = new EffectComposer( this.renderer )
        this.composer.addPass( new RenderPass( this.scene, this.camera ) )

        this.afterimagePass = new AfterimagePass()

        this.composer.addPass( this.afterimagePass )
        this.afterimagePass.uniforms[ 'damp' ].value = 1

        // this.scene.add( new Mesh( new SphereBufferGeometry(0.9,64,64), new MeshBasicMaterial({color:0x666666, wireframe : true }) ) )
        this.step( 0 )
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        // var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        // for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        // this.camera.position.z = 100

        var camView = { fov : 25, aspect : width / height, near : 0.01, far : 20 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 4

        // this.camera.position.x = 5
        // this.camera.position.z = 5
        // this.camera.position.y = 5
        this.camera.lookAt( new Vector3( 0, 0, 0 ) )

        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.geo.step( time )
        this.geo.position.y += 0.0025
        // this.geo.position.y = Math.sin( time * 0.0001 * Math.PI * 2 )
        this.composer.render();
        // this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()