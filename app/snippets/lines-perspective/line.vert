uniform float time;
varying vec2 vUv;
varying vec3 vPos;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#pragma glslify: curlNoise = require(glsl-curl-noise)

void main() {
	vUv = uv;
	vec3 p = position;
	float nx = ( snoise3( vec3( position.x * 10.0, position.y,  position.z + time * 0.5 + 40.0  ) )  )  ;
	// float ny = ( snoise3( vec3( position.y, -position.x,  position.z - time * 0.5  ) ) )  ;
	// float nz = ( snoise3( vec3( -position.y - time * 0.5, -position.x,  -position.z  ) ) )  ;
	
	
	p.x += nx * 0.01;
	vec3 n2 = curlNoise( position * 0.79 + vec3( -time * 0.5, 0.0, time * 0.2  ) );

	// p.xy += vec2( nx, ny ) * 0.1;
	// p.x += n2.x * 0.5;
	p.z = n2.z;
	
	vPos = p;

	// float n4 = snoise4( vec4( position.x, position.y, position.z, time ) );
	// p.z += n4;

	gl_PointSize = 5.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}