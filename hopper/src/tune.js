// Every number the rules use. The settings panel edits these live; changes persist in localStorage.

export const DEFAULTS = {
  speed: 1,
  dashSpeed: 1000,
  hangLen: 78,
  hopSpeed: 900,
  swingLen: 230,
  swingMinLen: 110,
  swingAngle: 55,
  swingPeriod: 2.5,
  swingHold: 0.25,
  swingCarry: 0.5,
  moveSoft: 1,
  moveMin: 0.3,
  walkSpeed: 300,
  gravity: 2100,
  jump: 860,
  jumpRun: 320,
  jumpTilt: 38,
  tiltK: 1,
  swipeMin: 26,
  grab: 32,
  viewW: 1376,
  viewH: 692,
  pinMin: 15,
  camSmooth: 4,
  introT: 1.3,
  introHold: 0.8,
  panSpeed: 1300,
  factMin: 0.7,
  nextT: 2.6,
  clueT: 5,
  wallClueT: 1.2,
  restartT: 0.45,
  // juice (not rules): multipliers for screen shake and hit-stop
  shake: 1,
  hitstop: 1,
};

// [key, min, max, step] shown as sliders in the settings panel
export const SLIDERS = [
  ['speed', 0.25, 2, 0.05],
  ['dashSpeed', 300, 2500, 10],
  ['hangLen', 40, 160, 1],
  ['hopSpeed', 300, 2500, 10],
  ['swingLen', 110, 400, 1],
  ['swingMinLen', 40, 220, 1],
  ['swingAngle', 15, 85, 1],
  ['swingPeriod', 0.8, 5, 0.05],
  ['swingHold', 0, 0.9, 0.01],
  ['swingCarry', 0, 1.5, 0.05],
  ['moveSoft', 0, 1, 0.05],
  ['moveMin', 0.05, 1, 0.01],
  ['walkSpeed', 80, 700, 5],
  ['gravity', 600, 5000, 10],
  ['jump', 300, 1500, 5],
  ['jumpRun', 0, 800, 5],
  ['jumpTilt', 0, 80, 1],
  ['tiltK', 0, 2, 0.05],
  ['swipeMin', 6, 80, 1],
  ['grab', 0, 120, 1],
  ['camSmooth', 0.5, 15, 0.1],
  ['clueT', 1, 20, 0.5],
  ['shake', 0, 2, 0.05],
  ['hitstop', 0, 2, 0.05],
];

const KEY = 'hopper.tune';
const store = typeof localStorage !== 'undefined' ? localStorage : null;

function load() {
  try {
    const o = JSON.parse(store?.getItem(KEY) || '{}');
    const out = {};
    for (const k in o) if (k in DEFAULTS && typeof o[k] === 'number') out[k] = o[k];
    return out;
  } catch {
    return {};
  }
}

export const T = { ...DEFAULTS, ...load() };

function save() {
  const diff = changed();
  try {
    store?.setItem(KEY, JSON.stringify(diff));
  } catch {}
}

export function setTune(k, v) {
  T[k] = v;
  save();
}

export function resetTune() {
  Object.assign(T, DEFAULTS);
  save();
}

export function changed() {
  const d = {};
  for (const k in DEFAULTS) if (T[k] !== DEFAULTS[k]) d[k] = T[k];
  return d;
}
