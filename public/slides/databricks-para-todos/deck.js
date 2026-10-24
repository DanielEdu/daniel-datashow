/* Databricks para todos — motor del deck + datos de los popups
   v1.2 · creado 23-oct-2026 · actualizado 23-oct-2026
   Nombres de servicios según el catálogo del vault (renombres 2026). Estados GA/Preview/Beta
   a oct-2026: verificar en release notes antes de presentarlo en público. */

const C = { lava: '#FF3621', lava2: '#FF8A73', navy: '#1B3139', navy2: '#0B2026', blue: '#2272B4', blue2: '#4C9BE8',
  green: '#00A972', green2: '#3CCB97', yellow: '#FFAB00', oat: '#F9F7F4', oat2: '#EEEDE9', oat3: '#E3E0D8', white: '#FFFFFF', violet: '#6B5FD6' };

/* ------------------------------------------------------------------ */
/* Personajes flat (estilo ilustración Google: sin rostro, formas planas) */
/* ------------------------------------------------------------------ */
const SKIN = ['#F2C3A0', '#D69A6E', '#8D5A3B', '#E8B48F'];
function person(o = {}) {
  const skin = SKIN[+o.skin || 0] || o.skin;
  const hair = o.hair || '#2B2523';
  const shirt = o.shirt || C.blue;
  const pants = o.pants || C.navy;
  const st = o.style || 'short';
  const prop = o.prop || 'stand';
  let back = '', front = '';
  if (st === 'long') {
    back = `<path d="M44 52 Q44 24 70 24 Q96 24 96 52 V100 Q86 96 84 72 H56 Q54 96 44 100Z" fill="${hair}"/>`;
    front = `<path d="M46 52 Q47 28 70 28 Q93 28 94 52 Q82 36 58 42Z" fill="${hair}"/>`;
  } else if (st === 'bun') {
    back = `<circle cx="70" cy="22" r="11" fill="${hair}"/>`;
    front = `<path d="M46 52 Q46 26 70 26 Q94 26 94 52 Q88 36 70 36 Q52 36 46 52Z" fill="${hair}"/>`;
  } else if (st === 'curly') {
    front = [[50, 38], [60, 30], [72, 27], [84, 31], [92, 40], [46, 50], [94, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${hair}"/>`).join('');
  } else if (st === 'helmet') {
    front = `<path d="M44 46 Q44 20 70 20 Q96 20 96 46Z" fill="${C.yellow}"/><rect x="38" y="42" width="64" height="9" rx="4.5" fill="#E09600"/><rect x="66" y="20" width="8" height="24" rx="3" fill="#E09600"/>`;
  } else if (st === 'bald') {
    front = `<path d="M46 56 Q45 46 49 42 Q48 52 50 58Z" fill="${hair}"/><path d="M94 56 Q95 46 91 42 Q92 52 90 58Z" fill="${hair}"/>`;
  } else if (st === 'side') {
    front = `<path d="M45 54 Q42 24 72 25 Q98 27 95 52 Q90 40 76 37 Q60 44 45 54Z" fill="${hair}"/>`;
  } else {
    front = `<path d="M46 52 Q46 26 70 26 Q94 26 94 52 Q90 38 72 38 Q54 38 46 52Z" fill="${hair}"/>`;
  }
  if (o.beard) front += `<path d="M50 60 Q52 80 70 80 Q88 80 90 60 Q86 70 70 70 Q54 70 50 60Z" fill="${hair}"/>`;
  if (o.glasses) front += `<g fill="none" stroke="${C.navy}" stroke-width="2.6"><circle cx="61" cy="54" r="7"/><circle cx="79" cy="54" r="7"/><path d="M68 54h4"/></g>`;
  const arm = (d, hx, hy) => `<path d="${d}" fill="none" stroke="${shirt}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${hx}" cy="${hy}" r="8.5" fill="${skin}"/>`;
  let arms = '', item = '';
  const L = arm('M44 104 L36 160', 36, 166), R = arm('M96 104 L104 160', 104, 166);
  switch (prop) {
    case 'laptop':
      arms = arm('M44 104 L52 140', 56, 142) + arm('M96 104 L88 140', 84, 142);
      item = `<rect x="34" y="122" width="72" height="48" rx="6" fill="#D5DCDF"/><rect x="34" y="166" width="72" height="6" rx="3" fill="#B8C2C6"/><circle cx="70" cy="146" r="6" fill="${o.acc || C.lava}"/>`;
      break;
    case 'tablet':
      arms = arm('M44 104 L54 136', 56, 138) + arm('M96 104 L86 136', 84, 138);
      item = `<rect x="44" y="112" width="52" height="40" rx="6" fill="${C.navy}"/><path d="M52 142 L62 132 L70 138 L86 120" fill="none" stroke="${o.acc || C.green2}" stroke-width="4" stroke-linecap="round"/>`;
      break;
    case 'point':
      arms = L + arm('M96 104 L120 66', 122, 60); break;
    case 'wave':
      arms = L + arm('M96 104 L114 64', 116, 56); break;
    case 'think':
      arms = L + arm('M96 104 L102 136 L82 86', 80, 80); break;
    case 'both':
      arms = arm('M44 104 L22 70', 20, 64) + arm('M96 104 L118 70', 120, 64); break;
    case 'clip':
      arms = L + arm('M96 104 L92 140', 88, 142);
      item = `<rect x="80" y="112" width="40" height="52" rx="5" fill="${C.white}" stroke="${C.oat3}" stroke-width="2"/><rect x="92" y="108" width="16" height="8" rx="3" fill="${C.navy}"/><path d="M88 128h24M88 138h24M88 148h16" stroke="${o.acc || C.blue}" stroke-width="3.4" stroke-linecap="round"/>`;
      break;
    default: arms = L + R;
  }
  return `<svg viewBox="0 0 140 262" xmlns="http://www.w3.org/2000/svg" class="person">
    <ellipse cx="70" cy="252" rx="44" ry="8" fill="rgba(27,49,57,.12)"/>
    ${back}
    <rect x="47" y="168" width="20" height="78" rx="9" fill="${pants}"/><rect x="73" y="168" width="20" height="78" rx="9" fill="${pants}"/>
    <ellipse cx="56" cy="247" rx="14" ry="7" fill="${C.navy2}"/><ellipse cx="85" cy="247" rx="14" ry="7" fill="${C.navy2}"/>
    <rect x="62" y="70" width="16" height="24" rx="6" fill="${skin}"/>
    <path d="M40 104 Q40 90 54 90 H86 Q100 90 100 104 V180 H40Z" fill="${shirt}"/>
    <path d="M62 90 L70 102 L78 90Z" fill="${skin}"/>
    <circle cx="70" cy="52" r="24" fill="${skin}"/>
    ${front}${arms}${item}
  </svg>`;
}

/* ------------------------------------------------------------------ */
/* Íconos de producto, dibujados desde cero (viewBox 48) */
/* ------------------------------------------------------------------ */
const ICON = {
  aibi: `<path d="M24 8a16 16 0 1 0 16 16H24z" fill="${C.lava}"/><path d="M28 4a16 16 0 0 1 16 16H28z" fill="${C.lava2}"/>`,
  apps: `<rect x="6" y="6" width="16" height="16" rx="4" fill="${C.lava}"/><rect x="26" y="6" width="16" height="16" rx="4" fill="${C.lava2}"/><rect x="6" y="26" width="16" height="16" rx="4" fill="${C.lava2}"/><rect x="26" y="26" width="16" height="16" rx="4" fill="${C.lava}"/>`,
  lakewatch: `<path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z" fill="${C.lava}"/><path d="M14 23c3-5 6-7 10-7s7 2 10 7c-3 5-6 7-10 7s-7-2-10-7z" fill="#fff"/><circle cx="24" cy="23" r="3.6" fill="${C.navy}"/>`,
  customerlake: `<circle cx="16" cy="14" r="6" fill="${C.lava}"/><rect x="7" y="22" width="18" height="20" rx="8" fill="${C.lava}"/><circle cx="33" cy="18" r="5" fill="${C.lava2}"/><rect x="25" y="25" width="16" height="17" rx="7" fill="${C.lava2}"/>`,
  genie: `<path d="M6 30h30c0 7-6 11-15 11S6 37 6 30z" fill="${C.lava}"/><path d="M36 30c4 0 7-3 7-6" stroke="${C.lava}" stroke-width="3.4" fill="none" stroke-linecap="round"/><rect x="18" y="41" width="8" height="4" rx="2" fill="${C.lava2}"/><path d="M22 4l2.6 7.4L32 14l-7.4 2.6L22 24l-2.6-7.4L12 14l7.4-2.6z" fill="${C.lava2}"/>`,
  genieone: `<circle cx="24" cy="24" r="18" fill="${C.lava}"/><path d="M24 12l2.4 7.6L34 22l-7.6 2.4L24 32l-2.4-7.6L14 22l7.6-2.4z" fill="#fff"/>`,
  genieagents: `<rect x="6" y="10" width="36" height="26" rx="8" fill="${C.lava}"/><circle cx="18" cy="23" r="3.4" fill="#fff"/><circle cx="30" cy="23" r="3.4" fill="#fff"/><path d="M16 36l-4 8 10-8z" fill="${C.lava}"/><rect x="21" y="3" width="6" height="8" rx="3" fill="${C.lava2}"/>`,
  geniecode: `<rect x="4" y="8" width="40" height="32" rx="8" fill="${C.lava}"/><path d="M18 18l-6 6 6 6M30 18l6 6-6 6" stroke="#fff" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  zeroops: `<circle cx="24" cy="24" r="9" fill="none" stroke="${C.lava}" stroke-width="6"/><g fill="${C.lava}">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<rect x="21" y="4" width="6" height="9" rx="2" transform="rotate(${a} 24 24)"/>`).join('')}</g><circle cx="24" cy="24" r="3" fill="${C.lava2}"/>`,
  appbuilder: `<rect x="6" y="28" width="16" height="14" rx="3" fill="${C.lava}"/><rect x="26" y="28" width="16" height="14" rx="3" fill="${C.lava2}"/><rect x="16" y="10" width="16" height="14" rx="3" fill="${C.lava}"/>`,
  agentbricks: `<rect x="8" y="8" width="30" height="8" rx="3" fill="${C.lava}"/><rect x="14" y="20" width="26" height="8" rx="3" fill="${C.lava2}"/><rect x="8" y="32" width="22" height="8" rx="3" fill="${C.lava}"/>`,
  ontology: `<g stroke="${C.lava2}" stroke-width="2.6"><path d="M24 24L10 12M24 24L38 12M24 24L10 38M24 24L38 38M24 24V6"/></g><circle cx="24" cy="24" r="7" fill="${C.lava}"/><circle cx="10" cy="12" r="4.5" fill="${C.lava}"/><circle cx="38" cy="12" r="4.5" fill="${C.lava}"/><circle cx="10" cy="38" r="4.5" fill="${C.lava2}"/><circle cx="38" cy="38" r="4.5" fill="${C.lava2}"/><circle cx="24" cy="6" r="3.5" fill="${C.lava2}"/>`,
  uc: `<circle cx="24" cy="24" r="8" fill="${C.lava}"/>${Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `<circle cx="${(24 + 17 * Math.cos(a)).toFixed(1)}" cy="${(24 + 17 * Math.sin(a)).toFixed(1)}" r="3.4" fill="${i % 2 ? C.lava2 : C.lava}"/>`; }).join('')}`,
  gateway: `<path d="M8 42V20a16 16 0 0 1 32 0v22h-8V20a8 8 0 0 0-16 0v22z" fill="${C.lava}"/><circle cx="24" cy="32" r="5" fill="${C.lava2}"/><rect x="21.5" y="35" width="5" height="9" rx="2" fill="${C.lava2}"/>`,
  lakeflow: `<path d="M6 14h14l8 10h14" stroke="${C.lava}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 34h14l8-10" stroke="${C.lava2}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  lakehouse: `<path d="M6 22L24 8l18 14v6H6z" fill="${C.lava}"/><path d="M4 34c4-3 8-3 12 0s8 3 12 0 8-3 12 0 4 2 4 2v6H4z" fill="${C.lava2}"/>`,
  lakebase: `<ellipse cx="24" cy="12" rx="16" ry="6" fill="${C.lava}"/><path d="M8 12v10c0 3 7 6 16 6s16-3 16-6V12c0 3-7 6-16 6S8 15 8 12z" fill="${C.lava2}"/><path d="M8 26v10c0 3 7 6 16 6s16-3 16-6V26c0 3-7 6-16 6S8 29 8 26z" fill="${C.lava}"/>`,
  iceberg: `<path d="M8 28L20 8l6 8 4-4 10 16z" fill="${C.blue2}"/><path d="M4 28h40" stroke="${C.blue}" stroke-width="3"/><path d="M12 30l8 12 6-4 6 4 4-12z" fill="${C.blue}" opacity=".55"/>`,
  cloud: `<path d="M14 36a9 9 0 0 1-1-18 12 12 0 0 1 23 2 8 8 0 0 1-1 16z" fill="${C.blue}"/>`,
  model: `<g stroke="${C.violet}" stroke-width="2.4"><path d="M10 12L24 24 38 12M10 36L24 24 38 36M10 12V36M38 12V36"/></g>${[[10, 12], [38, 12], [10, 36], [38, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.violet}"/>`).join('')}<circle cx="24" cy="24" r="6.5" fill="${C.lava}"/>`,
  data: `<ellipse cx="24" cy="11" rx="14" ry="5" fill="${C.green}"/><path d="M10 11v26c0 3 6 5 14 5s14-2 14-5V11c0 3-6 5-14 5s-14-2-14-5z" fill="${C.green2}"/><path d="M10 24c0 3 6 5 14 5s14-2 14-5" stroke="${C.green}" stroke-width="2.4" fill="none"/>`,
  mlflow: `<circle cx="24" cy="24" r="15" fill="none" stroke="${C.blue}" stroke-width="6" stroke-dasharray="70 24"/><path d="M36 8l4 10-10-1z" fill="${C.blue}"/>`,
  search: `<circle cx="20" cy="20" r="12" fill="none" stroke="${C.lava}" stroke-width="6"/><path d="M29 29l11 11" stroke="${C.lava}" stroke-width="7" stroke-linecap="round"/>`,
  dev: `<rect x="4" y="8" width="40" height="30" rx="6" fill="${C.navy}"/><path d="M12 18l6 5-6 5M22 30h12" stroke="${C.green2}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="16" y="40" width="16" height="4" rx="2" fill="${C.navy}"/>`,
  plus: `<circle cx="24" cy="24" r="18" fill="${C.oat2}"/><path d="M24 15v18M15 24h18" stroke="${C.navy}" stroke-width="4" stroke-linecap="round"/>`,
};
ICON.db = `<ellipse cx="24" cy="11" rx="14" ry="5" fill="${C.blue}"/><path d="M10 11v26c0 3 6 5 14 5s14-2 14-5V11c0 3-6 5-14 5s-14-2-14-5z" fill="${C.blue2}"/><path d="M10 20c0 3 6 5 14 5s14-2 14-5M10 29c0 3 6 5 14 5s14-2 14-5" stroke="${C.blue}" stroke-width="2.4" fill="none"/>`;
ICON.saas = `<path d="M13 38a10 10 0 0 1-1-20 13 13 0 0 1 25 2 9 9 0 0 1-1 18z" fill="${C.blue2}"/><rect x="16" y="21" width="17" height="12" rx="2" fill="#fff"/><rect x="16" y="21" width="17" height="3.5" rx="1.5" fill="${C.blue}"/>`;
ICON.file = `<path d="M11 4h18l9 9v31H11z" fill="#D6F2E5"/><path d="M29 4v9h9z" fill="${C.green2}"/><path d="M17 22h15M17 29h15M17 36h9" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>`;
ICON.iot = `<rect x="20" y="26" width="8" height="18" rx="2" fill="${C.navy}"/><circle cx="24" cy="22" r="4.5" fill="${C.lava}"/><path d="M15 14a13 13 0 0 1 18 0M9.5 8.5a21 21 0 0 1 29 0" stroke="${C.lava}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
ICON.media = `<rect x="5" y="8" width="38" height="32" rx="6" fill="#E6E3FA"/><circle cx="16" cy="18" r="4.5" fill="${C.yellow}"/><path d="M5 35l12-12 9 9 6-6 11 11v1a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6z" fill="${C.violet}"/>`;
ICON.platform = `<rect x="8" y="8" width="32" height="36" rx="3" fill="${C.navy}"/>${[14, 22, 30].map(y => [14, 22, 30].map(x => `<rect x="${x}" y="${y}" width="5" height="5" rx="1" fill="${C.yellow}" opacity="${(x + y) % 16 ? 1 : .45}"/>`).join('')).join('')}<rect x="20" y="37" width="8" height="7" fill="${C.oat2}"/>`;
ICON.disk = `<rect x="6" y="8" width="36" height="32" rx="6" fill="#7D8B90"/><circle cx="24" cy="24" r="11" fill="#C3BBAE"/><circle cx="24" cy="24" r="3" fill="#7D8B90"/><path d="M26 26l10 9" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`;
ICON.hourglass = `<path d="M13 6h22M13 42h22" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><path d="M16 6c0 11 16 12 16 18s-16 7-16 18M32 6c0 11-16 12-16 18s16 7 16 18" stroke="#fff" stroke-width="3.2" fill="none"/><path d="M18 40c2-5 10-5 12 0z" fill="#fff"/>`;
ICON.bolt = `<path d="M27 3L11 27h11l-3 18 18-26H26z" fill="#fff"/>`;
ICON.mail = `<rect x="5" y="10" width="38" height="28" rx="5" fill="none" stroke="#fff" stroke-width="3.4"/><path d="M7 13l17 13 17-13" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
ICON.dbmark = `<g transform="translate(4 4) scale(1.667)"><path d="M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.565.308v.77L12 24l11.05-6.218v-4.317l-.515-.309L12 19.118l-9.867-5.653v-2.21L12 16.805l11.05-6.218V6.32l-.515-.308L12 11.974 2.647 6.681 12 1.388l7.76 4.368.668-.411v-.566L12 0 .95 6.27v.72L12 13.207l9.919-5.55v2.26L12 15.52 1.516 9.56l-.565.308Z" fill="${C.lava}"/></g>`;
const icon = k => `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">${ICON[k] || ''}</svg>`;

/* logos oficiales (monocromos) de simple-icons vía CDN; los demás son archivos en assets/ */
const DB_MARK = 'M.95 14.184L12 20.403l9.919-5.55v2.21L12 22.662l-10.484-5.96-.565.308v.77L12 24l11.05-6.218v-4.317l-.515-.309L12 19.118l-9.867-5.653v-2.21L12 16.805l11.05-6.218V6.32l-.515-.308L12 11.974 2.647 6.681 12 1.388l7.76 4.368.668-.411v-.566L12 0 .95 6.27v.72L12 13.207l9.919-5.55v2.26L12 15.52 1.516 9.56l-.565.308Z';
const dbmark = (fill = C.lava) => `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${DB_MARK}" fill="${fill}"/></svg>`;
/* Logo TPT rehecho: ícono original (recortado del PNG oficial) + texto vivo; "TI" en negro */
const tptIcon = () => (document.getElementById('tpt-icon-src') || {}).src || 'assets/tpt-icon.png';
const tptLogo = dark => `<span class="tpt-logo${dark ? ' dark' : ''}"><img src="${tptIcon()}" alt=""><span class="tx"><span>TALENTO</span><span><em>PARA</em> <b>TI</b></span></span></span>`;
const dwLogo = dark => `<span style="display:inline-flex;align-items:center;gap:7px;height:38px"><img src="${(document.getElementById('dw-src') || {}).src || 'assets/datawizard-logo.png'}" alt="Data Wizard" style="height:100%"><span style="font:800 15px/1 Montserrat,sans-serif;color:${dark ? '#fff' : '#1a1f4d'}">DATA<br><span style="color:#E0A100">WIZARD</span></span></span>`;
const SI = v => `https://cdn.jsdelivr.net/npm/simple-icons@13.0.0/icons/${v}.svg`;

/* ------------------------------------------------------------------ */
/* Contenido de los popups del stack 2026 y de industrias */
/* ------------------------------------------------------------------ */
const P = (n, chip, d, was) => ({ n, chip, d, was });
const MODAL = {
  aibi: { t: 'AI/BI', s: 'Business Intelligence con IA incorporada: dashboards que también conversan.', ic: 'aibi', acc: C.lava, pieces: [
    P('AI/BI Dashboards', 'GA', 'Dashboards nativos sobre el lakehouse. Se arman también en lenguaje natural (datasets, gráficos, filtros) y traen “Ask Genie” activo por defecto.'),
    P('Metric Views', 'Preview', 'KPIs definidos una sola vez en Unity Catalog (YAML) y reutilizados igual en dashboards, Genie, SQL y herramientas externas.'),
    P('Migración desde Power BI / Tableau', 'Preview', 'Genie Code importa reportes existentes y los convierte en dashboards AI/BI.'),
    P('Excel Add-in', 'Preview', 'En Azure Databricks: consultar datos gobernados desde Excel, sin drivers y con escritura de vuelta.'),
  ], ex: 'La gerente comercial abre el dashboard de ventas, ve que Arequipa cayó 12 % y en vez de pedir otro reporte pregunta en el mismo panel: “¿qué productos explican la caída?”. Genie responde con un gráfico usando la misma métrica oficial.' },
  apps: { t: 'Databricks Apps', s: 'Aplicaciones web de datos e IA que viven dentro de la plataforma, con seguridad incluida.', ic: 'apps', acc: C.lava, pieces: [
    P('Databricks Apps', 'GA', 'Servidor siempre activo para Streamlit, Dash, Gradio, FastAPI, React… con OAuth por delante y una identidad propia (service principal).'),
    P('App Spaces y Serverless Micro Apps', 'Nuevo', 'Anunciados en el Data + AI Summit 2026: agrupar y gobernar apps a escala empresarial, y apps livianas que escalan a cero.'),
    P('Lakebase como backend', 'GA', 'Las apps leen y escriben en Postgres administrado, sincronizado con las tablas del lakehouse.'),
    P('Genie App Builder', 'Private Preview', 'Construir la app describiéndola en lenguaje natural, con la gobernanza ya puesta.'),
  ], ex: 'Operaciones necesita una app para aprobar ajustes de inventario: lee el stock del lakehouse, guarda cada aprobación en Lakebase y solo la ven los jefes de tienda gracias a Unity Catalog. No hay servidor externo que mantener.' },
  lakewatch: { t: 'Lakewatch', s: 'SIEM agéntico: la seguridad de la empresa analizada como datos, con agentes que vigilan.', ic: 'lakewatch', acc: C.lava, pieces: [
    P('Datos de seguridad en formato abierto', 'GA', 'Logs de firewall, identidad, endpoints y nube en el lakehouse, con retención larga a costo de almacenamiento de objetos.'),
    P('Agentes de detección', 'GA', 'Crean reglas de detección, priorizan alertas y buscan amenazas nuevas sobre todo el histórico.'),
    P('Panther', 'Anunciado', 'Databricks anunció la intención de sumar Panther (SOC con IA, detection-as-code y 100+ integraciones de seguridad).'),
  ], ex: 'Un banco guarda 2 años de logs en vez de 90 días. Ante un acceso raro a las 3 a.m., el agente cruza identidad, VPN y transacciones, arma la línea de tiempo y deja el caso listo para el analista del SOC.' },
  customerlake: { t: 'CustomerLake', s: 'CDP agéntico: una vista única de cada cliente y campañas personalizadas por agentes.', ic: 'customerlake', acc: C.lava, pieces: [
    P('Profile Agents', 'GA', 'Unifican identidades duplicadas (mismo cliente en app, web, tienda y call center) con IA.'),
    P('Campaign Agents', 'GA', 'Personalización uno a uno con modelos pequeños, sobre los datos gobernados del lakehouse.'),
    P('Sin copiar datos a otra herramienta', '', 'El perfil vive en tu lakehouse: el mismo dato sirve a marketing, riesgo y servicio.'),
  ], ex: 'Una cadena de retail descubre que “María P.”, “maria.perez@…” y el teléfono de la tarjeta de puntos son la misma persona; la siguiente campaña le ofrece lo que compra, no lo que ya tiene.' },
  genie: { t: 'Genie', s: 'La familia de experiencias de IA para cada persona de la empresa: preguntar, crear, programar y operar.', ic: 'genie', acc: C.lava, pieces: [
    P('Genie One', 'GA', 'Compañero de trabajo con IA conectado a tus datos gobernados y a 50+ fuentes (Salesforce, Drive, SharePoint). Responde, crea documentos y ejecuta tareas. Tiene app móvil.', 'antes: Databricks One'),
    P('Genie Agents', 'GA', 'Cualquiera convierte una conversación en un agente reutilizable y lo publica en Slack o Microsoft Teams.', 'antes: Genie Spaces'),
    P('Genie Code', 'GA', 'Agente de programación que entiende tu plataforma: escribe pipelines, SQL, notebooks y corrige errores.', 'antes: Databricks Assistant'),
    P('Genie ZeroOps', 'Preview', 'Agente de fondo que vigila pipelines y modelos, encuentra la causa de una falla y propone el arreglo ya probado.'),
    P('Genie App Builder', 'Private Preview', 'Crear aplicaciones de datos e IA describiéndolas en lenguaje natural.'),
    P('Genie Ontology', 'Preview', 'Grafo de conocimiento del negocio que da contexto a todos los agentes en milisegundos.'),
  ], ex: 'Un jefe de planta escribe en Teams: “¿qué línea tuvo más paradas esta semana y por qué?”. Genie Agents consulta las tablas de producción, responde con un gráfico y, si un pipeline falló de noche, ZeroOps ya dejó el arreglo propuesto para aprobar.' },
  ontology: { t: 'Genie Ontology', s: 'La capa de contexto: qué significa cada cosa en tu negocio, para que la IA no adivine.', ic: 'ontology', acc: C.lava, pieces: [
    P('Grafo de conocimiento automático', 'Preview', 'Se construye solo a partir de tablas, métricas, uso y documentos, con el algoritmo OntoRank.'),
    P('Contexto en milisegundos', 'Preview', 'Los agentes recuperan definiciones y relaciones al instante en vez de explorar el catálogo durante minutos.'),
    P('Unido a la semántica de Unity Catalog', '', 'Business Glossary, dominios y métricas certificadas alimentan la ontología.'),
  ], ex: 'Cuando alguien pregunta por “clientes activos”, la ontología sabe que en esta empresa significa “con al menos una transacción en 90 días” y qué tabla certificada usar.' },
  agentbricks: { t: 'Agent Bricks', s: 'La plataforma abierta para construir, desplegar, optimizar y gobernar agentes de IA sobre tus datos.', ic: 'agentbricks', acc: C.lava, pieces: [
    P('Knowledge Assistant', 'GA', 'Asistente de preguntas y respuestas sobre documentos (manuales, contratos, políticas) con citas a la fuente.'),
    P('Supervisor Agent', 'GA', 'Orquesta varios agentes, Genie Agents y herramientas MCP para resolver tareas de varios pasos.'),
    P('Document Intelligence', 'Nuevo', 'Extraer y estructurar información de documentos: facturas, formularios, PDFs escaneados.'),
    P('Agentes a medida', 'GA', 'Con LangGraph, OpenAI Agents SDK o LlamaIndex, envueltos en la interfaz de MLflow y desplegados como endpoint o como App.'),
    P('Databricks AI Search', 'GA', 'Búsqueda vectorial, por palabras clave (BM25), híbrida y con reranking para RAG.', 'antes: Mosaic AI Vector Search'),
    P('Model Serving + Foundation Model APIs', 'GA', 'Modelos propios, abiertos o externos (Anthropic, OpenAI, Gemini, Llama…) servidos como endpoint, con pago por token.'),
    P('Memoria administrada para agentes', 'Beta', 'Memoria de largo plazo por usuario guardada como objeto de Unity Catalog.'),
    P('MLflow 3', 'GA', 'Trazas, evaluación con jueces automáticos y monitoreo de calidad de cada agente.'),
  ], ex: 'Una aseguradora crea un Knowledge Assistant sobre 4.000 pólizas en PDF. Agent Bricks genera preguntas de prueba, compara varios modelos y elige el de mejor calidad por costo; el agente responde citando la cláusula exacta.', foot: 'Pilares: Choice (cualquier modelo) · Context (datos + MCP + memoria) · Control (Unity AI Gateway).' },
  omnigent: { t: 'Omnigent', s: 'Meta-harness open source: combina, controla y comparte agentes como Claude Code, Codex o los tuyos.', img: 'omni', acc: C.violet, pieces: [
    P('Composición', 'Beta', 'Cambiar de Claude Code a Codex u otro harness es una línea de configuración; se combinan modelos y técnicas sin reescribir.'),
    P('Control', 'Beta', 'Políticas con estado aplicadas en la capa del harness, no en el prompt: qué puede hacer el agente y cuándo pedir permiso.'),
    P('Colaboración', 'Beta', 'Sesiones vivas compartidas por URL: un compañero ve al agente trabajar, comenta o toma el control.'),
    P('Open source (Apache 2.0)', 'Alpha', 'El proyecto abierto puede correr fuera de Databricks; la versión administrada corre en sandbox dentro del workspace.'),
  ], ex: 'El equipo de datos define un agente “revisor de pipelines” en un YAML corto. Hoy usa Claude Code; si mañana conviene otro modelo, cambian una línea y las políticas de seguridad siguen igual.' },
  dev: { t: 'Agentic Dev', s: 'Herramientas para que los equipos técnicos desarrollen y desplieguen agentes, apps y modelos como software.', ic: 'dev', acc: C.navy, pieces: [
    P('Genie Code', 'GA', 'Agente de programación en notebooks, SQL y pipelines, con contexto de tu plataforma.', 'antes: Databricks Assistant'),
    P('Declarative Automation Bundles', 'GA', 'Infraestructura como código para jobs, pipelines, apps y agentes; CI/CD con el CLI de Databricks.', 'antes: Databricks Asset Bundles'),
    P('Git folders + VS Code / Databricks Connect', 'GA', 'Desarrollo local con depuración real contra el cómputo remoto.', 'antes: Databricks Repos'),
    P('AI Runtime y GPUs serverless', 'Preview', 'Cómputo GPU sin administrar clusters, para entrenar y ajustar modelos.'),
  ], ex: 'Un AI engineer programa el agente en VS Code, lo prueba con MLflow, y un pull request despliega con un bundle a desarrollo, QA y producción sin pasos manuales.' },
  uc: { t: 'Unity Catalog', s: 'Un solo lugar para gobernar datos e IA: quién accede, qué significa, de dónde viene y con quién se comparte.', ic: 'uc', acc: C.blue, pieces: [
    P('Access', 'GA', 'Permisos finos sobre tablas, archivos, modelos, funciones y agentes; filtros de filas, máscaras de columnas y políticas por etiquetas.'),
    P('Semantics', 'Preview', 'Business Glossary, Domains y Metrics: definiciones oficiales del negocio reutilizables por personas e IA.'),
    P('Observability', 'GA', 'Linaje automático de columna a dashboard, auditoría, system tables de uso y costo, y Data quality monitoring.', 'antes: Lakehouse Monitoring'),
    P('OpenSharing', 'GA', 'Compartir datos, modelos y skills de agentes con otras empresas o plataformas, sin copiarlos. Compatible con Iceberg REST.', 'antes: Delta Sharing'),
    P('Catalog Explorer', 'GA', 'La interfaz para buscar, entender y pedir acceso a los activos de datos.', 'antes: Data Explorer'),
    P('Open source', 'GA', 'Unity Catalog es abierto (Linux Foundation): sin amarre a un proveedor.'),
  ], ex: 'El analista de marketing ve la tabla de clientes con el DNI enmascarado; riesgo la ve completa. Si alguien cambia una columna, el linaje muestra en segundos qué dashboards y agentes se afectan.' },
  gateway: { t: 'Unity AI Gateway', s: 'La gobernanza de todo el tráfico y el gasto de IA: modelos, agentes y herramientas MCP.', ic: 'gateway', acc: C.blue, pieces: [
    P('Models', 'GA', 'Una sola puerta a modelos internos y externos, con ruteo según costo, carga o disponibilidad.'),
    P('Security', 'GA', 'Guardrails y políticas contextuales en tiempo real; registro gobernado de servidores MCP.'),
    P('Cost Optimization', 'GA', 'Presupuestos y límites por usuario, equipo o proyecto; trazabilidad de cada llamada con MLflow.'),
  ], ex: 'Cada área tiene un presupuesto mensual de IA. Si el chatbot de RR. HH. intenta enviar datos personales a un modelo externo, la política lo bloquea; si se acerca al límite, se rutea a un modelo más económico.', foot: 'En la documentación aparece también como “Unity Gateway”.' },
  lakeflow: { t: 'Lakeflow', s: 'Toda la ingeniería de datos: traer, transformar y orquestar, en lote o en tiempo real.', ic: 'lakeflow', acc: C.blue, pieces: [
    P('Lakeflow Connect', 'GA', 'Ingesta administrada con 100+ conectores: SQL Server, Oracle, Salesforce, Workday, ServiceNow, Google Analytics…'),
    P('Lakeflow pipelines', 'GA', 'ETL declarativo: describes el resultado y la plataforma resuelve orden, incrementalidad, reintentos y calidad.', 'antes: Delta Live Tables (DLT)'),
    P('Lakeflow Jobs', 'GA', 'Orquestación serverless de todo el flujo, con disparadores por horario, archivo o tabla.', 'antes: Databricks Workflows'),
    P('Lakeflow Designer', 'GA', 'Diseño visual sin código (o describiéndolo en lenguaje natural) que genera pipelines versionables.'),
    P('ZeroBus Ingest', 'GA', 'Envía eventos directo a tablas Delta en segundos, compatible con Kafka y sin operar un broker.'),
    P('Real-Time Mode', 'GA', 'Streaming de latencia de milisegundos para fraude y casos críticos.'),
  ], ex: 'Cada noche se traían 40 tablas del ERP con scripts frágiles. Con Lakeflow Connect se replican solo los cambios, un pipeline arma bronce → plata → oro con reglas de calidad, y un Job avisa por Teams si algo falla.' },
  lakehouse: { t: 'Lakehouse', s: 'El almacén analítico: el orden de un data warehouse sobre el lago abierto y barato.', ic: 'lakehouse', acc: C.blue, pieces: [
    P('Databricks SQL', 'GA', 'Data warehouse serverless sobre el lakehouse; compatible con Power BI, Tableau, dbt y Excel.'),
    P('Photon', 'GA', 'Motor vectorizado en C++ que acelera SQL y DataFrames sin cambiar código.'),
    P('Predictive Optimization', 'GA', 'Mantenimiento automático de tablas (compactar, limpiar, estadísticas, clustering) según el uso real.'),
    P('Lakehouse//RT', 'Beta', 'Nuevo warehouse para consultas de milisegundos sobre tablas Delta/Iceberg, con el motor Reyden.'),
    P('LakeBridge', 'GA', 'Herramienta gratuita, asistida por IA, para evaluar y convertir el SQL de tu data warehouse actual.'),
    P('Lakehouse Federation', 'GA', 'Consultar bases externas (Oracle, SQL Server, Snowflake, BigQuery…) sin moverlas todavía.'),
  ], ex: 'Una empresa migra desde un DWH on-premise: LakeBridge analiza 3.000 procedimientos, convierte la mayoría automáticamente y Federation permite convivir con el sistema viejo mientras se migra por etapas.' },
  lakebase: { t: 'Lakebase', s: 'Postgres serverless dentro de la plataforma, para apps y agentes que necesitan responder en milisegundos.', ic: 'lakebase', acc: C.blue, pieces: [
    P('Lakebase Postgres', 'GA', 'Postgres real y administrado, con cómputo y almacenamiento separados, autoescalado y escala a cero.'),
    P('Branching instantáneo', 'GA', 'Copias de la base en menos de un segundo para pruebas o para cada agente.'),
    P('Lakebase Search', 'Beta', 'Búsqueda vectorial y por texto dentro de Postgres, en una sola consulta SQL.'),
    P('Synced tables', 'GA', 'Tablas del lakehouse publicadas en Postgres para servirlas a una app.'),
    P('LTAP', 'Anunciado', 'Una sola copia del dato para lo transaccional y lo analítico, sin ETL entre ambos.'),
  ], ex: 'La app móvil consulta el saldo de puntos de un cliente en 5 ms desde Lakebase; el mismo dato llega al lakehouse para analítica sin un ETL aparte.' },
  infra: { t: 'Open Infrastructure', s: 'Formatos abiertos, cualquier nube, cualquier modelo, cualquier dato: tus datos siguen siendo tuyos.', ic: 'cloud', acc: C.green, pieces: [
    P('Delta Lake', 'GA', 'Formato abierto de tablas con transacciones, versiones y viaje en el tiempo. Creado por Databricks y donado a la Linux Foundation.'),
    P('Apache Iceberg v3', 'GA', 'Tablas Iceberg administradas, interoperables con Delta en la misma capa (UniForm).'),
    P('Any Cloud', 'GA', 'AWS, Microsoft Azure (Azure Databricks) y Google Cloud, con la misma experiencia.'),
    P('Any Model', 'GA', 'Modelos de Anthropic, OpenAI, Google, Meta y abiertos, o los tuyos.'),
    P('Any Data', 'GA', 'Tablas, archivos, JSON, documentos, imágenes, audio y streaming en el mismo lugar.'),
    P('Apache Spark', 'GA', 'El motor open source que dio origen a Databricks, hoy con Spark Declarative Pipelines.'),
  ], ex: 'Si algún día la empresa decide leer sus tablas con otro motor, puede hacerlo: los datos están en archivos Parquet con formato Delta o Iceberg en su propia cuenta de nube.' },
  extras: { t: 'Piezas que no salen en el diagrama', s: 'Servicios que completan la plataforma y conviene conocer.', ic: 'plus', acc: C.navy, pieces: [
    P('MLflow', 'GA', 'Ciclo de vida de modelos y agentes: experimentos, registro, evaluación y trazas. Open source.'),
    P('Databricks AI Search', 'GA', 'Recuperación para RAG: vectorial, BM25, híbrida y reranking.', 'antes: Vector Search'),
    P('Feature Store en Unity Catalog', 'GA', 'Variables para modelos, en lote y en línea, con point-in-time correcto.'),
    P('Databricks Marketplace', 'GA', 'Datos, modelos y soluciones de terceros listos para usar.'),
    P('Clean Rooms', 'GA', 'Cruzar datos con un socio sin que ninguno vea los datos crudos del otro.'),
    P('Free Edition', 'GA', 'Versión gratuita para aprender: Unity Catalog, Genie Code, Lakebase, Agent Bricks y GPUs serverless.', 'antes: Community Edition'),
  ], ex: 'Un banco y un retailer usan Clean Rooms para medir cuántos clientes en común respondieron a una campaña conjunta, sin intercambiar bases de clientes.' },
};

const IND = {
  banca: { t: 'Banca y fintech', s: 'Decidir en milisegundos y con trazabilidad total.', pieces: [
    P('Fraude en tiempo real', '', 'Cada transacción entra por ZeroBus, un modelo la califica en milisegundos y Lakebase guarda la decisión.'),
    P('Riesgo crediticio', '', 'Scoring con más variables (transaccionales, digitales, buró) y modelos versionados en MLflow para el regulador.'),
    P('Agente de atención', '', 'Agent Bricks responde sobre productos y movimientos, con permisos por cliente en Unity Catalog.'),
    P('Reportes regulatorios', '', 'Linaje de punta a punta: de dónde salió cada número del reporte.'),
  ], ex: 'Un pago con tarjeta en otra ciudad a las 2 a.m. se compara con el patrón del cliente; si el riesgo es alto se pide confirmación en la app antes de aprobar.' },
  seguros: { t: 'Seguros', s: 'Tarifas más justas y siniestros resueltos más rápido.', pieces: [
    P('Pricing y suscripción', '', 'Modelos de riesgo con datos internos y externos para tarifar por perfil.'),
    P('Siniestros con documentos', '', 'Document Intelligence lee peritajes, fotos y facturas y prellena el expediente.'),
    P('Detección de fraude', '', 'Grafos de relaciones entre asegurados, talleres y proveedores.'),
  ], ex: 'El cliente sube fotos del choque; el agente extrae datos, estima el monto y deriva a revisión humana solo los casos atípicos.' },
  mineria: { t: 'Minería', s: 'Más producción con menos paradas y más seguridad.', pieces: [
    P('Mantenimiento predictivo', '', 'Sensores de camiones, molinos y chancadoras para anticipar fallas antes de que paren la operación.'),
    P('Control de proceso', '', 'Ley del mineral, recuperación y consumo de agua y energía en tablero casi en tiempo real.'),
    P('Seguridad', '', 'Fatiga de operadores, geocercas y alertas de zonas de riesgo.'),
    P('Conocimiento técnico', '', 'Knowledge Assistant sobre manuales y procedimientos para los turnos de mantenimiento.'),
  ], ex: 'La vibración de un rodamiento sube 18 %: el modelo predice falla en 6 días y Lakeflow Jobs crea la orden de trabajo para la parada programada.' },
  energia: { t: 'Energía y utilities', s: 'Equilibrar demanda, red y renovables.', pieces: [
    P('Pronóstico de demanda', '', 'Por hora y zona, con clima, calendario y consumo histórico.'),
    P('Gestión de red', '', 'Medidores inteligentes y SCADA para detectar pérdidas y anticipar cortes.'),
    P('Renovables', '', 'Predicción de generación solar y eólica para planificar el despacho.'),
  ], ex: 'Ante una ola de calor, el modelo anticipa un pico en una subestación y el operador redistribuye carga antes del corte.' },
  oilgas: { t: 'Petróleo y gas', s: 'Activos críticos, operación segura y transición energética.', pieces: [
    P('Integridad de activos', '', 'Oleoductos, bombas y pozos monitoreados con series de tiempo e IA.'),
    P('Optimización de producción', '', 'Cruzar datos de subsuelo, superficie y mercado para decidir dónde invertir.'),
    P('Documentos técnicos', '', 'RAG sobre normas, contratos y reportes de ingeniería con citas a la fuente.'),
    P('Emisiones y ESG', '', 'Medición y reporte trazable de huella de carbono.'),
  ], ex: 'Un ingeniero pregunta “¿qué norma aplica a esta válvula y cuándo fue la última inspección?” y recibe la cláusula y el registro de mantenimiento.' },
  retail: { t: 'Retail y consumo', s: 'El producto correcto, en la tienda correcta, al precio correcto.', pieces: [
    P('Pronóstico de demanda', '', 'Por SKU y tienda, para reducir quiebres de stock y mermas.'),
    P('Cliente 360 y personalización', '', 'CustomerLake unifica identidades y personaliza ofertas.'),
    P('Precios y promociones', '', 'Medir el efecto real de cada promoción.'),
  ], ex: 'El modelo detecta que un producto se agota cada viernes en 12 tiendas y ajusta automáticamente la reposición del jueves.' },
  salud: { t: 'Salud y farma', s: 'Mejor atención con datos clínicos protegidos.', pieces: [
    P('Historia clínica unificada', '', 'Datos de laboratorio, imágenes y atenciones en un solo lugar, con acceso controlado.'),
    P('Operación hospitalaria', '', 'Predicción de ocupación de camas y tiempos de espera.'),
    P('Investigación', '', 'Análisis de ensayos y documentos científicos con IA, con datos anonimizados.'),
  ], ex: 'El hospital prevé la ocupación de UCI para la próxima semana y reprograma cirugías electivas antes de saturarse.' },
  telecom: { t: 'Telecomunicaciones', s: 'Redes que se autodiagnostican y clientes que se quedan.', pieces: [
    P('Predicción de churn', '', 'Detectar clientes con alta probabilidad de irse y actuar antes.'),
    P('Calidad de red', '', 'Miles de millones de eventos de red analizados en streaming.'),
    P('Agentes de soporte', '', 'Diagnóstico de fallas del cliente con datos de red en tiempo real.'),
  ], ex: 'Un cliente con 3 caídas de señal en la semana recibe una compensación proactiva antes de llamar a quejarse.' },
};

/* ------------------------------------------------------------------ */
/* Escenas flat para las tarjetas de industria (viewBox 360×170) */
/* ------------------------------------------------------------------ */
const SCENE = {
  banca: `<rect width="360" height="170" fill="#E9F1F9"/><circle cx="300" cy="40" r="22" fill="${C.yellow}" opacity=".9"/><rect x="0" y="140" width="360" height="30" fill="#D3E2EF"/>
    <path d="M110 64 L180 30 L250 64Z" fill="${C.navy}"/><rect x="116" y="64" width="128" height="10" fill="${C.blue}"/>
    ${[126, 154, 182, 210].map(x => `<rect x="${x}" y="78" width="14" height="52" rx="3" fill="#fff"/>`).join('')}<rect x="110" y="130" width="140" height="12" rx="3" fill="${C.navy}"/>
    <g class="loop float"><circle cx="66" cy="96" r="20" fill="${C.yellow}"/><text x="66" y="104" font-size="22" font-weight="800" text-anchor="middle" fill="#8A5B00">$</text></g>
    <g class="loop float2"><rect x="270" y="88" width="58" height="38" rx="6" fill="${C.lava}"/><rect x="270" y="96" width="58" height="8" fill="${C.navy}"/></g>`,
  seguros: `<rect width="360" height="170" fill="#EAF6F0"/><rect x="0" y="140" width="360" height="30" fill="#CFEADC"/>
    <g class="loop wiggle"><path d="M110 80 Q180 10 250 80 Q232 70 215 80 Q197 70 180 80 Q162 70 145 80 Q128 70 110 80Z" fill="${C.green}"/><rect x="178" y="78" width="4" height="50" fill="${C.navy}"/></g>
    <path d="M150 104 L180 84 L210 104 V140 H150Z" fill="#fff"/><rect x="172" y="116" width="16" height="24" fill="${C.blue}"/>
    ${[40, 80, 290, 320].map((x, i) => `<rect class="loop blink" style="animation-delay:${i * .3}s" x="${x}" y="${30 + i * 8}" width="3" height="16" rx="1.5" fill="${C.blue}" opacity=".5"/>`).join('')}`,
  mineria: `<rect width="360" height="170" fill="#F6EEE4"/><path d="M0 140 L90 50 L150 100 L220 30 L360 140Z" fill="#CDB8A0"/><path d="M190 60 L220 30 L250 60 L235 55 L220 62 L205 56Z" fill="#fff"/>
    <rect x="0" y="136" width="360" height="34" fill="#B89C80"/>
    <g class="loop" style="animation:truck 6s linear infinite"><rect x="20" y="104" width="70" height="26" rx="4" fill="${C.yellow}"/><path d="M90 108 h22 l10 12 v10 h-32z" fill="#E09600"/><circle cx="38" cy="134" r="9" fill="${C.navy}"/><circle cx="104" cy="134" r="9" fill="${C.navy}"/><path d="M24 104 L40 90 H84 L90 104Z" fill="#8D6E52"/></g>`,
  energia: `<rect width="360" height="170" fill="#E8F3F8"/><rect x="0" y="140" width="360" height="30" fill="#CDE5D6"/>
    ${[[90, 150], [180, 130], [270, 150]].map(([x, h], i) => `<rect x="${x - 3}" y="${140 - h + 40}" width="6" height="${h - 40}" fill="#fff"/><g class="loop spin" style="transform-origin:${x}px ${180 - h}px;animation-duration:${4 + i}s"><path d="M${x} ${180 - h} l-4 -44 h8z M${x} ${180 - h} l40 18 -4 7z M${x} ${180 - h} l-36 26 -4 -7z" fill="#fff" stroke="${C.blue}" stroke-width="1.5"/></g><circle cx="${x}" cy="${180 - h}" r="5" fill="${C.blue}"/>`).join('')}
    <g transform="translate(20 116)"><rect width="46" height="24" rx="3" fill="${C.blue}" transform="skewX(-20)"/><path d="M8 0 v24 M23 0 v24 M-4 12 h50" stroke="#9CC6EA" stroke-width="2" transform="skewX(-20)"/></g>
    <circle class="loop glow" cx="320" cy="34" r="18" fill="${C.yellow}"/>`,
  oilgas: `<rect width="360" height="170" fill="#F3F0EA"/><rect x="0" y="140" width="360" height="30" fill="#DCD3C2"/><circle cx="60" cy="40" r="20" fill="${C.lava}" opacity=".8"/>
    <path d="M170 140 L190 70 L210 140" fill="none" stroke="${C.navy}" stroke-width="8"/><rect x="150" y="128" width="80" height="12" fill="${C.navy}"/>
    <g class="loop" style="transform-origin:190px 70px;animation:pump 2.4s ease-in-out infinite"><rect x="120" y="62" width="140" height="14" rx="6" fill="${C.lava}"/><path d="M120 62 q-16 6 -16 22 h18z" fill="${C.navy}"/><path d="M114 84 V128" stroke="${C.navy}" stroke-width="3"/></g>
    <rect x="270" y="96" width="50" height="44" rx="4" fill="${C.oat3}"/><rect x="278" y="84" width="34" height="14" rx="7" fill="#C9BFAF"/>`,
  retail: `<rect width="360" height="170" fill="#FBEFEA"/><rect x="0" y="140" width="360" height="30" fill="#EED7CC"/>
    <rect x="100" y="56" width="160" height="84" fill="#fff"/><path d="M92 56 h176 l-10 -24 h-156z" fill="${C.lava}"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${100 + i * 23} 56 a11.5 11.5 0 0 0 23 0" fill="${i % 2 ? C.lava : '#fff'}"/>`).join('')}
    <rect x="118" y="86" width="50" height="54" fill="${C.blue}" opacity=".85"/><rect x="186" y="86" width="56" height="34" rx="3" fill="${C.oat2}"/>
    <g class="loop" style="animation:cart 5s ease-in-out infinite"><path d="M20 104 h10 l8 26 h36 l8 -20 h-48" fill="none" stroke="${C.navy}" stroke-width="4" stroke-linejoin="round"/><rect x="40" y="96" width="14" height="14" rx="2" fill="${C.green}"/><rect x="56" y="100" width="12" height="10" rx="2" fill="${C.yellow}"/><circle cx="44" cy="136" r="5" fill="${C.navy}"/><circle cx="70" cy="136" r="5" fill="${C.navy}"/></g>`,
  salud: `<rect width="360" height="170" fill="#EAF4F7"/><rect x="0" y="140" width="360" height="30" fill="#D0E6EC"/>
    <rect x="110" y="44" width="140" height="96" fill="#fff"/><rect x="110" y="44" width="140" height="14" fill="${C.blue}"/>
    <path d="M172 72 h16 v14 h14 v16 h-14 v14 h-16 v-14 h-14 v-16 h14z" fill="${C.lava}"/>${[0, 1, 2, 3].map(i => `<rect x="${122 + i * 32}" y="124" width="20" height="16" fill="${C.blue}" opacity=".3"/>`).join('')}
    <path class="a" data-fx="draw" pathLength="1" style="--d:.2s" d="M10 110 h40 l10 -24 l12 44 l10 -30 h50" fill="none" stroke="${C.green}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <g class="loop bob"><path d="M300 70 c-14 -18 -38 0 0 28 c38 -28 14 -46 0 -28z" fill="${C.lava}"/></g>`,
  telecom: `<rect width="360" height="170" fill="#EEEDF9"/><rect x="0" y="140" width="360" height="30" fill="#D9D7F0"/>
    <path d="M170 140 L180 40 L190 140" fill="none" stroke="${C.navy}" stroke-width="7"/><path d="M168 100 h24 M172 76 h16" stroke="${C.navy}" stroke-width="5"/><circle cx="180" cy="40" r="7" fill="${C.lava}"/>
    ${[1, 2, 3].map(i => `<circle class="loop pulse" style="animation-delay:${i * .5}s;transform-origin:180px 40px" cx="180" cy="40" r="${18 * i}" fill="none" stroke="${C.violet}" stroke-width="3"/>`).join('')}
    <rect x="40" y="96" width="30" height="50" rx="6" fill="${C.navy}"/><rect x="44" y="102" width="22" height="34" rx="3" fill="${C.blue2}"/><rect x="290" y="90" width="40" height="50" rx="5" fill="#fff"/><rect x="296" y="98" width="28" height="18" fill="${C.green}" opacity=".7"/>`,
};

/* ------------------------------------------------------------------ */
/* Motor del deck */
/* ------------------------------------------------------------------ */
const stage = document.getElementById('stage');
const slides = [...document.querySelectorAll('.slide')];
const wipe = document.getElementById('wipe');
let cur = 0, busy = false;

function parseOpts(s) { const o = {}; (s || '').split(';').forEach(kv => { const [k, v] = kv.split(':').map(x => x && x.trim()); if (k) o[k] = v === undefined ? true : v; }); return o; }

function build() {
  document.querySelectorAll('[data-person]').forEach(el => { el.innerHTML = person(parseOpts(el.dataset.person)); });
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  document.querySelectorAll('[data-dbmark]').forEach(el => { el.innerHTML = dbmark(el.dataset.dbmark || C.lava); });
  document.querySelectorAll('[data-tpt]').forEach(el => { el.innerHTML = tptLogo(el.dataset.tpt === 'dark'); });
  document.querySelectorAll('[data-si]').forEach(el => { el.classList.add('si'); el.style.setProperty('--src', `url(${SI(el.dataset.si)})`); });
  document.querySelectorAll('[data-scene]').forEach(el => { el.innerHTML = `<svg viewBox="0 0 360 170" preserveAspectRatio="xMidYMid slice">${SCENE[el.dataset.scene]}</svg>`; });
  document.querySelectorAll('[data-modal]').forEach(el => el.addEventListener('click', e => { e.stopPropagation(); openModal(el.dataset.modal); }));
  document.querySelectorAll('[data-ind]').forEach(el => el.addEventListener('click', () => openModal(el.dataset.ind, true)));
  slides.forEach((s, i) => {
    if (s.classList.contains('no-foot')) return;
    const f = document.createElement('div');
    f.className = 'chrome-foot';
    const dark = s.classList.contains('dark');
    f.innerHTML = `<span style="--h:38px;display:inline-flex;align-items:center;gap:16px">${tptLogo(dark)}<i style="width:2px;height:30px;background:${dark ? '#3A5560' : C.oat3}"></i>${dwLogo(dark)}</span><span>Databricks para todos</span><span class="num"><b>${String(i + 1).padStart(2, '0')}</b> / ${slides.length}</span>`;
    s.appendChild(f);
  });
}

function fit() {
  const k = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `translate(-50%, -50%) scale(${k})`;
}

function activate(i) {
  slides.forEach((s, j) => s.classList.toggle('active', j === i));
  document.getElementById('progress').style.width = `${(i + 1) / slides.length * 100}%`;
  history.replaceState(null, '', `#${i + 1}`);
}

function go(i, instant) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  if (i === cur && !instant) return;
  closeModal();
  if (instant) { cur = i; activate(i); return; }
  if (busy) { cur = i; activate(i); return; }
  busy = true;
  const next = slides[i];
  wipe.style.setProperty('--wipe', next.dataset.wipe || (next.classList.contains('dark') ? C.navy : C.lava));
  wipe.className = 'in';
  setTimeout(() => {
    cur = i; activate(i);
    wipe.className = 'out';
    setTimeout(() => { wipe.className = ''; busy = false; }, 560);
  }, 470);
}

function replay() { const s = slides[cur]; s.classList.remove('active'); void s.offsetWidth; s.classList.add('active'); }

/* modal */
const modal = document.getElementById('modal');
function openModal(key, isInd) {
  const m = (isInd ? IND : MODAL)[key]; if (!m) return;
  const head = isInd
    ? `<div class="ico-tile" style="width:150px;height:96px;border-radius:20px;overflow:hidden" data-scene-inline>${`<svg viewBox="0 0 360 170" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">${SCENE[key]}</svg>`}</div>`
    : `<div class="ico-tile">${m.img ? `<img src="${(document.getElementById('omni-logo') || {}).src || 'assets/omnigent-favicon.svg'}" alt="Omnigent">` : icon(m.ic)}</div>`;
  const chipCls = c => ({ GA: 'ga', Preview: 'pre', 'Private Preview': 'pre', Beta: 'beta', Alpha: 'beta', Nuevo: 'new', Anunciado: 'new' }[c] || '');
  modal.querySelector('.box').innerHTML = `
    <div class="mhead" style="--macc:${m.acc || C.green}"><span class="band"></span>${head}
      <div><h2>${m.t}</h2><div class="lead">${m.s}</div></div><button class="close" aria-label="Cerrar">×</button></div>
    <div class="mbody${m.pieces.length > 6 ? ' dense' : ''}">${m.pieces.map((p, i) => `<div class="piece" style="animation-delay:${.08 + i * .07}s"><h4>${p.n}${p.chip ? ` <span class="chip ${chipCls(p.chip)}">${p.chip}</span>` : ''}</h4>${p.was ? `<div class="was">${p.was}</div>` : ''}<p>${p.d}</p></div>`).join('')}
      <div class="example" style="animation-delay:${.15 + m.pieces.length * .07}s"><span class="tag">Ejemplo</span><p>${m.ex}</p></div>
      ${m.foot ? `<div class="mfoot">${m.foot}</div>` : ''}${isInd ? '' : '<div class="mfoot">Estados a octubre 2026 · confirmar en release notes antes de comprometer un servicio en Preview o Beta.</div>'}</div>`;
  modal.querySelector('.close').onclick = closeModal;
  modal.classList.add('open');
}
function closeModal() { modal.classList.remove('open'); }
modal.querySelector('.scrim').onclick = closeModal;

/* teclado y botones */
addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); return; }
  if (modal.classList.contains('open')) return;
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); go(cur + 1); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); go(cur - 1); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(slides.length - 1);
  else if (e.key.toLowerCase() === 'r') replay();
  else if (e.key.toLowerCase() === 'f') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
});
document.getElementById('prev').onclick = () => go(cur - 1);
document.getElementById('next').onclick = () => go(cur + 1);

build(); fit(); addEventListener('resize', fit);
addEventListener('hashchange', () => { const n = (parseInt(location.hash.slice(1)) || 1) - 1; if (n !== cur) go(n); });
go((parseInt(location.hash.slice(1)) || 1) - 1, true);
const hint = document.getElementById('hint');
hint.classList.add('show'); setTimeout(() => hint.classList.remove('show'), 4200);
