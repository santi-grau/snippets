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

    gl_FragColor = position;
}