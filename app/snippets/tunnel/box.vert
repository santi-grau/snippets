attribute vec3 refs; // ring Id, segment Id, vertex Id, seed
uniform float time;
uniform vec2 bb;

const float PI = 3.1415926535897932384626433832795;

void main() {
	vec3 p = position;
	
	p.xy *= bb.xy / 2.0;
	p.z *= 3.0;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}