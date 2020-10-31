uniform float time;
uniform float ramp;
uniform float seed;
uniform vec2 size;
uniform vec2 touch;
uniform bool touching;

const float PI = 3.1415926535897932384626433832795;
#pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

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

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec2 inc = vec2( 1.0 ) / size;
    float l = uv.x - inc.x;
    float r = uv.x + inc.x;
    float b = uv.y - inc.y;
    float t = uv.y + inc.y;

    vec4 position = texture2D( textureLeaks, uv );
    vec3 lt = texture2D( textureLeaks, vec2( l, t ) ).rgb;
    vec3 tt = texture2D( textureLeaks, vec2( uv.x, t ) ).rgb;
    vec3 rt = texture2D( textureLeaks, vec2( r, t ) ).rgb;
    vec3 ll = texture2D( textureLeaks, vec2( l, uv.y ) ).rgb;
    vec3 rr = texture2D( textureLeaks, vec2( r, uv.y ) ).rgb;
    vec3 lb = texture2D( textureLeaks, vec2( l, b ) ).rgb;
    vec3 bb = texture2D( textureLeaks, vec2( uv.x, b ) ).rgb;
    vec3 rb = texture2D( textureLeaks, vec2( r, b ) ).rgb;
    
    vec3 cn = curlNoise( vec3( 0.1, 0.1, time * 0.1 ) * 1.0 );
    
    float px = ( cn.g + 1.0 ) * 0.5;
    float py = 0.25 + 0.5 * ( cn.g + 1.0 ) * 0.5;
    float pz = ( cn.b + 1.0 ) * 0.5;

    float n = ( snoise3( vec3( uv.x * 10.0, py, time ) ) );
    
    float maxHeight = 0.05 + 0.01 * n;
    float pyl = min( maxHeight, min( pz * 0.5, min( py, 1.0 - py ) ) );

    float vey = smoothstep( py - 0.001 - pyl, py - pyl, uv.y ) - smoothstep( py + pyl, py + 0.0001 + pyl, uv.y );
    float vex = smoothstep( 0.249 + 0.1 * px, 0.25 + 0.1 * px, uv.x ) - smoothstep( 0.75 - 0.1 * px, 0.751 - 0.1 * px, uv.x );
    float emitter = vey * vex;

    vec3 cn2 = ( curlNoise( vec3( uv.x * 100.0, uv.y * 100.0, time * 0.1 ) * 1.0 ) + vec3( 1.0 ) ) * 0.5;

    float k1 = ( lt.r + tt.r + rt.r + ll.r + rr.r + lb.r + bb.r + rb.r ) / ( 8.0 - cn2.r * 0.2 );
    float k2 = ( lt.g + tt.g + rt.g + ll.g + rr.g + lb.g + bb.g + rb.g ) / ( 8.0 - cn2.g * 0.2 );
    float k3 = ( lt.b + tt.b + rt.b + ll.b + rr.b + lb.b + bb.b + rb.b ) / ( 8.0 - cn2.b * 0.2 );

    if( emitter > 0.0 ) position = vec4( vec3( ( cn + 1.0 ) * 0.5 ), 1.0 );
    else position = vec4( k1, k2, k3, position.a );

    position = clamp( position, 0.0, 1.0 );    

    gl_FragColor = position;
}