// The Long Man's body: model, poses and the scare. Entity (entity.js) decides what it does; this decides how it looks.
// Built for the floor-level camera: from 11 cm up you mostly see the backwards-bending legs, the long mud-black
// toes and the hands hanging past its knees. Its head hangs forward on a long neck, held level, cocked sideways.
// Two pinpoints of eye-shine catch the headlamp from across a room before anything else does.

import * as THREE from 'three';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const HEAD_REST = new THREE.Vector3(0, 0.3, 0.12);
const STAND = 1.395;   // hip height standing: the toe tips just touch the floor

function skinTexture(mud) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = mud ? '#6b5a4a' : '#cfc7ba';
  g.fillRect(0, 0, 256, 256);
  // soft mottling, blurred, drawn wrapped so the texture tiles without seams
  const wrap = (fn) => { for (const ox of [-256, 0, 256]) for (const oy of [-256, 0, 256]) fn(ox, oy); };
  g.filter = 'blur(6px)';
  for (let i = 0; i < 110; i++) {
    const a = 0.05 + Math.random() * 0.1, x = Math.random() * 256, y = Math.random() * 256, r = 5 + Math.random() * 24, e = 0.35 + Math.random() * 0.65, rot = Math.random() * 3;
    g.fillStyle = mud ? `rgba(25,18,10,${a * 1.7})` : `rgba(${88 + Math.random() * 50},${80 + Math.random() * 38},${72 + Math.random() * 38},${a})`;
    wrap((ox, oy) => { g.beginPath(); g.ellipse(x + ox, y + oy, r, r * e, rot, 0, 7); g.fill(); });
  }
  g.filter = 'blur(2px)';
  for (let i = 0; i < 60; i++) {   // small bruise-like flecks
    const x = Math.random() * 256, y = Math.random() * 256, r = 1.5 + Math.random() * 4;
    g.fillStyle = mud ? 'rgba(10,8,5,0.25)' : `rgba(${110 + Math.random() * 40},${90 + Math.random() * 20},${95 + Math.random() * 30},0.12)`;
    wrap((ox, oy) => { g.beginPath(); g.arc(x + ox, y + oy, r, 0, 7); g.fill(); });
  }
  g.filter = 'none';
  g.strokeStyle = mud ? 'rgba(20,14,8,0.5)' : 'rgba(80,92,130,0.22)';   // faint veins, or cracked dried mud
  for (let k = 0; k < 16; k++) {
    let x = Math.random() * 256, y = 0;
    g.lineWidth = 0.6 + Math.random() * 1.2;
    g.beginPath(); g.moveTo(x, y);
    while (y < 256) { x += (Math.random() - 0.5) * 14; y += 6 + Math.random() * 10; g.lineTo(x, y); }
    g.stroke();
  }
  g.strokeStyle = 'rgba(0,0,0,0.13)';   // creases
  for (let k = 0; k < 70; k++) {
    const y = Math.random() * 256, x = Math.random() * 256;
    g.lineWidth = 0.7;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 8, y + (Math.random() - 0.5) * 4, x + 16 + Math.random() * 12, y + (Math.random() - 0.5) * 3); g.stroke();
  }
  for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`; g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

// ---------- shape helpers ----------

const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const bell = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
const ridge = (d, w) => { const t = Math.max(0, 1 - Math.abs(d) / w); return t * t * (3 - 2 * t); };

function hash3(x, y, z) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const s = (t) => t * t * (3 - 2 * t), u = s(x - xi), v = s(y - yi), w = s(z - zi);
  const L = (a, b, t) => a + (b - a) * t, c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v), L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
}
// Lumps under the skin. Mirrored in x so the two sides match.
const lumps = (p, f = 22) => { const x = Math.abs(p.x); return noise3(x * f, p.y * f, p.z * f) * 0.65 + noise3(x * f * 2.7 + 7.3, p.y * f * 2.7, p.z * f * 2.7) * 0.35; };

// Catmull-Rom through keyframes [[y, ...values], ...], sorted by y.
function profile(keys, y) {
  const n = keys.length;
  if (y <= keys[0][0]) return keys[0].slice(1);
  if (y >= keys[n - 1][0]) return keys[n - 1].slice(1);
  let i = 0;
  while (keys[i + 1][0] < y) i++;
  const k0 = keys[Math.max(0, i - 1)], k1 = keys[i], k2 = keys[i + 1], k3 = keys[Math.min(n - 1, i + 2)];
  const t = (y - k1[0]) / (k2[0] - k1[0]), t2 = t * t, t3 = t2 * t;
  return k1.slice(1).map((_, m) => {
    const p0 = k0[m + 1], p1 = k1[m + 1], p2 = k2[m + 1], p3 = k3[m + 1];
    return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
  });
}

// Rounds a tube off at its ends: e0/e1 are the lengths of the rounded caps.
const capF = (s, L, e0, e1) => Math.max(0.03, Math.min(e0 ? Math.sqrt(Math.max(0, 1 - (1 - Math.min(1, s / e0)) ** 2)) : 1, e1 ? Math.sqrt(Math.max(0, 1 - (1 - Math.min(1, (L - s) / e1)) ** 2)) : 1));

const FRONT = new THREE.Vector3(0, 0, 1);

// One stretch of skin: a tube from a to b (bind pose), rings every `step`, skinned to bones along its length.
// o.r(s) -> [rx, rz] half-widths, o.off(s, th, p) -> displacement out of the surface, o.w(s) -> [[bone, w]...],
// o.tint(s, th, p, d) -> [mud, bone, shadow, nail], o.center(s) -> offset of the centre line.
function tubePart(a, b, o) {
  const T = b.clone().sub(a), L = T.length();
  T.normalize();
  const f = o.front || FRONT;
  const N = f.clone().addScaledVector(T, -f.dot(T)).normalize();
  const B = new THREE.Vector3().crossVectors(T, N);
  const rings = Math.max(3, Math.ceil(L / (o.step || 0.01)) + 1), radial = o.radial || 16;
  const n = rings * (radial + 1);
  const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), si = new Uint16Array(n * 4), sw = new Float32Array(n * 4), tint = new Float32Array(n * 4);
  const c = new THREE.Vector3(), out = new THREE.Vector3(), p = new THREE.Vector3();
  const uRep = Math.max(1, Math.round((2 * Math.PI * (o.uR || 0.03)) / 0.22));
  let k = 0;
  for (let i = 0; i < rings; i++) {
    const s = (L * i) / (rings - 1);
    c.copy(a).addScaledVector(T, s);
    if (o.center) c.add(o.center(s));
    const [rx0, rz0] = o.r(s);
    const cf = capF(s, L, o.caps?.[0] || 0, o.caps?.[1] || 0), rx = rx0 * cf, rz = rz0 * cf;
    const w = o.w ? o.w(s) : null;
    for (let jj = 0; jj <= radial; jj++, k++) {
      const th = ((jj % radial) / radial) * Math.PI * 2, cs = Math.cos(th), sn = Math.sin(th);
      out.copy(N).multiplyScalar(cs).addScaledVector(B, sn);
      p.copy(c).addScaledVector(N, cs * rz).addScaledVector(B, sn * rx);
      const wv = o.wv ? o.wv(s, th, p) : w;
      let d = (o.off ? o.off(s, th, p) : 0) + (o.lump ?? 0.0015) * lumps(p, o.lumpF || 22);
      d *= Math.min(1, cf * 1.5);
      p.addScaledVector(out, d);
      pos.set([p.x, p.y, p.z], k * 3);
      uv.set([(jj / radial) * uRep, s / 0.35 + (o.v0 || 0)], k * 2);
      for (let m = 0; m < 4; m++) { si[k * 4 + m] = wv[m] ? wv[m][0] : 0; sw[k * 4 + m] = wv[m] ? wv[m][1] : 0; }
      tint.set(o.tint ? o.tint(s, th, p, d) : [0, 0, 0, 0], k * 4);
    }
  }
  const idx = [];
  for (let i = 0; i < rings - 1; i++) for (let jj = 0; jj < radial; jj++) {
    const A = i * (radial + 1) + jj, Bq = A + 1, C = A + radial + 2, D = A + radial + 1;
    idx.push(A, Bq, C, A, C, D);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(si, 4));
  g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
  g.setAttribute('aTint', new THREE.BufferAttribute(tint, 4));
  g.setIndex(idx);
  g.computeVertexNormals();
  // the seam where the ring closes: share one normal
  const nr = g.attributes.normal;
  for (let i = 0; i < rings; i++) {
    const A = i * (radial + 1), Z = A + radial;
    const x = nr.getX(A) + nr.getX(Z), y = nr.getY(A) + nr.getY(Z), z = nr.getZ(A) + nr.getZ(Z), l = Math.hypot(x, y, z) || 1;
    nr.setXYZ(A, x / l, y / l, z / l); nr.setXYZ(Z, x / l, y / l, z / l);
  }
  return g;
}

// A rigid piece (a nail) fixed to one bone, already placed in bind space.
function rigidPart(geo, bone, tint) {
  const g = geo.index ? geo : geo;
  const n = g.attributes.position.count;
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(n * 4).map((_, i) => (i % 4 ? 0 : bone)), 4));
  g.setAttribute('skinWeight', new THREE.BufferAttribute(new Float32Array(n * 4).map((_, i) => (i % 4 ? 0 : 1)), 4));
  g.setAttribute('aTint', new THREE.BufferAttribute(new Float32Array(n * 4).map((_, i) => tint[i % 4]), 4));
  return g;
}

function mergeGeos(list) {
  let nv = 0, ni = 0;
  for (const g of list) { nv += g.attributes.position.count; ni += g.index.count; }
  const pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = new Float32Array(nv * 2), idx = new Uint32Array(ni);
  const withColor = list.every((g) => g.attributes.color), col = withColor ? new Float32Array(nv * 3) : null;
  let vo = 0, io = 0;
  for (const g of list) {
    pos.set(g.attributes.position.array, vo * 3); nor.set(g.attributes.normal.array, vo * 3); uv.set(g.attributes.uv.array, vo * 2);
    if (col) col.set(g.attributes.color.array, vo * 3);
    const a = g.index.array;
    for (let i = 0; i < a.length; i++) idx[io + i] = a[i] + vo;
    vo += g.attributes.position.count; io += a.length;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  if (col) out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

function mulberry(a) { return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const srgb = (r, g, b) => new THREE.Color().setRGB(Math.max(0, r), Math.max(0, g), Math.max(0, b), THREE.SRGBColorSpace);

// ---------- inside the head ----------

// The lining of one half of the head: ridged like the roof of a mouth, the ridges running along the seam,
// wet raw pink on the ridges, dark in the creases, threaded with veins.
function fleshHalf(side, RX, RY, RZ, HZ) {
  const phi = side < 0 ? -Math.PI / 2 : Math.PI / 2;
  const g = new THREE.SphereGeometry(1, 48, 40, phi, Math.PI);
  const pa = g.attributes.position, v = new THREE.Vector3(), cols = new Float32Array(pa.count * 3);
  for (let i = 0; i < pa.count; i++) {
    v.fromBufferAttribute(pa, i);
    const p = skull(v, RX, RY, RZ, 0.93);
    const depth = Math.abs(v.x), qx = Math.abs(v.x);
    const n1 = noise3(qx * 4 + 3, v.y * 5, v.z * 4), n2 = noise3(qx * 14, v.y * 14 + 5, v.z * 14);
    const folds = 0.5 + 0.5 * Math.sin(depth * Math.PI * 9 + n1 * 2.6 + v.y * 2.5);
    const rdg = folds ** 3 * smooth(0.06, 0.22, depth);
    const gum = 1 - smooth(0.02, 0.16, depth);
    const pull = 0.0055 * rdg + 0.004 * Math.max(0, n1) + 0.0025 * gum - 0.0025 * Math.max(0, n2) ** 2;
    p.addScaledVector(p.clone().normalize(), -pull);   // into the cavity
    pa.setXYZ(i, p.x, p.y, p.z - HZ);
    const vein = Math.max(0, 1 - Math.abs(noise3(qx * 8 + 9, v.y * 8, v.z * 8)) * 16) * smooth(0.1, 0.3, depth);
    const crease = (1 - folds) ** 2 * smooth(0.06, 0.22, depth);
    const c = srgb(0.34 + 0.32 * rdg + 0.22 * gum - 0.2 * crease - 0.1 * vein, 0.05 + 0.13 * rdg + 0.13 * gum - 0.04 * crease - 0.03 * vein, 0.045 + 0.08 * rdg + 0.1 * gum - 0.03 * crease + 0.05 * vein);
    cols.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  g.computeVertexNormals();
  return g;
}

// The gum along the edge of the seam, lumpy, where the teeth are rooted.
function gumLip(side, RX, RY, RZ, HZ) {
  const pts = [];
  for (let k = 0; k <= 40; k++) {
    const a = -Math.PI / 2 + 0.05 + (k / 40) * (Math.PI - 0.1);
    const p = skull(new THREE.Vector3(0, Math.sin(a), Math.cos(a)), RX, RY, RZ, 0.955);
    pts.push(new THREE.Vector3(side * 0.0045, p.y, p.z - HZ));
  }
  const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.0058, 9, false);
  const pa = g.attributes.position, v = new THREE.Vector3(), cols = new Float32Array(pa.count * 3);
  for (let i = 0; i < pa.count; i++) {
    v.fromBufferAttribute(pa, i);
    const n = noise3(Math.abs(v.x) * 90, v.y * 90, v.z * 90);
    v.x *= 1 + 0.35 * n; v.z += 0.0015 * n;
    pa.setXYZ(i, v.x, v.y, v.z);
    const c = srgb(0.55 + 0.15 * n, 0.22 + 0.06 * n, 0.2 + 0.05 * n);
    cols.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  g.computeVertexNormals();
  return g;
}

// Three uneven rows of needles along the gum, hooked toward the middle of the face. Some missing, some broken.
function teethHalf(side, RX, RY, RZ, HZ, seed) {
  const rnd = mulberry(seed), parts = [];
  const rows = [[24, 0.022, 0.044, 0.0048, 0], [17, 0.013, 0.029, 0.0037, 0.011], [11, 0.008, 0.018, 0.0029, 0.021]];
  rows.forEach(([n, lmin, lmax, rad, inset], row) => {
    for (let k = 0; k < n; k++) {
      if ((row > 0 && rnd() < 0.2) || rnd() < 0.05) continue;
      const a = -Math.PI / 2 + 0.13 + ((k + 0.5 * row + (rnd() - 0.5) * 0.5) / n) * (Math.PI - 0.26);
      const rim = skull(new THREE.Vector3(0, Math.sin(a), Math.cos(a)), RX, RY, RZ, 0.955);
      const inward = new THREE.Vector3(0, -Math.sin(a), -Math.cos(a)).normalize();
      const base = rim.addScaledVector(inward, inset * 0.5);
      base.x = side * (0.003 + inset);
      let len = lmin + rnd() * (lmax - lmin);
      if (rnd() < 0.09) len *= 0.4;   // snapped off
      const dir = new THREE.Vector3(-side, (rnd() - 0.5) * 0.35, -0.12).addScaledVector(inward, 0.3 + rnd() * 0.35).normalize();
      const hook = inward.clone().addScaledVector(dir, -inward.dot(dir)).normalize();
      const t = new THREE.ConeGeometry(rad * (0.75 + rnd() * 0.5), len, 7, 5);
      const pa = t.attributes.position, cols = new Float32Array(pa.count * 3), bend = (0.25 + rnd() * 0.25) * len;
      for (let i = 0; i < pa.count; i++) {
        const yy = pa.getY(i) / len + 0.5;
        pa.setX(i, pa.getX(i) + bend * yy * yy);
        const c = srgb(0.26 + 0.6 * yy, 0.17 + 0.58 * yy, 0.11 + 0.48 * yy);
        cols.set([c.r, c.g, c.b], i * 3);
      }
      t.setAttribute('color', new THREE.BufferAttribute(cols, 3));
      t.translate(0, len / 2, 0);
      t.applyMatrix4(new THREE.Matrix4().makeBasis(hook, dir, new THREE.Vector3().crossVectors(hook, dir).normalize()));
      t.translate(base.x, base.y, base.z - HZ);
      t.computeVertexNormals();
      parts.push(t);
    }
  });
  return mergeGeos(parts);
}

// The wet core behind the seam: a column of folded flesh with two lidded sockets, one above the other.
function fleshCore(eyes) {
  const g = new THREE.SphereGeometry(1, 30, 40);
  const pa = g.attributes.position, v = new THREE.Vector3(), cols = new Float32Array(pa.count * 3);
  for (let i = 0; i < pa.count; i++) {
    v.fromBufferAttribute(pa, i);
    const th = Math.atan2(v.x, v.z);
    let x = v.x * 0.03, y = v.y * 0.1, z = v.z * 0.044;
    const folds = 0.5 + 0.5 * Math.sin(th * 5 + v.y * 8 + noise3(v.x * 3, v.y * 6, v.z * 3) * 2.2);
    let d = 0.0045 * folds ** 2 + 0.003 * noise3(v.x * 7 + 1, v.y * 12, v.z * 7);
    let socket = 0, lid = 0;
    for (const ey of eyes) {
      const r = Math.hypot(x * 1.2, y - ey) * (z > 0 ? 1 : 3);
      socket = Math.max(socket, bell(r, 0, 0.012));
      lid = Math.max(lid, bell(r, 0.0145, 0.0035) * (y > ey ? 1.2 : 0.8));
    }
    d += -0.012 * socket + 0.005 * lid;
    const nrm = new THREE.Vector3(v.x / 0.03, v.y / 0.1, v.z / 0.044).normalize();
    pa.setXYZ(i, x + nrm.x * d, y + nrm.y * d, z + nrm.z * d);
    const c = srgb(0.3 + 0.28 * folds ** 2 - 0.25 * socket + 0.15 * lid, 0.035 + 0.1 * folds ** 2 + 0.08 * lid, 0.035 + 0.07 * folds ** 2 + 0.06 * lid);
    cols.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  g.computeVertexNormals();
  return g;
}

function mergeParts(list) {
  let nv = 0, ni = 0;
  for (const g of list) { nv += g.attributes.position.count; ni += g.index.count; }
  const attrs = { position: 3, normal: 3, uv: 2, skinIndex: 4, skinWeight: 4, aTint: 4 };
  const buf = {};
  for (const [k, sz] of Object.entries(attrs)) buf[k] = k === 'skinIndex' ? new Uint16Array(nv * sz) : new Float32Array(nv * sz);
  const idx = new Uint32Array(ni);
  let vo = 0, io = 0;
  for (const g of list) {
    for (const [k, sz] of Object.entries(attrs)) buf[k].set(g.attributes[k].array, vo * sz);
    const a = g.index.array;
    for (let i = 0; i < a.length; i++) idx[io + i] = a[i] + vo;
    vo += g.attributes.position.count; io += a.length;
  }
  const out = new THREE.BufferGeometry();
  for (const [k, sz] of Object.entries(attrs)) out.setAttribute(k, k === 'skinIndex' ? new THREE.Uint16BufferAttribute(buf[k], sz) : new THREE.BufferAttribute(buf[k], sz));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}

// The skull: a tall egg, heavier at the brow, hollow at the temples, narrowing to the jaw, never quite even.
// v: a point on the unit sphere (head space directions). Returns the surface point.
function skull(v, RX, RY, RZ, inset = 1) {
  const ax = Math.abs(v.x);
  let x = v.x * RX * (1 - 0.14 * smooth(-0.35, -0.95, v.y)), y = v.y * RY, z = v.z * RZ * (1 - 0.1 * smooth(0.2, -0.9, v.z) * smooth(0, 0.8, v.y));
  let d = 0.01 * bell(v.y, 0.4, 0.11) * smooth(0.2, 0.7, v.z)        // a heavy brow
    - 0.012 * bell(v.y, 0.28, 0.18) * smooth(0.4, 0.9, ax)             // sunken temples
    + 0.008 * bell(v.y, -0.1, 0.1) * smooth(0.1, 0.5, v.z) * smooth(0.3, 0.7, ax)   // cheekbones
    - 0.008 * bell(v.y, -0.34, 0.1) * smooth(0.25, 0.75, ax)           // hollow under them
    + 0.006 * smooth(0.5, 0.9, v.y) * smooth(0.1, -0.6, v.z)           // the crown, pushed back
    + 0.004 * bell(v.y, 0.7, 0.2) * bell(ax, 0.35, 0.2) * smooth(-0.2, 0.4, v.z)   // knuckled ridges on the forehead
    + 0.0025 * lumps(new THREE.Vector3(ax * 0.08, v.y * 0.16, v.z * 0.1), 26);
  const p = new THREE.Vector3(x, y, z);
  const nrm = new THREE.Vector3(v.x / RX, v.y / RY, v.z / RZ).normalize();
  return p.addScaledVector(nrm, d).multiplyScalar(inset);
}

function skullHalf(side, RX, RY, RZ, HZ, inset = 1) {
  const phi = side < 0 ? -Math.PI / 2 : Math.PI / 2;
  const g = new THREE.SphereGeometry(1, 36, 30, phi, Math.PI);
  const pa = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pa.count; i++) {
    v.fromBufferAttribute(pa, i);
    const p = skull(v, RX, RY, RZ, inset);
    pa.setXYZ(i, p.x, p.y, p.z - HZ);
  }
  g.computeVertexNormals();
  return g;
}

// The skin shader: one material for the whole body. aTint blends in the mud (forearms, hands, shins, feet),
// pale bone where it shows through (ribs, spine, knees), shadow in the hollows, and the black nails.
function bodyMaterial(skinMap, mudMap) {
  const m = new THREE.MeshStandardMaterial({ color: 0xb4b6ac, map: skinMap, bumpMap: skinMap, bumpScale: 2.2, roughness: 0.7 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.mudMap = { value: mudMap };
    sh.uniforms.mudColor = { value: new THREE.Color(0x3a322c) };
    sh.uniforms.boneColor = { value: new THREE.Color(0xdcd8c8) };
    sh.uniforms.nailColor = { value: new THREE.Color(0x14110e) };
    sh.vertexShader = 'attribute vec4 aTint;\nvarying vec4 vTint;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n  vTint = aTint;');
    sh.fragmentShader = 'uniform sampler2D mudMap;\nuniform vec3 mudColor;\nuniform vec3 boneColor;\nuniform vec3 nailColor;\nvarying vec4 vTint;\n' + sh.fragmentShader
      .replace('#include <map_fragment>', `#include <map_fragment>
  vec3 skinTx = texture2D(map, vMapUv).rgb;
  diffuseColor.rgb = mix(diffuseColor.rgb, boneColor * skinTx, vTint.y);
  diffuseColor.rgb = mix(diffuseColor.rgb, mudColor * texture2D(mudMap, vMapUv * 1.3).rgb, vTint.x);
  diffuseColor.rgb = mix(diffuseColor.rgb, nailColor, vTint.w);
  diffuseColor.rgb *= 1.0 - vTint.z * 0.7;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
  roughnessFactor = mix(mix(roughnessFactor, 0.36, vTint.x), 0.2, vTint.w);`);
  };
  m.customProgramCacheKey = () => 'longman-body';
  return m;
}

export class LongMan {
  constructor() {
    const skinMap = skinTexture(false), mudMap = skinTexture(true);
    this.mat = {
      body: bodyMaterial(skinMap, mudMap),
      skin: new THREE.MeshStandardMaterial({ color: 0xb4b6ac, map: skinMap, bumpMap: skinMap, bumpScale: 2.2, roughness: 0.7 }),
      // inside the head: wet flesh, coloured per vertex
      flesh: new THREE.MeshStandardMaterial({ vertexColors: true, bumpMap: skinMap, bumpScale: 1.2, roughness: 0.15, metalness: 0.04 }),
      fleshIn: new THREE.MeshStandardMaterial({ vertexColors: true, bumpMap: skinMap, bumpScale: 1.2, roughness: 0.15, metalness: 0.04, side: THREE.BackSide }),
      tooth: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.32 }),
      strand: new THREE.MeshStandardMaterial({ color: 0xc89890, roughness: 0.05, transparent: true, opacity: 0.7 }),
      shine: new THREE.MeshBasicMaterial({ color: 0x000000 }),
    };
    this.build();
    this.resetPose();
  }

  build() {
    const M = this.mat;
    // every joint is a bone: one skinned body bends smoothly around them
    const J = (parent, x, y, z) => { const o = new THREE.Bone(); o.position.set(x, y, z); parent.add(o); return o; };
    const mesh = (parent, geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
    const ball = (parent, r, mat, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = mesh(parent, new THREE.SphereGeometry(r, 24, 18), mat, x, y, z); m.scale.set(sx, sy, sz); return m; };

    const root = new THREE.Group();
    this.root = root;
    const hips = J(root, 0, 1.37, 0);
    const spine = J(hips, 0, 0.03, 0);
    const chest = J(spine, 0, 0.42, 0);
    const neck = J(chest, 0, 0.44, 0.035);
    const head = J(neck, HEAD_REST.x, HEAD_REST.y, HEAD_REST.z);

    // ---- the head: no face. A long skull with one seam down the front; two points of light deep in the seam.
    // When it hunts the seam cracks; when it has you, the head opens like a book and the inside is teeth.
    const RX = 0.08, RY = 0.165, RZ = 0.1, HZ = -0.085;   // head radii, hinge line at the back
    ball(head, 0.05, M.skin, 0, -0.04, HZ + 0.02, 1, 1.3, 0.9);                  // back of the skull, fixed to the neck
    mesh(head, fleshCore([0.05, 0.016]), M.flesh, 0, 0, -0.01);                    // the wet core, seen through the seam
    const wetEye = new THREE.MeshStandardMaterial({ color: 0x0a0806, roughness: 0.04, metalness: 0.3 });
    this.eyes = [0.05, 0.016].map((y) => {                                        // two eyes, one above the other, in lidded sockets
      ball(head, 0.0105, wetEye, 0, y, 0.026, 1, 0.85, 0.8);
      return ball(head, 0.0035, M.shine, 0, y + 0.002, 0.035);
    });
    const half = (side) => {
      const pivot = J(head, side * 0.002, 0, HZ);
      mesh(pivot, skullHalf(side, RX, RY, RZ, HZ), M.skin);
      mesh(pivot, fleshHalf(side, RX, RY, RZ, HZ), M.fleshIn);   // the lining, ridged and wet
      mesh(pivot, gumLip(side, RX, RY, RZ, HZ), M.flesh);
      mesh(pivot, teethHalf(side, RX, RY, RZ, HZ, side > 0 ? 11 : 23), M.tooth);
      return pivot;
    };
    const faceL = half(-1), faceR = half(1);
    // strings of spit between the two halves: they stretch as the head opens and snap one by one
    const rs = mulberry(5), unit = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true).translate(0, 0.5, 0);
    this.strands = [];
    for (let k = 0; k < 10; k++) {
      const a = -1.2 + rs() * 2.3, p = skull(new THREE.Vector3(0, Math.sin(a), Math.cos(a) * (0.5 + rs() * 0.5)), RX, RY, RZ, 0.9);
      const qR = new THREE.Vector3(0.007 + rs() * 0.01, p.y, p.z - HZ), qL = qR.clone().setX(-qR.x).add(new THREE.Vector3(0, (rs() - 0.5) * 0.02, 0));
      const seg = () => { const m = new THREE.Mesh(unit, M.strand); m.userData.noShadow = true; m.visible = false; head.add(m); return m; };
      this.strands.push({ qL, qR, r: 0.0009 + rs() * 0.0012, snap: 0.06 + rs() * 0.22, m: [seg(), seg()] });
    }

    // ---- arms: hanging past the knees, five long fingers
    const finger = (parent, x, len, spread) => {
      let p = J(parent, x, -0.09, 0);
      p.rotation.z = spread;
      const lens = [len * 0.42, len * 0.33, len * 0.25], joints = [p];
      for (let i = 0; i < 2; i++) { p = J(p, 0, -lens[i], 0); joints.push(p); }
      joints.lens = lens;
      return joints;
    };
    const arm = (side) => {
      const sh = J(chest, side * 0.19, 0.38, -0.01);
      const el = J(sh, 0, -0.66, 0);
      const wr = J(el, 0, -0.66, 0);
      const fingers = [-0.026, -0.009, 0.009, 0.026].map((x, i) => finger(wr, x, 0.24 - Math.abs(i - 1.5) * 0.03, x * 1.5));
      const thumb = finger(wr, side * 0.03, 0.15, side * 0.5);
      thumb[0].position.y = -0.04;
      return { sh, el, wr, fingers: [...fingers, thumb], side };
    };

    // ---- legs: bending the wrong way, walking on long toes
    const leg = (side) => {
      const hip = J(hips, side * 0.095, -0.02, 0);
      const knee = J(hip, 0, -0.6, 0);
      const ankle = J(knee, 0, -0.66, 0);
      const ball2 = J(ankle, 0, -0.3, 0);
      const toes = [-0.03, -0.01, 0.01, 0.03].map((x, i) => {
        const t = J(ball2, x, 0, 0);
        t.rotation.z = x * 2.5;
        const L = 0.13 - Math.abs(i - 1.5) * 0.015;
        const t2 = J(t, 0, -L * 0.6, 0);
        const pair = [t, t2];
        pair.lens = [L * 0.6, L * 0.4];
        return pair;
      });
      return { hip, knee, ankle, ball: ball2, toes, side };
    };

    this.j = { hips, spine, chest, neck, head, faceL, faceR, armL: arm(-1), armR: arm(1), legL: leg(-1), legR: leg(1) };
    this.buildSkin();
    root.traverse((o) => { if (o.isMesh) { o.castShadow = o.material !== M.shine && !o.userData.noShadow; o.receiveShadow = true; } });
  }

  // The whole body as one skinned mesh, sculpted in the bind pose (standing straight, arms hanging).
  buildSkin() {
    const j = this.j, root = this.root;
    root.updateMatrixWorld(true);
    const bones = [];
    root.traverse((o) => { if (o.isBone) bones.push(o); });
    const bi = (b) => bones.indexOf(b);
    const wp = (b, x = 0, y = 0, z = 0) => b.localToWorld(new THREE.Vector3(x, y, z));
    // weights along a chain: the start bone, then [s, bone, half-width] at each joint. s and half-width may depend
    // on the angle round the limb, so the front and back of a joint can bend differently (keeps the volume).
    const chain = (start, joints) => (s, th = 0) => {
      let cur = bi(start);
      for (const [js0, b, w0] of joints) {
        const js = typeof js0 === 'function' ? js0(th) : js0, w = typeof w0 === 'function' ? w0(th) : w0;
        if (s < js - w) return [[cur, 1]];
        if (s <= js + w) { const t = smooth(js - w, js + w, s); return [[cur, 1 - t], [bi(b), t]]; }
        cur = bi(b);
      }
      return [[cur, 1]];
    };
    const fold = (th) => Math.abs(th > Math.PI ? th - 2 * Math.PI : th);   // 0 front .. PI back
    const plat = (x, c, w) => 1 - smooth(w * 0.55, w, Math.abs(x - c));    // a flat-topped bump with a defined edge
    const parts = [];

    // ---- torso: pelvis, the sunken belly, every rib, the knobs of the spine, shoulder blades and collarbones.
    // Keyframes: [height, half-width, half-depth, forward offset].
    const TK = [
      [1.205, 0.03, 0.03, 0], [1.24, 0.085, 0.06, 0], [1.3, 0.122, 0.082, -0.005], [1.37, 0.138, 0.088, -0.01],
      [1.44, 0.118, 0.078, -0.006], [1.53, 0.094, 0.066, 0], [1.63, 0.092, 0.064, 0.002], [1.72, 0.108, 0.074, 0.006],
      [1.8, 0.138, 0.094, 0.01], [1.9, 0.158, 0.108, 0.012], [2.0, 0.166, 0.113, 0.01], [2.1, 0.163, 0.108, 0.005],
      [2.18, 0.15, 0.094, 0], [2.24, 0.124, 0.078, -0.006], [2.29, 0.074, 0.058, 0], [2.33, 0.042, 0.042, 0.01],
    ];
    const Y0 = 1.205, Y1 = 2.335;
    // the shoulders slope down and out from the neck (the trapezius), as far as the bony point of the shoulder
    const SHELF = [[2.06, 0], [2.12, 0.01], [2.17, 0.03], [2.205, 0.046], [2.235, 0.038], [2.265, 0.02], [2.3, 0.005], [2.33, 0]];
    // ribs rise from the spine and sweep down toward the front, each one a separate bar
    const ribY = (k, th) => 1.86 + k * 0.047 - 0.052 * Math.cos(th) + 0.012 * Math.cos(2 * th);
    const ribAt = (y, th) => {
      const ath = Math.abs(th > Math.PI ? th - 2 * Math.PI : th);   // 0 front .. PI back
      if (ath > 2.55) return 0;                                      // the spine, at the back
      let r = 0;
      for (let k = 0; k < 7; k++) {
        if (k >= 4 && ath < 0.5 + (k - 4) * 0.25) continue;          // the lowest ribs part at the front (the costal arch)
        r = Math.max(r, ridge(y - ribY(k, th), 0.0145) * (k < 2 ? 0.75 : 1));
      }
      return r * smooth(2.55, 2.25, ath);
    };
    const torsoOff = (s, th, p) => {
      const y = Y0 + s, ath = Math.abs(th > Math.PI ? th - 2 * Math.PI : th), lat = Math.abs(Math.sin(th)), fr = Math.cos(th);
      let d = 0;
      // the shoulder girdle: the trapezius sloping from the neck out to the bony point of the shoulder,
      // the acromion on the corner, then a drop into the armpit, under the deltoid of the arm
      d += profile(SHELF, y)[0] * lat ** (2.5 + 2.5 * smooth(2.25, 2.19, y));
      d += 0.006 * bell(y, 2.208, 0.01) * lat ** 14;                                   // acromion
      const spY = 2.19 - (ath - 2.05) * 0.14;
      d += 0.006 * ridge(y - spY, 0.01) * smooth(1.95, 2.12, ath) * (1 - smooth(2.7, 2.85, ath));   // the spine of the shoulder blade
      d += 0.008 * ridge(ath - 1.2, 0.2) * smooth(2.03, 2.09, y) * (1 - smooth(2.17, 2.21, y));     // front fold of the armpit
      d += 0.011 * ridge(ath - 1.98, 0.22) * smooth(2.0, 2.07, y) * (1 - smooth(2.17, 2.21, y));    // back fold of the armpit
      d -= 0.01 * bell(y, 2.11, 0.035) * bell(ath, 1.6, 0.2);                           // the armpit itself
      d += 0.022 * bell(y, 1.385, 0.03) * bell(ath, 1.15, 0.35);                        // hip bones
      d -= 0.016 * bell(y, 1.58, 0.08) * Math.max(0, fr) ** 2;                          // the belly, sunk in
      const ribBand = smooth(1.74, 1.8, y) * (1 - smooth(2.15, 2.19, y));
      d += ribBand * (0.012 * ribAt(y, th) - 0.005 * smooth(2.55, 2.2, ath));          // ribs, and the hollows between
      d += 0.006 * bell(ath, 0, 0.1) * smooth(1.88, 1.92, y) * (1 - smooth(2.12, 2.16, y));   // sternum
      const cy = 2.215 + 0.022 * lat;
      d += 0.008 * ridge(y - cy, 0.013) * smooth(0.25, 0.4, ath) * (1 - smooth(1.25, 1.45, ath));   // collarbones
      const knob = Math.pow(0.5 + 0.5 * Math.cos(((y - 1.38) / 0.046) * Math.PI * 2), 3);
      d += 0.012 * bell(ath, Math.PI, 0.17) * knob * smooth(1.36, 1.4, y) * (1 - smooth(2.26, 2.3, y));   // spine
      d += 0.017 * bell(ath, Math.PI - 0.78, 0.33) * bell(y, 2.07, 0.065);              // shoulder blades
      d -= 0.004 * bell(ath, Math.PI - 0.32, 0.12) * smooth(1.5, 1.6, y) * (1 - smooth(2.15, 2.2, y));   // grooves beside the spine
      return d;
    };
    const torsoTint = (s, th, p, d) => {
      const y = Y0 + s, ath = Math.abs(th > Math.PI ? th - 2 * Math.PI : th);
      const ribBand = smooth(1.74, 1.8, y) * (1 - smooth(2.15, 2.19, y));
      const rib = ribAt(y, th) * ribBand;
      const spY = 2.19 - (ath - 2.05) * 0.14, lat = Math.abs(Math.sin(th));
      const bone = Math.min(0.75, rib * 0.6 + 0.55 * bell(ath, Math.PI, 0.15) * smooth(1.36, 1.4, y) + 0.4 * bell(y, 1.385, 0.03) * bell(ath, 1.15, 0.35)
        + 0.55 * bell(y, 2.208, 0.011) * lat ** 12 + 0.35 * ridge(y - spY, 0.01) * smooth(1.95, 2.12, ath) * (1 - smooth(2.7, 2.85, ath)));
      const hollow = ribBand * (1 - ribAt(y, th)) * smooth(2.55, 2.2, ath) * 0.45
        + 0.55 * bell(y, 2.11, 0.04) * bell(ath, 1.6, 0.25)                             // armpits
        + 0.3 * bell(y, 2.19, 0.025) * (bell(ath, 0.95, 0.2) + bell(ath, 2.2, 0.2)) * lat   // hollows beside the shoulder
        + 0.3 * bell(y, 1.74, 0.03) * Math.max(0, Math.cos(th))                          // under the ribcage
        + 0.25 * smooth(1.26, 1.21, y);
      return [0, bone, Math.min(0.75, hollow), 0];
    };
    const torsoChain = chain(j.hips, [[1.4 - Y0, j.spine, 0.035], [1.82 - Y0, j.chest, 0.05]]);
    parts.push(tubePart(new THREE.Vector3(0, Y0, 0), new THREE.Vector3(0, Y1, 0), {
      r: (s) => profile(TK, Y0 + s).slice(0, 2), center: (s) => new THREE.Vector3(0, 0, profile(TK, Y0 + s)[2]),
      caps: [0.04, 0.035], step: 0.007, radial: 52, off: torsoOff, tint: torsoTint, uR: 0.14,
      // the top of the shoulder moves a little with the arm, so raising it doesn't tear the shoulder off
      wv: (s, th, p) => {
        const base = torsoChain(s), y = Y0 + s, k = 0.45 * smooth(0.5, 0.92, Math.abs(Math.sin(th))) * bell(y, 2.2, 0.055);
        if (k < 0.01) return base;
        return [...base.map(([b, wt]) => [b, wt * (1 - k)]), [bi(p.x > 0 ? j.armR.sh : j.armL.sh), k]];
      },
    }));

    // ---- neck: from inside the shoulders to the back of the skull; it stretches with the head
    {
      const a = new THREE.Vector3(0, 2.215, 0.0), b = wp(j.head).add(new THREE.Vector3(0, 0.01, -0.03));
      const L = a.distanceTo(b), hn = bi(j.neck), hh = bi(j.head), hc = bi(j.chest);
      parts.push(tubePart(a, b, {
        r: (s) => { const t = s / L; const r = 0.03 + 0.024 * (1 - smooth(0.05, 0.32, t)) + 0.005 * smooth(0.75, 1, t) - 0.002 * bell(t, 0.55, 0.15); return [r * 1.08, r * 0.9]; },
        caps: [0, 0.02], step: 0.007, radial: 18, uR: 0.03,
        off: (s, th) => {
          const t = s / L, fr = Math.cos(th);
          const knob = Math.pow(0.5 + 0.5 * Math.cos((t * 5.5) * Math.PI * 2), 3);
          return 0.008 * Math.max(0, -fr) ** 6 * knob * smooth(0.1, 0.2, t)                   // vertebrae
            + 0.006 * bell(Math.abs(th > Math.PI ? th - 2 * Math.PI : th), 0.75 - 0.45 * t, 0.16) * smooth(0.1, 0.3, t) * (1 - smooth(0.75, 0.95, t))   // the cords of the neck, converging on the throat
            + 0.003 * Math.max(0, fr) ** 8 * bell(t, 0.3, 0.12);                               // throat
        },
        tint: (s, th) => [0, 0.4 * Math.max(0, -Math.cos(th)) ** 8, 0.2 * bell(s / L, 0.0, 0.12), 0],
        w: (s) => {
          const t = s / L, wh = smooth(0.4, 0.95, t), wc = 1 - smooth(0, 0.2, t), wn = Math.max(0, 1 - wh - wc);
          return [[hc, wc], [hn, wn], [hh, wh]].filter((x) => x[1] > 0);
        },
      }));
    }

    // ---- arms, hands and fingers
    for (const A of [j.armL, j.armR]) {
      // starts inside the shoulder, a little in toward the neck, so the top of the arm is buried in the girdle
      const sh = wp(A.sh), top = sh.clone().add(new THREE.Vector3(-A.side * 0.03, 0.05, 0)), end = wp(A.wr, 0, -0.11, 0);
      const S_SH = 0.05, S_EL = S_SH + 0.66, S_WR = S_EL + 0.66, L = top.distanceTo(end);
      const mudAt = (s, p) => smooth(S_EL - 0.04, S_EL + 0.08, s + 0.04 * lumps(p, 9));
      const outOf = (th) => Math.max(0, -A.side * Math.sin(th));   // 1 on the outside of the arm
      parts.push(tubePart(top, end, {
        front: new THREE.Vector3(0, 0, 1), step: 0.009, radial: 20, caps: [0.05, 0.03], uR: 0.03, v0: 3.1, lump: 0.0024, lumpF: 16,
        r: (s) => {
          let r = 0.025 + 0.004 * bell(s, S_SH + 0.28, 0.12) - 0.003 * smooth(S_SH + 0.45, S_SH + 0.63, s);
          r += 0.004 * bell(s, S_EL + 0.1, 0.07) - 0.008 * smooth(S_EL + 0.12, S_EL + 0.57, s);   // forearm, wasting to a thin wrist
          r += 0.003 * bell(s, S_WR, 0.02);
          const palm = smooth(S_WR + 0.01, S_WR + 0.05, s);
          return [r * (1 + 0.08 * bell(s, 0.35, 0.2)) + palm * 0.016, r * (0.9 - 0.12 * smooth(0.8, 1.1, s)) - palm * 0.004];
        },
        off: (s, th) => {
          const a = fold(th), fr = Math.cos(th), out = outOf(th);
          return 0.02 * bell(s, S_SH + 0.05, 0.06) * (0.25 + 0.75 * out ** 1.5)         // the deltoid, over the top and outside
            + 0.007 * bell(s, S_SH + 0.2, 0.028) * out ** 3                             // where it tapers into the arm, a knot
            - 0.0045 * bell(s, S_SH + 0.13, 0.045) * bell(a, 0.75, 0.22)                // the groove in front of it
            + 0.004 * bell(s, S_SH + 0.25, 0.14) * bell(a, Math.PI, 0.5)                // the back of the upper arm
            - 0.003 * bell(s, S_SH + 0.5, 0.12) * bell(a, 1.57, 0.35)                   // a groove where the muscle is gone
            + 0.008 * bell(s, S_EL - 0.01, 0.02) * Math.abs(Math.sin(th)) ** 4           // the two knobs either side of the elbow
            + 0.012 * bell(s, S_EL + 0.005, 0.025) * Math.max(0, -fr) ** 2               // the point of the elbow
            - 0.0045 * bell(s, S_EL, 0.03) * Math.max(0, fr) ** 2                        // the inside of the elbow
            + 0.0035 * bell(s, S_EL + 0.31, 0.22) * (bell(a, 1.2, 0.22) + bell(a, 2.2, 0.2));   // forearm tendons
        },
        tint: (s, th, p) => [mudAt(s, p),
          0.5 * bell(s, S_EL, 0.025) * Math.max(0, -Math.cos(th)) + 0.3 * bell(s, S_EL - 0.01, 0.02) * Math.abs(Math.sin(th)) ** 4,
          0.45 * bell(s, S_EL, 0.03) * Math.max(0, Math.cos(th)) ** 2 + 0.35 * bell(s, S_SH + 0.13, 0.045) * bell(fold(th), 0.75, 0.25)
            + 0.3 * smooth(S_SH + 0.02, S_SH - 0.03, s), 0],
        wv: chain(j.chest, [[S_SH, A.sh, 0.075],
          [(th) => S_EL - 0.014 * Math.max(0, -Math.cos(th)), A.el, (th) => 0.028 + 0.03 * Math.max(0, Math.cos(th))],
          [S_WR, A.wr, 0.025]]),
      }));
      for (const F of A.fingers) {
        const base = wp(F[0]), tip = wp(F[2], 0, -F.lens[2], 0), dir = tip.clone().sub(base).normalize();
        const a = base.clone().addScaledVector(dir, -0.016), fl = a.distanceTo(tip);
        const s1 = 0.016 + F.lens[0], s2 = s1 + F.lens[1];
        parts.push(tubePart(a, tip, {
          front: new THREE.Vector3(0, 0, 1), step: 0.005, radial: 10, caps: [0.008, 0.007], lump: 0.0006, lumpF: 60, uR: 0.01, v0: 7,
          r: (s) => { const r = 0.0085 - 0.0025 * (s / fl) + 0.0016 * bell(s, s1, 0.006) + 0.0014 * bell(s, s2, 0.005) + 0.0016 * bell(s, 0.016, 0.008); return [r, r * 0.92]; },
          tint: (s) => [1, 0, 0.25 * bell(s, s1, 0.004) + 0.2 * bell(s, s2, 0.004), 0],
          w: chain(A.wr, [[0.016, F[0], 0.007], [s1, F[1], 0.005], [s2, F[2], 0.005]]),
        }));
        parts.push(claw(F[2], F.lens[2], 0.0052, 0.024, bi(F[2])));
      }
    }

    // ---- legs, feet and toes
    for (const G of [j.legL, j.legR]) {
      const top = wp(G.hip, 0, 0.09, 0), end = wp(G.ball, 0, -0.012, 0);
      const S_KN = 0.69, S_AN = 1.35, S_BA = 1.65, L = top.distanceTo(end);
      parts.push(tubePart(top, end, {
        front: new THREE.Vector3(0, 0, 1), step: 0.01, radial: 18, caps: [0.05, 0.02], uR: 0.04, v0: 1.3, lump: 0.0026, lumpF: 14,
        r: (s) => {
          let r = 0.05 - 0.014 * smooth(0.15, 0.5, s) + 0.004 * smooth(0.5, 0.64, s);   // a wasted thigh
          r -= 0.012 * smooth(0.75, 1.3, s) + 0.002 * smooth(0.7, 0.78, s);              // shin, tapering
          r += 0.006 * bell(s, S_AN, 0.03) - 0.004 * smooth(1.4, 1.6, s);                // ankle, long foot
          return [r, r * (1 - 0.18 * smooth(1.36, 1.45, s))];
        },
        off: (s, th) => {
          const fr = Math.cos(th), a = fold(th), sd = Math.abs(Math.sin(th));
          return 0.009 * bell(s, S_KN - 0.012, 0.024) * sd ** 3                // the condyles, either side of the knee
            + 0.013 * plat(s, S_KN - 0.028, 0.034) * plat(a, 0, 0.62)           // the kneecap: a flat plate, not a ball
            + 0.0055 * plat(s, S_KN + 0.035, 0.032) * plat(a, 0, 0.26)          // the tendon below it
            - 0.0045 * bell(s, S_KN + 0.03, 0.022) * bell(a, 0.58, 0.16)        // hollows either side of the tendon
            + 0.007 * bell(s, S_KN + 0.075, 0.016) * bell(a, 0, 0.32)           // the knob at the top of the shin bone
            - 0.008 * bell(s, S_KN - 0.005, 0.032) * bell(a, Math.PI, 0.42)     // the hollow behind the knee
            + 0.006 * bell(s, S_KN - 0.06, 0.045) * bell(a, Math.PI - 0.62, 0.14)   // hamstring tendons framing it
            - 0.003 * bell(s, S_KN - 0.09, 0.03) * bell(a, 0, 0.5)              // flat just above the kneecap
            + 0.004 * bell(s, 1.0, 0.25) * Math.max(0, fr) ** 10              // shin bone
            + 0.019 * bell(s, S_AN + 0.01, 0.028) * Math.max(0, -fr) ** 3      // heel spur
            + 0.004 * bell(s, 0.4, 0.15) * bell(Math.abs(th > Math.PI ? th - 2 * Math.PI : th), 1.6, 0.3)   // thigh tendon
            + 0.006 * bell(s, 0.86, 0.09) * Math.max(0, -fr) ** 2                // a knot of muscle behind the shin
            + 0.0035 * bell(s, 1.12, 0.18) * Math.max(0, -fr) ** 6                // the long tendon down to the heel
            + 0.003 * bell(s, 1.5, 0.12) * Math.abs(Math.sin(th)) ** 4;            // knuckled bones of the foot
        },
        tint: (s, th, p) => {
          const a = fold(th);
          return [smooth(0.64, 0.76, s + 0.05 * lumps(p, 8)),
            0.55 * plat(s, S_KN - 0.028, 0.034) * plat(a, 0, 0.62) + 0.4 * bell(s, S_KN + 0.075, 0.016) * bell(a, 0, 0.32)
              + 0.2 * bell(s, S_KN - 0.012, 0.024) * Math.abs(Math.sin(th)) ** 3 + 0.4 * bell(s, S_AN, 0.03) * Math.max(0, -Math.cos(th)),
            0.5 * bell(s, S_KN - 0.005, 0.03) * bell(a, Math.PI, 0.45) + 0.3 * bell(s, S_KN + 0.03, 0.022) * bell(a, 0.58, 0.18)
              + 0.3 * smooth(0.12, 0.02, s), 0];
        },
        // at the knee the front (the kneecap) stays with the thigh and the back bends over a wider band
        wv: chain(j.hips, [[0.06, G.hip, 0.05],
          [(th) => S_KN + 0.012 * Math.max(0, Math.cos(th)), G.knee, (th) => 0.028 + 0.035 * Math.max(0, -Math.cos(th))],
          [S_AN, G.ankle, 0.03], [S_BA - 0.005, G.ball, 0.012]]),

      }));
      for (const Tq of G.toes) {
        const base = wp(Tq[0]), tip = wp(Tq[1], 0, -Tq.lens[1], 0), dir = tip.clone().sub(base).normalize();
        const a = base.clone().addScaledVector(dir, -0.014), tl = a.distanceTo(tip), s1 = 0.014 + Tq.lens[0];
        parts.push(tubePart(a, tip, {
          front: new THREE.Vector3(0, 0, 1), step: 0.005, radial: 10, caps: [0.01, 0.008], lump: 0.0008, lumpF: 50, uR: 0.012, v0: 9,
          r: (s) => { const r = 0.0115 - 0.004 * (s / tl) + 0.0018 * bell(s, s1, 0.007); return [r, r * 0.85]; },
          tint: (s) => [1, 0, 0.25 * bell(s, s1, 0.005), 0],
          w: chain(G.ball, [[0.014, Tq[0], 0.008], [s1, Tq[1], 0.006]]),
        }));
        parts.push(claw(Tq[1], Tq.lens[1], 0.0065, 0.028, bi(Tq[1])));
      }
    }

    const body = new THREE.SkinnedMesh(mergeParts(parts), this.mat.body);
    body.frustumCulled = false;   // bind-pose bounds don't cover a crouch or a reach
    root.add(body);
    root.updateMatrixWorld(true);
    body.bind(new THREE.Skeleton(bones));
    this.skin = body;

    // A claw: a curved black nail growing out past the last joint, rigid on that bone.
    function claw(bone, len, r, h, idx) {
      const g = new THREE.ConeGeometry(r, h, 8, 3);
      const pa = g.attributes.position;
      for (let i = 0; i < pa.count; i++) {   // curl it toward the palm
        const y = pa.getY(i) / h + 0.5;
        pa.setZ(i, pa.getZ(i) - 0.006 * y * y);
      }
      g.rotateX(Math.PI);
      g.translate(0, -len - h * 0.5 + 0.007, 0.001);
      g.applyMatrix4(bone.matrixWorld);
      g.computeVertexNormals();
      return rigidPart(g, idx, [0, 0, 0, 1]);
    }
  }

  // ---------- poses ----------

  resetPose() {
    const j = this.j;
    j.head.position.copy(HEAD_REST);
    j.head.rotation.set(0, 0, 0);
    this.openFace(0);
    this.pose({ phase: 0, walk: 0, chase: false, duck: 0, look: { yaw: 0, pitch: 0, roll: 0.5 }, time: 0 });
  }

  // Called a dozen times a second (stop-motion).
  pose(o) {
    const j = this.j, w = o.walk, p = o.phase, duck = o.duck || 0, ch = o.chase ? 1 : 0;
    for (const [L, off] of [[j.legL, 0], [j.legR, Math.PI]]) {
      const s = Math.sin(p + off), lift = Math.max(0, Math.cos(p + off)) * w;
      L.hip.rotation.x = -0.45 - 0.42 * s * w - duck * 0.15 - ch * 0.1;
      L.knee.rotation.x = 1.0 + 0.55 * lift + duck * 0.3 + ch * 0.15;
      L.ankle.rotation.x = -1.05 - 0.3 * lift - duck * 0.12;
      L.ball.rotation.x = -1.07 + 0.45 * lift;
      for (const [t, t2] of L.toes) { t.rotation.x = 0.1 - lift * 0.3; t2.rotation.x = 0.25 + lift * 0.2; }
    }
    j.hips.position.y = STAND - Math.abs(Math.sin(p)) * 0.05 * w - duck * 0.15 - ch * 0.06;
    j.hips.rotation.y = Math.sin(p) * 0.08 * w;
    j.spine.rotation.set(0.16 + ch * 0.15 + duck * 0.3, 0, Math.sin(p) * 0.05 * w);
    const breathe = Math.sin(o.time * (o.chase ? 5 : 1.6)) * 0.025;
    j.chest.rotation.set(0.55 + ch * 0.2 + duck * 0.28 + breathe, -Math.sin(p) * 0.1 * w, 0);
    j.neck.rotation.set(-0.35 + duck * 0.2, 0, 0);
    // the head stays level whatever the body does, and turns toward what it hears
    const bend = j.spine.rotation.x + j.chest.rotation.x + j.neck.rotation.x;
    j.head.rotation.set(-bend + o.look.pitch, o.look.yaw, o.look.roll);
    for (const [A, side, off] of [[j.armL, -1, Math.PI], [j.armR, 1, 0]]) {
      const s = Math.sin(p + off);
      A.sh.rotation.set(-(j.spine.rotation.x + j.chest.rotation.x) * 0.85 + s * 0.3 * w - ch * 1.1, 0, side * (0.08 + duck * 0.1));
      A.el.rotation.x = -0.32 - ch * 0.25;
      A.wr.rotation.x = -0.2 - ch * 0.2;
      A.fingers.forEach((f, i) => {
        const tw = Math.sin(o.time * 3.1 + i * 1.7 + side) * 0.12;
        f[0].rotation.x = 0.25 + tw - ch * 0.2;
        f[1].rotation.x = 0.35 + tw * 0.5 - ch * 0.2;
        f[2].rotation.x = 0.3 - ch * 0.15;
      });
    }
    // hunting, the seam cracks open and shivers
    this.openFace(o.chase ? 0.12 + Math.max(0, Math.sin(o.time * 7)) * 0.1 : Math.max(0, Math.sin(o.time * 0.7) - 0.97) * 2);
    this.layoutNeck();
  }

  // 0 = closed seam, ~1.2 = the head split wide open
  openFace(a) {
    const { faceL, faceR } = this.j;
    faceL.rotation.y = -a; faceR.rotation.y = a;
    faceL.updateMatrix(); faceR.updateMatrix();
    // the strings of spit, sagging between the halves
    const A = new THREE.Vector3(), B = new THREE.Vector3(), M = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    const place = (m, p, q, r) => {
      const d = q.clone().sub(p), L = d.length();
      m.position.copy(p);
      m.quaternion.setFromUnitVectors(up, d.divideScalar(L || 1));
      m.scale.set(r, L, r);
    };
    for (const s of this.strands || []) {
      A.copy(s.qL).applyMatrix4(faceL.matrix); B.copy(s.qR).applyMatrix4(faceR.matrix);
      const d = A.distanceTo(B), on = d > 0.01 && d < s.snap;
      s.m[0].visible = s.m[1].visible = on;
      if (!on) continue;
      M.copy(A).add(B).multiplyScalar(0.5);
      M.y -= Math.min(0.03, d * 0.28);
      const r = s.r / Math.sqrt(Math.max(1, d / 0.025));
      place(s.m[0], A, M, r); place(s.m[1], M, B, r);
    }
  }


  // The neck is skinned between the chest, the neck and the head bones: it follows (and stretches) by itself.
  layoutNeck() {}

  // t: seconds since it grabbed you. cam: camera world position, fwd: camera forward.
  scare(t, cam, fwd) {
    const j = this.j;
    j.hips.position.y = STAND - Math.min(0.62, t * 2);
    for (const L of [j.legL, j.legR]) {
      L.hip.rotation.x = -0.45 - Math.min(0.9, t * 3);
      L.knee.rotation.x = 1.0 + Math.min(0.9, t * 3);
    }
    j.spine.rotation.x = 0.16 + Math.min(0.7, t * 3);
    j.chest.rotation.x = 0.55 + Math.min(0.5, t * 3);
    for (const [A, side] of [[j.armL, -1], [j.armR, 1]]) {   // hands come round both sides of the lens
      A.sh.rotation.set(-Math.min(2.2, t * 6), side * -0.25, side * 0.35);
      A.el.rotation.x = -0.15;
      A.fingers.forEach((f) => { f[0].rotation.x = -0.1; f[1].rotation.x = 0.1; });
    }
    this.root.updateMatrixWorld(true);
    const goal = cam.clone().addScaledVector(fwd, 0.32);
    const k = clamp((t - 0.22) / 0.38, 0, 1);
    j.head.position.lerpVectors(HEAD_REST, j.neck.worldToLocal(goal), k * k);
    j.head.lookAt(cam);
    j.head.rotateZ(Math.min(0.9, t * 2.5));                        // the head tilts over as it comes
    this.openFace(clamp((t - 0.28) * 3.2, 0, 1) * 1.25);          // and the head opens
    this.layoutNeck();
  }

  // Down on its haunches, one arm laid flat along the floor toward `target` (world), the other braced.
  // k: 0 standing .. 1 fully down. Called a dozen times a second.
  reachPose(k, target, time) {
    const j = this.j;
    // a deep squat on the backward legs, knees splayed out to the sides like a spider's
    for (const [L, s] of [[j.legL, -1], [j.legR, 1]]) {
      L.hip.rotation.set(-0.45 - 1.3 * k, 0, s * 0.55 * k);
      L.knee.rotation.x = 1.0 + 1.65 * k;
      L.ankle.rotation.x = -1.05 + 0.45 * k;
      L.ball.rotation.x = -1.07 - 0.8 * k;
      for (const [t, t2] of L.toes) { t.rotation.x = 0.1; t2.rotation.x = 0.25; }
    }
    j.hips.position.y = STAND - 0.8 * k;
    j.hips.rotation.y = 0;
    j.spine.rotation.set(0.16 + 0.75 * k, 0, 0);
    j.chest.rotation.set(0.55 + 0.35 * k, 0, 0);
    j.neck.rotation.set(-0.35 - 0.1 * k, 0, 0);
    j.head.position.copy(HEAD_REST);
    const bend = j.spine.rotation.x + j.chest.rotation.x + j.neck.rotation.x;
    j.head.rotation.set(-bend + 0.95 * k, 0.3 * k, 1.25 * k);   // head laid over on its side, peering under
    this.openFace(0.06 * k);
    this.layoutNeck();
    this.root.updateMatrixWorld(true);
    const brace = new THREE.Vector3(-0.42, 0.03, 0.3).applyMatrix4(this.root.matrixWorld);
    this.aimArm(j.armL, brace.lerp(this._shoulderDown(j.armL), 1 - k), false, time);
    this.aimArm(j.armR, target.clone().lerp(this._shoulderDown(j.armR), 1 - k), true, time);
  }

  _shoulderDown(A) { const s = A.sh.getWorldPosition(new THREE.Vector3()); s.y -= 1.2; return s; }

  // Two-bone arm: shoulder -> elbow -> wrist reaching for `goal`.
  // flat: the elbow goes down to the floor and the forearm and hand lie flat along it, fingers scraping.
  // Otherwise the elbow bends up and out, like a brace.
  aimArm(A, goal, flat, time) {
    const S = A.sh.getWorldPosition(new THREE.Vector3());
    const a = 0.66, b = 0.66;
    const hd = new THREE.Vector3(goal.x - S.x, 0, goal.z - S.z);
    if (hd.lengthSq() < 1e-6) hd.set(0, 0, 1);
    hd.normalize();
    const W = flat ? goal.clone().addScaledVector(hd, -0.2).setY(Math.max(goal.y, 0.045)) : goal.clone().setY(goal.y + 0.06);
    let toW = W.clone().sub(S);
    let d = toW.length();
    const maxD = a + b - 0.01;
    if (d > maxD) { toW.multiplyScalar(maxD / d); d = maxD; W.copy(S).add(toW); }
    d = Math.max(d, 0.25);
    const u = toW.clone().normalize();
    const pole = new THREE.Vector3(0, flat ? -1 : 1, 0);
    let p = pole.clone().addScaledVector(u, -pole.dot(u));
    if (p.lengthSq() < 1e-6) p = hd.clone();
    p.normalize();
    const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1), sinA = Math.sqrt(1 - cosA * cosA);
    const E = S.clone().addScaledVector(u, a * cosA).addScaledVector(p, a * sinA);
    if (E.y < 0.05) E.y = 0.05;   // the elbow rests on the floor
    const down = new THREE.Vector3(0, -1, 0);
    const q1 = new THREE.Quaternion().setFromUnitVectors(down, E.clone().sub(S).normalize());
    const q2 = new THREE.Quaternion().setFromUnitVectors(down, W.clone().sub(E).normalize());
    const handDir = flat ? hd.clone().setY(-0.12).normalize() : new THREE.Vector3(hd.x * 0.5, -1, hd.z * 0.5).normalize();
    const q3 = new THREE.Quaternion().setFromUnitVectors(down, handDir);
    const parent = A.sh.parent.getWorldQuaternion(new THREE.Quaternion());
    A.sh.quaternion.copy(parent.invert().multiply(q1));
    A.el.quaternion.copy(q1.clone().invert().multiply(q2));
    A.wr.quaternion.copy(q2.clone().invert().multiply(q3));
    A.fingers.forEach((f, i) => {
      const sc = flat ? Math.sin(time * 9 + i * 1.3) * 0.35 : 0;
      f[0].rotation.x = flat ? 0.15 + sc : 0.6;
      f[1].rotation.x = flat ? 0.3 + sc * 0.6 : 0.5;
      f[2].rotation.x = flat ? 0.35 : 0.4;
    });
  }

  // World position of the reaching hand's longest fingertip.
  fingertip(out) {
    const f = this.j.armR.fingers[1][2];
    this.root.updateMatrixWorld(true);
    return out.set(0, -0.09, 0).applyMatrix4(f.matrixWorld);
  }

  // Retro-reflective eyes: bright when the headlamp points at them and they face it.

  eyeShine(lampOn, lampPos, lampDir) {
    let v = 0;
    if (lampOn && this.root.visible) {
      const e = this.eyes[0].getWorldPosition(new THREE.Vector3());
      const to = e.clone().sub(lampPos);
      const d = to.length();
      to.divideScalar(d || 1);
      const inBeam = clamp((to.dot(lampDir) - Math.cos(0.75)) / (Math.cos(0.25) - Math.cos(0.75)), 0, 1);
      const face = new THREE.Vector3(0, 0, 1).transformDirection(this.j.head.matrixWorld);
      const facing = clamp((-to.dot(face) - 0.2) / 0.6, 0, 1);
      // eye-shine is a far-off glint; up close they are just dark slits
      v = inBeam * facing * (1.5 + 5 * clamp(1 - d / 12, 0, 1)) * clamp((d - 1.6) / 1.8, 0, 1);
    }
    this.mat.shine.color.setRGB(v * 1.0, v * 0.92, v * 0.7);
  }

  scanSpheres() {
    this.root.updateMatrixWorld(true);
    const out = [], a = new THREE.Vector3(), b = new THREE.Vector3();
    const chain = (o1, o2, r, n) => {
      o1.getWorldPosition(a); o2.getWorldPosition(b);
      for (let k = 0; k < n; k++) { const v = a.clone().lerp(b, (k + 0.5) / n); out.push({ x: v.x, y: v.y, z: v.z, r }); }
    };
    const j = this.j;
    for (const L of [j.legL, j.legR]) { chain(L.hip, L.knee, 0.05, 5); chain(L.knee, L.ankle, 0.04, 5); chain(L.ankle, L.ball, 0.035, 3); }
    for (const A of [j.armL, j.armR]) { chain(A.sh, A.el, 0.04, 5); chain(A.el, A.wr, 0.032, 5); chain(A.wr, A.fingers[1][2], 0.03, 3); }
    chain(j.hips, j.chest, 0.11, 4); chain(j.chest, j.neck, 0.14, 3); chain(j.neck, j.head, 0.04, 3);
    j.head.getWorldPosition(a); out.push({ x: a.x, y: a.y, z: a.z, r: 0.12 });
    return out;
  }
}
