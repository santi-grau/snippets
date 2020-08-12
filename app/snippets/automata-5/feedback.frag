uniform float time;
uniform sampler2D data;
uniform float seed;
uniform vec2 size;
uniform vec2 splits;
uniform vec2 move;

const float PI = 3.1415926535897932384626433832795;
#pragma glslify: curlNoise = require(glsl-curl-noise)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)


void decode(inout float array[8], float dec ){
    float r = dec;
    
    array[0] = ceil( mod( r, 2.0 ) );
    r = floor( r / 2.0 );
    array[1] = ceil( mod( r, 2.0 ) );
    r = floor( r / 2.0 );
    array[2] = ceil( mod( r, 2.0 ) );
    r = floor( r / 2.0 );
    array[3] = ceil( mod( r, 2.0 ) );
    r = floor( r / 2.0 );
    array[4] = ceil( mod( r, 2.0 ) );
    r = floor( r / 2.0 );
    array[5] = ceil( mod( r, 2.0 ) );
    r = floor( r / 2.0 );
    array[6] = ceil( mod( r, 2.0 ) );
    r = floor( r / 2.0 );
    array[7] = ceil( mod( r, 2.0 ) );
} 

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec2 inc = vec2( 1.0 ) / size;
    float l = uv.x - inc.x;
    float r = uv.x + inc.x;
    float b = uv.y - inc.y;
    float t = uv.y + inc.y;

    vec4 base = texture2D( data, uv );

    vec4 position = texture2D( texturePosition, uv );
    vec3 lt = texture2D( texturePosition, vec2( l, t ) ).rgb;
    vec3 tt = texture2D( texturePosition, vec2( uv.x, t ) ).rgb;
    vec3 rt = texture2D( texturePosition, vec2( r, t ) ).rgb;
    vec3 ll = texture2D( texturePosition, vec2( l, uv.y ) ).rgb;
    vec3 rr = texture2D( texturePosition, vec2( r, uv.y ) ).rgb;
    vec3 lb = texture2D( texturePosition, vec2( l, b ) ).rgb;
    vec3 bb = texture2D( texturePosition, vec2( uv.x, b ) ).rgb;
    vec3 rb = texture2D( texturePosition, vec2( r, b ) ).rgb;

    float k = position.r;
    
    vec2 scale = vec2( 1.0, 1.0 );
    float sections = ( snoise3( vec3( scale.x * floor(( uv.x + time * move.x ) * splits.x ) / splits.x, scale.y * floor( ( uv.y  + time * move.y ) * splits.y ) / splits.y , seed ) ) + 1.0 ) * 0.5;

    vec2 st = gl_FragCoord.xy / size;
    vec3 color = vec3(.0);

    float ttt[8];
    decode( ttt, floor( sections * 255.0 )  );
    if( lb.r == 0.0 && bb.r == 0.0 && rb.r == 0.0 ) k = ttt[0];
    if( lb.r == 0.0 && bb.r == 0.0 && rb.r == 1.0 ) k = ttt[1];
    if( lb.r == 0.0 && bb.r == 1.0 && rb.r == 0.0 ) k = ttt[2];
    if( lb.r == 1.0 && bb.r == 0.0 && rb.r == 0.0 ) k = ttt[3];
    if( lb.r == 0.0 && bb.r == 0.0 && rb.r == 1.0 ) k = ttt[4];
    if( lb.r == 1.0 && bb.r == 0.0 && rb.r == 1.0 ) k = ttt[5];
    if( lb.r == 1.0 && bb.r == 1.0 && rb.r == 0.0 ) k = ttt[6];
    if( lb.r == 1.0 && bb.r == 1.0 && rb.r == 1.0 ) k = ttt[7];
    

    

    gl_FragColor = vec4( vec3( k ) + base.rgb, 1.0 );
}