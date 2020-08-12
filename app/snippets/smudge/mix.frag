varying vec2 vUv;
uniform sampler2D texLeak;
uniform sampler2D texScratch;

const float PI = 3.1415926535897932384626433832795;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
    vec4 leak = texture2D( texLeak, vUv );
    vec4 scratch = texture2D( texScratch, vUv );

    vec3 cOut = vec3( 0.0 );
    cOut = hsv2rgb( vec3( 0.1 + leak.g * 0.3, 1.0, 1.0 ) );
    
    // 0.5, 0.5, 0.5		0.5, 0.5, 0.5	1.0, 0.7, 0.4	0.00, 0.15, 0.20
    // 
    vec3 ca = vec3( 0.5, 0.5, 0.5 );
    vec3 cb = vec3( 0.5, 0.5, 0.5 );
    vec3 cc = vec3( 1.0, 1.0, 1.0 );
    vec3 cd = vec3( 0.3, 0.2, 0.2 );
    
    cOut = ca + cb * cos( 2.0 * PI * ( cc * leak.r + cd ) );

    gl_FragColor = vec4( vec3( leak.b ), 1.0 );
}