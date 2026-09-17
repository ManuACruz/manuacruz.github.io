// Synthesised sound effects. No asset files. Everything is short oscillator or noise bursts.
// unlock() must run inside a user gesture before anything is audible.

const KEY = 'skywake.muted';
let ac = null;
let master = null;
let muted = false;
let gestured = false; // browsers refuse vibrate() before a real tap, and log an error each time
try { muted = localStorage.getItem(KEY) === '1'; } catch (e) { /* storage unavailable */ }

export function unlock() {
  gestured = true;
  try {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = muted ? 0 : 0.5;
      master.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
  } catch (e) { /* audio unavailable */ }
}
export function isMuted() { return muted; }
export function setMuted(m) {
  muted = m;
  if (master) master.gain.value = m ? 0 : 0.5;
  try { localStorage.setItem(KEY, m ? '1' : '0'); } catch (e) { /* ignore */ }
}
export function vibrate(pattern) {
  try { if (gestured && !muted && navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* ignore */ }
}

function ready() { return ac && ac.state === 'running' && !muted; }

// One oscillator with a pitch slide and a percussive envelope.
function tone({ f = 440, f2 = null, type = 'sine', dur = 0.12, vol = 0.3, delay = 0 }) {
  if (!ready()) return;
  const t0 = ac.currentTime + delay;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t0);
  if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

// Filtered white noise burst.
let noiseBuf = null;
function noise({ dur = 0.15, vol = 0.25, freq = 1200, q = 0.8, delay = 0, slide = null }) {
  if (!ready()) return;
  if (!noiseBuf) {
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t0 = ac.currentTime + delay;
  const src = ac.createBufferSource();
  src.buffer = noiseBuf;
  const bp = ac.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.setValueAtTime(freq, t0); bp.Q.value = q;
  if (slide) bp.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp); bp.connect(g); g.connect(master);
  src.start(t0); src.stop(t0 + dur + 0.02);
}

export const sfx = {
  tap() { tone({ f: 900, f2: 600, type: 'triangle', dur: 0.05, vol: 0.12 }); },
  fireLight() { noise({ dur: 0.09, vol: 0.25, freq: 1800, slide: 500 }); tone({ f: 320, f2: 120, type: 'square', dur: 0.08, vol: 0.12 }); },
  fireHeavy() { noise({ dur: 0.2, vol: 0.35, freq: 700, slide: 150 }); tone({ f: 140, f2: 50, type: 'sawtooth', dur: 0.22, vol: 0.25 }); },
  hitEnemy() { tone({ f: 520, f2: 260, type: 'square', dur: 0.06, vol: 0.14 }); noise({ dur: 0.05, vol: 0.12, freq: 3000 }); },
  armor() { tone({ f: 1400, f2: 1100, type: 'triangle', dur: 0.05, vol: 0.12 }); tone({ f: 1400, f2: 1100, type: 'triangle', dur: 0.05, vol: 0.1, delay: 0.06 }); },
  kill() { noise({ dur: 0.25, vol: 0.3, freq: 900, slide: 200 }); tone({ f: 300, f2: 80, type: 'sawtooth', dur: 0.25, vol: 0.18 }); },
  bossDown() { for (let i = 0; i < 3; i++) noise({ dur: 0.4, vol: 0.35, freq: 500 - i * 100, slide: 90, delay: i * 0.18 }); tone({ f: 110, f2: 35, type: 'sawtooth', dur: 0.9, vol: 0.3 }); },
  hitCar() { noise({ dur: 0.12, vol: 0.3, freq: 400, q: 0.5, slide: 150 }); tone({ f: 180, f2: 90, type: 'square', dur: 0.1, vol: 0.15 }); },
  ram() { noise({ dur: 0.3, vol: 0.4, freq: 300, q: 0.4, slide: 80 }); tone({ f: 90, f2: 40, type: 'sawtooth', dur: 0.35, vol: 0.3 }); },
  interrupt() { tone({ f: 700, f2: 1200, type: 'square', dur: 0.08, vol: 0.14 }); tone({ f: 1200, f2: 1600, type: 'square', dur: 0.08, vol: 0.14, delay: 0.08 }); },
  grab() { tone({ f: 660, f2: 990, type: 'sine', dur: 0.09, vol: 0.2 }); tone({ f: 1320, type: 'sine', dur: 0.08, vol: 0.12, delay: 0.07 }); },
  net() { noise({ dur: 0.12, vol: 0.15, freq: 2500, slide: 900 }); tone({ f: 500, f2: 700, type: 'sine', dur: 0.1, vol: 0.12 }); },
  overboard() { tone({ f: 600, f2: 120, type: 'sawtooth', dur: 0.5, vol: 0.2 }); noise({ dur: 0.35, vol: 0.3, freq: 600, slide: 200, delay: 0.35 }); },
  rescue() { [523, 659, 784, 1047].forEach((f, i) => tone({ f, type: 'triangle', dur: 0.14, vol: 0.18, delay: i * 0.08 })); },
  dock() { [784, 1047].forEach((f, i) => tone({ f, type: 'sine', dur: 0.6, vol: 0.2, delay: i * 0.25 })); },
  leg() { [392, 523, 659].forEach((f, i) => tone({ f, type: 'triangle', dur: 0.18, vol: 0.16, delay: i * 0.1 })); },
  boss() { for (let i = 0; i < 2; i++) tone({ f: 80, f2: 60, type: 'sawtooth', dur: 0.7, vol: 0.3, delay: i * 0.5 }); noise({ dur: 1.2, vol: 0.12, freq: 200, q: 0.3 }); },
  snatch() { tone({ f: 1500, f2: 400, type: 'square', dur: 0.15, vol: 0.12 }); },
  gameOver() { [330, 262, 196, 131].forEach((f, i) => tone({ f, type: 'sawtooth', dur: 0.35, vol: 0.2, delay: i * 0.22 })); },
  win() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone({ f, type: 'triangle', dur: 0.3, vol: 0.2, delay: i * 0.12 })); },
};
