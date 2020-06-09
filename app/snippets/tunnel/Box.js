import { Vector2, Mesh, BufferGeometry, BufferAttribute, ShaderMaterial } from 'three'
import shader from './box.*'

class Box extends Mesh{
    constructor(){
        super()

        this.res = 4
        this.geometry = new BufferGeometry()
        var position = []
        var index = []
        var refs = []
        var o = 0

        for( var i = 0 ; i < this.res ; i++ ){
            var seed = Math.random()
            position.push( 1, 1, -i / this.res * 1, -1, 1, -i / this.res * 1, -1, -1, -i / this.res * 1, 1, -1, -i / this.res * 1 )
            refs.push( i / this.res, 0, seed, i / this.res, 1, seed, i / this.res, 2, seed, i / this.res, 3, seed )
            if( i > 0 ){
                index.push( i * 4, ( i - 1 ) * 4, i * 4 + 1 )
                index.push( i * 4 + 1, ( i - 1 ) * 4, ( i - 1 ) * 4 + 1 )
                
                index.push( i * 4 + 1, ( i - 1 ) * 4 + 1, i * 4 + 2 )
                index.push( i * 4 + 2, ( i - 1 ) * 4 + 1, ( i - 1 ) * 4 + 2 )

                index.push( i * 4 + 2, ( i - 1 ) * 4 + 2, i * 4 + 3 )
                index.push( i * 4 + 3, ( i - 1 ) * 4 + 2, ( i - 1 ) * 4 + 3 )

                index.push( i * 4 + 3, ( i - 1 ) * 4 + 3, i * 4 )
                index.push( i * 4, ( i - 1 ) * 4 + 3, ( i - 1 ) * 4  )
            }
        }
        

        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( position ), 3 ) )
        this.geometry.setAttribute( 'refs', new BufferAttribute( new Float32Array( refs ), 3 ) )
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )
        
        this.material = new ShaderMaterial( {
            uniforms : {
                time : { value : 0 },
                bb : { value : new Vector2( 1, 1 ) }
            },
            wireframe : true,
            transparent : false,
            vertexShader: shader.vert,
            fragmentShader: shader.frag
        } )
    }

    onResize( w, h ){
        this.material.uniforms.bb.value = new Vector2( w, h )
    }

    step( time ){
        // this.rotation.y -= 0.01
    }
}

export { Box as default }