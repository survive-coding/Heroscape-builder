const C = CONFIG, app = document.getElementById('app');
const STATS = [['Life','❤️'],['Move','👣'],['Range','🎯'],['Attack','⚔️'],['Defense','🛡️']];
const S = { user:null, budget:0, players:[], units:[], by:{}, rivals:{}, ids:[], done:false, tab:'build', fac:null, busy:false };

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
  players: async () => C.demoPlayers.map(({ name, budget }) => ({ name, budget })),
  armies: async () => lsGet(),
  confirm: async (name, ids, cost) => {
    const a = lsGet(); if (a[name]) return { ok:false, error:'Ya has confirmado tu ejército' };
    const conflicts = ids.filter(i => Object.values(a).some(x => x.ids.includes(i)));
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
async function loadRivals() { const all = await DB.armies(); const mine = all[S.user]; delete all[S.user]; S.rivals = all; return mine; }
async function refresh() {
  try {
    const before = JSON.stringify(S.rivals); await loadRivals();
    if (before !== JSON.stringify(S.rivals)) { if (!S.done) S.ids = S.ids.filter(i => !lockedBy(i)); render(); }
  } catch (e) { /* sin conexión: se reintenta */ }
}

/* ---------- Datos ---------- */
function loadUnits() {
  return new Promise((ok, ko) => Papa.parse('data/unit_data.csv', { download:true, header:true, skipEmptyLines:true,
    complete: r => {
      S.units = r.data.map(u => {
        ['ID','number','Cost','Height','Life','Move','Range','Attack','Defense'].forEach(k => u[k] = Number(u[k]) || 0);
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
    el('header', {}, el('h3', {}, u.Name, u.Class === 'General' && el('span', { title:'General', 'aria-label':'General' }, ' 👑'), o.num && ` (x${u.number})`), !o.num && u.number > 1 && el('span', { class:'n' }, '×' + u.number), el('span', { class:'cost' }, '🪙 ' + (o.cost ?? u.Cost), o.cost != null && o.cost !== u.Cost && el('s', { class:'was' }, u.Cost))),
    el('p', { class:'meta' }, `${u['Unit Type']}, ${u.Species}, ${u.Class}, ${u.Personality}, ${u.Size} ${u.Height}`),
    el('div', { class:'body' },
      el('div', { class:'pic' + (o.lock ? ' locked' : '') },
        unitImg(u),
        o.lock && el('b', { class:'who' }, o.lock)),
      el('ul', { class:'stats' }, STATS.map(([k, i]) => el('li', {}, i, el('span', {}, u[k]))))),
    el('footer', {},
      o.add && el('button', { class:'plus', 'aria-label':'Añadir ' + u.Name, disabled:o.addOff, onclick:o.add }, S.ids.includes(u.ID) ? '✓' : '+'),
      o.del && el('button', { class:'x', 'aria-label':'Quitar ' + u.Name, onclick:o.del }, '✕'),
      el('button', { 'aria-label':'Poderes de ' + u.Name, onclick:() => powers(u) }, '?')));
}

/* ---------- Pestañas ---------- */
function facIcon(f) { return f.icon.includes('/') ? el('img', { src:f.icon, alt:'' }) : f.icon; }

function build() {
  if (!S.fac) {
    const names = [...new Set(S.units.map(u => u.Faction))];
    return el('section', {}, budgetBar(), el('div', { class:'facs' }, names.map(n => {
      const f = C.factions[n] || { c:['#444','#222'], icon:'⚑' };
      const free = S.units.filter(u => u.Faction === n && !lockedBy(u.ID)).length;
      return el('button', { class:'fac', style:`--a:${f.c[0]};--b:${f.c[1]}`, onclick:() => { S.fac = n; render(); } },
        el('span', { class:'ic' }, facIcon(f)), el('strong', {}, n), el('small', {}, `${free} unidades disponibles`));
    })));
  }
  return el('section', {}, budgetBar(),
    el('button', { onclick:() => { S.fac = null; render(); } }, '← Facciones'), el('h2', { style:'margin:.8rem 0' }, S.fac),
    el('div', { class:'grid' }, S.units.filter(u => u.Faction === S.fac).map(u => {
      const lock = lockedBy(u.ID), next = [...S.ids, u.ID];
      return card(u, { num:true, lock, cost:unitCost(u, S.ids.includes(u.ID) ? S.ids : next),
        add:lock ? null : () => { S.ids.push(u.ID); saveDraft(); render(); },
        addOff:S.done || S.ids.includes(u.ID) || spent(next) > budget() });
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
      } else modal(el('p', {}, r.error || 'No se pudo confirmar.'));
    }
  } catch (e) { modal(el('p', {}, 'No hay conexión con la hoja de Google. Inténtalo de nuevo.')); }
  S.busy = false; render();
}

function rivals() {
  const rows = S.players.filter(p => p.name !== S.user).map(p => {
    const a = S.rivals[p.name], ids = a ? (a.ids || []) : [];
    if (!ids.length) return el('details', {}, el('summary', {}, el('b', {}, p.name), el('span', {}, 'Aún no ha confirmado su ejército')));
    const avg = k => (ids.reduce((t, i) => t + S.by[i][k], 0) / ids.length).toFixed(1);
    const us = ids.map(i => S.by[i]), facs = [...new Set(us.map(u => u.Faction))];
    const fl = facs.length === 1 ? (C.factions[facs[0]] || { icon:'⚑' }) : null;
    const logo = fl && (fl.icon.includes('/') ? el('img', { src:fl.icon, alt:facs[0], style:'height:1.3em;vertical-align:middle' }) : fl.icon);
    return el('details', {}, el('summary', {}, el('b', {}, p.name),
      STATS.map(([k, i]) => el('span', {}, `${i} ${avg(k)}`)),
      el('span', {}, '🏹 ' + us.filter(u => u.Range > 1).length),
      el('span', {}, '🪽 ' + us.filter(hasFlight).length),
      el('span', {}, '👤 ' + us.reduce((t, u) => t + u.number, 0)),
      el('span', {}, '🪙 ' + spent(ids)),
      fl && el('span', {}, '👑 ', logo)),
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
  app.replaceChildren(el('div', { class:'login' }, el('h1', {}, 'Heroscape'), el('p', { style:'margin:0' }, 'Cargando jugadores…'), err));
  try { S.players = await DB.players(); } catch (e) { err.textContent = 'No se pudo conectar con la hoja de Google. Revisa sheetsUrl en config.js.'; return; }
  const sel = el('select', { 'aria-label':'Jugador' }, S.players.map(p => el('option', {}, p.name)));
  const go = () => { sessionStorage.setItem('hs_cred', sel.value); start(sel.value); };
  app.replaceChildren(el('div', { class:'login' }, el('h1', {}, 'Heroscape'), el('p', { style:'margin:0' }, 'Selector de ejércitos'),
    sel, el('button', { class:'plus', onclick:go }, 'Entrar'), err));
}

async function start(user) {
  app.replaceChildren(el('p', { class:'note' }, 'Cargando unidades…'));
  try {
    S.players = await DB.players();
    const me = S.players.find(p => p.name === user);
    if (!me) { sessionStorage.removeItem('hs_cred'); return login(); }
    Object.assign(S, { user, budget:me.budget });
    await loadUnits();
    const mine = await loadRivals();
    if (mine) { S.ids = (mine.ids || []).filter(i => S.by[i]); S.done = true; }
    else S.ids = JSON.parse(localStorage.getItem('hs_draft_' + user) || '[]').filter(i => S.by[i] && !lockedBy(i));
    render(); setInterval(refresh, 30000);
  } catch (e) { app.replaceChildren(el('p', { class:'note' }, 'No se pudieron cargar los datos (data/unit_data.csv o la hoja de Google). Abre la web desde GitHub Pages o un servidor local, no con doble clic.')); }
}

const saved = sessionStorage.getItem('hs_cred');
saved ? start(saved) : login();
