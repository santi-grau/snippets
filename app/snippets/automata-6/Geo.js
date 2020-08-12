import { Mesh, BufferGeometry, BufferAttribute, Points, MeshBasicMaterial, PointsMaterial, Group, ShaderMaterial } from 'three'
import Shader from './triangles.*'
class Geo extends Group{
    constructor( res ){
        super()

        var vs = [], pos = [], index = [], ids = []
        
        for( var i = 0 ; i < res + 1 ; i++ ){
            for( var j = 0 ; j < res + 1 ; j++ ){
                var x = i / ( res ) - 0.5
                var y = j / ( res ) - 0.5
                if( j % 2 == 0 ) x -= ( 1 / ( res ) ) * 0.5

                pos.push( { x : x, y : y } )
                
                if( j % 2 == 0 && i < res && j < res ) {
                    var px = ( i * 2 ) / ( res * 2 - 1 )
                    var py = j / ( res - 1 )
                    index.push( i * ( res + 1 ) + j, ( i + 1 ) * ( res + 1 ) + j, i * ( res + 1 ) + j + 1 )
                    ids.push( px, py, 1, px, py, 1, px, py, 1 )
                }

                if( j % 2 !== 0 && i < res && j < res ) {
                    var px = ( i * 2 ) / ( res * 2 - 1 )
                    var py = j / ( res - 1 )
                    index.push( i * ( res + 1 ) + j + 1, i * ( res + 1 ) + j, ( i + 1 ) * ( res + 1 ) + j + 1 )
                    ids.push( px, py, 0, px, py, 0, px, py, 0 )
                }

                if( j % 2 == 0 && i < res && j < res ) {
                    var px = ( i * 2 + 1 ) / ( res * 2 - 1 )
                    var py = j / ( res - 1 )
                    index.push( ( i + 1 ) * ( res + 1 ) + j, ( i + 1 ) * ( res + 1 ) + j + 1, i * ( res + 1 ) + j + 1 )
                    ids.push( px, py, 0, px, py, 0, px, py, 0 )
                }

                if( j % 2 !== 0 && i < res && j < res ) {
                    var px = ( i * 2 + 1 ) / ( res * 2 - 1 )
                    var py = j / ( res - 1 )
                    index.push( ( i + 1 ) * ( res + 1 ) + j, ( i + 1 ) * ( res + 1 ) + j + 1, i * ( res + 1 ) + j )
                    ids.push( px, py, 1, px, py, 1, px, py, 1 )
                }
            }
        }

        index.forEach( i => vs.push( pos[ i ].x, pos[ i ].y, 0 ) )

        var geometryFull = new BufferGeometry()
        geometryFull.setAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) )
        geometryFull.setAttribute( 'ids', new BufferAttribute( new Float32Array( ids ), 3 ) )
        
        
        var mat = new ShaderMaterial( {
            uniforms : {
                tex : { value : null }
            },
            vertexShader : Shader.vert,
            fragmentShader : Shader.frag
        } )
        this.mesh = new Mesh( geometryFull, mat )
        this.add( this.mesh )
    }
}

export { Geo as default }