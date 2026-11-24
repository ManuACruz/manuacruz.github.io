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

## Core loop (built)

- **Tasks**: clean a room to a dirt-removed target (65%; hallway 60%), spot-clean footprints, return to base.
- **Dirt**: a 1/16 m grid per room, generated with noise, heavier along walls and under furniture. Only cells
  the robot can actually reach count (see `World.buildDirt`). The map shows swept vs. dirty.
- **Resources**: battery (drains with movement, suction, lamp, scans) and bin (fills with dirt). The dock
  charges and empties both. Battery death is a loss: in the dark, something walks up behind you.
- **Stealth**: noise radius by action (drive 2.2 m, suction 6.5 m, bump up to 5.5 m; walls make sound count
  1.7 times as far). Sight 9 m with the lamp on, 2.3 m with it off, in a 130 degree cone; lamp in its face for 1.2 s
  and it notices anyway. Suspicion builds before a chase, faster up close. Cover (sofa, coffee table, kitchen
  table, beds) hides you completely; it walks to the edge, waits, and leaves.
- **Checkpoints**: each task start. A retry restores dirt, items, doors, story flags, and puts it back in the
  laundry with a short grace period.

## Night 1 beats (built)

| Task | Beat |
| --- | --- |
| Living room | Tutorial hints. At 42% the floor lamp flickers and dies; the TV turns on to static and switches off when you approach. |
| Kitchen | Microwave timer goes off by itself. The fridge door swings open. On completion: the back-door handle rattles, the door opens and slams, then invisible footsteps cross the house and muddy bare footprints appear one by one, ending at Theo's closed door. |
| Footprints | Cleaning the last print makes Theo's door creak open by itself. |
| Theo's room | A music box starts in the toy chest. A crayon drawing on the wall at robot height shows a house, a family and the "LONG MAN". Halfway through, the music box winds down, the hall clock stops, the laundry door opens and it walks the length of the hallway past the doorway for the first time. |
| Hallway | It is loose. Clean the narrowest, most exposed room in the house. |
| Return | Dock. The report says "1 person was detected at home tonight. Was this you?" The map reveals an unexplored area behind the laundry. The camera pulls out of the robot: it is standing right behind you, leaning down. |

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

## Known limits of this slice

- Mobile works in principle (touch stick and buttons, low-res rendering) but was only checked at desktop size.
- About 900 draw calls; merging static geometry per material would cut that a lot if phones struggle.
- The robot voice is the browser's speech synthesis and varies by system (can be turned off).
- No save between sessions: closing the tab restarts the night.
- Balance numbers (battery, bin, noise, sight) were tuned by reasoning and simulation, not by hours of play.
  They all live in `src/tune.js`.
