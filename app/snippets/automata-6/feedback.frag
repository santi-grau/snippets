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


float sdEquilateralTriangle( in vec2 p){
    const float k = sqrt( 3.0 );
    p.x = abs( p.x ) - 1.0;
    p.y = ( p.y ) + 1.0 / k;
    if( p.x + k * p.y > 0.0 ) p = vec2( p.x - k * p.y, -k * p.x - p.y ) / 2.0;
    p.x -= clamp( p.x, -2.0, 0.0 );
    return -length( p ) * sign( p.y );
}

vec3 sdEquilateralTriangleDirectional( in vec2 p){
    vec3 outc = vec3( 0.0 );
    const float k = sqrt( 3.0 );
    p.x = abs( p.x ) - 1.0;
    p.y = ( p.y ) + 1.0 / k;
    if( p.x + k * p.y > 0.0 ){
        p = vec2( p.x - k * p.y, -k * p.x - p.y ) / 2.0;
    } else {
        outc.y = 1.0;
    }
    p.x -= clamp( p.x, -2.0, 0.0 );
    float pre = -length( p ) * sign( p.y );
    outc.x = pre;
    return outc;
}

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

    vec2 inc = vec2( 2.0 ) / size;
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

    float rand = smoothstep( 0.5, 0.5, ( snoise3( vec3( uv.x, seed , uv.y ) * 512.0 ) + 1.0 ) * 0.5 );

    vec2 st = gl_FragCoord.xy / size;
    vec3 color = vec3(.0);

    float d = sdEquilateralTriangle( ( uv - vec2( 0.5 ) ) * 1.0 ) + 0.5;
    float gen = smoothstep( 1.0, 1.0, 1.0 - d ) * rand;

  
    float nnn = ( snoise2( vec2( d * 1.5, time * 0.5 + seed * 100.0 ) ) + 1.0 ) * 0.5;
    vec3 ooo = sdEquilateralTriangleDirectional( ( uv - vec2( 0.5 ) ) * 1.0 ) + 0.5;

    float ttt[8];
    decode( ttt, floor( 0.0 + nnn * 256.0 )  );
    if( ooo.g > 0.5 ){
        
        // if( lt.r == 0.0 && tt.r == 0.0 && rt.r == 0.0 ) k = ttt[0];
        if( lt.r == 0.0 && tt.r == 0.0 && rt.r == 1.0 ) k = ttt[1];
        if( lt.r == 0.0 && tt.r == 1.0 && rt.r == 0.0 ) k = ttt[2];
        if( lt.r == 1.0 && tt.r == 0.0 && rt.r == 0.0 ) k = ttt[3];
        if( lt.r == 0.0 && tt.r == 0.0 && rt.r == 1.0 ) k = ttt[4];
        if( lt.r == 1.0 && tt.r == 0.0 && rt.r == 1.0 ) k = ttt[5];
        if( lt.r == 1.0 && tt.r == 1.0 && rt.r == 0.0 ) k = ttt[6];
        if( lt.r == 1.0 && tt.r == 1.0 && rt.r == 1.0 ) k = ttt[7];

    } else {
        // decode( ttt, floor( nnn * 255.0 )  );
        if( uv.x > 0.5 ){
            // if( lt.r == 0.0 && ll.r == 0.0 && lb.r == 0.0 ) k = ttt[0];
            if( lt.r == 0.0 && ll.r == 0.0 && lb.r == 1.0 ) k = ttt[1];
            if( lt.r == 0.0 && ll.r == 1.0 && lb.r == 0.0 ) k = ttt[2];
            if( lt.r == 1.0 && ll.r == 0.0 && lb.r == 0.0 ) k = ttt[3];
            if( lt.r == 0.0 && ll.r == 0.0 && lb.r == 1.0 ) k = ttt[4];
            if( lt.r == 1.0 && ll.r == 0.0 && lb.r == 1.0 ) k = ttt[5];
            if( lt.r == 1.0 && ll.r == 1.0 && lb.r == 0.0 ) k = ttt[6];
            if( lt.r == 1.0 && ll.r == 1.0 && lb.r == 1.0 ) k = ttt[7];
        } else {
            // if( rt.r == 0.0 && rr.r == 0.0 && rb.r == 0.0 ) k = ttt[0];
            if( rt.r == 0.0 && rr.r == 0.0 && rb.r == 1.0 ) k = ttt[1];
            if( rt.r == 0.0 && rr.r == 1.0 && rb.r == 0.0 ) k = ttt[2];
            if( rt.r == 1.0 && rr.r == 0.0 && rb.r == 0.0 ) k = ttt[3];
            if( rt.r == 0.0 && rr.r == 0.0 && rb.r == 1.0 ) k = ttt[4];
            if( rt.r == 1.0 && rr.r == 0.0 && rb.r == 1.0 ) k = ttt[5];
            if( rt.r == 1.0 && rr.r == 1.0 && rb.r == 0.0 ) k = ttt[6];
            if( rt.r == 1.0 && rr.r == 1.0 && rb.r == 1.0 ) k = ttt[7];
        }
    }
    
    if( smoothstep( 1.0, 1.0, 1.0 - d ) > 0.0 ) k = gen;

    gl_FragColor = vec4( vec3( k ), 1.0 );
}