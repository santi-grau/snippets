import { Scene, WebGLRenderer, OrthographicCamera, Vector2, PlaneBufferGeometry, Mesh, MeshBasicMaterial, ShaderMaterial } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import leakShader from './leak.frag'
import scratchShader from './scratch.frag'
import mixShader from './mix.*'

class Snippet{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : false, alpha : true } )
        this.node.appendChild( this.renderer.domElement )
        this.frame = 0
        
        this.computeSize = new Vector2( this.node.offsetWidth, this.node.offsetHeight )
        this.gpuCompute = new GPUComputationRenderer( this.computeSize.x, this.computeSize.y, this.renderer )
        
        // leaks
        this.dtLeaks = this.gpuCompute.createTexture()
        var leakTexture = []
        for( var i = 0 ; i < this.computeSize.x * this.computeSize.y ; i++ ) leakTexture.push( 0,0,0,1 )
        this.dtLeaks.image.data = new Float32Array( leakTexture )

        this.leaksVariable = this.gpuCompute.addVariable( 'textureLeaks', leakShader, this.dtLeaks )
        this.leakUniforms = this.leaksVariable.material.uniforms
        this.leakUniforms[ 'time' ] = { value: 0.0 }
        this.leakUniforms[ 'seed' ] = { value: Math.random() }
        this.leakUniforms[ 'size' ] = { value: new Vector2( this.computeSize.x, this.computeSize.y ) }

        // scratches
        this.dtScratch = this.gpuCompute.createTexture()
        var scratchesTexture = []
        for( var i = 0 ; i < this.computeSize.x * this.computeSize.y ; i++ ) scratchesTexture.push( 0,0,0,1 )
        this.dtScratch.image.data = new Float32Array( scratchesTexture )
        
        this.scratchVariable = this.gpuCompute.addVariable( 'textureScratches', scratchShader, this.dtScratch )
        this.scratchUniforms = this.scratchVariable.material.uniforms
        this.scratchUniforms[ 'time' ] = { value: 0.0 }
        this.scratchUniforms[ 'seed' ] = { value: Math.random() }
        this.scratchUniforms[ 'size' ] = { value: new Vector2( this.computeSize.x, this.computeSize.y ) }

        this.gpuCompute.setVariableDependencies( this.leaksVariable, [ this.leaksVariable ] )
        this.gpuCompute.setVariableDependencies( this.scratchVariable, [ this.scratchVariable ] )
        
        this.gpuCompute.init()
        
        var geo = new PlaneBufferGeometry( this.computeSize.x, this.computeSize.y )

        var mat = new ShaderMaterial( {
            uniforms : {
                texLeak : { value : this.dtLeaks },
                texScratch : { value : this.dtScratch }                                                                                                                                                              
            },
            vertexShader : mixShader.vert,
            fragmentShader : mixShader.frag
        } )
        this.plane = new Mesh( geo, mat )
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

        this.leakUniforms[ 'time' ].value += 0.01
        this.leakUniforms[ 'seed' ] = { value: Math.random() }

        this.scratchUniforms[ 'time' ].value += 0.01
        this.scratchUniforms[ 'seed' ] = { value: Math.random() }

        if( this.frame % 1 == 0 ){
            this.gpuCompute.compute()
            this.plane.material.uniforms.texLeak.value = this.gpuCompute.getCurrentRenderTarget( this.leaksVariable ).texture
            this.plane.material.uniforms.texScratch.value = this.gpuCompute.getCurrentRenderTarget( this.scratchVariable ).texture
        }

        this.frame++

        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()