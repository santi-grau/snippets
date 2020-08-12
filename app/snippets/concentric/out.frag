uniform float time;
varying vec3 vPos;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
void main() {
    float outc = 1.0 + vPos.z;

    

    gl_FragColor = vec4( vec3( 1.0 ), outc * 0.5 );
}