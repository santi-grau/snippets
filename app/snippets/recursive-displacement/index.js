import { Scene, WebGLRenderer, OrthographicCamera, TextureLoader, Vector2, Vector4, PlaneBufferGeometry, CanvasTexture, Mesh, MeshBasicMaterial, RepeatWrapping } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import shaderPosition from './feedback.frag'

class Snippet{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )


        this.res = 1280
        this.speed = 0.065

        this.scale = 1
        var [ width, height ] = [ this.node.offsetWidth / this.scale, this.node.offsetHeight / this.scale ]
        this.width = width
        this.gpuCompute = new GPUComputationRenderer( width, height, this.renderer )

       
        this.dtPosition = this.gpuCompute.createTexture()
        
    
        this.positionVariable = this.gpuCompute.addVariable( "texturePosition", shaderPosition, this.dtPosition )
        
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable ] )
        this.positionUniforms = this.positionVariable.material.uniforms

        this.positionUniforms[ 'time' ] = { value: 0.0 }
        this.positionUniforms[ 'scroll' ] = { value: 0.0 }
        this.positionUniforms[ 'size' ] = { value: new Vector2( width, height ) }

        this.gpuCompute.init()
     
        

        this.plane = new Mesh( new PlaneBufferGeometry( width * this.scale, height * this.scale ), new MeshBasicMaterial( { map : this.dtPosition } ) )
        this.scene.add( this.plane )

        this.onResize()
        this.step( 0 )
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

        this.positionUniforms[ 'time' ].value += 0.0065

        this.gpuCompute.compute()
        this.plane.material.map = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture

        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()