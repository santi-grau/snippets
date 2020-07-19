import { WebGLRenderer, Scene, OrthographicCamera, Mesh, MeshBasicMaterial, PlaneBufferGeometry, } from 'three'
import { FaceMeshFaceGeometry } from './FaceMeshFaceGeometry.js'
import 'regenerator-runtime/runtime'


class Capture extends HTMLElement{
    constructor(){
        super()
        this.video = document.querySelector( 'video' )
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true })

        this.appendChild( this.renderer.domElement )

        this.scene = new Scene()
        this.camera = new OrthographicCamera()
        this.material = new MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        this.faceGeometry = new FaceMeshFaceGeometry()
        this.mask = new Mesh( this.faceGeometry, this.material )
        this.scene.add( this.mask )

        this.init()
    }

    init(){
        const constraints = { audio: false, video: { width : { exact : 320 }} } 
        navigator.mediaDevices.getUserMedia(constraints).then( stream => this.handleSuccess( stream ) ).catch( err => this.handleError(err) )
    }

    handleSuccess( stream ) {
        this.video.classList.add( 'active' )
        this.video.srcObject = stream
        this.video.addEventListener( 'loadedmetadata', () => {
            this.onVideoReady( )
        } )
    }

    handleError(error) {
        if (error.name === 'ConstraintNotSatisfiedError') errorMsg(`The resolution ${constraints.video.width.exact}x${constraints.video.height.exact} px is not supported by your device.`)
        else if (error.name === 'PermissionDeniedError') errorMsg('Permissions have not been granted to use your camera and microphone, you need to allow the page access to your devices in order for the demo to work.')
        ( error ) && console.error( error )
    }

    onVideoReady( e ){
        // tf.setBackend('webgl').then( () => facemesh.load({ maxFaces: 1 } ).then( m => this.onModelReady( m ) ) )
    }

    onModelReady( model ){
        console.log('ready')
        this.model = model
        this.onResize()
    }

    onResize = function( ){
        let [ width, height ] = [ this.offsetWidth, this.offsetHeight ]
        var [ w, h ] = [ this.video.offsetWidth, this.video.offsetHeight ]

        this.renderer.setSize( w, h )
        this.renderer.setPixelRatio( window.devicePixelRatio )

        var camView = { left : w / -2, right : w / 2, top : h / 2, bottom : h / -2, near : 0.001 }
        for ( var prop in camView ) this.camera[ prop ] = camView[ prop ]
        this.camera.position.z = 100
        this.faceGeometry.setSize( w, h )
        this.camera.updateProjectionMatrix()
    }

    async step( time ){
        if( !this.model ) return
        this.renderer.render( this.scene, this.camera )
        const faces = await this.model.estimateFaces( this.video, false, true )   
        if( faces.length > 0 ) {
            this.faceGeometry.update( faces[ 0 ], true )
            console.log( faces[ 0 ].mesh[ 0 ] )
        }
    }
}

class Main extends HTMLElement{
    constructor(){
        super()
        this.pixelSize = 8
        customElements.define( 'mod-capture', Capture )
        this.capture = document.querySelector( 'mod-capture' )
        // this.frameCount = 0

        this.canvas = document.createElement( 'canvas' )
        this.canvas.width = this.offsetWidth / this.pixelSize
        this.canvas.height = this.offsetHeight / this.pixelSize
        this.canvas.style.width = this.offsetWidth + 'px' 
        this.canvas.style.height = this.offsetHeight + 'px'
        this.canvas.style['image-rendering'] = 'pixelated'
        this.appendChild( this.canvas )

        // this.addEventListener( 'click', ( e ) => this.capture.init( ) )

        this.onResize()
        this.step( 0 )
    }

    onResize(){

    }

    videoToCanvas(){
        
        var x = 0
        var y = 0
        var w = 50
        var h = 50
        this.canvas.getContext('2d').drawImage( this.capture.video, x, y, w, h )
    }

    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.videoToCanvas()
        
        this.capture.step()
    }
}

customElements.define( 'mod-main', Main )
// customElements.define( 'mod-vid', UserMedia, { extends: 'video' } )