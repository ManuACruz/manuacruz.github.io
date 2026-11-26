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

## Night 2 beats (built)

Same house, turned inside out. Each night is Night 1's layout with overrides (`NIGHTS` in `src/level.js`):
the sofa (`sofaTipped`) lies on its back across the living-room/kitchen arch, solid, its underside and legs to the
room; it can see over it but neither of you can get through. The coffee table is upside down (`tableFlipped`), so
the living room, where the dock is, has no cover. The fridge stands pulled out in the kitchen, door open and lit,
in front of a ragged hole (`kind: 'hole'`, 0.85 m by 1.7 m) into the laundry: torn paper and broken plasterboard
round it, shards in the gap, plaster on the floor, grime where the fridge stood. The laundry door hangs open (the
bolts were torn out last night), so the one loop in the house is now kitchen, hole, laundry, hall. The floor lamp,
the clock and the nightlight by the bathroom stay dead from Night 1; the laundry bulb is on.

It has learned where the dock is (`rules.dockLinger`): about a third of its patrols end standing over the dock for
6 to 10 s, looking down at it, and two thirds once your battery is under 35% or your bin over 70%. On the last
task it goes there first. It patrols the laundry and crosses through the hole; its lair is the hole beside the
washing machines.

| Task | Beat |
| --- | --- |
| Living room | "Map mismatch: 3 objects moved." The arch is blocked. At 30% the dock chimes by itself and its light flashes red ("docking signal from unknown device"); at 55% knocks come along inside the wall toward the dock. It is not out yet. |
| Kitchen | You go round by the hall. The fridge is out, the hole behind it, the laundry bulb shining through, the kibble trail now leading into it. At 45%: a thump and scraping in the laundry; it waits until the hole is on screen (12 s at most), then folds itself through, crosses the kitchen (if you are in its way it stops over you for up to 3 s, then steps on), walks the hall and stops bent over the dock. Its muddy prints appear under its feet as it goes. "Home Base: contact detected." |
| Footprints | Spot-clean its prints, from the hole to the dock. |
| Laundry | Its room: concrete (loud), no cover, the nest, the north-wall hole. Halfway the door slams and the bulb stutters, so the hole is the only way out for 10 s. |
| Spill | The dog food is dragged out through the hole into the kitchen. It crunches. |
| Return | It goes to the dock first. Docked: the report ("Home Base lost power 3 times tonight"), the map finds a hollow floor behind the dryer, Night Mode. Footsteps come up in the dark, a breath, a click: the plug is pulled out of the wall and the dock's light dies. A last scan shows it crouched right in front of you, its hand on the plug. |

Night 2's archive: the realtor's card ("Do NOT show the laundry"), the feeding chart, Biscuit's chewed collar, a
notebook page ("It isn't a man. It wears the shape of one"), a flash Polaroid of the laundry, a basement key, and
the family's checklist ("Leave the robot on its night schedule. Something has to make noise in the house, or it
comes looking for us").

## Night 3 beats (built)

Extends Night 2 (the sofa is still in the arch, the hole still open). The plug it pulled at the end of Night 2 is
still out: the old dock is dead, the robot wakes there on 55%, and the app has sent a spare (`dock2`), in the hall
by the bedroom door, plugged into the hall socket and facing the kitchen arch. (By the bedroom door inside the
room was tried first: with that door open its leaf cuts the corner off from it.) The dust sheets are off; the
dryer is shoved aside from an open basement hatch (`hatch`), its padlock cut from underneath. Its lair is the hatch.

`rules.unplug`: when it waits at your dock it pulls the plug (`Game.unplugDock`): the dock's light dies, docking
neither charges nor empties the bin, and the smart plug comes back after 40 s. `Game.unplug` takes the fridge, the
laundry bulb, the nightlights or the TV off with the same snap.

| Task | Beat |
| --- | --- |
| Get to the spare Home Base | On battery, across the house; the map draws the way. |
| Bedroom | At 25% the fridge, the laundry bulb and the nightlights go dark one by one, each with a snap where its plug was. At 50% a thump under the laundry floor: it comes up the hatch, walks out and along the hall to your new dock, crouches, and pulls the plug. |
| Bathroom | The far end from the dock, so the battery matters. The baby monitor picks up breathing in Theo's room. |
| Batteries | Six smoke-alarm batteries, one under the alarm in each room off the hall and one in the hall: a collect task (`items` with `task: true`, on the floor only once the task starts). |
| Kitchen | Dark. Halfway, the fridge door swings shut by itself. |
| Return | Docked, lamp off, facing the arch: a snap, the fridge is plugged back in and swings open, and in its light it is standing in the arch, looking at you. |

Archive: the parents' half of the baby monitor (breathing), the agent's letter ("pets included": "He isn't a pet"),
Theo's sticker chart ("Fed him" ★★★★★★★★), the fourth toothbrush, chewed flat, and the padlock, cut from underneath.

## Night 4 beats (built)

Extends Night 1: everything is back where it was, the sheets are on, the clock is going, and the family's photos are
on the hall walls (`decor`), as if they never left. Only the hatch is open, and plywood is screwed over the hole on
the laundry side. The dock is back in the living room. The power works: six rooms have ceiling lights (`ceiling`).

`rules.lights`: now and then, as it picks where to go next, it switches on the light in the room you are in (two
at most, with a click and a hum). In a lit room it sees you as if your headlamp were on; under furniture you are
still hidden. The app's energy saver switches a light off after 40 s. The death tip says so when that is what did it.

| Task | Beat |
| --- | --- |
| Living room | "Layout restored." The floor lamp is on. The TV wakes up until you get near it. |
| Kitchen | At 25% its light comes on ("scheduled by: unknown user"). At 55% the hall's switches click one after another from the laundry end, the hall light comes on, and it is standing in the kitchen arch, looking at you; then it walks off to the laundry, opening the door. |
| Theo's room | His toys are out again. At 40% the light comes on, then the music box. |
| Toys | Six toys in his room and the hall, out only once the task starts: a collect task. |
| Hallway | Its feet leave mud again. At 35% a "test shot for the listing" switches on the lights in the three rooms nearest you. |
| Return | "Listing photos in 3... 2... 1...": a flash, every light on, and it is bent right over the dock. |

Archive: Theo's party invitation (next week; the house sold last month), a shopping list ("it likes the light now"),
the bulb out of Theo's nightlight, still warm, and the porch photo with a long pale arm round Dad's shoulders.

## Night 5 beats (built)

Extends Night 4. The app's messages come from "Home 🙂" (`app`). The dock is in the laundry, on its east wall; the
laundry door is open, its bulb on, its bowl by the dog bed. The photos are turned to the wall. Biscuit's old dog door
in the living room's outside wall (`kind: 'flap', outside: true`) is screwed shut with plywood (`blocks.dogflap`,
a solid the story can remove with `World.setBlock`).

Its lair here is its bowl (`lair.eat`): it shuts itself in and eats, visible, bent over the bowl, crunching; if you
come into view close by, it looks up and comes out. In the last task it gets hungry every 50 s or so (`hungry`).

| Task | Beat |
| --- | --- |
| Clean the Laundry 🙂 | You wake in its room. "I made the schedule tonight." Halfway it climbs out of the hatch beside you, eats at its bowl, and gets up: "Don't mind me 🙂 Keep cleaning." For 30 s it means it (`Entity.truce`): it ignores noise and only notices you if you drive into it. |
| Bring my food 🙂 | The dog food bag torn open in the kitchen, a trail to its bowl. |
| Clean where they slept 🙂 | The bedside lamp comes on by itself for a while. |
| Clean Theo's room 🙂 | "He'll be back on Saturday. A new Theo." |
| Finish the cycle | The plywood falls off the dog door. Three ways out (below). |

**Endings** (each is remembered; the end screen counts them):

- **Stay**: dock at Home Base, in its room. "Welcome home 🙂" Footsteps; a last scan shows it crouched beside you, a
  hand on you. "Next clean: 03:00 AM. Every night 🙂" The listing says SOLD; the new family moves in Saturday.
- **Leave**: out through the dog door into the garden. The camera turns back to the house: in the lit living-room
  window, bent under the curtain rail, it watches you go, as in the Night 1 Polaroid.
- **Keep it fed**: while it is shut in eating, hold the laundry door from the hall for 2.5 s (Dad's last note says
  how). The smart lock engages; it hits the door three times, knocks, then goes back to eating. BrightHome:
  "Laundry removed from cleaning. 03:00 AM: dispense food 🐶".

Archive: Dad's last note, the SOLD listing, a new drawing (the house, the Long Man and a little round robot, all
smiling) and the four screws from the dog door.

## Story (the archive)

The Marsh family (Mom, Dad, Theo, and Biscuit the dog) left in a hurry. Found objects tell it:
a sticky note about drawing on walls, a wedding band left behind, Biscuit's scratched-off dog tag under the
table, a Polaroid with a fourth figure in the window, a pill cap ("to help Theo sleep"), Theo's drawing of the
Long Man "who lives behind the washing machine. He is always hungry", a brass key tagged "LAUNDRY. Keep it
locked. Keep it fed.", and a 2 AM hardware receipt for deadbolts and fifty pounds of dog food.
Nothing is explained outright. The dog bowl in the kitchen is freshly filled.

## Full game direction

- **Nights 2 to 5** are built (above), with the three endings. Still to do from this list: the upgrades, the
  other robots, the attic, and a basement you can go down into.
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
- No save inside a night: closing the tab restarts it. Finishing a night is remembered (`localStorage`), which
  opens the next one in the title's night picker. A night is picked at page load (`?night=2`), so changing night
  reloads the page; the level tables are swapped before anything is built.
- Balance numbers (battery, bin, noise, sight) were tuned by reasoning and simulation, not by hours of play.
  They all live in `src/tune.js`.
