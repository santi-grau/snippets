varying vec4 vRefs;
uniform float res;
uniform float time;

const float PI = 3.1415926535897932384626433832795;
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(glsl-y-hsv)

void main() {
    float n = ( snoise3( vec3( time, vRefs.y , vRefs.z * 1.0 ) ) + 1.0 ) * 0.5;
    vec3 cout = vec3( 1.0 );
    cout *= 0.5 + n * 0.5;
    
    
    // gl_FragColor = vec4( vec3( cout * smoothstep( 0.0, 0.8, 1.0 - vRefs.z ) ), 0.7 );
    
    // vec3 cout = hsv2rgb( vec3( ( 1.0 - vRefs.y ),  0.2 + 0.8 * vRefs.y,  vRefs.z  ) );
    gl_FragColor = vec4( cout, 1.0 );
}