import { Scene, WebGLRenderer, OrthographicCamera, TextureLoader, Vector2, Vector4, Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from 'three'
import Planes from './Planes'
import shaders from './shaders/*.*'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

class Snippet{
    constructor(){
        this.title = 'Snippet'
       
        this.node = document.getElementById( 'main' )
        

        this.camera = new OrthographicCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        // new OrbitControls( this.camera, this.renderer.domElement );

        this.tSize = 16
        

        this.copy = document.querySelector( '#copy' )
        var spans = []
        var split = this.copy.innerHTML.split( '' )
        this.copy.innerHTML = ''
        
        var ps = []

        split.forEach( l => {
            var s = document.createElement( 'span' )
            s.innerHTML = l
            spans.push( s )
            this.copy.appendChild( s )
        })

        var charmap = { "C" : [0,4], "O" : [4,1], "N" : [1,4], "G" : [2,4], "R" : [3,4], "E" : [4,4], "S" : [0,3], "H" : [1,3], "A" : [2,3], "L" : [3,3], "M" : [4,3], "K" : [4,2], "W" : [3,2], "P" : [2,2], "T" : [1,2], "I" : [0,2], "B" : [2,0], "F" : [1,1], "," : [0,1], "X" : [3,1], ";" : [2,1], "D" : [4,0], "Y" : [0,0], "V" : [1,0], "." : [3,0] }

        var chars = []
        var glyphmap = []
        Object.values(this.copy.childNodes).forEach( l => {
            if( l.innerHTML !== ' ') {
                if( chars.indexOf( l.innerHTML ) == -1 ) chars.push( l.innerHTML )
                var bb = l.getBoundingClientRect()
                ps.push( bb.x / window.innerWidth - 0.5,  ( window.innerHeight - bb.y ) / window.innerHeight - 0.415, Math.random() - 0.5, 1 )
                glyphmap.push( charmap[ l.innerHTML ] )
            }
        })

        for( var i = glyphmap.length / 2 ; i < this.tSize * this.tSize ; i++ ) glyphmap.push( [0, 0] )

        this.planes = new Planes( this.tSize, glyphmap )
        this.scene.add( this.planes )
        

        for( var i = ps.length / 4 ; i < this.tSize * this.tSize ; i++ ) ps.push(  Math.random() - 0.5,  Math.random() - 0.5,  Math.random() - 0.5, 0 )

        
        this.gpuCompute = new GPUComputationRenderer( this.tSize, this.tSize, this.renderer )
        this.dtPosition = this.gpuCompute.createTexture()
        this.dtVelocity = this.gpuCompute.createTexture()

        var vs = []
        for ( var i = 0; i < this.tSize * this.tSize; i++ ) vs.push( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random() )
        
        this.dtPosition.image.data = new Float32Array( ps )
        this.dtVelocity.image.data = new Float32Array( vs )

        this.velocityVariable = this.gpuCompute.addVariable( "textureVelocity", shaders.velocity.frag, this.dtVelocity )
        this.positionVariable = this.gpuCompute.addVariable( "texturePosition", shaders.position.frag, this.dtPosition )
        
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable, this.velocityVariable ] )
        this.gpuCompute.setVariableDependencies( this.velocityVariable, [ this.positionVariable, this.velocityVariable ] )
        
        this.positionUniforms = this.positionVariable.material.uniforms
        this.velocityUniforms = this.velocityVariable.material.uniforms

        this.positionUniforms[ "time" ] = { value: 0.0 }
        this.positionUniforms[ "props" ] = { value : new Vector4( ) }
    
        this.gpuCompute.init()

        this.scroller = document.createElement( 'div' )
        document.body.appendChild( this.scroller )
        this.scroller.style.height = '5000px'

        document.addEventListener( 'scroll', ( e ) => {
            if ( window.scrollY + window.innerHeight >= this.scroller.offsetHeight - window.innerHeight * 0.2 ) this.scroller.style.height = parseInt( this.scroller.style.height ) + window.innerHeight + 'px'
            var scrolled = window.scrollY
            this.positionUniforms[ "time" ].value = scrolled / 5000
            this.planes.material.uniforms.time.value = scrolled / 5000
        })

        this.onResize()
        this.step()
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
        requestAnimationFrame( () => this.step() )

        this.gpuCompute.compute()

        this.planes.material.uniforms.posTex.value = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture
        this.planes.material.uniforms.velTex.value = this.gpuCompute.getCurrentRenderTarget( this.velocityVariable ).texture

        this.positionUniforms[ 'rand' ] = { value: new Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ) }
        
        this.planes.step( time )
        
        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()