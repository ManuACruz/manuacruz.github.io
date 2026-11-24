// Night 1: the task list, the scripted scares, and the ending.
// Each step is a generator: yield a number to wait that many seconds, or a function to wait until it returns true.

import * as THREE from 'three';
import { T } from './tune.js';
import { FIRST_WALK, PLACES, DOCK, ROOMS } from './level.js';

const inRoom = (g, id) => g.world.roomAt(g.roomba.x, g.roomba.z) === g.world.roomIndex(id);

const STEPS = [
  function* living(first) {
    const g = this.game;
    this.setTask('Clean the Living Room', 'room', 'living', T.roomTarget);
    if (first) {
      yield 1.2;
      g.audio.startJingle();
      g.say('Starting cleaning cycle.');
      yield 1.6;
      g.hud.notify('BrightHome', 'Scheduled clean started ✨ Open house tomorrow at 9:00 AM. Make it shine!');
      yield 1.5;
      g.hud.hint(g.input.isTouch ? '<b>Left thumb</b> drive · <b>right thumb</b> look' : '<b>W A S D</b> drive &nbsp;·&nbsp; <b>mouse</b> look (click to grab the mouse)', 9);
      yield 9.5;
      g.hud.hint('<b>E</b> suction &nbsp;·&nbsp; <b>F</b> headlamp &nbsp;·&nbsp; <b>SPACE</b> LIDAR scan &nbsp;·&nbsp; dock at the <b>green light</b> to charge', 9);
    }
    this.on(() => this.task.progress() > 0.2, function* () {
      g.audio.knock(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 3);
      yield 2.5;
      g.hud.log('Unidentified sound: Laundry');
    });
    this.on(() => this.task.progress() > 0.42, function* () {
      g.flags.lampFlicker = true;
      yield 1.4;
      g.flags.lampFlicker = false;
      g.flags.lampOn = false;
      g.audio.doorSlam(4.7, 3.5, 0.15);
      g.applyFlags();
      yield 2.5;
      g.flags.tvOn = true;
      g.applyFlags();
      g.hud.log('Media device: powered on');
      const t0 = g.time;
      yield () => Math.hypot(g.roomba.x - PLACES.tv[0], g.roomba.z - PLACES.tv[2]) < 1.7 || g.time - t0 > 15;
      g.flags.tvOn = false;
      g.applyFlags();
    });
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.5;
  },

  function* kitchen(first) {
    const g = this.game;
    this.setTask('Clean the Kitchen', 'room', 'kitchen', T.roomTarget);
    if (first) g.hud.notify('BrightHome', 'Living Room done! 🛋️ Next up: the Kitchen.');
    this.on(() => inRoom(g, 'kitchen'), function* () {
      yield 2;
      g.audio.tones([88, 0, 88, 0, 88], 'square', 0.03, 0.12);
      g.hud.log('Microwave: timer complete');
    });
    this.on(() => this.task.progress() > 0.35 && !g.flags.fridgeOpen, function* () {
      g.flags.fridgeOpen = true;
      g.audio.creak(PLACES.fridge[0], 1, PLACES.fridge[2], 0.9, 0.6);
      g.applyFlags();
      g.hud.log('Refrigerator: door open');
    });
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 2;
    // Somebody comes in the back door.
    for (let k = 0; k < 4; k++) { g.audio.creak(PLACES.backDoor[0], 1, PLACES.backDoor[2], 0.12, 0.5); yield 0.18; }
    yield 0.6;
    g.lampFlicker = 2;
    g.setDoor('back', 'open-visual');
    g.audio.doorCreak(PLACES.backDoor[0], PLACES.backDoor[2], 1.8);
    g.audio.wind(PLACES.backDoor[0], PLACES.backDoor[2], 4);
    yield 2.2;
    g.setDoor('back', 'locked');
    g.audio.doorSlam(PLACES.backDoor[0], PLACES.backDoor[2], 0.6);
    yield 0.9;
    const prints = g.dirt.prints;
    for (let k = 0; k < prints.length; k++) {
      g.dirt.showPrint(k);
      g.audio.footstep(prints[k].x, prints[k].z, 0.75);
      yield 0.62;
    }
    g.audio.creak(PLACES.kidDoor[0], 1, PLACES.kidDoor[2], 0.6, 0.6);
    yield 0.7;
    g.audio.doorSlam(PLACES.kidDoor[0], PLACES.kidDoor[2], 0.25);
    yield 2;
    g.hud.notify('BrightHome', 'Mud detected in Kitchen and Hallway 🐾 Spot clean added to your schedule.');
  },

  function* prints(first) {
    const g = this.game;
    this.setTask('Spot clean the footprints', 'prints', null, T.printsTarget);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.5;
    g.setDoor('kid', 'open', 0.35);
    g.audio.doorCreak(PLACES.kidDoor[0], PLACES.kidDoor[2], 3.2);
    yield 3;
    g.hud.log('Door opened. Mapping new area...');
    yield 1.5;
    yield () => g.world.doors.kid.state === 'open';   // the next checkpoint must see it open
  },

  function* kid(first) {
    const g = this.game;
    this.setTask("Clean Theo's Room", 'room', 'kid', T.roomTarget);
    if (first) g.hud.notify('BrightHome', "Theo's Room has been added to tonight's clean.");
    this.on(() => inRoom(g, 'kid'), function* () {
      yield 1.5;
      g.flags.musicBox = true;
      g.applyFlags();
      g.hud.log('Unknown audio source: toy chest');
    });
    const intro = function* () {
      g.flags.entity = true;   // claimed: it only comes out once
      g.audio.windDown();
      yield 3.5;
      g.flags.musicBox = false;
      g.flags.clockOn = false;
      g.applyFlags();
      yield 2.5;
      g.setDoor('laundry', 'open', 1.5);
      g.audio.doorCreak(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 2);
      g.flags.leak = 'bright';
      g.applyFlags();
      yield 1.2;
      g.entity.walkScript(FIRST_WALK, 0.85, () => g.entity.activate());
      yield 5;
      g.hud.log('MOTION DETECTED: HALLWAY');
      yield () => g.entity.active;
      g.hud.hint('Something is moving in the house. <b>Noise</b> and your <b>headlamp</b> draw it in. Hide <b>under furniture</b> — it can\'t reach you there.', 11);
    };
    if (!g.flags.entity) this.on(() => this.task.progress() > 0.5 && inRoom(g, 'kid') && !g.flags.entity, intro);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
    // Rushed it? It still comes out before the hallway.
    if (!g.flags.entity) this.spawn(intro);
    yield () => g.entity.active;
  },

  function* hall(first) {
    const g = this.game;
    this.setTask('Clean the Hallway', 'room', 'hall', T.hallTarget);
    if (first) g.hud.notify('BrightHome', 'Almost there! Hallway next. The buyers are going to love it 🏡');
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
  },

  function* home(first) {
    const g = this.game;
    this.setTask('Return to Home Base', 'dock', null, 1);
    g.say('Cleaning complete. Returning to Home Base.');
    g.hud.notify('BrightHome', 'All done! Head home and rest up 💤');
    yield () => g.roomba.docked;
    yield* ending.call(this);
  },
];

function* ending() {
  const g = this.game;
  if (g.state !== 'playing') return;   // caught on the very frame it docked: the death wins
  g.state = 'cutscene';
  this.setTask(null);
  g.entity.hide();
  g.audio.completeJingle();
  g.say('Cleaning complete.');
  yield 2.5;
  g.hud.notify('BrightHome', 'Cleaning report ready. Heads up: 1 person was detected at home tonight. Was this you?');
  yield 3.5;
  g.hud.explored.add(g.world.roomIndex('laundry'));
  g.hud.log('MAP UPDATED: 1 new area found');
  yield 2.5;
  // pull the camera out of the robot
  g.entity.placeStill(DOCK.x + 0.85, DOCK.z + 0.75, Math.atan2(DOCK.x - (DOCK.x + 0.85), DOCK.z - (DOCK.z + 0.75)));
  g.entity.j.head.rotation.set(0.9, 0, 0);
  g.entity.layoutNeck();
  g.hud.show(false);
  g.roomba.ledBoost = 1;
  g.house.lights.cine.intensity = 7;
  g.beginCinematic(new THREE.Vector3(2.45, 0.35, 0.95), new THREE.Vector3(0.95, 1.1, 2.85), 6);
  yield 4;
  const lean = { t: 0 };
  this.spawn(function* () {
    while (lean.t < 1) { lean.t += 0.02; g.entity.j.spine.rotation.x = 0.28 + lean.t * 0.9; yield 0.03; }
  });
  yield 3.2;
  g.post.uniforms.glitch.value = 1;
  g.audio.stinger();
  yield 0.6;
  g.showEnd();
}

export class Story {
  constructor(game) {
    this.game = game;
    this.step = 0;
    this.task = null;
    this.cos = [];
    this.triggers = [];
  }

  // Moving on keeps side scenes that are still playing; a retry clears everything.
  start(step, first = true) {
    this.step = step;
    this.cos = first ? this.cos.filter((c) => !c.main && !c.done) : [];
    this.triggers = [];
    this.game.checkpoint(step);
    this.cos.push({ it: STEPS[step].call(this, first), wait: 0, cond: null, main: true });
  }

  spawn(gen) { this.cos.push({ it: gen.call(this), wait: 0, cond: null }); }
  on(cond, gen) { this.triggers.push({ cond, gen }); }

  setTask(title, kind, room, target) {
    const g = this.game;
    if (!title) { this.task = null; g.hud.setTask(null); return; }
    const ri = room ? g.world.roomIndex(room) : -1;
    this.task = {
      title, kind, room, target,
      progress: kind === 'room' ? () => g.world.roomProgress(ri) : kind === 'prints' ? () => g.dirt.printsProgress : () => (g.roomba.docked ? 1 : 0),
    };
    g.hud.setTask(title);
  }

  complete() {
    const g = this.game;
    g.hud.taskDone();
    g.audio.tones([84, 88, 91], 'square', 0.04, 0.09);
    g.hud.log('Task complete');
  }

  update(dt) {
    for (let k = this.triggers.length - 1; k >= 0; k--) {
      const tr = this.triggers[k];
      if (tr.cond()) { this.triggers.splice(k, 1); this.spawn(tr.gen); }
    }
    for (const co of this.cos) {
      if (co.wait > 0) { co.wait -= dt; if (co.wait > 0) continue; }
      for (let guard = 0; guard < 20; guard++) {
        if (co.cond) { if (!co.cond()) break; co.cond = null; }
        const r = co.it.next();
        if (r.done) { co.done = true; break; }
        if (typeof r.value === 'number') { co.wait = r.value; break; }
        if (typeof r.value === 'function') co.cond = r.value;
      }
    }
    const main = this.cos.find((c) => c.main);
    this.cos = this.cos.filter((c) => !c.done);
    if (main && main.done && this.step < STEPS.length - 1 && this.game.state === 'playing') this.start(this.step + 1, true);
  }

  get stepCount() { return STEPS.length; }
}
