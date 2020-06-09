import Scroller from './../../Scroller'
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import positionShader from './position.frag'
import velocityShader from './velocity.frag'
import WaterMesh from './WaterMesh'
import Planes from './Planes'

class Water extends Scroller{
    constructor(){
        super()
        this.title = 'Washed away'

        this.WIDTH = 128
        this.BOUNDS = 512
        this.BOUNDS_HALF = this.BOUNDS * 0.5

        this.mouseMoved = false
        this.mouseCoords = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()

        var NUM_SPHERES = 1

        this.container = document.createElement( 'div' )
        this.container.style.position = 'fixed'
        document.body.appendChild( this.container )

        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 )
        this.camera.position.set( 0, 600, 0 )
        this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) )

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( { antialias : true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );

        
        // THREE.Mesh just for mouse raycasting
        var geometryRay = new THREE.PlaneBufferGeometry( this.BOUNDS, this.BOUNDS, 1, 1 );
        this.meshRay = new THREE.Mesh( geometryRay, new THREE.MeshBasicMaterial( { color: 0xFFFFFF, visible: false } ) );
        this.meshRay.rotation.x = - Math.PI / 2;
        this.meshRay.matrixAutoUpdate = false;
        this.meshRay.updateMatrix();
        this.scene.add( this.meshRay );

        document.addEventListener( 'mousemove', ( e ) => this.onDocumentMouseMove( e ) )
        document.addEventListener( 'touchstart', ( e ) => this.onDocumentTouchStart( e ) )
        document.addEventListener( 'touchmove', ( e ) => this.onDocumentTouchMove( e ) )
        window.addEventListener( 'resize', ( e ) => this.onWindowResize( e ) )
        
        this.waterMesh = new WaterMesh( this.WIDTH, this.BOUNDS, this.renderer )
        this.sphereGroup = new THREE.Object3D()
        this.scene.add( this.waterMesh, this.sphereGroup )

        

        var particles = 16
        this.gpuCompute = new GPUComputationRenderer( particles, particles, this.renderer )
        this.dtPosition = this.gpuCompute.createTexture()
        this.dtVelocity = this.gpuCompute.createTexture()
        var pData = []
        var vData = []
        for( var i = 0 ; i < particles * particles ; i++ ) {
            pData.push( Math.random(), Math.random(), 0, 0 )
            vData.push( 0, 0, 0, 0 )
        }
        this.dtPosition.image.data = new Float32Array( pData )
        this.dtVelocity.image.data = new Float32Array( vData )
        
        this.positionVariable = this.gpuCompute.addVariable( 'texturePosition', positionShader, this.dtPosition )
        this.positionUniforms = this.positionVariable.material.uniforms
        
        this.planes = new Planes( particles )
        this.planes.material.uniforms.posTex.value = this.dtPosition
        this.scene.add( this.planes )

        this.velocityVariable = this.gpuCompute.addVariable( 'textureVelocity', velocityShader, this.dtvelocity )
        this.velocityUniforms = this.velocityVariable.material.uniforms
        
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable, this.velocityVariable ] )
        this.gpuCompute.setVariableDependencies( this.velocityVariable, [ this.positionVariable, this.velocityVariable ] )
        
        this.gpuCompute.init()
    }

    onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    setMouseCoords( x, y ) {
        this.mouseCoords.set( ( x / this.renderer.domElement.clientWidth ) * 2 - 1, - ( y / this.renderer.domElement.clientHeight ) * 2 + 1 );
        this.mouseMoved = true;
    }

    onDocumentMouseMove( event ) {
        this.setMouseCoords( event.clientX, event.clientY );
    }

    onDocumentTouchStart( event ) {
        if ( event.touches.length === 1 ) {
            event.preventDefault();
            this.setMouseCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        }
    }

    onDocumentTouchMove( event ) {
        if ( event.touches.length === 1 ) {
            event.preventDefault();
            this.setMouseCoords( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
        }
    }

    step( time ){
        this.waterMesh.setPoint( new THREE.Vector3( 10000, 10000 ) )
        if ( this.mouseMoved ) {
            this.raycaster.setFromCamera( this.mouseCoords, this.camera )
            var intersects = this.raycaster.intersectObject( this.meshRay )
            if ( intersects.length > 0 ) this.waterMesh.setPoint( intersects[ 0 ].point )
            this.mouseMoved = false
        }
        
        this.planes.material.uniforms.posTex.value = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture;
        this.waterMesh.material.uniforms.debug.value = this.waterMesh.gpuCompute.getCurrentRenderTarget( this.waterMesh.heightmapVariable ).texture
        
        this.waterMesh.step( time )
        
        this.positionUniforms[ 'levelTexture' ] = { value: this.waterMesh.gpuCompute.getCurrentRenderTarget( this.waterMesh.heightmapVariable ).texture };
        this.velocityUniforms[ 'levelTexture' ] = { value: this.waterMesh.gpuCompute.getCurrentRenderTarget( this.waterMesh.heightmapVariable ).texture };

        this.gpuCompute.compute()

        this.renderer.render( this.scene, this.camera )
    }
}

export { Water as default }