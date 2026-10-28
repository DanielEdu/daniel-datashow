/* Del papel a la IA — motor del deck + datos de los popups
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
  /* ---- Plataformas (orden alfabético, tono neutral: qué hace bien cada una) ---- */
  aws: { t: 'AWS', s: 'La nube con más piezas: armas tu plataforma de datos servicio por servicio.', ic: 'cloud', acc: '#FF9900', pieces: [
    P('Amazon S3', '', 'Almacenamiento de objetos: la base del data lake de muchísimas empresas.'),
    P('Amazon Redshift', '', 'Data warehouse en la nube, con modo serverless.'),
    P('AWS Glue y EMR', '', 'Catálogo, ETL serverless y clusters de Spark administrados.'),
    P('Kinesis y MSK', '', 'Streaming de eventos en tiempo real (MSK es Kafka administrado).'),
    P('SageMaker y Bedrock', '', 'Machine learning y acceso a modelos generativos de varios proveedores.'),
  ], ex: 'Una fintech guarda sus eventos en S3, los transforma con Glue, los consulta en Redshift y usa Bedrock para un asistente interno. Muy flexible, pero hay que integrar y gobernar cada pieza.' },
  databricks: { t: 'Databricks', s: 'Plataforma de datos + IA sobre el lakehouse: una copia del dato para ETL, SQL, ML y agentes.', ic: 'dbmark', acc: '#FF3621', pieces: [
    P('Lakeflow', '', 'Ingesta, pipelines declarativos y orquestación.'),
    P('Databricks SQL', '', 'Data warehouse serverless sobre el lakehouse.'),
    P('Unity Catalog', '', 'Gobierno único de datos e IA: permisos, linaje y auditoría.'),
    P('Agent Bricks y Genie', '', 'Agentes sobre tus datos y analítica en lenguaje natural.'),
    P('Formatos abiertos', '', 'Delta Lake e Iceberg en tu propia nube (AWS, Azure o GCP).'),
  ], ex: 'Un banco unifica en una sola plataforma el ETL, los dashboards, el modelo de fraude y un agente de atención, todo con los mismos permisos.' },
  bigquery: { t: 'Google BigQuery', s: 'Data warehouse serverless de Google Cloud: escribes SQL y Google escala por ti.', ic: 'cloud', acc: '#4285F4', pieces: [
    P('Serverless de verdad', '', 'Sin clusters que dimensionar; pagas por consulta o por capacidad reservada.'),
    P('BigQuery ML', '', 'Entrenar modelos con SQL, dentro del warehouse.'),
    P('Gemini e IA de Google', '', 'Asistencia en SQL y conexión con Vertex AI.'),
    P('Integración con Google', '', 'Google Analytics, Ads y Looker conectados de forma nativa.'),
  ], ex: 'Un e-commerce analiza los eventos de Google Analytics en BigQuery y predice qué clientes volverán a comprar con una sola sentencia SQL.' },
  fabric: { t: 'Microsoft Fabric', s: 'Plataforma SaaS todo en uno de Microsoft, con OneLake y Power BI en el centro.', ic: 'aibi', acc: '#12877A', pieces: [
    P('OneLake', '', 'Un único lago para toda la organización, en formato Delta.'),
    P('Data Factory y Data Engineering', '', 'Pipelines, notebooks de Spark y flujos de datos.'),
    P('Warehouse', '', 'SQL sobre el mismo almacenamiento.'),
    P('Power BI y Copilot', '', 'Reportes nativos y asistencia con IA en todo el flujo.'),
  ], ex: 'Una empresa que ya vive en Microsoft 365 y Power BI centraliza sus datos en OneLake sin salir del ecosistema que conoce.' },
  snowflake: { t: 'Snowflake', s: 'Data Cloud: un warehouse muy simple de operar, multinube, con fuerte foco en compartir datos.', ic: 'cloud', acc: '#29B5E8', pieces: [
    P('Warehouse elástico', '', 'Cómputo separado del almacenamiento, que se enciende y apaga solo.'),
    P('Data sharing y Marketplace', '', 'Compartir datos con socios sin copiarlos.'),
    P('Snowpark', '', 'Python y otros lenguajes ejecutándose junto a los datos.'),
    P('Cortex AI', '', 'Funciones de IA y LLM llamadas desde SQL.'),
  ], ex: 'Un retailer comparte en vivo sus ventas con sus proveedores mediante data sharing, sin enviar archivos.' },
  oss: { t: 'Open source', s: 'Los proyectos abiertos que corren debajo de casi todas las plataformas.', ic: 'data', acc: '#00A972', pieces: [
    P('Apache Spark', '', 'Procesamiento distribuido en lote y streaming.'),
    P('Apache Kafka y Flink', '', 'Eventos en tiempo real y procesamiento de streams.'),
    P('Apache Airflow', '', 'Orquestación de pipelines como código.'),
    P('dbt', '', 'Transformaciones en SQL con pruebas, versiones y documentación.'),
    P('Delta Lake y Apache Iceberg', '', 'Formatos abiertos de tabla: transacciones sobre el lago.'),
    P('DuckDB y Polars', '', 'Analítica rapidísima en una sola máquina.'),
  ], ex: 'Aprender Spark, SQL y dbt te sirve en cualquier plataforma: son la base común.' },

  /* ---- Capas del stack moderno ---- */
  l_src: { t: 'Fuentes', s: 'De dónde nacen los datos.', ic: 'db', acc: '#2272B4', pieces: [P('Bases transaccionales', '', 'ERP, core bancario, ventas: Oracle, SQL Server, PostgreSQL.'), P('SaaS y APIs', '', 'Salesforce, Google Analytics, HubSpot.'), P('Eventos e IoT', '', 'Clics, pagos, sensores y logs.'), P('Documentos', '', 'PDFs, correos, imágenes y audio: hoy también son datos para la IA.')], ex: 'Una minera combina su ERP, los sensores de camiones y los reportes de seguridad en PDF.' },
  l_ing: { t: 'Ingesta', s: 'Traer los datos sin romper los sistemas de origen.', ic: 'lakeflow', acc: '#2272B4', pieces: [P('Conectores administrados', '', 'Fivetran, Airbyte, Lakeflow Connect, Azure Data Factory.'), P('CDC', '', 'Solo los cambios, con Debezium o conectores nativos.'), P('Streaming', '', 'Kafka, Kinesis, Event Hubs, Pub/Sub.')], ex: 'En vez de copiar 40 tablas cada noche, se replican solo las filas que cambiaron.' },
  l_sto: { t: 'Almacenamiento', s: 'Un lugar barato y abierto para todo.', ic: 'lakehouse', acc: '#2272B4', pieces: [P('Object storage', '', 'S3, ADLS o GCS.'), P('Formatos abiertos de tabla', '', 'Delta Lake e Iceberg: transacciones, versiones y esquema.'), P('Arquitectura medallón', '', 'Bronce (crudo), plata (limpio) y oro (listo para el negocio).')], ex: 'Los datos quedan en tu cuenta de nube y cualquier motor puede leerlos.' },
  l_pro: { t: 'Transformación', s: 'Limpiar, unir y modelar.', ic: 'geniecode', acc: '#2272B4', pieces: [P('Spark y SQL distribuido', '', 'Para volúmenes grandes y streaming.'), P('dbt', '', 'Modelos en SQL con pruebas y documentación.'), P('Calidad de datos', '', 'Reglas y expectativas que detienen datos malos.')], ex: 'Un pipeline declara: “ventas_oro = ventas limpias por día y tienda” y la plataforma lo mantiene al día.' },
  l_orq: { t: 'Orquestación', s: 'Qué corre, cuándo y en qué orden.', ic: 'zeroops', acc: '#2272B4', pieces: [P('Airflow y Dagster', '', 'DAGs como código.'), P('Orquestadores nativos', '', 'Lakeflow Jobs, Data Factory, Step Functions.'), P('Observabilidad', '', 'Alertas cuando algo falla o llega tarde.')], ex: 'Si la carga del ERP se retrasa, el dashboard no se publica con datos incompletos y el equipo recibe una alerta.' },
  l_gov: { t: 'Gobierno', s: 'Quién ve qué, de dónde viene y qué significa.', ic: 'uc', acc: '#2272B4', pieces: [P('Catálogo y permisos', '', 'Unity Catalog, Microsoft Purview, Dataplex, Collibra.'), P('Linaje', '', 'De la fuente al dashboard y al modelo.'), P('Capa semántica', '', 'Métricas oficiales definidas una sola vez.'), P('Privacidad', '', 'Enmascarado de datos personales y cumplimiento.')], ex: 'Marketing ve el DNI enmascarado; riesgo lo ve completo; un agente de IA solo ve lo que su usuario puede ver.' },
  l_use: { t: 'Consumo', s: 'Donde el dato se vuelve decisión.', ic: 'aibi', acc: '#2272B4', pieces: [P('BI', '', 'Power BI, Tableau, Looker.'), P('Ciencia de datos', '', 'Notebooks, modelos y experimentos.'), P('Aplicaciones', '', 'Apps internas y APIs que usan los datos.'), P('Lenguaje natural', '', 'Preguntar a los datos como a un colega.')], ex: 'La gerente pregunta “¿por qué cayeron las ventas en el sur?” y recibe un gráfico con la métrica oficial.' },
  l_ai: { t: 'IA y agentes', s: 'La capa más nueva: modelos que razonan y actúan sobre tus datos.', ic: 'agentbricks', acc: '#6B5FD6', pieces: [P('LLMs', '', 'Modelos de Anthropic, OpenAI, Google, Meta y abiertos.'), P('RAG y búsqueda vectorial', '', 'Respuestas basadas en tus documentos, con citas.'), P('Agentes y MCP', '', 'Herramientas que el agente puede usar de forma gobernada.'), P('Evaluación y trazas', '', 'Medir si el agente responde bien y cuánto cuesta.')], ex: 'Un agente de soporte busca en manuales, consulta el estado del pedido y abre un ticket, con permisos y trazas de cada paso.' },

  /* ---- Roles ---- */
  r_de: { t: 'Data Engineer', s: 'Construye las tuberías por donde viajan los datos.', ic: 'lakeflow', acc: '#2272B4', pieces: [P('Qué hace', '', 'Ingesta, pipelines, calidad y rendimiento.'), P('Herramientas', '', 'SQL, Python, Spark, Kafka, Airflow, dbt, Databricks.'), P('Para empezar', '', 'SQL sólido, Python y un proyecto de pipeline de punta a punta.')], ex: 'Lleva las ventas de 300 tiendas al lakehouse cada 5 minutos con controles de calidad.' },
  r_da: { t: 'Data Analyst', s: 'Convierte datos en respuestas para el negocio.', ic: 'aibi', acc: '#FFAB00', pieces: [P('Qué hace', '', 'Consultas, análisis, dashboards y storytelling.'), P('Herramientas', '', 'SQL, Excel, Power BI, Tableau.'), P('Para empezar', '', 'SQL, un tablero real y aprender a contar historias con datos.')], ex: 'Descubre que el 20 % de los clientes explica el 70 % de las ventas y lo muestra en un tablero.' },
  r_ds: { t: 'Data Scientist', s: 'Encuentra patrones y predice lo que viene.', ic: 'mlflow', acc: '#00A972', pieces: [P('Qué hace', '', 'Experimentos, modelos estadísticos y de machine learning.'), P('Herramientas', '', 'Python, R, Jupyter, scikit-learn, estadística.'), P('Para empezar', '', 'Estadística, Python y un modelo que resuelva un problema real.')], ex: 'Predice qué clientes tienen alta probabilidad de irse el próximo mes.' },
  r_mle: { t: 'ML Engineer', s: 'Lleva los modelos a producción y los mantiene vivos.', ic: 'zeroops', acc: '#0E8A7D', pieces: [P('Qué hace', '', 'Despliegue, monitoreo y reentrenamiento de modelos.'), P('Herramientas', '', 'MLflow, Docker, APIs de inferencia, CI/CD.'), P('Para empezar', '', 'Software engineering + ML: empaquetar y servir un modelo.')], ex: 'Pone el modelo de fraude a responder en milisegundos para cada transacción.' },
  r_aie: { t: 'AI Engineer', s: 'Construye aplicaciones y agentes con modelos de lenguaje.', ic: 'agentbricks', acc: '#6B5FD6', pieces: [P('Qué hace', '', 'RAG, agentes, prompts, evaluación y guardrails.'), P('Herramientas', '', 'LLMs, LangGraph, búsqueda vectorial, MCP.'), P('Para empezar', '', 'Python, APIs de LLM y un asistente sobre tus propios documentos.')], ex: 'Crea un asistente que responde preguntas sobre 4.000 contratos citando la cláusula exacta.' },
  r_arq: { t: 'Data Architect', s: 'Diseña cómo encaja todo.', ic: 'dev', acc: '#1B3139', pieces: [P('Qué hace', '', 'Arquitectura, modelado, elección de plataforma y costos.'), P('Herramientas', '', 'Diagramas, modelado de datos, nube (AWS, Azure, GCP).'), P('Para empezar', '', 'Haber construido pipelines y entender los trade-offs.')], ex: 'Decide qué va en tiempo real y qué en lote, y cuánto cuesta cada decisión.' },
  r_gov: { t: 'Data Governance', s: 'Asegura que los datos sean confiables, seguros y entendibles.', ic: 'uc', acc: '#4A5D64', pieces: [P('Qué hace', '', 'Catálogo, políticas de acceso, calidad y cumplimiento.'), P('Herramientas', '', 'Catálogos de datos, glosarios, políticas y linaje.'), P('Para empezar', '', 'Entender el negocio, la regulación y la calidad de datos.')], ex: 'Define qué significa “cliente activo” para que toda la empresa use el mismo número.' },
};
const IND = {};

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
    f.innerHTML = `<span style="--h:38px;display:inline-flex;align-items:center;gap:16px">${dwLogo(dark)}</span><span class="event-footer-organizers"><span>Iquitos Data Fest 2026</span><img src="assets/organizadores.png" alt="Organizadores: UNAP, Neo Kernel y Grupo de Datos &amp; IA"></span><span class="num"><b>${String(i + 1).padStart(2, '0')}</b> / ${slides.length}</span>`;
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
