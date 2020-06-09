uniform sampler2D heightmap;
uniform sampler2D debug;
varying vec3 vNormal;
varying vec2 vUv;

void main()	{
    vec3 c = vec3( ( vNormal.x + 1.0 ) * 0.5 );
    vec4 positionSample = texture2D( debug, vUv );
    gl_FragColor = vec4( vNormal, 1.0 );
}