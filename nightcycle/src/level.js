// The house, as plain data. No three.js, no DOM: tools/check.mjs reads this in Node.
// Metres. x runs east, z runs south, y is up. The house spans 0..14 by 0..10.

export const HOUSE = { w: 14, d: 10, wallH: 2.5, wallT: 0.12, doorTop: 2.1 };

export const ROOMS = [
  { id: 'living',  name: 'Living Room', x0: 0,   z0: 0,   x1: 6,   z1: 5,   floor: 'wood',      wall: 'sage',    dirt: 0.55 },
  { id: 'kitchen', name: 'Kitchen',     x0: 6,   z0: 0,   x1: 11,  z1: 5,   floor: 'checker',   wall: 'cream',   dirt: 0.65 },
  { id: 'laundry', name: 'Laundry',     x0: 11,  z0: 0,   x1: 14,  z1: 5,   floor: 'concrete',  wall: 'plain',   dirt: 0 },
  { id: 'hall',    name: 'Hallway',     x0: 0,   z0: 5,   x1: 14,  z1: 6.5, floor: 'woodDark',  wall: 'stripe',  dirt: 0.5 },
  { id: 'bath',    name: 'Bathroom',    x0: 0,   z0: 6.5, x1: 3,   z1: 10,  floor: 'smallTile', wall: 'tile',    dirt: 0.5 },
  { id: 'kid',     name: "Theo's Room", x0: 3,   z0: 6.5, x1: 7.5, z1: 10,  floor: 'carpetBlue',wall: 'kid',     dirt: 0.6 },
  { id: 'master',  name: 'Bedroom',     x0: 7.5, z0: 6.5, x1: 14,  z1: 10,  floor: 'carpet',    wall: 'mauve',   dirt: 0.5 },
];

// A wall runs along x (at a fixed z) or along z (at a fixed x).
// Openings are measured along the run. kind: window (sill..top open), arch (floor..top open), door.
export const WALLS = [
  // Exterior
  { along: 'x', at: 0, from: 0, to: 14, openings: [
    { kind: 'window', from: 0.6, to: 2.0, sill: 0.9, top: 2.1, moon: true },
    { kind: 'window', from: 7.1, to: 8.5, sill: 1.15, top: 2.0 },
    { kind: 'door', from: 9.55, to: 10.45, door: 'back' },
  ] },
  { along: 'x', at: 10, from: 0, to: 14, openings: [
    { kind: 'window', from: 0.7, to: 1.4, sill: 1.5, top: 2.0 },
    { kind: 'window', from: 4.7, to: 6.1, sill: 0.95, top: 2.1, moon: true },
  ] },
  { along: 'z', at: 0, from: 0, to: 10, openings: [
    { kind: 'door', from: 5.3, to: 6.2, door: 'front' },
  ] },
  { along: 'z', at: 14, from: 0, to: 10, openings: [
    { kind: 'window', from: 7.6, to: 9.0, sill: 0.8, top: 2.1, moon: true },
  ] },
  // Interior
  { along: 'x', at: 5, from: 0, to: 14, openings: [
    { kind: 'arch', from: 2.0, to: 3.4, top: 2.2 },
    { kind: 'arch', from: 8.0, to: 8.9, top: 2.1 },
    { kind: 'door', from: 12.2, to: 13.05, door: 'laundry' },
  ] },
  { along: 'x', at: 6.5, from: 0, to: 14, openings: [
    { kind: 'door', from: 1.0, to: 1.85, door: 'bath' },
    { kind: 'door', from: 5.0, to: 5.85, door: 'kid' },
    { kind: 'door', from: 9.4, to: 10.25, door: 'master' },
    { kind: 'flap', from: 13.45, to: 13.9, top: 0.25 },   // the pet flap: a robot fits, it doesn't
  ] },
  { along: 'z', at: 6, from: 0, to: 5, openings: [{ kind: 'arch', from: 1.2, to: 2.8, top: 2.2 }] },
  { along: 'z', at: 11, from: 0, to: 5, openings: [] },
  { along: 'z', at: 3, from: 6.5, to: 10, openings: [] },
  { along: 'z', at: 7.5, from: 6.5, to: 10, openings: [] },
];

// hinge: which end of the opening the leaf turns on. swing: +1 opens toward larger z (or x).
// locked doors never open for the robot; closed doors can be opened by the story.
export const DOORS = {
  back:    { state: 'locked', hinge: 'to',   swing: 1 },
  front:   { state: 'locked', hinge: 'from', swing: 1 },
  laundry: { state: 'locked', hinge: 'from', swing: -1 },
  bath:    { state: 'open',   hinge: 'from', swing: 1 },
  kid:     { state: 'closed', hinge: 'to',   swing: 1 },
  master:  { state: 'closed', hinge: 'from', swing: 1 },   // swings open as it first walks past
};

// How each kind of furniture behaves. solid: blocks the robot over its whole footprint.
// legs: only its four legs block the robot; clear is the gap underneath.
// cover: the robot is hidden while under it. los: tall enough to block sight. h: height, which also decides
// whether it hides a robot tucked right behind it (World.losLow).
export const FTYPES = {
  dock:        { solid: true, h: 0.12 },
  bookshelf:   { solid: true, h: 1.9, los: true },
  armchair:    { solid: true, h: 0.9 },
  sofa:        { legs: true, clear: 0.14, cover: true, h: 0.85 },
  coffeeTable: { legs: true, clear: 0.36, cover: true, h: 0.42 },
  table:       { legs: true, clear: 0.7, cover: true, h: 0.76 },
  chair:       { legs: true, clear: 0.42, h: 0.9 },
  tvStand:     { solid: true, h: 0.5 },
  floorLamp:   { solid: true, h: 1.6 },
  plant:       { solid: true, h: 1.1 },
  boxes:       { solid: true, h: 0.45 },
  counter:     { solid: true, h: 0.92, los: true },
  fridge:      { solid: true, h: 1.85, los: true },
  trash:       { solid: true, h: 0.6 },
  clock:       { solid: true, h: 2.0, los: true },
  bench:       { legs: true, clear: 0.14, cover: true, h: 0.46 },
  coatRack:    { solid: true, h: 1.8 },
  tub:         { legs: true, clear: 0.16, cover: true, h: 0.62 },   // clawfoot
  toilet:      { solid: true, h: 0.75 },
  sink:        { solid: true, h: 0.85 },
  kidBed:      { legs: true, clear: 0.24, cover: true, h: 0.55 },
  bed:         { legs: true, clear: 0.27, cover: true, h: 0.6 },
  toyChest:    { solid: true, h: 0.5 },
  desk:        { legs: true, clear: 0.68, h: 0.72 },
  nightstand:  { solid: true, h: 0.55 },
  wardrobe:    { solid: true, h: 2.0, los: true },
  dresser:     { solid: true, h: 0.85 },
  washer:      { solid: true, h: 0.85 },
  dogBed:      { solid: true, h: 0.18 },
  bags:        { solid: true, h: 0.55 },
  clothes:     { solid: true, h: 0.5 },
  rug:         { flat: true },
};

// facing: the side the front points to (n = -z, s = +z, e = +x, w = -x).
export const FURNITURE = [
  // Living room
  { type: 'dock', x0: 0.06, z0: 2.15, x1: 0.22, z1: 2.65, facing: 'e' },
  { type: 'bookshelf', x0: 0.06, z0: 3.4, x1: 0.42, z1: 4.6, facing: 'e', label: 'bookshelf' },
  { type: 'armchair', x0: 0.9, z0: 0.35, x1: 1.75, z1: 1.2, facing: 's', sheet: true, label: 'chair' },
  { type: 'rug', x0: 1.9, z0: 1.1, x1: 4.5, z1: 2.9, color: '#5a2a24' },
  { type: 'coffeeTable', x0: 2.6, z0: 1.6, x1: 3.8, z1: 2.3, label: 'table' },
  { type: 'sofa', x0: 2.0, z0: 3.15, x1: 4.4, z1: 4.05, facing: 'n', sheet: true, label: 'couch' },
  { type: 'tvStand', x0: 2.4, z0: 0.06, x1: 4.0, z1: 0.5, facing: 's', label: 'tv' },
  { type: 'floorLamp', x0: 4.55, z0: 3.35, x1: 4.85, z1: 3.65, label: 'lamp' },
  { type: 'plant', x0: 4.4, z0: 0.12, x1: 4.8, z1: 0.52, label: 'potted plant' },
  { type: 'boxes', x0: 0.6, z0: 4.25, x1: 1.2, z1: 4.85, stack: 2, text: 'BOOKS' },
  { type: 'boxes', x0: 5.2, z0: 4.2, x1: 5.8, z1: 4.8, stack: 1, text: 'LIVING RM' },

  // Kitchen
  { type: 'counter', x0: 6.06, z0: 0.06, x1: 9.4, z1: 0.66, facing: 's' },
  { type: 'counter', x0: 10.5, z0: 0.06, x1: 10.94, z1: 0.66, facing: 's' },
  { type: 'counter', x0: 10.34, z0: 0.66, x1: 10.94, z1: 3.0, facing: 'w' },
  { type: 'fridge', x0: 10.2, z0: 3.2, x1: 10.94, z1: 3.95, facing: 'w', label: 'refrigerator' },
  { type: 'table', x0: 7.3, z0: 2.2, x1: 8.7, z1: 3.2, label: 'dining table' },
  { type: 'chair', x0: 7.75, z0: 1.72, x1: 8.2, z1: 2.17, facing: 's', label: 'chair' },
  { type: 'chair', x0: 7.8, z0: 3.23, x1: 8.25, z1: 3.68, facing: 'n', label: 'chair' },
  { type: 'chair', x0: 6.82, z0: 2.45, x1: 7.27, z1: 2.9, facing: 'e', label: 'chair' },
  { type: 'chair', x0: 8.73, z0: 2.5, x1: 9.18, z1: 2.95, facing: 'w', label: 'chair' },
  { type: 'trash', x0: 6.15, z0: 4.5, x1: 6.5, z1: 4.85, label: 'bin' },
  { type: 'boxes', x0: 9.6, z0: 4.3, x1: 10.2, z1: 4.9, stack: 2, text: 'KITCHEN' },

  // Laundry (locked)
  { type: 'washer', x0: 11.08, z0: 0.08, x1: 11.72, z1: 0.72, facing: 's' },
  { type: 'washer', x0: 11.78, z0: 0.08, x1: 12.42, z1: 0.72, facing: 's' },
  { type: 'dogBed', x0: 13.1, z0: 3.3, x1: 13.9, z1: 4.1, label: 'dog bed' },
  { type: 'bags', x0: 13.2, z0: 0.12, x1: 13.9, z1: 0.8, label: 'bag' },
  { type: 'clothes', x0: 11.15, z0: 1.7, x1: 12.3, z1: 3.1, label: 'clothes' },

  // Hallway
  { type: 'rug', x0: 1.0, z0: 5.45, x1: 12.6, z1: 6.05, color: '#3b2f4a' },
  { type: 'coatRack', x0: 0.25, z0: 5.08, x1: 0.6, z1: 5.42, label: 'coat rack' },
  { type: 'clock', x0: 7.0, z0: 5.06, x1: 7.45, z1: 5.45, facing: 's', label: 'clock' },
  { type: 'bench', x0: 10.5, z0: 5.07, x1: 11.7, z1: 5.52, facing: 's', label: 'bench' },
  { type: 'boxes', x0: 2.3, z0: 6.2, x1: 2.85, z1: 6.44, stack: 2, text: 'BATHROOM' },
  { type: 'boxes', x0: 8.45, z0: 6.2, x1: 9.05, z1: 6.44, stack: 3, text: 'FRAGILE' },

  // Bathroom
  { type: 'tub', x0: 0.06, z0: 9.2, x1: 1.75, z1: 9.94, label: 'bathtub' },
  { type: 'toilet', x0: 2.42, z0: 7.0, x1: 2.94, z1: 7.6, facing: 'w', label: 'toilet' },
  { type: 'sink', x0: 2.45, z0: 8.1, x1: 2.94, z1: 8.9, facing: 'w', label: 'sink' },
  { type: 'rug', x0: 0.4, z0: 8.5, x1: 1.4, z1: 9.1, color: '#6d7f86' },

  // Theo's room
  { type: 'kidBed', x0: 3.06, z0: 7.8, x1: 4.1, z1: 9.94, facing: 'n', label: 'bed' },
  { type: 'toyChest', x0: 3.9, z0: 6.56, x1: 4.8, z1: 7.1, facing: 's', label: 'chest' },
  { type: 'desk', x0: 6.85, z0: 6.9, x1: 7.44, z1: 7.8, facing: 'w', label: 'desk' },
  { type: 'chair', x0: 6.35, z0: 7.15, x1: 6.78, z1: 7.58, facing: 'e', small: true, label: 'chair' },
  { type: 'boxes', x0: 4.3, z0: 9.45, x1: 4.75, z1: 9.9, stack: 1, text: "THEO'S TOYS" },
  { type: 'rug', x0: 4.2, z0: 7.5, x1: 5.8, z1: 9.1, color: '#c9a227', round: true },

  // Bedroom
  { type: 'bed', x0: 10.0, z0: 7.75, x1: 12.0, z1: 9.94, facing: 'n', label: 'bed' },
  { type: 'nightstand', x0: 9.5, z0: 9.45, x1: 9.95, z1: 9.94, facing: 'n' },
  { type: 'nightstand', x0: 12.05, z0: 9.45, x1: 12.5, z1: 9.94, facing: 'n' },
  { type: 'wardrobe', x0: 7.56, z0: 7.3, x1: 8.2, z1: 9.1, facing: 'e', label: 'wardrobe' },
  { type: 'dresser', x0: 12.0, z0: 6.56, x1: 13.3, z1: 7.02, facing: 's', sheet: true, label: 'dresser' },
  { type: 'armchair', x0: 8.4, z0: 9.15, x1: 9.15, z1: 9.9, facing: 'n', sheet: true, label: 'chair' },
  { type: 'boxes', x0: 13.2, z0: 9.2, x1: 13.85, z1: 9.85, stack: 3, text: 'BEDROOM' },
];

// Things on the floor. Story items open a card and are kept in the archive.
export const ITEMS = [
  { id: 'note', kind: 'note', x: 2.2, z: 2.75, story: true, name: 'Sticky note',
    text: '"Theo, no more drawing on the walls. The new people won\'t like it. Love, Mom"' },
  { id: 'coin1', kind: 'coin', x: 5.3, z: 1.0 },
  { id: 'lego1', kind: 'lego', x: 1.3, z: 3.1 },
  { id: 'hairtie', kind: 'hairtie', x: 3.3, z: 3.6 },
  { id: 'clip1', kind: 'paperclip', x: 4.9, z: 2.6 },

  { id: 'ring', kind: 'ring', x: 9.75, z: 3.8, story: true, name: 'Wedding band',
    text: 'Engraved inside: "R & D, 2011". Nobody leaves this behind. Not on purpose.' },
  { id: 'tag', kind: 'tag', x: 8.0, z: 2.75, story: true, name: 'Dog tag',
    text: '"BISCUIT. If found, please call." The number has been scratched off.' },
  { id: 'crumbs1', kind: 'crumbs', x: 6.9, z: 0.95 },
  { id: 'cereal', kind: 'cereal', x: 9.6, z: 1.6 },
  { id: 'coin2', kind: 'coin', x: 6.6, z: 3.9 },

  { id: 'photo', kind: 'polaroid', x: 11.6, z: 5.8, story: true, name: 'Polaroid',
    text: 'Moving day. Mom, Dad and Theo on the porch. In the window behind them someone else is standing, bent under the curtain rail.' },
  { id: 'clip2', kind: 'paperclip', x: 2.6, z: 5.6 },
  { id: 'coin3', kind: 'coin', x: 10.6, z: 6.1 },

  { id: 'cap', kind: 'cap', x: 1.9, z: 8.0, story: true, name: 'Pill bottle cap',
    text: 'Child-proof cap. The label stuck to it reads: "...to help Theo sleep through the night."' },

  { id: 'drawing', kind: 'drawing', x: 3.55, z: 8.9, story: true, name: 'Crayon drawing',
    text: 'Our house. Mom, Dad, me and Biscuit. And the Long Man, who lives behind the washing machine. He is always hungry.' },
  { id: 'tooth', kind: 'tooth', x: 6.1, z: 7.95, name: 'Baby tooth', text: 'It never went under a pillow.' },
  { id: 'lego2', kind: 'lego', x: 5.4, z: 9.2 },
  { id: 'lego3', kind: 'lego', x: 4.6, z: 7.3 },

  { id: 'key', kind: 'key', x: 11.0, z: 7.3, story: true, name: 'Brass key',
    text: 'A paper tag on a string: "LAUNDRY. Keep it locked. Keep it fed."' },
  { id: 'receipt', kind: 'receipt', x: 11.2, z: 8.8, story: true, name: 'Receipt',
    text: 'Hardware store, 2:14 AM. 4 deadbolts. 1 door chain. 50 lb bag of dog food.' },
  { id: 'coin4', kind: 'coin', x: 9.0, z: 7.6 },
];

// Muddy bare feet, from the back door to Theo's door.
export const FOOTPRINT_PATH = [[10.0, 0.3], [9.85, 1.4], [9.32, 2.0], [9.32, 3.6], [8.45, 4.3], [8.45, 5.75], [5.43, 5.75], [5.43, 6.38]];

// The thing walks this way the first time you see it: out of the laundry, down the hall, a stop in Theo's
// doorway, then on into the bathroom. It waits at HOLD until you can see the doorway.
export const FIRST_WALK = [[12.62, 4.55], [12.62, 5.84], [6.3, 5.84], [5.43, 6.0], [1.42, 5.84], [1.42, 7.8]];
export const FIRST_WALK_HOLD = 2;   // index of the point where it waits
export const FIRST_WALK_DOOR = 3;   // index of the point where it stops in the doorway, facing in

// Places its body can never get close to, whatever the walking grid says.
export const NOOKS = [
  { x0: 6.9, z0: 6.95, x1: 7.44, z1: 7.75, name: "under Theo's desk" },
  { x0: 13.45, z0: 6.3, x1: 13.9, z1: 6.7, name: 'the pet flap' },
];

// Plug-in nightlights (fake glow, no real light). facing: the direction the wall faces.
export const NIGHTLIGHTS = [
  { x: 0.78, z: 6.44, facing: 'n' },   // by the bathroom door, hall side
  { x: 7.78, z: 4.94, facing: 'n' },   // by the kitchen arch, kitchen side
];

export const DOCK = { x: 0.4, z: 2.4, yaw: -Math.PI / 2 };

export const LIGHTS = {
  lamp:       { x: 4.7, y: 1.5, z: 3.5, color: 0xffb070 },
  tv:         { x: 3.2, y: 0.8, z: 0.75, color: 0x9fb8ff },
  fridge:     { x: 9.9, y: 1.0, z: 3.57, color: 0xdff2ff },
  nightlight: { x: 3.18, y: 0.22, z: 7.4, color: 0xff9a40 },
};

// Spots that make sounds.
export const PLACES = {
  tv: [3.2, 0.7, 0.4],
  clock: [7.22, 1.5, 5.3],
  fridge: [10.2, 1.0, 3.57],
  musicBox: [4.35, 0.5, 6.8],
  laundryDoor: [12.62, 1.0, 5.0],
  backDoor: [10.0, 1.0, 0.0],
  kidDoor: [5.43, 1.0, 6.5],
  masterDoor: [9.82, 1.0, 6.5],
  petFlap: [13.675, 0.1, 6.5],
  bowl: [7.0, 0.05, 4.65],
};

// Dog food. The trail runs from the (freshly filled) bowl to the laundry door: someone still feeds it.
// The spill fans out from under the laundry door once it is open, and is a spot-clean task. Both crunch.
export function kibbleSpots() {
  let a = 77;
  const rnd = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const out = [];
  const trail = [[7.2, 4.6], [8.45, 4.55], [8.45, 5.35], [9.6, 5.62], [12.0, 5.62], [12.45, 5.25]];
  for (let k = 0; k < trail.length - 1; k++) {
    const [ax, az] = trail[k], [bx, bz] = trail[k + 1], L = Math.hypot(bx - ax, bz - az);
    for (let s = 0; s < L; s += 0.22) {
      if (rnd() < 0.3) continue;
      const t = s / L;
      out.push({ x: ax + (bx - ax) * t + (rnd() - 0.5) * 0.12, z: az + (bz - az) * t + (rnd() - 0.5) * 0.12, group: 'trail' });
    }
  }
  for (let k = 0; k < 26; k++) {
    const ang = (rnd() - 0.5) * 2.6, d = 0.18 + Math.pow(rnd(), 0.7) * 0.95;
    const x = Math.min(13.8, Math.max(11.9, 12.62 + Math.sin(ang) * d * 1.3)), z = Math.min(6.3, Math.max(5.2, 5.1 + Math.cos(ang) * d));
    out.push({ x, z, group: 'spill' });
  }
  return out;
}
