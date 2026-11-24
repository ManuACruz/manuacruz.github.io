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

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function tex(c, { repeat = true, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
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

function wallpaper(kind, seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);  // 1 m tile
  const base = { sage: [95, 14, 46], cream: [42, 30, 62], plain: [30, 5, 50], stripe: [350, 22, 30], tile: [190, 10, 78], kid: [205, 35, 60], mauve: [320, 14, 44] }[kind];
  g.fillStyle = hsl(...base);
  g.fillRect(0, 0, 256, 256);
  if (kind === 'sage' || kind === 'stripe') {
    const w = kind === 'stripe' ? 32 : 16;
    for (let x = 0; x < 256; x += w * 2) { g.fillStyle = hsl(base[0], base[1], base[2] - (kind === 'stripe' ? 7 : 3)); g.fillRect(x, 0, w, 256); }
  }
  if (kind === 'sage' || kind === 'mauve') {
    g.fillStyle = hsl(base[0], base[1], base[2] + 6);
    for (let y = 16; y < 256; y += 32) for (let x = (y / 32) % 2 ? 16 : 0; x < 256; x += 32) {
      g.beginPath(); g.ellipse(x, y, 3, 5, 0, 0, 7); g.fill();
      if (kind === 'mauve') { g.beginPath(); g.ellipse(x + 4, y, 5, 2, 0.5, 0, 7); g.fill(); }
    }
  }
  if (kind === 'tile') {
    g.strokeStyle = 'rgba(80,90,95,0.7)';
    g.lineWidth = 2;
    for (let k = 0; k <= 256; k += 38.4) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 256); g.moveTo(0, k); g.lineTo(256, k); g.stroke(); }
  }
  if (kind === 'kid') {
    g.fillStyle = 'rgba(255,255,230,0.5)';
    for (let i = 0; i < 9; i++) star(g, r() * 256, r() * 256, 4 + r() * 4);
    g.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 3; i++) { const x = r() * 256, y = r() * 256; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + k * 9, y + Math.sin(k) * 4, 9, 0, 7); g.fill(); } }
  }
  speckle(g, 256, 256, 2500, r, ['#000', '#fff'], [0.02, 0.07]);
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

function sheet(seed) {
  const r = rng(seed);
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#d9d6cc';
  g.fillRect(0, 0, 256, 256);
  for (let k = 0; k < 14; k++) {
    const x = r() * 256, w = 6 + r() * 26;
    const grd = g.createLinearGradient(x - w, 0, x + w, 0);
    grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.5, `rgba(60,55,50,${0.1 + r() * 0.15})`); grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(x - w, 0, w * 2, 256);
  }
  speckle(g, 256, 256, 2500, r, ['#000', '#fff'], [0.03, 0.08]);
  return tex(c);
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
  if (round) { g.beginPath(); g.arc(128, 128, 110, 0, 7); g.stroke(); g.beginPath(); g.arc(128, 128, 60, 0, 7); g.stroke(); }
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
    rugs: {}, labels: {},
  };
  for (const k of ['sage', 'cream', 'plain', 'stripe', 'tile', 'kid', 'mauve']) T.wall[k] = wallpaper(k, k.length * 31);
  T.rug = (color, round) => (T.rugs[color + round] ||= rug(color.length + (round ? 7 : 3), color, round));
  T.label = (text) => (T.labels[text] ||= boxLabel(text, text.length * 13));
  return T;
}

// A small canvas that shows TV snow.
export function makeStatic() {
  const [c, g] = canvas(64, 48);
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
