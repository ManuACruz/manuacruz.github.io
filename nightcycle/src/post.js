// Renders the scene small, then blows it up through a "robot camera" shader:
// lens bulge, colour fringing, grain, scanlines, dithering, glitches and static.

import * as THREE from 'three';

const VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D tScene;
uniform vec2 res;
uniform float time, exposure, glitch, staticAmt, fade, danger, distort, grain;
varying vec2 vUv;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }

vec3 aces(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

float bayer4(vec2 p) {
  ivec2 i = ivec2(mod(p, 4.0));
  int idx = i.x + i.y * 4;
  float m[16] = float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.);
  for (int k = 0; k < 16; k++) if (k == idx) return m[k] / 16.0;
  return 0.0;
}

void main() {
  vec2 c = vUv - 0.5;
  float r2 = dot(c, c);
  vec2 uv = 0.5 + c * (1.0 + distort * r2);

  if (glitch > 0.0) {
    float band = floor(uv.y * 48.0);
    float n = hash(vec2(band, floor(time * 24.0)));
    if (n < glitch * 0.35) uv.x += (hash(vec2(band, time)) - 0.5) * 0.12 * glitch;
  }

  // snap to the low-res pixel grid so the bulge keeps crisp pixels
  vec2 px = (floor(uv * res) + 0.5) / res;
  float ca = 0.0012 + r2 * 0.006 + glitch * 0.012;
  vec3 col;
  col.r = texture2D(tScene, px + c * ca).r;
  col.g = texture2D(tScene, px).g;
  col.b = texture2D(tScene, px - c * ca).b;

  col = aces(col * exposure);
  col = pow(col, vec3(1.0 / 2.2));

  vec2 pp = floor(uv * res);
  float t = floor(time * 30.0);
  col += (hash(pp + t) - 0.5) * grain;
  col *= 0.93 + 0.07 * sin(uv.y * res.y * 3.14159);

  float vig = smoothstep(0.95, 0.25, length(c * vec2(1.1, 1.0)) * 1.25);
  col *= mix(0.25, 1.0, vig);
  col = mix(col, col * vec3(1.0, 0.35, 0.3) + vec3(0.12, 0.0, 0.0) * (1.0 - vig), danger * (1.0 - vig * 0.85));

  // 6-bit-ish colour with ordered dithering
  float q = 48.0;
  col = floor(col * q + bayer4(pp)) / q;

  float s = hash(pp * 1.7 + vec2(t, t * 0.37));
  col = mix(col, vec3(s), staticAmt);
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) col = vec3(0.0);
  col *= 1.0 - fade;
  gl_FragColor = vec4(col, 1.0);
}
`;

export class Post {
  constructor(renderer) {
    this.renderer = renderer;
    this.pixel = 2.5;
    this.target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
    this.uniforms = {
      tScene: { value: this.target.texture }, res: { value: new THREE.Vector2(4, 4) },
      time: { value: 0 }, exposure: { value: 1 }, glitch: { value: 0 }, staticAmt: { value: 0 },
      fade: { value: 0 }, danger: { value: 0 }, distort: { value: 0.12 }, grain: { value: 0.045 },
    };
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms: this.uniforms, depthTest: false, depthWrite: false }));
    this.quad.frustumCulled = false;
    this.scene = new THREE.Scene();
    this.scene.add(this.quad);
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  setSize(w, h) {
    const rw = Math.max(64, Math.round(w / this.pixel)), rh = Math.max(48, Math.round(h / this.pixel));
    this.target.setSize(rw, rh);
    this.uniforms.res.value.set(rw, rh);
  }

  render(scene, camera, time) {
    this.uniforms.time.value = time;
    const r = this.renderer;
    r.setRenderTarget(this.target);
    r.render(scene, camera);
    r.setRenderTarget(null);
    r.render(this.scene, this.cam);
  }
}
