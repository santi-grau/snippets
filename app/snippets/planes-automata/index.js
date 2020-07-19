import { Scene, WebGLRenderer, OrthographicCamera, Vector2, Mesh, PointLight, CircleBufferGeometry, MirroredRepeatWrapping, NearestFilter, TextureLoader, SphereBufferGeometry, Object3D, MeshLambertMaterial, PerspectiveCamera, BufferGeometry, BufferAttribute, ShaderMaterial, RingBufferGeometry, MeshBasicMaterial, DoubleSide, Vector3, MeshNormalMaterial, RepeatWrapping, MeshToonMaterial } from 'three'
import shader from 'plane.*'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'

class Geo extends Mesh{
    constructor(){
        super()

        this.depth = 10
        this.geometry = new BufferGeometry()
        var position = [], index = [], refs = [], o = 0


        for( var i = 0 ; i < this.depth ; i++ ){
            o = i * 4
            position.push( -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0 )
            index.push( o, o + 2, o + 1, o, o + 3, o + 2 )
            for( var j = 0 ; j < 4 ; j++ ) refs.push( i / this.depth, Math.random() )
            
        }

        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( position ), 3 ) )
        this.geometry.setAttribute( 'refs', new BufferAttribute( new Float32Array( refs ), 2 ) )
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )
        
        this.material = new ShaderMaterial( {
            uniforms : {
                time : { value : Math.random() * 10000 }
            },
            transparent : false,
            wireframe : true,
            vertexShader: shader.vert,
            fragmentShader: shader.frag,
        } )



    }
}

class Blob{
    constructor(){
        
        this.timeInc = 0
        this.node = document.getElementById( 'main' )

        // this.camera = new OrthographicCamera( )
        this.camera = new PerspectiveCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        this.geo = new Geo()
        this.scene.add( this.geo )

        this.onResize()

        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );

        var afterimagePass = new AfterimagePass();

        this.composer.addPass( afterimagePass )
        afterimagePass.uniforms[ "damp" ].value = 1

        this.step( 0 )

    }

    frustumAtDistance( ){
        var t = Math.tan( ( this.camera.fov * ( Math.PI / 180 ) ) / 2 )
        var h = t * 2 * this.camera.position.z
        var w = h * this.camera.aspect
        return { w : w, h : h }
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )

        var camView = { fov : 55, aspect : width / height, near : 0.01, far : 6 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 3

        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.geo.material.uniforms.time.value += 0.01

        this.composer.render();
        // this.renderer.render( this.scene, this.camera )
    }
}

new Blob()