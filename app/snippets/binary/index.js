import { Scene, WebGLRenderer, OrthographicCamera, Vector2, BufferAttribute, MeshBasicMaterial, Mesh, ShaderMaterial } from 'three'
import Waves from './Waves'
class Timeline{
    constructor(){
       
        this.node = document.getElementById( 'main' )

        this.camera = new OrthographicCamera( )
        this.scene = new Scene()

        this.renderer = new WebGLRenderer( { antialias : true } )
        this.node.appendChild( this.renderer.domElement )

        this.waves = new Waves()
        this.scene.add( this.waves )

        this.scrolling = false
        document.addEventListener( 'scroll', ( e ) => {
            var scrolled = window.scrollY
            this.scrolling = true
            
            this.waves.material.uniforms.time.value = scrolled * 0.0005

            if ( window.scrollY + window.innerHeight >= document.body.offsetHeight - window.innerHeight * 0.2 ) {
                // this.scroller.style.height = parseInt( this.scroller.style.height ) + window.innerHeight + 'px'
            }
            
            clearTimeout( this.scrollTimeout );
            this.scrollTimeout = setTimeout(function() {
                this.scrolling = false;
            }.bind( this ), 66);
            
            this.prevScroll = window.scrollY
        })
        
        this.step( 0 )
        this.onResize()
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        height += 115
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 100
        this.camera.updateProjectionMatrix()

        this.waves.scale.set( this.node.offsetWidth, this.node.offsetHeight + 115, 1 )
        this.waves.material.uniforms.scene.value = new Vector2( this.node.offsetWidth, this.node.offsetHeight + 115 )
        this.waves.position.y = -this.node.offsetHeight / 2 - 55
    }
  
    step( time ){
        requestAnimationFrame( () => this.step( time ) )
        this.waves.step( time )
        if( this.scrolling ) this.waves.material.uniforms.intensity.value += ( 1 - this.waves.material.uniforms.intensity.value ) * 0.05
        else this.waves.material.uniforms.intensity.value -= this.waves.material.uniforms.intensity.value * 0.05
        this.renderer.render( this.scene, this.camera )
    }
}

new Timeline()