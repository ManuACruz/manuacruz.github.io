// Boot: load tables, wire the simulation to the renderer, the overlays, audio and input.
import { loadCSV } from './csv.js';
import { prepareData, createSim } from './sim.js';
import { createRenderer } from './render.js';
import { createUI } from './ui.js';
import { sfx, unlock, isMuted, setMuted, vibrate } from './audio.js';
import { mulberry32 } from './rng.js';
import { W, H } from './layout.js';

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const stage = $('stage');

const STEP = 1 / 60;
let sim = null, renderer = null, ui = null;
let acc = 0, last = 0;
const frameTimes = [];

// Sounds and vibration happen here, where the page can; the sim only asks for them.
function dispatch() {
  for (const ev of sim.takeEvents()) {
    if (ev.type === 'sfx') sfx[ev.data]?.();
    else if (ev.type === 'vibrate') vibrate(ev.data);
    else ui.handle(ev);
  }
}

function frame(ts) {
  const dt = Math.min(0.1, (ts - last) / 1000 || 0);
  last = ts;
  frameTimes.push(dt); if (frameTimes.length > 120) frameTimes.shift();
  acc += dt;
  let n = 0;
  while (acc >= STEP && n < 6) { sim.update(STEP); acc -= STEP; n++; }
  if (n === 6) acc = 0; // fell far behind: drop time instead of spiralling
  dispatch();
  renderer.draw();
  requestAnimationFrame(frame);
}

canvas.addEventListener('pointerdown', (ev) => {
  ev.preventDefault();
  unlock();
  if (!sim) return;
  const r = canvas.getBoundingClientRect();
  sim.tap((ev.clientX - r.left) / r.width * W, (ev.clientY - r.top) / r.height * H);
  dispatch();
});
// touch pointerdown is not a user activation for audio on every browser; retry on real gestures too
stage.addEventListener('click', unlock);
stage.addEventListener('touchend', unlock, { passive: true });

document.addEventListener('visibilitychange', () => {
  if (document.hidden && sim) { sim.pause(); dispatch(); }
});
$('resume').addEventListener('click', () => {
  if (!sim) return;
  sim.resume(); dispatch();
  last = performance.now(); acc = 0;
});
const muteBtn = $('mute');
const paintMute = () => { muteBtn.textContent = isMuted() ? '🔇' : '🔊'; muteBtn.setAttribute('aria-label', isMuted() ? 'Unmute' : 'Mute'); };
muteBtn.addEventListener('click', () => { setMuted(!isMuted()); paintMute(); });
paintMute();

async function boot() {
  const names = ['settings', 'enemies', 'cars', 'loot', 'waves', 'legs'];
  const rows = await Promise.all(names.map((n) => loadCSV(`data/${n}.csv`)));
  const tables = Object.fromEntries(names.map((n, i) => [n, rows[i]]));
  const { DATA, S } = prepareData(tables);

  const seedParam = new URLSearchParams(location.search).get('seed');
  const seed = seedParam ? Number(seedParam) : (Date.now() % 1e9);
  sim = createSim(DATA, S, { rng: mulberry32(seed) });
  ui = createUI(sim, { onAgain: () => { sim.newRun(); dispatch(); } });
  renderer = createRenderer(canvas, stage, sim);
  window.addEventListener('resize', renderer.resize);
  renderer.resize();

  $('loadmsg').textContent = `${Object.keys(DATA.cars).length} cars · ${Object.keys(DATA.enemies).length} enemies · ${DATA.waves.length} wave rows · ${sim.LAST_LEG} legs · seed ${seed}`;
  $('start').addEventListener('click', () => {
    unlock();
    try { document.documentElement.requestFullscreen?.({ navigationUI: 'hide' })?.catch(() => {}); } catch (e) { /* not supported */ }
    sim.newRun(); dispatch();
  });

  // Debug and tooling hook. SKY.step(5) advances the game five seconds in fixed ticks and redraws.
  window.SKY = {
    S, DATA, seed,
    get sim() { return sim; },
    get G() { return sim.G; },
    get mode() { return sim.mode; },
    start: () => { sim.newRun(); dispatch(); },
    tap: (x, y) => { sim.tap(x, y); dispatch(); },
    toDock: () => { sim.openDock(); dispatch(); },
    jump: (leg) => { if (sim.G) { sim.startLeg(leg); dispatch(); } },
    give: (id, col, row) => sim.give(id, col, row),
    fps: () => { const s = frameTimes.reduce((a, b) => a + b, 0); return s ? Math.round(frameTimes.length / s) : 0; },
    step(seconds = 1, tick = STEP) {
      for (let t = 0; t < seconds; t += tick) sim.update(tick);
      dispatch();
      renderer.draw();
      const G = sim.G;
      return { mode: sim.mode, leg: G?.leg, legTime: G?.legTime?.toFixed(1), scrap: G?.scrap, enemies: G?.enemies.length, loot: G?.loot.length, engineHp: G ? sim.engine().hp : null };
    },
  };
  requestAnimationFrame(frame);
}

boot().catch((err) => {
  $('loadmsg').textContent = `Could not load data: ${err.message}`;
  console.error(err);
});
