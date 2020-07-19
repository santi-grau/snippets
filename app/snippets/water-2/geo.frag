varying vec2 vUv;
varying vec3 vPos;
void main() {

	float cout = ( vPos.y + 200.0 ) / 200.0;
    gl_FragColor = vec4( vec3( cout ), 0.5 );
}