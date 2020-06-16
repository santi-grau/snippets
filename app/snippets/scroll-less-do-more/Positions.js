import { DataTexture, RGBAFormat, FloatType, Vector3, Matrix4, NearestFilter, MathUtils } from 'three'
import EventEmitter from 'events'
import { Vector } from 'matter-js'

class DataStream extends EventEmitter {
    constructor( row, segments, streamId, loop ){
        super()
        this.id = streamId
        this.active = true
        this.row = row
        this.points = []
        this.frames = []
        this.length = 0
        this.index = 0
        this.segments = segments
        this.lazyBrush = 0.0
        this.loop = loop
    }

    addPoint( v, p ){
        if( this.index == this.segments - 1 && !this.loop ) return
        if( this.index == 0 ) {
            this.points.push( v )
            this.emit( 'update', this.row, 0, v, [ new Vector3( ),new Vector3( ) ], p, 0, 0 )
            this.index++
            return
        }
        this.addSegment( v, p )
    }

    addSegment( v, p ){
        
        var d = v.distanceTo( this.points[ this.index - 1 ] )
        if( d < this.lazyBrush ) return
       
        var dir = v.clone().sub( this.points[ this.index - 1 ] )
        var l = dir.length()
        var s = l - this.lazyBrush
        dir.setLength( s )

        var nv = this.points[ this.index - 1 ].clone().add( dir )
        this.points.push( nv )
        if( this.index > 0 ) {
            var frs = this.computeFrenetFrames( this.index )
            this.frames[ this.index ] = frs
            if( this.index == 1 ) this.frames[ 0 ] = frs
            this.emit( 'update', this.row, this.index, nv, frs, p, d, this.length )
        }

        this.length += l - this.lazyBrush
        
        if( this.index == this.segments - 1 ) {
            if( this.loop ){
                this.emit( 'offset', this.row )
                this.points.shift()
            }
        } else this.index++
        

        // console.log( this.index )
    }

    updateSegment( v, p, d ){
        this.emit( 'update', this.row, this.index, v, [new Vector3( ),new Vector3()], p, d, this.length )
    }

    getTangent( a, b ) {
        return new Vector3().subVectors( b, a ).normalize()
    }

    close(){
        setTimeout( () => { this.active = false }, 2000 )
    }

    step( time ){
        // console.log( 'stream ' + this.id + ' is open' )
    }

    computeFrenetFrames( ){
        var tmpVec = new Vector3(), lastNormal = new Vector3(), lastBinormal = new Vector3(), normal = new Vector3(), tangent = new Vector3(), binormal = new Vector3(), point = new Vector3(), mat = new Matrix4()
        var point0 = this.points[ 0 ]
        var point1 = this.points[ 1 ]

        var lastTangent = this.getTangent( point0, point1 )

        var absTangent = new Vector3( Math.abs( lastTangent.x ), Math.abs( lastTangent.y ), Math.abs( lastTangent.x ) )


        var min = 1.79769313e+308;

        var tmpNormal = new Vector3( 0.0, 0.0, 0.0 )

        if (absTangent.x <= min) {
            min = absTangent.x;
            tmpNormal.x = 1.0;
          }
          if (absTangent.y <= min) {
            min = absTangent.y;
            tmpNormal.y = 1.0;
          }
          if (absTangent.z <= min) {
            tmpNormal.z = 1.0;
          }


        tmpVec.crossVectors( lastTangent, tmpNormal ).normalize();
        lastNormal.crossVectors( lastTangent, tmpVec );
        lastBinormal.crossVectors( lastTangent, lastNormal );
        var lastPoint = point0

        var normals = [], tangents = [], binormals = []
        var maxLen = ( this.segments - 1.0 )
        var firstNormal = new Vector3()
        var firstTangent = new Vector3()
        var normal = new Vector3( );
        var tangent = new Vector3();
        var binormal = new Vector3();
        var point = new Vector3();
        var epSq = Number.EPSILON * Number.EPSILON;
        for ( var i = 1 ; i < maxLen ; i ++ ) {
           
        
           point = this.points[ i ]
           tangent = this.getTangent( lastPoint, point )
           normal = lastNormal
           binormal = lastBinormal
           tmpVec.crossVectors( lastTangent, tangent )

            if ( ( tmpVec.x * tmpVec.x + tmpVec.y * tmpVec.y + tmpVec.z * tmpVec.z) > epSq ) {
                tmpVec.normalize()
                var tangentDot = lastTangent.dot( tangent);
                var theta = Math.acos( Math.min( 1, Math.max( -1, tangentDot ) ) )
                normal.applyMatrix4( mat.makeRotationAxis( tmpVec, theta ) )
            }
            
            binormal.crossVectors( tangent, normal )
            normals.push( normal )
            tangents.push( tangent )
            binormals.push( binormal )
            if ( i >= this.index ) break
            lastPoint = point
            lastTangent = tangent
            lastNormal = normal
            lastBinormal = binormal
        }
    
        return [ tangent, binormal ]
	}
}

class Positions extends DataTexture{
    constructor( length = 256, rows = 256 ){
        super( new Float32Array( length * rows * 4 ), length, rows, RGBAFormat, FloatType )
        this.streams = []
        this.magFilter = NearestFilter
        this.minFilter = NearestFilter
        this.points = []
        this.index = 0  
        this.length = length
        this.row = 0
    }

    addPoint( stream, position, presure ){
        stream.addPoint( position, presure )
    }

    clearStream( n ){
        var offset = n * this.length * 4 * 4

        for( var i = 0 ; i < this.length * 16 * 4 ; i++ ) this.image.data[ offset + i ] = 0
        this.streams[ n ].points = []
        this.streams[ n ].frames = []
        this.streams[ n ].length = 0
        this.streams[ n ].index = 0
    }

    newDataStream( loop = false, segments = this.length ){
        var dataStream = new DataStream( this.row++, segments, this.streams.length, loop )
        dataStream.on( 'update', ( row, index, v, frs, p, d, length ) => this.update( row, index, v, frs, p, d, length ) )
        dataStream.on( 'offset', ( row, length ) => this.offsetRow( row, length ) )
        this.streams.push( dataStream )
        return dataStream
    }

    closeStream( stream ){
        this.streams[ stream.id ].close()
    }

    offsetRow( row ){
        var data = this.image.data
        var rowOffset = row * this.length * 4 * 4
        for( var i = 0 ; i < this.length  ; i++ ){
            data[ 0 + i * 4 + rowOffset ] = data[ 0 + ( i + 1 ) * 4 + rowOffset ]
            data[ 1 + i * 4 + rowOffset ] = data[ 1 + ( i + 1 ) * 4 + rowOffset ]
            data[ 2 + i * 4 + rowOffset ] = data[ 2 + ( i + 1 ) * 4 + rowOffset ]
            data[ 3 + i * 4 + rowOffset ] = data[ 3 + ( i + 1 ) * 4 + rowOffset ]
            
            data[ 0 + i * 4 + this.length * 4 + rowOffset ] = data[ 0 + ( i + 1 ) * 4 + this.length * 4 + rowOffset ]
            data[ 1 + i * 4 + this.length * 4 + rowOffset ] = data[ 1 + ( i + 1 ) * 4 + this.length * 4 + rowOffset ]
            data[ 2 + i * 4 + this.length * 4 + rowOffset ] = data[ 2 + ( i + 1 ) * 4 + this.length * 4 + rowOffset ]
            data[ 3 + i * 4 + this.length * 4 + rowOffset ] = data[ 3 + ( i + 1 ) * 4 + this.length * 4 + rowOffset ]

            data[ 0 + i * 4 + this.length * 4 * 2 + rowOffset ] = data[ 0 + ( i + 1 ) * 4 + this.length * 4 * 2 + rowOffset ]
            data[ 1 + i * 4 + this.length * 4 * 2 + rowOffset ] = data[ 1 + ( i + 1 ) * 4 + this.length * 4 * 2 + rowOffset ]
            data[ 2 + i * 4 + this.length * 4 * 2 + rowOffset ] = data[ 2 + ( i + 1 ) * 4 + this.length * 4 * 2 + rowOffset ]
            data[ 3 + i * 4 + this.length * 4 * 2 + rowOffset ] = data[ 3 + ( i + 1 ) * 4 + this.length * 4 * 2 + rowOffset ]

            data[ 0 + i * 4 + this.length * 4 * 3 + rowOffset ] = data[ 0 + ( i + 1 ) * 4 + this.length * 4 * 3 + rowOffset ]
            data[ 1 + i * 4 + this.length * 4 * 3 + rowOffset ] = data[ 1 + ( i + 1 ) * 4 + this.length * 4 * 3 + rowOffset ]
            data[ 2 + i * 4 + this.length * 4 * 3 + rowOffset ] = data[ 2 + ( i + 1 ) * 4 + this.length * 4 * 3 + rowOffset ]
            // data[ 3 + i * 4 + this.length * 4 * 3 + rowOffset ] = data[ 3 + ( i + 1 ) * 4 + this.length * 4 * 3 + rowOffset ]
        }

        // console.log( distance )
        // data[ 3 + ( this.length - 1 ) * 4 + this.length * 4 * 2 + rowOffset ] = data[ 3 + ( i + 1 ) * 4 + this.length * 4 * 2 + rowOffset ] + distance
        // data[ 2 + ( this.length - 1 ) * 4 + this.length * 4 * 3 + rowOffset ] = ( ( this.length - 1 ) / this.length )
    }

    update( row, index, v, frs, pressure, distance, length ){
        var data = this.image.data
        
        var rowOffset = row * this.length * 4 * 4
        data[ 0 + index * 4 + rowOffset ] = v.x
        data[ 1 + index * 4 + rowOffset ] = v.y
        data[ 2 + index * 4 + rowOffset ] = v.z
        data[ 3 + index * 4 + rowOffset ] = pressure
        
        data[ 0 + index * 4 + this.length * 4 + rowOffset ] = frs[ 0 ].x
        data[ 1 + index * 4 + this.length * 4 + rowOffset ] = frs[ 0 ].y
        data[ 2 + index * 4 + this.length * 4 + rowOffset ] = frs[ 0 ].z
        data[ 3 + index * 4 + this.length * 4 + rowOffset ] = distance
 
        data[ 0 + index * 4 + this.length * 4 * 2 + rowOffset ] = frs[ 1 ].x
        data[ 1 + index * 4 + this.length * 4 * 2 + rowOffset ] = frs[ 1 ].y
        data[ 2 + index * 4 + this.length * 4 * 2 + rowOffset ] = frs[ 1 ].z
        data[ 3 + index * 4 + this.length * 4 * 2 + rowOffset ] = length

        data[ 0 + index * 4 + this.length * 4 * 3 + rowOffset ] = 1
        data[ 1 + index * 4 + this.length * 4 * 3 + rowOffset ] = 0
        data[ 2 + index * 4 + this.length * 4 * 3 + rowOffset ] = 0
        data[ 3 + index * 4 + this.length * 4 * 3 + rowOffset ] = 0
        data[ 3 + ( this.length - 1 ) * 4 + this.length * 4 * 3 + rowOffset ] = ( ( index - 1 ) / this.length )
        
        if( index == 1 ) {
            data[ 0 + 0 * 4 + this.length * 4 + rowOffset ] = frs[ 1 ].x
            data[ 1 + 0 * 4 + this.length * 4 + rowOffset ] = frs[ 1 ].y
            data[ 2 + 0 * 4 + this.length * 4 + rowOffset ] = frs[ 1 ].z

            data[ 0 + 0 * 4 + this.length * 4 * 2 + rowOffset ] = frs[ 1 ].x
            data[ 1 + 0 * 4 + this.length * 4 * 2 + rowOffset ] = frs[ 1 ].y
            data[ 2 + 0 * 4 + this.length * 4 * 2 + rowOffset ] = frs[ 1 ].z
        }
        this.needsUpdate = true
    }

    step( time ){
        this.streams.forEach( s => { if( s.active ) s.step( time ) } )
    }
}

export { Positions as default }