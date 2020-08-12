attribute vec2 ids;
varying vec3 vPos;
varying vec4 cout;

uniform float time;
uniform float beat;
uniform float animation;
uniform float intensity;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ) 
#define M_PI 3.1415926535897932384626433832795

void main() {
    vec3 p = position;
    
    cout = vec4( 1.0 );

    // colors
    vec3 c1 = hsl2rgb( 0.7722222222, 1.0, 0.5 );
    vec3 c2 = hsl2rgb( 0.4694444444, 1.0, 0.5 );
    vec3 c3 = hsl2rgb( 0.0, 1.0, 0.35 );
    vec3 c4 = hsl2rgb( 0.08611111111, 1.0, 0.5 );
    
    float oscMod = 1.05;
    // ----------
    // c0       |
    // ----------
    if( ids.x == 0.0 ) {
        float mult00 = 1.0;
        float np00 = snoise3( vec3( position.x * mult00, position.y * mult00, time * 0.2 ) );
        float np01 = snoise2( vec2( ids.x, time * 0.1 ) );
        float np02 = snoise2( vec2( ids.x + 100.0, time * 0.1 ) );
        p.xy = position.xy / length( position.xy ) * 0.01;
        p.xy *= 1.0 + 0.1 * np00;
        p.x += np01 * 0.1;
        p.y += np02 * 0.1;
        vec3 p3dZ = rotateZ( position, M_PI * 2.0 * time);
        float st0 = ( p3dZ.y + length( position.xy ) ) / ( length( position.xy ) * 2.0 );
        cout.rgb = mix( c1, c2, st0 );
    }

    // ----------
    // c1       |
    // ----------
    if( ids.x == 1.0 / 3.0 ) {
        vec2 mult10 = vec2( 1.5, 3.0 );
        float np10 = snoise3( vec3( position.x * mult10.x - 100.0, position.y * mult10.y - 100.0, -time * 0.2 ) ) * oscMod;
        p.xy = position.xy / length( position.xy ) * 0.3;
        p.x *= 1.0 + 0.3 * np10;
        p.y *= 1.0 + 0.3 * np10;
        p.xy *= 1.0 + beat * intensity * 0.3;
        vec3 p3dZ = rotateZ( position, -M_PI * 2.0 * time * 0.1);
        float st0 = ( p3dZ.x + length( position.xy ) ) / ( length( position.xy ) * 2.0 );
        cout.rgb = mix( c3, c4, st0 );
    }

    // ----------
    // c2       |
    // ----------
    if( ids.x == 2.0 / 3.0 ) {
        float mult20 = 1.2;
        float np20 = snoise3( vec3( position.x * mult20 + 100.0, position.y * mult20 + 100.0, -time * 0.2 ) ) * oscMod;
        float np21 = snoise3( vec3( position.x * mult20 * 2.0 - 100.0, position.y * mult20 * 2.0 - 100.0, +time * 0.2 ) ) * oscMod;
        p.xy = position.xy / length( position.xy ) * 0.3;
        p.xy *= 1.0 + 0.3 * np20 * np21; 
        p.xy *= 1.0 + ( beat * intensity * 0.6 );
        // p.y *= 0.8;
        vec3 p3dZ = rotateZ( position, M_PI * 2.0 * time * 0.4 );
        float st0 = ( p3dZ.y + length( position.xy ) ) / ( length( position.xy ) * 2.0 );
        cout.rgb = mix( c2, c1, st0 );
    }

    // ----------
    // c3       |
    // ----------
    if( ids.x == 1.0 ){
        float mult30 = 0.8;
        float np30 = snoise3( vec3( position.x * mult30 - 100.0 + time * 0.3, position.y * mult30 + 100.0, time * 0.3 ) ) * oscMod;
        p.xy = position.xy / length( position.xy ) * 0.3;
        p.xy *= 1.0 + 0.23 * np30;
        p.xy *= 1.0 + ( beat * intensity * 0.6 );
        cout.a = 0.0;
        vec3 p3dZ = rotateZ( position, -M_PI * 2.0 * time * 0.2 );
        float st0 = ( p3dZ.x + length( position.xy ) ) / ( length( position.xy ) * 2.0 );
        cout.rgb = mix( c2, c1, st0 );
    }

    p.z = ( 1.0 - ids.x ) * 1.0;
    vPos = p;
    p.xy *= animation;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}
