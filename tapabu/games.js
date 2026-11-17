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
    tagline: 'Touch a sleepy face to light it up and make it sing.',
    media: [{ kind: 'tile', icon: 'media/lightup-icon.png', bg: '#c9d3ff', alt: 'Light-Up' }],
    goals: [
      { title: 'Cause and effect', text: 'every touch gets an answer.' },
      { title: 'Pre-writing', text: 'from taps to careful traces.' },
      { title: 'Hand–eye coordination', text: 'touch here, light here.' },
      { title: 'Feelings', text: 'faces to read and name.' },
      { title: 'Instruments', text: 'meet a new one every level.' },
      { title: 'Calm focus', text: 'no score, no fail.' },
    ],
  },
  {
    id: 'papepi',
    name: 'Papepi',
    age: '2-5',
    url: 'facepaint/',
    tagline: 'Paint little odd creatures and build up your garden.',
    media: [{ kind: 'tile', icon: 'media/papepi-icon.png', bg: '#ffd6e6', alt: 'Papepi' }],
    goals: [
      { title: 'First words', text: 'creatures chat in simple syllables to copy.' },
      { title: 'Creativity', text: 'every face is their own.' },
      { title: 'Colours', text: 'a new palette to name each visit.' },
      { title: 'Fine motor', text: 'brush, roller and cloth.' },
      { title: 'Curiosity', text: 'every visit hides something new.' },
      { title: 'Music', text: 'every stroke plays a note.' },
    ],
  },
];
