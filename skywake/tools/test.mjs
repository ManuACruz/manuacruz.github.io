// Run with: node --test tools/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCSV } from '../src/csv.js';
import { prepareData, createSim } from '../src/sim.js';
import { mulberry32 } from '../src/rng.js';
import { loadTables } from './sim.mjs';

const tables = loadTables();
function fresh(seed = 1) {
  const { DATA, S } = prepareData(loadTables());
  const sim = createSim(DATA, S, { rng: mulberry32(seed) });
  sim.newRun();
  sim.takeEvents();
  return sim;
}
function play(sim, seconds, { shoot = true, tick = 0.1 } = {}) {
  for (let t = 0; t < seconds && sim.mode === 'sail'; t += tick) {
    if (shoot) for (const e of sim.G.enemies) if (e.state !== 'approach' && !e.leaving && !e.gone) sim.tap(e.x, e.y);
    sim.update(tick);
  }
  sim.takeEvents();
}

test('csv: header, coercion, quotes and comments', () => {
  const rows = parseCSV('a,b,c\n# comment\n1,yes,"x, y"\nfoo,no,\n');
  assert.equal(rows.length, 2);
  assert.deepEqual(rows[0], { a: 1, b: true, c: 'x, y' });
  assert.deepEqual(rows[1], { a: 'foo', b: false, c: '' });
});

test('data: every wave enemy and upgrade target exists', () => {
  const { DATA } = prepareData(tables);
  assert.ok(DATA.lastLeg >= 1);
  const bad = structuredClone(tables);
  bad.waves.push({ leg: 1, time_s: 1, enemy_id: 'dragon', count: 1, spacing_s: 0, note: '' });
  assert.throws(() => prepareData(bad), /unknown enemy "dragon"/);
});

test('a leg never stalls: with no shooting, leg 1 still reaches the summary or the run ends', () => {
  const sim = fresh(3);
  play(sim, 240, { shoot: false });
  assert.notEqual(sim.mode, 'sail');
});

test('engine death ends the run', () => {
  const sim = fresh(4);
  sim.engine().hp = 1;
  play(sim, 240);
  assert.equal(sim.mode, 'end');
  assert.equal(sim.G.win, false);
});

test('a destroyed car falls into the water and a tap rescues it into its old cell', () => {
  const sim = fresh(5);
  sim.give('armor', 0, 2);
  const armor = sim.G.grid[2][0];
  armor.hp = 0.5;
  for (let t = 0; t < 120 && sim.G.grid[2][0] === armor; t += 0.1) sim.update(0.1);
  assert.equal(sim.G.grid[2][0], null, 'armor should have been destroyed');
  const fallen = sim.G.loot.find((l) => l.kind === 'car' && l.car === armor);
  assert.ok(fallen, 'fallen car should be in the water lane');
  for (let t = 0; t < 5 && !fallen.floating; t += 0.05) sim.update(0.05);
  sim.tap(fallen.x, fallen.y);
  assert.equal(sim.G.grid[2][0], armor);
  assert.ok(armor.hp >= 1);
});

test('dock: upgrade keeps the cell and charges the next tier cost; sell refunds half', () => {
  const sim = fresh(6);
  play(sim, 240);
  assert.equal(sim.mode, 'summary');
  sim.openDock();
  sim.G.scrap = 200;
  const cannon = sim.G.grid[1][0];
  sim.G.dock.selected = cannon;
  sim.upgrade();
  assert.equal(sim.G.grid[1][0], cannon);
  assert.equal(cannon.def.id, 'cannon2');
  assert.equal(sim.G.scrap, 200 - sim.DATA.cars.cannon2.cost);
  sim.G.dock.selected = cannon;
  const before = sim.G.scrap;
  sim.sell();
  assert.equal(sim.G.grid[1][0], null);
  assert.equal(sim.G.scrap, before + Math.round(sim.DATA.cars.cannon2.cost * sim.S.sell_pct));
});

test('thief: steals floating loot and drops it when killed', () => {
  const sim = fresh(7);
  sim.startLeg(2);
  let thief = null;
  for (let t = 0; t < 120 && !thief; t += 0.1) {
    for (const e of sim.G.enemies) if (e.def.behavior !== 'thief' && e.state !== 'approach' && !e.leaving && !e.gone) sim.tap(e.x, e.y);
    sim.update(0.1);
    thief = sim.G.enemies.find((e) => e.def.behavior === 'thief' && e.carry) || null;
  }
  assert.ok(thief, 'a thief should be carrying loot');
  const carried = thief.carry;
  sim.give('harpoon2', 0, 0);
  for (let t = 0; t < 10 && sim.G.enemies.includes(thief); t += 0.1) { sim.tap(thief.x, thief.y); sim.update(0.1); }
  assert.ok(!sim.G.enemies.includes(thief), 'thief should be dead');
  assert.ok(sim.G.loot.includes(carried), 'the carried loot should be back in the water lane');
  assert.equal(sim.G.legStats.stolen, 0);
});

test('charger: enough damage during the wind-up interrupts the ram', () => {
  const sim = fresh(8);
  sim.give('cannon3', 0, 0);
  sim.startLeg(4);
  let ram = null;
  for (let t = 0; t < 60 && !ram; t += 0.05) { sim.update(0.05); ram = sim.G.enemies.find((e) => e.def.behavior === 'charger' && e.state === 'wind') || null; }
  assert.ok(ram, 'a ram should wind up');
  const hpBefore = sim.G.cars.reduce((a, c) => a + c.hp, 0);
  for (let t = 0; t < 3 && ram.state === 'wind'; t += 0.05) { sim.tap(ram.x, ram.y); sim.update(0.05); }
  assert.notEqual(ram.state, 'dash');
  assert.ok(ram.charged >= ram.def.charge_break);
  assert.equal(sim.G.cars.reduce((a, c) => a + c.hp, 0), hpBefore);
});

test('same seed, same run', () => {
  const a = fresh(11), b = fresh(11);
  play(a, 60); play(b, 60);
  assert.deepEqual(a.G.stats, b.G.stats);
  assert.equal(a.G.scrap, b.G.scrap);
});
