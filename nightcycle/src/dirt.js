// Draws the dirt grid as a dusty film on the floor, and the muddy footprints.

import * as THREE from 'three';
import { HOUSE } from './level.js';
import { GW, GH, footprintSteps } from './world.js';
import { T } from './tune.js';

export class DirtLayer {
  constructor(game) {
    this.game = game;
    const w = game.world;
    this.data = new Uint8Array(GW * GH * 4);
    this.tex = new THREE.DataTexture(this.data, GW, GH, THREE.RGBAFormat);
    this.tex.magFilter = THREE.LinearFilter;
    this.tex.minFilter = THREE.LinearFilter;
    this.tex.needsUpdate = true;
    const dust = game.house.tx.dust.clone();
    dust.repeat.set(HOUSE.w * 2, HOUSE.d * 2);
    dust.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({
      color: 0xd8d0c4, map: dust, alphaMap: this.tex, transparent: true, depthWrite: false, roughness: 1,
      polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(HOUSE.w, HOUSE.d), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(HOUSE.w / 2, 0.006, HOUSE.d / 2);
    mesh.receiveShadow = true;
    mesh.renderOrder = 1;
    game.scene.add(mesh);
    this.mesh = mesh;
    w.dirtBox = { i0: 0, i1: GW - 1, j0: 0, j1: GH - 1 };
    this.flush();

    // Footprints, hidden until the story spawns them.
    this.prints = footprintSteps().map((s) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.165), new THREE.MeshStandardMaterial({
        map: game.house.tx.footprint, color: 0x7a5232, transparent: true, depthWrite: false, roughness: 0.6, opacity: 0,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
      }));
      m.rotation.order = 'YXZ';
      m.rotation.set(-Math.PI / 2, Math.atan2(-s.dz, s.dx), 0);
      if (!s.left) m.scale.y = -1;
      m.position.set(s.x, 0.007, s.z);
      m.renderOrder = 2;
      m.visible = false;
      game.scene.add(m);
      return { ...s, mesh: m, amount: 0, shown: false };
    });
    this.timer = 0;
  }

  // Copy changed cells into the texture (rows flipped: the plane's v runs north to south).
  flush() {
    const w = this.game.world, b = w.dirtBox;
    if (!b) return;
    for (let j = b.j0; j <= b.j1; j++) {
      const row = (GH - 1 - j) * GW;
      for (let i = b.i0; i <= b.i1; i++) {
        const v = Math.min(255, w.dirt[j * GW + i] * 255) | 0, o = (row + i) * 4;
        this.data[o] = this.data[o + 1] = this.data[o + 2] = this.data[o + 3] = v;
      }
    }
    w.dirtBox = null;
    this.tex.needsUpdate = true;
  }

  update(dt) {
    this.timer -= dt;
    if (this.timer <= 0 && this.game.world.dirtBox) { this.timer = 1 / 20; this.flush(); }
    const r = this.game.roomba;
    for (const p of this.prints) {
      if (!p.shown || p.amount <= 0) continue;
      if (r.suction && !r.dead && r.bin < 100) {
        const d = Math.hypot(p.x - r.x, p.z - r.z);
        if (d < T.cleanRadius + 0.06) {
          p.amount = Math.max(0, p.amount - dt * 3.5);
          if (p.amount === 0) { this.game.audio.pickup(0.4); r.bin = Math.min(100, r.bin + 0.6); }
        }
      }
      p.mesh.material.opacity = p.amount * 0.92;
      p.mesh.visible = p.amount > 0;
    }
  }

  showPrint(k) {
    const p = this.prints[k];
    if (!p) return;
    p.shown = true; p.amount = 1; p.mesh.visible = true; p.mesh.material.opacity = 0.92;
  }

  get printsProgress() {
    const shown = this.prints.filter((p) => p.shown);
    if (!shown.length) return 0;
    return shown.filter((p) => p.amount === 0).length / this.prints.length;
  }

  snapshot() { return this.prints.map((p) => [p.shown, p.amount]); }
  restore(s) {
    s.forEach(([shown, amount], k) => {
      const p = this.prints[k];
      p.shown = shown; p.amount = amount;
      p.mesh.visible = shown && amount > 0;
      p.mesh.material.opacity = amount * 0.92;
    });
    this.flush();
  }
}
