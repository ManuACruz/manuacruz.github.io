// Dog food on the floor: a trail from the bowl to the laundry door, and the spill that fans out from under it
// once it is open. Sucking it up is loud.

import * as THREE from 'three';
import { kibbleSpots } from './level.js';
import { T } from './tune.js';

export class Kibble {
  constructor(game) {
    this.game = game;
    this.list = kibbleSpots().map((p, i) => ({ ...p, i, taken: false, shown: p.group === 'trail' }));
    const geo = new THREE.SphereGeometry(0.011, 6, 4);
    geo.scale(1.2, 0.7, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x7a4e2a, roughness: 0.85 });
    this.mesh = new THREE.InstancedMesh(geo, mat, this.list.length * 3);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    game.scene.add(this.mesh);
    // three bits per spot, jittered
    this.bits = [];
    let s = 9;
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (const p of this.list) for (let k = 0; k < 3; k++) this.bits.push({ p, x: p.x + (rnd() - 0.5) * 0.07, z: p.z + (rnd() - 0.5) * 0.07, r: rnd() * 6, s: 0.8 + rnd() * 0.5 });
    this.m = new THREE.Matrix4();
    this.q = new THREE.Quaternion();
    this.dirty = true;
    this.sound = 0;
  }

  get spillTotal() { return this.list.filter((p) => p.group === 'spill').length; }
  get spillProgress() {
    const spill = this.list.filter((p) => p.group === 'spill');
    return spill.filter((p) => p.taken).length / spill.length;
  }
  get spillShown() { return this.list.some((p) => p.group === 'spill' && p.shown); }

  showSpill() { for (const p of this.list) if (p.group === 'spill') p.shown = true; this.dirty = true; }

  update(dt) {
    const g = this.game, r = g.roomba;
    this.sound -= dt;
    if (r.suction && !r.dead && r.bin < 100) {
      let got = 0;
      for (const p of this.list) {
        if (!p.shown || p.taken) continue;
        if (Math.hypot(p.x - r.x, p.z - r.z) < T.cleanRadius) { p.taken = true; got++; this.dirty = true; }
      }
      if (got) {
        r.bin = Math.min(100, r.bin + got * 0.25);
        g.fx?.crunchBits(r, got);
        if (this.sound <= 0) {
          this.sound = 0.25;
          g.audio.crunch(Math.min(1, 0.5 + got * 0.25));
          g.noise(r.x, r.z, T.noiseCrunch, 'crunch');
        }
      }
    }
    if (this.dirty) this.draw();
  }

  draw() {
    this.dirty = false;
    const v = new THREE.Vector3(), sc = new THREE.Vector3();
    this.bits.forEach((b, i) => {
      const on = b.p.shown && !b.p.taken;
      this.q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), b.r);
      sc.setScalar(on ? b.s : 0);
      this.m.compose(v.set(b.x, 0.007, b.z), this.q, sc);
      this.mesh.setMatrixAt(i, this.m);
    });
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  snapshot() { return this.list.map((p) => [p.shown, p.taken]); }
  restore(s) { s.forEach(([shown, taken], k) => { this.list[k].shown = shown; this.list[k].taken = taken; }); this.dirty = true; }
}
