// Procedural textures drawn on canvases at load. Nothing is downloaded.

import * as THREE from 'three';

function rng(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Textures are drawn in logical pixels and rasterised at SCALE x (2 on desktop for the HD camera).
let SCALE = 1, ANISO = 4;
export function setTextureQuality(scale, aniso) { SCALE = scale; ANISO = aniso; }

function canvas(w, h, scaled = true) {
  const c = document.createElement('canvas');
  const s = scaled ? SCALE : 1;
  c.width = w * s; c.height = h * s;
  const g = c.getContext('2d');
  if (s !== 1) g.scale(s, s);
  return [c, g];
}

function tex(c, { repeat = true, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = ANISO;
  return t;
}

function speckle(g, w, h, n, r, colors, alpha = [0.05, 0.2]) {
  for (let i = 0; i < n; i++) {
    g.globalAlpha = alpha[0] + r() * (alpha[1] - alpha[0]);
    g.fillStyle = colors[(r() * colors.length) | 0];
    const s = 1 + r() * 2;
    g.fillRect(r() * w, r() * h, s, s);
  }
  g.globalAlpha = 1;
}

const hsl = (h, s, l) => `hsl(${h},${s}%,${l}%)`;

// ---------- floors ----------

function wood(seed, dark) {
  const r = rng(seed);
  const [c, g] = canvas(512, 512);
  const pw = 64;  // 0.2 m planks on a 1.6 m tile
  for (let col = 0; col < 8; col++) {
    let y = -r() * 256;
    while (y < 512) {
      const len = 160 + r() * 260;
      const l = (dark ? 20 : 33) + r() * 9, hue = 24 + r() * 8;
      g.fillStyle = hsl(hue, 38 + r() * 12, l);
      g.fillRect(col * pw, y, pw, len);
      for (let k = 0; k < 14; k++) {  // grain
        g.strokeStyle = hsl(hue, 40, l - 6 - r() * 6);
        g.globalAlpha = 0.25 + r() * 0.3;
        g.lineWidth = 0.6 + r();
        g.beginPath();
        const x0 = col * pw + r() * pw;
        g.moveTo(x0, y);
        for (let s = 0; s <= len; s += 20) g.lineTo(x0 + Math.sin(s * 0.03 + k) * 3 + (r() - 0.5) * 1.5, y + s);
        g.stroke();
      }
      g.globalAlpha = 1;
      if (r() < 0.25) { g.fillStyle = hsl(hue, 40, l - 12); g.beginPath(); g.ellipse(col * pw + 10 + r() * 44, y + r() * len, 3 + r() * 3, 5 + r() * 4, 0, 0, 7); g.fill(); }
      g.fillStyle = 'rgba(0,0,0,0.6)';
      g.fillRect(col * pw, y, pw, 2);
      y += len;
    }
    g.fillStyle = 'rgba(0,0,0,0.65)';
    g.fillRect(col * pw, 0, 2, 512);
  }
  speckle(g, 512, 512, 3000, r, ['#000', '#fff'], [0.03, 0.08]);
  return tex(c);
}

function checker(seed) {
  const r = rng(seed);
  const [c, g] = canvas(512, 512);
  const s = 128;  // 0.3 m tiles on a 1.2 m tile
  for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
    const light = (i + j) % 2 === 0;
    g.fillStyle = light ? hsl(40, 15, 72 + r() * 6) : hsl(210, 10, 16 + r() * 5);
    g.fillRect(i * s, j * s, s, s);
  }
  speckle(g, 512, 512, 6000, r, ['#3a3020', '#000', '#fff'], [0.04, 0.12]);
  g.strokeStyle = 'rgba(60,55,45,0.85)';
  g.lineWidth = 3;
  for (let k = 0; k <= 4; k++) { g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, 512); g.moveTo(0, k * s); g.lineTo(512, k * s); g.stroke(); }
  return tex(c);
}

function smallTile(seed) {
  const r = rng(seed);
  const [c, g] = canvas(512, 512);
  g.fillStyle = '#7d847f';
  g.fillRect(0, 0, 512, 512);
  const s = 64;
  for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
    g.fillStyle = hsl(190, 12, 76 + r() * 8);
    g.fillRect(i * s + 2, j * s + 2, s - 4, s - 4);
  }
  speckle(g, 512, 512, 3000, r, ['#000', '#567'], [0.03, 0.1]);
  return tex(c);
}

function carpet(seed, h, s, l) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  g.fillStyle = hsl(h, s, l);
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = hsl(h + (r() - 0.5) * 10, s, l + (r() - 0.5) * 16);
    g.fillRect(r() * 256, r() * 256, 1 + r() * 1.5, 1 + r() * 1.5);
  }
  return tex(c);
}

function concrete(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#5b5a57';
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 60; i++) {
    g.globalAlpha = 0.06;
    g.fillStyle = r() < 0.5 ? '#000' : '#fff';
    g.beginPath(); g.arc(r() * 256, r() * 256, 10 + r() * 40, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
  speckle(g, 256, 256, 4000, r, ['#000', '#ddd'], [0.05, 0.2]);
  return tex(c);
}

// ---------- walls ----------

// Draw something nine times, offset by the tile size, so motifs crossing an edge wrap round seamlessly.
function wrapped(g, S, fn) {
  for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) { g.save(); g.translate(ox, oy); fn(); g.restore(); }
}

// A pointed leaf from (0,0) out along -y.
function leaf(g, len, wid, bend = 0) {
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(wid + bend, -len * 0.45, bend * 1.6, -len);
  g.quadraticCurveTo(-wid + bend, -len * 0.5, 0, 0);
  g.fill();
}

// A damask motif: a tall central leaf, curling side leaves, a bud, drops. Mirror-symmetric.
function damask(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  leaf(g, 1.0, 0.22);
  g.beginPath(); g.ellipse(0, 0.22, 0.11, 0.2, 0, 0, 7); g.fill();
  for (const m of [-1, 1]) {
    g.save(); g.scale(m, 1);
    g.save(); g.translate(0.05, -0.18); g.rotate(0.75); leaf(g, 0.62, 0.16, 0.08); g.restore();
    g.save(); g.translate(0.04, 0.3); g.rotate(2.35); leaf(g, 0.48, 0.13, -0.06); g.restore();
    g.lineWidth = 0.035; g.strokeStyle = g.fillStyle;
    g.beginPath(); g.moveTo(0.1, -0.05); g.bezierCurveTo(0.5, -0.1, 0.62, 0.25, 0.4, 0.36); g.bezierCurveTo(0.3, 0.4, 0.26, 0.3, 0.32, 0.26); g.stroke();
    g.beginPath(); g.arc(0.52, -0.55, 0.045, 0, 7); g.fill();
    g.beginPath(); g.arc(0.36, 0.62, 0.035, 0, 7); g.fill();
    g.restore();
  }
  g.beginPath(); g.arc(0, 0.62, 0.05, 0, 7); g.fill();
  g.restore();
}

// A small flower sprig: five petals, a centre, two leaves on a curved stem.
function sprig(g, x, y, s, rot, petal, centre, leafCol) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.strokeStyle = leafCol; g.fillStyle = leafCol; g.lineWidth = 0.06;
  g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(0.15, 0.5, -0.05, 0.95); g.stroke();
  g.save(); g.translate(0.07, 0.45); g.rotate(2.2); leaf(g, 0.42, 0.12, 0.03); g.restore();
  g.save(); g.translate(0.0, 0.7); g.rotate(-2.0); leaf(g, 0.34, 0.1, -0.03); g.restore();
  g.fillStyle = petal;
  for (let k = 0; k < 5; k++) { g.save(); g.rotate((k / 5) * Math.PI * 2); g.beginPath(); g.ellipse(0, -0.2, 0.11, 0.19, 0, 0, 7); g.fill(); g.restore(); }
  g.fillStyle = centre; g.beginPath(); g.arc(0, 0, 0.08, 0, 7); g.fill();
  g.restore();
}

// A twinkle: four long points, two short ones.
function twinkle(g, x, y, s, col) {
  g.save(); g.translate(x, y); g.fillStyle = col;
  g.beginPath();
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2, rr = k % 2 ? s * 0.22 : k % 4 === 0 ? s : s * 0.6;
    g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  g.fill(); g.restore();
}

function wallpaper(kind, seed) {
  const r = rng(seed);
  const S = 256;
  const [c, g] = canvas(S, S);  // 1 m tile
  const base = { sage: [95, 14, 46], cream: [42, 30, 62], plain: [30, 5, 50], stripe: [350, 22, 30], tile: [190, 10, 78], kid: [205, 35, 60], mauve: [320, 14, 44] }[kind];
  g.fillStyle = hsl(...base);
  g.fillRect(0, 0, S, S);
  if (kind === 'sage') {
    for (let x = 0; x < S; x += 32) { g.fillStyle = hsl(base[0], base[1], base[2] - 2.5); g.fillRect(x, 0, 16, S); }
    g.fillStyle = hsl(base[0], base[1] + 4, base[2] + 7);
    wrapped(g, S, () => { damask(g, 64, 70, 46); damask(g, 192, 198, 46); });
    g.fillStyle = hsl(base[0], base[1] + 2, base[2] + 3.5);
    wrapped(g, S, () => { for (const [x, y] of [[192, 70], [64, 198]]) { g.save(); g.translate(x, y); g.rotate(Math.PI / 4); g.fillRect(-3, -3, 6, 6); g.restore(); } });
  }
  if (kind === 'stripe') {
    for (let x = 0; x < S; x += 64) {
      g.fillStyle = hsl(base[0], base[1], base[2] - 7); g.fillRect(x, 0, 32, S);
      g.fillStyle = 'rgba(200,160,90,0.35)'; g.fillRect(x + 32, 0, 1.5, S); g.fillRect(x + 62, 0, 1.5, S);
    }
  }
  if (kind === 'mauve') {
    wrapped(g, S, () => {
      for (const [x, y, rot] of [[40, 50, 0.3], [168, 50, -0.4], [104, 178, 0.1], [232, 178, -0.2]])
        sprig(g, x, y, 34, rot, hsl(base[0] + 10, base[1] + 18, base[2] + 14), hsl(40, 40, base[2] + 18), hsl(110, 12, base[2] + 4));
      g.fillStyle = hsl(base[0], base[1], base[2] + 6);
      for (const [x, y] of [[104, 50], [232, 50], [40, 178], [168, 178]]) { g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); }
    });
  }
  if (kind === 'tile') {
    const n = 6, ts = S / n;
    g.fillStyle = '#7c868a'; g.fillRect(0, 0, S, S);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const x = i * ts, y = j * ts, l = 76 + r() * 7;
      g.fillStyle = hsl(190 + r() * 8, 9 + r() * 4, l);
      g.fillRect(x + 1.6, y + 1.6, ts - 3.2, ts - 3.2);
      const grd = g.createLinearGradient(x, y, x + ts, y + ts);   // a glazed bevel
      grd.addColorStop(0, 'rgba(255,255,255,0.35)'); grd.addColorStop(0.15, 'rgba(255,255,255,0)'); grd.addColorStop(0.85, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,0.18)');
      g.fillStyle = grd; g.fillRect(x + 1.6, y + 1.6, ts - 3.2, ts - 3.2);
      if (r() < 0.12) { g.strokeStyle = 'rgba(60,60,55,0.35)'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(x + r() * ts, y + 2); g.lineTo(x + r() * ts, y + ts - 2); g.stroke(); }   // a hairline crack
    }
  }
  if (kind === 'kid') {
    // a bedtime print on dusky blue: sleepy moons, ringed planets, little rockets, twinkles joined into
    // constellations. Half-drop repeat, four motifs to a metre.
    const bg = hsl(212, 30, 47);
    g.fillStyle = bg; g.fillRect(0, 0, S, S);
    g.filter = 'blur(7px)';
    for (let i = 0; i < 10; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '20,30,60' : '200,215,240'},0.05)`; g.beginPath(); g.arc(r() * S, r() * S, 20 + r() * 30, 0, 7); g.fill(); }
    g.filter = 'none';
    const moon = (x, y, s) => {
      g.save(); g.translate(x, y); g.rotate(-0.35);
      g.fillStyle = '#f2dc9a';
      g.beginPath(); g.arc(0, 0, s, -Math.PI * 0.62, Math.PI * 0.62, false); g.arc(s * 0.42, 0, s * 0.8, Math.PI * 0.55, -Math.PI * 0.55, true); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(150,110,50,0.8)'; g.lineWidth = 1.1;   // a closed, sleeping eye and a nightcap's bobble
      g.beginPath(); g.arc(-s * 0.35, -s * 0.12, s * 0.16, 0.2, Math.PI - 0.2); g.stroke();
      g.fillStyle = '#d65a4a'; g.beginPath(); g.moveTo(-s * 0.2, -s * 0.9); g.quadraticCurveTo(s * 0.6, -s * 1.5, s * 1.0, -s * 0.9); g.lineTo(s * 0.3, -s * 0.62); g.fill();
      g.fillStyle = '#f4f0e4'; g.beginPath(); g.arc(s * 1.02, -s * 0.88, s * 0.14, 0, 7); g.fill();
      g.restore();
    };
    const planet = (x, y, s, col) => {
      g.save(); g.translate(x, y); g.rotate(0.35);
      g.strokeStyle = '#efe2b8'; g.lineWidth = s * 0.16;
      g.beginPath(); g.ellipse(0, 0, s * 1.75, s * 0.45, 0, Math.PI, Math.PI * 2); g.stroke();   // back of the ring
      g.fillStyle = col; g.beginPath(); g.arc(0, 0, s, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.28)'; g.beginPath(); g.arc(-s * 0.3, -s * 0.3, s * 0.55, 0, 7); g.fill();
      g.fillStyle = 'rgba(0,0,40,0.2)'; g.fillRect(-s, s * 0.15, s * 2, s * 0.18);
      g.beginPath(); g.ellipse(0, 0, s * 1.75, s * 0.45, 0, 0, Math.PI); g.stroke();                 // front of the ring
      g.restore();
    };
    const rocket = (x, y, s, rot) => {
      g.save(); g.translate(x, y); g.rotate(rot);
      g.fillStyle = '#f0a040'; g.beginPath(); g.moveTo(-s * 0.22, s * 0.95); g.quadraticCurveTo(0, s * 1.6, s * 0.22, s * 0.95); g.fill();   // flame
      g.fillStyle = '#c8463a';
      g.beginPath(); g.moveTo(-s * 0.3, s * 0.5); g.lineTo(-s * 0.62, s * 1.0); g.lineTo(-s * 0.3, s * 0.85); g.fill();
      g.beginPath(); g.moveTo(s * 0.3, s * 0.5); g.lineTo(s * 0.62, s * 1.0); g.lineTo(s * 0.3, s * 0.85); g.fill();
      g.fillStyle = '#ece6d6'; g.beginPath(); g.moveTo(0, -s); g.quadraticCurveTo(s * 0.48, -s * 0.3, s * 0.32, s * 0.9); g.lineTo(-s * 0.32, s * 0.9); g.quadraticCurveTo(-s * 0.48, -s * 0.3, 0, -s); g.fill();
      g.fillStyle = '#c8463a'; g.beginPath(); g.moveTo(0, -s); g.quadraticCurveTo(s * 0.3, -s * 0.62, s * 0.38, -s * 0.45); g.lineTo(-s * 0.38, -s * 0.45); g.quadraticCurveTo(-s * 0.3, -s * 0.62, 0, -s); g.fill();
      g.fillStyle = '#5a8ab0'; g.beginPath(); g.arc(0, -s * 0.05, s * 0.17, 0, 7); g.fill();
      g.strokeStyle = '#ece6d6'; g.lineWidth = 1; g.stroke();
      g.restore();
    };
    wrapped(g, S, () => {
      moon(60, 58, 17); moon(188, 186, 17);
      planet(188, 60, 10, '#7fbf9c'); planet(60, 188, 10, '#d68a5a');
      rocket(124, 124, 15, 0.5); rocket(252, 252, 15, -0.4);
      // constellations: twinkles joined by dotted lines
      for (const pts of [[[110, 28], [140, 42], [160, 20]], [[20, 120], [40, 140], [28, 160], [8, 150]], [[220, 120], [238, 104]]]) {
        g.strokeStyle = 'rgba(240,230,190,0.45)'; g.lineWidth = 0.9; g.setLineDash([2, 3]);
        g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.stroke(); g.setLineDash([]);
        for (const [x, y] of pts) twinkle(g, x, y, 4.5, 'rgba(250,236,180,0.95)');
      }
      g.fillStyle = 'rgba(250,240,200,0.7)';
      for (const [x, y] of [[95, 90], [150, 160], [30, 230], [230, 30], [100, 240], [175, 110], [10, 70]]) { g.beginPath(); g.arc(x, y, 1.2, 0, 7); g.fill(); }
    });
  }
  if (kind === 'plain') {
    // painted plaster in a damp room: blotches, and drips running down from somewhere above
    g.filter = 'blur(14px)';
    wrapped(g, S, () => { for (let i = 0; i < 7; i++) { g.fillStyle = `rgba(${i % 2 ? '40,36,28' : '90,86,74'},0.05)`; g.beginPath(); g.ellipse((i * 109) % S, (i * 71) % S, 60 + (i % 3) * 30, 40 + (i % 2) * 30, i, 0, 7); g.fill(); } });
    g.filter = 'blur(1px)';
    for (let i = 0; i < 14; i++) {
      const x = r() * S, y0 = r() * S * 0.5, L = 40 + r() * 140;
      const grd = g.createLinearGradient(0, y0, 0, y0 + L);
      grd.addColorStop(0, 'rgba(50,40,25,0.25)'); grd.addColorStop(1, 'rgba(50,40,25,0)');
      g.fillStyle = grd; g.fillRect(x, y0, 1.5 + r() * 2, L);
    }
    g.filter = 'none';
  }
  if (kind === 'cream') {
    g.filter = 'blur(6px)';
    for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(${r() < 0.5 ? '120,100,60' : '255,250,230'},${0.04 + r() * 0.05})`; g.beginPath(); g.arc(r() * S, r() * S, 20 + r() * 40, 0, 7); g.fill(); }
    g.filter = 'none';
  }
  speckle(g, S, S, 2500, r, ['#000', '#fff'], [0.02, 0.07]);
  return tex(c);
}

function star(g, x, y, s) {
  g.beginPath();
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 - Math.PI / 2, rr = k % 2 ? s * 0.45 : s;
    g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  g.fill();
}

function ceiling(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#8c8a84';
  g.fillRect(0, 0, 256, 256);
  speckle(g, 256, 256, 9000, r, ['#000', '#fff'], [0.05, 0.15]);
  return tex(c);
}

// ---------- furniture ----------

function furnWood(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#4a2f1d';
  g.fillRect(0, 0, 256, 256);
  for (let k = 0; k < 60; k++) {
    g.strokeStyle = hsl(22, 45, 12 + r() * 14);
    g.globalAlpha = 0.4;
    g.lineWidth = 0.5 + r() * 1.5;
    g.beginPath();
    const y0 = r() * 256;
    g.moveTo(0, y0);
    for (let x = 0; x <= 256; x += 16) g.lineTo(x, y0 + Math.sin(x * 0.02 + k) * 4);
    g.stroke();
  }
  g.globalAlpha = 1;
  return tex(c);
}

function fabric(seed, h, s, l) {
  const r = rng(seed);
  const [c, g] = canvas(128, 128);
  g.fillStyle = hsl(h, s, l);
  g.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 2) { g.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.05})`; g.fillRect(0, y, 128, 1); }
  for (let x = 0; x < 128; x += 2) { g.fillStyle = `rgba(255,255,255,${0.03 + r() * 0.04})`; g.fillRect(x, 0, 1, 128); }
  return tex(c);
}

// Dust-sheet linen: an open weave, soft blotches of grime, a few old stains and a fold line.
// (The folds themselves are in the geometry now.)
function sheet(seed) {
  const r = rng(seed), S = 256;
  const [c, g] = canvas(S, S);
  g.fillStyle = '#d6d1c4';
  g.fillRect(0, 0, S, S);
  g.filter = 'blur(10px)';
  wrapped(g, S, () => { for (let i = 0; i < 10; i++) { g.fillStyle = `rgba(${r() < 0.6 ? '110,100,80' : '255,252,240'},${0.06 + r() * 0.08})`; g.beginPath(); g.ellipse((i * 97) % S, (i * 61) % S, 30 + (i % 3) * 18, 20 + (i % 4) * 10, i, 0, 7); g.fill(); } });
  g.filter = 'blur(2px)';
  wrapped(g, S, () => {
    for (const [x, y, rad] of [[60, 180, 16], [190, 70, 10]]) {   // tea-coloured rings
      g.strokeStyle = 'rgba(140,110,60,0.22)'; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, rad, rad * 0.8, 0.4, 0, 7); g.stroke();
      g.fillStyle = 'rgba(160,130,80,0.08)'; g.fill();
    }
  });
  g.filter = 'none';
  for (let y = 0; y < S; y += 2) { g.fillStyle = `rgba(0,0,0,${0.035 + r() * 0.03})`; g.fillRect(0, y, S, 1); }   // weave
  for (let x = 0; x < S; x += 2) { g.fillStyle = `rgba(255,255,255,${0.03 + r() * 0.03})`; g.fillRect(x, 0, 1, S); }
  g.strokeStyle = 'rgba(80,72,60,0.15)'; g.lineWidth = 1.2;   // an old fold, pressed in
  g.beginPath(); g.moveTo(0, 128); g.lineTo(S, 128); g.stroke();
  speckle(g, S, S, 2500, r, ['#000', '#fff', '#6a5a40'], [0.03, 0.08]);
  return tex(c);
}

// Hall runner: a border down each long side and a repeating lattice of lozenges, worn pale down the middle.
// One tile is twice as long as the runner is wide; it repeats along u.
function runner(seed, color) {
  const r = rng(seed), W = 512, H = 256;
  const [c, g] = canvas(W, H);
  g.fillStyle = color; g.fillRect(0, 0, W, H);
  const light = 'rgba(225,205,165,0.55)', dark = 'rgba(20,12,18,0.45)', red = 'rgba(150,40,40,0.55)';
  // borders
  for (const y of [14, H - 42]) {
    g.fillStyle = dark; g.fillRect(0, y, W, 28);
    g.fillStyle = light; g.fillRect(0, y + 2, W, 2); g.fillRect(0, y + 24, W, 2);
    for (let x = 0; x < W; x += 32) { g.fillStyle = red; g.beginPath(); g.moveTo(x, y + 14); g.lineTo(x + 8, y + 6); g.lineTo(x + 16, y + 14); g.lineTo(x + 8, y + 22); g.fill(); g.fillStyle = light; g.fillRect(x + 22, y + 12, 4, 4); }
  }
  // field: lozenges, each with a smaller one inside and hooks at the points
  for (let x = 64; x < W + 64; x += 128) {
    const cx = x % W, cy = H / 2;
    for (const ox of [0, cx < 64 ? W : 0, cx > W - 64 ? -W : 0]) {
      g.save(); g.translate(cx + ox, cy);
      g.fillStyle = light; g.beginPath(); g.moveTo(-58, 0); g.lineTo(0, -62); g.lineTo(58, 0); g.lineTo(0, 62); g.closePath(); g.fill();
      g.fillStyle = red; g.beginPath(); g.moveTo(-40, 0); g.lineTo(0, -44); g.lineTo(40, 0); g.lineTo(0, 44); g.closePath(); g.fill();
      g.fillStyle = dark; g.beginPath(); g.moveTo(-18, 0); g.lineTo(0, -20); g.lineTo(18, 0); g.lineTo(0, 20); g.closePath(); g.fill();
      g.strokeStyle = dark; g.lineWidth = 4;
      for (const [px, py, dx, dy] of [[-58, 0, -1, 0], [58, 0, 1, 0], [0, -62, 0, -1], [0, 62, 0, 1]]) { g.beginPath(); g.moveTo(px, py); g.lineTo(px + dx * 8 - dy * 6, py + dy * 8 + dx * 6); g.stroke(); }
      g.restore();
    }
  }
  // wear: paler and thinner down the middle where people walked
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0.25, 'rgba(200,190,170,0)'); grd.addColorStop(0.5, 'rgba(200,190,170,0.22)'); grd.addColorStop(0.75, 'rgba(200,190,170,0)');
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  speckle(g, W, H, 9000, r, ['#000', '#fff'], [0.04, 0.12]);
  const t = tex(c);
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

function fringe(seed) {
  const r = rng(seed);
  const [c, g] = canvas(32, 128);
  for (let y = 0; y < 128; y += 3) { g.fillStyle = `rgba(230,220,195,${0.7 + r() * 0.3})`; g.fillRect(0, y + r(), 26 + r() * 6, 1.6); }
  return tex(c, { repeat: false });
}

// Bare mattress: faint ticking, quilting, and the stains. One tile spans two metres.
function mattress(seed) {
  const r = rng(seed), S = 512;
  const [c, g] = canvas(S, S);
  g.fillStyle = '#d7d2c2'; g.fillRect(0, 0, S, S);
  for (let x = 0; x < S; x += 16) { g.fillStyle = 'rgba(90,110,140,0.12)'; g.fillRect(x, 0, 3, S); }
  g.strokeStyle = 'rgba(80,70,55,0.18)'; g.lineWidth = 1;
  for (let k = -S; k < S * 2; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + S, S); g.moveTo(k, S); g.lineTo(k + S, 0); g.stroke(); }
  g.filter = 'blur(9px)';
  for (const [x, y, w, h, a] of [[300, 220, 90, 60, 0.32], [140, 380, 60, 45, 0.25], [400, 420, 40, 30, 0.2]]) {
    g.fillStyle = `rgba(150,110,50,${a})`; g.beginPath(); g.ellipse(x, y, w, h, r() * 3, 0, 7); g.fill();
    g.fillStyle = `rgba(110,70,30,${a * 0.6})`; g.beginPath(); g.ellipse(x + 10, y + 6, w * 0.6, h * 0.5, r() * 3, 0, 7); g.fill();
  }
  g.filter = 'none';
  speckle(g, S, S, 5000, r, ['#000', '#fff'], [0.03, 0.09]);
  return tex(c);
}

// Theo's duvet: navy with a small print of rockets and stars, quilted in squares.
function duvet(seed) {
  const r = rng(seed), S = 256;
  const [c, g] = canvas(S, S);
  g.fillStyle = '#26406a'; g.fillRect(0, 0, S, S);
  wrapped(g, S, () => {
    for (let k = 0; k < 6; k++) {
      const x = (k * 83) % S + 12, y = (k * 47 + 20) % S;
      g.save(); g.translate(x, y); g.rotate(-0.6 + (k % 3) * 0.3);
      g.fillStyle = 'rgba(235,235,225,0.8)'; g.beginPath(); g.ellipse(0, 0, 4, 11, 0, 0, 7); g.fill();
      g.fillStyle = 'rgba(210,60,50,0.85)'; g.beginPath(); g.moveTo(-4, 6); g.lineTo(-8, 13); g.lineTo(-2, 10); g.fill(); g.beginPath(); g.moveTo(4, 6); g.lineTo(8, 13); g.lineTo(2, 10); g.fill();
      g.fillStyle = 'rgba(240,170,60,0.85)'; g.beginPath(); g.moveTo(-2, 12); g.lineTo(0, 19); g.lineTo(2, 12); g.fill();
      g.restore();
      twinkle(g, (k * 59 + 40) % S, (k * 101 + 70) % S, 5, 'rgba(250,230,150,0.8)');
    }
  });
  g.strokeStyle = 'rgba(10,20,40,0.45)'; g.lineWidth = 1.5;
  for (let k = 0; k <= S; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, S); g.moveTo(0, k); g.lineTo(S, k); g.stroke(); }
  speckle(g, S, S, 3000, r, ['#000', '#fff'], [0.03, 0.08]);
  return tex(c);
}

function fur(seed) {
  const r = rng(seed);
  const [c, g] = canvas(128, 128);
  g.fillStyle = '#b8b0a6'; g.fillRect(0, 0, 128, 128);
  g.lineCap = 'round';
  for (let i = 0; i < 1400; i++) {
    const x = r() * 128, y = r() * 128, a = 1.2 + (r() - 0.5) * 1.2, L = 2 + r() * 4;
    g.strokeStyle = r() < 0.5 ? 'rgba(255,255,255,0.35)' : 'rgba(40,30,20,0.3)'; g.lineWidth = 0.8;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
  }
  return tex(c);
}

// Rag: crumpled cloth, creases and grime.
function rag(seed) {
  const r = rng(seed), S = 128;
  const [c, g] = canvas(S, S);
  g.fillStyle = '#bdb8ae'; g.fillRect(0, 0, S, S);
  g.lineCap = 'round';
  for (let i = 0; i < 40; i++) {
    const x = r() * S, y = r() * S, a = r() * 6.28, L = 10 + r() * 30;
    g.strokeStyle = r() < 0.6 ? 'rgba(40,35,30,0.25)' : 'rgba(255,255,255,0.25)'; g.lineWidth = 0.8 + r() * 1.5;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.5) * L * 0.5, y + Math.sin(a + 0.5) * L * 0.5, x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
  }
  g.filter = 'blur(4px)';
  for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(60,45,30,0.2)'; g.beginPath(); g.arc(r() * S, r() * S, 6 + r() * 14, 0, 7); g.fill(); }
  g.filter = 'none';
  return tex(c);
}

// A cover for book cloth: grain and a little wear.
function bookCloth(seed) {
  const r = rng(seed);
  const [c, g] = canvas(64, 64);
  g.fillStyle = '#cfcac0'; g.fillRect(0, 0, 64, 64);
  speckle(g, 64, 64, 900, r, ['#000', '#fff'], [0.05, 0.15]);
  for (let y = 0; y < 64; y += 2) { g.fillStyle = 'rgba(0,0,0,0.05)'; g.fillRect(0, y, 64, 1); }
  return tex(c);
}

// The tub floor: enamel, a brown ring where the water stood, a rust streak to the drain.
function tubStain(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 128);
  g.fillStyle = '#e6e2d8'; g.fillRect(0, 0, 256, 128);
  g.filter = 'blur(5px)';
  g.strokeStyle = 'rgba(120,85,40,0.35)'; g.lineWidth = 8; g.beginPath(); g.ellipse(128, 64, 100, 42, 0, 0, 7); g.stroke();
  g.fillStyle = 'rgba(130,90,40,0.18)'; g.beginPath(); g.ellipse(128, 64, 90, 36, 0, 0, 7); g.fill();
  g.fillStyle = 'rgba(140,70,30,0.5)'; g.fillRect(20, 58, 90, 10);
  g.filter = 'none';
  speckle(g, 256, 128, 1500, r, ['#5a3a1a', '#fff'], [0.05, 0.15]);
  return tex(c, { repeat: false });
}

// A hole punched through the plasterboard low on the laundry wall, behind the washing machines.
// Black inside, torn paper and broken gypsum round the edge, dirty smears where something comes and goes.
function wallHole(seed) {
  const r = rng(seed), W = 256, H = 256;
  const [c, g] = canvas(W, H);
  const cx = 128, cy = 150;
  const edge = (scale, jag) => {
    g.beginPath();
    for (let k = 0; k <= 40; k++) {
      const a = (k / 40) * Math.PI * 2, rr = scale * (1 + (r() - 0.5) * jag) * (a > 0.2 && a < 2.9 ? 1.0 : 0.95);
      const x = cx + Math.cos(a) * rr * 1.15, y = Math.min(H, cy + Math.sin(a) * rr);
      k ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
  };
  // smears round it
  g.filter = 'blur(5px)';
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4; g.strokeStyle = `rgba(30,22,15,${0.25 + r() * 0.25})`; g.lineWidth = 10 + r() * 14; g.beginPath(); g.moveTo(cx + Math.cos(a) * 80, cy + Math.sin(a) * 70); g.lineTo(cx + Math.cos(a) * (120 + r() * 30), cy + Math.sin(a) * (110 + r() * 30)); g.stroke(); }
  g.filter = 'none';
  // torn paper face, then the gypsum core, then the dark
  g.fillStyle = '#c8c2b2'; edge(98, 0.35); g.fill();
  g.fillStyle = '#e9e4d6'; edge(88, 0.4); g.fill();
  g.fillStyle = '#9a9384'; edge(80, 0.3); g.fill();
  const grd = g.createRadialGradient(cx, cy + 10, 10, cx, cy, 80);
  grd.addColorStop(0, '#000'); grd.addColorStop(0.8, '#050403'); grd.addColorStop(1, '#2a241c');
  g.fillStyle = grd; edge(74, 0.32); g.fill();
  // claw rakes leading in
  g.strokeStyle = 'rgba(15,10,8,0.7)'; g.lineCap = 'round';
  for (let s = 0; s < 2; s++) for (let k = 0; k < 4; k++) {
    const x0 = (s ? 205 : 30) + k * 7, y0 = 40 + s * 30;
    g.lineWidth = 2.2; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + (s ? -10 : 10), y0 + 40, x0 + (s ? -22 : 22), y0 + 85); g.stroke();
  }
  return tex(c, { repeat: false });
}

// Dark smears and long drags of grime: hands that are not hands, high on the laundry walls.
function smears(seed) {
  const r = rng(seed), W = 512, H = 256;
  const [c, g] = canvas(W, H);
  g.filter = 'blur(3px)';
  for (let k = 0; k < 6; k++) {
    const x = 40 + r() * (W - 80), y = 20 + r() * 60;
    for (let f = 0; f < 4; f++) {   // four long fingers dragged down
      g.strokeStyle = `rgba(25,18,12,${0.3 + r() * 0.25})`; g.lineWidth = 4 + r() * 3; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x + f * 9, y + r() * 6); g.bezierCurveTo(x + f * 9 + 4, y + 60, x + f * 10 - 6, y + 120, x + f * 11 + (r() - 0.5) * 20, y + 140 + r() * 60); g.stroke();
    }
  }
  g.filter = 'none';
  return tex(c, { repeat: false });
}

function cardboard(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#a07a4a';
  g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 5) { g.fillStyle = 'rgba(70,45,20,0.08)'; g.fillRect(x, 0, 2, 256); }
  speckle(g, 256, 256, 2500, r, ['#3a2510', '#e0c090'], [0.05, 0.15]);
  g.fillStyle = 'rgba(200,180,140,0.55)';
  g.fillRect(0, 108, 256, 40);  // packing tape
  return tex(c);
}

function boxLabel(text, seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#a07a4a';
  g.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 5) { g.fillStyle = 'rgba(70,45,20,0.08)'; g.fillRect(x, 0, 2, 256); }
  speckle(g, 256, 256, 2000, r, ['#3a2510', '#e0c090'], [0.05, 0.15]);
  g.save();
  g.translate(128, 150);
  g.rotate((r() - 0.5) * 0.15);
  g.fillStyle = '#141414';
  g.font = `bold ${text.length > 8 ? 34 : 44}px "Comic Sans MS", "Marker Felt", sans-serif`;
  g.textAlign = 'center';
  g.fillText(text, 0, 0);
  g.restore();
  return tex(c, { repeat: false });
}

function doorPanel() {
  const [c, g] = canvas(128, 256);
  g.fillStyle = '#c9c4b8';
  g.fillRect(0, 0, 128, 256);
  const panel = (x, y, w, h) => {
    g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 3; g.strokeRect(x, y, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 1; g.strokeRect(x + 3, y + 3, w - 6, h - 6);
  };
  panel(18, 16, 92, 100); panel(18, 136, 92, 104);
  const grd = g.createLinearGradient(0, 200, 0, 256);
  grd.addColorStop(0, 'rgba(60,45,30,0)'); grd.addColorStop(1, 'rgba(60,45,30,0.35)');
  g.fillStyle = grd; g.fillRect(0, 200, 128, 56);
  return tex(c, { repeat: false });
}

function rug(seed, color, round) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  if (round) { g.beginPath(); g.arc(128, 128, 126, 0, 7); g.clip(); }
  g.fillStyle = color;
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(230,210,170,0.45)';
  g.lineWidth = 6;
  if (round) {
    // a braided rag rug: a spiral of plaits, colours changing every few rounds
    g.fillStyle = '#3a2a1a'; g.fillRect(0, 0, 256, 256);
    const cols = [color, '#c8642a', color, '#e8d8a8', '#5a7a9a', color, '#a8402a', '#e8d8a8'];
    for (let ring = 0; ring < 18; ring++) {
      const rad = 6 + ring * 6.8, col = cols[(ring / 2 | 0) % cols.length], n = Math.max(6, Math.round(rad * 0.9));
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + ring * 0.3;
        g.save(); g.translate(128 + Math.cos(a) * rad, 128 + Math.sin(a) * rad); g.rotate(a + (k % 2 ? 0.6 : -0.6));
        g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, 2.6, 4.6, 0, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.18)'; g.beginPath(); g.ellipse(-0.6, -1.2, 1, 2, 0, 0, 7); g.fill();
        g.restore();
      }
    }
  }
  else {
    g.strokeRect(14, 14, 228, 228);
    g.lineWidth = 2; g.strokeRect(26, 26, 204, 204);
    g.fillStyle = 'rgba(230,210,170,0.25)';
    for (let k = 0; k < 4; k++) { g.save(); g.translate(128, 128); g.rotate(k * Math.PI / 2); g.beginPath(); g.moveTo(0, -80); g.lineTo(30, 0); g.lineTo(0, 80); g.lineTo(-30, 0); g.fill(); g.restore(); }
  }
  speckle(g, 256, 256, 7000, r, ['#000', '#fff'], [0.04, 0.12]);
  return tex(c, { repeat: false });
}

// ---------- effects ----------

function dust(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);  // 0.5 m tile
  g.fillStyle = 'rgba(178,170,156,0.55)';
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 300; i++) {  // soft clumps
    g.fillStyle = 'rgba(200,192,178,0.25)';
    g.beginPath(); g.arc(r() * 256, r() * 256, 4 + r() * 10, 0, 7); g.fill();
  }
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = r() < 0.4 ? 'rgba(60,52,42,0.9)' : 'rgba(215,208,195,0.9)';
    const s = 1 + r() * 2.5;
    g.fillRect(r() * 256, r() * 256, s, s);
  }
  g.lineCap = 'round';
  for (let i = 0; i < 140; i++) {  // hairs and fibres
    g.strokeStyle = r() < 0.5 ? 'rgba(40,32,26,0.8)' : 'rgba(190,180,170,0.7)';
    g.lineWidth = 0.8;
    g.beginPath();
    const x = r() * 256, y = r() * 256, a = r() * 7, L = 6 + r() * 18;
    g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a + 1) * L * 0.5, y + Math.sin(a + 1) * L * 0.5, x + Math.cos(a) * L, y + Math.sin(a) * L);
    g.stroke();
  }
  for (let i = 0; i < 40; i++) {  // crumbs
    g.fillStyle = hsl(30, 40, 25 + r() * 25);
    g.beginPath(); g.arc(r() * 256, r() * 256, 1.5 + r() * 2.5, 0, 7); g.fill();
  }
  return tex(c);
}

// A bare foot with toes far too long, pointing +x.
function footprint(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 96);
  g.fillStyle = 'rgba(48,32,20,1)';
  const blob = (x, y, rx, ry, a = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, a, 0, 7); g.fill(); };
  blob(40, 50, 26, 22);           // heel
  blob(95, 52, 48, 19, 0.05);     // sole
  blob(150, 46, 22, 26);          // ball
  const toes = [[205, 28, 34, 9, -0.2], [214, 42, 38, 8, -0.05], [212, 55, 36, 7, 0.06], [204, 66, 32, 6.5, 0.18], [190, 76, 26, 6, 0.3]];
  for (const t of toes) blob(...t);
  g.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 700; i++) { g.globalAlpha = 0.3 + r() * 0.7; g.fillRect(r() * 256, r() * 96, 1 + r() * 3, 1 + r() * 3); }
  g.globalCompositeOperation = 'source-over';
  g.globalAlpha = 1;
  return tex(c, { repeat: false });
}

function windowCookie(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#000';
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#fff';
  const m = 26, bar = 10;
  const w = (256 - m * 2 - bar) / 2;
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) g.fillRect(m + i * (w + bar), m + j * (w + bar), w, w);
  branches(g, r, '#000', 256);
  const grd = g.createRadialGradient(128, 128, 60, 128, 128, 170);
  grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(1, 'rgba(0,0,0,1)');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  return tex(c, { repeat: false });
}

function windowSky(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#060b1a'); grd.addColorStop(0.7, '#14203a'); grd.addColorStop(1, '#22304a');
  g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#cfd8ff';
  for (let i = 0; i < 40; i++) { g.globalAlpha = 0.3 + r() * 0.6; g.fillRect(r() * 256, r() * 150, 1, 1); }
  g.globalAlpha = 1;
  branches(g, r, '#020306', 256);
  return tex(c, { repeat: false });
}

function branches(g, r, color, size) {
  g.strokeStyle = color;
  g.lineCap = 'round';
  const grow = (x, y, a, len, w, depth) => {
    if (depth <= 0 || len < 4) return;
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    g.lineWidth = w;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
    grow(x2, y2, a + (r() - 0.3) * 0.9, len * 0.72, w * 0.68, depth - 1);
    if (r() < 0.7) grow(x2, y2, a - (r() - 0.2) * 1.1, len * 0.6, w * 0.6, depth - 1);
  };
  grow(size * 1.05, size * 0.2, Math.PI * 0.95, size * 0.3, 7, 7);
  grow(-size * 0.05, size * 0.85, -0.35, size * 0.25, 5, 6);
}

// The drawing on Theo's wall, at robot height.
function crayonWall(seed) {
  const r = rng(seed);
  const [c, g] = canvas(512, 256);
  const line = (pts, color, w = 4) => {
    g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++) {
      g.beginPath();
      pts.forEach(([x, y], i) => { const jx = x + (r() - 0.5) * 3, jy = y + (r() - 0.5) * 3; i ? g.lineTo(jx, jy) : g.moveTo(jx, jy); });
      g.stroke();
    }
  };
  // house
  line([[40, 230], [40, 150], [140, 150], [140, 230], [40, 230]], '#c8312b');
  line([[30, 155], [90, 100], [150, 155]], '#c8312b');
  line([[78, 230], [78, 190], [102, 190], [102, 230]], '#2a5bc8');
  // family
  const stick = (x, h, color) => {
    line([[x, 232], [x + 6, 232 - h * 0.4], [x + 12, 232]], color, 3);
    line([[x + 6, 232 - h * 0.4], [x + 6, 232 - h * 0.85]], color, 3);
    line([[x - 4, 232 - h * 0.7], [x + 16, 232 - h * 0.7]], color, 3);
    g.strokeStyle = color; g.lineWidth = 3; g.beginPath(); g.arc(x + 6, 232 - h, h * 0.15, 0, 7); g.stroke();
  };
  stick(170, 70, '#2a8a3a'); stick(200, 74, '#2a5bc8'); stick(232, 46, '#e08a1a');
  line([[258, 228], [262, 214], [282, 214], [286, 228]], '#7a4a20', 3);  // dog
  // the tall one, black, pressed hard
  const x = 380;
  line([[x - 14, 240], [x, 120], [x + 16, 240]], '#111', 6);
  line([[x, 120], [x, 30]], '#111', 6);
  line([[x, 45], [x - 70, 150], [x - 82, 200]], '#111', 5);
  line([[x, 45], [x + 70, 150], [x + 84, 205]], '#111', 5);
  for (let k = 0; k < 5; k++) line([[x - 82, 200], [x - 92 + k * 5, 222]], '#111', 2);
  for (let k = 0; k < 5; k++) line([[x + 84, 205], [x + 78 + k * 5, 228]], '#111', 2);
  g.fillStyle = '#111'; g.beginPath(); g.ellipse(x, 18, 11, 16, 0, 0, 7); g.fill();
  g.fillStyle = '#c8312b'; g.fillRect(x - 6, 20, 12, 3);
  g.font = 'bold 26px "Comic Sans MS", sans-serif';
  g.fillStyle = '#111';
  g.textAlign = 'right';
  g.fillText('LONG MAN', 506, 250);
  return tex(c, { repeat: false });
}

// Crayon on the underside of Theo's bed slats. Only a robot parked under the bed, looking up, would see it.
function underBed(seed) {
  const r = rng(seed);
  const [c, g] = canvas(512, 256);
  g.fillStyle = '#1a1612';
  g.textAlign = 'center';
  const word = (t, x, y, size, rot) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.font = `bold ${size}px "Comic Sans MS", "Chalkboard SE", sans-serif`;
    for (let p = 0; p < 2; p++) { g.globalAlpha = 0.75; g.fillText(t, (r() - 0.5) * 2, (r() - 0.5) * 2); }
    g.restore(); g.globalAlpha = 1;
  };
  word('UNDER HERE', 190, 80, 54, -0.04);
  word('HE CANT REACH', 210, 150, 54, 0.03);
  // tally marks: nights survived
  g.strokeStyle = '#1a1612'; g.lineWidth = 4; g.lineCap = 'round';
  let x = 40;
  for (let n = 0; n < 23; n++) {
    const grp = n % 5;
    g.beginPath();
    if (grp === 4) { g.moveTo(x - 46, 208); g.lineTo(x - 4, 232); x += 18; }
    else { g.moveTo(x + (r() - 0.5) * 3, 200); g.lineTo(x + (r() - 0.5) * 3, 240); x += 11; }
    g.stroke();
  }
  // and a small drawing of a hand reaching, crossed out
  g.lineWidth = 3;
  g.beginPath(); g.moveTo(430, 60); g.lineTo(480, 120); g.moveTo(440, 60); g.lineTo(445, 30); g.moveTo(450, 62); g.lineTo(460, 28); g.moveTo(460, 66); g.lineTo(474, 34); g.stroke();
  g.strokeStyle = '#b02020'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(410, 20); g.lineTo(500, 140); g.moveTo(500, 20); g.lineTo(410, 140); g.stroke();
  return tex(c, { repeat: false });
}

// Grey scuffs where something tall keeps brushing the top of the door frames.
function scuff(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 64);
  for (let k = 0; k < 26; k++) {
    g.globalAlpha = 0.08 + r() * 0.14;
    g.fillStyle = r() < 0.5 ? '#4a4844' : '#2a2826';
    g.beginPath();
    g.ellipse(40 + r() * 176, 20 + r() * 30, 12 + r() * 40, 2 + r() * 6, (r() - 0.5) * 0.4, 0, 7);
    g.fill();
  }
  g.globalAlpha = 1;
  return tex(c, { repeat: false });
}

// A soft round glow for fake lights.
function glow() {
  const [c, g] = canvas(64, 64, false);
  const rad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rad.addColorStop(0, 'rgba(255,255,255,1)'); rad.addColorStop(0.25, 'rgba(255,255,255,0.45)'); rad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = rad; g.fillRect(0, 0, 64, 64);
  return tex(c, { repeat: false });
}

function polaroid(seed) {
  const r = rng(seed);
  const [c, g] = canvas(128, 150);
  g.fillStyle = '#eee9dc'; g.fillRect(0, 0, 128, 150);
  g.fillStyle = '#2a2a30'; g.fillRect(10, 10, 108, 100);
  g.fillStyle = '#4a4438'; g.fillRect(10, 70, 108, 40);
  for (const x of [35, 55, 72]) { g.fillStyle = '#806a5a'; g.fillRect(x, 60 - (x === 72 ? -8 : 0), 10, 30); }
  g.fillStyle = '#c9c0a0'; g.fillRect(84, 20, 26, 30);
  g.fillStyle = '#111'; g.fillRect(94, 18, 6, 32);
  speckle(g, 128, 150, 800, r, ['#000', '#fff'], [0.05, 0.15]);
  return tex(c, { repeat: false });
}

function drawingPaper(seed) {
  const r = rng(seed);
  const [c, g] = canvas(128, 96);
  g.fillStyle = '#f2efe6'; g.fillRect(0, 0, 128, 96);
  g.strokeStyle = '#c8312b'; g.lineWidth = 2; g.strokeRect(14, 50, 36, 34);
  g.beginPath(); g.moveTo(10, 52); g.lineTo(32, 32); g.lineTo(54, 52); g.stroke();
  g.strokeStyle = '#111'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(96, 90); g.lineTo(100, 50); g.lineTo(104, 90); g.moveTo(100, 50); g.lineTo(100, 12); g.moveTo(100, 18); g.lineTo(78, 70); g.moveTo(100, 18); g.lineTo(122, 72); g.stroke();
  speckle(g, 128, 96, 400, r, ['#000'], [0.03, 0.08]);
  return tex(c, { repeat: false });
}

export function makeTextures() {
  const T = {
    floor: {
      wood: wood(1, false), woodDark: wood(2, true), checker: checker(3), smallTile: smallTile(4),
      carpet: carpet(5, 20, 18, 34), carpetBlue: carpet(6, 215, 30, 32), concrete: concrete(7),
    },
    wall: {}, ceiling: ceiling(8), furnWood: furnWood(9), fabric: fabric(10, 15, 25, 30), fabricBlue: fabric(11, 210, 30, 35),
    sheet: sheet(12), cardboard: cardboard(13), door: doorPanel(), dust: dust(14), footprint: footprint(15),
    cookie: windowCookie(16), sky: windowSky(17), crayon: crayonWall(18), polaroid: polaroid(19), drawing: drawingPaper(20),
    underBed: underBed(21), scuff: scuff(22), glow: glow(),
    mattress: mattress(23), duvet: duvet(24), fur: fur(25), rag: rag(26), bookSpine: bookCloth(27), tubStain: tubStain(28),
    fringe: fringe(29), hole: wallHole(30), smears: smears(31),

    rugs: {}, labels: {}, runners: {},
  };
  for (const k of ['sage', 'cream', 'plain', 'stripe', 'tile', 'kid', 'mauve']) T.wall[k] = wallpaper(k, k.length * 31);
  T.rug = (color, round) => (T.rugs[color + round] ||= rug(color.length + (round ? 7 : 3), color, round));
  T.runner = (color) => (T.runners[color] ||= runner(41, color));
  T.label = (text) => (T.labels[text] ||= boxLabel(text, text.length * 13));
  return T;
}

// A small canvas that shows TV snow.
export function makeStatic() {
  const [c, g] = canvas(64, 48, false);
  const t = tex(c, { repeat: false });
  t.magFilter = THREE.NearestFilter;
  const img = g.createImageData(64, 48);
  return {
    texture: t,
    update() {
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      t.needsUpdate = true;
    },
  };
}
