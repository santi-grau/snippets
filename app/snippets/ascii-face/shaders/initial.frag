void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 initial = texture2D( textureInitial, uv );
    

    gl_FragColor = initial;
}