varying vec2 vUv;
varying float type;
uniform sampler2D tex;

void main()	{
    vec4 sample = texture2D( tex, vUv );
    gl_FragColor = vec4( sample.rgb, 1.0 );
}