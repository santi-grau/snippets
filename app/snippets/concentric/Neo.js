import { Mesh, RingBufferGeometry, Float32BufferAttribute, ShaderMaterial, Vector3 } from 'three'
import outShader from './out.*'

class Neo extends Mesh{
    constructor(){
        super()

        this.isBeating = false
        this.isActive = true
        var rings = 3, res = 127, ids = []
        this.geometry = new RingBufferGeometry( 0.1, 0.5, res, rings )
        for( var i = 0 ; i <= rings ; i++ ) for( var j = 0 ; j <= res ; j++ ) ids.push( i / rings, j / res )
        this.geometry.setAttribute( 'ids', new Float32BufferAttribute( ids, 2 ) )

        this.material = new ShaderMaterial({
            uniforms : {
                data : { value : null },
                animation : { value : 1.0 },
                baseColor : { value : new Vector3( 0, 0, 0 ) }
            },
            vertexShader : outShader.vert, 
            fragmentShader : outShader.frag,
            wireframe : true,
            transparent : true
        })
    }
}

export { Neo as default }