// Camera framing report: node tools/framing.mjs [--level 3]
// Plays each level's solution with the camera following it, and before every step checks the framing rules in
// src/cam.js (FRAME): Hopper and the next pin well inside the view, the swing he's on and where the next pin takes him
// on screen, the floor shown under his feet, no pin under the HUD. tools/check.mjs fails on any problem found here.
import { pathToFileURL } from 'node:url';
import { scaleLevel, playSolution } from '../src/sim.js';
import { CamSpots, frameNeeds, frameProblems, wholeRect } from '../src/cam.js';
import { LEVELS } from '../src/levels.js';
import { DEFAULTS } from '../src/tune.js';

// Whether a level scrolls (has spots and is bigger than the view at zoom 1).
export const scrolls = (L, T) => L.cams.length > 0 && (L.w > T.viewW || L.h > T.viewH);

// Frame every solution step. `cams` overrides the level's spots ([{x, y, z}] in world px).
export function frameLevel(L, T, cams = L.cams) {
  const big = cams.length > 0 && (L.w > T.viewW || L.h > T.viewH);
  const cam = new CamSpots({ ...L, cams }, T);
  const fixed = wholeRect(L, T);
  const steps = [];
  let moves = 0, last = -1;
  const res = playSolution(L, T, (sim, st, sit, afterWait) => {
    const spot = big ? cam.update(sim) : -1;
    if (spot !== last) {
      if (last >= 0) moves++;
      last = spot;
    }
    const r = big ? cam.rects[spot] : fixed;
    const n = frameNeeds(sim, st);
    steps.push({ st, spot, afterWait, needs: n, rect: r, problems: frameProblems(n, r, T, L.items.length) });
  }, big ? (sim) => cam.update(sim) : null);
  return { big, steps, moves, ok: res.ok, problems: steps.reduce((k, s) => k + s.problems.length, 0) };
}

const pct = (v) => (v * 100).toFixed(0).padStart(3) + '%';

export function printFrame(L, T, f) {
  for (const s of f.steps) {
    const r = s.rect, n = s.needs, z = r.z;
    const at = (x, y) => `(${pct(((x - r.x0) * z) / T.viewW)},${pct(((y - r.y0) * z) / T.viewH)})`;
    const cx = (n.char.x0 + n.char.x1) / 2, cy = (n.char.y0 + n.char.y1) / 2;
    const what = typeof s.st === 'number' ? `swipe ${s.st}` : `pin ${s.st} at ${at(n.pin.x, n.pin.y)}`;
    const floor = n.foot != null ? ` floor ${((r.y1 - n.foot) * z).toFixed(0)}px` : '';
    const spot = f.big ? `spot ${s.spot}${z !== 1 ? ` z${z}` : ''}` : 'whole';
    const bad = s.problems.map((p) => `${p.what} -${p.short.toFixed(0)}px`).join(', ');
    console.log(`  ${spot.padEnd(10)} ${n.state.padEnd(5)} Hopper ${at(cx, cy)}${floor} -> ${what}${s.afterWait ? ' [after wait]' : ''}${bad ? '   !! ' + bad : ''}`);
  }
  if (f.big) console.log(`  camera moves between steps: ${f.moves}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const only = args.includes('--level') ? Number(args[args.indexOf('--level') + 1]) : 0;
  const T = { ...DEFAULTS };
  let bad = 0;
  LEVELS.forEach((raw, i) => {
    if (only && only !== i + 1) return;
    const L = scaleLevel(raw);
    const f = frameLevel(L, T);
    console.log(`\n${raw.name}  ${f.big ? `${L.cams.length} spots` : 'fits the screen'}, level ${L.w.toFixed(0)} x ${L.h.toFixed(0)}`);
    printFrame(L, T, f);
    bad += f.problems;
  });
  console.log(bad ? `\n${bad} framing problem(s)` : '\nframing OK');
}
