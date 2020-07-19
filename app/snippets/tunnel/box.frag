varying vec2 vUv;
varying vec3 vNormal;
varying vec2 pUv;
varying vec3 vPos;
uniform float segs;
uniform sampler2D map;
uniform float time;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
    
    float uvy = mod( vPos.z + 0.5 , 1.0 / segs ) * segs;
    float n = ( snoise3( vec3( floor( ( vPos.z ) * segs ) / segs * 10.0, 0.5, 0.5 ) ) );
    
    vec4 tout = texture2D( map, vec2( pUv.x + n * time , uvy ) * vec2( 20.0, 1.0  ) );
    
    // tout.rgb = vec3( n );
    tout *= vPos.z + 0.5;
    gl_FragColor = vec4( tout.rgb, 1.0 - abs( vNormal.z ) );
}