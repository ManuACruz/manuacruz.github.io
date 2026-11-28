// Sound engine shared by every Chimpún theme. Everything is synthesised, there are no audio files.
//
// One clock drives every figure, so whatever is on the mats plays in time. The theme says how
// long a bar is and which chords the song walks through, for ever. A pattern is a string with
// one character per step. For tuned parts a digit starts a note, '-' holds it and '.' is a
// rest. A digit is not a pitch but a place in the current chord's scale, so every pattern fits
// every chord and nothing can sound wrong. By default that is a five-note scale (0 root,
// 2 third, 3 fifth, 5 the root an octave up). A song with a key uses the key's seven notes
// instead, counted from the chord's root (0 root, 2 third, 4 fifth, 7 the octave), which
// allows runs and trills. For percussion parts each letter is a hit the theme names.
//
// A theme supplies: song (tempo, bar length, chords), parts (one per figure: patterns per mat),
// mats (echo / room per mat), optional voices of its own, and the touch, start and ending sounds.

const LOOK = 0.13; // how far ahead notes are handed to the audio clock
const MAJ = [0, 2, 4, 7, 9];
const MIN = [0, 2, 3, 7, 10];

export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const KEY_MAJ = [0, 2, 4, 5, 7, 9, 11];
const KEY_MIN = [0, 2, 3, 5, 7, 8, 10];
// scale: semitones above the root, any length.
export const degToMidi = (root, scale, deg) => {
  const n = scale.length, o = Math.floor(deg / n);
  return root + scale[deg - o * n] + 12 * o;
};

export function createEngine(ctx, theme, opts = {}) {
  const onNote = opts.onNote || (() => {});
  const sr = ctx.sampleRate;
  const song = theme.song;
  const SPB = song.stepsPerBeat || 4;
  const STEPS = SPB * (song.beatsPerBar || 4);
  const SD = 60 / song.bpm / SPB; // one step, in seconds
  const SWING = song.swing || 0;  // off-beat steps arrive this fraction of a step late
  const CS = song.chordSteps || STEPS; // how long one chord lasts; a bar unless the song says so
  // Each chord's scale. In a song with a key, the key's notes counted from the chord's root.
  const keyPcs = song.key ? (song.key.minor ? KEY_MIN : KEY_MAJ).map((x) => (x + song.key.tonic) % 12) : null;
  const PROG = song.prog.map((c) => ({
    ...c,
    scale: c.scale || (keyPcs ? keyPcs.map((pc) => (pc - c.mel + 120) % 12).sort((a, b) => a - b) : c.min ? MIN : MAJ),
  }));
  const chordAt = (i) => PROG[Math.floor(i / CS) % PROG.length];
  const IDS = theme.figures.map((f) => f.id);

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
  const filter = (type, freq, q = 0.7) => {
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    return f;
  };

  // Room
  const room = song.room || {};
  const conv = ctx.createConvolver();
  {
    const n = Math.floor(sr * (room.len || 1.3));
    const ir = ctx.createBuffer(2, n, sr);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3) * Math.min(1, i / (sr * 0.004));
    }
    conv.buffer = ir;
  }
  const revIn = gainNode(1);
  const revOut = gainNode(room.level ?? 0.6);
  revIn.connect(conv); conv.connect(revOut); revOut.connect(master);

  // Echo
  const echoIn = gainNode(1);
  const delay = ctx.createDelay(2);
  delay.delayTime.value = SD * (song.echoSteps || 3);
  const echoLp = filter('lowpass', 2400);
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

  // ---- building blocks, also handed to a theme's own voices ----
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
  const heldEnd = (t, a, dur, rel) => t + Math.max(a + 0.01, dur) + rel + 0.03;
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
    const f = filter(ftype, freq, q);
    s.connect(f); f.connect(hit(dest, t, a, peak, d));
    s.start(t, Math.random() * 1.5);
    s.stop(t + a + d + 0.03);
  }
  function vibrato(o, f, t, end, rate = 5.3, depth = 0.006, fadeIn = 0.3) {
    const l = ctx.createOscillator();
    l.frequency.value = rate;
    const lg = ctx.createGain();
    lg.gain.setValueAtTime(0, t);
    lg.gain.linearRampToValueAtTime(f * depth, t + fadeIn);
    l.connect(lg); lg.connect(o.frequency);
    l.start(t); l.stop(end);
  }
  const kit = { ctx, SD, hit, held, heldEnd, osc, tone, noise, vibrato, gainNode, filter, mtof };

  // ---- stock voices ----
  // Percussion: (dest, time, loudness, extra). Tuned: (dest, time, midi note, length, loudness, options).
  const V = {
    kick(d, t, v) {
      tone(d, 'sine', 175, t, 0.95 * v, 0.26, 0.002, 52, 0.11);
      tone(d, 'triangle', 240, t, 0.3 * v, 0.1, 0.002, 80, 0.07);
    },
    snare(d, t, v) {
      noise(d, t, 0.42 * v, 0.14, 'bandpass', 2300, 0.7);
      tone(d, 'triangle', 215, t, 0.3 * v, 0.07, 0.002, 170, 0.05);
    },
    clap(d, t, v) {
      noise(d, t, 0.3 * v, 0.02, 'bandpass', 1300, 1.2, 0.001);
      noise(d, t + 0.012, 0.3 * v, 0.02, 'bandpass', 1300, 1.2, 0.001);
      noise(d, t + 0.025, 0.4 * v, 0.12, 'bandpass', 1300, 1.2, 0.001);
    },
    tom(d, t, v, f = 180) {
      tone(d, 'sine', f * 1.5, t, 0.7 * v, 0.3, 0.003, f, 0.08);
      tone(d, 'triangle', f * 1.5, t, 0.18 * v, 0.12, 0.003, f, 0.08);
    },
    wood(d, t, v) {
      tone(d, 'sine', 1050, t, 0.3 * v, 0.05, 0.001);
      tone(d, 'sine', 1580, t, 0.14 * v, 0.035, 0.001);
    },
    shake(d, t, v, loud) {
      noise(d, t, (loud ? 0.5 : 0.3) * v, loud ? 0.07 : 0.04, 'highpass', 5500, 0.7, 0.008);
    },
    tamb(d, t, v) {
      noise(d, t, 0.5 * v, 0.14, 'bandpass', 8500, 1.6, 0.003);
      noise(d, t, 0.22 * v, 0.05, 'highpass', 4000, 0.7, 0.003);
    },
    triangle(d, t, v) {
      tone(d, 'sine', 3950, t, 0.17 * v, 1.3, 0.001);
      tone(d, 'sine', 5270, t, 0.085 * v, 0.9, 0.001);
      tone(d, 'sine', 7900, t, 0.04 * v, 0.45, 0.001);
    },
    cymbal(d, t, v) {
      noise(d, t, 0.2 * v, 1.3, 'highpass', 6000, 0.7, 0.004);
    },
    // A plucked bass with a little upward croak at the start of each note. hi: brighter, always plucked.
    bass(d, t, midi, dur, v, o = {}) {
      const f = mtof(midi);
      const pluck = o.hi || dur < 0.2;
      const tail = o.hi ? 0.34 : 0.22;
      const g = pluck ? hit(d, t, 0.006, 0.5 * v, tail) : held(d, t, 0.008, 0.26 * v, dur, 0.07, 0.6);
      const end = t + (pluck ? tail : dur + 0.08) + 0.05;
      const lp = filter('lowpass', o.hi ? 1500 : 750, 1);
      lp.connect(g);
      osc('triangle', f * 1.1, t, end, g, f, 0.05);
      const sq = gainNode(0.24);
      sq.connect(lp);
      osc('square', f * 1.1, t, end, sq, f, 0.05);
    },
    marimba(d, t, midi, dur, v) {
      const f = mtof(midi);
      tone(d, 'sine', f, t, 0.4 * v, Math.min(0.75, 0.55 * Math.pow(330 / f, 0.4)), 0.003);
      tone(d, 'sine', f * 4, t, 0.13 * v, 0.08, 0.002);
    },
    glock(d, t, midi, dur, v) {
      const f = mtof(midi);
      tone(d, 'sine', f, t, 0.28 * v, 1.25, 0.002);
      tone(d, 'sine', f * 2.76, t, 0.1 * v, 0.5, 0.002);
      tone(d, 'sine', f * 5.4, t, 0.025 * v, 0.2, 0.002);
    },
    // soft: slow and pure. chirp: quick, with a small scoop up into the note.
    flute(d, t, midi, dur, v, o = {}) {
      const f = mtof(midi);
      const a = o.soft ? 0.07 : o.chirp ? 0.012 : 0.03;
      const rel = o.soft ? 0.22 : 0.08;
      const end = heldEnd(t, a, dur, rel);
      const g = held(d, t, a, (o.soft ? 0.13 : 0.17) * v, dur, rel, 0.85);
      const f0 = o.chirp ? f * 0.92 : f;
      const main = osc('sine', f0, t, end, g, o.chirp ? f : 0, 0.035);
      const h = gainNode(o.soft ? 0.08 : 0.2);
      h.connect(g);
      osc('triangle', f0 * 2, t, end, h, o.chirp ? f * 2 : 0, 0.035);
      if (dur > 0.25) vibrato(main, f, t, end);
      noise(d, t, 0.045 * v, Math.min(0.12, dur), 'bandpass', f * 2, 3, 0.01);
    },
    // Squeeze-box chords: short stabs or long held ones. hi: a soft shimmer instead of reeds.
    pad(d, t, midis, dur, v, o = {}) {
      const stab = dur < 0.3;
      const a = o.hi ? 0.25 : stab ? 0.012 : 0.06;
      const rel = o.hi ? 0.5 : stab ? 0.07 : 0.14;
      const end = heldEnd(t, a, dur, rel);
      const g = held(d, t, a, (o.hi ? 0.07 : stab ? 0.1 : 0.075) * v, dur, rel, 0.9);
      const lp = filter('lowpass', o.hi ? 2600 : 1500, 0.4);
      lp.connect(g);
      for (const m of midis) {
        for (const det of [-7, 7]) osc(o.hi ? 'triangle' : 'sawtooth', mtof(m), t, end, lp).detune.value = det;
      }
    },
  };
  V.pad.poly = true; // takes the whole chord in one call
  if (theme.voices) Object.assign(V, theme.voices(kit));

  // ---- parts ----
  function parse(str) {
    if (str.length !== STEPS) console.warn(`pattern is not ${STEPS} steps:`, str);
    const at = new Array(STEPS).fill(null);
    const hold = new Array(STEPS).fill(null);
    for (let i = 0; i < STEPS; i++) {
      const c = str[i];
      if (c >= '0' && c <= '9') {
        let len = 1;
        while (i + len < STEPS && str[i + len] === '-') len++;
        const n = { step: i, deg: +c, len };
        at[i] = n;
        for (let k = 1; k < len; k++) hold[i + k] = n;
      }
    }
    return { at, hold };
  }
  const compiled = {};
  for (const id of IDS) {
    const p = theme.parts[id];
    if (p.hits) {
      for (const bars of p.mats) for (const rows of bars) for (const r of rows) {
        if (r.length !== STEPS) console.warn(`pattern is not ${STEPS} steps:`, r);
      }
      compiled[id] = p.mats;
    } else compiled[id] = p.mats.map((m) => m.bars.map(parse));
  }

  const voices = {};
  for (const id of IDS) voices[id] = { id, zone: -1, entered: false, seg: null, strip: makeStrip(theme.parts[id].rev ?? 0.15) };
  const free = makeStrip(0.25); // touches on the bare table, the closing chord

  const vel = () => 0.88 + Math.random() * 0.2;

  // spec: { voice, oct, opt, chord } - a mat's settings or a hello's.
  function playTuned(dest, t, spec, root, ch, deg, dur, v) {
    const base = (root === 'bass' ? ch.bass : ch.mel) + 12 * (spec.oct || 0);
    const fn = V[spec.voice];
    if (!spec.chord) { fn(dest, t, degToMidi(base, ch.scale, deg), dur, v, spec.opt); return; }
    const midis = spec.chord.map((dg) => degToMidi(base, ch.scale, deg + dg));
    if (fn.poly) fn(dest, t, midis, dur, v, spec.opt);
    else for (const m of midis) fn(dest, t, m, dur, v, spec.opt);
  }

  // One step of one figure. Returns how long the figure should look busy, 0 if it rested.
  function playPart(v, i, t, ch) {
    const bar = Math.floor(i / STEPS), s = i % STEPS;
    const part = theme.parts[v.id];
    const z = v.zone;
    if (part.hits) {
      const bars = compiled[v.id][z];
      let any = false;
      for (const row of bars[bar % bars.length]) {
        const h = part.hits[row[s]];
        if (!h) continue;
        any = true;
        V[h[0]](v.seg, t, vel() * (h[2] ?? 1), h[1]);
      }
      return any ? SD : 0;
    }
    const mat = part.mats[z];
    const bars = compiled[v.id][z];
    const b = bars[bar % bars.length];
    let n = b.at[s];
    // Dropped on a mat in the middle of a long note: join it now instead of waiting for the next one.
    if (!n && v.entered && b.hold[s]) n = { deg: b.hold[s].deg, len: b.hold[s].step + b.hold[s].len - s };
    if (!n) return 0;
    const dur = n.len * SD * (mat.gate ?? 0.9);
    // ahead: a note this close before a chord change already plays the coming chord.
    if (mat.ahead && i % CS >= CS - mat.ahead) ch = chordAt(i + CS);
    playTuned(v.seg, t, mat, part.root, ch, n.deg, dur, vel() * (mat.vel ?? 1));
    return Math.max(dur, SD);
  }

  // ---- clock ----
  let running = false, t0 = 0, stepIdx = 0, timer = 0, curStep = 0;
  const stepTime = (i) => t0 + i * SD + (i % 2 ? SWING * SD : 0);

  function doStep(i, t) {
    curStep = i;
    const ch = chordAt(i);
    for (const id of IDS) {
      const v = voices[id];
      if (v.zone < 0) continue;
      const len = playPart(v, i, t, ch);
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
    curStep = 0;
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
      const mat = theme.mats[zone];
      v.strip.echoSend.gain.setTargetAtTime(mat.echo || 0, now, 0.03);
      v.strip.revSend.gain.setTargetAtTime(mat.rev ?? theme.parts[id].rev ?? 0.15, now, 0.03);
    }
  }
  function setPan(id, pan) {
    const p = voices[id].strip.pan;
    if (p) p.pan.setTargetAtTime(Math.max(-0.7, Math.min(0.7, pan)), ctx.currentTime, 0.05);
  }

  // The figure's own sound, once, when it is touched.
  function hello(id) {
    const part = theme.parts[id];
    const h = part.hello;
    if (!h) return;
    const d = voices[id].strip.input;
    const t = ctx.currentTime + 0.01;
    if (part.hits) {
      for (const [c, at] of h) {
        const x = part.hits[c];
        V[x[0]](d, t + at, 0.9 * (x[2] ?? 1), x[1]);
      }
      return;
    }
    const ch = running ? chordAt(curStep) : PROG[0];
    for (const [deg, at, dur] of h.notes) playTuned(d, t + at, h, part.root, ch, deg, dur, h.vel ?? 0.9);
  }

  // A touch on the bare table: one quiet note, higher towards the right.
  function tok(x01) {
    const k = theme.tok;
    const i = Math.max(0, Math.min(k.notes.length - 1, Math.floor(x01 * k.notes.length)));
    if (free.pan) free.pan.pan.setTargetAtTime(x01 * 1.2 - 0.6, ctx.currentTime, 0.01);
    V[k.voice](free.input, ctx.currentTime + 0.01, k.notes[i], 0.3, k.vel ?? 0.55);
  }
  function chime() {
    const k = theme.chime;
    const t = ctx.currentTime + 0.03;
    k.notes.forEach((m, i) => V[k.voice](free.input, t + i * k.gap, m, 0.3, k.vel ?? 0.8));
  }
  // The closing chord. Returns when the clapping should start.
  function tada(at) {
    if (free.pan) free.pan.pan.setTargetAtTime(0, ctx.currentTime, 0.01);
    return theme.ending.play(V, free.input, at || ctx.currentTime + 0.03);
  }

  // ---- applause ----
  // A crowd of people, each clapping at their own speed and with their own hand sound,
  // over a bed of hiss for the rest of the room. Built once into a buffer.
  const clapCfg = { people: 48, dur: 4.8, gain: 0.9, lowpass: 0, ...(theme.ending.applause || {}) };
  let clapBuf = null, clapNow = null;
  function makeApplause() {
    const dur = clapCfg.dur;
    const n = Math.floor(sr * dur);
    const buf = ctx.createBuffer(2, n, sr);
    const L = buf.getChannelData(0), R = buf.getChannelData(1);
    const env = (t) => Math.min(1, t / 0.22) * Math.pow(Math.min(1, Math.max(0, (dur - t) / 1.7)), 1.6);
    const clapLen = Math.floor(sr * 0.03);
    for (let p = 0; p < clapCfg.people; p++) {
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
    const g = gainNode(clapCfg.gain);
    const send = gainNode(0.12);
    if (clapCfg.lowpass) { const lp = filter('lowpass', clapCfg.lowpass, 0.5); s.connect(lp); lp.connect(g); }
    else s.connect(g);
    g.connect(master); g.connect(send); send.connect(revIn);
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
    ctx, SD, STEPS, start, stop, setVoice, setPan, hello, tok, chime, tada, applause, hush, prepare, doStep,
    isRunning: () => running,
    now: () => ctx.currentTime - (ctx.outputLatency || ctx.baseLatency || 0),
    resume: () => { if (ctx.state !== 'running' && ctx.resume) ctx.resume().catch(() => {}); },
    suspend: () => { if (ctx.state === 'running' && ctx.suspend) ctx.suspend().catch(() => {}); },
  };
}
