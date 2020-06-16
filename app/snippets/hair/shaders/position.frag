uniform float time;
void main()	{


    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 velocity = texture2D( textureVelocity, uv );
    vec4 position = texture2D( texturePosition, uv );
	
	position.xyz += velocity.xyz * 0.016 * smoothstep( velocity.w, 1.0, time );
	position.w -= 0.005 * smoothstep( velocity.w, 1.0, time );

    gl_FragColor = position;
}