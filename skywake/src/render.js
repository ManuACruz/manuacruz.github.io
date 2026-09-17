// Canvas renderer. Reads sim state, never changes it.
import { W, H, WATER_Y, FACES, cellRect, validCell } from './layout.js';

const FACE_COLOR = { front: '#d9a066', sky: '#cfe3ee', water: '#7fb8d0', rear: '#c9c2b4', core: '#f0c75e' };
const EMOJI_FONT = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
const CLOUDS = [[0, 40, 26, 46], [140, 90, 20, 30], [260, 30, 30, 22], [80, 150, 18, 38], [300, 130, 22, 26]];

export function createRenderer(canvas, stage, sim) {
  const ctx = canvas.getContext('2d');
  const { DATA, S, LAST_LEG } = sim;
  const sprites = new Map();
  let skyGrad = null, seaGrad = null;

  function resize() {
    const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
    const cssW = Math.floor(W * scale), cssH = Math.floor(H * scale);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    stage.style.width = `${cssW}px`; stage.style.height = `${cssH}px`;
    stage.style.setProperty('--u', `${scale}px`);
    canvas.style.width = `${cssW}px`; canvas.style.height = `${cssH}px`;
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    sprites.clear();
    skyGrad = ctx.createLinearGradient(0, 0, 0, WATER_Y);
    skyGrad.addColorStop(0, '#79c3e8'); skyGrad.addColorStop(1, '#dbeef7');
    seaGrad = ctx.createLinearGradient(0, WATER_Y - 10, 0, H);
    seaGrad.addColorStop(0, '#3e97bd'); seaGrad.addColorStop(1, '#173544');
  }

  // Emoji text is the most expensive thing to draw on a phone: rasterise each emoji once per size.
  function emoji(str, x, y, size) {
    const key = `${str}@${size}`;
    let sp = sprites.get(key);
    if (!sp) {
      const px = canvas.width / W;
      const wl = size * 1.7, hl = size * 1.5;
      const c = document.createElement('canvas');
      c.width = Math.ceil(wl * px); c.height = Math.ceil(hl * px);
      const g = c.getContext('2d');
      g.scale(px, px);
      g.font = `${size}px ${EMOJI_FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000';
      g.fillText(str, wl / 2, hl / 2 + size * 0.05);
      sp = { c, wl, hl };
      sprites.set(key, sp);
    }
    ctx.drawImage(sp.c, x - sp.wl / 2, y - sp.hl / 2, sp.wl, sp.hl);
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function hpBar(x, y, w, hp, max, h = 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x, y, w, h);
    const p = Math.max(0, Math.min(1, hp / max));
    ctx.fillStyle = p > 0.5 ? '#6fd06f' : p > 0.25 ? '#f2b843' : '#f0503c';
    ctx.fillRect(x, y, w * p, h);
  }
  function label(str, x, y, size = 11, color = '#ffffff', align = 'center') {
    ctx.font = `bold ${size}px "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(15,30,37,0.8)'; ctx.strokeText(str, x, y);
    ctx.fillStyle = color; ctx.fillText(str, x, y);
  }

  function draw() {
    const G = sim.G;
    const clock = sim.clock;
    ctx.save();
    if (G && G.shake > 0) ctx.translate((Math.random() * 4 - 2) * G.shake, (Math.random() * 4 - 2) * G.shake);
    drawSky(G, clock);
    drawSea(G, clock);
    if (G) {
      drawPier(G, clock);
      drawLoot(G, clock);
      drawShip(G, clock);
      drawEnemies(G, clock);
      drawShots(G);
      drawEffects(G);
      drawHints(G, clock);
      drawTexts(G);
      drawBanner(G);
      drawHUD(G);
    }
    ctx.restore();
  }

  function drawSky(G, clock) {
    const sc = G ? G.scroll : clock;
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, WATER_Y);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    for (const [bx, y, r, sp] of CLOUDS) {
      const x = ((bx + sc * sp) % (W + 160)) - 80;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.8, r * 0.7, 0, 0, Math.PI * 2); ctx.ellipse(x + r, y - r * 0.4, r * 1.1, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    }
    if (G && G.dark > 0.01) { ctx.fillStyle = `rgba(40,30,70,${0.3 * G.dark})`; ctx.fillRect(0, 0, W, WATER_Y); }
  }
  function drawSea(G, clock) {
    const ph = (G ? G.scroll : clock) * 3 + clock * 0.6;
    ctx.fillStyle = seaGrad;
    ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, WATER_Y);
    for (let x = 0; x <= W; x += 8) ctx.lineTo(x, WATER_Y - 6 + Math.sin(x / 22 - ph) * 4);
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    if (G && G.dark > 0.01) { ctx.fillStyle = `rgba(5,15,40,${0.5 * G.dark})`; ctx.fillRect(0, WATER_Y - 12, W, H - WATER_Y + 12); }
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 8) { const y = WATER_Y - 6 + Math.sin(x / 22 - ph) * 4; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(0, WATER_Y - 4, W, 28);
  }
  function drawPier(G, clock) {
    const p = G.pier;
    if (p.p <= 0) return;
    const x = p.leaving ? p.p * 320 : -150 + 150 * p.p;
    const top = WATER_Y - 18;
    ctx.fillStyle = '#5a4030';
    for (let i = 0; i < 4; i++) ctx.fillRect(x + 12 + i * 38, top, 6, 60);
    ctx.fillStyle = '#8a6a48'; ctx.fillRect(x, top - 8, 150, 10);
    ctx.fillStyle = '#6f5238'; for (let i = 0; i < 12; i++) ctx.fillRect(x + i * 12.5, top - 8, 1.5, 10);
    ctx.fillStyle = '#5a4030'; ctx.fillRect(x + 122, top - 52, 5, 46);
    ctx.fillStyle = '#e5c16a'; ctx.beginPath(); ctx.arc(x + 124.5, top - 56, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(229,193,106,0.25)'; ctx.beginPath(); ctx.arc(x + 124.5, top - 56, 16 + Math.sin(clock * 4) * 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3b2a18'; ctx.fillRect(x + 28, top - 40, 64, 20);
    label(`DOCK ${Math.min(G.leg, LAST_LEG - 1)}`, x + 60, top - 30, 11, '#f3e2cf');
  }

  function drawShip(G, clock) {
    const mode = sim.mode;
    const d = G.dock;
    const mover = mode === 'dock' ? (d.placing ? d.placing.def : d.moving ? d.moving.def : null) : null;
    ctx.strokeStyle = '#5a4030'; ctx.lineWidth = 3; ctx.setLineDash([4, 3]);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const car = G.grid[r][c]; if (!car) continue;
      const a = sim.carCenter(car);
      const right = c < 2 && G.grid[r][c + 1], down = r < 2 && G.grid[r + 1][c];
      if (right) { const b = sim.carCenter(right); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      if (down) { const b = sim.carCenter(down); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }
    ctx.setLineDash([]);
    if (mode === 'sail') for (const car of G.cars) {
      if (!(car.def.collect_radius > 0 && FACES[car.row][car.col].includes('water'))) continue;
      const cx = sim.carCenter(car).x, r = car.def.collect_radius;
      ctx.strokeStyle = car.busy > 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - r, WATER_Y - 14); ctx.lineTo(cx - r, WATER_Y - 6); ctx.moveTo(cx + r, WATER_Y - 14); ctx.lineTo(cx + r, WATER_Y - 6); ctx.stroke();
    }
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const k = cellRect(c, r, clock);
      const car = G.grid[r][c];
      const faces = FACES[r][c];
      if (!car) {
        const glow = mover && validCell(mover, c, r);
        ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
        ctx.strokeStyle = glow ? '#e5964a' : 'rgba(60,40,20,0.35)';
        if (glow) { ctx.fillStyle = `rgba(229,150,74,${0.25 + 0.15 * Math.sin(clock * 6)})`; roundRect(k.x, k.y, k.w, k.h, 8); ctx.fill(); }
        roundRect(k.x, k.y, k.w, k.h, 8); ctx.stroke(); ctx.setLineDash([]);
        continue;
      }
      const cc = sim.carCenter(car);
      const y = cc.y - k.h / 2;
      const x = k.x + (car.recoil > 0 ? car.recoil * 3 : 0);
      const main = faces.includes('core') ? 'core' : faces.includes('water') ? 'water' : faces.includes('front') ? 'front' : faces.includes('sky') ? 'sky' : 'rear';
      ctx.fillStyle = FACE_COLOR[main];
      roundRect(x, y, k.w, k.h, 8); ctx.fill();
      if (faces.length === 2) { ctx.fillStyle = FACE_COLOR[faces[0] === main ? faces[1] : faces[0]]; ctx.globalAlpha = 0.5; roundRect(x, y, k.w, k.h / 2, 8); ctx.fill(); ctx.globalAlpha = 1; }
      if (car.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${car.flash * 2})`; roundRect(x, y, k.w, k.h, 8); ctx.fill(); }
      if (car.hp / car.def.hp < 0.35) {
        ctx.strokeStyle = 'rgba(40,20,10,0.7)'; ctx.lineWidth = 1.5; ctx.beginPath();
        const s = car.seed;
        ctx.moveTo(x + 8 + (s % 10), y + 4); ctx.lineTo(x + 22 + (s % 7), y + 18); ctx.lineTo(x + 14, y + 30);
        ctx.moveTo(x + k.w - 10, y + k.h - 14); ctx.lineTo(x + k.w - 22 - (s % 6), y + k.h - 26); ctx.lineTo(x + k.w - 30, y + k.h - 18);
        ctx.stroke();
      }
      const selected = mode === 'dock' && (d.selected === car || d.moving === car);
      const swapTarget = mode === 'dock' && d.moving && d.moving !== car && car.def.id !== 'engine' && validCell(d.moving.def, c, r) && validCell(car.def, d.moving.col, d.moving.row);
      ctx.strokeStyle = selected ? '#ffffff' : swapTarget ? '#e5964a' : '#3b2a18'; ctx.lineWidth = selected || swapTarget ? 3 : 2;
      roundRect(x, y, k.w, k.h, 8); ctx.stroke();
      if (mode === 'sail' && !car.def.auto && car.def.damage > 0 && car.cd <= 0 && G.enemies.some((en) => sim.canTarget(car, en))) {
        ctx.strokeStyle = `rgba(255,255,255,${0.45 + 0.35 * Math.sin(clock * 7)})`; ctx.lineWidth = 4;
        roundRect(x - 2, y - 2, k.w + 4, k.h + 4, 10); ctx.stroke();
      }
      emoji(car.def.emoji, x + k.w / 2, y + k.h / 2 - 4, 26);
      hpBar(x + 6, y + k.h - 9, k.w - 12, car.hp, car.def.hp);
      if (car.def.tier > 1) label('I'.repeat(car.def.tier), x + k.w - 8, y + 9, 10, '#ffffff', 'right');
      if (!car.def.auto && car.def.damage > 0) {
        const p = car.def.fire_rate ? 1 - Math.max(0, Math.min(1, car.cd / car.def.fire_rate)) : 1;
        ctx.strokeStyle = p >= 1 ? '#ffffff' : 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x + 9, y + 9, 5, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); ctx.stroke();
      }
    }
    const e = sim.engine();
    if (e && e.hp > 0) {
      const c = sim.carCenter(e);
      const px = c.x + 32, py = c.y + 6, a = G.scroll * 22;
      ctx.fillStyle = '#3b2a18'; ctx.fillRect(px - 6, py - 3, 8, 6);
      ctx.strokeStyle = '#8a6a48'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) { const t = a + i * Math.PI * 2 / 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(t) * 2, py + Math.sin(t) * 9); ctx.stroke(); }
      ctx.lineCap = 'butt';
      ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.3 * G.speed})`;
      for (let i = 0; i < 3; i++) { const t = (G.scroll * 2 + i / 3) % 1; ctx.beginPath(); ctx.arc(c.x + 40 + t * 60 * (0.3 + 0.7 * G.speed), c.y + 20 - t * 8 + Math.sin(t * 9) * 3, 3 + t * 5, 0, Math.PI * 2); ctx.fill(); }
    }
  }

  function drawEnemies(G, clock) {
    for (const e of G.enemies) {
      if (e.gone) continue;
      const still = e.state === 'dive' || e.state === 'flee' || e.state === 'dash';
      const bob = still ? 0 : Math.sin(clock * 2.2 + e.seed) * 3;
      const size = 26 * e.def.size;
      if (e.aim && e.state === 'hold' && G.grid[e.aim.row][e.aim.col] === e.aim) {
        const c = sim.carCenter(e.aim);
        ctx.strokeStyle = 'rgba(240,80,60,0.45)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(e.x, e.y + bob); ctx.lineTo(c.x, c.y); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = `rgba(240,80,60,${0.2 + 0.2 * Math.sin(clock * 16)})`; ctx.beginPath(); ctx.arc(e.x, e.y + bob, size * 0.75, 0, Math.PI * 2); ctx.fill();
      }
      if (e.state === 'dive' && e.target) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 5]);
        ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.target.x, e.target.y - 10); ctx.stroke(); ctx.setLineDash([]);
      }
      if (e.kb > 0) { ctx.save(); ctx.translate(e.def.lane === 'sky' ? 0 : -6 * e.kb, e.def.lane === 'sky' ? -6 * e.kb : 0); }
      if (e.state === 'wind') {
        const p = e.windT / S.charge_wind_s;
        ctx.fillStyle = `rgba(240,80,60,${0.25 + 0.25 * Math.sin(clock * 14)})`; ctx.beginPath(); ctx.arc(e.x, e.y + bob, size * 0.8, 0, Math.PI * 2); ctx.fill();
        const bw = size * 1.2;
        ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(e.x - bw / 2, e.y + bob + size * 0.7, bw, 5);
        ctx.fillStyle = '#f0503c'; ctx.fillRect(e.x - bw / 2, e.y + bob + size * 0.7, bw * p, 5);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(e.x - bw / 2, e.y + bob + size * 0.7, bw * Math.min(1, e.charged / e.def.charge_break), 2);
      }
      if (e.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${e.flash * 3})`; ctx.beginPath(); ctx.arc(e.x, e.y + bob, size * 0.7, 0, Math.PI * 2); ctx.fill(); }
      emoji(e.def.emoji, e.x, e.y + bob, size);
      if (e.carry) emoji(e.carry.emoji, e.x + size * 0.4, e.y + bob + size * 0.45, 14);
      if (!e.leaving) hpBar(e.x - size * 0.6, e.y + bob - size * 0.75, size * 1.2, e.hp, e.maxHp, e.def.size >= 2 ? 6 : 4);
      if (e.def.armor > 0 && !e.leaving) label(`🛡${e.def.armor}`, e.x + size * 0.6, e.y + bob - size * 0.75 - 7, 9, '#ffffff', 'right');
      if (e.kb > 0) ctx.restore();
    }
  }
  function drawShots(G) {
    for (const s of G.shots) {
      const p = s.t / s.dur, x = s.x + (s.tx - s.x) * p, y = s.y + (s.ty - s.y) * p;
      ctx.strokeStyle = s.color; ctx.lineWidth = s.big ? 4 : 2; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(x - (s.tx - s.x) * 0.06, y - (s.ty - s.y) * 0.06); ctx.lineTo(x, y); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(x, y, s.big ? 5 : 3, 0, Math.PI * 2); ctx.fill();
    }
  }
  function drawLoot(G, clock) {
    for (const l of G.loot) {
      const bob = l.floating ? Math.sin(clock * 3 + l.seed) * 2 : 0;
      if (l.kind === 'car') {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(l.x, l.y + bob, 15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#f0503c'; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.arc(l.x, l.y + bob, 15, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        emoji(l.emoji, l.x, l.y + bob, 20);
      } else {
        if (l.floating && l.x > W - 56) ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(clock * 9));
        emoji(l.emoji, l.x, l.y + bob + (l.floating ? 4 : 0), 20);
        if (!l.netOk && l.floating) label('✋', l.x + 12, l.y + bob - 8, 10);
        ctx.globalAlpha = 1;
      }
    }
  }
  function drawEffects(G) {
    for (const s of G.sparks) {
      ctx.globalAlpha = 1 - s.t / 0.45; ctx.fillStyle = s.color;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const r of G.ripples) {
      const p = r.t / 0.4;
      ctx.strokeStyle = `rgba(255,255,255,${0.7 * (1 - p)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(r.x, r.y, 6 + p * 40, 0, Math.PI * 2); ctx.stroke();
    }
    const rt = G.reticle;
    if (rt && G.enemies.includes(rt.e)) {
      const e = rt.e, s = 16 * e.def.size + 8 - rt.t * 20, x = e.x, y = e.y, g = 6;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - s, y - s + g); ctx.lineTo(x - s, y - s); ctx.lineTo(x - s + g, y - s);
      ctx.moveTo(x + s - g, y - s); ctx.lineTo(x + s, y - s); ctx.lineTo(x + s, y - s + g);
      ctx.moveTo(x + s, y + s - g); ctx.lineTo(x + s, y + s); ctx.lineTo(x + s - g, y + s);
      ctx.moveTo(x - s + g, y + s); ctx.lineTo(x - s, y + s); ctx.lineTo(x - s, y + s - g);
      ctx.stroke();
    }
    for (const b of G.bubbles) {
      const c = sim.carCenter(b.car);
      const pop = Math.min(1, b.t / 0.1);
      const fade = b.t > 0.5 ? 1 - (b.t - 0.5) / 0.2 : 1;
      ctx.globalAlpha = fade;
      const bx = c.x + 16, by = c.y - 30 - (b.t * 6);
      ctx.fillStyle = '#ffffff';
      roundRect(bx - 11 * pop, by - 9 * pop, 22 * pop, 18 * pop, 6 * pop); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx - 4 * pop, by + 8 * pop); ctx.lineTo(bx - 8 * pop, by + 13 * pop); ctx.lineTo(bx + 1 * pop, by + 8 * pop); ctx.fill();
      if (pop >= 1) emoji(b.emo, bx, by, 12);
      ctx.globalAlpha = 1;
    }
  }
  function drawHints(G, clock) {
    if (sim.mode !== 'sail' || G.leg !== 1) return;
    const pulse = 4 * Math.sin(clock * 6);
    if (!G.hints.enemyDone) {
      const e = G.enemies.find((x) => x.state !== 'approach' && !x.leaving);
      if (e) { label('TAP', e.x, e.y - 30 * e.def.size - 12 + pulse, 13, '#fff2c2'); label('▼', e.x, e.y - 30 * e.def.size + pulse, 12, '#fff2c2'); }
    }
    if (!G.hints.lootDone) {
      const l = G.loot.find((x) => x.floating && x.age > 1.5 && x.x > 20 && x.x < W - 40);
      if (l) label('TAP TO GRAB', l.x, l.y - 24 + pulse, 11, '#fff2c2');
    }
  }
  function drawTexts(G) {
    for (const t of G.texts) {
      const life = t.big ? 1.8 : 0.9;
      const p = t.t / life;
      ctx.globalAlpha = 1 - p * p;
      ctx.font = `${t.big ? 'bold 20px' : 'bold 13px'} "Segoe UI", system-ui, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(15,30,37,0.8)';
      ctx.strokeText(t.str, t.x, t.y - p * 28);
      ctx.fillStyle = t.color; ctx.fillText(t.str, t.x, t.y - p * 28);
      ctx.globalAlpha = 1;
    }
  }
  function drawBanner(G) {
    const b = G.banner;
    if (!b) return;
    const a = b.t < 0.3 ? b.t / 0.3 : b.t > 1.7 ? Math.max(0, (2.2 - b.t) / 0.5) : 1;
    ctx.globalAlpha = a;
    const y = 120;
    ctx.fillStyle = 'rgba(15,30,37,0.75)'; ctx.fillRect(0, y - 30, W, 60);
    ctx.fillStyle = b.sub === 'boss' ? '#f0503c' : '#e5964a'; ctx.fillRect(0, y - 30, W, 2); ctx.fillRect(0, y + 28, W, 2);
    ctx.font = '800 24px "Segoe UI", system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff'; ctx.fillText(b.text.toUpperCase(), W / 2, y - 4);
    if (b.sub) { ctx.font = '600 11px Consolas, "IBM Plex Mono", monospace'; ctx.fillStyle = b.sub === 'boss' ? '#ffb3a0' : '#ffd08a'; ctx.fillText(b.sub.toUpperCase(), W / 2, y + 16); }
    ctx.globalAlpha = 1;
  }
  function drawHUD(G) {
    ctx.fillStyle = 'rgba(15,30,37,0.55)'; ctx.fillRect(0, 0, W, 30);
    let x = 12;
    for (let i = 1; i <= LAST_LEG; i++) {
      const L = DATA.legs[i];
      const r = L && L.boss ? 5 : 3.5;
      ctx.beginPath(); ctx.arc(x, 15, r, 0, Math.PI * 2);
      if (i < G.leg) { ctx.fillStyle = '#ffffff'; ctx.fill(); }
      else if (i === G.leg) { ctx.fillStyle = '#e5964a'; ctx.fill(); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke(); }
      else { ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.5; ctx.stroke(); }
      x += 14;
    }
    ctx.font = '600 12px Consolas, "IBM Plex Mono", monospace'; ctx.textBaseline = 'middle';
    ctx.textAlign = 'right'; ctx.fillStyle = '#ffd08a'; ctx.fillText(`⚙ ${G.scrap}`, W - 34, 15);
    ctx.textAlign = 'center'; ctx.fillStyle = '#ffffff'; ctx.fillText('ENGINE', W / 2 - 24, 15);
    const e = sim.engine();
    hpBar(W / 2 + 4, 11, 80, e.hp, e.def.hp, 8);
    if (sim.mode === 'sail') {
      ctx.font = '12px "Segoe UI", system-ui, sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText(sim.legEnded() ? (G.leg >= LAST_LEG ? 'Home in sight…' : 'Dock ahead…') : `${sim.legDef().name} · tap enemies to fire · tap loot to grab`, W / 2, H - 16);
    }
  }

  return { resize, draw };
}
