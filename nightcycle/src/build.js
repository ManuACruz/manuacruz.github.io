// Turns the level data into a three.js scene: floors, walls, windows, doors, furniture and lights.

import * as THREE from 'three';
import { HOUSE, ROOMS, FURNITURE, LIGHTS, NIGHTLIGHTS, SCRAPES, DECOR, CEILING } from './level.js';
import { makeTextures, makeStatic } from './textures.js';
import { roundBox, drapeGeo, lump, lathe, strip, pipe, stadium, extrudeUp, noise3 } from './props.js';

const OVERLAP = 0.006;   // how far frames reach past the cut edge of a wall
const TILE = { wood: 1.6, woodDark: 1.6, checker: 1.2, smallTile: 0.8, carpet: 0.5, carpetBlue: 0.5, concrete: 1 };
const FACING = { s: 0, n: Math.PI, e: Math.PI / 2, w: -Math.PI / 2 };

// Box with UVs measured in metres (one texture repeat per `s` metres).
export function boxGeo(w, h, d, s = 1, ou = 0, ov = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
    const i = f * 4 + k;
    uv.setXY(i, (uv.getX(i) * dims[f][0] + ou) / s, (uv.getY(i) * dims[f][1] + ov) / s);
  }
  return g;
}

// opts.merge = false keeps every mesh separate (for debugging the art).
export function buildHouse(scene, world, opts = {}) {
  const tx = makeTextures();
  const house = { tx, tags: [], scanMeshes: [], doors: {}, lights: {}, moons: [], flicker: [] };
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
  const M = {
    wood: std({ map: tx.furnWood, roughness: 0.6 }),
    fabric: std({ map: tx.fabric }),
    fabricBlue: std({ map: tx.fabricBlue }),
    sheet: std({ map: tx.sheet, color: 0xb8b2a6, roughness: 1, side: THREE.DoubleSide, shadowSide: THREE.BackSide }),
    underside: std({ color: 0x2a2420, roughness: 1 }),
    books: [0x5a2a24, 0x2a3a4a, 0x3a4a2e, 0x6a5a3a, 0x2a2a2e, 0x7a6a50, 0x4a2a3a].map((c) => std({ map: tx.bookSpine, color: c, roughness: 0.8 })),
    soil: std({ color: 0x2a1e14, roughness: 1 }),
    plantDry: std({ color: 0x6a5434, roughness: 1, side: THREE.DoubleSide }),
    steel: std({ color: 0xb8bcc2, metalness: 0.8, roughness: 0.28 }),
    steelIn: std({ color: 0x8a8e94, metalness: 0.7, roughness: 0.35, side: THREE.BackSide }),
    ovenGlass: std({ color: 0x08090a, roughness: 0.08, metalness: 0.3 }),
    hob: std({ color: 0x1a1a1c, roughness: 0.3 }),
    enamel: std({ color: 0xe8e4da, roughness: 0.25, side: THREE.DoubleSide }),
    tubFloor: std({ map: tx.tubStain, roughness: 0.3 }),
    brass: std({ color: 0x9a7a3a, metalness: 0.85, roughness: 0.35 }),
    porcelain: std({ color: 0xece9e2, roughness: 0.18 }),
    water: std({ color: 0x3a3426, roughness: 0.05, metalness: 0.2 }),
    basinIn: std({ color: 0xe2dfd8, roughness: 0.2, side: THREE.BackSide }),
    duvet: std({ map: tx.duvet, roughness: 1, side: THREE.DoubleSide, shadowSide: THREE.BackSide }),
    pillow: std({ color: 0xdedad0, roughness: 1 }),
    fur: std({ map: tx.fur, color: 0x8a6a48, roughness: 1 }),
    furLight: std({ map: tx.fur, color: 0xc8aa88, roughness: 1 }),
    mattressBare: std({ map: tx.mattress, roughness: 1 }),
    redDark: std({ color: 0x4a1612, roughness: 0.7 }),
    rope: std({ color: 0xb8a070, roughness: 1 }),
    panel: std({ color: 0xc8c6c0, roughness: 0.4 }),
    porthole: std({ color: 0x0c0e10, roughness: 0.05, metalness: 0.4 }),
    rags: [0x2a2e3a, 0x4a3030, 0x3a4a3a, 0x8a8070, 0x1e1e22, 0x5a5a7a].map((c) => std({ map: tx.rag, color: c, roughness: 1 })),
    fringe: std({ map: tx.fringe, color: 0xcfc0a0, roughness: 1, transparent: true, alphaTest: 0.4 }),
    card: std({ map: tx.cardboard, roughness: 0.95 }),
    white: std({ color: 0xe6e3dc, roughness: 0.3 }),
    paint: std({ color: 0xd8d3c6, roughness: 0.6 }),
    metal: std({ color: 0x8c9096, metalness: 0.6, roughness: 0.35 }),
    black: std({ color: 0x111113, roughness: 0.5 }),
    stone: std({ color: 0xbdb7aa, roughness: 0.45 }),
    cabinet: std({ map: tx.furnWood, color: 0x9a8a78, roughness: 0.6 }),
    frame: std({ color: 0xd9d4c7, roughness: 0.5 }),
    door: std({ map: tx.door, roughness: 0.6 }),
    plantDead: std({ color: 0x4a4a2a, roughness: 1, side: THREE.DoubleSide }),
    pot: std({ color: 0x6a3a2a, roughness: 0.9 }),
    mattress: std({ color: 0xb8b2a0, roughness: 1 }),
    red: std({ color: 0x8a2a22, roughness: 0.7 }),
    exterior: std({ color: 0x222222 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x8899bb, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.18, depthWrite: false }),
  };
  house.M = M;

  // ---------- floors and ceiling ----------
  for (const r of ROOMS) {
    const w = r.x1 - r.x0, d = r.z1 - r.z0, s = TILE[r.floor];
    const g = new THREE.PlaneGeometry(w, d);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w + r.x0) / s, (uv.getY(i) * d - r.z1) / s);
    const carpet = r.floor.includes('arpet');
    const mesh = new THREE.Mesh(g, std({ map: tx.floor[r.floor], bumpMap: tx.floor[r.floor], bumpScale: carpet ? 3 : 1.6, roughness: carpet ? 1 : 0.5 }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(r.x0 + w / 2, 0, r.z0 + d / 2);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }
  {
    const g = new THREE.PlaneGeometry(HOUSE.w, HOUSE.d);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * HOUSE.w, uv.getY(i) * HOUSE.d);
    const ceil = new THREE.Mesh(g, std({ map: tx.ceiling, roughness: 1 }));
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(HOUSE.w / 2, HOUSE.wallH, HOUSE.d / 2);
    scene.add(ceil);
  }

  // ---------- walls ----------
  const wallMat = {};
  ROOMS.forEach((r, i) => { wallMat[i] = std({ map: tx.wall[r.wall], bumpMap: tx.wall[r.wall], bumpScale: 1.2, roughness: 0.88 }); });
  const sideMat = (x, z) => { const ri = world.roomAt(x, z); return ri >= 0 ? wallMat[ri] : M.exterior; };
  for (const p of world.pieces) {
    const w = p.x1 - p.x0, h = p.y1 - p.y0, d = p.z1 - p.z0;
    const mx = (p.x0 + p.x1) / 2, mz = (p.z0 + p.z1) / 2;
    const geo = boxGeo(w, h, d, 1, p.along === 'x' ? p.x0 : p.z0, p.y0);
    let mats;
    if (p.along === 'x') {
      const a = sideMat(mx, p.at + 0.2), b = sideMat(mx, p.at - 0.2);
      mats = [a, a, a, a, a, b];
    } else {
      const a = sideMat(p.at + 0.2, mz), b = sideMat(p.at - 0.2, mz);
      mats = [a, b, a, a, a, a];
    }
    const mesh = new THREE.Mesh(geo, mats);
    mesh.position.set(mx, p.y0 + h / 2, mz);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    house.scanMeshes.push(mesh);
    if (p.y1 >= HOUSE.wallH - 1e-3 && world.roomAt(mx + 0.2, mz + 0.2) !== world.roomIndex('laundry')) {   // crown moulding
      const ct = HOUSE.wallT + 0.05, ch = 0.07;
      const cm = new THREE.Mesh(boxGeo(p.along === 'x' ? w : ct, ch, p.along === 'x' ? ct : d, 1), M.frame);
      cm.position.set(mx, HOUSE.wallH - ch / 2, mz);
      scene.add(cm);
      const cm2 = new THREE.Mesh(boxGeo(p.along === 'x' ? w : ct + 0.03, 0.015, p.along === 'x' ? ct + 0.03 : d, 1), M.frame);
      cm2.position.set(mx, HOUSE.wallH - ch - 0.0075, mz);
      scene.add(cm2);
    }
    if (p.y0 === 0) {  // skirting board
      const bh = 0.09, bt = HOUSE.wallT + 0.024;
      // a few mm longer than the wall piece: its end then wraps the wall's cut edge instead of sharing its plane
      const bb = new THREE.Mesh(boxGeo(p.along === 'x' ? w + 0.006 : bt, bh, p.along === 'x' ? bt : d + 0.006, 1), M.frame);
      bb.position.set(mx, bh / 2, mz);
      bb.receiveShadow = true;
      scene.add(bb);
      // a wall socket at robot height on each room side of longer pieces
      const len = Math.max(w, d);
      if (len > 1.4 && h > 2) for (const side of [-1, 1]) {
        const ox = p.along === 'z' ? side * (HOUSE.wallT / 2 + 0.006) : 0, oz = p.along === 'x' ? side * (HOUSE.wallT / 2 + 0.006) : 0;
        if (world.roomAt(mx + (p.along === 'z' ? side * 0.3 : 0), mz + (p.along === 'x' ? side * 0.3 : 0)) < 0) continue;
        const s = new THREE.Mesh(new THREE.BoxGeometry(p.along === 'x' ? 0.075 : 0.01, 0.115, p.along === 'x' ? 0.01 : 0.075), M.white);
        s.position.set(mx + ox, 0.3, mz + oz);
        scene.add(s);
        for (const k of [-1, 1]) {
          const hole = new THREE.Mesh(new THREE.BoxGeometry(p.along === 'x' ? 0.008 : 0.012, 0.018, p.along === 'x' ? 0.012 : 0.008), M.black);
          hole.position.set(mx + ox * 1.15 + (p.along === 'x' ? k * 0.017 : 0), 0.3, mz + oz * 1.15 + (p.along === 'z' ? k * 0.017 : 0));
          scene.add(hole);
        }
      }
    }
  }

  // ---------- windows ----------
  for (const wi of world.windows) {
    const L = wi.to - wi.from, H = wi.top - wi.sill, c = (wi.from + wi.to) / 2, cy = (wi.sill + wi.top) / 2;
    const inward = wi.at === 0 ? 1 : -1;
    const grp = new THREE.Group();
    const ft = 0.05, fd = HOUSE.wallT + 0.02;
    // The frame lines the opening and overlaps it by OVERLAP: a face lying exactly on the wall's cut edge would z-fight.
    const e = OVERLAP;
    const parts = [[L + ft * 2, ft + e, fd, 0, wi.top - cy + (ft - e) / 2], [L + ft * 2, ft + e, fd + 0.06, 0, wi.sill - cy - (ft - e) / 2],
      [ft + e, H, fd, -L / 2 - (ft - e) / 2, 0], [ft + e, H, fd, L / 2 + (ft - e) / 2, 0], [0.035, H, 0.03, 0, 0], [L, 0.035, 0.03, 0, 0]];
    for (const [w, h, d, x, y] of parts) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M.frame);
      m.position.set(x, y, 0);
      grp.add(m);
    }
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(L, H), M.glass);
    grp.add(glass);
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(L + 1.2, H + 1.2), new THREE.MeshBasicMaterial({ map: tx.sky, color: 0x9aa6c0 }));
    sky.position.z = -0.6;
    grp.add(sky);
    // orient: local +z points into the house
    if (wi.along === 'x') { grp.position.set(c, cy, wi.at); grp.rotation.y = inward > 0 ? 0 : Math.PI; }
    else { grp.position.set(wi.at, cy, c); grp.rotation.y = inward > 0 ? Math.PI / 2 : -Math.PI / 2; }
    scene.add(grp);
    if (wi.moon) {
      const spot = new THREE.SpotLight(0x9db0ff, 70, 10, 0.4, 0.25, 2);
      spot.map = tx.cookie;
      const out = new THREE.Vector3(0, 1.5, -2.4), tgt = new THREE.Vector3(0, -cy, 1.7);
      grp.updateMatrixWorld();
      spot.position.copy(grp.localToWorld(out.clone()));
      spot.target.position.copy(grp.localToWorld(tgt.clone()));
      scene.add(spot, spot.target);
      house.moons.push({ spot, base: spot.target.position.clone() });
    }
  }

  // ---------- doors ----------
  for (const d of Object.values(world.doors)) {
    const L = d.to - d.from, h = world.doors[d.id].top - 0.01;
    const pivot = new THREE.Group();
    const base = d.along === 'x' ? 0 : -Math.PI / 2;
    const sw = d.along === 'x' ? d.swing : -d.swing;
    const openAngle = base + (d.hinge === 'from' ? -1 : 1) * (sw > 0 ? 1 : -1) * (Math.PI / 2);
    const dir = d.hinge === 'from' ? 1 : -1;
    const hinge = d.hinge === 'from' ? d.from : d.to;
    if (d.along === 'x') pivot.position.set(hinge, 0, d.at); else pivot.position.set(d.at, 0, hinge);
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(L - 0.01, h, 0.045), M.door);
    leaf.position.set(dir * (L / 2), h / 2, 0);
    leaf.castShadow = leaf.receiveShadow = true;
    pivot.add(leaf);
    for (const s of [-1, 1]) {
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), M.metal);
      knob.position.set(dir * (L - 0.09), 0.95, s * 0.045);
      pivot.add(knob);
    }
    // frame
    const fr = new THREE.Group();
    const top = h + 0.01, e = OVERLAP;   // overlap the cut edges of the wall so no face lies on one
    for (const [w, hh, x, y] of [[0.06 + e, top + 0.04, d.from - (0.06 - e) / 2, (top + 0.04) / 2], [0.06 + e, top + 0.04, d.to + (0.06 - e) / 2, (top + 0.04) / 2], [L + 0.12, 0.06 + e, (d.from + d.to) / 2, top + (0.06 - e) / 2]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, HOUSE.wallT + 0.03), M.frame);
      if (d.along === 'x') m.position.set(x, y, d.at); else { m.position.set(d.at, y, x); m.rotation.y = Math.PI / 2; }
      fr.add(m);
    }
    scene.add(fr);
    const closed = base;
    pivot.rotation.y = d.state === 'open' ? openAngle : closed;
    scene.add(pivot);
    house.scanMeshes.push(leaf);
    house.doors[d.id] = { pivot, leaf, closed, open: openAngle, target: pivot.rotation.y, speed: 1.2 };
    if (d.id === 'laundry') {
      // light leaking under the laundry door
      const leak = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.06, 0.012), new THREE.MeshBasicMaterial({ color: 0xffd27a }));
      leak.position.set((d.from + d.to) / 2, 0.006, d.at + 0.03);
      scene.add(leak);
      house.leak = leak;
    }
  }
  // The laundry door, hall side: scratch marks, four deadbolts (the lowest at robot height), and the dog flap
  // screwed shut with plywood, light bleeding round it. After it gets out the bottom bolt hangs torn out.
  {
    const d = world.doors.laundry, pv = house.doors.laundry.pivot, L = d.to - d.from, dir = d.hinge === 'from' ? 1 : -1;
    const scratch = new THREE.MeshStandardMaterial({ map: scratchTex(), transparent: true, roughness: 0.8, depthWrite: false });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), scratch);
    m.position.set(dir * L * 0.5, 0.56, 0.026);
    pv.add(m);
    const brass = std({ color: 0xb08a3a, metalness: 0.85, roughness: 0.35 });
    const bolt = (y) => {
      const g = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.075, 0.012), brass);
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.016, 14), brass);
      cyl.rotation.x = Math.PI / 2; cyl.position.z = 0.012;
      const slot = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.022, 0.004), M.black);
      slot.position.z = 0.021;
      g.add(plate, cyl, slot);
      g.position.set(dir * (L - 0.09), y, 0.029);
      pv.add(g);
      return g;
    };
    for (const y of [1.25, 1.55, 1.85]) bolt(y);
    house.boltIntact = bolt(0.17);
    // torn out: hanging off one screw, splintered wood behind it
    const torn = new THREE.Group();
    const tb = bolt(0.17); pv.remove(tb);
    tb.position.set(0.018, -0.03, 0.01); tb.rotation.z = dir * 0.9;
    const splinter = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.12), std({ color: 0xd8c09a, roughness: 1 }));
    splinter.position.z = 0.0;
    torn.add(splinter, tb);
    torn.position.set(dir * (L - 0.09), 0.17, 0.0245);
    torn.visible = false;
    pv.add(torn);
    house.boltTorn = torn;
    const screws = new THREE.Group();
    for (let k = 0; k < 4; k++) {
      const sc = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.0015, 0.03, 6), M.metal);
      sc.rotation.set(Math.PI / 2, 0, k * 1.7);
      sc.position.set(12.92 + k * 0.05 + (k % 2) * 0.03, 0.005, 5.18 + (k % 3) * 0.06);
      screws.add(sc);
    }
    screws.visible = false;
    screws.userData.dynamic = true;
    scene.add(screws);
    house.screws = screws;
    // the dog flap, screwed shut
    const ply = new THREE.Mesh(boxGeo(0.34, 0.3, 0.015, 0.5), std({ map: tx.furnWood, color: 0xc8b08a, roughness: 0.9 }));
    ply.position.set(dir * L * 0.5, 0.21, 0.0305);
    pv.add(ply);
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, 1], [0, -1]]) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.004, 8), M.metal);
      s.rotation.x = Math.PI / 2;
      s.position.set(dir * L * 0.5 + sx * 0.15, 0.21 + sy * 0.13, 0.039);
      pv.add(s);
    }
    house.flapGlow = new THREE.MeshBasicMaterial({ color: 0xffc870 });
    for (const [w, h, x, y] of [[0.36, 0.008, 0, 0.155], [0.36, 0.008, 0, -0.155], [0.008, 0.32, 0.175, 0], [0.008, 0.32, -0.175, 0]]) {
      const e = new THREE.Mesh(new THREE.PlaneGeometry(w, h), house.flapGlow);
      e.position.set(dir * L * 0.5 + x, 0.21 + y, 0.0235);
      pv.add(e);
    }
  }
  // Theo's door, hall side: a chain on the OUTSIDE, ripped from the jamb. They locked him in at night.
  {
    const d = world.doors.kid, pv = house.doors.kid.pivot, L = d.to - d.from, dir = d.hinge === 'from' ? 1 : -1;
    const brass = std({ color: 0xa08040, metalness: 0.8, roughness: 0.4 });
    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.01), brass);
    slide.position.set(dir * (L - 0.13), 1.52, -0.028);
    pv.add(slide);
    for (let k = 0; k < 7; k++) {   // the chain hangs straight down from the end of the slide
      const link = new THREE.Mesh(new THREE.TorusGeometry(0.009, 0.0022, 5, 10), M.metal);
      link.position.set(dir * (L - 0.075), 1.505 - k * 0.016, -0.034);
      link.rotation.y = k % 2 ? Math.PI / 2 : 0;
      pv.add(link);
    }
    const stub = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.006), brass);   // the keeper, still on the chain
    stub.position.set(dir * (L - 0.075), 1.38, -0.034); stub.rotation.z = 0.4;
    pv.add(stub);
    const jamb = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.1), std({ color: 0xd8c09a, roughness: 1 }));   // splintered jamb
    jamb.position.set(d.from - 0.03, 1.52, d.at - HOUSE.wallT / 2 - 0.0165);
    jamb.rotation.y = Math.PI;
    scene.add(jamb);
  }
  // Claw gouges low on the back door, kitchen side.
  {
    const d = world.doors.back, pv = house.doors.back.pivot, dir = d.hinge === 'from' ? 1 : -1;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3), new THREE.MeshStandardMaterial({ map: scratchTex(), transparent: true, roughness: 0.8, depthWrite: false, color: 0xd0c4b0 }));
    m.position.set(dir * 0.42, 0.24, 0.026);
    pv.add(m);
  }
  // Pet flaps: the one at the end of the hall, just big enough for a robot, and on Night 5 Biscuit's old dog
  // door to the garden (screwed shut with plywood until the story takes it off).
  house.flaps = [];
  for (const f of world.flaps) {
    const cx = (f.from + f.to) / 2, L = f.to - f.from;
    const frameMat = std({ color: 0xcfc6b0, roughness: 0.5 });
    const grp = new THREE.Group();   // drawn along x; turned for a wall along z
    if (f.along === 'z') { grp.position.set(f.at, 0, cx); grp.rotation.y = Math.PI / 2; } else grp.position.set(cx, 0, f.at);
    for (const side of [-1, 1]) {
      const z = side * (HOUSE.wallT / 2 + 0.0075);   // just proud of the skirting's face
      for (const [w, h, x, y] of [[L + 0.08, 0.04, 0, f.top + 0.02], [0.04, f.top + 0.04, -L / 2 - 0.02, (f.top + 0.04) / 2], [0.04, f.top + 0.04, L / 2 + 0.02, (f.top + 0.04) / 2]]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), frameMat);
        m.position.set(x, y, z);
        grp.add(m);
      }
    }
    const pivot = new THREE.Group();
    pivot.position.set(0, f.top - 0.005, 0);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(L - 0.01, f.top - 0.02, 0.006), new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.3, transparent: true, opacity: 0.82 }));
    flap.position.y = -(f.top - 0.02) / 2;
    pivot.add(flap);
    pivot.userData.dynamic = true;
    grp.add(pivot);
    if (f.outside) {   // plywood screwed over the inside, for as long as the block is there
      const board = new THREE.Group();
      const ply = new THREE.Mesh(boxGeo(L + 0.14, f.top + 0.1, 0.015, 0.5), std({ map: tx.furnWood, color: 0xc8b08a, roughness: 0.9 }));
      ply.position.set(0, (f.top + 0.1) / 2, HOUSE.wallT / 2 + 0.022);
      board.add(ply);
      for (const [sx, sy] of [[-1, 0.15], [1, 0.15], [-1, 0.85], [1, 0.85]]) {
        const sc = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.004, 8), M.metal);
        sc.rotation.x = Math.PI / 2;
        sc.position.set(sx * (L / 2 + 0.04), sy * (f.top + 0.1), HOUSE.wallT / 2 + 0.031);
        board.add(sc);
      }
      board.userData.dynamic = true;
      board.visible = Object.keys(world.blocks).length > 0;
      grp.add(board);
      house.dogFlapBoard = board;
    }
    scene.add(grp);
    grp.updateMatrixWorld(true);
    house.flaps.push({ pivot, x: f.along === 'z' ? f.at : cx, z: f.along === 'z' ? cx : f.at, along: f.along });
    house.tags.push({ label: f.outside ? 'dog door' : 'pet door', box: new THREE.Box3().setFromObject(flap).expandByScalar(0.03), conf: 0.81, obj: flap });
  }
  house.petFlap = house.flaps[0]?.pivot;

  // ---------- holes torn through walls (Night 2) ----------
  // Torn paper and broken plasterboard round the opening on both faces, shards of it sticking into the gap,
  // and the pieces on the floor either side.
  for (const h of world.holes) {
    const L = h.to - h.from, c = (h.from + h.to) / 2;
    const W = L + 0.7, H = Math.min(HOUSE.wallH - 0.08, h.top + 0.35);
    const mat = new THREE.MeshStandardMaterial({ map: tx.holeRim(W, H, L, h.top), transparent: true, roughness: 0.95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    // u runs along the wall, n out of it (n > 0: toward larger x or z)
    const at = (u, y, n) => (h.along === 'z' ? new THREE.Vector3(h.at + n, y, u) : new THREE.Vector3(u, y, h.at + n));
    const turn = h.along === 'z' ? Math.PI / 2 : 0;
    for (const side of [-1, 1]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
      m.position.copy(at(c, H / 2, side * (HOUSE.wallT / 2 + 0.004)));
      m.rotation.y = h.along === 'z' ? side * Math.PI / 2 : (side > 0 ? 0 : Math.PI);
      m.userData.noShadow = true;
      scene.add(m);
    }
    const plaster = std({ color: 0xcfc8b8, roughness: 1 });
    const shard = (u, y, du, dy, tilt) => {   // du, dy: size along the wall and up; the depth is just inside the wall's
      const m = new THREE.Mesh(new THREE.BoxGeometry(du, dy, HOUSE.wallT - 0.016), plaster);
      m.position.copy(at(u, y, (rnd() - 0.5) * 0.004));
      m.rotation.set(0, turn, tilt);
      m.castShadow = true;
      scene.add(m);
    };
    for (const [edge, dir] of [[h.from, 1], [h.to, -1]]) {   // the sides: shards poking in, fewer low down where it squeezes through
      for (let k = 0; k < 6; k++) {
        const y = k < 1 ? 0.08 + rnd() * 0.25 : 0.55 + rnd() * (h.top - 0.7), poke = k < 1 ? 0.02 + rnd() * 0.02 : 0.03 + rnd() * 0.06;
        shard(edge + dir * (poke / 2 - 0.012), y, poke + 0.024, 0.05 + rnd() * 0.14, (rnd() - 0.5) * 0.6);
      }
    }
    for (let k = 0; k < 7; k++) {   // the top edge hangs down in broken teeth
      const hang = 0.03 + rnd() * 0.11;
      shard(h.from + 0.06 + rnd() * (L - 0.12), h.top - hang / 2 + 0.012, 0.05 + rnd() * 0.12, hang + 0.024, (rnd() - 0.5) * 0.5);
    }
    const chunk = std({ color: 0xd8d2c2, roughness: 1 });
    for (let k = 0; k < 22; k++) {   // pieces on the floor, both sides and in the gap
      const s = 0.025 + rnd() * 0.06, n = (rnd() - 0.5) * 1.4, u = c + (rnd() - 0.5) * (Math.abs(n) < 0.1 ? L * 0.8 : L + 0.5);
      const m = new THREE.Mesh(new THREE.BoxGeometry(s, 0.012, s * (0.5 + rnd())), chunk);
      m.position.copy(at(u, 0.006, n));
      m.rotation.set((rnd() - 0.5) * 0.3, rnd() * 3, (rnd() - 0.5) * 0.3);
      scene.add(m);
    }
  }

  // ---------- furniture ----------
  for (const f of FURNITURE) {
    const fw = f.x1 - f.x0, fd = f.z1 - f.z0;
    const rot = FACING[f.facing || 's'];
    const side = f.facing === 'e' || f.facing === 'w';
    const w = side ? fd : fw, d = side ? fw : fd;
    const g = new THREE.Group();
    const build = BUILDERS[f.type];
    if (!build) continue;
    const extra = build(g, w, d, f, M, tx, house) || {};
    g.position.set((f.x0 + f.x1) / 2, 0, (f.z0 + f.z1) / 2);
    g.rotation.y = rot;
    g.traverse((o) => { if (o.isMesh) { o.castShadow = o.userData.noShadow ? false : true; o.receiveShadow = true; } });
    scene.add(g);
    g.updateMatrixWorld(true);
    if (f.type !== 'rug') g.traverse((o) => { if (o.isMesh && !o.userData.noScan) house.scanMeshes.push(o); });
    if (f.label) {
      const box = new THREE.Box3().setFromObject(g);
      house.tags.push({ label: f.label, box, conf: 0.62 + Math.random() * 0.35, obj: g, fake: f.type === 'coatRack' });
    }
    Object.assign(house, extra);
  }

  // ---------- contact shadows ----------
  // Blurred darkness along every wall and around and under the furniture, multiplied onto the floor.
  {
    const S = 64, c = document.createElement('canvas');
    c.width = HOUSE.w * S; c.height = HOUSE.d * S;
    const g = c.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, c.width, c.height);
    g.filter = `blur(${Math.round(S * 0.16)}px)`;
    const box = (r, a, grow = 0.02) => { g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect((r.x0 - grow) * S, (r.z0 - grow) * S, (r.x1 - r.x0 + grow * 2) * S, (r.z1 - r.z0 + grow * 2) * S); };
    for (const p of world.pieces) if (p.y0 < 0.5) box(p, 0.72, 0.05);
    for (const f of world.furniture) {
      if (f.info.flat) continue;
      if (f.info.solid) box(f.rect, 0.7, 0.04);
      else box(f.rect, f.info.clear < 0.4 ? 0.55 : 0.32, 0.02);   // the dark under beds and sofas
    }
    g.filter = 'blur(3px)';
    for (const f of world.furniture) if (f.info.solid && !f.info.flat) box(f.rect, 0.35, 0.0);   // tight contact line
    g.filter = 'none';
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    const ao = new THREE.Mesh(new THREE.PlaneGeometry(HOUSE.w, HOUSE.d), new THREE.MeshBasicMaterial({
      map: t, transparent: true, premultipliedAlpha: true, blending: THREE.MultiplyBlending, depthWrite: false,
      polygonOffset: true, polygonOffsetFactor: -1.5, polygonOffsetUnits: -1.5,
    }));
    ao.rotation.x = -Math.PI / 2;
    ao.position.set(HOUSE.w / 2, 0.0065, HOUSE.d / 2);
    ao.renderOrder = 1.5;
    ao.userData.dynamic = true;   // keep out of the static merge: it has its own blending and draw order
    scene.add(ao);
  }

  // ---------- decals and details ----------
  {  // Theo's drawing on the east wall, low down where only a robot would notice
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.65), new THREE.MeshStandardMaterial({ map: tx.crayon, transparent: true, roughness: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.set(7.5 - HOUSE.wallT / 2 - 0.004, 0.42, 8.62);
    m.rotation.y = -Math.PI / 2;
    scene.add(m);
    house.tags.push({ label: 'drawing', box: new THREE.Box3().setFromObject(m), conf: 0.55, obj: m });
  }
  {  // dog bowl, freshly filled
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.06, 18), M.metal);
    bowl.position.set(7.0, 0.03, 4.65);
    const food = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.01, 18), std({ color: 0x5a3a20, roughness: 1 }));
    food.position.set(7.0, 0.055, 4.65);
    scene.add(bowl, food);
    house.tags.push({ label: 'bowl', box: new THREE.Box3().setFromObject(bowl), conf: 0.93, obj: bowl });
  }
  {  // smoke alarm, knocked off the ceiling, dangling on its wires and still blinking
    const X = 5.4, Z = 5.22, Y = HOUSE.wallH - 0.36;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 16), M.white);
    base.position.set(X, HOUSE.wallH - 0.006, Z);
    const det = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 16), M.white);
    det.position.set(X + 0.03, Y, Z + 0.02);
    det.rotation.set(1.2, 0, 0.35);
    const wire = (col, ox) => {
      const a = new THREE.Vector3(X + ox, HOUSE.wallH - 0.01, Z), b = new THREE.Vector3(X + 0.03 + ox * 0.6, Y + 0.05, Z - 0.005);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0025, a.distanceTo(b), 4), std({ color: col, roughness: 0.6 }));
      m.position.copy(a).add(b).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      scene.add(m);
    };
    wire(0xb02020, 0.012); wire(0x111111, -0.012);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 4), new THREE.MeshBasicMaterial({ color: 0xff2020 }));
    led.position.set(X + 0.03, Y - 0.006, Z + 0.035);
    scene.add(base, det, led);
    house.smokeLed = led;
  }
  {  // crayon on the wall under Theo's bed, at robot height: "UNDER HERE HE CANT REACH", and the nights, counted
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.15), new THREE.MeshStandardMaterial({ map: tx.underBed, transparent: true, roughness: 1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.set(3 + HOUSE.wallT / 2 + 0.004, 0.162, 8.9);   // between the skirting and the bed rail
    m.rotation.y = Math.PI / 2;
    m.userData.noShadow = true;
    scene.add(m);
    house.tags.push({ label: 'writing', box: new THREE.Box3().setFromObject(m).expandByScalar(0.02), conf: 0.44, obj: m });
  }
  // The laundry: where it lives. A hole torn low in the wall beside the washing machines, chunks of
  // plasterboard on the floor in front of it, and long dark drags down the walls.
  {
    const decal = (map, w, h, x, y, z, ry, opts = {}) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map, transparent: true, roughness: 0.95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, ...opts }));
      m.position.set(x, y, z); m.rotation.y = ry;
      m.userData.noShadow = true;
      scene.add(m);
      return m;
    };
    decal(tx.hole, 0.8, 0.8, 12.66, 0.4, HOUSE.wallT / 2 + 0.004, 0);
    const chunk = std({ color: 0xe0dacb, roughness: 1 });
    for (let k = 0; k < 7; k++) {
      const s = 0.03 + Math.random() * 0.06;
      const m = new THREE.Mesh(new THREE.BoxGeometry(s, 0.012, s * (0.6 + Math.random())), chunk);
      m.position.set(12.45 + Math.random() * 0.5, 0.006, 0.12 + Math.random() * 0.4);
      m.rotation.set((Math.random() - 0.5) * 0.3, Math.random() * 3, (Math.random() - 0.5) * 0.3);
      scene.add(m);
    }
    decal(tx.smears, 2.2, 1.1, 14 - HOUSE.wallT / 2 - 0.004, 1.65, 2.2, -Math.PI / 2);
    decal(tx.smears, 1.6, 0.8, 13.2, 1.75, HOUSE.wallT / 2 + 0.004, 0, { opacity: 0.8 });
    decal(scratchTex(), 0.5, 0.4, 11 + HOUSE.wallT / 2 + 0.004, 0.55, 3.6, Math.PI / 2, { color: 0x2a2420 });
  }
  // Grey scuffs on the tops of the door frames, at the height of something that has to stoop.
  {
    const mat = new THREE.MeshStandardMaterial({ map: tx.scuff, transparent: true, depthWrite: false, roughness: 0.9, polygonOffset: true, polygonOffsetFactor: -2 });
    for (const p of world.lintels) {
      const w = p.along === 'x' ? p.x1 - p.x0 : p.z1 - p.z0;
      for (const side of [-1, 1]) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.8, 0.14), mat);
        if (p.along === 'x') { m.position.set((p.x0 + p.x1) / 2, p.y0 + 0.08, p.at + side * (HOUSE.wallT / 2 + 0.003)); m.rotation.y = side > 0 ? 0 : Math.PI; }
        else { m.position.set(p.at + side * (HOUSE.wallT / 2 + 0.003), p.y0 + 0.08, (p.z0 + p.z1) / 2); m.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2; }
        m.userData.noShadow = true;
        scene.add(m);
      }
    }
  }
  // Marks gouged into the floor where something heavy was dragged: two pale scratches per foot.
  if (SCRAPES.length) {
    const mat = new THREE.MeshStandardMaterial({ color: 0xc8a878, transparent: true, opacity: 0.45, roughness: 0.9, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1.5, polygonOffsetUnits: -1.5 });
    for (const [ax, az, bx, bz] of SCRAPES) {
      const len = Math.hypot(bx - ax, bz - az), yaw = Math.atan2(bz - az, bx - ax);
      for (const off of [-0.017, 0.016]) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.007), mat);
        m.rotation.order = 'YXZ';
        m.rotation.set(-Math.PI / 2, -yaw, 0);
        m.position.set((ax + bx) / 2 - Math.sin(yaw) * off, 0.0035, (az + bz) / 2 + Math.cos(yaw) * off);
        m.userData.noShadow = true;
        scene.add(m);
      }
    }
  }
  // Plug-in nightlights: a warm lens and a soft glow on the wall and floor (no real light: lights cost every pixel).
  house.nightlights = NIGHTLIGHTS.map((n) => {
    const out = n.facing === 'n' ? [0, -1] : n.facing === 's' ? [0, 1] : n.facing === 'e' ? [1, 0] : [-1, 0];
    const g = new THREE.Group();
    g.position.set(n.x, 0, n.z);
    g.rotation.y = Math.atan2(out[0], out[1]);
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.075, 0.03), M.white);
    body.position.set(0, 0.3, 0.015);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xffa850 });
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), lensMat);
    lens.rotation.x = Math.PI / 2; lens.position.set(0, 0.3, 0.03);
    const glowMat = (o) => new THREE.MeshBasicMaterial({ map: tx.glow, color: 0xff9a40, transparent: true, opacity: o, depthWrite: false, blending: THREE.AdditiveBlending });
    const wallGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), glowMat(0.35));
    wallGlow.position.set(0, 0.3, 0.004);
    const floorGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), glowMat(0.28));
    floorGlow.rotation.x = -Math.PI / 2; floorGlow.position.set(0, 0.009, 0.3);
    for (const o of [lens, wallGlow, floorGlow]) o.userData.noShadow = true;
    g.add(body, lens, wallGlow, floorGlow);
    g.userData.dynamic = true;
    scene.add(g);
    return { x: n.x + out[0] * 0.05, z: n.z + out[1] * 0.05, lensMat, glows: [wallGlow.material, floorGlow.material], alive: true, dying: 0 };
  });
  // Ceiling lights: dead, except on the nights the power is back on (CEILING), when it can switch them on.
  // Each of those has a light that is removed from the scene until it is lit (every light costs every pixel).
  house.roomLights = {};
  ROOMS.forEach((r, ri) => {
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.glass.clone());
    lamp.material.opacity = 0.5;
    lamp.rotation.x = Math.PI;
    lamp.position.set((r.x0 + r.x1) / 2, HOUSE.wallH, (r.z0 + r.z1) / 2);
    scene.add(lamp);
    if (!CEILING.includes(r.id)) return;
    lamp.userData.dynamic = true;
    lamp.material.emissive = new THREE.Color(0xffe2b8);
    lamp.material.emissiveIntensity = 0;
    const light = new THREE.PointLight(0xffe2b8, 0, 7.5, 2);
    light.position.set((r.x0 + r.x1) / 2, HOUSE.wallH - 0.3, (r.z0 + r.z1) / 2);
    light.visible = false;
    light.userData.base = r.id === 'hall' ? 7 : 9;
    scene.add(light);
    house.roomLights[ri] = { light, dome: lamp.material };
  });

  // ---------- decor: things on the walls and floor that some nights add ----------
  for (const dc of DECOR) {
    if (dc.kind === 'photo') {   // a family photo in a frame; back: turned to face the wall
      const g = new THREE.Group();
      B(g, 0.3, 0.38, 0.02, 0, -0.19, 0.01, dc.back ? M.card : M.wood);
      if (!dc.back) {
        const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.3), std({ map: tx.polaroid, roughness: 0.4 }));
        pic.position.set(0, 0, 0.021);
        g.add(pic);
      }
      g.position.set(dc.x, dc.y, dc.z + (dc.facing === 's' ? 0.003 : -0.003));
      g.rotation.set(0, dc.facing === 'n' ? Math.PI : 0, dc.tilt || 0);
      scene.add(g);
      if (!dc.back) house.tags.push({ label: 'photo', box: new THREE.Box3().setFromObject(g), conf: 0.7, obj: g });
    } else if (dc.kind === 'tableLamp') {   // a bedside lamp: off, until something wants you to see
      const g = new THREE.Group();
      C(g, 0.07, 0.08, 0.025, 0, 0, 0, M.brass, 16);
      C(g, 0.012, 0.012, 0.28, 0, 0.025, 0, M.brass, 8);
      house.bedLampShade = std({ color: 0xe8dcc0, roughness: 0.9, side: THREE.DoubleSide, emissive: new THREE.Color(0xffc080), emissiveIntensity: 0 });
      C(g, 0.08, 0.13, 0.17, 0, 0.26, 0, house.bedLampShade, 20).geometry = new THREE.CylinderGeometry(0.08, 0.13, 0.17, 20, 1, true);
      g.position.set(dc.x, dc.y, dc.z);
      g.userData.dynamic = true;
      scene.add(g);
      house.tags.push({ label: 'lamp', box: new THREE.Box3().setFromObject(g), conf: 0.83, obj: g });
    } else if (dc.kind === 'plywood') {   // where the hole was: a sheet of plywood screwed over it, laundry side
      const ply = new THREE.Mesh(boxGeo(0.015, dc.h, dc.w, 0.5), std({ map: tx.furnWood, color: 0xc8b08a, roughness: 0.9 }));
      ply.position.set(dc.x, dc.h / 2, dc.z);
      scene.add(ply);
      for (const [dz, y] of [[-1, 0.15], [1, 0.15], [-1, dc.h - 0.12], [1, dc.h - 0.12], [-1, dc.h / 2], [1, dc.h / 2]]) {
        const sc = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.004, 8), M.metal);
        sc.rotation.z = Math.PI / 2;
        sc.position.set(dc.x + 0.009, y, dc.z + dz * (dc.w / 2 - 0.05));
        scene.add(sc);
      }
    } else if (dc.kind === 'bowl') {   // its bowl, in its room
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.07, 18), M.metal);
      bowl.position.set(dc.x, 0.035, dc.z);
      const food = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.01, 18), std({ color: 0x5a3a20, roughness: 1 }));
      food.position.set(dc.x, 0.065, dc.z);
      scene.add(bowl, food);
      house.tags.push({ label: 'bowl', box: new THREE.Box3().setFromObject(bowl), conf: 0.95, obj: bowl });
    } else if (dc.kind === 'garden') {   // outside the dog door: wet grass in the dark
      const t = tx.floor.carpet.clone();
      t.repeat.set(30, 30); t.needsUpdate = true;
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), std({ map: t, color: 0x2a4020, roughness: 1 }));
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(7, -0.003, 5);
      ground.receiveShadow = true;
      scene.add(ground);
    }
  }

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight(0x6070a0, 0x100c08, 0.3);
  scene.add(hemi);
  house.lights.hemi = hemi;
  const point = (key, intensity, distance) => {
    const L = LIGHTS[key];
    const p = new THREE.PointLight(L.color, intensity, distance, 2);
    p.position.set(L.x, L.y, L.z);
    scene.add(p);
    house.lights[key] = p;
    p.userData.base = intensity;
    return p;
  };
  point('lamp', 1.8, 6);
  point('tv', 0, 6);
  point('fridge', 0, 5);
  point('nightlight', 1.8, 3.5);
  if (LIGHTS.bedLamp) { const p = point('bedLamp', 0, 4.5); p.userData.base = 5; p.visible = false; }
  {
    const d = world.doors.laundry;
    const p = new THREE.PointLight(0xffc870, 0.35, 1.6, 2);
    p.position.set((d.from + d.to) / 2, 0.05, d.at + 0.15);
    scene.add(p);
    house.lights.leak = p;
    p.userData.base = 0.35;
    p.userData.slit = p.position.clone();
    p.userData.bulb = new THREE.Vector3(12.6, 2.0, 2.4);
    // the bare bulb inside the laundry
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.4, 4), M.black);
    cord.position.set(12.6, HOUSE.wallH - 0.2, 2.4);
    house.bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff0c0, emissive: 0xffd080, emissiveIntensity: 0 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), house.bulbMat);
    bulb.position.set(12.6, HOUSE.wallH - 0.42, 2.4);
    bulb.userData.noShadow = true;
    scene.add(cord, bulb);
  }
  {  // only used by the ending shot: the robot's glow lighting what stands over it
    const p = new THREE.PointLight(0x9fd8ff, 0, 4.5, 2);
    p.position.set(0.85, 0.12, 2.75);
    scene.add(p);
    house.lights.cine = p;
    p.visible = false;
  }
  house.tvStatic = makeStatic();

  // Things that move or blink stay separate; everything else is merged per material.
  for (const d of Object.values(house.doors)) d.pivot.userData.dynamic = true;
  if (house.fridgeDoor) house.fridgeDoor.userData.dynamic = true;
  if (house.pendulum) house.pendulum.userData.dynamic = true;
  house.smokeLed.userData.dynamic = true;
  house.leak.userData.dynamic = true;
  scene.updateMatrixWorld(true);
  const isDynamic = (o) => { for (let p = o; p; p = p.parent) if (p.userData.dynamic) return true; return false; };
  house.scanStatic = [];
  house.scanDynamic = [];
  for (const m of house.scanMeshes) {
    if (isDynamic(m)) house.scanDynamic.push(m);
    else { const b = new THREE.Box3().setFromObject(m); house.scanStatic.push(b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z); }
  }
  // shapes only the LIDAR needed (what is under the dust sheets) go now
  const ghosts = [];
  scene.traverse((o) => { if (o.userData.scanOnly) ghosts.push(o); });
  for (const o of ghosts) o.parent.remove(o);
  if (opts.merge !== false) mergeStatic(scene, isDynamic);
  return house;
}

// Bake every static mesh into one mesh per material (and shadow setting). ~900 draw calls become ~60.
function mergeStatic(scene, isDynamic) {
  const buckets = new Map();
  const meshes = [];
  scene.traverse((o) => { if (o.isMesh && !isDynamic(o)) meshes.push(o); });
  const add = (mat, geo, mesh) => {
    const key = `${mat.uuid}|${mesh.castShadow}|${mesh.receiveShadow}`;
    if (!buckets.has(key)) buckets.set(key, { mat, cast: mesh.castShadow, receive: mesh.receiveShadow, parts: [] });
    buckets.get(key).parts.push(geo);
  };
  for (const mesh of meshes) {
    const src = mesh.geometry.index ? mesh.geometry : null;
    if (!src || !src.attributes.uv || !src.attributes.normal) continue;
    const g = src.clone().applyMatrix4(mesh.matrixWorld);
    if (mesh.matrixWorld.determinant() < 0) {   // mirrored: flip winding back
      const idx = g.index.array;
      for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; }
    }
    if (Array.isArray(mesh.material)) {
      for (const grp of g.groups) {
        const sub = new THREE.BufferGeometry();
        for (const name of ['position', 'normal', 'uv']) sub.setAttribute(name, g.attributes[name]);
        sub.setIndex(Array.from(g.index.array.slice(grp.start, grp.start + grp.count)));
        add(mesh.material[grp.materialIndex], sub, mesh);
      }
    } else add(mesh.material, g, mesh);
    mesh.parent.remove(mesh);
  }
  for (const b of buckets.values()) {
    let nv = 0, ni = 0;
    for (const p of b.parts) { nv += p.attributes.position.count; ni += p.index.count; }
    const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2);
    const index = new Uint32Array(ni);
    let vo = 0, io = 0;
    for (const p of b.parts) {
      pos.set(p.attributes.position.array, vo * 3);
      nor.set(p.attributes.normal.array, vo * 3);
      uv.set(p.attributes.uv.array, vo * 2);
      const idx = p.index.array;
      for (let i = 0; i < idx.length; i++) index[io + i] = idx[i] + vo;
      vo += p.attributes.position.count;
      io += idx.length;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(new THREE.BufferAttribute(index, 1));
    geo.computeBoundingSphere();
    const m = new THREE.Mesh(geo, b.mat);
    m.castShadow = b.cast;
    m.receiveShadow = b.receive;
    m.matrixAutoUpdate = false;
    scene.add(m);
  }
}

function scratchTex() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 96;
  const g = c.getContext('2d');
  g.strokeStyle = 'rgba(235,225,205,0.9)';
  g.lineCap = 'round';
  for (let s = 0; s < 3; s++) for (let k = 0; k < 4; k++) {
    g.lineWidth = 1.5;
    g.beginPath();
    const x = 18 + s * 36 + k * 6;
    g.moveTo(x, 90);
    g.bezierCurveTo(x + 3, 60, x - 2, 40, x + 5, 12 + Math.random() * 20);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- furniture builders ----------
// Each draws in a local frame: footprint w (x) by d (z), centred, front facing +z, floor at y = 0.

function B(g, w, h, d, x, y, z, mat, s = 0.5) {
  const m = new THREE.Mesh(boxGeo(w, h, d, s), mat);
  m.position.set(x, y + h / 2, z);
  g.add(m);
  return m;
}
function C(g, rt, rb, h, x, y, z, mat, seg = 12) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  m.position.set(x, y + h / 2, z);
  g.add(m);
  return m;
}
function legs(g, w, d, h, mat, s = 0.045, inset = 0.03) {
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]])
    B(g, s, h, s, sx * (w / 2 - inset - s / 2), 0, sz * (d / 2 - inset - s / 2), mat);
}
// Any geometry, placed. (y is the mesh origin, not its base.)
function G(g, geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  g.add(m);
  return m;
}
// Rounded box sitting on y.
function RB(g, w, h, d, r, x, y, z, mat, s = 0.5) { return G(g, roundBox(w, h, d, r, s), mat, x, y + h / 2, z); }
// A solid only the LIDAR sees (what is under a dust sheet).
function hidden(g, w, h, d, x, y, z) {
  const m = B(g, w, h, d, x, y, z, HIDDEN);
  m.userData.scanOnly = true;
  return m;
}
const HIDDEN = new THREE.MeshBasicMaterial({ color: 0 });
// A dust sheet over boxes [{x0,x1,z0,z1,h}] in this frame.
function sheetOver(g, w, d, boxes, M, o) {
  const m = G(g, drapeGeo(w, d, boxes, o), M.sheet);
  m.userData.noScan = true;
  return m;
}
const std2 = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
const rnd = (() => { let a = 12345; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; })();

const BUILDERS = {
  // The charging dock, and its lead up to the wall socket behind it. f.dead: unplugged, the lead on the floor.
  dock(g, w, d, f, M) {
    B(g, w, 0.12, d * 0.8, 0, 0, -d * 0.1, M.black);
    const plate = B(g, w, 0.006, 0.3, 0, 0, d / 2 + 0.1, M.black);
    plate.userData.noScan = true;
    const led = B(g, 0.06, 0.012, 0.005, 0, 0.09, d * 0.3 + 0.002, new THREE.MeshBasicMaterial({ color: f.dead ? 0x050505 : 0x30ff90 }));
    led.userData.noShadow = true;
    for (const s of [-1, 1]) B(g, 0.05, 0.004, 0.08, s * 0.08, 0.004, d / 2 + 0.06, M.metal);
    // The wall socket is the one build() puts on every long wall, 0.1 m to the dock's left at 0.3 m.
    const back = -d / 2, V = (x, y, z) => new THREE.Vector3(x, y, z);
    const cordMat = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.6 });
    const plug = () => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.034, 0.045, 0.022), M.white); m.userData.noScan = true; return m; };
    const plugIn = new THREE.Group(), plugOut = new THREE.Group();
    const p1 = plug(); p1.position.set(-0.1, 0.3, back + 0.022); plugIn.add(p1);
    plugIn.add(new THREE.Mesh(pipe([V(-0.1, 0.3, back + 0.034), V(-0.095, 0.25, back + 0.05), V(-0.075, 0.16, back + 0.06), V(-0.05, 0.118, back + 0.05)], 0.0035, 12, 5), cordMat));
    const p2 = plug(); p2.position.set(-0.25, 0.017, d / 2 + 0.6); p2.rotation.set(Math.PI / 2, 0, 0.5); plugOut.add(p2);
    plugOut.add(new THREE.Mesh(pipe([V(-0.05, 0.11, back + 0.05), V(-0.1, 0.03, d / 2 + 0.1), V(-0.2, 0.005, d / 2 + 0.35), V(-0.245, 0.006, d / 2 + 0.575)], 0.0035, 16, 5), cordMat));
    plugIn.visible = !f.dead; plugOut.visible = !!f.dead;
    for (const grp of [plugIn, plugOut]) { grp.userData.dynamic = true; g.add(grp); }
    return f.dead ? {} : { dockLed: led, plugIn, plugOut, plugSpot: p2 };
  },
  // The basement hatch behind the dryer, open: a dark square going down, a ladder, the lid up against the wall.
  hatch(g, w, d, f, M) {
    const rim = std2({ color: 0x5a5048, roughness: 0.9 });
    for (const [bw, bd, x, z] of [[w, 0.05, 0, -d / 2 + 0.025], [w, 0.05, 0, d / 2 - 0.025], [0.05, d, -w / 2 + 0.025, 0], [0.05, d, w / 2 - 0.025, 0]]) B(g, bw, 0.03, bd, x, 0, z, rim);
    const pit = B(g, w - 0.1, 0.004, d - 0.1, 0, 0.001, 0, new THREE.MeshBasicMaterial({ color: 0x000000 }));
    pit.userData.noShadow = true;
    for (let k = 0; k < 2; k++) B(g, 0.03, 0.06, 0.03, (k ? 1 : -1) * 0.14, 0.0, d / 2 - 0.12, M.metal);   // ladder rails poking up
    const lid = B(g, w, d - 0.04, 0.03, 0, 0, -d / 2 - 0.03, std2({ map: M.wood.map, color: 0x8a7a68, roughness: 0.8 }));
    lid.rotation.x = -0.12;
    C(g, 0.03, 0.03, 0.012, 0.15, 0.32, -d / 2 - 0.004, M.metal).rotation.x = Math.PI / 2;   // the hasp, cut
  },
  // Half-packed: some shelves still full, some cleared, a stack lying flat, a few leaning.
  bookshelf(g, w, d, f, M) {
    const h = 1.9;
    B(g, 0.03, h, d, -w / 2 + 0.015, 0, 0, M.wood); B(g, 0.03, h, d, w / 2 - 0.015, 0, 0, M.wood);
    B(g, w, h, 0.02, 0, 0, -d / 2 + 0.01, M.wood);
    B(g, w + 0.02, 0.03, d + 0.02, 0, h - 0.03, 0.005, M.wood);   // top, a lip over the sides
    B(g, w - 0.06, 0.07, 0.015, 0, 0, d / 2 - 0.0075, M.wood);    // kick plate
    for (let k = 0; k < 6; k++) B(g, w - 0.06, 0.025, d - 0.02, 0, k * 0.37, 0.01, M.wood);
    const inner = w - 0.07, fill = [0.85, 0.15, 0.7, 0.0, 0.55, 0.35];
    for (let k = 0; k < 6; k++) {
      const y = k * 0.37 + 0.025;
      let x = -inner / 2;
      const end = -inner / 2 + inner * fill[k];
      while (x < end - 0.03) {
        const bw = 0.018 + rnd() * 0.035, bh = 0.17 + rnd() * 0.12, bd = 0.15 + rnd() * 0.07;
        const b = B(g, bw, bh, bd, x + bw / 2, y, -d / 2 + 0.03 + bd / 2, M.books[(rnd() * M.books.length) | 0]);
        b.userData.noScan = true;
        x += bw + 0.002;
      }
      if (fill[k] > 0 && fill[k] < 0.9) {   // the last one or two lean over into the gap
        // pivots on its bottom-left edge, top resting on the last upright one
        const bw = 0.03, bh = 0.24, lean = 0.32 + rnd() * 0.2;
        const geo = boxGeo(bw, bh, 0.19, 0.5); geo.translate(bw / 2, bh / 2, 0);
        const b = G(g, geo, M.books[(rnd() * M.books.length) | 0], x + Math.sin(lean) * bh, y, -d / 2 + 0.13);
        b.rotation.z = lean;
        b.userData.noScan = true;
      }
    }
    // a stack lying flat on the empty shelf
    let y = 3 * 0.37 + 0.025;
    for (let k = 0; k < 4; k++) {
      const bh = 0.025 + rnd() * 0.02;
      const b = B(g, 0.2 + rnd() * 0.06, bh, 0.15 + rnd() * 0.04, 0.12 + (rnd() - 0.5) * 0.03, y, 0, M.books[k % M.books.length]);
      b.rotation.y = (rnd() - 0.5) * 0.25; b.userData.noScan = true;
      y += bh;
    }
  },
  // A dust sheet over an armchair: seat, back and arms show through it as soft shapes.
  armchair(g, w, d, f, M) {
    const boxes = [
      { x0: -w / 2, x1: w / 2, z0: -d / 2, z1: d / 2, h: 0.45 },
      { x0: -w / 2, x1: w / 2, z0: -d / 2, z1: -d / 2 + 0.2, h: 0.95 },
      { x0: -w / 2, x1: -w / 2 + 0.16, z0: -d / 2, z1: d / 2, h: 0.67 },
      { x0: w / 2 - 0.16, x1: w / 2, z0: -d / 2, z1: d / 2, h: 0.67 },
    ];
    for (const b of boxes) hidden(g, b.x1 - b.x0, b.h, b.z1 - b.z0, (b.x0 + b.x1) / 2, 0, (b.z0 + b.z1) / 2);
    if (f.sheet) sheetOver(g, w - 0.03, d - 0.03, boxes.map((b) => ({ ...b, h: b.h - 0.01 })), M, { hang: 0.95, hem: 0.005, seed: w * 7 + d, fold: 0.035 });
    else for (const b of boxes) RB(g, b.x1 - b.x0, b.h, b.z1 - b.z0, 0.04, (b.x0 + b.x1) / 2, 0, (b.z0 + b.z1) / 2, M.fabric);
  },
  sofa(g, w, d, f, M) {
    legs(g, w, d, 0.15, M.wood, 0.05);
    // the frame and seat under the sheet: its underside is what a robot hiding here looks up at
    B(g, w - 0.04, 0.27, d - 0.04, 0, 0.16, 0, M.underside);   // starts above the slats' undersides
    const boxes = [
      { x0: -w / 2, x1: w / 2, z0: -d / 2, z1: d / 2, h: 0.45 },
      { x0: -w / 2, x1: w / 2, z0: -d / 2, z1: -d / 2 + 0.22, h: 0.92 },
      { x0: -w / 2, x1: -w / 2 + 0.2, z0: -d / 2, z1: d / 2, h: 0.66 },
      { x0: w / 2 - 0.2, x1: w / 2, z0: -d / 2, z1: d / 2, h: 0.66 },
    ];
    for (const b of boxes.slice(1)) hidden(g, b.x1 - b.x0, b.h - 0.45, b.z1 - b.z0, (b.x0 + b.x1) / 2, 0.45, (b.z0 + b.z1) / 2);
    // three seat cushions, the dip between them shows through the cloth
    const cw = (w - 0.4) / 3;
    const top = [];
    for (let k = 0; k < 3; k++) top.push({ x0: -w / 2 + 0.2 + k * cw + 0.03, x1: -w / 2 + 0.2 + (k + 1) * cw - 0.03, z0: -d / 2 + 0.22, z1: d / 2 - 0.01, h: 0.5 });
    if (f.sheet) sheetOver(g, w - 0.03, d - 0.03, [...boxes, ...top], M, { hang: 0.8, hem: 0.17, seed: 3, fold: 0.03 });
    else for (const b of [...boxes, ...top]) RB(g, b.x1 - b.x0, b.h - 0.15, b.z1 - b.z0, 0.04, (b.x0 + b.x1) / 2, 0.15, (b.z0 + b.z1) / 2, M.fabric);
    // under-side slats
    for (let k = 0; k < 5; k++) B(g, w - 0.1, 0.02, 0.06, 0, 0.15, -d / 2 + 0.12 + k * (d - 0.24) / 4, M.wood);
  },
  // Night 2: on its back across the arch, the underside and the legs to the room. The sheet is on the floor.
  sofaTipped(g, w, d, f, M) {
    const inner = new THREE.Group();
    BUILDERS.sofa(inner, w, 0.9, { ...f, sheet: false }, M);
    // the black dust cloth stapled under the frame, now facing the room, torn along one side
    const cloth = new THREE.MeshStandardMaterial({ map: M.fabric.map, color: 0x26221e, roughness: 1 });
    inner.traverse((o) => { if (o.isMesh && o.material === M.underside) o.material = cloth; });
    for (const s of [-1, 1]) B(inner, w - 0.02, 0.05, 0.05, 0, 0.15, s * (0.45 - 0.035), M.wood);   // the frame rails
    inner.rotation.x = -Math.PI / 2;   // the back goes down, the bottom comes round to the front
    inner.position.set(0, 0.45, d / 2);
    g.add(inner);
  },
  // Night 2: the coffee table upside down, legs in the air, the mug rolled off.
  tableFlipped(g, w, d, f, M) {
    const inner = new THREE.Group();
    legs(inner, w, d, 0.38, M.wood, 0.045);
    B(inner, w, 0.04, d, 0, 0.38, 0, M.wood);
    inner.rotation.z = Math.PI;
    inner.position.y = 0.42;
    g.add(inner);
    const mug = G(g, new THREE.CylinderGeometry(0.04, 0.035, 0.09, 12), M.white, w / 2 + 0.14, 0.04, d * 0.2);
    mug.rotation.set(0, 0.6, Math.PI / 2);
    mug.userData.noScan = true;
  },
  // The dust sheet pulled off the sofa, left in a heap.
  sheetHeap(g, w, d, f, M) {
    const boxes = [
      { x0: -w * 0.42, x1: w * 0.05, z0: -d * 0.35, z1: d * 0.2, h: 0.055 },
      { x0: -w * 0.05, x1: w * 0.38, z0: -d * 0.1, z1: d * 0.38, h: 0.04 },
      { x0: -w * 0.2, x1: w * 0.2, z0: -d * 0.45, z1: -d * 0.15, h: 0.03 },
    ];
    sheetOver(g, w * 0.8, d * 0.8, boxes, M, { hang: 0.1, hem: 0.004, seed: 17, fold: 0.03, soft: 0.1 });
  },
  coffeeTable(g, w, d, f, M) {
    legs(g, w, d, 0.38, M.wood, 0.045);
    B(g, w, 0.04, d, 0, 0.38, 0, M.wood);
    const mug = C(g, 0.04, 0.035, 0.09, 0.3, 0.42, 0.1, M.white);
    mug.userData.noScan = true;
  },
  table(g, w, d, f, M) {
    legs(g, w, d, 0.72, M.wood, 0.06, 0.05);
    B(g, w, 0.04, d, 0, 0.72, 0, M.wood);
    B(g, w - 0.14, 0.08, 0.02, 0, 0.64, d / 2 - 0.06, M.wood); B(g, w - 0.14, 0.08, 0.02, 0, 0.64, -d / 2 + 0.06, M.wood);
  },
  chair(g, w, d, f, M) {
    const s = f.small ? 0.8 : 1;
    legs(g, w, d, 0.42 * s, M.wood, 0.035, 0.02);
    B(g, w, 0.04, d, 0, 0.42 * s, 0, M.wood);
    for (const x of [-1, 1]) B(g, 0.035, 0.48 * s, 0.035, x * (w / 2 - 0.04), 0.46 * s, -d / 2 + 0.04, M.wood);
    B(g, w - 0.04, 0.1, 0.025, 0, 0.82 * s, -d / 2 + 0.04, M.wood);
  },
  tvStand(g, w, d, f, M) {
    B(g, w, 0.5, d, 0, 0, 0, M.wood);
    B(g, 0.06, 0.08, 0.06, 0, 0.5, -0.05, M.black);
    B(g, 1.1, 0.64, 0.05, 0, 0.58, -0.05, M.black);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x050608 });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 0.58), screenMat);
    screen.position.set(0, 0.9, -0.024);
    g.add(screen);
    return { tvScreen: screenMat };
  },
  floorLamp(g, w, d, f, M) {
    C(g, 0.14, 0.15, 0.03, 0, 0, 0, M.metal, 16);
    C(g, 0.012, 0.012, 1.45, 0, 0.03, 0, M.metal);
    const shade = new THREE.MeshStandardMaterial({ color: 0xd8c8a0, emissive: 0xffa050, emissiveIntensity: 0.6, side: THREE.DoubleSide, roughness: 0.9 });
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.21, 0.3, 16, 1, true), shade);
    m.position.y = 1.5;
    m.userData.noShadow = true;
    g.add(m);
    return { lampShade: shade };
  },
  // Nobody watered it after they left: long leaves gone brown and folded over the rim.
  plant(g, w, d, f, M) {
    G(g, lathe([[0.001, 0], [0.12, 0], [0.13, 0.02], [0.165, 0.29], [0.18, 0.3], [0.18, 0.33], [0.165, 0.33], [0.155, 0.3]], 20), M.pot);
    G(g, new THREE.CircleGeometry(0.155, 18).rotateX(-Math.PI / 2), M.soil, 0, 0.3, 0);
    for (let k = 0; k < 11; k++) {
      const a = (k / 11) * Math.PI * 2 + rnd() * 0.4, up = 0.25 + rnd() * 0.45, out = 0.18 + rnd() * 0.25;
      const ca = Math.cos(a), sa = Math.sin(a);
      // up out of the soil, over, and down: the snapped ones fold sharply
      const snap = rnd() < 0.4;
      const pts = [[0.02, 0.3], [0.04, 0.3 + up * 0.5], [out * 0.5, 0.3 + up], [out, 0.3 + up * (snap ? 0.3 : 0.75)], [out * 1.25, 0.3 + up * (snap ? -0.2 : 0.35)]]
        .map(([r, y]) => new THREE.Vector3(ca * r, y, sa * r));
      const m = G(g, strip(pts, 0.022, 0.006, 12), k % 3 ? M.plantDead : M.plantDry);
      m.userData.noScan = true;
    }
    for (let k = 0; k < 3; k++) {   // a few curled leaves dropped on the floor
      const a = rnd() * 6.28, r = 0.22 + rnd() * 0.15;
      const pts = [[0, 0.006], [0.06, 0.012], [0.1, 0.02]].map(([u, y]) => new THREE.Vector3(Math.cos(a) * (r + u), y, Math.sin(a) * (r + u)));
      G(g, strip(pts, 0.015, 0.004, 4), M.plantDry).userData.noScan = true;
    }
  },
  boxes(g, w, d, f, M, tx) {
    const n = f.stack || 1;
    const label = new THREE.MeshStandardMaterial({ map: tx.label(f.text || 'MISC'), roughness: 0.95 });
    let y = 0;
    for (let k = 0; k < n; k++) {
      const s = 1 - k * 0.08, h = 0.42 * s;
      const m = new THREE.Mesh(boxGeo(w * s, h, d * s, 0.5), [M.card, M.card, M.card, M.card, k === 0 ? label : M.card, M.card]);
      m.position.set(k ? (Math.random() - 0.5) * 0.05 : 0, y + h / 2, k ? (Math.random() - 0.5) * 0.05 : 0);
      m.rotation.y = k ? (Math.random() - 0.5) * 0.3 : 0;
      g.add(m);
      y += h;
    }
  },
  // f.sink / f.stove: x of a sink or a cooker along the run. f.uppers: [[x0, x1]] spans of wall cupboards.
  counter(g, w, d, f, M) {
    B(g, w, 0.1, d - 0.1, 0, 0, -0.05, M.black);
    B(g, w, 0.78, d - 0.04, 0, 0.1, -0.02, M.cabinet);
    const n = Math.max(1, Math.round(w / 0.6));
    for (let k = 0; k < n; k++) {
      const x = -w / 2 + (k + 0.5) * (w / n);
      if (f.stove != null && Math.abs(x - f.stove) < 0.35) continue;
      B(g, 0.008, 0.7, 0.004, x + w / n / 2 - 0.004, 0.14, d / 2 - 0.02, M.black);
      B(g, 0.1, 0.015, 0.02, x, 0.78, d / 2 - 0.01, M.metal);
      B(g, w / n - 0.06, 0.012, 0.004, x, 0.71, d / 2 - 0.019, M.black);   // drawer line
    }
    const top = (x0, x1) => B(g, x1 - x0, 0.04, d, (x0 + x1) / 2, 0.88, 0, M.stone);
    if (f.sink != null) {
      // worktop with a hole, a steel basin sunk into it, and a swan-neck tap
      const sx = f.sink, bw = 0.62, bd = 0.42, bz = 0.02;

      B(g, bw, 0.04, (d - bd) / 2 + bz, sx, 0.88, -d / 2 + ((d - bd) / 2 + bz) / 2, M.stone);
      B(g, bw, 0.04, (d - bd) / 2 - bz, sx, 0.88, d / 2 - ((d - bd) / 2 - bz) / 2, M.stone);
      const rim = stadium(bw - 0.02, bd - 0.02, 0.05);
      rim.holes.push(stadium(bw - 0.06, bd - 0.06, 0.035, new THREE.Path()));
      const ring = extrudeUp(rim, 0.012, 0.004);
      G(g, ring, M.steel, sx, 0.915, bz);
      const bowl = new THREE.Mesh(extrudeUp(stadium(bw - 0.07, bd - 0.07, 0.04), 0.2, 0.02), M.steelIn);
      bowl.position.set(sx, 0.72, bz);
      g.add(bowl);
      G(g, new THREE.CircleGeometry(0.025, 12).rotateX(-Math.PI / 2), M.black, sx, 0.725, bz);
      const tap = [[0, 0.92, -0.2], [0, 1.12, -0.2], [0, 1.2, -0.13], [0, 1.14, -0.06], [0, 1.08, -0.05]].map(([x, y, z]) => new THREE.Vector3(sx + x, y, z));
      G(g, pipe(tap, 0.012, 20, 8), M.steel);
      for (const s of [-1, 1]) C(g, 0.018, 0.02, 0.05, sx + s * 0.11, 0.92, -0.2, M.steel, 10);
    }
    // the worktop runs between the sink and the cooker, not over them
    const gaps = [];
    if (f.sink != null) gaps.push([f.sink - 0.31, f.sink + 0.31]);
    if (f.stove != null) gaps.push([f.stove - 0.3, f.stove + 0.3]);
    gaps.sort((a, b) => a[0] - b[0]);
    let from = -w / 2;
    for (const [a, b] of gaps) { if (a > from + 1e-3) top(from, a); from = b; }
    if (from < w / 2 - 1e-3) top(from, w / 2);
    if (f.stove != null) {
      // a freestanding cooker set into the run: oven door, window, knobs, four rings
      const x = f.stove, ow = 0.6;
      B(g, ow, 0.86, d - 0.02, x, 0.02, 0, M.white);
      B(g, ow - 0.06, 0.52, 0.015, x, 0.12, d / 2 - 0.002, M.white);
      B(g, ow - 0.16, 0.26, 0.004, x, 0.26, d / 2 + 0.006, M.ovenGlass);
      B(g, ow - 0.12, 0.018, 0.03, x, 0.68, d / 2 + 0.02, M.steel);
      for (let k = 0; k < 4; k++) C(g, 0.016, 0.018, 0.02, x - 0.2 + k * 0.133, 0.78, d / 2 + 0.008, M.black, 10).rotation.x = Math.PI / 2;
      B(g, ow, 0.035, d - 0.02, x, 0.88, 0, M.hob);   // flush with the worktop
      for (const [ox, oz, r] of [[-0.14, -0.12, 0.07], [0.14, -0.12, 0.055], [-0.14, 0.13, 0.055], [0.14, 0.13, 0.07]]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 6, 24), M.black);
        ring.rotation.x = Math.PI / 2; ring.position.set(x + ox, 0.918, oz);
        g.add(ring);
      }
    }
    for (const [x0, x1] of f.uppers || []) {
      // wall cupboards, doors a hand's width apart, handles at the bottom corners
      const uw = x1 - x0, ud = 0.34, cx = (x0 + x1) / 2, z = -d / 2 + ud / 2;
      B(g, uw, 0.72, ud, cx, 1.48, z, M.cabinet);
      B(g, uw + 0.02, 0.025, ud + 0.02, cx, 2.2, z + 0.01, M.cabinet);
      const nd = Math.max(1, Math.round(uw / 0.45));
      for (let k = 0; k < nd; k++) {
        const dx = x0 + (k + 0.5) * (uw / nd);
        B(g, uw / nd - 0.012, 0.69, 0.012, dx, 1.495, z + ud / 2 + 0.004, M.cabinet);
        B(g, 0.012, 0.08, 0.02, dx + (k % 2 ? -1 : 1) * (uw / nd / 2 - 0.04), 1.52, z + ud / 2 + 0.018, M.metal);
      }
      const shelf = B(g, uw, 0.01, 0.01, cx, 1.47, z + ud / 2 + 0.004, M.black);
      shelf.userData.noScan = true;
    }
  },
  fridge(g, w, d, f, M, tx, house) {
    B(g, w, 1.85, d - 0.06, 0, 0, -0.03, M.white);
    const pivot = new THREE.Group();
    pivot.position.set(-w / 2, 0, d / 2 - 0.06);
    const door = B(pivot, w, 1.83, 0.06, w / 2, 0.01, 0.03, M.white);
    B(pivot, 0.03, 0.4, 0.03, w - 0.07, 0.9, 0.075, M.metal);
    const inner = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.08, 1.7), new THREE.MeshBasicMaterial({ color: 0x0a0b0c }));
    inner.position.set(0, 0.95, d / 2 - 0.056);   // a few mm proud of the cabinet front, under the closed door
    g.add(pivot, inner);
    return { fridgeDoor: pivot, fridgeInner: inner.material };
  },
  trash(g, w, d, f, M) {
    C(g, 0.17, 0.15, 0.58, 0, 0, 0, M.metal, 16);
    C(g, 0.18, 0.18, 0.03, 0, 0.58, 0, M.metal, 16);
  },
  // Hall bench: seat at knee height, open underneath. A robot fits under it; nothing tall does.
  bench(g, w, d, f, M) {
    legs(g, w, d, 0.42, M.wood, 0.05, 0.03);
    B(g, w, 0.045, d, 0, 0.42, 0, M.wood);
    B(g, w - 0.1, 0.05, 0.02, 0, 0.33, d / 2 - 0.05, M.wood); B(g, w - 0.1, 0.05, 0.02, 0, 0.33, -d / 2 + 0.05, M.wood);
    B(g, w - 0.08, 0.38, 0.03, 0, 0.465, -d / 2 + 0.015, M.wood);   // back panel against the wall
    const cushion = new THREE.MeshStandardMaterial({ color: 0x4a3a52, roughness: 1 });
    B(g, w * 0.55, 0.05, d - 0.08, -w * 0.18, 0.465, 0.02, cushion);
    // a child's welly boot left on top, and a folded blanket
    C(g, 0.045, 0.05, 0.2, w * 0.4, 0.465, 0.05, new THREE.MeshStandardMaterial({ color: 0xc8a020, roughness: 0.5 }));
    B(g, 0.26, 0.06, 0.24, w * 0.19, 0.465, -0.03, M.fabric);
  },
  clock(g, w, d, f, M, tx, house) {
    B(g, w, 0.4, d, 0, 0, 0, M.wood);
    B(g, w - 0.06, 1.2, d - 0.06, 0, 0.4, 0, M.wood);
    B(g, w, 0.4, d, 0, 1.6, 0, M.wood);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), M.white);
    face.position.set(0, 1.8, d / 2 + 0.002);
    g.add(face);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.14, 1.0), M.glass);
    glass.position.set(0, 1.0, (d - 0.06) / 2 + 0.002);
    g.add(glass);
    const pend = new THREE.Group();
    pend.position.set(0, 1.45, 0.05);
    const rod = B(pend, 0.012, 0.8, 0.012, 0, -0.8, 0, M.metal);
    const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 16), new THREE.MeshStandardMaterial({ color: 0xb08a3a, metalness: 0.8, roughness: 0.3 }));
    bob.rotation.x = Math.PI / 2;
    bob.position.y = -0.82;
    pend.add(bob);
    rod.userData.noScan = bob.userData.noScan = true;
    g.add(pend);
    return { pendulum: pend };
  },
  coatRack(g, w, d, f, M) {
    C(g, 0.16, 0.17, 0.03, 0, 0, 0, M.wood, 14);
    C(g, 0.02, 0.02, 1.75, 0, 0.03, 0, M.wood);
    for (let k = 0; k < 4; k++) {   // hooks
      const a = (k / 4) * Math.PI * 2 + 0.4;
      G(g, pipe([[0, 1.7, 0], [Math.cos(a) * 0.08, 1.72, Math.sin(a) * 0.08], [Math.cos(a) * 0.11, 1.78, Math.sin(a) * 0.11]].map((p) => new THREE.Vector3(...p)), 0.008, 6, 5), M.wood);
    }
    // a long dark coat hanging off one hook: hangs in folds, shoulders hunched on the hook, hood up
    const coat = new THREE.MeshStandardMaterial({ color: 0x1d1f24, roughness: 0.95, side: THREE.DoubleSide });
    const prof = [[0.0, 1.66], [0.05, 1.66], [0.13, 1.6], [0.15, 1.5], [0.14, 1.3], [0.15, 1.0], [0.18, 0.75], [0.2, 0.62]];
    const cg = lathe(prof, 28, 1, 0.7);
    const p = cg.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {   // folds, deeper toward the hem
      v.fromBufferAttribute(p, i);
      const a = Math.atan2(v.z, v.x), fold = 1 + Math.sin(a * 9 + v.y * 2) * 0.07 * (1.6 - v.y) + noise3(v.x * 6, v.y * 3, v.z * 6) * 0.04;
      p.setXYZ(i, v.x * fold, v.y, v.z * fold);
    }
    cg.computeVertexNormals();
    G(g, cg, coat, 0.06, 0, 0.02);
    const hood = G(g, lump(0.1, 0.12, 0.09, 5, 0.18, 2), coat, 0.06, 1.62, 0.0);
    hood.rotation.x = -0.3;
    for (const s of [-1, 1]) G(g, pipe([[s * 0.13, 1.56, 0.02], [s * 0.15, 1.25, 0.04], [s * 0.14, 0.95, 0.07]].map((q) => new THREE.Vector3(q[0] + 0.06, q[1], q[2])), 0.045, 10, 8), coat);
    // Biscuit's leash, still clipped to the hook, the collar end empty on the floor
    const strap = new THREE.MeshStandardMaterial({ color: 0x9a1c1c, roughness: 0.7 });
    const pts = [[-0.03, 1.55, 0.03], [-0.07, 1.0, 0.07], [-0.09, 0.45, 0.1], [-0.08, 0.02, 0.16], [0.04, 0.01, 0.3], [0.2, 0.01, 0.32], [0.26, 0.01, 0.22]].map((p) => new THREE.Vector3(...p));
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k], b = pts[k + 1], L = a.distanceTo(b);
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.018, L, 0.004), strap);
      s.position.copy(a).add(b).multiplyScalar(0.5);
      s.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      s.userData.noScan = true;
      g.add(s);
    }
    const clip = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.004, 6, 12), M.metal);
    clip.rotation.x = Math.PI / 2; clip.position.set(0.27, 0.008, 0.2);
    clip.userData.noScan = true;
    g.add(clip);
  },
  // Clawfoot tub: the body sits on four feet, high enough for a robot to tuck underneath.
  // Clawfoot tub: a hollow enamel shell on four brass paws, high enough for a robot to tuck underneath.
  tub(g, w, d, f, M) {
    const H0 = 0.16, H = 0.46, R = d / 2 - 0.02;
    const shell = stadium(w - 0.04, d - 0.04, R);
    shell.holes.push(stadium(w - 0.14, d - 0.14, R - 0.05, new THREE.Path()));
    G(g, extrudeUp(shell, H, 0.025), M.enamel, 0, H0, 0);
    // the bottom of the shell (seen from underneath), and the inside floor, stained where the water stood
    G(g, extrudeUp(stadium(w - 0.08, d - 0.08, R - 0.03), 0.04, 0.012), M.enamel, 0, H0, 0);
    M.tubFloor.map.repeat.set(1 / (w - 0.15), 1 / (d - 0.15)); M.tubFloor.map.offset.set(0.5, 0.5);
    const floor = G(g, new THREE.ShapeGeometry(stadium(w - 0.15, d - 0.15, R - 0.06), 12).rotateX(-Math.PI / 2), M.tubFloor, 0, H0 + 0.05, 0);
    floor.userData.noScan = true;
    const brass = M.brass;
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const fx = sx * (w / 2 - 0.14), fz = sz * (d / 2 - 0.14);   // matches the collision legs in level.js
      // a turned leg flaring into a paw with three toes
      const leg = G(g, lathe([[0.001, H0 + 0.02], [0.03, H0 + 0.02], [0.022, H0 - 0.04], [0.026, 0.06], [0.036, 0.03], [0.001, 0.03]], 10), brass, fx, 0, fz);
      leg.rotation.y = Math.atan2(sx, sz);
      for (let t = -1; t <= 1; t++) {
        const a = Math.atan2(sx, sz) + t * 0.5;
        const toe = G(g, new THREE.SphereGeometry(0.018, 8, 6), brass, fx + Math.sin(a) * 0.03, 0.016, fz + Math.cos(a) * 0.03);
        toe.scale.set(1, 0.9, 1.4); toe.rotation.y = a;
      }
    }
    // the taps and spout at the end
    G(g, pipe([[-w / 2 + 0.12, H0 + H + 0.02, 0], [-w / 2 + 0.12, H0 + H + 0.12, 0], [-w / 2 + 0.2, H0 + H + 0.1, 0]].map((p) => new THREE.Vector3(...p)), 0.013, 10, 8), brass);
    for (const s of [-1, 1]) C(g, 0.016, 0.02, 0.06, -w / 2 + 0.07, H0 + H, s * 0.08, brass, 10);
  },

  // Facing +z: a turned pan on a pedestal, an oval seat with the lid up, a cistern against the wall.
  toilet(g, w, d, f, M) {
    const bz = 0.07;
    G(g, lathe([[0.001, 0], [0.11, 0], [0.1, 0.06], [0.11, 0.2], [0.16, 0.33], [0.19, 0.39], [0.18, 0.4], [0.15, 0.37], [0.09, 0.29], [0.001, 0.27]], 24, 0.85, 1.12), M.porcelain, 0, 0, bz);
    G(g, new THREE.CircleGeometry(0.075, 16).rotateX(-Math.PI / 2), M.water, 0, 0.3, bz + 0.02).userData.noScan = true;
    const seat = G(g, new THREE.TorusGeometry(0.15, 0.02, 8, 28), M.porcelain, 0, 0.415, bz);
    seat.rotation.x = Math.PI / 2; seat.scale.set(0.82, 1.15, 0.6);
    const lid = G(g, extrudeUp(stadium(0.3, 0.38, 0.14), 0.02, 0.008), M.porcelain, 0, 0.6, -d / 2 + 0.2);
    lid.rotation.x = -1.35;
    RB(g, w * 0.88, 0.36, 0.17, 0.025, 0, 0.36, -d / 2 + 0.095, M.porcelain);
    RB(g, w * 0.92, 0.035, 0.2, 0.012, 0, 0.72, -d / 2 + 0.1, M.porcelain);
    B(g, 0.05, 0.012, 0.02, -w * 0.3, 0.64, -d / 2 + 0.19, M.steel);
  },
  // Facing +z: a vanity unit with two doors, a basin set in it, a tap, a mirror on the wall above.
  sink(g, w, d, f, M) {
    B(g, w - 0.02, 0.06, d - 0.06, 0, 0, -0.02, M.black);
    B(g, w, 0.76, d - 0.02, 0, 0.06, -0.01, M.cabinet);
    for (const s of [-1, 1]) {
      B(g, w / 2 - 0.02, 0.68, 0.014, s * w / 4, 0.1, d / 2 - 0.013, M.cabinet);
      B(g, 0.012, 0.09, 0.02, s * 0.04, 0.68, d / 2, M.steel);
    }
    const top = stadium(w + 0.02, d + 0.02, 0.03);
    top.holes.push(stadium(w * 0.62, d * 0.55, 0.12, new THREE.Path()));
    G(g, extrudeUp(top, 0.05, 0.01), M.porcelain, 0, 0.82, 0.01);
    const bowl = G(g, extrudeUp(stadium(w * 0.62, d * 0.55, 0.12), 0.16, 0.03), M.basinIn, 0, 0.71, 0.01);
    bowl.userData.noScan = true;
    G(g, new THREE.CircleGeometry(0.018, 10).rotateX(-Math.PI / 2), M.black, 0, 0.716, 0.01).userData.noScan = true;
    G(g, pipe([[0, 0.87, -d / 2 + 0.08], [0, 0.97, -d / 2 + 0.08], [0, 0.99, -d / 2 + 0.15], [0, 0.95, -d / 2 + 0.2]].map((p) => new THREE.Vector3(...p)), 0.011, 12, 8), M.steel);
    for (const s of [-1, 1]) C(g, 0.016, 0.018, 0.04, s * 0.12, 0.87, -d / 2 + 0.08, M.steel, 10);
    const mirror = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, 0.7), new THREE.MeshStandardMaterial({ color: 0x2c3034, metalness: 0.9, roughness: 0.12 }));
    mirror.position.set(0, 1.45, -d / 2 + 0.006);
    g.add(mirror);
    B(g, w * 0.9 + 0.05, 0.75, 0.004, 0, 1.075, -d / 2 + 0.002, M.frame).userData.noScan = true;   // between the wall and the glass
  },
  kidBed(g, w, d, f, M) {
    legs(g, w, d, 0.24, M.paint, 0.05);
    B(g, w, 0.06, d, 0, 0.24, 0, M.paint);
    for (let k = 0; k < 7; k++) B(g, w - 0.08, 0.02, 0.07, 0, 0.23, -d / 2 + 0.15 + k * (d - 0.3) / 6, M.wood);
    RB(g, w - 0.07, 0.16, d - 0.08, 0.03, 0, 0.3, 0.02, M.mattress);   // inside the head and foot boards
    // headboard and footboard with rounded posts
    RB(g, w - 0.04, 0.5, 0.04, 0.015, 0, 0.27, -d / 2 + 0.025, M.paint);
    RB(g, w - 0.04, 0.22, 0.04, 0.015, 0, 0.27, d / 2 - 0.025, M.paint);
    for (const [sx, sz, h] of [[-1, -1, 0.8], [1, -1, 0.8], [-1, 1, 0.52], [1, 1, 0.52]]) {
      C(g, 0.025, 0.025, h - 0.24, sx * (w / 2 - 0.025), 0.24, sz * (d / 2 - 0.025), M.paint, 12);
      G(g, new THREE.SphereGeometry(0.032, 12, 8), M.paint, sx * (w / 2 - 0.025), h + 0.01, sz * (d / 2 - 0.025));
    }
    // the duvet, thrown back at the top, hanging over the sides
    const bw = w - 0.04, bd = d - 0.4, bz = 0.2;
    const duvet = G(g, drapeGeo(bw, bd, [{ x0: -bw / 2, x1: bw / 2, z0: -bd / 2, z1: bd / 2, h: 0.47 }], { ext: [0.17, 0.17, 0.0, 0.14], hem: 0.31, seed: 9, fold: 0.02, soft: 0.04 }), M.duvet, 0, 0, bz);
    duvet.userData.noScan = true;
    G(g, pipe([[-bw / 2 - 0.01, 0.475, bz - bd / 2 + 0.03], [bw / 2 + 0.01, 0.475, bz - bd / 2 + 0.03]].map((p) => new THREE.Vector3(...p)), 0.03, 4, 10), M.duvet).userData.noScan = true;
    // a pillow, squashed
    const pil = G(g, lump(0.2, 0.05, 0.13, 4, 0.12, 3), M.pillow, 0, 0.47, -d / 2 + 0.22);
    pil.userData.noScan = true;
    // teddy bear, sitting up against the pillow, facing the door
    const fur = M.fur, bear = new THREE.Group();
    const sp = (geo, x, y, z, m = fur) => { const s = new THREE.Mesh(geo, m); s.position.set(x, y, z); bear.add(s); return s; };
    sp(lump(0.075, 0.09, 0.065, 2, 0.06, 2), 0, 0.085, 0);                       // body
    sp(lump(0.062, 0.058, 0.058, 3, 0.05, 2), 0, 0.215, 0.005);                  // head
    sp(lump(0.03, 0.022, 0.028, 4, 0.05, 1), 0, 0.2, 0.055, M.furLight);         // muzzle
    sp(new THREE.SphereGeometry(0.009, 8, 6), 0, 0.212, 0.082, M.black);         // nose
    for (const s of [-1, 1]) {
      sp(new THREE.SphereGeometry(0.024, 10, 8), s * 0.045, 0.265, -0.005).scale.set(1, 1, 0.55);   // ears
      sp(new THREE.SphereGeometry(0.0065, 6, 5), s * 0.022, 0.232, 0.052, M.black);                 // button eyes
      const arm = sp(lump(0.026, 0.055, 0.026, 6 + s, 0.05, 1), s * 0.075, 0.11, 0.015); arm.rotation.z = s * 0.5;
      const leg = sp(lump(0.03, 0.03, 0.06, 8 + s, 0.05, 1), s * 0.045, 0.028, 0.05);   // legs out in front
      leg.rotation.y = s * 0.2;
    }
    bear.position.set(0.15, 0.47, -d / 2 + 0.42);
    bear.rotation.y = 0.4;
    bear.traverse((o) => { o.userData.noScan = true; });
    g.add(bear);
  },
  bed(g, w, d, f, M) {
    legs(g, w, d, 0.27, M.wood, 0.06);
    B(g, w, 0.08, d, 0, 0.27, 0, M.wood);
    for (let k = 0; k < 9; k++) B(g, w - 0.1, 0.02, 0.08, 0, 0.26, -d / 2 + 0.15 + k * (d - 0.3) / 8, M.wood);
    // a bare mattress, buttoned, stained
    RB(g, w - 0.06, 0.24, d - 0.08, 0.05, 0, 0.35, 0.02, M.mattressBare, 2);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) {
      const b = G(g, new THREE.SphereGeometry(0.009, 6, 4), M.mattressBare, -w / 2 + 0.3 + i * (w - 0.6) / 3, 0.59, -d / 2 + 0.3 + j * (d - 0.6) / 5);
      b.scale.y = 0.4; b.userData.noScan = true;
    }
    // headboard: a panel in a frame
    B(g, w, 0.9, 0.06, 0, 0.27, -d / 2 + 0.03, M.wood);
    RB(g, w - 0.2, 0.5, 0.025, 0.01, 0, 0.55, -d / 2 + 0.07, M.wood);
    RB(g, w + 0.06, 0.05, 0.09, 0.02, 0, 1.17, -d / 2 + 0.03, M.wood);
  },
  // A red toy chest: lid with an overhang, a hinge strap, rope handles, and something stuffed under the lid.
  toyChest(g, w, d, f, M) {
    RB(g, w, 0.42, d, 0.02, 0, 0, 0, M.red);
    const lid = RB(g, w + 0.03, 0.05, d + 0.03, 0.02, 0, 0.43, -0.005, M.red);
    lid.rotation.x = -0.06;
    B(g, w - 0.1, 0.02, 0.005, 0, 0.34, d / 2 + 0.002, M.redDark);
    for (const s of [-1, 1]) G(g, new THREE.TorusGeometry(0.04, 0.008, 6, 14, Math.PI), M.rope, s * (w / 2 + 0.005), 0.3, 0).rotation.set(0, Math.PI / 2, Math.PI);
    G(g, pipe([[-0.15, 0.43, d / 2 - 0.02], [-0.12, 0.44, d / 2 + 0.03], [-0.05, 0.43, d / 2 + 0.05], [0.02, 0.42, d / 2 + 0.02]].map((p) => new THREE.Vector3(...p)), 0.02, 8, 8), M.fabricBlue).userData.noScan = true;
  },
  desk(g, w, d, f, M) {
    legs(g, w, d, 0.68, M.paint, 0.04, 0.02);
    B(g, w, 0.04, d, 0, 0.68, 0, M.paint);
    B(g, w * 0.5, 0.12, d - 0.04, w * 0.22, 0.56, 0, M.paint);
  },
  nightstand(g, w, d, f, M) {
    B(g, w, 0.55, d, 0, 0, 0, M.wood);
    B(g, w - 0.04, 0.005, 0.005, 0, 0.36, d / 2, M.black);
  },
  wardrobe(g, w, d, f, M) {
    B(g, w, 2.0, d, 0, 0, 0, M.wood);
    B(g, 0.012, 1.9, 0.008, 0.02, 0.05, d / 2 + 0.002, M.black);  // the doors don't quite meet
    for (const s of [-1, 1]) B(g, 0.02, 0.18, 0.03, s * 0.06, 1.0, d / 2 + 0.01, M.metal);
  },
  dresser(g, w, d, f, M) {
    if (f.sheet) {
      hidden(g, w, 0.85, d, 0, 0, 0);
      // something tall stood on it under the sheet (a mirror, a lamp): the cloth tents over it
      sheetOver(g, w - 0.02, d - 0.02, [{ x0: -w / 2, x1: w / 2, z0: -d / 2, z1: d / 2, h: 0.85 }, { x0: w / 2 - 0.4, x1: w / 2 - 0.25, z0: -0.06, z1: 0.06, h: 1.15 }], M, { hang: 0.9, hem: 0.004, seed: 6, fold: 0.03 });
    } else B(g, w, 0.85, d, 0, 0, 0, M.wood);
  },
  // Front loader: porthole door with a chrome ring, a control strip, a soap drawer.
  washer(g, w, d, f, M) {
    RB(g, w, 0.85, d, 0.015, 0, 0, 0, M.white);
    B(g, w - 0.04, 0.12, 0.01, 0, 0.7, d / 2, M.panel);
    B(g, 0.18, 0.06, 0.012, -w / 2 + 0.13, 0.73, d / 2 + 0.004, M.white);
    C(g, 0.028, 0.03, 0.025, w / 2 - 0.1, 0.735, d / 2 + 0.008, M.steel, 14).rotation.x = Math.PI / 2;
    const ring = G(g, new THREE.TorusGeometry(0.19, 0.03, 10, 32), M.steel, 0, 0.4, d / 2 + 0.012);
    const glass = G(g, new THREE.CircleGeometry(0.17, 28), M.porthole, 0, 0.4, d / 2 + 0.006);
    glass.userData.noScan = ring.userData.noScan = true;
    B(g, 0.03, 0.08, 0.02, 0.2, 0.36, d / 2 + 0.01, M.steel);
  },
  dogBed(g, w, d, f, M) {
    const fab = new THREE.MeshStandardMaterial({ color: 0x6a4a3a, roughness: 1 });
    C(g, w / 2, w / 2, 0.06, 0, 0, 0, fab, 20);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(w / 2 - 0.06, 0.07, 8, 20), fab);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.09;
    g.add(rim);
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 6, 16), new THREE.MeshStandardMaterial({ color: 0xa02020, roughness: 0.6 }));
    collar.rotation.x = Math.PI / 2;
    collar.position.set(0.05, 0.075, 0.04);
    g.add(collar);
  },
  bags(g, w, d, f, M, tx) {
    const label = new THREE.MeshStandardMaterial({ map: tx.label('DOG FOOD'), roughness: 0.95 });
    const paper = new THREE.MeshStandardMaterial({ color: 0x9a7a50, roughness: 1 });
    const a = new THREE.Mesh(boxGeo(w * 0.5, 0.55, d * 0.6, 0.5), [paper, paper, paper, paper, label, paper]);
    a.position.set(-w * 0.2, 0.275, -d * 0.15);
    const b = new THREE.Mesh(boxGeo(w * 0.5, 0.5, d * 0.35, 0.5), [paper, paper, paper, paper, label, paper]);
    b.rotation.set(-Math.PI / 2 + 0.1, 0.4, 0);
    b.position.set(w * 0.2, 0.18, d * 0.15);
    g.add(a, b);
    for (let k = 0; k < 12; k++) {   // spilled kibble
      const k1 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 5, 4), paper);
      k1.position.set((Math.random() - 0.2) * w, 0.01, d * 0.4 + Math.random() * 0.25);
      g.add(k1);
    }
  },
  // A nest of torn clothes and bedding, pressed flat in the middle where something lies curled up.
  clothes(g, w, d, f, M) {
    for (let k = 0; k < 13; k++) {
      const a = (k / 13) * Math.PI * 2 + rnd() * 0.5, rr = 0.3 + rnd() * 0.22;
      const m = G(g, lump(0.2 + rnd() * 0.12, 0.08 + rnd() * 0.09, 0.15 + rnd() * 0.1, k + 1, 0.32, 2), M.rags[k % M.rags.length],
        Math.cos(a) * rr * (w / 1.1), 0.02, Math.sin(a) * rr * (d / 1.1));
      m.rotation.y = a + rnd();
    }
    G(g, lump(0.3, 0.04, 0.26, 21, 0.2, 3), M.rags[1], 0, 0.0, 0);   // the hollow
    for (let k = 0; k < 4; k++) {   // sleeves and a sheet trailing out of it
      const a = rnd() * 6.28, L = 0.35 + rnd() * 0.3;
      const pts = [0, 0.33, 0.66, 1].map((t) => new THREE.Vector3(Math.cos(a) * (0.35 + t * L), 0.05 + (1 - t) * 0.08 + Math.sin(t * 9 + k) * 0.01, Math.sin(a) * (0.35 + t * L) + Math.sin(t * 5) * 0.05));
      G(g, pipe(pts, 0.035 - k * 0.004, 10, 7), M.rags[(k + 2) % M.rags.length]).scale.y = 0.6;
    }
  },
  rug(g, w, d, f, M, tx) {
    if (f.runner) {   // a long hall runner: its pattern repeats along it, with a fringe at each end
      const t = tx.runner(f.color);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: t, roughness: 1 }));
      const uv = m.geometry.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * (w / (d * 2)));
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.004;
      m.userData.noShadow = true;
      g.add(m);
      for (const s of [-1, 1]) {
        const fr = new THREE.Mesh(new THREE.PlaneGeometry(0.06, d - 0.04), M.fringe);
        fr.rotation.x = -Math.PI / 2; fr.position.set(s * (w / 2 + 0.03), 0.0045, 0);
        fr.userData.noShadow = true;
        g.add(fr);
      }
      return;
    }
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: tx.rug(f.color, !!f.round), roughness: 1, transparent: !!f.round, alphaTest: f.round ? 0.5 : 0 }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.004;
    m.userData.noShadow = true;
    g.add(m);
  },
};
