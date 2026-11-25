// Turns the level data into a three.js scene: floors, walls, windows, doors, furniture and lights.

import * as THREE from 'three';
import { HOUSE, ROOMS, FURNITURE, LIGHTS, NIGHTLIGHTS } from './level.js';
import { makeTextures, makeStatic } from './textures.js';

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

export function buildHouse(scene, world) {
  const tx = makeTextures();
  const house = { tx, tags: [], scanMeshes: [], doors: {}, lights: {}, moons: [], flicker: [] };
  const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, ...o });
  const M = {
    wood: std({ map: tx.furnWood, roughness: 0.6 }),
    fabric: std({ map: tx.fabric }),
    fabricBlue: std({ map: tx.fabricBlue }),
    sheet: std({ map: tx.sheet, roughness: 1 }),
    card: std({ map: tx.cardboard, roughness: 0.95 }),
    white: std({ color: 0xe6e3dc, roughness: 0.3 }),
    paint: std({ color: 0xd8d3c6, roughness: 0.6 }),
    metal: std({ color: 0x8c9096, metalness: 0.6, roughness: 0.35 }),
    black: std({ color: 0x111113, roughness: 0.5 }),
    stone: std({ color: 0xbdb7aa, roughness: 0.45 }),
    cabinet: std({ map: tx.furnWood, color: 0x9a8a78, roughness: 0.6 }),
    frame: std({ color: 0xd9d4c7, roughness: 0.5 }),
    door: std({ map: tx.door, roughness: 0.6 }),
    plantDead: std({ color: 0x4a4a2a, roughness: 1 }),
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
      const bb = new THREE.Mesh(boxGeo(p.along === 'x' ? w : bt, bh, p.along === 'x' ? bt : d, 1), M.frame);
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
    const parts = [[L + ft * 2, ft, fd, 0, wi.top - cy + ft / 2], [L + ft * 2, ft, fd + 0.06, 0, wi.sill - cy - ft / 2], [ft, H, fd, -L / 2 - ft / 2, 0], [ft, H, fd, L / 2 + ft / 2, 0], [0.035, H, 0.03, 0, 0], [L, 0.035, 0.03, 0, 0]];
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
    for (const [w, hh, x, y] of [[0.06, h + 0.05, d.from - 0.03, (h + 0.05) / 2], [0.06, h + 0.05, d.to + 0.03, (h + 0.05) / 2], [L + 0.12, 0.06, (d.from + d.to) / 2, h + 0.04]]) {
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
  // The pet flap at the end of the hall: just big enough for a robot.
  if (world.flap) {
    const f = world.flap, cx = (f.from + f.to) / 2, L = f.to - f.from;
    const frameMat = std({ color: 0xcfc6b0, roughness: 0.5 });
    for (const side of [-1, 1]) {
      const z = f.at + side * (HOUSE.wallT / 2 + 0.006);
      for (const [w, h, x, y] of [[L + 0.08, 0.04, cx, f.top + 0.02], [0.04, f.top + 0.04, f.from - 0.02, (f.top + 0.04) / 2], [0.04, f.top + 0.04, f.to + 0.02, (f.top + 0.04) / 2]]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), frameMat);
        m.position.set(x, y, z);
        scene.add(m);
      }
    }
    const pivot = new THREE.Group();
    pivot.position.set(cx, f.top - 0.005, f.at);
    const flap = new THREE.Mesh(new THREE.BoxGeometry(L - 0.01, f.top - 0.02, 0.006), new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.3, transparent: true, opacity: 0.82 }));
    flap.position.y = -(f.top - 0.02) / 2;
    pivot.add(flap);
    pivot.userData.dynamic = true;
    scene.add(pivot);
    pivot.updateMatrixWorld(true);
    house.petFlap = pivot;
    house.tags.push({ label: 'pet door', box: new THREE.Box3().setFromObject(flap).expandByScalar(0.03), conf: 0.81, obj: flap });
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
  for (const r of ROOMS) {  // dead ceiling lights
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.glass.clone());
    lamp.material.opacity = 0.5;
    lamp.rotation.x = Math.PI;
    lamp.position.set((r.x0 + r.x1) / 2, HOUSE.wallH, (r.z0 + r.z1) / 2);
    scene.add(lamp);
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
  mergeStatic(scene, isDynamic);
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

const BUILDERS = {
  dock(g, w, d, f, M) {
    B(g, w, 0.12, d * 0.8, 0, 0, -d * 0.1, M.black);
    const plate = B(g, w, 0.006, 0.3, 0, 0, d / 2 + 0.1, M.black);
    plate.userData.noScan = true;
    const led = B(g, 0.06, 0.012, 0.005, 0, 0.09, d * 0.3 + 0.002, new THREE.MeshBasicMaterial({ color: 0x30ff90 }));
    led.userData.noShadow = true;
    for (const s of [-1, 1]) B(g, 0.05, 0.004, 0.08, s * 0.08, 0.004, d / 2 + 0.06, M.metal);
    return { dockLed: led };
  },
  bookshelf(g, w, d, f, M) {
    const h = 1.9;
    B(g, 0.03, h, d, -w / 2 + 0.015, 0, 0, M.wood); B(g, 0.03, h, d, w / 2 - 0.015, 0, 0, M.wood);
    B(g, w, h, 0.02, 0, 0, -d / 2 + 0.01, M.wood);
    for (let k = 0; k < 6; k++) B(g, w - 0.06, 0.025, d - 0.02, 0, k * 0.37, 0.01, M.wood);
    const book = (x, y, hh) => B(g, 0.035, hh, 0.22, x, y, 0, new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(), 0.4, 0.25), roughness: 0.8 }));
    for (let k = 0; k < 4; k++) book(-0.4 + k * 0.04, 0.395, 0.22 + Math.random() * 0.06);
    const fallen = book(0.25, 0.77, 0.25); fallen.rotation.z = 1.2; fallen.position.y = 0.81;
  },
  armchair(g, w, d, f, M) {
    const m = f.sheet ? M.sheet : M.fabric;
    B(g, w, 0.45, d, 0, 0, 0, m);
    B(g, w, 0.5, 0.2, 0, 0.45, -d / 2 + 0.1, m);
    B(g, 0.16, 0.22, d - 0.2, -w / 2 + 0.08, 0.45, 0.1, m); B(g, 0.16, 0.22, d - 0.2, w / 2 - 0.08, 0.45, 0.1, m);
  },
  sofa(g, w, d, f, M) {
    legs(g, w, d, 0.15, M.wood, 0.05);
    const m = f.sheet ? M.sheet : M.fabric;
    B(g, w, 0.3, d, 0, 0.15, 0, m);
    B(g, w, 0.45, 0.22, 0, 0.45, -d / 2 + 0.11, m);
    B(g, 0.2, 0.22, d - 0.22, -w / 2 + 0.1, 0.45, 0.11, m); B(g, 0.2, 0.22, d - 0.22, w / 2 - 0.1, 0.45, 0.11, m);
    // the sheet's hem, hanging just clear of a robot
    B(g, w + 0.03, 0.08, 0.012, 0, 0.17, d / 2 + 0.01, m); B(g, 0.012, 0.08, d, -w / 2 - 0.01, 0.17, 0, m); B(g, 0.012, 0.08, d, w / 2 + 0.01, 0.17, 0, m);
    // under-side slats
    for (let k = 0; k < 5; k++) B(g, w - 0.1, 0.02, 0.06, 0, 0.15, -d / 2 + 0.12 + k * (d - 0.24) / 4, M.wood);
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
  plant(g, w, d, f, M) {
    C(g, 0.17, 0.13, 0.32, 0, 0, 0, M.pot, 14);
    for (let k = 0; k < 7; k++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.55, 5), M.plantDead);
      const a = (k / 7) * Math.PI * 2;
      leaf.position.set(Math.cos(a) * 0.06, 0.55, Math.sin(a) * 0.06);
      leaf.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9 - 0.2);
      g.add(leaf);
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
  counter(g, w, d, f, M) {
    B(g, w, 0.1, d - 0.1, 0, 0, -0.05, M.black);
    B(g, w, 0.78, d - 0.04, 0, 0.1, -0.02, M.cabinet);
    B(g, w, 0.04, d, 0, 0.88, 0, M.stone);
    const n = Math.max(1, Math.round(w / 0.6));
    for (let k = 0; k < n; k++) {
      const x = -w / 2 + (k + 0.5) * (w / n);
      B(g, 0.008, 0.7, 0.004, x + w / n / 2 - 0.004, 0.14, d / 2 - 0.02, M.black);
      B(g, 0.1, 0.015, 0.02, x, 0.78, d / 2 - 0.01, M.metal);
    }
  },
  fridge(g, w, d, f, M, tx, house) {
    B(g, w, 1.85, d - 0.06, 0, 0, -0.03, M.white);
    const pivot = new THREE.Group();
    pivot.position.set(-w / 2, 0, d / 2 - 0.06);
    const door = B(pivot, w, 1.83, 0.06, w / 2, 0.01, 0.03, M.white);
    B(pivot, 0.03, 0.4, 0.03, w - 0.07, 0.9, 0.075, M.metal);
    const inner = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.08, 1.7), new THREE.MeshBasicMaterial({ color: 0x0a0b0c }));
    inner.position.set(0, 0.95, d / 2 - 0.0605);
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
    const coat = new THREE.MeshStandardMaterial({ color: 0x1d1f24, roughness: 0.95 });
    C(g, 0.12, 0.2, 0.95, 0.06, 0.65, 0.02, coat, 10);
    const hood = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), coat);
    hood.position.set(0.06, 1.65, 0.02);
    g.add(hood);
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
  tub(g, w, d, f, M) {
    const H0 = 0.16, H = 0.44, r = d / 2 - 0.02, core = w - 2 * r * 0.55;
    const body = (y, h, grow, mat) => {
      B(g, core, h, d - 0.04 + grow, 0, y, 0, mat);
      for (const s of [-1, 1]) {
        const end = new THREE.Mesh(new THREE.CylinderGeometry(r + grow / 2, r + grow / 2 - 0.03, h, 20), mat);
        end.scale.x = 0.55; end.position.set(s * core / 2, y + h / 2, 0);
        g.add(end);
      }
    };
    body(H0, H, 0, M.white);
    body(H0 + H, 0.035, 0.04, M.white);   // rolled rim
    const inner = B(g, core, 0.01, d - 0.16, 0, H0 + H + 0.03, 0, new THREE.MeshStandardMaterial({ color: 0x2a2c2e, roughness: 0.3 }));
    inner.userData.noScan = true;
    const brass = new THREE.MeshStandardMaterial({ color: 0x9a7a3a, metalness: 0.85, roughness: 0.35 });
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const fx = sx * (w / 2 - 0.08), fz = sz * (d / 2 - 0.08);
      C(g, 0.035, 0.02, H0 + 0.02, fx, 0.02, fz, brass, 8);
      const claw = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), brass);
      claw.scale.set(1.2, 0.6, 1.2); claw.position.set(fx + sx * 0.01, 0.02, fz + sz * 0.01);
      g.add(claw);
    }
    C(g, 0.015, 0.015, 0.22, -w / 2 + 0.12, H0 + H, 0, brass);
  },

  toilet(g, w, d, f, M) {
    B(g, w * 0.6, 0.38, d * 0.55, 0, 0, 0.05, M.white);
    B(g, w * 0.85, 0.06, d * 0.7, 0, 0.38, 0.06, M.white);
    B(g, w, 0.42, 0.18, 0, 0.38, -d / 2 + 0.09, M.white);
  },
  sink(g, w, d, f, M) {
    B(g, w, 0.82, d, 0, 0, 0, M.cabinet);
    B(g, w + 0.02, 0.05, d + 0.02, 0, 0.82, 0, M.white);
    const mirror = new THREE.Mesh(new THREE.PlaneGeometry(d * 0.9, 0.7), new THREE.MeshStandardMaterial({ color: 0x40464c, metalness: 1, roughness: 0.08 }));
    mirror.position.set(0, 1.45, -w / 2 + 0.005);
    g.add(mirror);
  },
  kidBed(g, w, d, f, M) {
    legs(g, w, d, 0.24, M.paint, 0.05);
    B(g, w, 0.06, d, 0, 0.24, 0, M.paint);
    for (let k = 0; k < 7; k++) B(g, w - 0.08, 0.02, 0.07, 0, 0.23, -d / 2 + 0.15 + k * (d - 0.3) / 6, M.wood);
    B(g, w - 0.04, 0.16, d - 0.06, 0, 0.3, 0.02, M.mattress);
    B(g, w, 0.06, d - 0.3, 0, 0.44, 0.15, M.fabricBlue);
    B(g, w - 0.3, 0.1, 0.3, 0, 0.46, -d / 2 + 0.25, M.white);
    B(g, w, 0.55, 0.05, 0, 0.24, -d / 2 + 0.025, M.paint);
    // teddy bear, sitting up and facing the door
    const fur = new THREE.MeshStandardMaterial({ color: 0x7a5a3a, roughness: 1 });
    const bear = new THREE.Group();
    const sp = (r, x, y, z, m = fur) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), m); s.position.set(x, y, z); bear.add(s); return s; };
    sp(0.09, 0, 0.09, 0); sp(0.065, 0, 0.22, 0.01); sp(0.025, -0.05, 0.28, 0); sp(0.025, 0.05, 0.28, 0);
    sp(0.008, -0.022, 0.235, 0.065, M.black); sp(0.008, 0.022, 0.235, 0.065, M.black);
    bear.position.set(0.15, 0.5, -d / 2 + 0.45);
    bear.rotation.y = 0.4;
    g.add(bear);
  },
  bed(g, w, d, f, M) {
    legs(g, w, d, 0.27, M.wood, 0.06);
    B(g, w, 0.08, d, 0, 0.27, 0, M.wood);
    for (let k = 0; k < 9; k++) B(g, w - 0.1, 0.02, 0.08, 0, 0.26, -d / 2 + 0.15 + k * (d - 0.3) / 8, M.wood);
    B(g, w - 0.06, 0.24, d - 0.08, 0, 0.35, 0.02, M.mattress);
    B(g, w, 0.9, 0.06, 0, 0.27, -d / 2 + 0.03, M.wood);
  },
  toyChest(g, w, d, f, M) {
    B(g, w, 0.45, d, 0, 0, 0, M.red);
    B(g, w + 0.02, 0.05, d + 0.02, 0, 0.45, 0, M.red);
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
    B(g, w, 0.85, d, 0, 0, 0, f.sheet ? M.sheet : M.wood);
    if (f.sheet) B(g, w + 0.03, 0.75, 0.012, 0, 0.06, d / 2 + 0.01, M.sheet);
  },
  washer(g, w, d, f, M) {
    B(g, w, 0.85, d, 0, 0, 0, M.white);
    const door = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20), M.black);
    door.position.set(0, 0.45, d / 2 + 0.002);
    g.add(door);
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
  clothes(g, w, d, f, M) {
    const cols = [0x2a2e3a, 0x4a3030, 0x3a4a3a, 0x8a8070, 0x1e1e22, 0x5a5a7a];
    for (let k = 0; k < 16; k++) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.18 + Math.random() * 0.12, 8, 6), new THREE.MeshStandardMaterial({ color: cols[k % cols.length], roughness: 1 }));
      const a = Math.random() * Math.PI * 2, rr = Math.random() * 0.4;
      m.position.set(Math.cos(a) * rr * (w / 1.2), 0.1 + Math.random() * 0.2, Math.sin(a) * rr * (d / 1.2));
      m.scale.set(1.3, 0.45, 1);
      m.rotation.y = Math.random() * 3;
      g.add(m);
    }
  },
  rug(g, w, d, f, M, tx) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshStandardMaterial({ map: tx.rug(f.color, !!f.round), roughness: 1, transparent: !!f.round, alphaTest: f.round ? 0.5 : 0 }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.004;
    m.userData.noShadow = true;
    g.add(m);
  },
};
