// Settings: stored in localStorage when it is available, defaults otherwise.

const KEY = 'nightcycle.settings.v2';
const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
const DEFAULTS = { volume: 0.8, sensitivity: 1, pixel: coarse ? 1.5 : 1, brightness: 1, voice: true, labels: true, invert: false, difficulty: 1,
  flashing: true, captions: false, mudMarkers: true, textSize: 1 };

// How sharp its senses are and how fast it runs, per difficulty.
export const DIFFICULTY = {
  0.7: { name: 'Easy', sight: 0.7, hearing: 0.65, chase: 0.88, battery: 0.75, dockSave: true, desc: 'Duller senses, slower chase, longer battery. Docking saves.' },
  1: { name: 'Normal', sight: 1, hearing: 1, chase: 1, battery: 1, dockSave: true, desc: 'As intended. Docking saves your progress.' },
  1.3: { name: 'Hard', sight: 1.2, hearing: 1.25, chase: 1.08, battery: 1.15, dockSave: false, desc: 'Sharper senses, faster chase. Only task checkpoints.' },
};

export function loadSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...DEFAULTS }; }
}
export function saveSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ }
}

const ROWS = [
  { key: 'difficulty', label: 'Difficulty', type: 'choice', options: [[0.7, 'Easy'], [1, 'Normal'], [1.3, 'Hard']] },
  { key: 'volume', label: 'Volume', type: 'range', min: 0, max: 1, step: 0.05, fmt: (v) => Math.round(v * 100) + '%' },
  { key: 'brightness', label: 'Brightness', type: 'range', min: 0.6, max: 2, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: 'sensitivity', label: 'Look sensitivity', type: 'range', min: 0.3, max: 2.5, step: 0.05, fmt: (v) => v.toFixed(2) },
  { key: 'pixel', label: 'Camera', type: 'choice', options: [[1, 'HD'], [1.5, 'HD (faster)'], [2.5, 'Retro'], [4, 'Retro chunky']] },
  { key: 'textSize', label: 'Text size', type: 'choice', options: [[1, 'Normal'], [1.2, 'Large'], [1.45, 'Larger']] },
  { key: 'voice', label: 'Robot voice', type: 'toggle' },
  { key: 'labels', label: 'Object recognition', type: 'toggle' },
  { key: 'mudMarkers', label: 'Dirt markers', type: 'toggle' },
  { key: 'captions', label: 'Sound captions', type: 'toggle' },
  { key: 'flashing', label: 'Flashing effects', type: 'toggle' },
  { key: 'invert', label: 'Invert look', type: 'toggle' },
];

export function buildSettings(root, settings, onChange) {
  root.innerHTML = '';
  const s = { ...settings };
  for (const row of ROWS) {
    const line = document.createElement('label');
    line.className = 'set-row';
    const name = document.createElement('span');
    name.textContent = row.label;
    line.appendChild(name);
    if (row.type === 'range') {
      const input = document.createElement('input');
      Object.assign(input, { type: 'range', min: row.min, max: row.max, step: row.step, value: s[row.key] });
      const val = document.createElement('em');
      val.textContent = row.fmt(s[row.key]);
      input.oninput = () => { s[row.key] = +input.value; val.textContent = row.fmt(s[row.key]); onChange({ ...s }); };
      line.append(input, val);
    } else if (row.type === 'toggle') {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'toggle';
      const draw = () => { b.textContent = s[row.key] ? 'ON' : 'OFF'; b.classList.toggle('on', s[row.key]); };
      b.onclick = (e) => { e.preventDefault(); s[row.key] = !s[row.key]; draw(); onChange({ ...s }); };
      draw();
      line.appendChild(b);
    } else {
      const sel = document.createElement('select');
      for (const [v, t] of row.options) { const o = document.createElement('option'); o.value = v; o.textContent = t; if (v === s[row.key]) o.selected = true; sel.appendChild(o); }
      sel.onchange = () => { s[row.key] = +sel.value; onChange({ ...s }); };
      line.appendChild(sel);
    }
    root.appendChild(line);
  }
}
