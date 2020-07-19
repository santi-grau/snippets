varying vec2 vUv;
varying vec3 vPos;
void main() {

	float cout = 1.0 - length( vUv - vec2( 0.5 ) );
    gl_FragColor = vec4( vec3( 1.0 ), 1.0 );
}