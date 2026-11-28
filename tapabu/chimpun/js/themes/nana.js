// Theme: the lullaby (Nana). Six sleepy figures on a night-blue table, a slow song in three
// beats. Figures sleep with their eyes shut and open them on each note. Mats: house (plain),
// tree (rocking), mountain (high and slow, with echo), waves (flowing).

import { INK, PINK, eye, cheek, line, sleepy, wrap, icon } from '../art.js?v=2';

// ---------- figures ----------
const smile = (x, y, w = 5) => line(`M${x - w} ${y} Q${x} ${y + w * 0.85} ${x + w} ${y}`, 2.4, INK, 'm0');
const ooh = (x, y) => `<ellipse class="m1" cx="${x}" cy="${y}" rx="3.8" ry="4.6" fill="${INK}"/>`;

const moon = wrap('moon',
  `<circle cx="50" cy="57" r="36"/><path d="M17 44 C22 8 58 0 84 18 C76 22 74 32 82 44 Z"/><path d="M15 40 Q50 28 85 40 L85 49 Q50 37 15 49 Z"/><circle cx="86" cy="17" r="8"/>`,
  '#fff1c4',
  `<circle cx="67" cy="81" r="4.5" fill="#f0dc9c"/><circle cx="33" cy="83" r="3" fill="#f0dc9c"/>
<path d="M17 44 C22 8 58 0 84 18 C76 22 74 32 82 44 Z" fill="#7f86d6"/>
${line('M34 30 l4 4 M50 20 l3 5 M64 24 l-2 5', 2.4, '#a9aef0')}
<path d="M15 40 Q50 28 85 40 L85 49 Q50 37 15 49 Z" fill="#fff"/>
<circle cx="86" cy="17" r="8" fill="#fff"/>
${sleepy(37, 63)}${sleepy(63, 63)}${cheek(27, 72)}${cheek(73, 72)}
${smile(50, 72)}${ooh(50, 75)}`);

const starPath = Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 23 : 46;
  return `${i ? 'L' : 'M'}${(50 + Math.cos(a) * r).toFixed(1)} ${(54 + Math.sin(a) * r).toFixed(1)}`;
}).join(' ') + ' Z';
const star = wrap('star',
  `<path d="${starPath}"/>`,
  '#ffd35a',
  `${sleepy(41, 53, 4)}${sleepy(59, 53, 4)}${cheek(35, 61, 4)}${cheek(65, 61, 4)}
${smile(50, 61, 4)}${ooh(50, 64)}`);

const owl = wrap('owl',
  `<path d="M17 42 L20 10 L45 27 Z"/><path d="M83 42 L80 10 L55 27 Z"/><ellipse cx="50" cy="58" rx="35" ry="37"/>`,
  '#8f6fc0',
  `<ellipse cx="50" cy="76" rx="20" ry="17" fill="#e2d4f5"/>
${line('M41 72 l3 3 l3 -3 M53 72 l3 3 l3 -3 M47 81 l3 3 l3 -3', 2, '#b9a0e0')}
<ellipse cx="17" cy="66" rx="6" ry="15" transform="rotate(10 17 66)" fill="#7556a8"/><ellipse cx="83" cy="66" rx="6" ry="15" transform="rotate(-10 83 66)" fill="#7556a8"/>
<circle cx="36" cy="46" r="14" fill="#f7f0ff"/><circle cx="64" cy="46" r="14" fill="#f7f0ff"/>
${sleepy(36, 47, 6.5)}${sleepy(64, 47, 6.5)}
<path d="M46 57 L54 57 L50 64 Z" fill="#ffb02e" stroke="#ffb02e" stroke-width="2.5" stroke-linejoin="round"/>`);

const cloud = wrap('cloud',
  `<circle cx="28" cy="60" r="20"/><circle cx="50" cy="45" r="27"/><circle cx="74" cy="59" r="20"/><rect x="28" y="56" width="46" height="24" rx="12"/>`,
  '#e3ecff',
  `<circle cx="42" cy="36" r="9" fill="#f4f8ff"/>
${sleepy(40, 59)}${sleepy(60, 59)}${cheek(29, 67)}${cheek(71, 67)}
${smile(50, 67, 4.5)}${ooh(50, 70)}`);

const wool = Array.from({ length: 8 }, (_, k) => {
  const a = (k * Math.PI) / 4 + 0.39;
  return `<circle cx="${(50 + Math.cos(a) * 25).toFixed(1)}" cy="${(52 + Math.sin(a) * 25).toFixed(1)}" r="15"/>`;
}).join('') + `<circle cx="50" cy="52" r="28"/>`;
const sheepEye = (x, y) =>
  `${line(`M${x - 4} ${y - 1} Q${x} ${y + 4} ${x + 4} ${y - 1}`, 2.4, '#fff', 'm0')}<g class="m1"><circle cx="${x}" cy="${y}" r="4.4" fill="#fff"/><circle cx="${x}" cy="${y + 0.4}" r="2.5" fill="#2b2238"/></g>`;
const sheep = wrap('sheep',
  wool,
  '#fff6ea',
  `<ellipse cx="25" cy="54" rx="10" ry="6" transform="rotate(24 25 54)" fill="#5d4d73"/><ellipse cx="75" cy="54" rx="10" ry="6" transform="rotate(-24 75 54)" fill="#5d4d73"/>
<ellipse cx="50" cy="60" rx="19" ry="21" fill="#5d4d73"/>
<circle cx="41" cy="41" r="8.5" fill="#fff6ea"/><circle cx="50" cy="38" r="9.5" fill="#fff6ea"/><circle cx="59" cy="41" r="8.5" fill="#fff6ea"/>
${sheepEye(42.5, 59)}${sheepEye(57.5, 59)}
<path d="M47 68 h6 l-3 3.6 z" fill="${PINK}" stroke="${PINK}" stroke-width="1.5" stroke-linejoin="round"/>
<ellipse class="m1" cx="50" cy="75.5" rx="3" ry="3.4" fill="#2b2238"/>`);

const fox = wrap('fox',
  `<path d="M12 48 L15 6 L45 28 Z"/><path d="M88 48 L85 6 L55 28 Z"/><path d="M10 46 Q50 22 90 46 Q86 74 50 94 Q14 74 10 46 Z"/>`,
  '#f08a3c',
  `<path d="M20 36 L21.5 16 L35 27 Z" fill="#5a3320"/><path d="M80 36 L78.5 16 L65 27 Z" fill="#5a3320"/>
<path d="M10 46 Q50 22 90 46 Q86 74 50 94 Q14 74 10 46 Z" fill="#f08a3c"/>
<path d="M10 48 Q34 58 50 94 Q16 76 10 48 Z" fill="#fff6ea"/><path d="M90 48 Q66 58 50 94 Q84 76 90 48 Z" fill="#fff6ea"/>
<ellipse cx="50" cy="88" rx="5.5" ry="4.2" fill="${INK}"/>
${sleepy(36, 55, 4.6)}${sleepy(64, 55, 4.6)}${cheek(24, 67, 4.6)}${cheek(76, 67, 4.6)}`);

// ---------- mats ----------
const wavesIcon = [36, 54, 72].map((y) => `<path d="M14 ${y} q9 -11 18 0 t18 0 t18 0 t18 0"/>`).join('');

export default {
  id: 'nana',

  figures: [
    { id: 'moon', svg: moon },
    { id: 'star', svg: star },
    { id: 'owl', svg: owl },
    { id: 'cloud', svg: cloud },
    { id: 'sheep', svg: sheep },
    { id: 'fox', svg: fox },
  ],

  mats: [
    { id: 'house', color: '#e9a85a', deep: '#b0733a',
      icon: icon(`<path d="M50 14 L88 46 H76 V84 H24 V46 H12 Z" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><rect x="41" y="54" width="18" height="18" rx="3" fill="#ffd35a"/>`) },
    { id: 'tree', color: '#6fb08d', deep: '#467f63',
      icon: icon(`<path d="M50 10 L72 40 H62 L80 66 H56 V88 H44 V66 H20 L38 40 H28 Z" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>`) },
    { id: 'mountain', color: '#8087d9', deep: '#555cae', echo: 0.5, rev: 0.55,
      icon: icon(`<path d="M8 82 L38 28 L52 52 L64 36 L92 82 Z" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>`) },
    { id: 'waves', color: '#5bacc8', deep: '#37809c',
      icon: `<svg class="icon" viewBox="0 0 100 100" aria-hidden="true" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round">${wavesIcon}</svg>` },
  ],

  look: {
    page: '#262452',
    table: 'linear-gradient(180deg, #3a3880, #29275c)',
    trayA: '#232154', trayB: '#1b1946', trayEdge: '#15133a',
    slot: 'rgba(0, 0, 0, .26)',
    veil: 'rgba(12, 10, 45, .55)',
    play: '#8c93e6', playDeep: '#5c63b8',
    glow: 0.14,
  },

  celebrate: {
    shape: 'star', count: 60, fall: 0.13, hop: 0.16,
    colors: ['#ffe9a3', '#ffffff', '#ffd35a', '#cfd6ff'],
  },

  song: {
    bpm: 72, stepsPerBeat: 4, beatsPerBar: 3, swing: 0, echoSteps: 4,
    room: { len: 2.2, level: 0.7 },
    prog: [
      { mel: 55, bass: 43, min: false }, // G
      { mel: 60, bass: 48, min: false }, // C
      { mel: 55, bass: 43, min: false }, // G
      { mel: 62, bass: 50, min: false }, // D
      { mel: 64, bass: 52, min: true },  // Em
      { mel: 60, bass: 48, min: false }, // C
      { mel: 62, bass: 50, min: false }, // D
      { mel: 55, bass: 43, min: false }, // G
    ],
  },

  // Sounds only this theme has. k is the engine's kit of building blocks.
  voices: (k) => {
    const v = {
      // a soft heartbeat
      thump(d, t, vol) {
        k.tone(d, 'sine', 100, t, 0.6 * vol, 0.3, 0.012, 58, 0.12);
        k.tone(d, 'triangle', 150, t, 0.16 * vol, 0.16, 0.012, 85, 0.1);
      },
      shh(d, t, vol) {
        k.noise(d, t, 0.22 * vol, 0.32, 'bandpass', 2600, 0.6, 0.08);
      },
      // a long breath of wind
      wind(d, t, vol) {
        k.noise(d, t, 0.35 * vol, 1.5, 'bandpass', 650, 0.9, 0.7);
      },
      drop(d, t, vol) {
        const f = 1100 + Math.random() * 800;
        k.tone(d, 'sine', f, t, 0.2 * vol, 0.08, 0.003, f * 1.5, 0.05);
      },
      // an owl's "hoo": scoops up into the note and sags at the end
      hoo(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        const len = Math.max(0.16, dur);
        const end = k.heldEnd(t, 0.05, len, 0.14);
        const g = k.held(d, t, 0.05, 0.28 * vol, len, 0.14, 0.7);
        const h = k.gainNode(0.3);
        h.connect(g);
        for (const [o, m] of [[k.osc('sine', f * 0.86, t, end, g, f, 0.07), 1], [k.osc('sine', f * 1.72, t, end, h, f * 2, 0.07), 2]]) {
          o.frequency.setValueAtTime(f * m, t + len * 0.6);
          o.frequency.linearRampToValueAtTime(f * m * 0.94, t + len + 0.1);
        }
        k.noise(d, t, 0.03 * vol, len, 'lowpass', 900, 0.5, 0.04);
      },
      harp(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        const dec = Math.min(1.5, 0.95 * Math.pow(260 / f, 0.3));
        k.tone(d, 'triangle', f, t, 0.42 * vol, dec, 0.004);
        k.tone(d, 'sine', f * 2, t, 0.1 * vol, dec * 0.4, 0.004);
        k.tone(d, 'sine', f * 3, t, 0.04 * vol, 0.14, 0.003);
      },
      musicbox(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        k.tone(d, 'sine', f, t, 0.3 * vol, 1.0, 0.002);
        k.tone(d, 'sine', f * 2, t, 0.08 * vol, 0.5, 0.002);
        k.tone(d, 'sine', f * 6.27, t, 0.03 * vol, 0.07, 0.001);
      },
      // a hummed "oo"
      ooh(d, t, midi, dur, vol) {
        const f = k.mtof(midi);
        const a = 0.12, rel = 0.3;
        const end = k.heldEnd(t, a, dur, rel);
        const g = k.held(d, t, a, 0.1 * vol, dur, rel, 0.9);
        const lp = k.filter('lowpass', 1100, 0.7);
        lp.connect(g);
        const main = k.osc('sine', f, t, end, g);
        const body = k.osc('triangle', f, t, end, lp);
        k.vibrato(main, f, t, end, 4.6, 0.005, 0.45);
        k.vibrato(body, f, t, end, 4.6, 0.005, 0.45);
      },
      // a soft chord. Short ones swell less; hi is brighter.
      warm(d, t, midis, dur, vol, o = {}) {
        const short = dur < 0.5;
        const a = short ? 0.05 : 0.3, rel = short ? 0.35 : 0.6;
        const end = k.heldEnd(t, a, dur, rel);
        const g = k.held(d, t, a, (short ? 0.12 : 0.07) * vol, dur, rel, 0.9);
        const lp = k.filter('lowpass', o.hi ? 2400 : 1200, 0.4);
        lp.connect(g);
        for (const m of midis) for (const det of [-5, 5]) k.osc('triangle', k.mtof(m), t, end, lp).detune.value = det;
      },
    };
    v.warm.poly = true;
    return v;
  },

  parts: {
    // pulse: heartbeat, hush, wind and rain
    cloud: {
      rev: 0.15,
      hits: { h: ['thump'], q: ['thump', null, 0.6], s: ['shh'], W: ['wind'], d: ['drop'] },
      mats: [
        [['h...s...s...']],
        [['h...s.q.s...']],
        [['W...........', '......d...d.'], ['W...........', '....d.....d.']],
        [['h...........', '..d.ddd.d.dd'], ['h...........', 'd.dd..d.ddd.']],
      ],
      hello: [['h', 0], ['s', 0.2]],
    },
    // shimmer: twinkles
    star: {
      rev: 0.35, root: 'mel',
      mats: [
        { voice: 'glock', oct: 1, bars: ['5.......3...', '5.......7...'] },
        { voice: 'glock', oct: 1, bars: ['..5...7...5.', '..7...5...3.'] },
        { voice: 'glock', oct: 1, bars: ['7...........', '....8.......', '5...........', '........7...'] },
        { voice: 'glock', oct: 1, vel: 0.8, bars: ['5.7.8.7.5.7.', '5.7.8.9.8.7.'] },
      ],
      hello: { voice: 'glock', oct: 1, notes: [[5, 0, 0.3], [7, 0.12, 0.3]] },
    },
    // bass: hoots
    owl: {
      rev: 0.25, root: 'bass',
      mats: [
        { voice: 'hoo', oct: 1, bars: ['0---........'] },
        { voice: 'hoo', oct: 1, bars: ['0-..0---....'] },
        { voice: 'hoo', oct: 2, bars: ['0-----......'] },
        { voice: 'hoo', oct: 1, bars: ['0-..3-..5-..'] },
      ],
      hello: { voice: 'hoo', oct: 1, notes: [[0, 0, 0.16], [0, 0.26, 0.4]] },
    },
    // harmony: soft chords
    fox: {
      rev: 0.3, root: 'mel',
      mats: [
        { voice: 'warm', chord: [0, 2, 3], gate: 0.97, bars: ['0-----------'] },
        { voice: 'warm', chord: [0, 2, 3], bars: ['....0-..0-..'] },
        { voice: 'warm', chord: [0, 2, 3], gate: 0.97, oct: 1, opt: { hi: true }, bars: ['0-----------'] },
        { voice: 'warm', chord: [0, 2, 3], bars: ['0---0---0---'] },
      ],
      hello: { voice: 'warm', chord: [0, 2, 3], vel: 1, notes: [[0, 0, 0.4]] },
    },
    // pattern: harp and music box
    sheep: {
      rev: 0.3, root: 'mel',
      mats: [
        { voice: 'harp', bars: ['0...2...3...', '0...3...2...'] },
        { voice: 'harp', bars: ['0.....3.5...', '0.....2.3...'] },
        { voice: 'musicbox', oct: 1, bars: ['5.......3...', '7.......5...'] },
        { voice: 'harp', bars: ['0.2.3.5.3.2.', '0.2.3.5.7.5.'] },
      ],
      hello: { voice: 'harp', oct: 1, notes: [[0, 0, 0.3], [2, 0.12, 0.3], [3, 0.24, 0.3]] },
    },
    // melody: the moon hums
    moon: {
      rev: 0.35, root: 'mel',
      mats: [
        { voice: 'ooh', oct: 1, bars: ['2-------3---', '5-------4---', '3-------2---', '0-----------'] },
        { voice: 'ooh', oct: 1, bars: ['2-----3-5---', '4-----3-2---', '2-----3-5---', '3-----------'] },
        { voice: 'ooh', oct: 1, bars: ['5-----------', '4-----------', '7-----------', '5-----------'] },
        { voice: 'ooh', oct: 1, bars: ['2---3---5---', '4---3---2---', '2---3---4---', '5-------....'] },
      ],
      hello: { voice: 'ooh', oct: 1, notes: [[3, 0, 0.35]] },
    },
  },

  tok: { voice: 'musicbox', vel: 0.6, notes: [67, 69, 71, 74, 76, 79, 81, 83, 86, 88] },
  chime: { voice: 'musicbox', vel: 0.8, gap: 0.16, notes: [79, 83, 86] },

  // A rising harp chord, then a small, quiet audience.
  ending: {
    applause: { people: 16, dur: 4.2, gain: 0.65, lowpass: 3200 },
    play(V, d, t) {
      [55, 59, 62, 67, 71].forEach((m, i) => V.harp(d, t + i * 0.13, m, 0.5, 0.8));
      const t2 = t + 0.65;
      [79, 83, 86].forEach((m, i) => V.glock(d, t2 + i * 0.05, m, 0.5, 0.7));
      V.thump(d, t2, 0.7);
      return t2;
    },
  },
};
