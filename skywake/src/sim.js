// Pure game simulation. No DOM, no canvas, no audio: it runs in the browser and in Node.
// Side effects the page cares about (sounds, vibration, overlay changes) are queued in sim.events.

import { W, WATER_Y, FACES, FRONT_SLOTS, SKY_SLOTS, cellRect, cellAt, validCell } from './layout.js';

export const IDLE_HINT = 'Tap a car for options. Buy a car, then tap a glowing cell.';
const parseList = (v) => (v === '' || v == null ? [] : String(v).split('|').map(Number));

// Turn parsed CSV rows into the lookup tables the sim uses, validating as we go.
export function prepareData(t) {
  const need = (rows, cols, name) => {
    const h = rows[0] ? Object.keys(rows[0]) : [];
    for (const c of cols) if (!h.includes(c)) throw new Error(`${name}: missing column "${c}"`);
  };
  need(t.settings, ['key', 'value'], 'settings.csv');
  need(t.enemies, ['id', 'name', 'emoji', 'lane', 'behavior', 'hp', 'armor', 'speed', 'damage', 'fire_rate', 'stay_s', 'target_rows', 'target_cols', 'charge_dmg', 'charge_break', 'cargo_count', 'cargo_value', 'size'], 'enemies.csv');
  need(t.cars, ['id', 'name', 'emoji', 'tier', 'upgrade_to', 'allowed_facing', 'hp', 'cost', 'damage', 'fire_rate', 'auto', 'collect_radius', 'reel_s', 'lifts'], 'cars.csv');
  need(t.loot, ['id', 'emoji', 'value', 'drift_speed', 'spawn_weight', 'net_ok'], 'loot.csv');
  need(t.waves, ['leg', 'time_s', 'enemy_id', 'count', 'spacing_s'], 'waves.csv');
  need(t.legs, ['leg', 'name', 'preview', 'enemy_hp_mult', 'enemy_dmg_mult', 'loot_mult', 'boss'], 'legs.csv');

  const S = {};
  const DATA = { enemies: {}, cars: {}, loot: [], waves: [], legs: {}, lastLeg: 1 };
  for (const r of t.settings) S[r.key] = r.value;
  for (const r of t.enemies) { r.rows = parseList(r.target_rows); r.cols = parseList(r.target_cols); DATA.enemies[r.id] = r; }
  for (const r of t.cars) { r.allowed = String(r.allowed_facing).split('|'); DATA.cars[r.id] = r; }
  DATA.loot = t.loot;
  DATA.waves = t.waves.slice().sort((a, b) => a.leg - b.leg || a.time_s - b.time_s);
  for (const r of t.legs) DATA.legs[r.leg] = r;
  DATA.lastLeg = Math.max(...t.legs.map((l) => l.leg));

  t.waves.forEach((w, i) => {
    if (!DATA.enemies[w.enemy_id]) throw new Error(`waves.csv data row ${i + 1}: unknown enemy "${w.enemy_id}"`);
    if (!DATA.legs[w.leg]) throw new Error(`waves.csv data row ${i + 1}: leg ${w.leg} is not in legs.csv`);
  });
  t.cars.forEach((c, i) => { if (c.upgrade_to && !DATA.cars[c.upgrade_to]) throw new Error(`cars.csv data row ${i + 1}: unknown upgrade_to "${c.upgrade_to}"`); });
  for (const id of ['engine', 'cannon', 'net']) if (!DATA.cars[id]) throw new Error(`cars.csv: the starting ship needs a "${id}" row`);
  for (const k of ['starting_scrap', 'loot_interval_s', 'tap_radius', 'enemy_tap_radius', 'projectile_speed', 'cargo_drift', 'rescue_hp_pct', 'dock_offers', 'sell_pct', 'reroll_cost', 'leg_calm_s', 'thief_reach', 'charge_wind_s']) {
    if (!(k in S)) throw new Error(`settings.csv: missing key "${k}"`);
  }
  return { DATA, S };
}

export function createSim(DATA, S, opts = {}) {
  const rng = opts.rng || Math.random;
  const LAST_LEG = DATA.lastLeg;
  const sim = { G: null, mode: 'title', clock: 0, events: [], LAST_LEG, DATA, S };
  let G = null;

  const emit = (type, data) => sim.events.push({ type, data });
  const setMode = (m, extra) => { sim.mode = m; emit('mode', { mode: m, ...extra }); };
  const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  const rand = (a, b) => a + rng() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function moveToward(e, tx, ty, speed, dt) {
    const d = dist(e.x, e.y, tx, ty);
    if (d <= speed * dt) { e.x = tx; e.y = ty; return true; }
    e.x += (tx - e.x) / d * speed * dt; e.y += (ty - e.y) / d * speed * dt;
    return false;
  }
  // remove elements that fail keep(), in place, without allocating
  function compact(arr, keep) {
    let w = 0;
    for (let i = 0; i < arr.length; i++) if (keep(arr[i])) arr[w++] = arr[i];
    arr.length = w;
  }

  const allCars = () => G.cars;
  function refreshCars() {
    G.cars.length = 0;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (G.grid[r][c]) G.cars.push(G.grid[r][c]);
  }
  function carCenter(car) {
    const k = cellRect(car.col, car.row, sim.clock);
    return { x: k.cx, y: k.cy + Math.sin(sim.clock * 3 + car.seed) * 1.5 };
  }
  const carFaces = (car) => FACES[car.row][car.col];
  const onGrid = (car) => G.grid[car.row][car.col] === car;
  const engine = () => G.grid[1][1];
  const legDef = () => DATA.legs[G.leg] || { name: `Leg ${G.leg}`, preview: '', enemy_hp_mult: 1, enemy_dmg_mult: 1, loot_mult: 1, boss: false };
  function legEnded() {
    return G.rowIdx >= G.legRows.length && G.pending.length === 0 && G.enemies.length === 0 && !G.loot.some((l) => l.kind === 'car');
  }
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
  const banner = (text, sub = '') => { G.banner = { text, sub, t: 0 }; };
  const sfx = (name) => emit('sfx', name);
  const vibrate = (p) => emit('vibrate', p);

  // ---------- run ----------
  function newRun() {
    G = sim.G = {
      leg: 0, legTime: 0, scrap: S.starting_scrap,
      grid: [[null, null, null], [null, null, null], [null, null, null]], cars: [],
      enemies: [], shots: [], loot: [], texts: [], pending: [], legRows: [], rowIdx: 0,
      calm: 0, lootTimer: 1, shake: 0,
      slow: 0, speed: 1, scroll: 0, dark: 0, pier: { p: 0, leaving: false },
      sparks: [], ripples: [], bubbles: [], reticle: null, banner: null,
      dock: { offers: [], placing: null, selected: null, moving: null },
      stats: { kills: 0, collected: 0, missed: 0, stolen: 0, rescued: 0, lost: 0 },
      legStats: null,
      docks: [],
      hints: { enemyDone: !S.hints, lootDone: !S.hints },
    };
    placeCar(makeCar('engine'), 1, 1);
    placeCar(makeCar('cannon'), 0, 1);
    placeCar(makeCar('net'), 1, 2);
    startLeg(1);
  }
  function makeCar(id) {
    const d = DATA.cars[id];
    if (!d) throw new Error(`unknown car "${id}"`);
    return { def: d, hp: d.hp, cd: rand(0, d.fire_rate || 0), busy: 0, col: 0, row: 0, seed: rng() * 7, flash: 0, recoil: 0 };
  }
  function placeCar(car, col, row) { G.grid[row][col] = car; car.col = col; car.row = row; refreshCars(); }
  function removeCar(car) { if (onGrid(car)) { G.grid[car.row][car.col] = null; refreshCars(); } }

  function startLeg(n) {
    G.leg = n; G.legTime = 0; G.calm = 0; G.lootTimer = 1;
    G.enemies = []; G.shots = []; G.loot = []; G.texts = []; G.pending = [];
    G.legRows = DATA.waves.filter((w) => w.leg === n);
    G.rowIdx = 0;
    G.legStats = { kills: 0, caught: 0, missed: 0, stolen: 0, lost: 0, rescued: 0, engineStart: engine().hp, scrapStart: G.scrap };
    if (G.pier.p >= 1) { G.pier.leaving = true; G.pier.p = 0; }
    setMode('sail');
    banner(legDef().name, `Leg ${n} of ${LAST_LEG}`);
    sfx('leg');
  }

  // ---------- update ----------
  function update(dt) {
    sim.clock += dt;
    if (!G) return;
    if (G.slow > 0) { G.slow -= dt; dt *= 0.3; }
    G.shake = Math.max(0, G.shake - dt * 3);
    for (const t of G.texts) t.t += dt;
    compact(G.texts, (t) => t.t < (t.big ? 1.8 : 0.9));
    for (const s of G.sparks) { s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 320 * dt; }
    compact(G.sparks, (s) => s.t < 0.45);
    for (const r of G.ripples) r.t += dt;
    compact(G.ripples, (r) => r.t < 0.4);
    for (const b of G.bubbles) b.t += dt;
    compact(G.bubbles, (b) => b.t < 0.7 && onGrid(b.car));
    if (G.banner && (G.banner.t += dt) > 2.2) G.banner = null;
    if (G.reticle && (G.reticle.t += dt) > 0.3) G.reticle = null;
    for (const c of G.cars) { c.flash = Math.max(0, c.flash - dt); c.recoil = Math.max(0, c.recoil - dt * 4); }
    const mode = sim.mode;
    const docked = mode === 'summary' || mode === 'dock' || (mode === 'sail' && legEnded() && G.leg < LAST_LEG);
    G.speed += ((docked ? 0 : 1) - G.speed) * Math.min(1, dt * 2.5);
    G.scroll += dt * G.speed;
    const bossUp = G.enemies.some((e) => e.def.size >= 2 && !e.gone && !e.leaving);
    G.dark += ((bossUp ? 1 : 0) - G.dark) * Math.min(1, dt * 1.5);
    if (G.pier.leaving) { G.pier.p += dt * 1.4; if (G.pier.p > 1.6) { G.pier.p = 0; G.pier.leaving = false; } }
    else if (mode === 'sail' && legEnded() && G.leg < LAST_LEG) G.pier.p = Math.min(1, G.pier.p + dt / S.leg_calm_s);
    if (mode !== 'sail') return;

    G.legTime += dt;

    while (G.rowIdx < G.legRows.length && G.legRows[G.rowIdx].time_s <= G.legTime) {
      const w = G.legRows[G.rowIdx++];
      for (let i = 0; i < w.count; i++) G.pending.push({ at: G.legTime + i * (w.spacing_s || 0), id: w.enemy_id });
    }
    compact(G.pending, (p) => { if (p.at <= G.legTime) { spawnEnemy(p.id); return false; } return true; });

    G.lootTimer -= dt;
    if (G.lootTimer <= 0) { spawnFlotsam(); G.lootTimer = S.loot_interval_s * rand(0.7, 1.3); }

    for (const e of G.enemies) updateEnemy(e, dt);
    compact(G.enemies, (e) => !e.gone && !(e.leaving && e.x < -50));

    for (const car of G.cars) {
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

    for (const s of G.shots) s.t += dt;
    for (const s of G.shots) if (s.t >= s.dur) resolveShot(s);
    compact(G.shots, (s) => s.t < s.dur);

    for (const l of G.loot) {
      l.age += dt;
      if (!l.floating) {
        l.vy += 420 * dt; l.y += l.vy * dt; l.x += l.vx * dt;
        if (l.y >= WATER_Y) { l.y = WATER_Y; l.floating = true; l.vx = l.drift; l.age = 0; }
      } else {
        l.x += l.vx * dt * Math.max(0.35, G.speed);
      }
    }
    for (const l of G.loot) if (l.x > W + 24) {
      if (l.kind === 'car') { G.stats.lost++; G.legStats.lost++; say(W - 40, WATER_Y - 30, `${l.car.def.emoji} lost`, '#ffb3a0'); }
      else { G.stats.missed++; G.legStats.missed++; }
    }
    compact(G.loot, (l) => l.x <= W + 24);

    if (engine().hp <= 0) { endRun(false); return; }

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
    if (slot < 0) slot = Math.floor(rng() * slots.length);
    let [hx, hy] = slots[slot];
    if (d.size >= 2) { hx = 62; hy = 268; }
    const hp = Math.round(d.hp * L.enemy_hp_mult);
    G.enemies.push({
      def: d, hp, maxHp: hp, dmg: d.damage * L.enemy_dmg_mult, chargeDmg: d.charge_dmg * L.enemy_dmg_mult,
      x: -40, y: hy, hx, hy, slot, state: 'approach', cd: d.fire_rate * 0.8, held: 0, windT: 0, charged: 0,
      target: null, aim: null, carry: null, leaving: false, gone: false, seed: rng() * 7, flash: 0, kb: 0,
    });
    if (d.size >= 2) { banner(d.name, 'boss'); sfx('boss'); vibrate([40, 60, 40, 60, 120]); }
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
          compact(G.loot, (x) => x !== l);
          e.carry = l; e.target = null; e.state = 'flee';
          say(e.x, e.y - 20, 'snatched!', '#ffb3a0');
          sfx('snatch');
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
        if (e.charged >= d.charge_break) { e.state = 'return'; e.cd = d.fire_rate; say(e.x, e.y - 20 * d.size, 'interrupted!', '#ffffff', true); sfx('interrupt'); sparks(e.x, e.y, 10, '#ffffff'); break; }
        if (e.windT >= S.charge_wind_s) e.state = 'dash';
        break;
      case 'dash': {
        const car = e.target;
        if (!car || !onGrid(car) || car.hp <= 0) { e.state = 'return'; break; }
        const c = carCenter(car);
        if (moveToward(e, c.x - 34, c.y, 520, dt)) { hitCar(car, e.chargeDmg); G.shake = 1.5; sfx('ram'); e.state = 'return'; }
        break;
      }
      default: break;
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
    let r = rng() * total;
    let def = DATA.loot[0];
    for (const l of DATA.loot) { r -= l.spawn_weight; if (r <= 0) { def = l; break; } }
    const value = Math.max(1, Math.round(def.value * legDef().loot_mult));
    G.loot.push({ kind: 'loot', emoji: def.emoji, value, netOk: def.net_ok !== false, x: -20, y: WATER_Y, vx: def.drift_speed, vy: 0, drift: def.drift_speed, floating: true, age: 0, seed: rng() * 7 });
  }

  function pickTargetCar(e) {
    const front = e.def.lane === 'front';
    const lanes = front ? e.def.rows : e.def.cols;
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
    sfx(car.def.damage >= 6 ? 'fireHeavy' : 'fireLight');
    bubble(car, '😤');
  }

  function hitCar(car, dmg) {
    if (!onGrid(car) || car.hp <= 0) return;
    dmg = Math.round(dmg * 10) / 10;
    car.hp = Math.round((car.hp - dmg) * 10) / 10; car.flash = 0.25; G.shake = Math.max(G.shake, 1);
    const c = carCenter(car);
    say(c.x, c.y - 20, `-${dmg}`, '#ffb3a0');
    sparks(c.x - 20, c.y, 7, '#f0503c', 90);
    sfx('hitCar'); vibrate(30);
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
    sfx(armored ? 'armor' : 'hitEnemy');
    if (e.hp <= 0) killEnemy(e);
  }
  function destroyCar(car) {
    if (car.def.id === 'engine') { car.hp = 0; return; }
    const c = carCenter(car);
    removeCar(car);
    G.loot.push({ kind: 'car', car, emoji: car.def.emoji, value: 0, netOk: true, x: c.x, y: c.y, vx: rand(-20, 20), vy: -60, drift: S.cargo_drift, floating: false, age: 0, seed: rng() * 7 });
    say(c.x, c.y, `${car.def.emoji} overboard!`, '#ffb3a0', true);
    sparks(c.x, c.y, 14, '#5a4030', 140);
    G.slow = 0.35;
    sfx('overboard'); vibrate([60, 40, 90]);
  }
  function killEnemy(e) {
    compact(G.enemies, (x) => x !== e);
    G.stats.kills++; G.legStats.kills++;
    sparks(e.x, e.y, e.def.size >= 2 ? 30 : 12, '#ffd08a', e.def.size >= 2 ? 220 : 150);
    if (e.def.size >= 2) { sfx('bossDown'); G.slow = 0.35; G.shake = 2; vibrate([80, 40, 80, 40, 160]); } else sfx('kill');
    const value = Math.max(1, Math.round(e.def.cargo_value * legDef().loot_mult));
    for (let i = 0; i < e.def.cargo_count; i++) {
      G.loot.push({ kind: 'loot', emoji: '💰', value, netOk: true, x: e.x + rand(-14, 14), y: e.y, vx: rand(-25, 25), vy: rand(-140, -40), drift: S.cargo_drift, floating: false, age: 0, seed: rng() * 7 });
    }
    if (e.carry) { const l = e.carry; l.x = e.x; l.y = e.y; l.vx = 0; l.vy = -40; l.floating = false; l.age = 0; G.loot.push(l); e.carry = null; }
    say(e.x, e.y, e.def.size >= 2 ? `${e.def.name} down!` : 'cargo!', '#ffffff', e.def.size >= 2);
  }
  function collect(l, by) {
    if (!G.loot.includes(l)) return;
    compact(G.loot, (x) => x !== l);
    if (l.kind === 'loot') {
      G.scrap += l.value; G.stats.collected++; G.legStats.caught++;
      if (by === 'hand') G.hints.lootDone = true;
      say(l.x, l.y - 16, `+${l.value}`, by === 'hand' ? '#ffffff' : '#bfe6f5');
      sparks(l.x, l.y, 5, '#bfe6f5', 70);
      if (by === 'hand') sfx('grab'); else { sfx('net'); bubble(by, '😊'); }
    } else {
      const car = l.car;
      if (G.grid[car.row][car.col]) { G.stats.lost++; G.legStats.lost++; return; }
      car.hp = Math.max(1, Math.round(car.def.hp * S.rescue_hp_pct));
      placeCar(car, car.col, car.row);
      car.flash = 0.4;
      G.stats.rescued++; G.legStats.rescued++;
      say(l.x, l.y - 16, `${car.def.emoji} rescued!`, '#ffffff', true);
      sparks(l.x, l.y, 16, '#ffffff', 160);
      sfx('rescue'); vibrate([30, 30, 30]);
      bubble(car, '😅');
      if (by !== 'hand') bubble(by, '💪');
    }
  }

  function endRun(win) {
    G.win = win;
    setMode('end', { win });
    if (win) sfx('win'); else { sfx('gameOver'); vibrate([200, 80, 300]); }
  }
  function endLeg() {
    G.docks.push({ leg: G.leg, scrap: G.scrap, engineHp: engine().hp, ...G.legStats });
    setMode('summary');
    sfx('dock');
  }

  // ---------- dock ----------
  function rollOffers() {
    const pool = Object.values(DATA.cars).filter((d) => d.id !== 'engine' && d.tier === 1);
    let picks = shuffle(pool).slice(0, S.dock_offers);
    const g = S.dock1_guaranteed;
    if (G.leg === 1 && g && DATA.cars[g] && !picks.some((d) => d.id === g)) picks = [DATA.cars[g], ...picks.slice(0, S.dock_offers - 1)];
    G.dock.offers = picks.map((def) => ({ def, sold: false }));
  }
  const dockHint = (hint) => emit('dock', hint);
  function openDock() {
    if (sim.mode !== 'summary') return;
    for (const car of G.cars) if (car.def.id !== 'engine') car.hp = car.def.hp;
    rollOffers();
    G.dock.placing = null; G.dock.selected = null; G.dock.moving = null;
    setMode('dock');
    dockHint(IDLE_HINT);
  }
  function chooseOffer(i) {
    const d = G.dock, o = d.offers[i];
    if (!o || o.sold) return;
    if (d.placing === o) { d.placing = null; dockHint(IDLE_HINT); return; }
    if (G.scrap < o.def.cost) { dockHint(`Not enough scrap for the ${o.def.name}.`); return; }
    d.placing = o; d.selected = null; d.moving = null;
    dockHint(`Tap a glowing cell to place the ${o.def.name}.`);
  }
  function reroll() {
    if (G.scrap < S.reroll_cost) return;
    G.scrap -= S.reroll_cost; rollOffers(); G.dock.placing = null;
    dockHint('New offers.');
  }
  function upgrade() {
    const sel = G.dock.selected;
    const up = sel && sel.def.upgrade_to ? DATA.cars[sel.def.upgrade_to] : null;
    if (!up || G.scrap < up.cost) return;
    G.scrap -= up.cost;
    const ratio = sel.hp / sel.def.hp;
    sel.def = up; sel.hp = Math.max(1, Math.round(up.hp * ratio));
    G.dock.selected = null;
    dockHint(`Upgraded to ${up.name}.`);
  }
  function startMove() {
    const sel = G.dock.selected;
    if (!sel) return;
    G.dock.moving = sel; G.dock.selected = null;
    dockHint(`Moving the ${sel.def.name}. Tap a glowing cell.`);
  }
  function sell() {
    const sel = G.dock.selected;
    if (!sel) return;
    const refund = Math.round(sel.def.cost * S.sell_pct);
    G.scrap += refund;
    removeCar(sel);
    G.dock.selected = null;
    dockHint(`Sold the ${sel.def.name} for ${refund} scrap.`);
  }
  function sail() { if (sim.mode === 'dock') startLeg(G.leg + 1); }
  function dockTap(x, y) {
    const d = G.dock;
    const cell = cellAt(x, y, sim.clock);
    if (!cell) return;
    const here = G.grid[cell.row][cell.col];
    if (d.placing) {
      if (here || !validCell(d.placing.def, cell.col, cell.row)) { dockHint(`The ${d.placing.def.name} cannot go there.`); return; }
      G.scrap -= d.placing.def.cost;
      placeCar(makeCar(d.placing.def.id), cell.col, cell.row);
      d.placing.sold = true; d.placing = null;
      dockHint('Placed. ' + IDLE_HINT);
      return;
    }
    if (d.moving) {
      const car = d.moving;
      if (here === car) { d.moving = null; dockHint(IDLE_HINT); return; }
      if (!validCell(car.def, cell.col, cell.row) || (here && !validCell(here.def, car.col, car.row))) { dockHint('That swap does not fit the facings.'); return; }
      const from = { col: car.col, row: car.row };
      G.grid[from.row][from.col] = null;
      if (here) placeCar(here, from.col, from.row);
      placeCar(car, cell.col, cell.row);
      d.moving = null;
      dockHint('Moved. ' + IDLE_HINT);
      return;
    }
    if (here && here.def.id !== 'engine') {
      d.selected = d.selected === here ? null : here;
      dockHint(d.selected ? 'Upgrade, move or sell it. Tap it again to cancel.' : IDLE_HINT);
    } else if (d.selected) { d.selected = null; dockHint(IDLE_HINT); }
  }

  // ---------- input ----------
  function tap(x, y) {
    if (!G) return;
    if (sim.mode === 'dock') { dockTap(x, y); return; }
    if (sim.mode !== 'sail') return;
    G.ripples.push({ x, y, t: 0 });
    sfx('tap');
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
      for (const car of G.cars) {
        if (car.def.auto || !canTarget(car, hit)) continue;
        ready++;
        if (car.cd <= 0) fireCar(car, hit);
      }
      if (!ready) say(hit.x, hit.y + 24, 'no gun faces it', '#ffe0b3');
      return;
    }
    let item = null, id = Infinity;
    for (const l of G.loot) {
      if (!l.floating) continue;
      const d = dist(x, y, l.x, l.y);
      if (d < S.tap_radius && d < id) { id = d; item = l; }
    }
    if (item) collect(item, 'hand');
  }
  function pause() { if (sim.mode === 'sail') setMode('paused'); }
  function resume() { if (sim.mode === 'paused') setMode('sail'); }

  Object.assign(sim, {
    newRun, startLeg, update, tap, pause, resume,
    openDock, chooseOffer, reroll, upgrade, startMove, sell, sail,
    legEnded, legDef, engine, canTarget, carCenter,
    // test helpers
    give: (id, col, row) => placeCar(makeCar(id), col, row),
    takeEvents() { const ev = sim.events; sim.events = []; return ev; },
  });
  return sim;
}
