uniform sampler2D levelTexture;

void main()	{

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 position = texture2D( texturePosition, uv ).xyz;
    vec3 velocity = texture2D( textureVelocity, uv ).xyz;

    vec3 level = texture2D( levelTexture, position.xy ).xyz;
    
    position += velocity;

    gl_FragColor = vec4( position, 1.0 );

}