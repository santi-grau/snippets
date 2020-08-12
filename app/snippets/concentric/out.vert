uniform float time;
varying vec3 vPos;

#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ) 
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d) 
#define M_PI 3.1415926535897932384626433832795

void main() {
    vec3 p = position.xyz;
    float n = snoise3( vec3( p * vec3( 1.0, 1.0, 0.3 ) - vec3( 0.0, 0.0, time * 0.2 ) ) ) * 0.4;
    p = rotateZ( p, n * M_PI * 2.0 );
    

    float n2 = snoise2( vec2( p.z * 0.2, time ) );
    p.xy *= 1.0 + n2 * 0.05;


    float n3 = snoise3( vec3( p * vec3( 0.2, 0.2, 0.1 ) - vec3( 100.0, -1000.0, -time ) ) );
    p.xy *= 1.0 + n3 * 0.1;
    p = rotateZ( p, -time );

    vPos = p;
    p.z *= 20.0;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}
