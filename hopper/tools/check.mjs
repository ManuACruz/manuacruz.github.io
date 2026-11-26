// Level checker: node tools/check.mjs [--runs 20000] [--level 3] [--seed 1]
// 1. plays each level's solution, 2. checks the camera framing before every step (tools/framing.mjs), 3. runs random players.
import { Sim, scaleLevel, playSolution, STEP } from '../src/sim.js';
import { CamSpots } from '../src/cam.js';
import { LEVELS } from '../src/levels.js';
import { DEFAULTS } from '../src/tune.js';
import { frameLevel } from './framing.mjs';
import { stickerProblems } from '../src/stickers.js';

const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf('--' + k);
  return i >= 0 ? Number(args[i + 1]) : d;
};
const RUNS = arg('runs', 20000);
const ONLY = arg('level', 0);
let seed = arg('seed', 1);
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const T = { ...DEFAULTS };
let failures = 0;

function inside(r, x, y, pad) {
  return x - pad >= r.x0 && x + pad <= r.x1 && y - pad >= r.y0 && y + pad <= r.y1;
}

function checkSolution(L) {
  const res = playSolution(L, T);
  const got = res.sim.got.size;
  console.log(`  solution: ${res.ok ? 'OK' : 'FAIL'}  goals ${res.sim.goal}/${L.goals.length}, items ${got}/${L.items.length}${res.error ? '  (' + res.error + ')' : ''}`);
  if (!res.ok) failures++;
  // framing rules before every step (details: node tools/framing.mjs)
  const f = frameLevel(L, T);
  const bad = f.steps.filter((s) => s.problems.length);
  if (bad.length) failures++;
  for (const s of bad) console.log(`  camera: before ${s.st}${f.big ? ` (spot ${s.spot})` : ''}: ${s.problems.map((p) => `${p.what} short by ${p.short.toFixed(0)} px`).join(', ')}`);
  if (!bad.length) console.log(`  camera: OK${f.big ? ` (${f.moves} moves)` : ''}`);
  return res;
}

function randomPlayers(L) {
  const cam = new CamSpots(L, T);
  let wins = 0, best = null;
  const deaths = {}, losts = {};
  const t0 = Date.now();
  for (let run = 0; run < RUNS; run++) {
    const sim = new Sim(L, T);
    cam.spot = -1;
    const acts = [];
    let t = 0, next = 0.2 + rnd() * 1.5;
    while (t < 45) {
      sim.step(STEP);
      t += STEP;
      const s = sim.ch.state;
      if (s === 'won') {
        if (sim.completeGoal()) break;
        continue;
      }
      if (s === 'dead' || s === 'lost') break;
      cam.update(sim);
      if (t < next) continue;
      next = t + 0.1 + rnd() * 2;
      if (rnd() < 0.15) {
        const lean = Math.round((rnd() * 2 - 1) * 40);
        if (sim.swipe(lean)) acts.push(lean);
      } else {
        const r = cam.spot >= 0 ? cam.rects[cam.spot] : null;
        const vis = r ? L.pins.filter((p) => inside(r, p.cx, p.cy, 0)) : L.pins;
        const p = vis[Math.floor(rnd() * vis.length)];
        if (p && sim.tapPin(p)) acts.push(p.id);
      }
      sim.events.length = 0;
    }
    sim.events.length = 0;
    const s = sim.ch.state;
    if (sim.finished) {
      wins++;
      if (!best || acts.length < best.length) best = acts.slice();
    } else if (s === 'dead') {
      const k = Math.round(sim.ch.x / L.unit / 100) * 100;
      deaths[k] = (deaths[k] || 0) + 1;
    } else if (s === 'lost') {
      const k = `goal ${sim.goal + 1}`;
      losts[k] = (losts[k] || 0) + 1;
    }
  }
  const pct = ((100 * wins) / RUNS).toFixed(2);
  const fmt = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${k}:${v}`).join(' ');
  console.log(`  random: ${wins}/${RUNS} finish (${pct}%) in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  if (best) console.log(`  shortest random win: ${JSON.stringify(best)}`);
  console.log(`  falls by drawing x: ${fmt(deaths) || 'none'}`);
  console.log(`  wrong goal arrivals: ${fmt(losts) || 'none'}`);
}

LEVELS.forEach((raw, i) => {
  if (ONLY && ONLY !== i + 1) return;
  const L = scaleLevel(raw);
  console.log(`${raw.name}  (${L.w.toFixed(0)} x ${L.h.toFixed(0)} world px)`);
  checkSolution(L);
  if (RUNS > 0) randomPlayers(L);
});

// every sticker has a spot on its world's album spread
const sp = stickerProblems();
for (const p of sp) console.log('album: ' + p);
if (sp.length) failures++;
else console.log('\nalbum: every sticker has a spot');

if (failures) {
  console.log(`\n${failures} problem(s)`);
  process.exit(1);
}
console.log('\nall solutions pass');
