// Geometry for the softer props: rounded boxes, dust sheets thrown over furniture, cloth heaps, turned shapes.
// Everything is indexed with position, normal and uv, so build.js can merge it with the rest of the house.

import * as THREE from 'three';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

function hash3(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
export function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const L = (a, b, t) => a + (b - a) * t;
  const c = (i, j, k) => hash3(xi + i, yi + j, zi + k);
  return L(L(L(c(0, 0, 0), c(1, 0, 0), u), L(c(0, 1, 0), c(1, 1, 0), u), v),
    L(L(c(0, 0, 1), c(1, 0, 1), u), L(c(0, 1, 1), c(1, 1, 1), u), v), w) * 2 - 1;
}

// A box with rounded edges. UVs in metres / s, like build.js's boxGeo.
export function roundBox(w, h, d, r, s = 0.5, seg = 3) {
  r = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
  // seg rows round each edge and one row spans the flat middle: the cost doesn't grow with size
  const N = seg * 2 + 1;
  const g = new THREE.BoxGeometry(w, h, d, N, N, N);
  const p = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
  const remap = (x, L) => {
    const k = Math.round((x / L + 0.5) * N), half = L / 2;
    if (k <= seg) return -half + r * (k / seg);
    if (k >= N - seg) return half - r * ((N - k) / seg);
    return x;
  };
  for (let i = 0; i < p.count; i++) p.setXYZ(i, remap(p.getX(i), w), remap(p.getY(i), h), remap(p.getZ(i), d));
  const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
  const per = p.count / 6;
  const v = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // uvs from the flat position, per face (+x, -x, +y, -y, +z, -z), in metres
    const f = Math.floor(i / per);
    const [u, t] = f === 0 ? [d / 2 - v.z, v.y + h / 2] : f === 1 ? [v.z + d / 2, v.y + h / 2] : f === 2 ? [v.x + w / 2, d / 2 - v.z]
      : f === 3 ? [v.x + w / 2, v.z + d / 2] : f === 4 ? [v.x + w / 2, v.y + h / 2] : [w / 2 - v.x, v.y + h / 2];
    uv.setXY(i, u / s, t / s);
    c.set(clamp(v.x, -hx, hx), clamp(v.y, -hy, hy), clamp(v.z, -hz, hz));
    const dir = v.clone().sub(c);
    if (dir.lengthSq() < 1e-12) dir.fromBufferAttribute(nor, i);
    dir.normalize();
    p.setXYZ(i, c.x + dir.x * r, c.y + dir.y * r, c.z + dir.z * r);
    nor.setXYZ(i, dir.x, dir.y, dir.z);
  }
  return g;
}

// A dust sheet thrown over a piece of furniture.
// boxes: what is underneath, in local coordinates [{x0, x1, z0, z1, h}] inside a w x d footprint.
// The cloth lies over the tops (edges rolled soft), hangs down past the footprint in folds, and stops at `hem`;
// extra cloth below that flares out and bunches. Corners droop into points.
// ext: how far the cloth runs past each side [-x, +x, -z, +z] (default: hang everywhere; 0 = it ends at that edge).
export function drapeGeo(w, d, boxes, { hang = 0.6, hem = 0.02, res = 0.04, seed = 1, soft = 0.06, fold = 0.03, uvs = 0.7, ext = null } = {}) {
  // heightfield of the tops: max of the boxes, grown then blurred so the cloth never dips into them
  const R = 0.02, NX = Math.ceil(w / R) + 1, NZ = Math.ceil(d / R) + 1;
  let hf = new Float32Array(NX * NZ);
  for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
    const x = -w / 2 + (i / (NX - 1)) * w, z = -d / 2 + (j / (NZ - 1)) * d;
    let h = 0;
    for (const b of boxes) if (x >= b.x0 - 1e-3 && x <= b.x1 + 1e-3 && z >= b.z0 - 1e-3 && z <= b.z1 + 1e-3) h = Math.max(h, b.h);
    hf[j * NX + i] = h;
  }
  const rad = Math.max(1, Math.round(soft / R));
  const pass = (src, op) => {
    const a = new Float32Array(src.length), b = new Float32Array(src.length);
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      let m = op === 'max' ? -1e9 : 0, n = 0;
      for (let k = -rad; k <= rad; k++) { const ii = clamp(i + k, 0, NX - 1); const v = src[j * NX + ii]; if (op === 'max') m = Math.max(m, v); else { m += v; n++; } }
      a[j * NX + i] = op === 'max' ? m : m / n;
    }
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      let m = op === 'max' ? -1e9 : 0, n = 0;
      for (let k = -rad; k <= rad; k++) { const jj = clamp(j + k, 0, NZ - 1); const v = a[jj * NX + i]; if (op === 'max') m = Math.max(m, v); else { m += v; n++; } }
      b[j * NX + i] = op === 'max' ? m : m / n;
    }
    return b;
  };
  hf = pass(pass(hf, 'max'), 'mean');
  const H = (x, z) => {
    const fi = clamp(((x + w / 2) / w) * (NX - 1), 0, NX - 1), fj = clamp(((z + d / 2) / d) * (NZ - 1), 0, NZ - 1);
    const i0 = Math.floor(fi), j0 = Math.floor(fj), i1 = Math.min(NX - 1, i0 + 1), j1 = Math.min(NZ - 1, j0 + 1), u = fi - i0, v = fj - j0;
    return (hf[j0 * NX + i0] * (1 - u) + hf[j0 * NX + i1] * u) * (1 - v) + (hf[j1 * NX + i0] * (1 - u) + hf[j1 * NX + i1] * u) * v;
  };

  const E = ext || [hang, hang, hang, hang];
  const W = w + E[0] + E[1], D = d + E[2] + E[3];
  const nx = Math.ceil(W / res), nz = Math.ceil(D / res);
  const pos = new Float32Array((nx + 1) * (nz + 1) * 3), uv = new Float32Array((nx + 1) * (nz + 1) * 2);
  const s = seed * 13.7;
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
    const u = -w / 2 - E[0] + (i / nx) * W, v = -d / 2 - E[2] + (j / nz) * D;
    const cx = clamp(u, -w / 2, w / 2), cz = clamp(v, -d / 2, d / 2);
    const ox = u - cx, oz = v - cz, out = Math.hypot(ox, oz);
    const top = H(cx, cz) + 0.012;
    let x, y, z;
    // wrinkles on the top
    const wr = noise3(cx * 7 + s, cz * 7, 1.3) * 0.006 + noise3(cx * 19, cz * 19 + s, 4.1) * 0.0025;
    if (out < 1e-5) { x = cx; y = top + wr; z = cz; }
    else {
      const dx = ox / out, dz = oz / out;
      // where along the edge we are, for the folds
      const along = Math.abs(dx) > Math.abs(dz) ? cz : cx;
      const corner = Math.min(1, Math.min(Math.abs(Math.abs(cx) - w / 2), Math.abs(Math.abs(cz) - d / 2)) < 1e-4 && Math.abs(dx) > 0.05 && Math.abs(dz) > 0.05 ? 1 : 0);
      const dropK = smooth(0.0, 0.25, out);
      const folds = (Math.sin(along * 21 + s + noise3(along * 3, out * 2, s) * 2.5) * 0.6 + noise3(along * 9 + s, out * 3, 2.2) * 0.6) * fold * dropK;
      const roll = 0.014 + 0.012 * (1 - Math.exp(-out * 12));   // the edge rolls over, then the cloth stands off a little
      let yy = top - out;
      let flare = 0;
      if (yy < hem) { flare = Math.min(0.025, (hem - yy) * 0.12); yy = hem + Math.sin(along * 13 + s) * 0.005 * smooth(0, 0.1, hem - yy); }   // spare cloth gathers into a lip
      const push = roll + Math.max(0, folds) + flare + corner * 0.01;
      x = cx + dx * push; z = cz + dz * push;
      // folds also wave sideways a little
      const sx = -dz, sz = dx;
      x += sx * Math.min(0, folds) * 0.6; z += sz * Math.min(0, folds) * 0.6;
      y = yy;
    }
    const k = j * (nx + 1) + i;
    pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z;
    uv[k * 2] = u / uvs; uv[k * 2 + 1] = v / uvs;
  }
  const idx = [];
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, e = c + 1;
    idx.push(a, c, b, b, c, e);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// A soft lump: a pile of clothes, a cushion. Icosphere pushed about by noise and flattened underneath.
export function lump(sx, sy, sz, seed = 1, rough = 0.25, detail = 3) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position, s = seed * 7.31;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = noise3(v.x * 1.6 + s, v.y * 1.6, v.z * 1.6) * rough + noise3(v.x * 4 + s, v.y * 4, v.z * 4) * rough * 0.35;
    const crease = Math.abs(Math.sin(v.x * 5 + v.z * 3 + s)) * rough * 0.25;
    v.multiplyScalar(1 + n - crease);
    v.set(v.x * sx, v.y * sy, v.z * sz);
    if (v.y < 0) v.y *= 0.25;   // sits on its flat underside
    p.setXYZ(i, v.x, v.y, v.z);
  }
  const ng = mergeVertices(g);
  ng.computeVertexNormals();
  // planar uvs from above, metres
  const q = ng.attributes.position, uv = new Float32Array(q.count * 2);
  for (let i = 0; i < q.count; i++) { uv[i * 2] = (q.getX(i) + q.getY(i) * 0.5) / 0.4; uv[i * 2 + 1] = (q.getZ(i) + q.getY(i) * 0.5) / 0.4; }
  ng.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return ng;
}

// Weld duplicate vertices (IcosahedronGeometry is not indexed) so normals come out smooth.
export function mergeVertices(g) {
  const p = g.attributes.position, map = new Map(), pos = [], idx = [];
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const key = `${Math.round(x * 1e4)},${Math.round(y * 1e4)},${Math.round(z * 1e4)}`;
    let k = map.get(key);
    if (k === undefined) { k = pos.length / 3; map.set(key, k); pos.push(x, y, z); }
    idx.push(k);
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setIndex(idx);
  return out;
}

// A turned shape from [radius, y] pairs. scaleX/scaleZ make it oval.
export function lathe(pts, seg = 24, sx = 1, sz = 1) {
  const g = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  if (sx !== 1 || sz !== 1) { g.scale(sx, 1, sz); g.computeVertexNormals(); }
  return g;
}

// A bent strip (a dead leaf, a strap): `pts` is the spine, width tapers from w0 to w1. Double-sided material wanted.
export function strip(pts, w0, w1, seg = 10) {
  const curve = new THREE.CatmullRomCurve3(pts);
  const pos = [], uv = [], idx = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let k = 0; k <= seg; k++) {
    const t = k / seg, p = curve.getPoint(t), tan = curve.getTangent(t);
    let side = new THREE.Vector3().crossVectors(tan, up);
    if (side.lengthSq() < 1e-6) side.set(1, 0, 0);
    side.normalize();
    const w = (w0 + (w1 - w0) * t) * Math.sin(Math.min(1, t * 4 + 0.15) * Math.PI * 0.5);
    pos.push(p.x - side.x * w, p.y - side.y * w, p.z - side.z * w, p.x + side.x * w, p.y + side.y * w, p.z + side.z * w);
    uv.push(0, t, 1, t);
    if (k < seg) { const a = k * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// A tube along points (a tap, a hose, a sleeve).
export function pipe(pts, r, seg = 16, radial = 8) {
  const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, r, radial, false);
  return g;
}

// A stadium (rounded-rectangle) outline in the x/y plane, for extrusions.
export function stadium(w, d, r, shape = new THREE.Shape()) {
  r = Math.min(r, w / 2, d / 2);
  const x = -w / 2, y = -d / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y); shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + w, y + d - r); shape.absarc(x + w - r, y + d - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + d); shape.absarc(x + r, y + d - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r); shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

// Extrude a shape straight up by h (the shape's x/y become x/z). Returned indexed, with uvs in metres.
export function extrudeUp(shape, h, bevel = 0.01, curveSeg = 16) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: h - bevel * 2, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: curveSeg });
  g.rotateX(-Math.PI / 2);
  g.translate(0, bevel, 0);
  const ng = mergeVerticesKeep(g);
  return ng;
}

// Index a non-indexed geometry, keeping its normals and uvs (no welding across hard edges).
function mergeVerticesKeep(g) {
  const n = g.attributes.position.count, idx = new Array(n);
  for (let i = 0; i < n; i++) idx[i] = i;
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', g.attributes.position);
  out.setAttribute('normal', g.attributes.normal);
  const uv = g.attributes.uv;
  if (uv) {   // ExtrudeGeometry's uvs are in shape units already (metres): fine
    out.setAttribute('uv', uv);
  }
  out.setIndex(idx);
  return out;
}
