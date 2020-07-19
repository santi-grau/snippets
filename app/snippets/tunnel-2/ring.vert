attribute vec4 refs; // edge 0-1, angle, depth
uniform float time;
uniform float ramp;
varying vec4 vRefs;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ)
const float PI = 3.1415926535897932384626433832795;

void main() {
	vec3 p = position;
	vRefs = refs;
	float n = ( snoise3( vec3( p.x, p.y, time + refs.z * 2.0 ) * 1.0 ) + 1.0 ) * 0.5;

	float n2 = ( snoise3( vec3( p.y, -p.x, time ) ) + 1.0 ) * 0.5;
	
	// p.y += n2 * 0.1;
	// p.z *= 3.0;

	p = rotateZ( p, PI * 2.0 * refs.z * 0.2 + time  );
	if( refs.x == 0.0 ){
		p.xy *= 0.3 + n * 0.2 - ( 0.5 * refs.z * 2.0 ) * 0.2 ;
	}

	

	if( refs.x == 1.0 ){
		p.xy *= 2.;
	}

	p.z *= 2.0;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}