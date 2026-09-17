// Tiny CSV reader. First row is the header. Lines starting with # are comments.
// Numbers become numbers, "yes"/"no" become booleans, everything else stays a string.

export async function loadCSV(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Cannot load ${path} (${res.status})`);
  return parseCSV(await res.text());
}

export function parseCSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
  if (!lines.length) return [];
  const header = splitLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitLine(line);
    const row = {};
    header.forEach((h, i) => { row[h] = coerce(cells[i] ?? ''); });
    return row;
  });
}

function splitLine(line) {
  const out = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quoted) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else quoted = false;
      } else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function coerce(v) {
  if (v === '') return '';
  if (v === 'yes') return true;
  if (v === 'no') return false;
  const n = Number(v);
  return Number.isNaN(n) ? v : n;
}
