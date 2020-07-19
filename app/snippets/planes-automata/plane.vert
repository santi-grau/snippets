attribute vec2 refs; // ring Id, segment Id, vertex Id, seed
uniform float time;
varying vec2 vRefs;


const float PI = 3.1415926535897932384626433832795;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ)

void main() {
	vec3 p = position;
	vRefs = refs;

	float n4 = snoise2( vec2( 10.0, time * 0.2 + 200.0 ) );
	p.xy *= 0.6;

	float n = snoise2( vec2( time * 0.1, 0.5 ) );
	p = rotateZ( p, PI * 2.0 * n );

	float n2 = snoise2( vec2( time * 0.2, 1.0 ) );
	p.y += n2 * 2.0;

	float n3 = snoise2( vec2( 0.0, -time * 0.2 + 300.0 ) );
	p.x += n3 * 1.0;


	

	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}