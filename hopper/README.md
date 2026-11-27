# Hopper

A one-finger puzzle platformer. Hopper is a squishy frog-ish blob with a wide mouth and a long sticky
tongue: tap a pin and the tongue shoots out, grabs it and yanks him there. Collect the emoji stickers on
the way, reach the goal, then stick them into the sticker album.

The rules and numbers follow `pin-hopper-game-spec.md`; its four levels are now among 34, in four worlds. The
environment is whitebox on purpose;
the effort went into feel: squash and stretch, the tongue, tweens, particles, hit-stop, screen shake, sound.

## Run it

Plain HTML, canvas and vanilla JavaScript (ES modules). No build step, but modules need a static server.

Double-click `serve.cmd`, or:

```bash
python -m http.server 8081 --bind 0.0.0.0
```

Then open http://localhost:8081 on the desktop, or http://<your-pc-ip>:8081 on a phone on the same Wi-Fi.
Held in portrait, the stage rotates itself to landscape.

## Play

| Pin | Look | What it does |
| --- | --- | --- |
| A | orange, arrow up | Tongue grabs it, dash there and hang |
| B | teal, swing arc | Tongue grabs it, hop to the near end of the arc and swing |
| C | purple marker on the ground | Let go and walk there |

- **Swipe up** to jump. Walking towards a purple pin and blocked by a wall? Swipe up to climb it.
- Every sticker in the level is needed at the goal. Fall off, or arrive without them, and the level restarts
  (from the last completed goal on multi-goal levels).
- Idle for a few seconds and a hand shows the next move.
- At every goal the album page slides in: drag each sticker into its matching slot (or tap a sticker, then its slot).
- **📒 Album** on the title (or in settings) opens the album menu: every level is a page, in worlds. Finished pages
  show their stickers; tap a page to look at it, flip with ◀ ▶, and **Play** it. A level opens once the one before
  it is done; **Play** on the title goes to the first one not done.

## Levels and pages

34 levels in four worlds (`src/levels/`), one new thing at a time: **Meadow** (1-1 to 1-8) walks, drops, jumps and
climbs with the purple pins only; **Woods** (2-x) adds the orange dash pins; **Pond** (3-x) the teal swings; **Hive**
(4-x) mixes everything and adds levels with two or three goals. The play order is set by id in `src/levels.js`.

Each goal's album page teaches something small, by type (`src/boards.js`):

| Type | The page | Example |
| --- | --- | --- |
| `cycle` | a loop with arrows | rain and clouds, the seasons |
| `sequence` | first, then, last | egg, chick, hen |
| `pattern` | a repeating row with gaps | day, night, day, … |
| `pairs` | who goes with what | bunny and carrot, hot and cold |
| `count` | a numeral and that many stickers | two and two more make four |
| `groups` | sort into hoops (any sticker that belongs fits) | land, sea or sky |

Desk keys: `Up`/`Space` jump (hold `Left`/`Right` to lean), `1`–`9` tap pins in list order, `R` restart,
`Esc` settings.

## Tune it

The ⚙ button opens settings: jump to any level, the album, sound, skip to the album page, reset progress, and sliders for the
main numbers. Changes apply at once and persist in `localStorage`; **Copy changes** copies only the edited
values. Defaults live in `src/tune.js`. `shake` and `hitstop` scale the juice.

## Check the levels

```bash
node tools/check.mjs              # all levels, 20,000 random players each
node tools/check.mjs --level 2-3 --runs 2000
node tools/trace.mjs 2-3          # where Hopper is at every step of one level's solution
```

It plays each level's solution, checks the camera framing before every step, checks every album page (a slot for
each sticker the goal takes), and runs random players to gauge difficulty. Run it after any change to the levels,
`src/sim.js` or the tunables. Solution steps: a pin id (tap), a number (swipe up, leaning that many degrees),
`'wait'` (swing to the far end), `'back'` (swing out and back).

## Camera spots

A level bigger than the screen lists camera spots, `cams: [[x, y, zoom], …]` in its drawing units (zoom is optional;
below 1 shows more). The camera rests on the last spot that frames what Hopper needs with room to spare.

```bash
node tools/framing.mjs --level 3   # where Hopper, the next pin and the goal sit on screen before each step
node tools/autocam.mjs --level 3   # draft spots from the solution that pass every framing rule
```

The framing rules live in `src/cam.js` (`FRAME`): Hopper and the next pin 10% in from the edges, his swing and where
the next pin takes him on screen, 120 px of floor under his feet, and nothing he needs under the HUD on small phones.

## Files

| File | What |
| --- | --- |
| `src/sim.js` | The rules. No DOM; the checker runs it in Node. Emits events the game turns into juice. |
| `src/cam.js` | Camera spots (also DOM-free). |
| `src/levels.js` | The worlds and the play order; the levels are in `src/levels/<world>.js`. |
| `src/boards.js` | Album page types and their layouts (also DOM-free; the checker validates pages with it). |
| `src/tune.js` | Every number. |
| `src/game.js` | Loop, input, camera, drawing, help hand, win/lose flow. |
| `src/blob.js` | Hopper: jelly body, eyes, moods, mouth, tongue. |
| `src/album.js` | The sticker album page and its drag-and-drop; also draws pages read-only for the album menu. |
| `src/fx.js` | Easing, tweens, springs, particles, screen shake. |
| `src/audio.js` | Synthesised sound effects (Web Audio). |
| `src/sprites.js` | Cached emoji sprites: plain, die-cut sticker, ghost silhouette. |
| `src/ui.js` | Title, buttons, the album menu, settings panel. |

## Test hooks

In the browser console:

- `HOP.pause()` / `HOP.pause(false)` stop or resume real time; `HOP.step(2)` advances 2 s in fixed steps and redraws.
- `HOP.tap('a1')`, `HOP.swipe(0)` act like the player.
- `HOP.go(2)` starts the third level in play order (skipping the opening). `HOP.skip()` jumps to the album page.
- Finished levels are saved in `localStorage` `hopper.done` (a list of level ids).
- `HOP.place(0)` sticks album item 0 in its slot. `HOP.ch`, `HOP.level`, `HOP.mode` read state.
