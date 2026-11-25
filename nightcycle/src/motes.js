// Dust hanging in the air, only visible where the headlamp beam catches it.
// The motes live in a box that follows the robot; positions wrap inside it on the GPU.

import * as THREE from 'three';

const VERT = /* glsl */ `
attribute vec4 seed;
uniform float time, size;
uniform vec3 center, lampPos, lampDir;
uniform float lampOn, cosOuter, scale;
varying float vA;
void main() {
  vec3 drift = vec3(sin(time * 0.11 + seed.w * 6.0), -0.35 + 0.2 * sin(time * 0.07 + seed.w * 3.0), cos(time * 0.09 + seed.w * 5.0)) * 0.05;
  vec3 p = fract(seed.xyz + drift * time * 0.2);
  vec3 w = vec3(center.x + (p.x - 0.5) * size, 0.03 + p.y * 1.6, center.z + (p.z - 0.5) * size);
  vec3 to = w - lampPos;
  float d = length(to);
  float c = dot(to / d, lampDir);
  float beam = smoothstep(cosOuter, cosOuter + 0.12, c) * smoothstep(5.5, 0.6, d) * smoothstep(0.05, 0.35, d);
  float twinkle = 0.55 + 0.45 * sin(time * (1.5 + seed.w * 3.0) + seed.w * 40.0);
  vA = beam * twinkle * lampOn;
  vec4 mv = modelViewMatrix * vec4(w, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = vA <= 0.001 ? 0.0 : clamp(scale * (0.6 + seed.w) / -mv.z, 1.0, 5.0);
}`;
const FRAG = /* glsl */ `
varying float vA;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float r = 1.0 - smoothstep(0.15, 0.5, length(q));
  if (vA * r <= 0.002) discard;
  gl_FragColor = vec4(vec3(1.0, 0.92, 0.78) * vA * r * 0.55, 1.0);
}`;

export class Motes {
  constructor(game, count = 900) {
    this.game = game;
    const seed = new Float32Array(count * 4);
    for (let i = 0; i < seed.length; i++) seed[i] = Math.random();
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('seed', new THREE.BufferAttribute(seed, 4));
    this.u = {
      time: { value: 0 }, size: { value: 5 }, center: { value: new THREE.Vector3() }, lampPos: { value: new THREE.Vector3() },
      lampDir: { value: new THREE.Vector3(0, 0, -1) }, lampOn: { value: 1 }, cosOuter: { value: Math.cos(0.55) }, scale: { value: 10 },
    };
    this.points = new THREE.Points(g, new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, uniforms: this.u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.points.frustumCulled = false;
    this.points.renderOrder = 4;
    game.scene.add(this.points);
  }

  update() {
    const g = this.game, r = g.roomba, u = this.u;
    u.time.value = g.time;
    u.center.value.set(r.x, 0, r.z);
    r.lamp.getWorldPosition(u.lampPos.value);
    const tgt = r.lamp.target.getWorldPosition(new THREE.Vector3());
    u.lampDir.value.copy(tgt).sub(u.lampPos.value).normalize();
    u.lampOn.value = Math.min(1, r.lamp.intensity / 20);
    u.scale.value = g.post.uniforms.res.value.y * 0.006;
  }
}
