const C = CONFIG, app = document.getElementById('app');
const STATS = [['Life','life','Vida'],['Move','move','Movimiento'],['Range','range','Alcance'],['Attack','attack','Ataque'],['Defense','defense','Defensa']];

/* ---------- Iconos SVG propios (sustituyen a los emojis) ---------- */
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8a77"/><stop offset=".55" stop-color="#d7263a"/><stop offset="1" stop-color="#8e0f1c"/></linearGradient>
<linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b8"/><stop offset=".5" stop-color="#e2b240"/><stop offset="1" stop-color="#9a6a17"/></linearGradient>
<linearGradient id="gSilver" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c3ccd4"/><stop offset="1" stop-color="#76828e"/></linearGradient>
<linearGradient id="gWing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#cfe3f5"/><stop offset="1" stop-color="#7ea3c9"/></linearGradient>
<linearGradient id="gWood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d49a60"/><stop offset="1" stop-color="#744723"/></linearGradient>
</defs>
<symbol id="i-life" viewBox="0 0 32 32"><path d="M16 28.5C6 21 2.8 15.2 2.8 10.7 2.8 7 5.7 4 9.4 4c2.7 0 5 1.5 6.6 3.9C17.600 5.500 19.900 4 22.600 4c3.700 0 6.600 3 6.600 6.700 0 4.500-3.200 10.300-13.200 17.800z" fill="url(#gRed)" stroke="#43070d" stroke-width="1.700" stroke-linejoin="round"/><path d="M8.500 8.200c-2 .6-3 2.600-2.600 4.600" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="1.800" stroke-linecap="round"/></symbol>
<symbol id="i-move" viewBox="0 0 32 32"><g fill="url(#gRed)" stroke="#43070d" stroke-width="1.100"><g transform="rotate(-12 10 20)"><path d="M10 12.500c2.800 0 4.200 2.400 4.200 5 0 2.200-.9 3.600-.9 5.400 0 2-1.200 3.100-3.300 3.100S6.700 25 6.700 22.900c0-1.800-1-3.200-1-5.400 0-2.600 1.500-5 4.300-5z"/><circle cx="6.600" cy="9.800" r="1.700"/><circle cx="10.200" cy="8.600" r="1.800"/><circle cx="13.800" cy="9.800" r="1.600"/></g><g transform="rotate(12 22 13)"><path d="M22 5c2.800 0 4.200 2.400 4.200 5 0 2.200-.9 3.600-.9 5.400 0 2-1.200 3.100-3.300 3.100S18.700 17.500 18.700 15.400c0-1.800-1-3.200-1-5.400 0-2.600 1.500-5 4.300-5z"/><circle cx="18.600" cy="2.600" r="1.600"/><circle cx="22.200" cy="1.600" r="1.700"/><circle cx="25.600" cy="2.800" r="1.500"/></g></g></symbol>
<symbol id="i-range" viewBox="0 0 32 32"><circle cx="15" cy="17" r="12.500" fill="#fff" stroke="#43070d" stroke-width="1.400"/><circle cx="15" cy="17" r="12.500" fill="url(#gRed)" opacity=".95"/><circle cx="15" cy="17" r="9" fill="#f6f1e7"/><circle cx="15" cy="17" r="5.600" fill="url(#gRed)"/><circle cx="15" cy="17" r="2.200" fill="#f6f1e7"/><path d="M15 17L27.500 4.500" stroke="#3c2a18" stroke-width="3" stroke-linecap="round"/><path d="M15 17L27.500 4.500" stroke="#d9c7a0" stroke-width="1.500" stroke-linecap="round"/><path d="M24.500 3.500l4 0 0 4z" fill="#cfd6dc" stroke="#3c2a18" stroke-width=".9" stroke-linejoin="round"/></symbol>
<symbol id="i-attack" viewBox="0 0 32 32"><g stroke-linecap="round"><path d="M5 5L21 21M27 5L11 21" stroke="#1a1d22" stroke-width="5.400"/><path d="M5 5L21 21M27 5L11 21" stroke="url(#gSilver)" stroke-width="3"/><path d="M17 25.500L25.500 17M15 25.500L6.500 17" stroke="#3a2608" stroke-width="4.200"/><path d="M17 25.500L25.500 17M15 25.500L6.500 17" stroke="url(#gGold)" stroke-width="2.400"/><path d="M22 22L26.500 26.500M10 22L5.500 26.500" stroke="#3a2608" stroke-width="4.200"/><path d="M22 22L26.500 26.500M10 22L5.500 26.500" stroke="#7a4a22" stroke-width="2.400"/></g><circle cx="27.500" cy="27.500" r="2" fill="url(#gGold)" stroke="#3a2608" stroke-width="1"/><circle cx="4.500" cy="27.500" r="2" fill="url(#gGold)" stroke="#3a2608" stroke-width="1"/></symbol>
<symbol id="i-defense" viewBox="0 0 32 32"><path d="M16 2.800L4.800 6.800v9.200c0 6.800 4.600 10.800 11.200 13.200z" fill="url(#gRed)"/><path d="M16 2.800l11.200 4v9.200c0 6.800-4.600 10.800-11.200 13.200z" fill="url(#gSilver)"/><path d="M16 2.800L4.800 6.800v9.200c0 6.800 4.600 10.800 11.200 13.200 6.600-2.400 11.200-6.400 11.200-13.200V6.800z" fill="none" stroke="#23262b" stroke-width="1.800" stroke-linejoin="round"/><path d="M16 3.500v25" stroke="#23262b" stroke-width="1.100"/></symbol>
<symbol id="i-crown" viewBox="0 0 32 32"><path d="M3 25L1.800 9.500l7.200 6L16 5l7 10.500 7.200-6L29 25z" fill="url(#gGold)" stroke="#4a2f06" stroke-width="1.500" stroke-linejoin="round"/><rect x="3" y="24" width="26" height="4" rx="1" fill="url(#gGold)" stroke="#4a2f06" stroke-width="1.300"/><circle cx="16" cy="19" r="1.900" fill="#e0283c" stroke="#4a2f06" stroke-width=".8"/><circle cx="9" cy="21" r="1.300" fill="#3e8ee0" stroke="#4a2f06" stroke-width=".7"/><circle cx="23" cy="21" r="1.300" fill="#3e8ee0" stroke="#4a2f06" stroke-width=".7"/></symbol>
<symbol id="i-cost" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13.500" fill="url(#gGold)" stroke="#4a2f06" stroke-width="1.700"/><circle cx="16" cy="16" r="10" fill="none" stroke="#8a5a12" stroke-width="1.500"/><path d="M16 10.200l4.600 5.800-4.600 5.800-4.600-5.800z" fill="#8a5a12" stroke="#5a3a08" stroke-width=".8" stroke-linejoin="round"/><path d="M7 11.500A10 10 0 0 1 13 6.500" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.600" stroke-linecap="round"/></symbol>
<symbol id="i-bow" viewBox="0 0 32 32"><path d="M9 3.500Q27 16 9 28.500" fill="none" stroke="#3a2210" stroke-width="4.600" stroke-linecap="round"/><path d="M9 3.500Q27 16 9 28.500" fill="none" stroke="url(#gWood)" stroke-width="2.800" stroke-linecap="round"/><path d="M9 3.500V28.500" stroke="#e9dcc0" stroke-width="1"/><path d="M4 16H27" stroke="#e9dcc0" stroke-width="1.700" stroke-linecap="round"/><path d="M25 12.500L30 16 25 19.500z" fill="url(#gSilver)" stroke="#23262b" stroke-width=".8" stroke-linejoin="round"/></symbol>
<symbol id="i-wing" viewBox="0 0 32 32"><g stroke="#1f3350" stroke-width="1.300" stroke-linejoin="round"><ellipse cx="11" cy="23.500" rx="7.800" ry="3.200" transform="rotate(37 11 23.500)" fill="url(#gWing)"/><ellipse cx="16" cy="18.500" rx="9.800" ry="3.400" transform="rotate(35 16 18.500)" fill="url(#gWing)"/><ellipse cx="20.500" cy="13" rx="9.800" ry="3.400" transform="rotate(30 20.500 13)" fill="url(#gWing)"/><ellipse cx="24.500" cy="8.500" rx="7.200" ry="3" transform="rotate(25 24.500 8.500)" fill="url(#gWing)"/><path d="M3 27C1.800 14 8.500 5.200 19 3.800c4.500-.6 8.500.2 10.500 1.400C22.500 6.800 15.500 10.500 12 18.500 9.800 23 6.500 26 3 27z" fill="url(#gWing)"/></g><path d="M5.200 23C5.500 15 10 8.500 18 6" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="1.500" stroke-linecap="round"/></symbol>
<symbol id="i-unit" viewBox="0 0 32 32"><circle cx="16" cy="9.500" r="5.600" fill="url(#gSilver)" stroke="#23262b" stroke-width="1.400"/><path d="M4.500 28.500c0-6.600 5-10.800 11.500-10.800s11.500 4.200 11.500 10.800z" fill="url(#gSilver)" stroke="#23262b" stroke-width="1.400" stroke-linejoin="round"/></symbol>
</svg>`;
document.body.insertAdjacentHTML('afterbegin', SPRITE);
const ico = (n, label) => {
  const i = document.createElement('i');
  i.className = 'ico i-' + n;
  i.innerHTML = `<svg viewBox="0 0 32 32"><use href="#i-${n}"/></svg>`;
  if (label) { i.setAttribute('role', 'img'); i.setAttribute('aria-label', label); i.title = label; }
  else i.setAttribute('aria-hidden', 'true');
  return i;
};
const S = { user:null, group:'', budget:0, players:[], units:[], by:{}, rivals:{}, ids:[], done:false, tab:'build', fac:null, busy:false };

const el = (t, a = {}, ...k) => {
  const e = document.createElement(t);
  for (const [n, v] of Object.entries(a)) {
    if (v === false || v == null) continue;
    if (n.startsWith('on')) e.addEventListener(n.slice(2), v);
    else if (n === 'class') e.className = v;
    else e.setAttribute(n, v === true ? '' : v);
  }
  k.flat(9).forEach(c => { if (c !== false && c != null) e.append(c.nodeType ? c : String(c)); });
  return e;
};

/* ---------- Almacenamiento: Google Sheets (Apps Script) o modo demo en el navegador ---------- */
const post = b => fetch(C.sheetsUrl, { method:'POST', body:JSON.stringify(b) }).then(r => r.json());
const lsGet = () => JSON.parse(localStorage.getItem('hs_armies') || '{}');
const DB = C.sheetsUrl ? {
  players: () => fetch(C.sheetsUrl + '?action=players').then(r => r.json()),
  armies: () => fetch(C.sheetsUrl + '?action=armies').then(r => r.json()),
  confirm: (name, ids, cost) => post({ action:'confirm', name, ids, cost }),
} : {
  players: async () => C.demoPlayers.map(({ name, budget, group }) => ({ name, budget, group:group || '' })),
  armies: async () => lsGet(),
  confirm: async (name, ids, cost) => {
    const a = lsGet(); if (a[name]) return { ok:false, error:'Ya has confirmado tu ejército' };
    const g = (C.demoPlayers.find(p => p.name === name) || {}).group || '';
    const mates = C.demoPlayers.filter(p => (p.group || '') === g).map(p => p.name);
    const conflicts = ids.filter(i => mates.some(n => a[n] && a[n].ids.includes(i)));
    if (conflicts.length) return { ok:false, conflicts };
    a[name] = { ids, cost, at:Date.now() }; localStorage.setItem('hs_armies', JSON.stringify(a)); return { ok:true };
  },
};

/* ---------- Estado derivado ---------- */
const budget = () => S.budget;
// Un General cuesta 0 mientras todo el ejército sea de su misma facción
const unitCost = (u, ids) => u.Class === 'General' && ids.every(i => S.by[i].Faction === u.Faction) ? 0 : u.Cost;
const spent = (ids = S.ids) => ids.reduce((t, i) => t + unitCost(S.by[i], ids), 0);
const lockedBy = id => { for (const [n, a] of Object.entries(S.rivals)) if ((a.ids || []).includes(id)) return n; return null; };
const saveDraft = () => localStorage.setItem('hs_draft_' + S.user, JSON.stringify(S.ids));
async function loadRivals() {
  // Solo cuentan los jugadores de mi grupo
  const all = await DB.armies(), mates = new Set(S.players.filter(p => p.group === S.group).map(p => p.name));
  S.rivals = {};
  for (const [n, a] of Object.entries(all)) if (n !== S.user && mates.has(n)) S.rivals[n] = a;
  return all[S.user];
}
async function refresh() {
  try {
    const before = JSON.stringify(S.rivals); await loadRivals();
    if (before !== JSON.stringify(S.rivals)) { if (!S.done) S.ids = S.ids.filter(i => !lockedBy(i)); render(); }
  } catch (e) { /* sin conexión: se reintenta */ }
}

/* ---------- Datos ---------- */
const COLS = ['ID','number','Name','Faction','Cost','Species','Rarity','Unit Type','Class','Personality','Size','Height','Life','Move','Range','Attack','Defense','Powers'];
function loadUnits() {
  return new Promise((ok, ko) => Papa.parse('data/unit_data.csv', { download:true, header:true, skipEmptyLines:true,
    transformHeader: h => COLS.find(c => c.toLowerCase() === h.trim().toLowerCase()) || h.trim(),
    complete: r => {
      S.units = r.data.map(u => {
        ['ID','number','Cost','Height','Life','Move','Range','Attack','Defense'].forEach(k => u[k] = Number(u[k]) || 0);
        u.number = u.number || 1;
        return u;
      });
      S.units.forEach(u => S.by[u.ID] = u);
      ok();
    }, error: ko }));
}

/* ---------- UI genérica ---------- */
function modal(content, actions = [['Cerrar']]) {
  const m = el('div', { class:'ov', onclick:e => { if (e.target === m) m.remove(); } },
    el('div', { class:'dlg', role:'dialog', 'aria-modal':'true' }, content,
      el('div', { class:'row' }, actions.map(([label, fn, cls]) =>
        el('button', { class:cls || '', onclick:() => { m.remove(); fn && fn(); } }, label)))));
  document.body.append(m);
  m.querySelector('button')?.focus();
}
function powerItems(text) {
  const p = (text || '').trim() ? text.split('\n\n') : [], items = [];
  for (let i = 0; i < p.length; i += 2) items.push(el('h4', {}, p[i]), el('p', {}, p[i + 1] || ''));
  return items;
}
const hasFlight = u => (u.Powers || '').split('\n\n').some((t, i) => i % 2 === 0 && /^vuelo/i.test(t.trim()));
function powers(u) {
  const items = powerItems(u.Powers);
  modal([el('h3', {}, u.Name), items.length ? items : el('p', {}, 'Sin poderes especiales.')]);
}
const budgetBar = () => {
  const left = budget() - spent();
  return el('div', { class:'bar' }, el('span', {}, 'Presupuesto restante'),
    el('b', { class:left < 0 ? 'over' : '' }, `${left} / ${budget()}`),
    el('span', {}, `${S.ids.length} tarjetas, ${spent()} puntos gastados`), S.done && el('b', {}, '✓ Confirmado'));
};

// Prueba las extensiones en orden y usa la primera imagen que exista
const EXT = ['webp', 'jpg', 'jpeg', 'png'];
function unitImg(u) {
  const img = el('img', { alt:u.Name, loading:'lazy' }); let n = 0;
  img.onerror = () => { if (++n < EXT.length) img.src = `images/${u.ID}.${EXT[n]}`; else img.style.visibility = 'hidden'; };
  img.src = `images/${u.ID}.${EXT[0]}`;
  return img;
}

function card(u, o = {}) {
  const f = C.factions[u.Faction] || { c:['#444','#222'] };
  return el('article', { class:'card', style:`--a:${f.c[0]};--b:${f.c[1]}` },
    el('header', {},
      el('h3', {}, u.Name, u.Class === 'General' && ico('crown', 'General'), o.num && ` (x${u.number})`),
      !o.num && u.number > 1 && el('span', { class:'n' }, '×' + u.number),
      el('span', { class:'cost' }, ico('cost', 'Coste'), String(o.cost ?? u.Cost), o.cost != null && o.cost !== u.Cost && el('s', { class:'was' }, u.Cost))),
    el('p', { class:'meta' }, `${u['Unit Type']}, ${u.Species}, ${u.Class}, ${u.Personality}, ${u.Size} ${u.Height}`),
    el('div', { class:'body' },
      el('div', { class:'pic' + (o.lock ? ' locked' : '') },
        unitImg(u),
        o.lock && el('b', { class:'who' }, o.lock)),
      el('ul', { class:'stats' }, STATS.map(([k, i, name]) => el('li', {}, ico(i, name), el('span', {}, u[k]))))),
    el('footer', {},
      o.add && el('button', { class:'plus' + (S.ids.includes(u.ID) ? ' on' : ''), 'aria-label':(S.ids.includes(u.ID) ? 'Quitar ' : 'Añadir ') + u.Name, disabled:o.addOff, onclick:o.add }, S.ids.includes(u.ID) ? '✓' : '+'),
      o.del && el('button', { class:'x', 'aria-label':'Quitar ' + u.Name, onclick:o.del }, '✕'),
      el('button', { class:'help', 'aria-label':'Poderes de ' + u.Name, onclick:() => powers(u) }, '?')));
}

/* ---------- Pestañas ---------- */
function facIcon(f) { return f.icon.includes('/') ? el('img', { src:f.icon, alt:'' }) : f.icon; }

function build() {
  if (!S.fac) {
    const names = [...new Set(S.units.map(u => u.Faction))];
    return el('section', {}, budgetBar(), el('div', { class:'facs' }, names.map(n => {
      const f = C.factions[n] || { c:['#444','#222'], icon:'⚑' };
      const free = S.units.filter(u => u.Faction === n && !lockedBy(u.ID)).length;
      return el('button', { class:'fac', style:`--a:${f.c[0]};--b:${f.c[1]}` + (f.frame ? `;--frame:url(${f.frame})` : ''), onclick:() => { S.fac = n; render(); } },
        el('span', { class:'ic' }, facIcon(f)), el('strong', {}, n), el('small', {}, `${free} unidades disponibles`));
    })));
  }
  return el('section', {}, budgetBar(),
    el('button', { onclick:() => { S.fac = null; render(); } }, '← Facciones'), el('h2', { class:'ttl' }, S.fac),
    el('div', { class:'grid' }, S.units.filter(u => u.Faction === S.fac).map(u => {
      const lock = lockedBy(u.ID), next = [...S.ids, u.ID];
      return card(u, { num:true, lock, cost:unitCost(u, S.ids.includes(u.ID) ? S.ids : next),
        add:lock ? null : () => { S.ids = S.ids.includes(u.ID) ? S.ids.filter(i => i !== u.ID) : [...S.ids, u.ID]; saveDraft(); render(); },
        addOff:S.done || (!S.ids.includes(u.ID) && spent(next) > budget()) });
    })));
}

function army() {
  if (!S.ids.length) return el('section', {}, budgetBar(), el('p', { class:'note' }, 'Aún no has elegido unidades. Ve a Build y pulsa + en las que quieras.'));
  return el('section', {}, budgetBar(),
    el('div', { class:'grid' }, S.ids.map(id => card(S.by[id], { num:true, cost:unitCost(S.by[id], S.ids), ...(S.done ? {} : { del:() => { S.ids = S.ids.filter(i => i !== id); saveDraft(); render(); } }) }))),
    S.done ? el('p', { class:'note', style:'margin-top:1rem' }, 'Tu ejército está confirmado y ya no se puede modificar.')
           : el('button', { class:'confirm', disabled:S.busy, onclick:confirmArmy }, S.busy ? 'Confirmando…' : 'Confirmar'));
}

function confirmArmy() {
  modal(el('p', {}, '¿Estás seguro? No podrás realizar cambios tras confirmar.'), [['Cancelar'],
    ['Sí, continuar', () => modal(el('p', {}, `Última comprobación: tu ejército (${S.ids.length} tarjetas, ${spent()} puntos) quedará bloqueado.`),
      [['Volver'], ['Confirmar definitivamente', finalize, 'plus']]), 'plus']]);
}
async function finalize() {
  S.busy = true; render();
  try {
    const r = await DB.confirm(S.user, S.ids, spent());
    if (r.ok) S.done = true;
    else {
      await loadRivals();
      if (r.conflicts) {
        const names = r.conflicts.map(i => S.by[i].Name).join(', ');
        S.ids = S.ids.filter(i => !r.conflicts.includes(i)); saveDraft();
        modal(el('p', {}, 'Otro jugador confirmó antes estas unidades, así que las hemos quitado de tu ejército: ' + names + '. Revisa tu ejército y confirma de nuevo.'));
      } else modal(el('p', {}, /contrase/i.test(r.error || '') ? 'El script de Google está desactualizado: publica una nueva versión (Implementar, Gestionar implementaciones, editar, Nueva versión).' : (r.error || 'No se pudo confirmar.')));
    }
  } catch (e) { modal(el('p', {}, 'No hay conexión con la hoja de Google. Inténtalo de nuevo.')); }
  S.busy = false; render();
}

function rivals() {
  const rows = S.players.filter(p => p.name !== S.user && p.group === S.group).map(p => {
    const a = S.rivals[p.name], ids = a ? (a.ids || []) : [];
    if (!ids.length) return el('details', {}, el('summary', {}, el('b', {}, p.name), el('span', {}, 'Aún no ha confirmado su ejército')));
    const avg = k => (ids.reduce((t, i) => t + S.by[i][k], 0) / ids.length).toFixed(1);
    const us = ids.map(i => S.by[i]), facs = [...new Set(us.map(u => u.Faction))];
    const fl = facs.length === 1 ? (C.factions[facs[0]] || { icon:'⚑' }) : null;
    const logo = fl && (fl.icon.includes('/') ? el('img', { src:fl.icon, alt:facs[0], class:'flogo' }) : fl.icon);
    return el('details', {}, el('summary', {}, el('b', {}, p.name),
      STATS.map(([k, i, name]) => el('span', {}, ico(i, name), avg(k))),
      el('span', {}, ico('bow', 'Unidades a distancia'), String(us.filter(u => u.Range > 1).length)),
      el('span', {}, ico('wing', 'Unidades con vuelo'), String(us.filter(hasFlight).length)),
      el('span', {}, ico('unit', 'Figuras'), String(us.reduce((t, u) => t + u.number, 0))),
      el('span', {}, ico('cost', 'Coste total'), String(spent(ids))),
      fl && el('span', {}, ico('crown', 'Facción única'), logo)),
      el('div', { class:'grid' }, ids.map(i => card(S.by[i], { cost:unitCost(S.by[i], ids) }))));
  });
  return el('section', {}, el('div', { class:'bar' }, el('span', {}, 'Medias por tarjeta de cada ejército confirmado'), el('button', { onclick:refresh }, 'Actualizar')), rows);
}

const map = () => el('section', { class:'maps' },
  C.mapText && el('div', { class:'box' }, powerItems(C.mapText)),
  C.maps.map(src => {
    const a = el('a', { href:src, target:'_blank' }, el('img', { src, alt:'Mapa de la partida',
      onerror:() => a.replaceWith(el('p', { class:'note' }, 'No se encuentra ' + src)) }));
    return a;
  }));

function render() {
  const tabs = [['build','Build'],['army','Army'],['rivals','Rivals'],['map','Map']];
  const view = { build, army, rivals, map }[S.tab]();
  app.replaceChildren(
    el('header', { class:'top' }, el('h1', {}, 'Heroscape'), el('span', {}, S.user),
      el('button', { onclick:() => { sessionStorage.removeItem('hs_cred'); location.reload(); } }, 'Salir')),
    el('nav', {}, tabs.map(([k, l]) => el('button', { class:S.tab === k ? 'on' : '', onclick:() => { S.tab = k; render(); scrollTo(0, 0); refresh(); } }, l))),
    el('main', {}, view));
}

/* ---------- Inicio de sesión ---------- */
async function login() {
  const err = el('p', { class:'err', role:'alert' });
  document.body.classList.add('login-screen');
  if (C.loginBg) document.body.style.setProperty('--login-bg', `url(${C.loginBg})`);
  app.replaceChildren(el('div', { class:'login' }, el('h1', {}, 'Heroscape'), el('p', { class:'loading' }, 'Cargando jugadores…'), err));
  try { S.players = await DB.players(); } catch (e) { err.textContent = 'No se pudo conectar con la hoja de Google. Revisa sheetsUrl en config.js.'; return; }
  const sel = el('select', { 'aria-label':'Jugador' }, S.players.map(p => el('option', {}, p.name)));
  const go = () => { sessionStorage.setItem('hs_cred', sel.value); start(sel.value); };
  app.replaceChildren(el('div', { class:'login' }, el('h1', {}, 'Heroscape'),
    sel, el('button', { class:'plus', onclick:go }, 'Entrar'), err));
}

async function start(user) {
  document.body.classList.remove('login-screen');
  app.replaceChildren(el('p', { class:'loadscreen', role:'status' }, 'Cargando unidades…'));
  try {
    S.players = await DB.players();
    const me = S.players.find(p => p.name === user);
    if (!me) { sessionStorage.removeItem('hs_cred'); return login(); }
    Object.assign(S, { user, budget:me.budget, group:me.group || '' });
    await loadUnits();
    const mine = await loadRivals();
    if (mine) { S.ids = (mine.ids || []).filter(i => S.by[i]); S.done = true; }
    else S.ids = JSON.parse(localStorage.getItem('hs_draft_' + user) || '[]').filter(i => S.by[i] && !lockedBy(i));
    render(); setInterval(refresh, 30000);
  } catch (e) { app.replaceChildren(el('p', { class:'note' }, 'No se pudieron cargar los datos (data/unit_data.csv o la hoja de Google). Abre la web desde GitHub Pages o un servidor local, no con doble clic.')); }
}

const saved = sessionStorage.getItem('hs_cred');
saved ? start(saved) : login();