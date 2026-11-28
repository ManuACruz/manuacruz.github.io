// Theme: classical (Tutti). A little chamber orchestra on a cream table, playing variations
// over a bass that repeats for ever, the way a Baroque ground does. The song has a key, so
// digits count the key's seven notes from the chord's root (0 root, 2 third, 4 fifth,
// 7 octave), which allows runs and trills. Mats are the variations: laurel (the theme, long
// notes), fountain (plucked), candle (slow, bowed, with echo), fan (running notes and trills).

import { INK, TONGUE, icon, cut, shape, brush, dab } from '../art.js?v=5';

// ---------- figures ----------
const mouthOpen = (pts, tongue) => `<g class="m1">${shape(pts, INK)}${shape(tongue, TONGUE)}</g>`;
const BEAK = '#f7a43a';

const woodpecker = cut('woodpecker',
  [[16, 62], [17, 46], [24, 34], [26, 22], [22, 12], [30, 6], [42, 6], [54, 10], [62, 18], [66, 24], [80, 26], [95, 30],
   [80, 35], [66, 37], [62, 44], [64, 58], [62, 74], [54, 86], [42, 92], [28, 90], [19, 78]],
  '#2e2b36',
  shape([[25, 25], [20, 12], [30, 4.5], [44, 4.5], [56, 9.5], [63, 18], [52, 20.5], [40, 17.5], [30, 20.5]], '#e3423c') +
  brush([[27, 12], [36, 9], [47, 10.5]], 2.2, '#f47a6c') +
  shape([[36, 25], [50, 22], [63, 25.5], [63, 37], [50, 41], [38, 37]], '#fff8ee') +
  dab(52, 29, 3, 3.6, 5) +
  shape([[62.5, 23], [80, 25.5], [96, 30], [80, 35.5], [62.5, 38.5]], '#9a94a3') +
  brush([[64, 30.6], [80, 30.6], [93.5, 30.3]], 1.5, '#5d5866', 'm0') +
  shape([[64, 28.5], [92, 29.3], [92, 31.4], [64, 33.5]], '#5a2a1a', 'm1') +
  shape([[44, 49], [56, 46.5], [63, 58], [61, 74], [53, 85.5], [42, 87], [39.5, 70], [40, 57]], '#fff8ee') +
  dab(48, 58, 1.6, 2.1, 10) + dab(55, 64, 1.6, 2.1, -8) + dab(47, 70, 1.6, 2.1, 6) + dab(53.5, 77, 1.5, 2, -10) +
  dab(23, 52, 1.8, 1.3, -20, '#fff8ee') + dab(28.5, 55, 1.8, 1.3, -20, '#fff8ee') + dab(22.5, 62, 1.8, 1.3, -14, '#fff8ee') +
  dab(28.5, 65.5, 1.8, 1.3, -14, '#fff8ee') + dab(24, 73, 1.8, 1.3, -6, '#fff8ee') + dab(30.5, 76.5, 1.8, 1.3, -6, '#fff8ee'));

// The tail feathers' eyes, placed by hand along the edge of the fan.
const spots = [[12.6, 49.8, -70], [18.6, 33.8, -52], [31.4, 22.6, -30], [48.5, 17.6, -3], [66.8, 21.4, 24], [80.2, 32.9, 50], [87.5, 49.2, 72]];
const peacock = cut('peacock',
  [[5, 56], [4, 40], [10, 24], [22, 12], [36, 5], [50, 3], [64, 5], [78, 12], [90, 24], [96, 40], [95, 56], [88, 66],
   [74, 70], [70, 80], [62, 89], [50, 93], [38, 89], [30, 80], [26, 70], [12, 66]],
  '#3fa98a',
  spots.map(([x, y]) => brush([[50, 60], [(50 + x) / 2 + (x < 50 ? -1.5 : 1.5), (60 + y) / 2 - 1.5], [x, y]], 2.4, '#2c8a6f')).join('') +
  brush([[21, 60], [33, 61], [41, 63]], 2, '#2c8a6f') + brush([[79, 60.5], [67, 61], [59, 63]], 2, '#2c8a6f') +
  spots.map(([x, y, r]) => dab(x, y, 5.6, 6.8, r, '#f2c74e') + dab(x, y, 3.5, 4.4, r, '#2b6fd6') + dab(x + 0.3, y + 0.5, 1.5, 2, r, '#1d2f6f')).join('') +
  brush([[47, 31], [45.5, 25], [43, 21]], 1.7, '#1d4fa8') + brush([[50, 30], [50.3, 24], [50, 19]], 1.7, '#1d4fa8') + brush([[53, 31], [55, 25.5], [57.5, 21.5]], 1.7, '#1d4fa8') +
  dab(43, 20.5, 1.9, 1.9, 0, '#f2c74e') + dab(50, 18.5, 2, 2, 0, '#f2c74e') + dab(57.6, 21, 1.9, 1.9, 0, '#f2c74e') +
  shape([[41, 40], [43, 32], [50, 29], [57, 32.5], [59, 41], [57, 50], [64, 62], [68, 76], [62, 88], [50, 92], [38, 88], [32, 76], [36, 62], [43, 50]], '#2f6fd6') +
  shape([[42, 68], [50, 63], [58, 68.5], [59, 80], [50, 87], [41, 80]], '#5c93ea') +
  brush([[45, 72], [47.5, 75], [50, 72]], 1.6, '#2f6fd6') + brush([[51, 78], [53.5, 81], [56, 78]], 1.6, '#2f6fd6') +
  brush([[43, 36.5], [46, 34.8], [48.5, 36]], 1.3, '#fff8ee') + brush([[51.5, 35.8], [54, 34.6], [57, 36.3]], 1.3, '#fff8ee') +
  dab(46.2, 39, 2, 2.6, -4) + dab(54, 38.7, 2.1, 2.7, 4) +
  shape([[46.8, 43.5], [50, 42.6], [53.2, 43.5], [50, 49]], BEAK, 'm0') +
  `<g class="m1">${shape([[46.5, 43.5], [53.5, 43.5], [52.5, 50], [50, 52], [47.5, 50]], '#5a2a1a')}${shape([[46.5, 42.8], [50, 41.8], [53.5, 42.8], [50, 46.3]], BEAK)}${shape([[47.6, 50], [52.4, 50], [50, 53.4]], '#e08a22')}</g>`);

const penguin = cut('penguin',
  [[8, 72], [11, 58], [19, 46], [23, 32], [30, 19], [40, 10], [50, 8], [61, 10], [71, 19], [77, 32], [81, 46], [89, 58],
   [92, 72], [86, 74], [80, 66], [80, 78], [72, 89], [60, 93], [50, 94], [40, 93], [28, 89], [20, 78], [20, 66], [14, 74]],
  '#2f3345',
  shape([[30, 40], [32, 28], [41, 23], [50, 29], [59, 23], [68, 28], [70, 40], [72, 58], [72, 76], [64, 88], [50, 91], [36, 88], [28, 76], [28, 58]], '#fffaf0') +
  brush([[36, 13], [50, 10.5], [63, 13.5]], 3.4, '#474c63', '', 0.8) +
  shape([[35.5, 88.5], [44, 86], [47.5, 92], [38, 93.5]], BEAK) + shape([[52.5, 92], [56, 86], [64.5, 88.5], [62, 93.5]], BEAK) +
  dab(41, 36.5, 3, 3.7, -4) + dab(59.5, 36, 3.2, 3.9, 4) +
  shape([[44, 43.5], [50, 41.5], [56, 43.5], [50, 49.5]], BEAK, 'm0') +
  `<g class="m1">${shape([[44.5, 44], [55.5, 44], [54, 51], [50, 53.5], [46, 51]], '#5a2a1a')}${shape([[44, 43], [50, 41], [56, 43], [50, 46.5]], BEAK)}${shape([[46, 50.5], [54, 50.5], [50, 54.5]], '#e08a22')}</g>` +
  shape([[39.5, 56.5], [48.5, 61], [40, 66.5], [38, 61.5]], '#d8344a') + shape([[60.5, 56], [51.5, 61], [60, 67], [62.5, 61.5]], '#d8344a') +
  dab(50, 61.2, 2.7, 3.1, 0, '#b3243a') +
  dab(50, 73, 1.6, 1.8) + dab(50.4, 81, 1.6, 1.8) +
  brush([[31, 47], [34.5, 50], [38, 49.5]], 4, '#f8c6cf', '', 0.75) + brush([[62, 49.5], [65.5, 50], [69, 46.5]], 4, '#f8c6cf', '', 0.75));

// Soft spikes: long and short, each nudged by hand.
const J = [0, 2, -1, 1.5, 1, -1.5, 0, 2, -1, 1, 1.5, -2, 0.5, 1.5, -1, 1, 0];
const quills = J.map((j, i) => {
  const a = Math.PI * (1.12 - (i * 1.24) / 16), r = (i % 2 ? 44 : 35) + j;
  return [+(50 + Math.cos(a) * r * 1.03).toFixed(1), +(56 - Math.sin(a) * r).toFixed(1)];
});
const hedgehog = cut('hedgehog',
  [...quills, [85, 78], [72, 89], [50, 93], [28, 89], [15, 78]],
  '#8b5a3a',
  [[[22, 44], [17, 36]], [[30, 34], [25, 22]], [[40, 28], [38, 16]], [[51, 26], [52, 13]], [[62, 28], [66, 17]], [[71, 34], [78, 24]], [[79, 44], [85, 37]],
   [[19, 58], [13, 54]], [[82, 58], [88, 55]]].map((p) => brush(p, 3, '#6b4128')).join('') +
  [[[26, 40], [22, 31]], [[35, 30], [32, 20]], [[46, 26], [45, 16]], [[57, 26], [59, 15]], [[67, 31], [72, 21]], [[75, 40], [81, 32]]].map((p) => brush(p, 2.2, '#b98556')).join('') +
  shape([[23, 70], [29, 56], [41, 48], [50, 46], [59, 48], [71, 56], [77, 70], [69, 84], [50, 90], [31, 84]], '#f7e1bd') +
  shape([[24, 58], [26, 51], [32, 50], [34, 56], [29, 60]], '#e9b98f') + shape([[66, 55.5], [68.5, 49.5], [74.5, 50.5], [76, 57], [71, 60]], '#e9b98f') +
  dab(40, 64, 3, 3.6, -5) + dab(60, 63.5, 3.2, 3.8, 5) +
  shape([[45.5, 71], [50, 69.5], [54.5, 71], [52, 75.8], [48, 75.8]], INK) +
  brush([[43, 79], [46.7, 82.3], [50, 79.5]], 2.4, INK, 'm0') + brush([[50, 79.5], [53.3, 82.3], [57, 79]], 2.4, INK, 'm0') +
  mouthOpen([[45, 78.5], [50, 77.3], [55, 78.5], [55, 84.5], [50, 87], [45, 84.5]], [[47, 84], [50, 82.8], [53, 84], [52, 86.4], [48, 86.4]]) +
  brush([[29, 71], [33, 74], [37, 73]], 4.2, '#f6b0a8', '', 0.7) + brush([[63, 73.5], [67, 74], [71, 70.5]], 4.2, '#f6b0a8', '', 0.7));

const cricket = cut('cricket',
  [[22, 78], [14, 70], [8, 52], [10, 38], [16, 33], [21, 38], [23, 50], [27, 44], [27, 33], [32, 26], [28, 16], [24, 6],
   [28, 2], [33, 5], [36, 15], [40, 23], [50, 21], [60, 23], [64, 15], [68, 5], [73, 2], [77, 6], [72, 16], [68, 26],
   [73, 33], [73, 44], [77, 50], [79, 38], [84, 33], [90, 38], [92, 52], [86, 70], [78, 78], [66, 88], [50, 92], [34, 88]],
  '#8fc84a',
  brush([[15, 37], [12.5, 52], [19, 71]], 5.5, '#5f9a2e') + brush([[85, 37], [87.5, 52], [81, 71]], 5.5, '#5f9a2e') +
  brush([[14, 44], [11.5, 47]], 1.4, '#3f7420') + brush([[14.5, 52], [11.5, 55]], 1.4, '#3f7420') +
  brush([[86, 44], [88.5, 47]], 1.4, '#3f7420') + brush([[85.5, 52], [88.5, 55]], 1.4, '#3f7420') +
  brush([[34.5, 22], [31, 13], [28.5, 6]], 2.4, '#5f9a2e') + brush([[65.5, 22], [69, 13], [72, 6]], 2.4, '#5f9a2e') +
  shape([[33, 71], [41, 65], [50, 67], [59, 65], [67, 71], [63, 85], [50, 90], [37, 85]], '#d3ea9c') +
  brush([[38, 74], [50, 76.5], [62, 74]], 1.6, '#8fc84a') + brush([[40, 81], [50, 83.5], [60, 81]], 1.6, '#8fc84a') +
  shape([[28.5, 42], [32.5, 34], [42, 33.5], [45.5, 43], [40.5, 50.5], [32, 49.5]], '#fffdf4') +
  shape([[54.5, 43], [58, 33.5], [67.5, 34], [71.5, 42], [68, 49.5], [59.5, 50.5]], '#fffdf4') +
  dab(38, 43, 3, 3.7, -4) + dab(62, 42.5, 3.2, 3.9, 4) +
  brush([[42, 57], [46, 61.5], [50, 62.5], [54, 61.5], [58, 56.5]], 2.6, INK, 'm0') +
  mouthOpen([[43, 56.5], [50, 55], [57, 56.5], [56, 62.5], [50, 65.5], [44, 62.5]], [[46.5, 62.5], [50, 61.3], [53.5, 62.5], [52.5, 64.8], [47.5, 64.8]]) +
  brush([[29, 55], [32.5, 57.5], [36, 57]], 3.8, '#f6b0a8', '', 0.7) + brush([[64, 57], [67.5, 57.5], [71, 55]], 3.8, '#f6b0a8', '', 0.7));

const snail = cut('snail',
  [[6, 74], [8, 62], [6, 48], [4, 38], [8, 32], [13, 36], [14, 48], [18, 52], [19, 42], [19, 32], [24, 28], [28, 33],
   [27, 44], [28, 54], [32, 40], [38, 26], [50, 17], [64, 14], [78, 19], [89, 30], [94, 46], [92, 62], [86, 74],
   [95, 84], [92, 91], [78, 93], [50, 93], [24, 93], [10, 90], [5, 83]],
  '#f6dc8e',
  shape([[30, 57], [32, 40], [38, 26], [50, 16], [64, 13], [78, 18], [90, 30], [95, 46], [93, 62], [86, 77], [70, 81], [50, 81], [36, 75]], '#e9825a') +
  brush([[40, 34], [50, 23], [64, 19]], 3.4, '#f4a482', '', 0.8) +
  brush([[86, 62], [87, 44], [76, 29], [60, 25], [46, 33], [42, 48], [50, 62], [64, 65], [73, 55], [69, 43], [58, 40], [53, 48], [60, 55]], 3.8, '#b9502f') +
  brush([[13, 88], [40, 89], [70, 88], [90, 86]], 2, '#d9b85a') +
  dab(8.6, 36.5, 2.4, 2.9, -8) + dab(23.6, 32.8, 2.6, 3.1, 6) +
  brush([[10, 69], [14.5, 73.5], [21, 70.5]], 2.3, INK, 'm0') +
  mouthOpen([[10.5, 68.5], [16, 67.5], [21.5, 69], [20, 74.5], [15.5, 76.5], [11.5, 74]], [[13.5, 74], [16, 73], [18.5, 74], [17.5, 76], [14.5, 76]]) +
  brush([[20, 62], [23.5, 64.5], [26.5, 63.5]], 3.6, '#f6b0a8', '', 0.7));

// ---------- mats ----------
const leaves = Array.from({ length: 11 }, (_, k) => {
  const a = (Math.PI / 180) * (130 + k * 28);
  const x = 50 + Math.cos(a) * 30, y = 50 - Math.sin(a) * 30;
  return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="10.5" ry="5.2" transform="rotate(${(-(130 + k * 28) + 115).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
}).join('');
const fountainIcon = icon(`<path d="M16 66 H84 C84 82 68 89 50 89 C32 89 16 82 16 66 Z"/><rect x="45.5" y="44" width="9" height="24"/>
<path d="M32 40 H68 C66 48 58 51 50 51 C42 51 34 48 32 40 Z"/>
<path d="M50 36 C50 20 38 14 30 28 M50 36 C50 20 62 14 70 28" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>
<circle cx="28" cy="38" r="3.4"/><circle cx="72" cy="38" r="3.4"/><circle cx="50" cy="14" r="3.6"/>`);
const candleIcon = icon(`<path d="M50 10 C61 23 59 34 50 37 C41 34 39 23 50 10 Z"/><rect x="40" y="42" width="20" height="40" rx="4"/><ellipse cx="50" cy="86" rx="27" ry="6.5"/>`);
const fanIcon = (c) => icon(`<path d="M50 88 L6 58 A53 53 0 0 1 94 58 Z"/><circle cx="50" cy="86" r="6"/>
<path d="M50 84 L21 42 M50 84 L35 36 M50 84 L50 34 M50 84 L65 36 M50 84 L79 42" stroke="${c}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`);

const D = { mel: 62, bass: 50 }, A = { mel: 57, bass: 45 }, Bm = { mel: 59, bass: 47 }, Fsm = { mel: 54, bass: 42 }, G = { mel: 55, bass: 43 };

export default {
  id: 'tutti',

  figures: [
    { id: 'woodpecker', svg: woodpecker },
    { id: 'peacock', svg: peacock },
    { id: 'penguin', svg: penguin },
    { id: 'hedgehog', svg: hedgehog },
    { id: 'cricket', svg: cricket },
    { id: 'snail', svg: snail },
  ],

  mats: [
    { id: 'laurel', color: '#86b86b', deep: '#5d9044', icon: icon(leaves) },
    { id: 'fountain', color: '#74b9e6', deep: '#4a8fc0', icon: fountainIcon },
    { id: 'candle', color: '#9484d6', deep: '#6a5aae', echo: 0.4, rev: 0.6, icon: candleIcon },
    { id: 'fan', color: '#ee8fa6', deep: '#c9647d', icon: fanIcon('#ee8fa6') },
  ],

  look: {
    page: '#e9d9b3',
    table: 'repeating-linear-gradient(92deg, rgba(150,110,40,.045) 0 2px, transparent 2px 13px, rgba(150,110,40,.03) 13px 14px, transparent 14px 29px), linear-gradient(180deg, #f4e9cf, #e9d9b3)',
    trayA: '#a82a3c', trayB: '#8f1f31', trayEdge: '#701626',
    slot: 'rgba(0, 0, 0, .22)',
    veil: 'rgba(60, 20, 30, .4)',
    play: '#caa43c', playDeep: '#a17f22',
    glow: 0.26,
  },

  celebrate: {
    shape: 'petal', count: 70, fall: 0.17, hop: 0.2,
    colors: ['#e8475f', '#f58aa0', '#ffd1dc', '#fff4f0', '#c9304a'],
  },

  song: {
    bpm: 84, stepsPerBeat: 4, beatsPerBar: 4, swing: 0, echoSteps: 4,
    room: { len: 2.2, level: 0.7 },
    key: { tonic: 2, minor: false }, // D major: every chord uses the key's seven notes
    prog: [D, A, Bm, Fsm, G, D, G, A],
  },

  voices: (k) => {
    const v = {
      // kettledrum, tuned to the chord. roll: a soft roll that swells and fades.
      timp(d, t, midi, dur, vol, o = {}) {
        const f = k.mtof(midi);
        if (o.roll) {
          const n = Math.max(3, Math.round(dur / 0.075));
          for (let i = 0; i < n; i++) {
            const x = i / (n - 1);
            k.tone(d, 'sine', f * 1.04, t + i * 0.075, (0.1 + 0.2 * Math.sin(Math.PI * x)) * vol, 0.17, 0.004, f, 0.03);
          }
          return;
        }
        k.tone(d, 'sine', f * 1.08, t, 0.6 * vol, 0.55, 0.003, f, 0.05);
        k.tone(d, 'sine', f * 1.5, t, 0.14 * vol, 0.25, 0.003);
        k.noise(d, t, 0.14 * vol, 0.05, 'lowpass', 900, 0.7, 0.002);
      },
      celesta(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        k.tone(d, 'sine', f, t, 0.26 * vol, 0.9, 0.002);
        k.tone(d, 'sine', f * 2, t, 0.07 * vol, 0.4, 0.002);
        k.tone(d, 'sine', f * 4.1, t, 0.03 * vol, 0.1, 0.001);
      },
      // bowed. soft: slower and rounder.
      cello(d, t, midi, dur, vol, o = {}) {
        const f = k.mtof(midi);
        const a = o.soft ? 0.14 : 0.06, rel = o.soft ? 0.3 : 0.14;
        const end = k.heldEnd(t, a, dur, rel);
        const g = k.held(d, t, a, 0.1 * vol, dur, rel, 0.9);
        const lp = k.filter('lowpass', o.soft ? 900 : 1300, 0.8);
        lp.connect(g);
        const s1 = k.osc('sawtooth', f, t, end, lp);
        const s2 = k.osc('sawtooth', f, t, end, lp);
        s2.detune.value = 7;
        const sub = k.gainNode(0.6);
        sub.connect(g);
        k.osc('triangle', f, t, end, sub);
        if (dur > 0.35) { k.vibrato(s1, f, t, end, 5.2, 0.006, 0.3); k.vibrato(s2, f, t, end, 5.2, 0.006, 0.3); }
      },
      // plucked string
      pizz(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        const dec = Math.min(0.5, 0.36 * Math.pow(200 / f, 0.3));
        const g = k.hit(d, t, 0.003, 0.46 * vol, dec);
        const lp = k.filter('lowpass', f * 6, 0.6);
        lp.frequency.setValueAtTime(Math.min(8000, f * 6), t);
        lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + dec * 0.6);
        lp.connect(g);
        k.osc('sawtooth', f, t, t + dec + 0.05, lp);
        k.tone(d, 'triangle', f, t, 0.3 * vol, dec, 0.003);
      },
      harpsi(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        const dec = Math.min(0.9, 0.6 * Math.pow(330 / f, 0.3));
        const end = t + dec + 0.05;
        const g = k.hit(d, t, 0.002, 0.42 * vol, dec);
        const lp = k.filter('lowpass', 6500, 0.5);
        lp.connect(g);
        k.osc('sawtooth', f, t, end, lp);
        const up = k.gainNode(0.35);
        up.connect(lp);
        k.osc('square', f * 2, t, end, up);
        k.noise(d, t, 0.05 * vol, 0.008, 'highpass', 4000, 0.7, 0.001);
      },
      // soft: slow bow, far away
      violin(d, t, midi, dur, vol, o = {}) {
        const f = k.mtof(midi);
        const a = o.soft ? 0.14 : 0.05, rel = o.soft ? 0.28 : 0.09;
        const len = Math.max(0.08, dur);
        const end = k.heldEnd(t, a, len, rel);
        const g = k.held(d, t, a, (o.soft ? 0.16 : 0.18) * vol, len, rel, 0.9);
        const lp = k.filter('lowpass', o.soft ? 2200 : 3600, 0.6);
        lp.connect(g);
        const s1 = k.osc('sawtooth', f, t, end, lp);
        const half = k.gainNode(0.5);
        half.connect(lp);
        const s2 = k.osc('sawtooth', f, t, end, half);
        s2.detune.value = 5;
        if (len > 0.22) { k.vibrato(s1, f, t, end, 5.8, 0.008, 0.18); k.vibrato(s2, f, t, end, 5.8, 0.008, 0.18); }
      },
      // French horns: round and far away. hi: softer still.
      horn(d, t, midis, dur, vol, o = {}) {
        const short = dur < 0.3;
        const a = o.hi ? 0.22 : short ? 0.03 : 0.09;
        const rel = o.hi ? 0.5 : short ? 0.1 : 0.18;
        const end = k.heldEnd(t, a, dur, rel);
        const g = k.held(d, t, a, (o.hi ? 0.06 : short ? 0.1 : 0.07) * vol, dur, rel, 0.9);
        const lp = k.filter('lowpass', o.hi ? 1500 : 950, 0.5);
        lp.connect(g);
        for (const m of midis) {
          k.osc('sawtooth', k.mtof(m), t, end, lp).detune.value = -4;
          k.osc('triangle', k.mtof(m), t, end, lp).detune.value = 4;
        }
      },
    };
    v.horn.poly = true;
    return v;
  },

  parts: {
    // pulse: kettledrum
    woodpecker: {
      rev: 0.25, root: 'bass',
      mats: [
        { voice: 'timp', bars: ['0.......0...0...'] },
        { voice: 'timp', bars: ['0..0....0..0....'] },
        { voice: 'timp', gate: 1, opt: { roll: true }, bars: ['0-----------....'] },
        { voice: 'timp', vel: 0.55, bars: ['0.000.000.000.00'] },
      ],
      hello: { voice: 'timp', notes: [[0, 0, 0.3], [0, 0.17, 0.3]] },
    },
    // shimmer: celesta
    peacock: {
      rev: 0.35, root: 'mel',
      mats: [
        { voice: 'celesta', oct: 2, bars: ['....4.......2...', '....4.......7...'] },
        { voice: 'celesta', oct: 2, bars: ['..4...7...4...2.', '..2...4...7...4.'] },
        { voice: 'celesta', oct: 2, bars: ['0...............', '........4.......', '2...............', '........0.......'] },
        { voice: 'celesta', oct: 2, vel: 0.5, bars: ['4545454.2323232.', '7676767.4545454.'] },
      ],
      hello: { voice: 'celesta', oct: 2, notes: [[4, 0, 0.3], [7, 0.12, 0.3]] },
    },
    // bass: cello
    penguin: {
      rev: 0.2, root: 'bass',
      mats: [
        { voice: 'cello', gate: 0.95, bars: ['0-------4---2---'] },
        { voice: 'pizz', bars: ['0...4...7...4...'] },
        { voice: 'cello', oct: 1, gate: 0.97, opt: { soft: true }, bars: ['0---------------'] },
        { voice: 'cello', gate: 0.75, bars: ['0.1.2.3.4.3.2.1.'] },
      ],
      hello: { voice: 'pizz', oct: 1, notes: [[0, 0, 0.3]] },
    },
    // pattern: harpsichord
    hedgehog: {
      rev: 0.25, root: 'mel',
      mats: [
        { voice: 'harpsi', bars: ['0.2.4.7.4.2.4.2.'] },
        { voice: 'harpsi', bars: ['0..24..27..42..4'] },
        { voice: 'harpsi', oct: 1, vel: 1.3, bars: ['7.......4.......', '9.......7.......'] },
        { voice: 'harpsi', vel: 0.7, bars: ['0424042404240424', '0123456776543210'] },
      ],
      hello: { voice: 'harpsi', oct: 1, notes: [[0, 0, 0.2], [2, 0.09, 0.2], [4, 0.18, 0.3]] },
    },
    // melody: violin. The first tune is eight bars, one for each chord of the ground.
    cricket: {
      rev: 0.32, root: 'mel',
      mats: [
        { voice: 'violin', oct: 1, gate: 0.95,
          bars: ['2-------4-------', '4-------2-------', '2-------4-------', '4-------2-------',
                 '2-------4-------', '4-------2-------', '2---4---7-------', '4---2-------....'] },
        { voice: 'pizz', oct: 1, vel: 0.8,
          bars: ['7...4...2...4...', '7...4...5.4.2...', '7...4...2...4...', '2...4...7.......'] },
        { voice: 'violin', oct: 1, gate: 0.97, opt: { soft: true },
          bars: ['4---------------', '2---------------', '4---------------', '7---------------'] },
        { voice: 'violin', oct: 1, gate: 0.8,
          bars: ['4.4.5.4.2.2.4.2.', '4545454-2---....', '7.6.5.4.5.4.3.2.', '2323232-4---....'] },
      ],
      hello: { voice: 'violin', oct: 1, notes: [[4, 0, 0.1], [7, 0.13, 0.25]] },
    },
    // harmony: horns
    snail: {
      rev: 0.3, root: 'mel',
      mats: [
        { voice: 'horn', chord: [0, 2, 4], gate: 0.96, bars: ['0---------------'] },
        { voice: 'horn', chord: [0, 2, 4], gate: 0.7, bars: ['0.....0.0.....0.'] },
        { voice: 'horn', chord: [0, 2, 4], gate: 0.96, oct: 1, opt: { hi: true }, bars: ['0---------------'] },
        { voice: 'horn', chord: [0, 2, 4], gate: 0.55, vel: 0.8, bars: ['0.0.0.0.0.0.0.0.'] },
      ],
      hello: { voice: 'horn', chord: [0, 2, 4], vel: 1, notes: [[0, 0, 0.3]] },
    },
  },

  tok: { voice: 'celesta', vel: 0.6, notes: [62, 64, 66, 69, 71, 74, 76, 78, 81, 83] },
  chime: { voice: 'harpsi', vel: 0.6, gap: 0.12, notes: [74, 78, 81] },

  // A drum roll under the waiting chord, then the last chord, all together.
  ending: {
    applause: { people: 64, dur: 5.6, gain: 0.85, lowpass: 5200 },
    play(V, d, t) {
      V.timp(d, t, 45, 0.8, 0.9, { roll: true });
      V.horn(d, t, [57, 61, 64, 67], 0.75, 0.9);
      V.violin(d, t, 76, 0.75, 0.7);
      const t2 = t + 0.9;
      V.timp(d, t2, 50, 0.5, 1);
      V.horn(d, t2, [50, 62, 66, 69], 1.1, 1);
      V.cello(d, t2, 38, 1.1, 0.8);
      V.violin(d, t2, 86, 1.1, 0.7);
      [62, 66, 69, 74, 78, 81, 86].forEach((m, i) => V.harpsi(d, t2 + i * 0.035, m, 0.5, 0.4));
      return t2 + 0.15;
    },
  },
};
