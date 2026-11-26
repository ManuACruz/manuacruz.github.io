// Tension: what the robot's camera and the house do as the thing gets close, and the small things that happen
// when it is quiet.
//  - interference: the picture tears and rolls, the headlamp stutters, the audio crackles, inside ~4.5 m
//  - a pulse: the picture throbs (vignette, a bulge) with a low thump, faster as it closes in on a hidden robot
//  - its footsteps shake the camera, and sift grit off the furniture you are hiding under
//  - lights near it flicker and buzz
//  - a fast turn smears the picture; a low battery drains the colour; first sight of it pulls focus
//  - when nothing has happened for a while: a handle rattles, something is dragged, knocks travel along a wall,
//    a thump in the roof, a shape crosses a moonlit window, or a scan shows someone standing in a doorway.

import * as THREE from 'three';
import { FTYPES, LIGHTS, PLACES, HOUSE } from './level.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const rand = (a, b) => a + Math.random() * (b - a);

// Where the LIDAR ghost may stand: doorways and the ends of the hall, facing whoever scans.
const GHOST_SPOTS = [[9.0, 5.85], [11.8, 5.85], [4.2, 5.8], [5.43, 6.95], [1.42, 7.0], [9.82, 7.0], [8.45, 4.6], [2.7, 4.6], [6.0, 2.0], [12.62, 4.4]];

export class Tension {
  constructor(game) {
    this.game = game;
    this.interf = 0; this.fear = 0; this.beat = 0; this.zoomT = 0; this.lastYaw = null; this.blur = 0;
    this.crackleT = 0; this.buzzT = 0;
    this.reset();
    // a copy of the moon cookie to draw a passing shape into
    const src = game.house.tx.cookie.image;
    this.cookieC = document.createElement('canvas');
    this.cookieC.width = src.width; this.cookieC.height = src.height;
    this.cookieG = this.cookieC.getContext('2d');
    this.cookieT = new THREE.CanvasTexture(this.cookieC);
    this.cookieT.colorSpace = game.house.tx.cookie.colorSpace;
  }

  reset() {
    this.next = rand(45, 70); this.calmFor = 0; this.event = null; this.ghostReady = false; this.ghostUsed = this.ghostUsed || false;
    this.flick = {};
    if (this.game.house) for (const m of this.game.house.moons) m.spot.map = this.game.house.tx.cookie;
  }

  // ---------- hooks ----------

  // One of its feet coming down at (x, z).
  footfall(x, z, loud) {
    const g = this.game, r = g.roomba, d = Math.hypot(x - r.x, z - r.z);
    if (d > 6 || g.state === 'title') return;
    const k = (1 - d / 6) ** 2 * loud;
    r.shake = Math.max(r.shake, k * (g.settings.flashing ? 0.9 : 0.45));
    if (r.cover && d < 2.4) {
      const top = (FTYPES[r.cover.type]?.clear ?? 0.3) - 0.008;
      g.fx.sift(r.x + r.fx * 0.22, top, r.z + r.fz * 0.22, Math.round(4 + k * 14), 0.22);
    }
  }

  // First good look at it: the camera pulls focus.
  firstSight() { this.zoomT = 1.8; }

  // ---------- per frame ----------

  update(dt) {
    const g = this.game, r = g.roomba, e = g.entity, u = g.post.uniforms, calm = !g.settings.flashing;
    const live = g.state === 'playing' || g.state === 'cutscene';
    const out = e.root.visible && e.state !== 'dormant' && e.state !== 'lair';
    const d = out ? Math.hypot(e.x - r.x, e.z - r.z) : 99;

    // interference: it is electrical, so walls don't stop it
    let want = live && out ? clamp((4.5 - d) / 3.5, 0, 1) ** 1.5 : 0;
    if (live && e.state === 'chase') want = Math.max(want, 0.22);
    if (live && e.state === 'reach') want = Math.max(want, 0.55);
    want *= calm ? 0.4 : 1;
    this.interf += (want - this.interf) * Math.min(1, dt * 4);
    if (g.state === 'dying' || g.state === 'dead') this.interf *= 0.9;
    u.interf.value = this.interf;
    g.interf = this.interf;
    u.dropout.value = !calm && live && this.interf > 0.3 && Math.random() < this.interf * 0.025 ? 0.92 : 0;
    this.crackleT -= dt;
    if (live && this.interf > 0.08 && this.crackleT <= 0) { this.crackleT = rand(0.05, 0.4) / (0.3 + this.interf); g.audio.crackle(this.interf); }

    // the pulse: hidden while it stands over you, or being chased
    let fear = 0;
    if (live && out) {
      if (e.state === 'chase') fear = 0.75;
      if (r.hidden && d < 3.8) fear = Math.max(fear, 1 - d / 3.8);
      if (d < 2.5) fear = Math.max(fear, (1 - d / 2.5) * 0.7);
      if (e.state === 'reach') fear = 1;
    }
    this.fear += (fear - this.fear) * Math.min(1, dt * (fear > this.fear ? 3 : 0.8));
    const prev = this.beat;
    this.beat += dt * (0.9 + this.fear * 1.4);
    const ph = this.beat % 1, ph2 = ph - 0.2;
    const lub = Math.exp(-ph * 12) + (ph2 > 0 ? 0.6 * Math.exp(-ph2 * 12) : 0);
    u.pulse.value = this.fear * lub * (calm ? 0.45 : 1);
    if (Math.floor(this.beat) !== Math.floor(prev) && this.fear > 0.18 && live) g.audio.pulse(this.fear);

    // fast turns smear the picture
    if (this.lastYaw == null) this.lastYaw = r.yaw;
    let dy = r.yaw - this.lastYaw;
    while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
    this.lastYaw = r.yaw;
    const rate = dt > 0 ? dy / dt : 0;
    const bw = g.cine || !live ? 0 : Math.sign(rate) * Math.max(0, Math.abs(rate) - 1.1) * 0.0045;
    this.blur += (clamp(bw, -0.014, 0.014) - this.blur) * Math.min(1, dt * 12);
    u.blurX.value = Math.abs(this.blur) < 0.0004 ? 0 : -this.blur;

    // colour drains as the battery dies
    const b = r.battery;
    u.desat.value = g.state === 'title' ? 0 : clamp((22 - b) / 22, 0, 1) * 0.65 + (r.dead ? 0.3 : 0);

    // focus pull on first sight
    if (this.zoomT > 0) {
      this.zoomT = Math.max(0, this.zoomT - dt);
      const k = 1 - this.zoomT / 1.8;
      u.zoom.value = Math.sin(Math.min(1, k * 1.6) * Math.PI) * (k < 0.62 ? 0.055 : 0.02) * (calm ? 0.6 : 1);
    } else u.zoom.value = 0;

    this.lightsNear(dt, out ? e : null, calm);
    this.director(dt, live, out, d);
  }

  // Lamps, the TV and the nightlight stutter when it passes close.
  lightsNear(dt, e, calm) {
    const g = this.game, h = g.house, L = h.lights, t = g.time;
    const list = [['lamp', L.lamp], ['tv', L.tv], ['fridge', L.fridge], ['nightlight', L.nightlight]];
    let worst = 0, wl = null;
    for (const [key, light] of list) {
      if (!light.visible || light.intensity <= 0) { this.flick[key] = 0; continue; }
      const P = LIGHTS[key];
      const near = e ? clamp(1 - Math.hypot(e.x - P.x, e.z - P.z) / 3.2, 0, 1) : 0;
      if (near <= 0) continue;
      const k = calm ? 1 - near * 0.5 * (0.5 + 0.5 * Math.sin(t * 9 + P.x)) : Math.random() < near * 0.45 ? rand(0, 0.35) : 1 - near * 0.15;
      light.intensity *= k;
      if (key === 'lamp' && h.lampShade) h.lampShade.emissiveIntensity *= k;
      if (near > worst) { worst = near; wl = P; }
    }
    this.buzzT -= dt;
    if (wl && worst > 0.25 && this.buzzT <= 0 && g.state === 'playing') { this.buzzT = rand(2.5, 4); g.audio.buzz(wl.x, wl.y, wl.z, rand(0.8, 1.6), worst); }
  }

  // ---------- quiet-time events ----------

  director(dt, live, out, d) {
    const g = this.game;
    if (this.event) { this.event.t += dt; if (this.event.run(this.event.t, dt)) this.event = null; return; }
    if (!live || g.state !== 'playing' || g.cine) return;
    const quiet = !out || d > 7.5;
    this.calmFor = quiet ? this.calmFor + dt : 0;
    if (!quiet) return;
    this.next -= dt;
    if (this.next > 0 || this.calmFor < 12) return;
    this.next = rand(38, 70);
    const pool = this.eligible();
    if (!pool.length) return;
    const pick = pool[(Math.random() * pool.length) | 0];
    this.event = { t: 0, run: pick.call(this) };
  }

  eligible() {
    const g = this.game, r = g.roomba, out = [];
    out.push(this.evRattle, this.evDrag, this.evKnocks, this.evThump);
    const moon = this.nearMoon();
    if (moon) out.push(this.evWindow, this.evWindow);
    if (!g.flags.entity && !this.ghostUsed && g.story.step >= 1) out.push(this.evGhost, this.evGhost);
    return out;
  }

  // A locked outside door: someone tries the handle.
  evRattle() {
    const g = this.game, h = g.house, r = g.roomba;
    const which = Math.hypot(r.x - PLACES.backDoor[0], r.z - PLACES.backDoor[2]) < Math.hypot(r.x - 0, r.z - 5.75) ? 'back' : 'front';
    const leaf = h.doors[which].leaf, at = which === 'back' ? PLACES.backDoor : [0, 1, 5.75];
    g.audio.rattle(at[0], at[2], 1.3);
    const rest = leaf.rotation.y;
    let logged = false;
    return (t) => {
      leaf.rotation.y = rest + (t < 1.3 ? Math.sin(t * 70) * 0.006 * (1 - t / 1.3) : 0);
      if (t > 1.3 && !logged) { logged = true; g.hud.log('Sensor: Exterior door handle (' + (which === 'back' ? 'Kitchen' : 'Hallway') + ')'); }
      return t > 1.45;
    };
  }

  // Something heavy dragged across a floor in a room far from you.
  evDrag() {
    const g = this.game, r = g.roomba;
    const far = [[12.6, 2.5], [1.5, 8.5], [12.5, 8.5], [8.5, 2.5], [2.5, 2.5]].sort((a, b) => Math.hypot(b[0] - r.x, b[1] - r.z) - Math.hypot(a[0] - r.x, a[1] - r.z))[0];
    g.audio.drag(far[0], far[1], 2.6);
    let second = false;
    return (t) => {
      if (!second && t > 3.4) { second = true; g.audio.drag(far[0] + 0.6, far[1], 1.4); }
      return t > 5;
    };
  }

  // Knocks inside the nearest wall, moving along it toward you, then stopping just short.
  evKnocks() {
    const g = this.game, r = g.roomba, w = g.world;
    let best = null, bd = 9;
    for (const p of w.pieces) {
      if (p.kind !== 'solid' || p.y1 < 2) continue;
      const cx = clamp(r.x, p.x0, p.x1), cz = clamp(r.z, p.z0, p.z1), dd = Math.hypot(cx - r.x, cz - r.z);
      if (dd < bd && dd > 0.3) { bd = dd; best = { p, cx, cz }; }
    }
    if (!best) return () => true;
    const along = best.p.along, dir = Math.random() < 0.5 ? -1 : 1;
    let k = 0, next = 0;
    return (t) => {
      if (t >= next && k < 5) {
        const off = dir * (3 - k * 0.55);
        const x = along === 'x' ? clamp(best.cx + off, best.p.x0, best.p.x1) : best.cx;
        const z = along === 'z' ? clamp(best.cz + off, best.p.z0, best.p.z1) : best.cz;
        g.audio.knock(x, z, 1, 0, 0.32 + k * 0.05);
        k++; next = t + rand(0.55, 0.9);
      }
      return k >= 5 && t > next + 0.5;
    };
  }

  // A thump in the roof space right over you. Dust sifts down through the light.
  evThump() {
    const g = this.game, r = g.roomba;
    g.audio.thump(r.x + r.fx * 0.8, HOUSE.wallH + 0.3, r.z + r.fz * 0.8, 0.9);
    r.shake = Math.max(r.shake, g.settings.flashing ? 0.7 : 0.35);
    let n = 0;
    return (t) => {
      if (n < 4 && t > n * 0.25) { n++; g.fx.sift(r.x + r.fx * (0.9 + n * 0.2), HOUSE.wallH - 0.02, r.z + r.fz * (0.9 + n * 0.2), 22, 0.45); }
      return t > 1.5;
    };
  }

  nearMoon() {
    const g = this.game, r = g.roomba;
    let best = null, bd = 6.5;
    for (const m of g.house.moons) {
      const p = m.base, dd = Math.hypot(p.x - r.x, p.z - r.z);
      if (dd < bd && g.world.los(r.x, r.z, p.x, p.z)) { bd = dd; best = m; }
    }
    return best;
  }

  // A tall shape walks past outside a moonlit window: its shadow slides across the patch of moonlight.
  evWindow() {
    const g = this.game, m = this.nearMoon();
    if (!m) return () => true;
    const src = g.house.tx.cookie.image, C = this.cookieG, W = this.cookieC.width, H = this.cookieC.height;
    m.spot.map = this.cookieT;
    const dir = Math.random() < 0.5 ? 1 : -1, dur = 3.2;
    let creaked = false;
    return (t) => {
      const k = t / dur;
      C.globalCompositeOperation = 'copy';
      C.drawImage(src, 0, 0);
      C.globalCompositeOperation = 'source-over';
      if (k < 1) {
        // a long thin figure, stooped, head bowed under the eaves; it stops for a beat halfway
        const s = k < 0.42 ? k / 0.42 * 0.5 : k < 0.58 ? 0.5 : 0.5 + (k - 0.58) / 0.42 * 0.5;
        const x = dir > 0 ? -0.2 * W + s * 1.4 * W : 1.2 * W - s * 1.4 * W;
        const bob = Math.sin(t * 5) * H * 0.006;
        C.fillStyle = '#000';
        C.beginPath();
        C.ellipse(x + W * 0.02, H * 0.12 + bob, W * 0.045, H * 0.07, 0.3, 0, 7);   // head, cocked
        C.fill();
        C.beginPath();
        C.moveTo(x - W * 0.05, H * 1.05); C.lineTo(x - W * 0.035, H * 0.45); C.quadraticCurveTo(x - W * 0.05, H * 0.2, x, H * 0.17);
        C.quadraticCurveTo(x + W * 0.06, H * 0.2, x + W * 0.04, H * 0.45); C.lineTo(x + W * 0.06, H * 1.05); C.closePath();
        C.fill();
        C.strokeStyle = '#000'; C.lineWidth = W * 0.018; C.lineCap = 'round';   // arms, hanging past its knees
        for (const sd of [-1, 1]) { C.beginPath(); C.moveTo(x + sd * W * 0.04, H * 0.25); C.quadraticCurveTo(x + sd * W * 0.09, H * 0.6, x + sd * W * 0.07 + Math.sin(t * 5 + sd) * W * 0.01, H * 0.95); C.stroke(); }
        if (!creaked && k > 0.45) { creaked = true; g.audio.creak(m.spot.position.x, 0.2, m.spot.position.z, 0.7, 0.45); }
      }
      this.cookieT.needsUpdate = true;
      if (k >= 1) { m.spot.map = g.house.tx.cookie; return true; }
      return false;
    };
  }

  // The next scan (within a minute) shows someone standing in a far doorway. The scan after, nobody.
  evGhost() {
    this.ghostReady = true;
    const until = this.game.time + 60;
    return (t) => this.game.time > until || !this.ghostReady;
  }

  // Called by the LIDAR as it scans from `o`: the shape's body as spheres, or null.
  ghostSpheres(o) {
    if (!this.ghostReady || this.game.entity.state !== 'dormant') return null;
    const g = this.game, w = g.world;
    const r = g.roomba;
    const ahead = (s) => { const a = Math.atan2(-(s.x - o.x) * r.fz + (s.z - o.z) * r.fx, (s.x - o.x) * r.fx + (s.z - o.z) * r.fz); return Math.abs(a); };
    const spots = GHOST_SPOTS.map(([x, z]) => ({ x, z, d: Math.hypot(x - o.x, z - o.z) }))
      .filter((s) => s.d > 3.2 && s.d < 9 && w.navFree(s.x, s.z) && w.los(o.x, o.z, s.x, s.z))
      .sort((a, b) => (ahead(a) < 0.9 ? 0 : 10) - (ahead(b) < 0.9 ? 0 : 10) || Math.abs(a.d - 5.5) - Math.abs(b.d - 5.5));   // in view first, then about five metres off
    if (!spots.length) return null;
    this.ghostReady = false; this.ghostUsed = true;
    const s = spots[0], body = g.entity.body, root = body.root;
    const keep = { p: root.position.clone(), r: root.rotation.y, v: root.visible };
    root.position.set(s.x, 0, s.z);
    root.rotation.y = Math.atan2(o.x - s.x, o.z - s.z);
    body.resetPose();
    const out = body.scanSpheres().map((q) => ({ ...q, ghost: true }));
    root.position.copy(keep.p); root.rotation.y = keep.r; root.visible = keep.v;
    root.updateMatrixWorld(true);
    setTimeout(() => { if (g.state === 'playing') g.hud.log('LIDAR: unclassified shape'); }, 700);
    return out;
  }

}
