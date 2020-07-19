uniform sampler2D heightmap;
uniform sampler2D debug;
varying vec3 vNormal;
varying vec2 vUv;

void main()	{
    gl_FragColor = vec4( vNormal, 1.0 );
}