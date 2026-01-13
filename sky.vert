#version 330 core
layout(location = 0) in vec3 pos;
out vec3 TexCoords;
uniform mat4 view;
uniform mat4 proj;
void main() {
    TexCoords = pos;
    vec4 p = proj * mat4(mat3(view)) * vec4(pos, 1.0);
    gl_Position = p.xyww;
}