import { GAMES, AGES } from './games.js';

const gallery = document.getElementById('gallery');
const template = document.getElementById('panel-template');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

let openId = null;
let panel = null;

// ---------- Hero faces: a new random Papepi face on every circle, every visit ----------

function shuffled(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const HAPPY_MOUTHS = ['vee', 'bowl', 'tick']; // smile, grin, little heart-shaped smile

async function randomFaces() {
  const blobs = document.querySelector('.blobs');
  try {
    const { EYES, MOUTHS, EYE_GAP } = await import('./face-parts.js');
    const eyes = shuffled(EYES);
    const mouths = shuffled(MOUTHS.filter((m) => HAPPY_MOUTHS.includes(m.name)));
    blobs.querySelectorAll('.blob').forEach((blob, i) => {
      const e = eyes[i % eyes.length];
      const m = mouths[i % mouths.length];
      // Any eyes go with any mouth: a wide mouth shrinks when big eyes would touch its ends (as in the game).
      const s = m.wide ? Math.min(1, (1 - e.w - EYE_GAP - Math.abs(m.cx)) / m.w) : 1;
      const mouth = s < 1
        ? `<path d="${m.d}" transform="translate(${m.cx} ${m.cy}) scale(${s.toFixed(3)}) translate(${-m.cx} ${-m.cy})" stroke-width="${(0.09 / s).toFixed(3)}"/>`
        : `<path d="${m.d}"/>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -0.75 3 1.5"><g fill="#2b2340" fill-rule="evenodd" stroke="#2b2340" stroke-width="0.09" stroke-linejoin="round"><path d="${e.d}"/>${mouth}</g></svg>`;
      blob.style.setProperty('--face', `url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    });
  } catch {
    // keep the fixed faces from the stylesheet
  }
  blobs.classList.add('ready');
}

// ---------- Rendering ----------

function mediaFrame(item) {
  const frame = document.createElement('div');
  frame.className = 'media-frame';
  if (item.kind === 'tile') {
    frame.style.setProperty('--tile', item.bg);
    const img = new Image();
    img.className = 'tile-icon';
    img.src = item.icon;
    img.alt = item.alt || '';
    img.decoding = 'async';
    frame.append(img);
  } else if (item.kind === 'image') {
    const img = new Image();
    img.src = item.src;
    img.alt = item.alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    frame.append(img);
  } else if (item.kind === 'video') {
    const video = document.createElement('video');
    Object.assign(video, { autoplay: true, muted: true, loop: true, playsInline: true });
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'metadata');
    if (item.poster) video.poster = item.poster;
    for (const [src, type] of [[item.webm, 'video/webm'], [item.mp4, 'video/mp4']]) {
      if (!src) continue;
      const source = document.createElement('source');
      source.src = src;
      source.type = type;
      video.append(source);
    }
    frame.append(video);
  }
  return frame;
}

function ageTag(el, key) {
  const age = AGES[key];
  el.className = `age-tag ${age.className}`;
  el.textContent = age.label;
  return el;
}

function renderCards() {
  for (const game of GAMES) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.dataset.id = game.id;
    card.setAttribute('aria-expanded', 'false');
    card.setAttribute('aria-controls', `panel-${game.id}`);

    const name = document.createElement('span');
    name.className = 'card-name';
    name.textContent = game.name;

    card.append(ageTag(document.createElement('span'), game.age), mediaFrame(game.media[0]), name);
    card.addEventListener('click', () => toggle(game.id));
    gallery.append(card);
  }
}

function buildPanel(game) {
  const el = template.content.firstElementChild.cloneNode(true);
  el.id = `panel-${game.id}`;
  el.setAttribute('aria-label', game.name);

  const main = el.querySelector('.panel-main');
  const thumbs = el.querySelector('.panel-thumbs');
  const show = (i) => {
    main.replaceChildren(mediaFrame(game.media[i]));
    thumbs.querySelectorAll('.thumb').forEach((t, j) => t.setAttribute('aria-current', String(i === j)));
  };
  if (game.media.length > 1) {
    game.media.forEach((item, i) => {
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'thumb';
      t.setAttribute('aria-label', `Show picture ${i + 1}`);
      t.append(mediaFrame(item));
      t.addEventListener('click', () => show(i));
      thumbs.append(t);
    });
  }
  show(0);

  ageTag(el.querySelector('.age-tag'), game.age);
  el.querySelector('.panel-title').textContent = game.name;
  el.querySelector('.panel-tagline').textContent = game.tagline;
  el.querySelector('.goals').append(
    ...game.goals.map((g) => {
      const li = document.createElement('li');
      const body = document.createElement('div');
      const strong = document.createElement('strong');
      strong.textContent = g.title;
      body.append(strong, ` — ${g.text}`);
      li.append(body);
      return li;
    })
  );
  const play = el.querySelector('.play-button');
  play.href = game.url;
  play.textContent = `Play ${game.name}`;

  el.querySelector('.panel-close').addEventListener('click', () => close(true));
  return el;
}

// ---------- Placement: the panel goes right after the clicked card's row ----------

function columns() {
  return getComputedStyle(gallery).gridTemplateColumns.split(' ').filter(Boolean).length || 1;
}

function place(el, id) {
  const cards = [...gallery.querySelectorAll('.card')];
  const index = cards.findIndex((c) => c.dataset.id === id);
  const cols = columns();
  const rowEnd = Math.min(cards.length - 1, Math.floor(index / cols) * cols + cols - 1);
  cards[rowEnd].after(el);
}

// ---------- Open / close ----------

function setExpanded(id) {
  gallery.querySelectorAll('.card').forEach((c) => c.setAttribute('aria-expanded', String(c.dataset.id === id)));
}

function collapse(el) {
  el.classList.remove('open');
  const done = () => el.remove();
  if (reduceMotion.matches) done();
  else {
    el.addEventListener('transitionend', (e) => e.target === el && done(), { once: false });
    setTimeout(done, 600);
  }
}

function open(id, { scroll = true } = {}) {
  const game = GAMES.find((g) => g.id === id);
  if (!game) return;
  if (panel) collapse(panel);

  openId = id;
  panel = buildPanel(game);
  place(panel, id);
  setExpanded(id);
  history.replaceState(null, '', `#${id}`);

  panel.getBoundingClientRect(); // start the transition from the closed state
  panel.classList.add('open');

  const el = panel;
  if (scroll) {
    setTimeout(() => {
      if (panel !== el) return;
      el.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      el.querySelector('.panel-title').focus({ preventScroll: true });
    }, reduceMotion.matches ? 30 : 480); // after the panel has grown, so the page is tall enough
  }
}

function close(returnFocus = false) {
  if (!panel) return;
  const id = openId;
  collapse(panel);
  panel = null;
  openId = null;
  setExpanded(null);
  history.replaceState(null, '', location.pathname + location.search);
  if (returnFocus) gallery.querySelector(`.card[data-id="${id}"]`)?.focus({ preventScroll: true });
}

function toggle(id) {
  if (openId === id) close();
  else open(id);
}

// ---------- Wiring ----------

randomFaces();
renderCards();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && panel) close(true);
});

// Keep the panel under the right row when the column count changes.
let lastCols = columns();
addEventListener('resize', () => {
  const cols = columns();
  if (cols !== lastCols && panel) place(panel, openId);
  lastCols = cols;
});

function fromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (GAMES.some((g) => g.id === id)) {
    if (openId !== id) open(id);
  }
}
addEventListener('hashchange', fromHash);
fromHash();
