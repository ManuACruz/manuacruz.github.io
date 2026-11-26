// Draft a level's camera spots from its solution: node tools/autocam.mjs --level 3 [--iters 30000] [--seed 1] [--pad 10]
// Groups the solution steps into as few spots as the framing rules allow (src/cam.js FRAME), then nudges the spots
// against the real camera picker until no step breaks a rule. Prints a `cams:` line in the level's drawing units.
// A draft: paste it into levels.js, then check it with tools/framing.mjs and by playing.
import { scaleLevel, playSolution, PIN_R } from '../src/sim.js';
import { CamSpots, needBox, frameNeeds, frameProblems, FRAME } from '../src/cam.js';
import { LEVELS } from '../src/levels.js';
import { DEFAULTS } from '../src/tune.js';
import { frameLevel, printFrame } from './framing.mjs';

const args = process.argv.slice(2);
const arg = (k, d) => (args.includes('--' + k) ? Number(args[args.indexOf('--' + k) + 1]) : d);
const LEVEL = arg('level', 0);
const ITERS = arg('iters', 30000);
let seed = arg('seed', 1);
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const T = { ...DEFAULTS };
const ZOOMS = [1, 0.95, 0.9, 0.85];
const ZMIN = 0.85;
const PAD = arg('pad', 10); // screen px to spare beyond the rules, for players who don't time things like the solution

function record(L) {
  const ticks = [], steps = [];
  const snap = (sim) => ({ state: sim.ch.state, x: sim.ch.x, y: sim.ch.y, box: needBox(sim) });
  playSolution(L, T, (sim, st) => steps.push({ tick: ticks.length, ...snap(sim), needs: frameNeeds(sim, st) }), (sim) => ticks.push(snap(sim)));
  return { ticks, steps };
}

// Spot centres (at zoom z) that frame one step: a rectangle, empty when x0 > x1 or y0 > y1.
function feasible(L, n, z) {
  const hw = T.viewW / 2 / z, hh = T.viewH / 2 / z;
  const f = {
    x0: L.w <= 2 * hw ? L.w / 2 : hw, x1: L.w <= 2 * hw ? L.w / 2 : L.w - hw,
    y0: L.h <= 2 * hh ? L.h / 2 : hh, y1: L.h <= 2 * hh ? L.h / 2 : L.h - hh,
  };
  const fit = (b, share) => {
    const mx = (share * T.viewW) / z, my = (share * T.viewH) / z;
    f.x0 = Math.max(f.x0, b.x1 + mx - hw);
    f.x1 = Math.min(f.x1, b.x0 - mx + hw);
    f.y0 = Math.max(f.y0, b.y1 + my - hh);
    f.y1 = Math.min(f.y1, b.y0 - my + hh);
  };
  fit(n.char, FRAME.edge);
  if (n.arc) fit(n.arc, FRAME.near);
  if (n.pin) fit({ x0: n.pin.x - PIN_R, x1: n.pin.x + PIN_R, y0: n.pin.y - PIN_R, y1: n.pin.y + PIN_R }, FRAME.edge);
  if (n.dest) fit(n.dest, FRAME.near);
  if (n.goal) fit(n.goal, FRAME.near);
  if (n.foot != null) f.y0 = Math.max(f.y0, n.foot + FRAME.floor / z - hh);
  return f;
}
const meet = (a, b) => ({ x0: Math.max(a.x0, b.x0), x1: Math.min(a.x1, b.x1), y0: Math.max(a.y0, b.y0), y1: Math.min(a.y1, b.y1) });
const empty = (f) => f.x0 > f.x1 || f.y0 > f.y1;
const mid = (f) => ({ x: (f.x0 + f.x1) / 2, y: (f.y0 + f.y1) / 2 });

// Consecutive steps share a spot while one zoom frames them all.
function greedy(L, steps) {
  const cams = [];
  let cur = null;
  const close = () => {
    const k = cur.findIndex((f) => !empty(f));
    const z = k >= 0 ? ZOOMS[k] : ZMIN;
    cams.push({ ...mid(cur[k >= 0 ? k : ZOOMS.length - 1]), z });
  };
  for (const s of steps) {
    const fs = ZOOMS.map((z) => feasible(L, s.needs, z));
    if (cur) {
      const next = cur.map((f, i) => meet(f, fs[i]));
      if (next.some((f) => !empty(f))) {
        cur = next;
        continue;
      }
      close();
    }
    cur = fs;
  }
  if (cur) close();
  return cams;
}

function evaluate(L, rec, cams) {
  const cs = new CamSpots({ ...L, cams }, T);
  let ti = 0, cost = 0, moves = 0, last = -1, problems = 0;
  for (const s of rec.steps) {
    for (; ti < s.tick; ti++) {
      const k = rec.ticks[ti];
      cs.pick(k.state, k.x, k.y, k.box);
    }
    const spot = cs.pick(s.state, s.x, s.y, s.box);
    if (spot !== last) {
      if (last >= 0) moves++;
      last = spot;
    }
    for (const p of frameProblems(s.needs, cs.rects[spot], T, L.items.length, PAD)) {
      cost += 40 + p.short;
      problems++;
    }
  }
  for (const c of cams) cost += (1 - c.z) * 300 + 10;
  return { cost: cost + moves * 25, problems, moves };
}

function climb(L, rec, start) {
  let cams = start.map((c) => ({ ...c }));
  let best = evaluate(L, rec, cams);
  for (let it = 0; it < ITERS; it++) {
    const heat = 1 - it / ITERS;
    const i = Math.floor(rnd() * cams.length);
    const c = { ...cams[i] };
    const r = rnd();
    if (r < 0.42) c.x += (rnd() * 2 - 1) * (20 + 300 * heat);
    else if (r < 0.84) c.y += (rnd() * 2 - 1) * (20 + 200 * heat);
    else c.z = Math.min(1, Math.max(ZMIN, Math.round((c.z + (rnd() < 0.5 ? -0.05 : 0.05)) * 20) / 20));
    const hw = T.viewW / 2 / c.z, hh = T.viewH / 2 / c.z;
    c.x = Math.round(Math.min(Math.max(c.x, hw), Math.max(hw, L.w - hw)) / L.unit) * L.unit;
    c.y = Math.round(Math.min(Math.max(c.y, hh), Math.max(hh, L.h - hh)) / L.unit) * L.unit;
    const next = cams.slice();
    next[i] = c;
    const e = evaluate(L, rec, next);
    if (e.cost <= best.cost) {
      cams = next;
      best = e;
    }
  }
  return { cams, ...best };
}

function draft(raw) {
  const L = scaleLevel(raw);
  const rec = record(L);
  const tries = [];
  const g = greedy(L, rec.steps);
  tries.push(climb(L, rec, g));
  // also try without each spot, and with each spot doubled (an extra one to place)
  for (let k = 0; k < g.length && g.length > 1; k++) tries.push(climb(L, rec, g.filter((_, i) => i !== k)));
  for (let k = 0; k < g.length; k++) tries.push(climb(L, rec, [...g.slice(0, k + 1), { ...g[k] }, ...g.slice(k + 1)]));
  tries.sort((a, b) => a.cost - b.cost);
  const best = tries[0];
  const u = L.unit;
  const line = best.cams.map((c) => `[${Math.round(c.x / u)}, ${Math.round(c.y / u)}${c.z !== 1 ? `, ${c.z}` : ''}]`).join(', ');
  console.log(`\n${raw.name}: greedy ${g.length} spots; best ${best.cams.length} spots, ${best.problems} problem(s), ${best.moves} moves`);
  console.log(`  cams: [${line}],`);
  printFrame(L, T, frameLevel(L, T, best.cams));
}

LEVELS.forEach((raw, i) => {
  if ((LEVEL && LEVEL !== i + 1) || !raw.cams) return;
  draft(raw);
});
