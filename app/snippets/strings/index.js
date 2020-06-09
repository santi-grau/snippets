import { Scene, WebGLRenderer,Object3D, Vector3, PerspectiveCamera } from 'three'

import Positions from './Positions'
import SimplexNoise from 'simplex-noise'
import Geo from './Plane'

class Drums extends Object3D{
    constructor( positions ){
        super()
        this.positions = positions
        this.simplex = new SimplexNoise( Math.random )

        this.streams = []
        for( var i = 0 ; i < 2 ; i++ ){
            var stream = positions.newDataStream( true, 256 )
            this.streams.push( stream )
            var geometryOptions = { radius : 0.2 }
            this.add( new Geo( positions, 128, stream.id, [ 'PlaneStripeMaterial', 'PlaneSquareMaterial' ], geometryOptions ) )
        }

        this.drumPlayhead = 0
       
    }

    simulatePosition( time, seed ){
        var x = this.simplex.noise3D( 1.3, 100 * seed, time * 0.01 ) * 2
        var y = this.simplex.noise3D( 34 * seed, time * 0.01, 1.2 ) * 2 
        var z = this.simplex.noise3D( time * 0.01, 1 * seed, 1 ) * 2
        return new Vector3( x, y, z )
    }

    step( time ){
        this.drumPlayhead += 0.1
        this.streams.forEach( ( s, i ) => {
            this.positions.addPoint( s, this.simulatePosition( this.drumPlayhead, i ), 1 )
        } )

        this.children.forEach( s => s.step( time ) )
    }
}

class Tunnel{
    constructor(){
        this.timeInc = 0
        this.node = document.getElementById( 'main' )
        

        this.scene = new Scene()
        
        this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 )
        this.camera.lookAt( new Vector3( ) )
        this.camera.position.z = 2
        this.scene.add( this.camera )

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        this.positions = new Positions()
        
        this.drums = new Drums( this.positions )
        this.scene.add( this.drums )
        this.mouseIsDown = false
        
      
        this.onResize()
        this.step()
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio * 2 )
        // var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        // for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        // this.camera.position.z = 100
        // this.camera.updateProjectionMatrix()
    }

    simulatePosition( time, seed ){
        var x = this.simplex.noise3D( 1.3, 100 * seed, time * 0.01 ) * 2
        var y = this.simplex.noise3D( 34 * seed, time * 0.01, 1.2 ) * 2 
        var z = this.simplex.noise3D( time * 0.01, 1 * seed, 1 ) * 2
        return new Vector3( x, y, z )
    }
  
    step( time ){
        requestAnimationFrame( () => this.step() )
        this.drums.step( time )
        this.renderer.render( this.scene, this.camera )
    }
}

new Tunnel()