import { Scene, WebGLRenderer, OrthographicCamera, PerspectiveCamera, Raycaster, Vector2, BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, DoubleSide, ShaderMaterial, LineSegments } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'
import ringShader from 'ring.*'


class Geo extends Mesh{
    constructor(){
        super()

        this.rings = 128
        this.res = 64

        var vs = [], index = [], refs = [], o = 0
        for( var h = 0 ; h < this.rings ; h++ ){
            for( var i = 0 ; i < this.res ; i++ ){
                vs.push( Math.cos( Math.PI * 2 * i / this.res ), Math.sin( Math.PI * 2 * i / this.res ), -h / this.rings, Math.cos( Math.PI * 2 * i / this.res ), Math.sin( Math.PI * 2 * i / this.res ), -h / this.rings )
                refs.push( 0, i / this.res, h / this.rings, h, 1, i / this.res, h / this.rings, h )
                if( i > 0 ) {
                    index.push( o + i * 2, o + i * 2 - 2, o + i * 2 - 1 )
                    index.push( o + i * 2, o + i * 2 - 1, o + i * 2 + 1 )
                } 
                if( i == this.res - 1 ) {
                    index.push( o + i * 2, o + i * 2 + 1, o )
                    index.push( o, o + i * 2 + 1, o + 1 )
                }
            }
            o += this.res * 2
        }
        this.geometry = new BufferGeometry()
        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) );
        this.geometry.setAttribute( 'refs', new BufferAttribute( new Float32Array( refs ), 4 ) );
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )

        this.material = new ShaderMaterial( {
            uniforms : {
                time : { value : 0 },
                ramp : { value : 0 },
                res : { value : this.res }
            },
            wireframe : false,
            vertexShader : ringShader.vert,
            fragmentShader : ringShader.frag
        } )
    }
}

class LineGeo extends LineSegments{
    constructor(){
        super()
        
        this.rings = 128
        this.res = 128

        var vs = [], index = [], refs = [], o = 0
        for( var h = 0 ; h < this.rings ; h++ ){
            for( var i = 0 ; i < this.res ; i++ ){
                vs.push( Math.cos( Math.PI * 2 * i / this.res ), Math.sin( Math.PI * 2 * i / this.res ), -h / this.rings )
                refs.push( 0, i / this.res, h / this.rings, h )
                if( i > 0 ) index.push( o + i, o + i - 1 )
                if( i == this.res - 1 ) index.push( o + i, o )
            }
            o += this.res
        }

        this.geometry = new BufferGeometry()
        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) );
        this.geometry.setAttribute( 'refs', new BufferAttribute( new Float32Array( refs ), 4 ) );
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )

        this.material = new ShaderMaterial( {
            uniforms : {
                time : { value : 0 },
                ramp : { value : 0 },
                res : { value : this.res }
            },
            wireframe : false,
            vertexShader : ringShader.vert,
            fragmentShader : ringShader.frag
        } )
    }
}

class Snippet{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.camera = new PerspectiveCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        this.timer = 0
        
        this.geo = new Geo()
        this.scene.add( this.geo )

        document.addEventListener( 'click', ( ) => this.active =! this.active )
        
        this.onResize()

        this.composer = new EffectComposer( this.renderer )
        this.composer.addPass( new RenderPass( this.scene, this.camera ) )

        this.afterimagePass = new AfterimagePass()

        this.composer.addPass( this.afterimagePass )
        this.afterimagePass.uniforms[ 'damp' ].value = 0.98


        this.step( 0 )
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        // var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2, near : 0, far : 1000 }
        // for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        // this.camera.position.z = 100

        var camView = { fov : 25, aspect : width / height, near : 0.01, far : 10 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 4
        // this.camera.position.y = -0.2

        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.geo.material.uniforms.time.value += 0.005
        this.geo.material.uniforms.ramp.value = this.timer

        if( this.active ) this.timer += ( 1 - this.timer ) * 0.1

        this.composer.render();

        // this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()