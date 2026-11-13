# Recorded creature voices

Drop recordings in this folder and run `npm run gen:voices` to rebuild
`index.json`. The game uses recordings for any syllable that has them and
falls back to the built-in synth for the rest.

## Naming

```
<syllable>-<n>.<ext>      talk variation n (1, 2, 3, ...), any count from 1 up
<syllable>-step.<ext>     footstep clip (optional; derived from a talk clip if missing)
```

Examples: `ka-1.wav`, `ka-2.wav`, `ka-6.wav`, `ka-step.wav`, `mi-1.m4a`.

Syllables currently used by the creatures: `mi pa ma ka te pi bi da la bo ku ne`.
Other syllables are fine too, but a creature only ever speaks one of the
twelve above, so those are the ones worth recording.

## Recording tips

- Any format the browser can decode: wav, mp3, m4a, ogg. A phone is fine.
- One syllable per file, 0.25 to 0.6 s. Trim silence to about 20 ms each side.
- Normalise the peak to around -1 dB. Mono preferred.
- Aim for six or more talk variations per syllable with different intonation:
  flat, rising, falling, question, excited, low.
- The game still shifts pitch a little per creature (about -10% to +15%), so
  record at a natural pitch.
