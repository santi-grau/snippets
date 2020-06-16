import { Scene, WebGLRenderer,Object3D, Vector3, PerspectiveCamera } from 'three'

import Positions from './Positions'
import SimplexNoise from 'simplex-noise'
import Geo from './Plane'


class Ambient extends Object3D{
    constructor( positions ){
        super()
        this.positions = positions
        this.simplex = new SimplexNoise( Math.random )

         
        var geometryOptions = { radius : 0.45  }
        var g = new Geo( this.positions, 128, this.positions.newDataStream( false, 128 ).id, [ 'PlaneStripeMaterial', 'PlaneRainbowMaterial' ], geometryOptions )
        this.add( g )

        var geometryOptions = { radius : 0.25  }
        var g = new Geo( this.positions, 1024, this.positions.newDataStream( false, 1024 ).id, [ 'PlaneSquareMaterial', 'PlaneRainbowMaterial' ], geometryOptions )
        this.add( g )

    }

    simulatePosition( time, seed ){
        var x = this.simplex.noise3D( 130 + seed , 100, time * 0.00025 ) * 2
        var y = this.simplex.noise3D( 140, time * 0.00025, 12 ) * 1.5
        var z = this.simplex.noise3D( time * 0.00025, 1, 10) * 2 
        return new Vector3( x, y, z )
    }

    step( time ){
        this.positions.streams.forEach( ( s, i ) =>{
            this.positions.addPoint( s, this.simulatePosition( time, i ) )
        })
        
    }
}

class Tunnel{
    constructor(){
        this.timeInc = 0
        this.node = document.getElementById( 'main' )

        this.scene = new Scene()
        
        this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 )
        this.camera.lookAt( new Vector3( ) )
        this.camera.position.z = 6
        this.camera.lookAt( new Vector3( 0,0,0 ) )
        this.scene.add( this.camera )

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )
        this.rotationInc = 0
        this.positions = new Positions( 2048, 1024 )
        
        document.body.style.height = window.innerHeight * 3 + 'px'

        this.scrolling = false
        document.addEventListener( 'scroll', ( e ) => {
            var scrolled = window.scrollY
            this.ambient.step( scrolled )
            if ( window.scrollY + window.innerHeight >= document.body.offsetHeight - window.innerHeight * 0.2 ) {
                document.body.style.height = parseInt( document.body.style.height ) + window.innerHeight + 'px'
            }
            this.scrolling = true
            if( this.scrollTimeout ) clearTimeout( this.scrollTimeout )
            this.scrollTimeout = setTimeout( () => this.scrolling = false, 500 )
            
        })

        this.ambient = new Ambient( this.positions )
        this.scene.add( this.ambient )
        this.mouseIsDown = false
        
        this.onResize()
        this.step( 0 )
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        height += 115
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.ambient.rotation.y += this.rotationInc
        if( this.scrolling ) this.rotationInc += ( 0.01 - this.rotationInc ) * 0.3
        else this.rotationInc -= this.rotationInc * 0.1
        this.renderer.render( this.scene, this.camera )
    }
}

new Tunnel()