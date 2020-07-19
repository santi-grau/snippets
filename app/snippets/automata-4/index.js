import { Scene, WebGLRenderer, OrthographicCamera, Raycaster, Vector2, PlaneBufferGeometry, Mesh, MeshBasicMaterial } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'
import Dat from 'dat.gui';

import shaderPosition from './feedback.frag'

class Snippet{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : false, alpha : true, preserveDrawingBuffer : true } )
        this.node.appendChild( this.renderer.domElement )
        this.frame = 0
        this.res = 1

        this.settings = {
            name : 'My GUI',
            play : true,
            speed : 60,
            rows : 2,
            columns : 2,
            displaceX : 0.33,
            displaceY : 0.41,
            variationRate : 2,
            export : () => this.exportToggle()
        }

        this.mouse = new Vector2()
        
        this.computeSize = new Vector2( this.node.offsetWidth * this.res, this.node.offsetHeight * this.res )
        this.gpuCompute = new GPUComputationRenderer( this.computeSize.x, this.computeSize.y, this.renderer )
        
        this.dtPosition = this.gpuCompute.createTexture()
        var ps = []
        for( var i = 0 ; i < this.computeSize.x * this.computeSize.y ; i++ ) ps.push( 0,0,0,1 )
        this.dtPosition.image.data = new Float32Array( ps )

        this.positionVariable = this.gpuCompute.addVariable( "texturePosition", shaderPosition, this.dtPosition )
            
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable ] )
        this.positionUniforms = this.positionVariable.material.uniforms

        this.positionUniforms[ 'time' ] = { value: 0.0 }
        this.positionUniforms[ 'seed' ] = { value: Math.random() }
        this.positionUniforms[ 'splits' ] = { value:new Vector2( 1, 1 ) }
        this.positionUniforms[ 'move' ] = { value:new Vector2( 0, 0 ) }
        this.positionUniforms[ 'size' ] = { value: new Vector2( this.computeSize.x, this.computeSize.y ) }

        this.gpuCompute.init()
        
        
        
        var planeSize = Math.max( this.node.offsetWidth, this.node.offsetHeight )
        this.plane = new Mesh( new PlaneBufferGeometry( this.node.offsetWidth, this.node.offsetHeight ), new MeshBasicMaterial( { map : this.dtPosition } ) )
        this.scene.add( this.plane )

        this.onResize()
        this.step( 0 )

        var gui = new Dat.GUI( this.settings )
        gui.add( this.settings, 'speed', 1, 60, 1 )
        gui.add( this.settings, 'rows', 1, 100, 1 )
        gui.add( this.settings, 'columns', 1, 100, 1 )
        gui.add( this.settings, 'displaceX', 0, 1, 0.01 )
        gui.add( this.settings, 'displaceY', 0, 1, 0.01 )
        gui.add( this.settings, 'variationRate', 0, 5, 0.01 )
        gui.add( this.settings, 'play' )
        gui.add( this.settings, 'export' )

        setTimeout( ( ) => this.randomize(), 1000 )
    }

    randomize(){
        this.positionUniforms[ 'seed' ].value = Math.random()
        setTimeout( ( ) => this.randomize(), this.settings.variationRate * 1000 )
    }

    exportToggle(){
        this.renderer.setPixelRatio( 4 )
        this.camera.updateProjectionMatrix()
        this.renderer.render( this.scene, this.camera )
        this.renderer.domElement.toBlob( blob => {
            var DOMURL = window.URL || window.webkitURL || window
            var url = DOMURL.createObjectURL( blob )
            const link = document.createElement( 'a' )
            link.href = url
            link.download = ( + new Date() ) + '.png'
            document.body.appendChild( link )
            link.dispatchEvent( new MouseEvent( 'click', { bubbles : false,  cancelable : true, view : window } ) )
            document.body.removeChild( link )
            this.renderer.setPixelRatio( 1 )
            this.camera.updateProjectionMatrix()
        })
    }

    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
		this.renderer.setPixelRatio( 1 )
        var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 300
        
        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )

        this.positionUniforms[ 'time' ].value += 0.01
        this.positionUniforms[ 'splits' ] = { value:new Vector2( this.settings.columns, this.settings.rows ) }
        this.positionUniforms[ 'move' ] = { value:new Vector2( this.settings.displaceX, this.settings.displaceY ) }

        if( this.frame % ( 61 - this.settings.speed ) == 0 ){
            this.gpuCompute.compute()
            this.plane.material.map = this.gpuCompute.getCurrentRenderTarget( this.positionVariable ).texture
        }

        this.frame++

        this.renderer.render( this.scene, this.camera )
    }
}

new Snippet()