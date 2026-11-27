// Album page layouts: what a goal's board teaches and where its stickers sit. No DOM (the checker validates these).
//
// board: { type, caption, parts: [{ kind, slot?, at? }] }      kind = a key of the level's `stickers`
//   cycle     parts go round a loop with arrows (at: [u, v] places a part by hand)
//   sequence  parts in a row, left to right, with arrows (first, then, last)
//   pattern   a repeating row; slots are the missing pieces
//   pairs     parts in twos: [left, right, left, right, …] joined by a line (who eats what, grows into, opposites)
//   count     a numeral (n, default = parts) and that many parts
//   groups    { groups: [{ icon, parts }] }: sort into hoops; a slot takes any sticker that belongs in its hoop
//
// Layout units: u, v are 0..1 across the board area; r is the sticker radius as a share of min(width, height).

export const BOARD_TYPES = ['cycle', 'sequence', 'pattern', 'pairs', 'count', 'groups'];

const row = (n, v, u0 = 0.1, u1 = 0.9) => Array.from({ length: n }, (_, i) => [u0 + ((u1 - u0) * (i + 0.5)) / n, v]);

// -> { type, parts: [{ kind, slot, u, v, group, accept }], r, deco }
export function layoutBoard(board) {
  const type = board.type || 'cycle';
  let parts = [], r = 0.13;
  const deco = { type };
  if (type === 'groups') {
    const gs = board.groups;
    deco.groups = gs.map((g, j) => {
      const cu = (j + 0.5) / gs.length, n = g.parts.length;
      const accept = g.parts.filter((p) => p.slot).map((p) => p.kind);
      g.parts.forEach((p, i) => {
        const cols = n > 2 ? 2 : 1, rows = Math.ceil(n / cols);
        const c = i % cols, rr = Math.floor(i / cols);
        const u = cu + (cols > 1 ? (c - 0.5) * (0.36 / gs.length) : 0);
        const v = 0.6 + (rows > 1 ? (rr - (rows - 1) / 2) * 0.36 : 0);
        parts.push({ kind: p.kind, slot: !!p.slot, u, v, group: j, accept: p.slot ? accept : null });
      });
      return { icon: g.icon, u: cu, v: 0.6, rx: 0.42 / gs.length, ry: 0.43 };
    });
    r = gs.length > 2 ? 0.1 : 0.12;
  } else {
    const src = board.parts, n = src.length;
    let at;
    if (type === 'cycle') {
      at = n === 2 ? [[0.5, 0.2], [0.5, 0.8]]
        : n === 3 ? [[0.32, 0.22], [0.68, 0.22], [0.5, 0.8]]
        : n === 4 ? [[0.5, 0.14], [0.8, 0.5], [0.5, 0.86], [0.2, 0.5]]
        : src.map((_, i) => [0.5 + 0.34 * Math.sin((i / n) * Math.PI * 2), 0.5 - 0.36 * Math.cos((i / n) * Math.PI * 2)]);
    } else if (type === 'sequence' || type === 'pattern') {
      at = row(n, 0.5);
      r = Math.min(0.13, 0.32 / n);
    } else if (type === 'pairs') {
      const k = Math.ceil(n / 2);
      at = src.map((_, i) => [i % 2 ? 0.74 : 0.26, k === 1 ? 0.5 : 0.22 + (0.56 * Math.floor(i / 2)) / (k - 1)]);
      r = k > 2 ? 0.1 : 0.12;
      deco.links = Array.from({ length: k }, (_, i) => [2 * i, 2 * i + 1]).filter(([, b]) => b < n);
    } else if (type === 'count') {
      const cols = Math.min(n, n > 4 ? Math.ceil(n / 2) : n), rows = Math.ceil(n / cols);
      at = src.map((_, i) => [0.42 + (0.5 * ((i % cols) + 0.5)) / cols, 0.5 + (rows > 1 ? (Math.floor(i / cols) - (rows - 1) / 2) * 0.34 : 0)]);
      r = Math.min(0.12, 0.2 / cols + 0.02);
      deco.number = board.n ?? n;
    }
    parts = src.map((p, i) => ({ kind: p.kind, slot: !!p.slot, u: (p.at || at[i])[0], v: (p.at || at[i])[1], accept: null }));
    if (type === 'sequence') deco.arrows = parts.slice(1).map((_, i) => [i, i + 1]);
  }
  return { type, parts, r, deco };
}

// Problems with one goal's board, for the checker.
export function boardProblems(level, goal) {
  const b = goal.board, out = [];
  if (!b) return ['no board'];
  if (b.type && !BOARD_TYPES.includes(b.type)) out.push(`unknown board type "${b.type}"`);
  if (!b.caption) out.push('no caption');
  const { parts } = layoutBoard(b);
  const stickers = level.page.stickers;
  for (const p of parts) if (!stickers[p.kind]) out.push(`kind ${p.kind} has no sticker emoji`);
  // every item the goal takes must have a slot that accepts it, one each
  const free = parts.filter((p) => p.slot).map((p) => p.accept || [p.kind]);
  const kindOf = (id) => level.items.find((it) => it.id === id)?.kind;
  for (const id of goal.items) {
    const k = kindOf(id);
    if (!k) {
      out.push(`goal item ${id} is not in the level`);
      continue;
    }
    const i = free.findIndex((acc) => acc.includes(k));
    if (i < 0) out.push(`no slot for item ${id} (${k})`);
    else free.splice(i, 1);
  }
  if (free.length) out.push(`${free.length} slot(s) with no item`);
  return out;
}
