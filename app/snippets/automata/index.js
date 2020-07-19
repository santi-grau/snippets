import { Scene, WebGLRenderer, OrthographicCamera, Raycaster, Vector2, PlaneBufferGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import shaderPosition from './feedback.frag'

class Snippet{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : false, alpha : true } )
        this.node.appendChild( this.renderer.domElement )
        this.frame = 0
        this.res = 10

        this.mouse = new Vector2()
        
        this.computeSize = 2048
        this.gpuCompute = new GPUComputationRenderer( this.computeSize, this.computeSize, this.renderer )
        
        this.dtPosition = this.gpuCompute.createTexture()
        var ps = []
        for( var i = 0 ; i < this.computeSize * this.computeSize ; i++ ) ps.push( 0,0,0,1 )
        this.dtPosition.image.data = new Float32Array( ps )

        this.positionVariable = this.gpuCompute.addVariable( "texturePosition", shaderPosition, this.dtPosition )
            
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable ] )
        this.positionUniforms = this.positionVariable.material.uniforms

        this.positionUniforms[ 'time' ] = { value: 0.0 }
        this.positionUniforms[ 'ramp' ] = { value: 0.0 }
        this.positionUniforms[ 'seed' ] = { value: Math.random() }
        this.positionUniforms[ 'touching' ] = { value: false }
        this.positionUniforms[ 'touch' ] = { value: new Vector2( Math.random(), Math.random() ) }
        this.positionUniforms[ 'size' ] = { value: new Vector2( this.computeSize, this.computeSize ) }

        this.gpuCompute.init()
        
        this.node.addEventListener( 'mousedown', ( e ) => this.mouseDown( e ) )
        this.node.addEventListener( 'touchstart', ( e ) => this.touchStart( e ) )
        this.node.addEventListener( 'mouseup', ( e ) => this.mouseUp( e ) )
        this.node.addEventListener( 'touchend', ( e ) => this.mouseUp( e ) )
        
        var planeSize = Math.max( this.node.offsetWidth, this.node.offsetHeight )
        this.plane = new Mesh( new PlaneBufferGeometry( planeSize, planeSize ), new MeshBasicMaterial( { map : this.dtPosition } ) )
        this.scene.add( this.plane )

        this.onResize()
        this.step( 0 )
    }

    touchStart( e ){
        this.mouse.x = ( e.layerX / this.node.offsetWidth ) * 2 - 1;
        this.mouse.y = - ( e.layerY / this.node.offsetHeight ) * 2 + 1;
        this.cursorAction()
    }

    mouseDown( e ){
        this.mouse.x = ( e.clientX / this.node.offsetWidth ) * 2 - 1;
        this.mouse.y = - ( e.clientY / this.node.offsetHeight ) * 2 + 1;
        this.cursorAction()
    }

    cursorAction( ){
        var raycaster = new Raycaster()
        raycaster.setFromCamera( this.mouse, this.camera );
        var intersects = raycaster.intersectObjects( this.scene.children )
        if( intersects.length ) this.positionUniforms[ 'touch' ] = { value: intersects[ 0 ].uv }
        this.positionUniforms[ 'seed' ] = { value: Math.random() }
        this.positionUniforms[ 'ramp' ] = { value: 1.0 }
        this.positionUniforms[ 'touching' ] = { value: true }
    }

    mouseUp( e ){
        this.positionUniforms[ 'touching' ] = { value: false }
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 300
        
        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )

        this.positionUniforms[ 'ramp' ].value -= this.positionUniforms[ 'ramp' ].value * 0.01
        this.positionUniforms[ 'time' ].value += 0.01
        if( this.frame % 1 == 0 ){
            this.gpuCompute.compute()
            this.gpuCompute.compute()
            this.gpuCompute.compute()
            this.plane.material.map = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture
        }

        this.frame++

        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()