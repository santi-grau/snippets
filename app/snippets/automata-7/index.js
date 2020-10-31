import { Scene, WebGLRenderer, OrthographicCamera, Vector2, PlaneBufferGeometry, MeshBasicMaterial, Mesh, CanvasTexture } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import shaderPosition from './feedback.frag'
import CCapture from 'ccapture.js'

class Snippet{
    constructor(){
        
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true } )
        this.node.appendChild( this.renderer.domElement )
        this.frame = 0
        var hash = window.location.hash.substring( 1 )

        var res = parseInt( hash ) || 512
    
        this.computeSize = new Vector2( 3 * res, res )
        this.gpuCompute = new GPUComputationRenderer( this.computeSize.x, this.computeSize.y, this.renderer )
        
        this.dtPosition = this.gpuCompute.createTexture()
        var ps = []

        for( var i = 0 ; i < this.computeSize.x * this.computeSize.y ; i++ ) ps.push( 0,0,0,1 )

        this.positionVariable = this.gpuCompute.addVariable( 'texturePosition', shaderPosition, this.dtPosition )
            
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable ] )
        this.positionUniforms = this.positionVariable.material.uniforms

        this.positionUniforms[ 'time' ] = { value: 0.0 }
        this.positionUniforms[ 'seed' ] = { value: Math.random() }
        this.positionUniforms[ 'size' ] = { value: new Vector2( this.computeSize.x, this.computeSize.y ) }

        this.gpuCompute.init()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        this.plane = new Mesh( new PlaneBufferGeometry( 1, 1 ), new MeshBasicMaterial( { map : this.dtPosition } ) )
        this.scene.add( this.plane )

        this.capturing = false
        this.capturer = new CCapture( {
            format: 'png' ,
            verbose : true,
            display : true
        } )

        setTimeout( ( ) => this.randomize(), 1000 )
        document.addEventListener( 'keydown', ( e ) => this.toggleCapture( e ) )
        this.onResize()
        this.step( 0 )
    }

    toggleCapture( e ){
        if( e.keyCode == 67 ){
            
            if( !this.capturing ) this.capturer.start()
            else {
                this.capturer.stop()
                this.capturer.save()
            }
            this.capturing = !this.capturing
        }
    }

    randomize(){
        this.positionUniforms[ 'seed' ].value = Math.random()
        setTimeout( ( ) => this.randomize(), 1000 )
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 150
        this.plane.scale.set( width, height, 1 )
        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.positionUniforms[ 'time' ].value += 0.001
        
        if( this.frame % 2 == 1 ){
            this.gpuCompute.compute()
            this.plane.material.map = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture
        }
        this.frame++
        this.renderer.render( this.scene, this.camera )
        if( this.capturing ) this.capturer.capture( this.renderer.domElement );
    }
}

new Snippet()