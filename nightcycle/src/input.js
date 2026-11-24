// Keyboard, mouse (pointer lock or drag), gamepad and touch, folded into one set of controls.

export class Input {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.game = game;
    this.keys = new Set();
    this.lookX = 0; this.lookY = 0;          // accumulated mouse/touch look this frame (pixels)
    this.throttle = 0; this.steer = 0;
    this.pressed = new Set();                 // one-shot actions this frame
    this.dragging = false;
    this.touch = { stick: null, look: null, sx: 0, sy: 0 };
    this.locked = false;

    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.code);
      const map = { KeyE: 'suction', KeyQ: 'suction', KeyF: 'light', Space: 'scan', Escape: 'pause', KeyP: 'pause', Tab: 'map' };
      if (map[e.code]) { this.pressed.add(map[e.code]); e.preventDefault(); }
      if (e.code.startsWith('Arrow')) e.preventDefault();
      this.game.onKey?.(e.code);
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());

    canvas.addEventListener('mousedown', (e) => {
      if (this.game.state !== 'playing') return;
      if (!this.locked && canvas.requestPointerLock) {
        try { const p = canvas.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch { /* not allowed here */ }
      }
      this.dragging = true;
    });
    addEventListener('mouseup', () => { this.dragging = false; });
    addEventListener('mousemove', (e) => {
      if (this.locked || this.dragging) { this.lookX += e.movementX; this.lookY += e.movementY; }
    });
    document.addEventListener('pointerlockchange', () => {
      const was = this.locked;
      this.locked = document.pointerLockElement === canvas;
      if (was && !this.locked && this.game.state === 'playing') this.game.pause?.();
    });

    this.setupTouch();
  }

  setupTouch() {
    const ui = document.getElementById('touch');
    if (!ui) return;
    this.isTouch = matchMedia('(pointer: coarse)').matches;
    if (this.isTouch) document.body.classList.add('touch');
    const stickEl = ui.querySelector('.stick'), knob = ui.querySelector('.knob');
    for (const b of ui.querySelectorAll('[data-act]')) {
      b.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); this.pressed.add(b.dataset.act); }, { passive: false });
    }
    const t = this.touch;
    const onStart = (e) => {
      for (const p of e.changedTouches) {
        if (p.target.closest('[data-act]')) continue;
        if (p.clientX < innerWidth * 0.45 && !t.stick) {
          t.stick = { id: p.identifier, x: p.clientX, y: p.clientY, dx: 0, dy: 0 };
          stickEl.style.left = p.clientX + 'px'; stickEl.style.top = p.clientY + 'px';
          stickEl.classList.add('on');
        } else if (!t.look) {
          t.look = { id: p.identifier, x: p.clientX, y: p.clientY };
        }
      }
      e.preventDefault();
    };
    const onMove = (e) => {
      for (const p of e.changedTouches) {
        if (t.stick && p.identifier === t.stick.id) {
          let dx = p.clientX - t.stick.x, dy = p.clientY - t.stick.y;
          const L = Math.hypot(dx, dy), max = 55;
          if (L > max) { dx *= max / L; dy *= max / L; }
          t.stick.dx = dx / max; t.stick.dy = dy / max;
          knob.style.transform = `translate(${dx}px, ${dy}px)`;
        } else if (t.look && p.identifier === t.look.id) {
          this.lookX += (p.clientX - t.look.x) * 1.6; this.lookY += (p.clientY - t.look.y) * 1.6;
          t.look.x = p.clientX; t.look.y = p.clientY;
        }
      }
      e.preventDefault();
    };
    const onEnd = (e) => {
      for (const p of e.changedTouches) {
        if (t.stick && p.identifier === t.stick.id) { t.stick = null; knob.style.transform = ''; stickEl.classList.remove('on'); }
        if (t.look && p.identifier === t.look.id) t.look = null;
      }
    };
    const zone = ui.querySelector('.zone');
    zone.addEventListener('touchstart', onStart, { passive: false });
    zone.addEventListener('touchmove', onMove, { passive: false });
    zone.addEventListener('touchend', onEnd);
    zone.addEventListener('touchcancel', onEnd);
  }

  // Called once per frame before the game reads the controls.
  poll() {
    const k = this.keys;
    let th = 0, st = 0;
    if (k.has('KeyW') || k.has('ArrowUp')) th += 1;
    if (k.has('KeyS') || k.has('ArrowDown')) th -= 1;
    if (k.has('KeyA') || k.has('ArrowLeft')) st += 1;
    if (k.has('KeyD') || k.has('ArrowRight')) st -= 1;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p) continue;
      const dz = (v) => (Math.abs(v) < 0.15 ? 0 : v);
      th -= dz(p.axes[1] || 0); st -= dz(p.axes[0] || 0);
      if (p.buttons[7]?.value > 0.1) th += p.buttons[7].value;
      if (p.buttons[6]?.value > 0.1) th -= p.buttons[6].value;
      this.lookX += dz(p.axes[2] || 0) * 14; this.lookY += dz(p.axes[3] || 0) * 10;
      const edge = (i, act) => { const down = p.buttons[i]?.pressed; if (down && !this['pad' + i]) this.pressed.add(act); this['pad' + i] = down; };
      edge(0, 'scan'); edge(2, 'suction'); edge(3, 'light'); edge(9, 'pause');
    }
    if (this.touch.stick) { th -= this.touch.stick.dy; st -= this.touch.stick.dx * 0.9; }
    const o = this.override;   // scripted driving, used by the debug console
    if (o && performance.now() < o.until) { th = o.throttle; st = o.steer; } else this.override = null;
    this.throttle = Math.max(-1, Math.min(1, th));
    this.steer = Math.max(-1, Math.min(1, st));
  }

  consume(act) { const had = this.pressed.has(act); this.pressed.delete(act); return had; }
  endFrame() { this.lookX = 0; this.lookY = 0; this.pressed.clear(); }
  unlock() { if (document.pointerLockElement) document.exitPointerLock(); }
}
