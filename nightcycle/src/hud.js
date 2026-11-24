// The robot's screen: status, task, the cleaning map, phone notifications and the object-recognition boxes.

import * as THREE from 'three';
import { ROOMS, DOCK, HOUSE } from './level.js';
import { GW, GH, CELL } from './world.js';
import { T } from './tune.js';

const $ = (id) => document.getElementById(id);
const GLITCH_LABELS = ['person 0.31', 'person 0.08', 'coat 0.12', 'person ??', '[NO MATCH]', 'tall 0.97', 'human 0.00', 'do not 0.66', 'ERR'];

export class Hud {
  constructor(game) {
    this.game = game;
    this.el = {
      root: $('hud'), batt: $('batt-bar'), battPct: $('batt-pct'), bin: $('bin-bar'), binPct: $('bin-pct'),
      clock: $('clock'), suction: $('k-suction'), light: $('k-light'), scan: $('k-scan'), room: $('room-name'),
      task: $('task'), taskTitle: $('task-title'), taskBar: $('task-bar'), taskPct: $('task-pct'),
      notes: $('notes'), sub: $('subtitle'), hint: $('hint'), card: $('card'), motion: $('motion'), motionD: $('motion-d'),
      map: $('map'), labels: $('labels'), status: $('status-line'), hidden: $('hidden-tag'),
    };
    this.mapCtx = this.el.map.getContext('2d');
    this.mapImg = this.mapCtx.createImageData(GW, GH);
    this.lab = this.el.labels.getContext('2d');
    this.explored = new Set();
    this.timer = 0; this.mapTimer = 0;
    this.subTimer = 0; this.hintTimer = 0; this.cardTimer = 0;
    this.beepTimer = 0;
    this.v = new THREE.Vector3();
    this.resize();
  }

  resize() {
    const c = this.el.labels;
    c.width = innerWidth; c.height = innerHeight;
  }

  show(on) {
    this.el.root.hidden = !on;
    const t = document.getElementById('touch');
    if (t) t.hidden = !(on && this.game.input.isTouch);
  }

  // ---------- messages ----------

  notify(app, text, kind = 'app') {
    const n = document.createElement('div');
    n.className = 'note ' + kind;
    n.innerHTML = kind === 'app'
      ? `<div class="note-app"><span class="dot"></span>${app}<span class="now">now</span></div><div class="note-text"></div>`
      : `<div class="note-text"></div>`;
    n.querySelector('.note-text').textContent = text;
    this.el.notes.prepend(n);
    while (this.el.notes.children.length > 4) this.el.notes.lastChild.remove();
    setTimeout(() => n.classList.add('out'), kind === 'app' ? 9000 : 5000);
    setTimeout(() => n.remove(), kind === 'app' ? 9800 : 5800);
    if (kind === 'app') this.game.audio.chime();
  }
  log(text) { this.notify('', text, 'sys'); }

  subtitle(text, secs = 4) {
    this.el.sub.textContent = text;
    this.el.sub.classList.add('on');
    this.subTimer = secs;
  }

  hint(html, secs = 7) {
    this.el.hint.innerHTML = html;
    this.el.hint.classList.add('on');
    this.hintTimer = secs;
  }

  itemCard(def) {
    const c = this.el.card;
    c.querySelector('.card-kind').textContent = def.story ? 'OBJECT ARCHIVED' : 'OBJECT INGESTED';
    c.querySelector('.card-name').textContent = def.name;
    c.querySelector('.card-text').textContent = def.text;
    c.classList.add('on');
    this.cardTimer = 7;
  }

  flashKey(k) { const e = this.el[k]; e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); }
  bump() { const e = this.el.root; e.classList.remove('bumped'); void e.offsetWidth; e.classList.add('bumped'); }

  setTask(title) {
    this.el.task.hidden = !title;
    this.el.taskTitle.textContent = title || '';
    this.el.task.classList.remove('done');
  }
  taskDone() { this.el.task.classList.add('done'); }

  // ---------- per frame ----------

  update(dt) {
    const g = this.game, r = g.roomba;
    this.subTimer -= dt; if (this.subTimer <= 0) this.el.sub.classList.remove('on');
    this.hintTimer -= dt; if (this.hintTimer <= 0) this.el.hint.classList.remove('on');
    this.cardTimer -= dt; if (this.cardTimer <= 0) this.el.card.classList.remove('on');

    // proximity sensor
    const e = g.entity;
    const d = e.root.visible && e.state !== 'dormant' ? Math.hypot(e.x - r.x, e.z - r.z) : Infinity;
    const close = d < 6 && g.state === 'playing';
    this.el.motion.classList.toggle('on', close);
    if (close) {
      this.el.motionD.textContent = d.toFixed(1) + ' m';
      this.el.motion.classList.toggle('alert', e.state === 'chase');
      this.beepTimer -= dt;
      if (this.beepTimer <= 0) { this.beepTimer = 0.15 + (d / 6) * 0.9; g.audio.beep(1 - d / 8); }
    }
    g.post.uniforms.danger.value += ((e.state === 'chase' && g.state === 'playing' ? 0.8 : close ? (1 - d / 6) * 0.35 : 0) - g.post.uniforms.danger.value) * Math.min(1, dt * 3);

    this.timer -= dt;
    if (this.timer <= 0) {
      this.timer = 0.1;
      const b = Math.max(0, r.battery);
      this.el.batt.style.width = b + '%';
      this.el.battPct.textContent = Math.ceil(b) + '%';
      this.el.batt.parentElement.classList.toggle('low', b < T.batteryLow);
      this.el.bin.style.width = r.bin + '%';
      this.el.binPct.textContent = r.bin >= 100 ? 'FULL' : Math.floor(r.bin) + '%';
      this.el.bin.parentElement.classList.toggle('low', r.bin >= 90);
      const mins = Math.floor(g.clock), hh = 3 + Math.floor(mins / 60), mm = mins % 60;
      this.el.clock.textContent = `0${hh}:${String(mm).padStart(2, '0')} AM`;
      this.el.suction.classList.toggle('off', !r.suction);
      this.el.light.classList.toggle('off', !r.light);
      this.el.scan.classList.toggle('off', r.scanTimer > 0);
      this.el.scan.querySelector('b').textContent = r.scanTimer > 0 ? `SCAN ${Math.ceil(r.scanTimer)}s` : 'SCAN';
      const ri = g.world.roomAt(r.x, r.z);
      if (ri >= 0) { this.explored.add(ri); this.el.room.textContent = ROOMS[ri].name.toUpperCase(); }
      this.el.hidden.classList.toggle('on', r.hidden);
      this.el.hidden.textContent = r.outOfReach ? 'OUT OF REACH' : 'UNDER COVER';
      let st = r.docked ? 'DOCKED · CHARGING' : r.bin >= 100 ? 'BIN FULL · RETURN TO BASE' : r.battery < T.batteryLow ? 'LOW BATTERY'
        : !r.suction ? 'SILENT DRIVE' : r.dirtRate > 15 ? 'DIRT DETECTED ▮▮▮' : r.dirtRate > 4 ? 'DIRT DETECTED ▮▯▯' : 'CLEANING';
      this.el.status.textContent = st;
      const task = g.story.task;
      if (task && task.progress) {
        const p = task.progress();
        this.el.taskBar.style.width = Math.min(100, (p / task.target) * 100) + '%';
        this.el.taskPct.textContent = task.target === 1 && task.kind === 'dock' ? '' : `${Math.floor(p * 100)}% / ${Math.round(task.target * 100)}%`;
      } else { this.el.taskBar.style.width = '0%'; this.el.taskPct.textContent = ''; }
    }

    this.mapTimer -= dt;
    if (this.mapTimer <= 0) { this.mapTimer = 0.25; this.drawMap(); }
    this.drawLabels();
  }

  // The app-style cleaning map: swept floor glows, unswept floor in explored rooms is dim.
  drawMap() {
    const g = this.game, w = g.world, img = this.mapImg.data;
    const taskRoom = g.story.task?.room != null ? w.roomIndex(g.story.task.room) : -1;
    const lair = w.roomIndex('laundry');
    const pulse = 0.5 + 0.5 * Math.sin(g.time * 4);
    for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
      const c = j * GW + i, o = c * 4, ri = w.room[c];
      let a = 0, R = 0, G = 0, B = 0;
      if (ri === lair && this.explored.has(ri)) { R = 120; G = 10; B = 10; a = 90 + 80 * pulse; }
      else if (ri >= 0 && this.explored.has(ri) && w.reach[c]) {
        if (w.swept[c]) { R = 40; G = 190; B = 230; a = 200; }
        else { R = 30; G = 60; B = 80; a = 150; }
        if (w.dirt[c] > 0.15) { R = 90; G = 80; B = 60; a = 170; }
        if (ri === taskRoom) a = Math.min(255, a + 40 * pulse);
      }
      img[o] = R; img[o + 1] = G; img[o + 2] = B; img[o + 3] = a;
    }
    const ctx = this.mapCtx;
    ctx.putImageData(this.mapImg, 0, 0);
    const s = 1 / CELL;
    ctx.fillStyle = 'rgba(160,220,255,0.75)';
    for (const p of w.pieces) {
      if (p.y0 > 0.5) continue;
      const ri = w.roomAt((p.x0 + p.x1) / 2 + 0.2, (p.z0 + p.z1) / 2 + 0.2), rj = w.roomAt((p.x0 + p.x1) / 2 - 0.2, (p.z0 + p.z1) / 2 - 0.2);
      if (!this.explored.has(ri) && !this.explored.has(rj)) continue;
      ctx.fillRect(p.x0 * s, p.z0 * s, (p.x1 - p.x0) * s, (p.z1 - p.z0) * s);
    }
    if (this.explored.has(lair)) {
      const r = ROOMS[lair];
      ctx.fillStyle = '#ff5040';
      ctx.font = '28px VT323, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('?', ((r.x0 + r.x1) / 2) * s, ((r.z0 + r.z1) / 2) * s + 9);
      ctx.textAlign = 'left';
    }
    // dock
    ctx.fillStyle = '#30ff90';
    ctx.fillRect(DOCK.x * s - 6, DOCK.z * s - 4, 3, 8);
    // the thing, briefly, after a scan
    const bl = g.lidar.blip;
    if (bl && g.time - bl.t < 4) {
      ctx.globalAlpha = 1 - (g.time - bl.t) / 4;
      ctx.fillStyle = '#ff3020';
      ctx.beginPath(); ctx.arc(bl.x * s, bl.z * s, 4 + Math.sin(g.time * 12) * 1.5, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // scan ring
    const since = g.time - g.lidar.lastScan;
    if (since < 1.2) {
      ctx.strokeStyle = `rgba(80,255,200,${1 - since / 1.2})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(g.roomba.x * s, g.roomba.z * s, since * T.scanWaveSpeed * s, 0, 7); ctx.stroke();
    }
    // the robot
    const r = g.roomba;
    ctx.save();
    ctx.translate(r.x * s, r.z * s);
    ctx.rotate(-r.yaw);
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(4, 4); ctx.lineTo(-4, 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // Object recognition: brackets around things the camera can make out.
  drawLabels() {
    const g = this.game, ctx = this.lab, W = ctx.canvas.width, H = ctx.canvas.height;
    ctx.clearRect(0, 0, W, H);
    if (g.state !== 'playing' || !g.settings.labels) return;
    const cam = g.camera, r = g.roomba;
    const cp = cam.getWorldPosition(this.v.clone());
    const v = this.v;
    const lampOn = r.light && !r.dead;
    g.entity.updateTag();
    const tags = [...g.house.tags, g.entity.tag];
    let shown = 0;
    ctx.font = `${Math.max(13, Math.round(H / 48))}px VT323, monospace`;
    ctx.lineWidth = 1.5;
    for (const tag of tags) {
      if (tag.gone || shown > 7) continue;
      const b = tag.box;
      const cx = (b.min.x + b.max.x) / 2, cz = (b.min.z + b.max.z) / 2;
      const dist = Math.hypot(cx - cp.x, cz - cp.z);
      const isEnt = !!tag.entity;
      if (dist > (isEnt ? 8 : 4.5)) continue;
      // in front of the camera?
      const fx = -Math.sin(r.yaw), fz = -Math.cos(r.yaw);
      if ((cx - cp.x) * fx + (cz - cp.z) * fz < 0.2) continue;
      if (!isEnt) {
        if (!lampOn) continue;
        const ang = Math.acos(Math.max(-1, Math.min(1, ((cx - cp.x) * fx + (cz - cp.z) * fz) / (dist || 1))));
        if (ang > 0.75 && dist > 0.8) continue;
      }
      if (!g.world.los(cp.x, cp.z, cx, cz)) continue;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, behind = false;
      for (let k = 0; k < 8; k++) {
        v.set(k & 1 ? b.max.x : b.min.x, k & 2 ? b.max.y : b.min.y, k & 4 ? b.max.z : b.min.z).project(cam);
        if (v.z > 1) { behind = true; break; }
        const sx = (v.x * 0.5 + 0.5) * W, sy = (-v.y * 0.5 + 0.5) * H;
        x0 = Math.min(x0, sx); y0 = Math.min(y0, sy); x1 = Math.max(x1, sx); y1 = Math.max(y1, sy);
      }
      if (behind) continue;
      x0 = Math.max(4, x0); y0 = Math.max(4, y0); x1 = Math.min(W - 4, x1); y1 = Math.min(H - 4, y1);
      if (x1 - x0 < 12 || y1 - y0 < 8) continue;
      shown++;
      let label, color;
      if (isEnt) {
        label = GLITCH_LABELS[Math.floor(g.time * 3) % GLITCH_LABELS.length];
        if (g.entity.state === 'chase') label = '!!!!!!!!';
        color = `rgba(255,${40 + Math.random() * 40},40,0.95)`;
        if (Math.random() < 0.15) { x0 += (Math.random() - 0.5) * 20; x1 += (Math.random() - 0.5) * 20; }
      } else {
        const conf = Math.min(0.99, tag.conf + Math.sin(g.time * 2 + cx) * 0.02);
        label = `${tag.label} ${conf.toFixed(2)}`;
        if (tag.fake && Math.sin(g.time * 0.7) > 0.4) label = 'person 0.41';
        color = tag.item ? 'rgba(255,220,90,0.9)' : 'rgba(110,230,255,0.75)';
      }
      ctx.strokeStyle = color; ctx.fillStyle = color;
      const L = Math.min(14, (x1 - x0) / 3, (y1 - y0) / 3);
      ctx.beginPath();
      ctx.moveTo(x0, y0 + L); ctx.lineTo(x0, y0); ctx.lineTo(x0 + L, y0);
      ctx.moveTo(x1 - L, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + L);
      ctx.moveTo(x1, y1 - L); ctx.lineTo(x1, y1); ctx.lineTo(x1 - L, y1);
      ctx.moveTo(x0 + L, y1); ctx.lineTo(x0, y1); ctx.lineTo(x0, y1 - L);
      ctx.stroke();
      ctx.fillText(label, x0 + 2, y0 - 4);
    }
    this.drawDirtMarks(ctx, cp, W, H);
  }

  // Dirt detect: mud on the floor is nearly invisible from 11 cm up, so the robot flags it.
  drawDirtMarks(ctx, cp, W, H) {
    const g = this.game, r = g.roomba, v = this.v;
    const fx = -Math.sin(r.yaw), fz = -Math.cos(r.yaw);
    let n = 0;
    for (const p of g.dirt.prints) {
      if (!p.shown || p.amount <= 0 || n > 10) continue;
      const dx = p.x - cp.x, dz = p.z - cp.z, d = Math.hypot(dx, dz);
      if (d > 7 || dx * fx + dz * fz < 0.15) continue;
      if (!g.world.los(cp.x, cp.z, p.x, p.z)) continue;
      v.set(p.x, 0.01, p.z).project(g.camera);
      if (v.z > 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) continue;
      const sx = (v.x * 0.5 + 0.5) * W, sy = (-v.y * 0.5 + 0.5) * H;
      const s = Math.max(4, 16 - d * 1.6), a = 0.5 + 0.4 * Math.sin(g.time * 5 + p.s);
      ctx.strokeStyle = `rgba(255,170,70,${a})`;
      ctx.fillStyle = `rgba(255,170,70,${a})`;
      ctx.beginPath();
      ctx.moveTo(sx, sy - s); ctx.lineTo(sx + s, sy); ctx.lineTo(sx, sy + s); ctx.lineTo(sx - s, sy); ctx.closePath();
      ctx.stroke();
      if (n === 0) ctx.fillText(`mud ${p.amount.toFixed(2)}`, sx + s + 4, sy + 4);
      n++;
    }
  }
}
