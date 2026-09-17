# Skywake

Prototype 1 of a mobile web roguelike: a rickety train of flying ships, crewed by animals,
fighting sea monsters and fishing their cargo out of the water.

The concept doc lives in `docs/skywake-concept.html`.

## Run it

Plain HTML, canvas and vanilla JavaScript. No build step. The game loads its numbers from CSV
files with `fetch`, so it needs a static server rather than a `file://` URL.

Double-click `serve.cmd`, or:

```bash
python -m http.server 8080 --bind 0.0.0.0
```

Then open http://localhost:8080 on the desktop, or http://<your-pc-ip>:8080 on a phone on the same Wi-Fi.

## Tune it

Everything about difficulty and economy is in `data/`. Edit a value, reload the page.

| File | One row is | Notes |
| --- | --- | --- |
| `settings.csv` | a global knob | starting scrap, loot cadence, tap radius, rescue HP share, sell and re-roll prices, thief reach, charge wind-up |
| `legs.csv` | a leg | name, dock forecast, enemy HP and damage multipliers, loot multiplier, boss flag |
| `enemies.csv` | an enemy type | lane, behavior (hold / thief / charger), HP, armor, damage, fire rate, stay time, rows or columns it may hit, cargo |
| `waves.csv` | one spawn event | leg, second, enemy, count, spacing. Tune legs here only |
| `cars.csv` | a car tier | tier and upgrade_to, facings, HP, cost, damage, fire rate, auto or tap, net reach, reel time, what it lifts |
| `loot.csv` | a flotsam type | value, drift speed, spawn weight, whether a tier-1 net can lift it |

Lines starting with `#` are comments. `yes`/`no` become booleans, numbers become numbers, `a|b` lists are split by the game.

## How it plays

- The ship is a 3×3 grid. The center cell is the engine. If it dies, the run ends. It never repairs.
- Front enemies hit the leftmost car of one of their `target_rows`. Sky enemies hit the topmost car of one of their `target_cols`. Losing a car exposes the one behind it.
- Enemy `armor` comes off every hit, floor 1. Heavy tap weapons crack armored enemies; auto turrets only chip.
- Thieves dive for floating loot and fly off with it. Kill them before they leave and they drop it.
- Chargers wind up, then ram the front car of one of their rows. Deal `charge_break` damage during the wind-up to interrupt them.
- Tap an enemy to fire every manual weapon that can face it. Auto weapons fire on their own.
- Killed enemies drop cargo into the water. It drifts right under the ship. Tap it to grab it, or let a net catch it. Nets are busy for `reel_s` after each catch and tier-1 nets cannot lift crates.
- A destroyed car falls into the same lane. Grab it or net it to get it back, damaged. Miss it and it is gone.
- Each leg ends with a summary, then a dock: cars repair (except the engine), three tier-1 cars are offered, and a placed car can be upgraded to its next tier, moved or sold. Re-rolling the offers costs scrap. The dock shows a forecast of the next leg.

## Feel

- Sounds are synthesised in `src/audio.js` with WebAudio, no asset files. The speaker icon in the top-right mutes them and remembers the choice.
- Android phones vibrate on hits, overboard and rescue. iPhones ignore it.
- Enemies show a red line to the car they are about to hit. Rams show a wind-up bar. Thieves show a dotted line to the loot they are diving for.
- Add the page to the home screen for a fullscreen, portrait-locked app. The game pauses when you switch apps.

## Balance harness

The simulation has no DOM in it, so it runs in Node. The harness plays hundreds of scripted runs
against the current tables and prints survival per leg, scrap and engine HP at each dock, and loot
caught, missed and stolen:

```bash
node tools/sim.mjs --runs 200 --policy greedy --grab 0.6 --seed 1
```

Policies: `greedy` taps every enemy, hand-grabs heavy loot with probability `--grab` per second, and
buys and upgrades sensibly at the dock. `passive` never buys. `noshoot` never taps, which shows what the
ship does on its own. Edit a CSV, run it again, compare.

A scripted player taps perfectly, so treat its survival as an upper bound. If it dies on a leg, a human will.

## Tests

```bash
node --test tools/test.mjs
```

Covers the CSV reader, table validation, and the rules that must never break: a leg cannot stall,
engine death ends the run, a fallen car can be rescued into its old cell, upgrades keep the cell and
charge the next tier, thieves drop loot when killed, an interrupted ram does no damage, and the same
seed replays the same run.

## Code map

| File | Role |
| --- | --- |
| `src/sim.js` | the whole game as rules and state, no DOM. Emits events for sounds, vibration and overlays |
| `src/render.js` | canvas drawing. Emoji are rasterised once per size, gradients cached, pixel ratio capped at 2 |
| `src/ui.js` | HTML overlays: summary, dock panel, pause, end |
| `src/audio.js` | synthesised sounds, mute, vibration |
| `src/main.js` | boot, fixed 60 Hz timestep, input, event dispatch, the `SKY` console hook |
| `src/layout.js` | screen geometry shared by sim and renderer |
| `src/csv.js`, `src/rng.js` | CSV reader and the seedable random generator |

## Console hooks

Open the browser console:

- `SKY.step(10)` advances the game ten seconds in fixed ticks and redraws.
- `SKY.tap(x, y)` taps at a point in the 360×640 logical space.
- `SKY.jump(4)` starts leg 4 with the current ship. `SKY.give('turret2', 0, 0)` places a car at column 0, row 0.
- `SKY.fps()` is the frame rate over the last two seconds. `SKY.seed` is the run seed; add `?seed=42` to the URL to replay one.
- `SKY.G` is the run state, `SKY.DATA` the loaded tables.
