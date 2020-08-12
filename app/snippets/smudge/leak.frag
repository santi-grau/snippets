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
    
    vec3 cn = curlNoise( vec3( uv.x * 2.0, uv.y * 2.0, time ) * 0.2 );
    
    float n = smoothstep( 0.5, 1.0, snoise3( vec3( uv.x * 1000.0, uv.y * 1000.0, seed * 1000.0 ) ) );
    vec3 l1 = vec3( 0.0 );
    vec3 l2 = vec3( 0.0 );

    // if( time < 3.0 ){
        if(  uv.y < 0.01 ) l1 = cn;
        if( uv.y >= 0.01 )  l1 = ( lb + bb + rb + position.rgb ) / 3.99 + 0.05 * n;
        if( cn.g > 0.5 ) l1 = ( rr + rb + rt + l1 ) / 3.9;
        // else l1 = ( ll + lb + lt + l1 ) / 3.99;
        // 1 − ( 1 − A ) × ( 1 − B ) ---> screen
        position.rgb = l1 * 0.99;
    // }

    if( position.r + position.g + position.b > 3.0 ) position.rgb = vec3( 0.0 );
    

    

    gl_FragColor = position;
}