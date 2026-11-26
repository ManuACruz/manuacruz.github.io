# Night Cycle: five-night review (graphics, design, engagement, usability)

2026-11-26, after Nights 2 to 5 were built. The earlier review of the Night 1 slice is `design-review.md`.

> **Status: the six bugs below are fixed** (same day). See "Fixes, re-measured" under the bug table. The design
> suggestions (level by level, and across all five nights) are not built yet.

**How this was done.** Each night was played start to end by a measuring bot in the browser. The bot drives with
the real physics, noise and battery. It keeps suction on and goes for the nearest dirt, print, kibble or item. It
docks below 22% battery or above 92% bin, and reboots when it dies. It never hides. The lamp was on for Night 1's
first four tasks and off everywhere else. The nights were also screenshotted at 960x600 and 1024x768, and the code
was read where the numbers looked odd.

The bot cleans more slowly than a person and never uses cover. Read its times as upper bounds, and its deaths as
what happens to a player who doesn't hide.

## The short version

1. **Rebooting can trap you in a death loop.** Two scripted scenes replay a second or two after every reboot and
   kill you again. After a reboot, the thing in the house also comes back in or next to the room your task needs.
   Fix these first: a stuck player will read them as "the game is broken", not "the game is scary".
2. **Dying costs almost nothing, so fear fades.** A reboot costs about 10 seconds and keeps the floor you cleaned.
   The bot finished every night without hiding once, after 17 to 40 deaths a night. Players learn this by their
   second death.
3. **Most of every night is the same job.** 17 of the 30 tasks are "clean a room to 65%", at 3 to 5 minutes each:
   the kitchen four times, the living room and Theo's room three times each. Each night's new idea (pulled plugs,
   lights, feeding) mostly happens *around* the cleaning instead of changing how you clean. The two pick-up tasks
   are over in seconds: the toys were already picked up while cleaning, and the batteries lay in one line down the
   hall.

The art direction, the premise and the set pieces are strong, and they get stronger night by night. Night 4 is the
best-looking night, and Night 2's "same house, turned inside out" is the best design idea.

## Measured, night by night

Bot time per task, in seconds. "Deaths" means bot reboots. Nights 3, 4 and 5 were finished with the debug ghost on
(it can't catch you) once a death loop had been measured.

| Night | Tasks (seconds) | Total | Deaths | First time it is close (within 4 m) |
| --- | --- | --- | --- | --- |
| 1 | Living 288 · Kitchen 248 · Prints 40 · Theo's 225 · Hallway: loop (13 to 16 deaths per 200 s) | 1,200+ | loop | ~745 s (Theo's room) |
| 2 | Living 212 · Kitchen 286 · Prints 158 (11 deaths) · Laundry 232 (9) · Spill 35 · Home 30 | 953 | 23 | ~453 s |
| 3 | Trek 9 · Bedroom 197 · Bath 240 (18, 6 s apart) · Batteries 17 · Kitchen 242 (it was within 4 m for 202 s) · Home 22 | ~1,165 | 18 | Bedroom (scripted) |
| 4 | Living 251 · Kitchen 240 · Theo's 351 (18) · Toys 8 · Hallway 253 (22, loop) · Home 21 | 1,124 | 40 | Kitchen (scripted); first death ~500 s |
| 5 | Laundry 100 (1) · Food 33 (2) · Bedroom 168 (1) · Theo's 356 (13) · Finish 33 | 689 | 17 | ~80 s |

**Battery.** With lamp and suction on, at full speed, it drains about 0.37% per second, so a full charge lasts
about 4.5 minutes (about 6 with the lamp off). The living room alone used 50 to 60% on Nights 2 and 4. On Night 1
the bot docked three times before it reached the hallway.

## Bugs found

| # | Problem | Evidence | Fix | Effort |
| --- | --- | --- | --- | --- |
| 1 | **Scenes replay after a reboot.** `Story.once` promises a scene plays once "even across retries", but `restore()` puts `g.flags.seen` back to the checkpoint from the start of the task. The cloud map keeps your progress, so the trigger is true again the moment you reboot. | **Night 1, Hallway:** the app's "map refresh" takeover replays 1 to 2 s after every reboot past 30%. It takes control (lamp, suction, 3 scans), and the bot died about 7 s later, 5 times out of 5. **Night 4, Hallway:** the "test shot" switches three lights on 1 to 2 s after reboot; the bot died about 6 s later, 4 times out of 4. | Keep `seen` through a reboot for scenes that change nothing the checkpoint restores (takeover, test shot, TV, tips). An easy way: `once()` also writes `g.cp.flags.seen[id] = true`. Scenes that change the house (the Night 3 power-out) can keep replaying. | S |
| 2 | **After a reboot it comes back next to your task.** `Entity.restore` picks whichever of four fixed spots is farthest from where you reboot, and ignores the task. [1.4, 8.0] is the bathroom, next to Theo's room. | **Night 3, Bathroom:** with the dock in the hall, the farthest spot is the bathroom itself, and 17 reboots in a row lasted 6 s each. **Nights 4 and 5, Theo's room:** it comes back next door, and reboots lasted 10 to 13 s. **Night 2, prints:** 11 s each, probably the same cause. | Score each spot by its distance from both the robot and the task's room or targets, and give each night its own spots. For 8 to 10 s after a reboot, make it half-deaf as well as calm (as `entGrace` does after its first appearance). | S |
| 3 | **Night 5 says "Keep cleaning", then hunts you for cleaning.** | The bot died at 86 s, right after the laundry scene, to suction noise. | Give it a real truce: for about 30 s it ignores suction while it eats. Or change the line. | S |
| 4 | **Pick-up tasks finish themselves.** Task items can be picked up before their task (`items.js:94`). | Toys took 8 s; the bot had already picked most of them up while cleaning Theo's room. Batteries took 17 s for another reason: all six lay in one line down the hall. | Hide them until the task starts, or make it "bring them to X". At the least, say "4 of 6 already collected" when the task begins. | S |
| 5 | **Returning players start Night 1.** The title screen's night picker defaults to Night 1 even when Night 3 is next, so "Start cleaning cycle" replays Night 1. | Checked with progress `{done: 2}`. | Select the next unplayed night by default. | S |
| 6 | **The title card doesn't fit a 600 px tall window.** | At 960x600 it is 662 px tall, so the controls scroll off. | Tighten the spacing, or collapse the controls behind a "Controls" toggle. | S |

### Fixes, re-measured

Re-measured with the same bot (lamp off, never hiding) on a test page with the renderer stubbed out, because WebGL had
been switched off in the browser pane by then. `node tools/check.mjs` passes, and `NC.autoplay` runs all five
nights and all three endings with no errors.

| # | Fix | Before → after |
| --- | --- | --- |
| 1 | `Story.once(id, cond, gen, keep)`: a `keep` scene is marked played in the checkpoint as well, so a reboot can't replay it. Kept: the knock, the microwave, the app's takeover, the Night 2 dock chime, the wall knocks and the fridge log lines, the baby monitor, the TV, the Night 4 kitchen and Theo's lights, the test shot, and the Night 5 bedside lamp. Scenes that change what a reboot restores (lamp, fridge door, power cut, door slams) still replay with their effects. | Night 1 hallway: the takeover played once in 238 s (it used to replay after every reboot). Night 4 hallway: the test shot played once. Remaining hallway deaths, one every 13 to 33 s, come from the hall hunt itself: the bot drives the open hall with suction on. |
| 2 | `Entity.rebootSpot()`: the candidates are the old four spots, its lair, and three free points in every room. It never picks the robot's room or the task's room, and the spot must connect to the hall. The best is the one farthest from the nearer of the robot and what the task needs (`taskDistance`: the room, the prints or kibble left, the items, the dock). After a reboot it also has a 6 s `truce`. | Night 3 bath: it comes back in the laundry; lives went from 6 s to 20-43 s, and the task from 240 s (18 deaths) to 154 s (5). Night 4 Theo's room: lives went from 10-13 s to ~20 s. Night 5 Theo's room: 356 s (13 deaths) became 214 s (6). Night 2 prints: 158 s (11) became 56 s (3). |
| 3 | `Entity.truce`: no hearing, and sight only if you drive into it. Night 5 gives 30 s of it after "Keep cleaning", and it also counts as quiet when it picks where to go. | No deaths during the laundry task; the first death came at 137 s, in the bedroom. |
| 4 | Task items are hidden, and can't be picked up, until a collect task is running. The Night 3 batteries are now one under the alarm in each room (living room, kitchen, hall, bathroom, Theo's room, bedroom), and the app says so. | Toys: 8 s became 28 s, with all six still to find. Batteries: a tour of the house instead of a 17 s line. |
| 5 | With no `?night`, the page loads the next unfinished night, and `goNight` always writes `night=`. | `{done: 2}` opens Night 3 with "Start Night 3". |
| 6 | Under 720 px tall the title card is tighter (smaller logo, less padding), and under 620 px the gamepad line is hidden. | At 960x600 the card is 420 px tall and fits. |

## Level by level

### Night 1: the house is empty. Mostly.

**Works:** the warm floor lamp against the blue dark; recognition boxes as the robot's way of seeing; the
footprints; the reveal in Theo's room; the lit hallway runner. The death screen's incident log and tip ("Your
headlamp shows you from across a room. F turns it off...") makes each death readable.

**Problems:**
- It is close for the first time at about 12 minutes of bot time (maybe 8 for a person). That suits a first night,
  but the living room and kitchen are about 9 minutes of pure chores.
- The hallway takeover loop (bug 1, fixed) landed on the climax of the night.
- Nose-first into furniture with the lamp on, the headlamp blows out a third of the screen (the sofa skirt).

**Suggestions:** cap the living room at 50% on Night 1 only, or move the first knock earlier (at 10% instead of
20%). Clamp the headlamp's brightness at close range.

### Night 2: it rearranged the house

**Works:** the strongest concept: same plan, the shortcut is now the room you were told to keep locked, and it waits
by your dock. The hole and the pulled-out fridge read well from both sides.

**Problems:**
- The tipped sofa reads as a dark wooden cabinet, not a sofa on its back.
- Deaths cluster on the footprints task, which runs from the hole to your dock: reboots lasted 11 s each (bug 2). The best scene of the night
  (prints appearing under its feet) is followed by its most frustrating minute.
- The living room again takes 3.5 minutes before anything new happens.

**Suggestions:** show the sofa's legs in the air, a cushion fallen off, and its pale underside fabric. Open with
something new in the first minute: the robot wakes facing the sofa where the arch was, or the dock is dragged
20 cm out of place.

### Night 3: it starts unplugging things

**Works:** losing the lights one by one, the snap of each plug, the hatch, and the ending (it standing in the arch, in
the fridge light).

**Problems:**
- **The trek to the spare dock takes 9 seconds.** The "on 55% battery, across the house" beat never happens.
- With the lamp off, the screen is almost pure black, so the night is played from the minimap.
- The kitchen is next to where it waits by the new dock: during the kitchen task it was within 4 m for 202 of 242 s.
- The bathroom reboot loop (bug 2).

**Suggestions:**
- Start the night at about 15% battery, or block the hall so the way to the spare dock goes through the laundry
  hole.
- Give the dark something to see: standby LEDs, moonlight at the windows, a longer LIDAR afterglow on this night.
  Otherwise the 3D view, which is the game's best asset, goes unused.
- Give the player one verb against unplugging: nudge the plug back in at the socket (loud, so it's a gamble).

### Night 4: it turns the lights on you

**Works:** the best-looking night. The lights are the mechanic and you can see them: a lit room is obviously lit, the
family photos make the hall a different place, and the kitchen-arch stare is a great frame.

**Problems:**
- The test-shot loop (bug 1).
- Theo's room took 351 s with 18 deaths (bug 2).
- The toys task took 8 s (bug 4).
- The HUD never says you are in a lit room. "UNDER COVER" exists; its opposite doesn't.
- The tutorial tips (bump, quiet mode) play again, as on every night.

**Suggestions:**
- Add "LIT ROOM · VISIBLE" to the status line.
- Let the player switch a light off through the app, for a battery cost and a click it can hear. Right now lights
  are only done *to* you.
- Remember tutorial tips across nights (localStorage).

### Night 5: it is the one scheduling the cleans

**Works:** "Home 🙂" as the sender, its room as your dock, the eating pose, and the Leave ending's look back at the
window. It's the shortest night (about 11 minutes) and has danger from the first minute, which suits a finale.

**Problems:**
- The "Keep cleaning" contradiction (bug 3).
- The choice opens with a 15 s hint that lists all three endings like a menu, which spends the mystery the night
  built.
- To see another ending you replay the whole night: "Play Night 5 again" means 11+ minutes for each ending.

**Suggestions:**
- Let the house offer the choices first: the plywood falling, Dad's note, the app's "Come home". Show the explicit
  hint only after about 45 s of indecision.
- Add "Return to the last choice" on the ending screen (the checkpoint at "Finish the cycle" already exists).

## Across all five nights

**Stakes.** Death costs about 10 seconds and keeps your floor, so after a couple of deaths fear turns into
attrition. Options, from lightest to heaviest:
- Show a grade on the end screen built from "Units lost", time, coverage and objects. The stats are already there;
  they just don't add up to anything.
- On Normal, lose the floor cleaned since the last dock. That makes docking (which saves) a real decision.
- On Hard, a fixed number of units per night.

**Variety.** Let each night's mechanic change *how you clean*, not just what happens near you:
- Night 3: clean by LIDAR and map only.
- Night 4: decide which lit rooms are worth it.
- Night 5: clean while it watches you from the doorway.

Lower the target on rooms you're cleaning for the third or fourth time (50%), or swap one repeat per night for a
spot task.

**Counter-play.** Almost every new mechanic is done *to* the robot. One verb per night that answers it (re-plug,
switch off, feed it the spill to buy time) would turn dread into decisions.

**HUD.**
- The notification card covers the log lines underneath it (Night 4 hall).
- Recognition labels draw over the status panel ("tv" over the SUCTION key at the dock).
- Both want a reserved band, or labels that skip the HUD's corners.

**Battery.** About 4.5 minutes per charge makes the dock the heartbeat of every night. That works on Nights 2 to 4,
where the dock is contested, but on Night 1 it only adds trips while nothing is chasing you. Consider a larger battery
on Night 1 only.
