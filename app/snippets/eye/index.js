import { Scene, WebGLRenderer, OrthographicCamera, TextureLoader, Vector2, Vector4, PlaneBufferGeometry, CanvasTexture, Mesh, MeshBasicMaterial, RepeatWrapping } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import shaderPosition from './feedback.frag'

function nextPowerOf2( n ) { return Math.pow( 2, Math.ceil( Math.log( n ) / Math.log( 2 ) ) ) };

class Snippet{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        this.scale = 1
        var [ width, height ] = [ nextPowerOf2( this.node.offsetWidth / this.scale ), nextPowerOf2( this.node.offsetHeight / this.scale ) ]
        
        this.width = width
        this.gpuCompute = new GPUComputationRenderer( width, height, this.renderer )

        var canvas = document.createElement( 'canvas' )
        canvas.width = width
        canvas.height = height
        document.body.appendChild( canvas )
        var ctx = canvas.getContext( '2d' )

        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = '#00ff00'
        ctx.fillStyle = '#ffffff'
        ctx.arc( width / 2, height / 2, 50, 0, 2 * Math.PI )
        ctx.fill()
        var imageData = ctx.getImageData( 0, 0, width, height )
        console.log( imageData )
        
        this.dtPosition = this.gpuCompute.createTexture()
        this.dtPosition.wrapS = RepeatWrapping
        this.dtPosition.wrapT = RepeatWrapping
        var tex = new CanvasTexture( ctx.canvas )
        console.log( tex )
        this.dtPosition = tex

        // new TextureLoader().load( im, (t) => {
        //     this.dtPosition = t 

            this.positionVariable = this.gpuCompute.addVariable( "texturePosition", shaderPosition, this.dtPosition )
            
            this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable ] )
            this.positionUniforms = this.positionVariable.material.uniforms

            this.positionUniforms[ 'time' ] = { value: 0.0 }
            this.positionUniforms[ 'scroll' ] = { value: 0.0 }
            this.positionUniforms[ 'size' ] = { value: new Vector2( width, height ) }

            this.gpuCompute.init()
        // })
        
        console.log( this.gpuCompute )
        window.addEventListener( 'scroll', () => {
            var scrolled = window.scrollY
            this.positionUniforms[ 'scroll' ].value = scrolled * 0.01
            if ( window.scrollY + window.innerHeight >= document.body.offsetHeight - window.innerHeight * 0.2 ) {
                document.body.style.height = parseInt( document.body.offsetHeight ) + window.innerHeight + 'px'
            }
            
        })

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

        this.positionUniforms[ 'time' ].value += 0.01

        this.gpuCompute.compute()
        this.plane.material.map = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture

        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()