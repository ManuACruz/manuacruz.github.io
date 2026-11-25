// Night 1: the task list, the scripted scares, and the ending.
// Each step is a generator: yield a number to wait that many seconds, or a function to wait until it returns true.
// Scenes that should only ever play once go through `once`, which remembers them in the saved flags.

import * as THREE from 'three';
import { T } from './tune.js';
import { FIRST_WALK, FIRST_WALK_HOLD, FIRST_WALK_DOOR, PLACES, DOCK } from './level.js';

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
      g.hud.hint(g.input.isTouch ? '<b>Left thumb</b> drive · <b>right thumb</b> look' : g.input.pad ? '<b>Left stick</b> drive &nbsp;·&nbsp; <b>right stick</b> look' : '<b>W A S D</b> drive &nbsp;·&nbsp; <b>mouse</b> look (click to grab the mouse)', 9);
      yield 9.5;
      g.hud.hint(`<b>${g.key('suction')}</b> suction &nbsp;·&nbsp; <b>${g.key('light')}</b> headlamp &nbsp;·&nbsp; <b>${g.key('scan')}</b> LIDAR scan &nbsp;·&nbsp; the dock is the <b>green light</b> behind you`, 9);
    }
    this.once('knock1', () => this.task.progress() > 0.2, function* () {
      g.audio.knock(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 3);
      g.onKnock?.();
      yield 2.5;
      g.hud.log('Unidentified sound: Laundry');
    });
    this.once('lamp', () => this.task.progress() > 0.42, function* () {
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
    this.once('microwave', () => inRoom(g, 'kitchen'), function* () {
      yield 2;
      g.audio.tones([88, 0, 88, 0, 88], 'square', 0.03, 0.12);
      g.hud.log('Microwave: timer complete');
    });
    this.once('fridge', () => this.task.progress() > 0.35 && !g.flags.fridgeOpen, function* () {
      g.flags.fridgeOpen = true;
      g.audio.creak(PLACES.fridge[0], 1, PLACES.fridge[2], 0.9, 0.6);
      g.applyFlags();
      g.hud.log('Refrigerator: door open');
    });
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 2;
    if (g.flags.seen.backdoor) return;
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
    g.flags.seen.backdoor = true;
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
    this.once('musicbox', () => inRoom(g, 'kid'), function* () {
      yield 1.5;
      g.flags.musicBox = true;
      g.applyFlags();
      g.hud.log('Unknown audio source: toy chest');
    });
    const story = this;
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
      g.audio.doorSlam(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 0.3, false);
      g.flags.leak = 'bright';
      g.flags.boltTorn = true;   // the bottom bolt hangs torn out; screws on the floor
      g.applyFlags();
      g.kibble.showSpill();
      yield 1.2;
      // Out of the laundry and down the hall...
      g.entity.walkScript(FIRST_WALK.slice(0, FIRST_WALK_HOLD + 1), 0.85, null);
      story.spawn(function* () {   // the bedroom door swings open as it passes
        yield () => g.entity.x < PLACES.masterDoor[0] + 0.4 || g.entity.state !== 'script';
        if (g.world.doors.master.state !== 'open') {
          g.setDoor('master', 'open', 0.7);
          g.audio.doorCreak(PLACES.masterDoor[0], PLACES.masterDoor[2], 2.6);
        }
      });
      yield 4;
      g.hud.log('MOTION DETECTED: HALLWAY');
      yield () => g.entity.state === 'still';
      // ...it waits just short of Theo's door until you're looking at the doorway...
      const t0 = g.time;
      yield () => g.doorwayInView() || g.time - t0 > 12 || !inRoom(g, 'kid');
      g.entity.walkScript(FIRST_WALK.slice(FIRST_WALK_HOLD, FIRST_WALK_DOOR + 1), 0.85, null);
      yield () => g.entity.state === 'still';
      // ...stops in it, folded under the frame, facing in, and looks at you...
      g.entity.yaw = 0; g.entity.stare = true; g.entity.poseTimer = 0;
      g.audio.hush(2.6);
      yield 2.6;
      // ...and walks on.
      g.entity.stare = false;
      g.entity.walkScript(FIRST_WALK.slice(FIRST_WALK_DOOR), 0.85, () => g.entity.activate());
      yield () => g.entity.active;
      g.hud.notify('BrightHome', `Motion detected at home 👀 Night Mode tip: lamp off (${g.key('light')}), suction off (${g.key('suction')}), park under the sofa or a bed 🌙`);
      g.hud.hint('It hears <b>suction</b>, <b>bumps</b>, <b>scans</b> and <b>voice prompts</b>. It sees your <b>headlamp</b>. Its body can\'t fit <b>under furniture</b>.', 11);
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
    g.mudOn = true;   // its feet leave mud on the hall floor now
    // The app takes the wheel: lamp and suction on, three scans you can't stop. And it comes to see.
    this.once('takeover', () => this.task.progress() > 0.3 && g.entity.active && !['chase', 'reach', 'search'].includes(g.entity.state) && g.entity.dist > 5, function* () {
      g.hud.notify('BrightHome', 'Listing photos in 6 hours! 📸 Running a quick map refresh.');
      yield 1.6;
      g.roomba.remote = 7.5;
      g.hud.log('Remote session started: BrightHome app');
      yield 0.8;
      for (let k = 0; k < 3; k++) {
        g.roomba.scan(true);
        const e = g.entity;
        if (k === 0 && (e.state === 'patrol' || e.state === 'investigate' || e.state === 'check')) {
          g.incident('noise:scan', 'Remote map refresh: 3 scans, lamp and suction on');
          e.investigate(g.roomba.x, g.roomba.z);
        }
        yield 2.2;
      }
      yield () => g.roomba.remote <= 0;
      g.hud.log('Map refresh complete ✨ Control returned.');
    });
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    g.mudOn = false;
    yield 1;
  },

  function* spill(first) {
    const g = this.game;
    if (!g.kibble.spillShown) g.kibble.showSpill();
    this.setTask('Spot clean the spill', 'spill', null, 0.9);
    if (first) g.hud.notify('BrightHome', 'Spill detected outside the Laundry 🐶 Spot clean added!');
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
  yield 2.2;
  // A last mapping scan from the dock, lamp off. The room comes back cyan, except for the shape bent over you.
  g.roomba.light = false;
  g.hud.log('Final map scan for the listing photos 📸');
  const ex = DOCK.x + 0.8, ez = DOCK.z + 0.22;
  g.entity.placeStill(ex, ez, Math.atan2(DOCK.x - ex, DOCK.z - ez));
  g.entity.j.spine.rotation.x = 0.7;
  g.entity.j.head.rotation.set(0.9, 0, 0.3);
  g.entity.layoutNeck();
  yield 0.8;
  g.roomba.scan(true, 14);
  yield 3.4;
  // pull the camera out of the robot
  g.hud.show(false);
  g.roomba.ledBoost = 1;
  g.house.lights.cine.intensity = 7;
  g.house.lights.cine.visible = true;
  g.beginCinematic(new THREE.Vector3(2.45, 0.35, 0.95), new THREE.Vector3(0.95, 1.1, 2.85), 6);
  yield 4;
  const lean = { t: 0 };
  this.spawn(function* () {
    while (lean.t < 1) { lean.t += 0.02; g.entity.j.spine.rotation.x = 0.7 + lean.t * 0.5; yield 0.03; }
  });
  yield 3.2;
  g.post.uniforms.glitch.value = g.settings.flashing ? 1 : 0.4;
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

  // A scene that plays once per night, even across retries and saves made after it.
  once(id, cond, gen) {
    const g = this.game, self = this;
    this.on(() => !g.flags.seen[id] && cond(), function* () { g.flags.seen[id] = true; yield* gen.call(self); });
  }

  setTask(title, kind, room, target) {
    const g = this.game;
    if (!title) { this.task = null; g.hud.setTask(null); return; }
    const ri = room ? g.world.roomIndex(room) : -1;
    this.task = {
      title, kind, room, target,
      progress: kind === 'room' ? () => g.world.roomProgress(ri)
        : kind === 'prints' ? () => g.dirt.printsProgress
        : kind === 'spill' ? () => g.kibble.spillProgress
        : () => (g.roomba.docked ? 1 : 0),
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
