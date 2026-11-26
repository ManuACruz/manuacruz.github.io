// DOM overlays: title, top-right buttons, Next, settings (also the debug menu).
import { T, DEFAULTS, SLIDERS, setTune, resetTune, changed } from './tune.js';
import { soundOn, setSound, sfx, unlock } from './audio.js';

const $ = (id) => document.getElementById(id);

export function initUI(api) {
  // api: { levels: [{name, title}], progress(), onPlay(), onRestart(), onNext(), onLevel(i), onSkip(), onAlbum(), onResetProgress(), paused(v) }
  const title = $('title'), settings = $('settings'), next = $('btn-next'), buttons = $('hud-buttons');

  $('btn-play').addEventListener('click', () => {
    unlock();
    sfx.click();
    title.classList.add('leaving');
    setTimeout(() => (title.hidden = true), 380);
    api.onPlay();
  });
  $('btn-album').addEventListener('click', () => {
    unlock();
    sfx.click();
    title.classList.add('leaving');
    setTimeout(() => (title.hidden = true), 380);
    api.onAlbum();
  });
  $('btn-restart').addEventListener('click', (e) => {
    e.stopPropagation();
    unlock();
    api.onRestart();
  });
  $('btn-settings').addEventListener('click', (e) => {
    e.stopPropagation();
    unlock();
    sfx.click();
    openSettings();
  });
  next.addEventListener('click', () => {
    unlock();
    sfx.click();
    next.hidden = true;
    api.onNext();
  });

  function openSettings() {
    build();
    settings.hidden = false;
    api.paused(true);
  }

  function closeSettings() {
    settings.hidden = true;
    api.paused(false);
  }

  function build() {
    const prog = api.progress();
    settings.innerHTML = '';
    const card = el('div', 'card');
    settings.append(card);
    const head = el('div', 'row head');
    head.append(el('h2', '', 'Settings'));
    const x = el('button', 'icon', '✕');
    x.onclick = () => (sfx.click(), closeSettings());
    head.append(x);
    card.append(head);

    card.append(el('h3', '', 'Levels'));
    const lv = el('div', 'levels');
    api.levels.forEach((L, i) => {
      const b = el('button', 'lv' + (i < prog ? ' done' : ''), `${i + 1}<small>${L.title}</small>`);
      b.onclick = () => (sfx.click(), closeSettings(), api.onLevel(i));
      lv.append(b);
    });
    card.append(lv);

    const row = el('div', 'row wrap');
    const snd = el('button', '', soundOn() ? '🔊 Sound on' : '🔈 Sound off');
    snd.onclick = () => {
      setSound(!soundOn());
      snd.innerHTML = soundOn() ? '🔊 Sound on' : '🔈 Sound off';
      sfx.click();
    };
    const book = el('button', '', '📒 Sticker album');
    book.onclick = () => (sfx.click(), closeSettings(), api.onAlbum());
    const skip = el('button', '', '⏭ Skip to the end');
    skip.onclick = () => (closeSettings(), api.onSkip());
    const rp = el('button', '', '↺ Reset progress');
    rp.onclick = () => {
      api.onResetProgress();
      build();
    };
    row.append(snd, book, skip, rp);
    card.append(row);

    card.append(el('h3', '', 'Tuning'));
    const list = el('div', 'sliders');
    for (const [k, min, max, step] of SLIDERS) {
      const r = el('label', 'slider' + (T[k] !== DEFAULTS[k] ? ' changed' : ''));
      const name = el('span', 'k', k);
      const val = el('span', 'v', fmt(T[k]));
      const inp = document.createElement('input');
      inp.type = 'range';
      inp.min = min;
      inp.max = max;
      inp.step = step;
      inp.value = T[k];
      inp.oninput = () => {
        setTune(k, Number(inp.value));
        val.textContent = fmt(T[k]);
        r.classList.toggle('changed', T[k] !== DEFAULTS[k]);
      };
      r.append(name, inp, val);
      list.append(r);
    }
    card.append(list);
    const row2 = el('div', 'row wrap');
    const copy = el('button', '', '📋 Copy changes');
    copy.onclick = async () => {
      const txt = JSON.stringify(changed(), null, 2);
      try {
        await navigator.clipboard.writeText(txt);
        copy.textContent = '✓ Copied';
      } catch {
        prompt('Changed values', txt);
      }
      setTimeout(() => (copy.textContent = '📋 Copy changes'), 1200);
    };
    const rt = el('button', '', 'Defaults');
    rt.onclick = () => (resetTune(), build());
    row2.append(copy, rt);
    card.append(row2);
  }

  settings.addEventListener('pointerdown', (e) => {
    if (e.target === settings) closeSettings();
  });

  return {
    showButtons(v) {
      buttons.classList.toggle('show', v);
    },
    showNext(v, label = 'Next') {
      next.innerHTML = `${label} <span>▸</span>`;
      next.hidden = !v;
    },
    showTitle() {
      title.hidden = false;
      title.classList.remove('leaving');
    },
    setAlbumBadge(n) {
      const b = document.querySelector('#btn-album .badge');
      b.hidden = !n;
      b.textContent = n;
    },
    settingsOpen: () => !settings.hidden,
    toggleSettings: () => (settings.hidden ? openSettings() : closeSettings()),
  };
}

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

function fmt(v) {
  return Math.abs(v) >= 100 ? String(Math.round(v)) : String(Math.round(v * 100) / 100);
}
