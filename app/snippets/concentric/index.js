import { Scene, WebGLRenderer, OrthographicCamera, Vector2, Mesh, PointLight, CircleBufferGeometry, MirroredRepeatWrapping, NearestFilter, TextureLoader, SphereBufferGeometry, Object3D, MeshLambertMaterial, PerspectiveCamera, BufferGeometry, BufferAttribute, ShaderMaterial, RingBufferGeometry, MeshBasicMaterial, DoubleSide, Vector3, MeshNormalMaterial, RepeatWrapping, MeshToonMaterial, LineBasicMaterial, LineSegments } from 'three'
import Shader from './out.*'

class Main{
    constructor(){
        
        this.timeInc = 0
        this.node = document.getElementById( 'main' )

        // this.camera = new OrthographicCamera( )
        this.camera = new PerspectiveCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        var vs = [], indices = []

        var res = 1024
        var segments = 64

        for( var i = 0 ; i < res ; i++ ){
            for( var j = 0 ; j < segments ; j++ ){
                vs.push( Math.cos( i / res * Math.PI * 2 ), Math.sin( i / res * Math.PI * 2 ), -j / segments )
                if( j > 0 ) indices.push( i * segments + j, i * segments + j - 1 )
            }
        }

        this.geometry = new BufferGeometry();
        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) )
        // this.geometry.addAttribute( 'uv', new BufferAttribute( new Float32Array( uvs ), 2 ) )
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( indices ), 1 ) )

        // var material = new LineBasicMaterial( { color : 0xff0000 } )
        var material = new ShaderMaterial( {
            uniforms : {
                time : { value : 0 }
            },
            vertexShader : Shader.vert, 
            fragmentShader : Shader.frag,
            transparent : true

        } )

        this.geo = new LineSegments( this.geometry, material )
        this.scene.add( this.geo )

        this.onResize()
        this.step( 0 )

    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )

        var camView = { fov : 55, aspect : width / height, near : 0.0001, far : 100 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 1

        // var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        // for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        // this.camera.position.z = 100

        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.geo.material.uniforms.time.value += 0.01
        this.geo.rotation.z += 0.001
        this.renderer.render( this.scene, this.camera )
    }
}

new Main()