attribute vec4 ids;

uniform float time;
uniform sampler2D data;
uniform float rows;
uniform vec4 geometryOptions;

varying vec3 vNormal;
varying vec4 vIds;
varying vec4 vData; // normalized length

#define M_PI 3.1415926535897932384626433832795
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: rotateZ = require(glsl-rotate/rotateZ)

void main() {
   float objectIndex = ids.x;
   float segment = ids.y;
   float segmentIndex = ids.z;
   float strokeIndex = ids.w;

   float maxLength = texture2D( data, vec2( 1.0, ( 3.0 + objectIndex * 4.0 ) / ( rows * 4.0 ) ) ).w;
   float lutMaxd = min( segment * maxLength, maxLength );

   vec4 dataRow1 = texture2D( data, vec2( lutMaxd, ( 0.0 + objectIndex * 4.0 ) / ( rows * 4.0 ) ) );
   vec4 dataRow2 = texture2D( data, vec2( lutMaxd, ( 1.0 + objectIndex * 4.0 ) / ( rows * 4.0 ) ) );
   vec4 dataRow3 = texture2D( data, vec2( lutMaxd, ( 2.0 + objectIndex * 4.0 ) / ( rows * 4.0 ) ) );

   float radius = geometryOptions.x;
   vec3 cur = dataRow1.xyz;
  
   vec3 T = dataRow2.xyz;
   vec3 B = dataRow3.xyz;
   vec3 N = -normalize( cross( B, T ) );

   float presure = dataRow1.w;
   float speed = dataRow2.w;
   float dist = dataRow3.w;


   vData.x = dist;
   vData.y = dataRow3.z;

   vec3 p = position;

   float nx = ( snoise3( 0.005 * vec3( strokeIndex, dist * 10.1, 0.1 ) * 7.0 ) + 1.0 ) / 2.0;
   p.x = ( ( segmentIndex - 0.5 ) * cos( M_PI * strokeIndex ) ) * radius ;
   p.y = strokeIndex * 0.01;

   // p = rotateZ( p, M_PI * dist  );

   vNormal = normalize( B * 0.0 + N * 1.0 );
   vIds = ids;
   
   vec3 transformed = cur + B * p.x + N * p.y;
   
   gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );
}