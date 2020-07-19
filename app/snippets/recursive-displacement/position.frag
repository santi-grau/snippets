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
#pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec2 inc = vec2( 1.0 ) / size;
    float n3 =  snoise2( uv + vec2( 0.0, time  ) ) + 1.0 ;
    inc *= n3;
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

    
    float n = ( snoise2( uv + time * 0.1 ) + 1.0 ) * 0.5;
    float n2 = ( snoise2( uv * 1.0 ) );

    float cout = 0.0;
    float cout2 = 0.0;
    // float cout3 = 0.0;
    // float rp = 0.0;
    cout = lt.r * lb.r * n2;
    if( uv.x > 0.5 ) cout = ( lt.r + lb.r + ll.r ) / 3.0;
    else cout = ( rt.r + rb.r + rr.r ) / 3.0;
    cout2 = (lb.r + lb.r * n2) / 2.0;
    // cout3 = lb.r + lb.r;
    // else if( n > -0.3 && n < 0.5 ) m4.r + m1.r * n2;
    // else cout = m7.r + m3.r * n2;
    // float gp = m3.g + m4.r * n;
    // float bp = m5.r * 0.1 + m6.b * n;
    // rp += m;
    // gp += o;

    if( uv.x > 0.49 && uv.x < 0.51 ) cout = 1.0 - floor( ( snoise2( vec2( uv.y * 1.0, scroll * 0.01 ) ) + 1.0 ) );
    

    // cout *= 0.7;
    vec4 position = vec4( vec3( cout * 1.0  ), 1.0 );

    gl_FragColor = position;
}