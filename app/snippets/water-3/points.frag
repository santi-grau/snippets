void main() {
	

	float c = smoothstep( 0.1, 0.5, 1.0 - length( gl_PointCoord.xy - vec2( 0.5 ) ) * 2.0 );

	gl_FragColor = vec4( vec3 ( 1.0 ), c );
}