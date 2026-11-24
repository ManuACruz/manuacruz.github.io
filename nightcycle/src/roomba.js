// The player: a robot vacuum. Driving, bumping, sweeping, battery, bin, dock and the floor-level camera.

import * as THREE from 'three';
import { T } from './tune.js';
import { DOCK } from './level.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const approach = (v, t, d) => (v < t ? Math.min(t, v + d) : Math.max(t, v - d));
const LAMP = 26;

function lampCookie() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const rad = g.createRadialGradient(64, 64, 8, 64, 64, 64);
  rad.addColorStop(0, '#fff'); rad.addColorStop(0.6, '#d8d8d8'); rad.addColorStop(1, '#000');
  g.fillStyle = rad;
  g.fillRect(0, 0, 128, 128);
  // canvas top is the top of the beam: darken the lower part
  const lin = g.createLinearGradient(0, 40, 0, 128);
  lin.addColorStop(0, 'rgba(0,0,0,0)'); lin.addColorStop(1, 'rgba(0,0,0,0.85)');
  g.fillStyle = lin;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class Roomba {
  constructor(game) {
    this.game = game;
    this.rig = new THREE.Group();
    this.head = new THREE.Group();
    this.head.position.set(0, T.camHeight, -T.camForward);
    this.rig.add(this.head);
    this.head.add(game.camera);
    game.scene.add(this.rig);

    // The headlamp sits on the front of the bumper so it never lights the robot itself.
    // Its cookie dims the bottom of the beam so the floor right in front doesn't burn out.
    const lamp = new THREE.SpotLight(0xfff0d8, LAMP, 12, 0.6, 0.5, 1.0);
    lamp.map = lampCookie();
    lamp.castShadow = true;
    lamp.shadow.mapSize.set(512, 512);
    lamp.shadow.camera.near = 0.03;
    lamp.shadow.camera.far = 12;
    lamp.shadow.bias = -0.0004;
    lamp.shadow.normalBias = 0.02;
    lamp.position.set(0, -0.04, -0.1);
    lamp.target.position.set(0, 0.35, -3);
    this.head.add(lamp, lamp.target);
    this.lamp = lamp;

    this.led = new THREE.PointLight(0x40c8ff, 0.03, 0.8, 2);
    this.led.position.set(0, 0.13, 0.12);
    this.rig.add(this.led);

    // Front bumper along the bottom of the view.
    const plastic = new THREE.MeshStandardMaterial({ color: 0x2a2b2e, roughness: 0.45, side: THREE.DoubleSide });
    const bumper = new THREE.Mesh(new THREE.CylinderGeometry(T.radius + 0.003, T.radius + 0.003, 0.04, 32, 1, true, Math.PI - 1.0, 2.0), plastic);
    bumper.position.y = 0.04;
    const lip = new THREE.Mesh(new THREE.TorusGeometry(T.radius - 0.004, 0.005, 6, 32, 2.0), new THREE.MeshStandardMaterial({ color: 0x55585e, roughness: 0.3 }));
    lip.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 1.0 + Math.PI);
    lip.position.y = 0.062;
    this.rig.add(bumper, lip);
    this.fpParts = [bumper, lip];

    // Side brush, front right. Its bristles flick into the bottom of the view.
    this.brush = new THREE.Group();
    this.brush.position.set(0.11, 0.008, -0.12);
    const bristle = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, roughness: 0.8 });
    for (let k = 0; k < 3; k++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.003, 0.075), bristle);
      b.position.z = -0.037;
      const arm = new THREE.Group();
      arm.rotation.y = (k / 3) * Math.PI * 2;
      arm.add(b);
      this.brush.add(arm);
    }
    this.rig.add(this.brush);

    this.model = this.buildModel();
    this.model.visible = false;
    this.rig.add(this.model);

    this.reset();
  }

  buildModel() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(T.radius, T.radius, 0.075, 40), new THREE.MeshStandardMaterial({ color: 0x1c1d20, roughness: 0.35 }));
    body.position.y = 0.045;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(T.radius * 0.8, T.radius * 0.8, 0.004, 40), new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: 0.1, metalness: 0.5 }));
    top.position.y = 0.084;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.006, 8, 32), new THREE.MeshBasicMaterial({ color: 0x40c8ff }));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(0, 0.087, 0.02);
    this.ringMat = ring.material;
    g.add(body, top, ring);
    g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    return g;
  }

  reset() {
    this.x = DOCK.x; this.z = DOCK.z; this.yaw = DOCK.yaw; this.pitch = 0.05;
    this.v = 0; this.w = 0;
    this.battery = 100; this.bin = 0;
    this.suction = true; this.light = true;
    this.scanTimer = 0; this.bumpTimer = 0; this.noiseTimer = 0;
    this.docked = true; this.dead = false; this.hidden = false;
    this.shake = 0; this.flags = {};
    this.brushAngle = 0; this.dirtRate = 0;
  }

  get fx() { return -Math.sin(this.yaw); }
  get fz() { return -Math.cos(this.yaw); }

  update(dt, input, active) {
    const g = this.game, s = g.settings;
    const can = active && !this.dead;
    const th = can ? input.throttle : 0, st = can ? input.steer : 0;

    if (can) {
      if (input.consume('suction')) { this.suction = !this.suction; g.audio.click(this.suction); g.hud.flashKey('suction'); }
      if (input.consume('light')) { this.light = !this.light; g.audio.click(this.light); g.hud.flashKey('light'); }
      if (input.consume('scan')) {
        if (this.scanTimer <= 0 && this.battery > T.scanCost) { this.scanTimer = T.scanCooldown; this.battery -= T.scanCost; g.lidar.scan(); g.audio.ping(); g.stats.scans++; }
        else g.audio.deny();
      }
    }
    this.scanTimer = Math.max(0, this.scanTimer - dt);

    // Driving
    const target = th >= 0 ? th * T.maxSpeed : th * T.reverseSpeed;
    this.v = approach(this.v, target, (Math.abs(target) > Math.abs(this.v) && Math.sign(target) !== -Math.sign(this.v) ? T.accel : T.brake) * dt);
    this.w = approach(this.w, st * T.turnSpeed, T.turnAccel * dt);
    const sens = s.sensitivity;
    if (can) {
      this.yaw += this.w * dt - input.lookX * T.mouseTurn * sens;
      this.pitch = clamp(this.pitch - input.lookY * T.mousePitch * sens * (s.invert ? -1 : 1), T.pitchMin, T.pitchMax);
    }

    const dist = this.v * dt, n = Math.max(1, Math.ceil(Math.abs(dist) / 0.03));
    let hit = null;
    for (let k = 0; k < n; k++) {
      this.x += this.fx * (dist / n); this.z += this.fz * (dist / n);
      const r = g.world.collide(this.x, this.z, T.radius);
      this.x = r.x; this.z = r.z;
      if (r.hit) hit = r;
    }
    this.bumpTimer -= dt;
    if (hit) {
      const into = -(this.fx * hit.nx + this.fz * hit.nz) * Math.sign(this.v);
      if (into > 0.45 && Math.abs(this.v) > T.bumpMinSpeed && this.bumpTimer <= 0) {
        const hard = Math.min(1, Math.abs(this.v) / T.maxSpeed);
        this.v *= -0.25;
        this.bumpTimer = T.bumpCooldown;
        this.shake = 0.5 + hard * 0.5;
        g.audio.bump(hard);
        g.noise(this.x, this.z, T.noiseBump * (0.5 + hard * 0.5), 'bump');
        g.hud.bump();
        g.stats.bumps++;
      }
    }

    // Sweeping
    const working = this.suction && !this.dead && this.bin < 100;
    if (working) {
      const removed = g.world.clean(this.x + this.fx * 0.03, this.z + this.fz * 0.03, T.cleanRadius, T.cleanRate * dt);
      this.bin = Math.min(100, this.bin + removed * g.binPerDirt);
      this.dirtRate += (removed / Math.max(dt, 1e-3) - this.dirtRate) * Math.min(1, dt * 6);
      if (this.bin >= 100 && !this.flags.binFull) { this.flags.binFull = true; g.say('Please empty bin.', 'system'); g.audio.error(); }
    } else this.dirtRate *= 0.9;
    if (this.bin < 90) this.flags.binFull = false;
    this.brushAngle += dt * (working ? 22 : 0);
    this.brush.rotation.y = this.brushAngle;

    // Battery
    if (!this.dead) {
      let drain = T.drainBase + T.drainMove * Math.min(1, Math.abs(this.v) / T.maxSpeed + Math.abs(this.w) * 0.1);
      if (working) drain += T.drainSuction;
      if (this.light) drain += T.drainLight;
      if (!g.debug.infiniteBattery) this.battery -= drain * dt * g.diff().battery;
    }

    // Dock
    const dd = Math.hypot(this.x - DOCK.x, this.z - DOCK.z);
    const wasDocked = this.docked;
    this.docked = dd < 0.16 && !this.dead;
    if (this.docked) {
      this.battery = Math.min(100, this.battery + T.chargeRate * dt);
      this.bin = Math.max(0, this.bin - 40 * dt);
      if (!wasDocked) { g.audio.dock(); g.say('Charging.', 'system'); g.story.onDock?.(); }
    } else if (wasDocked) g.audio.undock();

    if (this.battery < T.batteryLow && !this.flags.low) { this.flags.low = true; g.say('Battery low. Please return to Home Base.', 'voice'); g.audio.lowBattery(); }
    if (this.battery > T.batteryLow + 10) this.flags.low = false;
    if (this.battery < 8 && !this.flags.crit) { this.flags.crit = true; g.audio.lowBattery(); }
    if (this.battery > 12) this.flags.crit = false;
    if (this.battery <= 0 && !this.dead) { this.battery = 0; this.dead = true; g.batteryDead(); }

    // Hidden under furniture, or tucked somewhere its body can't get close enough to grab you.
    const cover = !!g.world.coverAt(this.x, this.z);
    this.outOfReach = !cover && !g.world.entityCanReach(this.x, this.z, T.entCatch - 0.03);
    this.hidden = cover || this.outOfReach;

    // Noise for the thing listening
    this.noiseTimer -= dt;
    if (this.noiseTimer <= 0) {
      this.noiseTimer = 0.4;
      if (working) g.noise(this.x, this.z, T.noiseSuction, 'suction');
      else if (Math.abs(this.v) > 0.15) g.noise(this.x, this.z, T.noiseDrive, 'drive');
    }

    this.updateRig(dt, g.time);
  }

  updateRig(dt, time) {
    this.rig.position.set(this.x, 0, this.z);
    this.rig.rotation.y = this.yaw;
    this.head.rotation.x = this.pitch;
    this.head.rotation.z = -this.w * 0.012;
    const cam = this.game.camera;
    this.shake = Math.max(0, this.shake - dt * 3);
    const sp = Math.abs(this.v) / T.maxSpeed;
    const vib = (this.suction && !this.dead ? 0.0004 : 0) + sp * 0.0007;
    if (cam.parent === this.head) {   // not during cinematics
      cam.position.set(
        (Math.random() - 0.5) * this.shake * 0.012,
        Math.sin(time * 90) * vib + (Math.random() - 0.5) * this.shake * 0.01,
        0,
      );
      cam.rotation.set((Math.random() - 0.5) * this.shake * 0.03, 0, (Math.random() - 0.5) * this.shake * 0.02);
    }

    // Headlamp: off, on, or failing when the battery is nearly flat.
    let li = this.light && !this.dead ? LAMP * (this.docked && this.fx < 0 ? 0.15 : 1) : 0;   // dim when nosed into the dock
    if (li && this.battery < 10 && Math.random() < 0.08) li *= Math.random() * 0.4;
    if (this.game.lampFlicker > 0 && Math.random() < 0.5) li *= Math.random();
    this.lamp.intensity = li;
    this.led.intensity = this.dead ? 0 : this.ledBoost ? 1.2 : 0.03;
    this.led.distance = this.ledBoost ? 3.5 : 0.8;
    this.led.color.setHex(this.battery < T.batteryLow ? 0xff5030 : 0x40c8ff);
    this.ringMat.color.copy(this.led.color);
  }

  snapshot() {
    return { x: this.x, z: this.z, yaw: this.yaw, battery: this.battery, bin: this.bin, suction: this.suction, light: this.light };
  }
  restore(s) {
    Object.assign(this, s);
    this.battery = Math.max(this.battery, T.respawnBattery);
    this.v = 0; this.w = 0; this.dead = false; this.shake = 0; this.pitch = 0.05;
    this.flags = {};
    this.docked = Math.hypot(this.x - DOCK.x, this.z - DOCK.z) < 0.16;
  }
}
