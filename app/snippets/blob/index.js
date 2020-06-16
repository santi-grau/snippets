import { Scene, WebGLRenderer, OrthographicCamera, Vector2, Mesh, PointLight, CircleBufferGeometry, MirroredRepeatWrapping, NearestFilter, TextureLoader, SphereBufferGeometry, Object3D, MeshLambertMaterial, PerspectiveCamera, BufferGeometry, BufferAttribute, ShaderMaterial, RingBufferGeometry, MeshBasicMaterial, DoubleSide, Vector3, MeshNormalMaterial, RepeatWrapping, MeshToonMaterial } from 'three'
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import SimplexNoise from 'simplex-noise'
import texture from './download.jpg'
import texture2 from './resist.png'

class CubePoint extends Vector3 {
    constructor( id ){
        super( )
        this.id = id
        this.simplex = new Vector3( new SimplexNoise( Math.random ), new SimplexNoise( Math.random ), new SimplexNoise( Math.random ) )

        this.strength = this.tStrength = this.baseStrength = 1.2 + Math.random() * 2
        this.subtract = this.tSubtract = this.baseSubtract = 10 + Math.random() * 100
        this.restDist = 0.5
        this.touching = false
    }

    step( time ){
        
        if( !this.touching ){
            this.tx = this.simplex.x.noise2D( 1, time * 0.0001 ) * 0.5 
            this.ty = this.simplex.y.noise2D( time * 0.0001, 3 ) * 0.5
            this.tz = this.simplex.z.noise2D( 5, time * 0.0001 ) * 0.5
            this.speedMult = 0.15   
            this.tSubtract = this.baseSubtract
            this.tStrength = this.baseStrength
        } else {
            this.tx = this.simplex.x.noise2D( 1, time * 0.0001 ) * 0.95 
            this.ty = this.simplex.y.noise2D( time * 0.0001, 3 ) * 0.95
            this.tz = this.simplex.z.noise2D( 5, time * 0.0001 ) * 0.95
            // this.tx = Math.cos( Math.PI * 2 * this.id ) * this.restDist
            // this.ty = Math.sin( Math.PI * 2 * this.id ) * this.restDist
            // this.tz = 0
            this.speedMult = 0.15 
            this.tSubtract = 300
            this.tStrength = 0.5
        }

        this.subtract += ( this.tSubtract - this.subtract ) * this.speedMult
        this.strength += ( this.tStrength - this.strength ) * this.speedMult

        this.x += ( this.tx - this.x ) * this.speedMult
        this.y += ( this.ty - this.y ) * this.speedMult
        this.z += ( this.tz - this.z ) * this.speedMult
    }
}

class Blob{
    constructor(){
        
        this.timeInc = 0
        this.node = document.getElementById( 'main' )

        // this.camera = new OrthographicCamera( )
        this.camera = new PerspectiveCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        this.mouseIsDown = false
        document.body.addEventListener( 'mousedown', () => this.mouseIsDown = true )
        document.body.addEventListener( 'touchstart', () => this.mouseIsDown = true )
        document.body.addEventListener( 'touchend', () => this.mouseIsDown = false )
        document.body.addEventListener( 'mouseup', () => this.mouseIsDown = false )

        var light = new PointLight( 0xeeeeff, 1.2, 50, 1 );
        light.position.set( 1, 1, 1 );
        var light2 = new PointLight( 0xffffee, 0.25, 10, 1 );
        light2.position.set( -1, -1, 1 );
        this.scene.add( light, light2 );

        var loader = new TextureLoader()
        var map = loader.load( texture )
        var material = new MeshLambertMaterial( { map : map, wireframe : true } )
        // material.onBeforeCompile = shader => {
        //     console.log( shader.fragmentShader )
    
        //     var token = 'gl_FragColor = vec4( outgoingLight, diffuseColor.a );'
        //     var insert = 'gl_FragColor = vec4( outgoingLight , 1.0 );'
        //     shader.fragmentShader = shader.fragmentShader.replace( token, insert )
        // }
        
        map.repeat.set( 1, 1 );
        map.wrapS = MirroredRepeatWrapping
        map.wrapT = MirroredRepeatWrapping
        map.minFilter = NearestFilter
        map.maxFilter = NearestFilter
       

        this.mc = new MarchingCubes( 80, material, true )
        // this.mc.rotation.y = Math.PI * 0.5
        this.scene.add( this.mc )
        this.mc.isolation = 50

        var pointCount = 20
        this.points = []
        for( var i = 0 ; i < pointCount ; i++ ) {
            this.points.push( new CubePoint( i / pointCount ) )
        }
        
        this.onResize()
        this.step( 0 )

    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        height += 115
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )

        var camView = { fov : 55, aspect : width / height, near : 0.01, far : 6 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 3

        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.mc.reset()
        // this.mc.rotation.y += 0.01
        if( !this.mouseIsDown ) this.mc.isolation += ( 250 - this.mc.isolation ) * 0.1
        else  this.mc.isolation += ( 350 - this.mc.isolation ) * 0.1
        this.points.forEach( p => {
            p.step( time )
            if( this.mouseIsDown ) p.touching = true
            else p.touching = false
            this.mc.addBall( p.x / 2 + 0.5, p.y / 2 + 0.5, p.z / 2 + 0.5, p.strength, p.subtract );
        } )

        this.renderer.render( this.scene, this.camera )
    }
}

new Blob()