attribute vec3 refs;

uniform sampler2D posTex;
uniform sampler2D heightmap;
uniform vec2 res;

varying vec2 vUv;


void main() {
	vec3 p = position;
    vUv = refs.xy;
    
    
	vec4 positionSample = texture2D( posTex, refs.xy );
	vec4 heightSample = texture2D( heightmap, positionSample.xy );

    p.xy *= 4.0;
    p.z = heightSample.x;
	p.xy += ( positionSample.xy - vec2( 0.5 ) ) * res;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}