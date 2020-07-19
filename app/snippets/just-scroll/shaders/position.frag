uniform float time;
// void main()	{


//     vec2 uv = gl_FragCoord.xy / resolution.xy;
//     vec4 velocity = texture2D( textureVelocity, uv );
//     vec4 position = texture2D( texturePosition, uv );
	
// 	position.xyz += velocity.xyz * 0.016;
// 	position.w += 0.001;
//     if( position.w > 1.10 ) position = vec4( 0.0 );

//     gl_FragColor = position;
// }

// uniform float delta;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 position = texture2D( texturePosition, uv ).xyz;
	vec3 velocity = texture2D( textureVelocity, uv ).xyz;

	gl_FragColor = vec4( position + velocity * 0.016, 1.0 );
}