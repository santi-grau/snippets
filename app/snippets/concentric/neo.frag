varying vec3 vPos;
varying vec4 cout;
uniform vec3 baseColor;
uniform float animation;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
    // vec3 baseColor = vec3( 0.1882352941, 0.0, 0.7960784314 );
    // vec3 baseColor = vec3( 1.0, 0.0, 0.0 );
    // baseColor = vec3( 0.8274509804, 0.0, 0.7921568627 );
    // baseColor = vec3( 0.0 );
    vec3 outColor = vec3( 0.0 );
    float outAlpha = cout.a;
    float centerRadius = 0.1;

    // 1 − ( 1 − A ) × ( 1 − B ) ---> scren
    outColor = vec3( 1.0 ) - ( ( vec3( 1.0 ) - cout.rgb ) * ( vec3( 1.0 ) - baseColor ) );

    float l = length( vPos.xy * vec2( animation ) );
    outAlpha *= smoothstep( centerRadius, centerRadius + ( 0.005 ), l );

    gl_FragColor = vec4( outColor, smoothstep( 0.0, 1.0, outAlpha ) );
}