// The sticker album: slides in at a goal; the player drags the collected emoji stickers into the empty slots.
import { tween, ease, lerp, clamp, rand, burst, ring, confetti, emit } from './fx.js';
import { drawEmoji, UI_FONT } from './sprites.js';
import { sfx } from './audio.js';

const PAPER = '#fff8ea';
const INK = '#5b4a3a';

export class Album {
  // opts: { title, caption, parts, stickers (kind -> emoji), items: [{id, kind}], homeOf(i) -> {x,y} (screen), factMin, onDone, onPlace }
  constructor(opts) {
    this.o = opts;
    this.phase = 'in';
    this.t = 0;
    this.slide = 0;
    this.shakeX = 0;
    this.idle = 0;
    this.drag = null;
    this.sel = null;
    this.stamp = { s: 0, a: 0, rot: -0.2 };
    this.caption = { a: 0, y: 20 };
    this.closable = false;
    this.parts = opts.parts.map((p) => ({ kind: p.kind, u: p.at[0], v: p.at[1], slot: !!p.slot, filled: !p.slot, s: 1, rot: rand(-0.18, 0.18), shake: 0, glow: 0, x: 0, y: 0 }));
    this.items = opts.items.map((it, i) => ({ ...it, i, state: 'home', x: 0, y: 0, s: 1, rot: 0, vx: 0, tx: 0, ty: 0, fly: null }));
    this.hand = { t: 0, on: false };
    sfx.page();
    tween(this, { slide: 1 }, 0.55, { ease: ease.backOut, done: () => (this.phase = 'play') });
  }

  get done() {
    return this.phase === 'gone';
  }

  owns() {
    return this.phase !== 'gone';
  }

  layout(W, H) {
    const bx = W * 0.27 + (1 - this.slide) * W * 0.78 + this.shakeX;
    const bw = W - W * 0.27;
    const ax = bx + bw * 0.13, aw = bw * 0.8, ay = H * 0.2, ah = H * 0.54;
    const r = clamp(Math.min(aw, ah) * 0.13, 22, 62);
    this.g = { bx, bw, W, H, ax, aw, ay, ah, r };
    for (const p of this.parts) {
      p.x = ax + p.u * aw;
      p.y = ay + p.v * ah;
    }
  }

  homeOf(it) {
    return this.o.homeOf(it.i);
  }

  update(dt, W, H) {
    this.t += dt;
    this.layout(W, H);
    this.shakeX *= Math.exp(-dt * 18);
    for (const p of this.parts) {
      p.shake = Math.max(0, p.shake - dt * 2.4);
      p.glow = lerp(p.glow, 0, 1 - Math.exp(-dt * 8));
    }
    for (const it of this.items) {
      const h = this.homeOf(it);
      if (it.state === 'home' || it.state === 'sel') {
        const bobY = it.state === 'sel' ? Math.sin(this.t * 8) * 5 - 8 : Math.sin(this.t * 2.5 + it.i) * 3;
        it.x = lerp(it.x || h.x, h.x, 1 - Math.exp(-dt * 20));
        it.y = lerp(it.y || h.y, h.y + bobY, 1 - Math.exp(-dt * 20));
        it.rot = lerp(it.rot, it.state === 'sel' ? Math.sin(this.t * 6) * 0.15 : 0, 1 - Math.exp(-dt * 10));
      } else if (it.state === 'drag') {
        const nx = lerp(it.x, it.tx, 1 - Math.exp(-dt * 28));
        it.vx = lerp(it.vx, (nx - it.x) / Math.max(dt, 1e-4), 0.3);
        it.x = nx;
        it.y = lerp(it.y, it.ty, 1 - Math.exp(-dt * 28));
        it.rot = clamp(it.vx * 0.0009, -0.5, 0.5);
        const p = this.slotAt(it.x, it.y);
        if (p) p.glow = Math.min(1, p.glow + dt * 20);
      } else if (it.state === 'back' && it.fly) {
        it.fly.k = Math.min(1, it.fly.k + dt / 0.35);
        const e = ease.backOut(it.fly.k);
        it.x = lerp(it.fly.x, h.x, e);
        it.y = lerp(it.fly.y, h.y, e) - Math.sin(it.fly.k * Math.PI) * 40;
        it.rot = (1 - it.fly.k) * 0.6;
        if (it.fly.k >= 1) {
          it.state = 'home';
          it.fly = null;
        }
      }
    }
    if (this.phase === 'play') {
      this.idle += dt;
      this.hand.on = this.idle > 3.5 && !this.drag;
      if (this.hand.on) this.hand.t += dt;
      else this.hand.t = 0;
    } else this.hand.on = false;
  }

  slotAt(x, y) {
    let best = null, bd = this.g.r * 1.35;
    for (const p of this.parts) {
      if (!p.slot || p.filled) continue;
      const d = Math.hypot(p.x - x, p.y - y);
      if (d < bd) {
        bd = d;
        best = p;
      }
    }
    return best;
  }

  itemAt(x, y) {
    let best = null, bd = Math.max(44, this.g.r * 1.3);
    for (const it of this.items) {
      if (it.state !== 'home' && it.state !== 'sel') continue;
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
    if (this.phase === 'solved') {
      if (this.closable) this.close();
      return true;
    }
    if (this.phase !== 'play') return true;
    const it = this.itemAt(x, y);
    if (it) {
      if (this.sel && this.sel !== it) this.sel.state = 'home';
      this.drag = { it, x0: x, y0: y, moved: false, wasSel: it.state === 'sel' };
      it.state = 'drag';
      it.tx = x;
      it.ty = y - 10;
      sfx.pick();
      tween(it, { s: 1.3 }, 0.18, { ease: ease.backOut });
      return true;
    }
    if (this.sel) {
      const p = this.slotAt(x, y) || this.nearSlot(x, y);
      if (p) this.tryPlace(this.sel, p);
      else {
        this.sel.state = 'home';
        tween(this.sel, { s: 1 }, 0.2);
        this.sel = null;
      }
    }
    return true;
  }

  nearSlot(x, y) {
    for (const p of this.parts) if (p.slot && !p.filled && Math.hypot(p.x - x, p.y - y) < this.g.r * 1.8) return p;
    return null;
  }

  move(x, y) {
    const d = this.drag;
    if (!d) return;
    d.it.tx = x;
    d.it.ty = y - 10;
    if (Math.hypot(x - d.x0, y - d.y0) > 10) d.moved = true;
  }

  up(x, y) {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    const it = d.it;
    if (!d.moved) {
      // tap: select (tap again to deselect)
      if (d.wasSel) {
        it.state = 'home';
        this.sel = null;
        tween(it, { s: 1 }, 0.2);
      } else {
        it.state = 'sel';
        this.sel = it;
        tween(it, { s: 1.2 }, 0.2, { ease: ease.backOut });
      }
      return;
    }
    // judge by where the finger is, not where the (lagging) sticker has got to
    const p = this.slotAt(it.tx, it.ty) || this.slotAt(it.x, it.y);
    if (p) this.tryPlace(it, p);
    else this.sendHome(it);
  }

  sendHome(it) {
    it.state = 'back';
    it.fly = { x: it.x, y: it.y, k: 0 };
    if (this.sel === it) this.sel = null;
    tween(it, { s: 1 }, 0.3, { ease: ease.backOut });
  }

  tryPlace(it, p) {
    if (this.sel === it) this.sel = null;
    if (p.kind !== it.kind) {
      p.shake = 1;
      sfx.wrong();
      this.sendHome(it);
      return;
    }
    it.state = 'placing';
    const r = this.g.r;
    tween(it, { x: p.x, y: p.y, rot: p.rot, s: 1.5 }, 0.12, {
      ease: ease.cubicOut,
      done: () => {
        it.state = 'placed';
        p.filled = true;
        p.s = 1.55;
        tween(p, { s: 1 }, 0.55, { ease: ease.elasticOut });
        this.shakeX = 10;
        sfx.place();
        burst(p.x, p.y, 14, { kind: 'star', color: ['#ffd23f', '#ff8fab', '#fff', '#7bdff2'], speed: 420, size: r * 0.18, g: 300, screen: true, life: 0.7 });
        ring(p.x, p.y, { size: r * 0.8, size1: r * 2.2, color: '#ffd23f', width: 6, screen: true });
        this.o.onPlace && this.o.onPlace(it);
        if (this.parts.every((q) => q.filled)) this.solve();
      },
    });
  }

  solve() {
    this.phase = 'solved';
    const { bx, bw, H } = this.g;
    tween(this, {}, 0.25, {
      done: () => {
        sfx.solved();
        confetti(bx + bw * 0.3, H + 10, 40, { speed: 1200, spread: 0.5, angle: -Math.PI / 2 - 0.25 });
        confetti(bx + bw * 0.8, H + 10, 40, { speed: 1200, spread: 0.5, angle: -Math.PI / 2 + 0.25 });
        for (const p of this.parts) tween(p, { s: 1.2 }, 0.12, { done: () => tween(p, { s: 1 }, 0.4, { ease: ease.elasticOut }) });
        this.stamp = { s: 3, a: 0, rot: -0.35 };
        tween(this.stamp, { s: 1, a: 1, rot: -0.18 }, 0.2, {
          ease: ease.quadIn,
          delay: 0.35,
          done: () => {
            sfx.stamp();
            this.shakeX = 18;
            const sp = this.stampPos();
            burst(sp.x, sp.y, 16, { kind: 'puff', color: 'rgba(200,60,60,0.35)', speed: 260, size: 10, g: 0, drag: 5, screen: true });
          },
        });
      },
    });
    tween(this.caption, { a: 1, y: 0 }, 0.45, {
      delay: 0.9,
      ease: ease.backOut,
      done: () => tween({}, {}, this.o.factMin, { done: () => (this.closable = true) }),
    });
  }

  stampPos() {
    const { bx, bw, H } = this.g;
    return { x: bx + bw * 0.83, y: H * 0.13 };
  }

  close() {
    if (this.phase === 'out' || this.phase === 'gone') return;
    this.phase = 'out';
    sfx.page();
    tween(this, { slide: 0 }, 0.4, { ease: ease.backIn, done: () => ((this.phase = 'gone'), this.o.onDone && this.o.onDone()) });
  }

  // ---------- drawing (screen space) ----------
  draw(ctx) {
    const { bx, bw, H, r } = this.g;
    if (this.slide <= 0.001) return;
    ctx.save();
    // dim the world a touch
    ctx.fillStyle = `rgba(30, 24, 50, ${0.18 * clamp(this.slide, 0, 1)})`;
    ctx.fillRect(0, 0, this.g.W, H);

    // page
    ctx.save();
    ctx.shadowColor = 'rgba(40, 30, 20, 0.35)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = -8;
    ctx.fillStyle = PAPER;
    roundRect(ctx, bx, -20, bw + 40, H + 40, 28);
    ctx.fill();
    ctx.restore();
    // paper dots
    ctx.save();
    roundRect(ctx, bx, -20, bw + 40, H + 40, 28);
    ctx.clip();
    ctx.fillStyle = 'rgba(160, 130, 90, 0.13)';
    const step = 26;
    for (let y = 12; y < H; y += step) for (let x = bx + 60; x < bx + bw; x += step) ctx.fillRect(x, y, 2.5, 2.5);
    // spine shade
    const gs = ctx.createLinearGradient(bx, 0, bx + 70, 0);
    gs.addColorStop(0, 'rgba(120, 90, 60, 0.28)');
    gs.addColorStop(1, 'rgba(120, 90, 60, 0)');
    ctx.fillStyle = gs;
    ctx.fillRect(bx, 0, 70, H);
    ctx.restore();
    // binding rings
    const nr = Math.max(4, Math.round(H / 90));
    for (let i = 0; i < nr; i++) {
      const y = (H * (i + 0.5)) / nr;
      ctx.fillStyle = '#d9cbb4';
      ctx.beginPath();
      ctx.arc(bx + 26, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#8b8f98';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(bx + 12, y, 15, -Math.PI * 0.45, Math.PI * 0.45, true);
      ctx.stroke();
      ctx.strokeStyle = '#dfe3ea';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx + 12, y - 1, 15, -Math.PI * 0.4, -Math.PI * 0.8, true);
      ctx.stroke();
    }

    // title
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const ts = clamp(H * 0.055, 18, 40);
    ctx.font = `700 ${ts}px ${UI_FONT}`;
    ctx.fillText(this.o.title, bx + bw * 0.12, H * 0.1);
    ctx.font = `600 ${ts * 0.5}px ${UI_FONT}`;
    ctx.fillStyle = 'rgba(91, 74, 58, 0.6)';
    ctx.fillText(this.o.subtitle || '', bx + bw * 0.12, H * 0.1 + ts * 0.85);

    this.drawLoop(ctx);

    // parts
    for (const p of this.parts) {
      const sx = Math.sin(p.shake * 30) * 10 * p.shake;
      if (p.filled) {
        ctx.save();
        ctx.shadowColor = 'rgba(60, 40, 20, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 4;
        drawEmoji(ctx, this.o.stickers[p.kind], p.x + sx, p.y, r * p.s, 'sticker', p.rot);
        ctx.restore();
      } else {
        const pulse = 1 + Math.sin(this.t * 4) * 0.04 + p.glow * 0.12;
        ctx.save();
        ctx.translate(p.x + sx, p.y);
        ctx.scale(pulse, pulse);
        if (p.glow > 0.05) {
          ctx.fillStyle = `rgba(255, 210, 63, ${0.35 * p.glow})`;
          roundRect(ctx, -r * 1.25, -r * 1.25, r * 2.5, r * 2.5, r * 0.45);
          ctx.fill();
        }
        ctx.setLineDash([9, 7]);
        ctx.lineDashOffset = -this.t * 20;
        ctx.strokeStyle = p.shake > 0 ? '#e5484d' : 'rgba(91, 74, 58, 0.55)';
        ctx.lineWidth = 3.5;
        roundRect(ctx, -r * 1.12, -r * 1.12, r * 2.24, r * 2.24, r * 0.4);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
        drawEmoji(ctx, this.o.stickers[p.kind], p.x + sx, p.y, r * 0.92, 'ghost', 0, 0.28);
      }
    }

    // stamp
    if (this.stamp.a > 0) {
      const sp = this.stampPos();
      ctx.save();
      ctx.globalAlpha = this.stamp.a;
      ctx.translate(sp.x, sp.y);
      ctx.rotate(this.stamp.rot);
      ctx.scale(this.stamp.s, this.stamp.s);
      const fs = clamp(H * 0.045, 16, 30);
      ctx.font = `800 ${fs}px ${UI_FONT}`;
      const w = ctx.measureText('COMPLETE!').width + fs * 1.6;
      ctx.strokeStyle = '#d64545';
      ctx.lineWidth = 4;
      roundRect(ctx, -w / 2, -fs * 0.95, w, fs * 1.9, 10);
      ctx.stroke();
      ctx.fillStyle = '#d64545';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★ COMPLETE!', 0, 2);
      ctx.restore();
    }

    // caption
    if (this.caption.a > 0) {
      ctx.save();
      ctx.globalAlpha = this.caption.a;
      const fs = clamp(H * 0.045, 15, 30);
      ctx.font = `600 ${fs}px ${UI_FONT}`;
      ctx.fillStyle = INK;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cx = bx + bw * 0.53, cy = H * 0.87 + this.caption.y;
      wrapText(ctx, this.o.caption, cx, cy, bw * 0.76, fs * 1.25);
      if (this.closable) {
        ctx.globalAlpha = this.caption.a * (0.55 + 0.45 * Math.sin(this.t * 5));
        ctx.font = `700 ${fs * 0.62}px ${UI_FONT}`;
        ctx.fillStyle = '#b08a5a';
        ctx.fillText('tap to continue', cx, H * 0.96);
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // draggable stickers + help hand, drawn on top of everything
  drawItems(ctx) {
    if (this.phase === 'gone') return;
    const r = this.g.r;
    const order = this.items.filter((it) => it.state !== 'placed').sort((a, b) => (a.state === 'drag') - (b.state === 'drag'));
    for (const it of order) {
      ctx.save();
      const lift = it.state === 'drag' ? 1 : 0;
      ctx.shadowColor = 'rgba(30, 20, 40, 0.35)';
      ctx.shadowBlur = 6 + lift * 14;
      ctx.shadowOffsetY = 3 + lift * 12;
      drawEmoji(ctx, this.o.stickers[it.kind], it.x, it.y, r * 0.78 * it.s, 'sticker', it.rot);
      ctx.restore();
    }
    if (this.hand.on) this.drawHand(ctx);
  }

  drawHand(ctx) {
    const it = this.items.find((i) => i.state === 'home' || i.state === 'sel');
    if (!it) return;
    const p = this.parts.find((q) => q.slot && !q.filled && q.kind === it.kind);
    if (!p) return;
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
    if (press > 0.5 && k > 0.15 && k < 0.85) drawEmoji(ctx, this.o.stickers[it.kind], x, y, this.g.r * 0.7, 'sticker', 0, 0.5);
    drawHand(ctx, x, y, press, a, this.g.r);
  }

  drawLoop(ctx) {
    const { ax, aw, ay, ah } = this.g;
    const cx = ax + aw / 2, cy = ay + ah / 2;
    const pts = this.parts.map((p) => [p.x, p.y]);
    const near = (u, v) => pts.some(([x, y]) => Math.hypot(x - (ax + u * aw), y - (ay + v * ah)) < aw * 0.15);
    if (!near(0.14, 0.5)) pts.push([ax + 0.14 * aw, ay + 0.5 * ah]);
    if (!near(0.86, 0.5)) pts.push([ax + 0.86 * aw, ay + 0.5 * ah]);
    pts.sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
    const n = pts.length;
    ctx.save();
    ctx.strokeStyle = 'rgba(176, 138, 90, 0.75)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.setLineDash([2, 12]);
    ctx.beginPath();
    const seg = 16;
    const curve = [];
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      for (let s = 0; s < seg; s++) {
        const t = s / seg, t2 = t * t, t3 = t2 * t;
        const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        curve.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    curve.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    // arrowheads halfway between points
    ctx.fillStyle = 'rgba(176, 138, 90, 0.9)';
    for (let i = 0; i < n; i++) {
      const j = i * seg + seg / 2;
      const [x, y] = curve[j], [x2, y2] = curve[(j + 1) % curve.length];
      const a = Math.atan2(y2 - y, x2 - x);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(9, 0);
      ctx.lineTo(-6, -7);
      ctx.lineTo(-6, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
}

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

function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  lines.push(line);
  const y0 = y - ((lines.length - 1) * lh) / 2;
  lines.forEach((l, i) => ctx.fillText(l, x, y0 + i * lh));
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
