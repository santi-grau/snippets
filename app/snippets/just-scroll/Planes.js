import { BufferGeometry, ShaderMaterial, Mesh, BufferAttribute, TextureLoader, Vector2, Vector4, DoubleSide } from 'three'
import Shaders from './shaders/planes.*'
// import letterTexture from './letters2.png'

class Planes extends Mesh{
    constructor( tSize ){
        super( )

        var particleCount = tSize * tSize
        this.geometry = new BufferGeometry()
        var position = []
        var index = []
        var refs = []
        var gs = []
        var offset = 0
        this.pulse = 0
        
        for( var i = 0 ; i < particleCount ; i++ ){
            offset = i * 4
            position.push( -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0 )
            index.push( offset, offset + 2, offset + 1, offset, offset + 3, offset + 2 )
            for( var j = 0 ; j < 4 ; j++ ) refs.push( ( i % tSize ) / tSize, ~ ~ ( i / tSize ) / tSize, i / particleCount )
            gs.push( 
                0,0,0,0,0,0,0,0
            )
        }

        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( position ), 3 ) )
        this.geometry.setAttribute( 'refs', new BufferAttribute( new Float32Array( refs ), 3 ) )
        this.geometry.setAttribute( 'glyphmap', new BufferAttribute( new Float32Array( gs ), 2 ) )
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )
        
        // let tex = new TextureLoader().load( letterTexture )
        this.material = new ShaderMaterial( {
            uniforms : {
                // tex : { value : tex },
                posTex : { value : null },
                turbulence : { value : 0 },
                velTex : { value : null },
                seedTex : { value : null },
                scene : { value : new Vector2( window.innerWidth, window.innerHeight ) },
                time : { value : 0 }
            },
            transparent : true,
            vertexShader: Shaders.vert,
            fragmentShader: Shaders.frag,
            depthTest : false,
            depthWrite : false,
            side : DoubleSide
        } )
    }

    step( time ){
    }
}

export { Planes as default }