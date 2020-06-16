varying float vRefs;
varying vec3 vPos;
uniform float res;
uniform float intensity;
const float PI = 3.1415926535897932384626433832795;

void main() {
    float cout = 1.0 - mod( vRefs * res, 2.0 );
    
    gl_FragColor = vec4(  vec3( cout * ( 1.0 - ( vRefs * intensity ) * 0.4 ) ), 1.0 );
}