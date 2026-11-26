// Hopper rules. No DOM and no drawing: tools/check.mjs runs this same module in Node.
// The game reads `sim.events` every frame to drive sounds, particles and tweens.

export const R = 27; // character collision radius
export const PIN_R = 30;
export const ITEM_R = 22;
export const STEP = 1 / 120;
export const GOAL_W = 76;
export const GOAL_H = 94;
export const SLOT_GAP = 74;
export const SLOT_UP = 52;

const DEG = Math.PI / 180;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function scaleLevel(raw) {
  const u = raw.unit || 1;
  const L = {
    raw,
    name: raw.name,
    id: raw.id,
    world: raw.world,
    title: raw.title,
    stickers: raw.stickers,
    unit: u,
    w: raw.size[0] * u,
    h: raw.size[1] * u,
    start: { x: raw.start[0] * u, y: raw.start[1] * u },
    blocks: raw.blocks.map(([x, y, w, h], i) => ({ i, x: x * u, y: y * u, w: w * u, h: h * u })),
    pins: raw.pins.map((p, i) => ({ i, id: p.id, t: p.t, x: p.x * u, y: p.y * u, len: p.len ? p.len * u : null, angle: p.angle ?? null })),
    items: raw.items.map((it, i) => ({ i, id: it.id, kind: it.kind, x: it.x * u, y: it.y * u })),
    goals: raw.goals.map((g, i) => ({ i, x: g.at[0] * u, y: g.at[1] * u, items: g.items })),
    cams: (raw.cams || []).map(([x, y, z]) => ({ x: x * u, y: y * u, z: z || 1 })),
    solution: raw.solution || [],
  };
  // A pin C sits on its block: its tap centre is one radius above the block top.
  for (const p of L.pins) {
    p.cx = p.x;
    p.cy = p.t === 'C' ? p.y - PIN_R : p.y;
  }
  return L;
}

// Circle vs rectangle contact: outward normal and depth, or null.
function contact(cx, cy, r, b) {
  const nx = clamp(cx, b.x, b.x + b.w);
  const ny = clamp(cy, b.y, b.y + b.h);
  const dx = cx - nx, dy = cy - ny;
  const d2 = dx * dx + dy * dy;
  if (d2 >= r * r) return null;
  if (d2 > 1e-9) {
    const d = Math.sqrt(d2);
    return { nx: dx / d, ny: dy / d, depth: r - d };
  }
  const l = cx - b.x, rr = b.x + b.w - cx, t = cy - b.y, bt = b.y + b.h - cy;
  const m = Math.min(l, rr, t, bt);
  if (m === t) return { nx: 0, ny: -1, depth: t + r };
  if (m === l) return { nx: -1, ny: 0, depth: l + r };
  if (m === rr) return { nx: 1, ny: 0, depth: rr + r };
  return { nx: 0, ny: 1, depth: bt + r };
}

export function hitsBlock(blocks, x, y, r) {
  for (const b of blocks) {
    const nx = clamp(x, b.x, b.x + b.w), ny = clamp(y, b.y, b.y + b.h);
    const dx = x - nx, dy = y - ny;
    if (dx * dx + dy * dy < r * r) return b;
  }
  return null;
}

export function swingShape(u, hold) {
  return Math.sin((Math.PI / 2) * (u + (hold * Math.sin(Math.PI * u)) / Math.PI));
}

// Where the item slots float above a goal.
export function goalSlots(g) {
  const n = g.items.length;
  return g.items.map((id, i) => ({ id, x: g.x + (i - (n - 1) / 2) * SLOT_GAP, y: g.y - GOAL_H - SLOT_UP }));
}

export class Sim {
  constructor(level, T) {
    this.L = level;
    this.T = T;
    this.events = [];
    this.checkpoint = null;
    this.restart(null);
  }

  restart(cp = this.checkpoint) {
    const L = this.L;
    const c = cp || { x: L.start.x, y: L.start.y - R, items: [], goal: 0 };
    this.ch = { x: c.x, y: c.y, vx: 0, vy: 0, state: 'stand', face: 1, pin: null, dest: null, wall: false, carry: null, carryDir: 0, fl: null, sw: null };
    this.got = new Set(c.items);
    this.goal = c.goal;
    this.finished = false;
    this.t = 0;
    this.events.push({ type: 'restart' });
  }

  emit(type, data) {
    this.events.push({ type, ...data });
  }

  pin(id) {
    return this.L.pins.find((p) => p.id === id);
  }

  get ended() {
    const s = this.ch.state;
    return s === 'won' || s === 'lost' || s === 'dead';
  }

  support() {
    const ch = this.ch;
    for (const b of this.L.blocks) if (ch.x >= b.x && ch.x <= b.x + b.w && Math.abs(b.y - (ch.y + R)) < 0.5) return b;
    return null;
  }

  // ---------- input ----------

  tapPin(id) {
    const p = typeof id === 'string' ? this.pin(id) : id;
    const ch = this.ch, T = this.T;
    if (!p || this.ended) return false;
    const s = ch.state;
    if (p.t === 'A') {
      if ((s === 'hang' || s === 'travel') && ch.pin === p) return this.no(p);
      this.flight(p, p.x, p.y + T.hangLen, T.dashSpeed, null);
    } else if (p.t === 'B') {
      if ((s === 'swing' || s === 'travel') && ch.pin === p) return this.no(p);
      const L = clamp(Math.hypot(ch.x - p.x, ch.y - p.y), T.swingMinLen, p.len ?? T.swingLen);
      const a = (p.angle ?? T.swingAngle) * DEG;
      const side = ch.x <= p.x ? -1 : 1;
      this.flight(p, p.x + Math.sin(side * a) * L, p.y + Math.cos(a) * L, T.hopSpeed, { pin: p, L, a, side });
    } else {
      const here = Math.abs(ch.x - p.x) <= 4 && this.support()?.y === p.y;
      if (s === 'stand' && here) return this.no(p);
      if ((s === 'walk' || s === 'air') && ch.dest === p) {
        // already heading there: acknowledge, change nothing (keeps a jump's carry intact)
        this.emit('tap', { pin: p });
        return true;
      }
      ch.dest = p;
      ch.wall = false;
      if (s === 'stand' || s === 'walk') {
        ch.state = 'walk';
        this.emit('walk', { pin: p });
      } else if (s === 'air') {
        ch.carry = null;
        this.emit('walk', { pin: p });
      } else {
        const from = ch.pin;
        ch.state = 'air';
        ch.vx = ch.vy = 0;
        ch.pin = null;
        ch.fl = ch.sw = null;
        this.emit('drop', { pin: p, from });
      }
    }
    this.emit('tap', { pin: p });
    return true;
  }

  no(p) {
    this.emit('no', { pin: p });
    return false;
  }

  flight(pin, tx, ty, speed, swing) {
    const ch = this.ch, T = this.T;
    const x0 = ch.x, y0 = ch.y, dx = tx - x0, dy = ty - y0;
    const d = Math.hypot(dx, dy);
    let end = 1;
    const n = Math.max(1, Math.ceil(d / 6));
    for (let i = 1; i <= n; i++) {
      const s = i / n;
      if (hitsBlock(this.L.blocks, x0 + dx * s, y0 + dy * s, R * 0.8)) {
        end = (i - 1) / n;
        break;
      }
    }
    const from = ch.pin;
    ch.fl = { pin, x0, y0, x1: tx, y1: ty, t: 0, dur: Math.max(T.moveMin, d / speed), end, swing };
    ch.state = 'travel';
    ch.pin = pin;
    ch.sw = null;
    ch.dest = null;
    ch.wall = false;
    ch.carry = null;
    ch.vx = ch.vy = 0;
    if (Math.abs(dx) > 1) ch.face = Math.sign(dx);
    this.emit('flight', { pin, from, end, dur: ch.fl.dur });
  }

  swipe(lean = 0) {
    const ch = this.ch, T = this.T, s = ch.state;
    if (s !== 'stand' && s !== 'walk' && s !== 'hang' && s !== 'swing') return false;
    const from = ch.pin;
    let vx, vy;
    if (ch.dest && (s === 'stand' || s === 'walk')) {
      const dir = Math.sign(ch.dest.x - ch.x) || ch.face;
      vx = dir * T.jumpRun;
      vy = -T.jump;
      ch.carry = ch.dest;
      ch.carryDir = dir;
    } else {
      const a = clamp(lean * T.tiltK, -T.jumpTilt, T.jumpTilt) * DEG;
      vx = T.jump * Math.sin(a);
      vy = -T.jump * Math.cos(a);
      if (s === 'swing') {
        const v = this.swingVel();
        vx += T.swingCarry * v.x;
        if (v.y < 0) vy += T.swingCarry * v.y;
      }
      ch.carry = null;
    }
    ch.vx = vx;
    ch.vy = vy;
    if (Math.abs(vx) > 1) ch.face = Math.sign(vx);
    ch.state = 'air';
    ch.pin = null;
    ch.sw = ch.fl = null;
    ch.wall = false;
    this.emit('jump', { from, vx, vy, ground: s === 'stand' || s === 'walk' });
    return true;
  }

  // ---------- rules ----------

  step(dt) {
    const ch = this.ch;
    this.t += dt;
    switch (ch.state) {
      case 'travel': this.stepTravel(dt); break;
      case 'swing': this.stepSwing(dt); break;
      case 'walk': this.stepWalk(dt); break;
      case 'stand': this.stepStand(); break;
      case 'air': this.stepAir(dt); break;
    }
    if (this.ended) return;
    this.checkItems();
    if (ch.state === 'stand' || ch.state === 'walk') this.checkGoal();
  }

  stepTravel(dt) {
    const ch = this.ch, fl = ch.fl, T = this.T;
    fl.t += dt;
    const f = Math.min(1, fl.t / fl.dur);
    const g = f + (f * f * (3 - 2 * f) - f) * T.moveSoft;
    const s = Math.min(g, fl.end);
    ch.x = fl.x0 + (fl.x1 - fl.x0) * s;
    ch.y = fl.y0 + (fl.y1 - fl.y0) * s;
    if (g < fl.end) return;
    const pin = fl.pin;
    if (fl.end < 1) {
      ch.state = 'air';
      ch.vx = ch.vy = 0;
      ch.pin = null;
      ch.fl = null;
      this.emit('bump', { pin, x: ch.x, y: ch.y, dx: fl.x1 - fl.x0, dy: fl.y1 - fl.y0 });
      return;
    }
    if (pin.t === 'A') {
      ch.state = 'hang';
    } else {
      const w = fl.swing;
      ch.sw = { pin, L: w.L, a: w.a, u: w.side, dir: -w.side, start: w.side, lastEnd: w.side, ends: 0 };
      ch.state = 'swing';
    }
    ch.fl = null;
    this.emit('arrive', { pin });
  }

  swingPos(sw, u) {
    const th = sw.a * swingShape(u, this.T.swingHold);
    return { x: sw.pin.x + Math.sin(th) * sw.L, y: sw.pin.y + Math.cos(th) * sw.L, th };
  }

  swingVel() {
    const sw = this.ch.sw, T = this.T, h = T.swingHold, u = sw.u;
    const w = u + (h * Math.sin(Math.PI * u)) / Math.PI;
    const dshape = Math.cos((Math.PI / 2) * w) * (Math.PI / 2) * (1 + h * Math.cos(Math.PI * u));
    const th = sw.a * Math.sin((Math.PI / 2) * w);
    const dth = sw.a * dshape * (4 / T.swingPeriod) * sw.dir;
    return { x: Math.cos(th) * sw.L * dth, y: -Math.sin(th) * sw.L * dth };
  }

  stepSwing(dt) {
    const ch = this.ch, sw = ch.sw;
    let u = sw.u + sw.dir * (4 / this.T.swingPeriod) * dt;
    let dir = sw.dir, end = 0;
    if (u >= 1) { u = 1; dir = -1; end = 1; }
    else if (u <= -1) { u = -1; dir = 1; end = -1; }
    const p = this.swingPos(sw, u);
    if (hitsBlock(this.L.blocks, p.x, p.y, R * 0.8)) {
      sw.dir = -sw.dir;
      this.emit('swingBlock', { pin: sw.pin });
      return;
    }
    sw.u = u;
    sw.dir = dir;
    ch.x = p.x;
    ch.y = p.y;
    if (end) {
      sw.lastEnd = end;
      sw.ends++;
      this.emit('swingEnd', { pin: sw.pin, end });
    }
  }

  stepStand() {
    if (!this.support()) {
      const ch = this.ch;
      ch.state = 'air';
      ch.vx = ch.vy = 0;
    }
  }

  stepWalk(dt) {
    const ch = this.ch, p = ch.dest, T = this.T;
    if (Math.abs(p.x - ch.x) <= 4) {
      ch.state = 'stand';
      ch.dest = null;
      ch.wall = false;
      this.emit('reach', { pin: p });
      return;
    }
    const dir = Math.sign(p.x - ch.x);
    ch.face = dir;
    let nx = ch.x + dir * T.walkSpeed * dt;
    if ((p.x - nx) * dir < 0) nx = p.x;
    if (hitsBlock(this.L.blocks, nx, ch.y - 4, R * 0.8)) {
      ch.state = 'stand';
      ch.wall = true;
      this.emit('wall', { pin: p, dir });
      return;
    }
    ch.x = nx;
    if (!this.support()) {
      ch.state = 'air';
      ch.vx = dir * T.walkSpeed;
      ch.vy = 0;
      this.emit('edge', { dir });
    }
  }

  stepAir(dt) {
    const ch = this.ch, T = this.T, L = this.L;
    if (ch.carry) {
      const d = ch.carry.x - ch.x;
      if (Math.sign(d) !== ch.carryDir) {
        ch.carry = null;
        ch.vx = 0;
      } else ch.vx = ch.carryDir * T.jumpRun;
    }
    ch.vy += T.gravity * dt;
    ch.x += ch.vx * dt;
    ch.y += ch.vy * dt;
    for (const b of L.blocks) {
      const c = contact(ch.x, ch.y, R, b);
      if (!c) continue;
      ch.x += c.nx * c.depth;
      ch.y += c.ny * c.depth;
      const vn = ch.vx * c.nx + ch.vy * c.ny;
      if (c.ny < -0.7 && ch.vy >= 0 && ch.x >= b.x - 0.5 && ch.x <= b.x + b.w + 0.5) {
        const speed = ch.vy;
        ch.y = b.y - R;
        ch.vx = ch.vy = 0;
        ch.carry = null;
        ch.state = ch.dest ? 'walk' : 'stand';
        this.emit('land', { speed, block: b });
        return;
      }
      if (vn < 0) {
        ch.vx -= vn * c.nx;
        ch.vy -= vn * c.ny;
        if (vn < -250) this.emit('hit', { speed: -vn, nx: c.nx, ny: c.ny, x: ch.x - c.nx * R, y: ch.y - c.ny * R });
      }
    }
    if (ch.y > L.h + 160) {
      ch.state = 'dead';
      this.emit('dead', {});
    }
  }

  checkItems() {
    const ch = this.ch, reach = R + ITEM_R + this.T.grab;
    for (const it of this.L.items) {
      if (this.got.has(it.id)) continue;
      const dx = it.x - ch.x, dy = it.y - ch.y;
      if (dx * dx + dy * dy <= reach * reach) {
        this.got.add(it.id);
        this.emit('item', { item: it });
      }
    }
  }

  checkGoal() {
    const ch = this.ch;
    for (const g of this.L.goals) {
      if (g.i < this.goal) continue;
      if (Math.abs(ch.y + R - g.y) > 6 || Math.abs(ch.x - g.x) > 50) continue;
      const missing = g.items.filter((id) => !this.got.has(id));
      if (g.i === this.goal && missing.length === 0) {
        ch.state = 'won';
        ch.dest = null;
        this.emit('won', { goal: g });
      } else {
        ch.state = 'lost';
        ch.dest = null;
        this.emit('lost', { goal: g, missing, early: g.i !== this.goal });
      }
      return;
    }
  }

  // After a won goal: next goal, new checkpoint. Returns true when the level is finished.
  completeGoal() {
    const g = this.L.goals[this.goal];
    const ch = this.ch;
    ch.x = g.x - SLOT_GAP;
    ch.y = g.y - R;
    ch.vx = ch.vy = 0;
    ch.state = 'stand';
    ch.dest = ch.pin = ch.fl = ch.sw = ch.carry = null;
    ch.wall = false;
    ch.face = 1;
    this.goal++;
    if (this.goal >= this.L.goals.length) {
      this.finished = true;
      return true;
    }
    this.checkpoint = { x: ch.x, y: ch.y, items: [...this.got], goal: this.goal };
    return false;
  }

  // What help needs to know about where the player has got to.
  situation() {
    const ch = this.ch;
    const b = ch.state === 'stand' || ch.state === 'walk' ? this.support() : null;
    return { state: ch.state, pin: ch.pin ? ch.pin.id : null, block: b ? b.i : -1, items: this.got.size, goal: this.goal, wall: !!ch.wall };
  }
}

export function sameSituation(a, b) {
  return a.state === b.state && a.pin === b.pin && a.block === b.block && a.items === b.items && a.goal === b.goal && a.wall === b.wall;
}

// Let the current move finish: a flight, fall or walk ends in stand or hang; a swing is left running.
export function settle(sim, maxT = 30) {
  for (let t = 0; t < maxT; t += STEP) {
    const s = sim.ch.state;
    if (s === 'stand' || s === 'hang' || s === 'swing' || s === 'won' || s === 'lost' || s === 'dead') return;
    sim.step(STEP);
  }
}

// Run a swing until it reaches its far end (the end away from where it was joined).
export function waitFar(sim, maxT = 30) {
  const sw = sim.ch.sw;
  if (!sim.ch.sw) return;
  const far = -sw.start, ends = sw.ends;
  for (let t = 0; t < maxT; t += STEP) {
    if (sim.ch.state !== 'swing' || sim.ch.sw !== sw) return;
    if (sw.ends > ends && sw.lastEnd === far) return;
    sim.step(STEP);
  }
}

// Play a level's solution on a fresh sim. `onStep(sim, step, situation, afterWait)` runs before each tap or swipe;
// `onTick(sim)`, if given, after every sim step.
export function playSolution(level, T, onStep, onTick) {
  const sim = new Sim(level, T);
  if (onTick) {
    const step = sim.step.bind(sim);
    sim.step = (dt) => {
      step(dt);
      onTick(sim);
    };
  }
  const rec = [];
  let afterWait = false;
  let error = null;
  for (const st of level.solution) {
    settle(sim);
    if (sim.ch.state === 'won') sim.completeGoal();
    if (sim.ch.state === 'lost' || sim.ch.state === 'dead') {
      error = `${sim.ch.state} before step ${rec.length + 1} (${st})`;
      break;
    }
    if (st === 'wait') {
      waitFar(sim);
      afterWait = true;
      continue;
    }
    const sit = sim.situation();
    if (onStep) onStep(sim, st, sit, afterWait);
    rec.push({ sit, step: st, afterWait });
    const ok = typeof st === 'number' ? sim.swipe(st) : sim.tapPin(st);
    if (!ok) error = error || `step ${rec.length} (${st}) refused in state ${sit.state}`;
    afterWait = false;
  }
  if (!error) {
    settle(sim);
    if (sim.ch.state === 'won') sim.completeGoal();
  }
  sim.events.length = 0;
  return { sim, rec, ok: !error && sim.finished, error };
}
