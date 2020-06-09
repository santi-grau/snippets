import { Scene, WebGLRenderer, OrthographicCamera, Vector2, PlaneBufferGeometry,TextureLoader, MeshBasicMaterial, Mesh, CircleBufferGeometry, Object3D, DoubleSide } from 'three'
import { Engine, World, Bodies, Body, Constraint } from 'matter-js'
import you from './you.png'
import me from './me.png'

class Timeline{
    constructor(){
        
        this.node = document.getElementById( 'main' )
        this.node.style.position = 'fixed'

        this.camera = new OrthographicCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        this.matterEngine = Engine, this.World = World, this.Bodies = Bodies

        this.engine = this.matterEngine.create()

        this.root = new Object3D()
        this.scene.add( this.root )
        this.onResize()
        // this.World.add( this.engine.world, [ elastic ] )
        this.engine.world.gravity.y = 0;
        this.youGroup = new Object3D()
        
        this.root.add( this.youGroup )
    
        var density = 0.85
        var radius = 10
        
        console.log(  )
        var vAmmount = Math.ceil( this.node.offsetHeight / 20 * density )
        if( vAmmount % 2 == 0 ) vAmmount--
        console.log( vAmmount )

        var tLoader = new TextureLoader()
        var yt = tLoader.load( you )
        var mt = tLoader.load( me )


        for( var i = 0 ; i < vAmmount ; i++ ){
            
            var interval = ( ( this.node.offsetHeight - radius * 2 ) / ( vAmmount - 1 ) )
            var hfit = Math.round( this.node.offsetWidth / interval )
            var hdist = ( this.node.offsetWidth + radius * 2 ) / ( hfit - 1 )
            if( i % 2 == 0 ) for( var j = 0 ; j < hfit ; j++ ) {
                var m = new Mesh( new CircleBufferGeometry( 10 ), new MeshBasicMaterial( { color : 0x000000, map : yt, side : DoubleSide,  transparent : true } ) )
                m.rotation.z = Math.PI
                m.scale.x = -1
                this.youGroup.add( m )
                var px = radius + j * hdist - 3
                var py = radius + interval * i
                m.position.set( px, py, 0 )
                
            }
            else for( var j = 0 ; j < hfit - 2 ; j++ ) {
                var m = new Mesh( new CircleBufferGeometry( 10 ), new MeshBasicMaterial( { color : 0x000000, map : yt, side : DoubleSide,  transparent : true } ) )
                m.rotation.z = Math.PI
                m.scale.x = -1
                this.youGroup.add( m )

                var px = hdist / 2 + radius + j * hdist - 3
                var py = radius + interval * i
                m.position.set( px, py, 0 )
            }
        }

        this.colliderBody = this.Bodies.circle( 10000, 10000, 60, { isStatic : true } )
       
        this.World.add( this.engine.world, [ this.colliderBody ] )

        this.collider = new Mesh( new CircleBufferGeometry( 20, 64 ), new MeshBasicMaterial( { map : mt, side : DoubleSide } ) )
        this.collider.rotation.z = Math.PI
        this.collider.scale.x = -1

        this.collider.userData.body = this.colliderBody
        this.scene.add( this.collider )

        this.youGroup.children.forEach( s => {
                this.Bodies.circle( 100, 100, 10, { friction: 0, frictionStatic : 0, restitution: 0.5, density: 0.1, mass : 1 } )
                var body = this.Bodies.circle( s.position.x, s.position.y, 10, { friction: 0, frictionStatic : 0, restitution: 0.5, density: 0.1, mass : 1 } )
                this.World.add( this.engine.world, [ body ] )
                s.userData.body = body
                var elastic = Constraint.create({ 
                    pointA: { x : s.position.x, y : s.position.y }, 
                    bodyB: body, 
                    stiffness: 0.001
                })
                this.World.add( this.engine.world, [ elastic ] )
        })
        
        window.addEventListener( 'mousemove', ( e ) => this.onMouseMove( e ) )
        // window.addEventListener( 'mousedown', ( e ) => this.onMouseDown( e ) )
        window.addEventListener( 'touchstart', ( e ) => this.onMouseDown( e ) )
        // window.addEventListener( 'touchend', ( e ) => this.onTouchEnd( e ) )
        window.addEventListener( 'touchmove', ( e ) => this.onMouseMove( e ) )
        this.mouseIsMoving = false
        this.matterEngine.run( this.engine )
    }

    onMove( x, y ){
        var inc = -y / 4000 * 2
        // this.scene.children.forEach( s => Body.setVelocity( s.userData.body, { x : s.userData.angle.x * inc, y : s.userData.angle.y * inc } ) )
    }

    onMouseMove( e ){
        this.mouseIsMoving = true
        Body.setPosition( this.colliderBody, { x : e.pageX, y : e.pageY } )
        if( this.mouseTimeout ) clearTimeout( this.mouseTimeout )
        this.mouseTimeout = setTimeout( () => this.onMoveEnd(), 2000 )
        
    }

    onMoveEnd(){
        console.log('end')
        Body.setPosition( this.colliderBody, { x : 10000, y : 10000 } )
    }

    onMouseDown( e ){
        // document.body.classList.toggle( 'inv' )
        Body.setPosition( this.colliderBody, { x : e.pageX, y : e.pageY } )
        if( this.mouseTimeout ) clearTimeout( this.mouseTimeout )
        this.mouseTimeout = setTimeout( () => this.onMoveEnd(), 1000 )
    }

    onResize( width, height ) {
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        var camView = { left : 0, right : width, top : 0, bottom : height }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 100
        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        this.youGroup.children.forEach( s => {
            s.position.x = s.userData.body.position.x
            s.position.y = s.userData.body.position.y
        })
        this.collider.position.x = this.collider.userData.body.position.x 
        this.collider.position.y = this.collider.userData.body.position.y
        var scale = 1 + Math.cos( Math.PI * 2 * time * 0.0008 ) * 0.1
        this.collider.scale.x = -scale
        this.collider.scale.y = scale
        
        this.renderer.render( this.scene, this.camera )
    }
}

var scroller = new Timeline()

var timeline = 0

document.addEventListener( 'scroll', ( e ) => {
    // timeline = document.body.getBoundingClientRect().top
    // scroller.onMove( 0, timeline )
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