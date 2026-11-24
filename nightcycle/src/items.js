// Small things on the floor that get sucked up. Some of them tell you what happened here.

import * as THREE from 'three';
import { ITEMS } from './level.js';
import { T } from './tune.js';

const LABEL = { coin: 'coin', lego: 'toy', hairtie: 'hair tie', paperclip: 'clip', note: 'paper', ring: 'jewelry', tag: 'metal', crumbs: 'food', cereal: 'food',
  polaroid: 'photo', cap: 'plastic', drawing: 'paper', tooth: 'unknown', key: 'key', receipt: 'paper' };

export class Items {
  constructor(game) {
    this.game = game;
    const tx = game.house.tx;
    const mat = (o) => new THREE.MeshStandardMaterial({ roughness: 0.5, ...o });
    const gold = mat({ color: 0xc9a040, metalness: 0.9, roughness: 0.3 });
    const silver = mat({ color: 0xb8bcc2, metalness: 0.9, roughness: 0.3 });
    const make = {
      coin: () => cyl(0.012, 0.003, silver),
      lego: () => { const g = new THREE.Group(); g.add(box(0.032, 0.02, 0.016, mat({ color: 0xc8202a, roughness: 0.3 }))); for (const x of [-0.008, 0.008]) { const s = cyl(0.0045, 0.004, mat({ color: 0xc8202a, roughness: 0.3 })); s.position.set(x, 0.012, 0); g.add(s); } return g; },
      hairtie: () => torus(0.014, 0.003, mat({ color: 0x202020 })),
      paperclip: () => box(0.03, 0.002, 0.008, silver),
      note: () => plane(0.07, 0.07, mat({ color: 0xf0e060, roughness: 0.9 })),
      ring: () => torus(0.01, 0.0025, gold),
      tag: () => box(0.03, 0.002, 0.02, silver),
      crumbs: () => { const g = new THREE.Group(); for (let k = 0; k < 9; k++) { const c = box(0.008 + Math.random() * 0.01, 0.006, 0.008 + Math.random() * 0.01, mat({ color: 0x9a6a30, roughness: 1 })); c.position.set((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.1); g.add(c); } return g; },
      cereal: () => { const g = new THREE.Group(); for (let k = 0; k < 6; k++) { const c = torus(0.007, 0.003, mat({ color: 0xd8a040, roughness: 1 })); c.position.set((Math.random() - 0.5) * 0.09, 0, (Math.random() - 0.5) * 0.09); g.add(c); } return g; },
      polaroid: () => plane(0.08, 0.095, mat({ map: tx.polaroid, roughness: 0.6 })),
      cap: () => cyl(0.018, 0.012, mat({ color: 0xeeeeee, roughness: 0.4 })),
      drawing: () => plane(0.16, 0.12, mat({ map: tx.drawing, roughness: 0.9 })),
      tooth: () => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.004, 0.006, 4, 8), mat({ color: 0xf0ead8, roughness: 0.3 })); m.rotation.z = Math.PI / 2; return m; },
      key: () => { const g = new THREE.Group(); g.add(box(0.04, 0.003, 0.008, gold)); const t = torus(0.009, 0.0025, gold); t.position.x = -0.026; g.add(t); const p = plane(0.035, 0.022, mat({ color: 0xe8e0c8, roughness: 0.9 })); p.position.set(-0.05, 0, 0.01); g.add(p); return g; },
      receipt: () => plane(0.05, 0.14, mat({ color: 0xf2f0ea, roughness: 0.9 })),
    };
    this.list = ITEMS.map((def) => {
      const obj = make[def.kind]();
      obj.position.set(def.x, 0.008, def.z);
      obj.rotation.y = Math.random() * Math.PI * 2;
      obj.traverse((o) => { if (o.isMesh) o.castShadow = true; });
      game.scene.add(obj);
      const item = { def, obj, taken: false, anim: 0 };
      item.tag = { label: LABEL[def.kind] || 'object', box: new THREE.Box3().setFromObject(obj).expandByScalar(0.02), conf: 0.4 + Math.random() * 0.4, obj, item };
      game.house.tags.push(item.tag);
      return item;
    });
    this.found = [];
  }

  update(dt) {
    const g = this.game, r = g.roomba;
    const canSuck = r.suction && !r.dead && r.bin < 100;
    for (const it of this.list) {
      if (it.taken) {
        if (it.anim > 0) {  // whisked under the robot
          it.anim = Math.max(0, it.anim - dt * 4);
          it.obj.scale.setScalar(it.anim);
          it.obj.position.lerp(new THREE.Vector3(r.x, 0.01, r.z), 0.3);
          if (it.anim === 0) it.obj.visible = false;
        }
        continue;
      }
      if (!canSuck) continue;
      const d = Math.hypot(it.def.x - r.x, it.def.z - r.z);
      if (d < T.pickupRadius) this.take(it);
    }
  }

  take(it) {
    const g = this.game;
    it.taken = true;
    it.anim = 1;
    it.tag.gone = true;
    g.roomba.bin = Math.min(100, g.roomba.bin + T.binPerItem);
    g.audio.pickup(it.def.story ? 1 : 0.7);
    this.found.push(it.def.id);
    if (it.def.text) g.hud.itemCard(it.def);
    else g.hud.log(`Picked up: ${LABEL[it.def.kind]}`);
    if (it.def.story) g.stats.story++;
  }

  get storyTotal() { return ITEMS.filter((i) => i.story).length; }

  snapshot() { return this.list.map((it) => it.taken); }
  restore(s) {
    this.found = [];
    s.forEach((taken, k) => {
      const it = this.list[k];
      it.taken = taken; it.anim = 0; it.tag.gone = taken;
      it.obj.visible = !taken;
      it.obj.scale.setScalar(1);
      it.obj.position.set(it.def.x, 0.008, it.def.z);
      if (taken) this.found.push(it.def.id);
    });
  }
}

function box(w, h, d, m) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.y = h / 2; return wrap(o); }
function cyl(r, h, m) { return wrap(new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 14), m), h / 2); }
function torus(r, t, m) { const o = new THREE.Mesh(new THREE.TorusGeometry(r, t, 6, 16), m); o.rotation.x = Math.PI / 2; return wrap(o, t); }
function plane(w, d, m) { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); o.rotation.x = -Math.PI / 2; return wrap(o, 0.001); }
function wrap(o, y) { const g = new THREE.Group(); if (y !== undefined) o.position.y = y; g.add(o); return g; }
