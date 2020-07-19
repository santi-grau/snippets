uniform float time;
varying vec2 vUv;
varying vec3 vPos;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(glsl-y-hsv)

void main() {

    // float n = smoothstep( 0.5, 0.5, ( snoise3( vec3( vUv.x, vPos.z, -time ) * 50.0 ) + 1.0 ) * 0.5 );
    // float fade = 1.0 - length( vUv - vec2( 0.5 ) );
    float c = smoothstep( 0.1, 0.5, 1.0 - length( gl_PointCoord.xy - vec2( 0.5 ) ) * 2.0 );
    vec3 cout = hsv2rgb( vec3( vPos.x * 0.3 + 0.5 , 1.0, 0.9 ) );

    gl_FragColor = vec4( cout, c * (vPos.z + 1.0 ) );
    // gl_FragColor = vec4( 1.0, 1.0, 1.0, c * (vPos.z )  );
}