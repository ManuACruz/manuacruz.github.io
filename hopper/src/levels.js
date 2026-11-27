// Level data, one file per world in src/levels/, in each level's own drawing coordinates (multiplied by `unit` at load;
// unit defaults to 1, where the reference screen is 1376 x 692).
// A level: id (saves use it), page (its album page: title, and the emoji for each item kind), size, start, blocks
// [x, y, w, h], pins, items, goals (each with the album board it fills, see src/boards.js), solution, and for levels
// bigger than the screen `cams` [x, y, zoom?] (draft with tools/autocam.mjs, check with tools/framing.mjs).
// The order teaches one thing at a time: Meadow walks and jumps, Woods adds the orange dash pins, Pond the teal swings,
// Hive mixes them and adds levels with goals in a row.
import meadow from './levels/meadow.js';
import woods from './levels/woods.js';
import pond from './levels/pond.js';
import hive from './levels/hive.js';

// Play order inside each world, by id: meet the new thing, use it, mix it, twist it, test it (see docs/scaling-plan.md).
function order(levels, ids) {
  const byId = Object.fromEntries(levels.map((l) => [l.id, l]));
  const out = ids.map((id) => byId[id] || (() => { throw new Error(`no level "${id}"`); })());
  for (const l of levels) if (!ids.includes(l.id)) throw new Error(`level "${l.id}" is not in the play order`);
  return out;
}

export const WORLDS = [
  { id: 'meadow', title: 'Meadow', icon: '🌼', levels: order(meadow, ['hello', 'stepdown', 'backforit', 'wings', 'uphigh', 'steps', 'gap', 'hike']) },
  { id: 'woods', title: 'Woods', icon: '🌲', levels: order(woods, ['rain', 'cliff', 'twotongues', 'hangtight', 'hopoff', 'bonk', 'longbranch', 'deepwoods']) },
  { id: 'pond', title: 'Pond', icon: '🐸', levels: order(pond, ['swing', 'ropeend', 'swingdash', 'lilypads', 'backforth', 'swingjump', 'relay', 'sunflower']) },
  { id: 'hive', title: 'Hive', icon: '🐝', levels: order(hive, ['farmpost', 'around', 'breeze', 'landseasky', 'twoways', 'upaway', 'timing', 'highroad', 'longway', 'bees']) },
];

// Every level in play order, with its world and its number in the world ("2-3").
export const LEVELS = WORLDS.flatMap((w, wi) =>
  w.levels.map((l, i) => ({ ...l, world: wi, num: `${wi + 1}-${i + 1}`, name: `${wi + 1}-${i + 1} ${l.page.title}` })));
