varying vec3 vNormal;
varying vec4 vIds;
varying vec4 vData;
uniform sampler2D map;
uniform vec4 matData;

uniform float time;
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#define M_PI 3.1415926535897932384626433832795
#pragma glslify: hsv2rgb = require(glsl-y-hsv)

void main() {

    float objectIndex = vIds.x;
    float segment = vIds.y;
    float segmentIndex = vIds.z;
    float strokeIndex = vIds.w;
    
    float noise = ( snoise3( vec3( vData.x, segmentIndex, 0.5 ) * 0.01 ) + 1.0 ) / 2.0;
    
    vec3 cout = vec3( 0.0 );
    
    float a = 1.0;

    // index 0 ---> flat
    if( matData.x == 0.0 ) cout = matData.yzw;
    
    // index 1 ---> Normal
    if( matData.x == 1.0 ) cout = ( vNormal + vec3( 1.0 ) ) * 0.5;

    // index 2 ---> Rainbow
    if( matData.x == 2.0 ) {
        cout = vec3( hsv2rgb( vec3( floor( segmentIndex * 9.0 ) / 10.0, 1.0, 1.0 ) ) );
        
    }

    // index 3 ---> Edges
    if( matData.x == 3.0 ) cout = vec3( 1.0 - smoothstep( 0.02, 0.02, segmentIndex ) + smoothstep( 0.975, 0.975, segmentIndex ) );
    

    // index 4 ---> Stripes
    if( matData.x == 4.0 ) {
        if( matData.y == 0.0 ) cout = vec3( smoothstep( 0.59, 0.61, sin( M_PI * 2.0 + vData.x * 300.0 ) ) );
        else cout = vec3( smoothstep( 0.49, 0.51, sin( M_PI * ( -0.25 + segmentIndex * 30.0 ) ) ) );
    }

    // index 5 ---> Squares
    if( matData.x == 5.0 ) cout = vec3( smoothstep( 0.59, 0.61, sin( M_PI * 2.0 + vData.x * 300.0 ) ) ) * vec3( smoothstep( 0.49, 0.51, sin( M_PI * ( -0.25 + segmentIndex * 30.0 ) ) ) );

    // index 6 ---> Texture
    if( matData.x == 6.0 ) {
        cout = texture2D( map, vec2( segmentIndex, vData.x * 0.1 ) ).rgb;
        if( strokeIndex == 1.0 ) cout = vec3( 1.0 ) - cout;
    }

    // index 7 ---> Text
    if( matData.x == 7.0 ) {
        if( strokeIndex == 0.0 ) cout = texture2D( map, vec2( vData.x * 0.5 + time * 0.0002 , ( 1.0 - segmentIndex )  ) ).rgb;
        if( strokeIndex == 1.0 ) cout = texture2D( map, vec2( (vData.x * 0.5 + time * 0.0002 ) , ( segmentIndex )  ) ).rgb;
        cout += vec3( 1.0 - smoothstep( 0.02, 0.02, segmentIndex ) + smoothstep( 0.975, 0.975, segmentIndex ) );
        // if( strokeIndex == 1.0 ) cout += vec3( smoothstep( 0.02, 0.02, segmentIndex ) );
        
        a = cout.r;
    }

    // index 8 ---> Glitch
    // if( matData.x == 8.0 ) {
    //     cout = texture2D( map, vec2( segmentIndex, vData.x * noise ) ).rgb;
    // }

    // cout *= ( (vNormal.x + 0.5) * 2.0 + 0.65 ) + 0.35;

    gl_FragColor = vec4( cout, a );
}