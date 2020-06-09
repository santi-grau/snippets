import { Mesh, ShapeBufferGeometry, MeshBasicMaterial, Object3D } from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'

class Star extends Object3D{
    constructor( px, py ){
        super()

        var svgLoader = new SVGLoader()
        var path = svgLoader.parse( '<svg xmlns="http://www.w3.org/2000/svg" width="260" height="245"><path d="M129,183.2L55,237l28.2-87L9,96h91.8L129,9c0,0,28.2,87,28.2,87H249l-74.2,54l28.2,87C203,237,129,183.2,129,183.2z"/></svg>' ).paths[ 0 ]
        
        this.transformGroup = new Object3D()
        this.add( this.transformGroup )

        var geometry = new ShapeBufferGeometry( path.toShapes( ), 1 )
        geometry.computeBoundingBox()
        geometry.center()
        var material = new MeshBasicMaterial( { color : 0xffffff } )
        var starMesh = new Mesh( geometry, material )
        this.transformGroup.add( starMesh )

        var scale = 1 / ( geometry.boundingBox.max.x - geometry.boundingBox.min.x )
        this.transformGroup.scale.set( scale, scale, scale )
        this.transformGroup.rotation.z = Math.PI

        this.scale.set( 19, 19, 19 )
        this.position.set( px, py, 0 )
    }
}

export { Star as default }