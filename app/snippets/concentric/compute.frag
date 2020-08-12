uniform sampler2D pos;
uniform float time;
uniform float beat;
uniform float intensity;
uniform float animation;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ) 
#define M_PI 3.1415926535897932384626433832795

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 position = texture2D( pos, uv ).rgb;

    vec4 p = vec4( 1.0 );

    vec2 ids = vec2( uv.y, uv.x );
  
    float oscMod = 1.05;

    if( ids.x < 0.25 ) {
        float mult00 = 1.0;
        float np00 = snoise3( vec3( position.x * mult00, position.y * mult00, time * 0.2 ) );
        float np01 = snoise2( vec2( ids.x, time * 0.1 ) );
        float np02 = snoise2( vec2( ids.x + 100.0, time * 0.1 ) );
        p.xy = position.xy / length( position.xy ) * 0.01;
        p.xy *= 1.0 + 0.1 * np00;
        p.x += np01 * 0.1;
        p.y += np02 * 0.1;
        float nr01 = snoise2( vec2( ids.x + 100.0, time * 0.1 ) );
        p.z = M_PI * 2.0 * nr01 * 0.1;
    }


    // ----------
    // c1       |
    // ----------
    if( ids.x >= 0.25 && ids.x < 0.5 ) {
        vec2 mult10 = vec2( 1.5, 3.0 );
        float np10 = snoise3( vec3( position.x * mult10.x - 100.0, position.y * mult10.y - 100.0, -time * 0.2 ) ) * oscMod;
        p.xy = position.xy / length( position.xy ) * 0.3;
        p.x *= 1.0 + 0.3 * np10;
        p.y *= 1.0 + 0.3 * np10;
        p.xy *= 1.0 + beat * intensity * 0.3;
        float nr11 = snoise2( vec2( ids.x - 100.0, time * 0.1 ) );
        p.z = M_PI * 2.0 * nr11 * 0.1;
        
    }

    // ----------
    // c2       |
    // ----------
    if( ids.x >= 0.5 && ids.x < 0.75 ) {
        float mult20 = 1.2;
        float np20 = snoise3( vec3( position.x * mult20 + 100.0, position.y * mult20 + 100.0, -time * 0.2 ) ) * oscMod;
        float np21 = snoise3( vec3( position.x * mult20 * 2.0 - 100.0, position.y * mult20 * 2.0 - 100.0, +time * 0.2 ) ) * oscMod;
        p.xy = position.xy / length( position.xy ) * 0.3;
        p.xy *= 1.0 + 0.3 * np20 * np21; 
        p.xy *= 1.0 + ( beat * intensity * 0.4 );
        float nr21 = snoise2( vec2( ids.x - 1000.0, time * 0.1 ) );
        p.z = M_PI * 2.0 * nr21 * 0.1;
    }

    // ----------
    // c3       |
    // ----------
    if( ids.x >= 0.75 ){
        float mult30 = 0.8;
        float np30 = snoise3( vec3( position.x * mult30 - 100.0 + time * 0.3, position.y * mult30 + 100.0, time * 0.3 ) ) * oscMod;
        p.xy = position.xy / length( position.xy ) * 0.5;
        p.xy *= 1.0 + 0.23 * np30;
        p.xy *= 1.0 + ( beat * intensity * 0.6 );
        float nr31 = snoise2( vec2( ids.x + 1000.0, time * 0.1 ) );
        p.z = M_PI * 2.0 * nr31 * 0.1;
    }
    
    p.xy *= animation;

    gl_FragColor = p;
}