attribute vec3 refs;
attribute vec2 glyphmap;


uniform vec2 scene;

uniform sampler2D posTex;
uniform sampler2D velTex;
uniform sampler2D seedTex;
uniform float time;

varying vec2 vUv;
varying float lifespan;
varying vec2 glyph;
varying vec3 vRefs;


#pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: rotate = require(glsl-rotate)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#define M_PI 3.1415926535897932384626433832795
const float HALF_PI = 1.570796327;

void main() {
	vec3 p = position;
    vUv = position.xy + vec2( 0.5 );
	glyph = glyphmap;
	vRefs = refs;
	vec4 positionSample = texture2D( posTex, refs.xy );
	vec4 velocitySample = texture2D( velTex, refs.xy );
	lifespan = positionSample.w;
	

	float n1 = snoise3( vec3( positionSample.x, positionSample.y, positionSample.z + time ) );
	vec3 axis = vec3( 1.0, 0.0, 0.0 );
    // p = rotate( p, axis, M_PI * 2.0 * n1 * smoothstep( velocitySample.w, 1.0, time ) );


	float n2 = snoise3( vec3( positionSample.z, positionSample.x, positionSample.z + time ) );
	vec3 axis2 = vec3( 0.0, 1.0, 0.0 );
    // p = rotate( p, axis2, M_PI * 2.0 * n2 * smoothstep( velocitySample.w, 1.0, time ) );

	p *= 2.0;
	p += vec3( 7.0, -7.0, 0.0 );
	p.xyz += positionSample.xyz * vec3( scene.x, scene.x, scene.x );
	// p.z = positionSample.z * scene.x * 0.5;

	

	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}