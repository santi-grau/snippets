import fonts from './../../common/gfonts.json'
import trimCanvas from './Trim'

import Row from './Row'

class Main{
    constructor(){
        this.fontList = fonts.items.sort( () => Math.random( ) - 0.5 )
        let fontsLoad = 30
        var loadCounter = 0
        this.fonts = []
        this.scrollDirection = null

        for( var i = 0 ; i < fontsLoad ; i++ ){
            var weights = Object.keys( this.fontList[ i ].files )
            var weight = weights[ Math.floor( Math.random( ) * weights.length ) ]
            
            this.fonts.push( [ this.fontList[ i ].family, weight  ] )
            new FontFace( this.fontList[ i ].family, 'url(' + this.fontList[ i ].files[ weight ] + ')' ).load().then( ( loaded_face ) => {
                document.fonts.add( loaded_face )
                if( ++loadCounter == fontsLoad ) this.checkComp()
            })
        }
        this.canvasSize = [ 512, 128 ]
        this.fontSize = 80
        this.canvas = document.createElement( 'canvas' )
        this.canvas.width = this.canvasSize[ 0 ]
        this.canvas.height = this.canvasSize[ 1 ]
        this.ctx = this.canvas.getContext('2d');

        this.layerOffset = 0
        this.node = document.getElementById( 'main' )

        document.addEventListener( 'scroll', ( e ) => { 
            this.checkComp()
            this.currentScroll = document.body.getBoundingClientRect().top
            if( this.prevScroll ){
                if( this.prevScroll - this.currentScroll > 0 ) document.body.className = 'down'
                else document.body.className = 'up'
            }
            this.prevScroll = document.body.getBoundingClientRect().top
            if( this.scrollTimeout ) clearTimeout( this.scrollTimeout )
            this.scrollTimeout = setTimeout( ( ) => this.stopScroll(), 500 )
        } )

        this.row = document.createElement( 'mod-row' )
        window.customElements.define('mod-row', Row )
        for( var i = 0 ; i < 40 ; i++ ) this.addMod()
        this.onResize()
        this.step()
    }

    stopScroll( ){
        console.log( 'end')
        document.body.className = ''
    }

    addMod(){
        var comp = this.row.cloneNode()

        this.node.appendChild( comp )

        var color = Math.round( Math.random( ) )
        var colorPos = color * 255
        var colorNeg = ( 1 - color ) * 255
        

        var selectFont = this.fonts[ Math.floor( Math.random() * this.fonts.length ) ]
        var weight = selectFont[ 1 ]
        
        if( weight.includes( 'italic' ) && weight.length > 6 ) weight = ''

        if( weight == 'regular' ) weight = 400
        
        // console.log( weight, selectFont[ 0 ] )

        this.ctx.font = weight + ' ' + this.fontSize + 'px ' + selectFont[ 0 ]
        this.ctx.fillStyle = 'rgba( ' + colorPos + ', ' + colorPos + ', ' + colorPos + ', 1 )'
        this.ctx.strokeStyle = 'rgba( ' + colorPos + ', ' + colorPos + ', ' + colorPos + ', 1 )'
        this.ctx.lineWidth = 2;
        this.ctx.textBaseline = 'hanging'
        var copy = 'UP'
        var separators = '-*|_~'
        if( Math.random() > 0.8 ) copy += separators[ Math.floor( Math.random() * separators.length ) ]
        else copy += '!'
        var arrows = '⇧⤒⇡'
        if( Math.random() > 0.95 ) copy = arrows[ Math.floor( Math.random() * arrows.length ) ]
        if( Math.random( ) < 0.8 ) this.ctx.fillText( copy, 0, 20 )
        else this.ctx.strokeText( copy, 0, 20 )
        var im1 = trimCanvas( this.canvas, this.fontSize * 0.1 ).toDataURL()

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height )
        this.canvas.width = this.canvasSize[ 0 ]
        this.canvas.height = this.canvasSize[ 1 ]

        this.ctx.font = weight + ' ' + this.fontSize + 'px ' + selectFont[ 0 ]
        this.ctx.fillStyle = 'rgba( ' + colorNeg + ', ' + colorNeg + ', ' + colorNeg + ', 1 )'
        this.ctx.strokeStyle = 'rgba( ' + colorNeg + ', ' + colorNeg + ', ' + colorNeg + ', 1 )'
        this.ctx.lineWidth = 2;
        this.ctx.textBaseline = 'hanging'
        var copy = 'DOWN'
        var separators = '-*|_~'
        if( Math.random() > 0.8 ) copy += separators[ Math.floor( Math.random() * separators.length ) ]
        else copy += '!'
        var arrows = '⇩⤓⇣'
        if( Math.random() > 0.95 ) copy = arrows[ Math.floor( Math.random() * arrows.length ) ]
        if( Math.random( ) < 0.8 ) this.ctx.fillText( copy, 0, 20 )
        else this.ctx.strokeText( copy, 0, 20 )
        var res = trimCanvas( this.canvas, this.fontSize * 0.1 )
        
        // res.width = res.width + this.fontSize * 0.1
        var im2 = res.toDataURL()
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height )
        this.canvas.width = this.canvasSize[ 0 ]
        this.canvas.height = this.canvasSize[ 1 ]
        
        comp.setBackground( im1, colorNeg, im2, colorPos )
    }

    checkComp( ){
        var topScroll = document.body.getBoundingClientRect().top
        // if( topScroll < 100 )
        // parentNode.insertBefore(newNode, referenceNode);
        var windowHeight = document.body.getBoundingClientRect().height
        var nodeHeight = document.body.getBoundingClientRect().top + this.node.offsetHeight
        if( nodeHeight - 600 < windowHeight ) {
            this.addMod()
           
        }
        // console.log( topScroll, windowHeight, nodeHeight )
    }

    onResize( ) { }
  
    step( time ){
        requestAnimationFrame( () => this.step() )
    }
}

new Main()