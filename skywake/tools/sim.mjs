#!/usr/bin/env node
// Headless balance harness. Runs many scripted players through the CSV tables and prints
// survival per leg, scrap and engine HP at each dock, and loot caught / missed / stolen.
//
//   node tools/sim.mjs --runs 200 --policy greedy --grab 0.6 --seed 1
//
// policy: greedy (buys and upgrades sensibly) | passive (never buys) | noshoot (never taps)
// grab: probability per second that the player hand-grabs a piece of un-nettable loot in reach

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCSV } from '../src/csv.js';
import { prepareData, createSim } from '../src/sim.js';
import { mulberry32 } from '../src/rng.js';
import { validCell, FACES } from '../src/layout.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => (a.startsWith('--') ? [a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true] : null)).filter(Boolean));
const RUNS = Number(args.runs || 100);
const POLICY = String(args.policy || 'greedy');
const GRAB = Number(args.grab ?? 0.6);
const SEED = Number(args.seed || 1);
const VERBOSE = !!args.verbose;
const TICK = 0.1;

export function loadTables(dir = path.join(root, 'data')) {
  const names = ['settings', 'enemies', 'cars', 'loot', 'waves', 'legs'];
  return Object.fromEntries(names.map((n) => [n, parseCSV(fs.readFileSync(path.join(dir, `${n}.csv`), 'utf8'))]));
}

// One scripted player's decisions at the dock.
export function dockPolicy(sim, rng) {
  const G = sim.G, DATA = sim.DATA;
  if (POLICY === 'passive') { sim.sail(); return; }
  const cars = () => G.cars;
  const has = (pred) => cars().some(pred);
  const emptyCells = () => { const out = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (!G.grid[r][c] && !FACES[r][c].includes('core')) out.push({ col: c, row: r }); return out; };
  const cellFor = (def) => {
    const cells = emptyCells().filter((k) => validCell(def, k.col, k.row));
    if (!cells.length) return null;
    // weapons like the front column, nets the water row, armor the front column
    cells.sort((a, b) => (a.col - b.col) || (a.row - b.row));
    return cells[0];
  };
  // 1. upgrade the heaviest tap weapon we can afford, then anything else
  for (let guard = 0; guard < 6; guard++) {
    const ups = cars().filter((c) => c.def.upgrade_to && DATA.cars[c.def.upgrade_to].cost <= G.scrap)
      .sort((a, b) => (b.def.damage - a.def.damage) || (a.def.cost - b.def.cost));
    if (!ups.length) break;
    G.dock.selected = ups[0]; sim.upgrade();
  }
  // 2. buy from the offers by need
  const want = (def) => {
    if (def.id === 'turret' && !has((c) => c.def.allowed.includes('sky') && c.def.damage > 0)) return 5;
    if (def.id === 'harpoon' && !has((c) => c.def.damage >= 6)) return 4;
    if (def.id === 'net' && !has((c) => c.def.collect_radius > 0)) return 4;
    if (def.id === 'cannon') return 3;
    if (def.id === 'armor' && !has((c) => c.def.id.startsWith('armor'))) return 2;
    return 1;
  };
  for (let guard = 0; guard < 4; guard++) {
    const offers = G.dock.offers.map((o, i) => ({ o, i })).filter(({ o }) => !o.sold && o.def.cost <= G.scrap && cellFor(o.def));
    if (!offers.length) break;
    offers.sort((a, b) => want(b.o.def) - want(a.o.def) || b.o.def.cost - a.o.def.cost);
    const { o, i } = offers[0];
    const cell = cellFor(o.def);
    sim.chooseOffer(i);
    // dockTap needs screen coords: use the cell centre
    const k = { x: 118 + cell.col * 62 + 28, y: 178 + cell.row * 62 + 28 };
    sim.tap(k.x, k.y);
  }
  sim.sail();
}

export function runOne(seed, tables) {
  const { DATA, S } = prepareData(tables);
  const rng = mulberry32(seed);
  const sim = createSim(DATA, S, { rng });
  sim.newRun();
  let ticks = 0;
  const maxTicks = (sim.LAST_LEG * 240) / TICK;
  while (sim.mode !== 'end' && ticks < maxTicks) {
    ticks++;
    const G = sim.G;
    if (sim.mode === 'sail') {
      if (POLICY !== 'noshoot') for (const e of G.enemies) if (e.state !== 'approach' && !e.leaving && !e.gone) sim.tap(e.x, e.y);
      for (const l of G.loot) {
        if (!l.floating || l.x < 40 || l.x > 320) continue;
        if (l.kind === 'car' || (!l.netOk && rng() < GRAB * TICK)) { sim.tap(l.x, l.y); break; }
      }
      sim.update(TICK);
    } else if (sim.mode === 'summary') sim.openDock();
    else if (sim.mode === 'dock') dockPolicy(sim, rng);
    else break;
    sim.takeEvents();
  }
  const G = sim.G;
  return { win: !!G.win, leg: G.leg, docks: G.docks, stats: G.stats, ship: G.cars.map((c) => c.def.id), timedOut: ticks >= maxTicks };
}

function fmt(n, w = 6, d = 0) { return (typeof n === 'number' && !Number.isNaN(n) ? n.toFixed(d) : '—').padStart(w); }

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const tables = loadTables();
  const results = [];
  for (let i = 0; i < RUNS; i++) results.push(runOne(SEED + i, tables));
  const lastLeg = Math.max(...Object.values(prepareData(loadTables()).DATA.legs).map((l) => l.leg));
  console.log(`Skywake balance: ${RUNS} runs, policy ${POLICY}, grab ${GRAB}, seed ${SEED}`);
  console.log('');
  console.log(' leg  survived  dockScrap  engineHP  caught  missed  stolen');
  for (let leg = 1; leg <= lastLeg; leg++) {
    const reached = results.filter((r) => r.leg > leg || r.win || (r.leg === leg && r.docks.some((d) => d.leg === leg)));
    const docks = results.flatMap((r) => r.docks.filter((d) => d.leg === leg));
    const mean = (k) => (docks.length ? docks.reduce((a, d) => a + d[k], 0) / docks.length : NaN);
    const survived = (reached.length / RUNS) * 100;
    console.log(`${fmt(leg, 4)}  ${fmt(survived, 7, 0)}%  ${fmt(mean('scrap'), 9, 0)}  ${fmt(mean('engineHp'), 8, 1)}  ${fmt(mean('caught'), 6, 1)}  ${fmt(mean('missed'), 6, 1)}  ${fmt(mean('stolen'), 6, 1)}`);
  }
  const wins = results.filter((r) => r.win).length;
  const timeouts = results.filter((r) => r.timedOut).length;
  console.log('');
  console.log(`wins ${wins}/${RUNS} (${((wins / RUNS) * 100).toFixed(0)}%)${timeouts ? `, ${timeouts} runs timed out` : ''}`);
  const deaths = {};
  for (const r of results) if (!r.win) deaths[r.leg] = (deaths[r.leg] || 0) + 1;
  console.log(`engine lost on leg: ${Object.entries(deaths).map(([l, n]) => `${l}×${n}`).join('  ') || 'never'}`);
  if (VERBOSE) for (const r of results.slice(0, 5)) console.log(r.win ? 'WIN ' : `leg${r.leg}`, r.ship.join(','), JSON.stringify(r.stats));
}
