# Hopper

A one-finger puzzle platformer. Hopper is a squishy frog-ish blob with a wide mouth and a long sticky
tongue: tap a pin and the tongue shoots out, grabs it and yanks him there. Collect the emoji stickers on
the way, reach the goal, then stick them into the sticker album.

The rules, numbers and levels follow `pin-hopper-game-spec.md`. The environment is whitebox on purpose;
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
  (from the last completed goal on multi-goal pages).
- Idle for a few seconds and a hand shows the next move.
- At the goal the album page slides in: drag each sticker into its matching slot (or tap a sticker, then its slot).

Desk keys: `Up`/`Space` jump (hold `Left`/`Right` to lean), `1`–`9` tap pins in list order, `R` restart,
`Esc` settings.

## Tune it

The ⚙ button opens settings: jump to any page, sound, skip to the album, reset progress, and sliders for the
main numbers. Changes apply at once and persist in `localStorage`; **Copy changes** copies only the edited
values. Defaults live in `src/tune.js`. `shake` and `hitstop` scale the juice.

## Check the levels

```bash
node tools/check.mjs              # all levels, 20,000 random players each
node tools/check.mjs --level 3 --runs 2000
```

It plays each level's solution, checks the camera framing before every step, and runs random players to gauge
difficulty. Run it after any change to `src/levels.js`, `src/sim.js` or the tunables.

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
| `src/levels.js` | Level data, plus each level's album page: title and the emoji for each item kind. |
| `src/tune.js` | Every number. |
| `src/game.js` | Loop, input, camera, drawing, help hand, win/lose flow. |
| `src/blob.js` | Hopper: jelly body, eyes, moods, mouth, tongue. |
| `src/album.js` | The sticker album page and its drag-and-drop. |
| `src/fx.js` | Easing, tweens, springs, particles, screen shake. |
| `src/audio.js` | Synthesised sound effects (Web Audio). |
| `src/sprites.js` | Cached emoji sprites: plain, die-cut sticker, ghost silhouette. |
| `src/ui.js` | Title, buttons, settings panel. |

## Test hooks

In the browser console:

- `HOP.pause()` / `HOP.pause(false)` stop or resume real time; `HOP.step(2)` advances 2 s in fixed steps and redraws.
- `HOP.tap('a1')`, `HOP.swipe(0)` act like the player.
- `HOP.go(2)` starts page 3 (skipping the opening). `HOP.skip()` jumps to the album.
- `HOP.place(0)` sticks album item 0 in its slot. `HOP.ch`, `HOP.level`, `HOP.mode` read state.
