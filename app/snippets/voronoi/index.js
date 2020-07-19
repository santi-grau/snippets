import { Scene, WebGLRenderer, OrthographicCamera, Raycaster, Vector2, BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, DoubleSide } from 'three'
import Voronoi from 'voronoi-diagram'

class Snippet{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        var ps = []
        for( var i = 0 ; i < 100 ; i++ ){
            ps.push( [ Math.random() * 2, Math.random() * 2, Math.random() * 2 ] )
        }

        var voronoi = Voronoi( ps )
        console.log( voronoi )

        var vs = []

        for( var i = 0 ; i < voronoi.cells[ 0 ].length ; i++ ){
            
            if( voronoi.cells[ 0 ][ i ] > -1 ){
                console.log( voronoi.cells[ 0 ][ i ] ) 
                vs.push( 
                    voronoi.positions[ voronoi.cells[ 0 ][ i ] ][ 0 ],
                    voronoi.positions[ voronoi.cells[ 0 ][ i ] ][ 2 ],
                    voronoi.positions[ voronoi.cells[ 0 ][ i ] ][ 1 ]
                )
            }
        }
        var geometry = new BufferGeometry()
        geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) );
        var material = new MeshBasicMaterial( { color: 0xff0000, wireframe : true, side : DoubleSide } );
        var mesh = new Mesh( geometry, material );
        mesh.scale.set( 100, 100, 100 )
        this.scene.add( mesh )
        

        this.onResize()
        this.step( 0 )
    }

    mouseUp( e ){
        this.positionUniforms[ 'touching' ] = { value: false }
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 100
        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()