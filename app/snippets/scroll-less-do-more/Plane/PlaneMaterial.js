import { ShaderMaterial, CanvasTexture, LinearFilter, RepeatWrapping, Vector3, TextureLoader, Vector4 } from 'three'
import textures from '././../../../assets/tex/*.jpg'
import vertexShader from './plane.vert'
import fragmentShader from './plane.frag'

class PlaneMaterial extends ShaderMaterial{
    constructor( positions ){
        super(  )
        
        this.uniforms = {
            data : { value : positions },
            rows : { value : 256 },
            light : { value : new Vector3( 0, 0, 1 ) },
            time : { value : 0 },
            map : { value : null },
            matData : { value : new Vector4( 0, 1, 1, 1 ) },
            geometryOptions : { value : new Vector4( 1, 0, 0, 0 ) } // width, ?, ?, ?
        }

        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader
        this.transparent = true
    }
}

class PlaneNormalMaterial extends PlaneMaterial{
    constructor( positions ){
        super( positions )
        this.uniforms.matData.value = new Vector4( 1, 0, 0, 0 )
    }
}

class PlaneRainbowMaterial extends PlaneMaterial{
    constructor( positions ){
        super( positions )
        this.uniforms.matData.value = new Vector4( 2, 1, 0, 0 )
    }
}

class PlaneEdgeMaterial extends PlaneMaterial{
    constructor( positions ){
        super( positions )
        this.uniforms.matData.value = new Vector4( 3, 1, 0, 0 )
    }
}

class PlaneStripeMaterial extends PlaneMaterial{
    constructor( positions ){
        super( positions )
        this.uniforms.matData.value = new Vector4( 4, 1, 0, 0 )
    }
}

class PlaneSquareMaterial extends PlaneMaterial{
    constructor( positions ){
        super( positions )
        this.uniforms.matData.value = new Vector4( 5, 0, 0, 0 )
    }
}

class PlaneGlitchMaterial extends PlaneMaterial{
    constructor( positions ){
        super( positions )

        var ts = Object.values( textures )
        var tLoader = new TextureLoader( )
        var map = tLoader.load( ts[ Math.floor( Math.random( ) * ts.length ) ] )
    
        map.wrapS = RepeatWrapping
        map.wrapT = RepeatWrapping

        this.uniforms.matData.value = new Vector4( 8, 0, 0, 0 )
        this.uniforms.map.value = map
    }

    step( time ){
        this.uniforms.time.value = time
    }
}

class PlaneTextureMaterial extends PlaneMaterial{
    constructor( positions ){
        super( positions )

        var ts = Object.values( textures )
        var tLoader = new TextureLoader( )
        var map = tLoader.load( ts[ Math.floor( Math.random( ) * ts.length ) ] )
    
        map.wrapS = RepeatWrapping
        map.wrapT = RepeatWrapping

        this.uniforms.matData.value = new Vector4( 6, 0, 0, 0 )
        this.uniforms.map.value = map
    }
}

class PlaneTextMaterial extends PlaneMaterial{
    constructor( positions, k ){
        super( positions )
        this.k = k
        
        this.canvas = document.createElement("canvas")
        this.canvas.width= 2048
        this.canvas.height = 256
        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = "40px IBM Plex Mono"
        this.ctx.fillStyle = "white"
        this.texture = new CanvasTexture( this.canvas )
        this.texture.wrapS = RepeatWrapping
        this.texture.wrapT = RepeatWrapping

        this.uniforms.matData.value = new Vector4( 7, 0, 0, 0 )
        this.uniforms.map.value = this.texture

        this.transparent = false
        this.depthTest = false
        this.depthWrite = false
    }

    step( time ){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = "120px IBM Plex Mono";
        this.ctx.fillStyle = "white";
        
        if( this.k == 0 ) this.ctx.fillText( "Scroll more →→→→ ", 0, 180 )
        if( this.k == 1 ) this.ctx.fillText( "Do less →→→→ ", 0, 180 )

        this.ctx.font = "40px IBM Plex Mono";
        // this.ctx.fillText( "..........................", 0, 80 )
        // this.ctx.fillText( "..........................", 0, 120 )
        // this.ctx.fillText( "012345678910111213121", 0, 160 )
        // this.ctx.fillText( "0123456789101112131415161718192021012345678910111213141516171819202100000000000000000", 0, 200 )
        // this.ctx.fillText( "Step → " + time.toFixed( 2 ), 0, 240 )
        this.texture.needsUpdate = true
        this.texture.minFilter = LinearFilter
        this.texture.maxFilter = LinearFilter

        this.uniforms.time.value = time
    }
}

export { PlaneGlitchMaterial, PlaneMaterial, PlaneNormalMaterial, PlaneTextureMaterial, PlaneTextMaterial, PlaneRainbowMaterial, PlaneEdgeMaterial, PlaneStripeMaterial, PlaneSquareMaterial }