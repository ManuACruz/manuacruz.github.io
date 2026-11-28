// Sound for Chimpún. Everything is synthesised, there are no audio files.
//
// One clock drives every figure, so whatever is on the mats plays in time. A bar has 16 steps
// and the song walks an eight-bar chord loop for ever. A pattern is a 16-character string:
// for tuned voices a digit starts a note, '-' holds it and '.' is a rest. A digit is not a
// pitch but a place in the current chord's five-note scale (0 root, 2 third, 3 fifth,
// 5 the root an octave up), so every pattern fits every chord and nothing can sound wrong.
// Each figure has one pattern set per mat: 0 sun (plain), 1 flower (bouncy), 2 cloud (high,
// slow, with echo), 3 leaf (fast).

export const BPM = 100;
const SD = 60 / BPM / 4; // one step, in seconds
const SWING = 0.12;      // off-beat steps arrive this fraction of a step late
const LOOK = 0.13;       // how far ahead notes are handed to the audio clock

const PROG = [
  { mel: 60, bass: 48, min: false }, // C
  { mel: 57, bass: 45, min: true },  // Am
  { mel: 53, bass: 41, min: false }, // F
  { mel: 55, bass: 43, min: false }, // G
  { mel: 60, bass: 48, min: false }, // C
  { mel: 57, bass: 45, min: true },  // Am
  { mel: 62, bass: 50, min: true },  // Dm
  { mel: 55, bass: 43, min: false }, // G
];
const MAJ = [0, 2, 4, 7, 9];
const MIN = [0, 2, 3, 7, 10];
const degToMidi = (root, min, deg) => {
  const o = Math.floor(deg / 5);
  return root + (min ? MIN : MAJ)[deg - o * 5] + 12 * o;
};
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function parse(str) {
  if (str.length !== 16) console.warn('pattern is not 16 steps:', str);
  const at = new Array(16).fill(null);
  const hold = new Array(16).fill(null);
  for (let i = 0; i < 16; i++) {
    const c = str[i];
    if (c >= '0' && c <= '9') {
      let len = 1;
      while (i + len < 16 && str[i + len] === '-') len++;
      const n = { step: i, deg: +c, len };
      at[i] = n;
      for (let k = 1; k < len; k++) hold[i + k] = n;
    }
  }
  return { at, hold };
}
const tuned = (zones) => zones.map((bars) => bars.map(parse));

// k kick, s snare, c clap, t/T low/high tom, w woodblock
const DRUM = [
  ['k.......k.k.....', '....s.......s...'],
  ['k..k....k..k....', '....c.......c.c.'],
  ['t.....T...t.T...', '..w.....w.....w.'],
  ['k.k...k.k.k...k.', '....s.......s.ss', '..w...w...w...w.'],
];
// X/x loud/soft shake, j tambourine, g triangle
const SHAKER = [
  ['X.x.X.x.X.x.X.x.'],
  ['..j...j...j..jj.'],
  ['g.......g.....g.'],
  ['XxxxXxxxXxxxXxxx'],
];
const BASS = tuned([
  ['0-----..0---3---', '0-----..0---2-3-'],
  ['0..5..0...3.5...'],
  ['0.....3.....5...'],
  ['0.0.3.3.5.5.3.2.', '0.0.3.3.5.3.2.1.'],
]);
const MARIMBA = tuned([
  ['0.2.3.5.3.2.3.2.'],
  ['0..2..3.5..3..2.', '0..2..3.5..7..5.'],
  ['5.....3...7.....', '5.....8...7.....'],
  ['0235323502357532', '0235323575323532'],
]);
const FLUTE = tuned([
  ['2---3---5-------', '4---3---2-------', '2---3---5---4---', '3-------........'],
  ['5..3..2.5..3..2.', '3..2..0.2---....', '5..3..2.5..3..4.', '5-------........'],
  ['7-------5-------', '4-------5-------', '5-------7-------', '5---------------'],
  ['5.5.4.3.5.5.4.3.', '2323232-3---....', '5.5.4.3.5.7.5.4.', '3454345-5---....'],
]);
const PAD = tuned([
  ['0---------------'],
  ['..0...0...0...0.'],
  ['0---------------'],
  ['0..0..0.0..0..0.'],
]);

// Reverb amount per figure on the ordinary mats; the cloud mat adds more, plus echo.
const REV = { bear: 0.06, bunny: 0.1, frog: 0.05, cat: 0.2, bird: 0.24, elephant: 0.2 };
const IDS = Object.keys(REV);

export function createEngine(ctx, opts = {}) {
  const onNote = opts.onNote || (() => {});
  const sr = ctx.sampleRate;

  const master = ctx.createGain();
  master.gain.value = 0.78;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 14;
  comp.ratio.value = 5;
  comp.attack.value = 0.004;
  comp.release.value = 0.18;
  master.connect(comp);
  comp.connect(ctx.destination);

  const noiseBuf = ctx.createBuffer(1, sr * 2, sr);
  {
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  const gainNode = (v) => { const g = ctx.createGain(); g.gain.value = v; return g; };

  // Small room
  const conv = ctx.createConvolver();
  {
    const n = Math.floor(sr * 1.3);
    const ir = ctx.createBuffer(2, n, sr);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3) * Math.min(1, i / (sr * 0.004));
    }
    conv.buffer = ir;
  }
  const revIn = gainNode(1);
  const revOut = gainNode(0.6);
  revIn.connect(conv); conv.connect(revOut); revOut.connect(master);

  // Echo, three steps long
  const echoIn = gainNode(1);
  const delay = ctx.createDelay(1.5);
  delay.delayTime.value = SD * 3;
  const echoLp = ctx.createBiquadFilter();
  echoLp.type = 'lowpass'; echoLp.frequency.value = 2400;
  const echoFb = gainNode(0.36);
  const echoOut = gainNode(0.7);
  echoIn.connect(delay); delay.connect(echoLp); echoLp.connect(echoFb); echoFb.connect(delay);
  echoLp.connect(echoOut); echoOut.connect(master);

  function makeStrip(rev) {
    const input = gainNode(1);
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const post = pan || input;
    if (pan) input.connect(pan);
    const revSend = gainNode(rev);
    const echoSend = gainNode(0);
    post.connect(master);
    post.connect(revSend); revSend.connect(revIn);
    post.connect(echoSend); echoSend.connect(echoIn);
    return { input, pan, revSend, echoSend };
  }

  const voices = {};
  for (const id of IDS) voices[id] = { id, zone: -1, entered: false, seg: null, strip: makeStrip(REV[id]) };
  const free = makeStrip(0.25); // touches on the bare table, the closing chord

  // ---- building blocks ----
  function hit(dest, t, a, peak, d) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(Math.max(peak, 0.0002), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    g.connect(dest);
    return g;
  }
  function held(dest, t, a, peak, dur, rel, sus = 0.8) {
    const g = ctx.createGain();
    const d = Math.max(a + 0.01, dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.linearRampToValueAtTime(peak * sus, t + d);
    g.gain.linearRampToValueAtTime(0, t + d + rel);
    g.connect(dest);
    return g;
  }
  function osc(type, f, t, end, dest, glideTo = 0, glideTime = 0.05) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + glideTime);
    o.connect(dest);
    o.start(t);
    o.stop(end);
    return o;
  }
  function tone(dest, type, f, t, peak, d, a = 0.003, glideTo = 0, glideTime = 0.05) {
    return osc(type, f, t, t + a + d + 0.03, hit(dest, t, a, peak, d), glideTo, glideTime);
  }
  function noise(dest, t, peak, d, ftype, freq, q = 0.7, a = 0.002) {
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    s.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = ftype; f.frequency.value = freq; f.Q.value = q;
    s.connect(f); f.connect(hit(dest, t, a, peak, d));
    s.start(t, Math.random() * 1.5);
    s.stop(t + a + d + 0.03);
  }

  // ---- instruments ----
  function kick(d, t, v) {
    tone(d, 'sine', 175, t, 0.95 * v, 0.26, 0.002, 52, 0.11);
    tone(d, 'triangle', 240, t, 0.3 * v, 0.1, 0.002, 80, 0.07);
  }
  function snare(d, t, v) {
    noise(d, t, 0.42 * v, 0.14, 'bandpass', 2300, 0.7);
    tone(d, 'triangle', 215, t, 0.3 * v, 0.07, 0.002, 170, 0.05);
  }
  function clap(d, t, v) {
    noise(d, t, 0.3 * v, 0.02, 'bandpass', 1300, 1.2, 0.001);
    noise(d, t + 0.012, 0.3 * v, 0.02, 'bandpass', 1300, 1.2, 0.001);
    noise(d, t + 0.025, 0.4 * v, 0.12, 'bandpass', 1300, 1.2, 0.001);
  }
  function tom(d, t, v, f) {
    tone(d, 'sine', f * 1.5, t, 0.7 * v, 0.3, 0.003, f, 0.08);
    tone(d, 'triangle', f * 1.5, t, 0.18 * v, 0.12, 0.003, f, 0.08);
  }
  function wood(d, t, v) {
    tone(d, 'sine', 1050, t, 0.3 * v, 0.05, 0.001);
    tone(d, 'sine', 1580, t, 0.14 * v, 0.035, 0.001);
  }
  function shake(d, t, v, loud) {
    noise(d, t, (loud ? 0.5 : 0.3) * v, loud ? 0.07 : 0.04, 'highpass', 5500, 0.7, 0.008);
  }
  function tamb(d, t, v) {
    noise(d, t, 0.5 * v, 0.14, 'bandpass', 8500, 1.6, 0.003);
    noise(d, t, 0.22 * v, 0.05, 'highpass', 4000, 0.7, 0.003);
  }
  function triangle(d, t, v) {
    tone(d, 'sine', 3950, t, 0.17 * v, 1.3, 0.001);
    tone(d, 'sine', 5270, t, 0.085 * v, 0.9, 0.001);
    tone(d, 'sine', 7900, t, 0.04 * v, 0.45, 0.001);
  }
  // A plucked bass with a little upward croak at the start of each note.
  function bass(d, t, midi, dur, v, zone) {
    const hi = zone === 2;
    const f = mtof(midi + (hi ? 12 : 0));
    const pluck = hi || dur < 0.2;
    const tail = hi ? 0.34 : 0.22;
    const g = pluck ? hit(d, t, 0.006, 0.5 * v, tail) : held(d, t, 0.008, 0.26 * v, dur, 0.07, 0.6);
    const end = t + (pluck ? tail : dur + 0.08) + 0.05;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = hi ? 1500 : 750;
    lp.connect(g);
    osc('triangle', f * 1.1, t, end, g, f, 0.05);
    const sq = gainNode(0.24);
    sq.connect(lp);
    osc('square', f * 1.1, t, end, sq, f, 0.05);
  }
  function marimba(d, t, midi, v) {
    const f = mtof(midi);
    tone(d, 'sine', f, t, 0.4 * v, Math.min(0.75, 0.55 * Math.pow(330 / f, 0.4)), 0.003);
    tone(d, 'sine', f * 4, t, 0.13 * v, 0.08, 0.002);
  }
  function glock(d, t, midi, v) {
    const f = mtof(midi);
    tone(d, 'sine', f, t, 0.28 * v, 1.25, 0.002);
    tone(d, 'sine', f * 2.76, t, 0.1 * v, 0.5, 0.002);
    tone(d, 'sine', f * 5.4, t, 0.025 * v, 0.2, 0.002);
  }
  function flute(d, t, midi, dur, v, zone) {
    const f = mtof(midi);
    const soft = zone === 2, chirp = zone === 3;
    const a = soft ? 0.07 : chirp ? 0.012 : 0.03;
    const rel = soft ? 0.22 : 0.08;
    const end = t + Math.max(a + 0.01, dur) + rel + 0.03;
    const g = held(d, t, a, (soft ? 0.13 : 0.17) * v, dur, rel, 0.85);
    const f0 = chirp ? f * 0.92 : f;
    const o = osc('sine', f0, t, end, g, chirp ? f : 0, 0.035);
    const h = gainNode(soft ? 0.08 : 0.2);
    h.connect(g);
    osc('triangle', f0 * 2, t, end, h, chirp ? f * 2 : 0, 0.035);
    if (dur > 0.25) {
      const l = ctx.createOscillator();
      l.frequency.value = 5.3;
      const lg = ctx.createGain();
      lg.gain.setValueAtTime(0, t);
      lg.gain.linearRampToValueAtTime(f * 0.006, t + 0.3);
      l.connect(lg); lg.connect(o.frequency);
      l.start(t); l.stop(end);
    }
    noise(d, t, 0.045 * v, Math.min(0.12, dur), 'bandpass', f * 2, 3, 0.01);
  }
  // Squeeze-box chords: short stabs or long held ones; on the cloud mat a soft high shimmer.
  function pad(d, t, midis, dur, v, zone) {
    const hi = zone === 2;
    const stab = dur < 0.3;
    const a = hi ? 0.25 : stab ? 0.012 : 0.06;
    const rel = hi ? 0.5 : stab ? 0.07 : 0.14;
    const end = t + Math.max(a + 0.01, dur) + rel + 0.03;
    const g = held(d, t, a, (hi ? 0.07 : stab ? 0.1 : 0.075) * v, dur, rel, 0.9);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = hi ? 2600 : 1500; lp.Q.value = 0.4;
    lp.connect(g);
    for (const m of midis) {
      const f = mtof(m + (hi ? 12 : 0));
      for (const det of [-7, 7]) osc(hi ? 'triangle' : 'sawtooth', f, t, end, lp).detune.value = det;
    }
  }

  // ---- what each figure plays on each step ----
  function tunedNote(bars, bar, s, v) {
    const b = bars[bar % bars.length];
    let n = b.at[s];
    // Dropped on a mat in the middle of a long note: join it now instead of waiting for the next one.
    if (!n && v.entered && b.hold[s]) n = { deg: b.hold[s].deg, len: b.hold[s].step + b.hold[s].len - s };
    return n;
  }
  const vel = () => 0.88 + Math.random() * 0.2;

  const PLAY = {
    bear(v, z, bar, s, t) {
      let any = false;
      for (const row of DRUM[z]) {
        const c = row[s];
        if (c === '.') continue;
        any = true;
        if (c === 'k') kick(v.seg, t, vel());
        else if (c === 's') snare(v.seg, t, vel());
        else if (c === 'c') clap(v.seg, t, vel());
        else if (c === 't') tom(v.seg, t, vel(), 150);
        else if (c === 'T') tom(v.seg, t, vel(), 215);
        else if (c === 'w') wood(v.seg, t, vel());
      }
      return any ? SD : 0;
    },
    bunny(v, z, bar, s, t) {
      const c = SHAKER[z][0][s];
      if (c === '.') return 0;
      if (c === 'X') shake(v.seg, t, vel(), true);
      else if (c === 'x') shake(v.seg, t, vel(), false);
      else if (c === 'j') tamb(v.seg, t, vel());
      else if (c === 'g') triangle(v.seg, t, vel());
      return SD;
    },
    frog(v, z, bar, s, t, ch) {
      const n = tunedNote(BASS[z], bar, s, v);
      if (!n) return 0;
      const dur = n.len * SD * 0.9;
      bass(v.seg, t, degToMidi(ch.bass, ch.min, n.deg), dur, vel(), z);
      return dur;
    },
    cat(v, z, bar, s, t, ch) {
      const n = tunedNote(MARIMBA[z], bar, s, v);
      if (!n) return 0;
      if (z === 2) glock(v.seg, t, degToMidi(ch.mel + 12, ch.min, n.deg), vel());
      else marimba(v.seg, t, degToMidi(ch.mel, ch.min, n.deg), vel() * (z === 3 ? 0.8 : 1));
      return SD * 1.5;
    },
    bird(v, z, bar, s, t, ch) {
      const n = tunedNote(FLUTE[z], bar, s, v);
      if (!n) return 0;
      const dur = n.len * SD * 0.92;
      flute(v.seg, t, degToMidi(ch.mel + 12, ch.min, n.deg), dur, vel(), z);
      return dur;
    },
    elephant(v, z, bar, s, t, ch) {
      const n = tunedNote(PAD[z], bar, s, v);
      if (!n) return 0;
      const dur = n.len * SD * (n.len > 1 ? 0.96 : 0.8);
      pad(v.seg, t, [0, 2, 3].map((dg) => degToMidi(ch.mel, ch.min, dg)), dur, vel(), z);
      return dur;
    },
  };

  // ---- clock ----
  let running = false, t0 = 0, stepIdx = 0, timer = 0, curBar = 0;
  const stepTime = (i) => t0 + i * SD + (i % 2 ? SWING * SD : 0);

  function doStep(i, t) {
    const bar = Math.floor(i / 16), s = i % 16;
    curBar = bar;
    const ch = PROG[bar % PROG.length];
    for (const id of IDS) {
      const v = voices[id];
      if (v.zone < 0) continue;
      const len = PLAY[id](v, v.zone, bar, s, t, ch);
      v.entered = false;
      if (len) onNote(id, t, len);
    }
  }
  function tick() {
    if (!running) return;
    const now = ctx.currentTime;
    if (stepTime(stepIdx) < now - 0.2) stepIdx += Math.ceil((now - stepTime(stepIdx)) / SD);
    let tt;
    while ((tt = stepTime(stepIdx)) < now + LOOK) {
      doStep(stepIdx, Math.max(tt, now + 0.005));
      stepIdx++;
    }
  }
  function start() {
    running = true;
    t0 = ctx.currentTime + 0.06;
    stepIdx = 0;
    curBar = 0;
    clearInterval(timer);
    timer = setInterval(tick, 25);
    tick();
  }
  function stop() {
    running = false;
    clearInterval(timer);
  }

  // Each stay on a mat gets its own little bus, so leaving the mat can cut that stay's
  // ringing notes without touching anything else.
  function setVoice(id, zone, pan) {
    const v = voices[id];
    setPan(id, pan);
    if (zone === v.zone) return;
    const now = ctx.currentTime;
    if (v.seg) {
      const old = v.seg;
      old.gain.setTargetAtTime(0, now, 0.03);
      setTimeout(() => old.disconnect(), 600);
      v.seg = null;
    }
    v.zone = zone;
    if (zone >= 0) {
      v.seg = gainNode(1);
      v.seg.connect(v.strip.input);
      v.entered = true;
      const cloud = zone === 2;
      v.strip.echoSend.gain.setTargetAtTime(cloud ? 0.45 : 0, now, 0.03);
      v.strip.revSend.gain.setTargetAtTime(cloud ? 0.45 : REV[id], now, 0.03);
    }
  }
  function setPan(id, pan) {
    const p = voices[id].strip.pan;
    if (p) p.pan.setTargetAtTime(Math.max(-0.7, Math.min(0.7, pan)), ctx.currentTime, 0.05);
  }

  // The figure's own sound, once, when it is touched.
  function hello(id) {
    const d = voices[id].strip.input;
    const t = ctx.currentTime + 0.01;
    const ch = running ? PROG[curBar % PROG.length] : PROG[0];
    if (id === 'bear') { tom(d, t, 0.8, 215); tom(d, t + 0.13, 0.9, 150); }
    else if (id === 'bunny') { shake(d, t, 1, true); shake(d, t + 0.1, 0.8, false); shake(d, t + 0.2, 1, true); }
    else if (id === 'frog') bass(d, t, ch.bass + 12, 0.24, 0.9, 0);
    else if (id === 'cat') { marimba(d, t, ch.mel + 12, 0.9); marimba(d, t + 0.11, degToMidi(ch.mel + 12, ch.min, 2), 0.9); }
    else if (id === 'bird') { flute(d, t, degToMidi(ch.mel + 12, ch.min, 5), 0.09, 0.9, 3); flute(d, t + 0.12, degToMidi(ch.mel + 12, ch.min, 7), 0.16, 0.9, 3); }
    else if (id === 'elephant') pad(d, t, [0, 2, 3].map((dg) => degToMidi(ch.mel, ch.min, dg)), 0.28, 1, 0);
  }

  // A touch on the bare table: one quiet marimba note, higher towards the right.
  const TOK = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81];
  function tok(x01) {
    const i = Math.max(0, Math.min(TOK.length - 1, Math.floor(x01 * TOK.length)));
    if (free.pan) free.pan.pan.setTargetAtTime(x01 * 1.2 - 0.6, ctx.currentTime, 0.01);
    marimba(free.input, ctx.currentTime + 0.01, TOK[i], 0.55);
  }

  function chime() {
    const t = ctx.currentTime + 0.03;
    [72, 76, 79].forEach((m, i) => marimba(free.input, t + i * 0.11, m, 0.8));
  }

  // The closing chord: "chim-pún!"
  function tada(at) {
    const t = at || ctx.currentTime + 0.03;
    const d = free.input;
    if (free.pan) free.pan.pan.setTargetAtTime(0, ctx.currentTime, 0.01);
    [55, 59, 62, 67].forEach((m) => marimba(d, t, m, 0.6));
    kick(d, t, 0.7);
    const t2 = t + 0.3;
    [48, 60, 64, 67, 72].forEach((m, i) => marimba(d, t2 + i * 0.012, m, 0.75));
    [84, 88, 91, 96].forEach((m, i) => glock(d, t2 + i * 0.03, m, 0.9));
    kick(d, t2, 0.9);
    noise(d, t2, 0.2, 1.3, 'highpass', 6000, 0.7, 0.004);
    return t2;
  }

  // ---- applause ----
  // A few dozen people, each clapping at their own speed and with their own hand sound,
  // over a bed of hiss for the rest of the room. Built once into a buffer.
  let clapBuf = null, clapNow = null;
  function makeApplause(dur = 4.8) {
    const n = Math.floor(sr * dur);
    const buf = ctx.createBuffer(2, n, sr);
    const L = buf.getChannelData(0), R = buf.getChannelData(1);
    const env = (t) => Math.min(1, t / 0.22) * Math.pow(Math.min(1, Math.max(0, (dur - t) / 1.7)), 1.6);
    const clapLen = Math.floor(sr * 0.03);
    for (let p = 0; p < 48; p++) {
      const rate = 3.3 + Math.random() * 2.3;
      const f = 850 + Math.random() * 1700;
      const r = 0.9 + Math.random() * 0.05;
      const a1 = 2 * r * Math.cos((2 * Math.PI * f) / sr), a2 = -r * r;
      const decay = sr * (0.0028 + Math.random() * 0.002);
      const pan = 0.15 + Math.random() * 0.7;
      const level = (0.5 + Math.random() * 0.5) * (1 - r) * 6;
      const endAt = dur - 0.25 - Math.random() * 1.5;
      let t = Math.random() * (Math.random() < 0.3 ? 0.7 : 0.3);
      while (t < endAt) {
        const amp = level * env(t) * (0.8 + Math.random() * 0.4);
        const base = Math.floor(t * sr);
        let y1 = 0, y2 = 0;
        for (let i = 0; i < clapLen && base + i < n; i++) {
          const y = (Math.random() * 2 - 1) * Math.exp(-i / decay) + a1 * y1 + a2 * y2;
          y2 = y1; y1 = y;
          L[base + i] += y * amp * (1 - pan);
          R[base + i] += y * amp * pan;
        }
        t += (1 / rate) * (0.85 + Math.random() * 0.3);
      }
    }
    let peak = 0;
    for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
    const k = 0.8 / (peak || 1);
    let l1 = 0, l2 = 0, r1 = 0, r2 = 0;
    for (let i = 0; i < n; i++) {
      const e = env(i / sr) * 0.1;
      const wl = Math.random() * 2 - 1, wr = Math.random() * 2 - 1;
      l1 += (wl - l1) * 0.4; l2 += (wl - l2) * 0.07;
      r1 += (wr - r1) * 0.4; r2 += (wr - r2) * 0.07;
      L[i] = L[i] * k + (l1 - l2) * e;
      R[i] = R[i] * k + (r1 - r2) * e;
    }
    return buf;
  }
  function prepare() {
    if (!clapBuf) clapBuf = makeApplause();
  }
  function applause(at) {
    prepare();
    hush();
    const s = ctx.createBufferSource();
    s.buffer = clapBuf;
    const g = gainNode(0.9);
    const send = gainNode(0.12);
    s.connect(g); g.connect(master); g.connect(send); send.connect(revIn);
    s.start(at || ctx.currentTime + 0.05);
    clapNow = { s, g };
  }
  function hush() {
    if (!clapNow) return;
    const { s, g } = clapNow;
    clapNow = null;
    g.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
    try { s.stop(ctx.currentTime + 0.7); } catch { /* already ended */ }
  }

  return {
    ctx, start, stop, setVoice, setPan, hello, tok, chime, tada, applause, hush, prepare,
    doStep, stepTime, makeApplause,
    isRunning: () => running,
    now: () => ctx.currentTime - (ctx.outputLatency || ctx.baseLatency || 0),
    resume: () => { if (ctx.state !== 'running' && ctx.resume) ctx.resume().catch(() => {}); },
    suspend: () => { if (ctx.state === 'running' && ctx.suspend) ctx.suspend().catch(() => {}); },
  };
}
