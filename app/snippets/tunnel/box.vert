attribute vec3 refs; // ring Id, segment Id, vertex Id, seed
uniform float time;
uniform vec2 bb;
uniform float segs;

varying vec2 vUv;
varying vec3 vNormal;
varying vec2 pUv;
varying vec3 vPos;

void main() {
	vec3 p = position;
	vUv = uv;
	vNormal = normal;
	vPos = position;
	

	pUv = vec2( 0.0, 0.0 );
	if( normal.y > 0.0 ) pUv.x = uv.x * bb.x / ( ( bb.x + bb.y ) * 2.0 );
	if( normal.x > 0.0 ) pUv.x = bb.x / ( ( bb.x + bb.y ) * 2.0 ) + (1.0 - uv.y ) * bb.y / ( ( bb.x + bb.y ) * 2.0 );
	if( normal.y < 0.0 ) pUv.x = 0.5 + ( 1.0 - uv.x ) * bb.x / ( ( bb.x + bb.y ) * 2.0 );
	if( normal.x < 0.0 ) pUv.x = 0.5 + bb.x / ( ( bb.x + bb.y ) * 2.0 ) + uv.y * 0.25 * ( bb.x + bb.y ) / bb.y;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}