// Tapabú games. Adding a game = adding an entry here.
//
// media: the first item is the gallery cover; the rest show as thumbnails in
// the detail panel. Kinds:
//   { kind: 'tile',  icon: 'media/x.png', bg: '#hex' }        placeholder: icon on a colour
//   { kind: 'image', src: 'media/x.gif', alt: '...' }          png / jpg / gif
//   { kind: 'video', webm: 'media/x.webm', mp4: 'media/x.mp4', poster: 'media/x.jpg' }
//
// age: a key of AGES (colour-coded tag).

export const AGES = {
  '1-3': { label: 'Ages 1–3', className: 'age-sun' },
  '2-5': { label: 'Ages 2–5', className: 'age-mint' },
  '5-7': { label: 'Ages 5–7', className: 'age-lilac' },
};

export const GAMES = [
  {
    id: 'light-up',
    name: 'Light-Up',
    age: '1-3',
    url: 'lightup/',
    tagline: 'Wake up a sky full of sleepy faces. Every touch lights one up and makes it sing.',
    media: [{ kind: 'tile', icon: 'media/lightup-icon.png', bg: '#c9d3ff', alt: 'Light-Up' }],
    goals: [
      { title: 'Cause and effect', text: 'Every touch answers with light, a face and a note.' },
      { title: 'Pre-writing tracing', text: 'Levels move from tapping big bulbs to dragging careful trails across many small ones.' },
      { title: 'Hand–eye coordination', text: 'Where you touch is exactly what lights up, on a screen or a keyboard.' },
      { title: 'Reading faces', text: 'Seven characters with clear expressions to name together.' },
      { title: 'Listening to pitch', text: 'Higher on the screen sounds higher, and every level brings a new instrument.' },
      { title: 'Calm focus', text: 'A dark, gentle night with no score, no timer and no way to fail.' },
    ],
  },
  {
    id: 'face-paint',
    name: 'Face Paint',
    age: '2-5',
    url: 'facepaint/',
    tagline: 'Little creatures wander by. Pick one, paint its face and send it back to show off.',
    media: [{ kind: 'tile', icon: 'media/facepaint-icon.png', bg: '#ffd6e6', alt: 'Face Paint' }],
    goals: [
      { title: 'Creative expression', text: 'No wrong answer: every face they paint is their own.' },
      { title: 'Colours', text: 'A fresh palette each visit to explore and name together.' },
      { title: 'Fine motor and tool use', text: 'Brush, roller and cloth each need a different gesture.' },
      { title: 'Patterns', text: 'The roller stamps repeating patterns to spot and describe.' },
      { title: 'Music through movement', text: 'Every stroke plays a note that always fits.' },
      { title: 'Care and patience', text: 'Creatures react to their new look, and a garden grows over many visits.' },
    ],
  },
];
