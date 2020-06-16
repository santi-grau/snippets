
import fonts from './../../common/gfonts.json'

class Shapes {
    constructor(){
        
        this.title = 'Y-N'

        var fontsLoad = 100
        this.fontList = fonts.items.sort( () => Math.random( ) - 0.5 )
        
        this.node = document.createElement( 'div' )
        
        this.node.style.position = 'relative'
        // document.body.style['scroll-snap-type'] = 'y mandatory'
        // document.body.style['overflow-y'] = 'scroll'
        document.body.appendChild( this.node )
        
        for( var i = 0 ; i < 100 ; i++ ){
            var d = document.createElement( 'div' )
            
            this.node.appendChild( d )
            
            var inner = document.createElement( 'span' )
            this.node.style.position = 'relative'
            inner.innerHTML = 'Yes'
            if( Math.random() > 0.5 ) for( var j = 0 ; j < Math.floor( Math.random( ) * 4 ) ; j ++ ) inner.innerHTML += ', yes'

            d.appendChild( inner )
            d.style.overflow = 'hidden'
            d.style.position = 'relative'
            // d.style['scroll-snap-align'] = 'start' 
            if( Math.random() > 0.5 ) {
                d.style.background = '#ffffff'
                d.style.color = '#000000'
            }
            if( Math.random() > 0.5 ) {
                inner.innerHTML = 'No'
                if( Math.random() > 0.5 ) for( var j = 0 ; j < Math.floor( Math.random( ) * 4 ) ; j ++ ) inner.innerHTML += ', no'
            }
            d.style.height = window.innerHeight + 115 + 'px'
            
            inner.style.display = 'block'
            inner.style.position = 'absolute'
            inner.style['font-size'] = '96px'
            inner.style['line-height'] = '96px'
            inner.style.top = '45%'
            inner.style.left = '50%'
            inner.style['text-align'] = 'center'
            var domRect = inner.getBoundingClientRect()
            // inner.style['transform-origin'] = '0 0'
            
            inner.style.transform = 'translate3d( -50%, -50%, 0 )'
            // scale( ' + d.offsetWidth / domRect.width + ', ' + d.offsetHeight / domRect.height + ' )'
        }

        for( var i = 0 ; i < fontsLoad ; i++ ){
            
            var weights = Object.keys( this.fontList[ i ].files )
            var select = weights[ Math.floor( Math.random( ) * weights.length ) ]
            new FontFace( this.fontList[ i ].family, 'url(' + this.fontList[ i ].files[select] + ')' ).load().then( ( loaded_face ) => document.fonts.add( loaded_face ) )
        }

        

        document.fonts.ready.then( font_face_set => {
            Object.values( this.node.childNodes ).forEach( n => {
                n.childNodes[ 0 ].style.fontFamily = this.fontList[ Math.floor( Math.random( ) * fontsLoad ) ].family
            })
        });
    }
}



var scroller = new Shapes()

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
