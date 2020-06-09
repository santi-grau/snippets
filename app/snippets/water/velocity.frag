uniform sampler2D levelTexture;

vec4 compute( vec2 point1 )	{

    vec2 cellSize = vec2( 1.0 / 128.0 );

    float waterLevel = texture2D( levelTexture, point1 ).x;

    vec3 n = vec3(
        ( texture2D( levelTexture, point1 + vec2( - cellSize.x, 0 ) ).x - texture2D( levelTexture, point1 + vec2( cellSize.x, 0 ) ).x ),
        ( texture2D( levelTexture, point1 + vec2( 0, - cellSize.y ) ).x - texture2D( levelTexture, point1 + vec2( 0, cellSize.y ) ).x ),
        0.0
    ) * 1.0 / 512.0;
    
    n = normalize( n ) * 0.5;

    return vec4( waterLevel, n.x, n.y, 0.0 );
}

void main() {

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
    vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;
    vec3 waterLevel = compute( selfPosition.xy ).xyz;
    vec3 waterNormal = vec3( waterLevel.y, waterLevel.z, 0.0 ) * 0.1 / 512.0;
    selfVelocity += waterNormal;
    selfVelocity.xy *= 0.99;

    if ( selfPosition.x < 0.0 ) selfVelocity.x = 0.001;
    if ( selfPosition.y < 0.0 ) selfVelocity.y = 0.001;
    if ( selfPosition.x > 1.0 ) selfVelocity.x = -0.001;
    if ( selfPosition.y > 1.0 ) selfVelocity.y = -0.001;
    
    gl_FragColor = vec4( selfVelocity, 1.0 );

}