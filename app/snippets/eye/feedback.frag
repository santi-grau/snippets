uniform float time;
uniform float scroll;
uniform vec2 size;
precision highp float;

// vec3 rgb2hsv(vec3 c) {
//     vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
//     vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
//     vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

//     float d = q.x - min(q.w, q.y);
//     float e = 1.0e-10;
//     return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
// }

// vec3 hsv2rgb(vec3 c) {
//     vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//     vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//     return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
// }

const float PI = 3.1415926535897932384626433832795;
// #pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec2 inc = vec2( 1.0 ) / size;

    // vec4 cout = vec4( 1.0 );
    // inc *= 3.0;
    
    float l = uv.x - inc.x;
    float r = uv.x + inc.x;
    float b = uv.y - inc.y;
    float t = uv.y + inc.y;

    vec4 cc = texture2D( texturePosition, uv );
    vec4 lt = texture2D( texturePosition, vec2( l, t ) );
    vec4 tt = texture2D( texturePosition, vec2( uv.x, t ) );
    vec4 rt = texture2D( texturePosition, vec2( r, t ) );
    vec4 ll = texture2D( texturePosition, vec2( l, uv.y ) );
    vec4 rr = texture2D( texturePosition, vec2( r, uv.y ) );
    vec4 lb = texture2D( texturePosition, vec2( l, b ) );
    vec4 bb = texture2D( texturePosition, vec2( uv.x, b ) );
    vec4 rb = texture2D( texturePosition, vec2( r, b ) );

    float cout = 0.0;

    float n = snoise3( vec3( uv.x, uv.y, time * 0.01 ) * 10.0 );
    vec2 uvc = ( uv - 0.5 ) * vec2( 1.0, size.y / size.x );
    cout = 1.0 - smoothstep( 0.1, 0.1, length( uvc + n * 0.01 ) );

    vec2 dir = normalize( ( uv - 0.5 ) * 2.0 );
    float n2 = ( snoise3( vec3( dir.x, dir.y, time * 0.01 ) * 10.0 ) + 1.0 ) * 0.5;
    vec4 sample = texture2D( texturePosition, vec2( ( uv.x - dir.x * inc.x ) , ( uv.y - dir.y * inc.y ) ) );
    cout += sample.r * 0.9 + n2 * 0.1 ;


    // cout = cout / (1.0 + cout);
    // vec3 cn = curlNoise( vec3( uv.x * 0.5, uv.y * 0.5, scroll * 0.05 ) );

    // vec4 samp = texture2D( texturePosition, uv + vec2( cn.r, cn.b ) * inc );

    // // cout = cn;
    // cout += vec3( lt.r * 0.9, rt.g * 0.5, rt.b * 0.5 ) * cn.r;
    // cout += vec3( ( rr.r * 0.1, rt.g * 0.9, rr.b * 0.6 ) ) * cn.b;
    // cout += vec3( ( lb.r * 0.0, lb.g * 0.6, lb.b * 0.9 ) ) * cn.g;
    // if( cn.b > 0.5 ) cout +=  vec3( ( rr.r, ll.g, rb.b ) ) * cn.b;
    // else cout +=  vec3( ( tt.r, lt.g, lt.b ) ) * lb.g;
    
    // cout.r = clamp( 0.0, 1.0, cout.r ) * 0.9;
    // cout.g = clamp( 0.0, 1.0, cout.g ) * 0.9;
    // cout.b = clamp( 0.0, 1.0, cout.b ) * 0.9;
    
    // vec3 c = rgb2hsv( cout );
    
    // c.z = cn.b;
    vec4 position = vec4( vec3( cout ), 1.0 );
    // position = vec4( dir.x, dir.y, 0.0, 1.0 );

    

    gl_FragColor = position;
}