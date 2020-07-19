import { Scene, WebGLRenderer, OrthographicCamera, PlaneBufferGeometry, MeshBasicMaterial, Mesh, ShaderMaterial, Vector2 } from 'three'
import ditherShader from './dither.*'

class Snippet{
    constructor(){
       
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true } )
        this.node.appendChild( this.renderer.domElement )

        var material = new ShaderMaterial( {
            uniforms : {
                resolution : { value : new Vector2( ) }
            },
            vertexShader : ditherShader.vert,
            fragmentShader : ditherShader.frag
        } )
        this.plane = new Mesh( new PlaneBufferGeometry( 1, 1 ), material )
        this.scene.add( this.plane )

        this.step( 0 )
        this.onResize()
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 100
        this.camera.updateProjectionMatrix()
        this.plane.material.uniforms.resolution.value = new Vector2( width, height )
        this.plane.scale.set( width, height, 1 )
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()