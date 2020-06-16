import { BufferGeometry, BufferAttribute, Mesh, ShaderMaterial, Vector2 } from 'three'
import waveShader from 'waves.*'

class Waves extends Mesh{
    constructor(){
        super()

        var res = 4
        var layers = 256
    
        var vs = [], index = [], refs = [], o = 0
        this.geometry = new BufferGeometry();
        
        for( var h = 0 ; h < layers ; h++ ){
            for( var i = 0 ; i < res ; i++ ){
                vs.push( i / ( res - 1 ) - 0.5, 1, -h / layers * 10 )
                if( i > 0 && i < res / 2 ) index.push( o + i, o + i - 1, o + res )
                if( i >= res / 2 ) index.push( o + i, o + i - 1, o + res + 1 )
                refs.push( h / layers )
            }
            vs.push( -0.5, 0, -h / layers * 10 )
            vs.push( 0.5, 0, -h / layers * 10 )
            refs.push( h / layers, h / layers )
            index.push( o + res / 2 - 1, o + res, o + res + 1  )

            o += ( res + 2 )
        }
        
        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( vs ), 3 ) )
        this.geometry.setAttribute( 'refs', new BufferAttribute( new Float32Array( refs ), 1 ) )
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )
        
        this.material = new ShaderMaterial( {
            uniforms : {
                time : { value : 0 },
                res : { value : layers },
                intensity : { value : 0 },
                scene : { value : new Vector2() }
            },
            vertexShader : waveShader.vert,
            fragmentShader : waveShader.frag,
            wireframe : false
        })
    }

    step( time ){
        // this.material.uniforms.time.value -= 0.01
    }
}

export { Waves as default }