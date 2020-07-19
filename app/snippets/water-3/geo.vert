varying vec2 vUv;
varying vec3 vPos;
uniform sampler2D tex;


void main() {
	vec3 p = position;
	vUv = uv;
	vec4 levels = texture2D( tex, vec2( uv.x, 1.0 - uv.y ) );
	p.y += levels.x * max( 0.0, min( 1.0, ( 1.0 - abs( p.y / 160.0 ) ) ) );
	vPos.y = p.y;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}