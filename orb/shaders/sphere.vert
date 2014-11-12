attribute vec4 position;
varying vec3 vNormal;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

void main() {
   gl_Position = projection * view * model * position;
   vNormal = normalize(position.xyz);
   gl_PointSize = 1.0;
}
