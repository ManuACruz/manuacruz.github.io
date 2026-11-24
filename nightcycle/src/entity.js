// The thing that lives in the laundry: a tall, thin, pale figure.
// It walks the halls, listens for the vacuum, notices the headlamp, and cannot reach under furniture.

import * as THREE from 'three';
import { ROOMS } from './level.js';
import { T } from './tune.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// Grey, blotchy, with veins showing through.
function skinTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#c9c2b6';
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(${90 + Math.random() * 40},${80 + Math.random() * 30},${70 + Math.random() * 30},${0.08 + Math.random() * 0.12})`;
    g.beginPath(); g.arc(Math.random() * 128, Math.random() * 128, 4 + Math.random() * 14, 0, 7); g.fill();
  }
  g.strokeStyle = 'rgba(70,80,120,0.35)';
  g.lineWidth = 1;
  for (let k = 0; k < 9; k++) {
    let x = Math.random() * 128, y = 0;
    g.beginPath(); g.moveTo(x, y);
    while (y < 128) { x += (Math.random() - 0.5) * 10; y += 6 + Math.random() * 8; g.lineTo(x, y); }
    g.stroke();
  }
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.12})`; g.fillRect(Math.random() * 128, Math.random() * 128, 1, 1); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

const wrapAngle = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

export class Entity {
  constructor(game) {
    this.game = game;
    this.build();
    this.reset();
  }

  build() {
    const skin = new THREE.MeshStandardMaterial({ color: 0xb3a999, map: skinTexture(), roughness: 0.7 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x050404, roughness: 1 });
    this.skin = skin;
    const J = (parent, x, y, z) => { const o = new THREE.Object3D(); o.position.set(x, y, z); parent.add(o); return o; };
    const limb = (parent, len, r, mat = skin) => {
      const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.01, len - r * 2), 4, 8), mat);
      m.position.y = -len / 2;
      parent.add(m);
      return m;
    };
    const root = new THREE.Group();
    this.root = root;
    const hips = J(root, 0, 1.45, 0);
    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), skin);
    pelvis.scale.set(1.2, 0.7, 0.8);
    hips.add(pelvis);
    const spine = J(hips, 0, 0.02, 0);
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.62, 4, 10), skin);
    torso.position.y = 0.42;
    torso.scale.set(1.15, 1, 0.75);
    spine.add(torso);
    // ribs showing through
    for (let k = 0; k < 5; k++) {
      const rib = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 4, 14, Math.PI), skin);
      rib.position.set(0, 0.45 + k * 0.07, 0.02);
      rib.rotation.set(0, Math.PI / 2, Math.PI / 2);
      rib.scale.set(1, 1.2, 1);
      spine.add(rib);
    }
    const chest = J(spine, 0, 0.82, 0);
    const neck = J(chest, 0, 0.04, 0.02);
    const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1, 8).translate(0, 0.5, 0), skin);
    neck.add(neckMesh);
    const head = J(neck, 0, 0.26, 0.03);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), skin);
    skull.scale.set(0.82, 1.3, 0.92);
    head.add(skull);
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), dark);
      eye.position.set(s * 0.036, 0.03, 0.095);
      eye.scale.set(1, 1.4, 0.5);
      head.add(eye);
    }
    const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), dark);
    mouth.position.set(0, -0.08, 0.1);
    mouth.scale.set(0.9, 0.3, 0.4);
    head.add(mouth);
    this.mouth = mouth;

    const arm = (side) => {
      const sh = J(chest, side * 0.2, -0.02, 0);
      limb(sh, 0.66, 0.035);
      const el = J(sh, 0, -0.66, 0);
      limb(el, 0.64, 0.03);
      const hand = J(el, 0, -0.64, 0);
      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.025), skin);
      palm.position.y = -0.04;
      hand.add(palm);
      const fingers = [];
      for (let f = 0; f < 4; f++) {
        const fj = J(hand, (f - 1.5) * 0.013, -0.08, 0);
        limb(fj, 0.2 - Math.abs(f - 1.5) * 0.02, 0.007);
        fj.rotation.x = 0.15;
        fingers.push(fj);
      }
      return { sh, el, hand, fingers };
    };
    const leg = (side) => {
      const hip = J(hips, side * 0.1, -0.02, 0);
      limb(hip, 0.76, 0.044);
      const knee = J(hip, 0, -0.76, 0);
      const kneecap = new THREE.Mesh(new THREE.SphereGeometry(0.052, 8, 6), skin);
      kneecap.scale.set(1, 1.2, 1.1);
      knee.add(kneecap);
      limb(knee, 0.7, 0.03);
      const ankle = J(knee, 0, -0.7, 0);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.035, 0.2), skin);
      foot.position.set(0, -0.02, 0.07);
      ankle.add(foot);
      for (let t = 0; t < 4; t++) {
        const toe = new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.09, 3, 6), skin);
        toe.rotation.x = Math.PI / 2;
        toe.position.set((t - 1.5) * 0.017, -0.03, 0.21);
        ankle.add(toe);
      }
      return { hip, knee, ankle };
    };
    this.j = { hips, spine, chest, neck, neckMesh, head, armL: arm(-1), armR: arm(1), legL: leg(-1), legR: leg(1) };
    root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    root.visible = false;
    this.game.scene.add(root);
    this.tag = { label: 'person', box: new THREE.Box3(), conf: 0.3, entity: true };
  }

  reset() {
    this.x = 12.62; this.z = 4.0; this.yaw = 0;
    this.state = 'dormant';
    this.path = null; this.speed = 0; this.phase = 0; this.lastPlant = 0;
    this.suspicion = 0; this.litTime = 0; this.lostTimer = 0; this.repath = 0; this.wait = 0;
    this.grace = 0; this.calm = 0; this.goHome = false; this.lastSeen = null; this.target = null; this.lookYaw = 0;
    this.poseTimer = 0; this.twitch = 0; this.twitchRoll = 0; this.sinceNear = 0;
    this.homeTrip = false; this.posed = false; this.canSee = false; this.dist = undefined; this.stuck = 0; this.searchFrom = null;
    this.root.visible = false;
    this.scareT = -1;
    // undo the scare: head back on its neck, mouth shut
    this.j.head.position.set(0, 0.26, 0.03);
    this.j.head.rotation.set(0, 0, 0);
    this.mouth.scale.set(0.9, 0.3, 0.4);
    this.layoutNeck();
  }

  get active() { return this.state !== 'dormant' && this.state !== 'script' && this.state !== 'scare' && this.state !== 'still'; }

  // ---------- control from the story ----------

  walkScript(points, speed, onDone) {
    this.state = 'script';
    this.root.visible = true;
    this.x = points[0][0]; this.z = points[0][1];
    this.path = points.slice(1).map((p) => [...p]);
    this.yaw = Math.atan2(this.path[0][0] - this.x, this.path[0][1] - this.z);
    this.posed = false; this.canSee = false;
    this.scriptSpeed = speed;
    this.onScriptDone = onDone;
  }

  activate(grace = T.entGrace) {
    this.state = 'patrol';
    this.root.visible = true;
    this.grace = grace;
    this.path = null;
    this.wait = 1;
    this.posed = false; this.canSee = false;
  }

  // Stand in a neutral pose and hold it; the story may then bend it by hand.
  placeStill(x, z, yaw) {
    this.state = 'still';
    this.root.visible = true;
    this.x = x; this.z = z; this.yaw = yaw; this.speed = 0;
    this.path = null;
    this.canSee = false; this.lookYaw = 0; this.twitchRoll = 0;
    this.posed = false;
    this.phase = 0; this.poseTimer = 0;
    this.animate(0);
    this.posed = true;
  }

  hide() { this.state = 'dormant'; this.root.visible = false; }

  // ---------- senses ----------

  hear(x, z, radius, kind) {
    if (!this.active || this.state === 'chase') return;
    let d = Math.hypot(x - this.x, z - this.z);
    if (!this.game.world.los(this.x, this.z, x, z)) d *= T.occlusion;
    const r = radius * (this.grace > 0 || this.calm > 0 ? 0.5 : 1) * this.game.diff().hearing;
    if (d > r) return;
    if (this.state !== 'investigate' || kind === 'bump' || Math.random() < 0.3) this.investigate(x, z);
  }

  investigate(x, z) {
    this.state = 'investigate';
    this.target = [x, z];
    this.path = this.game.world.findPath(this.x, this.z, x, z);
    this.wait = 3 + Math.random() * 1.5;
    this.arrived = false;
    this.homeTrip = false;
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
        if ((c > Math.cos(T.entFov) || dist < 1.3) && g.world.los(this.x, this.z, r.x, r.z)) see = true;
      }
    }
    // A headlamp in its face gets its attention even from behind its sight cone.
    const lit = r.light && !r.dead && dist < 7 && (-dx * r.fx - dz * r.fz) / dist > Math.cos(0.5) && g.world.los(this.x, this.z, r.x, r.z);
    this.litTime = lit ? this.litTime + dt : Math.max(0, this.litTime - dt);
    if (this.litTime > T.entLitNotice && !r.hidden) see = true;

    if (see) {
      this.suspicion = Math.min(1.5, this.suspicion + dt / (T.entNotice * clamp(dist / 4, 0.3, 1.5)));
      this.lastSeen = [r.x, r.z];
    } else this.suspicion = Math.max(0, this.suspicion - dt * 0.35);
    this.canSee = see;
    if (dist < 6) this.sinceNear = 0; else this.sinceNear += dt;
    return see;
  }

  // ---------- update ----------

  update(dt) {
    const g = this.game;
    if (this.state === 'dormant') return;
    if (this.state === 'scare') { this.updateScare(dt); return; }
    this.dist = Math.hypot(g.roomba.x - this.x, g.roomba.z - this.z);
    if (!this.active) this.canSee = false;
    this.grace = Math.max(0, this.grace - dt);
    this.calm = Math.max(0, this.calm - dt);
    let speed = 0;

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
      if (see && this.state !== 'chase' && this.suspicion >= 1) this.startChase();
      if (see && this.state !== 'chase') this.lookAt(r.x, r.z, dt * 2);   // stops and stares while deciding

      if (this.state === 'patrol') {
        speed = see ? 0 : T.entPatrolSpeed;
        if (!see) {
          if (!this.path || !this.path.length) {
            this.wait -= dt;
            this.lookAround(dt);
            speed = 0;
            if (this.wait <= 0) this.pickPatrol();
          } else if (this.follow(dt, speed)) { this.wait = this.homeTrip ? 9 + Math.random() * 6 : 1.5 + Math.random() * 2.5; this.homeTrip = false; }
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
      } else if (this.state === 'chase') {
        speed = T.entChaseSpeed * g.diff().chase;
        if (see) this.lostTimer = 0; else this.lostTimer += dt;
        this.repath -= dt;
        if (r.hidden) {
          this.state = 'search';
          this.searchFrom = [r.x, r.z];
          this.path = g.world.findPath(this.x, this.z, r.x, r.z);
          this.wait = T.entSearchTime;
          g.onEntitySearch?.();
        } else if (this.lostTimer > T.entLoseTime) {
          this.investigate(this.lastSeen[0], this.lastSeen[1]);
        } else {
          if (this.repath <= 0) {
            this.repath = 0.3;
            const [tx, tz] = see ? [r.x, r.z] : this.lastSeen;
            this.path = g.world.findPath(this.x, this.z, tx, tz) || this.path;
          }
          // Out of path but not close enough to grab: it can't get there. Give it a moment, then search.
          if (this.follow(dt, speed, 1.8) && this.dist > T.entCatch) this.stuck += dt; else this.stuck = 0;
          if (this.stuck > 1.5) {
            this.stuck = 0;
            this.searchFrom = [r.x, r.z];
            this.state = 'search';
            this.path = null;
            this.wait = T.entSearchTime;
            g.onEntitySearch?.();
          }
        }
      } else if (this.state === 'search') {
        speed = T.entInvestigateSpeed;
        if (this.path && this.path.length) this.follow(dt, speed);
        else {
          speed = 0;
          this.wait -= dt;
          this.lookAt(r.x, r.z, dt * 1.5);
          const moved = !this.searchFrom || Math.hypot(r.x - this.searchFrom[0], r.z - this.searchFrom[1]) > 0.4;
          if (!r.hidden && see && moved) this.startChase();
          else if (this.wait <= 0) { this.state = 'patrol'; this.suspicion = 0; this.wait = 1; this.path = null; this.loseInterest(); g.onEntityGiveUp?.(); }
        }
      }

      // Caught?
      if (!r.hidden && !r.dead && !g.debug.ghost && this.dist < T.entCatch) g.caught();
    }

    this.speed += (speed - this.speed) * Math.min(1, dt * 4);
    this.animate(dt);
  }

  startChase() {
    this.state = 'chase';
    this.lostTimer = 0;
    this.repath = 0;
    this.suspicion = 1;
    this.game.onEntityChase?.();
  }

  // After a failed search it wanders off for a while: often back to the laundry, never to your room.
  loseInterest(scale = 1) {
    this.calm = (20 + Math.random() * 12) * scale;
    this.goHome = Math.random() < 0.5;
  }

  pickPatrol() {
    const g = this.game, w = g.world;
    const pr = w.roomAt(g.roomba.x, g.roomba.z), mine = w.roomAt(this.x, this.z);
    const laundry = w.roomIndex('laundry');
    const quiet = this.grace > 0 || this.calm > 0;
    let target = -1;
    if (this.goHome && this.calm > 0 && w.doors.laundry.state === 'open') { target = laundry; this.goHome = false; this.homeTrip = true; }
    else if (!quiet && this.sinceNear > 40 && pr >= 0) target = pr;   // it comes looking
    else {
      const weights = ROOMS.map((room, i) => {
        if (room.id === 'laundry') return 0;
        if (room.id === 'kid' && w.doors.kid.state !== 'open') return 0;
        let wgt = 1;
        if (i === mine) wgt *= 0.3;
        if (i === pr) wgt *= quiet ? 0 : 1.2;
        return wgt;
      });
      const sum = weights.reduce((a, b) => a + b, 0);
      let pick = Math.random() * sum;
      for (let i = 0; i < weights.length; i++) { pick -= weights[i]; if (pick <= 0) { target = i; break; } }
    }
    const p = target >= 0 ? w.randomFreeIn(target) : null;
    this.path = p ? w.findPath(this.x, this.z, p[0], p[1]) : null;
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
      }
    }
    if (this.posed) return;   // the story is holding a pose
    // Stop-motion: the pose only updates a dozen times a second.
    this.poseTimer -= dt;
    if (this.poseTimer > 0) return;
    this.poseTimer = 1 / 12;
    const j = this.j, p = this.phase, walk = clamp(this.speed / 0.8, 0, 1);
    const chase = this.state === 'chase';
    const sL = Math.sin(p), sR = Math.sin(p + Math.PI);
    const legPose = (L, s, c) => {
      L.hip.rotation.x = -s * 0.5 * walk - 0.08;
      L.knee.rotation.x = 0.12 + Math.max(0, -c) * 1.0 * walk;
      L.ankle.rotation.x = -(L.hip.rotation.x + L.knee.rotation.x) * 0.8;
    };
    legPose(j.legL, sL, Math.cos(p));
    legPose(j.legR, sR, Math.cos(p + Math.PI));
    j.hips.position.y = 1.43 - Math.abs(Math.cos(p)) * 0.05 * walk;
    j.spine.rotation.x = chase ? 0.5 : 0.28;
    j.spine.rotation.z = Math.sin(p) * 0.04 * walk;
    const armPose = (A, s, side) => {
      A.sh.rotation.x = s * 0.35 * walk + (chase ? -0.6 : 0);
      A.sh.rotation.z = side * 0.06;
      A.el.rotation.x = -0.25 - (chase ? 0.6 : 0);
      for (const f of A.fingers) f.rotation.x = 0.15 + Math.sin(g.time * 3 + f.position.x * 50) * 0.1;
    };
    armPose(j.armL, -sL, -1);
    armPose(j.armR, -sR, 1);
    // Head: twitches, and turns toward whatever it is listening to.
    this.twitch -= 1 / 12;
    if (this.twitch <= 0) { this.twitch = 0.6 + Math.random() * 2.5; this.twitchRoll = (Math.random() - 0.5) * 0.9; }
    let headYaw = this.lookYaw * (this.speed < 0.1 ? 1 : 0.2);
    if (this.canSee || this.state === 'search') {
      const r = g.roomba;
      headYaw = clamp(wrapAngle(Math.atan2(r.x - this.x, r.z - this.z) - this.yaw), -1.2, 1.2);
    }
    j.head.rotation.set(0.5 + (this.canSee ? 0.4 : 0), headYaw, this.twitchRoll * (this.speed < 0.1 ? 1 : 0.3));
    this.layoutNeck();
  }

  layoutNeck() {
    const h = this.j.head.position, n = this.j.neckMesh;
    const L = h.length();
    n.scale.set(1, L, 1);
    n.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), h.clone().normalize());
  }

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
    this.animate(0.016);
    this.poseTimer = 0;
  }

  updateScare(dt) {
    this.scareT += dt;
    const t = this.scareT, g = this.game;
    const j = this.j;
    this.root.position.set(this.x, 0, this.z);
    this.root.rotation.y = this.yaw;
    j.spine.rotation.x = Math.min(1.2, t * 4);
    j.legL.knee.rotation.x = j.legR.knee.rotation.x = Math.min(1.3, t * 4);
    j.legL.hip.rotation.x = j.legR.hip.rotation.x = -Math.min(1.1, t * 3.5);
    j.hips.position.y = 1.43 - Math.min(0.55, t * 1.8);
    for (const A of [j.armL, j.armR]) { A.sh.rotation.x = -Math.min(1.6, t * 5); A.el.rotation.x = -0.4; }
    // the neck stretches the rest of the way to the lens
    const cam = new THREE.Vector3();
    g.camera.getWorldPosition(cam);
    const fwd = new THREE.Vector3(); g.camera.getWorldDirection(fwd);
    const goal = cam.clone().addScaledVector(fwd, 0.3);
    this.root.updateMatrixWorld(true);
    const rest = new THREE.Vector3(0, 0.26, 0.03);
    const k = clamp((t - 0.25) / 0.35, 0, 1);
    const local = j.neck.worldToLocal(goal.clone());
    j.head.position.lerpVectors(rest, local, k * k);
    j.head.lookAt(cam);   // for plain objects lookAt turns +z, the face, toward the target
    this.mouth.scale.set(0.9, 0.3 + clamp((t - 0.35) * 4, 0, 1) * 1.6, 0.4);
    this.layoutNeck();
  }

  // ---------- helpers for other systems ----------

  scanSpheres() {
    if (!this.root.visible) return [];
    this.root.updateMatrixWorld(true);
    const out = [], v = new THREE.Vector3();
    const add = (o, r, n = 1, to = null) => {
      for (let k = 0; k < n; k++) {
        if (to) { const a = new THREE.Vector3(), b = new THREE.Vector3(); o.getWorldPosition(a); to.getWorldPosition(b); v.lerpVectors(a, b, (k + 0.5) / n); }
        else o.getWorldPosition(v);
        out.push({ x: v.x, y: v.y, z: v.z, r });
      }
    };
    const j = this.j;
    for (const L of [j.legL, j.legR]) { add(L.hip, 0.06, 5, L.knee); add(L.knee, 0.05, 5, L.ankle); add(L.ankle, 0.06); }
    for (const A of [j.armL, j.armR]) { add(A.sh, 0.045, 4, A.el); add(A.el, 0.04, 4, A.hand); add(A.hand, 0.05); }
    add(j.hips, 0.13); add(j.spine, 0.13, 4, j.chest); add(j.chest, 0.13); add(j.head, 0.12); add(j.neck, 0.05, 2, j.head);
    return out;
  }

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
    }
  }
}
