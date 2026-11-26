// The sticker album: its spreads (one per world) and what the player has stuck in it.
// No DOM (the level checker imports this); progress is kept in localStorage 'hopper.album' when there is one.
import { LEVELS } from './levels.js';

// A spread is two facing pages. `spots` place each sticker of the world's levels on it:
// key `<level id>.<item id>` -> [u, v, size, rot, anim], u 0..1 across both pages (the spine is at 0.5), v 0..1 down.
// anim is how the sticker moves once the whole spread is full: bob | drip | crawl | sway | buzz | pulse | wobble.
export const SPREADS = [
  { id: 'front', kind: 'front' },
  {
    id: 'garden', kind: 'scene', title: 'The Garden', hat: '👒',
    spots: {
      'rain.i1': [0.18, 0.37, 0.9, 0, 'drip'],
      'wings.i1': [0.31, 0.69, 1, -0.12, 'crawl'],
      'sunflower.i1': [0.4, 0.86, 0.95, 0, 'sway'],
      'sunflower.i2': [0.63, 0.36, 1.3, 0.08, 'sway'],
      'bees.i1': [0.8, 0.3, 0.95, -0.15, 'buzz'],
      'bees.i2': [0.89, 0.63, 1, 0.12, 'pulse'],
      'bees.i3': [0.73, 0.83, 1, -0.06, 'wobble'],
    },
  },
  { id: 'soon', kind: 'soon' },
];

export const stickerKey = (level, itemId) => `${level.id}.${itemId}`;

// key -> { key, e, level (index), spread (index), spot }
export const STICKERS = {};
LEVELS.forEach((L, li) => {
  const si = SPREADS.findIndex((s) => s.id === L.world);
  for (const it of L.items) {
    const key = stickerKey(L, it.id);
    STICKERS[key] = { key, e: L.stickers[it.kind], level: li, spread: si, spot: si >= 0 ? SPREADS[si].spots[key] || null : null };
  }
});

export const levelStickers = (li) => LEVELS[li].items.map((it) => stickerKey(LEVELS[li], it.id));
export const spreadKeys = (si) => Object.keys(SPREADS[si].spots || {});

// Problems with the data, for the checker: stickers with nowhere to go, spots with no sticker.
export function stickerProblems() {
  const out = [];
  for (const s of Object.values(STICKERS)) {
    if (s.spread < 0) out.push(`${s.key}: level world "${LEVELS[s.level].world}" has no spread`);
    else if (!s.spot) out.push(`${s.key}: no spot on spread "${SPREADS[s.spread].id}"`);
  }
  SPREADS.forEach((sp) => {
    for (const k of Object.keys(sp.spots || {})) if (!STICKERS[k]) out.push(`spread "${sp.id}": spot ${k} has no sticker`);
  });
  return out;
}

// ---------- progress ----------
const KEY = 'hopper.album';
const fresh = () => ({ placed: {}, pocket: [], hats: [], hat: null, alive: {} });
let S = fresh();
try {
  const s = JSON.parse(globalThis.localStorage?.getItem(KEY) || 'null');
  if (s && typeof s === 'object') S = { ...fresh(), ...s };
} catch {}
const save = () => {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(S));
  } catch {}
};

export const album = {
  placed: (k) => !!S.placed[k],
  // stickers won but not stuck in yet
  pocket: () => S.pocket.filter((k) => STICKERS[k] && !S.placed[k]),
  addToPocket(keys) {
    for (const k of keys) if (!S.placed[k] && !S.pocket.includes(k)) S.pocket.push(k);
    save();
  },
  place(k) {
    S.placed[k] = 1;
    S.pocket = S.pocket.filter((q) => q !== k);
    save();
  },
  count(si) {
    const keys = spreadKeys(si);
    return [keys.filter((k) => S.placed[k]).length, keys.length];
  },
  full(si) {
    const [n, of] = this.count(si);
    return of > 0 && n === of;
  },
  // a full spread plays its "comes alive" moment once
  alive: (si) => !!S.alive[SPREADS[si].id],
  setAlive(si) {
    S.alive[SPREADS[si].id] = 1;
    save();
  },
  hats: () => S.hats.slice(),
  addHat(h) {
    if (!S.hats.includes(h)) S.hats.push(h);
    save();
  },
  get hat() {
    return S.hat;
  },
  set hat(h) {
    S.hat = h;
    save();
  },
  reset() {
    S = fresh();
    save();
  },
};
