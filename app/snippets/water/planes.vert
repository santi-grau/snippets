attribute vec3 refs;

uniform sampler2D posTex;
uniform vec2 res;

varying vec2 vUv;


void main() {
	vec3 p = position;
    vUv = refs.xy;
    
    
	vec4 positionSample = texture2D( posTex, refs.xy );

    p.xy *= 4.0;
    p.z = positionSample.z;
	p.xy += ( positionSample.xy - vec2( 0.5 ) ) * res;
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}