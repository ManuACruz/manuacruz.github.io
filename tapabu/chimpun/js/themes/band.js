// Theme: the band (Chimpún). Six wooden animals on a wooden table, a bright song in four
// beats with a little swing. Mats: sun (plain), flower (bouncy), cloud (high, slow, with
// echo), leaf (fast).

import { INK, TONGUE, eye, cheek, line, wrap, icon } from '../art.js?v=5';

// ---------- figures ----------
const bear = wrap('bear',
  `<circle cx="26" cy="27" r="15"/><circle cx="74" cy="27" r="15"/><ellipse cx="50" cy="55" rx="38" ry="35"/>`,
  '#c2813f',
  `<circle cx="26" cy="27" r="8" fill="#eab57e"/><circle cx="74" cy="27" r="8" fill="#eab57e"/>
<ellipse cx="50" cy="55" rx="38" ry="35" fill="#c2813f"/>
<ellipse cx="50" cy="67" rx="17" ry="13.5" fill="#f5dab0"/>
<ellipse cx="50" cy="60" rx="6.5" ry="4.6" fill="${INK}"/>
${line('M43 68.5 Q50 75 57 68.5', 2.6, INK, 'm0')}
<g class="m1"><ellipse cx="50" cy="71" rx="5.6" ry="6.2" fill="${INK}"/><ellipse cx="50" cy="74" rx="3.3" ry="2.4" fill="${TONGUE}"/></g>
${eye(35, 49)}${eye(65, 49)}${cheek(25, 62)}${cheek(75, 62)}`);

const bunny = wrap('bunny',
  `<ellipse cx="35" cy="24" rx="10" ry="25" transform="rotate(-9 35 24)"/><ellipse cx="65" cy="24" rx="10" ry="25" transform="rotate(9 65 24)"/><ellipse cx="50" cy="64" rx="34" ry="31"/>`,
  '#fff6ea',
  `<ellipse cx="35" cy="24" rx="5" ry="17" transform="rotate(-9 35 24)" fill="#ffb9c8"/><ellipse cx="65" cy="24" rx="5" ry="17" transform="rotate(9 65 24)" fill="#ffb9c8"/>
<ellipse cx="50" cy="64" rx="34" ry="31" fill="#fff6ea"/>
<path d="M46.5 67 h7 l-3.5 4.2 z" fill="${TONGUE}" stroke="${TONGUE}" stroke-width="1.5" stroke-linejoin="round"/>
${line('M50 72 q-4 5.5 -9 2.5 M50 72 q4 5.5 9 2.5', 2.4, INK, 'm0')}
<g class="m1"><ellipse cx="50" cy="78" rx="5.4" ry="6" fill="${INK}"/><rect x="47" y="72.5" width="6" height="4.6" rx="1" fill="#fff"/></g>
${eye(37, 59)}${eye(63, 59)}${cheek(27, 71)}${cheek(73, 71)}`);

const frog = wrap('frog',
  `<circle cx="29" cy="33" r="16"/><circle cx="71" cy="33" r="16"/><ellipse cx="50" cy="62" rx="39" ry="30"/>`,
  '#78c950',
  `<ellipse cx="50" cy="74" rx="27" ry="16" fill="#bfe993"/>
<circle cx="29" cy="32" r="10.5" fill="#fff"/><circle cx="71" cy="32" r="10.5" fill="#fff"/>
${eye(29, 33, 5.4)}${eye(71, 33, 5.4)}
<circle cx="46" cy="52" r="1.3" fill="#3f7d27"/><circle cx="54" cy="52" r="1.3" fill="#3f7d27"/>
${line('M27 63 Q50 83 73 63', 3, '#2c3a1c', 'm0')}
<g class="m1"><path d="M27 63 Q50 93 73 63 Z" fill="#2c3a1c" stroke="#2c3a1c" stroke-width="3" stroke-linejoin="round"/><ellipse cx="50" cy="76" rx="9" ry="4.6" fill="${TONGUE}"/></g>
${cheek(21, 60, 4.6)}${cheek(79, 60, 4.6)}`);

const cat = wrap('cat',
  `<path d="M15 46 L21 8 L48 28 Z"/><path d="M85 46 L79 8 L52 28 Z"/><ellipse cx="50" cy="58" rx="37" ry="32"/>`,
  '#f6a23c',
  `<path d="M23 35 L25.5 18 L38 27.5 Z" fill="#ffd0b5"/><path d="M77 35 L74.5 18 L62 27.5 Z" fill="#ffd0b5"/>
<ellipse cx="50" cy="58" rx="37" ry="32" fill="#f6a23c"/>
${line('M50 28 v10 M41 30 l2 8 M59 30 l-2 8', 3.2, '#d97f1f')}
<ellipse cx="50" cy="69" rx="15.5" ry="10.5" fill="#fff3e0"/>
<path d="M46.5 62.5 h7 l-3.5 4 z" fill="${TONGUE}" stroke="${TONGUE}" stroke-width="1.5" stroke-linejoin="round"/>
${line('M50 67 q-4 6 -9 3 M50 67 q4 6 9 3', 2.4, INK, 'm0')}
<g class="m1"><ellipse cx="50" cy="72.5" rx="5.2" ry="5.8" fill="${INK}"/><ellipse cx="50" cy="75.3" rx="3" ry="2.2" fill="${TONGUE}"/></g>
${line('M30 66 L15 62 M30 70.5 L15 73 M70 66 L85 62 M70 70.5 L85 73', 1.6, '#8a5412')}
${eye(36, 52)}${eye(64, 52)}`);

const bird = wrap('bird',
  `<ellipse cx="43" cy="17" rx="5.5" ry="11" transform="rotate(-22 43 17)"/><ellipse cx="57" cy="17" rx="5.5" ry="11" transform="rotate(22 57 17)"/><ellipse cx="50" cy="14" rx="5.5" ry="12"/><circle cx="50" cy="57" r="36"/>`,
  '#4aa9ee',
  `<ellipse cx="50" cy="73" rx="22" ry="17" fill="#d3ecff"/>
<ellipse cx="17" cy="62" rx="6.5" ry="14" transform="rotate(14 17 62)" fill="#2f88cf"/><ellipse cx="83" cy="62" rx="6.5" ry="14" transform="rotate(-14 83 62)" fill="#2f88cf"/>
<path class="m0" d="M41 57 L59 57 L50 69 Z" fill="#ffb02e" stroke="#ffb02e" stroke-width="3" stroke-linejoin="round"/>
<g class="m1"><ellipse cx="50" cy="63.5" rx="6.5" ry="5" fill="#7a2d1a"/><path d="M40 55 L60 55 L50 61 Z" fill="#ffb02e" stroke="#ffb02e" stroke-width="3" stroke-linejoin="round"/><path d="M43 68 L57 68 L50 75 Z" fill="#f08a1c" stroke="#f08a1c" stroke-width="3" stroke-linejoin="round"/></g>
${eye(36, 47)}${eye(64, 47)}${cheek(27, 60)}${cheek(73, 60)}`);

const elephant = wrap('elephant',
  `<ellipse cx="17" cy="45" rx="17" ry="24"/><ellipse cx="83" cy="45" rx="17" ry="24"/><ellipse cx="50" cy="46" rx="29" ry="31"/><rect x="41" y="50" width="18" height="44" rx="9"/>`,
  '#aaa6df',
  `<ellipse cx="16" cy="45" rx="10" ry="16" fill="#f8b8ce"/><ellipse cx="84" cy="45" rx="10" ry="16" fill="#f8b8ce"/>
<ellipse cx="50" cy="46" rx="29" ry="31" fill="#aaa6df"/><rect x="41" y="50" width="18" height="44" rx="9" fill="#aaa6df"/>
${line('M45 68 h10 M45 76 h10 M45 84 h10', 1.9, '#8782c6')}
<ellipse class="m1" cx="50" cy="93" rx="12.5" ry="5.5" fill="#8782c6"/>
${eye(37, 41)}${eye(63, 41)}${cheek(30, 54)}${cheek(70, 54)}`);

// ---------- mats ----------
const rays = Array.from({ length: 8 }, (_, k) => {
  const a = (k * Math.PI) / 4;
  const p = (r) => `${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`;
  return `M${p(30)} L${p(41)}`;
}).join(' ');
const petals = Array.from({ length: 5 }, (_, k) => {
  const a = -Math.PI / 2 + (k * Math.PI * 2) / 5;
  return `<circle cx="${(50 + Math.cos(a) * 21).toFixed(1)}" cy="${(50 + Math.sin(a) * 21).toFixed(1)}" r="15"/>`;
}).join('');

export default {
  id: 'band',

  figures: [
    { id: 'bear', svg: bear },
    { id: 'bunny', svg: bunny },
    { id: 'frog', svg: frog },
    { id: 'cat', svg: cat },
    { id: 'bird', svg: bird },
    { id: 'elephant', svg: elephant },
  ],

  mats: [
    { id: 'sun', color: '#ffd35a', deep: '#e0a92a',
      icon: icon(`<circle cx="50" cy="50" r="20"/><path d="${rays}" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`) },
    { id: 'flower', color: '#ff9db8', deep: '#e0708f',
      icon: icon(`${petals}<circle cx="50" cy="50" r="11" fill="#ffd35a"/>`) },
    { id: 'cloud', color: '#8ecbff', deep: '#5c9fdb', echo: 0.45, rev: 0.45,
      icon: icon(`<circle cx="33" cy="57" r="16"/><circle cx="51" cy="45" r="21"/><circle cx="70" cy="57" r="15"/><rect x="33" y="52" width="37" height="21" rx="8"/>`) },
    { id: 'leaf', color: '#9ddf82', deep: '#66b453',
      icon: icon(`<path d="M50 12 C84 26 86 64 50 90 C14 64 16 26 50 12 Z"/><path d="M50 26 V78 M50 44 L36 34 M50 44 L64 34 M50 60 L36 50 M50 60 L64 50" stroke="#9ddf82" stroke-width="3.5" stroke-linecap="round" fill="none"/>`) },
  ],

  look: {}, // the wooden table is the default look in style.css

  celebrate: {
    shape: 'confetti', count: 150, fall: 0.34, hop: 0.3,
    colors: ['#ff6b6b', '#ffd35a', '#6bcb77', '#4aa9ee', '#ff9db8', '#b28dff', '#ffffff'],
  },

  song: {
    bpm: 100, stepsPerBeat: 4, beatsPerBar: 4, swing: 0.12, echoSteps: 3,
    room: { len: 1.3, level: 0.6 },
    prog: [
      { mel: 60, bass: 48, min: false }, // C
      { mel: 57, bass: 45, min: true },  // Am
      { mel: 53, bass: 41, min: false }, // F
      { mel: 55, bass: 43, min: false }, // G
      { mel: 60, bass: 48, min: false }, // C
      { mel: 57, bass: 45, min: true },  // Am
      { mel: 62, bass: 50, min: true },  // Dm
      { mel: 55, bass: 43, min: false }, // G
    ],
  },

  parts: {
    // pulse
    bear: {
      rev: 0.06,
      hits: { k: ['kick'], s: ['snare'], c: ['clap'], t: ['tom', 150], T: ['tom', 215], w: ['wood'] },
      mats: [
        [['k.......k.k.....', '....s.......s...']],
        [['k..k....k..k....', '....c.......c.c.']],
        [['t.....T...t.T...', '..w.....w.....w.']],
        [['k.k...k.k.k...k.', '....s.......s.ss', '..w...w...w...w.']],
      ],
      hello: [['T', 0], ['t', 0.13]],
    },
    // shimmer
    bunny: {
      rev: 0.1,
      hits: { X: ['shake', true], x: ['shake', false], j: ['tamb'], g: ['triangle'] },
      mats: [
        [['X.x.X.x.X.x.X.x.']],
        [['..j...j...j..jj.']],
        [['g.......g.....g.']],
        [['XxxxXxxxXxxxXxxx']],
      ],
      hello: [['X', 0], ['x', 0.1], ['X', 0.2]],
    },
    // bass
    frog: {
      rev: 0.05, root: 'bass',
      mats: [
        { voice: 'bass', bars: ['0-----..0---3---', '0-----..0---2-3-'] },
        { voice: 'bass', bars: ['0..5..0...3.5...'] },
        { voice: 'bass', oct: 1, opt: { hi: true }, bars: ['0.....3.....5...'] },
        { voice: 'bass', bars: ['0.0.3.3.5.5.3.2.', '0.0.3.3.5.3.2.1.'] },
      ],
      hello: { voice: 'bass', oct: 1, notes: [[0, 0, 0.24]] },
    },
    // pattern
    cat: {
      rev: 0.2, root: 'mel',
      mats: [
        { voice: 'marimba', bars: ['0.2.3.5.3.2.3.2.'] },
        { voice: 'marimba', bars: ['0..2..3.5..3..2.', '0..2..3.5..7..5.'] },
        { voice: 'glock', oct: 1, bars: ['5.....3...7.....', '5.....8...7.....'] },
        { voice: 'marimba', vel: 0.8, bars: ['0235323502357532', '0235323575323532'] },
      ],
      hello: { voice: 'marimba', oct: 1, notes: [[0, 0, 0.2], [2, 0.11, 0.2]] },
    },
    // melody
    bird: {
      rev: 0.24, root: 'mel',
      mats: [
        { voice: 'flute', oct: 1, gate: 0.92,
          bars: ['2---3---5-------', '4---3---2-------', '2---3---5---4---', '3-------........'] },
        { voice: 'flute', oct: 1, gate: 0.92,
          bars: ['5..3..2.5..3..2.', '3..2..0.2---....', '5..3..2.5..3..4.', '5-------........'] },
        { voice: 'flute', oct: 1, gate: 0.92, opt: { soft: true },
          bars: ['7-------5-------', '4-------5-------', '5-------7-------', '5---------------'] },
        { voice: 'flute', oct: 1, gate: 0.92, opt: { chirp: true },
          bars: ['5.5.4.3.5.5.4.3.', '2323232-3---....', '5.5.4.3.5.7.5.4.', '3454345-5---....'] },
      ],
      hello: { voice: 'flute', oct: 1, opt: { chirp: true }, notes: [[5, 0, 0.09], [7, 0.12, 0.16]] },
    },
    // harmony
    elephant: {
      rev: 0.2, root: 'mel',
      mats: [
        { voice: 'pad', chord: [0, 2, 3], gate: 0.96, bars: ['0---------------'] },
        { voice: 'pad', chord: [0, 2, 3], gate: 0.8, bars: ['..0...0...0...0.'] },
        { voice: 'pad', chord: [0, 2, 3], gate: 0.96, oct: 1, opt: { hi: true }, bars: ['0---------------'] },
        { voice: 'pad', chord: [0, 2, 3], gate: 0.8, bars: ['0..0..0.0..0..0.'] },
      ],
      hello: { voice: 'pad', chord: [0, 2, 3], vel: 1, notes: [[0, 0, 0.28]] },
    },
  },

  tok: { voice: 'marimba', vel: 0.55, notes: [60, 62, 64, 67, 69, 72, 74, 76, 79, 81] },
  chime: { voice: 'marimba', vel: 0.8, gap: 0.11, notes: [72, 76, 79] },

  // "Chim-pún!"
  ending: {
    applause: { people: 48, dur: 4.8, gain: 0.9 },
    play(V, d, t) {
      [55, 59, 62, 67].forEach((m) => V.marimba(d, t, m, 0.3, 0.6));
      V.kick(d, t, 0.7);
      const t2 = t + 0.3;
      [48, 60, 64, 67, 72].forEach((m, i) => V.marimba(d, t2 + i * 0.012, m, 0.3, 0.75));
      [84, 88, 91, 96].forEach((m, i) => V.glock(d, t2 + i * 0.03, m, 0.3, 0.9));
      V.kick(d, t2, 0.9);
      V.cymbal(d, t2, 1);
      return t2;
    },
  },
};
