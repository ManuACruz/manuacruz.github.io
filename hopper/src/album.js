// The sticker album: a book that slides in, opens and flips to a spread. Stickers are peeled off a backing sheet and
// stuck on their outlines. Modes: 'level' (end of a level: stick this level's stickers in, or Later) and
// 'browse' (the album screen: flip through, stick in pocket stickers, tap stickers, pick a hat).
import { tween, ease, lerp, clamp, rand, burst, ring, confetti } from './fx.js';
import { drawEmoji, UI_FONT } from './sprites.js';
import { sfx } from './audio.js';
import { SPREADS, STICKERS, album, spreadKeys } from './stickers.js';

const PAPER = '#fff8ea';
const INK = '#5b4a3a';
const COVER = '#e76f51';
const COVER_DARK = '#b5482f';
const LINING = '#ffd6a5';
const ASPECT = 0.76; // page width / height
const ICON = typeof Image !== 'undefined' ? Object.assign(new Image(), { src: 'icon.svg' }) : null;

export class Album {
  // o: { mode: 'level' | 'browse', keys: [sticker keys for the sheet], onClose(), onHat(hat) }
  constructor(o) {
    this.o = o;
    this.mode = o.mode;
    this.t = 0;
    this.phase = 'in';
    this.y = 1; // 1 = below the screen, 0 = in place
    this.spread = -1; // -1 = closed
    this.flip = null;
    this.queue = [];
    this.shakeX = 0;
    this.items = o.keys.map((key, i) => {
      const s = STICKERS[key];
      return { key, e: s.e, si: s.spread, spot: s.spot, i, state: 'sheet', x: 0, y: 0, s: 0, rot: rand(-0.15, 0.15), peel: 0, fly: null };
    });
    this.sheet = { x: 1 };
    this.fx = {}; // per sticker key: { s, wig, shake, glow } for stickers on the pages
    this.stamp = null;
    this.reward = null;
    this.closable = false;
    this.drag = null;
    this.sel = null;
    this.idle = 0;
    this.hand = { t: 0, on: false };
    this.press = null;
    this.res = Math.min(globalThis.devicePixelRatio || 1, 2);
    this.cache = {};
    this.target = this.items.length ? this.items[0].si : this.mode === 'level' ? 1 : 0;
    sfx.book();
    tween(this, { y: 0 }, 0.5, {
      ease: ease.backOut,
      done: () => {
        this.phase = 'opening';
        this.flipTo(this.target);
      },
    });
  }

  get done() {
    return this.phase === 'gone';
  }

  owns() {
    return this.phase !== 'gone';
  }

  fxOf(key) {
    return this.fx[key] || (this.fx[key] = { s: 1, wig: 0, shake: 0, glow: 0 });
  }

  // ---------- layout ----------
  layout(W, H) {
    const sheetOn = this.items.length > 0;
    const sw = sheetOn ? clamp(W * 0.16, 120, 230) : 0;
    const top = H * 0.12, bottom = H * 0.1;
    const availH = H - top - bottom, availW = W - sw - W * 0.1;
    const ph = Math.min(availH, availW / (2 * ASPECT)), pw = ph * ASPECT;
    const cx = (W - sw) / 2, cy = top + availH / 2;
    const f = this.flip;
    const openK = f && f.from === -1 ? ease.sineInOut(f.k) : f && f.to === -1 ? 1 - ease.sineInOut(f.k) : this.spread >= 0 ? 1 : 0;
    const bx = cx - ((1 - openK) * pw) / 2 + this.shakeX;
    const by = cy + this.y * H;
    const sheetX = W - sw - W * 0.025 + this.sheet.x * (sw + W * 0.1);
    this.g = { W, H, pw, ph, cx, cy, bx, by, x0: bx - pw, y0: by - ph / 2, openK, sw, sheetX, sheetY: by - ph * 0.46, sheetH: ph * 0.92, r: ph * 0.068 };
  }

  spotPos(key) {
    const s = STICKERS[key], g = this.g;
    const [u, v, size, rot] = s.spot;
    return { x: g.x0 + u * 2 * g.pw, y: g.y0 + v * g.ph, r: g.r * size, rot };
  }

  homeOf(it) {
    const g = this.g, n = this.items.length;
    return { x: g.sheetX + g.sw / 2, y: g.sheetY + g.sheetH * (0.17 + (0.62 * (it.i + 0.5)) / n) };
  }

  laterRect() {
    const g = this.g, w = g.sw * 0.74, h = clamp(g.ph * 0.09, 34, 52);
    return { x: g.sheetX + (g.sw - w) / 2, y: g.sheetY + g.sheetH * 0.88 - h / 2, w, h };
  }

  closeRect() {
    const s = clamp(this.g.H * 0.075, 40, 56);
    return { x: this.g.W - s - 14, y: 14, w: s, h: s };
  }

  arrowRect(dir) {
    const g = this.g, s = clamp(g.ph * 0.11, 38, 60);
    const x = dir < 0 ? g.x0 - s - 12 : g.bx + g.pw + 12;
    return { x, y: g.by - s / 2, w: s, h: s };
  }

  // ---------- flipping ----------
  flipTo(n) {
    const last = this.queue.length ? this.queue[this.queue.length - 1] : this.flip ? this.flip.to : this.spread;
    const step = n > last ? 1 : -1;
    for (let s = last + step; step > 0 ? s <= n : s >= n; s += step) this.queue.push(s);
    if (!this.flip) this.nextFlip();
  }

  nextFlip() {
    if (!this.queue.length) return;
    const to = this.queue.shift();
    const cover = this.spread === -1 || to === -1;
    this.flip = { from: this.spread, to, k: 0, dur: cover ? 0.62 : this.queue.length ? 0.34 : 0.46 };
    sfx.flip();
  }

  endFlip() {
    this.spread = this.flip.to;
    this.flip = null;
    this.cache = {};
    if (this.queue.length) return this.nextFlip();
    if (this.phase === 'opening') {
      this.phase = 'play';
      this.idle = 0;
      if (this.items.length) {
        tween(this.sheet, { x: 0 }, 0.45, { ease: ease.backOut });
        this.items.forEach((it, i) => tween(it, { s: 1 }, 0.35, { delay: 0.2 + i * 0.12, ease: ease.backOut, done: () => sfx.pick() }));
      }
    }
  }

  // ---------- update ----------
  update(dt, W, H) {
    this.t += dt;
    this.layout(W, H);
    this.shakeX *= Math.exp(-dt * 16);
    if (this.flip) {
      this.flip.k = Math.min(1, this.flip.k + dt / this.flip.dur);
      if (this.flip.k >= 1) this.endFlip();
    }
    for (const k in this.fx) {
      const f = this.fx[k];
      f.wig = Math.max(0, f.wig - dt * 1.6);
      f.shake = Math.max(0, f.shake - dt * 2.4);
      f.glow = lerp(f.glow, 0, 1 - Math.exp(-dt * 8));
    }
    for (const it of this.items) {
      const h = this.homeOf(it);
      if (it.state === 'sheet' || it.state === 'sel') {
        const bob = it.state === 'sel' ? Math.sin(this.t * 8) * 4 - 8 : 0;
        it.x = h.x;
        it.y = h.y + bob;
        it.peel = lerp(it.peel, it.state === 'sel' ? 0.5 : 0, 1 - Math.exp(-dt * 12));
      } else if (it.state === 'drag') {
        it.x = lerp(it.x, it.tx, 1 - Math.exp(-dt * 28));
        it.y = lerp(it.y, it.ty, 1 - Math.exp(-dt * 28));
        it.peel = lerp(it.peel, 1, 1 - Math.exp(-dt * 10));
        const target = this.spotUnder(it.tx, it.ty);
        if (target) this.fxOf(target).glow = Math.min(1, this.fxOf(target).glow + dt * 20);
      } else if (it.state === 'back' && it.fly) {
        it.fly.k = Math.min(1, it.fly.k + dt / 0.35);
        const e = ease.backOut(it.fly.k);
        it.x = lerp(it.fly.x, h.x, e);
        it.y = lerp(it.fly.y, h.y, e) - Math.sin(it.fly.k * Math.PI) * 40;
        it.peel = lerp(it.peel, 0, 1 - Math.exp(-dt * 10));
        if (it.fly.k >= 1) {
          it.state = 'sheet';
          it.fly = null;
        }
      }
    }
    const waiting = this.phase === 'play' && this.items.some((it) => it.state === 'sheet' || it.state === 'sel') && !this.flip;
    if (waiting) {
      this.idle += dt;
      this.hand.on = this.idle > 3.5 && !this.drag && this.mode === 'level';
    } else this.hand.on = false;
    this.hand.t = this.hand.on ? this.hand.t + dt : 0;
  }

  // the outline for a key on the open spread that (x, y) is over, if empty
  spotUnder(x, y) {
    if (this.flip || this.spread < 0) return null;
    let best = null, bd = Infinity;
    for (const key of spreadKeys(this.spread)) {
      if (album.placed(key)) continue;
      const p = this.spotPos(key);
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < p.r * 1.5 && d < bd) {
        bd = d;
        best = key;
      }
    }
    return best;
  }

  placedUnder(x, y) {
    if (this.flip || this.spread < 0) return null;
    for (const key of spreadKeys(this.spread)) {
      if (!album.placed(key)) continue;
      const p = this.spotPos(key);
      if (Math.hypot(p.x - x, p.y - y) < p.r * 1.2) return key;
    }
    return null;
  }

  itemAt(x, y) {
    let best = null, bd = Math.max(44, this.g.r * 1.4);
    for (const it of this.items) {
      if (it.state !== 'sheet' && it.state !== 'sel') continue;
      const d = Math.hypot(it.x - x, it.y - y);
      if (d < bd) {
        bd = d;
        best = it;
      }
    }
    return best;
  }

  // ---------- input ----------
  down(x, y) {
    this.idle = 0;
    if (this.phase === 'done' || this.phase === 'complete') {
      if (this.closable) this.close();
      else if (this.placedUnder(x, y)) this.wiggle(this.placedUnder(x, y));
      return true;
    }
    if (this.phase !== 'play') return true;
    if (this.mode === 'browse') {
      if (inRect(this.closeRect(), x, y)) return this.close(), true;
      for (const d of [-1, 1]) if (this.canFlip(d) && inRect(this.arrowRect(d), x, y)) return this.turn(d), true;
    }
    if (this.mode === 'level' && this.items.some((it) => it.state !== 'placed') && inRect(this.laterRect(), x, y)) {
      sfx.click();
      return this.close(), true;
    }
    const it = this.itemAt(x, y);
    if (it) {
      if (this.sel && this.sel !== it) this.sel.state = 'sheet';
      this.drag = { it, x0: x, y0: y, moved: false, wasSel: it.state === 'sel' };
      it.state = 'drag';
      it.tx = x;
      it.ty = y - 10;
      sfx.peel();
      tween(it, { s: 1.25 }, 0.18, { ease: ease.backOut });
      if (it.si !== this.spread) this.flipTo(it.si);
      return true;
    }
    if (this.sel) {
      const key = this.spotUnder(x, y);
      if (key) return this.tryPlace(this.sel, key), true;
      this.sel.state = 'sheet';
      tween(this.sel, { s: 1 }, 0.2);
      this.sel = null;
      return true;
    }
    this.press = { x, y, x0: x, y0: y };
    return true;
  }

  move(x, y) {
    const d = this.drag;
    if (d) {
      d.it.tx = x;
      d.it.ty = y - 10;
      if (Math.hypot(x - d.x0, y - d.y0) > 10) d.moved = true;
      return;
    }
    if (this.press) {
      this.press.x = x;
      this.press.y = y;
    }
  }

  up(x, y) {
    const d = this.drag;
    if (d) {
      this.drag = null;
      const it = d.it;
      if (!d.moved) {
        if (d.wasSel) {
          it.state = 'sheet';
          this.sel = null;
          tween(it, { s: 1 }, 0.2);
        } else {
          it.state = 'sel';
          this.sel = it;
          tween(it, { s: 1.15 }, 0.2, { ease: ease.backOut });
        }
        return;
      }
      // judge by the finger, not the (lagging) sticker
      const key = this.spotUnder(it.tx, it.ty) || this.spotUnder(it.x, it.y);
      if (key) this.tryPlace(it, key);
      else this.sendHome(it);
      return;
    }
    const p = this.press;
    this.press = null;
    if (!p) return;
    const dx = x - p.x0;
    if (this.mode === 'browse' && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(y - p.y0)) {
      const dir = dx < 0 ? 1 : -1;
      if (this.canFlip(dir)) this.turn(dir);
      return;
    }
    const key = this.placedUnder(x, y);
    if (key) return this.wiggle(key);
    if (this.spread === 0 && !this.flip) this.tapFront(x, y);
  }

  key(k) {
    if ((this.phase === 'done' || this.phase === 'complete') && this.closable && (k === ' ' || k === 'Enter')) return this.close();
    if (this.mode !== 'browse' || this.phase !== 'play') return;
    if (k === 'Escape') this.close();
    else if (k === 'ArrowRight' && this.canFlip(1)) this.turn(1);
    else if (k === 'ArrowLeft' && this.canFlip(-1)) this.turn(-1);
  }

  canFlip(dir) {
    const at = this.queue.length ? this.queue[this.queue.length - 1] : this.flip ? this.flip.to : this.spread;
    const n = at + dir;
    return n >= 0 && n < SPREADS.length;
  }

  turn(dir) {
    const at = this.queue.length ? this.queue[this.queue.length - 1] : this.flip ? this.flip.to : this.spread;
    this.flipTo(at + dir);
  }

  wiggle(key) {
    const f = this.fxOf(key);
    f.wig = 1;
    const p = this.spotPos(key);
    let h = 0;
    for (const c of key) h = (h * 31 + c.charCodeAt(0)) % 997;
    sfx.pop(1 + (h % 7) / 10);
    burst(p.x, p.y - p.r * 0.6, 5, { kind: 'star', color: ['#ffd23f', '#fff'], speed: 180, size: 5, g: 150, screen: true });
  }

  sendHome(it) {
    it.state = 'back';
    it.fly = { x: it.x, y: it.y, k: 0 };
    if (this.sel === it) this.sel = null;
    tween(it, { s: 1 }, 0.3, { ease: ease.backOut });
  }

  tryPlace(it, key) {
    if (this.sel === it) this.sel = null;
    if (key !== it.key) {
      this.fxOf(key).shake = 1;
      sfx.wrong();
      this.sendHome(it);
      return;
    }
    const p = this.spotPos(key);
    it.state = 'placing';
    tween(it, { x: p.x, y: p.y, rot: p.rot, s: 1.45, peel: 0 }, 0.13, {
      ease: ease.cubicOut,
      done: () => this.stick(it),
    });
  }

  // sticker lands on its outline
  stick(it) {
    it.state = 'placed';
    album.place(it.key);
    const p = this.spotPos(it.key), f = this.fxOf(it.key);
    f.s = 1.5;
    tween(f, { s: 1 }, 0.55, { ease: ease.elasticOut });
    this.shakeX = 9;
    sfx.place();
    burst(p.x, p.y, 14, { kind: 'star', color: ['#ffd23f', '#ff8fab', '#fff', '#7bdff2'], speed: 420, size: p.r * 0.2, g: 300, screen: true, life: 0.7 });
    ring(p.x, p.y, { size: p.r * 0.8, size1: p.r * 2.3, color: '#ffd23f', width: 6, screen: true });
    if (this.items.some((q) => q.state !== 'placed')) return;
    // all of this sheet's stickers are in
    tween(this.sheet, { x: 1 }, 0.4, { delay: 0.35, ease: ease.backIn });
    if (album.full(this.spread) && !album.alive(this.spread)) this.complete(this.spread);
    else {
      this.phase = 'done';
      tween({}, {}, 0.6, { done: () => (this.closable = true) });
    }
  }

  // a spread just got full: the stickers come alive, a stamp, a hat
  complete(si) {
    this.phase = 'complete';
    album.setAlive(si);
    const keys = spreadKeys(si);
    keys.forEach((k, i) => {
      tween({}, {}, 0.35 + i * 0.12, {
        done: () => {
          const f = this.fxOf(k), p = this.spotPos(k);
          f.s = 1.35;
          tween(f, { s: 1 }, 0.45, { ease: ease.elasticOut });
          sfx.pop(1 + i * 0.12);
          burst(p.x, p.y, 6, { kind: 'star', color: ['#ffd23f', '#fff'], speed: 220, size: 5, g: 120, screen: true });
        },
      });
    });
    const t0 = 0.5 + keys.length * 0.12;
    this.stamp = { s: 3, a: 0, rot: -0.35 };
    tween(this.stamp, { s: 1, a: 1, rot: -0.16 }, 0.2, {
      delay: t0,
      ease: ease.quadIn,
      done: () => {
        sfx.stamp();
        this.shakeX = 18;
        const sp = this.stampPos();
        burst(sp.x, sp.y, 16, { kind: 'puff', color: 'rgba(200,60,60,0.35)', speed: 260, size: 10, g: 0, drag: 5, screen: true });
        sfx.solved();
        const { W, H } = this.g;
        confetti(W * 0.25, H + 10, 40, { speed: 1200, spread: 0.5, angle: -Math.PI / 2 + 0.25 });
        confetti(W * 0.75, H + 10, 40, { speed: 1200, spread: 0.5, angle: -Math.PI / 2 - 0.25 });
      },
    });
    const hat = SPREADS[si].hat;
    if (hat && !album.hats().includes(hat)) {
      album.addHat(hat);
      if (!album.hat) {
        album.hat = hat;
        this.o.onHat && this.o.onHat(hat);
      }
      this.reward = { hat, a: 0, s: 0.3, y: 30 };
      tween(this.reward, { a: 1, s: 1, y: 0 }, 0.55, { delay: t0 + 0.9, ease: ease.backOut, done: () => sfx.hat() });
      // then it gets out of the way so the page can show off
      tween(this.reward, { a: 0, s: 0.6, y: -80 }, 0.4, { delay: t0 + 3.2, ease: ease.backIn });
    }
    tween({}, {}, t0 + (hat ? 2.2 : 1.2), { done: () => (this.closable = true) });
  }

  stampPos() {
    const g = this.g;
    return { x: g.bx, y: g.y0 + g.ph * 0.16 };
  }

  close() {
    if (this.phase === 'out' || this.phase === 'gone') return;
    this.phase = 'out';
    this.hand.on = false;
    sfx.page();
    for (const it of this.items) if (it.state === 'drag' || it.state === 'sel') it.state = 'sheet';
    tween(this.sheet, { x: 1 }, 0.3, { ease: ease.backIn });
    tween(this, { y: 1.05 }, 0.42, { delay: 0.08, ease: ease.backIn, done: () => ((this.phase = 'gone'), this.o.onClose && this.o.onClose()) });
  }

  // tap on the front spread: hats
  tapFront(x, y) {
    const g = this.g;
    for (const h of frontHats(g.pw, g.ph)) {
      if (Math.hypot(g.bx + h.x - x, g.y0 + h.y - y) > h.r * 1.2) continue;
      if (!album.hats().includes(h.hat)) {
        sfx.no();
        return;
      }
      album.hat = album.hat === h.hat ? null : h.hat;
      this.o.onHat && this.o.onHat(album.hat);
      sfx.pop(album.hat ? 1.3 : 0.8);
      burst(g.bx + h.x, g.y0 + h.y, 8, { kind: 'star', color: ['#ffd23f', '#fff'], speed: 220, size: 6, g: 150, screen: true });
      return;
    }
  }

  // ---------- drawing (screen space) ----------
  draw(ctx) {
    const g = this.g;
    if (!g || this.phase === 'gone') return;
    const vis = clamp(1 - this.y, 0, 1);
    ctx.save();
    ctx.fillStyle = `rgba(30, 24, 50, ${0.42 * vis})`;
    ctx.fillRect(0, 0, g.W, g.H);
    this.drawBook(ctx);
    if (this.items.length) this.drawSheet(ctx);
    this.drawUI(ctx);
    this.drawStickers(ctx);
    if (this.hand.on) this.drawHint(ctx);
    ctx.restore();
  }

  drawBook(ctx) {
    const g = this.g, f = this.flip;
    const { bx, y0, pw, ph } = g;
    const open = g.openK;
    // shadow on the table
    ctx.save();
    ctx.fillStyle = 'rgba(20, 10, 30, 0.28)';
    ctx.filter = 'blur(14px)';
    const sw = pw * (1 + open);
    ctx.fillRect(bx + pw - sw + 10, y0 + 22, sw, ph);
    ctx.filter = 'none';
    ctx.restore();
    // boards under the pages
    if (open > 0.98) {
      ctx.fillStyle = COVER_DARK;
      roundRect(ctx, bx - pw - 9, y0 - 8, pw * 2 + 18, ph + 18, 16);
      ctx.fill();
      ctx.fillStyle = COVER;
      roundRect(ctx, bx - pw - 9, y0 - 9, pw * 2 + 18, ph + 15, 16);
      ctx.fill();
    }
    // page stack edges
    if (this.spread >= 0 || (f && f.to >= 0)) {
      ctx.strokeStyle = '#e4d6bd';
      ctx.lineWidth = 1.5;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(bx + 4, y0 + ph + i * 2.2);
        ctx.lineTo(bx + pw - 6 + i, y0 + ph + i * 2.2);
        if (open > 0.98) {
          ctx.moveTo(bx - pw + 6 - i, y0 + ph + i * 2.2);
          ctx.lineTo(bx - 4, y0 + ph + i * 2.2);
        }
        ctx.stroke();
      }
    }
    // static pages
    let left, right;
    if (!f) {
      left = this.spread;
      right = this.spread;
    } else if (f.to > f.from) {
      left = f.from;
      right = f.to;
    } else {
      left = f.to;
      right = f.from;
    }
    this.pageAt(ctx, left, 'left', bx - pw, y0);
    this.pageAt(ctx, right, 'right', bx, y0);
    // spine shade
    if (open > 0.98 || (f && (f.to >= 0 && f.from >= 0))) {
      const gs = ctx.createLinearGradient(bx - 26, 0, bx + 26, 0);
      gs.addColorStop(0, 'rgba(110, 80, 50, 0)');
      gs.addColorStop(0.5, 'rgba(110, 80, 50, 0.28)');
      gs.addColorStop(1, 'rgba(110, 80, 50, 0)');
      ctx.fillStyle = gs;
      ctx.fillRect(bx - 26, y0, 52, ph);
    }
    if (f) this.drawLeaf(ctx);
  }

  // draw one page (spread si, side) with its top-left at (x, y)
  pageAt(ctx, si, side, x, y) {
    if (si === -1 && side === 'left') return;
    const { pw, ph } = this.g;
    ctx.save();
    ctx.translate(x, y);
    this.drawPage(ctx, si, side, pw, ph);
    ctx.restore();
  }

  pageCanvas(si, side) {
    const { pw, ph } = this.g, res = this.res;
    const key = si + side;
    let c = this.cache[key];
    const w = Math.ceil(pw * res), h = Math.ceil(ph * res);
    if (!c || c.width !== w || c.height !== h) {
      c = this.cache[key] = document.createElement('canvas');
      c.width = w;
      c.height = h;
    }
    const x = c.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, w, h);
    x.setTransform(res, 0, 0, res, 0, 0);
    if (!(si === -1 && side === 'left')) this.drawPage(x, si, side, pw, ph);
    return c;
  }

  // The turning leaf, drawn in vertical strips that bend (a page curl) and grow towards the viewer as it lifts.
  drawLeaf(ctx) {
    const f = this.flip, g = this.g;
    const { bx, by, pw, ph } = g;
    const fwd = f.to > f.from;
    const front = this.pageCanvas(f.from, fwd ? 'right' : 'left');
    const back = this.pageCanvas(f.to, fwd ? 'left' : 'right');
    const th = ease.sineInOut(f.k) * Math.PI;
    const lift = Math.sin(th);
    const N = 18, sign = fwd ? 1 : -1, res = this.res;
    // shadow the leaf casts on the page it's lifting from / landing on
    ctx.save();
    const sx = fwd ? (th < Math.PI / 2 ? bx : bx - pw) : th < Math.PI / 2 ? bx - pw : bx;
    const sh = ctx.createLinearGradient(bx, 0, bx + (sx < bx ? -pw : pw), 0);
    sh.addColorStop(0, `rgba(40, 25, 10, ${0.3 * lift})`);
    sh.addColorStop(1, 'rgba(40, 25, 10, 0)');
    ctx.fillStyle = sh;
    ctx.fillRect(sx, g.y0, pw, ph);
    ctx.restore();
    let x = bx;
    for (let i = 0; i < N; i++) {
      const s0 = i / N, s1 = (i + 1) / N, sm = (s0 + s1) / 2;
      // curl: the outer part lags behind while lifting and leads while landing
      const curl = 0.5 * lift * sm * sm;
      const ang = th < Math.PI / 2 ? th - curl : th + curl;
      const dx = Math.cos(ang) * (pw / N) * sign;
      const x1 = x + dx;
      const facing = fwd ? x1 > x : x1 < x;
      const img = facing ? front : back;
      const spineLeft = (fwd && facing) || (!fwd && !facing);
      const u0 = spineLeft ? s0 : 1 - s1, u1 = spineLeft ? s1 : 1 - s0;
      const hs = 1 + 0.07 * lift * sm;
      const dl = Math.min(x, x1), dw = Math.abs(x1 - x) + 0.6;
      const hh = ph * hs;
      ctx.drawImage(img, u0 * pw * res, 0, (u1 - u0) * pw * res, ph * res, dl, by - hh / 2, dw, hh);
      const shade = 0.28 * (1 - Math.abs(Math.cos(ang)));
      if (shade > 0.01) {
        ctx.fillStyle = `rgba(60, 40, 20, ${shade})`;
        ctx.fillRect(dl, by - hh / 2, dw, hh);
      }
      x = x1;
    }
  }

  drawPage(c, si, side, w, h) {
    if (si === -1) return drawCover(c, w, h, this.t);
    const sp = SPREADS[si];
    paper(c, side, w, h, sp.kind === 'front' && side === 'left' ? LINING : PAPER);
    c.save();
    clipPage(c, side, w, h);
    if (sp.kind === 'front') {
      if (side === 'left') drawOwner(c, w, h, this.t);
      else drawHats(c, w, h, this.t);
    } else if (sp.kind === 'scene') {
      c.save();
      if (side === 'right') c.translate(-w, 0);
      SCENES[sp.id](c, w * 2, h, this.t, album.full(si));
      this.drawSpots(c, si, w, h);
      c.restore();
      if (side === 'left') label(c, sp.title, w * 0.08, h * 0.075, h);
      else {
        const [n, of] = album.count(si);
        label(c, `${n} / ${of}${n === of ? ' ★' : ''}`, w * 0.92, h * 0.075, h, 'right');
      }
    } else if (sp.kind === 'soon') drawSoon(c, side, w, h);
    c.restore();
    // a little curl shade on the outer corner
    const gx = side === 'left' ? 0 : w;
    const gc = c.createLinearGradient(gx, 0, side === 'left' ? 18 : w - 18, 0);
    gc.addColorStop(0, 'rgba(120, 90, 60, 0.12)');
    gc.addColorStop(1, 'rgba(120, 90, 60, 0)');
    c.fillStyle = gc;
    c.fillRect(side === 'left' ? 0 : w - 18, 0, 18, h);
  }

  // outlines and placed stickers on a scene spread, in spread coordinates (both pages are 2w wide)
  drawSpots(c, si, w, h) {
    const t = this.t, alive = album.full(si);
    const onSheet = new Set(this.items.filter((it) => it.state !== 'placed').map((it) => it.key));
    const r0 = h * 0.068;
    for (const key of spreadKeys(si)) {
      const st = STICKERS[key];
      const [u, v, size, rot, anim] = st.spot;
      const x = u * 2 * w, y = v * h, r = r0 * size;
      const f = this.fx[key];
      if (album.placed(key)) {
        let ax = 0, ay = 0, ar = 0, as = 1;
        if (alive) [ax, ay, ar, as] = animate(anim, t, r, u * 9);
        if (f && f.wig > 0) {
          ar += Math.sin(f.wig * 28) * 0.25 * f.wig;
          as *= 1 + 0.12 * f.wig;
        }
        c.save();
        c.shadowColor = 'rgba(60, 40, 20, 0.28)';
        c.shadowBlur = 6;
        c.shadowOffsetY = 3;
        drawEmoji(c, st.e, x + ax, y + ay, r * as * (f ? f.s : 1), 'sticker', rot + ar);
        c.restore();
      } else {
        const want = onSheet.has(key);
        const shake = f ? Math.sin(f.shake * 30) * 8 * f.shake : 0;
        const glow = f ? f.glow : 0;
        const pulse = want ? 1 + Math.sin(t * 4) * 0.05 + glow * 0.15 : 1;
        if (glow > 0.05) {
          c.fillStyle = `rgba(255, 210, 63, ${0.35 * glow})`;
          c.beginPath();
          c.arc(x, y, r * 1.35, 0, Math.PI * 2);
          c.fill();
        }
        drawEmoji(c, st.e, x + shake, y, r * pulse, 'outline', rot, want ? 0.95 : 0.4);
        if (f && f.shake > 0) drawEmoji(c, st.e, x + shake, y, r * pulse, 'outline', rot, f.shake);
      }
    }
  }

  drawSheet(ctx) {
    const g = this.g;
    if (this.sheet.x >= 0.999) return;
    const { sheetX: x, sheetY: y, sw: w, sheetH: h } = g;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(0.03);
    ctx.translate(-(x + w / 2), -(y + h / 2));
    ctx.shadowColor = 'rgba(20, 10, 30, 0.35)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#f4f7fb';
    roundRect(ctx, x, y, w, h, 14);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    // waxy backing: faint diagonal sheen
    ctx.save();
    roundRect(ctx, x, y, w, h, 14);
    ctx.clip();
    ctx.strokeStyle = 'rgba(160, 180, 210, 0.18)';
    ctx.lineWidth = 10;
    for (let k = -h; k < w + h; k += 34) {
      ctx.beginPath();
      ctx.moveTo(x + k, y);
      ctx.lineTo(x + k - h, y + h);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = 'rgba(120, 140, 170, 0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    roundRect(ctx, x + 7, y + 7, w - 14, h - 14, 10);
    ctx.stroke();
    ctx.setLineDash([]);
    // heading
    ctx.fillStyle = 'rgba(70, 90, 130, 0.75)';
    ctx.font = `700 ${clamp(h * 0.05, 13, 20)}px ${UI_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.mode === 'level' ? 'Your stickers' : 'Pocket', x + w / 2, y + h * 0.075);
    // the shiny marks left where stickers were peeled off
    for (const it of this.items) {
      if (it.state === 'sheet') continue;
      const hp = this.homeOf(it);
      drawEmoji(ctx, it.e, hp.x, hp.y, g.r * 0.95, 'gloss', it.rot, 0.7);
    }
    // Later
    if (this.mode === 'level' && this.items.some((it) => it.state !== 'placed')) {
      const b = this.laterRect();
      pill(ctx, b, 'Later', '#ffffff', INK);
    }
    ctx.restore();
  }

  drawUI(ctx) {
    const g = this.g;
    const vis = clamp(1 - this.y, 0, 1);
    if (this.mode === 'browse' && this.phase !== 'in') {
      ctx.save();
      ctx.globalAlpha = vis;
      const c = this.closeRect();
      pill(ctx, c, '✕', '#ffffff', INK);
      for (const d of [-1, 1]) {
        if (!this.canFlip(d)) continue;
        const a = this.arrowRect(d);
        pill(ctx, a, d < 0 ? '◀' : '▶', '#ffffff', INK, Math.sin(this.t * 4) * 2 * d);
      }
      // page dots
      const n = SPREADS.length, at = this.flip ? this.flip.to : this.spread;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = i === at ? '#ffffff' : 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(g.cx + (i - (n - 1) / 2) * 22, g.y0 + g.ph + 28, i === at ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    // stamp
    if (this.stamp && this.stamp.a > 0) {
      const sp = this.stampPos();
      ctx.save();
      ctx.globalAlpha = this.stamp.a;
      ctx.translate(sp.x, sp.y);
      ctx.rotate(this.stamp.rot);
      ctx.scale(this.stamp.s, this.stamp.s);
      const fs = clamp(g.ph * 0.06, 15, 30);
      ctx.font = `800 ${fs}px ${UI_FONT}`;
      const text = '★ PAGE COMPLETE!';
      const w = ctx.measureText(text).width + fs * 1.4;
      ctx.strokeStyle = '#d64545';
      ctx.lineWidth = 4;
      roundRect(ctx, -w / 2, -fs * 0.95, w, fs * 1.9, 10);
      ctx.stroke();
      ctx.fillStyle = '#d64545';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 0, 2);
      ctx.restore();
    }
    // new hat
    const rw = this.reward;
    if (rw && rw.a > 0) {
      ctx.save();
      ctx.globalAlpha = rw.a;
      const cx = g.bx + g.pw * 0.5, cy = g.by + g.ph * 0.18 + rw.y;
      const w = clamp(g.pw * 0.62, 170, 300), h = w * 0.62;
      ctx.translate(cx, cy);
      ctx.scale(rw.s, rw.s);
      ctx.shadowColor = 'rgba(20,10,30,0.35)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = '#fffdf5';
      roundRect(ctx, -w / 2, -h / 2, w, h, 18);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#ffd23f';
      ctx.lineWidth = 5;
      roundRect(ctx, -w / 2, -h / 2, w, h, 18);
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.font = `700 ${h * 0.17}px ${UI_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('New hat for Hopper!', 0, -h * 0.3);
      drawEmoji(ctx, rw.hat, 0, h * 0.1, h * 0.26 * (1 + Math.sin(this.t * 5) * 0.06), 'sticker', Math.sin(this.t * 3) * 0.12);
      ctx.restore();
    }
    // tap to continue
    if (this.closable && this.phase !== 'out') {
      ctx.save();
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(this.t * 5);
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${clamp(g.H * 0.035, 14, 22)}px ${UI_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('tap to continue', g.cx, Math.min(g.H - 18, g.y0 + g.ph + 34));
      ctx.restore();
    }
  }

  // stickers on the sheet and in the hand: drawn above the book
  drawStickers(ctx) {
    const g = this.g;
    const order = this.items.filter((it) => it.state !== 'placed').sort((a, b) => (a.state === 'drag') - (b.state === 'drag'));
    for (const it of order) {
      if (it.s <= 0.01) continue;
      const lift = it.state === 'drag' || it.state === 'placing' ? 1 : it.state === 'sel' ? 0.5 : 0;
      const ox = it.state === 'sheet' || it.state === 'back' ? this.sheet.x * (g.sw + g.W * 0.1) : 0;
      ctx.save();
      ctx.shadowColor = 'rgba(30, 20, 40, 0.35)';
      ctx.shadowBlur = 4 + lift * 16;
      ctx.shadowOffsetY = 2 + lift * 12;
      // peeling: the sticker stretches and tilts as it comes off its backing
      const pe = it.peel * (1 - it.peel) * 4;
      ctx.translate(it.x + ox, it.y);
      ctx.transform(1, 0, -0.25 * pe, 1 - 0.12 * pe, 0, 0);
      drawEmoji(ctx, it.e, 0, 0, g.r * it.s, 'sticker', it.rot + (it.state === 'drag' ? Math.sin(this.t * 9) * 0.05 : 0));
      ctx.restore();
    }
  }

  drawHint(ctx) {
    const it = this.items.find((i) => i.state === 'sheet' || i.state === 'sel');
    if (!it || it.si !== this.spread) return;
    const p = this.spotPos(it.key);
    const T = 2.0, k = (this.hand.t % T) / T;
    let x, y, press = 0, a = 1;
    if (k < 0.15) {
      x = it.x; y = it.y; press = k / 0.15; a = k / 0.15;
    } else if (k < 0.7) {
      const e = ease.sineInOut((k - 0.15) / 0.55);
      x = lerp(it.x, p.x, e); y = lerp(it.y, p.y, e) - Math.sin(e * Math.PI) * 50; press = 1;
    } else if (k < 0.85) {
      x = p.x; y = p.y; press = 1 - (k - 0.7) / 0.15;
    } else {
      x = p.x; y = p.y; a = 1 - (k - 0.85) / 0.15;
    }
    if (press > 0.5 && k > 0.15 && k < 0.85) drawEmoji(ctx, it.e, x, y, this.g.r * 0.85, 'sticker', 0, 0.5);
    drawHand(ctx, x, y, press, a, this.g.r * 0.8);
  }

  // ---------- test hooks ----------
  placeNext() {
    const it = this.items.find((q) => q.state === 'sheet' || q.state === 'sel');
    if (!it || this.phase !== 'play' || this.flip || it.si !== this.spread) return false;
    this.tryPlace(it, it.key);
    return true;
  }
}

// ---------- sticker animation once a spread is full: [dx, dy, drot, scale] ----------
function animate(anim, t, r, ph) {
  const s = Math.sin, k = r / 30;
  switch (anim) {
    case 'drip': return [0, (((t * 0.7 + ph) % 1) - 0.5) * 6 * k, 0, 1 + s(t * 6 + ph) * 0.04];
    case 'crawl': return [s(t * 1.3 + ph) * 7 * k, 0, s(t * 2.6 + ph) * 0.06, 1 + s(t * 7 + ph) * 0.05];
    case 'sway': return [0, 0, s(t * 1.7 + ph) * 0.14, 1];
    case 'buzz': return [s(t * 2.2 + ph) * 12 * k, s(t * 4.4 + ph) * 6 * k + s(t * 31) * 1.2, s(t * 21) * 0.08, 1];
    case 'pulse': return [0, 0, t * 0.25, 1 + s(t * 3 + ph) * 0.07];
    case 'wobble': return [0, 0, s(t * 3.5 + ph) * 0.09, 1 + s(t * 7 + ph) * 0.03];
    default: return [0, s(t * 2 + ph) * 3 * k, 0, 1];
  }
}

// ---------- page furniture ----------
function paper(c, side, w, h, color) {
  c.fillStyle = color;
  pageClip(c, side, w, h);
  c.fill();
  // spine shade
  const sx = side === 'left' ? w : 0;
  const g = c.createLinearGradient(sx, 0, side === 'left' ? w - 40 : 40, 0);
  g.addColorStop(0, 'rgba(120, 90, 60, 0.22)');
  g.addColorStop(1, 'rgba(120, 90, 60, 0)');
  c.fillStyle = g;
  c.fillRect(side === 'left' ? w - 40 : 0, 0, 40, h);
}

function pageClip(c, side, w, h) {
  const r = 12;
  c.beginPath();
  if (side === 'left') {
    c.moveTo(w, 0);
    c.lineTo(r, 0);
    c.arcTo(0, 0, 0, r, r);
    c.lineTo(0, h - r);
    c.arcTo(0, h, r, h, r);
    c.lineTo(w, h);
  } else {
    c.moveTo(0, 0);
    c.lineTo(w - r, 0);
    c.arcTo(w, 0, w, r, r);
    c.lineTo(w, h - r);
    c.arcTo(w, h, w - r, h, r);
    c.lineTo(0, h);
  }
  c.closePath();
}

// clip to the page shape (pageClip only builds the path)
function clipPage(c, side, w, h) {
  pageClip(c, side, w, h);
  c.clip();
}

function label(c, text, x, y, h, align = 'left') {
  const fs = clamp(h * 0.045, 12, 24);
  c.font = `700 ${fs}px ${UI_FONT}`;
  const w = c.measureText(text).width + fs * 1.2;
  const lx = align === 'left' ? x : x - w;
  c.save();
  c.translate(lx + w / 2, y);
  c.rotate(align === 'left' ? -0.03 : 0.03);
  c.fillStyle = 'rgba(255, 253, 245, 0.92)';
  c.shadowColor = 'rgba(60, 40, 20, 0.2)';
  c.shadowBlur = 4;
  c.shadowOffsetY = 2;
  roundRect(c, -w / 2, -fs * 0.8, w, fs * 1.6, fs * 0.5);
  c.fill();
  c.shadowColor = 'transparent';
  c.fillStyle = INK;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, 0, 1);
  c.restore();
}

function drawCover(c, w, h, t) {
  const r = 14;
  c.save();
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(w - r, 0);
  c.arcTo(w, 0, w, r, r);
  c.lineTo(w, h - r);
  c.arcTo(w, h, w - r, h, r);
  c.lineTo(0, h);
  c.closePath();
  const g = c.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#f08a6c');
  g.addColorStop(1, COVER);
  c.fillStyle = g;
  c.fill();
  c.clip();
  // spine band
  c.fillStyle = COVER_DARK;
  c.fillRect(0, 0, w * 0.07, h);
  c.fillStyle = 'rgba(255,255,255,0.12)';
  c.fillRect(w * 0.07, 0, 3, h);
  // stitching
  c.strokeStyle = 'rgba(255, 240, 220, 0.75)';
  c.lineWidth = 2.5;
  c.setLineDash([9, 7]);
  roundRect(c, w * 0.12, h * 0.04, w * 0.84, h * 0.92, 12);
  c.stroke();
  c.setLineDash([]);
  // label plate
  const lw = w * 0.66, lh = h * 0.2, lx = w * 0.54 - lw / 2, ly = h * 0.12;
  c.fillStyle = '#fff3dc';
  c.shadowColor = 'rgba(60, 20, 10, 0.3)';
  c.shadowBlur = 6;
  c.shadowOffsetY = 3;
  roundRect(c, lx, ly, lw, lh, 12);
  c.fill();
  c.shadowColor = 'transparent';
  c.fillStyle = COVER_DARK;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `700 ${lh * 0.3}px ${UI_FONT}`;
  c.fillText('Hopper’s', w * 0.54, ly + lh * 0.3);
  c.font = `700 ${lh * 0.36}px ${UI_FONT}`;
  c.fillText('Sticker Album', w * 0.54, ly + lh * 0.68);
  // portrait
  const ps = w * 0.5, py = h * 0.4;
  c.fillStyle = '#ffffff';
  c.save();
  c.translate(w * 0.54, py + ps / 2);
  c.rotate(-0.05);
  roundRect(c, -ps / 2 - 7, -ps / 2 - 7, ps + 14, ps + 14, 16);
  c.fill();
  if (ICON && ICON.complete && ICON.naturalWidth) c.drawImage(ICON, -ps / 2, -ps / 2, ps, ps);
  c.restore();
  drawEmoji(c, '⭐', w * 0.25, h * 0.86, h * 0.05, 'sticker', -0.3);
  drawEmoji(c, '🌼', w * 0.83, h * 0.84, h * 0.055, 'sticker', 0.25);
  c.restore();
}

function drawOwner(c, w, h) {
  // lining: polka dots
  c.fillStyle = 'rgba(231, 111, 81, 0.16)';
  const st = w / 9;
  for (let y = st / 2, row = 0; y < h; y += st, row++) for (let x = (row % 2 ? st : st / 2); x < w; x += st) {
    c.beginPath();
    c.arc(x, y, st * 0.16, 0, Math.PI * 2);
    c.fill();
  }
  const cw = w * 0.7, ch = h * 0.56, cx = w / 2, cy = h * 0.5;
  c.save();
  c.translate(cx, cy);
  c.rotate(-0.04);
  c.fillStyle = '#fffdf5';
  c.shadowColor = 'rgba(60, 40, 20, 0.25)';
  c.shadowBlur = 8;
  c.shadowOffsetY = 3;
  roundRect(c, -cw / 2, -ch / 2, cw, ch, 14);
  c.fill();
  c.shadowColor = 'transparent';
  c.fillStyle = 'rgba(91, 74, 58, 0.7)';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `600 ${ch * 0.065}px ${UI_FONT}`;
  c.fillText('This album belongs to', 0, -ch * 0.38);
  const ps = ch * 0.5;
  if (ICON && ICON.complete && ICON.naturalWidth) c.drawImage(ICON, -ps / 2, -ch * 0.3, ps, ps);
  c.fillStyle = INK;
  c.font = `700 ${ch * 0.13}px ${UI_FONT}`;
  c.fillText('Hopper', 0, ch * 0.34);
  c.restore();
}

// hat slots on the front spread's right page (page coordinates)
function frontHats(w, h) {
  const hats = SPREADS.filter((s) => s.hat);
  const r = h * 0.07, gap = r * 2.8;
  return hats.map((s, i) => ({ hat: s.hat, x: w / 2 + (i - (hats.length - 1) / 2) * gap, y: h * 0.3, r }));
}

function drawHats(c, w, h) {
  c.fillStyle = INK;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.font = `700 ${h * 0.055}px ${UI_FONT}`;
  c.fillText('Hats', w / 2, h * 0.12);
  const have = album.hats();
  for (const s of frontHats(w, h)) {
    const got = have.includes(s.hat), on = album.hat === s.hat;
    c.fillStyle = on ? 'rgba(59, 206, 172, 0.25)' : 'rgba(91, 74, 58, 0.08)';
    c.beginPath();
    c.arc(s.x, s.y, s.r * 1.25, 0, Math.PI * 2);
    c.fill();
    if (on) {
      c.strokeStyle = '#3bceac';
      c.lineWidth = 4;
      c.stroke();
    }
    if (got) drawEmoji(c, s.hat, s.x, s.y, s.r, 'sticker');
    else drawEmoji(c, s.hat, s.x, s.y, s.r, 'outline', 0, 0.5);
  }
  c.font = `600 ${h * 0.032}px ${UI_FONT}`;
  c.fillStyle = 'rgba(91, 74, 58, 0.6)';
  c.fillText(have.length ? 'tap a hat to wear it' : 'fill a page to win a hat', w / 2, h * 0.43);
  // pages
  c.fillStyle = INK;
  c.font = `700 ${h * 0.055}px ${UI_FONT}`;
  c.fillText('Pages', w / 2, h * 0.55);
  let y = h * 0.64;
  SPREADS.forEach((sp, si) => {
    if (sp.kind !== 'scene') return;
    const [n, of] = album.count(si);
    c.textAlign = 'left';
    c.font = `600 ${h * 0.04}px ${UI_FONT}`;
    c.fillStyle = INK;
    c.fillText(sp.title, w * 0.14, y);
    const bw = w * 0.32, bx = w * 0.54, bh = h * 0.026;
    c.fillStyle = 'rgba(91, 74, 58, 0.12)';
    roundRect(c, bx, y - bh / 2, bw, bh, bh / 2);
    c.fill();
    c.fillStyle = n === of ? '#3bceac' : '#ffbf3f';
    if (n) {
      roundRect(c, bx, y - bh / 2, Math.max(bh, (bw * n) / of), bh, bh / 2);
      c.fill();
    }
    c.textAlign = 'right';
    c.fillStyle = 'rgba(91, 74, 58, 0.75)';
    c.font = `600 ${h * 0.032}px ${UI_FONT}`;
    c.fillText(`${n}/${of}`, w * 0.94, y);
    y += h * 0.08;
  });
}

function drawSoon(c, side, w, h) {
  c.fillStyle = 'rgba(91, 74, 58, 0.08)';
  for (let i = 0; i < 4; i++) {
    const x = w * (0.25 + (i % 2) * 0.5), y = h * (0.35 + Math.floor(i / 2) * 0.32);
    c.setLineDash([8, 7]);
    c.strokeStyle = 'rgba(91, 74, 58, 0.18)';
    c.lineWidth = 3;
    roundRect(c, x - w * 0.13, y - w * 0.13, w * 0.26, w * 0.26, 14);
    c.stroke();
  }
  c.setLineDash([]);
  if (side === 'left') {
    drawEmoji(c, '🔒', w / 2, h * 0.5, h * 0.07, 'plain', 0, 0.8);
  } else {
    c.fillStyle = 'rgba(91, 74, 58, 0.6)';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `700 ${h * 0.05}px ${UI_FONT}`;
    c.fillText('More pages', w / 2, h * 0.46);
    c.fillText('coming soon', w / 2, h * 0.54);
  }
}

// ---------- scenes: drawn across a whole spread (w = both pages) ----------
const SCENES = {
  garden(c, w, h, t, alive) {
    const sky = c.createLinearGradient(0, 0, 0, h * 0.7);
    sky.addColorStop(0, '#bfe3ff');
    sky.addColorStop(1, '#f1f9ff');
    c.fillStyle = sky;
    c.fillRect(0, 0, w, h);
    // sun
    const sx = w * 0.92, sy = h * 0.13, sr = h * 0.06;
    c.save();
    c.translate(sx, sy);
    c.rotate(t * 0.15);
    c.strokeStyle = 'rgba(255, 196, 61, 0.7)';
    c.lineWidth = 4;
    c.lineCap = 'round';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      c.beginPath();
      c.moveTo(Math.cos(a) * sr * 1.35, Math.sin(a) * sr * 1.35);
      c.lineTo(Math.cos(a) * sr * 1.75, Math.sin(a) * sr * 1.75);
      c.stroke();
    }
    c.restore();
    c.fillStyle = '#ffd23f';
    c.beginPath();
    c.arc(sx, sy, sr, 0, Math.PI * 2);
    c.fill();
    // clouds
    cloud(c, w * 0.18 + Math.sin(t * 0.3) * 4, h * 0.19, h * 0.06);
    cloud(c, w * 0.58 + Math.sin(t * 0.25 + 2) * 6, h * 0.12, h * 0.04);
    if (alive) {
      c.strokeStyle = 'rgba(120, 170, 230, 0.6)';
      c.lineWidth = 2.5;
      for (let i = 0; i < 5; i++) {
        const x = w * 0.13 + i * h * 0.03, y = h * 0.26 + (((t * 1.4 + i * 0.37) % 1) * h * 0.2);
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x - 3, y + h * 0.025);
        c.stroke();
      }
    }
    // hills
    c.fillStyle = '#c8ecb0';
    c.beginPath();
    c.moveTo(0, h * 0.62);
    c.quadraticCurveTo(w * 0.2, h * 0.5, w * 0.42, h * 0.6);
    c.quadraticCurveTo(w * 0.7, h * 0.7, w, h * 0.56);
    c.lineTo(w, h);
    c.lineTo(0, h);
    c.fill();
    c.fillStyle = '#9edb7a';
    c.beginPath();
    c.moveTo(0, h * 0.76);
    c.quadraticCurveTo(w * 0.3, h * 0.68, w * 0.55, h * 0.76);
    c.quadraticCurveTo(w * 0.8, h * 0.83, w, h * 0.74);
    c.lineTo(w, h);
    c.lineTo(0, h);
    c.fill();
    // little fence on the far hill
    c.strokeStyle = 'rgba(255,255,255,0.85)';
    c.lineWidth = 3;
    for (let i = 0; i < 9; i++) {
      const x = w * 0.05 + i * w * 0.022, y = h * (0.6 - 0.04 * Math.sin((i / 9) * Math.PI));
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x, y - h * 0.05);
      c.stroke();
    }
    c.beginPath();
    c.moveTo(w * 0.05, h * 0.575);
    c.quadraticCurveTo(w * 0.14, h * 0.53, w * 0.23, h * 0.575);
    c.stroke();
    // grass dots
    c.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 26; i++) {
      const x = ((i * 0.381) % 1) * w, y = h * (0.8 + ((i * 0.617) % 1) * 0.17);
      c.beginPath();
      c.arc(x, y, 2.2, 0, Math.PI * 2);
      c.fill();
    }
    // leaf for the caterpillar
    leaf(c, w * 0.31, h * 0.73, h * 0.09, -0.15, '#6fc24a');
    c.strokeStyle = '#4f9a2a';
    c.lineWidth = 4;
    c.beginPath();
    c.moveTo(w * 0.33, h * 0.75);
    c.quadraticCurveTo(w * 0.34, h * 0.82, w * 0.33, h * 0.88);
    c.stroke();
    // seed bed
    c.fillStyle = '#a0704a';
    c.beginPath();
    c.ellipse(w * 0.4, h * 0.91, h * 0.1, h * 0.035, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#7d5434';
    for (let i = 0; i < 4; i++) {
      c.beginPath();
      c.arc(w * 0.4 + (i - 1.5) * h * 0.04, h * 0.915, 2.5, 0, Math.PI * 2);
      c.fill();
    }
    // sunflower stem
    c.strokeStyle = '#4f9a2a';
    c.lineWidth = 6;
    c.beginPath();
    c.moveTo(w * 0.63, h * 0.42);
    c.quadraticCurveTo(w * 0.645, h * 0.6, w * 0.63, h * 0.82);
    c.stroke();
    leaf(c, w * 0.65, h * 0.6, h * 0.05, 0.5, '#6fc24a');
    leaf(c, w * 0.61, h * 0.68, h * 0.05, Math.PI - 0.5, '#6fc24a');
    // bee path
    c.setLineDash([3, 8]);
    c.strokeStyle = 'rgba(91, 74, 58, 0.35)';
    c.lineWidth = 2.5;
    c.beginPath();
    c.ellipse(w * 0.8, h * 0.31, h * 0.13, h * 0.06, -0.2, Math.PI * 0.6, Math.PI * 2.3);
    c.stroke();
    c.setLineDash([]);
    // bush for the blossom
    c.fillStyle = '#5fb43f';
    for (const [dx, dy, rr] of [[-0.06, 0.03, 0.07], [0.05, 0.03, 0.065], [0, -0.02, 0.08], [0.08, 0.07, 0.05], [-0.08, 0.08, 0.05]]) {
      c.beginPath();
      c.arc(w * 0.89 + dx * h, h * 0.66 + dy * h, rr * h, 0, Math.PI * 2);
      c.fill();
    }
    // stump for the honey
    const tx = w * 0.73, ty = h * 0.89;
    c.fillStyle = '#9a6a3f';
    roundRect(c, tx - h * 0.07, ty - h * 0.03, h * 0.14, h * 0.08, 8);
    c.fill();
    c.fillStyle = '#c99566';
    c.beginPath();
    c.ellipse(tx, ty - h * 0.03, h * 0.07, h * 0.022, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#9a6a3f';
    c.lineWidth = 1.5;
    c.beginPath();
    c.ellipse(tx, ty - h * 0.03, h * 0.035, h * 0.011, 0, 0, Math.PI * 2);
    c.stroke();
    // little flowers
    for (const [u, v, col] of [[0.08, 0.86, '#ff8fab'], [0.2, 0.93, '#ffd23f'], [0.5, 0.95, '#ffffff'], [0.56, 0.85, '#ff8fab'], [0.95, 0.9, '#ffd23f']]) {
      c.fillStyle = col;
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        c.beginPath();
        c.arc(u * w + Math.cos(a) * 4.5, v * h + Math.sin(a) * 4.5, 3.6, 0, Math.PI * 2);
        c.fill();
      }
      c.fillStyle = '#f4a63a';
      c.beginPath();
      c.arc(u * w, v * h, 3, 0, Math.PI * 2);
      c.fill();
    }
  },
};

function cloud(c, x, y, r) {
  c.fillStyle = '#ffffff';
  c.beginPath();
  c.arc(x - r * 0.9, y + r * 0.2, r * 0.7, 0, Math.PI * 2);
  c.arc(x, y - r * 0.1, r, 0, Math.PI * 2);
  c.arc(x + r * 0.95, y + r * 0.2, r * 0.65, 0, Math.PI * 2);
  c.fill();
  c.fillRect(x - r * 0.9, y + r * 0.2, r * 1.85, r * 0.7);
}

function leaf(c, x, y, r, rot, col) {
  c.save();
  c.translate(x, y);
  c.rotate(rot);
  c.fillStyle = col;
  c.beginPath();
  c.moveTo(-r * 1.4, 0);
  c.quadraticCurveTo(0, -r * 0.9, r * 1.4, 0);
  c.quadraticCurveTo(0, r * 0.9, -r * 1.4, 0);
  c.fill();
  c.strokeStyle = 'rgba(40, 90, 20, 0.45)';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(-r * 1.2, 0);
  c.lineTo(r * 1.2, 0);
  c.stroke();
  c.restore();
}

function pill(ctx, b, text, bg, fg, dx = 0) {
  ctx.save();
  ctx.translate(dx, 0);
  ctx.fillStyle = 'rgba(30, 20, 50, 0.25)';
  roundRect(ctx, b.x, b.y + 4, b.w, b.h, Math.min(b.h / 2, 18));
  ctx.fill();
  ctx.fillStyle = bg;
  roundRect(ctx, b.x, b.y, b.w, b.h, Math.min(b.h / 2, 18));
  ctx.fill();
  ctx.fillStyle = fg;
  ctx.font = `700 ${b.h * 0.46}px ${UI_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, b.x + b.w / 2, b.y + b.h / 2 + 1);
  ctx.restore();
}

const inRect = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;

export function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// A cartoon pointing hand; (x, y) is the fingertip. press 0..1 squashes it.
export function drawHand(ctx, x, y, press = 0, alpha = 1, size = 40) {
  const s = clamp(size / 40, 0.6, 1.4) * (1 - press * 0.12);
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.rotate(-0.35);
  if (press > 0.2) {
    ctx.strokeStyle = `rgba(255,255,255,${0.8 * press})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 14 + press * 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  // finger
  ctx.moveTo(-8, 4);
  ctx.lineTo(-8, 34);
  ctx.lineTo(8, 34);
  ctx.lineTo(8, 4);
  ctx.arc(0, 4, 8, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  roundRect(ctx, -18, 26, 44, 40, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.fillRect(-5, 24, 10, 8);
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(8, 38);
  ctx.lineTo(8, 46);
  ctx.moveTo(17, 38);
  ctx.lineTo(17, 46);
  ctx.stroke();
  ctx.restore();
}
