
import { Scene, WebGLRenderer, OrthographicCamera, Vector2, Mesh, Box2, CircleBufferGeometry, BufferGeometry, BufferAttribute, ShaderMaterial, NearestFilter, RingBufferGeometry, MeshBasicMaterial, DoubleSide, Vector3, PerspectiveCamera, BoxBufferGeometry, CylinderBufferGeometry, TextureLoader, ClampToEdgeWrapping } from 'three'
import shader from './box.*'
import im from './ats.png'

class Tunnel{
    constructor(){
        this.node = document.getElementById( 'main' )

        this.scene = new Scene()
        this.camera = new PerspectiveCamera( )
        this.touchMarker = null
        this.oldTouchMarker = null
        
        this.scene.add( this.camera )

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        // this.box = new Box()
        // this.scene.add( this.box )
        var loader = new TextureLoader()
        var t = loader.load( im )
        t.wrapS = ClampToEdgeWrapping
        t.wrapT = ClampToEdgeWrapping

        t.magFilter = NearestFilter;
        t.minFilter = NearestFilter;

        var geometry = new CylinderBufferGeometry( 1, 1, 5, 32, 24, true )
        var material = new ShaderMaterial({
            uniforms : {
                map : { value : t }
            },
            vertexShader : shader.vert,
            fragmentShader : shader.frag,
            wireframe : false,
            transparent : true,
            side : DoubleSide
        })
        this.cylinder = new Mesh( geometry, material )
        this.scene.add( this.cylinder )
        this.cylinder.rotation.x = Math.PI / 2

        this.onResize()
        window.addEventListener( 'resize', ( ) => this.onResize( ) )
        this.step()
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
        this.renderer.setPixelRatio( window.devicePixelRatio )

        var camView = { fov : 45, aspect : width / height, near : 0.01, far : 1000 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 4.5
        this.camera.updateProjectionMatrix()

        // var t = Math.tan( ( this.camera.fov * ( Math.PI / 180 ) ) / 2 )
        // var h = t * 2 * this.camera.position.z;
        // var w = h * this.camera.aspect;
        // this.box.onResize( w, h )
    }
  
    step( time ){
        requestAnimationFrame( () => this.step() )
        // this.box.rotation.x += 0.1
        this.renderer.render( this.scene, this.camera )
    }
}

new Tunnel()