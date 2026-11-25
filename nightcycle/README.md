# Night Cycle

A first-person horror game where you are a robot vacuum. It is 3 AM, the family has moved out, the house is
up for sale, and the realtor's app has scheduled you to clean every room before tomorrow's open house.
The house is empty. Mostly.

This is the first playable slice: one night, one house, about 10 to 15 minutes.

## Run it

Plain HTML and JavaScript ES modules with three.js vendored in `vendor/three` (r187). No build step, but
modules need a static server.

Double-click `serve.cmd`, or:

```bash
python tools/serve.py 8083
```

Then open http://localhost:8083. `tools/serve.py` is Python's static server with caching turned off, so edits
show up on a normal reload. Headphones help: footsteps, creaks and its breathing are positioned in 3D.

## Play

| Key | Does |
| --- | --- |
| `W` `S` / arrows | drive forward / back |
| `A` `D` / arrows, mouse | turn (click the game to capture the mouse; drag also works) |
| mouse up/down | tilt the camera |
| `E` (or `Q`) | suction on/off. Suction cleans and is loud |
| `F` | headlamp on/off. The lamp lets you see and lets it see you |
| `Space` | LIDAR scan: a wave of points that shows the room in the dark, and shows it in red if it's in view |
| `Esc` | pause, settings, the archive of things you found |

A gamepad works (left stick drive, right stick look, A scan, X suction, Y lamp). On a touch screen: left
thumb drives, right thumb looks, buttons on the right.

**The loop.** Each task asks you to clean a room to a target (the bar at the top). Dirt shows on the floor and
on the cleaning map (top right): bright cyan is swept, brown is still dirty. Things on the floor get sucked up;
some of them are part of the story and land in the archive.

**Battery and bin.** The battery drains faster with the lamp and suction on. The bin fills as you clean. Drive
onto the green light of the dock (where you start) to charge and empty it.

**It.** Once it is out, it walks the house.
- **It hears** suction, bumps (loud on tile and bare boards, quiet on rugs), LIDAR scans, the robot's own
  voice prompts ("Battery low...") and dog food crunching up the intake. Before it is out, the laundry knocks
  back when you make noise near it.
- **It sees** the headlamp from across a room, and you in the dark only up close. Holding the lamp on it gets
  its attention. A robot tucked right behind a stack of boxes is hidden from across the room. When it notices
  you its head snaps round with a crack, and the recognition box counts up `person 0.42 ... 0.97` before it
  comes.
- **Hiding.** Its body can't get under the sofa, the coffee table, the kitchen table, the beds, the clawfoot
  tub or the hall bench, or into a few marked nooks (under Theo's desk, the pet flap at the end of the hall).
  It waits, sometimes pretends to leave, and comes back. Make noise under cover right next to it and it gets
  down and reaches under; back away to the far edge. Use the same hiding place too often and it checks it.
- **MOTION** registers it only while it moves: which side, and whether it is closing.
- If it catches you, or the battery dies away from the dock, the death screen says what gave you away. You
  reboot at the start of the task (or, on Easy and Normal, at your last dock), and the floor you cleaned
  stays clean.

## The night

1. Clean the living room. Something is off with the lamp and the TV.
2. Clean the kitchen. Then someone comes in the back door.
3. Spot-clean the muddy footprints. They lead to Theo's door.
4. Clean Theo's room. The music box. The laundry door.
5. Clean the hallway while it is loose. Its feet leave mud on the floor you swept.
6. Spot-clean the dog food spilled outside the laundry door.
7. Return to Home Base.

## Files

| File | What it holds |
| --- | --- |
| `src/tune.js` | every gameplay number: speeds, battery drain, noise radii, the entity's senses, task targets |
| `src/level.js` | the house as data: rooms, walls and openings, doors, furniture, items, footprint path, lights |
| `src/world.js` | DOM-free rules: collision, sight lines, the entity's walking grid and A*, dirt grid |
| `src/build.js` | builds the three.js scene from the level data (furniture builders live here) |
| `src/textures.js` | procedural canvas textures (floors, wallpaper, dust, footprints, the crayon drawing...) |
| `src/roomba.js` | the player robot: driving, bumping, cleaning, battery, bin, dock, headlamp, camera |
| `src/entity.js` | the thing's mind: senses, patrol / investigate / chase / search, stop-motion timing |
| `src/longman.js` | the thing's body: model, poses, eye-shine, the split-open head of the scare |
| `src/motes.js` | dust in the air, lit only inside the headlamp beam |
| `src/story.js` | Night 1: tasks and scripted events as generator coroutines, and the ending |
| `src/dirt.js`, `src/items.js`, `src/lidar.js` | dirt film, footprints and its muddy prints, floor items, LIDAR points |
| `src/kibble.js` | the dog food trail and spill (a spot-clean task that crunches) |
| `src/audio.js` | all sound, synthesised with Web Audio (no audio files) |
| `src/hud.js` | status, task, cleaning map, notifications, object-recognition boxes, dirt markers |
| `src/post.js` | low-res render plus the camera shader (bulge, grain, dither, glitch, static) |
| `src/main.js` | boot, loop, states, checkpoints, ending, debug keys |
| `tools/check.mjs` | level checker: `node tools/check.mjs` (add `--map` for an ASCII reachability map) |

## Debug

Open `http://localhost:8083/?debug`. Keys: `1`-`7` jump to a task, `C` clean the current task's room,
`T` teleport into it, `G` ghost (it can't see or catch you), `B` infinite battery, `K` get caught.
`?debug&auto` skips the title. In the console, `NC` is the game; `NC.advance(seconds)` runs the simulation
forward without waiting for frames, `NC.drive(throttle, steer, seconds)` drives, `NC.place(x, z, yawDegrees)`
teleports.

## Notes

- Everything is generated: geometry from boxes and capsules, textures on canvases, sound from oscillators and
  noise. The only external request is the Google Fonts stylesheet (VT323, Inter), which falls back to
  system fonts offline.
- Settings (difficulty, camera, volume, brightness, look sensitivity, text size, robot voice, object
  recognition, dirt markers, sound captions, flashing effects, invert) are saved in `localStorage` when the
  browser allows it. Difficulty can also be picked on the title screen.
- **Sound captions** write what you hear into the robot's log ("Audio: footsteps, left, near, through a
  wall"). **Flashing effects off** turns the strobing lamp, the TV and the glitches into slow pulses.

- Camera: **HD** (default on desktop) renders at screen resolution with 4x MSAA and bloom, and lowers its
  internal resolution on its own if frames run long. **HD (faster)** renders at 3/4 size (the phone default).
  **Retro** is the original low-res dithered look. Easy dulls its sight and hearing, slows
  its chase and stretches the battery; Hard does the opposite.
- The robot voice uses the browser's speech synthesis, so it sounds different on every system; turn it off
  in settings if it's bad on yours. Subtitles always show.
