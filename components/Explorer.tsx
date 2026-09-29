"use client";

import { useMemo, useState } from "react";
import type { CatalogEntry, EntryKind } from "@/lib/catalog";

type Props = {
  initialCatalog: CatalogEntry[];
  sourceMarkdown: string;
};

type RunState = {
  loading: boolean;
  result: unknown;
  error: string | null;
};

const KIND_LABELS: Record<EntryKind, string> = {
  api: "API",
  page: "Página/consulta",
  form: "Formulário",
  transactional: "Transacional",
  reference: "Referência",
};

function methodClass(method: string) {
  const m = method.toUpperCase();
  if (m.includes("POST")) return "method post";
  if (m.includes("SOAP")) return "method soap";
  return "method get";
}

function kindClass(kind: EntryKind) {
  return "kind kind-" + kind;
}

function searchable(entry: CatalogEntry) {
  return [
    entry.system,
    entry.section,
    entry.method,
    entry.route,
    entry.url ?? "",
    entry.description,
    entry.kind,
  ]
    .join(" ")
    .toLowerCase();
}

function extractParams(value: string) {
  return [...value.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
}

function safeStringify(value: unknown) {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function Explorer({ initialCatalog, sourceMarkdown }: Props) {
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState("all");
  const [kind, setKind] = useState<"all" | EntryKind>("all");
  const [onlyExecutable, setOnlyExecutable] = useState(false);
  const [selectedId, setSelectedId] = useState(initialCatalog[0]?.id ?? "");
  const [tab, setTab] = useState<"explorer" | "source">("explorer");
  const [editedUrl, setEditedUrl] = useState("");
  const [body, setBody] = useState("{}");
  const [run, setRun] = useState<RunState>({
    loading: false,
    result: null,
    error: null,
  });

  const systems = useMemo(
    () => [...new Set(initialCatalog.map((e) => e.system))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [initialCatalog]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return initialCatalog.filter((entry) => {
      if (system !== "all" && entry.system !== system) return false;
      if (kind !== "all" && entry.kind !== kind) return false;
      if (onlyExecutable && !entry.canExecute) return false;
      if (q && !searchable(entry).includes(q)) return false;
      return true;
    });
  }, [initialCatalog, query, system, kind, onlyExecutable]);

  const selected =
    initialCatalog.find((entry) => entry.id === selectedId) ??
    filtered[0] ??
    initialCatalog[0];

  const stats = useMemo(() => {
    const executable = initialCatalog.filter((e) => e.canExecute).length;
    const api = initialCatalog.filter((e) => e.kind === "api").length;
    const post = initialCatalog.filter((e) => e.method.includes("POST")).length;
    return {
      total: initialCatalog.length,
      systems: systems.length,
      executable,
      api,
      post,
    };
  }, [initialCatalog, systems.length]);

  function selectEntry(entry: CatalogEntry) {
    setSelectedId(entry.id);
    setEditedUrl(entry.url ?? "");
    setRun({ loading: false, result: null, error: null });
    setBody("{}");
  }

  async function executeSelected() {
    if (!selected?.canExecute) return;

    const target = (editedUrl || selected.url || "").trim();
    if (!target) return;

    setRun({ loading: true, result: null, error: null });

    let parsedBody: unknown = undefined;
    if (selected.method.toUpperCase().includes("POST")) {
      try {
        parsedBody = body.trim() ? JSON.parse(body) : {};
      } catch {
        setRun({
          loading: false,
          result: null,
          error: "O corpo POST precisa ser JSON válido.",
        });
        return;
      }
    }

    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: target,
          method: selected.method.toUpperCase().includes("POST") ? "POST" : "GET",
          body: parsedBody,
        }),
      });

      const payload = await response.json();
      setRun({
        loading: false,
        result: payload,
        error: response.ok ? null : payload?.error || "Falha na consulta.",
      });
    } catch (error) {
      setRun({
        loading: false,
        result: null,
        error: error instanceof Error ? error.message : "Falha de rede.",
      });
    }
  }

  const selectedParams = selected ? extractParams(selected.url ?? selected.route) : [];

  return (
    <main>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">CBA</div>
          <div>
            <strong>Cuiabá API Atlas</strong>
            <span>inventário executável das integrações públicas mapeadas</span>
          </div>
        </div>
        <nav className="tabs" aria-label="Navegação principal">
          <button
            className={tab === "explorer" ? "tab active" : "tab"}
            onClick={() => setTab("explorer")}
          >
            Explorer
          </button>
          <button
            className={tab === "source" ? "tab active" : "tab"}
            onClick={() => setTab("source")}
          >
            MD original
          </button>
          <a className="tab" href="/api/catalog" target="_blank" rel="noreferrer">
            JSON
          </a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">PREFEITURA DE CUIABÁ · INVENTÁRIO NÃO OFICIAL</div>
          <h1>Uma interface para todas as rotas já mapeadas.</h1>
          <p>
            O arquivo Markdown é a fonte de verdade. APIs, consultas server-rendered,
            formulários, webservices e referências são extraídos automaticamente e
            classificados sem apagar nenhuma rota documentada.
          </p>
        </div>

        <div className="stats-grid">
          <article><strong>{stats.total}</strong><span>entradas extraídas</span></article>
          <article><strong>{stats.systems}</strong><span>sistemas/fontes</span></article>
          <article><strong>{stats.executable}</strong><span>consultas executáveis</span></article>
          <article><strong>{stats.post}</strong><span>rotas com POST</span></article>
        </div>
      </section>

      {tab === "source" ? (
        <section className="source-shell">
          <div className="source-head">
            <div>
              <span className="eyebrow">FONTE DE VERDADE</span>
              <h2>apis_publicas_prefeitura_cuiaba_mt.md</h2>
            </div>
            <a href="/api/source" target="_blank" rel="noreferrer" className="secondary-button">
              Abrir arquivo
            </a>
          </div>
          <pre className="source-view">{sourceMarkdown}</pre>
        </section>
      ) : (
        <>
          <section className="filters">
            <label className="search">
              <span>Buscar</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="licitação, IPTU, servidor, /PublicLote/Get..."
              />
            </label>

            <label>
              <span>Sistema</span>
              <select value={system} onChange={(event) => setSystem(event.target.value)}>
                <option value="all">Todos os sistemas</option>
                {systems.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Tipo</span>
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value as "all" | EntryKind)}
              >
                <option value="all">Todos os tipos</option>
                {Object.entries(KIND_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="check">
              <input
                type="checkbox"
                checked={onlyExecutable}
                onChange={(event) => setOnlyExecutable(event.target.checked)}
              />
              <span>Somente executáveis</span>
            </label>
          </section>

          <section className="workspace">
            <div className="catalog-pane">
              <div className="pane-head">
                <div>
                  <strong>{filtered.length}</strong>
                  <span>resultados</span>
                </div>
                <span>Fonte: MD · parser automático</span>
              </div>

              <div className="catalog-list">
                {filtered.map((entry) => (
                  <button
                    key={entry.id}
                    className={entry.id === selected?.id ? "endpoint-card selected" : "endpoint-card"}
                    onClick={() => selectEntry(entry)}
                  >
                    <div className="endpoint-meta">
                      <span className={methodClass(entry.method)}>{entry.method}</span>
                      <span className={kindClass(entry.kind)}>{KIND_LABELS[entry.kind]}</span>
                      {entry.canExecute && <span className="live-dot">executável</span>}
                    </div>
                    <code>{entry.route}</code>
                    <p>{entry.description || "Sem descrição adicional no inventário."}</p>
                    <div className="endpoint-foot">
                      <span>{entry.system}</span>
                      <span>§ {entry.section}</span>
                    </div>
                  </button>
                ))}

                {!filtered.length && (
                  <div className="empty">
                    Nenhuma entrada corresponde aos filtros atuais.
                  </div>
                )}
              </div>
            </div>

            <aside className="detail-pane">
              {selected ? (
                <>
                  <div className="detail-head">
                    <div className="endpoint-meta">
                      <span className={methodClass(selected.method)}>{selected.method}</span>
                      <span className={kindClass(selected.kind)}>{KIND_LABELS[selected.kind]}</span>
                    </div>
                    <h2>{selected.route}</h2>
                    <p>{selected.description || "Sem descrição adicional no inventário."}</p>
                  </div>

                  <dl className="facts">
                    <div><dt>Sistema</dt><dd>{selected.system}</dd></div>
                    <div><dt>Seção</dt><dd>{selected.section}</dd></div>
                    <div><dt>Origem</dt><dd>{selected.origin === "table" ? "Tabela do MD" : selected.origin === "code" ? "Bloco de código do MD" : "Referência do MD"}</dd></div>
                    <div><dt>Execução</dt><dd>{selected.canExecute ? "Permitida pelo proxy" : "Registro/link somente"}</dd></div>
                  </dl>

                  {selected.url ? (
                    <div className="request-box">
                      <label>
                        <span>URL</span>
                        <input
                          value={editedUrl || selected.url}
                          onChange={(event) => setEditedUrl(event.target.value)}
                        />
                      </label>

                      {selectedParams.length > 0 && (
                        <div className="params">
                          <span>Preencha na URL:</span>
                          {selectedParams.map((param) => <code key={param}>{"{" + param + "}"}</code>)}
                        </div>
                      )}

                      {selected.method.toUpperCase().includes("POST") && selected.canExecute && (
                        <label>
                          <span>Body JSON</span>
                          <textarea
                            value={body}
                            onChange={(event) => setBody(event.target.value)}
                            spellCheck={false}
                          />
                        </label>
                      )}

                      <div className="actions">
                        {selected.canExecute ? (
                          <button className="primary-button" onClick={executeSelected} disabled={run.loading}>
                            {run.loading ? "Consultando..." : "Executar consulta"}
                          </button>
                        ) : (
                          <button className="primary-button" disabled>
                            Execução automática bloqueada
                          </button>
                        )}

                        <a
                          className="secondary-button"
                          href={(editedUrl || selected.url).replace(/\{[^}]+\}/g, "")}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Abrir original
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="notice">
                      Esta entrada está documentada no levantamento, mas o MD ainda não contém
                      URL final suficiente para execução automática.
                    </div>
                  )}

                  {!selected.canExecute && (
                    <div className="notice">
                      Rotas transacionais, formulários de escrita e referências são mantidas no
                      catálogo, mas o Atlas não envia dados reais automaticamente. Isso evita
                      cadastro, denúncia, e-mail, emissão fiscal ou outra alteração acidental.
                    </div>
                  )}

                  {(run.result !== null || run.error) && (
                    <div className="response-box">
                      <div className="response-title">
                        <strong>Resposta</strong>
                        {run.error && <span className="response-error">{run.error}</span>}
                      </div>
                      <pre>{safeStringify(run.result ?? { error: run.error })}</pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty">Selecione uma rota.</div>
              )}
            </aside>
          </section>
        </>
      )}

      <footer>
        <span>Catálogo derivado automaticamente do levantamento salvo no repositório.</span>
        <span>Não é um serviço oficial da Prefeitura de Cuiabá.</span>
      </footer>
    </main>
  );
}
