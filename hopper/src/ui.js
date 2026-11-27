// DOM overlays: title, top-right buttons, Next, the album menu, settings (also the debug menu).
import { T, DEFAULTS, SLIDERS, setTune, resetTune, changed } from './tune.js';
import { soundOn, setSound, sfx, unlock } from './audio.js';

const $ = (id) => document.getElementById(id);

export function initUI(api) {
  // api: { levels: [{ id, num, title, world, stickers: [emoji], goals }], worlds: [{ title, icon }], done(i), unlocked(i),
  //   next(), onPlay(), onRestart(), onNext(), onLevel(i), onSkip(), onResetProgress(), paused(v),
  //   onMenu(open), showPage(level, goal), hidePage() }
  const title = $('title'), settings = $('settings'), next = $('btn-next'), buttons = $('hud-buttons'), menu = $('menu');

  // ---------- album menu: worlds of pages; tap a page to look at it, then play it ----------
  const pages = api.levels.flatMap((l, li) => Array.from({ length: l.goals }, (_, gi) => ({ li, gi })));
  let pageAt = -1;

  function openMenu() {
    if (!menu.hidden) return;
    menu.hidden = false;
    api.onMenu(true);
    showGrid(api.next());
  }

  // toPlay: leaving to play a level, so don't bring back what was under the menu
  function closeMenu(toPlay = false) {
    if (menu.hidden) return;
    api.hidePage();
    menu.hidden = true;
    menu.classList.remove('viewing');
    pageAt = -1;
    api.onMenu(false, toPlay);
  }

  function showGrid(focus) {
    pageAt = -1;
    api.hidePage();
    menu.classList.remove('viewing');
    menu.innerHTML = '';
    const card = el('div', 'album-card');
    const head = el('div', 'row head');
    head.append(el('h2', '', '📒 Sticker Album'));
    const x = el('button', 'icon', '✕');
    x.onclick = () => (sfx.click(), closeMenu());
    head.append(x);
    card.append(head);
    let focusEl = null;
    api.worlds.forEach((w, wi) => {
      const sec = el('section', 'world');
      const ids = api.levels.map((l, i) => i).filter((i) => api.levels[i].world === wi);
      const n = ids.filter((i) => api.done(i)).length;
      sec.append(el('h3', '', `${w.icon} ${w.title} <small>${n} / ${ids.length}</small>`));
      const grid = el('div', 'pages');
      for (const i of ids) {
        const L = api.levels[i], done = api.done(i), open = api.unlocked(i);
        const t = el('button', 'page-tile' + (done ? ' done' : '') + (!open ? ' locked' : '') + (i === focus && !done ? ' next' : ''));
        const stk = L.stickers.map((e) => (done ? e : `<i>${e}</i>`)).join('');
        t.innerHTML = `<b>${L.num}</b><span class="stk">${open ? stk : '🔒'}</span><small>${L.title}</small>`;
        t.onclick = () => (sfx.click(), showPage(pages.findIndex((p) => p.li === i)));
        grid.append(t);
        if (i === focus) focusEl = t;
      }
      sec.append(grid);
      card.append(sec);
    });
    menu.append(card);
    if (focusEl) setTimeout(() => focusEl.scrollIntoView({ block: 'center' }), 0);
  }

  function showPage(k) {
    pageAt = k;
    const { li, gi } = pages[k];
    const L = api.levels[li];
    api.showPage(li, gi);
    menu.classList.add('viewing');
    menu.innerHTML = '';
    const pv = el('div', 'page-view');
    const back = el('button', '', '✕');
    back.title = 'Back to the album';
    back.onclick = () => (sfx.click(), showGrid(li));
    const nav = el('div', 'nav');
    const prev = el('button', '', '◀');
    const nxt = el('button', '', '▶');
    prev.disabled = k === 0;
    nxt.disabled = k === pages.length - 1;
    prev.onclick = () => k > 0 && (sfx.page(), showPage(k - 1));
    nxt.onclick = () => k < pages.length - 1 && (sfx.page(), showPage(k + 1));
    nav.append(prev, nxt);
    const count = el('div', 'count', `${L.num}${L.goals > 1 ? ` · ${gi + 1}/${L.goals}` : ''}`);
    const play = el('button', 'play', api.unlocked(li) ? 'Play ▸' : '🔒');
    play.disabled = !api.unlocked(li);
    play.onclick = () => {
      if (!api.unlocked(li)) return;
      unlock();
      sfx.click();
      closeMenu(true);
      api.onLevel(li);
    };
    pv.append(back, count, nav, play);
    menu.append(pv);
  }

  menu.addEventListener('pointerdown', (e) => {
    if (e.target === menu && pageAt < 0) closeMenu();
  });

  $('btn-album').addEventListener('click', () => {
    unlock();
    sfx.click();
    title.classList.add('leaving');
    setTimeout(() => (title.hidden = true), 380);
    openMenu();
  });

  $('btn-play').addEventListener('click', () => {
    unlock();
    sfx.click();
    title.classList.add('leaving');
    setTimeout(() => (title.hidden = true), 380);
    api.onPlay();
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
      const b = el('button', 'lv' + (api.done(i) ? ' done' : ''), `${L.num}<small>${L.title}</small>`);
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
    book.onclick = () => (sfx.click(), closeSettings(), openMenu());
    const skip = el('button', '', '⏭ Skip to the album');
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
    settingsOpen: () => !settings.hidden,
    menuOpen: () => !menu.hidden,
    openMenu,
    // Escape / arrows in the menu
    menuKey(k) {
      if (pageAt >= 0) {
        if (k === 'Escape') showGrid(pages[pageAt].li);
        else if (k === 'ArrowLeft' && pageAt > 0) showPage(pageAt - 1);
        else if (k === 'ArrowRight' && pageAt < pages.length - 1) showPage(pageAt + 1);
      } else if (k === 'Escape') closeMenu();
    },
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
