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

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec2 inc = vec2( 1.0 ) / size;
    float l = uv.x - inc.x;
    float r = uv.x + inc.x;
    float b = uv.y - inc.y;
    float t = uv.y + inc.y;

    vec4 position = texture2D( texturePosition, uv );
    vec3 lt = texture2D( texturePosition, vec2( l, t ) ).rgb;
    vec3 tt = texture2D( texturePosition, vec2( uv.x, t ) ).rgb;
    vec3 rt = texture2D( texturePosition, vec2( r, t ) ).rgb;
    vec3 ll = texture2D( texturePosition, vec2( l, uv.y ) ).rgb;
    vec3 rr = texture2D( texturePosition, vec2( r, uv.y ) ).rgb;
    vec3 lb = texture2D( texturePosition, vec2( l, b ) ).rgb;
    vec3 bb = texture2D( texturePosition, vec2( uv.x, b ) ).rgb;
    vec3 rb = texture2D( texturePosition, vec2( r, b ) ).rgb;

    // float n = 0.0;
    // n += floor( lt.r + 0.5 ) + floor( tt.r + 0.5 ) + floor( rt.r + 0.5 ) + floor( ll.r + 0.5 ) + floor( rr.r + 0.5 ) + floor( lb.r + 0.5 ) + floor( bb.r + 0.5 ) + floor( rb.r + 0.5 );

    
    float k = position.r;
    // position.g += 0.1;

    float noise = floor( ( snoise3( vec3( uv.x * 2.0, uv.y * 1.0, ramp ) ) + 1.0 ) * 0.5 + 0.5 );

    
    // vec3 n2 = floor( ( curlNoise( vec3( uv.x, uv.y, ramp ) ) + 1.0 ) * 0.5 + 0.5 );
    // random(floor(uv*150)) * PI / 2 + PI/4
    // if( n == 0.0 ){ k = 1.0; }
    // position.b = smoothstep( 0.0, 1.0, ( 1.0 - length( touch - uv ) ) ) * ramp;
    

    // if( position.b < 0.5  ){
        
    // }

    if( uv.x > touch.x ){
        if( noise > 0.5 ){
            if( lt.r == 0.0 && ll.r == 0.0 && lb.r == 0.0 ) k = 0.0;
            if( lt.r == 0.0 && ll.r == 0.0 && lb.r == 1.0 ) k = 0.0;
            if( lt.r == 0.0 && ll.r == 1.0 && lb.r == 0.0 ) k = 0.0;
            if( lt.r == 1.0 && ll.r == 0.0 && lb.r == 0.0 ) k = 1.0;
            if( lt.r == 1.0 && ll.r == 0.0 && lb.r == 1.0 ) k = 0.0;
            if( lt.r == 1.0 && ll.r == 1.0 && lb.r == 0.0 ) k = 1.0;
        } else {
            if( lt.r == 0.0 && ll.r == 0.0 && lb.r == 0.0 ) k = 0.0;
            if( lt.r == 0.0 && ll.r == 0.0 && lb.r == 1.0 ) k = 1.0;
            if( lt.r == 0.0 && ll.r == 1.0 && lb.r == 0.0 ) k = 0.0;
            if( lt.r == 1.0 && ll.r == 0.0 && lb.r == 0.0 ) k = 1.0;
            if( lt.r == 1.0 && ll.r == 0.0 && lb.r == 1.0 ) k = 0.0;
            if( lt.r == 1.0 && ll.r == 1.0 && lb.r == 0.0 ) k = 1.0;
        }
        // if( lt.r == 0.0 && ll.r == 0.0 && lb.r == 0.0 ) k = 0.0;
    }

    if( uv.x < touch.x ){
        
        // if( rt.r == 0.0 && rr.r == 0.0 && rb.r == 0.0 ) k = 0.0;
        if( rt.r == 0.0 && rr.r == 0.0 && rb.r == 1.0 ) k = 0.0;
        if( rt.r == 0.0 && rr.r == 1.0 && rb.r == 0.0 ) k = 1.0;
        if( rt.r == 1.0 && rr.r == 0.0 && rb.r == 0.0 ) k = 0.0;
        if( rt.r == 1.0 && rr.r == 0.0 && rb.r == 1.0 ) k = 0.0;
        if( rt.r == 1.0 && rr.r == 1.0 && rb.r == 0.0 ) k = 1.0;
        // if( rt.r == 0.0 && rr.r == 0.0 && rb.r == 0.0 ) k = 1.0;

        // if( rb.r == 0.0 && rr.r == 0.0 && rt.r == 1.0 ) k = 1.0;
    }

    // if( uv.y < touch.y ){
    //     if( lt.r == 1.0 && tt.r == 1.0 && rt.r == 1.0 ) k = 1.0;
    // }

    if( uv.y > touch.y ){
        // if( lb.r == 0.0 && bb.r == 0.0 && rb.r == 1.0 ) k = 1.0;
    }
    

    if( touching ){
        float t = smoothstep( 0.999, 0.999, ( 1.0 - length( touch - uv )  ) );
        k += t;
    }
    
    position.rgb = vec3( k );

    gl_FragColor = position;
}