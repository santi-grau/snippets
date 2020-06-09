varying vec3 vRefs;
uniform vec3 col;

const float PI = 3.1415926535897932384626433832795;

void main() {

    float a = cos ( PI * 2.0 * vRefs.y  );

    gl_FragColor = vec4( vec3( 0.8 + a * 0.1 ), 1.0 - smoothstep( 0.3, 1.0, vRefs.x ) );
}