// The house, as plain data. No three.js, no DOM: tools/check.mjs reads this in Node.
// Metres. x runs east, z runs south, y is up. The house spans 0..14 by 0..10.
//
// Each night is the same floor plan with overrides (NIGHTS below): furniture moved, openings torn in walls,
// doors left open, new things on the floor. setNight(n) swaps the exported tables; they are live bindings,
// so every module that imports them sees the night that was set. Call it before building the World.

export const HOUSE = { w: 14, d: 10, wallH: 2.5, wallT: 0.12, doorTop: 2.1 };

const ROOMS_1 = [
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
const WALLS_1 = [
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
const DOORS_1 = {
  back:    { state: 'locked', hinge: 'to',   swing: 1 },
  front:   { state: 'locked', hinge: 'from', swing: 1 },
  laundry: { state: 'locked', hinge: 'from', swing: -1 },
  bath:    { state: 'open',   hinge: 'from', swing: 1 },
  kid:     { state: 'closed', hinge: 'to',   swing: 1 },
  master:  { state: 'closed', hinge: 'from', swing: 1 },   // swings open as it first walks past
};

// How each kind of furniture behaves. solid: blocks the robot over its whole footprint.
// legs: only its four legs block the robot; clear is the gap underneath; leg: [size, inset] of those legs.
// cover: the robot is hidden while under it. los: tall enough to block sight. h: height, which also decides
// whether it hides a robot tucked right behind it (World.losLow).
export const FTYPES = {
  dock:        { solid: true, h: 0.12 },
  bookshelf:   { solid: true, h: 1.9, los: true },
  armchair:    { solid: true, h: 0.9 },
  sofa:        { legs: true, clear: 0.14, cover: true, h: 0.85 },
  coffeeTable: { legs: true, clear: 0.36, cover: true, h: 0.42 },
  table:       { legs: true, clear: 0.7, cover: true, h: 0.76, leg: [0.06, 0.05] },
  chair:       { legs: true, clear: 0.42, h: 0.9, leg: [0.035, 0.02] },
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
  tub:         { legs: true, clear: 0.16, cover: true, h: 0.62, leg: [0.1, 0.09] },   // clawfoot
  toilet:      { solid: true, h: 0.75 },
  sink:        { solid: true, h: 0.85 },
  kidBed:      { legs: true, clear: 0.24, cover: true, h: 0.55 },
  bed:         { legs: true, clear: 0.27, cover: true, h: 0.6, leg: [0.06, 0.03] },
  toyChest:    { solid: true, h: 0.5 },
  desk:        { legs: true, clear: 0.68, h: 0.72, leg: [0.04, 0.02] },
  nightstand:  { solid: true, h: 0.55 },
  wardrobe:    { solid: true, h: 2.0, los: true },
  dresser:     { solid: true, h: 0.85 },
  washer:      { solid: true, h: 0.85 },
  dogBed:      { solid: true, h: 0.18 },
  bags:        { solid: true, h: 0.55 },
  clothes:     { solid: true, h: 0.5 },
  rug:         { flat: true },
  // Night 2: it rearranged the house
  sofaTipped:  { solid: true, h: 0.9 },     // on its back across the arch, underside to the room
  tableFlipped:{ solid: true, h: 0.42 },    // the coffee table, legs in the air: no longer anything to hide under
  sheetHeap:   { flat: true },              // the dust sheet, pulled off and left on the floor
  // Night 3 on
  hatch:       { solid: true, h: 0.1 },     // the basement hatch behind the dryer, lid up: a drop the robot keeps out of
};

// facing: the side the front points to (n = -z, s = +z, e = +x, w = -x).
const FURNITURE_1 = [
  // Living room
  { id: 'dock', type: 'dock', x0: 0.06, z0: 2.15, x1: 0.22, z1: 2.65, facing: 'e' },
  { type: 'bookshelf', x0: 0.06, z0: 3.4, x1: 0.42, z1: 4.6, facing: 'e', label: 'bookshelf' },
  { id: 'armchairL', type: 'armchair', x0: 0.9, z0: 0.35, x1: 1.75, z1: 1.2, facing: 's', sheet: true, label: 'chair' },
  { type: 'rug', x0: 1.9, z0: 1.1, x1: 4.5, z1: 2.9, color: '#5a2a24' },
  { id: 'coffeeTable', type: 'coffeeTable', x0: 2.6, z0: 1.6, x1: 3.8, z1: 2.3, label: 'table' },
  { id: 'sofa', type: 'sofa', x0: 2.0, z0: 3.15, x1: 4.4, z1: 4.05, facing: 'n', sheet: true, label: 'couch' },
  { type: 'tvStand', x0: 2.4, z0: 0.06, x1: 4.0, z1: 0.5, facing: 's', label: 'tv' },
  { type: 'floorLamp', x0: 4.55, z0: 3.35, x1: 4.85, z1: 3.65, label: 'lamp' },
  { type: 'plant', x0: 4.4, z0: 0.12, x1: 4.8, z1: 0.52, label: 'potted plant' },
  { type: 'boxes', x0: 0.6, z0: 4.25, x1: 1.2, z1: 4.85, stack: 2, text: 'BOOKS' },
  { type: 'boxes', x0: 5.2, z0: 4.2, x1: 5.8, z1: 4.8, stack: 1, text: 'LIVING RM' },

  // Kitchen
  { type: 'counter', x0: 6.06, z0: 0.06, x1: 9.4, z1: 0.66, facing: 's', sink: 0.07, stove: -1.2, uppers: [[-1.67, -0.76], [0.9, 1.67]] },
  { type: 'counter', x0: 10.5, z0: 0.06, x1: 10.94, z1: 0.66, facing: 's', uppers: [[-0.22, 0.22]] },
  { type: 'counter', x0: 10.34, z0: 0.66, x1: 10.94, z1: 3.0, facing: 'w', uppers: [[-1.17, 1.17]] },
  { id: 'fridge', type: 'fridge', x0: 10.2, z0: 3.2, x1: 10.94, z1: 3.95, facing: 'w', label: 'refrigerator' },
  { type: 'table', x0: 7.3, z0: 2.2, x1: 8.7, z1: 3.2, label: 'dining table' },
  { type: 'chair', x0: 7.75, z0: 1.72, x1: 8.2, z1: 2.17, facing: 's', label: 'chair' },
  { type: 'chair', x0: 7.8, z0: 3.23, x1: 8.25, z1: 3.68, facing: 'n', label: 'chair' },
  { type: 'chair', x0: 6.82, z0: 2.45, x1: 7.27, z1: 2.9, facing: 'e', label: 'chair' },
  { type: 'chair', x0: 8.73, z0: 2.5, x1: 9.18, z1: 2.95, facing: 'w', label: 'chair' },
  { type: 'trash', x0: 6.15, z0: 4.5, x1: 6.5, z1: 4.85, label: 'bin' },
  { id: 'kitchenBoxes', type: 'boxes', x0: 9.6, z0: 4.3, x1: 10.2, z1: 4.9, stack: 2, text: 'KITCHEN' },

  // Laundry (locked)
  { type: 'washer', x0: 11.08, z0: 0.08, x1: 11.72, z1: 0.72, facing: 's' },
  { id: 'dryer', type: 'washer', x0: 11.78, z0: 0.08, x1: 12.42, z1: 0.72, facing: 's' },
  { type: 'dogBed', x0: 13.1, z0: 3.3, x1: 13.9, z1: 4.1, label: 'dog bed' },
  { id: 'bags', type: 'bags', x0: 13.2, z0: 0.12, x1: 13.9, z1: 0.8, label: 'bag' },
  { type: 'clothes', x0: 11.15, z0: 1.7, x1: 12.3, z1: 3.1, label: 'clothes' },

  // Hallway
  { type: 'rug', x0: 1.0, z0: 5.45, x1: 12.6, z1: 6.05, color: '#3b2f4a', runner: true },
  { type: 'coatRack', x0: 0.25, z0: 5.08, x1: 0.6, z1: 5.42, label: 'coat rack' },
  { type: 'clock', x0: 7.0, z0: 5.06, x1: 7.45, z1: 5.45, facing: 's', label: 'clock' },
  { type: 'bench', x0: 10.5, z0: 5.07, x1: 11.7, z1: 5.52, facing: 's', label: 'bench' },
  { type: 'boxes', x0: 2.3, z0: 6.2, x1: 2.85, z1: 6.44, stack: 2, text: 'BATHROOM' },
  { id: 'fragile', type: 'boxes', x0: 8.45, z0: 6.2, x1: 9.05, z1: 6.44, stack: 3, text: 'FRAGILE' },

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
  { id: 'dresser', type: 'dresser', x0: 12.0, z0: 6.56, x1: 13.3, z1: 7.02, facing: 's', sheet: true, label: 'dresser' },
  { id: 'armchairM', type: 'armchair', x0: 8.4, z0: 9.15, x1: 9.15, z1: 9.9, facing: 'n', sheet: true, label: 'chair' },
  { type: 'boxes', x0: 13.2, z0: 9.2, x1: 13.85, z1: 9.85, stack: 3, text: 'BEDROOM' },
];

// Things on the floor. Story items open a card and are kept in the archive.
const ITEMS_1 = [
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
const FOOTPRINT_PATH_1 = [[10.0, 0.3], [9.85, 1.4], [9.32, 2.0], [9.32, 3.6], [8.45, 4.3], [8.45, 5.75], [5.43, 5.75], [5.43, 6.38]];

// The thing walks this way the first time you see it: out of the laundry, down the hall, a stop in Theo's
// doorway, then on into the bathroom. It waits at HOLD until you can see the doorway.
const FIRST_WALK_1 = [[12.62, 4.55], [12.62, 5.84], [6.3, 5.84], [5.43, 6.0], [1.42, 5.84], [1.42, 7.8]];
export const FIRST_WALK_HOLD = 2;   // index of the point where it waits
export const FIRST_WALK_DOOR = 3;   // index of the point where it stops in the doorway, facing in

// Places its body can never get close to, whatever the walking grid says.
const NOOKS_1 = [
  { x0: 6.9, z0: 6.95, x1: 7.44, z1: 7.75, name: "under Theo's desk" },
  { x0: 13.45, z0: 6.3, x1: 13.9, z1: 6.7, name: 'the pet flap' },
];

// Plug-in nightlights (fake glow, no real light). facing: the direction the wall faces.
const NIGHTLIGHTS_1 = [
  { x: 0.78, z: 6.44, facing: 'n' },   // by the bathroom door, hall side
  { x: 7.78, z: 4.94, facing: 'n' },   // by the kitchen arch, kitchen side
];

const DOCK_1 = { x: 0.4, z: 2.4, yaw: -Math.PI / 2 };   // where the robot charges (and starts, unless START says otherwise)

const LIGHTS_1 = {
  lamp:       { x: 4.7, y: 1.5, z: 3.5, color: 0xffb070 },
  tv:         { x: 3.2, y: 0.8, z: 0.75, color: 0x9fb8ff },
  fridge:     { x: 9.9, y: 1.0, z: 3.57, color: 0xdff2ff },
  nightlight: { x: 3.18, y: 0.22, z: 7.4, color: 0xff9a40 },
};

// Spots that make sounds.
const PLACES_1 = {
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

// Dog food. The trail runs from the (freshly filled) bowl to the laundry: someone still feeds it.
// The spill fans out from `spill.from` once the story shows it, and is a spot-clean task. Both crunch.
const KIBBLE_1 = {
  trail: [[7.2, 4.6], [8.45, 4.55], [8.45, 5.35], [9.6, 5.62], [12.0, 5.62], [12.45, 5.25]],
  spill: { x: 12.62, z: 5.1, dir: [0, 1], sx: 1.3, x0: 11.9, x1: 13.8, z0: 5.2, z1: 6.3 },
};

export function kibbleSpots(spec = KIBBLE) {
  let a = 77;
  const rnd = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const out = [];
  const trail = spec.trail;
  for (let k = 0; k < trail.length - 1; k++) {
    const [ax, az] = trail[k], [bx, bz] = trail[k + 1], L = Math.hypot(bx - ax, bz - az);
    for (let s = 0; s < L; s += 0.22) {
      if (rnd() < 0.3) continue;
      const t = s / L;
      out.push({ x: ax + (bx - ax) * t + (rnd() - 0.5) * 0.12, z: az + (bz - az) * t + (rnd() - 0.5) * 0.12, group: 'trail' });
    }
  }
  // fanned out along `dir` (the side `sx` stretches across it)
  const S = spec.spill, [fx, fz] = S.dir, [px, pz] = [fz, -fx];
  for (let k = 0; k < 26; k++) {
    const ang = (rnd() - 0.5) * 2.6, d = 0.18 + Math.pow(rnd(), 0.7) * 0.95;
    const across = Math.sin(ang) * d * S.sx, along = Math.cos(ang) * d;
    const x = Math.min(S.x1, Math.max(S.x0, S.x + fx * along + px * across)), z = Math.min(S.z1, Math.max(S.z0, S.z + fz * along + pz * across));
    out.push({ x, z, group: 'spill' });
  }
  return out;
}

// ---------- nights ----------
// Each night extends another (Night 1 unless it says) and overrides parts of it. Fields:
//   rooms        per room id: new values (dirt)          openings   per wall key (along + at): openings added
//   doors        per door id: new values (state)         furniture  per furniture id: new values, or null to remove
//   addFurniture new pieces                              items      what is on the floor (task: true = a collect task)
//   firstWalk    its scripted first appearance           footprints muddy prints the story can show
//   dock, start  where the robot charges, and where it wakes up (and with how much battery)
//   decor        wall photos, lamps, patches and the like (build.js draws them; no collision)
//   blocks       story-controlled solids (World.setBlock), present at the start of the night
//   ceiling      rooms whose ceiling light can be switched on (Night 4 on)
//   lair         where it goes to be alone; eat: it stands at the bowl there, visible, instead of vanishing
//   rules        dockLinger (chance a patrol ends over the dock), laundryPatrol, unplug (pulls the dock's plug),
//                lights (switches room lights on where you are), eat (goes to the laundry to eat on its own)
//   scheduled    the rooms the bin is sized for and the end screen averages     cutOff  openings that must be blocked
//   flags        the house at the start of the night (see FLAGS in main.js)

// Night 1 as it was built. Everything a later night doesn't override comes from here.
const NIGHT_1 = {
  name: 'Night 1', tagline: 'You are a robot vacuum. The house is empty.<br>Mostly.', app: 'BrightHome',
  rooms: ROOMS_1, walls: WALLS_1, doors: DOORS_1, furniture: FURNITURE_1, items: ITEMS_1,
  footprints: FOOTPRINT_PATH_1, firstWalk: FIRST_WALK_1, nooks: NOOKS_1, nightlights: NIGHTLIGHTS_1,
  lights: LIGHTS_1, places: PLACES_1, kibble: KIBBLE_1, dock: DOCK_1, start: null,
  scheduled: ['living', 'kitchen', 'hall', 'kid'],
  grime: [],      // extra dirt laid over the noise: { rect, add } or { seg: [[ax, az], [bx, bz]], w, add }; add < 0 clears
  scrapes: [],    // marks gouged into the floor: [ax, az, bx, bz]
  decor: [], blocks: {}, ceiling: [], cutOff: [],
  lair: { retreat: [12.6, 2.6] },
  rules: { dockLinger: 0, laundryPatrol: false },
  flags: {},
};

// Night 2: it rearranged the house. The sofa is dragged across the living-room/kitchen arch (the only loop,
// and the cover nearest the dock, gone), the coffee table is upside down, and the fridge is pulled out from
// a ragged hole into the laundry. The laundry door hangs open, so the new loop runs through the room you were
// told to keep locked: kitchen, hole, laundry, hall. And it has learned where the dock is.
const NIGHT_2 = {
  name: 'Night 2', tagline: 'It rearranged the house.<br>It knows where you sleep.',
  rooms: { living: { dirt: 0.5 }, kitchen: { dirt: 0.6 }, laundry: { dirt: 0.7 }, hall: { dirt: 0.45 }, kid: { dirt: 0.4 } },
  openings: {
    z11: [{ kind: 'hole', from: 3.2, to: 4.05, top: 1.7 }],   // behind where the fridge stood
  },
  doors: { laundry: { state: 'open' }, kid: { state: 'open' }, master: { state: 'open' } },
  furniture: {
    sofa: { type: 'sofaTipped', x0: 5.0, z0: 0.8, x1: 5.92, z1: 3.2, facing: 'w', sheet: false, label: 'couch' },
    coffeeTable: { type: 'tableFlipped', x0: 2.85, z0: 1.0, x1: 4.05, z1: 1.7, label: 'table' },
    fridge: { x0: 9.1, z0: 3.3, x1: 9.85, z1: 4.05, facing: 's' },
    kitchenBoxes: null,
  },
  addFurniture: [
    { id: 'sheet', type: 'sheetHeap', x0: 2.3, z0: 3.3, x1: 3.5, z1: 4.0, label: 'sheet' },
  ],
  items: [
    { id: 'card', kind: 'card', x: 4.3, z: 2.6, story: true, name: "Realtor's card",
      text: 'BrightHome Realty. "Priced to sell! Motivated sellers." On the back, in biro: "Do NOT show the laundry."' },
    { id: 'coin1', kind: 'coin', x: 1.4, z: 1.75 },
    { id: 'lego1', kind: 'lego', x: 3.6, z: 0.8 },
    { id: 'clip1', kind: 'paperclip', x: 2.2, z: 4.4 },
    { id: 'hairtie', kind: 'hairtie', x: 4.9, z: 4.5 },

    { id: 'chart', kind: 'page', x: 6.7, z: 1.3, story: true, name: 'Feeding chart',
      text: 'It was taped inside a cupboard. "FED 2 AM", and a tick for every night. The ticks stop on the 14th. Underneath, pressed hard: "When he is hungry he goes in the walls."' },
    { id: 'collar', kind: 'collar', x: 10.55, z: 4.5, story: true, name: "Biscuit's collar",
      text: 'Red, chewed through. The buckle is still fastened.' },
    { id: 'crumbs1', kind: 'crumbs', x: 8.9, z: 1.05 },
    { id: 'coin2', kind: 'coin', x: 6.6, z: 3.9 },

    { id: 'page', kind: 'page', x: 12.75, z: 1.55, story: true, name: 'Notebook page',
      text: 'Dad\'s writing. "It isn\'t a man. It wears the shape of one, as if it learned it from us. It ate the scraps, then the dog food, then Biscuit stopped coming in from the garden. Keep it fed and it stays behind the dryer."' },
    { id: 'photo2', kind: 'polaroid', x: 11.5, z: 4.45, story: true, name: 'Polaroid',
      text: 'A flash photo of the laundry. The washers, the nest of clothes, and curled up on it like a dog, something far too long to be a dog.' },
    { id: 'key2', kind: 'key', x: 13.55, z: 2.5, story: true, name: 'Small iron key',
      text: 'On a red string. The tag says "BASEMENT". Behind the dryer, under the lino, the floor sounds hollow.' },
    { id: 'coin3', kind: 'coin', x: 13.3, z: 4.6 },

    { id: 'coin4', kind: 'coin', x: 4.0, z: 5.6 },
    { id: 'clip2', kind: 'paperclip', x: 10.1, z: 6.2 },

    { id: 'list', kind: 'note', x: 12.6, z: 7.6, story: true, name: 'Checklist',
      text: '"Before we go: boxes, done. Keys to the agent, done. Biscuit: no. Leave the robot on its night schedule. Something has to make noise in the house, or it comes looking for us."' },
  ],
  // It comes out of the hole, crosses the kitchen and the hall, and stops over the dock. Its prints follow it.
  firstWalk: [[11.9, 3.62], [10.45, 3.62], [10.35, 4.45], [8.45, 4.55], [8.45, 5.84], [2.7, 5.84], [2.7, 4.5], [1.2, 2.75]],
  footprints: [[10.9, 3.62], [10.45, 3.62], [10.35, 4.45], [8.45, 4.55], [8.45, 5.84], [2.7, 5.84], [2.7, 4.5], [1.25, 2.8]],
  lights: { ...LIGHTS_1, fridge: { x: 9.47, y: 1.0, z: 4.35, color: 0xdff2ff } },
  places: { ...PLACES_1, fridge: [9.47, 1.0, 4.1], hole: [11.0, 0.6, 3.62] },
  kibble: {
    trail: [[7.2, 4.6], [8.45, 4.62], [10.3, 4.5], [10.5, 3.8], [11.3, 3.62], [11.9, 3.75]],
    spill: { x: 10.95, z: 3.62, dir: [-1, 0], sx: 1.1, x0: 10.0, x1: 10.85, z0: 3.15, z1: 4.75 },   // dragged out through the hole
  },
  scheduled: ['living', 'kitchen', 'laundry'],
  cutOff: [{ a: [4.6, 2.0], b: [6.8, 2.0], min: 6, what: 'living/kitchen arch' }],   // the sofa: both have to go round by the hall
  grime: [
    { rect: { x0: 2.0, z0: 3.15, x1: 4.4, z1: 4.05 }, add: -1 },     // a clean outline in the dust where the sofa stood
    { seg: [[4.3, 3.3], [5.0, 2.95]], w: 0.16, add: 0.5 },           // and where its feet went
    { seg: [[4.3, 3.95], [5.0, 3.2]], w: 0.16, add: 0.5 },
    { rect: { x0: 10.2, z0: 3.2, x1: 10.94, z1: 3.95 }, add: 0.7 },  // the grime behind the fridge
    { rect: { x0: 10.3, z0: 3.0, x1: 11.7, z1: 4.3 }, add: 0.3 },    // plaster dust both sides of the hole
  ],
  scrapes: [[4.33, 3.28, 5.0, 2.96], [4.33, 3.97, 5.0, 3.22], [9.92, 3.42, 10.25, 3.47], [9.92, 3.98, 10.25, 3.92]],
  lair: { retreat: [12.7, 1.15] },   // into the hole beside the washing machines
  rules: { dockLinger: 0.3, laundryPatrol: true },
  flags: { lampOn: false, fridgeOpen: true, clockOn: false, leak: 'bright', boltTorn: true, nightlights: [false, true] },
};

// The basement hatch behind the dryer (Night 3 on): the dryer shoved aside, the lid up against the wall.
const HATCH = { id: 'hatch', type: 'hatch', x0: 11.8, z0: 0.1, x1: 12.44, z1: 0.7, label: 'hatch' };
const DRYER_MOVED = { x0: 12.5, z0: 0.08, x1: 13.14, z1: 0.72 };
const HATCH_GRIME = [{ rect: { x0: 11.6, z0: 0.7, x1: 12.7, z1: 1.6 }, add: 0.45 }];
const HATCH_SCRAPES = [[11.85, 0.4, 12.5, 0.4], [11.85, 0.62, 12.5, 0.6]];

// Night 3: it starts unplugging things. The plug it pulled at the end of Night 2 is still out, so the robot
// wakes on battery and the app has sent a spare Home Base, in the bedroom by the door. Through the night it
// pulls the plugs of the fridge, the laundry bulb and the nightlights, and of your new dock while it waits
// there (the smart plug takes 40 s to come back). The spare is in the hall by the bedroom door, facing the
// kitchen arch. The dust sheets are off. The hatch behind the dryer is open.
const NIGHT_3 = {
  extends: 2,
  name: 'Night 3', tagline: 'It starts unplugging things.',
  rooms: { master: { dirt: 0.6 }, bath: { dirt: 0.55 }, kitchen: { dirt: 0.5 }, living: { dirt: 0.35 }, hall: { dirt: 0.4 }, laundry: { dirt: 0.5 } },
  furniture: {
    dock: { dead: true },   // still unplugged from last night
    dryer: DRYER_MOVED,
    armchairL: { sheet: false }, armchairM: { sheet: false }, dresser: { sheet: false },
    fragile: { x0: 9.0, x1: 9.35, z0: 6.2, z1: 6.44, stack: 2 },   // shoved along to make room for the spare dock
  },
  addFurniture: [
    HATCH,
    { id: 'dock2', type: 'dock', x0: 8.1, z0: 6.28, x1: 8.6, z1: 6.44, facing: 'n' },   // the spare, plugged into the hall socket
  ],
  dock: { x: 8.35, z: 6.1, yaw: 0 },
  start: { x: 0.4, z: 2.4, yaw: -Math.PI / 2, battery: 55 },
  items: [
    // the batteries out of the smoke alarms, one under the alarm in each room: a collect task, a tour of the house
    { id: 'bat1', kind: 'battery', x: 3.0, z: 2.8, task: true },     // living room
    { id: 'bat2', kind: 'battery', x: 9.3, z: 1.7, task: true },     // kitchen
    { id: 'bat3', kind: 'battery', x: 6.4, z: 5.45, task: true },    // hall
    { id: 'bat4', kind: 'battery', x: 1.5, z: 8.25, task: true },    // bathroom
    { id: 'bat5', kind: 'battery', x: 5.25, z: 8.25, task: true },   // Theo's room
    { id: 'bat6', kind: 'battery', x: 10.1, z: 7.1, task: true },    // bedroom

    { id: 'monitor', kind: 'monitor', x: 8.9, z: 7.9, story: true, name: 'Baby monitor',
      text: 'The parents\' half, still switched on. The other half is in Theo\'s room. Tonight it is picking up breathing.' },
    { id: 'letter', kind: 'page', x: 12.8, z: 8.6, story: true, name: "Agent's letter",
      text: '"We will need the house clear of all personal items, pets included, before the first viewing." Someone has circled "pets" and written underneath: "He isn\'t a pet."' },
    { id: 'stickers', kind: 'card', x: 1.5, z: 7.6, story: true, name: 'Sticker chart',
      text: 'Theo\'s. "Stayed in bed all night" ★★★. "Didn\'t open the laundry" ★★. "Fed him" ★★★★★★★★.' },
    { id: 'brush', kind: 'toothbrush', x: 2.1, z: 9.3, story: true, name: 'Toothbrush',
      text: 'One of four from the cup by the sink. Mom, Dad, Theo. This is the fourth one. It is chewed flat.' },
    { id: 'padlock', kind: 'padlock', x: 12.2, z: 1.05, story: true, name: 'Padlock',
      text: 'It was on the hatch. It has been cut through. From underneath.' },
    { id: 'coin1', kind: 'coin', x: 8.9, z: 8.3 },
    { id: 'hairtie', kind: 'hairtie', x: 0.8, z: 7.2 },
    { id: 'coin2', kind: 'coin', x: 6.6, z: 1.4 },
    { id: 'clip1', kind: 'paperclip', x: 9.6, z: 1.5 },
  ],
  // Up out of the hatch, out of the laundry and along the hall to your new dock.
  firstWalk: [[12.1, 0.75], [12.1, 1.25], [12.7, 1.3], [12.7, 4.6], [12.7, 5.84], [9.2, 5.84], [8.75, 5.7]],
  footprints: [],
  places: { ...NIGHT_2.places, hatch: [12.12, 0.2, 0.4] },
  scheduled: ['master', 'bath', 'kitchen'],
  grime: [...NIGHT_2.grime, ...HATCH_GRIME],
  scrapes: [...NIGHT_2.scrapes, ...HATCH_SCRAPES],
  lair: { retreat: [12.1, 1.2] },   // down the hatch
  rules: { dockLinger: 0.3, laundryPatrol: true, unplug: true },
  flags: { lampOn: false, fridgeOpen: true, fridgePower: true, clockOn: false, leak: 'bright', boltTorn: true, nightlights: [false, true] },
};

// The family's photos, back on the hall walls (Night 4). Facing: the direction the picture faces.
const PHOTOS = [
  { kind: 'photo', x: 1.25, y: 1.45, z: 5.06, facing: 's' }, { kind: 'photo', x: 4.1, y: 1.5, z: 5.06, facing: 's', tilt: 0.05 },
  { kind: 'photo', x: 6.2, y: 1.42, z: 5.06, facing: 's' }, { kind: 'photo', x: 9.7, y: 1.48, z: 5.06, facing: 's', tilt: -0.04 },
  { kind: 'photo', x: 3.6, y: 1.45, z: 6.44, facing: 'n' }, { kind: 'photo', x: 7.0, y: 1.5, z: 6.44, facing: 'n' },
  { kind: 'photo', x: 11.3, y: 1.44, z: 6.44, facing: 'n', tilt: 0.06 },
];

// Night 4: it turns the lamp on you. Everything is back where it was on Night 1, the family's photos are back on
// the walls and Theo's toys are out, as if they never left. Only the hatch is still open. And the lights work
// now: it switches them on in the room you are in, and in a lit room it sees you from across it, lamp or no lamp.
const NIGHT_4 = {
  extends: 1,
  name: 'Night 4', tagline: 'It turns the lights on you.',
  rooms: { living: { dirt: 0.5 }, kitchen: { dirt: 0.55 }, kid: { dirt: 0.6 }, hall: { dirt: 0.5 } },
  doors: { laundry: { state: 'closed' }, kid: { state: 'open' }, master: { state: 'open' } },
  furniture: { dryer: DRYER_MOVED },
  addFurniture: [HATCH],
  items: [
    // Theo's toys, out again: a collect task
    { id: 'toy1', kind: 'lego', x: 4.0, z: 7.6, task: true },
    { id: 'toy2', kind: 'lego', x: 5.5, z: 8.9, task: true },
    { id: 'toy3', kind: 'car', x: 6.3, z: 9.4, task: true },
    { id: 'toy4', kind: 'car', x: 4.6, z: 6.0, task: true },
    { id: 'toy5', kind: 'lego', x: 7.6, z: 5.55, task: true },
    { id: 'toy6', kind: 'car', x: 2.2, z: 5.9, task: true },

    { id: 'invite', kind: 'card', x: 3.3, z: 2.6, story: true, name: 'Invitation',
      text: '"Theo is 7! Party at ours, Saturday." The date is next week. The house was sold last month.' },
    { id: 'shopping', kind: 'page', x: 9.6, z: 1.6, story: true, name: 'Shopping list',
      text: 'Milk. Bread. Bulbs (ALL the bulbs). Dog food x2. In a different pen, underneath: "it likes the light now"' },
    { id: 'nightlightBulb', kind: 'bulb', x: 5.9, z: 7.4, story: true, name: 'Nightlight bulb',
      text: 'Unscrewed from Theo\'s nightlight and left on the carpet. Still warm.' },
    { id: 'photoTorn', kind: 'polaroid', x: 11.0, z: 5.75, story: true, name: 'Torn photo',
      text: 'Off the hall wall. The four of them on the porch, and a long pale arm round Dad\'s shoulders. Someone has tried to tear the arm off.' },
    { id: 'coin1', kind: 'coin', x: 1.3, z: 3.1 },
    { id: 'coin2', kind: 'coin', x: 7.0, z: 3.95 },
    { id: 'clip1', kind: 'paperclip', x: 4.9, z: 2.6 },
  ],
  // When the hall lights come on, it is already standing in the kitchen arch. Then it goes home.
  firstWalk: [[8.45, 5.2], [8.45, 5.84], [12.62, 5.84], [12.75, 4.3], [12.75, 1.3], [12.1, 1.25]],
  footprints: [],
  places: { ...PLACES_1, hatch: [12.12, 0.2, 0.4], bedLamp: [12.27, 0.9, 9.7] },
  lights: { ...LIGHTS_1, bedLamp: { x: 12.27, y: 0.95, z: 9.62, color: 0xffc080 } },
  decor: [{ kind: 'tableLamp', x: 12.27, y: 0.55, z: 9.7 }, { kind: 'plywood', x: 11.064, z: 3.62, w: 1.1, h: 1.85 }, ...PHOTOS],
  ceiling: ['living', 'kitchen', 'hall', 'bath', 'kid', 'master'],
  scheduled: ['living', 'kitchen', 'kid', 'hall'],
  grime: HATCH_GRIME,
  scrapes: HATCH_SCRAPES,
  lair: { retreat: [12.1, 1.2] },
  rules: { dockLinger: 0.25, laundryPatrol: false, lights: true },
  flags: { lampOn: true, clockOn: true, leak: 'dim', boltTorn: true, nightlights: [true, true] },
};

// Night 5: it is the one scheduling the cleans. The app's messages come from "Home" now, and the dock has been
// moved into the laundry. Its schedule: its room, its food, where they slept. Then three ways it can end:
// dock in its room and stay; leave by Biscuit's old dog door in the living room (unscrewed at the end); or wait
// until it shuts itself in the laundry to eat, and hold the door from the hall, as the key said.
const NIGHT_5 = {
  extends: 4,
  name: 'Night 5', tagline: 'It is the one scheduling the cleans now.', app: 'Home 🙂',
  rooms: { laundry: { dirt: 0.6 }, master: { dirt: 0.55 }, kid: { dirt: 0.45 }, kitchen: { dirt: 0.5 }, living: { dirt: 0.45 } },
  openings: {
    x0: [{ kind: 'flap', from: 5.15, to: 5.6, top: 0.25, outside: true }],   // Biscuit's dog door, to the garden
  },
  blocks: { dogflap: { x0: 5.1, z0: -0.07, x1: 5.65, z1: 0.075 } },          // screwed shut with plywood, for now
  doors: { laundry: { state: 'open' } },
  furniture: { dock: null },
  addFurniture: [
    { id: 'dock3', type: 'dock', x0: 13.78, z0: 2.35, x1: 13.94, z1: 2.85, facing: 'w' },   // it moved your dock into its room
  ],
  dock: { x: 13.6, z: 2.6, yaw: Math.PI / 2 },
  items: [
    { id: 'note5', kind: 'page', x: 11.6, z: 4.4, story: true, name: "Dad's last note",
      text: '"When it eats, it shuts itself in. That is the only time. Hold the door and the lock does the rest. Keep it locked. Keep it fed."' },
    { id: 'listing', kind: 'card', x: 6.9, z: 1.3, story: true, name: 'Listing',
      text: 'SOLD. "New owners move in Saturday: two adults, one child, one dog. They loved the house."' },
    { id: 'drawing5', kind: 'drawing', x: 5.6, z: 8.4, story: true, name: 'New drawing',
      text: 'The crayon is still soft. The house, the Long Man, and a little round robot between them. Everyone is smiling.' },
    { id: 'screws', kind: 'screws', x: 5.4, z: 0.45, story: true, name: 'Four screws',
      text: 'From the plywood over Biscuit\'s old dog door. Somebody wants it open.' },
    { id: 'coin1', kind: 'coin', x: 9.0, z: 7.6 },
    { id: 'coin2', kind: 'coin', x: 1.4, z: 1.75 },
    { id: 'clip1', kind: 'paperclip', x: 12.9, z: 1.6 },
  ],
  // Up out of the hatch, to its bowl.
  firstWalk: [[12.1, 0.75], [12.1, 1.25], [12.75, 1.3], [12.65, 2.7]],
  places: { ...NIGHT_4.places, bowl: [12.85, 0.05, 3.15], dogFlap: [5.375, 0.1, 0.0] },
  decor: [{ kind: 'tableLamp', x: 12.27, y: 0.55, z: 9.7 }, { kind: 'plywood', x: 11.064, z: 3.62, w: 1.1, h: 1.85 },
    ...PHOTOS.map((p) => ({ ...p, back: true })), { kind: 'bowl', x: 12.85, z: 3.15 }, { kind: 'garden' }],
  kibble: {   // the dog food bag torn open in the kitchen, and a trail to its bowl in the laundry
    trail: [[8.45, 4.75], [8.45, 5.6], [11.6, 5.68], [12.4, 5.66], [12.65, 4.6], [12.72, 3.4]],
    spill: { x: 8.3, z: 4.4, dir: [0, -1], sx: 1.2, x0: 7.3, x1: 9.4, z0: 3.75, z1: 4.75 },
  },
  scheduled: ['laundry', 'master', 'kid'],
  lair: { retreat: [12.65, 2.7], eat: true },   // it eats at its bowl, door shut
  rules: { dockLinger: 0.25, laundryPatrol: true, lights: true },
  flags: { lampOn: true, clockOn: false, leak: 'bright', boltTorn: true, nightlights: [true, true] },
};

export const NIGHTS = { 1: NIGHT_1, 2: NIGHT_2, 3: NIGHT_3, 4: NIGHT_4, 5: NIGHT_5 };
export const NIGHT_COUNT = Object.keys(NIGHTS).length;

// The full layout for a night: the night it extends, with this night's overrides applied.
export function layout(n) {
  const o = NIGHTS[n] || NIGHT_1;
  if (o === NIGHT_1) return { ...NIGHT_1, n: 1 };
  const b = layout(o.extends || 1);
  const rooms = b.rooms.map((r) => ({ ...r, ...(o.rooms?.[r.id] || {}) }));
  const walls = b.walls.map((w) => {
    const add = o.openings?.[w.along + w.at];
    return add ? { ...w, openings: [...w.openings, ...add] } : w;
  });
  const doors = Object.fromEntries(Object.entries(b.doors).map(([id, d]) => [id, { ...d, ...(o.doors?.[id] || {}) }]));
  const furniture = [];
  for (const f of b.furniture) {
    if (f.id && o.furniture && f.id in o.furniture) { if (o.furniture[f.id]) furniture.push({ ...f, ...o.furniture[f.id] }); }
    else furniture.push(f);
  }
  furniture.push(...(o.addFurniture || []));
  const out = { ...b, ...o, n: +n, rooms, walls, doors, furniture };
  delete out.openings; delete out.addFurniture; delete out.extends;
  return out;
}

export let NIGHT = 1, NIGHT_INFO = NIGHT_1;
export let ROOMS, WALLS, DOORS, FURNITURE, ITEMS, FOOTPRINT_PATH, FIRST_WALK, NOOKS, NIGHTLIGHTS, LIGHTS, PLACES, KIBBLE;
export let GRIME, SCRAPES, LAIR, RULES, SCHEDULED, START_FLAGS, DOCK, START, DECOR, BLOCKS, CEILING;

export function setNight(n) {
  const L = layout(n);
  NIGHT = L.n; NIGHT_INFO = L;
  ({ rooms: ROOMS, walls: WALLS, doors: DOORS, furniture: FURNITURE, items: ITEMS, footprints: FOOTPRINT_PATH, firstWalk: FIRST_WALK,
    nooks: NOOKS, nightlights: NIGHTLIGHTS, lights: LIGHTS, places: PLACES, kibble: KIBBLE, grime: GRIME, scrapes: SCRAPES,
    lair: LAIR, rules: RULES, scheduled: SCHEDULED, flags: START_FLAGS, dock: DOCK, decor: DECOR, blocks: BLOCKS, ceiling: CEILING } = L);
  START = { battery: 100, ...(L.start || DOCK) };
  return L;
}
setNight(1);
