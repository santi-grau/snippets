uniform sampler2D map;
varying vec2 vUv;

void main() {
    vec4 c = texture2D( map, mod( vUv, 0.05 ) * 20.0  );
    gl_FragColor = vec4( c.rgb, 1.0 );
}