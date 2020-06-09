import { BufferGeometry, ShaderMaterial, Mesh, BufferAttribute, TextureLoader, Vector2, Vector4, MeshBasicMaterial } from 'three'
import shaders from './planes.*'
// import letterTexture from './../assets/letters.png'

class Planes extends Mesh{
    constructor( tSize ){
        super( )

        var particleCount = tSize * tSize
        this.geometry = new BufferGeometry()
        var position = []
        var index = []
        var refs = []
        var offset = 0
        this.pulse = 0
        
        this.rotation.x = - Math.PI / 2;
        this.matrixAutoUpdate = false;
        this.updateMatrix();

        for( var i = 0 ; i < particleCount ; i++ ){
            offset = i * 4
            position.push( -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0 )
            index.push( offset, offset + 2, offset + 1, offset, offset + 3, offset + 2 )
            for( var j = 0 ; j < 4 ; j++ ) refs.push( ( i % tSize ) / tSize, ~ ~ ( i / tSize ) / tSize, i / particleCount )
        }

        

        this.geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( position ), 3 ) )
        this.geometry.setAttribute( 'refs', new BufferAttribute( new Float32Array( refs ), 3 ) )
        this.geometry.setIndex( new BufferAttribute( new Uint32Array( index ), 1 ) )
        
        // this.material = new MeshBasicMaterial({ wireframe : true })
        // let tex = new TextureLoader().load( letterTexture )
        this.material = new ShaderMaterial( {
            uniforms : {
                posTex : { value : null },
                res : { value : new Vector2( 512, 512 ) }
            },
            transparent : true,
            vertexShader: shaders.vert,
            fragmentShader: shaders.frag,
            depthTest : false,
            depthWrite : false
        } )
    }

    step( time ){
        // this.material.uniforms.time.value += 0.1;
    }
}

export { Planes as default }