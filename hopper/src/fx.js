// Juice toolkit: easing, tweens, springs, particles, screen shake.

export const ease = {
  linear: (t) => t,
  quadIn: (t) => t * t,
  quadOut: (t) => 1 - (1 - t) * (1 - t),
  cubicIn: (t) => t * t * t,
  cubicOut: (t) => 1 - Math.pow(1 - t, 3),
  cubicInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  sineInOut: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  backOut: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  backIn: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  elasticOut: (t) => (t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
  bounceOut: (t) => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---------- tweens ----------
// tween(obj, { x: 10, y: 5 }, 0.3, { ease: ease.backOut, delay: 0, done() {}, update(obj, k) {} })
const tweens = [];

export function tween(obj, to, dur, opt = {}) {
  const tw = { obj, to, from: null, dur: Math.max(1e-4, dur), t: -(opt.delay || 0), ease: opt.ease || ease.cubicOut, done: opt.done, update: opt.update, dead: false };
  tweens.push(tw);
  return tw;
}

// Kill running tweens on an object (optionally only those touching `key`).
export function killTweens(obj, key) {
  for (const tw of tweens) if (tw.obj === obj && (!key || key in tw.to)) tw.dead = true;
}

// Run a callback after a delay (game time).
export function after(sec, fn) {
  return tween({}, {}, 1e-4, { delay: sec, done: fn });
}

export function updateTweens(dt) {
  for (let i = 0; i < tweens.length; i++) {
    const tw = tweens[i];
    if (tw.dead) continue;
    tw.t += dt;
    if (tw.t < 0) continue;
    if (!tw.from) {
      tw.from = {};
      for (const k in tw.to) tw.from[k] = tw.obj[k];
    }
    const k = Math.min(1, tw.t / tw.dur);
    const e = tw.ease(k);
    for (const key in tw.to) tw.obj[key] = tw.from[key] + (tw.to[key] - tw.from[key]) * e;
    if (tw.update) tw.update(tw.obj, k);
    if (k >= 1) {
      tw.dead = true;
      if (tw.done) tw.done(tw.obj);
    }
  }
  let j = 0;
  for (let i = 0; i < tweens.length; i++) if (!tweens[i].dead) tweens[j++] = tweens[i];
  tweens.length = j;
}

export function clearTweens() {
  tweens.length = 0;
}

// ---------- springs ----------
export function spring(v, target, vel, k, damp, dt) {
  const a = (target - v) * k - vel * damp;
  vel += a * dt;
  return [v + vel * dt, vel];
}

// ---------- particles ----------
// kinds: dot, star, ring, confetti, emoji, spark, text, puff
export const particles = [];

export function emit(p) {
  const q = {
    x: 0, y: 0, vx: 0, vy: 0, g: 0, drag: 0, life: 0.6, size: 6, size1: null, color: '#fff', kind: 'dot',
    rot: 0, vr: 0, alpha: 1, screen: false, t: 0, ...p,
  };
  if (q.size1 == null) q.size1 = q.kind === 'ring' ? q.size * 4 : q.size * 0.2;
  particles.push(q);
  return q;
}

export function burst(x, y, n, opt = {}) {
  const sp = opt.speed || 300;
  for (let i = 0; i < n; i++) {
    const a = opt.angle != null ? opt.angle + rand(-(opt.spread ?? Math.PI), opt.spread ?? Math.PI) : rand(0, Math.PI * 2);
    const s = sp * rand(0.35, 1);
    emit({
      x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      g: opt.g ?? 600, drag: opt.drag ?? 2, life: rand(0.7, 1.2) * (opt.life || 0.6),
      size: rand(0.7, 1.3) * (opt.size || 6), size1: opt.size1, kind: opt.kind || 'dot',
      color: Array.isArray(opt.color) ? pick(opt.color) : opt.color || '#fff',
      rot: rand(0, 6.28), vr: rand(-10, 10), screen: !!opt.screen, emoji: opt.emoji,
    });
  }
}

export function ring(x, y, opt = {}) {
  emit({ x, y, kind: 'ring', size: opt.size || 10, size1: opt.size1 || 70, life: opt.life || 0.35, color: opt.color || '#fff', width: opt.width || 5, screen: !!opt.screen });
}

export function confetti(x, y, n, opt = {}) {
  const colors = ['#ff5d8f', '#ffd23f', '#3bceac', '#4d9de0', '#9b5de5', '#ff8c42'];
  for (let i = 0; i < n; i++) {
    const a = (opt.angle ?? -Math.PI / 2) + rand(-(opt.spread ?? 0.9), opt.spread ?? 0.9);
    const s = rand(0.4, 1) * (opt.speed || 900);
    emit({
      x: x + rand(-10, 10), y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 900, drag: 2.2,
      life: rand(1.4, 2.4), size: rand(7, 12), size1: rand(6, 10), kind: 'confetti', color: pick(colors),
      rot: rand(0, 6.28), vr: rand(-14, 14), screen: opt.screen !== false, flip: rand(0, 6.28),
    });
  }
}

export function updateParticles(dt) {
  let j = 0;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.t += dt;
    if (p.t >= p.life) continue;
    p.vy += p.g * dt;
    const d = Math.exp(-p.drag * dt);
    p.vx *= d;
    p.vy *= d;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.vr * dt;
    if (p.flip != null) p.flip += dt * 9;
    particles[j++] = p;
  }
  particles.length = j;
}

function star(ctx, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
}

export function drawParticles(ctx, screen, emojiSprite) {
  for (const p of particles) {
    if (p.screen !== screen) continue;
    const k = p.t / p.life;
    const size = p.size + (p.size1 - p.size) * (p.kind === 'ring' ? 1 - Math.pow(1 - k, 3) : k);
    const a = p.alpha * (p.kind === 'ring' ? 1 - k : k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1);
    if (a <= 0 || size <= 0) continue;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    switch (p.kind) {
      case 'ring':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = (p.width || 5) * (1 - k * 0.7);
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'star':
        ctx.fillStyle = p.color;
        star(ctx, size);
        ctx.fill();
        break;
      case 'confetti':
        ctx.fillStyle = p.color;
        ctx.scale(1, Math.cos(p.flip));
        ctx.fillRect(-p.size / 2, -p.size1 / 4, p.size, p.size1 / 2);
        break;
      case 'spark':
        ctx.strokeStyle = p.color;
        ctx.lineWidth = size * 0.5;
        ctx.lineCap = 'round';
        ctx.rotate(-p.rot + Math.atan2(p.vy, p.vx));
        ctx.beginPath();
        ctx.moveTo(-size * 1.6, 0);
        ctx.lineTo(size * 1.6, 0);
        ctx.stroke();
        break;
      case 'emoji':
        if (emojiSprite) {
          const im = emojiSprite(p.emoji);
          ctx.drawImage(im, -size, -size, size * 2, size * 2);
        }
        break;
      case 'text':
        ctx.rotate(-p.rot);
        ctx.font = `800 ${size}px Fredoka, ui-rounded, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = size * 0.22;
        ctx.strokeStyle = '#2b2d42';
        ctx.strokeText(p.text, 0, 0);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, 0, 0);
        break;
      case 'puff':
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        break;
      default:
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
  }
}

// ---------- screen shake (trauma) ----------
export const shake = { trauma: 0, x: 0, y: 0, r: 0 };

export function addShake(amount) {
  shake.trauma = Math.min(1, shake.trauma + amount);
}

export function updateShake(dt, mult = 1, time = 0) {
  shake.trauma = Math.max(0, shake.trauma - dt * 1.6);
  const s = shake.trauma * shake.trauma * mult;
  shake.x = 22 * s * Math.sin(time * 61.3 + 1.7) * Math.cos(time * 23.1);
  shake.y = 22 * s * Math.sin(time * 53.9 + 0.3) * Math.cos(time * 31.7 + 2);
  shake.r = 0.03 * s * Math.sin(time * 41.1);
}
