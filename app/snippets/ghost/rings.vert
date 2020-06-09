attribute vec3 refs; // ring Id, segment Id, vertex Id, seed
uniform float rings;
uniform float time;

varying vec3 vRefs;

const float PI = 3.1415926535897932384626433832795;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ)

void main() {
	vec3 p = position;
	vRefs = refs;
	p.xy = vec2( cos( PI * 2.0 * refs.y ), sin( PI * 2.0 * refs.y ) );

	float n = ( snoise3( vec3( p.x * 0.5, p.y * 1.5, refs.x - time * 0.0005 ) ) ) ;
	float n2 = ( snoise2( vec2( 0.5, refs.x - time * 0.0003 ) ) ) ;

	p.xy *= 1.0 + n * 0.6 * refs.x;
	p.xy *= 95.0 + refs.z * 0.35;
	
	// p = rotateZ( p, PI * refs.x + time * 0.001 );

	p.xy *= 1.0 + refs.x * 1.2;
	p.x -= n2 * 195.0 * smoothstep( 0.0, 0.5, refs.x );
	p.y += refs.x * rings * 2.0 - 100.0;

	
	// p.x = cos( PI * 2.0 * refs.y ) * ( 100.0 + refs.z * 0.5 );
	// p.y = sin( PI * 2.0 * refs.y ) * ( 100.0 + refs.z * 0.5 ) + refs.x * rings * 1.5;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}