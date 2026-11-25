# Night Cycle: design review (Night 1 slice)

> **Status (2026-11-25): built.** Everything below is in the game except Night 2, which is a direction for the
> next night. Deviations: the crayon under Theo's bed is on the wall under the bed at robot height (on the slats
> the headlamp washed it out); the nightlights are fake glows, not real lights (every light costs every pixel);
> the bench is at x 10.5-11.7 and the pet flap at x 13.45-13.9 as proposed; the console is gone and the side
> table at the dead end is removed. Hall box stacks are at x 2.3 and x 8.45 on the south wall.

Three independent reviews of the current slice, each through one lens: **horror engagement and pacing**,
**level design and environmental storytelling**, and **player guidance**. They read the code and data (story
beats, AI, tuning, layout); none of them played it. Below: where they agree, then each lens in short, then
the ideas worth building around.

## The short version

The premise and the set pieces work: the footprints appearing one by one, the knock from the laundry, the
first walk past Theo's door, LIDAR showing it in red. Three things hold the slice back:

1. **The core rule is taught too late.** "Noise and light draw it in" is first mentioned in the popup after it
   appears, about 8 minutes in. Until then nothing reacts to what *you* do, so players learn "scripted events
   are harmless" and arrive at the hallway unprepared.
2. **The player can't read its attention.** The moment it notices you (it stops, so its steps go quiet) is the
   hardest moment to read, and a death never says what gave you away. Meanwhile the motion readout gives exact
   distance through walls, which drains dread.
3. **Hiding is a free reset, and the main stealth space has no hiding.** Under cover you can't be caught, even
   with suction on, and a failed search buys 20 to 32 s of calm. The 14 m hallway, where the hunt happens, has
   no cover at all; its east end is a 5 m dead end at the lair.

## Where the reviewers agree (highest value first)

| # | Change | Why | Lenses | Effort |
|---|---|---|---|---|
| 1 | **The laundry answers your noise before it's out.** While it's still locked away, suction or a hard bump near the laundry wall gets knocks that follow your rhythm and stop when you go quiet (25 s cooldown). | Teaches "it listens" with dread and no risk, minutes before it matters. | horror, guidance | S |
| 2 | **Show its attention.** When it notices you it snaps its head toward you (with a neck-crack sound) before the chase; while it can see you, the recognition box counts up `person 0.42 → 0.97`; when a noise sends it to investigate, it freezes for 0.6 s, turns, then walks faster. | Players need a fair window and a readable cause. | guidance, horror | S |
| 3 | **Death screen incident log.** Three lines of what gave you away (`03:41 Suction noise logged (Hallway)`, `03:41 Headlamp aimed at [NO MATCH] 1.2 s`) plus one tip matched to the cause. | Turns "it's too fast" into "looking at it with my lamp got me seen". | guidance | M |
| 4 | **Hiding has to be earned.** The search lasts a random 6 to 14 s, sometimes with a fake leave. Noise under cover within 2 m makes it reach underneath. It checks cover you overuse. Replace the long calm with a short linger nearby. | Right now getting spotted next to the sofa is the safest play. | horror | M |
| 5 | **Hallway cover and a loop.** Turn the console into a real bench to hide under, moved to x 10.5–11.7, just west of the lair door. Remove the side table at the dead end. Add a robot-only pet flap from the east end of the hall into the master bedroom (a low opening it can't fit through). | Gives the main stealth space a hiding spot and an escape route from the dead end. | level | S |
| 6 | **Motion sensor, not radar.** It only registers it while it moves (so it can "freeze" on purpose), shows a direction and trend (`◄ CLOSING`, `BEHIND`), and drops the "Motion moving away..." all-clear. | Less omniscient = more dread; direction helps without headphones. | horror, guidance | S |
| 7 | **Frame the first sighting.** Hold the first walk until the doorway is on screen (12 s timeout), stop it in the doorway for 2.5 s facing in, and move the toy chest (the music box) so you look *toward* the door. | The intro walk is the first peak and can be missed entirely. | horror, level | S |
| 8 | **Kinder retries.** Keep swept floor on death ("Cloud map restored: 54%") and/or save on docking on Easy and Normal. | Fear needs retries cheap enough that players take risks again. | horror, guidance | S |
| 9 | **The robot gives itself away.** Voice lines ("Battery low...", "Please empty bin") and the LIDAR ping are noise it can hear; a LIDAR hit makes it turn its head toward you. | Battery and bin become stealth problems; each scan becomes a gamble. | horror | S |
| 10 | **Lore behind risk.** The master bedroom (key, receipt) starts closed and swings open as it first walks past. | Right now the best story items are a free stroll in minute one. | horror, level | S |
| 11 | **No face before the reveal.** A battery death before Theo's room shows footsteps, a shadow and the camera lifted into static, never the face. | Protects the first sighting. | horror, guidance | S |
| 12 | **Reduce flashing** setting (the dying floor lamp flickers at up to ~30 Hz), sound captions in the robot's log ("Audio: footsteps, left, 4 m"), and separate the mud markers from the object-recognition toggle. | Accessibility; the footprint task is a pixel hunt with recognition off. | guidance | S |

## Horror engagement and pacing

- **Tension curve today:** mild unease in the living room, a real high point in the kitchen (back door and
  footprints), then the flattest stretch of the night cleaning footprints, the first peak in Theo's room, and the
  only real threat in the hallway, about a quarter of the night. The final image is strong, but it breaks
  first person at the climax.
- **No director during the hunt.** Random room weights leave the hall either empty or deadly by chance. Add a
  menace meter (time spent near you, number of chases): when low it patrols rooms next to you and crosses
  your sightline; when high it retreats audibly to the laundry and shuts the door. Guarantee 2 to 3 hall
  crossings per hall task.
- **Stingers are overused.** Instead of a sting on every sighting, drop the ambience and motor to near
  silence for 1.5 s, and save the sting for the start of a chase. The clock stopping already shows that silence
  is the strongest sound here.
- **End in first person:** a last mapping scan from the dock paints the room cyan except a red shape bent over
  you, then the pull-out.

## Level design

- The house is a spine (the 1.38 m hall) with dead ends hanging off it; the only loop is living room →
  kitchen → hall. The middle of the hall is well composed (the grandfather clock shadows the kitchen arch),
  the east end is the deadliest ground, and players can reach the 60% target without ever going there.
- **Make the lair entrance mandatory:** a kibble spill fanning out from the laundry door, crunching loudly when
  sucked up, as a spot-clean task ("Spill outside the Laundry 🐶").
- **A middle tier between seen and safe:** box stacks and armchairs hide a 9 cm robot from an eye at 2.4 m
  unless it's within about 1 m. Make tall-enough solid furniture block its sight to a robot tucked right behind
  it, and add stacks along the hall's south wall (keeping a path open).
- **Lamp-off landmarks:** plug-in nightlights at the bath door and kitchen arch; a nightlight dies as it walks
  past.
- **Hiding nooks should be deliberate:** "out of reach" is decided on a coarse grid and can flicker as you
  move. Mark nooks explicitly (Theo's desk, the pet flap) and require a margin elsewhere.
- **Floors as a sound map:** the hall runner muffles driving and bumps; bare boards and tile are loud. Dirt is
  heaviest along the walls, so cleaning pulls you off the quiet centre.
- **Bathroom:** make the tub clawfoot (cover), since it's where the first walk ends.

### Environmental storytelling to add

1. Laundry door, hall side: four deadbolts (the lowest at robot eye level), plywood screwed over the dog
   flap with light bleeding round it. After the intro the bottom bolt is torn out and screws lie on the floor.
2. A chain on the *outside* of Theo's door, ripped from the jamb. With the pill cap, it says they locked him
   in at night.
3. Under Theo's bed, in crayon on the slats, visible only by tilting up from underneath:
   "UNDER HERE HE CANT REACH" with tally marks. This teaches the cover rule inside the fiction.
4. A kibble trail from the bowl along the hall to the laundry: someone still feeds it.
5. Grey scuffs on the 2.1 m door lintels (it ducks now, so they'd match), and the hall smoke alarm knocked
   loose, dangling on its wires and still blinking.
6. Biscuit's leash still clipped to the coat rack, collar end empty; claw gouges low on the back door.

## Player guidance

- **First 3 minutes:** the cleaning loop reads well (grit sounds, cyan map, "DIRT DETECTED"). Likely
  misreadings: "E suction" sounds like "start cleaning" but turns it *off* (rename the off state "QUIET MODE ·
  NOT CLEANING"); bumps seem free; nothing says suction and the lamp are what it senses; the dock is behind you
  at the start and docking is fussy (16 cm).
- **Teach through the app at the right moment:** after the first knock, "Pet sleeping? 🐶 Press E for Quiet
  Mode"; on the first bump, "Bump detected 💥 Gentle driving keeps things quiet"; at the reveal, "Motion
  detected at home 👀 Night Mode tip: lamp off (F), suction off (E), park under the sofa or a bed 🌙".
- **A dock you can find under pressure:** a larger capture radius with auto-align, docking that doesn't count as
  a bump, a route drawn on the map when the battery is low or the bin full, a "bin almost full" warning at 75%,
  and time remaining next to the battery.
- **Danger states:** patrol and chase read well; *investigating* and *has seen you* are nearly impossible to
  tell apart, and *lost you* has no signal. Covered by items 2 and 6 above.
- **Settings gaps:** difficulty only lives in Settings (offer it on the title screen, with a one-line
  description each); gamepad players see keyboard prompts; notification text is a fixed 13 px; on the map,
  dirty brown and unswept blue are low-contrast; red LIDAR dots on teal are weak for red-weak vision (add a
  white core).

## Signature moments (only work because you're a vacuum)

- **The app takes the wheel.** Mid-hunt: "Listing photos in 6 hours! 📸 Running a quick map refresh." The lamp
  and suction switch on by themselves and three scans fire that you can't cancel, while the motion sensor climbs.
- **The hand under the sofa.** When it reaches under cover, the 11 cm camera sees its long black arm laid flat
  on the floor, fingers dragging toward the lens, while UNDER COVER flickers. You back away to the far edge;
  it sweeps once more and withdraws.
- **The progress bar goes backwards.** During the hallway task its feet leave mud (the footprint system
  already exists), re-dirtying floor you swept: the task bar drops from 61% to 58% to 55% while you hide, and
  the map draws its route in brown a few seconds late. Your score becomes the tracker.

## Night 2: it rearranged the house

The sofa is dragged across the living-room/kitchen arch, removing the only loop and the cover nearest the dock.
The fridge is pulled out, revealing a ragged hole in the wall into the laundry. The quickest way across the house
is now through the room you were told to keep locked, and the living room, where it now lingers by the dock,
becomes the dangerous room. Same floor plan, turned inside out.
