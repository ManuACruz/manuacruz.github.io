// Logical screen layout (portrait, 360x640). Shared by the simulation and the renderer.

export const W = 360, H = 640;
export const GRID = { x: 118, y: 178, cell: 56, gap: 6 };
export const WATER_Y = 470;
export const FACES = [
  [['front', 'sky'], ['sky'], ['sky', 'rear']],
  [['front'], ['core'], ['rear']],
  [['front', 'water'], ['water'], ['water', 'rear']],
];
export const FRONT_SLOTS = [[82, 206], [44, 268], [80, 334], [22, 236], [34, 316], [64, 252]];
export const SKY_SLOTS = [[72, 80], [134, 112], [104, 50], [172, 84], [40, 122], [210, 60]];

// Each column follows the one in front with a little lag, so the train sways instead of bobbing as a block.
export function bobAt(col, clock) { return Math.sin(clock * 1.6 - col * 0.55) * 3; }

export function cellRect(col, row, clock) {
  const x = GRID.x + col * (GRID.cell + GRID.gap);
  const y = GRID.y + row * (GRID.cell + GRID.gap) + bobAt(col, clock);
  return { x, y, w: GRID.cell, h: GRID.cell, cx: x + GRID.cell / 2, cy: y + GRID.cell / 2 };
}

export function cellAt(x, y, clock) {
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const k = cellRect(c, r, clock);
    if (x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h) return { col: c, row: r };
  }
  return null;
}

export function validCell(def, col, row) {
  const faces = FACES[row][col];
  return !faces.includes('core') && def.allowed.some((f) => faces.includes(f));
}
