import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type EntryKind = "api" | "page" | "form" | "transactional" | "reference";

export type CatalogEntry = {
  id: string;
  system: string;
  section: string;
  method: string;
  route: string;
  url: string | null;
  description: string;
  kind: EntryKind;
  canExecute: boolean;
  origin: "table" | "code" | "reference";
};

const SOURCE_PATH = path.join(process.cwd(), "data", "apis_publicas_prefeitura_cuiaba_mt.md");

const TRANSPARENCIA_BASE =
  "https://transparencia.cuiaba.mt.gov.br/portaltransparencia/servlet/a";
const SMARTGIS_BASE = "https://api.smartgis.net.br/cuiaba/prefeitura/api";
const GAZETA_BASE = "https://gazetamunicipal.cuiaba.mt.gov.br/api";

const safeReadOnlyPosts = [
  "/PublicLote/ListUnidade",
  "/PublicLote/IdentifyOnExtent",
  "/PublicLote/ExportXlsx",
  "/editions/searchES",
  "/legislations/searchES",
];

function stripMd(value: string) {
  return value
    .trim()
    .replace(/^\`|\`$/g, "")
    .replace(/^\*\*|\*\*$/g, "")
    .trim();
}

function normalizeUrl(raw: string) {
  return raw
    .replace(/^\`+|\`+$/g, "")
    .replace(/[),.;]+$/g, "")
    .trim();
}

function sectionSystem(section: string, heading: string, h1: string) {
  if (section.startsWith("1")) return "Portal da Transparência";
  if (section.startsWith("2")) return "SmartGIS Cuiabá";
  if (section.startsWith("3")) return "Gazeta Municipal";
  if (section.startsWith("4.1")) return "Portal do Contribuinte / Fazenda";
  if (section.startsWith("4.2")) return "Portal antigo de Licitações";
  if (section.startsWith("4.3")) return "Portal Cidadão / SIGED";
  if (section.startsWith("4.4")) return "SORP";
  if (section.startsWith("5")) return "NFS-e municipal";
  if (section.startsWith("8.")) return heading.replace(/^\d+(?:\.\d+)*\s*/, "").trim();
  return h1.replace(/^\d+(?:\.\d+)*\s*/, "").trim() || "Inventário geral";
}

function explicitBase(system: string) {
  if (system === "Portal da Transparência") return TRANSPARENCIA_BASE;
  if (system === "SmartGIS Cuiabá") return SMARTGIS_BASE;
  if (system === "Gazeta Municipal") return GAZETA_BASE;
  return null;
}

function resolveRoute(route: string, system: string, latestUrl: string | null) {
  const clean = normalizeUrl(route);
  if (/^https?:\/\//i.test(clean)) return clean;

  const fixed = explicitBase(system);
  if (fixed) {
    if (system === "Portal da Transparência" && !clean.startsWith("/")) {
      return fixed + clean;
    }
    return fixed.replace(/\/$/, "") + "/" + clean.replace(/^\//, "");
  }

  if (clean.startsWith("/") && latestUrl) {
    try {
      const origin = new URL(latestUrl).origin;
      return origin + clean;
    } catch {
      return null;
    }
  }

  return null;
}

function classify(system: string, method: string, route: string, description: string, origin: CatalogEntry["origin"]): EntryKind {
  const all = (system + " " + method + " " + route + " " + description).toLowerCase();

  if (origin === "reference") return "reference";
  if (
    all.includes("webservice soap") ||
    all.includes("transacional") ||
    all.includes("emissão fiscal") ||
    all.includes("lance") ||
    all.includes("cadastro de credor") ||
    all.includes("aprovação digital")
  ) return "transactional";

  if (
    method.includes("POST") &&
    (all.includes("formulário") || all.includes("denúncia") || all.includes("contato") || all.includes("cadastro"))
  ) return "form";

  if (
    system === "Portal da Transparência" ||
    system === "SmartGIS Cuiabá" ||
    system === "Gazeta Municipal"
  ) return "api";

  if (route.startsWith("/") || /^https?:\/\//.test(route)) return "page";
  return "reference";
}

function isExecutable(kind: EntryKind, method: string, url: string | null) {
  if (!url || kind === "reference" || kind === "transactional" || kind === "form") return false;
  const upper = method.toUpperCase();

  if (upper === "GET" || upper === "HEAD" || upper === "GET + CONSULTA") return true;
  if (upper.includes("POST")) {
    try {
      const p = new URL(url).pathname;
      return safeReadOnlyPosts.some((suffix) => p.endsWith(suffix));
    } catch {
      return false;
    }
  }
  return false;
}

function makeId(parts: string[]) {
  return crypto.createHash("sha1").update(parts.join("|")).digest("hex").slice(0, 14);
}

function addEntry(
  target: CatalogEntry[],
  seen: Set<string>,
  input: Omit<CatalogEntry, "id" | "canExecute">
) {
  const dedupe = [input.system, input.method, input.route, input.url ?? "", input.origin].join("|");
  if (seen.has(dedupe)) return;
  seen.add(dedupe);

  target.push({
    ...input,
    id: makeId([dedupe, input.description]),
    canExecute: isExecutable(input.kind, input.method, input.url),
  });
}

export function getSourceMarkdown() {
  return fs.readFileSync(SOURCE_PATH, "utf8");
}

export function getCatalog(): CatalogEntry[] {
  const md = getSourceMarkdown();
  const lines = md.split(/\r?\n/);
  const entries: CatalogEntry[] = [];
  const seen = new Set<string>();

  let h1 = "";
  let h2 = "";
  let section = "";
  let system = "Inventário geral";
  let latestUrl: string | null = null;
  let inFence = false;

  for (const line of lines) {
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);

    if (h1Match) {
      h1 = h1Match[1].trim();
      h2 = "";
      const sm = h1.match(/^(\d+(?:\.\d+)*)/);
      section = sm?.[1] ?? h1;
      system = sectionSystem(section, h1, h1);
      latestUrl = null;
    } else if (h2Match) {
      h2 = h2Match[1].trim();
      const sm = h2.match(/^(\d+(?:\.\d+)*)/);
      section = sm?.[1] ?? section;
      system = sectionSystem(section, h2, h1);
      latestUrl = null;
    }

    if (/^\`\`\`/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }

    const absUrls = line.match(/https?:\/\/[^\s<>]+/g) ?? [];
    for (const raw of absUrls) {
      const url = normalizeUrl(raw);
      if (!/^https?:\/\//i.test(url)) continue;
      latestUrl = url;

      const origin: CatalogEntry["origin"] = inFence ? "code" : "reference";
      const kind = classify(system, "GET", url, inFence ? "URL/base documentada no inventário" : "Fonte/referência do inventário", origin);
      addEntry(entries, seen, {
        system,
        section,
        method: kind === "transactional" ? "SOAP" : "GET",
        route: url,
        url,
        description: inFence ? "URL/base documentada no inventário" : "Fonte/referência do inventário",
        kind,
        origin,
      });
    }

    if (!line.trim().startsWith("|")) continue;

    const cells = line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map(stripMd);

    if (cells.length < 2) continue;
    if (cells.every((c) => /^:?-{3,}:?$/.test(c))) continue;

    const first = cells[0];
    const second = cells[1];
    const third = cells[2] ?? "";

    if (/^(endpoint|rota|método|método aparente|endpoint\/interface)$/i.test(first)) continue;

    const looksMethod = /^(GET|POST|PUT|PATCH|DELETE|HEAD|SOAP)(\b|\s|\/)/i.test(first);
    let method = "GET";
    let route = first;
    let description = second;

    if (looksMethod) {
      method = first.toUpperCase();
      route = second;
      description = third;
    }

    if (!route || /^função$|^retorna$|^dados retornados$|^filtra$/i.test(route)) continue;

    route = stripMd(route);
    const url = resolveRoute(route, system, latestUrl);
    const kind = classify(system, method, route, description, "table");

    addEntry(entries, seen, {
      system,
      section,
      method,
      route,
      url,
      description,
      kind,
      origin: "table",
    });
  }

  return entries.sort((a, b) => {
    const source = a.system.localeCompare(b.system, "pt-BR");
    if (source !== 0) return source;
    const sec = a.section.localeCompare(b.section, "pt-BR", { numeric: true });
    if (sec !== 0) return sec;
    return a.route.localeCompare(b.route, "pt-BR");
  });
}

export function getCatalogStats(entries = getCatalog()) {
  const systems = new Set(entries.map((e) => e.system));
  return {
    total: entries.length,
    systems: systems.size,
    executable: entries.filter((e) => e.canExecute).length,
    apis: entries.filter((e) => e.kind === "api").length,
    pages: entries.filter((e) => e.kind === "page").length,
    forms: entries.filter((e) => e.kind === "form").length,
    transactional: entries.filter((e) => e.kind === "transactional").length,
    references: entries.filter((e) => e.kind === "reference").length,
    posts: entries.filter((e) => e.method.includes("POST")).length,
  };
}

export function getExecutableUrlPatterns() {
  return getCatalog()
    .filter((e) => e.canExecute && e.url)
    .map((e) => e.url as string);
}
