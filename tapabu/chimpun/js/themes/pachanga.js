// Theme: salsa (Pachanga). Six tropical animals on a turquoise table, a dance song with no
// swing. One bar holds a whole clave (two short measures), so every pattern stays lined up
// with it; the chord changes twice a bar. Mats: palm (son, on the beat), pineapple
// (cha-cha-chá), shell (bolero, slow, with echo), chili (mambo, fast and full).

import { INK, TONGUE, icon, cut, shape, brush, dab } from '../art.js?v=5';

// ---------- figures ----------
// Hand-cut, hand-painted, like the band: nothing mirrored, no perfect circles.
const mouthOpen = (pts, tongue) => `<g class="m1">${shape(pts, INK)}${shape(tongue, TONGUE)}</g>`;

const monkey = cut('monkey',
  [[18, 60], [9, 57], [4, 46], [8, 36], [17, 33], [23, 38], [27, 26], [37, 17], [50, 14], [63, 16], [73, 25], [78, 37],
   [84, 31], [93, 35], [96, 46], [91, 56], [82, 60], [84, 71], [77, 82], [64, 90], [50, 92], [35, 90], [23, 82], [17, 71]],
  '#9a6238',
  shape([[9, 46], [12, 39], [18, 39], [20, 47], [15, 53]], '#e8b98a') +
  shape([[81, 46], [83, 38], [89, 38], [92, 46], [87, 53]], '#e8b98a') +
  brush([[43, 17], [48, 23], [53, 15]], 3.4, '#7a4a26') + brush([[52, 18], [57, 22], [61, 17]], 2.8, '#7a4a26') +
  shape([[26, 50], [28, 37], [38, 31], [49, 36], [60, 30], [71, 36], [74, 49], [70, 60], [76, 72], [66, 84], [50, 87], [34, 84], [24, 72], [30, 60]], '#f1d2a4') +
  dab(38, 47, 3.6, 4.3, -6) + dab(62, 46, 3.8, 4.5, 5) +
  brush([[32, 39.5], [37, 37.5], [42.5, 39]], 2.2, '#7a4a26') + brush([[57, 38.5], [62.5, 36.6], [68, 38.5]], 2.2, '#7a4a26') +
  dab(46.3, 61.5, 1.3, 1.9, -8) + dab(53.6, 61, 1.4, 2, 8) +
  brush([[35, 70.5], [42, 77], [50, 78.5], [58, 77], [65, 69.5]], 3, INK, 'm0') +
  mouthOpen([[37, 70], [50, 68], [63, 69.5], [61, 80], [50, 84.5], [39, 80]], [[44, 80], [50, 78], [56, 80], [54, 83.5], [46, 83.5]]) +
  brush([[27, 64], [30, 67.5], [34, 67]], 4.2, '#f2a58f', '', 0.7) + brush([[66, 66.5], [70, 67], [73, 63.5]], 4.2, '#f2a58f', '', 0.7));

const crab = cut('crab',
  [[14, 66], [17, 54], [20, 44], [9, 38], [5, 26], [10, 15], [21, 11], [25, 19], [20, 25], [29, 22], [33, 31], [29, 41],
   [34, 44], [35, 36], [40, 30], [46, 33], [50, 40], [54, 33], [60, 29], [66, 35], [66, 43], [71, 41], [67, 31], [71, 22],
   [80, 25], [75, 19], [79, 11], [90, 14], [95, 25], [92, 37], [81, 44], [83, 54], [86, 66], [82, 78], [68, 87], [50, 89], [32, 87], [18, 78]],
  '#ef5d48',
  shape([[26, 75], [38, 69], [50, 71], [62, 69], [74, 75], [66, 85], [50, 88], [34, 85]], '#f8937c') +
  brush([[10, 30], [12, 21], [19, 16]], 4, '#f8937c', '', 0.8) + brush([[90, 30], [89, 21], [83, 16]], 4, '#f8937c', '', 0.8) +
  brush([[20, 25], [15, 27]], 2.4, '#b83a2a') + brush([[80, 25], [85, 27]], 2.4, '#b83a2a') +
  brush([[17, 62], [22, 68], [28, 70]], 3, '#c9412f') + brush([[16, 70], [21, 76], [27, 78]], 2.8, '#c9412f') +
  brush([[83, 61], [78, 67], [72, 69.5]], 3, '#c9412f') + brush([[84, 70], [79, 76], [73, 78]], 2.8, '#c9412f') +
  shape([[35.5, 38], [37, 32], [43, 31], [46, 37], [42, 42], [37, 41.5]], '#fffdf4') +
  shape([[54.5, 37], [56.5, 31], [63, 30.5], [65.5, 36.5], [62, 41.5], [56, 41]], '#fffdf4') +
  dab(41.3, 36.8, 2.4, 3) + dab(59.8, 36, 2.6, 3.2) +
  dab(30, 56, 1.6, 1.3, 0, '#c9412f') + dab(70.5, 55, 1.7, 1.4, 0, '#c9412f') + dab(50, 49, 1.5, 1.2, 0, '#c9412f') +
  brush([[40, 58], [45, 63.5], [50, 64.5], [55, 63.5], [60, 57.5]], 2.8, INK, 'm0') +
  mouthOpen([[41, 57.5], [50, 56], [59, 57], [58, 65], [50, 68.5], [42, 65]], [[45.5, 65], [50, 63.5], [54.5, 65], [53, 67.6], [47, 67.6]]));

const flamingo = cut('flamingo',
  [[17, 36], [20, 27], [27, 19], [31, 11], [40, 6], [50, 9], [54, 18], [51, 27], [47, 36], [49, 46], [56, 50], [70, 49],
   [84, 56], [92, 68], [86, 81], [72, 89], [55, 91], [40, 87], [31, 77], [32, 64], [36, 54], [35, 44], [36, 34], [32, 30], [26, 33], [22, 39]],
  '#ff8eb1',
  shape([[51, 63], [64, 56], [81, 61], [87, 71], [76, 81], [59, 80]], '#f5689a') +
  brush([[58, 66], [66, 70], [76, 68]], 2.4, '#ffc2d6') + brush([[60, 73], [68, 76], [77, 74.5]], 2.2, '#ffc2d6') +
  brush([[41, 38], [41.5, 47], [40, 58], [38, 70]], 4, '#ffb4cc', '', 0.8) +
  brush([[84, 62], [91, 60]], 3, '#f5689a') + brush([[86, 72], [93, 73]], 3, '#f5689a') +
  shape([[30, 20], [34, 29], [28, 34], [22, 40.5], [15, 37.5], [18.5, 28], [25, 21]], '#fff3df') +
  shape([[15, 37.5], [18, 30.5], [24, 33.5], [22, 40.5]], INK) +
  brush([[19.5, 35.5], [26, 31.5], [31.5, 29]], 1.5, '#c2a078', 'm0') +
  shape([[18, 36.5], [25, 31.5], [31.5, 28.5], [31, 32.5], [24.5, 36.5]], '#7a2d1a', 'm1') +
  dab(41, 17, 2.7, 3.2, -6) +
  brush([[37, 11.5], [41, 9.8], [45.5, 11.3]], 1.8, '#e0557f'));

const toucan = cut('toucan',
  [[14, 58], [15, 40], [21, 25], [32, 15], [45, 12], [55, 17], [68, 17], [82, 22], [92, 32], [96, 44], [92, 50],
   [82, 48], [68, 47], [58, 46], [62, 58], [63, 72], [57, 84], [46, 91], [32, 92], [20, 85], [14, 72]],
  '#2c2832',
  shape([[38, 41], [50, 36], [57, 45], [60, 58], [53, 67], [43, 63], [36, 51]], '#fff6dd') +
  brush([[40, 61], [47, 66], [55, 64.5]], 3, '#ffd23f') +
  shape([[53, 19], [68, 16], [82, 21], [93, 32], [97, 44], [93, 51], [82, 49], [68, 48], [56, 47], [51, 33]], '#ffab2e') +
  brush([[56, 21.5], [70, 19.5], [83, 25], [92, 35]], 4.2, '#ffe066') +
  shape([[88, 30], [97, 41], [96, 49], [90, 51], [86, 40]], '#e8453a') +
  brush([[54, 34.5], [69, 34.5], [83, 37.5], [91, 42.5]], 1.9, '#a85a10', 'm0') +
  shape([[54, 32.5], [72, 33.5], [91, 41], [72, 41.5], [55, 39.5]], '#5a1f14', 'm1') +
  shape([[35, 28.5], [38, 22.5], [44.5, 21.5], [48.5, 27], [46, 33.5], [39, 34]], '#63c3e6') +
  dab(42.2, 28, 2.7, 3.2, 4) +
  brush([[19, 50], [22, 66], [32, 80]], 8, '#47414f') + brush([[24, 54], [28, 66]], 2, '#6a6276') +
  shape([[33, 84], [44, 82], [50, 88], [43, 92.5], [33, 92]], '#e8453a'));

const parrot = cut('parrot',
  [[16, 70], [14, 54], [18, 38], [26, 24], [38, 15], [46, 13], [48, 6], [54, 4], [57, 10], [55, 14], [66, 17], [77, 26],
   [84, 40], [87, 55], [85, 70], [78, 83], [64, 91], [50, 93], [36, 91], [22, 83]],
  '#e8473c',
  brush([[50, 15], [51, 8], [54.5, 6.5]], 2.6, '#f77a6c') +
  brush([[16, 60], [19, 74], [29, 86]], 8.5, '#ffd23f') + brush([[14.5, 71], [20, 81], [29, 89]], 5, '#3f8fe0') +
  brush([[85, 60], [82, 74], [72, 86]], 8.5, '#ffd23f') + brush([[86, 72], [80, 82], [71, 89.5]], 5, '#3f8fe0') +
  brush([[40, 78], [43, 81.5], [46, 78]], 2, '#c2332a') + brush([[54, 78.5], [57, 82], [60, 78.5]], 2, '#c2332a') + brush([[47, 85], [50, 88.5], [53, 85]], 2, '#c2332a') +
  shape([[23, 45], [28, 35], [40, 33.5], [45.5, 43], [41, 54], [30, 55]], '#fff8ee') +
  shape([[55, 43], [60.5, 33.5], [72, 34], [78, 44], [72.5, 55], [60, 54]], '#fff8ee') +
  brush([[27, 49], [32, 51.5]], 1.3, '#e8a59c') + brush([[28, 44.5], [32, 46.5]], 1.3, '#e8a59c') +
  brush([[73.5, 49], [68.5, 51.5]], 1.3, '#e8a59c') + brush([[72.5, 44.5], [68.5, 46.5]], 1.3, '#e8a59c') +
  dab(36, 44, 3.2, 3.8, -4) + dab(65.5, 43.5, 3.4, 4, 4) +
  `<g class="m0">${shape([[44, 61], [50, 64.5], [57, 61], [54.5, 69.5], [50, 71.5], [45.5, 69.5]], '#3b2a1f')}</g>` +
  `<g class="m1">${shape([[43, 62], [50, 66], [58, 62], [56.5, 76], [50, 79.5], [43.5, 76]], '#3b2a1f')}${shape([[46.5, 71], [50, 69.5], [53.5, 71], [52.5, 75.5], [47.5, 75.5]], TONGUE)}</g>` +
  shape([[40.5, 48.5], [50, 44], [60.5, 48], [58.5, 59], [51.5, 68], [47, 64.5], [42.5, 58.5]], '#f7e9c8') +
  shape([[47, 61], [51.5, 68], [55, 62.5], [51.5, 60]], '#b9a27a'));

const pelican = cut('pelican',
  [[14, 50], [22, 40], [20, 26], [27, 14], [39, 7], [50, 5], [62, 7], [73, 14], [80, 26], [78, 40], [86, 50], [93, 64],
   [90, 78], [78, 86], [66, 88], [60, 95], [50, 98], [40, 95], [34, 88], [22, 86], [10, 78], [7, 64]],
  '#fbf4e6',
  brush([[10, 60], [13, 74], [23, 83]], 7, '#e2d6bf') + brush([[18, 58], [22, 70], [29, 78]], 3, '#efe6d2') +
  brush([[90, 61], [87, 74], [77, 83]], 7, '#e2d6bf') + brush([[82, 58], [78, 70], [71, 78]], 3, '#efe6d2') +
  brush([[36, 12], [50, 8.5], [64, 12]], 4, '#ffe9a8', '', 0.8) +
  shape([[37, 36], [50, 33], [63, 36.5], [67, 56], [69, 74], [62, 90], [50, 97], [38, 90], [31, 74], [33, 56]], '#ffc94a') +
  `<g class="m1">${shape([[34.5, 62], [42.5, 66], [43, 84], [40, 90], [33.5, 76]], '#b0531a')}${shape([[65.5, 62], [57.5, 66], [57, 84], [60, 90], [66.5, 76]], '#b0531a')}</g>` +
  brush([[35, 60], [36, 74], [41, 86]], 1.6, '#e0a02a', 'm0') + brush([[65, 60], [64.5, 74], [59.5, 86]], 1.6, '#e0a02a', 'm0') +
  shape([[42, 35], [50, 33], [58.5, 35.5], [57.5, 60], [54.5, 84], [50, 90.5], [46, 84], [43, 60]], '#ff9a2e') +
  brush([[50, 38], [50.5, 60], [50, 82]], 1.6, '#d9741d') +
  dab(50, 88.5, 2.6, 2.1, 0, '#e8553a') +
  dab(37, 25.5, 3.2, 3.9, -5) + dab(63, 24.5, 3.4, 4.1, 5) +
  brush([[32, 19], [37, 17.3], [42, 18.8]], 2, '#c9b890') + brush([[58, 18], [63, 16.4], [68, 18.2]], 2, '#c9b890') +
  brush([[25, 34], [29, 37], [33, 36]], 4, '#f8c6cf', '', 0.7) + brush([[67, 36.5], [71, 37], [75, 33.5]], 4, '#f8c6cf', '', 0.7));

// ---------- mats ----------
const palmIcon = icon(`<path d="M45 92 C45 68 49 54 55 41 L62 44 C57 56 55 70 56 92 Z"/>
<path d="M58 42 C44 28 26 30 12 44 C28 38 44 40 58 47 Z"/><path d="M58 42 C50 22 34 12 18 15 C32 21 46 30 55 45 Z"/>
<path d="M58 42 C62 24 76 12 92 15 C80 21 69 31 62 45 Z"/><path d="M58 42 C72 31 88 35 95 50 C83 42 71 42 60 47 Z"/>
<circle cx="54" cy="47" r="5"/><circle cx="63" cy="48" r="4.5"/>`);
const pineIcon = (c) => icon(`<path d="M50 40 L41 14 L50 25 L58 9 L57 27 L69 17 L60 40 Z"/>
<ellipse cx="50" cy="64" rx="22" ry="27"/>
<path d="M33 52 L62 86 M30 66 L50 90 M44 40 L71 72 M67 52 L38 86 M70 66 L50 90 M56 40 L29 72" stroke="${c}" stroke-width="2.6" fill="none"/>`);
const shellIcon = (c) => icon(`<path d="M50 88 L10 46 C12 16 88 16 90 46 Z"/><rect x="38" y="82" width="24" height="9" rx="4"/>
<path d="M50 84 L24 34 M50 84 L38 25 M50 84 L50 22 M50 84 L62 25 M50 84 L76 34" stroke="${c}" stroke-width="3" stroke-linecap="round" fill="none"/>`);
const chiliIcon = icon(`<path d="M34 30 C20 50 30 80 72 90 C82 92 87 86 81 82 C58 74 52 54 55 36 C50 26 40 24 34 30 Z"/>
<path d="M46 28 C46 18 52 12 60 12" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/>`);

export default {
  id: 'pachanga',

  figures: [
    { id: 'monkey', svg: monkey },
    { id: 'crab', svg: crab },
    { id: 'flamingo', svg: flamingo },
    { id: 'toucan', svg: toucan },
    { id: 'parrot', svg: parrot },
    { id: 'pelican', svg: pelican },
  ],

  mats: [
    { id: 'palm', color: '#8fd45c', deep: '#5fae35', icon: palmIcon },
    { id: 'pineapple', color: '#ffd04a', deep: '#e0a62a', icon: pineIcon('#ffd04a') },
    { id: 'shell', color: '#ff93b4', deep: '#e0648b', echo: 0.42, rev: 0.45, icon: shellIcon('#ff93b4') },
    { id: 'chili', color: '#f0553f', deep: '#c43424', icon: chiliIcon },
  ],

  look: {
    page: '#1d949c',
    table: 'repeating-linear-gradient(92deg, rgba(255,255,255,.05) 0 2px, transparent 2px 11px, rgba(0,40,50,.05) 11px 12px, transparent 12px 27px), linear-gradient(180deg, #2bb5b2, #1d949c)',
    trayA: '#f27a5e', trayB: '#e2634a', trayEdge: '#c84e38',
    slot: 'rgba(90, 20, 0, .2)',
    veil: 'rgba(8, 60, 70, .45)',
    play: '#ffb52e', playDeep: '#d98a12',
    glow: 0.28,
  },

  celebrate: {
    shape: 'confetti', count: 180, fall: 0.36, hop: 0.34,
    colors: ['#ff5d48', '#ffd04a', '#8fd45c', '#2bb5b2', '#ff93b4', '#ff9d3f', '#ffffff'],
  },

  song: {
    bpm: 88, stepsPerBeat: 4, beatsPerBar: 4, swing: 0, echoSteps: 3,
    chordSteps: 8, // two chords a bar
    room: { len: 1.1, level: 0.5 },
    prog: [
      { mel: 60, bass: 48, min: false }, // C
      { mel: 53, bass: 41, min: false }, // F
      { mel: 55, bass: 43, min: false }, // G
      { mel: 53, bass: 41, min: false }, // F
      { mel: 57, bass: 45, min: true },  // Am
      { mel: 53, bass: 41, min: false }, // F
      { mel: 55, bass: 43, min: false }, // G
      { mel: 55, bass: 43, min: false }, // G
    ],
  },

  voices: (k) => {
    const v = {
      // kind: 'open' a ringing tone, 'low' the big drum, 'slap' a sharp crack, 'heel' a soft tap
      conga(d, t, vol, kind = 'open') {
        if (kind === 'slap') {
          k.noise(d, t, 0.5 * vol, 0.05, 'bandpass', 2600, 1.4, 0.001);
          k.tone(d, 'triangle', 520, t, 0.25 * vol, 0.04, 0.001, 420, 0.03);
        } else if (kind === 'heel') {
          k.tone(d, 'sine', 175, t, 0.3 * vol, 0.07, 0.003, 135, 0.04);
          k.noise(d, t, 0.06 * vol, 0.03, 'lowpass', 700, 0.7, 0.002);
        } else {
          const f = kind === 'low' ? 165 : 245;
          k.tone(d, 'sine', f * 1.12, t, 0.7 * vol, kind === 'low' ? 0.34 : 0.26, 0.002, f, 0.04);
          k.tone(d, 'sine', f * 2.2, t, 0.12 * vol, 0.08, 0.002);
          k.noise(d, t, 0.12 * vol, 0.025, 'bandpass', 1500, 1, 0.001);
        }
      },
      clave(d, t, vol) {
        k.tone(d, 'sine', 2350, t, 0.34 * vol, 0.07, 0.001);
        k.tone(d, 'sine', 5350, t, 0.06 * vol, 0.03, 0.001);
        k.noise(d, t, 0.1 * vol, 0.006, 'highpass', 3000, 0.7, 0.001);
      },
      // cowbell: two rough tones through a narrow band. open rings on.
      bell(d, t, vol, open) {
        const dec = open ? 0.3 : 0.1;
        const g = k.hit(d, t, 0.001, 0.3 * vol, dec);
        const bp = k.filter('bandpass', 760, 2.2);
        bp.connect(g);
        k.osc('square', 545, t, t + dec + 0.05, bp);
        k.osc('square', 818, t, t + dec + 0.05, bp);
      },
      // a scraped gourd: a row of tiny ticks. long is the slow scrape.
      guiro(d, t, vol, long) {
        const n = long ? 10 : 3;
        for (let i = 0; i < n; i++) k.noise(d, t + i * 0.017, (0.6 + 0.3 * (i / n)) * vol, 0.012, 'bandpass', 3400 + i * 90, 3, 0.002);
      },
      // someone in the crowd whistles: up, and up again
      whistle(d, t, vol) {
        const g = k.held(d, t, 0.02, 0.06 * vol, 0.5, 0.1, 0.9);
        const o = k.osc('sine', 1500, t, t + 0.75, g);
        o.frequency.exponentialRampToValueAtTime(2700, t + 0.17);
        o.frequency.setValueAtTime(1700, t + 0.25);
        o.frequency.exponentialRampToValueAtTime(3000, t + 0.5);
      },
      // a round, thumpy bass that rings on after it is plucked
      baby(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        k.tone(d, 'sine', f * 1.06, t, 0.5 * vol, 0.5, 0.006, f, 0.04);
        k.tone(d, 'triangle', f * 2, t, 0.1 * vol, 0.22, 0.006);
        const g = k.hit(d, t, 0.004, 0.22 * vol, 0.14);
        const lp = k.filter('lowpass', 600, 0.8);
        lp.connect(g);
        k.osc('sawtooth', f, t, t + 0.2, lp);
      },
      piano(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        const dec = Math.min(0.7, 0.5 * Math.pow(330 / f, 0.35));
        const end = t + dec + 0.05;
        const g = k.hit(d, t, 0.003, 0.2 * vol, dec);
        const lp = k.filter('lowpass', Math.min(6000, f * 6), 0.5);
        lp.connect(g);
        k.osc('sawtooth', f, t, end, lp).detune.value = -5;
        k.osc('sawtooth', f, t, end, lp).detune.value = 6;
        k.tone(d, 'triangle', f, t, 0.18 * vol, dec * 1.2, 0.003);
      },
      // brass: the tone opens up as the note starts. mute: thin and far away.
      trumpet(d, t, midi, dur, vol, o = {}) {
        const f = k.mtof(midi);
        const a = 0.025, rel = 0.07;
        const len = Math.max(0.09, dur);
        const end = k.heldEnd(t, a, len, rel);
        const g = k.held(d, t, a, (o.mute ? 0.2 : 0.23) * vol, len, rel, 0.8);
        const lp = k.filter('lowpass', f * 1.5, 1.2);
        lp.frequency.setValueAtTime(f * 1.5, t);
        lp.frequency.linearRampToValueAtTime(f * (o.mute ? 2.6 : 5), t + 0.05);
        lp.frequency.setTargetAtTime(f * (o.mute ? 2 : 3.2), t + 0.05, 0.12);
        if (o.mute) { const hp = k.filter('highpass', 900, 0.7); lp.connect(hp); hp.connect(g); } else lp.connect(g);
        const main = k.osc('sawtooth', f * 0.97, t, end, lp, f, 0.03);
        if (len > 0.3) k.vibrato(main, f, t, end, 5.5, 0.007, 0.25);
      },
      // a row of trombones: long chords or short stabs. hi: soft and far away.
      bones(d, t, midis, dur, vol, o = {}) {
        const stab = dur < 0.3;
        const a = o.hi ? 0.2 : stab ? 0.015 : 0.05;
        const rel = o.hi ? 0.4 : stab ? 0.08 : 0.12;
        const end = k.heldEnd(t, a, dur, rel);
        const g = k.held(d, t, a, (o.hi ? 0.07 : stab ? 0.1 : 0.07) * vol, dur, rel, 0.85);
        const top = o.hi ? 1500 : stab ? 2200 : 1400;
        const lp = k.filter('lowpass', 500, 0.9);
        lp.frequency.setValueAtTime(500, t);
        lp.frequency.linearRampToValueAtTime(top, t + a + 0.03);
        lp.frequency.setTargetAtTime(top * 0.7, t + a + 0.03, 0.15);
        lp.connect(g);
        for (const m of midis) for (const det of [-6, 6]) k.osc('sawtooth', k.mtof(m), t, end, lp).detune.value = det;
      },
    };
    v.bones.poly = true;
    return v;
  },

  parts: {
    // pulse: congas, and a cowbell on the lively mats
    monkey: {
      rev: 0.08,
      hits: { o: ['conga', 'open'], l: ['conga', 'low'], s: ['conga', 'slap'], t: ['conga', 'heel', 0.7], B: ['bell', true], b: ['bell', false, 0.75] },
      mats: [
        [['..s...oo..s...oo', 't...t...t...t...']],
        [['..s...oo..s...oo', 'B.b.B.b.B.b.B.b.']],
        [['l.....o.....t.o.']],
        [['ttstttoottstlloo', 'B.b.B.bbB.b.B.bb']],
      ],
      hello: [['s', 0], ['o', 0.13], ['o', 0.26]],
    },
    // shimmer: claves, gourd and maracas
    crab: {
      rev: 0.12,
      hits: { c: ['clave'], X: ['shake', true], x: ['shake', false], G: ['guiro', true], g: ['guiro', false] },
      mats: [
        [['..c.c...c..c..c.']],
        [['G.ggG.ggG.ggG.gg']],
        [['X...x.x.X...x.x.']],
        [['XxXxXxXxXxXxXxXx', '..c.c...c..c..c.']],
      ],
      hello: [['c', 0], ['c', 0.15]],
    },
    // bass
    flamingo: {
      rev: 0.05, root: 'bass',
      mats: [
        { voice: 'baby', bars: ['0...3...0...3...'] },
        { voice: 'baby', bars: ['0..3..5.0..3..5.'] },
        { voice: 'baby', oct: 1, bars: ['0.......0.....3.'] },
        // the real tumbao: the last note of each chord is already the next chord's
        { voice: 'baby', ahead: 2, bars: ['...3..0....3..0.'] },
      ],
      hello: { voice: 'baby', oct: 1, notes: [[0, 0, 0.3]] },
    },
    // pattern: piano
    toucan: {
      rev: 0.14, root: 'mel',
      mats: [
        { voice: 'piano', chord: [0, 5], bars: ['0.2.3.2.0.2.3.2.'] },
        { voice: 'piano', chord: [0, 5], bars: ['0..2.3..0..2.3..', '0..2.3..0..3.5..'] },
        { voice: 'piano', oct: 1, vel: 1.5, bars: ['5.......3.......', '5.......7.......'] },
        // the montuno
        { voice: 'piano', chord: [0, 5], ahead: 1, vel: 0.85, bars: ['0.23.5.3.2.3.5.3'] },
      ],
      hello: { voice: 'piano', chord: [0, 5], notes: [[0, 0, 0.2], [2, 0.1, 0.2], [3, 0.2, 0.2]] },
    },
    // melody: trumpet. The song is four bars long, and so is each tune.
    parrot: {
      rev: 0.22, root: 'mel',
      mats: [
        { voice: 'trumpet', oct: 1,
          bars: ['3---2---2-------', '2---0---2-------', '3---2---3---2---', '0---2-------....'] },
        { voice: 'trumpet', oct: 1, gate: 0.8,
          bars: ['3.3.2...2.2.0...', '2.2.0...2---....', '3.3.2...3.3.2...', '2.0.2-------....'] },
        { voice: 'trumpet', oct: 1, gate: 0.95, opt: { mute: true },
          bars: ['5-------4-------', '3-------4-------', '5-------5-------', '4---------------'] },
        { voice: 'trumpet', oct: 1, gate: 0.8,
          bars: ['5.5..5.3.5.5..3.', '5.5..5.3.2-.....', '5.5..5.3.5.5..3.', '.3.5.3.5.7-.....'] },
      ],
      hello: { voice: 'trumpet', oct: 1, notes: [[3, 0, 0.1], [5, 0.13, 0.22]] },
    },
    // harmony: trombones
    pelican: {
      rev: 0.18, root: 'mel',
      mats: [
        { voice: 'bones', chord: [0, 2, 3], gate: 0.92, bars: ['0-------0-------'] },
        { voice: 'bones', chord: [0, 2, 3], gate: 0.8, bars: ['0.....000.....00'] },
        { voice: 'bones', chord: [0, 2, 3], gate: 0.96, oct: 1, opt: { hi: true }, bars: ['0-------0-------'] },
        { voice: 'bones', chord: [0, 2, 3], gate: 0.8, bars: ['..0.0...0..0..0.'] },
      ],
      hello: { voice: 'bones', chord: [0, 2, 3], vel: 1, notes: [[0, 0, 0.26]] },
    },
  },

  tok: { voice: 'piano', vel: 0.6, notes: [60, 62, 64, 67, 69, 72, 74, 76, 79, 81] },
  chime: { voice: 'piano', vel: 0.8, gap: 0.12, notes: [67, 72, 76] },

  // "Cha-cha-chá!": three hits together, then the crowd, with a couple of whistles.
  ending: {
    applause: { people: 60, dur: 5.2, gain: 0.95 },
    play(V, d, t) {
      const all = (at, root, vol) => {
        V.bones(d, at, [root, root + 4, root + 7], 0.1, vol);
        V.piano(d, at, root + 12, 0.2, vol * 0.8);
        V.piano(d, at, root + 24, 0.2, vol * 0.8);
        V.conga(d, at, vol, 'slap');
        V.bell(d, at, vol * 0.8, false);
      };
      all(t, 55, 0.8);
      all(t + 0.17, 55, 0.8);
      const t2 = t + 0.34;
      V.bones(d, t2, [60, 64, 67, 72], 0.5, 1);
      [48, 60, 72, 76, 79, 84].forEach((m) => V.piano(d, t2, m, 0.3, 0.8));
      V.conga(d, t2, 1, 'low');
      V.bell(d, t2, 1, true);
      V.cymbal(d, t2, 1);
      V.whistle(d, t2 + 0.9, 1);
      V.whistle(d, t2 + 2.3, 0.7);
      return t2;
    },
  },
};
