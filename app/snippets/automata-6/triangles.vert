attribute vec3 ids;

varying vec2 vUv;
varying float type;

void main() {
	vUv = vec2( ids.x, ids.y );
    type = ids.z;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}