import { Scene, WebGLRenderer, OrthographicCamera, PerspectiveCamera, TextureLoader, Vector2, Vector4, Mesh, PlaneBufferGeometry, MeshBasicMaterial, Vector3 } from 'three'
import Planes from './Planes'
import shaders from './shaders/*.*'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js'

class Snippet{
    constructor(){
        this.title = 'Snippet'
       
        this.node = document.getElementById( 'main' )
        

        this.camera = new PerspectiveCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        this.tSize = 128
        
        this.planes = new Planes( this.tSize )
        this.scene.add( this.planes )
        
        this.gpuCompute = new GPUComputationRenderer( this.tSize, this.tSize, this.renderer )
        this.dtPosition = this.gpuCompute.createTexture()
        this.dtVelocity = this.gpuCompute.createTexture()

        var vs = []
        for ( var i = 0; i < this.tSize * this.tSize; i++ ) vs.push( ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10, Math.random() )

        var ps = []
        for ( var i = 0; i < this.tSize * this.tSize; i++ ) ps.push(  0, 0, 0, 0 )
        
        this.dtPosition.image.data = new Float32Array( ps )
        this.dtVelocity.image.data = new Float32Array( vs )

        this.velocityVariable = this.gpuCompute.addVariable( 'textureVelocity', shaders.velocity.frag, this.dtVelocity )
        this.positionVariable = this.gpuCompute.addVariable( 'texturePosition', shaders.position.frag, this.dtPosition )
        
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable, this.velocityVariable ] )
        this.gpuCompute.setVariableDependencies( this.velocityVariable, [ this.positionVariable, this.velocityVariable ] )
        
        this.positionUniforms = this.positionVariable.material.uniforms
        this.velocityUniforms = this.velocityVariable.material.uniforms

        this.positionUniforms[ 'time' ] = { value: 0.0 }
    
        this.gpuCompute.init()

        this.onResize()

        this.composer = new EffectComposer( this.renderer );
        this.composer.addPass( new RenderPass( this.scene, this.camera ) );

        var afterimagePass = new AfterimagePass();

        this.composer.addPass( afterimagePass )
        afterimagePass.uniforms[ "damp" ].value = 1

        
        this.step()
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        var camView = { fov : 75, aspect : width / height, near : 0.01, far : 1000 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 600
        
        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )

        this.positionUniforms[ 'time' ].value = time
        this.planes.material.uniforms.time.value = time

        this.planes.material.uniforms.posTex.value = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture
        this.planes.material.uniforms.velTex.value = this.gpuCompute.getCurrentRenderTarget( this.velocityVariable ).texture
        
        this.gpuCompute.compute()

        this.planes.step( time )
        this.composer.render(); 
        // this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()