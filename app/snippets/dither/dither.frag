varying vec2 vUv;
uniform vec2 resolution;

void decode(inout float array[9], float dec ){
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
    r = floor( r / 2.0 );
    array[8] = ceil( mod( r, 2.0 ) );
} 

void main() {

    float def = 3.0;
    float res = 3.0;
    vec2 ruv = mod( vUv, 1.0 / def ) * def;

    // vec2 inc = vec2( 1.0 ) / size;
    // float l = uv.x - inc.x;
    // float r = uv.x + inc.x;
    // float b = uv.y - inc.y;
    // float t = uv.y + inc.y;


    float ttt[9];
    decode( ttt, floor( 259.0 )  );
    
    float cout = 0.0;
    if( vUv.x < 1.0 / 3.0 && vUv.y > 1.0 / 3.0 * 2.0 ) cout = ttt[8];
    if( vUv.x >= 1.0 / 3.0 && vUv.x < 1.0 / 3.0 * 2.0 && vUv.y > 1.0 / 3.0 * 2.0 ) cout = ttt[7];
    if( vUv.x >= 1.0 / 3.0 * 2.0 && vUv.y > 1.0 / 3.0 * 2.0 ) cout = ttt[6];
    
    gl_FragColor = vec4( vec3( cout ), 1.0 );
}