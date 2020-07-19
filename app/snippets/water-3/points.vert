uniform sampler2D tex;

void main() {
	vec3 p = position;

	vec4 levels = texture2D( tex, vec2( uv.x, 1.0 - uv.y ) );
	p.y = levels.x * 1.0;
	gl_PointSize = 8.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}