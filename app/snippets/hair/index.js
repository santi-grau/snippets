import portrait from './portrait.jpg'

const constraints = { audio: false, video: true }
var video = document.querySelector( 'video' )
function handleSuccess( stream ) {
    video.classList.add( 'active' )
    video.srcObject = stream
    video.addEventListener( 'loadedmetadata', () => {
        var im = video, imar = im.offsetHeight / im.offsetWidth, frar = window.innerHeight / window.innerWidth
        var [ w, h ] = [ window.innerHeight / imar, window.innerHeight ]
        if( imar > frar ) [ w, h ] = [ window.innerWidth, window.innerWidth * imar ]
        video.height = h
        video.width = w
    } )
}

function stop(){
    video.srcObject.getTracks().forEach( track => track.stop() )
}

function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') errorMsg(`The resolution ${constraints.video.width.exact}x${constraints.video.height.exact} px is not supported by your device.`)
    else if (error.name === 'PermissionDeniedError') errorMsg('Permissions have not been granted to use your camera and microphone, you need to allow the page access to your devices in order for the demo to work.')
    ( error ) && console.error( error )
}

function init( ) { navigator.mediaDevices.getUserMedia(constraints).then( stream => handleSuccess( stream ) ).catch( err => handleError(err) ) }

class Snippet{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.measureScreen()
        this.oldInc = null
        this.canvas = document.createElement( 'canvas' )
        this.canvas.width = this.lineLength
        this.canvas.height = this.rowLength
        var ctx = this.canvas.getContext( '2d' )
        var img = new Image()
        this.data = []
        img.onload = ( i ) => {
            var im = i.target, imar = im.height / im.width, frar = this.canvas.height / this.canvas.width
            var [ w, h ] = [ this.canvas.height / imar, this.canvas.height ]
            if( imar > frar ) [ w, h ] = [ this.canvas.width, this.canvas.width * imar ]
            ctx.drawImage( img, ( this.canvas.width - w ) / 2, ( this.canvas.height - h ) / 2, w, h )
            this.data = ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height ).data

            this.step()
        }
        img.src = portrait

        document.body.appendChild( this.canvas )
        this.mode = 'scroll'

        document.querySelector('button').addEventListener( 'click', () =>  this.action() )
        
    }

    action(){
        if( this.mode == 'scroll' ){
            init( )
            this.mode = 'capture'
            document.querySelector('button').innerHTML = 'SNAP!'
        } else if( this.mode == 'capture' ){
            this.screenShot()
            document.querySelector( '.container' ).scrollTo( 0, 0 )
            this.mode = 'scroll'
            document.querySelector('button').innerHTML = 'DO ME'
        }
        
    }

    process( inc ){
        
        inc = Math.max( 0, Math.min( 1, inc ) )
        var str = ''

        // $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,
        var chars = '.:;!i=o*%@#W'

        for(var i = 0; i < this.data.length; i += 4 ) {
            var brightness = 255 - ( 0.34 * this.data[i] + 0.5 * this.data[i + 1] + 0.16 * this.data[i + 2] )
            
            str += chars[ Math.round( brightness / 255 * ( chars.length - 1 ) *  ( 1 - inc ) )  ]
            
        }
        this.node.innerHTML = str
    }

    screenShot(){
        var im = video, imar = im.height / im.width, frar = this.canvas.height / this.canvas.width
        var [ w, h ] = [ this.canvas.height / imar, this.canvas.height ]
        if( imar > frar ) [ w, h ] = [ this.canvas.width, this.canvas.width * imar ]
        this.canvas.getContext('2d').drawImage( video, ( this.canvas.width - w ) / 2, ( this.canvas.height - h ) / 2, w, h )

        
        this.data = this.canvas.getContext('2d').getImageData( 0, 0, this.canvas.width, this.canvas.height ).data
        this.process( 0 )
        stop()
        video.classList.remove( 'active' )
    }

    measureScreen(){
        var lineMeasure = document.createElement( 'span' )
        document.body.appendChild( lineMeasure )
        while( lineMeasure.offsetWidth < document.body.offsetWidth - 30 ) lineMeasure.innerHTML += '.'
        this.lineLength = lineMeasure.innerHTML.length
        this.lineLength--
        document.body.removeChild( lineMeasure )
        
        while( this.node.offsetHeight < window.innerHeight - 30 ) {
            var rowMeasure = document.createElement( 'div' )
            rowMeasure.innerHTML = '#'
            this.node.appendChild( rowMeasure )
        }
        this.rowLength = this.node.childNodes.length
        
        while( this.node.childNodes.length ) this.node.removeChild( this.node.childNodes[ 0 ] )

        this.node.style.width = window.innerWidth - 30 + 'px'
    }

    step( time ){
        requestAnimationFrame( () => this.step() )
        
        var inc = document.querySelector( '.container' ).scrollTop / window.innerHeight
        
        if( this.oldInc !== null && this.oldInc == inc ) return
        this.process(  inc )

        this.oldInc = inc
    }
}

new Snippet()