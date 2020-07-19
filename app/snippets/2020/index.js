import SimplexNoise from 'simplex-noise'
var svg = document.querySelector( 'svg' )
var simplex = new SimplexNoise( Math.random )
var shapeCount = 500
var inc = 0
var process = function( s ){
    if( svg.childNodes.length > shapeCount ) svg.removeChild( svg.childNodes[ 0 ] )
    
    svg.appendChild( document.createElementNS('http://www.w3.org/2000/svg', 'rect') )
    
    var n = simplex.noise2D( s * 0.0005, 0.5 )
    var n2 = simplex.noise2D( 0.5, s * 0.0005 )
    var n3 = simplex.noise2D( 0.5, -s * 0.01 )
    var n4 = ( simplex.noise2D( -0.5, -s * 0.01 + 100 ) + 1 ) * 0.5

    var scale = Math.min( window.innerWidth, window.innerWidth ) * n4
    var x = window.innerWidth / 2 -  scale/ 2 
    var y = window.innerHeight / 2 + n2 * window.innerWidth / 2
    y = window.innerHeight / 2 + n3 * window.innerHeight / 2
    var cir = svg.childNodes[ svg.childNodes.length - 1 ]
    
    cir.setAttribute('transform', 'rotate( ' + 90 * n3 + ' ' + 0 + ', ' + y + ' )' )
    cir.setAttribute('x', x )
    cir.setAttribute('y', y )
    cir.setAttribute('width', scale )
    cir.setAttribute('height', scale )
    cir.setAttribute('stroke', 'black')
    cir.setAttribute('fill', 'hsl( ' +  s * 360 / shapeCount * 2 + ', 100%, 50% )')
    cir.setAttribute('stroke-width', '0.5')

}

document.body.style.height = window.innerHeight * 3 + 'px'
var onScroll = function( e ){
    inc += 0.5
    process( window.scrollY * 0.1 )
    if ( window.scrollY + window.innerHeight >= document.body.offsetHeight - window.innerHeight * 0.2 ) document.body.style.height = parseInt( document.body.style.height ) + window.innerHeight + 'px'
}

document.addEventListener( 'scroll', ( e ) => onScroll( e ) )