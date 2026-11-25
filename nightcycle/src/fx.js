// Particles: soft camera-facing quads, drawn instanced (no point-size limit).
//  smoke  — the black smoke that pours off the Long Man and pools round its feet
//  dust   — puffs and falling grit, only visible where the headlamp catches it
//  sparks — a nightlight shorting out
// Each pool is one draw call. Particles of one pool share a colour family, so draw order barely matters.

import * as THREE from 'three';

const VERT = /* glsl */ `
attribute vec3 offset;
attribute vec4 data;   // size, alpha, rotation, stretch
attribute vec3 tint;
varying vec2 vUv;
varying float vA;
varying vec3 vC;
void main() {
  vUv = uv; vA = data.y; vC = tint;
  vec4 mv = modelViewMatrix * vec4(offset, 1.0);
  float c = cos(data.z), s = sin(data.z);
  vec2 p = position.xy * vec2(1.0, data.w);
  mv.xy += vec2(c * p.x - s * p.y, s * p.x + c * p.y) * data.x;
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = /* glsl */ `
uniform sampler2D map;
uniform float additive;
varying vec2 vUv;
varying float vA;
varying vec3 vC;
void main() {
  float a = texture2D(map, vUv).a * vA;
  if (a < 0.004) discard;
  gl_FragColor = additive > 0.5 ? vec4(vC * a, 1.0) : vec4(vC, a);
}`;

// A torn, lumpy puff: many soft blobs, so no two particles read as the same circle.
function puffTexture() {
  const S = 128, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  let a = 9;
  const r = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
  for (let i = 0; i < 46; i++) {
    const ang = r() * Math.PI * 2, d = Math.pow(r(), 0.8) * S * 0.26;
    const x = S / 2 + Math.cos(ang) * d, y = S / 2 + Math.sin(ang) * d, rad = S * (0.07 + r() * 0.13);
    const grd = g.createRadialGradient(x, y, 0, x, y, rad);
    grd.addColorStop(0, `rgba(255,255,255,${0.16 + r() * 0.12})`); grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // fade the square's edge to nothing
  g.globalCompositeOperation = 'destination-in';
  const edge = g.createRadialGradient(S / 2, S / 2, S * 0.2, S / 2, S / 2, S * 0.5);
  edge.addColorStop(0, 'rgba(0,0,0,1)'); edge.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = edge;
  g.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  return t;
}

function dotTexture() {
  const S = 32, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.35, 'rgba(255,255,255,0.6)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(c);
}

class Pool {
  constructor(scene, max, map, additive, order) {
    this.max = max;
    this.n = 0;
    // simulation state, struct of arrays
    this.p = new Float32Array(max * 3); this.v = new Float32Array(max * 3);
    this.age = new Float32Array(max); this.life = new Float32Array(max);
    this.s0 = new Float32Array(max); this.s1 = new Float32Array(max);
    this.a = new Float32Array(max); this.rot = new Float32Array(max); this.rv = new Float32Array(max);
    this.drag = new Float32Array(max); this.grav = new Float32Array(max); this.str = new Float32Array(max);
    this.c = new Float32Array(max * 3); this.lit = new Float32Array(max);   // base colour; how much the lamp shows it
    this.floor = new Float32Array(max);
    // instance attributes
    const base = new THREE.PlaneGeometry(1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = base.index;
    geo.setAttribute('position', base.attributes.position);
    geo.setAttribute('uv', base.attributes.uv);
    this.iOff = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3).setUsage(THREE.DynamicDrawUsage);
    this.iData = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.iTint = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('offset', this.iOff); geo.setAttribute('data', this.iData); geo.setAttribute('tint', this.iTint);
    geo.instanceCount = 0;
    this.geo = geo;
    this.mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms: { map: { value: map }, additive: { value: additive ? 1 : 0 } },
      transparent: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = order;
    scene.add(this.mesh);
  }

  // o: { x,y,z, vx,vy,vz, life, s0, s1, a, drag, grav, rgb:[r,g,b], lit, str, floor }
  emit(o) {
    let i = this.n;
    if (i >= this.max) {   // full: recycle the oldest-looking one
      let best = 0, bk = -1;
      for (let k = 0; k < this.max; k += 7) { const f = this.age[k] / this.life[k]; if (f > best) { best = f; bk = k; } }
      if (bk < 0) return;
      i = bk;
    } else this.n++;
    const p = this.p, v = this.v;
    p[i * 3] = o.x; p[i * 3 + 1] = o.y; p[i * 3 + 2] = o.z;
    v[i * 3] = o.vx || 0; v[i * 3 + 1] = o.vy || 0; v[i * 3 + 2] = o.vz || 0;
    this.age[i] = 0; this.life[i] = o.life || 1;
    this.s0[i] = o.s0 ?? 0.1; this.s1[i] = o.s1 ?? this.s0[i];
    this.a[i] = o.a ?? 1;
    this.rot[i] = Math.random() * 6.283; this.rv[i] = (Math.random() - 0.5) * (o.spin ?? 0.6);
    this.drag[i] = o.drag ?? 1; this.grav[i] = o.grav ?? 0; this.str[i] = o.str ?? 1;
    const rgb = o.rgb || [1, 1, 1];
    this.c[i * 3] = rgb[0]; this.c[i * 3 + 1] = rgb[1]; this.c[i * 3 + 2] = rgb[2];
    this.lit[i] = o.lit ?? 0;
    this.floor[i] = o.floor ?? 0.005;
  }

  // light(x,y,z) -> 0..1 how much the headlamp lights a point
  update(dt, light, litRgb) {
    const p = this.p, v = this.v, off = this.iOff.array, dat = this.iData.array, tin = this.iTint.array;
    let k = 0;
    while (k < this.n) {
      this.age[k] += dt;
      if (this.age[k] >= this.life[k]) {   // dead: swap the last one in
        const L = --this.n;
        if (k !== L) this.move(L, k);
        continue;
      }
      const dr = Math.exp(-this.drag[k] * dt);
      v[k * 3] *= dr; v[k * 3 + 1] = v[k * 3 + 1] * dr - this.grav[k] * dt; v[k * 3 + 2] *= dr;
      p[k * 3] += v[k * 3] * dt; p[k * 3 + 1] += v[k * 3 + 1] * dt; p[k * 3 + 2] += v[k * 3 + 2] * dt;
      if (p[k * 3 + 1] < this.floor[k]) { p[k * 3 + 1] = this.floor[k]; v[k * 3 + 1] *= -0.25; v[k * 3] *= 0.6; v[k * 3 + 2] *= 0.6; }
      this.rot[k] += this.rv[k] * dt;
      const f = this.age[k] / this.life[k];
      const size = this.s0[k] + (this.s1[k] - this.s0[k]) * (1 - (1 - f) * (1 - f));
      const alpha = this.a[k] * Math.min(1, f * 6) * (1 - f) * (1 - f) * 1.4;
      off[k * 3] = p[k * 3]; off[k * 3 + 1] = p[k * 3 + 1]; off[k * 3 + 2] = p[k * 3 + 2];
      dat[k * 4] = size; dat[k * 4 + 1] = Math.min(1, alpha); dat[k * 4 + 2] = this.rot[k];
      dat[k * 4 + 3] = this.str[k] === 1 ? 1 : 1 + (this.str[k] - 1) * Math.min(1, Math.hypot(v[k * 3], v[k * 3 + 1], v[k * 3 + 2]) * 0.5);
      const l = this.lit[k] > 0 ? light(p[k * 3], p[k * 3 + 1], p[k * 3 + 2]) * this.lit[k] : 0;
      tin[k * 3] = this.c[k * 3] + litRgb[0] * l; tin[k * 3 + 1] = this.c[k * 3 + 1] + litRgb[1] * l; tin[k * 3 + 2] = this.c[k * 3 + 2] + litRgb[2] * l;
      k++;
    }
    this.geo.instanceCount = this.n;
    if (this.n) { this.iOff.needsUpdate = this.iData.needsUpdate = this.iTint.needsUpdate = true; }
  }

  move(from, to) {
    for (const arr of [this.p, this.v, this.c]) { arr[to * 3] = arr[from * 3]; arr[to * 3 + 1] = arr[from * 3 + 1]; arr[to * 3 + 2] = arr[from * 3 + 2]; }
    for (const arr of [this.age, this.life, this.s0, this.s1, this.a, this.rot, this.rv, this.drag, this.grav, this.str, this.lit, this.floor]) arr[to] = arr[from];
  }

  clear() { this.n = 0; this.geo.instanceCount = 0; }
}

const rand = (a, b) => a + Math.random() * (b - a);

export class FX {
  constructor(game) {
    this.game = game;
    const puff = puffTexture(), dot = dotTexture();
    this.smoke = new Pool(game.scene, 700, puff, false, 3);
    this.dust = new Pool(game.scene, 400, puff, false, 3.2);
    this.sparks = new Pool(game.scene, 160, dot, true, 4.5);
    this._v = new THREE.Vector3(); this._w = new THREE.Vector3();
    this.lampPos = new THREE.Vector3(); this.lampDir = new THREE.Vector3(); this.lampOn = 0;
    this.acc = 0;
    this.light = (x, y, z) => {
      if (this.lampOn <= 0) return 0;
      const lp = this.lampPos, dx = x - lp.x, dy = y - lp.y, dz = z - lp.z, d = Math.hypot(dx, dy, dz) || 1;
      const c = (dx * this.lampDir.x + dy * this.lampDir.y + dz * this.lampDir.z) / d;
      const cone = Math.min(1, Math.max(0, (c - 0.82) / 0.12));
      return cone * Math.min(1, 2.2 / (d * d + 0.3)) * this.lampOn;
    };
  }

  // ---------- emitters ----------

  // Black smoke off its body. Called every frame while it is out. Densest round the feet.
  creature(dt, e) {
    if (!e.root.visible) { this.ex = null; return; }
    const g = this.game, j = e.j, v = this._v;
    // its velocity, for smoke that trails behind instead of travelling with it
    if (this.ex == null || dt <= 0) { this.ex = e.x; this.ez = e.z; }
    const evx = Math.max(-3, Math.min(3, (e.x - this.ex) / Math.max(dt, 1e-3))), evz = Math.max(-3, Math.min(3, (e.z - this.ez) / Math.max(dt, 1e-3)));
    this.ex = e.x; this.ez = e.z;
    const moving = Math.min(1, e.speed / 0.8), chase = e.state === 'chase' ? 1 : 0;
    const scare = e.state === 'scare';
    const near = Math.max(0, 1 - Math.hypot(e.x - g.roomba.x, e.z - g.roomba.z) / 12);
    if (near <= 0 && !scare) return;   // far away and behind walls: nobody sees it
    this.acc += dt;
    const step = 1 / 60;
    while (this.acc >= step) {
      this.acc -= step;
      for (const L of [j.legL, j.legR]) {
        // the pool round the feet: low, wide, slow
        if (Math.random() < 0.7 + moving * 0.3) {
          const src = Math.random() < 0.5 ? L.ball : Math.random() < 0.5 ? L.ankle : L.toes[(Math.random() * L.toes.length) | 0][1];
          src.getWorldPosition(v);
          const a = Math.random() * 6.283, sp = rand(0.03, 0.14) + moving * 0.1;
          const big = Math.random() < 0.3;
          this.smoke.emit({
            x: v.x + rand(-0.1, 0.1), y: Math.max(0.03, Math.min(0.22, v.y)) , z: v.z + rand(-0.1, 0.1),
            vx: Math.cos(a) * sp - evx * 0.15, vy: rand(0.0, 0.07), vz: Math.sin(a) * sp - evz * 0.15,
            life: rand(1.6, 3.0), s0: rand(0.1, 0.2), s1: big ? rand(0.6, 0.9) : rand(0.3, 0.5), a: big ? rand(0.45, 0.6) : rand(0.7, 0.95), drag: 1.5, grav: -0.012,
            rgb: [0.008, 0.007, 0.007], lit: 0.06, floor: 0.05,
          });
        }
        // wisps curling up the shins
        if (Math.random() < 0.18 + chase * 0.2) {
          L.knee.getWorldPosition(v); L.ankle.getWorldPosition(this._w);
          v.lerp(this._w, Math.random());
          this.smoke.emit({
            x: v.x + rand(-0.04, 0.04), y: v.y, z: v.z + rand(-0.04, 0.04),
            vx: rand(-0.05, 0.05) - evx * 0.3, vy: rand(0.08, 0.22), vz: rand(-0.05, 0.05) - evz * 0.3,
            life: rand(0.9, 1.6), s0: 0.06, s1: rand(0.22, 0.34), a: rand(0.25, 0.4), drag: 1.2, grav: -0.03,
            rgb: [0.015, 0.012, 0.011], lit: 0.09, floor: 0.04, str: 1.8,
          });
        }
      }
      // a trail off its back and arms as it hunts
      if (Math.random() < 0.08 + chase * 0.45 + (scare ? 0.6 : 0)) {
        const srcs = [j.chest, j.spine, j.armL.el, j.armR.el, j.armL.wr, j.armR.wr, j.neck];
        srcs[(Math.random() * srcs.length) | 0].getWorldPosition(v);
        this.smoke.emit({
          x: v.x + rand(-0.06, 0.06), y: v.y + rand(-0.06, 0.06), z: v.z + rand(-0.06, 0.06),
          vx: rand(-0.06, 0.06) - evx * 0.5, vy: rand(0.02, 0.12), vz: rand(-0.06, 0.06) - evz * 0.5,
          life: rand(0.8, 1.5), s0: 0.08, s1: rand(0.3, 0.5), a: rand(0.25, 0.42), drag: 1.0, grav: -0.02,
          rgb: [0.014, 0.012, 0.011], lit: 0.1, floor: 0.05, str: 1.5,
        });
      }
    }
  }

  // It pours out round the lens as it comes for you.
  burst(x, y, z, n = 40, spread = 0.4) {
    for (let k = 0; k < n; k++) {
      const a = Math.random() * 6.283, b = rand(-0.6, 1), sp = rand(0.3, 1.1);
      this.smoke.emit({
        x: x + rand(-spread, spread) * 0.5, y: y + rand(-spread, spread) * 0.5, z: z + rand(-spread, spread) * 0.5,
        vx: Math.cos(a) * sp, vy: b * sp * 0.6, vz: Math.sin(a) * sp,
        life: rand(0.7, 1.6), s0: rand(0.1, 0.25), s1: rand(0.5, 0.9), a: rand(0.45, 0.7), drag: 2.4,
        rgb: [0.01, 0.008, 0.008], lit: 0.12, floor: 0.04,
      });
    }
  }

  // A puff of grit where the bumper hits something.
  bumpDust(x, y, z, hard = 1) {
    const n = 5 + Math.round(hard * 8);
    for (let k = 0; k < n; k++) {
      const a = Math.random() * 6.283;
      this.dust.emit({
        x: x + rand(-0.06, 0.06), y: y + rand(0, 0.05), z: z + rand(-0.06, 0.06),
        vx: Math.cos(a) * rand(0.05, 0.25), vy: rand(0.05, 0.25), vz: Math.sin(a) * rand(0.05, 0.25),
        life: rand(0.8, 1.8), s0: rand(0.02, 0.05), s1: rand(0.1, 0.22), a: rand(0.12, 0.25), drag: 2.5, grav: 0.02,
        rgb: [0.004, 0.004, 0.004], lit: 0.75,
      });
    }
  }

  // Grit sifting down from above: the underside of whatever the robot hides under, or the ceiling.
  sift(x, y, z, n = 12, spread = 0.35) {
    for (let k = 0; k < n; k++) {
      this.dust.emit({
        x: x + rand(-spread, spread), y: y - rand(0, 0.03), z: z + rand(-spread, spread),
        vx: rand(-0.02, 0.02), vy: rand(-0.15, 0), vz: rand(-0.02, 0.02),
        life: rand(1.2, 2.4), s0: rand(0.006, 0.014), s1: rand(0.01, 0.03), a: rand(0.5, 0.9), drag: 1.5, grav: 0.35,
        rgb: [0.006, 0.005, 0.004], lit: 1.0, spin: 0, str: 1,
      });
    }
  }

  sparksAt(x, y, z, n = 18) {
    for (let k = 0; k < n; k++) {
      const a = Math.random() * 6.283, sp = rand(0.4, 1.6);
      this.sparks.emit({
        x, y, z, vx: Math.cos(a) * sp * 0.7, vy: rand(-0.2, 1.2), vz: Math.sin(a) * sp * 0.7,
        life: rand(0.25, 0.7), s0: rand(0.012, 0.02), s1: 0.004, a: 1, drag: 0.6, grav: 4.5,
        rgb: [3.2, 1.6, 0.5], str: 4, spin: 0,
      });
    }
    // and a whiff of smoke from the socket
    for (let k = 0; k < 6; k++) this.dust.emit({ x: x + rand(-0.02, 0.02), y, z: z + rand(-0.02, 0.02), vx: rand(-0.03, 0.03), vy: rand(0.06, 0.15), vz: rand(-0.03, 0.03), life: rand(1.5, 2.5), s0: 0.03, s1: 0.16, a: 0.3, drag: 1, grav: -0.02, rgb: [0.02, 0.018, 0.016], lit: 0.5 });
  }

  // ---------- per frame ----------

  update(dt) {
    const g = this.game, r = g.roomba;
    r.lamp.getWorldPosition(this.lampPos);
    r.lamp.target.getWorldPosition(this.lampDir);
    this.lampDir.sub(this.lampPos).normalize();
    this.lampOn = Math.min(1, r.lamp.intensity / 20);
    if (g.state === 'playing' || g.state === 'cutscene' || g.state === 'dying') this.creature(dt, g.entity);
    this.smoke.update(dt, this.light, [0.16, 0.15, 0.14]);
    this.dust.update(dt, this.light, [0.85, 0.8, 0.72]);
    this.sparks.update(dt, this.light, [0, 0, 0]);
  }

  clear() { this.smoke.clear(); this.dust.clear(); this.sparks.clear(); }
}
