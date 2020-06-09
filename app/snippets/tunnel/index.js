import { Scene, WebGLRenderer, OrthographicCamera, Vector2, Mesh, Box2, CircleBufferGeometry, BufferGeometry, BufferAttribute, ShaderMaterial, RingBufferGeometry, MeshBasicMaterial, DoubleSide, Vector3, PerspectiveCamera, BoxBufferGeometry } from 'three'
import Box from './Box'

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

        this.box = new Box()
        this.scene.add( this.box )

        this.onResize()
        window.addEventListener( 'resize', ( ) => this.onResize( ) )
        window.addEventListener( 'touchstart', ( e ) => this.onTouchStart( e ) )
        window.addEventListener( 'touchend', ( e ) => this.onTouchEnd( e ) )
        window.addEventListener( 'touchmove', ( e ) => this.onTouchMove( e ) )
        this.step()
    }

    onTouchStart( e ){
        this.touchMarker = { x : e.pageX, y : e.pageY }
        this.oldTouchMarker = this.touchMarker
        console.log('here')
    }

    onTouchMove( e ){
        this.touchMarker = { x : e.pageX, y : e.pageY }
        if( this.oldTouchMarker ) {
            var dx = this.oldTouchMarker.x - this.touchMarker.x
            var dy = this.oldTouchMarker.y - this.touchMarker.y
            var dist = Math.sqrt( Math.pow( ( dx ), 2 ) + Math.pow( ( dy ), 2 ) )
            if( dist > 30 ) {
                if( abs( dx ) > abs( dy ) ) console.log( 'h' )
                else console.log( 'v' )
            }
        }
        // this.oldTouchMarker = this.touchMarker
    }

    onTouchEnd( e ){
        this.oldTouchMarker = null
        this.touchMarker = null
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
        this.renderer.setPixelRatio( window.devicePixelRatio )

        var camView = { fov : 45, aspect : width / height, near : 0.01, far : 1000 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 4.5
        this.camera.updateProjectionMatrix()

        var t = Math.tan( ( this.camera.fov * ( Math.PI / 180 ) ) / 2 )
        var h = t * 2 * this.camera.position.z;
        var w = h * this.camera.aspect;
        this.box.onResize( w, h )
    }
  
    step( time ){
        requestAnimationFrame( () => this.step() )
        this.box.step( time )
        // this.box.rotation.x += 0.1
        this.renderer.render( this.scene, this.camera )
    }
}

new Tunnel()