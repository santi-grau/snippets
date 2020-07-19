import { Scene, WebGLRenderer, OrthographicCamera, Vector2, Mesh, Box2, CircleBufferGeometry, BufferGeometry, BufferAttribute, ShaderMaterial, RingBufferGeometry, MeshBasicMaterial, DoubleSide, Vector3, PerspectiveCamera, BoxBufferGeometry, TextureLoader, RepeatWrapping, LinearFilter, MaterialLoader } from 'three'
import tex from './yellow.gif'

import shader from './box.*'
class Tunnel{
    constructor(){
        this.node = document.getElementById( 'main' )

        this.scene = new Scene()
        this.camera = new PerspectiveCamera( )
        
        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        var map = new TextureLoader( ).load( tex )
        map.wrapS = RepeatWrapping
        map.wrapT = RepeatWrapping
        map.magFilter = LinearFilter
        map.minFilter = LinearFilter

        var material = new ShaderMaterial( {
            uniforms : {
                map : { value : map },
                time : { value : 0 },
                bb : { value : new Vector2() },
                segs : { value : 50 }
            },
            wireframe : false,
            transparent : true,
            vertexShader: shader.vert,
            fragmentShader: shader.frag,
            side : DoubleSide
        } )

        this.box = new Mesh( new BoxBufferGeometry( 1, 1, 1, 100, 100, 100 ), material )

        this.scene.add( this.box )

        this.onResize()
        this.step()
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
        this.renderer.setPixelRatio( window.devicePixelRatio )

        var camView = { fov : 15, aspect : width / height, near : 0.01, far : 1000 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 4.5
        this.camera.updateProjectionMatrix()

        var t = Math.tan( ( this.camera.fov * ( Math.PI / 180 ) ) / 2 )
        var h = t * 2 * this.camera.position.z;
        var w = h * this.camera.aspect;
        this.scene.children[ 0 ].scale.set( w, h, 100 )
        this.scene.children[ 0 ].position.z = -this.scene.children[ 0 ].scale.z / 2
        this.box.material.uniforms.bb.value = new Vector2( w, h )
        // this.box.onResize( w, h )
    }
  
    step( time ){
        requestAnimationFrame( () => this.step() )
        this.box.material.uniforms.time.value += 0.01
        this.renderer.render( this.scene, this.camera )
    }
}

new Tunnel()