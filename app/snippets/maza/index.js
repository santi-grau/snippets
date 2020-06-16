var adjectives = [
    [ 'apocalyptic', 'awry' ],
    [ 'bellic', 'biggoted', 'broke', 'banal' ],
    [ 'corrupt' ],
    [ 'dictatorial', 'dumb' ],
    [ 'evil', 'extremist', 'elitist' ],
    [ 'fascist' ],
    [ 'great' ],
    [ 'homophobic' ],
    [ 'intollerant' ],
    [ 'jobless' ],
    [ 'kkk', 'kindless' ],
    [ 'lauhgable', 'lethal' ],
    [ 'mediocre', 'military' ],
    [ 'nazi' ],
    [ 'obscure', 'obsolete', 'outdated', 'outclassed' ],
    [ 'polluted', 'phobic', 'polarized' ],
    [ 'quixotic', 'quiescent' ],
    [ 'racist' ],
    [ 'sexist' ],
    [ 'tyrannic' ],
    [ 'unequal', 'unfair' ],
    [ 'violent' ],
    [ 'wasteful', 'white', 'weaponed' ],
    [ 'xenophobic' ],
    [ 'yucky', 'yawn', 'yankee' ],
    [ 'zzzzzzz', 'zero' ]
]

var markers = []
adjectives.forEach( a => markers.push( 0 ) )

var interval = window.innerHeight * 2.5
var offset = Math.floor( Math.random() * window.innerHeight * 3 )
document.body.style.height = window.innerHeight * 3 + 'px'

var w = document.querySelector( '.word' )
var prevSelect = 10

var onScroll = function( e ){
    var scrolled = window.scrollY
    if ( window.scrollY + window.innerHeight >= document.body.offsetHeight - window.innerHeight * 0.2 ) document.body.style.height = parseInt( document.body.style.height ) + window.innerHeight + 'px'
    var timeline = offset + scrolled
    var select = Math.floor( timeline % interval / interval * adjectives.length )
    
    if( prevSelect && prevSelect !== select ) {
        if( select == 6 ) {
            w.style[ 'text-decoration' ] = 'line-through'
            w.innerHTML = '&nbsp;GREAT'
        } else {
            w.style[ 'text-decoration' ] = 'none'
            w.innerHTML = adjectives[ select ][ markers[ select ] ].toUpperCase()
        }
        
        markers[ select ]++
        if( markers[ select ] == adjectives[ select ].length  ) markers[ select ] = 0
    }
    prevSelect = select
}

document.addEventListener( 'scroll', ( e ) => onScroll( e ) )

onScroll()


