import waterVertexShader from './water.vert'
import waterFragmentShader from './water.frag'
import heightmapFragmentShader from './heightmap.frag'
import readWaterLevelFragmentShader from './readWaterLevel.frag'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { Mesh, PlaneBufferGeometry, ShaderMaterial, UniformsUtils, ShaderLib, Vector2 } from 'three';

class WaterMesh extends Mesh{
    constructor( WIDTH, BOUNDS, renderer ){
        super()

        this.renderer = renderer

        this.mouseSize = 50
        this.viscosity = 0.99

        this.geometry = new PlaneBufferGeometry( BOUNDS, BOUNDS, WIDTH - 1, WIDTH - 1 );

        this.material = new ShaderMaterial( {
            uniforms: UniformsUtils.merge( [ ShaderLib[ 'basic' ].uniforms, { 
                'heightmap': { value: null } ,
                'debug': { value: null } 
            } ] ),
            wireframe : false,
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader
        } )


        this.rotation.x = - Math.PI / 2;
        this.matrixAutoUpdate = false;
        this.updateMatrix();
        
        this.material.defines.WIDTH = WIDTH.toFixed( 1 )
        this.material.defines.BOUNDS = BOUNDS.toFixed( 1 )
        
        this.gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, this.renderer )

        var heightmap0 = this.gpuCompute.createTexture()
        this.heightmapVariable = this.gpuCompute.addVariable( 'heightmap', heightmapFragmentShader, heightmap0 )

        this.gpuCompute.setVariableDependencies( this.heightmapVariable, [ this.heightmapVariable ] )

        this.heightmapVariable.material.uniforms[ 'mousePos' ] = { value: new Vector2( 10000, 10000 ) }
        this.heightmapVariable.material.uniforms[ 'mouseSize' ] = { value: this.mouseSize }
        this.heightmapVariable.material.uniforms[ 'viscosityConstant' ] = { value: this.viscosity }
        this.heightmapVariable.material.defines.BOUNDS = BOUNDS.toFixed( 1 )

        this.gpuCompute.init()

    

        this.readWaterLevelShader = this.gpuCompute.createShaderMaterial( readWaterLevelFragmentShader, {
            point1: { value: new Vector2() },
            levelTexture: { value: null }
        } )
        
    }

    setPoint( point ){
        this.heightmapVariable.material.uniforms[ "mousePos" ].value.set( point.x, -point.z )
    }

    step( time ){
        this.gpuCompute.compute()
        this.material.uniforms[ "heightmap" ].value = this.gpuCompute.getCurrentRenderTarget( this.heightmapVariable ).texture
    }
}

export { WaterMesh as default }