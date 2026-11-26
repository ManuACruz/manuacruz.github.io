// Level checker: builds the world in Node, once per night, and reports anything unreachable or unwalkable.
// Run: node tools/check.mjs   (add --map for an ASCII map of where the robot can go, --night 2 for one night)

import { World, footprintSteps, CELL, GW, GH } from '../src/world.js';
import * as L from '../src/level.js';
import { T } from '../src/tune.js';

const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const only = arg('--night');
const nights = only ? [+only] : Object.keys(L.NIGHTS).map(Number);
let problems = 0;

for (const night of nights) {
  L.setNight(night);
  console.log(`\n=== ${L.NIGHT_INFO.name} ===`);
  checkNight();
}
console.log(problems ? `\n${problems} problem(s)` : '\nAll good');
process.exit(problems ? 1 : 0);

function checkNight() {
  const w = new World();
  const bad = (msg) => { problems++; console.log('  !! ' + msg); };
  const { ROOMS, ITEMS, FIRST_WALK, DOCK, START, NOOKS, PLACES, LAIR, RULES, SCHEDULED } = L;

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
  const reachAt = (x, z) => !!w.reach[Math.floor(z / CELL) * GW + Math.floor(x / CELL)];
  // How far the robot has to drive from a to b (metres along its grid), or Infinity.
  const robotDist = (a, b) => {
    const s = Math.floor(a[1] / CELL) * GW + Math.floor(a[0] / CELL), g = Math.floor(b[1] / CELL) * GW + Math.floor(b[0] / CELL);
    if (!w.reach[s] || !w.reach[g]) return Infinity;
    const dist = new Int32Array(GW * GH).fill(-1), q = [s];
    dist[s] = 0;
    for (let h = 0; h < q.length; h++) {
      const c = q[h];
      if (c === g) return dist[c] * CELL;
      const i = c % GW, j = (c / GW) | 0;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const a2 = i + di, b2 = j + dj, k = b2 * GW + a2;
        if (a2 < 0 || b2 < 0 || a2 >= GW || b2 >= GH || dist[k] >= 0 || !w.reach[k]) continue;
        dist[k] = dist[c] + 1; q.push(k);
      }
    }
    return Infinity;
  };
  const pathLen = (p, from) => { if (!p) return Infinity; let s = 0, [x, z] = from; for (const [px, pz] of p) { s += Math.hypot(px - x, pz - z); x = px; z = pz; } return s; };

  console.log('Rooms');
  let schedTotal = 0;
  ROOMS.forEach((r, ri) => {
    let cells = 0, dirty = 0;
    for (let c = 0; c < GW * GH; c++) if (w.room[c] === ri) { cells++; if (w.dirt0[c] > 0) dirty++; }
    const area = (cells * CELL * CELL).toFixed(1), dirtyArea = (dirty * CELL * CELL).toFixed(1);
    console.log(`  ${r.id.padEnd(8)} floor ${area.padStart(5)} m2   dirty ${dirtyArea.padStart(5)} m2   dirt ${w.roomTotal[ri].toFixed(0).padStart(5)}${SCHEDULED.includes(r.id) ? '  (scheduled)' : ''}`);
    if (SCHEDULED.includes(r.id)) schedTotal += w.roomTotal[ri];
    if (r.dirt > 0 && dirty === 0) bad(`${r.id} has no reachable dirt`);
  });
  for (const id of SCHEDULED) if (w.roomIndex(id) < 0) bad(`scheduled room ${id} does not exist`);
  console.log(`  scheduled dirt ${schedTotal.toFixed(0)} -> binPerDirt ${(100 / (schedTotal * T.binFillShare)).toFixed(4)}`);

  console.log('Dock');
  if (!reachAt(DOCK.x, DOCK.z)) bad('dock spot is not reachable');
  const dockHit = w.collide(DOCK.x, DOCK.z, T.radius);
  if (Math.hypot(dockHit.x - DOCK.x, dockHit.z - DOCK.z) > 0.02) bad(`dock spot overlaps something (pushed to ${dockHit.x.toFixed(2)}, ${dockHit.z.toFixed(2)})`);
  console.log(`  at ${DOCK.x}, ${DOCK.z} (${w.rooms[w.roomAt(DOCK.x, DOCK.z)].id})${START.x !== DOCK.x || START.z !== DOCK.z ? `, wakes at ${START.x}, ${START.z} on ${START.battery}%` : ''}`);
  if (!reachAt(START.x, START.z)) bad('start spot is not reachable');
  const startHit = w.collide(START.x, START.z, T.radius);
  if (Math.hypot(startHit.x - START.x, startHit.z - START.z) > 0.02) bad('start spot overlaps something');
  if (!w.entityCanReach(DOCK.x, DOCK.z, 1.2)) bad('it can never get near the dock');
  const docks = w.furniture.filter((f) => f.def.type === 'dock' && !f.def.dead);
  if (docks.length !== 1) bad(`${docks.length} live docks (want 1)`);

  console.log('Items');
  const ids = new Set();
  for (const it of ITEMS) {
    if (ids.has(it.id)) bad(`item id ${it.id} is used twice`);
    ids.add(it.id);
    if (!nearReach(it.x, it.z, T.pickupRadius * 0.85)) bad(`item ${it.id} at ${it.x},${it.z} cannot be reached`);
  }
  console.log(`  ${ITEMS.length} items, ${ITEMS.filter((i) => i.story).length} story items`);

  console.log('Footprints');
  const steps = footprintSteps();
  console.log(`  ${steps.length} steps`);
  steps.forEach((s, k) => { if (!nearReach(s.x, s.z, T.cleanRadius + 0.02)) bad(`footprint ${k} at ${s.x.toFixed(2)},${s.z.toFixed(2)} cannot be reached`); });

  console.log('Kibble');
  const kb = L.kibbleSpots();
  kb.forEach((p, k) => { if (!nearReach(p.x, p.z, T.cleanRadius * 0.9)) bad(`kibble ${k} (${p.group}) at ${p.x.toFixed(2)},${p.z.toFixed(2)} cannot be reached`); });
  console.log(`  ${kb.filter((p) => p.group === 'spill').length} spill, ${kb.filter((p) => p.group === 'trail').length} trail`);

  console.log('Pet flap and nooks');
  for (const f of w.flaps) {
    const c = (f.from + f.to) / 2, [x, z] = f.along === 'x' ? [c, f.at] : [f.at, c];
    if (!nearReach(x, z, 0.05)) bad(`the robot cannot get to the flap at ${x}, ${z}`);
    if (w.navFree(x, z)) bad(`the thing can walk through the flap at ${x}, ${z}`);
    if (f.outside) console.log(`  a way out at ${x}, ${z}${Object.keys(w.blocks).length ? ' (blocked until the story opens it)' : ''}`);
  }
  for (const n of NOOKS) {
    let any = false;
    for (let z = n.z0; z < n.z1; z += CELL) for (let x = n.x0; x < n.x1; x += CELL) if (reachAt(x, z)) any = true;
    if (!any) bad(`nook "${n.name}" cannot be reached by the robot`);
  }
  console.log('Hiding spots');
  console.log('  ' + w.covers.map((c) => c.type).join(', '));

  if (w.holes.length) console.log('Holes');
  for (const h of w.holes) {
    const c = (h.from + h.to) / 2;
    const [ax, az, bx, bz] = h.along === 'z' ? [h.at - 0.5, c, h.at + 0.5, c] : [c, h.at - 0.5, c, h.at + 0.5];
    console.log(`  ${w.rooms[w.roomAt(ax, az)].id} <-> ${w.rooms[w.roomAt(bx, bz)].id}, ${(h.to - h.from).toFixed(2)} m wide, ${h.top} m high`);
    if (!w.navLine(ax, az, bx, bz)) bad(`the thing cannot walk through the hole at ${h.along}=${h.at}`);
    if (!(reachAt(ax, az) && reachAt(bx, bz) && robotDist([ax, az], [bx, bz]) < 1.5)) bad(`the robot cannot drive through the hole at ${h.along}=${h.at}`);
  }

  // Openings this night has blocked: going from a to b must take the long way round, for the robot and for it.
  for (const cut of L.NIGHT_INFO.cutOff || []) {
    const rd = robotDist(cut.a, cut.b), ed = pathLen(w.findPath(cut.a[0], cut.a[1], cut.b[0], cut.b[1]), cut.a);
    console.log(`  ${cut.what}: robot ${rd.toFixed(1)} m, it ${ed.toFixed(1)} m the long way`);
    if (rd < cut.min) bad(`the robot still gets through the ${cut.what} (${rd.toFixed(1)} m)`);
    if (ed < cut.min) bad(`the thing still gets through the ${cut.what} (${ed.toFixed(1)} m)`);
  }

  console.log('Entity paths');
  const from = [12.62, 5.6];
  const tryPaths = (label) => {
    ROOMS.forEach((r, ri) => {
      if ((r.id === 'laundry' && !RULES.laundryPatrol) || (r.id === 'kid' && w.doors.kid.state !== 'open') || (r.id === 'master' && w.doors.master.state !== 'open')) return;
      const p = w.randomFreeIn(ri, mulberry(ri + 1));
      if (!p) { bad(`${label}: no free spot in ${r.id}`); return; }
      if (!w.findPath(from[0], from[1], p[0], p[1])) bad(`${label}: no path to ${r.id}`);
    });
  };
  const doors0 = Object.fromEntries(Object.values(w.doors).map((d) => [d.id, d.state]));
  tryPaths('as the night starts');
  w.setDoor('kid', 'open');
  tryPaths('kid door open');
  w.setDoor('master', 'open');
  tryPaths('master door open');
  const [rx, rz] = LAIR.retreat;
  if (!w.entityCanReach(rx, rz, 0.3)) bad(`its lair spot ${rx},${rz} is blocked`);
  if (w.doors.laundry.state !== 'locked') {
    w.setDoor('laundry', 'open');
    if (!w.findPath(from[0], from[1], rx, rz)) bad('no path to its lair spot');
    if (w.holes.length) {   // with the laundry door shut, it still gets in and out through the hole
      w.setDoor('laundry', 'closed');
      if (!w.findPath(8.5, 2.5, rx, rz)) bad('with the laundry door shut it cannot get from the kitchen to its lair');
    }
  }
  if (RULES.dockLinger) {
    let spots = 0;
    const room = w.roomAt(DOCK.x, DOCK.z), fx = -Math.sin(DOCK.yaw), fz = -Math.cos(DOCK.yaw);
    for (let a = 0; a < 24; a++) for (const d of [0.8, 1.2, 1.6]) {   // as Entity.dockSpot looks for them
      const x = DOCK.x + fx * 0.35 + Math.cos(a / 24 * Math.PI * 2) * d, z = DOCK.z + fz * 0.35 + Math.sin(a / 24 * Math.PI * 2) * d;
      if (w.navFree(x, z) && w.roomAt(x, z) === room && w.findPath(from[0], from[1], x, z)) spots++;
    }
    console.log(`  ${spots} places to stand over the dock`);
    if (spots < 8) bad('hardly anywhere for it to stand near the dock');
  }
  for (const [id, st] of Object.entries(doors0)) w.setDoor(id, st);
  w.setDoor('master', 'open'); w.setDoor('kid', 'open'); w.setDoor('laundry', 'open');   // as they are by the time it walks
  for (let k = 0; k < FIRST_WALK.length - 1; k++) {
    const [a, b] = [FIRST_WALK[k], FIRST_WALK[k + 1]];
    if (k > 0 && !w.navLine(a[0], a[1], b[0], b[1])) bad(`first walk leg ${k} is blocked`);
  }
  for (const [id, st] of Object.entries(doors0)) w.setDoor(id, st);

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
}

function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
