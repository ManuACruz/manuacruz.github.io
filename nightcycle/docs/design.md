# Night Cycle: design notes

## Pitch

You are RV-7, a robot vacuum left behind in a house that has just been sold. Every night at 3 AM the realtor's
cheerful app schedules a clean. Every night something walks the halls. You can't fight, can't open doors,
can't climb stairs. You can clean, hide under the sofa, and go back to your dock.

## Pillars

1. **Floor-level dread.** The camera sits 11 cm off the floor. Furniture towers, doorways are canyons, and the
   thing in the house is mostly legs. Its head is only visible from across a room.
2. **The job is the danger.** Everything you need to do is loud or bright. Suction cleans but can be heard
   through walls. The headlamp shows you the room and shows you to it. Bumping into furniture makes noise.
   The tension is choosing when to work and when to go dark and silent.
3. **A robot's senses.** The HUD is the robot's own software: object recognition boxes, a dirt detector,
   a LIDAR scan, a proximity sensor, a cleaning map. The software is calm and helpful, and it cannot classify
   the thing ("person 0.08... [NO MATCH]").
4. **Cheerful corporate voice over horror.** The BrightHome app sends emoji-laden notifications ("Mud detected
   in Kitchen and Hallway 🐾 Spot clean added!") while you clean up after it.

## The Long Man (built)

About 2.7 m unfolded, hunched so its head hangs forward at ~2.4 m on a long neck and is held level, cocked to
one side. Emaciated: every rib, the spine and the shoulder blades show. Its forearms, hands, shins and feet are
black and wet, as if it waded through something (the muddy footprints). Its legs bend the wrong way and it
walks on long toes; its fingers hang past its knees. It folds itself down to pass under door frames.
It has no face: a smooth head with one seam down the front. Two pinpoints of eye-shine, one above the other,
glint in the seam when the headlamp catches them from a distance. Hunting, the seam cracks open and shivers;
when it catches you the head splits open like a book, wet and red inside and ringed with needle teeth.
Everything moves in stop-motion (12 poses a second). See `src/longman.js`.

The body is one skinned mesh over 67 bones, sculpted in code: the torso, neck, limbs, fingers and toes are
continuous, so it bends at the joints instead of showing balls and cylinders. Ribs (sweeping down to the front,
the lowest parting at the costal arch), spine, shoulder blades, collarbones, hip bones, kneecaps, heel spurs,
tendons and knuckles are sculpted into the surface, with lumps of noise under the skin. One material blends pale
skin, bone showing through, wet black mud and shadow in the hollows from a per-vertex tint. The neck is skinned
between chest, neck and head, so it stretches when the head comes for the lens. The skull is lumpy and asymmetric
in the details (heavy brow, sunken temples, cheekbones) and still splits along its seam.
Inside: a lining ridged like the roof of a mouth and threaded with veins, a pale lumpy gum along the seam, three
uneven rows of hooked needle teeth (some missing, some snapped), a folded core with two lidded sockets, and strings
of spit between the halves that stretch as it opens and snap one by one. The shoulders slope from the neck to a
bony point with the deltoid capping the arm and folds into the armpit; the knees have a flat kneecap, knobs either
side, the tendon and the hollow behind, and the joint weights differ front and back so a bent knee keeps its shape.

Black smoke pours off it (`src/fx.js`): a low pool round its feet that hides where it meets the floor, wisps
curling up its shins, and a trail off its back and arms while it hunts; it bursts off it as it comes for the lens.
Beside a wall or a shut door the arm on that side folds in rather than pass through (`Entity.keepArmsIn`). When it
catches you it stands on open floor, not inside a wall: if there is no room in front, the camera whips round to
where it is.

## Tension (built)

What the robot's camera and the house do as it gets close (`src/tension.js`, `src/post.js`):

- **Interference** inside ~4.5 m, through walls (it is electrical): lines of the picture tear sideways, a bright
  band rolls up the frame, the frame hops, the feed drops out for a frame; the headlamp stutters and the audio
  crackles. It is the one warning that works through walls without the HUD.
- **A pulse**: the picture throbs (tighter vignette, a bulge, more fringing) with a low thump in the housing,
  faster as it closes in on a hidden robot, during a chase and while it reaches.
- **Its footsteps** shake the camera with distance, and sift grit off the underside of whatever you hide under.
- **Lights near it** (floor lamp, TV, fridge, Theo's nightlight) stutter and buzz; nightlights short out in sparks.
- **First sight** pulls focus for a moment; a fast turn smears the picture; a dying battery drains the colour.
- **Quiet time**: after a calm stretch (it is far or away, ~40 to 70 s apart) one small thing happens: a locked
  outside door's handle rattles, something heavy is dragged in a far room, knocks travel inside the nearest wall
  toward you, a thump in the roof sifts dust through your light, a tall shape walks past a moonlit window (its
  shadow slides across the moonlight on the floor), or, once a night before it is out, the next LIDAR scan shows
  someone standing in a doorway in red, and the scan after shows nobody.
All of it respects the "flashing effects" setting (gentler, no strobing or dropouts).

The robot at work (`src/fx.js`): the intake is under the robot, behind the lens, so suction shows as the pull in
front of the bumper: grit, fluff and the odd fibre skittering across the floor into it, more the dirtier the floor,
and bits flicked in by the side brush. Dog food kicks up chunks. A picked-up object hops, spins and is whisked in
under the bumper with a puff of the dust it lay in; metal glints; anything that goes into the archive also gets
the robot's recognition scan, cyan rings on the floor and motes spiralling up.

## Core loop (built)

- **Tasks**: clean a room to a dirt-removed target (65%; hallway 60%), spot-clean footprints, return to base.
- **Dirt**: a 1/16 m grid per room, generated with noise, heavier along walls and under furniture. Only cells
  the robot can actually reach count (see `World.buildDirt`). The map shows swept vs. dirty.
- **Resources**: battery (drains with movement, suction, lamp, scans) and bin (fills with dirt). The dock
  charges and empties both. Battery death is a loss: in the dark, something walks up behind you.
- **Stealth**: noise radius by action (drive 2.2 m, suction 6.5 m, bump up to 5.5 m, scan 6 m, voice prompt
  5 m, crunching kibble 3.5 m; walls make sound count 1.7 times as far). Driving and bumping are louder on tile
  and bare boards and quieter on rugs (the hall runner is the quiet lane). Sight 9 m with the lamp on, 2.3 m with
  it off, in a 130 degree cone; lamp in its face for 1.2 s and it notices anyway. Short furniture hides a robot
  tucked behind it from across the room (sight line from 2.35 m down to 6 cm), never within 1 m.
- **Its attention, readable**: noticing you snaps its head round with a neck crack; the recognition box counts
  up while it can see you; a chase starts no sooner than 0.45 s after it noticed (unless you are within 1 m).
  A noise sends it into a 0.6 s freeze, head turned toward the sound, then a faster walk. Losing you is a long
  breath out. The motion sensor registers it only while it moves: side and trend, never distance.
- **Hiding is earned**: cover (sofa, coffee table, kitchen table, beds, clawfoot tub, hall bench) and marked nooks
  (under Theo's desk, the pet flap) keep its body away. It searches 6 to 14 s, sometimes pretends to leave and
  comes straight back. Noise under cover within 2.2 m makes it reach under: two sweeps of its arm along the
  floor, 1.3 m from where it stands; the far edge is safe. Covers you hide under three times get checked.
- **Director**: a menace value climbs while it is near you and with every chase or reach. Low, it patrols the
  rooms next to yours; high, it goes back to the laundry, shuts the door and stays 20 to 30 s (and knocks back
  at your noise). During the hallway task it walks the length of the hall at least three times.
- **Checkpoints**: each task start, and on Easy and Normal every time you dock. A retry keeps the floor you
  cleaned, the prints you mopped and what you picked up; the rest of the house goes back to the checkpoint
  and it comes back far away. Scenes that already played (`once`) don't replay from a dock save.
- **Death screen**: the last three things that gave you away, with the time, and one tip matched to what
  started it.

## Night 1 beats (built)

| Task | Beat |
| --- | --- |
| Living room | Tutorial hints (the dock is behind you). At 20% a knock from the laundry; from then on, until it is out, the laundry knocks back when you make noise near it, and the app suggests Quiet Mode. At 42% the floor lamp flickers and dies; the TV turns on to static and switches off when you approach. |
| Kitchen | Microwave timer goes off by itself. The fridge door swings open. The kitchen shares a wall with the laundry. On completion: the back-door handle rattles, the door opens and slams, then invisible footsteps cross the house and muddy bare footprints appear one by one, ending at Theo's closed door. |
| Footprints | Cleaning the last print makes Theo's door creak open by itself. |
| Theo's room | A music box starts in the toy chest, by the door, so you face the doorway. A crayon drawing on the wall at robot height shows the "LONG MAN". Halfway through, the music box winds down, the hall clock stops, the laundry door opens (the bottom deadbolt torn out, dog food spilling into the hall) and it walks down the hall. The bedroom door swings open as it passes. It waits short of Theo's door until you are looking at the doorway (12 s at most), stops in it, folded under the frame, and looks at you; the house goes silent. Then it walks on and a nightlight dies as it passes. |
| Hallway | It is loose, and its feet leave mud on the floor you swept, a few seconds behind it. At 30% the app takes the wheel for a "map refresh": lamp and suction on, three scans you can't cancel, and it comes. |
| Spill | Spot-clean the dog food outside the laundry door, next to where it lives. It crunches. |
| Return | Dock. The report says "1 person was detected at home tonight. Was this you?" The map reveals an unexplored area behind the laundry. The lamp goes off for a final map scan: the room comes back cyan, except two long legs in red right in front of you. Then the camera pulls out of the robot: it is standing over you, leaning down. |

## Story (the archive)

The Marsh family (Mom, Dad, Theo, and Biscuit the dog) left in a hurry. Found objects tell it:
a sticky note about drawing on walls, a wedding band left behind, Biscuit's scratched-off dog tag under the
table, a Polaroid with a fourth figure in the window, a pill cap ("to help Theo sleep"), Theo's drawing of the
Long Man "who lives behind the washing machine. He is always hungry", a brass key tagged "LAUNDRY. Keep it
locked. Keep it fed.", and a 2 AM hardware receipt for deadbolts and fifty pounds of dog food.
Nothing is explained outright. The dog bowl in the kitchen is freshly filled.

## Full game direction

- **Nights 2 to 5**, same house, changing: new rooms unlock (laundry, a basement hatch behind the dryer, the
  attic pull-down only reachable by the stairs-climbing upgrade), furniture moves between nights, sheets come
  off, the family's things come back.
- **The laundry room** is Night 2's centrepiece: the light under the door, the scratches, the key.
- **Upgrades between nights** bought with "cleaning credits": bigger battery, quieter motor mode, longer LIDAR,
  a second dock, side-brush reach, a "virtual wall" beacon that it won't cross for 20 seconds.
- **Escalating behaviour**: Night 2 it learns where the dock is and lingers near it. Night 3 it starts
  unplugging things. Night 4 it turns the lamp on you. Night 5 it is the one scheduling the cleans.
- **Other robots**: a pool robot, a lawn mower in the garden, a smart speaker that talks to it.
- **Endings**: leave through the dog door; stay and keep it clean forever; or do what the key says.

## Environmental storytelling (built)

Four deadbolts on the hall side of the laundry door, the lowest at robot height, and the dog flap screwed shut
with plywood, light bleeding round it (after it gets out, the bottom bolt hangs torn out and its screws lie on
the floor). A chain on the outside of Theo's door, ripped from the jamb. On the wall under Theo's bed, at robot
height: "UNDER HERE HE CANT REACH" and the nights, counted. A kibble trail from the bowl to the laundry door.
Grey scuffs on the tops of the door frames. The hall smoke alarm dangling on its wires, still blinking. Biscuit's
leash clipped to the coat rack, the collar end empty. Claw gouges low on the back door. In the laundry: a hole torn
low in the wall beside the washing machines, chunks of plasterboard on the floor, long dark drags down the walls,
and a nest of torn clothes pressed flat in the middle.

The house is low-poly with no assets loaded, but nothing is a bare primitive: dust sheets are draped cloth
(`drapeGeo` in `src/props.js`: the shape underneath shows through, folds, drooping corners), the bathroom has a
turned toilet pan, a vanity with a sunk basin and a clawfoot tub with paws, the kitchen has a sink, a cooker and
wall cupboards, beds have rounded mattresses and a duvet, the shelves are half-packed. Wallpapers are drawn
motifs (damask, flower sprigs, Theo's bedtime print of moons, planets and rockets), the hall runner repeats along
its length, and Theo's rug is braided. Rule for new props: no two different surfaces may share a plane (they
flicker through each other at a distance); window and door frames and skirting boards overlap the cut edges of the
walls by a few millimetres for that reason. `buildHouse(scene, world, { merge: false })` keeps meshes separate for
checking this.

## Known limits of this slice

- Mobile works in principle (touch stick and buttons, low-res rendering) but was only checked at desktop size.
- Static geometry is merged per material (~170 draw calls for the house, ~190k triangles in all); the Long Man is
  one skinned mesh (~29k vertices) plus a dozen head parts; the door props and mud prints add a few dozen more.
  Particles are three instanced pools (one draw call each, about 1,300 particles at most).

  HD is fill-rate bound (every light costs every pixel), so lights that are off are removed and HD scales its
  internal resolution down automatically when frames run long.
- The robot voice is the browser's speech synthesis and varies by system (can be turned off).
- No save between sessions: closing the tab restarts the night.
- Balance numbers (battery, bin, noise, sight) were tuned by reasoning and simulation, not by hours of play.
  They all live in `src/tune.js`.
