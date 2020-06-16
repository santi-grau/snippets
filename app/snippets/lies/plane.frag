uniform sampler2D tex;
uniform float fold;
uniform float dir;
varying vec2 vUv;


void main() {
    vec4 cout = texture2D( tex, vUv );

    float ramp = 1.0;
    float shade = 1.0;
    if( dir > 0.0 ) {
        ramp = smoothstep( 0.0, fold, vUv.y );
        shade -= fold * 0.5;
    } else {
        ramp = smoothstep( 0.0, fold, 1.0 - vUv.y );
        shade += fold * 0.1;
    }
    cout.rgb *= smoothstep( 0.0, fold, 0.6 + 0.4 * ramp ) * shade;



    gl_FragColor = cout;
}