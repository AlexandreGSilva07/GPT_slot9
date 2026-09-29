"use client";

import { useEffect, useMemo, useState } from "react";

type Source = {
  id: string;
  system: string;
  section: string;
  category: string;
  method: string;
  route: string;
  url: string;
  description: string;
  status: string;
  httpStatus?: number;
  count?: number;
  bytes?: number;
  durationMs?: number;
  data?: unknown;
  error?: string;
  needsParams?: boolean;
};

type Snapshot = {
  generatedAt: string;
  totals: {
    mapped: number;
    autoQueried: number;
    ok: number;
    parameterized: number;
    actions: number;
    errors: number;
  };
  sources: Source[];
};

type View =
  | "overview"
  | "finances"
  | "procurement"
  | "people"
  | "city"
  | "health"
  | "education"
  | "gazette"
  | "services"
  | "search"
  | "coverage";

const NAV: { id: View; label: string; icon: string }[] = [
  { id: "overview", label: "Visão geral", icon: "◫" },
  { id: "finances", label: "Finanças", icon: "R$" },
  { id: "procurement", label: "Compras e contratos", icon: "◎" },
  { id: "people", label: "Pessoas", icon: "♙" },
  { id: "city", label: "Cidade e patrimônio", icon: "⌂" },
  { id: "health", label: "Saúde", icon: "+" },
  { id: "education", label: "Educação", icon: "A" },
  { id: "gazette", label: "Diário Oficial", icon: "≡" },
  { id: "services", label: "Serviços e processos", icon: "↗" },
  { id: "search", label: "Busca em tudo", icon: "⌕" },
  { id: "coverage", label: "Cobertura técnica", icon: "◌" },
];

const SERVICE_LINKS = [
  ["Portal Cidadão", "Processos, protocolos e Carta de Serviços", "https://cidadao.cuiaba.mt.gov.br/consulta_publica.aspx"],
  ["Matrícula Web", "Consulta pública de vagas escolares", "https://siged.cuiaba.mt.gov.br/matweb/consultar_vaga"],
  ["SORP", "Denúncias, fiscalização e transparência", "https://sorp.cuiaba.mt.gov.br/"],
  ["SmartGIS", "Mapa e cadastro imobiliário", "https://app.smartgis.net.br/cuiaba/publico/"],
  ["Portal Fazenda", "IPTU, certidões, taxas e guias", "https://portalfazenda.cuiaba.mt.gov.br/portalfazenda/"],
  ["GESCON", "Consulta e abertura de processos", "https://cuiaba.gesconet.com.br/Web/Publico/Default.aspx?CodigoEmpresa=1"],
  ["Cuiabá Regula", "Reclamações e serviços delegados", "https://www.cuiabaregula.cuiaba.mt.gov.br/"],
  ["Feiras Cuiabá", "Feiras, cadastro e acompanhamento", "https://feiras.cuiaba.mt.gov.br/"],
  ["Oferta Pública", "Editais e credores municipais", "https://ofertapublica.cuiaba.mt.gov.br/"],
  ["Cuiabá Prev", "Serviços previdenciários", "https://sisprev.cuiaba.mt.gov.br/sisprevweb/Login/LoginNew.aspx"],
  ["Aprovação Digital", "Licenciamento urbanístico e ambiental", "http://aprovadigital.cuiaba.mt.gov.br/aprovacao-digital.jsp"],
  ["Ponto Web", "Frequência e serviços funcionais", "https://pontoweb.cuiaba.mt.gov.br/"],
  ["NFS-e / ISSNet", "Nota fiscal de serviços e integração fiscal", "https://onlinecba.issnetonline.com.br/cuiaba/Login/Login.aspx"],
  ["Legislação Tributária", "Consulta de legislação tributária municipal", "https://e-leges.com.br/cuiaba#!/dashboard"],
  ["Licitações", "Portal legado de licitações", "http://licitacao.cuiaba.mt.gov.br/licitacao/"],
];

function fmtMoney(value: unknown) {
  const n = Number(String(value ?? "").replace(",", "."));
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
function fmtDate(value: string) {
  try { return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }); }
  catch { return value; }
}
function pickArray(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data.filter(x => x && typeof x === "object") as Record<string, unknown>[];
  if (data && typeof data === "object") {
    for (const value of Object.values(data as Record<string, unknown>)) {
      if (Array.isArray(value) && value.length && typeof value[0] === "object") return value as Record<string, unknown>[];
    }
  }
  return [];
}
function readableKey(key: string) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
}
function previewValue(value: unknown) {
  if (value == null) return "—";
  if (typeof value === "object") return Array.isArray(value) ? `${value.length} itens` : "Detalhes";
  const s = String(value);
  return s.length > 90 ? s.slice(0, 87) + "…" : s;
}
function sourceFor(sources: Source[], needle: string) {
  const exact = sources.find(s => s.route.toLowerCase() === needle.toLowerCase());
  return exact ?? sources.find(s => s.route.toLowerCase().includes(needle.toLowerCase()));
}
function rowsFor(sources: Source[], needles: string[]) {
  const out: { source: Source; row: Record<string, unknown> }[] = [];
  for (const source of sources) {
    if (!needles.some(n => source.route.toLowerCase().includes(n.toLowerCase()))) continue;
    for (const row of pickArray(source.data).slice(0, 250)) out.push({ source, row });
  }
  return out;
}
function searchSnapshot(snapshot: Snapshot, query: string) {
  const q = query.trim().toLocaleLowerCase("pt-BR");
  if (q.length < 2) return [];
  const hits: { source: Source; text: string; value: string }[] = [];
  const seen = new Set<string>();

  function walk(source: Source, value: unknown, path = "", depth = 0) {
    if (hits.length >= 180 || depth > 6 || value == null) return;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      const text = String(value);
      const hay = (path + " " + text).toLocaleLowerCase("pt-BR");
      if (hay.includes(q)) {
        const key = source.id + path + text.slice(0, 80);
        if (!seen.has(key)) {
          seen.add(key);
          hits.push({ source, text: path || source.description, value: text });
        }
      }
      return;
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < Math.min(value.length, 700); i++) walk(source, value[i], path, depth + 1);
      return;
    }
    if (typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        walk(source, v, path ? path + " › " + readableKey(k) : readableKey(k), depth + 1);
      }
    }
  }

  for (const source of snapshot.sources) {
    const meta = [source.category, source.description, source.route, source.system].join(" ").toLocaleLowerCase("pt-BR");
    if (meta.includes(q)) hits.push({ source, text: source.description || source.route, value: source.category });
    if (source.status === "ok") walk(source, source.data);
    if (hits.length >= 180) break;
  }
  return hits;
}

function DataTable({ rows, limit = 12 }: { rows: Record<string, unknown>[]; limit?: number }) {
  if (!rows.length) return <div className="empty-state">Nenhum registro disponível nesta coleta.</div>;
  const keys = [...new Set(rows.slice(0, limit).flatMap(r => Object.keys(r)))]
    .filter(k => !["children", "geoJson"].includes(k))
    .slice(0, 6);
  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead><tr>{keys.map(k => <th key={k}>{readableKey(k)}</th>)}</tr></thead>
        <tbody>
          {rows.slice(0, limit).map((row, i) => (
            <tr key={i}>{keys.map(k => <td key={k}>{previewValue(row[k])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceBlock({ source, title }: { source?: Source; title: string }) {
  const rows = source ? pickArray(source.data) : [];
  return (
    <section className="panel">
      <div className="panel-head">
        <div><span className="micro">{source?.category ?? "Dados municipais"}</span><h3>{title}</h3></div>
        {source && <span className={source.status === "ok" ? "status ok" : "status"}>{source.status === "ok" ? "atualizado" : source.status}</span>}
      </div>
      {source ? <DataTable rows={rows} /> : <div className="empty-state">Fonte não retornou dados nesta coleta.</div>}
    </section>
  );
}

export default function CityDashboard() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [view, setView] = useState<View>("overview");
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch("./data/municipal-snapshot.json")
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setSnapshot)
      .catch(e => setLoadError(String(e)));
  }, []);

  const searchHits = useMemo(() => snapshot ? searchSnapshot(snapshot, query) : [], [snapshot, query]);

  if (!snapshot) {
    return <main className="boot"><div className="boot-mark">CBA</div><h1>Carregando dados municipais</h1><p>{loadError || "Abrindo o snapshot consolidado das fontes públicas…"}</p></main>;
  }

  const sources = snapshot.sources;
  const receita = sourceFor(sources, "apireceita");
  const despesaMensal = sourceFor(sources, "apidespesamensal");
  const contratos = sourceFor(sources, "apicontrato");
  const licitacoes = sourceFor(sources, "apilicitacao");
  const servidores = sourceFor(sources, "apiservidorativo");
  const frota = sourceFor(sources, "apifrota");
  const patrimonio = sourceFor(sources, "apipatrimonio");
  const saude = sourceFor(sources, "apiadmunidadesaude");
  const gazeta = sourceFor(sources, "/editions/published?page=1");
  const legislacao = sourceFor(sources, "/legislations/published?page=1");
  const receitaRows = pickArray(receita?.data);
  const editions = pickArray(gazeta?.data);
  const topRevenue = receitaRows.slice(0, 7);
  const expenseRows = pickArray(despesaMensal?.data).filter(r => Number(r.DespesaAno) === 2026).slice(0, 7);
  const financeRows = topRevenue.length ? topRevenue : expenseRows;
  const usingRevenue = topRevenue.length > 0;
  const maxExpense = Math.max(1, ...expenseRows.map(r => Number(r.DespesaPagamento || 0)));
  const totalRecords = sources.reduce((n, s) => n + (s.count || 0), 0);

  const renderOverview = () => (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">CUIABÁ · DADOS PÚBLICOS INTEGRADOS</span>
          <h1>A cidade em um só lugar.</h1>
          <p>Finanças, contratos, pessoas, patrimônio, território, Diário Oficial e serviços reunidos a partir das fontes públicas municipais já mapeadas.</p>
        </div>
        <div className="freshness">
          <span>última consolidação</span>
          <strong>{fmtDate(snapshot.generatedAt)}</strong>
          <small>{snapshot.totals.ok} fontes responderam nesta coleta</small>
        </div>
      </section>

      <section className="metric-grid">
        <article><span>Fontes consultadas</span><strong>{snapshot.totals.autoQueried}</strong><small>{snapshot.totals.mapped} rotas integradas ao sistema</small></article>
        <article><span>Registros detectados</span><strong>{totalRecords.toLocaleString("pt-BR")}</strong><small>nos retornos públicos desta coleta</small></article>
        <article><span>{usingRevenue ? "Receita corrente prevista" : "Séries mensais de despesa"}</span><strong>{usingRevenue ? fmtMoney(topRevenue[0]?.ColunaValor1) : String(despesaMensal?.count ?? "—")}</strong><small>{usingRevenue ? "Portal da Transparência" : "empenho, liquidação e pagamento"}</small></article>
        <article><span>Última Gazeta</span><strong>{String(editions[0]?.number ?? "—")}</strong><small>{String(editions[0]?.publication_date ?? "").slice(0, 10).split("-").reverse().join("/")}</small></article>
      </section>

      <section className="dashboard-grid">
        <section className="panel span-2">
          <div className="panel-head"><div><span className="micro">ORÇAMENTO</span><h3>{usingRevenue ? "Receitas municipais" : "Pagamentos mensais · 2026"}</h3></div><button onClick={() => setView("finances")}>ver finanças →</button></div>
          <div className="bars">
            {financeRows.map((row, i) => {
              const pct = usingRevenue ? Math.max(2, Number(row.ColunaValor7 || 0)) : Math.max(2, (Number(row.DespesaPagamento || 0) / maxExpense) * 100);
              const label = usingRevenue ? String(row.ColunaDescricao ?? "Receita") : String(row.DespesaMesDsc ?? "Mês");
              const value = usingRevenue ? row.ColunaValor4 : row.DespesaPagamento;
              return <div className="bar-row" key={i}><div><strong>{label}</strong><span>{fmtMoney(value)}</span></div><div className="bar-track"><i style={{ width: Math.min(100, pct) + "%" }} /></div><small>{usingRevenue ? Number(row.ColunaValor7 || 0).toFixed(1) + "% realizado" : "pagamento registrado no mês"}</small></div>;
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head"><div><span className="micro">PUBLICAÇÕES</span><h3>Gazeta recente</h3></div><button onClick={() => setView("gazette")}>abrir →</button></div>
          <div className="feed">
            {editions.slice(0, 6).map((e, i) => <article key={i}><strong>Edição {String(e.number ?? "—")}{e.suplement ? " · suplemento" : ""}</strong><span>{String(e.publication_date ?? "").slice(0, 10).split("-").reverse().join("/")}</span><small>{String(e.downloads ?? 0)} downloads · {String(e.views ?? 0)} visualizações</small></article>)}
          </div>
        </section>
      </section>

      <section className="domain-grid">
        {[
          ["Finanças", "Receitas, despesas, empenhos, pagamentos, repasses e emendas", "finances"],
          ["Compras", "Licitações, contratos, atas, fornecedores e convênios", "procurement"],
          ["Pessoas", "Servidores, cargos, concursos, férias e diárias", "people"],
          ["Cidade", "Frota, patrimônio, imóveis e estrutura administrativa", "city"],
          ["Saúde", "Unidades de saúde, escalas, vigilância e documentos públicos", "health"],
          ["Educação", "Vagas escolares, matrícula e serviços educacionais", "education"],
          ["Diário Oficial", "Edições e legislação municipal publicada", "gazette"],
          ["Serviços", "Processos, escola, fazenda, fiscalização e previdência", "services"],
        ].map(([name, desc, id]) => <button key={id} className="domain-card" onClick={() => setView(id as View)}><span>{name}</span><p>{desc}</p><i>→</i></button>)}
      </section>
    </>
  );

  const renderView = () => {
    if (view === "overview") return renderOverview();
    if (view === "finances") return <><PageTitle title="Finanças públicas" text="Receita, despesa, execução, pagamentos, repasses e demais dados fiscais consolidados das APIs municipais."/><SourceBlock source={receita} title="Receitas"/><SourceBlock source={despesaMensal} title="Despesas mensais"/><GenericSources sources={sources} category="Finanças"/></>;
    if (view === "procurement") return <><PageTitle title="Compras e contratos" text="Licitações, contratos, atas, fornecedores, adesões e convênios em uma única visão."/><SourceBlock source={licitacoes} title="Licitações"/><SourceBlock source={contratos} title="Contratos"/><GenericSources sources={sources} category="Compras e contratos"/></>;
    if (view === "people") return <><PageTitle title="Pessoas e serviço público" text="Quadro de servidores, cargos, concursos, afastamentos, férias e diárias."/><SourceBlock source={servidores} title="Servidores ativos"/><GenericSources sources={sources} category="Pessoas"/></>;
    if (view === "city") return <><PageTitle title="Cidade, patrimônio e território" text="Frota, patrimônio e informações geográficas/cadastrais públicas."/><SourceBlock source={frota} title="Frota municipal"/><SourceBlock source={patrimonio} title="Patrimônio"/><GenericSources sources={sources} category="Cidade e patrimônio"/><GenericSources sources={sources} category="Território e imóveis"/></>;
    if (view === "health") return <><PageTitle title="Saúde pública" text="Unidades de saúde, documentos, alertas de vigilância, escalas de policlínicas e plantões publicados pelo Município."/><SourceBlock source={saude} title="Unidades de saúde"/><GenericSources sources={sources} category="Saúde"/></>;
    if (view === "education") return <><PageTitle title="Educação municipal" text="Acesso organizado às consultas de vagas, Matrícula Web, SIGEEC e certificados de formação."/><div className="service-grid">{SERVICE_LINKS.filter(x => ["Matrícula Web"].includes(x[0])).map(([name, desc, url]) => <a className="service-card" key={name} href={url} target="_blank" rel="noreferrer"><span>educação</span><h3>{name}</h3><p>{desc}</p><strong>Abrir consulta ↗</strong></a>)}<a className="service-card" href="https://matriculaweb.cuiaba.mt.gov.br/certificadof_consulta_publica" target="_blank" rel="noreferrer"><span>educação</span><h3>Certificados</h3><p>Consulta pública de certificados de formação continuada.</p><strong>Abrir consulta ↗</strong></a><a className="service-card" href="https://siged.cuiaba.mt.gov.br/login" target="_blank" rel="noreferrer"><span>educação</span><h3>SIGEEC</h3><p>Acesso institucional aos serviços da Secretaria Municipal de Educação.</p><strong>Abrir sistema ↗</strong></a></div></>;
    if (view === "gazette") return <><PageTitle title="Diário Oficial e legislação" text="Edições recentes da Gazeta Municipal e legislação publicada."/><SourceBlock source={gazeta} title="Edições da Gazeta"/><SourceBlock source={legislacao} title="Legislação"/></>;
    if (view === "services") return <><PageTitle title="Serviços e processos" text="Atalhos para os sistemas públicos municipais mapeados, organizados pelo que o cidadão precisa fazer."/><div className="service-grid">{SERVICE_LINKS.map(([name, desc, url]) => <a className="service-card" key={name} href={url} target="_blank" rel="noreferrer"><span>serviço oficial</span><h3>{name}</h3><p>{desc}</p><strong>Abrir serviço ↗</strong></a>)}</div></>;
    if (view === "search") return <><PageTitle title="Busca em todos os dados" text="Pesquise nomes, órgãos, credores, contratos, receitas, publicações e qualquer texto presente nas respostas coletadas."/><div className="big-search"><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Ex.: saúde, combustível, empresa, escola, decreto, servidor…"/><span>{query.length >= 2 ? searchHits.length + " ocorrências" : "digite pelo menos 2 caracteres"}</span></div><div className="search-results">{searchHits.map((hit, i) => <article key={i}><span>{hit.source.category} · {hit.source.description || hit.source.route}</span><strong>{hit.value}</strong><small>{hit.text}</small></article>)}</div></>;
    return <><PageTitle title="Cobertura técnica" text="Aqui fica a infraestrutura. Esta tela existe para auditar se as rotas mapeadas realmente estão sendo incorporadas pela coleta."/><section className="coverage-metrics"><article><strong>{snapshot.totals.mapped}</strong><span>rotas integradas</span></article><article><strong>{snapshot.totals.ok}</strong><span>respostas OK</span></article><article><strong>{snapshot.totals.parameterized}</strong><span>exigem parâmetro</span></article><article><strong>{snapshot.totals.errors}</strong><span>falhas nesta coleta</span></article></section><div className="coverage-list">{sources.map(s => <article key={s.id}><span className={"dot " + s.status}/><div><strong>{s.description || s.route}</strong><small>{s.system} · {s.method} · {s.route}</small></div><em>{s.status}</em></article>)}</div></>;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo"><div>CBA</div><span><strong>Cuiabá Dados</strong><small>hub municipal</small></span></div>
        <nav>{NAV.map(item => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><i>{item.icon}</i><span>{item.label}</span></button>)}</nav>
        <div className="side-foot"><span className="live"/> <div><strong>Dados consolidados</strong><small>{snapshot.totals.ok}/{snapshot.totals.autoQueried} consultas OK</small></div></div>
      </aside>
      <div className="content-shell">
        <header className="topline"><button className="mobile-brand" onClick={() => setView("overview")}>CBA</button><div className="crumb">Cuiabá / <strong>{NAV.find(n => n.id === view)?.label}</strong></div><button className="search-jump" onClick={() => setView("search")}>⌕ Buscar em tudo</button></header>
        <main className="content">{renderView()}</main>
      </div>
    </div>
  );
}

function PageTitle({ title, text }: { title: string; text: string }) {
  return <section className="page-title"><span className="eyebrow">DADOS MUNICIPAIS INTEGRADOS</span><h1>{title}</h1><p>{text}</p></section>;
}

function GenericSources({ sources, category }: { sources: Source[]; category: string }) {
  const matching = sources.filter(s => s.category === category && s.status === "ok" && pickArray(s.data).length);
  if (!matching.length) return null;
  return <section className="source-grid">{matching.slice(0, 8).map(source => <SourceBlock key={source.id} source={source} title={source.description || source.route}/>)}</section>;
}
