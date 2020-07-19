varying vec2 vRefs;
uniform float time;
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: hsv2rgb = require(glsl-y-hsv)

void main() {
    float n = ( snoise2( vec2( time * 0.2, 0.5 ) ) + 1.0 ) * 0.5;

    vec3 rgb = hsv2rgb( vec3( n, 1.0, 1.0 ) );

    gl_FragColor = vec4( rgb, 1.0 );
}