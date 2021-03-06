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
    inc *= 1.0;
     
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

    gl_FragColor = cc;
}