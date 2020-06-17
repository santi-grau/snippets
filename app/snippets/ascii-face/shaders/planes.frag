uniform sampler2D tex;
varying vec2 vUv;
varying float lifespan;

varying vec2 glyph;

void main() {

    vec4 c = texture2D( tex, vUv * 0.2 + glyph * 0.2 );
    c.rgb = vec3( 1.0 );
    c.a *= lifespan;
    gl_FragColor = vec4( c );
}