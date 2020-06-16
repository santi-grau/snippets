
class Row extends HTMLElement {
    
    constructor(  ){
        super( )
        if( Math.random() > 0.7 ) this.classList.add( 'animatel' )
        if( Math.random() < 0.3 ) this.classList.add( 'animater' )
        var height = Math.floor( 50 + Math.random() * 100 )

        this.style.height = height + 'px'

        var inner = document.createElement( 'div' )
        inner.classList.add( 'inner' )
        this.appendChild( inner )
        
        this.lineTop = document.createElement( 'div' )
        this.lineTop.classList.add( 'line', 'top' )
        inner.appendChild( this.lineTop )

        this.lineBot = document.createElement( 'div' )
        this.lineBot.classList.add( 'line', 'bot' )
        inner.appendChild( this.lineBot )
    }

    setBackground( im1, c1, im2, c2 ){
        this.lineTop.style.backgroundColor = 'rgba( ' + c1 + ', ' + c1 + ', ' + c1 + ', 1 )'
        this.lineTop.style.backgroundImage = 'url(' + im1 + ')'
        this.lineTop.style.borderBottom = '1px solid rgba( ' + c2 + ', ' + c2 + ', ' + c2 + ', 1 )'
        this.lineBot.style.backgroundColor = 'rgba( ' + c2 + ', ' + c2 + ', ' + c2 + ', 1 )'
        this.lineBot.style.backgroundImage = 'url(' + im2 + ')'
        this.lineBot.style.borderBottom = '1px solid rgba( ' + c1 + ', ' + c1 + ', ' + c1 + ', 1 )'
    }
}

export { Row as default }