import { Scene, WebGLRenderer, OrthographicCamera, Vector2, PlaneBufferGeometry, MeshBasicMaterial, Mesh, CanvasTexture } from 'three'
import Geo from './Geo'
import Dat from 'dat.gui';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import shaderPosition from './feedback.frag'

class Snippet{
    constructor(){
        
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true } )
        this.node.appendChild( this.renderer.domElement )
        this.frame = 0
        var hash = window.location.hash.substring( 1 )

        // this.settings = {
        //     name : 'My GUI',
        //     play : true,
        //     speed : 60,
        //     rows : 1,
        //     columns : 1,
        //     displaceX : 0,
        //     displaceY : 0,
        //     variationRate : 2
        // }

        // var gui = new Dat.GUI( this.settings )
        // gui.add( this.settings, 'speed', 1, 60, 1 )
        // gui.add( this.settings, 'rows', 1, 100, 1 )
        // gui.add( this.settings, 'columns', 1, 100, 1 )
        // gui.add( this.settings, 'displaceX', 0, 1, 0.01 )
        // gui.add( this.settings, 'displaceY', 0, 1, 0.01 )
        // gui.add( this.settings, 'variationRate', 0, 5, 0.01 )
        // gui.add( this.settings, 'play' )

        
        var res = parseInt( hash ) || 512
       
        
        var size = Math.max( this.node.offsetWidth, this.node.offsetHeight )
      

        this.computeSize = new Vector2( res, res )
        this.gpuCompute = new GPUComputationRenderer( this.computeSize.x, this.computeSize.y, this.renderer )
        
        this.dtPosition = this.gpuCompute.createTexture()
        var ps = []

        for( var i = 0 ; i < this.computeSize.x * this.computeSize.y ; i++ ) ps.push( 0,0,0,1 )
        // this.dtPosition.image.data = Float32Array.from( ctx.getImageData( 0, 0, res * 2, res ).data )

        this.positionVariable = this.gpuCompute.addVariable( 'texturePosition', shaderPosition, this.dtPosition )
            
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable ] )
        this.positionUniforms = this.positionVariable.material.uniforms

        this.positionUniforms[ 'time' ] = { value: 0.0 }
        this.positionUniforms[ 'seed' ] = { value: Math.random() }
        this.positionUniforms[ 'splits' ] = { value:new Vector2( 1, 1 ) }
        this.positionUniforms[ 'move' ] = { value:new Vector2( 0.1, 0 ) }
       
        this.positionUniforms[ 'size' ] = { value: new Vector2( this.computeSize.x, this.computeSize.y ) }

        this.gpuCompute.init()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        this.plane = new Mesh( new PlaneBufferGeometry( 1, 1 ), new MeshBasicMaterial( { map : this.dtPosition } ) )
        this.scene.add( this.plane )

        setTimeout( ( ) => this.randomize(), 1000 )

        this.onResize()
        this.step( 0 )
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
    }
}

new Snippet()