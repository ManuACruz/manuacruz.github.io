// Level checker: builds the world in Node and reports anything unreachable or unwalkable.
// Run: node tools/check.mjs   (add --map for an ASCII map of where the robot can go)

import { World, footprintSteps, CELL, GW, GH } from '../src/world.js';
import { ROOMS, ITEMS, FIRST_WALK, DOCK } from '../src/level.js';
import { T } from '../src/tune.js';

const w = new World();
let problems = 0;
const bad = (msg) => { problems++; console.log('  !! ' + msg); };

const nearReach = (x, z, rad) => {
  const i0 = Math.floor((x - rad) / CELL), i1 = Math.floor((x + rad) / CELL);
  const j0 = Math.floor((z - rad) / CELL), j1 = Math.floor((z + rad) / CELL);
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
    if (i < 0 || j < 0 || i >= GW || j >= GH) continue;
    const cx = (i + 0.5) * CELL - x, cz = (j + 0.5) * CELL - z;
    if (cx * cx + cz * cz <= rad * rad && w.reach[j * GW + i]) return true;
  }
  return false;
};

console.log('Rooms');
const scheduled = ['living', 'kitchen', 'hall', 'kid'];
let schedTotal = 0;
ROOMS.forEach((r, ri) => {
  let cells = 0, dirty = 0;
  for (let c = 0; c < GW * GH; c++) if (w.room[c] === ri) { cells++; if (w.dirt0[c] > 0) dirty++; }
  const area = (cells * CELL * CELL).toFixed(1), dirtyArea = (dirty * CELL * CELL).toFixed(1);
  console.log(`  ${r.id.padEnd(8)} floor ${area.padStart(5)} m2   dirty ${dirtyArea.padStart(5)} m2   dirt ${w.roomTotal[ri].toFixed(0).padStart(5)}`);
  if (scheduled.includes(r.id)) schedTotal += w.roomTotal[ri];
  if (r.dirt > 0 && dirty === 0) bad(`${r.id} has no reachable dirt`);
});
console.log(`  scheduled dirt ${schedTotal.toFixed(0)} -> binPerDirt ${(100 / (schedTotal * T.binFillShare)).toFixed(4)}`);

console.log('Dock');
if (!w.reach[Math.floor(DOCK.z / CELL) * GW + Math.floor(DOCK.x / CELL)]) bad('dock spot is not reachable');
const dockHit = w.collide(DOCK.x, DOCK.z, T.radius);
if (Math.hypot(dockHit.x - DOCK.x, dockHit.z - DOCK.z) > 0.02) bad(`dock spot overlaps something (pushed to ${dockHit.x.toFixed(2)}, ${dockHit.z.toFixed(2)})`);

console.log('Items');
for (const it of ITEMS) if (!nearReach(it.x, it.z, T.pickupRadius * 0.85)) bad(`item ${it.id} at ${it.x},${it.z} cannot be reached`);
console.log(`  ${ITEMS.length} items, ${ITEMS.filter((i) => i.story).length} story items`);

console.log('Footprints');
const steps = footprintSteps();
console.log(`  ${steps.length} steps`);
steps.forEach((s, k) => { if (!nearReach(s.x, s.z, T.cleanRadius + 0.02)) bad(`footprint ${k} at ${s.x.toFixed(2)},${s.z.toFixed(2)} cannot be reached`); });

console.log('Entity paths');
const from = [12.62, 5.6];
const tryPaths = (label) => {
  ROOMS.forEach((r, ri) => {
    if (r.id === 'laundry' || (r.id === 'kid' && w.doors.kid.state !== 'open')) return;
    const p = w.randomFreeIn(ri, mulberry(ri + 1));
    if (!p) { bad(`${label}: no free spot in ${r.id}`); return; }
    const path = w.findPath(from[0], from[1], p[0], p[1]);
    if (!path) bad(`${label}: no path to ${r.id}`);
  });
};
tryPaths('kid door closed');
w.setDoor('kid', 'open');
tryPaths('kid door open');
for (let k = 0; k < FIRST_WALK.length - 1; k++) {
  const [a, b] = [FIRST_WALK[k], FIRST_WALK[k + 1]];
  if (k > 0 && !w.navLine(a[0], a[1], b[0], b[1])) bad(`first walk leg ${k} is blocked`);
}
w.setDoor('kid', 'closed');

function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

if (process.argv.includes('--map')) {
  console.log('Map (each char 0.25 m; . reachable, + cover, # blocked/unreachable)');
  for (let j = 0; j < GH; j += 4) {
    let line = '';
    for (let i = 0; i < GW; i += 4) {
      const c = j * GW + i, x = (i + 0.5) * CELL, z = (j + 0.5) * CELL;
      line += w.reach[c] ? (w.coverAt(x, z) ? '+' : '.') : '#';
    }
    console.log('  ' + line);
  }
}

console.log(problems ? `${problems} problem(s)` : 'All good');
process.exit(problems ? 1 : 0);
