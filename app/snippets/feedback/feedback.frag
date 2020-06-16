uniform float time;
uniform float scroll;
uniform vec2 size;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

const float PI = 3.1415926535897932384626433832795;
#pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec2 inc = vec2( 1.0 ) / size;

    // vec4 cout = vec4( 1.0 );
    inc *= 10.0;
     

    
    float n3 =  snoise2( -uv * 1.0 + vec2( 0.0, time * 0.1 ) ) ;
    
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

    // float sum = ( lt.r + tt.r + rt.r + ll.r + rr.r + lb.r + bb.r + rb.r ) / 8.0;

    // float ax = cos( PI * uv.y + scroll ) * inc.x;
    // float ay = inc.y;
    // vec4 samp = texture2D( texturePosition, uv + vec2( ax, ay ) );
    // vec4 samp2 = texture2D( texturePosition, uv + vec2( scroll * inc.x, uv.y ) );
    
    // float cout = samp.r;
    // float res = 64.0;
    // float originNoise = smoothstep( 0.5, 0.5, snoise2( vec2( uv.x * 10.0, uv.y + scroll ) ) );
    
    
    // float n = ( snoise2( uv + time * 0.01 ) + 1.0 ) * 0.5;
    
    // if( lt.r < 0.5 && tt.r > 0.5 ) cout = 1.0;
    // else {
    //     cout = 0.0;
    // }

    vec3 cout = vec3( 1.0 );

    vec3 cn = curlNoise( vec3( uv.x * 0.5, uv.y * 0.5, scroll * 0.01 ) );
    // cout = cn;
    cout += vec3( lb.r, tt.r, rb.r ) * cn.r;
    cout += vec3( (rb.r, lb.r, lb.r ) ) * cn.g;
    if( cn.b > 0.5 ) cout += bb.r * cn.b;
    else cout += lb.r * lb.g;
    // float m = 1.0;

    // float n = ( snoise2( uv + time * 0.01 ) + 1.0 ) * 0.5;
    // if( uv.y <= 0.5 ) cout = tt + lt;

    // float n = ( snoise2( uv + time * 0.01 ) + 1.0 ) * 0.5;
    // float n2 = ( snoise2( uv * 1.0 ) );

    // float cout = 0.0;
    // float cout2 = 0.0;
    // float cout3 = 0.0;
    // // float rp = 0.0;
    // cout = lt.r + lb.r ;
    // cout *= (rb.r + lb.r);
    // cout2 = lb.r * n2 + lb.r * n2;
    // cout3 = lb.r + lb.r;

    // if( uv.x > 0.499 && uv.x < 0.501 ) cout = 1.0 - floor( ( snoise2( vec2( uv.y * 100.0, time * 0.01) ) + 1.0 ) );
    // if( uv.x > 0.499 && uv.x < 0.501 ) cout2 = 1.0 - floor( ( snoise2( vec2( uv.y * 100.0, time * 0.1) ) + 1.0 ) );

    vec3 c = rgb2hsv( cout * 0.1 );
    c.x += cn.b;
    vec4 position = vec4( c, 1.0 );
    

    gl_FragColor = position;
}