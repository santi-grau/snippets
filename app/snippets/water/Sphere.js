import { Mesh, SphereBufferGeometry, MeshBasicMaterial, Vector3 } from 'three'

class Sphere extends Mesh{
    constructor( uvx, uvy ){
        super()
        console.log( uvx, uvy )
        this.geometry = new SphereBufferGeometry( 4, 24, 12 )
        this.material = new MeshBasicMaterial( { color: 0x0000ff } )

        this.position.x = ( Math.random() - 0.5 ) * 100
        this.position.z = ( Math.random() - 0.5 ) * 100

        this.userData.velocity = new Vector3();
    }
}

export { Sphere as default }