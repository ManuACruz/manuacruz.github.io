// Hopper: loop, input, camera, drawing, help and flow.
import { T } from './tune.js';
import { LEVELS } from './levels.js';
import { Sim, scaleLevel, playSolution, sameSituation, goalSlots, STEP, R, PIN_R, ITEM_R, GOAL_W, GOAL_H } from './sim.js';
import { CamSpots, levelFits, viewScale } from './cam.js';
import { tween, after, ease, lerp, clamp, rand, pick, burst, ring, confetti, emit, particles, updateTweens, updateParticles, drawParticles, shake, addShake, updateShake, killTweens } from './fx.js';
import { sfx, unlock } from './audio.js';
import { Blob } from './blob.js';
import { Album, roundRect, drawHand } from './album.js';
import { drawEmoji, emoji, UI_FONT } from './sprites.js';
import { initUI } from './ui.js';
import { album, levelStickers } from './stickers.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const stage = document.getElementById('stage');

const PIN_COL = { A: '#ff9f1c', B: '#2ec4b6', C: '#9b5de5' };
const PIN_DARK = { A: '#b86a00', B: '#178a80', C: '#6430a8' };

const G = {
  mode: 'title',
  li: 0,
  L: null,
  sim: null,
  spots: null,
  fits: true,
  W: 0, H: 0, dpr: 1, s: 1, rot: false,
  cam: { x: 0, y: 0, z: 1 },
  camT: { x: 0, y: 0, z: 1 },
  camRate: 4,
  acc: 0,
  hitstop: 0,
  time: 0,
  paused: false,
  blob: new Blob(),
  album: null,
  pinFx: {},
  hud: [],
  flyers: [],
  goalFx: [],
  slotFill: {},
  spent: new Set(),
  help: null,
  swipe: null,
  trail: [],
  pointer: null,
  wipe: null,
  banner: null,
  lostT: 0,
  intro: null,
  lookT: 0,
  look: null,
  lastSwingSign: 0,
  progress: 0,
};

try {
  G.progress = Number(localStorage.getItem('hopper.progress')) || 0;
} catch {}

// ---------- stage, resize, portrait rotation ----------
function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  G.rot = vh > vw;
  G.W = G.rot ? vh : vw;
  G.H = G.rot ? vw : vh;
  stage.style.width = G.W + 'px';
  stage.style.height = G.H + 'px';
  stage.style.setProperty('--sh', G.H + 'px');
  stage.style.transform = G.rot ? 'rotate(90deg) translateY(-100%)' : 'none';
  G.dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(G.W * G.dpr);
  canvas.height = Math.round(G.H * G.dpr);
  G.s = viewScale(G.W, G.H, T);
  if (G.L) G.fits = levelFits(G.L, G.W, G.H, T);
}
window.addEventListener('resize', resize);
resize();

function toStage(e) {
  return G.rot ? { x: e.clientY, y: window.innerWidth - e.clientX } : { x: e.clientX, y: e.clientY };
}

const S = () => G.s * G.cam.z;
function w2s(x, y) {
  const s = S();
  return { x: (x - G.cam.x) * s + G.W / 2, y: (y - G.cam.y) * s + G.H / 2 };
}

// ---------- level ----------
function loadLevel(i) {
  G.li = (i + LEVELS.length) % LEVELS.length;
  G.party = null;
  G.banner = null;
  ui.showNext(false);
  const L = (G.L = scaleLevel(LEVELS[G.li]));
  G.sim = new Sim(L, T);
  G.spots = new CamSpots(L, T);
  G.fits = levelFits(L, G.W, G.H, T);
  G.album = null;
  G.flyers = [];
  G.slotFill = {};
  G.spent = new Set();
  G.pinFx = {};
  for (const p of L.pins) G.pinFx[p.id] = { s: 1, rot: 0, ph: rand(0, 6) };
  G.hud = L.items.map((it) => ({ id: it.id, kind: it.kind, s: 1, got: false }));
  G.goalFx = L.goals.map(() => ({ s: 1, shake: 0, flag: 0, done: false }));
  killTweens(G.blob);
  G.blob.reset(G.sim.ch.x, G.sim.ch.y);
  G.blob.onStep = onStep;
  G.sim.events.length = 0;
  G.lostT = 0;
  G.wipe = null;
  // help: record the situation before each step of the solution; and the camera route for the opening
  const spots = new CamSpots(L, T);
  const route = [];
  const res = playSolution(L, T, (sim) => route.push(spots.update(sim)));
  if (!res.ok) console.warn('Hopper: solution does not finish', L.name, res.error);
  G.help = { rec: res.rec, idle: 0, step: null, t: 0 };
  G.route = route.filter((s, k) => s >= 0 && s !== route[k - 1]);
  placeCameraOnGoal();
}

function stick(id) {
  const it = G.L.items.find((i) => i.id === id);
  return G.L.stickers[it.kind];
}

// ---------- camera ----------
function levelCenter() {
  return { x: G.L.w / 2, y: G.L.h / 2, z: 1 };
}

function playCamTarget() {
  if (G.fits) return levelCenter();
  const i = G.spots.update(G.sim);
  const r = G.spots.rects[i];
  return { x: r.cx, y: r.cy, z: r.z };
}

function goalSpot() {
  const g = G.L.goals[G.L.goals.length - 1];
  if (G.fits) return { x: g.x, y: g.y - 90, z: 1.35 };
  const r = G.spots.rects[G.spots.spotFor(g.x, g.y)];
  return { x: r.cx, y: r.cy, z: r.z };
}

function placeCameraOnGoal() {
  Object.assign(G.cam, goalSpot());
  Object.assign(G.camT, G.cam);
}

function snapCamera() {
  Object.assign(G.camT, playCamTarget());
  Object.assign(G.cam, G.camT);
}

function updateCamera(dt) {
  if (G.mode === 'play' || G.mode === 'wipe') Object.assign(G.camT, playCamTarget());
  if (G.mode === 'intro') return;
  const k = 1 - Math.exp(-dt * G.camRate);
  G.cam.x += (G.camT.x - G.cam.x) * k;
  G.cam.y += (G.camT.y - G.cam.y) * k;
  G.cam.z += (G.camT.z - G.cam.z) * k;
}

// ---------- opening ----------
function startIntro() {
  G.mode = 'intro';
  G.btnShown = true;
  ui.showButtons(true);
  showBanner();
  const g = goalSpot();
  Object.assign(G.cam, g);
  if (G.fits) {
    const c = levelCenter();
    G.intro = { t: 0, total: T.introT, path: null };
    tween(G.cam, c, T.introT * 0.38, { delay: T.introT * 0.62, ease: ease.cubicInOut, done: endIntro });
  } else {
    const pts = [{ x: g.x, y: g.y, z: g.z }];
    const rev = G.route.slice().reverse();
    for (const i of rev) {
      const r = G.spots.rects[i];
      const last = pts[pts.length - 1];
      if (Math.hypot(r.cx - last.x, r.cy - last.y) > 1) pts.push({ x: r.cx, y: r.cy, z: r.z });
    }
    const end = playCamTarget();
    const last = pts[pts.length - 1];
    if (Math.hypot(end.x - last.x, end.y - last.y) > 1) pts.push({ x: end.x, y: end.y, z: end.z });
    let len = 0;
    for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    const dur = clamp(len / T.panSpeed, 0.6, 3);
    G.intro = { t: 0, path: pts, len, dur, hold: T.introHold };
  }
  Object.assign(G.camT, G.cam);
  G.camRate = T.camSmooth;
}

function updateIntro(dt) {
  const it = G.intro;
  if (!it || !it.path) return;
  it.t += dt;
  const k = clamp((it.t - it.hold) / it.dur, 0, 1);
  const d = ease.cubicInOut(k) * it.len;
  let acc = 0;
  const P = it.path;
  for (let i = 1; i < P.length; i++) {
    const seg = Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y);
    if (acc + seg >= d || i === P.length - 1) {
      const f = seg ? clamp((d - acc) / seg, 0, 1) : 1;
      G.cam.x = lerp(P[i - 1].x, P[i].x, f);
      G.cam.y = lerp(P[i - 1].y, P[i].y, f);
      G.cam.z = lerp(P[i - 1].z, P[i].z, f);
      break;
    }
    acc += seg;
  }
  if (P.length === 1) Object.assign(G.cam, P[0]);
  if (k >= 1) endIntro();
}

function endIntro() {
  if (G.mode !== 'intro') return;
  killTweens(G.cam);
  G.mode = 'play';
  G.intro = null;
  snapCamera();
  G.help.idle = 0;
}

function showBanner() {
  const b = (G.banner = { y: -120, a: 1, s: 0.6, sub: `Level ${G.li + 1}`, title: G.L.title });
  tween(b, { y: 0, s: 1 }, 0.5, { ease: ease.backOut });
  tween(b, { y: -140, a: 0 }, 0.35, { delay: 1.9, ease: ease.backIn, done: () => G.banner === b && (G.banner = null) });
}

// ---------- input ----------
canvas.addEventListener('pointerdown', (e) => {
  if (G.pointer !== null) return; // one finger only
  G.pointer = e.pointerId;
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch {}
  unlock();
  const p = toStage(e);
  if (G.mode === 'intro') return endIntro();
  if (G.album) return G.album.down(p.x, p.y);
  if (G.mode !== 'play' || G.paused) return;
  tapAt(p.x, p.y);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId !== G.pointer) return;
  const p = toStage(e);
  if (G.album) return G.album.move(p.x, p.y);
  const sw = G.swipe;
  if (!sw) return;
  G.trail.push({ x: p.x, y: p.y, t: G.time });
  if (sw.done) return;
  const up = sw.y0 - p.y, dx = p.x - sw.x0;
  if (up >= T.swipeMin * Math.max(1, G.H / 420) && up > 0.55 * Math.abs(dx)) {
    sw.done = true;
    const lean = (Math.atan2(dx, up) * 180) / Math.PI;
    if (G.sim.swipe(lean)) G.help.idle = 0;
  }
});
function release(e) {
  if (e.pointerId !== G.pointer) return;
  G.pointer = null;
  const p = toStage(e);
  if (G.album) G.album.up(p.x, p.y);
  G.swipe = null;
}
canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);

function pinAt(x, y) {
  let best = null, bd = Math.max(44, 63 * S());
  for (const p of G.L.pins) {
    const q = w2s(p.cx, p.cy);
    if (q.x < 0 || q.y < 0 || q.x > G.W || q.y > G.H) continue;
    const d = Math.hypot(q.x - x, q.y - y);
    if (d <= bd) {
      bd = d;
      best = p;
    }
  }
  return best;
}

function tapAt(x, y) {
  if (G.sim.ended) return;
  const p = pinAt(x, y);
  if (p) {
    if (G.sim.tapPin(p)) G.help.idle = 0;
    return;
  }
  G.swipe = { x0: x, y0: y, done: false };
  G.trail = [{ x, y, t: G.time }];
  ring(x, y, { size: 6, size1: 26, color: 'rgba(255,255,255,0.8)', width: 3, screen: true, life: 0.25 });
}

const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (G.album && !ui.settingsOpen()) {
    if (!e.repeat) G.album.key(e.key);
    if (e.key !== 'Escape' || G.album.mode === 'browse') return;
  }
  if (e.key === 'Escape') return ui.toggleSettings();
  if (e.repeat) return;
  unlock();
  if (G.mode === 'intro' && (e.key === ' ' || e.key === 'Enter')) return endIntro();
  if (G.mode !== 'play' || G.paused) return;
  if (e.key === 'ArrowUp' || e.key === ' ') {
    const lean = keys.ArrowLeft ? -35 : keys.ArrowRight ? 35 : 0;
    if (G.sim.swipe(lean)) G.help.idle = 0;
    e.preventDefault();
  } else if (/^[1-9]$/.test(e.key)) {
    const p = G.L.pins[Number(e.key) - 1];
    if (p && G.sim.tapPin(p)) G.help.idle = 0;
  } else if (e.key === 'r' || e.key === 'R') restart();
});
window.addEventListener('keyup', (e) => (keys[e.key] = false));

// ---------- sim events -> juice ----------
const HS = (t) => (G.hitstop = Math.max(G.hitstop, t * T.hitstop));
const SH = (a) => addShake(a);

function popPin(pin, big = 1.4) {
  const f = G.pinFx[pin.id];
  killTweens(f, 's');
  f.s = big;
  tween(f, { s: 1 }, 0.5, { ease: ease.elasticOut });
}

function handleEvents() {
  const sim = G.sim, B = G.blob, ch = sim.ch;
  for (const ev of sim.events) {
    switch (ev.type) {
      case 'tap':
        if (ev.pin.t === 'C') {
          popPin(ev.pin, 1.35);
          ring(ev.pin.cx, ev.pin.cy, { size: 20, size1: 70, color: PIN_COL.C, width: 6 });
          sfx.tap();
        }
        break;
      case 'flight': {
        const p = ev.pin;
        if (ev.from && ev.from !== p) sfx.slurp();
        B.grab(p);
        sfx.tongue();
        after(0.06, () => {
          sfx.flight();
          popPin(p, 1.45);
          ring(p.cx, p.cy, { size: 26, size1: 80, color: PIN_COL[p.t], width: 7 });
          burst(p.cx, p.cy, 6, { kind: 'dot', color: '#ffd6e5', speed: 260, size: 5, g: 300 });
        });
        B.stretch(3);
        B.setMood('idle');
        break;
      }
      case 'arrive': {
        const p = ev.pin;
        sfx.arrive();
        const f = G.pinFx[p.id];
        killTweens(f, 's');
        f.s = 0.75;
        tween(f, { s: 1 }, 0.45, { ease: ease.elasticOut });
        B.squash(p.t === 'A' ? 3 : 1.5);
        B.tongue.whip = 0.6;
        break;
      }
      case 'bump': {
        sfx.bump();
        if (B.release()) sfx.slurp();
        const d = Math.hypot(ev.dx, ev.dy) || 1;
        const cx = ev.x + (ev.dx / d) * R, cy = ev.y + (ev.dy / d) * R;
        burst(cx, cy, 10, { kind: 'star', color: ['#ffd23f', '#fff', '#ff9f1c'], speed: 380, size: 9, g: 500 });
        ring(cx, cy, { size: 10, size1: 60, color: '#fff', width: 6 });
        SH(0.45);
        HS(0.08);
        B.squash(5);
        B.setMood('dizzy', 1.1);
        break;
      }
      case 'jump': {
        sfx.jump();
        if (B.release()) sfx.slurp();
        B.stretch(5);
        if (ev.ground) dust(ch.x, ch.y + R, 7, 1);
        break;
      }
      case 'drop':
        sfx.drop();
        if (B.release()) sfx.slurp();
        popPin(ev.pin, 1.35);
        ring(ev.pin.cx, ev.pin.cy, { size: 20, size1: 70, color: PIN_COL.C, width: 6 });
        B.stretch(1.5);
        break;
      case 'land': {
        const k = clamp(ev.speed / 1300, 0, 1);
        sfx.land(k);
        dust(ch.x, ch.y + R, 4 + Math.round(10 * k), 0.6 + k);
        B.squash(2.5 + 6 * k);
        if (k > 0.55) SH(0.22 * k);
        if (B.mood === 'scared') B.setMood('idle');
        break;
      }
      case 'hit':
        if (ev.speed > 500) {
          sfx.bump();
          burst(ev.x, ev.y, 6, { kind: 'star', color: ['#ffd23f', '#fff'], speed: 260, size: 7, g: 400 });
          SH(0.2);
          B.squash(2);
        }
        break;
      case 'wall':
        sfx.no();
        B.squash(2);
        B.setMood('scared', 0.5);
        emit({ x: ch.x - ev.dir * 20, y: ch.y - 60, vx: -ev.dir * 60, vy: -120, g: 600, kind: 'puff', color: '#7cc7ff', size: 6, size1: 3, life: 0.6 });
        emit({ x: ch.x, y: ch.y - 80, vy: -60, drag: 3, kind: 'text', text: '!', color: '#ffd23f', size: 34, size1: 34, life: 0.7 });
        break;
      case 'edge':
        B.setMood('scared', 0.6);
        break;
      case 'no': {
        sfx.no();
        const f = G.pinFx[ev.pin.id];
        killTweens(f, 'rot');
        f.rot = 0;
        tween(f, { rot: 1 }, 0.4, { ease: ease.linear, update: (o, k) => (o.wob = Math.sin(k * Math.PI * 6) * (1 - k) * 0.35), done: (o) => (o.wob = 0) });
        break;
      }
      case 'item':
        collect(ev.item);
        break;
      case 'swingBlock':
        sfx.bump();
        B.squash(1.5);
        break;
      case 'won':
        onWon(ev.goal);
        break;
      case 'lost':
        onLost(ev.goal, ev.missing);
        break;
      case 'dead':
        sfx.fall();
        B.setMood('scared', 2);
        B.release();
        after(0.15, () => G.mode === 'play' && startWipe());
        break;
    }
  }
  sim.events.length = 0;
}

function onStep() {
  sfx.step();
  const ch = G.sim.ch;
  dust(ch.x - ch.face * 14, ch.y + R, 1, 0.35);
}

function dust(x, y, n, k = 1) {
  for (let i = 0; i < n; i++) {
    const side = i % 2 ? 1 : -1;
    emit({
      x: x + side * rand(4, 22), y: y - rand(0, 6), vx: side * rand(60, 260) * k, vy: -rand(20, 120) * k,
      g: -80, drag: 4, kind: 'puff', color: 'rgba(255,255,255,0.9)', size: rand(6, 12) * (0.6 + k * 0.5), size1: 1, life: rand(0.35, 0.6),
    });
  }
}

function collect(it) {
  sfx.item();
  HS(0.045);
  G.help.idle = 0;
  G.blob.setMood('happy', 0.7);
  burst(it.x, it.y, 14, { kind: 'star', color: ['#ffd23f', '#ffffff', '#ff8fab', '#7bdff2'], speed: 480, size: 8, g: 200 });
  ring(it.x, it.y, { size: 20, size1: 90, color: '#ffd23f', width: 7 });
  const from = w2s(it.x, it.y);
  const h = G.hud.find((q) => q.id === it.id);
  G.flyers.push({
    e: stick(it.id), x: from.x, y: from.y, fx: from.x, fy: from.y, to: () => hudPos(G.hud.indexOf(h)), k: 0, dur: 0.6, s0: 2.2, s1: 1, rot: 0, arc: -120,
    done: () => {
      h.got = true;
      h.s = 1.6;
      tween(h, { s: 1 }, 0.5, { ease: ease.elasticOut });
      sfx.pick();
      const p = hudPos(G.hud.indexOf(h));
      burst(p.x, p.y, 8, { kind: 'star', color: ['#ffd23f', '#fff'], speed: 220, size: 6, g: 200, screen: true });
    },
  });
}

// ---------- winning, losing, restarting ----------
function onWon(goal) {
  if (goal.i < G.L.goals.length - 1) return onMail(goal);
  G.mode = 'win';
  const B = G.blob, sim = G.sim;
  sfx.goal();
  B.setMood('happy', 99);
  const gf = G.goalFx[goal.i];
  gf.s = 1.3;
  tween(gf, { s: 1 }, 0.6, { ease: ease.elasticOut });
  confetti(goal.x, goal.y - GOAL_H, 30, { screen: false, speed: 900 });
  // camera: zoom in, goal in the left quarter
  const z = 1.2, ws = G.W / G.s, hs = G.H / G.s;
  Object.assign(G.camT, { x: goal.x + (0.375 * ws) / z, y: goal.y - (0.16 * hs) / z, z });
  G.camRate = 3.2;
  slideBeside(goal);
  // the level's stickers are won: into the pocket until they're stuck in the album
  const keys = levelStickers(G.li);
  album.addToPocket(keys);
  // items fly from the HUD into the slots above the goal
  const slots = goalSlots(goal);
  slots.forEach((sl, i) => {
    after(0.3 + i * 0.18, () => {
      const hi = G.hud.findIndex((h) => h.id === sl.id);
      const from = hudPos(hi);
      G.spent.add(sl.id);
      G.flyers.push({
        e: stick(sl.id), x: from.x, y: from.y, fx: from.x, fy: from.y, to: () => w2s(sl.x, sl.y), k: 0, dur: 0.6, s0: 1, s1: 1.25, rot: 0, arc: -90,
        done: () => {
          G.slotFill[sl.id] = { s: 1.5 };
          tween(G.slotFill[sl.id], { s: 1 }, 0.5, { ease: ease.elasticOut });
          sfx.pick();
          burst(sl.x, sl.y, 8, { kind: 'star', color: ['#ffd23f', '#fff'], speed: 250, size: 6, g: 200 });
        },
      });
    });
  });
  const todo = keys.filter((k) => !album.placed(k));
  after(todo.length ? 1.5 : 1.3, () => (todo.length ? openBook(todo) : finishLevel()));
}

// slide to 74 px left of the goal
function slideBeside(goal) {
  const ch = G.sim.ch;
  const tx = goal.x - 74;
  ch.face = tx < ch.x ? -1 : 1;
  tween(ch, { x: tx }, 0.5, { ease: ease.cubicInOut, done: () => (ch.face = 1) });
}

// A goal before the last is a mailbox: the stickers are posted, the flag goes up, the checkpoint is saved, play on.
function onMail(goal) {
  G.mode = 'win';
  const sim = G.sim;
  sfx.goal();
  G.blob.setMood('happy', 1.5);
  const gf = G.goalFx[goal.i];
  gf.s = 1.25;
  tween(gf, { s: 1 }, 0.6, { ease: ease.elasticOut });
  slideBeside(goal);
  const ids = goal.items;
  ids.forEach((id, i) => {
    after(0.25 + i * 0.16, () => {
      const hi = G.hud.findIndex((h) => h.id === id);
      const from = hudPos(hi);
      G.spent.add(id);
      G.flyers.push({
        e: stick(id), x: from.x, y: from.y, fx: from.x, fy: from.y, to: () => w2s(goal.x, goal.y + MAIL.top + MAIL.w * 0.4), k: 0, dur: 0.55, s0: 1, s1: 0.35, rot: 0, arc: -110,
        done: () => {
          sfx.pick();
          gf.s = 1.15;
          tween(gf, { s: 1 }, 0.35, { ease: ease.elasticOut });
        },
      });
    });
  });
  after(0.25 + ids.length * 0.16 + 0.6, () => {
    gf.done = true;
    tween(gf, { flag: 1 }, 0.6, { ease: ease.elasticOut });
    sfx.mail();
    burst(goal.x, goal.y - GOAL_H, 12, { kind: 'star', color: ['#ffd23f', '#fff', '#ff5d8f'], speed: 320, size: 7, g: 300 });
    after(0.55, () => {
      if (G.mode !== 'win') return;
      sim.completeGoal();
      sim.events.length = 0;
      G.mode = 'play';
      G.camRate = T.camSmooth;
      Object.assign(G.camT, playCamTarget());
      G.blob.setMood('happy', 0.8);
      G.help.idle = 0;
    });
  });
}

function openBook(keys) {
  if (G.mode !== 'win') return;
  G.mode = 'board';
  G.album = new Album({
    mode: 'level',
    keys,
    onHat: setHat,
    onClose: () => {
      G.album = null;
      finishLevel();
    },
  });
}

// The album screen (from the title or the settings).
function openBrowse() {
  if (G.album || !['title', 'play', 'party'].includes(G.mode)) return;
  const from = G.mode;
  G.mode = 'book';
  ui.showNext(false);
  G.album = new Album({
    mode: 'browse',
    keys: album.pocket(),
    onHat: setHat,
    onClose: () => {
      G.album = null;
      G.mode = from;
      if (from === 'title') ui.showTitle();
      if (from === 'party' && G.nextLabel) ui.showNext(true, G.nextLabel);
      updateBadge();
    },
  });
}

function setHat(h) {
  G.blob.hat = h;
}

function updateBadge() {
  ui.setAlbumBadge(album.pocket().length);
}

function finishLevel() {
  const sim = G.sim, g = G.L.goals[sim.goal];
  G.goalFx[g.i].done = true;
  tween(G.goalFx[g.i], { flag: 1 }, 0.6, { ease: ease.elasticOut, delay: 0.2 });
  G.blob.setMood('happy', 1);
  sim.completeGoal();
  sim.events.length = 0;
  G.camRate = T.camSmooth;
  updateBadge();
  // party
  G.mode = 'party';
  G.progress = Math.max(G.progress, G.li + 1);
  try {
    localStorage.setItem('hopper.progress', String(G.progress));
  } catch {}
  Object.assign(G.camT, G.fits ? levelCenter() : (() => {
    const r = G.spots.rects[G.spots.spotFor(g.x, g.y)];
    return { x: r.cx, y: r.cy, z: r.z };
  })());
  const party = (G.party = { t: 0 });
  const hop = () => {
    if (G.party !== party) return;
    const B = G.blob;
    B.stretch(5);
    sfx.jump();
    tween(B, { oy: -110 }, 0.32, { ease: ease.cubicOut, done: () => tween(B, { oy: 0 }, 0.3, { ease: ease.cubicIn, done: () => {
      B.squash(6);
      sfx.land(0.4);
      const ch = G.sim.ch;
      dust(ch.x, ch.y + R, 6, 0.8);
      after(0.25, hop);
    } }) });
  };
  hop();
  sfx.solved();
  bigConfetti();
  after(1.2, () => G.party === party && bigConfetti());
  G.banner = { y: -120, a: 1, s: 0.6, sub: `Level ${G.li + 1} complete!`, title: `★ ${G.L.title} ★`, stay: true };
  tween(G.banner, { y: 0, s: 1 }, 0.6, { ease: ease.backOut });
  G.nextLabel = G.li === LEVELS.length - 1 ? 'Play again' : 'Next level';
  after(T.nextT, () => G.party === party && G.mode === 'party' && ui.showNext(true, G.nextLabel));
}

function bigConfetti() {
  confetti(G.W * 0.2, G.H + 20, 50, { speed: 1300, spread: 0.45, angle: -Math.PI / 2 + 0.3 });
  confetti(G.W * 0.8, G.H + 20, 50, { speed: 1300, spread: 0.45, angle: -Math.PI / 2 - 0.3 });
}

function onLost(goal, missing) {
  sfx.sad();
  G.blob.setMood('sad', 1.4);
  const gf = G.goalFx[goal.i];
  gf.shake = 0.9;
  gf.missing = new Set(missing.length ? missing : goal.items);
  G.lostT = 0.9;
}

function restart() {
  if (G.mode !== 'play' || G.wipe) return;
  startWipe();
}

function startWipe() {
  G.mode = 'wipe';
  sfx.wipe();
  const maxR = Math.hypot(G.W, G.H);
  const w = (G.wipe = { r: maxR, open: false });
  tween(w, { r: 0 }, T.restartT / 2, {
    ease: ease.cubicIn,
    done: () => {
      const sim = G.sim;
      sim.restart();
      sim.events.length = 0;
      // the items held at the checkpoint
      const held = new Set(sim.checkpoint ? sim.checkpoint.items : []);
      for (const h of G.hud) h.got = held.has(h.id);
      G.goalFx.forEach((f) => (f.shake = 0));
      G.blob.reset(sim.ch.x, sim.ch.y);
      G.blob.onStep = onStep;
      G.blob.squash(4);
      G.spots.spot = -1;
      snapCamera();
      G.help.idle = 0;
      G.acc = 0;
      w.open = true;
      tween(w, { r: maxR }, T.restartT / 2, { ease: ease.cubicOut, done: () => { G.wipe = null; G.mode = 'play'; } });
    },
  });
}

// Skip to the end of the level: earlier mailboxes are posted, every sticker is held, Hopper stands on the last goal.
function skipToBoard() {
  if (G.mode === 'title' || G.mode === 'intro') endIntro();
  if (G.mode !== 'play') return;
  const sim = G.sim, L = G.L, g = L.goals[L.goals.length - 1];
  for (const gl of L.goals) {
    if (gl === g) break;
    G.goalFx[gl.i].done = true;
    G.goalFx[gl.i].flag = 1;
    for (const id of gl.items) G.spent.add(id);
  }
  sim.goal = g.i;
  for (const it of L.items) {
    sim.got.add(it.id);
    const h = G.hud.find((q) => q.id === it.id);
    if (h) h.got = true;
  }
  Object.assign(sim.ch, { x: g.x, y: g.y - R, state: 'stand', dest: null, pin: null, fl: null, sw: null, vx: 0, vy: 0 });
  G.blob.release();
  sim.checkGoal();
}

// ---------- help ----------
function currentStep() {
  const sim = G.sim, sit = sim.situation();
  const rec = G.help.rec;
  for (let i = rec.length - 1; i >= 0; i--) {
    if (!sameSituation(rec[i].sit, sit)) continue;
    const r = rec[i];
    if (r.afterWait) {
      const sw = sim.ch.sw;
      if (!sw || sw.u * -sw.start < 0.5) return { wait: true };
    }
    return r;
  }
  return null;
}

function updateHelp(dt) {
  const h = G.help;
  if (G.mode !== 'play' || G.sim.ended) {
    h.step = null;
    h.pulse = false;
    return;
  }
  h.idle += dt;
  const ch = G.sim.ch;
  const wait = (ch.wall ? T.wallClueT : T.clueT) - (G.li === 0 ? 1.5 : 0);
  if (h.idle < Math.max(0.3, wait)) {
    h.step = null;
    h.pulse = false;
    h.t = 0;
    return;
  }
  const st = currentStep();
  const prev = h.step;
  h.step = st && !st.wait ? st : null;
  h.pulse = true;
  if (!prev || !h.step || prev.step !== h.step.step) h.t = 0;
  h.t += dt;
}

// ---------- main loop ----------
let last = performance.now();
function frame(now) {
  const rdt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const dt = G.paused ? 0 : rdt;
  G.time += dt;
  update(dt);
  render();
  requestAnimationFrame(frame);
}

function update(dt) {
  updateTweens(dt);
  updateParticles(dt);
  updateShake(dt, T.shake, G.time);
  if (!G.L) return;
  const sim = G.sim;
  if (G.mode === 'intro') updateIntro(dt);
  if (G.mode === 'play' && dt > 0) {
    if (G.hitstop > 0) G.hitstop -= dt;
    else {
      G.acc = Math.min(G.acc + dt * T.speed, 0.1);
      while (G.acc >= STEP) {
        sim.step(STEP);
        G.acc -= STEP;
        if (sim.ended) {
          G.acc = 0;
          break;
        }
      }
    }
    handleEvents();
    if (G.lostT > 0) {
      G.lostT -= dt;
      if (G.lostT <= 0 && G.mode === 'play') startWipe();
    }
    swingWhoosh();
    speedLines();
  } else if (G.mode === 'win' || G.mode === 'board' || G.mode === 'party' || G.mode === 'book') {
    sim.events.length = 0;
  }
  for (const f of G.goalFx) f.shake = Math.max(0, f.shake - dt);
  const showB = G.mode === 'play' || G.mode === 'intro' || G.mode === 'wipe';
  if (showB !== G.btnShown) {
    G.btnShown = showB;
    ui.showButtons(showB);
  }
  updateCamera(dt);
  updateHelp(dt);
  updateLook(dt);
  G.blob.update(dt, sim.ch, G.look);
  for (const fl of G.flyers) {
    fl.k = Math.min(1, fl.k + dt / fl.dur);
    if (fl.k >= 1 && !fl.landed) {
      fl.landed = true;
      fl.done && fl.done();
    }
  }
  G.flyers = G.flyers.filter((f) => !f.landed);
  if (G.album) G.album.update(dt, G.W, G.H);
  G.trail = G.trail.filter((p) => G.time - p.t < 0.25);
}

function swingWhoosh() {
  const sw = G.sim.ch.sw;
  if (G.sim.ch.state !== 'swing' || !sw) {
    G.lastSwingSign = 0;
    return;
  }
  const s = Math.sign(sw.u);
  if (G.lastSwingSign && s && s !== G.lastSwingSign) sfx.swing();
  if (s) G.lastSwingSign = s;
}

function speedLines() {
  const B = G.blob;
  const sp = Math.hypot(B.vx, B.vy);
  if (sp < 650 || Math.random() > 0.7) return;
  const a = Math.atan2(B.vy, B.vx);
  emit({
    x: B.X - Math.cos(a) * 30 + rand(-18, 18), y: B.Y - 10 - Math.sin(a) * 30 + rand(-18, 18),
    vx: -Math.cos(a) * 120, vy: -Math.sin(a) * 120, kind: 'spark', color: 'rgba(255,255,255,0.85)', size: rand(3, 6), size1: 1, life: 0.25,
  });
}

function updateLook(dt) {
  const ch = G.sim.ch, B = G.blob;
  if (ch.pin) G.look = { x: ch.pin.cx, y: ch.pin.cy };
  else if (ch.dest) G.look = { x: ch.dest.cx, y: ch.dest.cy };
  else if (G.mode === 'board') G.look = { x: ch.x + 600, y: ch.y - 60 };
  else if (G.help.step && typeof G.help.step.step === 'string') {
    const p = G.sim.pin(G.help.step.step);
    G.look = { x: p.cx, y: p.cy };
  } else {
    G.lookT -= dt;
    if (G.lookT <= 0 || !G.idleLook) {
      G.lookT = rand(1.5, 3.5);
      const pool = [...G.L.pins.map((p) => ({ x: p.cx, y: p.cy })), ...G.L.items.filter((i) => !G.sim.got.has(i.id)), null];
      const near = pool.filter((p) => !p || Math.hypot(p.x - ch.x, p.y - ch.y) < 800);
      G.idleLook = { p: pick(near.length ? near : [null]) };
    }
    G.look = G.idleLook.p;
  }
}

// ---------- drawing ----------
function render() {
  const { W, H, dpr } = G;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#a9c8ec');
  bg.addColorStop(1, '#e4eefa');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  if (!G.L) return;

  ctx.save();
  ctx.translate(W / 2 + shake.x, H / 2 + shake.y);
  ctx.rotate(shake.r);
  const s = S();
  ctx.scale(s, s);
  ctx.translate(-G.cam.x, -G.cam.y);
  drawWorld(s);
  ctx.restore();

  drawHUD();
  drawFlyers();
  drawTrail();
  drawHelp();
  drawBanner();
  if (G.album) G.album.draw(ctx);
  drawParticles(ctx, true, (e) => emoji(e, 'sticker'));
  drawWipe();
}

function viewRect() {
  const s = S();
  return { x0: G.cam.x - G.W / 2 / s - 40, x1: G.cam.x + G.W / 2 / s + 40, y0: G.cam.y - G.H / 2 / s - 40, y1: G.cam.y + G.H / 2 / s + 40 };
}

function drawWorld(s) {
  const L = G.L, v = viewRect(), t = G.time;
  // whitebox grid
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2 / s;
  ctx.beginPath();
  const gs = 100;
  for (let x = Math.floor(v.x0 / gs) * gs; x < v.x1; x += gs) {
    ctx.moveTo(x, v.y0);
    ctx.lineTo(x, v.y1);
  }
  for (let y = Math.floor(v.y0 / gs) * gs; y < v.y1; y += gs) {
    ctx.moveTo(v.x0, y);
    ctx.lineTo(v.x1, y);
  }
  ctx.stroke();
  // the drop below the level
  const dg = ctx.createLinearGradient(0, L.h - 40, 0, L.h + 200);
  dg.addColorStop(0, 'rgba(60, 70, 120, 0)');
  dg.addColorStop(1, 'rgba(60, 70, 120, 0.35)');
  ctx.fillStyle = dg;
  ctx.fillRect(v.x0, L.h - 40, v.x1 - v.x0, v.y1 - L.h + 40);

  drawPinGuides();
  for (const b of L.blocks) drawBlock(b);
  L.goals.forEach(drawGoal);
  L.items.forEach((it) => {
    if (G.sim.got.has(it.id)) return;
    const bob = Math.sin(t * 2.4 + it.i * 1.7) * 7;
    const glow = 0.35 + 0.15 * Math.sin(t * 4 + it.i);
    ctx.fillStyle = `rgba(255,255,255,${glow})`;
    ctx.beginPath();
    ctx.arc(it.x, it.y + bob, ITEM_R * 1.55, 0, Math.PI * 2);
    ctx.fill();
    drawEmoji(ctx, stick(it.id), it.x, it.y + bob, ITEM_R * 1.15, 'sticker', Math.sin(t * 1.8 + it.i) * 0.14);
    if (Math.random() < 0.03) emit({ x: it.x + rand(-30, 30), y: it.y + rand(-30, 30), vy: -30, kind: 'star', color: '#fff', size: rand(3, 6), size1: 0, life: 0.6 });
  });
  L.pins.forEach((p) => drawPin(p, s));
  drawShadow();
  G.blob.draw(ctx);
  drawParticles(ctx, false, (e) => emoji(e, 'sticker'));
}

function drawBlock(b) {
  const r = 12;
  ctx.save();
  // drop shadow
  ctx.fillStyle = 'rgba(40, 60, 100, 0.16)';
  roundRect(ctx, b.x + 8, b.y + 10, b.w, b.h, r);
  ctx.fill();
  const g = ctx.createLinearGradient(0, b.y, 0, b.y + Math.min(b.h, 400));
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#d9e0ec');
  ctx.fillStyle = g;
  roundRect(ctx, b.x, b.y, b.w, b.h, r);
  ctx.fill();
  ctx.clip();
  // whitebox measuring grid
  ctx.strokeStyle = 'rgba(120, 140, 180, 0.13)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = Math.ceil(b.x / 50) * 50; x < b.x + b.w; x += 50) {
    ctx.moveTo(x, b.y);
    ctx.lineTo(x, b.y + b.h);
  }
  for (let y = Math.ceil(b.y / 50) * 50; y < b.y + b.h; y += 50) {
    ctx.moveTo(b.x, y);
    ctx.lineTo(b.x + b.w, y);
  }
  ctx.stroke();
  // top lip
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(b.x, b.y, b.w, 7);
  ctx.fillStyle = 'rgba(120, 140, 180, 0.22)';
  ctx.fillRect(b.x, b.y + 7, b.w, 3);
  ctx.restore();
  ctx.strokeStyle = '#8f9bb3';
  ctx.lineWidth = 3;
  roundRect(ctx, b.x, b.y, b.w, b.h, r);
  ctx.stroke();
}

function drawGoal(g) {
  const f = G.goalFx[g.i], t = G.time;
  const current = g.i === G.sim.goal && !f.done;
  const sx = f.shake > 0 ? Math.sin(f.shake * 40) * 10 * Math.min(1, f.shake * 2) : 0;
  ctx.save();
  ctx.translate(g.x, g.y);
  const breathe = current ? 1 + Math.sin(t * 3) * 0.02 : 1;
  ctx.scale(f.s * (2 - breathe), f.s * breathe);
  ctx.globalAlpha = current || f.done ? 1 : 0.55;
  if (g.i < G.L.goals.length - 1) drawMailbox(f, t);
  else drawGoalBox(f, t);
  ctx.restore();
  // slots above the goal
  if (f.done || (G.album && G.album.owns())) return;
  const slots = goalSlots(g);
  slots.forEach((sl, i) => {
    const fill = G.slotFill[sl.id];
    const miss = f.shake > 0 && f.missing && f.missing.has(sl.id);
    const bob = Math.sin(t * 2.5 + i) * 4;
    const x = sl.x + (miss ? sx : 0), y = sl.y + bob;
    ctx.save();
    ctx.globalAlpha = current ? 1 : 0.5;
    ctx.fillStyle = miss ? 'rgba(229, 72, 77, 0.35)' : 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.setLineDash([7, 6]);
    ctx.lineDashOffset = -t * 15;
    ctx.strokeStyle = miss ? '#e5484d' : 'rgba(90, 100, 130, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    if (fill) drawEmoji(ctx, stick(sl.id), x, y, 25 * fill.s, 'sticker');
    else drawEmoji(ctx, stick(sl.id), x, y, 22, 'ghost', 0, current ? 0.45 : 0.25);
  });
}

// the last goal: a box with the album on it, and a flag
function drawGoalBox(f, t) {
  // flag pole
  ctx.strokeStyle = '#7a5c2e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(GOAL_W / 2 - 8, -GOAL_H + 4);
  ctx.lineTo(GOAL_W / 2 - 8, -GOAL_H - 50);
  ctx.stroke();
  const fy = -GOAL_H - 50 + (1 - f.flag) * 40;
  ctx.fillStyle = f.done ? '#3bceac' : '#ff5d8f';
  ctx.beginPath();
  const wave = Math.sin(t * 6) * 4;
  ctx.moveTo(GOAL_W / 2 - 8, fy);
  ctx.quadraticCurveTo(GOAL_W / 2 + 14, fy + 4 + wave, GOAL_W / 2 + 30, fy + 11);
  ctx.quadraticCurveTo(GOAL_W / 2 + 14, fy + 18 + wave, GOAL_W / 2 - 8, fy + 22);
  ctx.fill();
  // box
  ctx.fillStyle = '#ffe9a8';
  ctx.strokeStyle = '#c99a2e';
  ctx.lineWidth = 4;
  roundRect(ctx, -GOAL_W / 2, -GOAL_H, GOAL_W, GOAL_H, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#c99a2e';
  roundRect(ctx, -GOAL_W / 2 + 14, -GOAL_H + 16, GOAL_W - 28, 7, 3);
  ctx.fill();
  drawEmoji(ctx, f.done ? '✅' : '📒', 0, -GOAL_H / 2 + 8, 20);
}

// a goal before the last: a mailbox on a post; its flag goes up once the stickers are posted
const MAIL = { w: 70, top: -GOAL_H - 28, bottom: -56 };
function drawMailbox(f, t) {
  // the box sits above the ground pin in front of it
  const { w: bw, top, bottom } = MAIL, r = bw / 2;
  // post
  ctx.fillStyle = '#9a6a3f';
  ctx.strokeStyle = '#6e4a2a';
  ctx.lineWidth = 3;
  roundRect(ctx, -7, bottom - 4, 14, -bottom + 4, 3);
  ctx.fill();
  ctx.stroke();
  // box: flat bottom, round top
  ctx.fillStyle = '#4d9de0';
  ctx.strokeStyle = '#2b6aa8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-r, bottom);
  ctx.lineTo(-r, top + r);
  ctx.arc(0, top + r, r, Math.PI, 0);
  ctx.lineTo(r, bottom);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.5, top + r * 0.55, 5, 9, 0.5, 0, Math.PI * 2);
  ctx.fill();
  // slot
  ctx.fillStyle = '#1d3f66';
  roundRect(ctx, -r * 0.55, top + r * 0.75, r * 1.1, 7, 3);
  ctx.fill();
  drawEmoji(ctx, f.done ? '✅' : '✉️', 0, (top + r + bottom) / 2 + 6, 12);
  // flag on the side: flat until posted, then up
  ctx.save();
  ctx.translate(r - 2, (top + r + bottom) / 2);
  ctx.rotate((-Math.PI / 2) * f.flag + Math.sin(t * 6) * 0.04 * f.flag);
  ctx.fillStyle = '#6e4a2a';
  roundRect(ctx, -3, -3, 32, 6, 3);
  ctx.fill();
  ctx.fillStyle = f.done ? '#3bceac' : '#ff5d8f';
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 2;
  roundRect(ctx, 20, -14, 18, 16, 4);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function pinPulse() {
  return G.help.pulse ? 1 + Math.max(0, Math.sin(G.time * 6)) * 0.18 : 1;
}

function drawPinGuides() {
  const ch = G.sim.ch, T_ = T;
  ctx.save();
  ctx.lineCap = 'round';
  for (const p of G.L.pins) {
    const active = ch.pin === p;
    ctx.strokeStyle = active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)';
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 4;
    ctx.setLineDash([1, 12]);
    if (p.t === 'A') {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + PIN_R + 6);
      ctx.lineTo(p.x, p.y + T_.hangLen);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(p.x, p.y + T_.hangLen, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.t === 'B') {
      const sw = active && ch.sw ? ch.sw : active && ch.fl && ch.fl.swing ? ch.fl.swing : null;
      const L = sw ? sw.L : p.len ?? T_.swingLen;
      const a = ((p.angle ?? T_.swingAngle) * Math.PI) / 180;
      ctx.beginPath();
      ctx.arc(p.x, p.y, L, Math.PI / 2 - a, Math.PI / 2 + a);
      ctx.stroke();
      ctx.setLineDash([]);
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.arc(p.x + Math.sin(sgn * a) * L, p.y + Math.cos(a) * L, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawPin(p, s) {
  const f = G.pinFx[p.id], t = G.time;
  const r = Math.max(PIN_R, T.pinMin / s);
  const idle = 1 + Math.sin(t * 2.2 + f.ph) * 0.035;
  const sc = f.s * idle * pinPulse(p);
  const col = PIN_COL[p.t], dark = PIN_DARK[p.t];
  ctx.save();
  ctx.translate(p.cx, p.cy);
  ctx.rotate(f.wob || 0);
  ctx.scale(sc, sc);
  if (G.help.pulse) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (p.t === 'C') {
    // map-marker sitting on the block
    ctx.fillStyle = 'rgba(40,40,80,0.18)';
    ctx.beginPath();
    ctx.ellipse(0, PIN_R, r * 0.55, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, r * 0.35);
    ctx.lineTo(0, PIN_R - 2);
    ctx.lineTo(r * 0.55, r * 0.35);
    ctx.fill();
  }
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(0, 3, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, r - 2.5, 0, Math.PI * 2);
  ctx.stroke();
  // glyph
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  if (p.t === 'A') {
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -10);
    ctx.moveTo(-8, -2);
    ctx.lineTo(0, -10);
    ctx.lineTo(8, -2);
  } else if (p.t === 'B') {
    ctx.arc(0, -6, 13, Math.PI * 0.2, Math.PI * 0.8);
  } else {
    ctx.moveTo(-9, -4);
    ctx.lineTo(0, 6);
    ctx.lineTo(9, -4);
  }
  ctx.stroke();
  if (p.t === 'B') {
    ctx.beginPath();
    ctx.arc(-10, 3, 3.5, 0, Math.PI * 2);
    ctx.arc(10, 3, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  // shine
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.38, -r * 0.42, r * 0.22, r * 0.13, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawShadow() {
  const ch = G.sim.ch, B = G.blob;
  let top = Infinity;
  for (const b of G.L.blocks) if (ch.x >= b.x && ch.x <= b.x + b.w && b.y >= ch.y + R - 2 && b.y < top) top = b.y;
  if (top === Infinity) return;
  const h = top - (ch.y + R) - B.oy;
  const k = clamp(1 - h / 420, 0.25, 1);
  ctx.fillStyle = `rgba(40, 50, 90, ${0.25 * k})`;
  ctx.beginPath();
  ctx.ellipse(ch.x, top + 2, 36 * k * B.sx, 8 * k, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ---------- screen-space layers ----------
function hudSize() {
  return clamp(G.H * 0.08, 38, 60);
}

function hudPos(i) {
  const sz = hudSize();
  return { x: 14 + sz / 2 + i * (sz + 10), y: 14 + sz / 2 };
}

function drawHUD() {
  if (G.mode === 'title') return;
  const sz = hudSize();
  G.hud.forEach((h, i) => {
    const p = hudPos(i);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(h.s, h.s);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.strokeStyle = 'rgba(70, 90, 140, 0.35)';
    ctx.lineWidth = 3;
    roundRect(ctx, -sz / 2, -sz / 2, sz, sz, sz * 0.28);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    const spent = G.spent.has(h.id);
    if (h.got && !spent) drawEmoji(ctx, G.L.stickers[h.kind], p.x, p.y, sz * 0.36 * h.s, 'sticker', Math.sin(G.time * 2 + i) * 0.08);
    else if (spent) {
      drawEmoji(ctx, G.L.stickers[h.kind], p.x, p.y, sz * 0.3, 'sticker', 0, 0.35);
      drawEmoji(ctx, '✔️', p.x + sz * 0.28, p.y + sz * 0.28, sz * 0.16);
    } else drawEmoji(ctx, G.L.stickers[h.kind], p.x, p.y, sz * 0.3, 'ghost', 0, 0.35);
  });
}

function drawFlyers() {
  for (const fl of G.flyers) {
    const to = fl.to();
    const e = ease.cubicInOut(fl.k);
    const x = lerp(fl.fx, to.x, e);
    const y = lerp(fl.fy, to.y, e) + Math.sin(fl.k * Math.PI) * fl.arc;
    const sc = lerp(fl.s0, fl.s1, ease.cubicOut(fl.k)) * (1 + Math.sin(fl.k * Math.PI) * 0.25);
    const sz = hudSize() * 0.36;
    ctx.save();
    ctx.shadowColor = 'rgba(30,20,40,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;
    drawEmoji(ctx, fl.e, x, y, sz * sc, 'sticker', Math.sin(fl.k * Math.PI * 2) * 0.4);
    ctx.restore();
    if (Math.random() < 0.6) emit({ x, y, vx: rand(-40, 40), vy: rand(-40, 40), kind: 'star', color: '#ffd23f', size: rand(3, 6), size1: 0, life: 0.4, screen: true });
  }
}

function drawTrail() {
  if (G.trail.length < 2) return;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (let i = 1; i < G.trail.length; i++) {
    const a = G.trail[i - 1], b = G.trail[i];
    const k = 1 - (G.time - b.t) / 0.25;
    ctx.strokeStyle = `rgba(255,255,255,${0.7 * k})`;
    ctx.lineWidth = 14 * k;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHelp() {
  const h = G.help;
  if (!h || !h.step || G.mode !== 'play') return;
  const st = h.step.step;
  const cyc = 1.4, k = (h.t % cyc) / cyc;
  if (typeof st === 'string') {
    const p = G.sim.pin(st);
    const q = w2s(p.cx, p.cy);
    if (q.x < 0 || q.y < 0 || q.x > G.W || q.y > G.H) return;
    let x = q.x + 50, y = q.y + 60, press = 0, a = 1;
    if (k < 0.35) {
      const e = ease.cubicOut(k / 0.35);
      x = lerp(q.x + 60, q.x, e);
      y = lerp(q.y + 80, q.y, e);
      a = e;
    } else if (k < 0.55) {
      x = q.x;
      y = q.y;
      press = Math.sin(((k - 0.35) / 0.2) * Math.PI);
      if (k - 0.35 < 0.02 && !h.rang) {
        h.rang = true;
        ring(q.x, q.y, { size: 14, size1: 60, color: '#fff', width: 5, screen: true, life: 0.4 });
      }
    } else {
      x = q.x;
      y = q.y;
      a = 1 - (k - 0.55) / 0.45;
      h.rang = false;
    }
    drawHand(ctx, x, y + 4, press, a, 40);
  } else {
    const ch = G.sim.ch;
    const q = w2s(ch.x, ch.y);
    const e = ease.cubicInOut(clamp(k / 0.6, 0, 1));
    const a = k < 0.6 ? Math.min(1, k * 6) : 1 - (k - 0.6) / 0.4;
    const lean = (st * Math.PI) / 180;
    const len = 120;
    const x = q.x + 40 + Math.sin(lean) * len * e, y = q.y + 30 - Math.cos(lean) * len * e;
    ctx.save();
    ctx.strokeStyle = `rgba(255,255,255,${0.6 * a})`;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(q.x + 40, q.y + 30);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.restore();
    drawHand(ctx, x, y, 0.6, a, 40);
  }
}

function drawBanner() {
  const b = G.banner;
  if (!b || b.a <= 0) return;
  ctx.save();
  ctx.globalAlpha = b.a;
  ctx.translate(G.W / 2, G.H * 0.16 + b.y);
  ctx.scale(b.s, b.s);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fs = clamp(G.H * 0.075, 26, 56);
  ctx.font = `700 ${fs * 0.45}px ${UI_FONT}`;
  ctx.fillStyle = 'rgba(43,45,66,0.75)';
  ctx.fillText(b.sub, 0, -fs * 0.7);
  ctx.font = `800 ${fs}px ${UI_FONT}`;
  ctx.lineWidth = fs * 0.2;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#2b2d42';
  ctx.strokeText(b.title, 0, 0);
  ctx.fillStyle = '#fff';
  ctx.fillText(b.title, 0, 0);
  ctx.restore();
}

function drawWipe() {
  const w = G.wipe;
  if (!w) return;
  const c = w2s(G.blob.X, G.blob.Y);
  const cx = clamp(c.x, 0, G.W), cy = clamp(c.y, 0, G.H);
  ctx.save();
  ctx.fillStyle = '#2b2d42';
  ctx.beginPath();
  ctx.rect(0, 0, G.W, G.H);
  ctx.arc(cx, cy, Math.max(0, w.r), 0, Math.PI * 2, true);
  ctx.fill('evenodd');
  ctx.strokeStyle = '#ffd23f';
  ctx.lineWidth = 8;
  if (w.r > 2) {
    ctx.beginPath();
    ctx.arc(cx, cy, w.r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- boot ----------
const ui = initUI({
  levels: LEVELS.map((l) => ({ name: l.name, title: l.title })),
  progress: () => G.progress,
  onPlay: () => startIntro(),
  onRestart: () => restart(),
  onNext: () => {
    G.party = null;
    G.banner = null;
    loadLevel(G.li + 1);
    startIntro();
  },
  onLevel: (i) => {
    G.party = null;
    G.banner = null;
    ui.showNext(false);
    loadLevel(i);
    startIntro();
  },
  onSkip: () => skipToBoard(),
  onAlbum: () => openBrowse(),
  onResetProgress: () => {
    G.progress = 0;
    try {
      localStorage.removeItem('hopper.progress');
    } catch {}
    album.reset();
    setHat(null);
    updateBadge();
  },
  paused: (v) => (G.paused = v),
});

loadLevel(Math.min(G.progress, LEVELS.length - 1));
G.mode = 'title';
setHat(album.hat);
updateBadge();
ui.showButtons(false);
requestAnimationFrame(frame);

// ---------- test hook ----------
window.HOP = {
  G,
  tap: (id) => G.sim.tapPin(id),
  swipe: (lean = 0) => G.sim.swipe(lean),
  // advance the game by `sec` seconds in fixed steps (works while paused)
  step(sec = 1) {
    const n = Math.round(sec / STEP);
    for (let i = 0; i < n; i++) update(STEP);
    render();
  },
  pause: (v = true) => (G.paused = v),
  get ch() {
    return G.sim.ch;
  },
  get level() {
    return G.L;
  },
  get mode() {
    return G.mode;
  },
  // album: stick the next sheet sticker in, close the book (Later / continue), open the album screen
  place: () => !!G.album && G.album.placeNext(),
  closeAlbum: () => G.album && G.album.close(),
  album: () => openBrowse(),
  get book() {
    return G.album;
  },
  go: (i) => {
    document.getElementById('title').hidden = true;
    loadLevel(i);
    startIntro();
    endIntro();
  },
  play: () => document.getElementById('btn-play').click(),
  skip: () => skipToBoard(),
};
