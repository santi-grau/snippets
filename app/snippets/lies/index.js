import { Scene, WebGLRenderer, Vector3, PerspectiveCamera, Mesh, PlaneBufferGeometry, MeshBasicMaterial, TextureLoader, ClampToEdgeWrapping, Object3D, ShaderMaterial } from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import bgImage from './back.jpg'
import tti from './tt.jpg'
import tbi from './tb.jpg'
import bti from './bt.jpg'
import bbi from './bb.jpg'

import planeShader from './plane.*'

class Tunnel{
    constructor(){
        this.timeInc = 0
        this.node = document.getElementById( 'main' )

        this.scene = new Scene()
        
        this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 )
        this.camera.lookAt( new Vector3( ) )
        
        this.scene.add( this.camera )

        this.renderer = new WebGLRenderer( { antialias : true, alpha : true } )
        this.node.appendChild( this.renderer.domElement )

        // var controls = new OrbitControls( this.camera, this.renderer.domElement );

        // this.rotationInc = 0
        // this.positions = new Positions( 2048, 1024 )
        
        // document.body.style.height = window.innerHeight * 3 + 'px'

        // this.scrolling = false
        document.addEventListener( 'scroll', ( e ) => {
            var scrolled = window.scrollY / ( window.innerHeight * 0.5 )
            console.log( scrolled )

            var a = Math.PI * 0.1666666667 * scrolled * 2
            this.pttt.rotation.x = a
            this.ptt.material.uniforms.fold.value = scrolled;
            this.ptb.material.uniforms.fold.value = scrolled;
            
            this.ptbt.rotation.x = -a
            this.ptbt.position.y = ( 1 - Math.cos( a ) ) * 2.076

            this.pbtt.rotation.x = a
            this.pbt.material.uniforms.fold.value = scrolled;
            this.pbtt.position.y = -( 1 - Math.cos( a ) ) * 2.076

            this.pbbt.rotation.x = -a
            this.pbb.material.uniforms.fold.value = scrolled;

            this.bg.scale.y = ( 1 - Math.cos( a ) ) * 2.076 * 2

            
        //     this.ambient.step( scrolled )
        //     if ( window.scrollY + window.innerHeight >= document.body.offsetHeight - window.innerHeight * 0.2 ) {
        //         document.body.style.height = parseInt( document.body.style.height ) + window.innerHeight + 'px'
        //     }
        //     this.scrolling = true
        //     if( this.scrollTimeout ) clearTimeout( this.scrollTimeout )
        //     this.scrollTimeout = setTimeout( () => this.scrolling = false, 500 )
            
        })

        // this.ambient = new Ambient( this.positions )
        // this.scene.add( this.ambient )
        // this.mouseIsDown = false
        var tl = new TextureLoader()
        var ttit = tl.load( tti )
        var tbit = tl.load( tbi )

        var btit = tl.load( bti )
        var bbit = tl.load( bbi )
        var fi = tl.load( bgImage )
        
        this.faceGroup = new Object3D()
        this.scene.add( this.faceGroup )
        // this.faceGroup.rotation.y = 0.3
        this.bg = new Mesh( new PlaneBufferGeometry( 1, 1 ), new MeshBasicMaterial( { map : fi } ) )
        this.faceGroup.add( this.bg )
        
        this.pttt = new Object3D()
        this.faceGroup.add( this.pttt )
        this.ptt = new Mesh( new PlaneBufferGeometry( 1, 1 ), new ShaderMaterial({
            uniforms : {
                tex : { value : ttit },
                fold : { value : 0 },
                dir : { value : 1.0 }
            },
            vertexShader : planeShader.vert,
            fragmentShader : planeShader.frag
        }) )
        this.pttt.add( this.ptt )

        this.ptbt = new Object3D()
        this.faceGroup.add( this.ptbt )
        this.ptb = new Mesh( new PlaneBufferGeometry( 1, 1 ), new ShaderMaterial({
            uniforms : {
                tex : { value : tbit },
                fold : { value : 0 },
                dir : { value : -1.0 }
            },
            vertexShader : planeShader.vert,
            fragmentShader : planeShader.frag
        }) )
        this.ptbt.add( this.ptb )

        this.pbtt = new Object3D()
        this.faceGroup.add( this.pbtt )
        this.pbt = new Mesh( new PlaneBufferGeometry( 1, 1 ), new ShaderMaterial({
            uniforms : {
                tex : { value : btit },
                fold : { value : 0 },
                dir : { value : 1.0 }
            },
            vertexShader : planeShader.vert,
            fragmentShader : planeShader.frag
        }) )
        this.pbtt.add( this.pbt )



        this.pbbt = new Object3D()
        this.faceGroup.add( this.pbbt )
        this.pbb = new Mesh( new PlaneBufferGeometry( 1, 1 ), new ShaderMaterial({
            uniforms : { tex : { value : bbit }, fold : { value : 0 }, dir : { value : -1.0 } },
            vertexShader : planeShader.vert,
            fragmentShader : planeShader.frag
        }) )
        this.pbbt.add( this.pbb )
        
        this.onResize()
        this.step( 0 )
    }

    frustumAtDistance( ){
        var t = Math.tan( ( this.camera.fov * ( Math.PI / 180 ) ) / 2 )
        var h = t * 2 * this.camera.position.z
        var w = h * this.camera.aspect
        console.log( w, h )
        return { w : w, h : h }
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( window.devicePixelRatio )
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.camera.position.z = 5
        
        var frustum = this.frustumAtDistance()
        
        this.ptt.scale.set( frustum.h / 3 * 4, frustum.h / 4, 1 )
        this.ptt.position.y = -frustum.h * 0.125
        this.pttt.position.y = frustum.h * 0.5

        this.ptb.scale.set( frustum.h / 3 * 4, frustum.h / 4, 1 )
        this.ptb.position.y = frustum.h * 0.125
        

        this.pbt.scale.set( frustum.h / 3 * 4, frustum.h / 4, 1 )
        this.pbt.position.y -= frustum.h * 0.125

        this.pbb.scale.set( frustum.h / 3 * 4, frustum.h / 4, 1 )
        this.pbb.position.y = frustum.h * 0.125
        this.pbbt.position.y = -frustum.h * 0.5
        
        this.bg.scale.set( frustum.h / 3 * 4, 0.001, 1 )
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )

        // this.faceGroup.rotation.y += 0.001

        this.renderer.render( this.scene, this.camera )
    }
}

new Tunnel()