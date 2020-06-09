import Scroller from '../../js/Scroller'
import genome from './covid.json'

class Covid extends Scroller{
    constructor(){
        super()
        var frags = genome.match(/.{1,16}/g)
        var conversion = { 'A' : '00', 'C' : '01', 'G' : '10', 'T' : '11' }
        var cols = []
        frags.forEach( f => {
            var c = []
            f.split('').forEach( l => c.push( conversion[ l ] ) )
            cols.push( c )
        })
        
        var canvas = document.createElement( 'canvas' )

        var s = 1
        canvas.width = 64 * s
        canvas.height = 32 * s
        document.body.append( canvas )
        var ctx = canvas.getContext( '2d' )
        var id = ctx.createImageData( s, s )
        var d  = id.data

        cols.forEach( ( c, i ) => {
            for( var j = 0 ; j < d.length ; j += 4 ){
                d[ j + 0 ] = this.convertBase( c[  0 ] + c[  1 ] + c[  2 ] + c[  3 ] ).from( 2 ).to( 10 )
                d[ j + 1 ] = this.convertBase( c[  4 ] + c[  5 ] + c[  6 ] + c[  7 ] ).from( 2 ).to( 10 )
                d[ j + 2 ] = this.convertBase( c[  8 ] + c[  9 ] + c[ 10 ] + c[ 11 ] ).from( 2 ).to( 10 )
                d[ j + 3 ] = this.convertBase( c[ 12 ] + c[ 13 ] + c[ 14 ] + c[ 15 ] ).from( 2 ).to( 10 )
            }
            
            var x = i % 64 * s
            var y = Math.floor( i / 64 ) * s
            ctx.putImageData( id, x, y )
        })
    }

    convertBase(num) {
        return { from : function (baseFrom) { return { to : function (baseTo) { return parseInt(num, baseFrom).toString(baseTo); } } } }
    }
}

export { Covid as default }