// Night Cycle: boot, main loop, game states, checkpoints and the glue between systems.

import * as THREE from 'three';
import { T } from './tune.js';
import { PLACES, DOCK, ROOMS } from './level.js';
import { World } from './world.js';
import { buildHouse } from './build.js';
import { DirtLayer } from './dirt.js';
import { Items } from './items.js';
import { Roomba } from './roomba.js';
import { Entity } from './entity.js';
import { Lidar } from './lidar.js';
import { Audio } from './audio.js';
import { Hud } from './hud.js';
import { Story } from './story.js';
import { Input } from './input.js';
import { Post } from './post.js';
import { loadSettings, saveSettings, buildSettings, DIFFICULTY } from './ui.js';

const $ = (id) => document.getElementById(id);
const FLAGS = { lampOn: true, lampFlicker: false, tvOn: false, fridgeOpen: false, musicBox: false, clockOn: true, leak: 'dim', entity: false };

const game = {
  state: 'title', time: 0, clock: 0, lampFlicker: 0,
  settings: loadSettings(),
  flags: { ...FLAGS },
  stats: { bumps: 0, scans: 0, story: 0, chases: 0, deaths: 0, start: 0 },
  debug: { enabled: new URLSearchParams(location.search).has('debug'), ghost: false, infiniteBattery: false },
};
window.NC = game;
game.diff = () => DIFFICULTY[game.settings.difficulty] || DIFFICULTY[1];

function boot() {
  const canvas = $('game');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  game.renderer = renderer;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x010102, 0.085);
  game.scene = scene;
  game.camera = new THREE.PerspectiveCamera(T.fov, innerWidth / innerHeight, 0.02, 40);

  game.world = new World();
  game.house = buildHouse(scene, game.world);
  const sched = ['living', 'kitchen', 'hall', 'kid'].reduce((s, id) => s + game.world.roomTotal[game.world.roomIndex(id)], 0);
  game.binPerDirt = 100 / (sched * T.binFillShare);

  game.post = new Post(renderer);
  game.audio = new Audio(game);
  game.input = new Input(canvas, game);
  game.dirt = new DirtLayer(game);
  game.items = new Items(game);
  game.roomba = new Roomba(game);
  game.entity = new Entity(game);
  game.lidar = new Lidar(game);
  game.hud = new Hud(game);
  game.story = new Story(game);

  applySettings();
  applyFlags();
  game.roomba.updateRig(0, 0);
  game.cp0 = snapshot(0);

  addEventListener('resize', resize);
  resize();
  wireUI();
  if (game.debug.enabled) {
    document.body.classList.add('debug');
    game.drive = (throttle, steer, secs) => { game.input.override = { throttle, steer, secs, until: performance.now() + secs * 1000 }; };
    game.place = (x, z, yawDeg = 0) => { Object.assign(game.roomba, { x, z, yaw: (yawDeg * Math.PI) / 180, v: 0 }); };
    if (new URLSearchParams(location.search).has('auto')) startGame();
  }
  let last = performance.now();
  const frame = (now) => {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    tick(dt);
  };
  requestAnimationFrame(frame);
}

function resize() {
  const w = innerWidth, h = innerHeight;
  game.renderer.setSize(w, h, false);
  game.post.setSize(w, h);
  game.camera.aspect = w / h;
  // Keep at least ~80 degrees across in portrait.
  const minH = (80 * Math.PI) / 180;
  const vNeeded = (2 * Math.atan(Math.tan(minH / 2) / game.camera.aspect) * 180) / Math.PI;
  game.camera.fov = Math.min(110, Math.max(T.fov, vNeeded));
  game.camera.updateProjectionMatrix();
  game.hud.resize();
}

function applySettings() {
  const s = game.settings;
  game.post.pixel = s.pixel;
  game.post.uniforms.exposure.value = s.brightness;
  game.audio.setVolume(s.volume);
  if (game.renderer) resize();
}

// ---------- the main loop ----------

function tick(dt, render = true) {
  const g = game;
  g.time += dt;
  g.input.poll();
  if (g.state === 'playing') {
    g.clock += dt * T.clockRate;
    g.roomba.update(dt, g.input, true);
    g.items.update(dt);
    g.dirt.update(dt);
    g.entity.update(dt);
    g.story.update(dt);
    watchEntity(dt);
    if (g.input.consume('pause')) pause();
  } else if (g.state === 'cutscene') {
    g.roomba.update(dt, g.input, false);
    g.entity.update(dt);
    g.story.update(dt);
  } else if (g.state === 'dying') {
    updateDying(dt);
    g.entity.update(dt);
  } else {
    g.roomba.updateRig(dt, g.time);
    if (g.state === 'paused' && g.input.consume('pause') && !$('pause').hidden) resume();
  }
  g.lampFlicker = Math.max(0, g.lampFlicker - dt);
  updateCinematic(dt);
  effects(dt);
  g.lidar.update();
  g.audio.update(dt);
  if (g.state === 'playing' || g.state === 'cutscene') g.hud.update(dt);
  if (render) g.post.render(g.scene, g.camera, g.time);
  g.input.endFrame();
}

// Debug: run the simulation forward without waiting for frames (the preview pane may be throttled).
game.advance = (secs, dt = 1 / 60) => {
  const o = game.input.override;
  for (let t = 0; t < secs; t += dt) {
    if (o) o.until = performance.now() + 1000;
    if (o && (o.left = (o.left ?? o.secs ?? 0) - dt) <= 0 && o.secs) game.input.override = null;
    tick(dt, false);
  }
  game.post.render(game.scene, game.camera, game.time);
};

// The thing: stingers when you first lay eyes on it.
let lastStinger = -100;
const tmp = new THREE.Vector3();
function watchEntity() {
  const g = game, e = g.entity;
  if (!e.root.visible || g.time - lastStinger < 35) return;
  e.j.chest.getWorldPosition(tmp);
  const d = Math.hypot(tmp.x - g.roomba.x, tmp.z - g.roomba.z);
  if (d > 8) return;
  const p = tmp.clone().project(g.camera);
  if (p.z > 1 || Math.abs(p.x) > 0.9 || Math.abs(p.y) > 1.2) return;
  if (!g.world.los(g.roomba.x, g.roomba.z, e.x, e.z)) return;
  if (!g.roomba.light && d > 3 && g.time - g.lidar.lastScan > 3) return;
  lastStinger = g.time;
  g.audio.stinger();
}

game.noise = (x, z, r, kind) => game.entity.hear(x, z, r, kind);
game.say = (text, kind) => { game.hud.subtitle(`"${text}"`, 3.5); game.audio.say(text); };
game.onEntityChase = () => {
  game.stats.chases++;
  game.hud.log('!! YOU HAVE BEEN SEEN');
  if (game.time - lastStinger > 8) { lastStinger = game.time; game.audio.stinger(); }
};
game.onEntitySearch = () => game.hud.log('Under cover. Stay still.');
game.onEntityGiveUp = () => game.hud.log('Motion moving away...');
game.onEntityScanned = () => game.hud.log('LIDAR: unclassified shape');
game.onKey = (code) => {
  if (code === 'Enter' || code === 'NumpadEnter') {
    if (game.state === 'title' && !$('title').hidden) startGame();
    else if (game.state === 'dead') retry();
    else if (game.state === 'end') restartNight();
  }
  if (game.debug.enabled) debugKey(code);
};

// ---------- world state the story changes ----------

function applyFlags() {
  const g = game, h = g.house, f = g.flags;
  h.lights.lamp.intensity = f.lampOn ? h.lights.lamp.userData.base : 0;
  h.lampShade.emissiveIntensity = f.lampOn ? 0.6 : 0;
  h.tvScreen.map = f.tvOn ? h.tvStatic.texture : null;
  h.tvScreen.color.setHex(f.tvOn ? 0xffffff : 0x050608);
  h.tvScreen.needsUpdate = true;
  if (!f.tvOn) h.lights.tv.intensity = 0;
  g.audio.tvStatic(f.tvOn, PLACES.tv);
  h.lights.fridge.intensity = f.fridgeOpen ? 9 : 0;
  h.fridgeInner.color.setHex(f.fridgeOpen ? 0xe8f4ff : 0x0a0b0c);
  g.audio.fridgeHum(f.fridgeOpen, PLACES.fridge);
  g.audio.musicBox(f.musicBox, PLACES.musicBox);
  g.audio.clock(f.clockOn, PLACES.clock);
  const leak = h.lights.leak, bright = f.leak === 'bright';
  leak.userData.base = bright ? 9 : f.leak === 'dim' ? 1.4 : 0;
  leak.position.copy(bright ? leak.userData.bulb : leak.userData.slit);
  leak.distance = bright ? 8 : 1.6;
  h.bulbMat.emissiveIntensity = bright ? 2 : 0;
  h.leak.visible = f.leak === 'dim';
}
game.applyFlags = applyFlags;

function setDoor(id, state, speed = 1.2) {
  const d = game.house.doors[id];
  d.speed = speed;
  if (state === 'open') { d.target = d.open; d.onArrive = () => game.world.setDoor(id, 'open'); }
  else if (state === 'open-visual') { d.target = d.open; d.onArrive = null; d.speed = 2.2; }
  else { d.target = d.closed; d.onArrive = null; game.world.setDoor(id, state); }
}
game.setDoor = setDoor;

function syncDoors() {
  for (const [id, d] of Object.entries(game.house.doors)) {
    const open = game.world.doors[id].state === 'open';
    d.target = open ? d.open : d.closed;
    d.pivot.rotation.y = d.target;
    d.onArrive = null;
  }
}

function effects(dt) {
  const g = game, h = g.house, f = g.flags, t = g.time;
  const L = h.lights;
  if (f.lampOn) {
    const fl = f.lampFlicker ? (Math.random() < 0.45 ? 0 : 1.2) : Math.random() < 0.004 ? 0.2 : 1;
    L.lamp.intensity = L.lamp.userData.base * fl;
    h.lampShade.emissiveIntensity = 0.6 * fl;
  }
  if (f.tvOn) {
    h.tvStatic.update();
    L.tv.intensity = 4 + Math.random() * 5;
  }
  L.nightlight.intensity = L.nightlight.userData.base * (Math.random() < 0.02 ? 0.3 : 1);
  L.leak.intensity = L.leak.userData.base * (0.85 + Math.random() * 0.15 + (Math.random() < 0.01 ? -0.7 : 0));
  if (h.fridgeDoor) {
    const tgt = f.fridgeOpen ? -1.9 : 0;
    h.fridgeDoor.rotation.y += (tgt - h.fridgeDoor.rotation.y) * Math.min(1, dt * 1.5);
  }
  if (h.pendulum) h.pendulum.rotation.z = f.clockOn ? Math.sin(t * Math.PI) * 0.16 : h.pendulum.rotation.z * 0.98;
  h.smokeLed.visible = t % 2.5 < 0.07;
  for (const m of h.moons) m.spot.target.position.set(m.base.x + Math.sin(t * 0.4) * 0.06, m.base.y, m.base.z + Math.cos(t * 0.33) * 0.04);
  h.dockLed.material.color.setHex(g.roomba.docked ? (t % 1 < 0.5 ? 0x30ff90 : 0x0a4020) : 0x30ff90);
  for (const d of Object.values(h.doors)) {
    const diff = d.target - d.pivot.rotation.y;
    if (Math.abs(diff) < 1e-3) { if (d.onArrive) { const cb = d.onArrive; d.onArrive = null; cb(); } continue; }
    d.pivot.rotation.y += Math.sign(diff) * Math.min(Math.abs(diff), d.speed * dt);
  }
}

// ---------- checkpoints ----------

function snapshot(step) {
  const g = game;
  const world = g.world.snapshot();
  // A door still swinging open is saved as open.
  for (const [id, d] of Object.entries(g.house.doors)) if (d.onArrive) world.doors[id] = 'open';
  // Passing effects from a scene that is still playing are not part of the checkpoint.
  const flags = { ...g.flags };
  if (flags.lampFlicker) { flags.lampFlicker = false; flags.lampOn = false; }
  flags.tvOn = false;
  return {
    step, world, roomba: g.roomba.snapshot(), items: g.items.snapshot(), dirt: g.dirt.snapshot(),
    entity: g.entity.snapshot(), flags, clock: g.clock, explored: [...g.hud.explored],
  };
}
game.checkpoint = (step) => { game.cp = snapshot(step); };

function restore(cp) {
  const g = game;
  g.world.restore(cp.world);
  syncDoors();
  g.roomba.restore(cp.roomba);
  g.items.restore(cp.items);
  g.dirt.restore(cp.dirt);
  g.entity.restore(cp.entity);
  g.flags = { ...cp.flags };
  applyFlags();
  g.clock = cp.clock;
  g.hud.explored = new Set(cp.explored);
  g.lidar.clear();
  resetView();
}

function resetView() {
  const g = game, u = g.post.uniforms;
  u.glitch.value = 0; u.staticAmt.value = 0; u.fade.value = 0; u.danger.value = 0;
  g.cine = null;
  g.roomba.head.add(g.camera);
  g.camera.position.set(0, 0, 0);
  g.camera.quaternion.identity();
  g.roomba.model.visible = false;
  g.roomba.ledBoost = 0;
  g.house.lights.cine.intensity = 0;
  for (const p of g.roomba.fpParts) p.visible = true;
  g.roomba.brush.visible = true;
  g.roomba.updateRig(0, g.time);
}

// ---------- states ----------

function startGame() {
  const g = game;
  g.audio.init();
  hideOverlays();
  g.state = 'playing';
  g.stats = { bumps: 0, scans: 0, story: 0, chases: 0, deaths: 0, start: g.time };
  g.hud.show(true);
  g.story.start(0, true);
  grabMouse();
}

function unpauseSpeech() { try { if (window.speechSynthesis) { speechSynthesis.cancel(); speechSynthesis.resume(); } } catch { /* none */ } }

function retry() {
  hideOverlays();
  game.audio.ctx?.resume();
  unpauseSpeech();
  restore(game.cp);
  game.state = 'playing';
  game.hud.show(true);
  game.story.start(game.cp.step, false);
  grabMouse();
}

function restartNight() {
  hideOverlays();
  game.audio.ctx?.resume();
  unpauseSpeech();
  restore(game.cp0);
  game.hud.explored = new Set();
  game.state = 'playing';
  game.stats = { bumps: 0, scans: 0, story: 0, chases: 0, deaths: 0, start: game.time };
  game.hud.show(true);
  game.story.cos = [];   // drop every scene still running from the last night
  game.story.start(0, true);
  grabMouse();
}

function pause() {
  if (game.state !== 'playing') return;
  game.state = 'paused';
  game.input.unlock();
  showOverlay('pause');
  renderArchive();
  if (window.speechSynthesis) speechSynthesis.pause?.();
  game.audio.ctx?.suspend();
}

function resume() {
  hideOverlays();
  game.state = 'playing';
  grabMouse();
  if (window.speechSynthesis) speechSynthesis.resume?.();
  game.audio.ctx?.resume();
}

function grabMouse() {
  const c = $('game');
  if (game.input.isTouch || !c.requestPointerLock) return;
  try { const p = c.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch { /* ignored */ }
}

game.pause = pause;

// Caught, or the battery died.
game.caught = () => {
  const g = game;
  if (g.state !== 'playing' || g.debug.ghost) return;
  g.state = 'dying';
  g.dying = { t: 0, kind: 'caught' };
  g.stats.deaths++;
  g.entity.scare();
  g.audio.scream();
  g.hud.labelsOff = true;
};

game.batteryDead = () => {
  const g = game;
  if (g.state !== 'playing') return;
  g.state = 'dying';
  g.dying = { t: 0, kind: 'battery', steps: 0 };
  g.stats.deaths++;
  g.audio.powerDown();
  g.say('Battery depleted.');
};

function updateDying(dt) {
  const g = game, d = g.dying, u = g.post.uniforms, r = g.roomba;
  d.t += dt;
  g.roomba.updateRig(dt, g.time);
  if (d.kind === 'battery') {
    // darkness, then something walks up behind you
    if (d.t > 3 && d.steps < 5 && d.t > 3 + d.steps * 0.75) {
      const back = 4.5 - d.steps * 0.9;
      g.audio.footstep(r.x - r.fx * back, r.z - r.fz * back, 0.7);
      d.steps++;
    }
    if (d.t > 7.2 && g.entity.state !== 'scare') {
      g.entity.scare();
      g.audio.scream();
      r.dead = false; r.light = true; r.battery = 3;
    }
    if (d.t > 7.2) scareCam(d.t - 7.2, dt);
    if (d.t > 8.4) die('BATTERY DEPLETED', 'Unit could not reach Home Base. Unit was collected.');
  } else {
    scareCam(d.t, dt);
    if (d.t > 1.25) die('SIGNAL LOST', 'Error 13: unit lifted off the floor.');
  }
}

function scareCam(t, dt) {
  const g = game, u = g.post.uniforms, r = g.roomba;
  r.pitch += (0.55 - r.pitch) * Math.min(1, dt * 6);
  r.shake = 0.6;
  u.glitch.value = Math.min(1, t * 0.9);
  u.staticAmt.value = t > 1.05 ? 1 : t * 0.12;
  g.hud.show(false);
  g.hud.lab.clearRect(0, 0, g.hud.lab.canvas.width, g.hud.lab.canvas.height);
}

function die(title, reason) {
  const g = game;
  if (g.state !== 'dying') return;
  g.state = 'dead';
  g.post.uniforms.staticAmt.value = 0.9;
  g.input.unlock();
  g.hud.show(false);
  g.entity.hide();
  $('death-title').textContent = title;
  $('death-reason').textContent = reason;
  showOverlay('death');
}

// ---------- the ending ----------

game.beginCinematic = (toPos, lookAt, dur) => {
  const g = game, cam = g.camera;
  g.scene.attach(cam);
  const dummy = new THREE.PerspectiveCamera();
  dummy.position.copy(toPos);
  dummy.lookAt(lookAt);
  g.cine = { fromPos: cam.position.clone(), fromQuat: cam.quaternion.clone(), toPos: toPos.clone(), toQuat: dummy.quaternion.clone(), t: 0, dur };
  g.roomba.model.visible = true;
  for (const p of g.roomba.fpParts) p.visible = false;
  g.roomba.brush.visible = false;
};

function updateCinematic(dt) {
  const c = game.cine;
  if (!c) return;
  c.t = Math.min(c.dur, c.t + dt);
  const k = c.t / c.dur, e = k * k * (3 - 2 * k);
  game.camera.position.lerpVectors(c.fromPos, c.toPos, e);
  game.camera.quaternion.slerpQuaternions(c.fromQuat, c.toQuat, e);
}

game.showEnd = () => {
  const g = game;
  g.state = 'end';
  g.post.uniforms.fade.value = 1;
  g.input.unlock();
  g.hud.show(false);
  const secs = Math.round(g.time - g.stats.start);
  const covered = ['living', 'kitchen', 'kid', 'hall'].map((id) => g.world.roomProgress(g.world.roomIndex(id)));
  const avg = Math.round((covered.reduce((a, b) => a + b, 0) / covered.length) * 100);
  $('end-stats').innerHTML = [
    ['Time', `${Math.floor(secs / 60)}m ${String(secs % 60).padStart(2, '0')}s`],
    ['Average coverage', `${avg}%`],
    ['Objects archived', `${g.items.list.filter((i) => i.taken && i.def.story).length} / ${g.items.storyTotal}`],
    ['Times seen', g.stats.chases],
    ['Units lost', g.stats.deaths],
    ['Bumps', g.stats.bumps],
  ].map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
  showOverlay('end');
};

// ---------- UI ----------

function showOverlay(id) { for (const o of document.querySelectorAll('.overlay')) o.hidden = o.id !== id; }
function hideOverlays() { for (const o of document.querySelectorAll('.overlay')) o.hidden = true; }

function renderArchive() {
  const list = $('archive-list');
  const found = game.items.list.filter((i) => i.taken && i.def.text);
  list.innerHTML = found.length ? '' : '<p class="muted">Nothing archived yet. Things on the floor are worth picking up.</p>';
  for (const it of found) {
    const d = document.createElement('div');
    d.className = 'arch';
    d.innerHTML = '<b></b><p></p>';
    d.querySelector('b').textContent = it.def.name;
    d.querySelector('p').textContent = it.def.text;
    list.appendChild(d);
  }
  $('archive-count').textContent = `${game.items.list.filter((i) => i.taken && i.def.story).length} / ${game.items.storyTotal}`;
}

function wireUI() {
  $('btn-start').onclick = startGame;
  $('btn-resume').onclick = resume;
  $('btn-retry').onclick = retry;
  $('btn-restart-dead').onclick = restartNight;
  $('btn-restart').onclick = restartNight;
  $('btn-again').onclick = restartNight;
  const openSettings = (back) => {
    showOverlay('settings');
    buildSettings($('settings-body'), game.settings, (s) => { game.settings = s; saveSettings(s); applySettings(); });
    $('btn-settings-back').onclick = () => showOverlay(back);
  };
  $('btn-settings-title').onclick = () => openSettings('title');
  $('btn-settings-pause').onclick = () => openSettings('pause');
  $('touch-pause')?.addEventListener('click', () => pause());
}

// ---------- debug (add ?debug to the URL) ----------

function debugKey(code) {
  const g = game;
  if (g.state !== 'playing') return;
  const n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5 }[code];
  if (n !== undefined) debugSkip(n);
  if (code === 'KeyG') { g.debug.ghost = !g.debug.ghost; g.hud.log('ghost ' + g.debug.ghost); }
  if (code === 'KeyB') { g.debug.infiniteBattery = !g.debug.infiniteBattery; g.hud.log('infinite battery ' + g.debug.infiniteBattery); }
  if (code === 'KeyC') debugClean(g.story.task?.room);
  if (code === 'KeyT') {
    const room = g.story.task?.room;
    if (room) { const r = ROOMS[g.world.roomIndex(room)]; const p = g.world.randomFreeIn(g.world.roomIndex(room)); if (p) { g.roomba.x = p[0]; g.roomba.z = p[1]; } }
  }
  if (code === 'KeyK') g.caught();
}

function debugClean(room, amount = 1) {
  if (!room) return;
  const w = game.world, ri = w.roomIndex(room);
  for (let c = 0; c < w.dirt.length; c++) if (w.room[c] === ri && Math.random() < amount) w.dirt[c] = 0;
  let s = 0;
  for (let c = 0; c < w.dirt.length; c++) if (w.room[c] === ri) s += w.dirt[c];
  w.roomDirt[ri] = s;
  w.dirtBox = { i0: 0, i1: 223, j0: 0, j1: 159 };
}

function debugSkip(n) {
  const g = game, f = g.flags;
  if (n >= 1) { debugClean('living'); f.lampOn = false; }
  if (n >= 2) { debugClean('kitchen'); f.fridgeOpen = true; g.dirt.prints.forEach((_, k) => g.dirt.showPrint(k)); }
  if (n >= 3) { g.dirt.prints.forEach((p) => { p.amount = 0; }); g.setDoor('kid', 'open', 5); }
  if (n >= 4) {
    debugClean('kid'); f.musicBox = false; f.clockOn = false; f.leak = 'bright'; f.entity = true;
    g.setDoor('laundry', 'open', 5);
    g.entity.x = 12.62; g.entity.z = 5.9; g.entity.activate(5);
  }
  if (n >= 5) debugClean('hall', 0.75);
  applyFlags();
  g.story.start(n, false);
  g.hud.log('debug: step ' + (n + 1));
}

boot();
