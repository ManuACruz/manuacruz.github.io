// Drawing helpers shared by the themes. A figure is a painted cut-out with a pale wood rim
// and a darker copy below it for thickness. Shapes with class m0 show while a figure is
// quiet, m1 while it sounds a note (a mouth that opens, eyes that wake up).

export const WOOD = '#f2d6a6';
export const WOOD_D = '#b98a4f';
export const INK = '#3b2a1f';
export const PINK = '#ff8fa3';
export const TONGUE = '#ff6f86';

export const eye = (x, y, r = 4.4) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.32}" fill="#fff"/>`;
export const cheek = (x, y, r = 5.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${PINK}" opacity=".55"/>`;
export const line = (d, w = 2.6, c = INK, cls = '') =>
  `<path ${cls ? `class="${cls}" ` : ''}d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// An eye that is closed while quiet and opens on a note.
export const sleepy = (x, y, r = 4.4, c = INK) =>
  `${line(`M${x - r} ${y - r * 0.2} Q${x} ${y + r} ${x + r} ${y - r * 0.2}`, 2.4, c, 'm0')}<g class="m1">${eye(x, y, r)}</g>`;

// sil: the outline shapes. color: the paint over all of it. paint: everything drawn on top.
export function wrap(id, sil, color, paint) {
  return `<svg viewBox="-12 -12 124 124" aria-hidden="true">
<defs><g id="sil-${id}">${sil}</g></defs>
<ellipse cx="50" cy="103" rx="38" ry="6.5" fill="#000" opacity=".2"/>
<use href="#sil-${id}" transform="translate(0 6)" fill="${WOOD_D}" stroke="${WOOD_D}" stroke-width="9" stroke-linejoin="round"/>
<use href="#sil-${id}" fill="${WOOD}" stroke="${WOOD}" stroke-width="9" stroke-linejoin="round"/>
<use href="#sil-${id}" fill="${color}"/>
${paint}</svg>`;
}

// ---------- hand-made shapes ----------
// Figures drawn with these look sawn and painted by hand: outlines run through hand-placed
// points (never a perfect circle, never symmetric) and lines are brush strokes that swell
// and thin out.

const P = (n) => +n.toFixed(1);
// A smooth curve through the points (Catmull-Rom), as an SVG path.
function spline(pts, closed) {
  const n = pts.length;
  const g = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${P(pts[0][0])} ${P(pts[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += `C${P(p1[0] + (p2[0] - p0[0]) / 6)} ${P(p1[1] + (p2[1] - p0[1]) / 6)} ${P(p2[0] - (p3[0] - p1[0]) / 6)} ${P(p2[1] - (p3[1] - p1[1]) / 6)} ${P(p2[0])} ${P(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
export const blob = (pts) => spline(pts, true);
// A filled patch of paint through the points.
export const shape = (pts, fill, cls = '') => `<path ${cls ? `class="${cls}" ` : ''}d="${blob(pts)}" fill="${fill}"/>`;
// A painted dot: an oval, a little tilted, with no shine.
export const dab = (x, y, rx, ry = rx, rot = 0, c = INK) =>
  `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${x} ${y})"` : ''} fill="${c}"/>`;

function sample(pts, per = 8) {
  const n = pts.length, out = [];
  const g = (i) => pts[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    for (let k = 0; k < per; k++) {
      const t = k / per, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((a) => 0.5 * (2 * p1[a] + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
    }
  }
  out.push(pts[n - 1]);
  return out;
}
// One brush stroke along the points: it lands, swells, and lifts off thinner than it began.
export function brush(pts, w, c = INK, cls = '', opacity = 1) {
  const s = sample(pts), m = s.length, L = [], R = [];
  for (let i = 0; i < m; i++) {
    const a = s[Math.max(0, i - 1)], b = s[Math.min(m - 1, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1];
    const len = Math.hypot(tx, ty) || 1;
    tx /= len; ty /= len;
    const t = i / (m - 1);
    const h = (w / 2) * (0.3 + 0.7 * Math.pow(Math.sin(Math.PI * t), 0.6)) * (1.12 - 0.3 * t);
    L.push(`${P(s[i][0] - ty * h)} ${P(s[i][1] + tx * h)}`);
    R.push(`${P(s[i][0] + ty * h)} ${P(s[i][1] - tx * h)}`);
  }
  return `<path ${cls ? `class="${cls}" ` : ''}d="M${L.join('L')}L${R.reverse().join('L')}Z" fill="${c}" stroke="${c}" stroke-width=".9" stroke-linejoin="round"${opacity < 1 ? ` opacity="${opacity}"` : ''}/>`;
}

// A hand-cut figure. pts: the outline. color: the base coat. paint: what is painted on it
// (kept inside the outline). over: anything allowed to stick out past the edge.
export function cut(id, pts, color, paint, over = '') {
  return `<svg viewBox="-12 -12 124 124" aria-hidden="true">
<defs><path id="sil-${id}" d="${blob(pts)}"/><clipPath id="clip-${id}"><use href="#sil-${id}"/></clipPath></defs>
<ellipse cx="50" cy="103" rx="38" ry="6.5" fill="#000" opacity=".2"/>
<use href="#sil-${id}" transform="translate(0 6)" fill="${WOOD_D}" stroke="${WOOD_D}" stroke-width="9" stroke-linejoin="round"/>
<use href="#sil-${id}" fill="${WOOD}" stroke="${WOOD}" stroke-width="9" stroke-linejoin="round"/>
<use href="#sil-${id}" fill="${color}"/>
<g clip-path="url(#clip-${id})">${paint}</g>${over}</svg>`;
}

// A mat's picture, drawn in white over the mat's colour.
export const icon = (inner) => `<svg class="icon" viewBox="0 0 100 100" aria-hidden="true" fill="#fff">${inner}</svg>`;
