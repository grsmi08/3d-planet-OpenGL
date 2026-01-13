#version 330 core
in vec3 TexCoords;
out vec4 FragColor;

float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453123);
}

// Create a pseudo-random vec3 from an integer cell id
vec3 hash3(vec3 p) {
    return vec3(hash(p + vec3(1.0,2.0,3.0)), hash(p + vec3(4.0,5.0,6.0)), hash(p + vec3(7.0,8.0,9.0)));
}

// Layered tiny-star generator. 'scale' controls spatial frequency
// 'density' is probability (0..1) of a star in the cell (higher = more stars)
float starLayer(vec3 d, float scale, float density, float weight) {
    vec3 cellF = fract(d * scale);
    vec3 cellId = floor(d * scale);
    float rnd = hash(cellId);
    if (rnd > density) return 0.0;
    // Per-cell random offset to avoid grid pattern
    vec3 offs = hash3(cellId) - 0.5;
    // position inside cell in [-0.5,0.5]
    vec3 pos = cellF - 0.5 + offs * 0.25;
    float dist = length(pos);
    // radius scaled inversely with 'scale' so higher-frequency layers are smaller
    float r = 0.1 * (30.0 / scale);
    float intensity = clamp(1.0 - dist / r, 0.0, 1.0);
    // soften edges
    intensity = pow(intensity, 2.0);
    return intensity * weight;
}

void main() {
    vec3 d = normalize(TexCoords);
    float s = 0.0;
    // Many thin layers: more stars, smaller size
    s += starLayer(d, 30.0, 0.995, 1.0);
    s += starLayer(d, 60.0, 0.993, 0.9);
    s += starLayer(d, 120.0, 0.992, 0.6);
    s += starLayer(d, 240.0, 0.99, 0.4);
    s += starLayer(d, 480.0, 0.985, 0.3);
    s = clamp(s, 0.0, 1.0);
    vec3 base = vec3(0.0, 0.01, 0.03);
    vec3 starcol = vec3(1.0, 0.95, 0.9);
    vec3 col = base + starcol * pow(s, 1.3) * 1.25;
    FragColor = vec4(col, 1.0);
}