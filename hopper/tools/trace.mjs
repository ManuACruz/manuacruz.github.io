// Level design helper: play one level's solution and print where Hopper is at every step.
// node tools/trace.mjs 2-3        (a level number, or an id)
import { scaleLevel, playSolution } from '../src/sim.js';
import { LEVELS } from '../src/levels.js';
import { DEFAULTS } from '../src/tune.js';

const key = process.argv[2];
const raw = LEVELS.find((l) => l.num === key || l.id === key);
if (!raw) {
  console.log('levels: ' + LEVELS.map((l) => `${l.num} ${l.id}`).join(', '));
  process.exit(1);
}
const T = { ...DEFAULTS };
const L = scaleLevel(raw);
const f = (v) => v.toFixed(0).padStart(5);
const res = playSolution(L, T, (sim, st) => {
  const ch = sim.ch;
  console.log(`  ${ch.state.padEnd(6)} at (${f(ch.x)},${f(ch.y)}) feet ${f(ch.y + 27)}  items ${[...sim.got].join(',') || '-'}  -> ${st}`);
});
const ch = res.sim.ch;
console.log(`  end: ${ch.state} at (${f(ch.x)},${f(ch.y)}), goals ${res.sim.goal}/${L.goals.length}, items ${res.sim.got.size}/${L.items.length}  ${res.ok ? 'OK' : 'FAIL ' + (res.error || '')}`);
