// Camera spots. No DOM: the level checker uses this too.
import { R, PIN_R } from './sim.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function viewScale(sw, sh, T) {
  return Math.min(sh / T.viewH, sw / T.viewW);
}

// A level that fits the screen is shown whole and never moves.
export function levelFits(L, sw, sh, T) {
  if (!L.cams.length) return true;
  const s = viewScale(sw, sh, T);
  return L.w <= sw / s + 0.5 && L.h <= sh / s + 0.5;
}

// The viewW x viewH window a spot stands for, clamped inside the level.
export function spotRect(L, sp, T) {
  const hw = T.viewW / 2, hh = T.viewH / 2;
  const cx = L.w <= T.viewW ? L.w / 2 : clamp(sp.x, hw, L.w - hw);
  const cy = L.h <= T.viewH ? L.h / 2 : clamp(sp.y, hh, L.h - hh);
  return { cx, cy, x0: cx - hw, y0: cy - hh, x1: cx + hw, y1: cy + hh };
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

const stickOut = (r, b) => Math.max(0, r.x0 - b.x0) + Math.max(0, b.x1 - r.x1) + Math.max(0, r.y0 - b.y0) + Math.max(0, b.y1 - r.y1);

// The last spot that contains the box; otherwise the one it sticks out of least.
export function pickSpot(rects, box) {
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
    if (!this.rects.length) return -1;
    const ch = sim.ch;
    if ((ch.state === 'air' || ch.state === 'dead') && this.spot >= 0) {
      const r = this.rects[this.spot];
      if (ch.state === 'dead' || (ch.x >= r.x0 && ch.x <= r.x1 && ch.y >= r.y0 && ch.y <= r.y1)) return this.spot;
      this.spot = pickSpot(this.rects, needBox(sim));
      return this.spot;
    }
    this.spot = pickSpot(this.rects, needBox(sim));
    return this.spot;
  }

  // The spot showing a world point (e.g. the goal for the opening).
  spotFor(x, y) {
    return pickSpot(this.rects, { x0: x - R, x1: x + R, y0: y - 120, y1: y + R });
  }
}
