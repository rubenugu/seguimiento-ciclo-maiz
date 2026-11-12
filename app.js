'use strict';

// ==================== CATÁLOGOS (borrador: los definen los agrónomos) ====================
const VALOR_JORNAL = 250;          // Oaxaca; en REDMAÍZ lo fija Nivel Central por estado
const SUPERFICIE_PARCELA = 1.5;    // del registro de la parcela
const CLAVE = 'seguimiento-ciclo-maiz:v1';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const SEMANAS = ['1ª semana', '2ª semana', '3ª semana', '4ª semana'];
const MAICES = ['Chalqueño · nativo · blanco', 'Cónico · nativo · azul', 'Otro'];
const SINIESTROS = ['Sin siniestro', 'Menos del 25%', '25 a 50%', '50 a 75%', 'Más del 75%', 'Pérdida total'];
const UNIDADES = ['kg', 'g', 't', 'L', 'mL', 'bultos', 'piezas'];

const ETAPAS = {
  acond: { n: 'Acondicionamiento', p: ['Labores mecánicas', 'Conservación de suelo y agua', 'Aplicación de bioinsumos', 'Microorganismos benéficos', 'Acondicionamiento de la semilla'] },
  siembra: { n: 'Siembra', p: ['Siembra manual', 'Siembra mecanizada', 'Resiembra'] },
  nutri: { n: 'Nutrición', p: ['Nutrientes sólidos', 'Nutrición foliar', 'Microorganismos que fijan o solubilizan', 'Aplicación de bioinsumos'] },
  arv: { n: 'Arvenses', p: ['Deshierbe manual', 'Deshierbe mecánico', 'Herbicida natural', 'Herbicida químico'] },
  fito: { n: 'Fitosanitario', p: ['Barreras vivas o plantas repelentes', 'Trampeo', 'Bioinsumos de contacto o sistémicos', 'Microorganismos antagónicos', 'Liberación de insectos benéficos', 'Agroquímicos'] },
  riego: { n: 'Riego', p: ['Riego de siembra', 'Riego de auxilio'] },
  labores: { n: 'Labores culturales', p: ['Aporque', 'Rotación de cultivos', 'Policultivo', 'Otra labor'] },
  cosecha: { n: 'Cosecha', p: ['Cosecha', 'Trilla o desgrane', 'Flete'] },
};

const INSUMOS = [
  ['ninguno', 'Ninguno (solo mano de obra)', 'LAB'],
  ['bocashi', 'Bocashi', 'BIO'], ['composta', 'Composta', 'BIO'], ['lombri', 'Lombricomposta', 'BIO'], ['gallinaza', 'Gallinaza', 'BIO'],
  ['biol', 'Biol', 'BIO'], ['lixiviado', 'Lixiviado de lombriz', 'BIO'], ['supermagro', 'Supermagro', 'BIO'], ['sulfocalcico', 'Caldo sulfocálcico', 'BIO'],
  ['bordeles', 'Caldo bordelés', 'BIO'], ['neem', 'Extracto de neem', 'BIO'], ['mm', 'Microorganismos de montaña', 'BIO'], ['tricho', 'Trichoderma', 'BIO'], ['bt', 'Bacillus thuringiensis', 'BIO'],
  ['urea', 'Urea', 'QUI'], ['dap', 'DAP 18-46-00', 'QUI'], ['sulfato', 'Sulfato de amonio', 'QUI'], ['triple17', 'Triple 17', 'QUI'],
  ['glifosato', 'Glifosato', 'QUI'], ['24d', '2,4-D', 'QUI'], ['atrazina', 'Atrazina', 'QUI'], ['lambda', 'Lambda-cialotrina', 'QUI'],
  ['cipermetrina', 'Cipermetrina', 'QUI'], ['clorpirifos', 'Clorpirifos', 'QUI'], ['mancozeb', 'Mancozeb', 'QUI'],
  ['otro', 'Otro…', null],
].map(([id, n, t]) => ({ id, n, t }));
const INSUMO = Object.fromEntries(INSUMOS.map((i) => [i.id, i]));
const TIPO_TXT = { BIO: 'Biológico · cuenta como manejo en transición', QUI: 'Químico · cuenta como manejo convencional', LAB: 'Solo mano de obra · no cuenta en ningún manejo' };

const DESTINOS = [
  ['autoconsumo', 'Autoconsumo familiar', false], ['animales', 'Alimento para animales propios', false], ['semilla', 'Semilla para el siguiente ciclo', false],
  ['mercado', 'Venta en mercado local', true], ['intermediario', 'Venta a intermediario', true], ['cooperativa', 'Venta a cooperativa', true],
  ['institucion', 'Venta a institución', true], ['transformado', 'Venta de producto transformado', true],
].map(([id, n, venta]) => ({ id, n, venta }));
const DESTINO = Object.fromEntries(DESTINOS.map((d) => [d.id, d]));
const COLOR_DESTINO = ['#611323', '#a57f2c', '#e6d194', '#9b2247', '#cfb579', '#4d0f1c', '#757575', '#1e5b4f'];

// ==================== ESTADO ====================
function ejemplo() {
  return {
    siembraMes: 5, siembraSemana: 1, maiz: 0, semillaKg: '30',
    sueloMedido: false, sueloMetodo: 'Medidor portátil', sueloPh: '', sueloCe: '', sueloMo: '',
    practicas: [
      { id: 1, etapa: 'nutri', practica: 'Aplicación de bioinsumos', insumo: 'bocashi', cantidad: '2', unidad: 't', mes: 6, semana: 0, gasto: '3000', jornales: '6' },
      { id: 2, etapa: 'nutri', practica: 'Nutrientes sólidos', insumo: 'urea', cantidad: '75', unidad: 'kg', mes: 5, semana: 3, gasto: '1100', jornales: '1' },
      { id: 3, etapa: 'fito', practica: 'Bioinsumos de contacto o sistémicos', insumo: 'sulfocalcico', cantidad: '6', unidad: 'L', mes: 8, semana: 2, gasto: '330', jornales: '2' },
      { id: 4, etapa: 'fito', practica: 'Agroquímicos', insumo: 'lambda', cantidad: '0.4', unidad: 'L', mes: 8, semana: 0, gasto: '770', jornales: '1' },
      { id: 5, etapa: 'siembra', practica: 'Siembra manual', insumo: 'ninguno', cantidad: '', unidad: 'kg', mes: 5, semana: 1, gasto: '0', jornales: '5' },
      { id: 6, etapa: 'arv', practica: 'Deshierbe manual', insumo: 'ninguno', cantidad: '', unidad: 'kg', mes: 6, semana: 2, gasto: '0', jornales: '8' },
    ],
    cosechaMes: 10, cosechaSemana: 0, cosechaKg: '4200', cosechaHa: '1.5', siniestro: 0,
    destinos: [{ id: 'autoconsumo', pct: '60', precio: '' }, { id: 'mercado', pct: '30', precio: '7.50' }, { id: 'semilla', pct: '10', precio: '' }],
    enviado: null, guardado: null,
  };
}

function cargar() {
  try { const t = localStorage.getItem(CLAVE); if (t) return JSON.parse(t); } catch (e) { /* sin almacenamiento: se trabaja en memoria */ }
  return ejemplo();
}
let S = cargar();
function guardar() {
  S.guardado = new Date().toISOString();
  try { localStorage.setItem(CLAVE, JSON.stringify(S)); } catch (e) { /* modo privado o sin espacio */ }
}

// ==================== UTILIDADES ====================
const $ = (id) => document.getElementById(id);
const num = (v) => { const n = parseFloat(String(v ?? '').replace(/,/g, '')); return Number.isFinite(n) ? n : 0; };
const vacio = (v) => String(v ?? '').trim() === '';
const pesos = (n, dec = 0) => '$' + n.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const fmt = (n, dec = 1) => n.toLocaleString('es-MX', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const opciones = (sel, lista, valor) => { sel.innerHTML = lista.map((t, i) => `<option value="${i}">${esc(t)}</option>`).join(''); sel.value = String(valor); };
const tipoDe = (p) => (p.insumo === 'otro' ? p.otroTipo : INSUMO[p.insumo]?.t) || 'LAB';
const nombreInsumo = (p) => (p.insumo === 'otro' ? p.otroNombre : INSUMO[p.insumo]?.n);
const totalPractica = (p) => num(p.gasto) + num(p.jornales) * VALOR_JORNAL;

function toast(texto) {
  const t = $('toast'); t.textContent = texto; t.classList.add('visible');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('visible'), 2200);
}

// ==================== CÁLCULOS ====================
function calcular() {
  const total = S.practicas.reduce((s, p) => s + totalPractica(p), 0);
  const por = { BIO: 0, QUI: 0, LAB: 0 };
  S.practicas.forEach((p) => { por[tipoDe(p)] += totalPractica(p); });
  const kg = num(S.cosechaKg), ha = num(S.cosechaHa);
  const pctTotal = S.destinos.reduce((s, d) => s + num(d.pct), 0);
  const ingreso = S.destinos.reduce((s, d) => s + (DESTINO[d.id]?.venta ? kg * num(d.pct) / 100 * num(d.precio) : 0), 0);
  const kgVenta = S.destinos.reduce((s, d) => s + (DESTINO[d.id]?.venta ? kg * num(d.pct) / 100 : 0), 0);
  const manejo = por.BIO + por.QUI;
  const haMal = ha <= 0 || ha > SUPERFICIE_PARCELA;
  const preciosFaltan = S.destinos.some((d) => DESTINO[d.id]?.venta && num(d.precio) <= 0);
  const sueloMal = S.sueloMedido && (!vacio(S.sueloPh) && (num(S.sueloPh) < 3 || num(S.sueloPh) > 10) || !vacio(S.sueloMo) && (num(S.sueloMo) < 0 || num(S.sueloMo) > 20));
  const checks = [
    { ok: !vacio(S.semillaKg) && num(S.semillaKg) > 0, t: 'Siembra completa' },
    { ok: S.practicas.length > 0, t: S.practicas.length ? `${S.practicas.length} prácticas con costo` : 'Falta al menos una práctica' },
    { ok: kg > 0 && !haMal, t: haMal ? `Ha cosechadas entre 0 y ${SUPERFICIE_PARCELA}` : kg > 0 ? 'Cosecha registrada' : 'Falta el grano cosechado' },
    { ok: Math.abs(pctTotal - 100) < 0.01, t: Math.abs(pctTotal - 100) < 0.01 ? 'Destino al 100%' : `Destino suma ${fmt(pctTotal, 0)}%` },
    { ok: !preciosFaltan, t: preciosFaltan ? 'Falta precio en un destino de venta' : 'Precios de venta completos' },
    { ok: !sueloMal, t: sueloMal ? 'Revise pH o materia orgánica' : 'Valores de suelo válidos' },
  ];
  return {
    total, porHa: total / SUPERFICIE_PARCELA, kg, ha, rend: ha > 0 ? kg / ha / 1000 : 0, costoKg: kg > 0 ? total / kg : 0,
    ingreso, kgVenta, pctTotal, bio: manejo ? por.BIO / manejo * 100 : 0, qui: manejo ? por.QUI / manejo * 100 : 0,
    porBio: por.BIO, porQui: por.QUI, haMal, checks, listo: checks.every((c) => c.ok),
  };
}

// ==================== PINTAR ====================
function pintarPracticas() {
  const lista = $('listaPracticas');
  if (!S.practicas.length) { lista.innerHTML = '<div class="vacio">Aún no hay prácticas. Agregue la primera.</div>'; return; }
  const orden = Object.keys(ETAPAS);
  const filas = [...S.practicas].sort((a, b) => orden.indexOf(a.etapa) - orden.indexOf(b.etapa) || a.mes - b.mes || a.semana - b.semana);
  lista.innerHTML = filas.map((p) => {
    const t = tipoDe(p), ins = nombreInsumo(p), cant = vacio(p.cantidad) || p.insumo === 'ninguno' ? '—' : `${esc(p.cantidad)} ${esc(p.unidad)}`;
    const cuando = `${MESES[p.mes].slice(0, 3)}, ${SEMANAS[p.semana].replace(' semana', ' sem')}`;
    const prac = esc(p.practica) + (p.insumo !== 'ninguno' ? ` · ${esc(ins)}` : '');
    return `<div class="reng" role="row">
      <span class="c-tipo" role="cell"><span class="tipo ${t}">${t === 'QUI' ? 'QUÍ' : t}</span></span>
      <span class="c-prac" role="cell">${prac}<span class="sub-etapa">${ETAPAS[p.etapa].n}</span></span>
      <span class="c-det">${[ETAPAS[p.etapa].n, cuando, cant === '—' ? '' : cant, num(p.jornales) ? `${esc(num(p.jornales))} ${num(p.jornales) === 1 ? 'jornal' : 'jornales'}` : ''].filter(Boolean).join(' · ')}</span>
      <span class="c-cuando" role="cell">${cuando}</span>
      <span class="c-cant num" role="cell">${cant}</span>
      <span class="c-jor num" role="cell">${esc(num(p.jornales))}</span>
      <span class="c-ins num" role="cell">${num(p.gasto).toLocaleString('es-MX')}</span>
      <span class="c-total num total" role="cell">${pesos(totalPractica(p))}</span>
      <span class="c-acc acciones" role="cell">
        <button type="button" data-editar="${p.id}" aria-label="Editar ${prac}"><span class="ms" aria-hidden="true">edit</span></button>
        <button type="button" data-borrar="${p.id}" aria-label="Quitar ${prac}"><span class="ms" aria-hidden="true">delete</span></button>
      </span>
    </div>`;
  }).join('');
}

function pintarDestinos() {
  $('listaDestinos').innerHTML = S.destinos.map((d, i) => {
    const venta = DESTINO[d.id]?.venta;
    return `<div class="destino">
      <label class="campo d-dest">Destino<select data-dest="${i}" data-k="id">${DESTINOS.map((o) => `<option value="${o.id}"${o.id === d.id ? ' selected' : ''}>${esc(o.n)}</option>`).join('')}</select></label>
      <label class="campo d-pct">%<input data-dest="${i}" data-k="pct" inputmode="decimal" value="${esc(d.pct)}" autocomplete="off"></label>
      <label class="campo d-precio">Precio ($/kg)<input data-dest="${i}" data-k="precio" inputmode="decimal" value="${venta ? esc(d.precio) : ''}" placeholder="${venta ? '0.00' : 'No aplica'}" ${venta ? '' : 'disabled'} autocomplete="off"></label>
      <button class="quitar" type="button" data-quitar-dest="${i}" aria-label="Quitar destino"><span class="ms" aria-hidden="true">close</span></button>
    </div>`;
  }).join('');
}

function pintarResultado() {
  const r = calcular();
  $('resumenPracticas').innerHTML = `<span>Total <strong>${pesos(r.total)}</strong> · ${pesos(r.porHa)}/ha</span><span style="color: var(--verde);">Biológico <strong>${pesos(r.porBio)}</strong></span><span style="color: var(--aviso);">Químico <strong>${pesos(r.porQui)}</strong></span>`;
  $('rRend').textContent = r.rend ? `${fmt(r.rend)} t/ha` : '—';
  $('rCostoHa').textContent = r.total ? pesos(r.porHa) : '—';
  $('rCostoKg').textContent = r.costoKg ? pesos(r.costoKg, 2) : '—';
  $('rIngreso').textContent = r.ingreso ? pesos(r.ingreso) : '—';
  $('mCosto').textContent = r.total ? `${pesos(r.porHa)}/ha · ${r.rend ? fmt(r.rend) + ' t/ha' : 'sin cosecha'}` : '—';
  $('barraManejo').innerHTML = `<span style="width: ${r.bio}%; background: var(--verde);"></span><span style="width: ${r.qui}%; background: #f59e0b;"></span>`;
  $('barraManejo').setAttribute('aria-label', `Biológico ${Math.round(r.bio)} por ciento, químico ${Math.round(r.qui)} por ciento`);
  $('pBio').textContent = `Biológico ${Math.round(r.bio)}%`;
  $('pQui').textContent = `Químico ${Math.round(r.qui)}%`;
  $('checks').innerHTML = r.checks.map((c) => `<li class="${c.ok ? 'si' : 'no'}"><span class="ms" aria-hidden="true">${c.ok ? 'check_circle' : 'error'}</span>${esc(c.t)}</li>`).join('');

  const pct = r.pctTotal, ok = Math.abs(pct - 100) < 0.01;
  $('chipDestino').innerHTML = ok ? '<span class="chip ok"><span class="ms" aria-hidden="true" style="font-size: 16px;">check_circle</span>Suma 100%</span>'
    : `<span class="chip aviso"><span class="ms" aria-hidden="true" style="font-size: 16px;">info</span>Suma ${fmt(pct, 0)}%${pct < 100 ? ` · falta ${fmt(100 - pct, 0)}%` : ' · sobra'}</span>`;
  $('barraDestino').innerHTML = S.destinos.map((d, i) => `<span style="width: ${Math.min(num(d.pct), 100)}%; background: ${COLOR_DESTINO[i % COLOR_DESTINO.length]};"></span>`).join('');
  $('barraDestino').setAttribute('aria-label', `Destino repartido al ${fmt(pct, 0)} por ciento`);

  $('errHa').textContent = r.haMal && !vacio(S.cosechaHa) ? `Máximo ${SUPERFICIE_PARCELA} ha` : '';
  $('cosechaHa').setAttribute('aria-invalid', String(r.haMal && !vacio(S.cosechaHa)));
  const phMal = S.sueloMedido && !vacio(S.sueloPh) && (num(S.sueloPh) < 3 || num(S.sueloPh) > 10);
  const moMal = S.sueloMedido && !vacio(S.sueloMo) && (num(S.sueloMo) < 0 || num(S.sueloMo) > 20);
  $('errPh').textContent = phMal ? 'Entre 3 y 10' : ''; $('sueloPh').setAttribute('aria-invalid', String(phMal));
  $('errMo').textContent = moMal ? 'Entre 0 y 20' : ''; $('sueloMo').setAttribute('aria-invalid', String(moMal));

  const enviado = !!S.enviado;
  $('formulario').disabled = enviado;
  $('btnReiniciar').hidden = false;
  $('estadoEnvio').textContent = enviado ? 'Enviado' : 'Borrador';
  document.querySelectorAll('[data-enviar]').forEach((b) => { b.disabled = enviado || !r.listo; b.hidden = enviado; });
  $('zonaEnvio').innerHTML = enviado
    ? `<div class="enviado"><span class="ms" aria-hidden="true">task_alt</span>Enviado el ${new Date(S.enviado).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}${navigator.onLine ? '' : ' · se sube al volver la señal'}. Para corregir, pida una apertura.</div>`
    : `<button class="btn btn-verde btn-enviar" type="button" data-enviar ${r.listo ? '' : 'disabled'}><span class="ms" aria-hidden="true">send</span>Enviar seguimiento</button>`;
  $('guardado').innerHTML = S.guardado ? `<span class="ms" aria-hidden="true">smartphone</span>Guardado en este dispositivo a las ${new Date(S.guardado).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : '';
}

function pintarTodo() {
  opciones($('siembraMes'), MESES, S.siembraMes); opciones($('siembraSemana'), SEMANAS, S.siembraSemana);
  opciones($('maiz'), MAICES, S.maiz); opciones($('siniestro'), SINIESTROS, S.siniestro);
  opciones($('cosechaMes'), MESES, S.cosechaMes); opciones($('cosechaSemana'), SEMANAS, S.cosechaSemana);
  ['semillaKg', 'sueloPh', 'sueloCe', 'sueloMo', 'cosechaKg', 'cosechaHa'].forEach((k) => { $(k).value = S[k] ?? ''; });
  $('sueloMetodo').value = S.sueloMetodo;
  document.querySelectorAll('[data-suelo]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.suelo === 'si') === S.sueloMedido)));
  $('camposSuelo').hidden = !S.sueloMedido;
  $('valorJornal').textContent = pesos(VALOR_JORNAL);
  $('supParcela').textContent = SUPERFICIE_PARCELA;
  pintarPracticas(); pintarDestinos(); pintarResultado();
}

// ==================== EVENTOS DEL FORMULARIO ====================
const SELECTS_NUM = ['siembraMes', 'siembraSemana', 'maiz', 'siniestro', 'cosechaMes', 'cosechaSemana'];
SELECTS_NUM.forEach((k) => $(k).addEventListener('change', (e) => { S[k] = +e.target.value; guardar(); pintarResultado(); }));
['semillaKg', 'sueloPh', 'sueloCe', 'sueloMo', 'cosechaKg', 'cosechaHa'].forEach((k) => $(k).addEventListener('input', (e) => { S[k] = e.target.value; guardar(); pintarResultado(); }));
$('sueloMetodo').addEventListener('change', (e) => { S.sueloMetodo = e.target.value; guardar(); });
document.querySelectorAll('[data-suelo]').forEach((b) => b.addEventListener('click', () => { S.sueloMedido = b.dataset.suelo === 'si'; guardar(); pintarTodo(); }));

$('listaDestinos').addEventListener('input', (e) => {
  const i = e.target.dataset.dest; if (i === undefined) return;
  S.destinos[i][e.target.dataset.k] = e.target.value;
  if (e.target.dataset.k === 'id') { if (!DESTINO[e.target.value].venta) S.destinos[i].precio = ''; pintarDestinos(); }
  guardar(); pintarResultado();
});
$('listaDestinos').addEventListener('click', (e) => {
  const b = e.target.closest('[data-quitar-dest]'); if (!b) return;
  S.destinos.splice(+b.dataset.quitarDest, 1); guardar(); pintarDestinos(); pintarResultado();
});
$('btnDestino').addEventListener('click', () => {
  const usados = new Set(S.destinos.map((d) => d.id));
  const libre = DESTINOS.find((d) => !usados.has(d.id)) || DESTINOS[0];
  const resto = Math.max(0, 100 - S.destinos.reduce((s, d) => s + num(d.pct), 0));
  S.destinos.push({ id: libre.id, pct: resto ? String(resto) : '', precio: '' });
  guardar(); pintarDestinos(); pintarResultado();
});

$('listaPracticas').addEventListener('click', (e) => {
  const ed = e.target.closest('[data-editar]'), bo = e.target.closest('[data-borrar]');
  if (ed) abrirPractica(S.practicas.find((p) => p.id === +ed.dataset.editar));
  if (bo) {
    const i = S.practicas.findIndex((p) => p.id === +bo.dataset.borrar);
    const quitada = S.practicas.splice(i, 1)[0];
    guardar(); pintarPracticas(); pintarResultado(); toast(`Se quitó "${quitada.practica}"`);
  }
});

// ==================== DIÁLOGO DE PRÁCTICA ====================
const dlg = $('dlgPractica');
let edicion = null, etapaSel = 'acond';
opciones($('pMes'), MESES, 0); opciones($('pSemana'), SEMANAS, 0);
$('pUnidad').innerHTML = UNIDADES.map((u) => `<option>${u}</option>`).join('');
$('pInsumo').innerHTML = INSUMOS.map((i) => `<option value="${i.id}">${esc(i.n)}</option>`).join('');

function pintarEtapas() {
  $('chipsEtapa').innerHTML = Object.entries(ETAPAS).map(([k, v]) => `<button type="button" data-etapa="${k}" aria-pressed="${k === etapaSel}">${v.n}</button>`).join('');
  $('pPractica').innerHTML = ETAPAS[etapaSel].p.map((p) => `<option>${esc(p)}</option>`).join('');
}
$('chipsEtapa').addEventListener('click', (e) => { const b = e.target.closest('[data-etapa]'); if (!b) return; etapaSel = b.dataset.etapa; pintarEtapas(); });

function actualizarDialogo() {
  const ins = $('pInsumo').value, otro = ins === 'otro', ninguno = ins === 'ninguno';
  $('campoOtro').hidden = !otro;
  $('campoCantidad').hidden = ninguno; $('campoUnidad').hidden = ninguno;
  const t = otro ? $('pOtroTipo').value : INSUMO[ins].t;
  $('pTipoTxt').innerHTML = `<span class="tipo ${t}">${t === 'QUI' ? 'QUÍ' : t}</span>${TIPO_TXT[t]}`;
  $('pTipoTxt').style.color = t === 'BIO' ? 'var(--verde)' : t === 'QUI' ? 'var(--aviso)' : 'var(--gris-600)';
  const j = num($('pJornales').value), total = num($('pGasto').value) + j * VALOR_JORNAL;
  $('pJornalTxt').textContent = `${fmt(j, j % 1 ? 1 : 0)} jornales × ${pesos(VALOR_JORNAL)} (valor fijo de Oaxaca) = ${pesos(j * VALOR_JORNAL)}`;
  $('pTotal').textContent = `${pesos(total)} · ${pesos(total / SUPERFICIE_PARCELA)}/ha`;
}
['pInsumo', 'pOtroTipo', 'pGasto', 'pJornales'].forEach((k) => $(k).addEventListener('input', actualizarDialogo));

function abrirPractica(p) {
  edicion = p || null;
  $('dlgTexto').textContent = p ? 'Editar práctica' : 'Agregar práctica';
  $('btnGuardarOtra').hidden = !!p;
  etapaSel = p ? p.etapa : etapaSel; pintarEtapas();
  $('pPractica').value = p ? p.practica : ETAPAS[etapaSel].p[0];
  $('pInsumo').value = p ? p.insumo : 'ninguno';
  $('pOtroNombre').value = p?.otroNombre || ''; $('pOtroTipo').value = p?.otroTipo || 'BIO';
  $('pCantidad').value = p?.cantidad || ''; $('pUnidad').value = p?.unidad || 'kg';
  $('pMes').value = String(p ? p.mes : S.siembraMes); $('pSemana').value = String(p ? p.semana : 0);
  $('pGasto').value = p?.gasto || ''; $('pJornales').value = p?.jornales || '';
  $('pError').textContent = '';
  actualizarDialogo();
  dlg.showModal();
}

function leerPractica() {
  const ins = $('pInsumo').value;
  if (ins === 'otro' && vacio($('pOtroNombre').value)) return 'Escriba el nombre del insumo.';
  if (ins !== 'ninguno' && num($('pCantidad').value) <= 0) return 'Indique la cantidad usada en toda la parcela.';
  if (num($('pGasto').value) < 0 || num($('pJornales').value) < 0) return 'Los montos no pueden ser negativos.';
  if (num($('pGasto').value) === 0 && num($('pJornales').value) === 0) return 'Capture el gasto en insumo o los jornales.';
  return {
    id: edicion ? edicion.id : Date.now(), etapa: etapaSel, practica: $('pPractica').value, insumo: ins,
    otroNombre: ins === 'otro' ? $('pOtroNombre').value.trim() : undefined, otroTipo: ins === 'otro' ? $('pOtroTipo').value : undefined,
    cantidad: ins === 'ninguno' ? '' : $('pCantidad').value, unidad: $('pUnidad').value,
    mes: +$('pMes').value, semana: +$('pSemana').value, gasto: $('pGasto').value || '0', jornales: $('pJornales').value || '0',
  };
}

function guardarPractica(otra) {
  const p = leerPractica();
  if (typeof p === 'string') { $('pError').textContent = p; return; }
  if (edicion) S.practicas[S.practicas.findIndex((x) => x.id === edicion.id)] = p; else S.practicas.push(p);
  guardar(); pintarPracticas(); pintarResultado();
  toast(edicion ? 'Práctica actualizada' : 'Práctica agregada');
  if (otra) abrirPractica(null); else dlg.close();
}
$('btnAgregar').addEventListener('click', () => abrirPractica(null));
$('btnGuardarPractica').addEventListener('click', () => guardarPractica(false));
$('btnGuardarOtra').addEventListener('click', () => guardarPractica(true));
$('btnCerrarDlg').addEventListener('click', () => dlg.close());

// ==================== ENVÍO ====================
const dlgEnv = $('dlgEnviar');
document.addEventListener('click', (e) => { if (e.target.closest('[data-enviar]') && calcular().listo && !S.enviado) dlgEnv.showModal(); });
$('btnCancelarEnvio').addEventListener('click', () => dlgEnv.close());
$('btnConfirmarEnvio').addEventListener('click', () => {
  S.enviado = new Date().toISOString(); guardar(); dlgEnv.close(); pintarTodo();
  toast(navigator.onLine ? 'Seguimiento enviado' : 'Guardado; se envía al volver la señal');
});
$('btnReiniciar').addEventListener('click', () => {
  if (!confirm('¿Volver al ejemplo inicial? Se pierde lo capturado en este navegador.')) return;
  S = ejemplo(); guardar(); pintarTodo(); toast('Ejemplo restaurado');
});

// ==================== MENÚ Y CONEXIÓN ====================
const marco = $('marco'), movil = matchMedia('(max-width: 760px)');
$('btnMenu').addEventListener('click', () => {
  const clase = movil.matches ? 'menu-abierto' : 'menu-cerrado';
  marco.classList.toggle(clase);
  $('btnMenu').setAttribute('aria-expanded', String(movil.matches ? marco.classList.contains('menu-abierto') : !marco.classList.contains('menu-cerrado')));
});
$('fondoMenu').addEventListener('click', () => marco.classList.remove('menu-abierto'));
function pintarConexion() {
  const c = $('conexion'), en = navigator.onLine;
  c.className = 'conexion' + (en ? '' : ' sin');
  c.innerHTML = `<span class="ms" aria-hidden="true" style="font-size: 16px;">${en ? 'cloud_done' : 'cloud_off'}</span>${en ? 'En línea' : 'Sin conexión'}`;
}
addEventListener('online', () => { pintarConexion(); pintarResultado(); });
addEventListener('offline', pintarConexion);

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => { /* sin modo offline */ });

if (movil.matches) $('btnMenu').setAttribute('aria-expanded', 'false');
pintarConexion();
pintarTodo();
