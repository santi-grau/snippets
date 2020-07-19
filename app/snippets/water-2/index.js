import { Vector2, Raycaster, PerspectiveCamera, Scene, WebGLRenderer,BufferGeometry, LineBasicMaterial, LineSegments, BufferAttribute, PlaneBufferGeometry, Mesh, MeshBasicMaterial, Vector3, BoxBufferGeometry, ShaderMaterial, OrthographicCamera } from 'three'
import WaterMesh from './WaterMesh'
import geoShader from './geo.*'

class Geo extends LineSegments{
    constructor( size ){
        super()

        this.size = size
        this.res = 128
        this.depth = 200
        
        var vs = [], uvs = [], indices = []

        for( var i = 0 ; i < this.res ; i++ ){
            for( var j = 0 ; j < this.res ; j++ ){
                vs.push( i / ( this.res - 1 ) * this.size - this.size / 2, 0, j / ( this.res - 1 ) * this.size - this.size / 2 )
                uvs.push( i / ( this.res - 1 ), j / ( this.res - 1 ) )
                if( i > 0 ) indices.push( j * this.res + i - 1, j * this.res + i )
                if( j < this.res - 1) indices.push( j * this.res + i, j * this.res + i + this.res )
            }
        }

        for( var i = 0 ; i < this.res; i++ ) {
            vs.push(  i / ( this.res-1 ) * this.size - this.size / 2, -this.depth, this.size - this.size / 2 )
            uvs.push( 0, 0 )
            indices.push( ( this.res - 1 ) + this.res * i, this.res * this.res + i )
        }

        for( var i = 0 ; i < this.res; i++ ) {
            vs.push(  this.size - this.size / 2, -this.depth, i / ( this.res-1 ) * this.size - this.size / 2 )
            uvs.push( 0, 0 )
            if( i < this.res - 1 ) indices.push( this.res * ( this.res - 1 ) + i, this.res * this.res + this.res + i )
        }
        
        

        this.geometry = new BufferGeometry();
        this.geometry.addAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) )
        this.geometry.addAttribute( 'uv', new BufferAttribute( new Float32Array( uvs ), 2 ) )
        this.geometry.setIndex( new BufferAttribute( new Uint16Array( indices ), 1 ) )


        this.material = new ShaderMaterial({
            uniforms : {
                tex : { value : null }
            },
            depthTest : false,
            depthWrite : false,
            vertexShader : geoShader.vert,
            fragmentShader : geoShader.frag,
            transparent : true
        })
    }
}

class Water {
    constructor(){

        this.WIDTH = 128
        this.BOUNDS = 256

        this.mouseMoved = false
        this.mouseCoords = new Vector2()
        this.raycaster = new Raycaster()

        this.container = document.getElementById( 'main' )
        
        this.camera = new OrthographicCamera( )
        this.camera.position.set( 600, 500, 600 )
        

        var camView = { left :  this.container.offsetWidth / -2, right : this.container.offsetWidth / 2, top : this.container.offsetHeight / 2, bottom : this.container.offsetHeight / -2, near : 0.01, far : 10000 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.x = 200
        this.camera.position.z = 200
        this.camera.position.y = 200
        this.camera.lookAt( new Vector3( 0, 0, 0 ) )

        this.scene = new Scene();

        this.renderer = new WebGLRenderer( { antialias : true, transparent : true } )
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        this.container.appendChild( this.renderer.domElement )

        var geometryRay = new PlaneBufferGeometry( this.BOUNDS, this.BOUNDS )
        this.meshRay = new Mesh( geometryRay, new MeshBasicMaterial( { color: 0xFFFFFF, visible: false } ) );
        this.meshRay.rotation.x = - Math.PI / 2
        this.meshRay.matrixAutoUpdate = false
        this.meshRay.updateMatrix()
        this.scene.add( this.meshRay )

        document.addEventListener( 'mousemove', ( e ) => this.onDocumentMouseMove( e ) )
        document.addEventListener( 'touchstart', ( e ) => this.onDocumentTouchStart( e ) )
        document.addEventListener( 'touchmove', ( e ) => this.onDocumentTouchMove( e ) )
        window.addEventListener( 'resize', ( e ) => this.onWindowResize( e ) )
        
        this.waterMesh = new WaterMesh( this.WIDTH, this.BOUNDS, this.renderer )
        this.scene.add( this.waterMesh )

        // this.scene.add( new Mesh( new BoxBufferGeometry( 512, 32, 512, 100, 100 ), new MeshBasicMaterial( { wireframe : true, color : 0xffffff } ) ))

        this.geo = new Geo( this.BOUNDS )
        this.geo.position.y += 50
        this.scene.add( this.geo )

        this.onWindowResize()
        this.step()
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
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
        requestAnimationFrame( () => this.step() )
        this.waterMesh.setPoint( new Vector3( 10000, 10000 ) )
        if ( this.mouseMoved ) {
            this.raycaster.setFromCamera( this.mouseCoords, this.camera )
            var intersects = this.raycaster.intersectObject( this.meshRay )
            if ( intersects.length > 0 ) this.waterMesh.setPoint( intersects[ 0 ].point )
            this.mouseMoved = false
        }
        
        // this.waterMesh.material.uniforms.debug.value = this.waterMesh.gpuCompute.getCurrentRenderTarget( this.waterMesh.heightmapVariable ).texture

        this.geo.material.uniforms.tex.value = this.waterMesh.gpuCompute.getCurrentRenderTarget( this.waterMesh.heightmapVariable ).texture

        this.waterMesh.step( time )

        this.renderer.render( this.scene, this.camera )
    }
}

new Water()