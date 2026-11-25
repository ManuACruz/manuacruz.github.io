// The robot's camera. Two looks:
//  HD    — native resolution, 4x MSAA, bloom on bright things, fine grain, a touch of lens bulge.
//  Retro — the scene rendered small and blown up with dithering and scanlines.

import * as THREE from 'three';

const VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const BRIGHT = /* glsl */ `
uniform sampler2D tSrc;
uniform float threshold;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(tSrc, vUv).rgb;
  float l = max(c.r, max(c.g, c.b));
  gl_FragColor = vec4(c * smoothstep(threshold, threshold * 2.5, l), 1.0);
}`;

const BLUR = /* glsl */ `
uniform sampler2D tSrc;
uniform vec2 dir;
varying vec2 vUv;
void main() {
  vec3 c = texture2D(tSrc, vUv).rgb * 0.227027;
  c += texture2D(tSrc, vUv + dir * 1.3846).rgb * 0.316216;
  c += texture2D(tSrc, vUv - dir * 1.3846).rgb * 0.316216;
  c += texture2D(tSrc, vUv + dir * 3.2308).rgb * 0.070270;
  c += texture2D(tSrc, vUv - dir * 3.2308).rgb * 0.070270;
  gl_FragColor = vec4(c, 1.0);
}`;

const FINAL = /* glsl */ `
precision highp float;
uniform sampler2D tScene, tBloomA, tBloomB, tDirt;
uniform vec2 res, screen;
uniform float time, exposure, glitch, staticAmt, fade, danger, distort, grain, retro, bloom;
uniform float interf, blurX, pulse, desat, zoom, dropout;
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
  return m[idx] / 16.0;
}

vec3 sampleScene(vec2 px, vec2 c, float ca) {
  return vec3(texture2D(tScene, px + c * ca).r, texture2D(tScene, px).g, texture2D(tScene, px - c * ca).b);
}

void main() {
  vec2 c = (vUv - 0.5) * (1.0 - zoom);
  float r2 = dot(c, c);
  vec2 uv = 0.5 + c * (1.0 + (distort + pulse * 0.07) * r2);
  float tick = floor(time * 30.0);

  // Signal interference near the thing: lines tearing sideways, a band rolling up the picture, the frame hopping.
  float band = 0.0;
  if (interf > 0.0) {
    float row = floor(uv.y * 150.0);
    float tear = step(1.0 - interf * interf * 0.28, hash(vec2(row, tick)));
    uv.x += tear * (hash(vec2(row * 1.7, tick + 3.0)) - 0.5) * 0.07 * interf;
    float b = fract(uv.y * 0.55 - time * 0.21);
    band = smoothstep(0.0, 0.05, b) * smoothstep(0.16, 0.06, b) * interf;
    uv.x += band * sin(uv.y * 320.0 + time * 45.0) * 0.004;
    if (hash(vec2(tick, 7.0)) < interf * interf * 0.06) uv.y += (hash(vec2(tick, 9.0)) - 0.5) * 0.05;
  }

  if (glitch > 0.0) {
    float gb = floor(uv.y * 48.0);
    float n = hash(vec2(gb, floor(time * 24.0)));
    if (n < glitch * 0.35) uv.x += (hash(vec2(gb, time)) - 0.5) * 0.12 * glitch;
  }

  vec2 px = retro > 0.5 ? (floor(uv * res) + 0.5) / res : uv;
  float ca = (retro > 0.5 ? 0.0012 : 0.0006) + r2 * 0.005 + glitch * 0.012 + interf * 0.006 + pulse * 0.003;
  vec3 col;
  if (abs(blurX) > 0.0004) {
    // a fast turn smears the picture sideways (the sensor's rolling readout)
    col = vec3(0.0);
    for (int i = -3; i <= 3; i++) col += sampleScene(px + vec2(float(i) * blurX / 3.0, 0.0), c, ca);
    col /= 7.0;
  } else col = sampleScene(px, c, ca);
  // bloom, smeared by the grime on the lens
  float dirt = texture2D(tDirt, vUv).r;
  col += (texture2D(tBloomA, uv).rgb * 0.6 + texture2D(tBloomB, uv).rgb * 0.9) * bloom * (0.7 + dirt * 1.4);

  col = aces(col * exposure);
  col = pow(col, vec3(1.0 / 2.2));
  col = mix(col, vec3(dot(col, vec3(0.299, 0.587, 0.114))), desat);
  // the rolling band is brighter and noisy
  col += band * (0.05 + 0.12 * hash(floor(uv * screen * 0.5) + tick));

  // grain: per low-res pixel in retro, per screen pixel (and finer) in HD
  vec2 gp = retro > 0.5 ? floor(uv * res) : floor(uv * screen);
  float t = floor(time * 30.0);
  col += (hash(gp + t) - 0.5) * grain * (retro > 0.5 ? 1.0 : 0.55);
  if (retro > 0.5) col *= 0.93 + 0.07 * sin(uv.y * res.y * 3.14159);
  else col *= 0.985 + 0.015 * sin(uv.y * screen.y * 1.2 + time * 2.0);

  float vig = smoothstep(0.95, 0.25, length(c * vec2(1.1, 1.0)) * (1.25 + pulse * 0.45));
  col *= mix(0.25 - pulse * 0.15, 1.0, vig);
  col = mix(col, col * vec3(1.0, 0.35, 0.3) + vec3(0.12, 0.0, 0.0) * (1.0 - vig), danger * (1.0 - vig * 0.85));

  if (retro > 0.5) {
    float q = 48.0;
    col = floor(col * q + bayer4(floor(uv * res))) / q;
  }

  float s = hash(floor(uv * (retro > 0.5 ? res : screen * 0.5)) * 1.7 + vec2(t, t * 0.37));
  col = mix(col, vec3(s), staticAmt + interf * interf * 0.1);
  col *= 1.0 - dropout;   // the feed drops out for a frame
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) col = vec3(0.0);
  col *= 1.0 - fade;
  gl_FragColor = vec4(col, 1.0);
}
`;

// Grime on the lens: smudges, a thumbprint and specks. Only shows where bright light blooms across it.
function lensDirt() {
  const W = 320, H = 180, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  let a = 31;
  const r = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.filter = 'blur(6px)';
  for (let i = 0; i < 14; i++) {
    g.fillStyle = `rgba(255,255,255,${0.08 + r() * 0.18})`;
    g.beginPath(); g.ellipse(r() * W, r() * H, 10 + r() * 40, 6 + r() * 22, r() * 3, 0, 7); g.fill();
  }
  g.filter = 'blur(1.2px)';
  // a thumbprint, low left, where someone carried it
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 1.2;
  for (let k = 0; k < 9; k++) { g.beginPath(); g.ellipse(62, 132, 6 + k * 3.2, 8 + k * 4, 0.5, 0.3, 5.6); g.stroke(); }
  g.filter = 'none';
  for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.6})`; g.beginPath(); g.arc(r() * W, r() * H, 0.4 + r() * 1.4, 0, 7); g.fill(); }
  const t = new THREE.CanvasTexture(c);
  return t;
}

function quad(frag, uniforms) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false }));
  m.frustumCulled = false;
  const s = new THREE.Scene();
  s.add(m);
  return { scene: s, mat: m.material };
}

export class Post {
  constructor(renderer) {
    this.renderer = renderer;
    this.pixel = 1;
    const rt = (o = {}) => new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false, ...o });
    this.target = rt({ depthBuffer: true });
    this.half = [rt(), rt()];
    this.quarter = [rt(), rt()];
    this.uniforms = {
      tScene: { value: this.target.texture }, tBloomA: { value: this.half[0].texture }, tBloomB: { value: this.quarter[0].texture },
      res: { value: new THREE.Vector2(4, 4) }, screen: { value: new THREE.Vector2(4, 4) },
      time: { value: 0 }, exposure: { value: 1 }, glitch: { value: 0 }, staticAmt: { value: 0 },
      fade: { value: 0 }, danger: { value: 0 }, distort: { value: 0.1 }, grain: { value: 0.045 },
      retro: { value: 0 }, bloom: { value: 1 },
      interf: { value: 0 }, blurX: { value: 0 }, pulse: { value: 0 }, desat: { value: 0 }, zoom: { value: 0 }, dropout: { value: 0 },
      tDirt: { value: lensDirt() },
    };
    this.final = quad(FINAL, this.uniforms);
    this.brightU = { tSrc: { value: this.target.texture }, threshold: { value: 0.9 } };
    this.bright = quad(BRIGHT, this.brightU);
    this.blurU = { tSrc: { value: null }, dir: { value: new THREE.Vector2() } };
    this.blur = quad(BLUR, this.blurU);
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.msaa = renderer.capabilities.isWebGL2 ? Math.min(4, renderer.capabilities.maxSamples || 4) : 0;
  }

  // pixel 1: HD, adaptive (this.dyn: 1 = one render pixel per CSS pixel, up to the screen's density).
  // 1.5: HD at 3/4 size (phones). 2 and up: retro.
  get hd() { return this.pixel < 2; }
  get maxDyn() { return Math.min(window.devicePixelRatio || 1, 2); }

  setSize(w, h) {
    const hd = this.hd;
    const dpr = this.pixel <= 1.01 ? this.maxDyn : 1;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.dyn = Math.min(this.dyn ?? 1, this.maxDyn);
    const scale = hd ? (this.pixel <= 1.01 ? this.dyn : 0.75) : 1 / this.pixel;
    const rw = Math.max(64, Math.round(w * scale)), rh = Math.max(48, Math.round(h * scale));
    // filters and sample count are fixed when the target is created, so rebuild it
    this.target.dispose();
    this.target.setSize(rw, rh);
    this.target.samples = hd ? this.msaa : 0;
    const filter = hd ? THREE.LinearFilter : THREE.NearestFilter;
    this.target.texture.minFilter = this.target.texture.magFilter = filter;
    for (const t of this.half) t.setSize(Math.max(8, rw >> 1), Math.max(8, rh >> 1));
    for (const t of this.quarter) t.setSize(Math.max(4, rw >> 2), Math.max(4, rh >> 2));
    this.uniforms.res.value.set(rw, rh);
    this.uniforms.screen.value.set(w * dpr, h * dpr);
    this.uniforms.retro.value = hd ? 0 : 1;
    this.uniforms.bloom.value = hd ? 1 : 0.6;
  }

  pass(q, target) {
    const r = this.renderer;
    r.setRenderTarget(target);
    r.render(q.scene, this.cam);
  }

  blurPass(src, dst, dx, dy) {
    this.blurU.tSrc.value = src.texture;
    this.blurU.dir.value.set(dx / src.width, dy / src.height);
    this.pass(this.blur, dst);
  }

  render(scene, camera, time) {
    this.uniforms.time.value = time;
    const r = this.renderer;
    r.setRenderTarget(this.target);
    r.render(scene, camera);
    // bloom: bright parts, blurred at half and quarter size
    this.pass(this.bright, this.half[0]);
    this.blurPass(this.half[0], this.half[1], 1, 0);
    this.blurPass(this.half[1], this.half[0], 0, 1);
    this.blurPass(this.half[0], this.quarter[0], 1, 0);
    this.blurPass(this.quarter[0], this.quarter[1], 0, 1);
    this.blurPass(this.quarter[1], this.quarter[0], 1.5, 0);
    this.blurPass(this.quarter[0], this.quarter[1], 0, 1.5);
    this.uniforms.tBloomB.value = this.quarter[1].texture;
    this.pass(this.final, null);
  }
}
