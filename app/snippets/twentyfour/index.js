import im from './notenough.png'

class Scroller{
    constructor(){
        this.title = 'Untitled'
    }
    onMove( x, y ){ }
    onResize( w, h ) {}
    step( time ){ }
    // remove(){ }
}


class Twentyfour extends Scroller{
    constructor(){
        super()
        this.title = '24h is not enough'

        document.body.style.backgroundImage = 'url( '+ im + ' )'
        document.body.style.backgroundSize = '100%'
    }

    onMove( x, y ){
        var c = 255 * ( Math.max( 0.25, Math.min( 0.75, ( Math.cos( Math.PI * y * 0.0001 + Math.PI ) + 1 ) * 0.5 ) ) - 0.25 ) / 0.5 
        document.body.style.backgroundColor = 'rgba( ' + c + ', ' + c + ', ' + c + ', ' + 1 + ')'
    }

    remove(){
        
    }
}

var scroller = new Twentyfour()

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
    console.log( scroller)
}


window.addEventListener( 'resize', ( ) => onResize( ) )
