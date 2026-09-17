import { loadCSV } from './csv.js';
import { sfx, unlock, isMuted, setMuted, vibrate } from './audio.js';

// ---------- layout (logical pixels, portrait) ----------
const W = 360, H = 640;
const GRID = { x: 118, y: 178, cell: 56, gap: 6 };
const WATER_Y = 470;
const FACES = [
  [['front', 'sky'], ['sky'], ['sky', 'rear']],
  [['front'], ['core'], ['rear']],
  [['front', 'water'], ['water'], ['water', 'rear']],
];
const FRONT_SLOTS = [[82, 206], [44, 268], [80, 334], [22, 236], [34, 316], [64, 252]];
const SKY_SLOTS = [[72, 80], [134, 112], [104, 50], [172, 84], [40, 122], [210, 60]];
const FACE_COLOR = { front: '#d9a066', sky: '#cfe3ee', water: '#7fb8d0', rear: '#c9c2b4', core: '#f0c75e' };
const EMOJI_FONT = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
const IDLE_HINT = 'Tap a car for options. Buy a car, then tap a glowing cell.';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const stage = document.getElementById('stage');
const $ = (id) => document.getElementById(id);

const S = {};
const DATA = { enemies: {}, cars: {}, loot: [], waves: [], legs: {} };
let LAST_LEG = 1;
let G = null;
let mode = 'loading';
let clock = 0;
let last = 0;

// ---------- data ----------
const parseList = (v) => (v === '' || v == null ? [] : String(v).split('|').map(Number));
async function loadData() {
  const [settings, enemies, cars, loot, waves, legs] = await Promise.all([
    loadCSV('data/settings.csv'),
    loadCSV('data/enemies.csv'),
    loadCSV('data/cars.csv'),
    loadCSV('data/loot.csv'),
    loadCSV('data/waves.csv'),
    loadCSV('data/legs.csv'),
  ]);
  for (const r of settings) S[r.key] = r.value;
  for (const r of enemies) { r.rows = parseList(r.target_rows); r.cols = parseList(r.target_cols); DATA.enemies[r.id] = r; }
  for (const r of cars) { r.allowed = String(r.allowed_facing).split('|'); DATA.cars[r.id] = r; }
  DATA.loot = loot;
  DATA.waves = waves.sort((a, b) => a.leg - b.leg || a.time_s - b.time_s);
  for (const r of legs) DATA.legs[r.leg] = r;
  LAST_LEG = Math.max(...legs.map((l) => l.leg));
  for (const w of waves) if (!DATA.enemies[w.enemy_id]) throw new Error(`waves.csv: unknown enemy "${w.enemy_id}" on leg ${w.leg}`);
  for (const c of cars) if (c.upgrade_to && !DATA.cars[c.upgrade_to]) throw new Error(`cars.csv: unknown upgrade_to "${c.upgrade_to}" on ${c.id}`);
}

// ---------- helpers ----------
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function moveToward(e, tx, ty, speed, dt) {
  const d = dist(e.x, e.y, tx, ty);
  if (d <= speed * dt) { e.x = tx; e.y = ty; return true; }
  e.x += (tx - e.x) / d * speed * dt; e.y += (ty - e.y) / d * speed * dt;
  return false;
}
// Each column follows the one in front with a little lag, so the train sways instead of bobbing as a block.
function bobAt(col) { return Math.sin(clock * 1.6 - col * 0.55) * 3; }
function cellRect(col, row) {
  const x = GRID.x + col * (GRID.cell + GRID.gap);
  const y = GRID.y + row * (GRID.cell + GRID.gap) + bobAt(col);
  return { x, y, w: GRID.cell, h: GRID.cell, cx: x + GRID.cell / 2, cy: y + GRID.cell / 2 };
}
function cellAt(x, y) {
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const k = cellRect(c, r);
    if (x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h) return { col: c, row: r };
  }
  return null;
}
function allCars() {
  const out = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (G.grid[r][c]) out.push(G.grid[r][c]);
  return out;
}
function carCenter(car) {
  const k = cellRect(car.col, car.row);
  return { x: k.cx, y: k.cy + Math.sin(clock * 3 + car.seed) * 1.5 };
}
function carFaces(car) { return FACES[car.row][car.col]; }
function onGrid(car) { return G.grid[car.row][car.col] === car; }
function say(x, y, str, color = '#ffffff', big = false) {
  let n = 0;
  for (const t of G.texts) if (!t.big && t.t < 0.35 && Math.abs(t.x - x) < 16 && Math.abs(t.y - y) < 16) n++;
  G.texts.push({ x: x + (n ? (n % 2 ? 10 : -10) : 0), y: y - n * 11, str, color, t: 0, big });
}
function sparks(x, y, n, color, speed = 120) {
  for (let i = 0; i < n; i++) G.sparks.push({ x, y, vx: rand(-1, 1) * speed, vy: rand(-1, 0.3) * speed, t: 0, color, r: rand(1.5, 3) });
  if (G.sparks.length > 160) G.sparks.splice(0, G.sparks.length - 160);
}
function bubble(car, emo) {
  const b = G.bubbles.find((b) => b.car === car);
  if (b) { b.emo = emo; b.t = 0; } else G.bubbles.push({ car, emo, t: 0 });
}
function banner(text, sub = '') { G.banner = { text, sub, t: 0 }; }
function engine() { return G.grid[1][1]; }
function legDef() { return DATA.legs[G.leg] || { name: `Leg ${G.leg}`, preview: '', enemy_hp_mult: 1, enemy_dmg_mult: 1, loot_mult: 1, boss: false }; }
function legEnded() {
  return G.rowIdx >= G.legRows.length && G.pending.length === 0 && G.enemies.length === 0 && !G.loot.some((l) => l.kind === 'car');
}

// ---------- run ----------
function newRun() {
  G = {
    leg: 0, legTime: 0, scrap: S.starting_scrap,
    grid: [[null, null, null], [null, null, null], [null, null, null]],
    enemies: [], shots: [], loot: [], texts: [], pending: [], legRows: [], rowIdx: 0,
    calm: 0, lootTimer: 1, shake: 0,
    slow: 0, speed: 1, scroll: 0, dark: 0, pier: { p: 0, leaving: false },
    sparks: [], ripples: [], bubbles: [], reticle: null, banner: null,
    dock: { offers: [], placing: null, selected: null, moving: null },
    stats: { kills: 0, collected: 0, missed: 0, stolen: 0, rescued: 0, lost: 0 },
    legStats: null,
    hints: { enemyDone: !S.hints, lootDone: !S.hints },
  };
  placeCar(makeCar('engine'), 1, 1);
  placeCar(makeCar('cannon'), 0, 1);
  placeCar(makeCar('net'), 1, 2);
  startLeg(1);
}
function makeCar(id) {
  const d = DATA.cars[id];
  return { def: d, hp: d.hp, cd: rand(0, d.fire_rate || 0), busy: 0, col: 0, row: 0, seed: Math.random() * 7, flash: 0, recoil: 0 };
}
function placeCar(car, col, row) { G.grid[row][col] = car; car.col = col; car.row = row; }

function startLeg(n) {
  G.leg = n; G.legTime = 0; G.calm = 0; G.lootTimer = 1;
  G.enemies = []; G.shots = []; G.loot = []; G.texts = []; G.pending = [];
  G.legRows = DATA.waves.filter((w) => w.leg === n);
  G.rowIdx = 0;
  G.legStats = { kills: 0, caught: 0, missed: 0, stolen: 0, lost: 0, rescued: 0, engineStart: engine().hp, scrapStart: G.scrap };
  if (G.pier.p >= 1) { G.pier.leaving = true; G.pier.p = 0; }
  mode = 'sail';
  showOverlay(null);
  banner(legDef().name, `Leg ${n} of ${LAST_LEG}`);
  sfx.leg();
}

// ---------- update ----------
function update(dt) {
  clock += dt;
  if (!G) return;
  if (G.slow > 0) { G.slow -= dt; dt *= 0.3; }
  G.shake = Math.max(0, G.shake - dt * 3);
  for (const t of G.texts) t.t += dt;
  G.texts = G.texts.filter((t) => t.t < (t.big ? 1.8 : 0.9));
  for (const s of G.sparks) { s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 320 * dt; }
  G.sparks = G.sparks.filter((s) => s.t < 0.45);
  for (const r of G.ripples) r.t += dt;
  G.ripples = G.ripples.filter((r) => r.t < 0.4);
  for (const b of G.bubbles) b.t += dt;
  G.bubbles = G.bubbles.filter((b) => b.t < 0.7 && onGrid(b.car));
  if (G.banner && (G.banner.t += dt) > 2.2) G.banner = null;
  if (G.reticle && (G.reticle.t += dt) > 0.3) G.reticle = null;
  for (const c of allCars()) { c.flash = Math.max(0, c.flash - dt); c.recoil = Math.max(0, c.recoil - dt * 4); }
  // world motion: the train eases to a stop when the dock comes into view
  const docked = mode === 'summary' || mode === 'dock' || (mode === 'sail' && legEnded() && G.leg < LAST_LEG);
  G.speed += ((docked ? 0 : 1) - G.speed) * Math.min(1, dt * 2.5);
  G.scroll += dt * G.speed;
  const bossUp = G.enemies.some((e) => e.def.size >= 2 && !e.gone && !e.leaving);
  G.dark += ((bossUp ? 1 : 0) - G.dark) * Math.min(1, dt * 1.5);
  if (G.pier.leaving) { G.pier.p += dt * 1.4; if (G.pier.p > 1.6) { G.pier.p = 0; G.pier.leaving = false; } }
  else if (mode === 'sail' && legEnded() && G.leg < LAST_LEG) G.pier.p = Math.min(1, G.pier.p + dt / S.leg_calm_s);
  if (mode !== 'sail') return;

  G.legTime += dt;

  // waves
  while (G.rowIdx < G.legRows.length && G.legRows[G.rowIdx].time_s <= G.legTime) {
    const w = G.legRows[G.rowIdx++];
    for (let i = 0; i < w.count; i++) G.pending.push({ at: G.legTime + i * (w.spacing_s || 0), id: w.enemy_id });
  }
  G.pending = G.pending.filter((p) => { if (p.at <= G.legTime) { spawnEnemy(p.id); return false; } return true; });

  // flotsam
  G.lootTimer -= dt;
  if (G.lootTimer <= 0) { spawnFlotsam(); G.lootTimer = S.loot_interval_s * rand(0.7, 1.3); }

  // enemies
  for (const e of G.enemies) updateEnemy(e, dt);
  G.enemies = G.enemies.filter((e) => !e.gone && !(e.leaving && e.x < -50));

  // cars: auto weapons and collectors
  for (const car of allCars()) {
    if (car.def.damage > 0) {
      car.cd -= dt;
      if (car.def.auto && car.cd <= 0) {
        const target = nearestTargetable(car);
        if (target) fireCar(car, target);
      }
    }
    if (car.def.collect_radius > 0 && carFaces(car).includes('water') && car.def.allowed.includes('water')) {
      if (car.busy > 0) car.busy -= dt;
      else {
        const cx = carCenter(car).x;
        for (const l of G.loot) {
          if (!l.floating || Math.abs(l.x - cx) >= car.def.collect_radius) continue;
          if (!l.netOk && car.def.lifts !== 'all') continue;
          collect(l, car);
          car.busy = car.def.reel_s || 0;
          break;
        }
      }
    }
  }

  // shots
  for (const s of G.shots) s.t += dt;
  for (const s of G.shots.filter((s) => s.t >= s.dur)) resolveShot(s);
  G.shots = G.shots.filter((s) => s.t < s.dur);

  // loot
  for (const l of G.loot) {
    l.age += dt;
    if (!l.floating) {
      l.vy += 420 * dt; l.y += l.vy * dt; l.x += l.vx * dt;
      if (l.y >= WATER_Y) { l.y = WATER_Y; l.floating = true; l.vx = l.drift; l.age = 0; }
    } else {
      l.x += l.vx * dt * Math.max(0.35, G.speed);
    }
  }
  for (const l of G.loot.filter((l) => l.x > W + 24)) {
    if (l.kind === 'car') { G.stats.lost++; G.legStats.lost++; say(W - 40, WATER_Y - 30, `${l.car.def.emoji} lost`, '#ffb3a0'); }
    else { G.stats.missed++; G.legStats.missed++; }
  }
  G.loot = G.loot.filter((l) => l.x <= W + 24);

  // engine down
  if (engine().hp <= 0) { endRun(false); return; }

  // leg end
  if (legEnded()) {
    G.calm += dt;
    if (G.calm >= S.leg_calm_s) { if (G.leg >= LAST_LEG) endRun(true); else endLeg(); }
  }
}

function spawnEnemy(id) {
  const d = DATA.enemies[id];
  const L = legDef();
  const slots = d.lane === 'sky' ? SKY_SLOTS : FRONT_SLOTS;
  const used = new Set(G.enemies.filter((e) => e.def.lane === d.lane).map((e) => e.slot));
  let slot = slots.findIndex((_, i) => !used.has(i));
  if (slot < 0) slot = Math.floor(Math.random() * slots.length);
  let [hx, hy] = slots[slot];
  if (d.size >= 2) { hx = 62; hy = 268; }
  const hp = Math.round(d.hp * L.enemy_hp_mult);
  G.enemies.push({
    def: d, hp, maxHp: hp, dmg: d.damage * L.enemy_dmg_mult, chargeDmg: d.charge_dmg * L.enemy_dmg_mult,
    x: -40, y: hy, hx, hy, slot, state: 'approach', cd: d.fire_rate * 0.8, held: 0, windT: 0, charged: 0,
    target: null, aim: null, carry: null, leaving: false, gone: false, seed: Math.random() * 7, flash: 0, kb: 0,
  });
  if (d.size >= 2) { banner(d.name, 'boss'); sfx.boss(); vibrate([40, 60, 40, 60, 120]); }
}

function updateEnemy(e, dt) {
  e.flash = Math.max(0, e.flash - dt);
  e.kb = Math.max(0, e.kb - dt * 5);
  const d = e.def;
  if (e.leaving) { e.x -= d.speed * 1.5 * dt; return; }
  switch (e.state) {
    case 'approach':
      if (moveToward(e, e.hx, e.hy, d.speed, dt)) e.state = 'hold';
      break;
    case 'hold': {
      e.held += dt;
      if (d.stay_s > 0 && e.held >= d.stay_s) { e.leaving = true; say(e.x, e.y - 20 * d.size, `${d.name} leaves`, '#ffe0b3'); return; }
      e.cd -= dt;
      // aim telegraph: pick the target early and show it before the shot
      if (d.behavior === 'hold' && !e.aim && e.cd <= 0.45) e.aim = pickTargetCar(e);
      if (e.cd > 0) break;
      if (d.behavior === 'thief') {
        const l = nearestLoot(e);
        if (l) { e.target = l; e.state = 'dive'; } else e.cd = 1;
      } else if (d.behavior === 'charger') {
        const car = pickTargetCar(e);
        if (car) { e.target = car; e.state = 'wind'; e.windT = 0; e.charged = 0; say(e.x, e.y - 20 * d.size, 'winding up!', '#ffb3a0'); }
        else e.cd = d.fire_rate;
      } else {
        enemyFire(e, e.aim && onGrid(e.aim) ? e.aim : pickTargetCar(e));
        e.aim = null;
        e.cd = d.fire_rate * rand(0.8, 1.2);
      }
      break;
    }
    case 'dive': {
      const l = e.target;
      if (!l || !G.loot.includes(l) || !l.floating) { e.target = null; e.state = 'return'; break; }
      if (moveToward(e, l.x, l.y - 12, d.speed * 1.4, dt)) {
        G.loot = G.loot.filter((x) => x !== l);
        e.carry = l; e.target = null; e.state = 'flee';
        say(e.x, e.y - 20, 'snatched!', '#ffb3a0');
        sfx.snatch();
      }
      break;
    }
    case 'flee':
      if (moveToward(e, -70, 60, d.speed * 1.3, dt)) {
        e.gone = true;
        G.stats.stolen++; G.legStats.stolen++;
        say(30, 70, `${e.carry.emoji} stolen`, '#ffb3a0');
      }
      break;
    case 'return':
      if (moveToward(e, e.hx, e.hy, d.speed, dt)) { e.state = 'hold'; e.cd = d.fire_rate; }
      break;
    case 'wind':
      e.windT += dt;
      if (e.charged >= d.charge_break) { e.state = 'return'; e.cd = d.fire_rate; say(e.x, e.y - 20 * d.size, 'interrupted!', '#ffffff', true); sfx.interrupt(); sparks(e.x, e.y, 10, '#ffffff'); break; }
      if (e.windT >= S.charge_wind_s) e.state = 'dash';
      break;
    case 'dash': {
      const car = e.target;
      if (!car || !onGrid(car) || car.hp <= 0) { e.state = 'return'; break; }
      const c = carCenter(car);
      if (moveToward(e, c.x - 34, c.y, 520, dt)) { hitCar(car, e.chargeDmg); G.shake = 1.5; sfx.ram(); e.state = 'return'; }
      break;
    }
  }
}

function nearestLoot(e) {
  let best = null, bd = S.thief_reach;
  for (const l of G.loot) {
    if (!l.floating || l.kind !== 'loot') continue;
    const d = Math.abs(l.x - e.hx);
    if (d < bd) { bd = d; best = l; }
  }
  return best;
}

function spawnFlotsam() {
  const total = DATA.loot.reduce((a, l) => a + l.spawn_weight, 0);
  let r = Math.random() * total;
  let def = DATA.loot[0];
  for (const l of DATA.loot) { r -= l.spawn_weight; if (r <= 0) { def = l; break; } }
  const value = Math.max(1, Math.round(def.value * legDef().loot_mult));
  G.loot.push({ kind: 'loot', emoji: def.emoji, value, netOk: def.net_ok !== false, x: -20, y: WATER_Y, vx: def.drift_speed, vy: 0, drift: def.drift_speed, floating: true, age: 0, seed: Math.random() * 7 });
}

function pickTargetCar(e) {
  const front = e.def.lane === 'front';
  const lanes = (front ? e.def.rows : e.def.cols);
  const order = shuffle(lanes.length ? lanes : [0, 1, 2]);
  for (const i of order) {
    if (front) { for (let c = 0; c < 3; c++) if (G.grid[i][c]) return G.grid[i][c]; }
    else { for (let r = 0; r < 3; r++) if (G.grid[r][i]) return G.grid[r][i]; }
  }
  return null;
}
function enemyFire(e, car) {
  if (!car) return;
  const to = carCenter(car);
  G.shots.push({ x: e.x, y: e.y, tx: to.x, ty: to.y, t: 0, dur: dist(e.x, e.y, to.x, to.y) / S.projectile_speed, dmg: e.dmg, kind: 'car', ref: car, color: '#f0503c' });
}

function canTarget(car, e) {
  return car.def.damage > 0 && e.x > -10 && !e.leaving && car.def.allowed.includes(e.def.lane) && carFaces(car).includes(e.def.lane);
}
function nearestTargetable(car) {
  const c = carCenter(car);
  let best = null, bd = Infinity;
  for (const e of G.enemies) if (canTarget(car, e)) { const d = dist(c.x, c.y, e.x, e.y); if (d < bd) { bd = d; best = e; } }
  return best;
}
function fireCar(car, e) {
  const from = carCenter(car);
  G.shots.push({ x: from.x, y: from.y, tx: e.x, ty: e.y, t: 0, dur: dist(from.x, from.y, e.x, e.y) / S.projectile_speed, dmg: car.def.damage, kind: 'enemy', ref: e, color: '#f2b843', big: car.def.damage >= 6 });
  car.cd = car.def.fire_rate;
  car.recoil = 1;
  if (car.def.damage >= 6) sfx.fireHeavy(); else sfx.fireLight();
  bubble(car, '😤');
}

function hitCar(car, dmg) {
  if (!onGrid(car) || car.hp <= 0) return;
  dmg = Math.round(dmg * 10) / 10;
  car.hp = Math.round((car.hp - dmg) * 10) / 10; car.flash = 0.25; G.shake = Math.max(G.shake, 1);
  const c = carCenter(car);
  say(c.x, c.y - 20, `-${dmg}`, '#ffb3a0');
  sparks(c.x - 20, c.y, 7, '#f0503c', 90);
  sfx.hitCar(); vibrate(30);
  if (car.hp <= 0) destroyCar(car); else bubble(car, '😖');
}
function resolveShot(s) {
  if (s.kind === 'car') { hitCar(s.ref, s.dmg); return; }
  const e = s.ref;
  if (!G.enemies.includes(e) || e.gone) return;
  const dmg = Math.max(1, s.dmg - e.def.armor);
  e.hp = Math.round((e.hp - dmg) * 10) / 10; e.flash = 0.2; e.kb = 1;
  if (e.state === 'wind') e.charged += dmg;
  const armored = dmg < s.dmg;
  say(e.x, e.y - 22 * e.def.size, armored ? `-${dmg} armor` : `-${dmg}`, armored ? '#d9d2c4' : '#fff2c2');
  sparks(e.x, e.y, armored ? 4 : 6, armored ? '#d9d2c4' : '#f2b843');
  if (armored) sfx.armor(); else sfx.hitEnemy();
  if (e.hp <= 0) killEnemy(e);
}

function destroyCar(car) {
  if (car.def.id === 'engine') { car.hp = 0; return; }
  const c = carCenter(car);
  G.grid[car.row][car.col] = null;
  G.loot.push({ kind: 'car', car, emoji: car.def.emoji, value: 0, netOk: true, x: c.x, y: c.y, vx: rand(-20, 20), vy: -60, drift: S.cargo_drift, floating: false, age: 0, seed: Math.random() * 7 });
  say(c.x, c.y, `${car.def.emoji} overboard!`, '#ffb3a0', true);
  sparks(c.x, c.y, 14, '#5a4030', 140);
  G.slow = 0.35;
  sfx.overboard(); vibrate([60, 40, 90]);
}

function killEnemy(e) {
  G.enemies = G.enemies.filter((x) => x !== e);
  G.stats.kills++; G.legStats.kills++;
  sparks(e.x, e.y, e.def.size >= 2 ? 30 : 12, '#ffd08a', e.def.size >= 2 ? 220 : 150);
  if (e.def.size >= 2) { sfx.bossDown(); G.slow = 0.35; G.shake = 2; vibrate([80, 40, 80, 40, 160]); } else sfx.kill();
  const value = Math.max(1, Math.round(e.def.cargo_value * legDef().loot_mult));
  for (let i = 0; i < e.def.cargo_count; i++) {
    G.loot.push({ kind: 'loot', emoji: '💰', value, netOk: true, x: e.x + rand(-14, 14), y: e.y, vx: rand(-25, 25), vy: rand(-140, -40), drift: S.cargo_drift, floating: false, age: 0, seed: Math.random() * 7 });
  }
  if (e.carry) { const l = e.carry; l.x = e.x; l.y = e.y; l.vx = 0; l.vy = -40; l.floating = false; l.age = 0; G.loot.push(l); e.carry = null; }
  say(e.x, e.y, e.def.size >= 2 ? `${e.def.name} down!` : 'cargo!', '#ffffff', e.def.size >= 2);
}

function collect(l, by) {
  if (!G.loot.includes(l)) return;
  G.loot = G.loot.filter((x) => x !== l);
  if (l.kind === 'loot') {
    G.scrap += l.value; G.stats.collected++; G.legStats.caught++;
    if (by === 'hand') G.hints.lootDone = true;
    say(l.x, l.y - 16, `+${l.value}`, by === 'hand' ? '#ffffff' : '#bfe6f5');
    sparks(l.x, l.y, 5, '#bfe6f5', 70);
    if (by === 'hand') sfx.grab(); else { sfx.net(); bubble(by, '😊'); }
  } else {
    const car = l.car;
    if (G.grid[car.row][car.col]) { G.stats.lost++; G.legStats.lost++; return; }
    car.hp = Math.max(1, Math.round(car.def.hp * S.rescue_hp_pct));
    placeCar(car, car.col, car.row);
    car.flash = 0.4;
    G.stats.rescued++; G.legStats.rescued++;
    say(l.x, l.y - 16, `${car.def.emoji} rescued!`, '#ffffff', true);
    sparks(l.x, l.y, 16, '#ffffff', 160);
    sfx.rescue(); vibrate([30, 30, 30]);
    bubble(car, '😅');
    if (by !== 'hand') bubble(by, '💪');
  }
}

function endRun(win) {
  mode = 'end';
  if (win) sfx.win(); else { sfx.gameOver(); vibrate([200, 80, 300]); }
  const st = G.stats;
  $('end').innerHTML = `
    <div class="card">
      <p class="eyebrow">${win ? 'Run complete' : 'Run over'}</p>
      <h1>${win ? 'Home safe' : 'Engine down'}</h1>
      <p>${win ? `The Leviathan is down. The train made it through all ${LAST_LEG} legs.` : `The engine went down on leg ${G.leg}, ${legDef().name}.`}</p>
      <p class="small">Kills ${st.kills} · Caught ${st.collected} · Missed ${st.missed} · Stolen ${st.stolen} · Rescued ${st.rescued} · Lost ${st.lost}</p>
      <button id="again">Sail again</button>
    </div>`;
  showOverlay('end');
  $('again').addEventListener('click', newRun);
}

// ---------- leg summary ----------
function endLeg() {
  mode = 'summary';
  sfx.dock();
  const s = G.legStats;
  const hpLost = s.engineStart - engine().hp;
  const total = s.caught + s.missed + s.stolen;
  $('summary').innerHTML = `
    <div class="card">
      <p class="eyebrow">Leg ${G.leg} of ${LAST_LEG} · ${legDef().name}</p>
      <h2>Leg complete</h2>
      <div class="statgrid">
        <div><b>${s.kills}</b><span>kills</span></div>
        <div><b>${s.caught}<small>/${total}</small></b><span>loot caught</span></div>
        <div><b>${s.missed + s.stolen}</b><span>missed${s.stolen ? ` · ${s.stolen} stolen` : ''}</span></div>
        <div><b>+${G.scrap - s.scrapStart}</b><span>scrap</span></div>
        <div class="${hpLost > 0 ? 'bad' : ''}"><b>${hpLost > 0 ? `-${hpLost}` : '0'}</b><span>engine HP</span></div>
        <div><b>${s.rescued}<small>/${s.rescued + s.lost}</small></b><span>cars rescued</span></div>
      </div>
      <button id="todock">Into the dock</button>
    </div>`;
  showOverlay('summary');
  $('todock').addEventListener('click', openDock);
}

// ---------- dock ----------
function rollOffers() {
  const pool = Object.values(DATA.cars).filter((d) => d.id !== 'engine' && d.tier === 1);
  let picks = shuffle(pool).slice(0, S.dock_offers);
  if (G.leg === 1 && S.dock1_guaranteed && DATA.cars[S.dock1_guaranteed] && !picks.some((d) => d.id === S.dock1_guaranteed)) {
    picks = [DATA.cars[S.dock1_guaranteed], ...picks.slice(0, S.dock_offers - 1)];
  }
  G.dock.offers = picks.map((def) => ({ def, sold: false }));
}
function openDock() {
  mode = 'dock';
  for (const car of allCars()) if (car.def.id !== 'engine') car.hp = car.def.hp;
  rollOffers();
  G.dock.placing = null; G.dock.selected = null; G.dock.moving = null;
  renderDock(IDLE_HINT);
  showOverlay('dock');
}
function statsLine(def) {
  if (def.damage > 0) return `${def.damage} dmg · every ${def.fire_rate}s · ${def.hp} hp · ${def.auto ? 'auto' : 'tap'}`;
  if (def.collect_radius > 0) return `reach ${def.collect_radius} · reel ${def.reel_s}s · ${def.lifts === 'all' ? 'lifts anything' : 'light loot only'}`;
  return `${def.hp} hp`;
}
const tierMark = (def) => (def.tier > 1 ? ' ' + 'I'.repeat(def.tier) : '');
function renderDock(hint) {
  const d = G.dock;
  const next = DATA.legs[G.leg + 1];
  const sel = d.selected;
  const up = sel && sel.def.upgrade_to ? DATA.cars[sel.def.upgrade_to] : null;
  const refund = sel ? Math.round(sel.def.cost * S.sell_pct) : 0;
  $('dock').innerHTML = `
    <div class="dockhead"><h2>Dock ${G.leg}</h2><span class="scrap">⚙ ${G.scrap} scrap</span></div>
    ${next ? `<p class="next"><b>Next: ${next.name}${next.boss ? ' · boss' : ''}.</b> ${next.preview}</p>` : ''}
    ${sel ? `
    <div class="actions">
      <span class="who">${sel.def.emoji} ${sel.def.name}<small>${statsLine(sel.def)}</small></span>
      ${up ? `<button id="upgrade" ${G.scrap < up.cost ? 'disabled' : ''}>Upgrade ${up.cost}⚙<small>${statsLine(up)}</small></button>` : '<button disabled>Max tier</button>'}
      <button id="move">Move</button>
      <button id="sell" class="quiet">Sell +${refund}⚙</button>
    </div>` : `
    <div class="offers">${d.offers.map((o, i) => `
      <button class="offer ${d.placing === o ? 'selected' : ''} ${o.sold ? 'sold' : ''}" data-i="${i}" ${o.sold ? 'disabled' : ''}>
        <span class="emoji">${o.def.emoji}</span>
        <span>${o.def.name} <span class="cost">${o.def.cost}⚙</span></span>
        <span class="passive">${statsLine(o.def)}</span>
      </button>`).join('')}
    </div>`}
    <p class="hint">${hint}</p>
    <div class="dockfoot">
      ${sel ? '' : `<button id="reroll" class="quiet" ${G.scrap < S.reroll_cost ? 'disabled' : ''}>Re-roll ${S.reroll_cost}⚙</button>`}
      <button id="sail">Set sail → Leg ${G.leg + 1}</button>
    </div>`;
  $('dock').querySelectorAll('.offer').forEach((b) => b.addEventListener('click', () => {
    const o = d.offers[Number(b.dataset.i)];
    if (d.placing === o) { d.placing = null; renderDock(IDLE_HINT); return; }
    if (G.scrap < o.def.cost) { renderDock(`Not enough scrap for the ${o.def.name}.`); return; }
    d.placing = o; d.selected = null; d.moving = null;
    renderDock(`Tap a glowing cell to place the ${o.def.name}.`);
  }));
  $('reroll')?.addEventListener('click', () => {
    if (G.scrap < S.reroll_cost) return;
    G.scrap -= S.reroll_cost; rollOffers(); d.placing = null;
    renderDock('New offers.');
  });
  $('upgrade')?.addEventListener('click', () => {
    if (!up || G.scrap < up.cost) return;
    G.scrap -= up.cost;
    const ratio = sel.hp / sel.def.hp;
    sel.def = up; sel.hp = Math.max(1, Math.round(up.hp * ratio));
    d.selected = null;
    renderDock(`Upgraded to ${up.name}.`);
  });
  $('move')?.addEventListener('click', () => {
    d.moving = sel; d.selected = null;
    renderDock(`Moving the ${sel.def.name}. Tap a glowing cell.`);
  });
  $('sell')?.addEventListener('click', () => {
    G.scrap += refund;
    G.grid[sel.row][sel.col] = null;
    d.selected = null;
    renderDock(`Sold the ${sel.def.name} for ${refund} scrap.`);
  });
  $('sail').addEventListener('click', () => startLeg(G.leg + 1));
}
function validCell(def, col, row) {
  const faces = FACES[row][col];
  return !faces.includes('core') && def.allowed.some((f) => faces.includes(f));
}
function dockTap(x, y) {
  const d = G.dock;
  const cell = cellAt(x, y);
  if (!cell) return;
  const here = G.grid[cell.row][cell.col];
  if (d.placing) {
    if (here || !validCell(d.placing.def, cell.col, cell.row)) { renderDock(`The ${d.placing.def.name} cannot go there.`); return; }
    G.scrap -= d.placing.def.cost;
    placeCar(makeCar(d.placing.def.id), cell.col, cell.row);
    d.placing.sold = true; d.placing = null;
    renderDock('Placed. ' + IDLE_HINT);
    return;
  }
  if (d.moving) {
    const car = d.moving;
    if (here === car) { d.moving = null; renderDock(IDLE_HINT); return; }
    if (!validCell(car.def, cell.col, cell.row) || (here && !validCell(here.def, car.col, car.row))) { renderDock('That swap does not fit the facings.'); return; }
    const from = { col: car.col, row: car.row };
    G.grid[from.row][from.col] = null;
    if (here) placeCar(here, from.col, from.row);
    placeCar(car, cell.col, cell.row);
    d.moving = null;
    renderDock('Moved. ' + IDLE_HINT);
    return;
  }
  if (here && here.def.id !== 'engine') {
    d.selected = d.selected === here ? null : here;
    renderDock(d.selected ? 'Upgrade, move or sell it. Tap it again to cancel.' : IDLE_HINT);
  } else if (d.selected) { d.selected = null; renderDock(IDLE_HINT); }
}

// ---------- input ----------
function handleTap(x, y) {
  if (!G) return;
  if (mode === 'dock') { dockTap(x, y); return; }
  if (mode !== 'sail') return;
  G.ripples.push({ x, y, t: 0 });
  sfx.tap();
  // enemies first
  let hit = null, hd = Infinity;
  for (const e of G.enemies) {
    if (e.leaving || e.gone) continue;
    const d = dist(x, y, e.x, e.y);
    if (d < 16 * e.def.size + S.enemy_tap_radius && d < hd) { hd = d; hit = e; }
  }
  if (hit) {
    G.hints.enemyDone = true;
    G.reticle = { e: hit, t: 0 };
    let ready = 0;
    for (const car of allCars()) {
      if (car.def.auto || !canTarget(car, hit)) continue;
      ready++;
      if (car.cd <= 0) fireCar(car, hit);
    }
    if (!ready) say(hit.x, hit.y + 24, 'no gun faces it', '#ffe0b3');
    return;
  }
  // then loot on the water
  let item = null, id = Infinity;
  for (const l of G.loot) {
    if (!l.floating) continue;
    const d = dist(x, y, l.x, l.y);
    if (d < S.tap_radius && d < id) { id = d; item = l; }
  }
  if (item) collect(item, 'hand');
}

canvas.addEventListener('pointerdown', (ev) => {
  ev.preventDefault();
  unlock();
  const r = canvas.getBoundingClientRect();
  handleTap((ev.clientX - r.left) / r.width * W, (ev.clientY - r.top) / r.height * H);
});
// touch pointerdown is not a user activation for audio on every browser; retry on real gestures too
stage.addEventListener('click', unlock);
stage.addEventListener('touchend', unlock, { passive: true });

function showOverlay(name) {
  for (const id of ['title', 'dock', 'end', 'summary', 'pause']) $(id).hidden = id !== name;
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden && mode === 'sail') { mode = 'paused'; showOverlay('pause'); }
});
$('resume').addEventListener('click', () => {
  if (mode === 'paused') { mode = 'sail'; showOverlay(null); last = performance.now(); }
});
const muteBtn = $('mute');
const paintMute = () => { muteBtn.textContent = isMuted() ? '🔇' : '🔊'; muteBtn.setAttribute('aria-label', isMuted() ? 'Unmute' : 'Mute'); };
muteBtn.addEventListener('click', () => { setMuted(!isMuted()); paintMute(); });
paintMute();

// ---------- drawing ----------
function draw() {
  ctx.save();
  if (G && G.shake > 0) ctx.translate(rand(-2, 2) * G.shake, rand(-2, 2) * G.shake);
  drawSky();
  drawSea();
  if (G) {
    drawPier();
    drawLoot();
    drawShip();
    drawEnemies();
    drawShots();
    drawEffects();
    drawHints();
    drawTexts();
    drawBanner();
    drawHUD();
  }
  ctx.restore();
}

const scroll = () => (G ? G.scroll : clock);
function drawSky() {
  const g = ctx.createLinearGradient(0, 0, 0, WATER_Y);
  g.addColorStop(0, '#79c3e8'); g.addColorStop(1, '#dbeef7');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, WATER_Y);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  const clouds = [[0, 40, 26, 46], [140, 90, 20, 30], [260, 30, 30, 22], [80, 150, 18, 38], [300, 130, 22, 26]];
  for (const [bx, y, r, sp] of clouds) {
    const x = ((bx + scroll() * sp) % (W + 160)) - 80;
    ctx.beginPath(); ctx.ellipse(x, y, r * 1.8, r * 0.7, 0, 0, Math.PI * 2); ctx.ellipse(x + r, y - r * 0.4, r * 1.1, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
  }
  if (G && G.dark > 0.01) { ctx.fillStyle = `rgba(40,30,70,${0.3 * G.dark})`; ctx.fillRect(0, 0, W, WATER_Y); }
}
function drawSea() {
  const ph = scroll() * 3 + clock * 0.6;
  const g = ctx.createLinearGradient(0, WATER_Y - 10, 0, H);
  g.addColorStop(0, '#3e97bd'); g.addColorStop(1, '#173544');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, WATER_Y);
  for (let x = 0; x <= W; x += 8) ctx.lineTo(x, WATER_Y - 6 + Math.sin(x / 22 - ph) * 4);
  ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  if (G && G.dark > 0.01) { ctx.fillStyle = `rgba(5,15,40,${0.5 * G.dark})`; ctx.fillRect(0, WATER_Y - 12, W, H - WATER_Y + 12); }
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 8) { const y = WATER_Y - 6 + Math.sin(x / 22 - ph) * 4; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(0, WATER_Y - 4, W, 28);
}
function drawPier() {
  const p = G.pier;
  if (p.p <= 0) return;
  const x = p.leaving ? p.p * 320 : -150 + 150 * p.p;
  const top = WATER_Y - 18;
  ctx.fillStyle = '#5a4030';
  for (let i = 0; i < 4; i++) ctx.fillRect(x + 12 + i * 38, top, 6, 60);
  ctx.fillStyle = '#8a6a48'; ctx.fillRect(x, top - 8, 150, 10);
  ctx.fillStyle = '#6f5238'; for (let i = 0; i < 12; i++) ctx.fillRect(x + i * 12.5, top - 8, 1.5, 10);
  ctx.fillStyle = '#5a4030'; ctx.fillRect(x + 122, top - 52, 5, 46);
  ctx.fillStyle = '#e5c16a'; ctx.beginPath(); ctx.arc(x + 124.5, top - 56, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(229,193,106,0.25)'; ctx.beginPath(); ctx.arc(x + 124.5, top - 56, 16 + Math.sin(clock * 4) * 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3b2a18'; ctx.fillRect(x + 28, top - 40, 64, 20);
  label(`DOCK ${Math.min(G.leg, LAST_LEG - 1)}`, x + 60, top - 30, 11, '#f3e2cf');
}

function emoji(str, x, y, size) {
  ctx.font = `${size}px ${EMOJI_FONT}`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(str, x, y + size * 0.05);
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function hpBar(x, y, w, hp, max, h = 4) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x, y, w, h);
  const p = clamp(hp / max, 0, 1);
  ctx.fillStyle = p > 0.5 ? '#6fd06f' : p > 0.25 ? '#f2b843' : '#f0503c';
  ctx.fillRect(x, y, w * p, h);
}
function label(str, x, y, size = 11, color = '#ffffff', align = 'center') {
  ctx.font = `bold ${size}px "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(15,30,37,0.8)'; ctx.strokeText(str, x, y);
  ctx.fillStyle = color; ctx.fillText(str, x, y);
}

function drawShip() {
  const d = G.dock;
  const mover = mode === 'dock' ? (d.placing ? d.placing.def : d.moving ? d.moving.def : null) : null;
  // chain links
  ctx.strokeStyle = '#5a4030'; ctx.lineWidth = 3; ctx.setLineDash([4, 3]);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const car = G.grid[r][c]; if (!car) continue;
    const a = carCenter(car);
    const right = c < 2 && G.grid[r][c + 1], down = r < 2 && G.grid[r + 1][c];
    for (const n of [right, down]) if (n) { const b = carCenter(n); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
  }
  ctx.setLineDash([]);
  // net reach brackets
  if (mode === 'sail') for (const car of allCars()) {
    if (!(car.def.collect_radius > 0 && carFaces(car).includes('water'))) continue;
    const cx = carCenter(car).x, r = car.def.collect_radius;
    ctx.strokeStyle = car.busy > 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - r, WATER_Y - 14); ctx.lineTo(cx - r, WATER_Y - 6); ctx.moveTo(cx + r, WATER_Y - 14); ctx.lineTo(cx + r, WATER_Y - 6); ctx.stroke();
  }
  // cells
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const k = cellRect(c, r);
    const car = G.grid[r][c];
    const faces = FACES[r][c];
    if (!car) {
      const glow = mover && validCell(mover, c, r);
      ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
      ctx.strokeStyle = glow ? '#e5964a' : 'rgba(60,40,20,0.35)';
      if (glow) { ctx.fillStyle = `rgba(229,150,74,${0.25 + 0.15 * Math.sin(clock * 6)})`; roundRect(k.x, k.y, k.w, k.h, 8); ctx.fill(); }
      roundRect(k.x, k.y, k.w, k.h, 8); ctx.stroke(); ctx.setLineDash([]);
      continue;
    }
    const cc = carCenter(car);
    const y = cc.y - k.h / 2;
    const x = k.x + (car.recoil > 0 ? car.recoil * 3 : 0);
    const main = faces.includes('core') ? 'core' : faces.includes('water') ? 'water' : faces.includes('front') ? 'front' : faces.includes('sky') ? 'sky' : 'rear';
    ctx.fillStyle = FACE_COLOR[main];
    roundRect(x, y, k.w, k.h, 8); ctx.fill();
    if (faces.length === 2) { ctx.fillStyle = FACE_COLOR[faces[0] === main ? faces[1] : faces[0]]; ctx.globalAlpha = 0.5; roundRect(x, y, k.w, k.h / 2, 8); ctx.fill(); ctx.globalAlpha = 1; }
    if (car.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${car.flash * 2})`; roundRect(x, y, k.w, k.h, 8); ctx.fill(); }
    // cracks when badly hurt
    if (car.hp / car.def.hp < 0.35) {
      ctx.strokeStyle = 'rgba(40,20,10,0.7)'; ctx.lineWidth = 1.5; ctx.beginPath();
      const s = car.seed;
      ctx.moveTo(x + 8 + (s % 10), y + 4); ctx.lineTo(x + 22 + (s % 7), y + 18); ctx.lineTo(x + 14, y + 30);
      ctx.moveTo(x + k.w - 10, y + k.h - 14); ctx.lineTo(x + k.w - 22 - (s % 6), y + k.h - 26); ctx.lineTo(x + k.w - 30, y + k.h - 18);
      ctx.stroke();
    }
    const selected = mode === 'dock' && (d.selected === car || d.moving === car);
    const swapTarget = mode === 'dock' && d.moving && d.moving !== car && car.def.id !== 'engine' && validCell(d.moving.def, c, r) && validCell(car.def, d.moving.col, d.moving.row);
    ctx.strokeStyle = selected ? '#ffffff' : swapTarget ? '#e5964a' : '#3b2a18'; ctx.lineWidth = selected || swapTarget ? 3 : 2;
    roundRect(x, y, k.w, k.h, 8); ctx.stroke();
    // manual weapon ready and something to shoot: glow
    if (mode === 'sail' && !car.def.auto && car.def.damage > 0 && car.cd <= 0 && G.enemies.some((en) => canTarget(car, en))) {
      ctx.strokeStyle = `rgba(255,255,255,${0.45 + 0.35 * Math.sin(clock * 7)})`; ctx.lineWidth = 4;
      roundRect(x - 2, y - 2, k.w + 4, k.h + 4, 10); ctx.stroke();
    }
    emoji(car.def.emoji, x + k.w / 2, y + k.h / 2 - 4, 26);
    hpBar(x + 6, y + k.h - 9, k.w - 12, car.hp, car.def.hp);
    if (car.def.tier > 1) label('I'.repeat(car.def.tier), x + k.w - 8, y + 9, 10, '#ffffff', 'right');
    if (!car.def.auto && car.def.damage > 0) {
      const p = car.def.fire_rate ? 1 - clamp(car.cd / car.def.fire_rate, 0, 1) : 1;
      ctx.strokeStyle = p >= 1 ? '#ffffff' : 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x + 9, y + 9, 5, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); ctx.stroke();
    }
  }
  // engine: propeller and exhaust
  const e = engine();
  if (e && e.hp > 0) {
    const c = carCenter(e);
    const px = c.x + 32, py = c.y + 6, a = G.scroll * 22;
    ctx.fillStyle = '#3b2a18'; ctx.fillRect(px - 6, py - 3, 8, 6);
    ctx.strokeStyle = '#8a6a48'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { const t = a + i * Math.PI * 2 / 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(t) * 2, py + Math.sin(t) * 9); ctx.stroke(); }
    ctx.lineCap = 'butt';
    ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.3 * G.speed})`;
    for (let i = 0; i < 3; i++) { const t = (G.scroll * 2 + i / 3) % 1; ctx.beginPath(); ctx.arc(c.x + 40 + t * 60 * (0.3 + 0.7 * G.speed), c.y + 20 - t * 8 + Math.sin(t * 9) * 3, 3 + t * 5, 0, Math.PI * 2); ctx.fill(); }
  }
}

function drawEnemies() {
  for (const e of G.enemies) {
    if (e.gone) continue;
    const bob = e.state === 'dive' || e.state === 'flee' || e.state === 'dash' ? 0 : Math.sin(clock * 2.2 + e.seed) * 3;
    const size = 26 * e.def.size;
    // aim telegraph: red pulse and a faint line to the car about to be hit
    if (e.aim && onGrid(e.aim) && e.state === 'hold') {
      const c = carCenter(e.aim);
      ctx.strokeStyle = 'rgba(240,80,60,0.45)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(e.x, e.y + bob); ctx.lineTo(c.x, c.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = `rgba(240,80,60,${0.2 + 0.2 * Math.sin(clock * 16)})`; ctx.beginPath(); ctx.arc(e.x, e.y + bob, size * 0.75, 0, Math.PI * 2); ctx.fill();
    }
    if (e.state === 'dive' && e.target) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 5]);
      ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.target.x, e.target.y - 10); ctx.stroke(); ctx.setLineDash([]);
    }
    if (e.kb > 0) { ctx.save(); ctx.translate(e.def.lane === 'sky' ? 0 : -6 * e.kb, e.def.lane === 'sky' ? -6 * e.kb : 0); }
    if (e.state === 'wind') {
      const p = e.windT / S.charge_wind_s;
      ctx.fillStyle = `rgba(240,80,60,${0.25 + 0.25 * Math.sin(clock * 14)})`; ctx.beginPath(); ctx.arc(e.x, e.y + bob, size * 0.8, 0, Math.PI * 2); ctx.fill();
      const bw = size * 1.2;
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(e.x - bw / 2, e.y + bob + size * 0.7, bw, 5);
      ctx.fillStyle = '#f0503c'; ctx.fillRect(e.x - bw / 2, e.y + bob + size * 0.7, bw * p, 5);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(e.x - bw / 2, e.y + bob + size * 0.7, bw * clamp(e.charged / e.def.charge_break, 0, 1), 2);
    }
    if (e.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${e.flash * 3})`; ctx.beginPath(); ctx.arc(e.x, e.y + bob, size * 0.7, 0, Math.PI * 2); ctx.fill(); }
    emoji(e.def.emoji, e.x, e.y + bob, size);
    if (e.carry) emoji(e.carry.emoji, e.x + size * 0.4, e.y + bob + size * 0.45, 14);
    if (!e.leaving) hpBar(e.x - size * 0.6, e.y + bob - size * 0.75, size * 1.2, e.hp, e.maxHp, e.def.size >= 2 ? 6 : 4);
    if (e.def.armor > 0 && !e.leaving) label(`🛡${e.def.armor}`, e.x + size * 0.6, e.y + bob - size * 0.75 - 7, 9, '#ffffff', 'right');
    if (e.kb > 0) ctx.restore();
  }
}
function drawEffects() {
  for (const s of G.sparks) {
    ctx.globalAlpha = 1 - s.t / 0.45; ctx.fillStyle = s.color;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (const r of G.ripples) {
    const p = r.t / 0.4;
    ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - p)})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(r.x, r.y, 6 + p * 40, 0, Math.PI * 2); ctx.stroke();
  }
  const rt = G.reticle;
  if (rt && G.enemies.includes(rt.e)) {
    const e = rt.e, s = 16 * e.def.size + 8 - rt.t * 20, x = e.x, y = e.y, g = 6;
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - s, y - s + g); ctx.lineTo(x - s, y - s); ctx.lineTo(x - s + g, y - s);
    ctx.moveTo(x + s - g, y - s); ctx.lineTo(x + s, y - s); ctx.lineTo(x + s, y - s + g);
    ctx.moveTo(x + s, y + s - g); ctx.lineTo(x + s, y + s); ctx.lineTo(x + s - g, y + s);
    ctx.moveTo(x - s + g, y + s); ctx.lineTo(x - s, y + s); ctx.lineTo(x - s, y + s - g);
    ctx.stroke();
  }
  for (const b of G.bubbles) {
    const c = carCenter(b.car);
    const pop = Math.min(1, b.t / 0.1);
    const fade = b.t > 0.5 ? 1 - (b.t - 0.5) / 0.2 : 1;
    ctx.globalAlpha = fade;
    const bx = c.x + 16, by = c.y - 30 - (b.t * 6);
    ctx.fillStyle = '#ffffff';
    roundRect(bx - 11 * pop, by - 9 * pop, 22 * pop, 18 * pop, 6 * pop); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx - 4 * pop, by + 8 * pop); ctx.lineTo(bx - 8 * pop, by + 13 * pop); ctx.lineTo(bx + 1 * pop, by + 8 * pop); ctx.fill();
    if (pop >= 1) emoji(b.emo, bx, by, 12);
    ctx.globalAlpha = 1;
  }
}
function drawBanner() {
  const b = G.banner;
  if (!b) return;
  const a = b.t < 0.3 ? b.t / 0.3 : b.t > 1.7 ? Math.max(0, (2.2 - b.t) / 0.5) : 1;
  ctx.globalAlpha = a;
  const y = 120;
  ctx.fillStyle = 'rgba(15,30,37,0.75)'; ctx.fillRect(0, y - 30, W, 60);
  ctx.fillStyle = b.sub === 'boss' ? '#f0503c' : '#e5964a'; ctx.fillRect(0, y - 30, W, 2); ctx.fillRect(0, y + 28, W, 2);
  ctx.font = '800 24px "Segoe UI", system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff'; ctx.fillText(b.text.toUpperCase(), W / 2, y - 4);
  if (b.sub) { ctx.font = '600 11px Consolas, "IBM Plex Mono", monospace'; ctx.fillStyle = b.sub === 'boss' ? '#ffb3a0' : '#ffd08a'; ctx.fillText(b.sub.toUpperCase(), W / 2, y + 16); }
  ctx.globalAlpha = 1;
}
function drawShots() {
  for (const s of G.shots) {
    const p = s.t / s.dur, x = s.x + (s.tx - s.x) * p, y = s.y + (s.ty - s.y) * p;
    ctx.strokeStyle = s.color; ctx.lineWidth = s.big ? 4 : 2; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(x - (s.tx - s.x) * 0.06, y - (s.ty - s.y) * 0.06); ctx.lineTo(x, y); ctx.stroke();
    ctx.globalAlpha = 1; ctx.fillStyle = s.color;
    ctx.beginPath(); ctx.arc(x, y, s.big ? 5 : 3, 0, Math.PI * 2); ctx.fill();
  }
}
function drawLoot() {
  for (const l of G.loot) {
    const bob = l.floating ? Math.sin(clock * 3 + l.seed) * 2 : 0;
    if (l.kind === 'car') {
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(l.x, l.y + bob, 15, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#f0503c'; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(l.x, l.y + bob, 15, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      emoji(l.emoji, l.x, l.y + bob, 20);
    } else {
      if (l.floating && l.x > W - 56) ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(clock * 9));
      emoji(l.emoji, l.x, l.y + bob + (l.floating ? 4 : 0), 20);
      if (!l.netOk && l.floating) label('✋', l.x + 12, l.y + bob - 8, 10);
      ctx.globalAlpha = 1;
    }
  }
}
function drawHints() {
  if (mode !== 'sail' || G.leg !== 1) return;
  const pulse = 4 * Math.sin(clock * 6);
  if (!G.hints.enemyDone) {
    const e = G.enemies.find((x) => x.state !== 'approach' && !x.leaving);
    if (e) { label('TAP', e.x, e.y - 30 * e.def.size - 12 + pulse, 13, '#fff2c2'); label('▼', e.x, e.y - 30 * e.def.size + pulse, 12, '#fff2c2'); }
  }
  if (!G.hints.lootDone) {
    const l = G.loot.find((x) => x.floating && x.age > 1.5 && x.x > 20 && x.x < W - 40);
    if (l) label('TAP TO GRAB', l.x, l.y - 24 + pulse, 11, '#fff2c2');
  }
}
function drawTexts() {
  for (const t of G.texts) {
    const life = t.big ? 1.8 : 0.9;
    const p = t.t / life;
    ctx.globalAlpha = 1 - p * p;
    ctx.font = `${t.big ? 'bold 20px' : 'bold 13px'} "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(15,30,37,0.8)';
    ctx.strokeText(t.str, t.x, t.y - p * 28);
    ctx.fillStyle = t.color; ctx.fillText(t.str, t.x, t.y - p * 28);
    ctx.globalAlpha = 1;
  }
}
function drawHUD() {
  ctx.fillStyle = 'rgba(15,30,37,0.55)'; ctx.fillRect(0, 0, W, 30);
  // route strip
  let x = 12;
  for (let i = 1; i <= LAST_LEG; i++) {
    const L = DATA.legs[i];
    const r = L && L.boss ? 5 : 3.5;
    ctx.beginPath(); ctx.arc(x, 15, r, 0, Math.PI * 2);
    if (i < G.leg) { ctx.fillStyle = '#ffffff'; ctx.fill(); }
    else if (i === G.leg) { ctx.fillStyle = '#e5964a'; ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke(); }
    else { ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    x += 14;
  }
  ctx.font = '600 12px Consolas, "IBM Plex Mono", monospace'; ctx.textBaseline = 'middle';
  ctx.textAlign = 'right'; ctx.fillStyle = '#ffd08a'; ctx.fillText(`⚙ ${G.scrap}`, W - 34, 15);
  ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('ENGINE', W / 2 - 24, 15);
  const e = engine();
  hpBar(W / 2 + 4, 11, 80, e.hp, e.def.hp, 8);
  if (mode === 'sail') {
    ctx.font = '12px "Segoe UI", system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(legEnded() ? (G.leg >= LAST_LEG ? 'Home in sight…' : 'Dock ahead…') : `${legDef().name} · tap enemies to fire · tap loot to grab`, W / 2, H - 16);
  }
}

// ---------- boot ----------
function resize() {
  const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
  const cssW = Math.floor(W * scale), cssH = Math.floor(H * scale);
  const dpr = window.devicePixelRatio || 1;
  stage.style.width = `${cssW}px`; stage.style.height = `${cssH}px`;
  stage.style.setProperty('--u', `${scale}px`);
  canvas.style.width = `${cssW}px`; canvas.style.height = `${cssH}px`;
  canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
}
window.addEventListener('resize', resize);
resize();

function frame(ts) {
  const dt = Math.min(0.05, (ts - last) / 1000 || 0);
  last = ts;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

// Debug and tooling hook: SKY.step(5) advances the game five seconds in fixed ticks and redraws.
window.SKY = {
  S, DATA,
  get G() { return G; },
  get mode() { return mode; },
  start: () => newRun(),
  tap: (x, y) => handleTap(x, y),
  toDock: () => { if (mode === 'summary') openDock(); },
  jump: (leg) => { if (G) startLeg(leg); },
  give: (id, col, row) => { if (G) placeCar(makeCar(id), col, row); },
  step(seconds = 1, tick = 1 / 60) {
    for (let t = 0; t < seconds; t += tick) update(tick);
    draw();
    return { mode, leg: G?.leg, legTime: G?.legTime?.toFixed(1), scrap: G?.scrap, enemies: G?.enemies.length, loot: G?.loot.length, engineHp: G ? engine().hp : null };
  },
};

loadData().then(() => {
  mode = 'title';
  $('loadmsg').textContent = `${Object.keys(DATA.cars).length} cars · ${Object.keys(DATA.enemies).length} enemies · ${DATA.waves.length} wave rows · ${LAST_LEG} legs`;
  $('start').addEventListener('click', () => {
    unlock();
    try { document.documentElement.requestFullscreen?.({ navigationUI: 'hide' })?.catch(() => {}); } catch (e) { /* not supported */ }
    newRun();
  });
  requestAnimationFrame(frame);
}).catch((err) => {
  $('loadmsg').textContent = `Could not load data: ${err.message}. Serve the folder over http, not file://.`;
  console.error(err);
});
