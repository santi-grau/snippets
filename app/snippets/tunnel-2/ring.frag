varying vec4 vRefs;
uniform float res;
uniform float time;

const float PI = 3.1415926535897932384626433832795;
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: hsv2rgb = require(glsl-y-hsv)

void main() {
    
    // float cout = 1.0;
    
    
    // float n = smoothstep( 0.5, 0.5, ( snoise2( vec2( 0.5, vRefs.z * 100.0 ) ) + 1.0 ) * 0.5 );
    // gl_FragColor = vec4( vec3( cout * smoothstep( 0.0, 0.8, 1.0 - vRefs.z ) ), 0.7 );
    
    vec3 cout = hsv2rgb( vec3( ( 1.0 - vRefs.y) * 1.1 + 0.8,  0.2 + 0.8 * vRefs.y, 1.0 - vRefs.z - vRefs.x ) );

    // if( sin( PI * (vRefs.w ) ) > 0.0 ) cout *= 0.0;

    gl_FragColor = vec4( cout, 0.99 );
}