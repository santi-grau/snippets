varying vec2 vUv;
varying vec3 vPos;
void main() {

	float cout = ( vPos.y + 300.0 ) / 300.0;
    cout *= 0.5 + 0.5 * smoothstep( 0.0, 0.8, abs( vUv.x ) * ( vPos.y + 300.0 ) / 300.0 );
    gl_FragColor = vec4( vec3( cout ), 0.8 );
}