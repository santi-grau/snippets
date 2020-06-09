import { Scene, WebGLRenderer, OrthographicCamera, Vector2, Mesh, CircleBufferGeometry, PerspectiveCamera, BufferGeometry, BufferAttribute, ShaderMaterial, RingBufferGeometry, MeshBasicMaterial, DoubleSide, Vector3 } from 'three'
import ringShader from './rings.*'

class Rings extends Mesh{
    constructor(){
        super()

        this.amount = 256
        this.res = 64
        this.geometry = new BufferGeometry()
        var position = []
        var index = []
        var refs = []
        var o = 0


        for( var i = 0 ; i < this.amount ; i++ ){
            var ringSeed = Math.random()
            for( var j = 0 ; j < this.res ; j++ ){
                position.push( 0, 0, 0, 0, 0, 0 )

                refs.push( i / this.amount, j / this.res, 0, ringSeed, i / this.amount, j / this.res, 1, ringSeed )
                if( j > 0 ) index.push(  o + ( j - 1 ) * 2, o + j * 2 + 1, o + j * 2, o + ( j - 1 ) * 2, o + ( j - 1 ) * 2 + 1, o + j * 2 + 1 )
                if( j == this.res - 1 ) index.push( o + j * 2, o + 1, o + 0, o + j * 2, o + j * 2 + 1, o + 1 )
            }
            o += this.res * 2
        }

        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( position ), 3 ) )
        this.geometry.setAttribute( 'refs', new BufferAttribute( new Float32Array( refs ), 4 ) )
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )
        
        this.material = new ShaderMaterial( {
            uniforms : {
                rings : { value : this.amount },
                time : { value : 0 },
                col : { value : new Vector3( 0, 0, 1 ) }
            },
            transparent : true, 
            vertexShader: ringShader.vert,
            fragmentShader: ringShader.frag,
            
        } )
    }
}

class Ghost{
    constructor(){
        this.title = 'Ghost'
        this.timeInc = 0
        this.node = document.getElementById( 'main' )
        this.container = document.createElement( 'div' )
        
        this.node.appendChild( this.container )

        // this.camera = new OrthographicCamera( )
        this.camera = new PerspectiveCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.container.appendChild( this.renderer.domElement )


        this.scroller = document.createElement( 'div' )
        document.body.appendChild( this.scroller )
        this.scroller.style.height = window.innerHeight * 3 + 'px'
        
        this.mouseIsDown = false
        document.addEventListener( 'mousedown', ( e ) => this.mouseIsDown = true )
        document.addEventListener( 'mouseup', ( e ) => this.mouseIsDown = false )

        document.addEventListener( 'touchstart', ( e ) => this.mouseIsDown = true )
        document.addEventListener( 'touchend', ( e ) => this.mouseIsDown = false )


        this.prevScroll = null
        document.addEventListener( 'scroll', ( e ) => {
            var scrolled = window.scrollY
            
            this.rings.material.uniforms.time.value = scrolled
            this.rings2.material.uniforms.time.value = scrolled + 100
            this.rings3.material.uniforms.time.value = scrolled + 300
            // this.rings2.rotation.z = -scrolled * 0.0001 * Math.PI * 2
            // this.rings3.rotation.z = -scrolled * 0.0001 * Math.PI * 3
            
            if ( window.scrollY + window.innerHeight >= this.scroller.offsetHeight - window.innerHeight * 0.2 ) {
                this.scroller.style.height = parseInt( this.scroller.style.height ) + window.innerHeight + 'px'
            }
            
            if( this.prevScroll ) console.log( this.prevScroll - window.scrollY )
            this.prevScroll = window.scrollY
        })

        this.rings = new Rings()
        this.rings.material.uniforms.col.value = new Vector3( 1, 0, 0 )
        this.scene.add( this.rings )

        this.rings2 = new Rings()
        this.rings2.material.uniforms.col.value = new Vector3( 0, 1, 0 )
        this.scene.add( this.rings2 )
            
        // this.rings2.position.z = 10

        this.rings3 = new Rings()
        this.scene.add( this.rings3 )
        this.rings3.position.z = 10
        this.onResize()
        this.step()
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        // var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        // for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        // this.camera.position.z = 100

        var camView = { fov : 45, aspect : width / height, near : 0.01, far : 1000 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 700.5

        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( () => this.step() )
        
        if( this.mouseIsDown ) this.timeInc += 1

        this.renderer.render( this.scene, this.camera )
    }
}

new Ghost()