import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const md = await fs.readFile(path.join(root, "data/apis_publicas_prefeitura_cuiaba_mt.md"), "utf8");
const transparencyBase = "https://transparencia.cuiaba.mt.gov.br/portaltransparencia/servlet/a";
const smartBase = "https://api.smartgis.net.br/cuiaba/prefeitura/api";
const gazetaBase = "https://gazetamunicipal.cuiaba.mt.gov.br/api";

const categoryRules = [
  ["Finanças", /(receita|despesa|empenho|liquidacao|pagamento|restopagar|repasse|interferencia|emenda|renuncia|covid)/i],
  ["Compras e contratos", /(licitacao|contrato|ata|adesao|convenio)/i],
  ["Pessoas", /(servidor|diaria|concurso|cargo|carreira|ferias)/i],
  ["Cidade e patrimônio", /(patrimonio|frota|abastecimento|organograma|lote|iptu|itbi|unidade|mapa|map)/i],
  ["Saúde", /(saude|policlinica|plantao|hmc|acidentesanimais)/i],
  ["Controle e documentos", /(anexo|declaracao|manual|normativa|legis|orientacao|recomendacao|ouvidor|glossario|evento)/i],
];
function categoryFor(name) {
  for (const [label, re] of categoryRules) if (re.test(name)) return label;
  return "Administração e serviços";
}
function cleanCell(v) {
  return v.trim().replace(/^`|`$/g, "").replace(/^\\*\\*|\\*\\*$/g, "").trim();
}
function add(map, item) {
  const key = [item.method, item.url].join("|");
  if (!item.url || map.has(key)) return;
  map.set(key, item);
}

const endpoints = new Map();
const lines = md.split(/\r?\n/);
let section = "";
let system = "";

for (const line of lines) {
  const h1 = line.match(/^#\s+(.+)$/);
  const h2 = line.match(/^##\s+(.+)$/);
  if (h1) {
    section = h1[1];
    system = "";
    if (/^1\./.test(section) || /^1\s/.test(section)) system = "Portal da Transparência";
    else if (/^2\./.test(section) || /^2\s/.test(section)) system = "SmartGIS Cuiabá";
    else if (/^3\./.test(section) || /^3\s/.test(section)) system = "Gazeta Municipal";
  }
  if (h2) section = h2[1];

  if (!line.trim().startsWith("|")) continue;
  const cells = line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(cleanCell);
  if (cells.length < 2 || cells.every(c => /^:?-{3,}:?$/.test(c))) continue;
  if (/^(Endpoint|Rota|Método|Método aparente|Endpoint\/interface)$/i.test(cells[0])) continue;

  let method = "GET";
  let route = cells[0];
  let desc = cells[1] || "";
  if (/^(GET|POST|HEAD|SOAP)(\b|\s|\/)/i.test(cells[0])) {
    method = cells[0].toUpperCase();
    route = cells[1];
    desc = cells[2] || "";
  }

  let url = "";
  if (/^https?:\/\//i.test(route)) url = route;
  else if (system === "Portal da Transparência" && /^[a-z]/i.test(route)) url = transparencyBase + route;
  else if (system === "SmartGIS Cuiabá" && route.startsWith("/")) url = smartBase + route;
  else if (system === "Gazeta Municipal" && route.startsWith("/")) url = gazetaBase + route;
  if (!url) continue;

  const dangerous = /(sendemail|denuncias\/form|\/contato|auth=register|cadastro_novo|emissao|lance)/i.test(url);
  const needsParams = /\{[^}]+\}/.test(url);
  const safeAuto = method === "GET" && !dangerous && !needsParams;

  add(endpoints, {
    id: Buffer.from(url).toString("base64url").slice(0, 18),
    system, section, category: categoryFor(route + " " + desc),
    method, route, url, description: desc,
    safeAuto, needsParams, dangerous,
  });
}

for (const [route, desc] of [
  ["/PublicConfig/Get", "Configuração pública do SIG"],
  ["/PublicSettings/GetSettings", "Configurações públicas"],
  ["/PublicConfig/GetEstatisticaColors/", "Cores estatísticas"],
  ["/PublicLote/GetPlaceHolderByModule", "Critérios da busca de imóveis"],
  ["/Authentication/GetVersion", "Versão do SmartGIS"],
  ["/Authentication/GetSessionInfo", "Sessão pública/anônima"],
  ["/Module/ListActive", "Módulos ativos"],
]) add(endpoints, {
  id: Buffer.from(smartBase + route).toString("base64url").slice(0, 18),
  system: "SmartGIS Cuiabá", section: "API geográfica/cadastral",
  category: "Território e imóveis", method: "GET", route, url: smartBase + route,
  description: desc, safeAuto: true, needsParams: false, dangerous: false,
});

for (const [route, desc] of [
  ["/editions/published?page=1", "Edições recentes da Gazeta"],
  ["/legislations/published?page=1", "Legislação publicada"],
]) add(endpoints, {
  id: Buffer.from(gazetaBase + route).toString("base64url").slice(0, 18),
  system: "Gazeta Municipal", section: "Gazeta Municipal",
  category: "Diário Oficial", method: "GET", route, url: gazetaBase + route,
  description: desc, safeAuto: true, needsParams: false, dangerous: false,
});

async function fetchOne(ep) {
  if (!ep.safeAuto) return { ...ep, status: ep.needsParams ? "parameterized" : ep.dangerous ? "action" : "manual" };
  const started = Date.now();
  try {
    const res = await fetch(ep.url, {
      headers: { accept: "application/json,text/plain,*/*", "user-agent": "Cuiaba-Municipal-Data-Hub/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    const type = res.headers.get("content-type") || "";
    const text = await res.text();
    let data = text;
    if (type.includes("json") || /^[\[{]/.test(text.trim())) {
      try { data = JSON.parse(text); } catch {}
    }
    let count = 0;
    if (Array.isArray(data)) count = data.length;
    else if (data && typeof data === "object") {
      const arrays = Object.values(data).filter(Array.isArray);
      count = arrays.reduce((n, a) => Math.max(n, a.length), 0);
    }
    let stored = data;
    if (text.length > 1500000) {
      if (Array.isArray(data)) stored = data.slice(0, 500);
      else stored = { preview: text.slice(0, 250000), truncated: true };
    }
    return {
      ...ep, status: res.ok ? "ok" : "http_error", httpStatus: res.status,
      contentType: type, durationMs: Date.now() - started, bytes: text.length,
      count, data: stored,
    };
  } catch (error) {
    return { ...ep, status: "error", error: error instanceof Error ? error.message : String(error), durationMs: Date.now() - started };
  }
}

const list = [...endpoints.values()];
const priorityRoutes = [
  "apireceita","apidespesamensal","apilicitacao","apicontrato","apiservidorativo",
  "apifrota","apipatrimonio","apiadmunidadesaude","/editions/published?page=1",
  "/legislations/published?page=1","/Authentication/GetVersion","/PublicConfig/Get"
];
const auto = list.filter(x => x.safeAuto).sort((a, b) => {
  const ai = priorityRoutes.findIndex(x => a.route.toLowerCase().includes(x.toLowerCase()));
  const bi = priorityRoutes.findIndex(x => b.route.toLowerCase().includes(x.toLowerCase()));
  return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
});
const manual = list.filter(x => !x.safeAuto);
let previousByUrl = new Map();
try {
  const previous = JSON.parse(await fs.readFile(path.join(root, "public/data/municipal-snapshot.json"), "utf8"));
  previousByUrl = new Map((previous.sources || []).filter(x => x.status === "ok" && x.data != null).map(x => [x.url, x]));
} catch {}

const results = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

for (let i = 0; i < auto.length; i += 2) {
  const batch = auto.slice(i, i + 2);
  const done = await Promise.all(batch.map(fetchOne));
  for (const item of done) {
    if (item.status !== "ok" && previousByUrl.has(item.url)) {
      const prev = previousByUrl.get(item.url);
      results.push({ ...prev, stale: true, lastError: item.httpStatus || item.error || item.status });
    } else {
      results.push(item);
    }
  }
  process.stdout.write("\rColetados " + Math.min(i + 2, auto.length) + "/" + auto.length);
  if (i + 2 < auto.length) await sleep(900);
}
results.push(...manual.map(ep => ({ ...ep, status: ep.needsParams ? "parameterized" : ep.dangerous ? "action" : "manual" })));
console.log();

const snapshot = {
  generatedAt: new Date().toISOString(),
  sourceFile: "apis_publicas_prefeitura_cuiaba_mt.md",
  totals: {
    mapped: list.length,
    autoQueried: auto.length,
    ok: results.filter(x => x.status === "ok").length,
    parameterized: results.filter(x => x.status === "parameterized").length,
    actions: results.filter(x => x.status === "action").length,
    errors: results.filter(x => x.status === "error" || x.status === "http_error").length,
  },
  sources: results,
};
await fs.mkdir(path.join(root, "public/data"), { recursive: true });
await fs.writeFile(path.join(root, "public/data/municipal-snapshot.json"), JSON.stringify(snapshot));
console.log(JSON.stringify(snapshot.totals));
