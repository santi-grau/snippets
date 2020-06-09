import { Scene, WebGLRenderer, OrthographicCamera, Vector2 } from 'three'
import { Engine, World, Bodies, Body } from 'matter-js'
import Star from './Star'

class Timeline{
    constructor(){
        this.title = 'U?SA'

        this.container = document.getElementById( 'main' )
        this.container.style.position = 'fixed'

        this.camera = new OrthographicCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true } )
        this.container.appendChild( this.renderer.domElement )

        for( var i = 0 ; i < 9 ; i++ ){
            if( i % 2 == 0 ) for( var j = 0 ; j < 6 ; j++ ) this.scene.add( new Star( 50 * ( j - 2.5 ), 20 * ( i - 4.5 ) ) )
            else for( var j = 0 ; j < 5 ; j++ ) this.scene.add( new Star( 50 * ( j - 2.5 ) + 25, 20 * ( i - 4.5 ) ) )
        }

        this.matterEngine = Engine, this.World = World, this.Bodies = Bodies

        this.engine = this.matterEngine.create()
        this.engine.world.gravity.y = 0;
        
        this.scene.children.forEach( s => {
            s.position.y -= 60
            var body = this.Bodies.polygon( s.position.x, -s.position.y, 5, 10, 10, { friction: 0, frictionStatic : 0, restitution: 0.5, density: 0.1, mass : 1 } )
            this.World.add( this.engine.world, [ body ] )
            s.userData.body = body
            s.userData.angle = new Vector2( Math.random( ) - 0.5, Math.random( ) - 0.5 ).normalize()
        })

        this.wallb = this.Bodies.rectangle( 0, 0, 1, 1, { isStatic: true } )
        this.wallt = this.Bodies.rectangle( 0, 0, 1, 1, { isStatic: true } )
        this.walll = this.Bodies.rectangle( 0, 0, 1, 1, { isStatic: true } )
        this.wallr = this.Bodies.rectangle( 0, 0, 1, 1, { isStatic: true } )
        this.World.add( this.engine.world, [ this.wallb, this.wallt, this.wallr, this.walll ] )

        this.matterEngine.run( this.engine )
    }

    onMove( x, y ){
        var inc = -y / 4000 * 2
        
        this.scene.children.forEach( s => Body.setVelocity( s.userData.body, { x : s.userData.angle.x * inc, y : s.userData.angle.y * inc } ) )
    }

    onResize( width, height ) {
        
        height += 115
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 100
        this.camera.updateProjectionMatrix()

        Body.setPosition( this.wallb, { x : 0, y : height / 2 + 30 } )
        Body.scale( this.wallb, width + 120, 60 )

        Body.setPosition( this.wallt, { x : 0, y : -height / 2 - 30 } )
        Body.scale( this.wallt, width + 120, 60 )

        Body.setPosition( this.walll, { x : -width / 2 - 30, y : 0 } )
        Body.scale( this.walll, 60, height + 120 )

        Body.setPosition( this.wallr, { x : width / 2 + 30, y : 0 } )
        Body.scale( this.wallr, 60, height + 120 )
    }
  
    step( time ){
        this.scene.children.forEach( s => {
            s.position.x = s.userData.body.position.x
            s.position.y = s.userData.body.position.y
            s.rotation.z = s.userData.body.angle
        })

        this.renderer.render( this.scene, this.camera )
    }
}

var scroller = new Timeline()

var timeline = 0

document.addEventListener( 'scroll', ( e ) => {
    timeline = document.body.getBoundingClientRect().top
    scroller.onMove( 0, timeline )
})

var step = function( time ){
    requestAnimationFrame( step )
    scroller.step( time )
}

var onResize = function(){
    let [ width, height ] = [ window.innerWidth, window.innerHeight ]
    scroller.onResize( width, height )
}


window.addEventListener( 'resize', ( ) => onResize( ) )
step( 0 )
onResize()