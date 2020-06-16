var main = document.querySelector( '#main' )
var resist = document.querySelector( '.resist' )

var mainPosition = 0

document.body.style.height = window.innerHeight * 3 + 'px'
var prevScrolled = window.scrollY
var scrollTimeout, scrolling = false

if( Math.random( ) > 0.5 ) main.classList.toggle( 'inv' )

var onScroll = function( e ){
    var scrolled = window.scrollY
    scrolling = true
    if ( window.scrollY + window.innerHeight >= document.body.offsetHeight - window.innerHeight * 0.2 ) document.body.style.height = parseInt( document.body.style.height ) + window.innerHeight + 'px'
    var speed =  prevScrolled - scrolled
    
    prevScrolled = scrolled
    mainPosition -= Math.min( 0, speed )
    mainPosition = Math.min( mainPosition, window.innerHeight )
    if( scrollTimeout ) clearTimeout( scrollTimeout )
    scrollTimeout = setTimeout( () => scrolling = false, 200 )
    resist.style[ 'background-position-y' ] = -scrolled + 'px'
}

var step = function( time ){
    if( !scrolling ) mainPosition -= mainPosition * 0.3
    main.style.transform = 'translate3d( 0, ' + mainPosition * -1 + 'px, 0 )'
    requestAnimationFrame( ( time ) => step( time ) )
}

document.addEventListener( 'scroll', ( e ) => onScroll( e ) )

onScroll()
step( 0 )