// Hopper himself: a squishy frog-ish blob with a wide mouth and a long sticky tongue.
// Pure presentation: reads the sim's character, never changes it.
import { R } from './sim.js';
import { spring, clamp, lerp, ease, rand } from './fx.js';

const C = {
  body: '#93d64f',
  bodyLight: '#b8ec74',
  bodyDark: '#4f9a2a',
  outline: '#21401a',
  belly: '#dcf7a8',
  mouth: '#6b1230',
  tongue: '#ff6f9c',
  tongueDark: '#b8325f',
  cheek: 'rgba(255, 92, 150, 0.62)',
};

export class Blob {
  constructor() {
    this.reset(0, 0);
  }

  reset(x, y) {
    this.X = x;
    this.Y = y;
    this.vx = this.vy = 0;
    this.q = 1; // squash: <1 squashed, >1 stretched (vertical)
    this.vq = 0;
    this.ang = 0;
    this.vang = 0;
    this.face = 1;
    this.fs = 1;
    this.sx = this.sy = 1;
    this.st = 1; // stretch along velocity
    this.sa = 0;
    this.pupX = this.pupY = 0;
    this.blinkT = 2;
    this.blinkP = 1;
    this.mood = 'idle';
    this.moodT = 0;
    this.mouth = 0;
    this.tongue = { pin: null, ext: 0, rel: 0, rx: 0, ry: 0, whip: 0 };
    this.walkPh = 0;
    this.t = rand(0, 10);
    this.wob = 0;
    this.lick = 0;
    this.lickT = 5;
    this.ox = 0;
    this.oy = 0;
    this.bob = 0;
    this.state = 'stand';
    this.scale = 1;
    this.alpha = 1;
  }

  // --- reactions (called by the game on sim events) ---
  squash(amount) {
    this.vq -= amount; // negative velocity squashes
    this.wob = Math.min(1.5, this.wob + amount * 0.08);
  }

  stretch(amount) {
    this.vq += amount;
  }

  setMood(m, dur = 0.8) {
    this.mood = m;
    this.moodT = dur;
  }

  grab(pin) {
    const tg = this.tongue;
    if (tg.pin && tg.pin !== pin) this.release();
    if (tg.pin === pin) return;
    tg.pin = pin;
    tg.ext = 0;
    tg.whip = 1;
  }

  release() {
    const tg = this.tongue;
    if (!tg.pin) return false;
    const tip = this.tip();
    tg.rx = tip.x;
    tg.ry = tip.y;
    tg.rel = 1;
    tg.pin = null;
    return true;
  }

  // --- simulation of the look ---
  update(dt, ch, look) {
    this.t += dt;
    const nx = ch.x + this.ox, ny = ch.y + this.oy;
    let ivx = (nx - this.X) / Math.max(dt, 1e-4), ivy = (ny - this.Y) / Math.max(dt, 1e-4);
    if (Math.hypot(nx - this.X, ny - this.Y) > 200) ivx = ivy = 0;
    const k = 1 - Math.exp(-dt * 18);
    this.vx = lerp(this.vx, ivx, k);
    this.vy = lerp(this.vy, ivy, k);
    this.X = nx;
    this.Y = ny;
    const st = ch.state;
    this.state = st;

    // squash spring (jelly)
    let tq = 1;
    if (st === 'stand' || st === 'won' || st === 'hang') tq = 1 + 0.035 * Math.sin(this.t * 3.1);
    [this.q, this.vq] = spring(this.q, tq, this.vq, 420, 10, dt);
    this.q = clamp(this.q, 0.45, 1.7);
    this.wob = Math.max(0, this.wob - dt * 1.2);

    // waddle
    if (st === 'walk') {
      const prev = this.walkPh;
      this.walkPh += dt * 15;
      if (Math.floor(prev / Math.PI) !== Math.floor(this.walkPh / Math.PI)) {
        this.vq -= 2.2;
        this.onStep && this.onStep();
      }
    } else this.walkPh = 0;
    const bobT = st === 'walk' ? Math.abs(Math.sin(this.walkPh)) * 7 : 0;
    this.bob = lerp(this.bob, bobT, 1 - Math.exp(-dt * 30));

    // tilt
    let ta = 0;
    const pin = ch.pin;
    const attached = pin && (st === 'hang' || st === 'swing' || st === 'travel');
    // on the tongue, face the pin's side (a little twirl as a swing passes under it)
    let ft = ch.face;
    if (attached) {
      const dx = pin.x - ch.x;
      if (this.attFace == null) this.attFace = ch.face;
      if (Math.abs(dx) > 25) this.attFace = Math.sign(dx);
      ft = this.attFace;
    } else this.attFace = null;
    if (attached) {
      // body hangs below the tongue, tilted back so the face looks up at the pin
      ta = Math.atan2(pin.x - ch.x, -(pin.y - ch.y)) - ft * 0.5;
      if (st === 'travel') ta *= 0.8;
    } else if (st === 'air' || st === 'dead') ta = clamp(this.vx / 1700, -0.5, 0.5);
    else if (st === 'walk') ta = Math.sin(this.walkPh) * 0.1 + ch.face * 0.06;
    [this.ang, this.vang] = spring(this.ang, ta, this.vang, st === 'swing' ? 500 : 240, st === 'swing' ? 26 : 13, dt);

    // stretch along velocity in flight
    const sp = Math.hypot(this.vx, this.vy);
    const tst = st === 'air' || st === 'travel' || st === 'dead' ? 1 + clamp((sp - 150) / 2600, 0, 0.42) : 1;
    this.st = lerp(this.st, tst, 1 - Math.exp(-dt * 20));
    if (sp > 60) this.sa = Math.atan2(this.vy, this.vx);

    // facing flip (thin in the middle of a turn)
    this.face += (ft - this.face) * (1 - Math.exp(-dt * 14));
    this.fs = Math.sign(this.face || 1) * Math.max(0.18, Math.abs(this.face));
    this.sy = this.q;
    this.sx = 1 / Math.pow(this.q, 0.85);

    // eyes
    let lx = 0, ly = 0;
    if (look) {
      const dx = look.x - this.X, dy = look.y - (this.Y - 40);
      const c = Math.cos(this.ang), s = Math.sin(this.ang);
      lx = (dx * c + dy * s) * Math.sign(this.fs);
      ly = -dx * s + dy * c;
      const d = Math.hypot(lx, ly) || 1;
      const m = Math.min(1, d / 120) * 4.6;
      lx = (lx / d) * m;
      ly = (ly / d) * m;
    } else if (st === 'air') ly = this.vy > 0 ? 3.5 : -3;
    this.pupX = lerp(this.pupX, lx, 1 - Math.exp(-dt * 16));
    this.pupY = lerp(this.pupY, ly, 1 - Math.exp(-dt * 16));
    this.blinkT -= dt;
    if (this.blinkT <= 0) {
      this.blinkP = 0;
      this.blinkT = rand(1.8, 4.5);
      if (Math.random() < 0.2) this.blinkT = 0.25; // double blink
    }
    this.blinkP = Math.min(1, this.blinkP + dt / 0.17);
    if (this.moodT > 0) {
      this.moodT -= dt;
      if (this.moodT <= 0) this.mood = 'idle';
    }

    // tongue
    const tg = this.tongue;
    if (tg.pin) tg.ext = Math.min(1, tg.ext + dt / 0.1);
    else if (tg.rel > 0) tg.rel = Math.max(0, tg.rel - dt / 0.14);
    tg.whip = Math.max(0, tg.whip - dt * 3);

    // idle lip-lick
    if (st === 'stand' && !tg.pin && tg.rel === 0 && this.mood === 'idle') {
      this.lickT -= dt;
      if (this.lickT <= 0) {
        this.lick = 0.0001;
        this.lickT = rand(3.5, 7);
      }
    }
    if (this.lick > 0) {
      this.lick += dt / 0.55;
      if (this.lick >= 1) this.lick = 0;
    }

    // mouth
    let tm = 0;
    if (tg.pin || tg.rel > 0) tm = 0.9;
    else if (this.mood === 'happy' || st === 'won') tm = 0.85;
    else if (this.mood === 'scared' || st === 'dead') tm = 0.7;
    else if (this.lick > 0) tm = 0.45;
    else if (st === 'air') tm = this.vy < 0 ? 0.55 : 0.35;
    this.mouth = lerp(this.mouth, tm, 1 - Math.exp(-dt * 22));
  }

  // local body point -> world
  toWorld(lx, ly) {
    let x = lx * this.fs * this.sx * this.scale, y = ((ly - R) * this.sy + R) * this.scale;
    const c = Math.cos(this.ang), s = Math.sin(this.ang);
    [x, y] = [x * c - y * s, x * s + y * c];
    if (this.st !== 1) {
      const ca = Math.cos(this.sa), sa = Math.sin(this.sa);
      let u = x * ca + y * sa, v = -x * sa + y * ca;
      u *= this.st;
      v /= this.st;
      x = u * ca - v * sa;
      y = u * sa + v * ca;
    }
    return { x: x + this.X, y: y + this.Y - this.bob };
  }

  mouthPos() {
    return this.toWorld(8, -6 + 12 * this.mouth);
  }

  tip() {
    const tg = this.tongue, m = this.mouthPos();
    if (tg.pin) {
      const e = ease.backOut(tg.ext);
      return { x: lerp(m.x, tg.pin.cx, e), y: lerp(m.y, tg.pin.cy, e) };
    }
    if (tg.rel > 0) {
      const e = tg.rel * tg.rel;
      return { x: lerp(m.x, tg.rx, e), y: lerp(m.y, tg.ry, e) };
    }
    return m;
  }

  // --- drawing (world space) ---
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha *= this.alpha;
    ctx.translate(this.X, this.Y - this.bob);
    if (this.st !== 1) {
      ctx.rotate(this.sa);
      ctx.scale(this.st, 1 / this.st);
      ctx.rotate(-this.sa);
    }
    ctx.rotate(this.ang);
    ctx.scale(this.scale, this.scale);
    ctx.translate(0, R);
    ctx.scale(this.fs * this.sx, this.sy);
    ctx.translate(0, -R);
    this.drawBody(ctx);
    ctx.restore();
    this.drawTongue(ctx);
  }

  bodyPath(ctx) {
    const N = 20, t = this.t, w = this.wob;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const c = Math.cos(a), s = Math.sin(a);
      const j = 1 + w * 0.06 * Math.sin(a * 3 + t * 11) + 0.015 * Math.sin(a * 2 - t * 2.7);
      let px, py;
      if (s > 0) {
        px = c * (41 + 6 * s) * j;
        py = -9 + 36 * Math.pow(s, 0.55);
      } else {
        px = c * 41 * j;
        py = -9 + 43 * s * j;
      }
      pts.push([px, py]);
    }
    ctx.beginPath();
    const m0x = (pts[N - 1][0] + pts[0][0]) / 2, m0y = (pts[N - 1][1] + pts[0][1]) / 2;
    ctx.moveTo(m0x, m0y);
    for (let i = 0; i < N; i++) {
      const p = pts[i], n = pts[(i + 1) % N];
      ctx.quadraticCurveTo(p[0], p[1], (p[0] + n[0]) / 2, (p[1] + n[1]) / 2);
    }
    ctx.closePath();
  }

  drawBody(ctx) {
    const E1 = { x: -13, y: -45, r: 15 }, E2 = { x: 16, y: -47, r: 16 };
    const bump = (e) => {
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    };
    // outline pass then fill pass = one merged silhouette
    ctx.lineJoin = 'round';
    ctx.lineWidth = 7;
    ctx.strokeStyle = C.outline;
    this.bodyPath(ctx);
    ctx.stroke();
    bump(E1);
    ctx.stroke();
    bump(E2);
    ctx.stroke();
    const g = ctx.createLinearGradient(0, -60, 0, 30);
    g.addColorStop(0, C.bodyLight);
    g.addColorStop(0.55, C.body);
    g.addColorStop(1, C.bodyDark);
    ctx.fillStyle = g;
    this.bodyPath(ctx);
    ctx.fill();
    bump(E1);
    ctx.fill();
    bump(E2);
    ctx.fill();

    // belly + gloss
    ctx.save();
    this.bodyPath(ctx);
    ctx.clip();
    ctx.fillStyle = C.belly;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(6, 14, 27, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.ellipse(-26, -22, 5, 9, 0.5, 0, Math.PI * 2);
    ctx.fill();

    this.drawEye(ctx, E1, 11, 0);
    this.drawEye(ctx, E2, 12, 1);

    // cheeks
    ctx.fillStyle = C.cheek;
    ctx.beginPath();
    ctx.ellipse(-31, 0, 7, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(38, -4, 4.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    this.drawMouth(ctx);
  }

  drawEye(ctx, e, r, i) {
    const cx = e.x, cy = e.y - 1;
    const mood = this.mood;
    if (mood === 'happy' || this.state === 'won') {
      ctx.strokeStyle = C.outline;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy + 4, r * 0.65, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      return;
    }
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = C.outline;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.clip();
    if (mood === 'dizzy' || this.state === 'dead') {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      const rot = this.t * 12 * (i ? 1 : -1);
      for (let k = 0; k < 28; k++) {
        const a = rot + k * 0.45, rr = k * 0.32;
        ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      ctx.stroke();
    } else {
      const pr = mood === 'scared' ? 3.2 : 5.6 + i * 0.4;
      const px = cx + this.pupX, py = cy + this.pupY;
      ctx.fillStyle = '#1b1b2a';
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(px - pr * 0.35, py - pr * 0.4, pr * 0.38, 0, Math.PI * 2);
      ctx.fill();
    }
    // lids: blink, sad droop
    let lid = this.blinkP < 1 ? Math.sin(this.blinkP * Math.PI) : 0;
    if (mood === 'sad') lid = Math.max(lid, 0.45);
    if (this.state === 'hang' || this.state === 'swing') lid = Math.max(lid, 0.12);
    if (lid > 0.01) {
      ctx.fillStyle = C.body;
      const top = cy - r - 1;
      if (mood === 'sad') {
        ctx.beginPath();
        const tilt = i ? -1 : 1;
        ctx.moveTo(cx - r - 2, top);
        ctx.lineTo(cx + r + 2, top);
        ctx.lineTo(cx + r + 2, top + lid * 2 * r - tilt * 4);
        ctx.lineTo(cx - r - 2, top + lid * 2 * r + tilt * 4);
        ctx.fill();
      } else ctx.fillRect(cx - r - 2, top, 2 * r + 4, lid * 2 * r + 1);
      ctx.strokeStyle = C.outline;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - r, top + lid * 2 * r + 0.5);
      ctx.lineTo(cx + r, top + lid * 2 * r + 0.5);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = C.outline;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawMouth(ctx) {
    const o = this.mouth;
    const Lx = -29, Ly = -9, Rx = 37, Ry = -15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = C.outline;
    if (this.mood === 'sad' && o < 0.2) {
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(Lx + 6, Ly + 2);
      ctx.quadraticCurveTo(10, -22, Rx - 6, Ry + 2);
      ctx.stroke();
      return;
    }
    if (o < 0.06) {
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(Lx, Ly);
      ctx.quadraticCurveTo(6, 10, Rx, Ry);
      ctx.stroke();
      // dimples
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(Lx - 3, Ly - 4);
      ctx.quadraticCurveTo(Lx - 1, Ly + 1, Lx + 2, Ly + 2);
      ctx.moveTo(Rx + 3, Ry - 4);
      ctx.quadraticCurveTo(Rx + 1, Ry + 1, Rx - 2, Ry + 2);
      ctx.stroke();
      return;
    }
    const mouthPath = () => {
      ctx.beginPath();
      ctx.moveTo(Lx, Ly);
      ctx.quadraticCurveTo(5, -9 + 6 * (1 - o), Rx, Ry);
      ctx.quadraticCurveTo(8, 2 + 40 * o, Lx, Ly);
      ctx.closePath();
    };
    mouthPath();
    ctx.fillStyle = C.mouth;
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = C.tongue;
    ctx.beginPath();
    ctx.ellipse(8, 2 + 18 * o, 19, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    mouthPath();
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  drawTongue(ctx) {
    const tg = this.tongue;
    const m = this.mouthPos();
    if (this.lick > 0 && !tg.pin && tg.rel === 0) {
      // a little lip-lick
      const k = Math.sin(this.lick * Math.PI);
      const f = Math.sign(this.fs);
      const a = this.ang - 0.9 * f + this.lick * 1.6 * f;
      const len = 26 * k;
      const tx = m.x + Math.sin(a) * len * f, ty = m.y - Math.cos(a) * len * 0.6;
      this.strokeTongue(ctx, m.x, m.y, (m.x + tx) / 2 + 6 * f, (m.y + ty) / 2 + 6, tx, ty, 10, 7);
      return;
    }
    if (!tg.pin && tg.rel <= 0) return;
    const p = this.tip();
    const dx = p.x - m.x, dy = p.y - m.y;
    const d = Math.hypot(dx, dy) || 1;
    const nx = -dy / d, ny = dx / d;
    const wig = tg.pin ? Math.sin(this.t * 34) * 22 * tg.whip + Math.sin(this.t * 2.3) * 3 : Math.sin(this.t * 40) * 14 * tg.rel;
    // the tongue leaves the mouth forwards, then bends towards the pin (so it never crosses the eyes)
    const f = Math.sign(this.fs), ca = Math.cos(this.ang), sa = Math.sin(this.ang);
    const fx = f * ca + 0.35 * sa, fy = f * sa - 0.35 * ca;
    const k = clamp(d * 0.3, 8, 55);
    const cx = m.x + fx * k + nx * wig, cy = m.y + fy * k + ny * wig;
    const w = clamp(15 - d / 60, 9, 14);
    this.strokeTongue(ctx, m.x, m.y, cx, cy, p.x, p.y, w, w * 0.8);
  }

  strokeTongue(ctx, x0, y0, cx, cy, x1, y1, w, tipR) {
    ctx.lineCap = 'round';
    ctx.strokeStyle = C.tongueDark;
    ctx.lineWidth = w + 5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, x1, y1);
    ctx.stroke();
    ctx.fillStyle = C.tongueDark;
    ctx.beginPath();
    ctx.arc(x1, y1, tipR + 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = C.tongue;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, x1, y1);
    ctx.stroke();
    ctx.fillStyle = C.tongue;
    ctx.beginPath();
    ctx.arc(x1, y1, tipR, 0, Math.PI * 2);
    ctx.fill();
    // centre groove + shine
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = Math.max(2, w * 0.22);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(cx, cy, x1, y1);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(x1 - tipR * 0.3, y1 - tipR * 0.35, tipR * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}
