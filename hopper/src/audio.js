// Short synthesised sounds. The context starts on the first touch (browsers require a gesture).

let ac = null, master = null, noiseBuf = null;
let on = true;
try {
  on = localStorage.getItem('hopper.sound') !== 'off';
} catch {}

export function unlock() {
  if (ac) {
    if (ac.state === 'suspended') ac.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ac = new AC();
  master = ac.createGain();
  master.gain.value = 0.55;
  const comp = ac.createDynamicsCompressor();
  master.connect(comp).connect(ac.destination);
  noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

export function soundOn() {
  return on;
}

export function setSound(v) {
  on = v;
  try {
    localStorage.setItem('hopper.sound', v ? 'on' : 'off');
  } catch {}
}

// one oscillator with a pitch glide and an envelope
function tone({ type = 'sine', f0 = 440, f1 = f0, dur = 0.15, vol = 0.3, at = 0, attack = 0.005, curve = 'exp' }) {
  if (!ac || !on) return;
  const t = ac.currentTime + at;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
  else o.frequency.linearRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise({ dur = 0.2, vol = 0.2, f0 = 800, f1 = f0, q = 1, at = 0, type = 'bandpass' }) {
  if (!ac || !on) return;
  const t = ac.currentTime + at;
  const s = ac.createBufferSource();
  s.buffer = noiseBuf;
  const f = ac.createBiquadFilter();
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(master);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
}

const vary = (f) => f * (0.94 + Math.random() * 0.12);
let itemCombo = 0, itemComboT = 0;

export const sfx = {
  tap: () => tone({ type: 'triangle', f0: vary(880), f1: 1320, dur: 0.07, vol: 0.18 }),
  tongue: () => {
    tone({ type: 'sine', f0: vary(260), f1: 1100, dur: 0.11, vol: 0.28 });
    noise({ dur: 0.09, vol: 0.08, f0: 2500, f1: 5000, q: 2 });
  },
  slurp: () => {
    tone({ type: 'sine', f0: vary(900), f1: 220, dur: 0.14, vol: 0.22 });
    noise({ dur: 0.1, vol: 0.05, f0: 3000, f1: 900, q: 3 });
  },
  flight: () => noise({ dur: 0.28, vol: 0.12, f0: 500, f1: 2200, q: 0.8 }),
  arrive: () => {
    tone({ type: 'sine', f0: vary(520), f1: 780, dur: 0.08, vol: 0.2 });
    tone({ type: 'triangle', f0: 180, f1: 120, dur: 0.1, vol: 0.18 });
  },
  jump: () => {
    tone({ type: 'square', f0: vary(220), f1: 660, dur: 0.18, vol: 0.09 });
    tone({ type: 'sine', f0: vary(330), f1: 990, dur: 0.16, vol: 0.18 });
  },
  drop: () => tone({ type: 'sine', f0: vary(700), f1: 300, dur: 0.18, vol: 0.16 }),
  land: (k = 0.5) => {
    tone({ type: 'sine', f0: 150 + 60 * k, f1: 50, dur: 0.12 + 0.1 * k, vol: 0.2 + 0.25 * k });
    noise({ dur: 0.08 + 0.08 * k, vol: 0.05 + 0.12 * k, f0: 600, f1: 200, q: 0.7, type: 'lowpass' });
  },
  step: () => tone({ type: 'sine', f0: vary(260), f1: 180, dur: 0.05, vol: 0.06 }),
  bump: () => {
    tone({ type: 'square', f0: 180, f1: 60, dur: 0.2, vol: 0.14 });
    tone({ type: 'sine', f0: 900, f1: 1400, dur: 0.07, vol: 0.12, at: 0.02 });
    noise({ dur: 0.12, vol: 0.15, f0: 900, f1: 200, q: 0.8 });
  },
  no: () => {
    tone({ type: 'square', f0: 200, f1: 180, dur: 0.07, vol: 0.08 });
    tone({ type: 'square', f0: 160, f1: 140, dur: 0.09, vol: 0.08, at: 0.09 });
  },
  item: () => {
    const now = performance.now() / 1000;
    itemCombo = now - itemComboT < 1.5 ? itemCombo + 1 : 0;
    itemComboT = now;
    const base = 660 * Math.pow(2, Math.min(itemCombo, 6) / 12);
    [1, 1.25, 1.5, 2].forEach((m, i) => tone({ type: 'triangle', f0: base * m, dur: 0.16, vol: 0.16, at: i * 0.045 }));
    tone({ type: 'sine', f0: base * 4, dur: 0.3, vol: 0.05, at: 0.18 });
  },
  goal: () => [523, 659, 784, 1047].forEach((f, i) => tone({ type: 'triangle', f0: f, dur: 0.3, vol: 0.2, at: i * 0.09 })),
  place: () => {
    tone({ type: 'sine', f0: vary(300), f1: 900, dur: 0.06, vol: 0.3 });
    tone({ type: 'triangle', f0: 1200, f1: 1800, dur: 0.12, vol: 0.12, at: 0.05 });
    noise({ dur: 0.05, vol: 0.12, f0: 3000, q: 1 });
  },
  pick: () => tone({ type: 'sine', f0: vary(500), f1: 800, dur: 0.07, vol: 0.15 }),
  wrong: () => {
    tone({ type: 'sawtooth', f0: 220, f1: 150, dur: 0.22, vol: 0.08 });
    tone({ type: 'square', f0: 110, f1: 90, dur: 0.22, vol: 0.06 });
  },
  solved: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone({ type: 'triangle', f0: f, dur: 0.35, vol: 0.18, at: i * 0.08 }));
    [1047, 1319, 1568].forEach((f) => tone({ type: 'sine', f0: f, dur: 0.9, vol: 0.08, at: 0.45 }));
  },
  stamp: () => {
    tone({ type: 'sine', f0: 120, f1: 40, dur: 0.25, vol: 0.4 });
    noise({ dur: 0.15, vol: 0.2, f0: 400, f1: 100, q: 0.6, type: 'lowpass' });
  },
  fall: () => tone({ type: 'sine', f0: 900, f1: 120, dur: 0.6, vol: 0.2, curve: 'lin' }),
  sad: () => {
    tone({ type: 'triangle', f0: 392, f1: 370, dur: 0.25, vol: 0.16 });
    tone({ type: 'triangle', f0: 330, f1: 300, dur: 0.4, vol: 0.16, at: 0.25 });
  },
  wipe: () => noise({ dur: 0.3, vol: 0.08, f0: 2000, f1: 300, q: 0.7 }),
  swing: () => noise({ dur: 0.22, vol: 0.035, f0: 400, f1: 900, q: 1 }),
  page: () => noise({ dur: 0.35, vol: 0.1, f0: 1200, f1: 3000, q: 0.5 }),
  click: () => tone({ type: 'triangle', f0: 1000, f1: 700, dur: 0.05, vol: 0.12 }),
  // album
  book: () => {
    noise({ dur: 0.3, vol: 0.08, f0: 600, f1: 1800, q: 0.6 });
    tone({ type: 'sine', f0: 140, f1: 70, dur: 0.18, vol: 0.25, at: 0.38 });
    noise({ dur: 0.1, vol: 0.08, f0: 500, f1: 200, q: 0.6, type: 'lowpass', at: 0.38 });
  },
  flip: () => {
    noise({ dur: 0.22, vol: 0.09, f0: vary(900), f1: 3200, q: 0.6 });
    noise({ dur: 0.08, vol: 0.05, f0: 2400, f1: 1200, q: 1, at: 0.2 });
  },
  peel: () => {
    noise({ dur: 0.16, vol: 0.09, f0: 2500, f1: 6000, q: 2 });
    tone({ type: 'sine', f0: vary(400), f1: 900, dur: 0.1, vol: 0.1 });
  },
  pop: (k = 1) => {
    tone({ type: 'sine', f0: 520 * k, f1: 900 * k, dur: 0.09, vol: 0.2 });
    tone({ type: 'triangle', f0: 1040 * k, dur: 0.12, vol: 0.06, at: 0.05 });
  },
  hat: () => {
    [659, 784, 988, 1319].forEach((f, i) => tone({ type: 'square', f0: f, dur: 0.12, vol: 0.06, at: i * 0.07 }));
    [784, 1319].forEach((f) => tone({ type: 'triangle', f0: f, dur: 0.6, vol: 0.12, at: 0.3 }));
  },
  mail: () => {
    tone({ type: 'square', f0: 160, f1: 90, dur: 0.12, vol: 0.12 });
    noise({ dur: 0.1, vol: 0.12, f0: 900, f1: 300, q: 0.8 });
    tone({ type: 'triangle', f0: 1568, dur: 0.4, vol: 0.12, at: 0.18 });
    tone({ type: 'triangle', f0: 2093, dur: 0.5, vol: 0.08, at: 0.26 });
  },
};
