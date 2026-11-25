// The thing that lives in the laundry: a tall, thin, pale figure.
// It walks the halls, listens for the vacuum, notices the headlamp, and cannot get its body under furniture.
// It can get an arm under, though, if you make noise right next to it.

import * as THREE from 'three';
import { ROOMS } from './level.js';
import { T } from './tune.js';
import { LongMan } from './longman.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rand = (a, b) => a + Math.random() * (b - a);
const wrapAngle = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

const NOISE_LABEL = { suction: 'Suction', bump: 'Collision', drive: 'Motor', scan: 'LIDAR ping', voice: 'Voice prompt', crunch: 'Crunching', dock: 'Docking chime' };

export class Entity {
  constructor(game) {
    this.game = game;
    this.build();
    this.reset();
  }

  build() {
    this.body = new LongMan();
    this.root = this.body.root;
    this.j = this.body.j;
    this.root.visible = false;
    this.game.scene.add(this.root);
    this.tag = { label: 'person', box: new THREE.Box3(), conf: 0.3, entity: true };
    this.duck = 0;
    this._hand = new THREE.Vector3();
  }

  reset() {
    this.x = 12.62; this.z = 4.0; this.yaw = 0;
    this.state = 'dormant';
    this.path = null; this.speed = 0; this.phase = 0; this.lastPlant = 0;
    this.suspicion = 0; this.litTime = 0; this.lostTimer = 0; this.repath = 0; this.wait = 0;
    this.grace = 0; this.calm = 0; this.lastSeen = null; this.target = null; this.lookYaw = 0;
    this.poseTimer = 0; this.twitch = 0; this.twitchRoll = 0; this.sinceNear = 0;
    this.posed = false; this.canSee = false; this.dist = undefined; this.stuck = 0; this.searchFrom = null;
    this.noticed = false; this.noticeAge = 0; this.snapT = 0; this.freeze = 0; this.lookTarget = null; this.stare = false;
    this.menace = 0; this.linger = 0; this.feinted = false; this.checking = null; this.coverUse = {};
    this.hallCross = 0; this.lastCross = -100; this.crossing = false; this.pathStartX = 0;
    this.reachT = 0; this.reachAim = null; this.atEnd = false; this.lairT = 0; this.retreating = false;
    this.root.visible = false;
    this.scareT = -1;
    this.duck = 0;
    this.body.resetPose();   // undo the scare: head back on its neck, face shut
  }

  get active() { return !['dormant', 'script', 'scare', 'still', 'lair'].includes(this.state); }

  // ---------- control from the story ----------

  walkScript(points, speed, onDone) {
    this.state = 'script';
    this.root.visible = true;
    this.x = points[0][0]; this.z = points[0][1];
    this.path = points.slice(1).map((p) => [...p]);
    this.yaw = Math.atan2(this.path[0][0] - this.x, this.path[0][1] - this.z);
    this.posed = false; this.canSee = false; this.stare = false;
    this.scriptSpeed = speed;
    this.onScriptDone = onDone;
  }

  activate(grace = T.entGrace) {
    this.state = 'patrol';
    this.root.visible = true;
    this.grace = grace;
    this.path = null;
    this.wait = 1;
    this.posed = false; this.canSee = false; this.stare = false;
  }

  // Stand in a neutral pose and hold it; the story may then bend it by hand.
  placeStill(x, z, yaw) {
    this.state = 'still';
    this.root.visible = true;
    this.x = x; this.z = z; this.yaw = yaw; this.speed = 0;
    this.path = null;
    this.canSee = false; this.lookYaw = 0; this.twitchRoll = 0; this.stare = false;
    this.posed = false;
    this.phase = 0; this.poseTimer = 0;
    this.animate(0);
    this.posed = true;
  }

  hide() { this.state = 'dormant'; this.root.visible = false; }

  // ---------- senses ----------

  hear(x, z, radius, kind) {
    const g = this.game;
    if (this.state === 'lair') { g.lairHeard?.(x, z, radius, kind); return; }
    if (!this.active || this.state === 'chase' || this.state === 'reach') return;
    let d = Math.hypot(x - this.x, z - this.z);
    if (!g.world.los(this.x, this.z, x, z)) d *= T.occlusion;
    const r = radius * (this.grace > 0 || this.calm > 0 ? 0.5 : 1) * g.diff().hearing;
    if (d > r) return;
    // Noise from under cover right next to it: it gets down and reaches underneath.
    const rb = g.roomba;
    if (rb.cover && Math.hypot(rb.x - x, rb.z - z) < 0.4 && Math.hypot(x - this.x, z - this.z) < T.entReachHear && this.state !== 'patrol') {
      g.incident('reach', `${NOISE_LABEL[kind] || 'Noise'} under cover, ${Math.hypot(x - this.x, z - this.z).toFixed(1)} m from it`);
      this.startReach();
      return;
    }
    if (this.state !== 'investigate' || kind === 'bump' || Math.random() < 0.3) {
      g.incident('noise:' + kind, `${NOISE_LABEL[kind] || 'Noise'} logged (${g.roomName(x, z)})`);
      this.investigate(x, z);
    }
  }

  investigate(x, z) {
    const was = this.state;
    this.state = 'investigate';
    this.target = [x, z];
    this.path = this.game.world.findPath(this.x, this.z, x, z);
    this.wait = 3 + Math.random() * 1.5;
    this.arrived = false;
    this.checking = null;
    // It stops, turns its head toward the sound, then goes, faster than it walks.
    if (was === 'patrol' || was === 'check') { this.freeze = 0.6; this.lookTarget = [x, z]; this.poseTimer = 0; }
  }

  // LIDAR rays touched it: its head snaps round to where they came from.
  pinged(x, z) {
    if (!this.active || this.state === 'chase' || this.state === 'reach') return;
    this.snapT = 0.8; this.poseTimer = 0;
    if (this.game.world.los(this.x, this.z, x, z)) this.suspicion = Math.max(this.suspicion, 0.35);
    if (this.state === 'patrol') this.investigate(x, z);
  }

  sightLine(rx, rz, dist) {
    const w = this.game.world;
    return w.los(this.x, this.z, rx, rz) && (dist < 1.0 || w.losLow(this.x, this.z, rx, rz, 2.35 - this.duck * 0.3, 0.06));
  }

  perceive(dt) {
    const g = this.game, r = g.roomba;
    const dx = r.x - this.x, dz = r.z - this.z, dist = Math.hypot(dx, dz) || 0.001;
    this.dist = dist;
    let see = false;
    if (!r.hidden && !g.debug.ghost && !r.dead) {
      const range = (r.light ? T.entSeeLit : T.entSeeDark) * g.diff().sight;
      if (dist < range) {
        const c = (dx * Math.sin(this.yaw) + dz * Math.cos(this.yaw)) / dist;
        if ((c > Math.cos(T.entFov) || dist < 1.3) && this.sightLine(r.x, r.z, dist)) see = true;
      }
    }
    // A headlamp in its face gets its attention even from behind its sight cone.
    const lit = r.light && !r.dead && dist < 7 && (-dx * r.fx - dz * r.fz) / dist > Math.cos(0.5) && this.sightLine(r.x, r.z, dist);
    this.litTime = lit ? this.litTime + dt : Math.max(0, this.litTime - dt);
    const byLamp = this.litTime > T.entLitNotice && !r.hidden;
    if (byLamp) see = true;

    if (see) {
      if (!this.noticed) {
        this.noticed = true; this.noticeAge = 0;
        this.snapT = 0.5; this.poseTimer = 0;   // the head snaps round, with a crack
        const hp = this.j.head.getWorldPosition(new THREE.Vector3());
        g.audio.crack(hp.x, hp.y, hp.z);
        g.incident(byLamp ? 'lampFace' : r.light ? 'lampSeen' : 'dark',
          byLamp ? `Headlamp aimed at [NO MATCH] ${this.litTime.toFixed(1)} s` : r.light ? `Headlamp visible at ${dist.toFixed(1)} m` : `Unit visible at ${dist.toFixed(1)} m (lamp off)`);
        g.onEntityNotice?.();
      }
      this.suspicion = Math.min(1.5, this.suspicion + dt / (T.entNotice * clamp(dist / 4, 0.3, 1.5)));
      this.lastSeen = [r.x, r.z];
    } else {
      this.suspicion = Math.max(0, this.suspicion - dt * 0.35);
      if (this.suspicion <= 0) this.noticed = false;
    }
    this.noticeAge += dt;
    this.canSee = see;
    if (dist < 6) this.sinceNear = 0; else this.sinceNear += dt;
    return see;
  }

  // ---------- update ----------

  update(dt) {
    const g = this.game;
    if (this.state === 'dormant') return;
    if (this.state === 'scare') { this.updateScare(dt); this.updateEyes(); return; }
    this.dist = Math.hypot(g.roomba.x - this.x, g.roomba.z - this.z);
    if (!this.active) this.canSee = false;
    this.grace = Math.max(0, this.grace - dt);
    this.calm = Math.max(0, this.calm - dt);
    this.linger = Math.max(0, this.linger - dt);
    this.snapT = Math.max(0, this.snapT - dt);
    let speed = 0;

    if (this.state === 'lair') {
      this.lairT -= dt;
      if (this.lairT <= 0) { this.state = 'patrol'; this.root.visible = true; this.wait = 0.5; this.path = null; g.onLeaveLair?.(); }
      else { this.root.visible = false; return; }
    }

    if (this.state === 'script') {
      speed = this.scriptSpeed;
      if (this.follow(dt, speed)) {
        const cb = this.onScriptDone;
        this.onScriptDone = null;
        this.state = 'still';
        cb?.();
      }
    } else if (this.state === 'still') {
      speed = 0;
    } else {
      const see = this.perceive(dt);
      const r = g.roomba;
      // the director: how much it has been on you lately
      this.menace = clamp(this.menace + dt * (this.dist < 5 ? 0.045 : -0.012), 0, 1);
      if (see && this.state !== 'chase' && this.state !== 'reach' && this.suspicion >= 1 && (this.noticeAge > 0.45 || this.dist < 1.0)) this.startChase();
      if (see && this.state !== 'chase' && this.state !== 'reach') this.lookAt(r.x, r.z, dt * 2);   // stops and stares while deciding

      if (this.freeze > 0 && this.state === 'investigate') {
        this.freeze -= dt;
        if (this.lookTarget) this.lookAt(this.lookTarget[0], this.lookTarget[1], dt * 4);
        speed = 0;
        if (this.freeze <= 0) this.lookTarget = null;
      } else if (this.state === 'patrol') {
        speed = see ? 0 : T.entPatrolSpeed;
        if (!see) {
          if (!this.path || !this.path.length) {
            this.wait -= dt;
            this.lookAround(dt);
            speed = 0;
            if (this.wait <= 0) this.pickPatrol();
          } else if (this.follow(dt, speed)) this.arrive();
        }
      } else if (this.state === 'investigate') {
        speed = see ? 0 : T.entInvestigateSpeed;
        if (!see) {
          if (this.path && this.path.length) { if (this.follow(dt, speed)) this.arrived = true; }
          else {
            speed = 0;
            this.wait -= dt;
            this.lookAround(dt);
            if (this.wait <= 0) { this.state = 'patrol'; this.wait = 0.5; if (Math.random() < 0.5) this.loseInterest(0.6); }
          }
        }
      } else if (this.state === 'check') {   // stands by a hiding place it has learned about, listening
        speed = 0;
        this.wait -= dt;
        if (this.checking) this.lookAt((this.checking.x0 + this.checking.x1) / 2, (this.checking.z0 + this.checking.z1) / 2, dt * 2);
        const c = this.checking, rc = r.cover;
        if (c && rc && rc.i === c.i && (this.coverUse[c.i] || 0) >= 3) { g.incident('overuse', `Hid under the ${c.type} too often: it checked`); this.startReach(); }
        else if (this.wait <= 0) { this.state = 'patrol'; this.checking = null; this.wait = 0.5; }
      } else if (this.state === 'chase') {
        speed = T.entChaseSpeed * g.diff().chase;
        if (see) this.lostTimer = 0; else this.lostTimer += dt;
        this.repath -= dt;
        if (r.hidden) {
          this.beginSearch(true);
          this.path = g.world.findPath(this.x, this.z, r.x, r.z);
        } else if (this.lostTimer > T.entLoseTime) {
          this.lostYou();
          this.investigate(this.lastSeen[0], this.lastSeen[1]);
        } else {
          if (this.repath <= 0) {
            this.repath = 0.3;
            const [tx, tz] = see ? [r.x, r.z] : this.lastSeen;
            this.path = g.world.findPath(this.x, this.z, tx, tz) || this.path;
          }
          // Out of path but not close enough to grab: it can't get there. Give it a moment, then search.
          this.atEnd = this.follow(dt, speed, 1.8);
          if (this.atEnd && this.dist > T.entCatch + 0.2) this.stuck += dt; else this.stuck = 0;
          if (this.stuck > 1.5) { this.stuck = 0; this.beginSearch(false); this.path = null; }
        }
      } else if (this.state === 'search' || this.state === 'feint') {
        this.updateSearch(dt, see);
        speed = this.searchSpeed;
      } else if (this.state === 'reach') {
        this.updateReach(dt);
      }

      // Caught? (At the end of its path, its arms reach a little further than its body.)
      if (this.state !== 'reach' && !r.hidden && !r.dead && !g.debug.ghost &&
          (this.dist < T.entCatch || (this.state === 'chase' && this.atEnd && this.dist < T.entCatch + 0.2))) g.caught();
    }

    this.speed += (speed - this.speed) * Math.min(1, dt * 4);
    if (this.state !== 'reach') this.animate(dt);
    this.updateEyes();
  }

  startChase() {
    this.state = 'chase';
    this.lostTimer = 0;
    this.repath = 0;
    this.suspicion = 1;
    this.checking = null;
    this.menace = Math.min(1, this.menace + 0.3);
    this.game.incident('chase', `Pursuit started (${this.game.roomName(this.x, this.z)})`);
    this.game.onEntityChase?.();
  }

  lostYou() {
    const hp = this.j.head.getWorldPosition(new THREE.Vector3());
    this.game.audio.huff(hp.x, hp.y, hp.z, 1);   // a long breath out: it has lost you
    this.game.onEntityLost?.();
  }

  beginSearch(fromChase) {
    const g = this.game, r = g.roomba;
    this.state = 'search';
    this.searchFrom = [r.x, r.z];
    this.wait = rand(T.entSearchMin, T.entSearchMax);
    this.feinted = false;
    this.searchCover = r.cover || null;
    this.searchSpeed = T.entInvestigateSpeed;
    g.onEntitySearch?.();
  }

  // Search: walk to where you went, stand over it, wait. Sometimes it pretends to leave.
  updateSearch(dt, see) {
    const g = this.game, r = g.roomba;
    if (this.state === 'feint') {
      this.searchSpeed = this.feintBack ? T.entInvestigateSpeed * 1.2 : T.entPatrolSpeed;
      if (this.path && this.path.length) { if (this.follow(dt, this.searchSpeed)) this.feintWait = this.feintBack ? 0 : rand(2.5, 4.5); return; }
      this.searchSpeed = 0;
      if (see && !r.hidden) { this.startChase(); return; }
      this.feintWait -= dt;
      if (this.feintWait > 0) return;
      if (!this.feintBack) {   // ...and comes straight back
        this.feintBack = true;
        this.path = g.world.findPath(this.x, this.z, this.searchFrom[0], this.searchFrom[1]);
      } else { this.state = 'search'; this.wait = rand(3, 4.5); this.feinted = true; }
      return;
    }
    this.searchSpeed = T.entInvestigateSpeed;
    if (this.path && this.path.length) { this.follow(dt, this.searchSpeed); return; }
    this.searchSpeed = 0;
    this.wait -= dt;
    this.lookAt(r.x, r.z, dt * 1.5);
    const moved = !this.searchFrom || Math.hypot(r.x - this.searchFrom[0], r.z - this.searchFrom[1]) > 0.4;
    if (!r.hidden && see && moved) { this.startChase(); return; }
    if (this.wait > 0) return;
    if (!this.feinted && Math.random() < T.entFeintChance) {
      const away = g.world.randomFreeNear(this.x, this.z, 3, 5, [r.x, r.z], 2.5);
      if (away) {
        this.state = 'feint'; this.feintBack = false; this.feintWait = 0;
        this.path = g.world.findPath(this.x, this.z, away[0], away[1]);
        return;
      }
    }
    this.giveUp();
  }

  giveUp() {
    const g = this.game;
    if (this.searchCover) this.coverUse[this.searchCover.i] = (this.coverUse[this.searchCover.i] || 0) + 1;
    this.state = 'patrol'; this.suspicion = 0; this.noticed = false; this.wait = 1; this.path = null;
    this.loseInterest();
    const hp = this.j.head.getWorldPosition(new THREE.Vector3());
    g.audio.huff(hp.x, hp.y, hp.z, 0.6);
    g.onEntityGiveUp?.();
  }

  // After it loses you it stays close for a little while, then moves on. It never really calms down.
  loseInterest(scale = 1) {
    this.calm = rand(3, 6) * scale;
    this.linger = rand(8, 14) * scale;
  }

  // ---------- reaching under furniture ----------

  startReach() {
    const g = this.game, r = g.roomba;
    this.state = 'reach';
    this.reachT = 0;
    this.path = null;
    this.speed = 0;
    this.yaw = Math.atan2(r.x - this.x, r.z - this.z);
    this.reachAim = [r.x, r.z];
    this.reachHit = false;
    this.menace = Math.min(1, this.menace + 0.2);
    const hp = this.j.head.getWorldPosition(new THREE.Vector3());
    g.audio.crack(hp.x, hp.y, hp.z);
    g.onEntityReach?.();
  }

  // Two slow sweeps along the floor toward where it heard you. Back away to the far edge and it comes up short.
  updateReach(dt) {
    const g = this.game, r = g.roomba;
    const t = (this.reachT += dt);
    const S1 = [0.7, 1.7, 2.1], S2 = [2.6, 3.4, 3.8], END = 4.6;
    let k = clamp(t / 0.7, 0, 1), ext = 0.25;
    if (t < S1[1]) ext = 0.25 + 0.75 * clamp((t - S1[0]) / (S1[1] - S1[0]), 0, 1);
    else if (t < S1[2]) ext = 1;
    else if (t < S2[0]) { ext = 1 - 0.55 * clamp((t - S1[2]) / (S2[0] - S1[2]), 0, 1); this.reachAim = [r.x, r.z]; }
    else if (t < S2[1]) ext = 0.45 + 0.55 * clamp((t - S2[0]) / (S2[1] - S2[0]), 0, 1);
    else if (t < S2[2]) ext = 1;
    else { ext = 1 - clamp((t - S2[2]) / 0.6, 0, 1); k = 1 - clamp((t - S2[2] - 0.3) / 0.5, 0, 1); }
    // aim: toward the noise, no further than its arm
    const ax = this.reachAim[0] - this.x, az = this.reachAim[1] - this.z, ad = Math.hypot(ax, az) || 1;
    const reach = Math.min(ad, T.entReach) * ext;
    const target = new THREE.Vector3(this.x + (ax / ad) * reach, 0.03, this.z + (az / ad) * reach);
    // its body stays back from the furniture edge; only the arm goes under
    this.root.position.set(this.x - (ax / ad) * 0.18 * k, 0, this.z - (az / ad) * 0.18 * k);
    this.root.rotation.y = this.yaw;
    this.poseTimer -= dt;
    if (this.poseTimer <= 0) {   // stop-motion, like everything it does
      this.poseTimer = 1 / 12;
      this.body.reachPose(k, target, g.time);
      if (ext > 0.3 && Math.random() < 0.5) g.audio.scrape(target.x, target.z, ext);
    }
    // the fingertips: did they find you?
    if ((t > S1[1] - 0.15 && t < S1[2]) || (t > S2[1] - 0.15 && t < S2[2])) {
      const hand = this.body.fingertip(this._hand);
      if (!g.debug.ghost && !r.dead && Math.hypot(hand.x - r.x, hand.z - r.z) < T.radius + 0.1) {
        const out = [this.x + (ax / ad) * 0.75, this.z + (az / ad) * 0.75];
        g.caught({ drag: out });
        return;
      }
    }
    if (t > END) {
      this.body.resetPose();
      this.poseTimer = 0;
      this.state = 'search';
      this.wait = rand(2, 3.5);
      this.feinted = true;
      this.searchFrom = [r.x, r.z];
    }
  }

  // ---------- where to walk next ----------

  arrive() {
    const g = this.game, w = g.world;
    this.wait = 1.5 + Math.random() * 2.5;
    if (this.retreating) {   // back in the laundry: it shuts itself in for a while
      this.retreating = false;
      this.state = 'lair';
      this.lairT = rand(20, 30);
      this.menace = 0.25;
      g.onEnterLair?.();
      return;
    }
    if (this.crossing) {
      this.crossing = false;
      if (Math.abs(this.x - this.pathStartX) > 4 && w.roomAt(this.x, this.z) === w.roomIndex('hall')) { this.hallCross++; this.lastCross = g.time; }
    }
    if (this.checking) { this.state = 'check'; this.wait = rand(3, 4.5); }
  }

  pickPatrol() {
    const g = this.game, w = g.world, r = g.roomba;
    const pr = w.roomAt(r.x, r.z), mine = w.roomAt(this.x, this.z);
    const hall = w.roomIndex('hall'), laundry = w.roomIndex('laundry');
    const quiet = this.grace > 0 || this.calm > 0;
    const doorOpen = (id) => !id || w.doors[id].state === 'open';
    let p = null;
    this.checking = null;
    this.pathStartX = this.x;
    const lairDoor = w.doors.laundry;
    const nearLair = Math.hypot(r.x - 12.62, r.z - 5) < 3.2 || pr === laundry;
    if (this.menace > 0.8 && lairDoor.state === 'open' && !nearLair) {
      // It has been on you a lot: it goes back to the laundry, loudly, and shuts the door.
      p = [12.6, 2.6];
      this.retreating = true;
    } else if (g.story.task?.room === 'hall' && this.hallCross < 3 && g.time - this.lastCross > 30 && !quiet) {
      // During the hallway task it walks the length of the hall a few times, whatever else happens.
      const far = this.x > 7 ? [1.3, 5.75] : [12.3, 5.75];
      p = w.navFree(far[0], far[1]) ? far : null;
      this.crossing = true;
    } else if (this.linger > 0) {
      p = w.randomFreeNear(this.x, this.z, 1.5, 4, [r.x, r.z], 2);
    } else if (!quiet && this.sinceNear > 40 && pr >= 0) {
      p = w.randomFreeIn(pr);   // it comes looking
      if (p) g.incident('idle', `Unit stayed in ${ROOMS[pr].name}: it came looking`);
    } else {
      // It checks hiding places you keep using.
      const used = Object.entries(this.coverUse).filter(([, n]) => n >= 2).map(([i]) => w.covers[+i]);
      if (used.length && Math.random() < 0.35) {
        const c = used[(Math.random() * used.length) | 0];
        const path = w.findPath(this.x, this.z, (c.x0 + c.x1) / 2, (c.z0 + c.z1) / 2);
        if (path && path.length) { this.path = path; this.checking = c; this.wait = 1; return; }
      }
      const open = (ri) => {
        const room = ROOMS[ri];
        if (room.id === 'laundry') return false;
        if (room.id === 'kid' && !doorOpen('kid')) return false;
        if (room.id === 'master' && !doorOpen('master')) return false;
        return true;
      };
      const next = new Set();
      for (const l of w.links) if (doorOpen(l.door)) { if (l.a === pr) next.add(l.b); if (l.b === pr) next.add(l.a); }
      const low = this.menace < 0.35 && !quiet;
      const weights = ROOMS.map((room, i) => {
        if (!open(i)) return 0;
        let wgt = 1;
        if (i === mine) wgt *= 0.3;
        if (i === pr) wgt *= quiet ? 0 : 1.2;
        if (low && next.has(i)) wgt *= 4;   // a quiet spell: it patrols the rooms next to yours
        if (low && i === hall) wgt *= 1.5;
        return wgt;
      });
      const sum = weights.reduce((a, b) => a + b, 0);
      let pick = Math.random() * sum, target = -1;
      for (let i = 0; i < weights.length; i++) { pick -= weights[i]; if (pick <= 0) { target = i; break; } }
      p = target >= 0 ? w.randomFreeIn(target) : null;
    }
    this.path = p ? w.findPath(this.x, this.z, p[0], p[1]) : null;
    if (!this.path) { this.retreating = false; this.crossing = false; }
    if (this.retreating) g.onRetreat?.();
    this.wait = 1;
  }

  follow(dt, speed, turnMul = 1) {
    if (!this.path || !this.path.length) return true;
    const [tx, tz] = this.path[0];
    const dx = tx - this.x, dz = tz - this.z, d = Math.hypot(dx, dz);
    if (d < 0.12) { this.path.shift(); return !this.path.length; }
    const want = Math.atan2(dx, dz);
    const diff = wrapAngle(want - this.yaw);
    this.yaw += clamp(diff, -T.entTurn * turnMul * dt, T.entTurn * turnMul * dt);
    const step = Math.min(d, this.speed * dt * (Math.abs(diff) > 1.2 ? 0.4 : 1));
    this.x += (dx / d) * step; this.z += (dz / d) * step;
    return false;
  }

  lookAt(x, z, rate) {
    const want = Math.atan2(x - this.x, z - this.z);
    this.yaw += clamp(wrapAngle(want - this.yaw), -rate, rate);
  }

  lookAround(dt) {
    this.lookYaw = Math.sin(this.game.time * 0.9 + this.x) * 0.9;
  }

  // ---------- body ----------

  animate(dt) {
    const g = this.game;
    this.root.position.set(this.x, 0, this.z);
    this.root.rotation.y = this.yaw;
    const stride = 1.15;
    this.phase += (this.speed * dt / stride) * Math.PI;
    // footsteps on each plant
    const plant = Math.floor(this.phase / Math.PI);
    if (plant !== this.lastPlant) {
      this.lastPlant = plant;
      if (this.speed > 0.2) {
        const side = plant % 2 ? 1 : -1;
        const fx = this.x + Math.cos(this.yaw) * side * 0.1, fz = this.z - Math.sin(this.yaw) * side * 0.1;
        g.audio.footstep(fx, fz, clamp(this.speed / T.entChaseSpeed, 0.35, 1));
        g.onEntityStep?.(fx, fz, Math.sin(this.yaw), Math.cos(this.yaw), side < 0);
      }
    }
    if (this.posed) return;   // the story is holding a pose
    // Stop-motion: the pose only updates a dozen times a second.
    this.poseTimer -= dt;
    if (this.poseTimer > 0) return;
    this.poseTimer = 1 / 12;
    const walk = clamp(this.speed / 0.8, 0, 1);
    // It folds itself under door frames.
    this.duck += ((g.world.underLintel(this.x, this.z) ? 1 : 0) - this.duck) * 0.45;
    // Head: cocked to one side, snapping to a new angle now and then, turning toward what it hears or sees.
    this.twitch -= 1 / 12;
    if (this.twitch <= 0) { this.twitch = 0.6 + Math.random() * 2.5; this.twitchRoll = 0.35 + (Math.random() - 0.3) * 0.9; }
    let yaw = this.lookYaw * (this.speed < 0.1 ? 1 : 0.2), pitch = 0;
    const r = g.roomba;
    const onYou = this.canSee || this.snapT > 0 || this.stare || this.state === 'search' || this.state === 'check';
    if (onYou) {
      yaw = clamp(wrapAngle(Math.atan2(r.x - this.x, r.z - this.z) - this.yaw), -1.5, 1.5);
      pitch = clamp(Math.atan2(2.2, this.dist || 2) * 0.8, 0.2, 1.1);   // looks down at you
    } else if (this.lookTarget) {
      yaw = clamp(wrapAngle(Math.atan2(this.lookTarget[0] - this.x, this.lookTarget[1] - this.z) - this.yaw), -1.5, 1.5);
    }
    this.body.pose({
      phase: this.phase, walk, chase: this.state === 'chase', duck: this.duck, time: g.time,
      look: { yaw, pitch, roll: onYou ? this.twitchRoll * 0.4 : this.twitchRoll },
    });
  }

  layoutNeck() { this.body.layoutNeck(); }

  // ---------- the scare ----------

  scare() {
    const g = this.game, r = g.roomba;
    this.state = 'scare';
    this.scareT = 0;
    this.root.visible = true;
    // stand right in front of the robot, facing it
    this.x = r.x + r.fx * 0.75; this.z = r.z + r.fz * 0.75;
    this.yaw = Math.atan2(r.x - this.x, r.z - this.z);
    this.speed = 0;
    this.body.resetPose();
    this.animate(0.016);
    this.poseTimer = 0;
  }

  updateScare(dt) {
    this.scareT += dt;
    this.root.position.set(this.x, 0, this.z);
    this.root.rotation.y = this.yaw;
    const cam = new THREE.Vector3(), fwd = new THREE.Vector3();
    this.game.camera.getWorldPosition(cam);
    this.game.camera.getWorldDirection(fwd);
    this.body.scare(this.scareT, cam, fwd);   // it crouches, the neck stretches to the lens, the head splits open
  }

  // Eye-shine against the headlamp, every frame (not stop-motion).
  updateEyes() {
    const g = this.game, r = g.roomba;
    if (!this.root.visible) return;
    const p = g.camera.getWorldPosition(this._lp || (this._lp = new THREE.Vector3()));
    const d = g.camera.getWorldDirection(this._ld || (this._ld = new THREE.Vector3()));
    this.body.eyeShine(r.light && !r.dead, p, d);
  }

  // ---------- helpers for other systems ----------

  get moving() { return this.root.visible && this.speed > 0.15 && this.state !== 'still' && this.state !== 'lair'; }

  scanSpheres() { return this.root.visible ? this.body.scanSpheres() : []; }

  updateTag() {
    if (!this.root.visible) { this.tag.gone = true; return; }
    this.tag.gone = false;
    this.tag.box.setFromObject(this.root);
  }

  snapshot() { return { active: this.state !== 'dormant' }; }
  restore(s) {
    this.reset();
    if (s.active) {
      // Come back somewhere far from where the robot reboots, and wander for a while first.
      const g = this.game, r = g.roomba;
      const spots = [[12.75, 2.3], [1.4, 8.0], [12.9, 8.3], [9.6, 1.6]].filter(([x, z]) => g.world.navFree(x, z));
      spots.sort((a, b) => Math.hypot(b[0] - r.x, b[1] - r.z) - Math.hypot(a[0] - r.x, a[1] - r.z));
      const [x, z] = spots[0] || [12.62, 5.7];
      this.x = x; this.z = z; this.yaw = Math.PI;
      this.activate(10);
      this.calm = 15;
      this.menace = 0.2;
    }
  }
}
