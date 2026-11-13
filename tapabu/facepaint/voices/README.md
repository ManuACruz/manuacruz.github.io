# Creature voices

Every creature speaks one syllable in two tones: plain ("ma") and stressed
("má"). It always says two or three of them together ("ma-má", "má-ma-ma")
and walks to a quiet "ma-má-ma-má".

The files here are generated. Do not edit them by hand: put recordings in
`voices-raw/` (next to `src/`) and run `npm run gen:voices`.

## Recording

One long recording is the easy way. Say each syllable on its own with a
pause of about a second in between, plain first, then stressed:

    ma ... má ... pa ... pá ... ka ... ká ...

- Short and cheerful, like talking to a baby. A quarter of a second each.
- Close to the microphone, quiet room, same distance throughout.
- Stressed = a bit higher and a bit louder, not shouted.
- A bad take is fine: just say it again and mark the bad one with `-`.

Save it as `voices-raw/<any name>.m4a` (wav, mp3, ogg also work) and write
what you said, in order, in `voices-raw/<same name>.txt`:

    ma má pa pá - ka ká

Single takes work too: `ma-lo.m4a`, `ma-hi.m4a`, `pa-lo-2.wav` ...

The game's syllables are mi pa ma ka te pi bi da la bo ku ne, but any
syllable can be recorded. Creatures whose own syllable has no recording
borrow a recorded one, so three or four syllables are already enough for
every creature to have a real voice. A syllable recorded in only one tone
gets the other by a small pitch shift. With no recordings the game falls
back to a synthetic stand-in.

## What the script does

Finds each take, cuts it out, removes rumble and hiss, repairs clipped
peaks, equalises for a cheap microphone, compresses gently, fades the ends
and brings every clip to the same loudness (22 kHz mono WAV). It also writes
a numbered preview of every take to `voices-raw/_preview/`, which is what to
listen to when writing the text file. The equaliser settings are the
`MIC_EQ` block at the top of `scripts/gen-voices.mjs`.
