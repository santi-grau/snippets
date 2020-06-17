#pragma glslify: curlNoise = require(glsl-curl-noise)

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 velocity = texture2D( textureVelocity, uv );
    vec4 position = texture2D( texturePosition, uv );
    
    velocity.xyz = curlNoise( position.xyz * 0.8 ) * 1.0;
    

    gl_FragColor = velocity;
}