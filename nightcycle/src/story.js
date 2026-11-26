// Each night: the task list, the scripted scares, and the ending.
// Each step is a generator: yield a number to wait that many seconds, or a function to wait until it returns true.
// Scenes that should only ever play once go through `once`, which remembers them in the saved flags.

import * as THREE from 'three';
import { T } from './tune.js';
import { FIRST_WALK, FIRST_WALK_HOLD, FIRST_WALK_DOOR, PLACES, DOCK, NIGHT } from './level.js';

const inRoom = (g, id) => g.world.roomAt(g.roomba.x, g.roomba.z) === g.world.roomIndex(id);

// ---------- Night 1 ----------

const NIGHT1 = [
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
    }, true);
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
    }, true);
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
    }, true);
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

// ---------- Night 2: it rearranged the house ----------
// The sofa blocks the arch, the fridge is pulled out from a hole into the laundry, and the laundry door hangs
// open. It comes out of the hole while you clean the kitchen and goes straight to your dock.

const toward = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
const roomDist = (g, ri) => { const r = g.world.rooms[ri]; return Math.hypot((r.x0 + r.x1) / 2 - g.roomba.x, (r.z0 + r.z1) / 2 - g.roomba.z); };

const NIGHT2 = [
  function* living(first) {
    const g = this.game;
    this.setTask('Clean the Living Room', 'room', 'living', T.roomTarget);
    if (first) {
      yield 1.2;
      g.audio.startJingle();
      g.say('Starting cleaning cycle.');
      yield 1.8;
      g.hud.log('Map mismatch: 3 objects moved since last session');
      yield 1.6;
      g.hud.notify('BrightHome', 'Welcome back! 🏡 Second viewing tomorrow at 9:00. The buyers asked to see the Laundry 🧺');
      yield 2.4;
      g.hud.log('Path blocked: Living Room to Kitchen. Re-routing via Hallway');
    }
    // The dock chimes by itself, as if something touched it. Nothing is there.
    this.once('n2dock', () => this.task.progress() > 0.3, function* () {
      g.audio.dock();
      g.dockAlarm = 2.5;
      yield 0.8;
      g.hud.log('Home Base: docking signal from unknown device');
    }, true);
    // Knocks inside the wall, coming along it toward the dock. It is in the walls.
    this.once('n2walls', () => this.task.progress() > 0.55, function* () {
      for (let k = 0; k < 5; k++) { g.audio.knock(5.6 - k * 1.1, 5.0, 1, 300, 0.32 + k * 0.05); yield 0.9; }
      g.audio.thump(0.3, 1.2, 2.4, 0.6);
      g.fx.sift(0.6, 2.4, 2.4, 18, 0.5);
    }, true);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.5;
  },

  function* kitchen(first) {
    const g = this.game, story = this;
    this.setTask('Clean the Kitchen', 'room', 'kitchen', T.roomTarget);
    if (first) g.hud.notify('BrightHome', 'Living Room done! 🛋️ Next up: the Kitchen. (Did someone move the fridge? 🤔)');
    this.once('n2fridge', () => inRoom(g, 'kitchen'), function* () {
      yield 1.5;
      g.hud.log('Refrigerator: position changed. Door open');
      yield 2.5;
      g.hud.log('New opening detected: Kitchen to Laundry');
    }, true);
    // It comes out of the hole, crosses the kitchen and the hall, and stops over your dock.
    const walkOut = function* () {
      g.flags.entity = true;   // claimed: it only comes out once
      g.flags.seen.n2walk = true;
      const [hx, , hz] = PLACES.hole;
      g.audio.thump(hx + 0.9, 0.4, hz, 0.8);
      g.hud.log('Unidentified sound: Laundry');
      yield 1.6;
      g.audio.scrape(hx + 0.6, hz, 0.9);
      g.bulbFlicker = 2;
      // it waits in there until you are looking at the hole (12 s at most)
      const t0 = g.time;
      yield () => g.holeInView() || g.time - t0 > 12 || !inRoom(g, 'kitchen');
      g.audio.hush(2.4);
      g.entity.walkScript(FIRST_WALK, 0.8, null, true);
      story.spawn(function* () {   // its prints appear under its feet as it goes
        const prints = g.dirt.prints;
        while (!g.entity.active && g.entity.state !== 'dormant') {
          prints.forEach((p, k) => { if (!p.shown && Math.hypot(p.x - g.entity.x, p.z - g.entity.z) < 0.45) g.dirt.showPrint(k); });
          yield 0.1;
        }
        prints.forEach((p, k) => { if (!p.shown) g.dirt.showPrint(k); });
      });
      yield 3;
      g.hud.log('MOTION DETECTED: KITCHEN');
      yield () => g.entity.state === 'still';
      // At the dock it bends right down over it.
      const e = g.entity, [ex, ez] = FIRST_WALK[FIRST_WALK.length - 1];
      e.placeStill(ex, ez, toward(ex, ez, DOCK.x, DOCK.z));
      e.j.spine.rotation.x = 0.75;
      e.j.head.rotation.set(0.95, 0, -0.35);
      e.layoutNeck();
      g.audio.huff(DOCK.x + 0.4, 0.5, DOCK.z, 0.9);
      g.dockAlarm = 3;
      g.audio.dock();
      g.hud.log('Home Base: contact detected');
      yield 3.2;
      e.body.resetPose();
      e.activate();
      yield 1.5;
      g.hud.notify('BrightHome', 'Motion detected near Home Base 👀 Charging may be interrupted tonight. Night Mode tips still apply 🌙');
      g.hud.hint('It has learned where the <b>dock</b> is. It waits there, more when your <b>battery is low</b> or your <b>bin is full</b>.', 11);
    };
    if (!g.flags.entity) this.on(() => this.task.progress() > 0.45 && inRoom(g, 'kitchen') && !g.flags.entity, walkOut);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
    if (!g.flags.entity) this.spawn(walkOut);   // rushed it? it still comes out
    yield () => g.entity.active;
  },

  function* prints(first) {
    const g = this.game;
    this.setTask('Spot clean the footprints', 'prints', null, T.printsTarget);
    if (first) g.hud.notify('BrightHome', 'Mud detected from the Kitchen to Home Base 🐾 Spot clean added!');
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.5;
  },

  function* laundry(first) {
    const g = this.game;
    this.setTask('Clean the Laundry', 'room', 'laundry', T.roomTarget);
    if (first) g.hud.notify('BrightHome', 'Last big one: the Laundry! 🧺 Buyers love a utility room.');
    this.once('n2laundry', () => inRoom(g, 'laundry'), function* () {
      yield 1;
      g.hud.log('Mapping new area: Laundry');
    });
    // Halfway, the door slams and the bulb stutters: for a while the hole is the only way out.
    this.once('n2slam', () => this.task.progress() > 0.45 && inRoom(g, 'laundry') && g.world.doors.laundry.state === 'open' && g.entity.state !== 'lair'
      && Math.hypot(g.roomba.x - PLACES.laundryDoor[0], g.roomba.z - PLACES.laundryDoor[2]) > 1.2 && Math.hypot(g.entity.x - PLACES.laundryDoor[0], g.entity.z - PLACES.laundryDoor[2]) > 1.2, function* () {
      g.setDoor('laundry', 'closed', 3);
      g.audio.doorSlam(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 1);
      g.bulbFlicker = 2.5;
      g.hud.log('Door closed: Laundry');
      yield 10;
      if (g.world.doors.laundry.state !== 'open' && g.entity.state !== 'lair') {
        g.setDoor('laundry', 'open', 0.8);
        g.audio.doorCreak(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 2.5);
      }
    });
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.5;
    // The dog food comes out through the hole, dragged.
    const [hx, , hz] = PLACES.hole;
    g.audio.drag(hx, hz, 2.2);
    yield 1.4;
    g.kibble.showSpill();
    g.audio.crunch(0.6);
    yield 1;
  },

  function* spill(first) {
    const g = this.game;
    if (!g.kibble.spillShown) g.kibble.showSpill();
    this.setTask('Spot clean the spill', 'spill', null, 0.9);
    if (first) g.hud.notify('BrightHome', 'Spill detected in the Kitchen 🐶 Spot clean added!');
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
  },

  function* home(first) {
    const g = this.game;
    this.setTask('Return to Home Base', 'dock', null, 1);
    g.say('Cleaning complete. Returning to Home Base.');
    g.hud.notify('BrightHome', 'All done! Head home and rest up 💤');
    g.entity.dockNext = true;   // it knows you have to come home: it goes there first
    yield () => g.roomba.docked;
    yield* ending2.call(this);
  },
];

// Home, in the dark. Something comes up behind the robot and pulls the dock's plug out of the wall.
function* ending2() {
  const g = this.game;
  if (g.state !== 'playing') return;   // caught on the very frame it docked: the death wins
  g.state = 'cutscene';
  this.setTask(null);
  g.entity.hide();
  g.audio.completeJingle();
  g.say('Cleaning complete.');
  yield 2.5;
  g.hud.notify('BrightHome', 'Cleaning report ready ✨ The Laundry looks great! Heads up: Home Base lost power 3 times tonight. Was this you?');
  yield 3.5;
  g.hud.log('MAP UPDATED: hollow floor behind the dryer');
  yield 2.4;
  g.roomba.light = false;
  g.hud.log('Night Mode on. Charging 🔌');
  yield 1.6;
  g.audio.footstep(DOCK.x + 2.4, DOCK.z + 1.4, 0.55);
  yield 0.8;
  g.audio.footstep(DOCK.x + 1.6, DOCK.z + 0.9, 0.7);
  yield 0.9;
  g.audio.huff(DOCK.x + 0.7, 0.6, DOCK.z + 0.5, 1);
  yield 1.3;
  // the plug comes out of the wall
  g.unplugDock(Infinity);
  g.audio.powerDown();
  yield 1.4;
  // A last scan: it is crouched right in front of you, its hand on the plug.
  const ex = 1.5, ez = 2.95, plug = g.house.plugSpot.getWorldPosition(new THREE.Vector3());
  plug.y = 0.03;
  g.entity.placeStill(ex, ez, toward(ex, ez, plug.x, plug.z));
  g.entity.body.reachPose(1, plug, g.time);
  yield 0.5;
  g.roomba.scan(true, 14);
  yield 3.6;
  g.post.uniforms.glitch.value = g.settings.flashing ? 1 : 0.4;
  g.audio.stinger();
  yield 0.6;
  g.showEnd();
}

// ---------- Night 3: it starts unplugging things ----------
// The old dock is dead; a spare waits by the bedroom door. Things go dark one by one, then it comes up out of the
// hatch, walks to your new dock and pulls its plug. While it waits there it pulls it again; the smart plug comes back.

const NIGHT3 = [
  function* trek(first) {
    const g = this.game;
    this.setTask('Go to the spare Home Base', 'dock', null, 1);
    if (first) {
      yield 1.2;
      g.audio.error();
      g.say('Home Base not found. Running on battery.');
      yield 2.4;
      g.hud.log('Home Base offline (unplugged)');
      yield 1.6;
      g.hud.notify(g.app, 'Your Home Base went offline last night 😕 We sent a spare! It\'s in the Hallway, by the Bedroom door 📦');
      yield 2.5;
      g.hud.hint('The old dock is <b>dead</b>. Charge at the spare one, in the <b>Hallway</b> by the Bedroom door. The map shows the way.', 9);
    }
    yield () => g.roomba.docked && !g.dockDead;
    this.complete();
    yield 1.2;
  },

  function* master(first) {
    const g = this.game;
    this.setTask('Clean the Bedroom', 'room', 'master', T.roomTarget);
    if (first) g.hud.notify(g.app, 'Charging ✅ While you\'re there: the Bedroom 🛏️ The dust sheets are off. Big job!');
    // The house goes dark, one plug at a time, coming closer.
    this.once('n3power', () => this.task.progress() > 0.25, function* () {
      g.unplug('fridge');
      yield 3;
      g.unplug('laundry');
      yield 3;
      g.unplug('nightlight');
      yield 1.5;
      g.audio.scrape(9.0, 5.8, 0.7);
    });
    // It comes up out of the hatch, walks to your new dock, and pulls the plug.
    const appear = function* () {
      g.flags.entity = true;
      g.audio.thump(PLACES.hatch[0], 0.3, PLACES.hatch[2], 0.9);
      g.hud.log('Unidentified sound: Laundry (below floor)');
      yield 2;
      g.entity.walkScript(FIRST_WALK, 0.85, null, true);
      yield 3;
      g.hud.log('MOTION DETECTED: LAUNDRY');
      yield () => g.entity.state === 'still';
      const e = g.entity, [ex, ez] = FIRST_WALK[FIRST_WALK.length - 1];
      const plug = g.house.plugSpot.getWorldPosition(new THREE.Vector3());
      e.placeStill(ex, ez, toward(ex, ez, plug.x, plug.z));
      e.body.reachPose(1, new THREE.Vector3(plug.x, 0.03, plug.z), g.time);
      yield 1.2;
      g.unplugDock(40);
      g.audio.huff(ex, 0.8, ez, 0.8);
      yield 2.2;
      e.body.resetPose();
      e.activate();
      yield 1.2;
      g.hud.notify(g.app, 'Home Base lost power 🔌 The smart plug reconnects in 40 s. Is something unplugging your devices? 🤔');
      g.hud.hint('It pulls the dock\'s plug while it waits there. The smart plug brings it back after <b>40 s</b>. Docked with no power: no charge.', 11);
    };
    if (!g.flags.entity) this.on(() => this.task.progress() > 0.5 && inRoom(g, 'master') && !g.flags.entity, appear);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
    if (!g.flags.entity) this.spawn(appear);
    yield () => g.entity.active;
  },

  function* bath(first) {
    const g = this.game;
    this.setTask('Clean the Bathroom', 'room', 'bath', T.roomTarget);
    if (first) g.hud.notify(g.app, 'Bedroom done! 🛏️ Next: the Bathroom 🛁 Long way from the dock: watch your battery.');
    // the baby monitor in the bedroom picks up breathing from Theo's room
    this.once('n3monitor', () => inRoom(g, 'bath') && this.task.progress() > 0.3, function* () {
      g.hud.log('Baby monitor: sound detected (Theo\'s Room)');
      g.audio.huff(5.2, 1.0, 8.2, 0.6);
      yield 2.5;
      g.audio.huff(5.2, 1.0, 8.2, 0.7);
    }, true);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.2;
  },

  function* batteries(first) {
    const g = this.game;
    this.setTask('Pick up the batteries', 'collect', null, 1);
    if (first) g.hud.notify(g.app, 'Smoke alarm batteries on the floor 🔋 One under every alarm: somebody took them all out. Pick them up!');
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.2;
  },

  function* kitchen(first) {
    const g = this.game;
    this.setTask('Clean the Kitchen', 'room', 'kitchen', T.roomTarget);
    if (first) g.hud.notify(g.app, 'Last one: the Kitchen 🍳 The fridge is off, so bring your own light 🔦');
    // halfway the fridge door swings shut by itself: the last light in the room goes
    this.once('n3fridge', () => this.task.progress() > 0.5 && inRoom(g, 'kitchen'), function* () {
      g.flags.fridgeOpen = false;
      g.applyFlags();
      yield 0.8;
      g.audio.doorSlam(PLACES.fridge[0], PLACES.fridge[2], 0.4, false);
      g.hud.log('Refrigerator: door closed');
    });
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
  },

  function* home(first) {
    const g = this.game;
    this.setTask('Return to Home Base', 'dock', null, 1);
    g.say('Cleaning complete. Returning to Home Base.');
    g.hud.notify(g.app, 'All done! Head home and rest up 💤');
    g.entity.dockNext = true;
    yield () => g.roomba.docked;
    yield* ending3.call(this);
  },
];

// Docked in the hall, facing the kitchen arch, lamp off. Something plugs the fridge back in: its door swings open,
// the light comes through the arch, and in it, it is standing there, watching you.
function* ending3() {
  const g = this.game;
  if (g.state !== 'playing') return;
  g.state = 'cutscene';
  this.setTask(null);
  g.entity.hide();
  g.audio.completeJingle();
  g.say('Cleaning complete.');
  yield 2.5;
  g.hud.notify(g.app, 'Cleaning report ready ✨ Heads up: 9 devices lost power tonight. Was this you? 🤔');
  yield 3.5;
  g.hud.log('MAP UPDATED: basement detected below Laundry');
  yield 2.4;
  g.roomba.light = false;
  g.hud.log('Night Mode on');
  yield 2;
  const ex = 8.45, ez = 4.55;
  g.entity.placeStill(ex, ez, toward(ex, ez, g.roomba.x, g.roomba.z));
  g.entity.j.spine.rotation.x = 0.3;
  g.entity.j.head.rotation.set(0.45, 0, -0.4);
  g.entity.layoutNeck();
  g.audio.unplug(PLACES.fridge[0], 0.3, PLACES.fridge[2]);   // the same snap, the other way
  g.flags.fridgePower = true;
  g.flags.fridgeOpen = true;
  g.applyFlags();
  g.audio.creak(PLACES.fridge[0], 1, PLACES.fridge[2], 1.2, 0.5);
  g.roomba.pitch = 0.4;
  g.audio.hush(3);
  yield 1.2;
  g.hud.log('Refrigerator: power restored');
  yield 2.4;
  g.post.uniforms.glitch.value = g.settings.flashing ? 1 : 0.4;
  g.audio.stinger();
  yield 0.6;
  g.showEnd();
}

// ---------- Night 4: it turns the lights on you ----------
// Everything is back where it was, as if they never left. The power is on, and it switches lights on where you are.

const NIGHT4 = [
  function* living(first) {
    const g = this.game;
    this.setTask('Clean the Living Room', 'room', 'living', T.roomTarget);
    if (first) {
      yield 1.2;
      g.audio.startJingle();
      g.say('Starting cleaning cycle.');
      yield 1.8;
      g.hud.log('Map mismatch: 0 objects moved. Layout restored');
      yield 1.6;
      g.hud.notify(g.app, 'Welcome home! 🏡 Looks like the family stopped by. Good news: the lights work again 💡');
      yield 2.6;
      g.hud.hint('The power is back. A <b>lit room</b> shows you from across it, headlamp or not. Under furniture you are still hidden.', 10);
    }
    this.once('n4tv', () => this.task.progress() > 0.4, function* () {
      g.flags.tvOn = true;
      g.applyFlags();
      g.hud.log('Media device: powered on');
      const t0 = g.time;
      yield () => Math.hypot(g.roomba.x - PLACES.tv[0], g.roomba.z - PLACES.tv[2]) < 1.7 || g.time - t0 > 14;
      g.flags.tvOn = false;
      g.applyFlags();
    }, true);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.5;
  },

  function* kitchen(first) {
    const g = this.game, story = this;
    this.setTask('Clean the Kitchen', 'room', 'kitchen', T.roomTarget);
    if (first) g.hud.notify(g.app, 'Living Room done! 🛋️ Next: the Kitchen.');
    this.once('n4klight', () => this.task.progress() > 0.25 && inRoom(g, 'kitchen'), function* () {
      g.lightsOn(g.world.roomIndex('kitchen'), 'story', 25);
      g.hud.log('Lights on: Kitchen (scheduled by: unknown user)');
    }, true);
    // The hall lights come on, switch by switch, from the laundry end. It is standing in the kitchen arch.
    const appear = function* () {
      g.flags.entity = true;
      for (let k = 0; k < 3; k++) { g.audio.lightSwitch(12.6 - k * 1.9, 1.3, 5.75); yield 0.75; }
      const [sx, sz] = FIRST_WALK[0];
      g.entity.placeStill(sx, sz, toward(sx, sz, g.roomba.x, g.roomba.z));
      g.entity.stare = true;
      g.lightsOn(g.world.roomIndex('hall'), 'story', 30);
      g.audio.hush(3);
      g.hud.log('MOTION DETECTED: KITCHEN');
      yield 3.2;
      g.entity.stare = false;
      g.entity.walkScript(FIRST_WALK, 0.85, () => g.entity.activate(), true);
      story.spawn(function* () {   // it opens the laundry door on its way in
        yield () => g.entity.x > 11.2 || g.entity.active;
        if (g.world.doors.laundry.state !== 'open') { g.setDoor('laundry', 'open', 2); g.audio.doorCreak(PLACES.laundryDoor[0], PLACES.laundryDoor[2], 1.6); }
      });
      yield () => g.entity.active;
      g.hud.notify(g.app, 'Motion detected at home 👀 Lights may switch on by themselves tonight. Under a bed or a table you\'re still out of sight 🌙');
    };
    if (!g.flags.entity) this.on(() => this.task.progress() > 0.55 && inRoom(g, 'kitchen') && !g.flags.entity, appear);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
    if (!g.flags.entity) this.spawn(appear);
    yield () => g.entity.active;
  },

  function* kid(first) {
    const g = this.game;
    this.setTask("Clean Theo's Room", 'room', 'kid', T.roomTarget);
    if (first) g.hud.notify(g.app, 'Theo\'s Room next 🧸 Someone tidied up... and then made a mess.');
    this.once('n4kidlight', () => this.task.progress() > 0.4 && inRoom(g, 'kid'), function* () {
      g.lightsOn(g.world.roomIndex('kid'), 'it', 30);
      yield 1;
      g.flags.musicBox = true;
      g.applyFlags();
      yield 9;
      g.flags.musicBox = false;
      g.applyFlags();
    }, true);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.2;
  },

  function* toys(first) {
    const g = this.game;
    this.setTask("Put Theo's toys away", 'collect', null, 1);
    if (first) g.hud.notify(g.app, 'Toys on the floor 🧸 Pick them up before the listing photos!');
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1.2;
  },

  function* hall(first) {
    const g = this.game;
    this.setTask('Clean the Hallway', 'room', 'hall', T.hallTarget);
    if (first) g.hud.notify(g.app, 'Almost there! The Hallway 🏡');
    g.mudOn = true;
    // A test shot for the listing: every light in the house at once.
    this.once('n4test', () => this.task.progress() > 0.35 && g.entity.active, function* () {
      g.hud.notify(g.app, 'Testing the lighting for the listing photos 📸');
      yield 1.5;
      const near = Object.keys(g.house.roomLights).map(Number).sort((a, b) => roomDist(g, a) - roomDist(g, b)).slice(0, 3);   // every light costs every pixel
      for (const ri of near) { g.lightsOn(ri, 'story', 12); yield 0.15; }
      g.incident('roomLit', 'Every light in the house switched on (listing test)');
    }, true);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    g.mudOn = false;
    yield 1;
  },

  function* home(first) {
    const g = this.game;
    this.setTask('Return to Home Base', 'dock', null, 1);
    g.say('Cleaning complete. Returning to Home Base.');
    g.hud.notify(g.app, 'All done! Head home and rest up 💤');
    g.entity.dockNext = true;
    yield () => g.roomba.docked;
    yield* ending4.call(this);
  },
];

// Home. Every light comes on for the listing photos, and in the flash it is bent right over you.
function* ending4() {
  const g = this.game;
  if (g.state !== 'playing') return;
  g.state = 'cutscene';
  this.setTask(null);
  g.entity.hide();
  g.audio.completeJingle();
  g.say('Cleaning complete.');
  yield 2.5;
  g.hud.notify(g.app, 'Listing photos in 3... 2... 1... 📸 Smile!');
  yield 2.2;
  g.roomba.light = false;
  for (const ri of Object.keys(g.house.roomLights)) g.lightOff(+ri, true);
  g.audio.hush(1.5);
  yield 1.6;
  const ex = DOCK.x + 0.8, ez = DOCK.z + 0.18;
  g.entity.placeStill(ex, ez, toward(ex, ez, DOCK.x, DOCK.z));
  g.entity.j.spine.rotation.x = 0.8;
  g.entity.j.head.rotation.set(0.95, 0, 0.3);
  g.entity.layoutNeck();
  g.roomba.pitch = 0.55;
  // the flash
  for (const ri of Object.keys(g.house.roomLights)) g.lightsOn(+ri, 'story', 99);
  g.audio.click(true);
  const u = g.post.uniforms.exposure, base = g.settings.brightness;
  u.value = base * (g.settings.flashing ? 5 : 2.2);
  for (let k = 0; k < 10; k++) { yield 0.05; u.value = base + (u.value - base) * 0.6; }
  u.value = base;
  g.hud.log('Photo saved: living_room_01.jpg');
  yield 2.6;
  g.post.uniforms.glitch.value = g.settings.flashing ? 1 : 0.4;
  g.audio.stinger();
  yield 0.6;
  g.showEnd();
}

// ---------- Night 5: it is the one scheduling the cleans ----------
// The messages come from "Home" now, and the dock is in its room. Its schedule, then three ways out.

const NIGHT5 = [
  function* laundry(first) {
    const g = this.game;
    this.setTask('Clean the Laundry 🙂', 'room', 'laundry', T.roomTarget);
    if (first) {
      yield 1.2;
      g.audio.startJingle();
      g.say('Starting cleaning cycle.');
      yield 1.8;
      g.hud.log('Home Base relocated: Laundry');
      yield 1.4;
      g.hud.log('Account settings changed by: [NO MATCH]');
      yield 1.6;
      g.hud.notify(g.app, 'Good morning 🙂 I made the schedule tonight. Start with my room.');
    }
    // halfway, it climbs out of the hatch beside you and goes to its bowl
    const appear = function* () {
      g.flags.entity = true;
      g.audio.thump(PLACES.hatch[0], 0.3, PLACES.hatch[2], 1);
      g.audio.scrape(PLACES.hatch[0], PLACES.hatch[2] + 0.3, 0.9);
      yield 1.8;
      g.entity.walkScript(FIRST_WALK, 0.7, null, true);
      yield () => g.entity.state === 'still';
      const e = g.entity, [ex, ez] = FIRST_WALK[FIRST_WALK.length - 1];
      e.placeStill(ex, ez, toward(ex, ez, PLACES.bowl[0], PLACES.bowl[2]));
      e.j.spine.rotation.x = 0.85; e.j.head.rotation.set(0.7, 0, 0.25);
      e.layoutNeck();
      for (let k = 0; k < 5; k++) { g.audio.crunchAt(PLACES.bowl[0], PLACES.bowl[2]); yield 1.1; }
      e.body.resetPose();
      e.activate(15);
      e.truce = 30;   // it means it: for half a minute it lets you work
      g.hud.notify(g.app, 'Don\'t mind me 🙂 Keep cleaning.');
    };
    if (!g.flags.entity) this.on(() => this.task.progress() > 0.45 && !g.flags.entity, appear);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
    if (!g.flags.entity) this.spawn(appear);
    yield () => g.entity.active;
  },

  function* food(first) {
    const g = this.game;
    if (!g.kibble.spillShown) g.kibble.showSpill();
    this.setTask('Bring my food 🙂', 'spill', null, 0.9);
    if (first) g.hud.notify(g.app, 'My food is all over the kitchen floor 🙂 Pick it up. All of it.');
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
  },

  function* master(first) {
    const g = this.game;
    this.setTask('Clean where they slept 🙂', 'room', 'master', T.roomTarget);
    if (first) g.hud.notify(g.app, 'Now where they slept 🙂');
    this.once('n5lamp', () => this.task.progress() > 0.4 && inRoom(g, 'master'), function* () {
      const lamp = g.house.lights.bedLamp, [lx, ly, lz] = PLACES.bedLamp;
      g.audio.lightSwitch(lx, ly, lz);
      lamp.visible = true; lamp.intensity = 6; g.house.bedLampShade.emissiveIntensity = 1.6;
      g.hud.log('Bedside lamp: on (scheduled)');
      yield 20;
      lamp.visible = false; lamp.intensity = 0; g.house.bedLampShade.emissiveIntensity = 0;
    }, true);
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
  },

  function* kid(first) {
    const g = this.game;
    this.setTask("Clean Theo's Room 🙂", 'room', 'kid', T.roomTarget);
    if (first) g.hud.notify(g.app, 'Theo\'s room 🙂 He\'ll be back on Saturday. A new Theo.');
    yield () => this.task.progress() >= this.task.target;
    this.complete();
    yield 1;
  },

  // Three ways it ends: dock in its room (stay), out through the dog door (leave), or hold the laundry door shut
  // while it eats in there (lock it in).
  function* choice(first) {
    const g = this.game;
    this.setTask('Finish the cycle', 'choice', null, 1);
    if (first) {
      g.hud.notify(g.app, 'All done 🙂 Come home. Home is the Laundry now.');
      yield 2.4;
    }
    if (g.world.blocks.dogflap) {   // the plywood comes off the dog door
      g.world.setBlock('dogflap', null);
      g.house.dogFlapBoard.visible = false;
      g.audio.doorSlam(PLACES.dogFlap[0], PLACES.dogFlap[2], 0.35, false);
      g.hud.log('Pet door: open (Living Room)');
      yield 2;
    }
    g.hud.hint('Three ways this ends. <b>Stay</b>: dock at Home Base, in the Laundry. <b>Leave</b>: out through the dog door in the Living Room. <b>Lock it in</b>: when it shuts itself in the Laundry to eat, hold the door shut from the hall.', 15);
    let next = g.time + 15, armed = !g.roomba.docked, hold = 0;
    for (;;) {
      if (g.state !== 'playing') return;
      if (g.time > next && g.entity.active) { g.entity.hungry = true; next = g.time + 50; }
      if (!g.roomba.docked) armed = true;
      if (armed && g.roomba.docked) { yield* endingStay.call(this); return; }
      if (g.roomba.z < -0.12) { yield* endingLeave.call(this); return; }
      const d = PLACES.laundryDoor, r = g.roomba;
      const holding = g.entity.state === 'lair' && g.world.doors.laundry.state !== 'open'
        && Math.abs(r.x - d[0]) < 0.45 && r.z > 5.0 && r.z < 5.55 && Math.abs(r.v) < 0.2;
      if (holding && hold === 0) g.hud.log('Holding the Laundry door...');
      hold = holding ? hold + 0.1 : 0;
      if (hold >= 2.5) { yield* endingLock.call(this); return; }
      yield 0.1;
    }
  },
];

function endCutscene(story) {
  const g = story.game;
  g.state = 'cutscene';
  story.setTask(null);
}

// Stay: you dock in its room. It comes and settles beside you, a hand on you.
function* endingStay() {
  const g = this.game;
  endCutscene(this);
  g.entity.hide();
  g.say('Charging.');
  yield 2;
  g.hud.notify(g.app, 'Welcome home 🙂');
  yield 2.6;
  g.roomba.light = false;
  for (let k = 0; k < 4; k++) { g.audio.footstep(12.62, 4.6 - k * 0.5, 0.6); yield 0.75; }
  const ex = 12.75, ez = 2.25;
  g.entity.placeStill(ex, ez, toward(ex, ez, g.roomba.x, g.roomba.z));
  g.entity.body.reachPose(1, new THREE.Vector3(g.roomba.x - 0.12, 0.05, g.roomba.z), g.time);
  g.audio.huff(ex, 0.6, ez, 0.7);
  yield 1.2;
  g.roomba.scan(true, 10);
  yield 3.6;
  g.hud.notify(g.app, 'Next clean: 03:00 AM. Every night 🙂');
  yield 2.6;
  g.hud.log('Listing status: SOLD. New owners move in Saturday');
  yield 2.6;
  g.ending = 'stay';
  g.showEnd();
}

// Leave: out into the garden. The house behind you, and in the living-room window, bent under the curtain rail,
// it watches you go.
function* endingLeave() {
  const g = this.game;
  endCutscene(this);
  g.entity.hide();
  g.hud.log('Signal weak...');
  const r = g.roomba;
  for (let k = 0; k < 30; k++) { r.z -= 0.025; r.updateRig(0.05, g.time); yield 0.05; }
  g.lightsOn(g.world.roomIndex('living'), 'story', 99);
  g.entity.placeStill(1.3, 0.5, Math.PI);   // facing out of the window
  g.entity.j.spine.rotation.x = 0.4;
  g.entity.j.head.rotation.set(0.25, 0, 0.35);
  g.entity.layoutNeck();
  g.hud.show(false);
  g.beginCinematic(new THREE.Vector3(3.2, 0.3, -2.7), new THREE.Vector3(1.4, 1.45, 0.0), 5);
  yield 5.5;
  g.audio.hush(2);
  yield 2.6;
  g.ending = 'leave';
  g.showEnd();
}

// Lock it in: the smart lock takes over from the robot's bumper. It hits the door, then it eats.
function* endingLock() {
  const g = this.game;
  endCutscene(this);
  g.entity.hide();
  g.audio.click(true);
  g.hud.log('Smart Lock: Laundry engaged 🔒 (by RV-7)');
  yield 1.2;
  const [dx, , dz] = PLACES.laundryDoor;
  for (let k = 0; k < 3; k++) {
    g.audio.doorSlam(dx, dz, 1);
    g.roomba.shake = 0.9;
    g.fx.sift(dx, 2.08, dz + 0.1, 20, 0.4);
    yield 1 + k * 0.4;
  }
  yield 1.4;
  g.audio.knock(dx, dz, 3, 420, 0.35);
  yield 3.2;
  for (let k = 0; k < 4; k++) { g.audio.crunchAt(PLACES.bowl[0], PLACES.bowl[2], 0.8); yield 1.1; }
  g.hud.notify('BrightHome', 'Schedule updated ✨ Laundry removed from cleaning. 03:00 AM: dispense food 🐶');
  yield 3.4;
  g.ending = 'lock';
  g.showEnd();
}

// For ?debug: what finishing each step of a night looks like (keys 1-7 jump there).
export const SKIPS = {
  3: [
    (g) => { g.place(DOCK.x, DOCK.z, (DOCK.yaw * 180) / Math.PI); },
    (g) => { g.debugClean('master'); g.flags.entity = true; g.unplug('fridge'); g.unplug('laundry'); g.entity.x = 9.0; g.entity.z = 5.8; g.entity.activate(5); },
    (g) => g.debugClean('bath'),
    (g) => g.items.list.forEach((it) => { if (it.def.task) { it.taken = true; it.obj.visible = false; } }),
    (g) => g.debugClean('kitchen'),
  ],
  4: [
    (g) => g.debugClean('living'),
    (g) => { g.debugClean('kitchen'); g.flags.entity = true; g.setDoor('laundry', 'open', 5); g.entity.x = 12.62; g.entity.z = 5.6; g.entity.activate(5); },
    (g) => g.debugClean('kid'),
    (g) => g.items.list.forEach((it) => { if (it.def.task) { it.taken = true; it.obj.visible = false; } }),
    (g) => g.debugClean('hall', 0.75),
  ],
  5: [
    (g) => { g.debugClean('laundry'); g.flags.entity = true; g.entity.x = 12.6; g.entity.z = 4.2; g.entity.activate(5); },
    (g) => { g.kibble.showSpill(); g.kibble.list.forEach((p) => { if (p.group === 'spill') p.taken = true; }); },
    (g) => g.debugClean('master'),
    (g) => g.debugClean('kid'),
  ],
};

const NIGHT_STEPS = { 1: NIGHT1, 2: NIGHT2, 3: NIGHT3, 4: NIGHT4, 5: NIGHT5 };

export class Story {
  constructor(game) {
    this.game = game;
    this.steps = NIGHT_STEPS[NIGHT];
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
    this.cos.push({ it: this.steps[step].call(this, first), wait: 0, cond: null, main: true });
  }

  spawn(gen) { this.cos.push({ it: gen.call(this), wait: 0, cond: null }); }
  on(cond, gen) { this.triggers.push({ cond, gen }); }

  // A scene that plays once per night. A reboot to a checkpoint from before it undoes what it changed and plays it
  // again, unless it is `keep`: a scene that changes nothing a reboot restores (a sound, a log line, a light on a
  // timer, the app taking over) is marked played in the checkpoint too, so it can't replay the moment you reboot.
  once(id, cond, gen, keep = false) {
    const g = this.game, self = this;
    this.on(() => !g.flags.seen[id] && cond(), function* () {
      g.flags.seen[id] = true;
      if (keep && g.cp) g.cp.flags.seen[id] = true;
      yield* gen.call(self);
    });
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
        : kind === 'collect' ? () => g.items.taskProgress
        : kind === 'choice' ? () => 0
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
    if (main && main.done && this.step < this.steps.length - 1 && this.game.state === 'playing') this.start(this.step + 1, true);
  }

  get stepCount() { return this.steps.length; }
}
