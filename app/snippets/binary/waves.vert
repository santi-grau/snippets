attribute float refs; // ring Id, segment Id, vertex Id, seed

const float PI = 3.1415926535897932384626433832795;
uniform float time;
uniform float res;
uniform float intensity;
uniform vec2 scene;
varying float vRefs;
varying vec3 vPos;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

void main() {
	vec3 p = position;
	vRefs = refs;
	
	// p.x *= scene.x;
	p.y *= ( refs + 1.0 / res ) ;
	// p.y *= (0.7 + ( 1.0 - intensity ) * 0.3);
	float n = snoise2( vec2( p.x * 1.5, refs * 2.0 + time ) );
	float n2 = ( snoise2( vec2( time, refs * 2.0 ) ) + 1.0 ) / 2.0;
	
	if( position.y > 0.0 ) p.y += ( n ) * p.y * 0.2 * intensity;
	p.x *= 1.0 + n2 * intensity;
	vPos = p;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}