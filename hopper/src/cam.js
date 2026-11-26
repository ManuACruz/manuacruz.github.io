// Camera spots and framing rules. No DOM: the level checker and tools use this too.
import { R, PIN_R, ITEM_R, GOAL_W, GOAL_H, SLOT_GAP, SLOT_UP } from './sim.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// ---------- framing rules (docs/scaling-plan.md, section 3) ----------
// Sizes are screen px at the reference view (viewW x viewH), whatever the spot's zoom.
export const FRAME = {
  edge: 0.1, // Hopper and the next pin: this share of the view in from every edge
  near: 0.05, // the swing or hang he's on, where the next pin takes him, the goal he's heading for
  floor: 120, // standing: this much of the view below his feet
  // The HUD is sized in CSS px, so it covers more of the view on small screens: check it on these (landscape CSS px).
  screens: [[844, 390], [800, 400], [667, 375]],
  // HUD layout (style.css #hud-buttons, game.js hudSize/hudPos): margin, button size and gap; sticker size share and range.
  hud: { margin: 14, button: 52, buttons: 2, gap: 10, sticker: [0.08, 38, 60] },
};

// The HUD corners in reference px of the spot rect, the worst over FRAME.screens: { left, leftTop, right, rightTop }.
const hudCache = {};
export function hudZones(T, nItems) {
  const key = `${T.viewW}x${T.viewH}x${nItems}`;
  if (hudCache[key]) return hudCache[key];
  const h = FRAME.hud, z = { left: 0, leftTop: 0, right: 0, rightTop: 0 };
  for (const [sw, sh] of FRAME.screens) {
    const s = viewScale(sw, sh, T);
    const ex = (sw / s - T.viewW) / 2, ey = (sh / s - T.viewH) / 2; // seen beyond the spot rect
    const sz = clamp(sh * h.sticker[0], h.sticker[1], h.sticker[2]);
    z.left = Math.max(z.left, nItems ? (h.margin + nItems * (sz + h.gap) - h.gap) / s - ex : 0);
    z.leftTop = Math.max(z.leftTop, (h.margin + sz) / s - ey);
    z.right = Math.max(z.right, (h.margin + h.buttons * (h.button + h.gap) - h.gap) / s - ex);
    z.rightTop = Math.max(z.rightTop, (h.margin + h.button) / s - ey);
  }
  return (hudCache[key] = z);
}

export function viewScale(sw, sh, T) {
  return Math.min(sh / T.viewH, sw / T.viewW);
}

// A level that fits the screen is shown whole and never moves.
export function levelFits(L, sw, sh, T) {
  if (!L.cams.length) return true;
  const s = viewScale(sw, sh, T);
  return L.w <= sw / s + 0.5 && L.h <= sh / s + 0.5;
}

// The window a spot shows: viewW x viewH divided by its zoom, clamped inside the level.
export function spotRect(L, sp, T) {
  const z = sp.z || 1;
  const hw = T.viewW / 2 / z, hh = T.viewH / 2 / z;
  const cx = L.w <= hw * 2 ? L.w / 2 : clamp(sp.x, hw, L.w - hw);
  const cy = L.h <= hh * 2 ? L.h / 2 : clamp(sp.y, hh, L.h - hh);
  // mx, my: the "near" margin in world px, for picking a spot that frames what's needed with room to spare
  const mx = (FRAME.near * T.viewW) / z, my = (FRAME.near * T.viewH) / z;
  return { cx, cy, z, x0: cx - hw, y0: cy - hh, x1: cx + hw, y1: cy + hh, mx, my };
}

// The whole level at zoom 1, for levels that fit the screen.
export function wholeRect(L, T) {
  return spotRect(L, { x: L.w / 2, y: L.h / 2, z: 1 }, T);
}

// What must be on screen right now.
export function needBox(sim) {
  const ch = sim.ch, T = sim.T, p = ch.pin;
  if (p && (ch.state === 'travel' || ch.state === 'hang' || ch.state === 'swing')) {
    if (p.t === 'A') return { x0: p.x - PIN_R, x1: p.x + PIN_R, y0: p.y - PIN_R, y1: p.y + T.hangLen + R };
    const sw = ch.sw || ch.fl?.swing;
    if (sw) {
      const ex = sw.L * Math.sin(sw.a);
      return { x0: p.x - ex - R, x1: p.x + ex + R, y0: p.y - PIN_R, y1: p.y + sw.L + R };
    }
  }
  return { x0: ch.x - R, x1: ch.x + R, y0: ch.y - R, y1: ch.y + R };
}

const stickOut = (r, b, m = 0, n = 0) =>
  Math.max(0, r.x0 + m - b.x0) + Math.max(0, b.x1 - r.x1 + m) + Math.max(0, r.y0 + n - b.y0) + Math.max(0, b.y1 - r.y1 + n);

// The last spot that frames the box with the near margin to spare; else the last that contains it;
// else the one it sticks out of least.
export function pickSpot(rects, box) {
  for (let i = rects.length - 1; i >= 0; i--) if (stickOut(rects[i], box, rects[i].mx || 0, rects[i].my || 0) === 0) return i;
  let best = 0, bestOut = Infinity;
  for (let i = rects.length - 1; i >= 0; i--) {
    const o = stickOut(rects[i], box);
    if (o === 0) return i;
    if (o < bestOut) { bestOut = o; best = i; }
  }
  return best;
}

export class CamSpots {
  constructor(L, T) {
    this.L = L;
    this.rects = L.cams.map((c) => spotRect(L, c, T));
    this.spot = -1;
  }

  // Which spot the camera should rest on for this sim state.
  update(sim) {
    const ch = sim.ch;
    return this.pick(ch.state, ch.x, ch.y, needBox(sim));
  }

  // The same from plain values (tools replay recorded states through this).
  pick(state, x, y, box) {
    if (!this.rects.length) return -1;
    if ((state === 'air' || state === 'dead') && this.spot >= 0) {
      const r = this.rects[this.spot];
      if (state === 'dead' || (x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1)) return this.spot;
    }
    this.spot = pickSpot(this.rects, box);
    return this.spot;
  }

  // The spot showing a world point (e.g. the goal for the opening).
  spotFor(x, y) {
    return pickSpot(this.rects, { x0: x - R, x1: x + R, y0: y - 120, y1: y + R });
  }
}

// ---------- framing checks ----------
const box = (x, y, r) => ({ x0: x - r, x1: x + r, y0: y - r, y1: y + r });

// What the player needs to see before a step (a pin id or a swipe), read from the sim just before it.
export function frameNeeds(sim, st) {
  const ch = sim.ch, T = sim.T;
  const n = { st, state: ch.state, char: box(ch.x, ch.y, R), arc: null, pin: null, dest: null, goal: null, foot: null };
  if (ch.state === 'stand' || ch.state === 'walk') n.foot = ch.y + R;
  if (ch.pin && (ch.state === 'hang' || ch.state === 'swing')) n.arc = needBox(sim);
  if (typeof st === 'string') {
    const p = sim.pin(st);
    n.pin = { id: p.id, x: p.cx, y: p.cy };
    if (p.t === 'A') n.dest = box(p.x, p.y + T.hangLen, R);
    else if (p.t === 'B') {
      const len = clamp(Math.hypot(ch.x - p.x, ch.y - p.y), T.swingMinLen, p.len ?? T.swingLen);
      n.dest = box(p.x, p.y + len, R);
    }
    // heading for the goal: the goal and the sticker slots above it
    const g = sim.L.goals[sim.goal];
    if (g && p.t === 'C' && Math.abs(p.x - g.x) < 1 && Math.abs(p.y - g.y) < 1) {
      const hw = Math.max(GOAL_W / 2, ((g.items.length - 1) / 2) * SLOT_GAP + ITEM_R);
      n.goal = { x0: g.x - hw, x1: g.x + hw, y0: g.y - GOAL_H - SLOT_UP - ITEM_R, y1: g.y };
    }
  }
  return n;
}

// Rule breaks for those needs in a spot rect: [{ what, short }], `short` = screen px missing.
// `pad` asks for that many screen px more than the rules (tools use it to leave room for rounding and timing).
export function frameProblems(n, r, T, nItems, pad = 0) {
  const z = r.z || 1, W = T.viewW, H = T.viewH, out = [];
  const sx = (x) => (x - r.x0) * z, sy = (y) => (y - r.y0) * z;
  const inside = (what, b, share) => {
    const mx = share * W + pad, my = share * H + pad;
    const short = Math.max(mx - sx(b.x0), sx(b.x1) - (W - mx), my - sy(b.y0), sy(b.y1) - (H - my));
    if (short > 0.5) out.push({ what, short });
  };
  const hud = hudZones(T, nItems);
  const clearOfHud = (what, b) => {
    const x0 = sx(b.x0), x1 = sx(b.x1), y0 = sy(b.y0);
    const short = Math.max(
      x0 < hud.left + pad ? hud.leftTop + pad - y0 : 0,
      x1 > W - hud.right - pad ? hud.rightTop + pad - y0 : 0);
    if (short > 0.5) out.push({ what: `${what} under the HUD`, short });
  };
  inside('Hopper', n.char, FRAME.edge);
  if (n.arc) inside(n.state === 'hang' ? 'hang' : 'swing', n.arc, FRAME.near);
  if (n.pin) {
    const pb = box(n.pin.x, n.pin.y, PIN_R);
    inside(`pin ${n.pin.id}`, pb, FRAME.edge);
    clearOfHud(`pin ${n.pin.id}`, pb);
  }
  if (n.dest) inside(`where ${n.pin.id} takes him`, n.dest, FRAME.near);
  if (n.goal) {
    inside('goal', n.goal, FRAME.near);
    clearOfHud('goal', n.goal);
  }
  if (n.foot != null) {
    const shown = H - sy(n.foot);
    if (shown < FRAME.floor + pad - 0.5) out.push({ what: 'floor below him', short: FRAME.floor + pad - shown });
  }
  return out;
}
