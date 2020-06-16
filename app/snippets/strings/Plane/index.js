import { Mesh, BufferGeometry, BufferAttribute, MeshStandardMaterial, Group } from 'three'
import * as mats from './PlaneMaterial'

// Materials                                        || Options
// 0 -> 'PlaneMaterial' -> Plain color              || x -> red, y -> green, z -> blue
// 1 -> 'PlaneNormalMaterial' -> Use normal         || x, y, z -> add to vector
// 2 -> 'PlaneRainbowMaterial' -> Makes a rainbow   || x -> Boolean hor or ver, y -> scale
// 3 -> 'PlaneEdgeMaterial' -> Draws lines on edges || x -> Boolean w/b or b/w
// 4 -> 'PlaneStripeMaterial' -> Draws stripes      || x -> Boolean hor or ver, y -> scale
// 5 -> 'PlaneSquareMaterial' -> Draws squares      || x-> Boolean w/b or b/w, y-> scale
// 6 -> 'PlaneTextMaterial' -> Some text            || x -> Boolean w/b or b/w, y -> transparent
// 7 -> 'PlaneTextureMaterial' 
// 8 -> 'PlaneAutomataMaterial' 
// 9 -> 'PlaneBrushMaterial' 

class Plane extends Group{
    constructor( positions, lineLength, index, materials = [ 'PlaneTextureMaterial', 'PlaneTextureMaterial' ], geometryOptions = {},  materialOptions = {} ){
        super()
        
        this.res = 2
        this.units = 2
        this.lineLength = lineLength
        this.tailDecay = 0
        this.positions = positions
        
        // console.log( lineLength / positions.length )

        for( var k = 0 ; k < this.units ; k++ ){            
            var geometry = new BufferGeometry()
            var vertices = [], indices = [], ids = [], tangent = [], normal = []
            
            for( var i = 0 ; i < lineLength ; i++ ){
                for( var j = 0 ; j < this.res ; j++ ){
                
                    vertices.push( 0, 0, 0 )
                    normal.push( 0, 0, 0, 0 )
                    tangent.push( 0, 0, 0, 0 )
                    ids.push( index, i / lineLength, j / ( this.res - 1 ), k )

                    if( i > 0 && j > 0 ) indices.push( this.res * i + j, this.res * ( i - 1 ) + j - 1, this.res * ( i - 1 ) + j, this.res * i + j - 1, this.res * ( i - 1 ) + j - 1, this.res * i + j )
                }
            }

            geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vertices ), 3 ) )
            geometry.setAttribute( 'ids', new BufferAttribute( new Float32Array( ids ), 4 ) )
            geometry.setAttribute( 'tangent', new BufferAttribute( new Float32Array( tangent ), 4 ) )
            geometry.setAttribute( 'normal', new BufferAttribute( new Float32Array( normal ), 4 ) )
            geometry.setIndex( indices )
            var mesh = new Mesh( geometry, new mats[ materials[ k ] ]( positions ) )
            mesh.frustumCulled = false
            
            if( geometryOptions.radius ) mesh.material.uniforms.geometryOptions.value.x = geometryOptions.radius
            if( geometryOptions.color ) mesh.material.uniforms.matData.value.y = geometryOptions.color.x
            if( geometryOptions.color ) mesh.material.uniforms.matData.value.z = geometryOptions.color.y
            if( geometryOptions.color ) mesh.material.uniforms.matData.value.w = geometryOptions.color.z
            if( geometryOptions.wireframe ) mesh.material.wireframe = true

            this.add( mesh )
        }
    }

    step( time ){
        this.children.forEach( m => {
            ( m.material.step ) && m.material.step( time ) 
            m.geometry.setDrawRange( 3 * Math.floor( m.geometry.index.array.length * ( this.tailDecay / 3 ) ) , m.geometry.index.array.length )
        })
    }
}

export { Plane as default }