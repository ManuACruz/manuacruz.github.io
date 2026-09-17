// HTML overlays: title, leg summary, dock panel, pause, end. Reacts to sim events, calls sim methods.
import { IDLE_HINT } from './sim.js';

const $ = (id) => document.getElementById(id);

export function createUI(sim, { onAgain }) {
  const { DATA, S, LAST_LEG } = sim;

  function showOverlay(name) {
    for (const id of ['title', 'dock', 'end', 'summary', 'pause']) $(id).hidden = id !== name;
  }
  function handle(ev) {
    if (ev.type === 'mode') onMode(ev.data);
    else if (ev.type === 'dock') renderDock(ev.data);
  }
  function onMode({ mode, win }) {
    if (mode === 'sail') showOverlay(null);
    else if (mode === 'dock') showOverlay('dock');
    else if (mode === 'summary') { renderSummary(); showOverlay('summary'); }
    else if (mode === 'end') { renderEnd(win); showOverlay('end'); }
    else if (mode === 'paused') showOverlay('pause');
    else if (mode === 'title') showOverlay('title');
  }

  function statsLine(def) {
    if (def.damage > 0) return `${def.damage} dmg · every ${def.fire_rate}s · ${def.hp} hp · ${def.auto ? 'auto' : 'tap'}`;
    if (def.collect_radius > 0) return `reach ${def.collect_radius} · reel ${def.reel_s}s · ${def.lifts === 'all' ? 'lifts anything' : 'light loot only'}`;
    return `${def.hp} hp`;
  }

  function renderSummary() {
    const G = sim.G;
    const s = G.legStats;
    const hpLost = s.engineStart - sim.engine().hp;
    const total = s.caught + s.missed + s.stolen;
    $('summary').innerHTML = `
      <div class="card">
        <p class="eyebrow">Leg ${G.leg} of ${LAST_LEG} · ${sim.legDef().name}</p>
        <h2>Leg complete</h2>
        <div class="statgrid">
          <div><b>${s.kills}</b><span>kills</span></div>
          <div><b>${s.caught}<small>/${total}</small></b><span>loot caught</span></div>
          <div><b>${s.missed + s.stolen}</b><span>missed${s.stolen ? ` · ${s.stolen} stolen` : ''}</span></div>
          <div><b>+${G.scrap - s.scrapStart}</b><span>scrap</span></div>
          <div class="${hpLost > 0 ? 'bad' : ''}"><b>${hpLost > 0 ? `-${hpLost}` : '0'}</b><span>engine HP</span></div>
          <div><b>${s.rescued}<small>/${s.rescued + s.lost}</small></b><span>cars rescued</span></div>
        </div>
        <button id="todock">Into the dock</button>
      </div>`;
    $('todock').addEventListener('click', () => sim.openDock());
  }

  function renderEnd(win) {
    const G = sim.G;
    const st = G.stats;
    $('end').innerHTML = `
      <div class="card">
        <p class="eyebrow">${win ? 'Run complete' : 'Run over'}</p>
        <h1>${win ? 'Home safe' : 'Engine down'}</h1>
        <p>${win ? `The Leviathan is down. The train made it through all ${LAST_LEG} legs.` : `The engine went down on leg ${G.leg}, ${sim.legDef().name}.`}</p>
        <p class="small">Kills ${st.kills} · Caught ${st.collected} · Missed ${st.missed} · Stolen ${st.stolen} · Rescued ${st.rescued} · Lost ${st.lost}</p>
        <button id="again">Sail again</button>
      </div>`;
    $('again').addEventListener('click', onAgain);
  }

  function renderDock(hint) {
    const G = sim.G;
    const d = G.dock;
    const next = DATA.legs[G.leg + 1];
    const sel = d.selected;
    const up = sel && sel.def.upgrade_to ? DATA.cars[sel.def.upgrade_to] : null;
    const refund = sel ? Math.round(sel.def.cost * S.sell_pct) : 0;
    $('dock').innerHTML = `
      <div class="dockhead"><h2>Dock ${G.leg}</h2><span class="scrap">⚙ ${G.scrap} scrap</span></div>
      ${next ? `<p class="next"><b>Next: ${next.name}${next.boss ? ' · boss' : ''}.</b> ${next.preview}</p>` : ''}
      ${sel ? `
      <div class="actions">
        <span class="who">${sel.def.emoji} ${sel.def.name}<small>${statsLine(sel.def)}</small></span>
        ${up ? `<button id="upgrade" ${G.scrap < up.cost ? 'disabled' : ''}>Upgrade ${up.cost}⚙<small>${statsLine(up)}</small></button>` : '<button disabled>Max tier</button>'}
        <button id="move">Move</button>
        <button id="sell" class="quiet">Sell +${refund}⚙</button>
      </div>` : `
      <div class="offers">${d.offers.map((o, i) => `
        <button class="offer ${d.placing === o ? 'selected' : ''} ${o.sold ? 'sold' : ''}" data-i="${i}" ${o.sold ? 'disabled' : ''}>
          <span class="emoji">${o.def.emoji}</span>
          <span>${o.def.name} <span class="cost">${o.def.cost}⚙</span></span>
          <span class="passive">${statsLine(o.def)}</span>
        </button>`).join('')}
      </div>`}
      <p class="hint">${hint || IDLE_HINT}</p>
      <div class="dockfoot">
        ${sel ? '' : `<button id="reroll" class="quiet" ${G.scrap < S.reroll_cost ? 'disabled' : ''}>Re-roll ${S.reroll_cost}⚙</button>`}
        <button id="sail">Set sail → Leg ${G.leg + 1}</button>
      </div>`;
    $('dock').querySelectorAll('.offer').forEach((b) => b.addEventListener('click', () => sim.chooseOffer(Number(b.dataset.i))));
    $('reroll')?.addEventListener('click', () => sim.reroll());
    $('upgrade')?.addEventListener('click', () => sim.upgrade());
    $('move')?.addEventListener('click', () => sim.startMove());
    $('sell')?.addEventListener('click', () => sim.sell());
    $('sail').addEventListener('click', () => sim.sail());
  }

  return { handle, showOverlay };
}
