// The house as rules: walls, doors, collision, sight lines, the entity's walking grid and the dirt.
// No three.js and no DOM, so tools/check.mjs can run it in Node.

import { HOUSE, ROOMS, WALLS, DOORS, FTYPES, FURNITURE, FOOTPRINT_PATH, DOCK, NOOKS, GRIME, BLOCKS } from './level.js';
import { T } from './tune.js';

export const CELL = 1 / 16;                       // dirt cell
export const GW = Math.round(HOUSE.w / CELL);
export const GH = Math.round(HOUSE.d / CELL);
export const NAV = 0.2;                           // entity walking cell
export const NW = Math.round(HOUSE.w / NAV);
export const NH = Math.round(HOUSE.d / NAV);

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function distSqToRect(x, z, r) {
  const dx = x < r.x0 ? r.x0 - x : x > r.x1 ? x - r.x1 : 0;
  const dz = z < r.z0 ? r.z0 - z : z > r.z1 ? z - r.z1 : 0;
  return dx * dx + dz * dz;
}

export function segHitsRect(ax, az, bx, bz, r) {
  let t0 = 0, t1 = 1;
  const dx = bx - ax, dz = bz - az;
  if (Math.abs(dx) < 1e-9) { if (ax < r.x0 || ax > r.x1) return false; }
  else {
    let ta = (r.x0 - ax) / dx, tb = (r.x1 - ax) / dx;
    if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
    if (t0 > t1) return false;
  }
  if (Math.abs(dz) < 1e-9) { if (az < r.z0 || az > r.z1) return false; }
  else {
    let ta = (r.z0 - az) / dz, tb = (r.z1 - az) / dz;
    if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
    if (t0 > t1) return false;
  }
  return true;
}

// Where along a->b (0..1) the segment is inside the rect, or null.
export function segRectT(ax, az, bx, bz, r) {
  let t0 = 0, t1 = 1;
  const dx = bx - ax, dz = bz - az;
  for (const [p, d, lo, hi] of [[ax, dx, r.x0, r.x1], [az, dz, r.z0, r.z1]]) {
    if (Math.abs(d) < 1e-9) { if (p < lo || p > hi) return null; continue; }
    let ta = (lo - p) / d, tb = (hi - p) / d;
    if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
    if (t0 > t1) return null;
  }
  return [t0, t1];
}

// How loud driving and bumping are on each floor. The hall runner is quiet; tile and bare boards are not.
const FLOOR_NOISE = { wood: 1, woodDark: 1.15, checker: 1.3, smallTile: 1.3, concrete: 1.3, carpet: 0.6, carpetBlue: 0.6 };
const FLOOR_NAME = { wood: 'WOOD', woodDark: 'BOARDS', checker: 'TILE', smallTile: 'TILE', concrete: 'CONCRETE', carpet: 'CARPET', carpetBlue: 'CARPET' };

// Small deterministic noise for the dirt.
function hash2(x, y, seed) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, seed), b = hash2(xi + 1, yi, seed), c = hash2(xi, yi + 1, seed), d = hash2(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, y, seed) {
  return 0.55 * vnoise(x, y, seed) + 0.3 * vnoise(x * 2.1, y * 2.1, seed + 1) + 0.15 * vnoise(x * 4.3, y * 4.3, seed + 2);
}
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

export class World {
  constructor() {
    this.pieces = [];     // wall boxes: {x0,x1,y0,y1,z0,z1,kind,along,at}
    this.lintels = [];    // the tops of doorways and arches: too low for the thing to walk under upright
    this.windows = [];
    this.doors = {};
    this.solids = [];     // static rects that stop the robot
    this.navBlocks = [];  // static rects the entity walks around
    this.losBlocks = [];  // static rects that block sight
    this.covers = [];
    this.furniture = [];
    this.lowBlocks = [];  // furniture short enough to see over from 2.4 m, tall enough to hide a robot behind it
    this.rugs = [];
    this.links = [];      // openings the thing can walk through: which two rooms, and the door if any
    this.holes = [];      // openings torn in a wall (Night 2): ragged edges, no frame
    this.flaps = [];      // pet flaps: low openings a robot fits through and it doesn't
    this.blocks = { ...BLOCKS };   // solids the story can take away (the plywood over the dog door)
    this.rooms = ROOMS;
    this.buildWalls();
    this.buildFurniture();
    this.refreshDoors();
    this.buildDirt();
  }

  // ---------- construction ----------

  buildWalls() {
    const t = HOUSE.wallT, H = HOUSE.wallH;
    for (const w of WALLS) {
      let from = w.from, to = w.to;
      if (w.along === 'x') { from -= t / 2; to += t / 2; }
      // Full-height walls are cut where rooms meet, so each side of each piece faces one room (its wallpaper).
      const cuts = [...new Set(ROOMS.flatMap((r) => (w.along === 'x' ? [r.x0, r.x1] : [r.z0, r.z1])))].sort((p, q) => p - q);
      const piece = (a, b, y0, y1, kind) => {
        if (kind === 'solid') {
          const inner = cuts.filter((c) => c > a + 0.02 && c < b - 0.02);
          if (inner.length) { let s = a; for (const c of [...inner, b]) { piece1(s, c, y0, y1, kind); s = c; } return; }
        }
        piece1(a, b, y0, y1, kind);
      };
      const piece1 = (a, b, y0, y1, kind) => {
        if (b - a < 1e-4) return;
        const p = w.along === 'x'
          ? { x0: a, x1: b, z0: w.at - t / 2, z1: w.at + t / 2 }
          : { x0: w.at - t / 2, x1: w.at + t / 2, z0: a, z1: b };
        Object.assign(p, { y0, y1, kind, along: w.along, at: w.at });
        this.pieces.push(p);
        if (y0 < T.bodyHeight) this.solids.push(p);
        if (y0 < 1) this.navBlocks.push(p);
        if (kind === 'solid' || kind === 'flap') this.losBlocks.push(p);
      };
      const ops = [...w.openings].sort((a, b) => a.from - b.from);
      let cur = from;
      for (const o of ops) {
        piece(cur, o.from, 0, H, 'solid');
        if (o.kind === 'window') {
          piece(o.from, o.to, 0, o.sill, 'sill');
          piece(o.from, o.to, o.top, H, 'lintel');
          this.windows.push({ along: w.along, at: w.at, from: o.from, to: o.to, sill: o.sill, top: o.top, moon: !!o.moon });
        } else if (o.kind === 'flap') {
          piece(o.from, o.to, o.top, H, 'flap');   // too low for it: blocks its walking grid and its sight
          this.flaps.push({ along: w.along, at: w.at, from: o.from, to: o.to, top: o.top, outside: !!o.outside });
          this.flap ||= this.flaps[0];
        } else {
          const top = o.top ?? HOUSE.doorTop;
          piece(o.from, o.to, top, H, 'lintel');
          this.lintels.push(this.pieces[this.pieces.length - 1]);
          if (o.kind === 'door') this.addDoor(o.door, w, o, top);
          if (o.kind === 'hole') this.holes.push({ along: w.along, at: w.at, from: o.from, to: o.to, top });
          const c = (o.from + o.to) / 2, n = 0.3;
          const [ax, az, bx, bz] = w.along === 'x' ? [c, w.at - n, c, w.at + n] : [w.at - n, c, w.at + n, c];
          this.links.push({ a: this.roomAt(ax, az), b: this.roomAt(bx, bz), door: o.door || null, x: w.along === 'x' ? c : w.at, z: w.along === 'x' ? w.at : c });
        }
        cur = o.to;
      }
      piece(cur, to, 0, H, 'solid');
    }
  }

  addDoor(id, w, o, top) {
    const def = DOORS[id];
    const L = o.to - o.from, th = 0.03, slab = 0.05;
    const h = def.hinge === 'from' ? o.from : o.to;
    const s = def.swing;
    let closedRect, openRect;
    if (w.along === 'x') {
      closedRect = { x0: o.from, x1: o.to, z0: w.at - th, z1: w.at + th };
      openRect = {
        x0: def.hinge === 'from' ? h : h - slab, x1: def.hinge === 'from' ? h + slab : h,
        z0: s > 0 ? w.at : w.at - L, z1: s > 0 ? w.at + L : w.at,
      };
    } else {
      closedRect = { x0: w.at - th, x1: w.at + th, z0: o.from, z1: o.to };
      openRect = {
        z0: def.hinge === 'from' ? h : h - slab, z1: def.hinge === 'from' ? h + slab : h,
        x0: s > 0 ? w.at : w.at - L, x1: s > 0 ? w.at + L : w.at,
      };
    }
    this.doors[id] = { id, along: w.along, at: w.at, from: o.from, to: o.to, top, hinge: def.hinge, swing: s,
      state: def.state, initial: def.state, closedRect, openRect };
  }

  buildFurniture() {
    for (const f of FURNITURE) {
      const info = FTYPES[f.type];
      const r = { x0: f.x0, z0: f.z0, x1: f.x1, z1: f.z1 };
      this.furniture.push({ def: f, info, rect: r });
      if (f.type === 'rug') this.rugs.push(r);
      if (info.flat) continue;
      let h = info.h;
      if (f.type === 'boxes') { h = 0; for (let k = 0; k < (f.stack || 1); k++) h += 0.42 * (1 - k * 0.08); }
      if (!info.los) this.lowBlocks.push({ ...r, h, clear: info.legs ? info.clear : 0 });
      this.navBlocks.push(r);
      if (info.los) this.losBlocks.push(r);
      if (info.solid) this.solids.push(r);
      if (info.legs) {
        const [s, i] = info.leg || [0.05, 0.03];
        for (const [lx, lz] of [[r.x0 + i, r.z0 + i], [r.x1 - i - s, r.z0 + i], [r.x0 + i, r.z1 - i - s], [r.x1 - i - s, r.z1 - i - s]])
          this.solids.push({ x0: lx, z0: lz, x1: lx + s, z1: lz + s, leg: true });
        if (info.clear < T.bodyHeight) this.solids.push(r);
      }
      if (info.cover) this.covers.push({ ...r, type: f.type, i: this.covers.length });
    }
  }

  // ---------- doors ----------

  doorRect(d, state = d.state) { return state === 'open' ? d.openRect : d.closedRect; }

  setDoor(id, state) {
    this.doors[id].state = state;
    this.refreshDoors();
  }

  // A story-controlled solid: a rect, or null to take it away.
  setBlock(id, rect) {
    if (rect) this.blocks[id] = rect; else delete this.blocks[id];
    this.refreshDoors();
  }

  refreshDoors() {
    this.doorBlocks = [...Object.values(this.doors).map((d) => this.doorRect(d)), ...Object.values(this.blocks)];
    this.buildNav();
  }

  // ---------- queries ----------

  roomAt(x, z) {
    for (let i = 0; i < ROOMS.length; i++) {
      const r = ROOMS[i];
      if (x >= r.x0 && x < r.x1 && z >= r.z0 && z < r.z1) return i;
    }
    return -1;
  }
  roomIndex(id) { return ROOMS.findIndex((r) => r.id === id); }

  // How deep a ball of radius r at (x, y, z) sits inside a wall or a door (0 when clear).
  wallPen(x, y, z, r) {
    let worst = 0;
    const test = (b, y0, y1) => {
      if (y < y0 - r || y > y1 + r) return;
      const dx = Math.max(b.x0 - x, 0, x - b.x1), dz = Math.max(b.z0 - z, 0, z - b.z1);
      if (dx > 0 || dz > 0) { const d = Math.hypot(dx, dz); if (d < r) worst = Math.max(worst, r - d); return; }
      worst = Math.max(worst, r + Math.min(x - b.x0, b.x1 - x, z - b.z0, b.z1 - z));
    };
    for (const p of this.pieces) test(p, p.y0, p.y1);
    for (const d of this.doorBlocks || []) test(d, 0, HOUSE.doorTop);
    return worst;
  }

  // Push a circle out of everything solid. Returns the corrected spot and the push direction.
  collide(x, z, r) {
    let hit = false, nx = 0, nz = 0;
    const lists = [this.solids, this.doorBlocks];
    for (let iter = 0; iter < 4; iter++) {
      let moved = false;
      for (const list of lists) for (const b of list) {
        if (x + r < b.x0 || x - r > b.x1 || z + r < b.z0 || z - r > b.z1) continue;
        const cx = clamp(x, b.x0, b.x1), cz = clamp(z, b.z0, b.z1);
        const dx = x - cx, dz = z - cz, d2 = dx * dx + dz * dz;
        if (d2 >= r * r) continue;
        if (d2 > 1e-12) {
          const d = Math.sqrt(d2), push = r - d + 1e-5;
          x += (dx / d) * push; z += (dz / d) * push;
          nx += dx / d; nz += dz / d;
        } else {
          const l = x - b.x0, rr = b.x1 - x, tt = z - b.z0, bb = b.z1 - z, m = Math.min(l, rr, tt, bb);
          if (m === l) { x = b.x0 - r; nx -= 1; } else if (m === rr) { x = b.x1 + r; nx += 1; }
          else if (m === tt) { z = b.z0 - r; nz -= 1; } else { z = b.z1 + r; nz += 1; }
        }
        hit = true; moved = true;
      }
      if (!moved) break;
    }
    const n = Math.hypot(nx, nz) || 1;
    return { x, z, hit, nx: nx / n, nz: nz / n };
  }

  los(ax, az, bx, bz) {
    for (const r of this.losBlocks) if (segHitsRect(ax, az, bx, bz, r)) return false;
    for (const d of Object.values(this.doors)) if (d.state !== 'open' && segHitsRect(ax, az, bx, bz, d.closedRect)) return false;
    return true;
  }

  coverAt(x, z) {
    const m = T.radius * 0.5;
    for (const c of this.covers) if (x > c.x0 + m && x < c.x1 - m && z > c.z0 + m && z < c.z1 - m) return c;
    return null;
  }

  nookAt(x, z) {
    for (const n of NOOKS) if (x > n.x0 && x < n.x1 && z > n.z0 && z < n.z1) return n;
    return null;
  }

  // Sight from its eye (eyeH up) to something low (lowH up): does short furniture get in the way?
  // A robot tucked right behind a stack of boxes is hidden from across the room, but not from close by.
  losLow(ax, az, bx, bz, eyeH = 2.35, lowH = 0.06) {
    for (const r of this.lowBlocks) {
      const t = segRectT(ax, az, bx, bz, r);
      if (!t) continue;
      const hn = lowH + (eyeH - lowH) * (1 - t[1]), hf = lowH + (eyeH - lowH) * (1 - t[0]);
      if (hn < r.h && hf > r.clear) return false;
    }
    return true;
  }

  floorAt(x, z) {
    for (const r of this.rugs) if (x > r.x0 && x < r.x1 && z > r.z0 && z < r.z1) return { name: 'RUG', noise: 0.5 };
    const ri = this.roomAt(x, z);
    const f = ri >= 0 ? ROOMS[ri].floor : 'wood';
    return { name: FLOOR_NAME[f], noise: FLOOR_NOISE[f] };
  }

  // ---------- entity walking grid ----------

  buildNav() {
    const blocked = new Uint8Array(NW * NH);
    const R = T.entRadius;
    const mark = (r) => {
      const i0 = Math.max(0, Math.floor((r.x0 - R) / NAV)), i1 = Math.min(NW - 1, Math.floor((r.x1 + R) / NAV));
      const j0 = Math.max(0, Math.floor((r.z0 - R) / NAV)), j1 = Math.min(NH - 1, Math.floor((r.z1 + R) / NAV));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++)
        if (distSqToRect((i + 0.5) * NAV, (j + 0.5) * NAV, r) < R * R) blocked[j * NW + i] = 1;
    };
    for (const r of this.navBlocks) mark(r);
    for (const r of this.doorBlocks) mark(r);
    this.navBlocked = blocked;
  }

  navCell(x, z) {
    const i = Math.floor(x / NAV), j = Math.floor(z / NAV);
    if (i < 0 || j < 0 || i >= NW || j >= NH) return -1;
    return j * NW + i;
  }
  navFree(x, z) { const c = this.navCell(x, z); return c >= 0 && !this.navBlocked[c]; }
  cellPos(c) { return [((c % NW) + 0.5) * NAV, (Math.floor(c / NW) + 0.5) * NAV]; }

  nearestFree(c, maxR = 10) {
    if (c < 0) return -1;
    if (!this.navBlocked[c]) return c;
    const ci = c % NW, cj = Math.floor(c / NW);
    let best = -1, bestD = Infinity;
    for (let r = 1; r <= maxR && best < 0; r++)
      for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
        if (i < 0 || j < 0 || i >= NW || j >= NH) continue;
        if (Math.max(Math.abs(i - ci), Math.abs(j - cj)) !== r) continue;
        const k = j * NW + i;
        if (this.navBlocked[k]) continue;
        const d = (i - ci) ** 2 + (j - cj) ** 2;
        if (d < bestD) { bestD = d; best = k; }
      }
    return best;
  }

  underLintel(x, z, m = 0.5) {
    for (const p of this.lintels) if (x > p.x0 - m && x < p.x1 + m && z > p.z0 - m && z < p.z1 + m) return true;
    return false;
  }

  // Could the entity get its centre within `d` of this spot? (Under a desk or behind a door it can't.)
  entityCanReach(x, z, d) {
    if (this.navFree(x, z)) return true;
    const i0 = Math.max(0, Math.floor((x - d) / NAV)), i1 = Math.min(NW - 1, Math.floor((x + d) / NAV));
    const j0 = Math.max(0, Math.floor((z - d) / NAV)), j1 = Math.min(NH - 1, Math.floor((z + d) / NAV));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      if (this.navBlocked[j * NW + i]) continue;
      const cx = (i + 0.5) * NAV - x, cz = (j + 0.5) * NAV - z;
      if (cx * cx + cz * cz < d * d) return true;
    }
    return false;
  }

  // Straight walkable line on the grid (the grid already includes the entity's girth).
  navLine(ax, az, bx, bz) {
    const d = Math.hypot(bx - ax, bz - az), n = Math.ceil(d / (NAV * 0.4));
    for (let k = 0; k <= n; k++) {
      const t = n ? k / n : 0;
      if (!this.navFree(ax + (bx - ax) * t, az + (bz - az) * t)) return false;
    }
    return true;
  }

  findPath(ax, az, bx, bz) {
    const s = this.nearestFree(this.navCell(ax, az)), g = this.nearestFree(this.navCell(bx, bz));
    if (s < 0 || g < 0) return null;
    const N = NW * NH;
    const gs = new Float32Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
    const heap = [], hf = [];
    const push = (c, f) => {
      heap.push(c); hf.push(f);
      let i = heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (hf[p] <= hf[i]) break;
        [heap[p], heap[i]] = [heap[i], heap[p]]; [hf[p], hf[i]] = [hf[i], hf[p]]; i = p;
      }
    };
    const pop = () => {
      const top = heap[0], lc = heap.pop(), lf = hf.pop();
      if (heap.length) {
        heap[0] = lc; hf[0] = lf;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1, r = l + 1;
          let m = i;
          if (l < heap.length && hf[l] < hf[m]) m = l;
          if (r < heap.length && hf[r] < hf[m]) m = r;
          if (m === i) break;
          [heap[m], heap[i]] = [heap[i], heap[m]]; [hf[m], hf[i]] = [hf[i], hf[m]]; i = m;
        }
      }
      return top;
    };
    const gi = g % NW, gj = Math.floor(g / NW);
    const h = (c) => { const dx = Math.abs((c % NW) - gi), dz = Math.abs(Math.floor(c / NW) - gj); return Math.max(dx, dz) + 0.414 * Math.min(dx, dz); };
    gs[s] = 0; push(s, h(s));
    const B = this.navBlocked;
    while (heap.length) {
      const c = pop();
      if (c === g) break;
      if (closed[c]) continue;
      closed[c] = 1;
      const ci = c % NW, cj = Math.floor(c / NW);
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const i = ci + di, j = cj + dj;
        if (i < 0 || j < 0 || i >= NW || j >= NH) continue;
        const k = j * NW + i;
        if (B[k] || closed[k]) continue;
        if (di && dj && (B[cj * NW + i] || B[j * NW + ci])) continue;
        const ng = gs[c] + (di && dj ? 1.414 : 1);
        if (ng < gs[k]) { gs[k] = ng; from[k] = c; push(k, ng + h(k)); }
      }
    }
    if (s !== g && from[g] < 0) return null;
    const cells = [];
    for (let c = g; c >= 0; c = from[c]) { cells.push(c); if (c === s) break; }
    cells.reverse();
    const pts = cells.map((c) => this.cellPos(c));
    if (this.navFree(bx, bz)) pts[pts.length - 1] = [bx, bz];
    // String-pull: skip corners we can see past.
    const out = [[ax, az]];
    let k = 0;
    while (k < pts.length - 1) {
      let far = k + 1;
      for (let m = pts.length - 1; m > k + 1; m--) {
        const [px, pz] = out[out.length - 1];
        if (this.navLine(px, pz, pts[m][0], pts[m][1])) { far = m; break; }
      }
      out.push(pts[far]);
      k = far;
    }
    out.shift();
    return out;
  }

  randomFreeNear(x, z, rMin, rMax, avoid = null, avoidR = 0) {
    for (let t = 0; t < 40; t++) {
      const a = Math.random() * Math.PI * 2, d = rMin + Math.random() * (rMax - rMin);
      const px = x + Math.cos(a) * d, pz = z + Math.sin(a) * d;
      if (!this.navFree(px, pz) || this.roomAt(px, pz) === this.roomIndex('laundry')) continue;
      if (avoid && Math.hypot(px - avoid[0], pz - avoid[1]) < avoidR) continue;
      return [px, pz];
    }
    return null;
  }

  randomFreeIn(roomIdx, rnd = Math.random) {
    const r = ROOMS[roomIdx];
    for (let t = 0; t < 40; t++) {
      const x = r.x0 + 0.4 + rnd() * (r.x1 - r.x0 - 0.8), z = r.z0 + 0.4 + rnd() * (r.z1 - r.z0 - 0.8);
      if (this.navFree(x, z)) return [x, z];
    }
    return null;
  }

  // ---------- dirt ----------

  // Mark every dirt cell whose centre lies within `rad` of any rect.
  rasterize(rects, rad, mask) {
    for (const r of rects) {
      const i0 = Math.max(0, Math.floor((r.x0 - rad) / CELL)), i1 = Math.min(GW - 1, Math.floor((r.x1 + rad) / CELL));
      const j0 = Math.max(0, Math.floor((r.z0 - rad) / CELL)), j1 = Math.min(GH - 1, Math.floor((r.z1 + rad) / CELL));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++)
        if (distSqToRect((i + 0.5) * CELL, (j + 0.5) * CELL, r) < rad * rad) mask[j * GW + i] = 1;
    }
  }

  buildDirt() {
    const N = GW * GH;
    // Where the robot's centre could ever be: every door that can open is treated as open.
    const potentialDoors = Object.values(this.doors).map((d) => this.doorRect(d, d.initial === 'locked' ? 'locked' : 'open'));
    const blocked = new Uint8Array(N);
    this.rasterize([...this.solids, ...potentialDoors], T.radius, blocked);
    const reach = new Uint8Array(N);
    const start = Math.floor(DOCK.z / CELL) * GW + Math.floor(DOCK.x / CELL);
    const stack = [start];
    reach[start] = 1;
    while (stack.length) {
      const c = stack.pop(), i = c % GW, j = (c / GW) | 0;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const a = i + di, b = j + dj;
        if (a < 0 || b < 0 || a >= GW || b >= GH) continue;
        const k = b * GW + a;
        if (!reach[k] && !blocked[k]) { reach[k] = 1; stack.push(k); }
      }
    }
    this.reach = reach;

    // Cells the brush can sweep.
    const cleanable = new Uint8Array(N);
    const rr = Math.ceil((T.cleanRadius * 0.9) / CELL), r2 = (T.cleanRadius * 0.9 / CELL) ** 2;
    const disc = [];
    for (let dj = -rr; dj <= rr; dj++) for (let di = -rr; di <= rr; di++) if (di * di + dj * dj <= r2) disc.push([di, dj]);
    for (let c = 0; c < N; c++) {
      if (!reach[c]) continue;
      const i = c % GW, j = (c / GW) | 0;
      for (const [di, dj] of disc) {
        const a = i + di, b = j + dj;
        if (a >= 0 && b >= 0 && a < GW && b < GH) cleanable[b * GW + a] = 1;
      }
    }
    const near = new Uint8Array(N);
    this.rasterize([...this.solids, ...potentialDoors], 0.42, near);

    this.room = new Int8Array(N);
    this.dirt = new Float32Array(N);
    this.dirt0 = new Float32Array(N);
    this.swept = new Uint8Array(N);
    this.roomTotal = new Float64Array(ROOMS.length);
    this.roomDirt = new Float64Array(ROOMS.length);
    for (let c = 0; c < N; c++) {
      const i = c % GW, j = (c / GW) | 0, x = (i + 0.5) * CELL, z = (j + 0.5) * CELL;
      const ri = this.roomAt(x, z);
      this.room[c] = ri;
      if (ri < 0 || !cleanable[c]) continue;
      const base = ROOMS[ri].dirt;
      if (!base) continue;
      let v = base * (0.3 + 0.95 * fbm(x * 1.4, z * 1.4, 7));
      if (near[c]) v += 0.28;
      if (this.coverAt(x, z)) v += 0.35;
      v = smooth(0.3, 0.8, v) * (0.65 + 0.35 * fbm(x * 9, z * 9, 3));
      v = this.grime(x, z, v);
      if (v < 0.06) v = 0;
      this.dirt[c] = v;
      this.dirt0[c] = v;
      this.roomTotal[ri] += v;
    }
    this.roomDirt.set(this.roomTotal);
    this.dirtBox = null;
    this.cleanDisc = disc;
    this.cleanable = cleanable;
  }

  // Tonight's extra dirt on top of the noise: where furniture stood or was dragged, plaster dust by a hole.
  grime(x, z, v) {
    for (const g of GRIME) {
      let inside;
      if (g.rect) inside = x > g.rect.x0 && x < g.rect.x1 && z > g.rect.z0 && z < g.rect.z1;
      else {
        const [[ax, az], [bx, bz]] = g.seg, dx = bx - ax, dz = bz - az;
        const t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
        inside = Math.hypot(x - ax - dx * t, z - az - dz * t) < g.w / 2;
      }
      if (inside) v = g.add < 0 ? v * (1 + g.add) : Math.min(1, v + g.add);
    }
    return v;
  }

  // Its muddy feet: dirt laid back down on floor the brush can reach. An ellipse along the walking direction.
  stampMud(x, z, dx, dz, amount = 0.45) {
    const a = 0.13, b = 0.055, R = a + 0.02;
    const i0 = Math.max(0, Math.floor((x - R) / CELL)), i1 = Math.min(GW - 1, Math.floor((x + R) / CELL));
    const j0 = Math.max(0, Math.floor((z - R) / CELL)), j1 = Math.min(GH - 1, Math.floor((z + R) / CELL));
    let added = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const c = j * GW + i;
      if (!this.cleanable[c] || this.room[c] < 0 || !ROOMS[this.room[c]].dirt) continue;
      const px = (i + 0.5) * CELL - x, pz = (j + 0.5) * CELL - z;
      const u = px * dx + pz * dz, v = -px * dz + pz * dx;
      if ((u * u) / (a * a) + (v * v) / (b * b) > 1) continue;
      const nv = Math.min(1, this.dirt[c] + amount);
      added += nv - this.dirt[c];
      this.roomDirt[this.room[c]] += nv - this.dirt[c];
      this.dirt[c] = nv;
    }
    if (added > 0) {
      const bx = this.dirtBox;
      if (!bx) this.dirtBox = { i0, i1, j0, j1 };
      else { bx.i0 = Math.min(bx.i0, i0); bx.i1 = Math.max(bx.i1, i1); bx.j0 = Math.min(bx.j0, j0); bx.j1 = Math.max(bx.j1, j1); }
    }
    return added;
  }


  // Sweep a disc. Returns how much dirt came up.
  clean(x, z, rad, amount) {
    const i0 = Math.max(0, Math.floor((x - rad) / CELL)), i1 = Math.min(GW - 1, Math.floor((x + rad) / CELL));
    const j0 = Math.max(0, Math.floor((z - rad) / CELL)), j1 = Math.min(GH - 1, Math.floor((z + rad) / CELL));
    let removed = 0;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const cx = (i + 0.5) * CELL - x, cz = (j + 0.5) * CELL - z;
      if (cx * cx + cz * cz > rad * rad) continue;
      const c = j * GW + i;
      this.swept[c] = 1;
      const v = this.dirt[c];
      if (v <= 0) continue;
      const nv = Math.max(0, v - amount);
      this.dirt[c] = nv;
      removed += v - nv;
      if (this.room[c] >= 0) this.roomDirt[this.room[c]] -= v - nv;
    }
    if (removed > 0) {
      const b = this.dirtBox;
      if (!b) this.dirtBox = { i0, i1, j0, j1 };
      else { b.i0 = Math.min(b.i0, i0); b.i1 = Math.max(b.i1, i1); b.j0 = Math.min(b.j0, j0); b.j1 = Math.max(b.j1, j1); }
    }
    return removed;
  }

  roomProgress(idx) {
    const t = this.roomTotal[idx];
    return t > 0 ? clamp(1 - this.roomDirt[idx] / t, 0, 1) : 1;
  }

  snapshot() {
    return {
      dirt: this.dirt.slice(), swept: this.swept.slice(), roomDirt: this.roomDirt.slice(),
      doors: Object.fromEntries(Object.values(this.doors).map((d) => [d.id, d.state])),
      blocks: { ...this.blocks },
    };
  }
  restore(s) {
    this.dirt.set(s.dirt); this.swept.set(s.swept); this.roomDirt.set(s.roomDirt);
    for (const [id, st] of Object.entries(s.doors)) this.doors[id].state = st;
    if (s.blocks) this.blocks = { ...s.blocks };
    this.refreshDoors();
    this.dirtBox = { i0: 0, i1: GW - 1, j0: 0, j1: GH - 1 };
  }
}

// Footprints along a polyline: alternating feet, toes pointing along the path.
export function footprintSteps(path = FOOTPRINT_PATH, stride = 0.68, side = 0.11) {
  const segs = [];
  let total = 0;
  for (let k = 0; k < path.length - 1; k++) {
    const [ax, az] = path[k], [bx, bz] = path[k + 1], L = Math.hypot(bx - ax, bz - az);
    segs.push({ ax, az, dx: (bx - ax) / L, dz: (bz - az) / L, L, s0: total });
    total += L;
  }
  const steps = [];
  let left = true;
  for (let s = 0.2; s < total - 0.05; s += stride) {
    const g = segs.find((q) => s >= q.s0 && s <= q.s0 + q.L) || segs[segs.length - 1];
    const u = s - g.s0, px = g.ax + g.dx * u, pz = g.az + g.dz * u;
    // Seen from above (x east, z south) the walker's left is (dz, -dx).
    const off = left ? side : -side;
    steps.push({ x: px + g.dz * off, z: pz - g.dx * off, dx: g.dx, dz: g.dz, left, s });
    left = !left;
  }
  return steps;
}
