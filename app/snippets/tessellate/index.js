import { Scene, WebGLRenderer, OrthographicCamera, Mesh, BufferGeometry, Vector3, LineSegments, BufferAttribute, PerspectiveCamera, ShaderMaterial, Points, SphereBufferGeometry, DoubleSide, BoxBufferGeometry, TorusBufferGeometry, MeshBasicMaterial, PointsMaterial, WireframeGeometry } from 'three'
import Delaunator from 'delaunator'
import Simplex from 'simplex-noise'

class Snippet{
    constructor(){
        
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true } )
        this.node.appendChild( this.renderer.domElement )
        this.simplex = new Simplex( Math.random )
        this.dots = []
        
        
        var size = 400
        var edgeRes = 20
        for( var h = 0 ; h < edgeRes ; h++ ){
            this.dots.push( [ -size / 2 + h / edgeRes * size, size / 2 ] )
            this.dots.push( [ size / 2, size / 2 - h / edgeRes * size ] )
            this.dots.push( [ size / 2 - h / edgeRes * size, -size / 2 ] )
            this.dots.push( [ -size / 2, -size / 2 + h / edgeRes * size ] )
        }

        
        for( var h = 0 ; h < 500 ; h++ ){
            this.dots.push( [ Math.random( ) * size - size / 2, Math.random( ) * size - size / 2 ] )
        }
        
        const delaunay = Delaunator.from( this.dots )
        
        var vs = [], index = []
        var scale = 0.005
        for( var i = 0 ; i < delaunay.coords.length ; i+= 2 ){
            var n = ( this.simplex.noise2D( delaunay.coords[ i ] * scale, delaunay.coords[ i + 1 ] * scale ) + 1 ) * 0.5
            vs.push( delaunay.coords[ i ], delaunay.coords[ i + 1 ], n * 80 )
        }

        for( var i = 0 ; i < delaunay.triangles.length ; i+= 3 ){
            index.push( delaunay.triangles[ i ], delaunay.triangles[ i + 2 ], delaunay.triangles[ i + 1 ] )
        }

        var geometry = new BufferGeometry()
        geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) )
        geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )
        
        // var material = new PointsMaterial()
        // var pointMesh = new Points( geometry, material )
        // this.scene.add( pointMesh )
        // pointMesh.position.z = 1
        // pointMesh.rotation.x = Math.PI / 2
        
        var mat = new MeshBasicMaterial( { color : 0xffffff, wireframe : true } )
        var mesh = new Mesh( geometry, mat )
        this.scene.add( mesh )
        mesh.rotation.x = -Math.PI / 2

        var mat = new MeshBasicMaterial( { color : 0x000000, wireframe : false } )
        var mesh2 = new Mesh( geometry, mat )
        this.scene.add( mesh2 )
        mesh2.rotation.x = -Math.PI / 2

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
        this.camera.position.x = -150
        this.camera.position.y = 150
        
        this.camera.lookAt( new Vector3( ) )

        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()