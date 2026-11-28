// Chimpún: six wooden figures, four mats, one song. The same game runs every theme; a page
// loads this file and one theme from js/themes/ and calls boot(theme).
//
// A figure on a mat plays its instrument, and the mat decides how. Everything on the mats
// plays in time. When the last figure leaves the mats the song ends and the audience claps.
// Figures can be dragged; a short tap also makes one hop to the next place (a mat, then the
// next mat, and after all four back to the shelf), so small hands that cannot drag yet can play.

import { createEngine } from './engine.js?v=2';

const MIN_SONG_MS = 1500; // a song shorter than this ends without applause

export function boot(theme) {
  const app = document.getElementById('app');
  const board = document.getElementById('board');
  const layer = document.getElementById('pieces');
  const fx = document.getElementById('fx');
  const startEl = document.getElementById('start');
  const probe = document.getElementById('safe');
  const g2 = fx.getContext('2d');

  const look = theme.look || {};
  const party = theme.celebrate;
  const GLOW = look.glow ?? 0.3;
  const BPM = theme.song.bpm;

  // Colours the theme changes; anything it leaves out keeps the wooden default from style.css.
  const CSS_VARS = { table: '--table', trayA: '--tray-a', trayB: '--tray-b', trayEdge: '--tray-edge', slot: '--slot', veil: '--veil', play: '--play', playDeep: '--play-d' };
  for (const [k, v] of Object.entries(CSS_VARS)) if (look[k]) app.style.setProperty(v, look[k]);
  if (look.page) document.documentElement.style.background = document.body.style.background = look.page;

  let W = 0, H = 0, size = 90, pad = 10, dpr = 1;
  let stage = null;
  let engine = null, started = false;
  let songActive = false, songStart = 0, cheerUntil = 0;
  let zTop = 10, lastIdle = 0, idleTurn = 0, dirty = false;
  const heldBy = new Map(); // pointer id -> figure
  const queue = [];         // notes waiting for their moment, to move the figure that plays them
  const parts = [];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const el = (cls, parent) => { const d = document.createElement('div'); d.className = cls; parent.appendChild(d); return d; };

  const zones = theme.mats.map((z) => {
    const node = el('zone', board);
    node.style.setProperty('--c', z.color);
    node.style.setProperty('--d', z.deep);
    node.innerHTML = `${z.icon}<div class="glow"></div>`;
    return { ...z, el: node, iconEl: node.querySelector('.icon'), glowEl: node.querySelector('.glow'), rect: null, energy: 0, on: false };
  });
  const trayEl = el('tray', board);
  const slots = theme.figures.map(() => el('slot', board));
  const pieces = theme.figures.map((f, i) => {
    const node = el('fig', layer);
    node.innerHTML = f.svg;
    node.style.zIndex = i + 1;
    return {
      id: f.id, i, el: node, home: { x: 0, y: 0 },
      x: 0, y: 0, dx: 0, dy: 0,       // where it should be, where it is drawn
      zone: -1, rel: null, held: null, visited: 0,
      gx: 0, gy: 0, sx: 0, sy: 0, moved: 0, downAt: 0,
      kick: 0, lift: 0, hopT: 0, hopH: 0, hopDur: 0.4, singUntil: 0, singing: false, lastNote: 0,
    };
  });
  const byId = Object.fromEntries(pieces.map((p) => [p.id, p]));

  // ---------- layout ----------
  function layout(first) {
    W = app.clientWidth; H = app.clientHeight;
    const cs = getComputedStyle(probe);
    const sa = { t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0, b: parseFloat(cs.paddingBottom) || 0, l: parseFloat(cs.paddingLeft) || 0 };
    pad = Math.round(Math.max(8, Math.min(W, H) * 0.022));
    const trayH = Math.round(H * (W > H ? 0.3 : 0.32));
    const cols = W / H > 1.45 ? 4 : 2, rows = 4 / cols;
    stage = { x: sa.l + pad, y: sa.t + pad, w: W - sa.l - sa.r - 2 * pad, h: H - trayH - sa.t - 2 * pad, cols, rows };
    const zw = (stage.w - pad * (cols - 1)) / cols, zh = (stage.h - pad * (rows - 1)) / rows;

    const tx = sa.l + pad, tw = W - sa.l - sa.r - 2 * pad;
    const ty = H - trayH + pad * 0.6, th = trayH - sa.b - pad * 1.2;
    let best = null;
    for (const [c, r] of [[6, 1], [3, 2]]) {
      const s = Math.min(tw / c, th / r);
      if (!best || s > best.s) best = { c, r, s };
    }
    size = Math.round(Math.min(best.s * 0.9, Math.min(zw, zh) * 0.66, 210));
    app.style.setProperty('--s', size + 'px');

    zones.forEach((z, i) => {
      const c = i % cols, r = Math.floor(i / cols);
      z.rect = { x: stage.x + c * (zw + pad), y: stage.y + r * (zh + pad), w: zw, h: zh };
      Object.assign(z.el.style, { left: z.rect.x + 'px', top: z.rect.y + 'px', width: zw + 'px', height: zh + 'px' });
      const s = Math.min(zw, zh) * 0.74;
      Object.assign(z.iconEl.style, { width: s + 'px', height: s + 'px', marginLeft: -s / 2 + 'px', marginTop: -s / 2 + 'px' });
    });
    Object.assign(trayEl.style, { left: 0, top: H - trayH + 'px', width: W + 'px', height: trayH + 'px' });

    pieces.forEach((p, i) => {
      const c = i % best.c, r = Math.floor(i / best.c);
      p.home = { x: tx + (c + 0.5) * tw / best.c, y: ty + (r + 0.5) * th / best.r };
      const d = size * 0.96;
      Object.assign(slots[i].style, { left: p.home.x - d / 2 + 'px', top: p.home.y - d / 2 + size * 0.04 + 'px', width: d + 'px', height: d + 'px' });
      if (p.held != null) return;
      if (p.zone < 0) { p.x = p.home.x; p.y = p.home.y; }
      else if (p.rel) {
        const zr = zones[p.zone].rect;
        p.x = zr.x + p.rel.u * zr.w; p.y = zr.y + p.rel.v * zr.h;
        clampIn(p, p.zone);
      }
      if (first) { p.dx = p.x; p.dy = p.y; }
    });

    dpr = Math.min(window.devicePixelRatio || 1, 2);
    fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr);
    g2.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function zoneAt(x, y) {
    if (y > stage.y + stage.h + pad * 0.5) return -1;
    const c = clamp(Math.floor(((x - stage.x) / stage.w) * stage.cols), 0, stage.cols - 1);
    const r = clamp(Math.floor(((y - stage.y) / stage.h) * stage.rows), 0, stage.rows - 1);
    return r * stage.cols + c;
  }
  function clampIn(p, z) {
    const r = zones[z].rect;
    const ix = Math.min(size * 0.45, r.w / 2), iy = Math.min(size * 0.45, r.h / 2);
    p.x = clamp(p.x, r.x + ix, r.x + r.w - ix);
    p.y = clamp(p.y, r.y + iy, r.y + r.h - iy);
  }
  // Nudge a figure off any figure it landed on, so none ends up hidden.
  function settle(p) {
    const min = size * 0.78;
    for (let k = 0; k < 10; k++) {
      let moved = false;
      for (const q of pieces) {
        if (q === p || q.zone !== p.zone || q.held != null) continue;
        let ax = p.x - q.x, ay = p.y - q.y;
        let d = Math.hypot(ax, ay);
        if (d >= min) continue;
        if (d < 1) { const a = Math.random() * Math.PI * 2; ax = Math.cos(a); ay = Math.sin(a); d = 1; }
        p.x += (ax / d) * (min - d + 1);
        p.y += (ay / d) * (min - d + 1);
        moved = true;
      }
      clampIn(p, p.zone);
      if (!moved) break;
    }
  }
  function saveRel(p) {
    const r = zones[p.zone].rect;
    p.rel = { u: (p.x - r.x) / r.w, v: (p.y - r.y) / r.h };
  }
  const panOf = (p) => (p.x / W) * 1.4 - 0.7;

  // ---------- song ----------
  function setZone(p, z) {
    if (p.zone === z) return;
    p.zone = z;
    engine.setVoice(p.id, z, panOf(p));
    if (z >= 0) {
      zones[z].energy = 1;
      if (!songActive) startSong();
    }
  }
  function startSong() {
    songActive = true;
    songStart = performance.now();
    cheerUntil = 0;
    engine.hush();
    engine.start();
  }
  function checkEnd() {
    if (!songActive || heldBy.size || pieces.some((p) => p.zone >= 0)) return;
    songActive = false;
    engine.stop();
    queue.length = 0;
    if (performance.now() - songStart >= MIN_SONG_MS) cheer();
  }
  function cheer() {
    const now = performance.now();
    cheerUntil = now + 4400;
    const at = engine.tada();
    engine.applause(at);
    const star = party.shape === 'star';
    for (let i = 0; i < party.count; i++) {
      parts.push({
        type: star ? 3 : 1, delay: 0.3 + Math.random() * (star ? 2.5 : 1.3),
        x: Math.random() * W, y: -20 - Math.random() * 60,
        vx: (Math.random() - 0.5) * (star ? 30 : 90), vy: H * party.fall * (0.65 + Math.random() * 0.7),
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * (star ? 2 : 12),
        s: size * (star ? 0.1 + Math.random() * 0.1 : 0.1 + Math.random() * 0.08), life: 9, max: 9,
        color: party.colors[i % party.colors.length], ph: Math.random() * 6.28,
      });
    }
    const until = cheerUntil;
    for (let k = 0; k < 6; k++) {
      for (const p of pieces) {
        setTimeout(() => {
          if (cheerUntil !== until || performance.now() > until || p.zone >= 0 || p.held != null) return;
          hop(p, party.hop, 0.42);
          sing(p, 260);
        }, 300 + k * 640 + p.i * 80);
      }
    }
  }

  // ---------- figures ----------
  function hop(p, h, dur) { p.hopT = 1; p.hopH = h; p.hopDur = dur; }
  function sing(p, ms) {
    p.singUntil = performance.now() + ms;
    if (!p.singing) { p.singing = true; p.el.classList.add('sing'); }
  }
  function pick(x, y) {
    let best = null, bd = Infinity;
    for (const p of pieces) {
      if (p.held != null) continue;
      const d = Math.hypot(x - p.dx, y - p.dy);
      if (d < size * 0.85 && d < bd) { best = p; bd = d; }
    }
    return best;
  }
  function emptiest() {
    const n = [0, 0, 0, 0];
    for (const p of pieces) if (p.zone >= 0) n[p.zone]++;
    const m = Math.min(...n);
    const c = n.map((v, i) => (v === m ? i : -1)).filter((i) => i >= 0);
    return c[Math.floor(Math.random() * c.length)];
  }
  function goHome(p) {
    p.x = p.home.x; p.y = p.home.y; p.visited = 0; p.rel = null;
  }
  function tapHop(p) {
    let z;
    if (p.zone < 0) { p.visited = 1; z = emptiest(); }
    else if (p.visited >= 4) z = -1;
    else { p.visited++; z = (p.zone + 1) % 4; }
    if (z < 0) goHome(p);
    else {
      const r = zones[z].rect;
      p.x = r.x + r.w * (0.3 + Math.random() * 0.4);
      p.y = r.y + r.h * (0.3 + Math.random() * 0.4);
    }
    setZone(p, z);
    if (z >= 0) { clampIn(p, z); settle(p); saveRel(p); }
    engine.setPan(p.id, panOf(p));
    hop(p, 0.38, 0.4);
  }
  function drop(p) {
    const z = zoneAt(p.x, p.y);
    setZone(p, z);
    if (z < 0) goHome(p);
    else { clampIn(p, z); settle(p); saveRel(p); }
    engine.setPan(p.id, panOf(p));
  }

  // ---------- touch ----------
  function onDown(e) {
    if (!started) return;
    e.preventDefault();
    engine.resume();
    const x = e.clientX, y = e.clientY;
    const p = pick(x, y);
    if (!p) {
      parts.push({ type: 2, x, y, life: 0.5, max: 0.5, s: size * 0.5, delay: 0 });
      engine.tok(x / W);
      return;
    }
    p.held = e.pointerId;
    heldBy.set(e.pointerId, p);
    p.gx = p.x - x; p.gy = p.y - y; p.sx = x; p.sy = y; p.moved = 0; p.downAt = performance.now();
    p.el.style.zIndex = ++zTop;
    p.kick = 1;
    if (!(songActive && p.zone >= 0)) { engine.hello(p.id); sing(p, 280); }
  }
  function onMove(e) {
    const p = heldBy.get(e.pointerId);
    if (!p) return;
    const x = e.clientX, y = e.clientY;
    p.moved = Math.max(p.moved, Math.hypot(x - p.sx, y - p.sy));
    const m = size * 0.4;
    p.x = clamp(x + p.gx, m, W - m);
    p.y = clamp(y + p.gy, m, H - m);
    if (p.moved > size * 0.18) { p.visited = 0; setZone(p, zoneAt(p.x, p.y)); }
  }
  function onUp(e) {
    const p = heldBy.get(e.pointerId);
    if (!p) return;
    heldBy.delete(e.pointerId);
    p.held = null;
    if (engine) engine.resume();
    const tap = e.type === 'pointerup' && p.moved < size * 0.18 && performance.now() - p.downAt < 350;
    if (tap) tapHop(p); else drop(p);
    checkEnd();
  }
  function releaseAll() {
    for (const [, p] of heldBy) { p.held = null; drop(p); }
    heldBy.clear();
    if (started) checkEnd();
  }

  app.addEventListener('pointerdown', onDown);
  app.addEventListener('pointermove', onMove);
  app.addEventListener('pointerup', onUp);
  app.addEventListener('pointercancel', onUp);
  window.addEventListener('blur', releaseAll);
  for (const type of ['touchstart', 'touchmove']) {
    app.addEventListener(type, (e) => { if (started) e.preventDefault(); }, { passive: false });
  }
  for (const type of ['contextmenu', 'gesturestart', 'dblclick', 'selectstart', 'dragstart']) {
    document.addEventListener(type, (e) => e.preventDefault());
  }

  // ---------- drawing ----------
  function drawNote(s) {
    g2.beginPath();
    g2.ellipse(0, s * 0.3, s * 0.32, s * 0.24, -0.35, 0, Math.PI * 2);
    g2.fill();
    g2.beginPath();
    g2.moveTo(s * 0.27, s * 0.26);
    g2.lineTo(s * 0.27, -s * 0.5);
    g2.quadraticCurveTo(s * 0.5, -s * 0.4, s * 0.62, -s * 0.08);
    g2.stroke();
  }
  function drawStar(s) {
    g2.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? s * 0.45 : s;
      g2.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    g2.closePath();
    g2.fill();
  }
  function drawParts(dt) {
    if (!parts.length) {
      if (dirty) { g2.clearRect(0, 0, W, H); dirty = false; }
      return;
    }
    g2.clearRect(0, 0, W, H);
    dirty = true;
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i];
      if (q.delay > 0) { q.delay -= dt; continue; }
      q.life -= dt;
      if (q.life <= 0 || q.y > H + 40) { parts.splice(i, 1); continue; }
      const k = q.life / q.max;
      if (q.type === 0) {
        q.x += q.vx * dt; q.y += q.vy * dt; q.vy *= 1 - dt * 0.8;
        g2.globalAlpha = Math.min(1, k * 2.2) * 0.95;
        g2.fillStyle = g2.strokeStyle = '#fff';
        g2.lineWidth = q.s * 0.13; g2.lineCap = 'round';
        g2.save(); g2.translate(q.x, q.y); g2.rotate(q.rot); drawNote(q.s); g2.restore();
      } else if (q.type === 1) {
        q.ph += dt * 5;
        q.x += (q.vx + Math.sin(q.ph) * 50) * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
        g2.globalAlpha = Math.min(1, q.life * 1.5);
        g2.fillStyle = q.color;
        g2.save(); g2.translate(q.x, q.y); g2.rotate(q.rot);
        g2.fillRect(-q.s / 2, -q.s * 0.3 * Math.cos(q.ph), q.s, q.s * 0.6 * Math.cos(q.ph));
        g2.restore();
      } else if (q.type === 3) {
        q.ph += dt * 2.5;
        q.x += (q.vx + Math.sin(q.ph) * 14) * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
        g2.globalAlpha = Math.min(1, q.life * 1.5) * (0.65 + 0.35 * Math.sin(q.ph * 2.3));
        g2.fillStyle = q.color;
        g2.save(); g2.translate(q.x, q.y); g2.rotate(q.rot); drawStar(q.s); g2.restore();
      } else {
        g2.globalAlpha = k * 0.7;
        g2.strokeStyle = '#fff';
        g2.lineWidth = size * 0.05 * k + 1;
        g2.beginPath(); g2.arc(q.x, q.y, q.s * (1.15 - k), 0, Math.PI * 2); g2.stroke();
      }
    }
    g2.globalAlpha = 1;
  }

  function fire(ev, ts) {
    const p = byId[ev.id];
    if (!p || p.zone < 0) return;
    p.kick = 1;
    sing(p, clamp(ev.len * 1000, 130, 480));
    zones[p.zone].energy = Math.max(zones[p.zone].energy, 0.8);
    if (ts - p.lastNote > 420) {
      p.lastNote = ts;
      parts.push({
        type: 0, delay: 0, x: p.dx + (Math.random() - 0.5) * size * 0.5, y: p.dy - size * 0.45,
        vx: (Math.random() - 0.5) * 50, vy: -size * (1.1 + Math.random() * 0.5),
        rot: (Math.random() - 0.5) * 0.6, s: size * 0.22, life: 1.1, max: 1.1,
      });
    }
  }

  let last = 0;
  function frame(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0.016);
    last = ts;
    if (engine) {
      const now = engine.now();
      while (queue.length && queue[0].t <= now) fire(queue.shift(), ts);
    }
    const beat = (ts / 1000) * (BPM / 60) * Math.PI; // one sway every two beats
    const follow = 1 - Math.pow(0.00002, dt);
    for (const p of pieces) {
      const k = p.held != null ? 1 : follow;
      p.dx += (p.x - p.dx) * k;
      p.dy += (p.y - p.dy) * k;
      p.kick *= Math.pow(0.004, dt);
      p.lift += ((p.held != null ? 1 : 0) - p.lift) * Math.min(1, dt * 14);
      let hopY = 0;
      if (p.hopT > 0) {
        p.hopT = Math.max(0, p.hopT - dt / p.hopDur);
        hopY = Math.sin(Math.PI * (1 - p.hopT)) * size * p.hopH;
      }
      if (p.singing && ts > p.singUntil) { p.singing = false; p.el.classList.remove('sing'); }
      const playing = songActive && p.zone >= 0;
      const sway = playing ? Math.sin(beat + p.i * 1.3) * 5 : 0;
      const sc = 1 + 0.12 * p.lift + 0.15 * p.kick;
      p.el.style.transform =
        `translate3d(${(p.dx - size / 2).toFixed(1)}px,${(p.dy - size / 2 - hopY - p.lift * size * 0.07).toFixed(1)}px,0) rotate(${sway.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
    }
    for (let i = 0; i < 4; i++) {
      const z = zones[i];
      z.energy *= Math.pow(0.02, dt);
      z.glowEl.style.opacity = (z.energy * GLOW).toFixed(3);
      z.iconEl.style.transform = `scale(${(1 + z.energy * 0.1).toFixed(3)})`;
      const on = pieces.some((p) => p.zone === i);
      if (on !== z.on) { z.on = on; z.el.classList.toggle('on', on); }
    }
    // Nothing happening: the figures on the shelf take turns to hop, as an invitation.
    if (started && !songActive && !heldBy.size && ts > cheerUntil && ts - lastIdle > 2300) {
      lastIdle = ts;
      const p = pieces[idleTurn++ % pieces.length];
      if (p.zone < 0) hop(p, 0.2, 0.45);
    }
    drawParts(dt);
    requestAnimationFrame(frame);
  }

  // ---------- start ----------
  async function keepAwake() {
    try { if (navigator.wakeLock && document.visibilityState === 'visible') await navigator.wakeLock.request('screen'); } catch { /* not allowed, fine */ }
  }
  function begin() {
    if (started) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (navigator.audioSession) { try { navigator.audioSession.type = 'playback'; } catch { /* older Safari */ } }
    engine = createEngine(new AC({ latencyHint: 'interactive' }), theme, {
      onNote: (id, t, len) => queue.push({ id, t, len }),
    });
    engine.resume();
    engine.chime();
    started = true;
    lastIdle = performance.now();
    startEl.classList.add('gone');
    setTimeout(() => engine.prepare(), 400);
    keepAwake();
    if (window.matchMedia('(pointer: coarse)').matches && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
    }
  }
  startEl.addEventListener('click', begin);

  document.addEventListener('visibilitychange', () => {
    if (!engine) return;
    if (document.visibilityState === 'hidden') { releaseAll(); engine.suspend(); }
    else { engine.resume(); keepAwake(); }
  });
  window.addEventListener('resize', () => layout(false));
  window.addEventListener('orientationchange', () => setTimeout(() => layout(false), 250));

  layout(true);
  requestAnimationFrame(frame);

  // For testing from the console.
  window.__chimpun = { theme, pieces, zones, tapHop, drop, checkEnd, setZone, begin, get engine() { return engine; }, get songActive() { return songActive; } };
}
