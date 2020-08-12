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

        this.settings = {
            name : 'My GUI',
            play : true,
            speed : 60,
            rows : 1,
            columns : 1,
            displaceX : 0,
            displaceY : 0,
            variationRate : 2
        }

        var gui = new Dat.GUI( this.settings )
        gui.add( this.settings, 'speed', 1, 60, 1 )
        gui.add( this.settings, 'rows', 1, 100, 1 )
        gui.add( this.settings, 'columns', 1, 100, 1 )
        gui.add( this.settings, 'displaceX', 0, 1, 0.01 )
        gui.add( this.settings, 'displaceY', 0, 1, 0.01 )
        gui.add( this.settings, 'variationRate', 0, 5, 0.01 )
        gui.add( this.settings, 'play' )

        
        var res = parseInt( hash )  || 64
        this.geo = new Geo( res )
        this.scene.add( this.geo )
        
        var size = Math.max( this.node.offsetWidth, this.node.offsetHeight )
        this.geo.scale.set( size, size, 1 )

        this.computeSize = new Vector2( res * 2, res )
        this.gpuCompute = new GPUComputationRenderer( this.computeSize.x, this.computeSize.y, this.renderer )
        
        this.dtPosition = this.gpuCompute.createTexture()
        var ps = []

        var canvas = document.createElement( 'canvas' )
        var ctx = canvas.getContext( '2d' )
        canvas.width = res * 2
        canvas.height = res

        ctx.fillStyle = 'black'
        ctx.fillRect( 0, 0, canvas.width, canvas.height )
        ctx.beginPath()
        ctx.moveTo( res, res / 3 )
        ctx.lineTo( res * 2 * ( 2 / 8 ), res / 3 * 2 )
        ctx.lineTo( res * 2 * ( 6 / 8 ), res / 3 * 2 )
        ctx.fillStyle = 'white'
        ctx.closePath()
        ctx.fill()

        // document.body.appendChild( canvas )
        // canvas.style.position = 'absolute'
        // canvas.style.top = 0
        // canvas.style.left = 0

        for( var i = 0 ; i < this.computeSize.x * this.computeSize.y ; i++ ) ps.push( 0,0,0,1 )
        // this.dtPosition.image.data = Float32Array.from( ctx.getImageData( 0, 0, res * 2, res ).data )

        this.positionVariable = this.gpuCompute.addVariable( 'texturePosition', shaderPosition, this.dtPosition )
            
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable ] )
        this.positionUniforms = this.positionVariable.material.uniforms

        this.positionUniforms[ 'time' ] = { value: 0.0 }
        this.positionUniforms[ 'seed' ] = { value: Math.random() }
        this.positionUniforms[ 'splits' ] = { value:new Vector2( 1, 1 ) }
        this.positionUniforms[ 'move' ] = { value:new Vector2( 0.1, 0 ) }
        this.positionUniforms[ 'data' ] = { value: new CanvasTexture( canvas ) }
        this.positionUniforms[ 'size' ] = { value: new Vector2( this.computeSize.x, this.computeSize.y ) }

        this.gpuCompute.init()
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        this.plane = new Mesh( new PlaneBufferGeometry( this.computeSize.x * 4, this.computeSize.y * 4 ), new MeshBasicMaterial( { map : this.dtPosition } ) )
        this.plane.position.z = -20
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
        this.camera.position.z = 150

        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )

        this.positionUniforms[ 'time' ].value += 0.01
        

        if( this.frame % 2 == 0 ){
            this.gpuCompute.compute()
            this.geo.mesh.material.uniforms.tex.value = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture
            this.plane.material.map = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture
        }

        this.frame++

        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()