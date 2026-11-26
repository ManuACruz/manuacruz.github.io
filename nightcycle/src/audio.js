// All sound is synthesised with Web Audio. Nothing is loaded.

const MELODY = [  // the music box: an original little tune in A minor, slightly out of tune
  [69, 1], [72, 1], [76, 2], [74, 1], [72, 1], [71, 2], [69, 1], [71, 1], [72, 1], [67, 1], [69, 3], [0, 1],
  [76, 1], [77, 1], [76, 1], [74, 1], [72, 2], [71, 1], [72, 1], [74, 2], [64, 1], [68, 1], [69, 3], [0, 1],
];
const midi = (n) => 440 * Math.pow(2, (n - 69) / 12);

export class Audio {
  constructor(game) {
    this.game = game;
    this.ctx = null;
    this.loops = {};
    this.mb = null;
  }

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.game.settings.volume;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 6;
    this.master.connect(comp).connect(ctx.destination);
    this.sfx = ctx.createGain(); this.sfx.connect(this.master);
    this.amb = ctx.createGain(); this.amb.connect(this.master);
    this.verb = ctx.createConvolver();
    this.verb.buffer = this.impulse(1.9);
    this.verbIn = ctx.createGain(); this.verbIn.gain.value = 0.3;
    this.verbIn.connect(this.verb).connect(this.master);

    const sr = ctx.sampleRate;
    this.white = this.noiseBuffer(2, (r) => r * 2 - 1);
    let last = 0;
    this.brown = this.noiseBuffer(4, (r) => { last = (last + 0.02 * (r * 2 - 1)) / 1.02; return last * 3.5; });
    this.sr = sr;
    this.startMotor();
    this.startAmbience();
  }

  setVolume(v) { if (this.master) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05); }

  noiseBuffer(sec, fn) {
    const b = this.ctx.createBuffer(1, this.ctx.sampleRate * sec, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = fn(Math.random());
    return b;
  }

  impulse(sec) {
    const ctx = this.ctx, n = ctx.sampleRate * sec, b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      let lp = 0;
      for (let i = 0; i < n; i++) { lp += 0.35 * ((Math.random() * 2 - 1) - lp); d[i] = lp * Math.pow(1 - i / n, 3); }
    }
    return b;
  }

  // ---------- building blocks ----------

  now() { return this.ctx.currentTime; }
  gain(v = 0) { const g = this.ctx.createGain(); g.gain.value = v; return g; }
  osc(type, f) { const o = this.ctx.createOscillator(); o.type = type; o.frequency.value = f; return o; }
  filter(type, f, q = 1) { const b = this.ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  noise(buf = this.white, loop = false) { const s = this.ctx.createBufferSource(); s.buffer = buf; s.loop = loop; if (!loop) s.loopStart = 0; return s; }

  env(g, t, a, peak, d, hold = 0) {
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.setValueAtTime(peak, t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + d);
  }

  // A point in the house. Sound behind a wall is muffled.
  spot(x, y, z, { verb = 0.5, occlude = true, roll = 1.2 } = {}) {
    const ctx = this.ctx, p = ctx.createPanner();
    p.panningModel = 'HRTF'; p.distanceModel = 'inverse';
    p.refDistance = 0.8; p.rolloffFactor = roll; p.maxDistance = 40;
    if (p.positionX) { p.positionX.value = x; p.positionY.value = y; p.positionZ.value = z; } else p.setPosition(x, y, z);
    p.connect(this.sfx);
    const send = this.gain(verb); p.connect(send); send.connect(this.verbIn);
    let input = p;
    if (occlude) {
      const L = this.listener || [0, 0];
      if (!this.game.world.los(L[0], L[1], x, z)) { const f = this.filter('lowpass', 650, 0.5); f.connect(p); input = f; }
    }
    return input;
  }

  // ---------- the robot ----------

  startMotor() {
    const m = {};
    const n = this.noise(this.brown, true), bp = this.filter('bandpass', 210, 0.8);
    m.drive = this.gain(0); n.connect(bp).connect(m.drive).connect(this.sfx); n.start();
    const o = this.osc('sawtooth', 92), lp = this.filter('lowpass', 320);
    m.hum = this.gain(0); o.connect(lp).connect(m.hum).connect(this.sfx); o.start();
    m.osc = o;
    const s = this.noise(this.white, true), sbp = this.filter('bandpass', 1900, 0.7);
    m.suck = this.gain(0); s.connect(sbp).connect(m.suck).connect(this.sfx); s.start();
    const w = this.osc('sine', 1240);
    const vib = this.osc('sine', 5), vg = this.gain(6); vib.connect(vg).connect(w.frequency); vib.start();
    m.whine = this.gain(0); w.connect(m.whine).connect(this.sfx); w.start();
    this.motor = m;
  }

  startAmbience() {
    const a = {};
    for (const f of [43.6, 44.15]) { const o = this.osc('sine', f), g = this.gain(0.05); o.connect(g).connect(this.amb); o.start(); }
    const n = this.noise(this.brown, true), lp = this.filter('lowpass', 170);
    const g = this.gain(0.05); n.connect(lp).connect(g).connect(this.amb); n.start();
    // tension: a high dissonant pair that swells when the thing is near
    a.tension = this.gain(0);
    for (const f of [622, 659.3, 311]) {
      const o = this.osc(f > 400 ? 'sine' : 'triangle', f);
      const trem = this.osc('sine', 6 + Math.random() * 2), tg = this.gain(0.4);
      const og = this.gain(0.5);
      trem.connect(tg).connect(og.gain);
      o.connect(og).connect(a.tension);
      o.start(); trem.start();
    }
    a.tension.connect(this.amb);
    // its breathing, which follows it around
    const bn = this.noise(this.white, true), bbp = this.filter('bandpass', 650, 0.9);
    a.breath = this.gain(0);
    a.breathPan = this.ctx.createPanner();
    a.breathPan.panningModel = 'HRTF'; a.breathPan.refDistance = 0.6; a.breathPan.rolloffFactor = 1.6;
    bn.connect(bbp).connect(a.breath).connect(a.breathPan).connect(this.sfx);
    bn.start();
    this.ambience = a;
    this.nextCreak = 4;
  }

  update(dt) {
    if (!this.ctx) return;
    const g = this.game, ctx = this.ctx, t = ctx.currentTime;
    const cam = g.camera, L = ctx.listener;
    const p = cam.getWorldPosition(this._v || (this._v = cam.position.clone()));
    const f = cam.getWorldDirection(this._f || (this._f = cam.position.clone()));
    this.listener = [p.x, p.z];
    if (L.positionX) {
      L.positionX.value = p.x; L.positionY.value = p.y; L.positionZ.value = p.z;
      L.forwardX.value = f.x; L.forwardY.value = f.y; L.forwardZ.value = f.z;
      L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0;
    } else { L.setPosition(p.x, p.y, p.z); L.setOrientation(f.x, f.y, f.z, 0, 1, 0); }

    // motor
    const r = g.roomba, m = this.motor;
    const live = g.state === 'playing' || g.state === 'cutscene';
    const on = live && !r.dead;
    const sp = Math.min(1, Math.abs(r.v) / 1.3 + Math.abs(r.w) * 0.15);
    const sucking = on && r.suction && r.bin < 100;
    // A hush: the motor and the house drop away for a moment when you first lay eyes on it.
    const hush = this.hushUntil && t < this.hushUntil ? 0.06 : 1;
    const floor = r.floorNoise ?? 1;
    m.drive.gain.setTargetAtTime(on ? (0.05 + sp * 0.22) * hush * (0.6 + 0.4 * floor) : 0, t, hush < 1 ? 0.05 : 0.08);
    m.hum.gain.setTargetAtTime(on ? (0.012 + sp * 0.03) * hush : 0, t, 0.08);
    m.osc.frequency.setTargetAtTime(80 + sp * 40, t, 0.1);
    m.suck.gain.setTargetAtTime(sucking ? 0.05 * hush : 0, t, 0.15);
    m.whine.gain.setTargetAtTime(sucking ? 0.006 * hush : 0, t, 0.15);
    this.amb.gain.setTargetAtTime(hush, t, hush < 1 ? 0.05 : 0.6);
    // grit rattling up the intake
    if (sucking && r.dirtRate > 3 && Math.random() < dt * Math.min(40, r.dirtRate * 0.6)) {
      const n = this.noise(), hp = this.filter('highpass', 2500 + Math.random() * 3000), gg = this.gain();
      n.connect(hp).connect(gg).connect(this.sfx);
      this.env(gg, t, 0.001, 0.025 + Math.random() * 0.03, 0.012);
      n.start(t, Math.random()); n.stop(t + 0.03);
    }

    // ambience
    const e = g.entity, a = this.ambience;
    const near = e.root.visible && e.state !== 'dormant' ? Math.max(0, 1 - (e.dist ?? Math.hypot(e.x - r.x, e.z - r.z)) / 9) : 0;
    const chase = e.state === 'chase' ? 1 : 0;
    a.tension.gain.setTargetAtTime(live ? near * 0.05 + chase * 0.05 : 0, t, 0.4);
    if (e.root.visible && live) {
      const hp = e.j.head.getWorldPosition(this._h || (this._h = cam.position.clone()));
      const bp = a.breathPan;
      if (bp.positionX) { bp.positionX.value = hp.x; bp.positionY.value = hp.y; bp.positionZ.value = hp.z; } else bp.setPosition(hp.x, hp.y, hp.z);
      const cyc = (t * (chase ? 0.9 : 0.45)) % 1;
      const shape = cyc < 0.4 ? Math.sin((cyc / 0.4) * Math.PI) * 0.6 : Math.sin(((cyc - 0.4) / 0.6) * Math.PI);
      a.breath.gain.setTargetAtTime(near > 0.4 ? shape * 0.18 * near : 0, t, 0.05);
    } else a.breath.gain.setTargetAtTime(0, t, 0.2);

    if (live) {
      this.nextCreak -= dt;
      if (this.nextCreak <= 0) {
        this.nextCreak = 7 + Math.random() * 14;
        const ang = Math.random() * Math.PI * 2, d = 3 + Math.random() * 4;
        this.creak(p.x + Math.cos(ang) * d, 2.3, p.z + Math.sin(ang) * d, 0.5 + Math.random() * 1.2, 0.5);
      }
    }
    // While suspended, currentTime is frozen: one-shot sounds scheduled now would all fire at once on resume.
    if (ctx.state !== 'running') return;
    this.updateMusicBox();
    if (live) this.updateClock(dt);
  }

  click(on) {
    if (!this.ctx) return;
    const t = this.now(), o = this.osc('square', on ? 1400 : 900), g = this.gain();
    o.connect(g).connect(this.sfx); this.env(g, t, 0.003, 0.05, 0.05); o.start(t); o.stop(t + 0.1);
  }
  deny() {
    if (!this.ctx) return;
    const t = this.now();
    for (const k of [0, 0.12]) { const o = this.osc('square', 180), g = this.gain(); o.connect(g).connect(this.sfx); this.env(g, t + k, 0.005, 0.06, 0.08); o.start(t + k); o.stop(t + k + 0.12); }
  }
  tones(notes, type = 'square', vol = 0.06, step = 0.11, dest = this.sfx) {
    if (!this.ctx) return;
    const t = this.now();
    notes.forEach((n, i) => {
      if (!n) return;
      const o = this.osc(type, midi(n)), g = this.gain();
      o.connect(g).connect(dest);
      this.env(g, t + i * step, 0.005, vol, step * 1.4);
      o.start(t + i * step); o.stop(t + i * step + step * 1.6);
    });
  }
  startJingle() { this.tones([72, 76, 79, 84], 'square', 0.05); }
  completeJingle() { this.tones([79, 84, 88, 91, 0, 96], 'square', 0.05, 0.12); }
  dock() { this.tones([79, 84], 'square', 0.05, 0.1); }
  undock() { this.tones([84, 79], 'square', 0.03, 0.08); }
  error() { this.tones([64, 60], 'square', 0.06, 0.18); }
  lowBattery() { this.tones([93, 0, 93, 0, 93], 'square', 0.04, 0.09); }
  chime() { this.tones([84, 91], 'sine', 0.08, 0.13); }
  beep(v = 1) { this.tones([81], 'square', 0.03 * v, 0.04); }

  ping() {
    if (!this.ctx) return;
    const t = this.now(), o = this.osc('sine', 2300), g = this.gain();
    o.frequency.exponentialRampToValueAtTime(1000, t + 0.35);
    const dl = this.ctx.createDelay(1); dl.delayTime.value = 0.21;
    const fb = this.gain(0.35);
    o.connect(g); g.connect(this.sfx); g.connect(dl); dl.connect(fb).connect(dl); dl.connect(this.sfx);
    this.env(g, t, 0.005, 0.07, 0.4);
    o.start(t); o.stop(t + 2);
    const n = this.noise(), bp = this.filter('bandpass', 600, 3), ng = this.gain();
    bp.frequency.exponentialRampToValueAtTime(3000, t + 0.5);
    n.connect(bp).connect(ng).connect(this.sfx);
    this.env(ng, t, 0.1, 0.05, 0.4);
    n.start(t); n.stop(t + 0.7);
  }

  bump(hard = 1) {
    if (!this.ctx) return;
    const t = this.now(), o = this.osc('sine', 170), g = this.gain();
    o.frequency.exponentialRampToValueAtTime(45, t + 0.1);
    o.connect(g).connect(this.sfx);
    this.env(g, t, 0.002, 0.5 * hard + 0.1, 0.12);
    o.start(t); o.stop(t + 0.2);
    const n = this.noise(), hp = this.filter('highpass', 2500), ng = this.gain();
    n.connect(hp).connect(ng).connect(this.sfx);
    this.env(ng, t, 0.001, 0.12 * hard + 0.03, 0.03);
    n.start(t); n.stop(t + 0.06);
  }

  pickup(s = 1) {
    if (!this.ctx) return;
    const t = this.now(), n = this.noise(), bp = this.filter('bandpass', 400, 2), g = this.gain();
    bp.frequency.exponentialRampToValueAtTime(3200, t + 0.14);
    n.connect(bp).connect(g).connect(this.sfx);
    this.env(g, t, 0.01, 0.12 * s, 0.12);
    n.start(t); n.stop(t + 0.3);
    for (let k = 0; k < 3; k++) {
      const tt = t + 0.06 + Math.random() * 0.15, o = this.osc('square', 2000 + Math.random() * 2500), og = this.gain();
      o.connect(og).connect(this.sfx);
      this.env(og, tt, 0.001, 0.025 * s, 0.015);
      o.start(tt); o.stop(tt + 0.03);
    }
  }

  hush(secs = 1.5) { if (this.ctx) this.hushUntil = this.now() + secs; }

  // Sounds the caption log can describe.
  cap(label, x, z) { this.game.onSound?.(label, x, z); }

  footstep(x, z, loud = 1) {
    this.cap('footsteps', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, 0.05, z, { verb: 0.6, roll: 0.9 });
    const o = this.osc('sine', 78), g = this.gain();
    o.frequency.exponentialRampToValueAtTime(36, t + 0.2);
    o.connect(g).connect(dest);
    this.env(g, t, 0.004, 0.9 * loud, 0.25);
    o.start(t); o.stop(t + 0.35);
    const n = this.noise(), lp = this.filter('lowpass', 700), ng = this.gain();
    n.connect(lp).connect(ng).connect(dest);
    this.env(ng, t, 0.002, 0.35 * loud, 0.08);
    n.start(t); n.stop(t + 0.15);
    if (Math.random() < 0.3) this.creak(x, 0.05, z, 0.35, 0.5 * loud);
  }

  creak(x, y, z, dur = 0.8, vol = 0.6) {
    if (vol > 0.4) this.cap('creak', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, y, z, { verb: 0.7 });
    const o = this.osc('sawtooth', 200), bp = this.filter('bandpass', 900 + Math.random() * 500, 14), g = this.gain();
    const curve = new Float32Array(12).map(() => 140 + Math.random() * 140);
    o.frequency.setValueCurveAtTime(curve, t, dur);
    o.connect(bp).connect(g).connect(dest);
    this.env(g, t, dur * 0.2, vol, dur * 0.8, dur * 0.2);
    o.start(t); o.stop(t + dur * 1.3);
  }

  doorCreak(x, z, dur = 2.4) {
    this.cap('door creaks', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, 1, z, { verb: 0.8, occlude: false });
    for (const base of [190, 285]) {
      const o = this.osc('sawtooth', base), bp = this.filter('bandpass', base * 4, 10), g = this.gain();
      const curve = new Float32Array(24).map((_, i) => base * (1 + 0.35 * Math.sin(i * 0.7 + Math.random()) - i * 0.01));
      o.frequency.setValueCurveAtTime(curve, t, dur);
      o.connect(bp).connect(g).connect(dest);
      this.env(g, t, 0.3, 0.5, dur * 0.6, dur * 0.3);
      o.start(t); o.stop(t + dur + 0.5);
    }
  }

  doorSlam(x, z, vol = 1, caption = true) {
    if (caption) this.cap('door slams', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, 1, z, { verb: 1 });
    const o = this.osc('sine', 90), g = this.gain();
    o.frequency.exponentialRampToValueAtTime(40, t + 0.25);
    o.connect(g).connect(dest);
    this.env(g, t, 0.002, 1.2 * vol, 0.35);
    o.start(t); o.stop(t + 0.5);
    const n = this.noise(), lp = this.filter('lowpass', 900), ng = this.gain();
    n.connect(lp).connect(ng).connect(dest);
    this.env(ng, t, 0.002, 0.6 * vol, 0.25);
    n.start(t); n.stop(t + 0.4);
  }

  knock(x, z, n = 3, gap = 380, vol = 0.45) {
    this.cap('knocking', x, z);
    if (!this.ctx) return;
    for (let k = 0; k < n; k++) setTimeout(() => this.doorSlam(x, z, vol, false), k * gap + Math.random() * 60);
  }

  // Its neck: a quick run of wet cracks as the head snaps round.
  crack(x, y, z) {
    this.cap('a crack', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, y, z, { verb: 0.5, roll: 0.8 });
    for (let k = 0; k < 4; k++) {
      const tt = t + k * (0.025 + Math.random() * 0.02);
      const n = this.noise(), bp = this.filter('bandpass', 900 + Math.random() * 1600, 4), g = this.gain();
      n.connect(bp).connect(g).connect(dest);
      this.env(g, tt, 0.001, 0.9 - k * 0.15, 0.025);
      n.start(tt, Math.random()); n.stop(tt + 0.05);
    }
    const o = this.osc('sine', 140), og = this.gain();
    o.frequency.exponentialRampToValueAtTime(60, t + 0.08);
    o.connect(og).connect(dest);
    this.env(og, t, 0.002, 0.5, 0.08);
    o.start(t); o.stop(t + 0.12);
  }

  // A long breath out. It has lost you (or given up for now).
  huff(x, y, z, v = 1) {
    this.cap('a long breath out', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, y, z, { verb: 0.7, roll: 0.9 });
    const n = this.noise(this.white, true), bp = this.filter('bandpass', 520, 0.8), g = this.gain();
    bp.frequency.setValueAtTime(700, t); bp.frequency.exponentialRampToValueAtTime(300, t + 1.6);
    n.connect(bp).connect(g).connect(dest);
    this.env(g, t, 0.25, 0.45 * v, 1.4, 0.2);
    n.start(t); n.stop(t + 2.1);
    const o = this.osc('sawtooth', 62), lp = this.filter('lowpass', 180), og = this.gain();
    o.connect(lp).connect(og).connect(dest);
    this.env(og, t, 0.3, 0.12 * v, 1.2);
    o.start(t); o.stop(t + 1.8);
  }

  // Fingernails dragging on the floor.
  scrape(x, z, v = 1) {
    this.cap('scratching on the floor', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, 0.02, z, { verb: 0.3, roll: 1 });
    const n = this.noise(), bp = this.filter('bandpass', 2600 + Math.random() * 1500, 6), g = this.gain();
    bp.frequency.exponentialRampToValueAtTime(1500, t + 0.09);
    n.connect(bp).connect(g).connect(dest);
    this.env(g, t, 0.005, 0.35 * v, 0.08);
    n.start(t, Math.random()); n.stop(t + 0.12);
  }

  // Dog food going up the intake.
  crunch(v = 1) {
    if (!this.ctx) return;
    const t = this.now();
    for (let k = 0; k < 5; k++) {
      const tt = t + Math.random() * 0.12;
      const n = this.noise(), bp = this.filter('bandpass', 1800 + Math.random() * 2500, 3), g = this.gain();
      n.connect(bp).connect(g).connect(this.sfx);
      this.env(g, tt, 0.001, 0.22 * v, 0.03);
      n.start(tt, Math.random()); n.stop(tt + 0.05);
    }
    const o = this.osc('sine', 110), og = this.gain();
    o.connect(og).connect(this.sfx);
    this.env(og, t, 0.002, 0.18 * v, 0.06);
    o.start(t); o.stop(t + 0.1);
  }

  // Something eating dog food, somewhere in the house (Night 5: at its bowl).
  crunchAt(x, z, v = 1) {
    this.cap('something eating', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, 1.1, z, { verb: 0.5 });
    for (let k = 0; k < 4; k++) {
      const tt = t + k * 0.11 + Math.random() * 0.05;
      const n = this.noise(), bp = this.filter('bandpass', 900 + Math.random() * 1400, 2.5), g = this.gain();
      n.connect(bp).connect(g).connect(dest);
      this.env(g, tt, 0.002, 0.3 * v, 0.06);
      n.start(tt, Math.random()); n.stop(tt + 0.09);
    }
  }

  // A plug pulled out of a wall socket: a snap and a tiny spark.
  unplug(x, y, z) {
    this.cap('a plug pulled out', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, y, z, { verb: 0.35 });
    const n = this.noise(), hp = this.filter('highpass', 2500), g = this.gain();
    n.connect(hp).connect(g).connect(dest);
    this.env(g, t, 0.001, 0.5, 0.025);
    n.start(t, Math.random()); n.stop(t + 0.05);
    const o = this.osc('square', 60), og = this.gain();
    o.connect(og).connect(dest);
    this.env(og, t + 0.01, 0.001, 0.08, 0.12);
    o.start(t); o.stop(t + 0.2);
  }

  // A wall switch flicked, and the hum of a bulb coming on.
  lightSwitch(x, y, z) {
    this.cap('a light switch', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, y, z, { verb: 0.4 });
    const n = this.noise(), bp = this.filter('bandpass', 3500, 4), g = this.gain();
    n.connect(bp).connect(g).connect(dest);
    this.env(g, t, 0.001, 0.45, 0.02);
    n.start(t, Math.random()); n.stop(t + 0.04);
    const o = this.osc('sawtooth', 100), lp = this.filter('lowpass', 400), og = this.gain();
    o.connect(lp).connect(og).connect(dest);
    this.env(og, t + 0.02, 0.05, 0.03, 0.6, 0.3);
    o.start(t); o.stop(t + 1.1);
  }

  // A nightlight shorting out.
  pop(x, y, z) {
    this.cap('a light shorting out', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, y, z, { verb: 0.4 });
    const o = this.osc('square', 118), g = this.gain();
    o.connect(g).connect(dest);
    this.env(g, t, 0.002, 0.12, 0.25, 0.15);
    o.start(t); o.stop(t + 0.5);
    const n = this.noise(), hp = this.filter('highpass', 3000), ng = this.gain();
    n.connect(hp).connect(ng).connect(dest);
    this.env(ng, t + 0.3, 0.001, 0.3, 0.04);
    n.start(t + 0.3); n.stop(t + 0.4);
  }

  wind(x, z, dur = 4) {
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, 1, z, { verb: 0.5, occlude: false });
    const n = this.noise(this.white, true), bp = this.filter('bandpass', 350, 0.6), g = this.gain();
    bp.frequency.setValueCurveAtTime(new Float32Array([300, 700, 450, 900, 400, 300]), t, dur);
    n.connect(bp).connect(g).connect(dest);
    this.env(g, t, dur * 0.3, 0.35, dur * 0.6, dur * 0.1);
    n.start(t); n.stop(t + dur + 0.2);
  }

  // A locked door's handle tried from the other side: a fast metallic chatter.
  rattle(x, z, dur = 1.1) {
    this.cap('a door handle rattles', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, 1, z, { verb: 0.6 });
    for (let tt = 0; tt < dur; tt += 0.045 + Math.random() * 0.05) {
      const n = this.noise(), bp = this.filter('bandpass', 2200 + Math.random() * 1800, 9), g = this.gain();
      n.connect(bp).connect(g).connect(dest);
      this.env(g, t + tt, 0.001, 0.22 + Math.random() * 0.2, 0.03);
      n.start(t + tt, Math.random()); n.stop(t + tt + 0.05);
      if (Math.random() < 0.3) {
        const o = this.osc('sine', 120), og = this.gain();
        o.connect(og).connect(dest);
        this.env(og, t + tt, 0.002, 0.25, 0.05);
        o.start(t + tt); o.stop(t + tt + 0.08);
      }
    }
  }

  // Something heavy dropping in the roof space.
  thump(x, y, z, v = 1) {
    this.cap('a thump overhead', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, y, z, { verb: 0.9, occlude: false });
    const o = this.osc('sine', 62), g = this.gain(), lp = this.filter('lowpass', 260);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.35);
    o.connect(lp).connect(g).connect(dest);
    this.env(g, t, 0.004, 1.3 * v, 0.45);
    o.start(t); o.stop(t + 0.6);
    const n = this.noise(this.brown), ng = this.gain();
    n.connect(ng).connect(dest);
    this.env(ng, t, 0.003, 0.7 * v, 0.3);
    n.start(t); n.stop(t + 0.5);
  }

  // Furniture dragged slowly across a floor, far off.
  drag(x, z, dur = 2.2) {
    this.cap('something heavy dragged', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, 0.2, z, { verb: 0.8 });
    const n = this.noise(this.brown, true), bp = this.filter('bandpass', 320, 2.5), g = this.gain();
    const am = this.osc('sawtooth', 23), ag = this.gain(0.5);
    am.connect(ag).connect(g.gain);
    n.connect(bp).connect(g).connect(dest);
    bp.frequency.setValueCurveAtTime(new Float32Array([260, 340, 300, 380, 280, 330]), t, dur);
    this.env(g, t, 0.15, 0.9, dur * 0.4, dur * 0.5);
    n.start(t); am.start(t); n.stop(t + dur + 0.2); am.stop(t + dur + 0.2);
  }

  // A low pressure throb in the robot's own housing as the danger climbs. Not positional.
  pulse(v = 1) {
    if (!this.ctx) return;
    const t = this.now(), o = this.osc('sine', 52), g = this.gain(), lp = this.filter('lowpass', 140);
    o.frequency.exponentialRampToValueAtTime(34, t + 0.16);
    o.connect(lp).connect(g).connect(this.sfx);
    this.env(g, t, 0.006, 0.55 * v, 0.18);
    o.start(t); o.stop(t + 0.3);
  }

  // Mains buzz from a light that is about to go.
  buzz(x, y, z, dur = 1.2, v = 1) {
    this.cap('electrical buzzing', x, z);
    if (!this.ctx) return;
    const t = this.now(), dest = this.spot(x, y, z, { verb: 0.3 });
    const o = this.osc('sawtooth', 100), bp = this.filter('bandpass', 600, 2), g = this.gain();
    o.connect(bp).connect(g).connect(dest);
    const curve = new Float32Array(24).map(() => (Math.random() < 0.35 ? 0.0001 : 0.06 * v));
    g.gain.setValueCurveAtTime(curve, t, dur);
    o.start(t); o.stop(t + dur + 0.05);
  }

  // Interference crackle on the robot's audio as the thing gets close.
  crackle(v = 1) {
    if (!this.ctx) return;
    const t = this.now();
    for (let k = 0; k < 3; k++) {
      const tt = t + Math.random() * 0.06;
      const n = this.noise(), hp = this.filter('highpass', 1500 + Math.random() * 4000), g = this.gain();
      n.connect(hp).connect(g).connect(this.sfx);
      this.env(g, tt, 0.001, 0.05 * v, 0.02 + Math.random() * 0.04);
      n.start(tt, Math.random()); n.stop(tt + 0.08);
    }
  }

  stinger() {
    if (!this.ctx) return;
    const t = this.now(), lp = this.filter('lowpass', 500), g = this.gain();
    lp.connect(g).connect(this.sfx);
    lp.frequency.exponentialRampToValueAtTime(2500, t + 0.5);
    for (const f of [55, 58.27, 77.8, 110.3]) { const o = this.osc('sawtooth', f); o.connect(lp); o.start(t); o.stop(t + 3.5); }
    this.env(g, t, 0.35, 0.22, 2.8);
    const s = this.osc('sine', 1760), sg = this.gain(), vib = this.osc('sine', 9), vg = this.gain(40);
    vib.connect(vg).connect(s.frequency);
    s.connect(sg).connect(this.sfx); sg.connect(this.verbIn);
    this.env(sg, t, 0.2, 0.025, 2.2);
    s.start(t); vib.start(t); s.stop(t + 2.6); vib.stop(t + 2.6);
  }

  scream() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = this.now();
    const shaper = ctx.createWaveShaper();
    const c = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) { const x = i / 512 - 1; c[i] = Math.tanh(x * 6); }
    shaper.curve = c;
    const g = this.gain();
    shaper.connect(g).connect(this.master);
    g.connect(this.verbIn);
    for (const f of [186, 233, 247, 311, 370, 466]) {
      const o = this.osc('sawtooth', f * (0.98 + Math.random() * 0.04));
      o.frequency.exponentialRampToValueAtTime(f * 0.6, t + 1.4);
      o.connect(shaper); o.start(t); o.stop(t + 1.6);
    }
    const n = this.noise(), ng = this.gain(0.8);
    n.connect(ng).connect(shaper); n.start(t); n.stop(t + 1.5);
    this.env(g, t, 0.01, 0.7, 1.3, 0.2);
    const s = this.osc('sine', 2200), sg = this.gain(), vib = this.osc('sine', 13), vg = this.gain(180);
    vib.connect(vg).connect(s.frequency);
    s.frequency.linearRampToValueAtTime(3200, t + 1);
    s.connect(sg).connect(this.master);
    this.env(sg, t, 0.02, 0.18, 1.2);
    s.start(t); vib.start(t); s.stop(t + 1.5); vib.stop(t + 1.5);
  }

  powerDown() {
    if (!this.ctx) return;
    const t = this.now(), o = this.osc('sawtooth', 300), lp = this.filter('lowpass', 1200), g = this.gain();
    o.frequency.exponentialRampToValueAtTime(30, t + 1.5);
    o.connect(lp).connect(g).connect(this.sfx);
    this.env(g, t, 0.01, 0.08, 1.5);
    o.start(t); o.stop(t + 1.7);
    this.tones([84, 79, 76, 72], 'square', 0.04, 0.22);
  }

  // ---------- things in the house ----------

  loop(key, on, make) {
    if (!this.ctx) return;
    const cur = this.loops[key];
    if (on && !cur) this.loops[key] = make();
    if (!on && cur) {
      const t = this.now();
      cur.gain.gain.setTargetAtTime(0, t, 0.05);
      setTimeout(() => cur.stop(), 400);
      delete this.loops[key];
    }
  }

  tvStatic(on, pos) {
    this.loop('tv', on, () => {
      const n = this.noise(this.white, true), hp = this.filter('highpass', 1400), g = this.gain(0.22);
      n.connect(hp).connect(g).connect(this.spot(...pos, { verb: 0.4 }));
      n.start();
      return { gain: g, stop: () => n.stop() };
    });
  }

  fridgeHum(on, pos) {
    this.loop('fridge', on, () => {
      const o = this.osc('sawtooth', 59), o2 = this.osc('sine', 120), lp = this.filter('lowpass', 260), g = this.gain(0.12);
      o.connect(lp); o2.connect(lp); lp.connect(g).connect(this.spot(...pos, { verb: 0.3 }));
      o.start(); o2.start();
      return { gain: g, stop: () => { o.stop(); o2.stop(); } };
    });
  }

  musicBox(on, pos) {
    if (on && !this.mb) this.cap('a music box', pos[0], pos[2]);
    if (!this.ctx) return;

    if (on && !this.mb) this.mb = { pos, idx: 0, next: this.now() + 0.2, rate: 0.42, slow: false };
    if (!on) this.mb = null;
  }
  windDown() { if (this.mb) this.mb.slow = true; }

  updateMusicBox() {
    const mb = this.mb;
    if (!mb) return;
    const t = this.now();
    while (mb.next < t + 0.3) {
      const [n, len] = MELODY[mb.idx % MELODY.length];
      if (n) {
        const dest = this.spot(...mb.pos, { verb: 0.9 });
        const detune = mb.slow ? 1 - Math.min(0.06, mb.idx * 0.0015) : 1;
        for (const [mul, type, vol] of [[1, 'sine', 0.16], [2.003, 'triangle', 0.05], [4.01, 'sine', 0.02]]) {
          const o = this.osc(type, midi(n) * mul * detune), g = this.gain();
          o.connect(g).connect(dest);
          this.env(g, mb.next, 0.004, vol, 1.1);
          o.start(mb.next); o.stop(mb.next + 1.3);
        }
      }
      mb.next += mb.rate * len;
      mb.idx++;
      if (mb.slow) mb.rate *= 1.06;
      if (mb.rate > 1.6) { this.mb = null; return; }
    }
  }

  clock(on, pos) { this.clockOn = on; this.clockPos = pos; this.tick = this.tick ?? 0; }
  updateClock(dt) {
    if (!this.clockOn || !this.ctx) return;
    this.tick -= dt;
    if (this.tick > 0) return;
    this.tick = 1;
    this.tock = !this.tock;
    const t = this.now(), dest = this.spot(...this.clockPos, { verb: 0.4 });
    const n = this.noise(), bp = this.filter('bandpass', this.tock ? 2600 : 1900, 6), g = this.gain();
    n.connect(bp).connect(g).connect(dest);
    this.env(g, t, 0.001, 0.5, 0.03);
    n.start(t); n.stop(t + 0.06);
  }

  // ---------- voice ----------

  say(text) {
    if (!this.game.settings.voice || !window.speechSynthesis) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      u.voice = voices.find((v) => /en[-_]US/i.test(v.lang) && /zira|female|samantha|google us/i.test(v.name)) || voices.find((v) => /^en/i.test(v.lang)) || null;
      u.pitch = 0.65; u.rate = 0.92; u.volume = 0.8 * this.game.settings.volume;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch { /* no voice available */ }
  }
}
