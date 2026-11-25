// Night Cycle: boot, main loop, game states, checkpoints and the glue between systems.

import * as THREE from 'three';
import { T } from './tune.js';
import { PLACES, DOCK, ROOMS } from './level.js';
import { World } from './world.js';
import { buildHouse } from './build.js';
import { DirtLayer } from './dirt.js';
import { Items } from './items.js';
import { Kibble } from './kibble.js';
import { Roomba } from './roomba.js';
import { Entity } from './entity.js';
import { Lidar } from './lidar.js';
import { Motes } from './motes.js';
import { FX } from './fx.js';
import { Tension } from './tension.js';
import { setTextureQuality } from './textures.js';
import { Audio } from './audio.js';
import { Hud } from './hud.js';
import { Story } from './story.js';
import { Input } from './input.js';
import { Post } from './post.js';
import { loadSettings, saveSettings, buildSettings, DIFFICULTY } from './ui.js';

const $ = (id) => document.getElementById(id);
const FLAGS = { lampOn: true, lampFlicker: false, tvOn: false, fridgeOpen: false, musicBox: false, clockOn: true, leak: 'dim', entity: false,
  boltTorn: false, nightlights: [true, true], seen: {} };
const copyFlags = (f) => ({ ...f, nightlights: [...f.nightlights], seen: { ...f.seen } });

const game = {
  state: 'title', time: 0, clock: 0, lampFlicker: 0,
  settings: loadSettings(),
  flags: copyFlags(FLAGS),
  stats: { bumps: 0, scans: 0, story: 0, chases: 0, deaths: 0, start: 0 },
  incidents: [], mudOn: false, mudQueue: [], lastSave: -100,
  lair: { cool: 0, session: 0, next: 0, last: -100, bumps: [] },
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

  // sharper procedural textures on desktop, where the HD camera can see them
  setTextureQuality(matchMedia('(pointer: coarse)').matches ? 1 : 2, renderer.capabilities.getMaxAnisotropy());
  game.world = new World();
  game.house = buildHouse(scene, game.world);
  const sched = ['living', 'kitchen', 'hall', 'kid'].reduce((s, id) => s + game.world.roomTotal[game.world.roomIndex(id)], 0);
  game.binPerDirt = 100 / (sched * T.binFillShare);

  game.post = new Post(renderer);
  game.audio = new Audio(game);
  game.input = new Input(canvas, game);
  game.dirt = new DirtLayer(game);
  game.items = new Items(game);
  game.kibble = new Kibble(game);
  game.roomba = new Roomba(game);
  game.entity = new Entity(game);
  game.lidar = new Lidar(game);
  game.motes = new Motes(game);
  game.fx = new FX(game);
  game.tension = new Tension(game);
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
    // Art checks: freeze the game and look from a free camera, optionally floodlit and without fog.
    game.look = (x, y, z, tx, ty, tz, flood = true) => {
      const g = game;
      g.state = 'inspect';
      g.scene.attach(g.camera);
      g.camera.position.set(x, y, z); g.camera.lookAt(tx, ty, tz);
      g.flood ||= new THREE.HemisphereLight(0xffffff, 0x888888, 2.2);
      if (flood) g.scene.add(g.flood); else g.scene.remove(g.flood);
      g.scene.fog.density = flood ? 0.01 : 0.085;
      for (const k of ['interf', 'pulse', 'zoom', 'blurX', 'dropout']) g.post.uniforms[k].value = 0;
      g.hud.show(false);
      g.post.render(g.scene, g.camera, g.time);
    };
    if (new URLSearchParams(location.search).has('auto')) startGame();
  }
  let last = performance.now();
  const frame = (now) => {
    requestAnimationFrame(frame);
    const raw = now - last;
    const dt = Math.min(0.05, raw / 1000);
    last = now;
    tick(dt);
    adaptResolution(raw);
  };
  requestAnimationFrame(frame);
}

// HD keeps the frame rate up by rendering fewer pixels when frames run long (never below ~55%).
const perf = { avg: 16, t: 0 };
function adaptResolution(raw) {
  const p = game.post;
  if (raw > 100 || p.pixel > 1.01 || game.state === 'title') return;   // background tab, retro, or menu
  perf.avg += (raw - perf.avg) * 0.05;
  perf.t += raw / 1000;
  if (perf.t < 2) return;
  perf.t = 0;
  let next = p.dyn;
  if (perf.avg > 20) next = Math.max(0.55, p.dyn * 0.85);
  else if (perf.avg < 15 && p.dyn < p.maxDyn) next = Math.min(p.maxDyn, p.dyn * 1.08);
  if (Math.abs(next - p.dyn) > 0.01) { p.dyn = next; resize(); }
}

function resize() {
  const w = innerWidth, h = innerHeight;
  game.post.setSize(w, h);   // sets the renderer's size and pixel ratio too
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
  document.documentElement.style.setProperty('--ts', s.textSize || 1);
  document.body.classList.toggle('calm', !s.flashing);
  if (game.renderer) resize();
  renderTitleDifficulty();
}

// ---------- the main loop ----------

function tick(dt, render = true) {
  const g = game;
  g.time += dt;
  g.input.poll();
  if (g.input.pad !== g.lastPad) { g.lastPad = g.input.pad; g.hud.setPrompts(g.input.pad); }
  if (g.state === 'playing') {
    g.clock += dt * T.clockRate;
    g.roomba.update(dt, g.input, true);
    g.items.update(dt);
    g.kibble.update(dt);
    g.dirt.update(dt);
    g.entity.update(dt);
    g.story.update(dt);
    watchEntity(dt);
    updateMud();
    updateLair(dt);
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
  g.tension.update(dt);
  g.fx.update(dt);
  g.lidar.update();
  g.motes.update();
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

// First sight of it: the motor and the house drop to nothing for a moment. The sting is saved for the chase.
let lastSight = -100;
const tmp = new THREE.Vector3();
function watchEntity() {
  const g = game, e = g.entity;
  if (!e.root.visible || g.time - lastSight < 35) return;
  e.j.chest.getWorldPosition(tmp);
  const d = Math.hypot(tmp.x - g.roomba.x, tmp.z - g.roomba.z);
  if (d > 8) return;
  const p = tmp.clone().project(g.camera);
  if (p.z > 1 || Math.abs(p.x) > 0.9 || Math.abs(p.y) > 1.2) return;
  if (!g.world.los(g.roomba.x, g.roomba.z, e.x, e.z)) return;
  if (!g.roomba.light && d > 3 && g.time - g.lidar.lastScan > 3) return;
  lastSight = g.time;
  g.audio.hush(1.5);
  g.tension.firstSight();
}

// ---------- hooks the systems call ----------

const clockText = (c = game.clock) => { const m = Math.floor(c), hh = 3 + Math.floor(m / 60), mm = m % 60; return `0${hh}:${String(mm).padStart(2, '0')}`; };
game.clockText = () => clockText() + ' AM';
game.roomName = (x, z) => { const ri = game.world.roomAt(x, z); return ri >= 0 ? ROOMS[ri].name : 'outside'; };
game.key = (act) => (game.input.pad ? { suction: 'X', light: 'Y', scan: 'A', pause: 'Start' } : { suction: 'E', light: 'F', scan: 'SPACE', pause: 'Esc' })[act];

// What gave you away, for the death screen.
game.incident = (kind, text) => {
  const list = game.incidents;
  const last = list[list.length - 1];
  if (last && last.kind === kind && game.time - last.at < 4) return;   // one line per burst
  list.push({ kind, text, at: game.time, clock: clockText() });
  if (list.length > 14) list.shift();
};

game.noise = (x, z, r, kind) => {
  const g = game;
  if (g.entity.state === 'dormant' && !g.flags.entity) { lairHeard(x, z, r, kind); return; }
  g.entity.hear(x, z, r, kind);
};
// The robot's voice is a sound in the house like any other.
game.say = (text, kind) => {
  game.hud.subtitle(`"${text}"`, 3.5);
  game.audio.say(text);
  if (game.state === 'playing') game.noise(game.roomba.x, game.roomba.z, T.noiseVoice, 'voice');
};
game.onEntityChase = () => {
  game.stats.chases++;
  game.hud.log('!! YOU HAVE BEEN SEEN');
  game.audio.stinger();
};
game.onEntitySearch = () => game.hud.log('Under cover. Stay still.');
game.onEntityReach = () => { game.hud.log('!! CONTACT UNDER COVER'); game.post.uniforms.glitch.value = game.settings.flashing ? 0.35 : 0.12; };
game.onEntityScanned = () => game.hud.log('LIDAR: unclassified shape');
game.onEnterLair = () => {
  game.setDoor('laundry', 'closed', 2.5);
  game.audio.doorSlam(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 0.9);
  game.fx.sift(PLACES.laundryDoor[0], 2.08, PLACES.laundryDoor[2] + 0.1, 26, 0.4);
  game.hud.log('Door closed: Laundry');
};
game.onLeaveLair = () => {
  game.setDoor('laundry', 'open', 1.2);
  game.audio.doorCreak(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 2);
};
game.onEntityStep = (x, z, dx, dz, left) => {
  const g = game;
  if (g.mudOn && g.world.roomAt(x, z) === g.world.roomIndex('hall')) g.mudQueue.push({ x, z, dx, dz, left, t: g.time + 3 });
  g.tension.footfall(x, z, Math.min(1, Math.max(0.35, g.entity.speed / 1.7)));
};
// Its muddy feet undo your cleaning, a few seconds behind it.
function updateMud() {
  const g = game, q = g.mudQueue;
  while (q.length && q[0].t <= g.time) {
    const m = q.shift();
    g.world.stampMud(m.x, m.z, m.dx, m.dz);
    g.dirt.addMud(m.x, m.z, m.dx, m.dz, m.left);
  }
}

// Teach at the moment it matters, through the app.
game.onKnock = () => {
  if (game.flags.seen.tipQuiet || game.flags.entity) return;
  game.flags.seen.tipQuiet = true;
  setTimeout(() => { if (game.state === 'playing') game.hud.notify('BrightHome', `Pet sleeping? 🐶 Press ${game.key('suction')} for Quiet Mode.`); }, 2600);
};
game.onBump = () => {
  if (game.flags.seen.tipBump) return;
  game.flags.seen.tipBump = true;
  game.hud.notify('BrightHome', 'Bump detected 💥 Gentle driving keeps things quiet. Rugs are quietest.');
};

// While it is shut away in the laundry, it answers your noise: knocks that follow your rhythm and stop when
// you go quiet. Then it is silent for a while.
function lairHeard(x, z, r, kind) {
  const g = game, L = g.lair;
  if (L.cool > 0 || g.state !== 'playing') return;
  const doorShut = g.world.doors.laundry.state !== 'open';
  if (!doorShut) return;
  const dx = Math.max(11 - x, 0, x - 14), dz = Math.max(0 - z, 0, z - 5);
  if (Math.hypot(dx, dz) > r * 0.6) return;
  L.last = g.time;
  // knock on the wall nearest the noise
  const toKitchen = Math.abs(x - 11) + Math.max(0, z - 5), toHall = Math.abs(z - 5) + Math.max(0, 11 - x);
  const [kx, kz] = toKitchen < toHall ? [11, Math.min(4.7, Math.max(0.3, z))] : [Math.min(13.8, Math.max(11.2, x)), 5];
  if (kind === 'bump') {
    L.bumps = L.bumps.filter((t) => g.time - t < 2.5);
    L.bumps.push(g.time);
    const n = Math.min(3, L.bumps.length);
    setTimeout(() => { if (g.state === 'playing') g.audio.knock(kx, kz, n, 300, 0.55); }, 500);
  } else if (g.time > L.next) {
    g.audio.knock(kx, kz, kind === 'suction' ? 2 : 1, 420, 0.4);
    L.next = g.time + 1.7 + Math.random() * 0.6;
  } else return;
  L.session += 1;
  g.onKnock();
  if (!g.flags.seen.lairLog) { g.flags.seen.lairLog = true; setTimeout(() => g.hud.log('Unidentified sound: Laundry (responding?)'), 1800); }
}
game.lairHeard = lairHeard;
function updateLair(dt) {
  const L = game.lair;
  L.cool = Math.max(0, L.cool - dt);
  if (L.session > 0 && game.time - L.last > 3) { L.session = 0; L.cool = 25; }   // you went quiet; so does it
  if (L.session > 6) { L.session = 0; L.cool = 25; }
}

// Sound captions in the robot's log: what, which side, how near.
const capLast = {};
game.onSound = (label, x, z) => {
  const g = game;
  if (!g.settings.captions || g.state !== 'playing') return;
  if (g.time - (capLast[label] || -100) < 2.5) return;
  capLast[label] = g.time;
  const r = g.roomba, dx = x - r.x, dz = z - r.z, d = Math.hypot(dx, dz);
  if (d > 14) return;
  const f = dx * r.fx + dz * r.fz, rt = -dx * r.fz + dz * r.fx, ang = Math.atan2(rt, f);
  const side = d < 0.4 ? 'here' : Math.abs(ang) < 0.6 ? 'ahead' : Math.abs(ang) > 2.3 ? 'behind' : ang > 0 ? 'right' : 'left';
  const near = d < 2.5 ? 'close' : d < 6 ? 'near' : 'far';
  const walled = !g.world.los(r.x, r.z, x, z) ? ', through a wall' : '';
  g.hud.caption(`Audio: ${label}, ${side}, ${near}${walled}`);
};

game.onKey = (code) => {
  if (code === 'Enter' || code === 'NumpadEnter') {
    if (game.state === 'title' && !$('title').hidden) startGame();
    else if (game.state === 'dead') retry();
    else if (game.state === 'end') restartNight();
  }
  if (game.debug.enabled) debugKey(code);
};

// Is Theo's doorway on screen (for framing its first walk past)?
game.doorwayInView = () => {
  const g = game, v = new THREE.Vector3(PLACES.kidDoor[0], 0.5, PLACES.kidDoor[2]).project(g.camera);
  return v.z < 1 && Math.abs(v.x) < 0.92 && Math.abs(v.y) < 1 && g.world.los(g.roomba.x, g.roomba.z, PLACES.kidDoor[0], 6.3);
};

// Saving at the dock (Easy and Normal).
game.onDock = () => {
  const g = game;
  if (g.state !== 'playing' || !g.diff().dockSave) return;
  if (g.story.step >= g.story.stepCount - 1 || g.time - g.lastSave < 15) return;   // the last step: docking ends the night
  g.lastSave = g.time;
  g.cp = snapshot(g.story.step);
  g.hud.log('Progress saved to the cloud ☁');
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
  h.lights.tv.visible = f.tvOn;   // lights that are off are removed, not dimmed: every light costs every pixel
  g.audio.tvStatic(f.tvOn, PLACES.tv);
  h.lights.fridge.intensity = f.fridgeOpen ? 9 : 0;
  h.lights.fridge.visible = f.fridgeOpen;
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
  h.flapGlow.color.setHex(f.leak === 'dim' ? 0xffc870 : 0x0a0806);
  h.boltIntact.visible = !f.boltTorn;
  h.boltTorn.visible = h.screws.visible = f.boltTorn;
  h.nightlights.forEach((n, i) => { n.alive = f.nightlights[i]; n.dying = 0; setNightlight(n, n.alive ? 1 : 0); });
}
game.applyFlags = applyFlags;

function setNightlight(n, v) {
  n.lensMat.color.setRGB(3.2 * v + 0.08, 1.9 * v + 0.07, 0.8 * v + 0.06);   // over 1: it blooms
  n.glows[0].opacity = 0.7 * v; n.glows[1].opacity = 0.55 * v;
}

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
  const L = h.lights, flash = g.settings.flashing;
  if (f.lampOn) {
    // the dying lamp: a strobe, or with flashing effects off, a slow pulse
    const fl = f.lampFlicker ? (flash ? (Math.random() < 0.45 ? 0 : 1.2) : 0.55 + 0.45 * Math.sin(t * 5)) : flash && Math.random() < 0.004 ? 0.2 : 1;
    L.lamp.intensity = L.lamp.userData.base * fl;
    h.lampShade.emissiveIntensity = 0.6 * fl;
  }
  if (f.tvOn) {
    h.tvStatic.update();
    L.tv.intensity = flash ? 4 + Math.random() * 5 : 6.5 + Math.sin(t * 2.5) * 1.2;
  }
  L.nightlight.intensity = L.nightlight.userData.base * (flash && Math.random() < 0.02 ? 0.3 : 1);
  L.leak.intensity = L.leak.userData.base * (0.85 + Math.random() * 0.15 + (flash && Math.random() < 0.01 ? -0.7 : 0));
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
  // the pet flap swings as the robot goes through
  if (h.petFlap) {
    const r = g.roomba, fz = r.z - PLACES.petFlap[2], near = Math.abs(r.x - PLACES.petFlap[0]) < 0.3 && Math.abs(fz) < 0.25;
    const want = near ? -Math.sign(fz || 1) * Math.min(1.3, (0.25 - Math.abs(fz)) * 8) : 0;
    h.petFlap.rotation.x += (want - h.petFlap.rotation.x) * Math.min(1, dt * (near ? 10 : 4));
  }
  // nightlights short out when it walks past
  const e = g.entity;
  h.nightlights.forEach((n, i) => {
    if (n.alive && e.root.visible && e.state !== 'scare' && Math.hypot(e.x - n.x, e.z - n.z) < 0.75) { n.alive = false; n.dying = 0.7; f.nightlights[i] = false; g.audio.pop(n.x, 0.3, n.z); g.fx.sparksAt(n.x, 0.3, n.z); }
    if (n.dying > 0) {
      n.dying -= dt;
      setNightlight(n, n.dying > 0 ? (flash ? (Math.random() < 0.5 ? 1 : 0.1) : n.dying / 0.7) : 0);
    }
  });
}

// ---------- checkpoints ----------

function snapshot(step) {
  const g = game;
  const world = g.world.snapshot();
  // A door still swinging open is saved as open.
  for (const [id, d] of Object.entries(g.house.doors)) if (d.onArrive) world.doors[id] = 'open';
  // Passing effects from a scene that is still playing are not part of the checkpoint.
  const flags = copyFlags(g.flags);
  if (flags.lampFlicker) { flags.lampFlicker = false; flags.lampOn = false; }
  flags.tvOn = false;
  if (flags.entity) { world.doors.master = 'open'; world.doors.laundry = world.doors.laundry === 'locked' ? 'open' : world.doors.laundry; }
  if (g.entity.state === 'lair') world.doors.laundry = 'open';
  return {
    step, world, roomba: g.roomba.snapshot(), items: g.items.snapshot(), dirt: g.dirt.snapshot(), kibble: g.kibble.snapshot(),
    entity: g.entity.snapshot(), flags, clock: g.clock, explored: [...g.hud.explored],
  };
}
game.checkpoint = (step) => { game.cp = snapshot(step); };

// keepFloor: a reboot keeps the cleaning you did (the "cloud map"): dirt, swept floor, prints, things picked up.
function restore(cp, keepFloor = false) {
  const g = game;
  const keep = keepFloor ? { world: g.world.snapshot(), prints: g.dirt.snapshot(), items: g.items.snapshot(), kibble: g.kibble.snapshot() } : null;
  g.world.restore(cp.world);
  if (keep) {
    g.world.dirt.set(keep.world.dirt); g.world.swept.set(keep.world.swept); g.world.roomDirt.set(keep.world.roomDirt);
  }
  syncDoors();
  g.roomba.restore(cp.roomba);
  g.items.restore(keep ? keep.items : cp.items);
  // prints and the spill: shown as in the checkpoint, but what you cleaned stays clean
  g.dirt.restore(keep ? cp.dirt.map(([shown, amount], k) => [shown, shown && keep.prints[k][0] ? keep.prints[k][1] : amount]) : cp.dirt);
  g.kibble.restore(keep ? cp.kibble.map(([shown, taken], k) => [shown, taken || keep.kibble[k][1]]) : cp.kibble);
  if (!keep) g.dirt.clearMud();
  g.entity.restore(cp.entity);
  g.flags = copyFlags(cp.flags);
  applyFlags();
  g.clock = cp.clock;
  g.hud.explored = new Set(cp.explored);
  g.lidar.clear();
  g.mudQueue = [];
  g.lair = { cool: 0, session: 0, next: 0, last: -100, bumps: [] };
  g.incidents = [];
  g.fx.clear();
  g.tension.reset();
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
  g.roomba.lift = 0; g.roomba.liftRoll = 0;
  g.house.lights.cine.intensity = 0;
  g.house.lights.cine.visible = false;
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
  g.incidents = [];
  g.hud.show(true);
  g.story.start(0, true);
  grabMouse();
}

function unpauseSpeech() { try { if (window.speechSynthesis) { speechSynthesis.cancel(); speechSynthesis.resume(); } } catch { /* none */ } }

function retry() {
  hideOverlays();
  game.audio.ctx?.resume();
  unpauseSpeech();
  restore(game.cp, true);
  game.state = 'playing';
  game.hud.show(true);
  game.story.start(game.cp.step, false);
  const task = game.story.task;
  if (task && task.kind === 'room') game.hud.log(`Cloud map restored: ${Math.floor(task.progress() * 100)}%`);
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
  game.story.cos = [];   // drop every scene still running from the last night
  game.lastSave = -100;
  game.hud.show(true);
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

// Caught, or the battery died. drag: it got you from under cover and pulls you out first.
game.caught = (opts = {}) => {
  const g = game;
  if (g.state !== 'playing' || g.debug.ghost) return;
  g.state = 'dying';
  g.dying = { t: 0, kind: opts.drag ? 'dragged' : 'caught', from: [g.roomba.x, g.roomba.z], to: opts.drag };
  g.stats.deaths++;
  g.lampFlicker = 3;   // the headlamp gutters as it is grabbed
  if (opts.drag) { g.audio.scrape(g.roomba.x, g.roomba.z, 1); g.roomba.shake = 1; return; }
  g.entity.scare();
  g.audio.scream();
};

game.batteryDead = () => {
  const g = game;
  if (g.state !== 'playing') return;
  g.state = 'dying';
  g.dying = { t: 0, kind: 'battery', steps: 0, faceless: !g.flags.entity };
  g.stats.deaths++;
  g.incident('battery', `Battery 0%, ${Math.hypot(g.roomba.x - DOCK.x, g.roomba.z - DOCK.z).toFixed(1)} m from Home Base`);
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
    if (d.faceless) {
      // Before you have seen it, you don't see it now either: a breath behind you, and you are lifted.
      if (d.t > 6.6 && !d.huffed) { d.huffed = true; g.audio.huff(r.x - r.fx * 0.6, 1.8, r.z - r.fz * 0.6, 1.2); }
      if (d.t > 7.4) {
        const k = Math.min(1, (d.t - 7.4) / 1.6);
        r.lift = k * k * 1.1; r.liftRoll = k * 0.9; r.pitch += (-0.3 - r.pitch) * Math.min(1, dt * 2); r.shake = 0.25;
        u.staticAmt.value = Math.min(1, k * 1.2);
        u.glitch.value = Math.min(g.settings.flashing ? 1 : 0.35, k);
      }
      if (d.t > 9.4) die('BATTERY DEPLETED', 'Unit could not reach Home Base. Unit was collected.');
      return;
    }
    if (d.t > 7.2 && g.entity.state !== 'scare') {
      g.entity.scare();
      g.audio.scream();
      r.dead = false; r.light = true; r.battery = 3;
    }
    if (d.t > 7.2) scareCam(d.t - 7.2, dt);
    if (d.t > 8.4) die('BATTERY DEPLETED', 'Unit could not reach Home Base. Unit was collected.');
  } else if (d.kind === 'dragged') {
    // pulled out from under the furniture by the arm, then the face
    const k = Math.min(1, d.t / 0.6);
    if (d.to) { r.x = d.from[0] + (d.to[0] - d.from[0]) * k * k; r.z = d.from[1] + (d.to[1] - d.from[1]) * k * k; }
    r.shake = 1;
    if (d.t > 0.6 && g.entity.state !== 'scare') { g.entity.scare(); g.audio.scream(); }
    if (d.t > 0.6) scareCam(d.t - 0.6, dt);
    if (d.t > 1.85) die('SIGNAL LOST', 'Error 13: unit pulled out from under cover and lifted off the floor.');
  } else {
    scareCam(d.t, dt);
    if (d.t > 1.25) die('SIGNAL LOST', 'Error 13: unit lifted off the floor.');
  }
}

function scareCam(t, dt) {
  const g = game, u = g.post.uniforms, r = g.roomba;
  r.pitch += (0.55 - r.pitch) * Math.min(1, dt * 6);
  r.shake = 0.6;
  u.glitch.value = Math.min(g.settings.flashing ? 1 : 0.35, t * 0.9);
  u.staticAmt.value = t > 1.05 ? 1 : t * 0.12;
  g.hud.show(false);
  g.hud.lab.clearRect(0, 0, g.hud.lab.canvas.width, g.hud.lab.canvas.height);
}

// What gave you away, and one thing to try.
const TIPS = {
  'noise:suction': (k) => `Suction carries through walls. ${k('suction')} switches to Quiet Mode; clean when it is far away.`,
  'noise:bump': () => 'Collisions are loud, louder on tile and bare boards. Slow down near furniture; rugs are quiet.',
  'noise:drive': () => 'Up close it can hear the motor on hard floors. Stop, or keep to the rugs, and let it pass.',
  'noise:scan': () => 'A scan is loud, and if the rays touch it, it turns to look. Scan from cover, or when it is far away.',
  'noise:voice': () => 'Spoken prompts are loud. A low battery or a full bin makes the robot talk: keep both in hand.',
  'noise:crunch': () => 'Dog food crunches. Clear it between its walks, when the motion sensor is quiet.',
  'noise:dock': () => 'Docking chimes. Check the motion sensor before you go home.',
  lampSeen: (k) => `Your headlamp shows you from across a room. ${k('light')} turns it off when it is in view.`,
  lampFace: () => 'Holding the lamp on it for more than a second gets its attention, even from behind.',
  dark: () => 'With the lamp off it still sees you up close. Keep furniture between you; it can\'t see you right behind a stack of boxes.',
  reach: () => 'Noise under cover right next to it makes it reach under. Stay silent, or back away to the far edge.',
  idle: () => 'Staying in one room for long brings it to you. Keep moving between rooms.',
  overuse: () => 'It remembers where you hide. Use different hiding places, and when it reaches under, back away to the far edge.',
  battery: () => 'Battery minutes are shown under the bars, and when it runs low the map draws the way home. Docking also saves.',
};
const DEFAULT_TIP = () => 'It hears suction, bumps and scans, and sees the headlamp. Its body can\'t fit under furniture.';

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
  const recent = g.incidents.filter((i) => g.time - i.at < 90);
  const shown = recent.slice(-3);
  const log = $('death-log');
  log.innerHTML = '';
  for (const i of shown) {
    const row = document.createElement('div');
    row.innerHTML = '<span></span>';
    row.querySelector('span').textContent = i.clock;
    row.append(i.text);
    log.appendChild(row);
  }
  // The tip follows what started it: being seen beats being heard, if both led into the chase.
  let cause = null;
  const ci = recent.map((i) => i.kind).lastIndexOf('chase');
  if (ci > 0) {
    const before = recent.slice(Math.max(0, ci - 3), ci).filter((i) => TIPS[i.kind]);
    cause = before.find((i) => ['lampSeen', 'lampFace', 'dark'].includes(i.kind)) || before[before.length - 1] || null;
  }
  if (!cause) cause = [...recent].reverse().find((i) => TIPS[i.kind]);
  $('death-tip').textContent = (cause ? TIPS[cause.kind] : DEFAULT_TIP)(g.key);
  $('btn-retry').textContent = g.diff().dockSave && g.cp && g.lastSave > 0 && g.cp.roomba && Math.hypot(g.cp.roomba.x - DOCK.x, g.cp.roomba.z - DOCK.z) < 0.3 ? 'Reboot from last save' : 'Reboot from last task';
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

// Difficulty on the title screen, with what each one means.
function renderTitleDifficulty() {
  const box = $('title-diff');
  if (!box) return;
  box.innerHTML = '';
  for (const [v, d] of Object.entries(DIFFICULTY).sort((a, b) => a[0] - b[0])) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = d.name;
    b.classList.toggle('on', +v === game.settings.difficulty);
    b.onclick = () => { game.settings = { ...game.settings, difficulty: +v }; saveSettings(game.settings); renderTitleDifficulty(); };
    box.appendChild(b);
  }
  $('title-diff-desc').textContent = game.diff().desc;
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
  const n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5, Digit7: 6 }[code];
  if (n !== undefined) debugSkip(n);
  if (code === 'KeyG') { g.debug.ghost = !g.debug.ghost; g.hud.log('ghost ' + g.debug.ghost); }
  if (code === 'KeyB') { g.debug.infiniteBattery = !g.debug.infiniteBattery; g.hud.log('infinite battery ' + g.debug.infiniteBattery); }
  if (code === 'KeyC') debugClean(g.story.task?.room);
  if (code === 'KeyT') {
    const room = g.story.task?.room;
    if (room) { const p = g.world.randomFreeIn(g.world.roomIndex(room)); if (p) { g.roomba.x = p[0]; g.roomba.z = p[1]; } }
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
game.debugClean = debugClean;

function debugSkip(n) {
  const g = game, f = g.flags;
  if (n >= 1) { debugClean('living'); f.lampOn = false; }
  if (n >= 2) { debugClean('kitchen'); f.fridgeOpen = true; g.dirt.prints.forEach((_, k) => g.dirt.showPrint(k)); }
  if (n >= 3) { g.dirt.prints.forEach((p) => { p.amount = 0; }); g.setDoor('kid', 'open', 5); }
  if (n >= 4) {
    debugClean('kid'); f.musicBox = false; f.clockOn = false; f.leak = 'bright'; f.entity = true; f.boltTorn = true;
    g.setDoor('laundry', 'open', 5); g.setDoor('master', 'open', 5);
    g.kibble.showSpill();
    g.entity.x = 12.62; g.entity.z = 5.9; g.entity.activate(5);
  }
  if (n >= 5) debugClean('hall', 0.75);
  if (n >= 6) g.kibble.list.forEach((p) => { if (p.group === 'spill' && Math.random() < 0.8) p.taken = true; });
  g.kibble.dirty = true;
  applyFlags();
  g.story.start(n, false);
  g.hud.log('debug: step ' + (n + 1));
}

boot();
