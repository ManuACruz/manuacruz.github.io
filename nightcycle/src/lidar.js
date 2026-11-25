// LIDAR scan: a few thousand rays from the robot, drawn as fading points.
// Shows the room in the dark, and shows the thing in red if it is standing anywhere in view of the robot.

import * as THREE from 'three';
import { HOUSE } from './level.js';
import { T } from './tune.js';

const CAP = 12000;

const VERT = /* glsl */ `
attribute vec3 color;
attribute float born;
uniform float time, life, scale, maxSize;
varying vec3 vColor;
varying float vAlpha;
varying float vEnt;
void main() {
  float age = time - born;
  vAlpha = age < 0.0 ? 0.0 : (1.0 - smoothstep(life * 0.35, life, age)) * (age < 0.12 ? 2.0 : 1.0);
  vColor = color;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vEnt = color.r > 0.9 && color.g < 0.3 ? 1.0 : 0.0;
  float big = 1.0 + vEnt * 0.8;
  gl_PointSize = age < 0.0 ? 0.0 : clamp(scale * big / -mv.z, 1.0, maxSize * big);
}`;
const FRAG = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
varying float vEnt;
void main() {
  if (vAlpha <= 0.0) discard;
  // its points get a white core, so they read for red-weak eyes too
  float d = length(gl_PointCoord - 0.5);
  vec3 c = vEnt > 0.5 && d < 0.2 ? vec3(1.0, 0.9, 0.85) : vColor;
  gl_FragColor = vec4(c * vAlpha, 1.0);
}`;

export class Lidar {
  constructor(game) {
    this.game = game;
    this.pos = new Float32Array(CAP * 3);
    this.col = new Float32Array(CAP * 3);
    this.born = new Float32Array(CAP).fill(-1e9);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3));
    g.setAttribute('born', new THREE.BufferAttribute(this.born, 1));
    this.uniforms = { time: { value: 0 }, life: { value: T.scanLife }, scale: { value: 8 }, maxSize: { value: 3 } };
    this.points = new THREE.Points(g, new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, uniforms: this.uniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    game.scene.add(this.points);
    this.head = 0;
    this.blip = null;   // where the thing was when last scanned
    this.lastScan = -100;
  }

  scan(lock = 5) {
    const g = this.game, now = g.time;
    this.lastScan = now;
    const o = new THREE.Vector3();
    g.camera.getWorldPosition(o);
    const boxes = [];
    const R2 = T.scanRange * T.scanRange;
    const st = g.house.scanStatic;
    for (let k = 0; k < st.length; k += 6) {
      const dx = Math.max(st[k] - o.x, 0, o.x - st[k + 3]), dz = Math.max(st[k + 2] - o.z, 0, o.z - st[k + 5]);
      if (dx * dx + dz * dz <= R2) boxes.push(st[k], st[k + 1], st[k + 2], st[k + 3], st[k + 4], st[k + 5]);
    }
    const b = new THREE.Box3();
    for (const m of g.house.scanDynamic) {
      b.setFromObject(m);
      boxes.push(b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z);
    }
    const nb = boxes.length / 6;
    const spheres = g.entity.scanSpheres();
    const ghost = g.tension?.ghostSpheres(o) || [];   // someone who is not there
    let sawIt = false;

    // One ray: nearest hit against the floor, ceiling, boxes and the thing's body. Adds a point.
    const cast = (dx, dy, dz, onlyEntity = false) => {
      let tMin = T.scanRange, ent = false;
      if (dy < 0) tMin = Math.min(tMin, -o.y / dy);
      if (dy > 0) tMin = Math.min(tMin, (HOUSE.wallH - o.y) / dy);
      const ix = 1 / dx, iy = 1 / dy, iz = 1 / dz;
      for (let k = 0; k < nb; k++) {
        const q = k * 6;
        let t1 = (boxes[q] - o.x) * ix, t2 = (boxes[q + 3] - o.x) * ix;
        let tn = Math.min(t1, t2), tf = Math.max(t1, t2);
        t1 = (boxes[q + 1] - o.y) * iy; t2 = (boxes[q + 4] - o.y) * iy;
        tn = Math.max(tn, Math.min(t1, t2)); tf = Math.min(tf, Math.max(t1, t2));
        t1 = (boxes[q + 2] - o.z) * iz; t2 = (boxes[q + 5] - o.z) * iz;
        tn = Math.max(tn, Math.min(t1, t2)); tf = Math.min(tf, Math.max(t1, t2));
        if (tf >= Math.max(tn, 0) && tn < tMin && tn > 0.01) tMin = tn;
      }
      for (const s of spheres) {
        const lx = s.x - o.x, ly = s.y - o.y, lz = s.z - o.z;
        const tc = lx * dx + ly * dy + lz * dz;
        if (tc < 0) continue;
        const d2 = lx * lx + ly * ly + lz * lz - tc * tc;
        if (d2 > s.r * s.r) continue;
        const th = tc - Math.sqrt(s.r * s.r - d2);
        if (th < tMin) { tMin = th; ent = true; }
      }
      let spook = false;
      for (const s of ghost) {
        const lx = s.x - o.x, ly = s.y - o.y, lz = s.z - o.z;
        const tc = lx * dx + ly * dy + lz * dz;
        if (tc < 0) continue;
        const d2 = lx * lx + ly * ly + lz * lz - tc * tc;
        if (d2 > s.r * s.r) continue;
        const th = tc - Math.sqrt(s.r * s.r - d2);
        if (th < tMin) { tMin = th; ent = false; spook = true; }
      }
      if (tMin >= T.scanRange || (onlyEntity && !ent && !spook)) return;
      if (ent) sawIt = true;
      const t = tMin - 0.015;
      const i = this.head;
      this.head = (this.head + 1) % CAP;
      this.pos[i * 3] = o.x + dx * t; this.pos[i * 3 + 1] = o.y + dy * t; this.pos[i * 3 + 2] = o.z + dz * t;
      const f = 1 - Math.min(1, t / T.scanRange);
      if (ent || spook) { this.col[i * 3] = 1.0; this.col[i * 3 + 1] = 0.12; this.col[i * 3 + 2] = 0.08; }
      else { this.col[i * 3] = 0.15 * f; this.col[i * 3 + 1] = 0.35 + 0.65 * f; this.col[i * 3 + 2] = 0.3 + 0.5 * f; }
      this.born[i] = now + t / T.scanWaveSpeed;
    };

    const AZ = 200, EL = 15;
    for (let ie = 0; ie < EL; ie++) {
      const el = -0.12 + (ie / (EL - 1)) * 1.15 + (Math.random() - 0.5) * 0.04;
      const ce = Math.cos(el), se = Math.sin(el);
      for (let ia = 0; ia < AZ; ia++) {
        const az = ((ia + Math.random()) / AZ) * Math.PI * 2;
        cast(Math.cos(az) * ce, se, Math.sin(az) * ce);
      }
    }
    // Motion lock: extra rays at its body so the silhouette reads, still blocked by walls.
    for (const s of [...spheres, ...ghost]) {
      for (let k = 0; k < (s.ghost ? lock * 3 : lock); k++) {
        let dx = s.x + (Math.random() - 0.5) * s.r * 2 - o.x, dy = s.y + (Math.random() - 0.5) * s.r * 2 - o.y, dz = s.z + (Math.random() - 0.5) * s.r * 2 - o.z;
        const L = Math.hypot(dx, dy, dz);
        if (L > T.scanRange) break;
        cast(dx / L, dy / L, dz / L, true);
      }
    }
    const geo = this.points.geometry;
    geo.attributes.position.needsUpdate = geo.attributes.color.needsUpdate = geo.attributes.born.needsUpdate = true;
    if (sawIt) {
      this.blip = { x: g.entity.x, z: g.entity.z, t: now };
      g.onEntityScanned?.();
      g.entity.pinged(g.roomba.x, g.roomba.z);   // its head turns toward where the rays came from
    }
  }

  update() {
    this.uniforms.time.value = this.game.time;
    const ry = this.game.post.uniforms.res.value.y;
    this.uniforms.scale.value = ry * 0.022;
    this.uniforms.maxSize.value = Math.max(3, ry / 260);
  }

  clear() { this.born.fill(-1e9); this.points.geometry.attributes.born.needsUpdate = true; this.blip = null; }
}
