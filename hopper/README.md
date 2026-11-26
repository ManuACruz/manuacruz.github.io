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
  (from the last mailbox on multi-goal levels).
- Idle for a few seconds and a hand shows the next move.
- On multi-goal levels the earlier goals are **mailboxes**: post the stickers, the flag goes up, that's your checkpoint.
- At the last goal the **sticker album** slides in, opens and flips to the level's world spread. Peel the stickers
  off the backing sheet and stick each on its outline (drag, or tap the sticker then its outline). **Later** keeps
  them in the pocket for the album screen.
- Fill a spread and it comes alive: the stickers animate, a stamp lands, and Hopper wins a hat.
- **📒 Album** on the title (or in settings) opens the album screen: flip pages, stick in pocket stickers, tap
  stickers to make them wiggle, tap a hat to wear it.

Desk keys: `Up`/`Space` jump (hold `Left`/`Right` to lean), `1`–`9` tap pins in list order, `R` restart,
`Esc` settings.

## Tune it

The ⚙ button opens settings: jump to any level, sound, the album, skip to the end, reset progress, and sliders for the
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
| `src/levels.js` | Level data: id, world (its album spread), title, the emoji for each item kind. |
| `src/stickers.js` | The album's spreads (where each sticker goes, how it moves, the hat) and saved progress. No DOM. |
| `src/tune.js` | Every number. |
| `src/game.js` | Loop, input, camera, drawing, help hand, win/lose flow. |
| `src/blob.js` | Hopper: jelly body, eyes, moods, mouth, tongue. |
| `src/album.js` | The album book: cover, page curl, spreads and scenes, backing sheet, peel and stick, rewards. |
| `src/fx.js` | Easing, tweens, springs, particles, screen shake. |
| `src/audio.js` | Synthesised sound effects (Web Audio). |
| `src/sprites.js` | Cached emoji sprites: plain, die-cut sticker, ghost, outline, gloss. |
| `src/ui.js` | Title, buttons, settings panel. |

## Test hooks

In the browser console:

- `HOP.pause()` / `HOP.pause(false)` stop or resume real time; `HOP.step(2)` advances 2 s in fixed steps and redraws.
- `HOP.tap('a1')`, `HOP.swipe(0)` act like the player.
- `HOP.go(2)` starts level 3 (skipping the opening). `HOP.skip()` jumps to the end of the level.
- `HOP.place()` sticks the next sheet sticker in; `HOP.closeAlbum()` closes the book (Later / continue);
  `HOP.album()` opens the album screen; `HOP.book` is the open album. `HOP.ch`, `HOP.level`, `HOP.mode` read state.
- Album progress lives in `localStorage` `hopper.album`; remove it to start the album fresh.
