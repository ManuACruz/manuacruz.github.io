// Emoji sprites, pre-rendered once: plain, sticker (white die-cut border), ghost (flat silhouette),
// outline (the die-cut shape as a line, for "stick it here") and gloss (the shiny mark a sticker leaves on its backing).

export const EMOJI_FONT = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif';
export const UI_FONT = 'Fredoka, "Baloo 2", ui-rounded, "Segoe UI Rounded", "Arial Rounded MT Bold", system-ui, sans-serif';

const S = 128;
const cache = new Map();

function canvas(w = S, h = S) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function base(e) {
  const c = canvas();
  const x = c.getContext('2d');
  x.font = `76px ${EMOJI_FONT}`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(e, S / 2, S / 2 + 5);
  return c;
}

function silhouette(src, color) {
  const c = canvas();
  const x = c.getContext('2d');
  x.drawImage(src, 0, 0);
  x.globalCompositeOperation = 'source-in';
  x.fillStyle = color;
  x.fillRect(0, 0, S, S);
  return c;
}

function sticker(src) {
  const c = canvas();
  const x = c.getContext('2d');
  const edge = silhouette(src, '#c9ced8');
  const white = silhouette(src, '#ffffff');
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    x.drawImage(edge, Math.cos(a) * 9, Math.sin(a) * 9 + 1.5);
  }
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    x.drawImage(white, Math.cos(a) * 8, Math.sin(a) * 8);
  }
  x.drawImage(src, 0, 0);
  // glossy sheen across the top
  x.globalCompositeOperation = 'source-atop';
  const g = x.createLinearGradient(0, 0, S, S);
  g.addColorStop(0, 'rgba(255,255,255,0.35)');
  g.addColorStop(0.45, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  return c;
}

// the silhouette grown by d px
function dilate(src, color, d) {
  const c = canvas();
  const x = c.getContext('2d');
  const ink = silhouette(src, color);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    x.drawImage(ink, Math.cos(a) * d, Math.sin(a) * d);
  }
  return c;
}

// the die-cut edge as a line, with a faint fill inside
function outline(src, color) {
  const c = canvas();
  const x = c.getContext('2d');
  x.drawImage(dilate(src, color, 10), 0, 0);
  x.globalCompositeOperation = 'destination-out';
  const inner = dilate(src, color, 6.5);
  x.drawImage(inner, 0, 0);
  x.globalCompositeOperation = 'source-over';
  x.globalAlpha = 0.12;
  x.drawImage(inner, 0, 0);
  return c;
}

// style: 'plain' | 'sticker' | 'ghost' | 'outline' | 'gloss'
export function emoji(e, style = 'plain') {
  const key = style + e;
  let c = cache.get(key);
  if (c) return c;
  const b = cache.get('plain' + e) || base(e);
  cache.set('plain' + e, b);
  if (style === 'sticker') c = sticker(b);
  else if (style === 'ghost') c = silhouette(b, '#7d8597');
  else if (style === 'outline') c = outline(b, '#5b4a3a');
  else if (style === 'gloss') c = dilate(b, '#ffffff', 9);
  else c = b;
  cache.set(key, c);
  return c;
}

// Draw a sprite centred at x, y with the emoji's visual radius r.
export function drawEmoji(ctx, e, x, y, r, style = 'plain', rot = 0, alpha = 1) {
  const im = emoji(e, style);
  const s = (r * 2 * S) / 76;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.drawImage(im, -s / 2, -s / 2, s, s);
  ctx.restore();
}
