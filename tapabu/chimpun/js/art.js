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

// A mat's picture, drawn in white over the mat's colour.
export const icon = (inner) => `<svg class="icon" viewBox="0 0 100 100" aria-hidden="true" fill="#fff">${inner}</svg>`;
