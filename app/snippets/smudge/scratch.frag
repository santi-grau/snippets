uniform float time;
uniform float seed;
uniform vec2 size;

const float PI = 3.1415926535897932384626433832795;
#pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec2 inc = vec2( 1.0 ) / size;
    float l = uv.x - inc.x;
    float r = uv.x + inc.x;
    float b = uv.y - inc.y;
    float t = uv.y + inc.y;

    vec4 position = texture2D( textureScratches, uv );
    vec3 lt = texture2D( textureScratches, vec2( l, t ) ).rgb;
    vec3 tt = texture2D( textureScratches, vec2( uv.x, t ) ).rgb;
    vec3 rt = texture2D( textureScratches, vec2( r, t ) ).rgb;
    vec3 ll = texture2D( textureScratches, vec2( l, uv.y ) ).rgb;
    vec3 rr = texture2D( textureScratches, vec2( r, uv.y ) ).rgb;
    vec3 lb = texture2D( textureScratches, vec2( l, b ) ).rgb;
    vec3 bb = texture2D( textureScratches, vec2( uv.x, b ) ).rgb;
    vec3 rb = texture2D( textureScratches, vec2( r, b ) ).rgb;
    
    vec3 cn = curlNoise( vec3( uv.x, uv.y, time ) * 0.25 );
    float n = smoothstep( 0.0, 1.0, snoise3( vec3( uv.x * 1000.0, uv.y * 1000.0, seed * 1000.0 ) ) );
    
    position.rgb = vec3( cn );

    

    gl_FragColor = position;
}