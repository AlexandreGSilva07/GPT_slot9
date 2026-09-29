# APIs públicas disponíveis para consulta — Prefeitura de Cuiabá (MT)

**Levantamento realizado em:** 28/09/2026  
**Escopo:** APIs, endpoints JSON/PDF, serviços públicos consumidos pelos frontends oficiais e interfaces públicas relacionadas à Prefeitura de Cuiabá.

> **Nota metodológica:** não existe um catálogo central Swagger/OpenAPI público da Prefeitura. O levantamento foi feito inspecionando portais oficiais, bundles JavaScript públicos, rotas efetivamente chamadas pelos frontends e respostas reais dos backends. Assim, a lista abaixo representa todas as rotas públicas descobertas sistematicamente nos sistemas oficiais analisados; não é possível provar que não exista alguma rota interna não referenciada publicamente.

---

# 1. Portal da Transparência

Portal: `https://transparencia.cuiaba.mt.gov.br/portaltransparencia/transparencia/`

Base encontrada no frontend:

```text
https://transparencia.cuiaba.mt.gov.br/portaltransparencia/servlet/a
```

A montagem da URL é direta. Exemplo:

```text
https://transparencia.cuiaba.mt.gov.br/portaltransparencia/servlet/aapireceita
```

O frontend atual referencia **194 endpoints distintos**, dos quais **140 são rotas principais/auxiliares** e **54 são endpoints de filtros**.

## 1.1 Dados, documentos e administração

| Endpoint | Dados retornados |
|---|---|
| `apimenu` | Estrutura do menu público: IDs, nomes, links, ordem, ícones, estado ativo |
| `apisubmenu` | Submenus e páginas disponíveis |
| `apimenuallpesquisa` | Menus disponíveis na pesquisa global/avançada |
| `apisubmenuallpesquisa` | Submenus pesquisáveis |
| `apiimagens` | Metadados/imagens utilizados no portal |
| `apihtml` | Conteúdo HTML institucional configurado no portal |
| `apinoticia` | Notícias/informações publicadas |
| `apimanual` | Manuais e documentos de orientação |
| `apioutrossites` | Links para outros sistemas/portais públicos |
| `apilastupdate` | Última carga dos dados: tabela, data/hora, duração, modo, linhas e erros |
| `apideclaracao` | Dados de declarações/certidões |
| `apiautenticacao` | Dados usados na autenticação/validação de declarações e documentos |
| `apipergunta` | Perguntas frequentes/conteúdo de ajuda |
| `apianexos` | Relação de documentos/anexos |
| `apianexospasta` | Documentos agrupados por pasta/categoria |
| `ppdownloadarquivo` | Download do arquivo selecionado |
| `aapianexostransicaodocumentos` | Documentos públicos do processo de transição administrativa |
| `apisendemail` | Endpoint de envio de formulário/e-mail do portal |

## 1.2 Organograma e estrutura administrativa

| Endpoint | Dados retornados |
|---|---|
| `apiorganogramadireta` | Órgãos da administração direta e estrutura hierárquica |
| `apiorganogramaindireta` | Administração indireta |
| `apiorganogramasecretario` | Secretários/dirigentes associados aos órgãos |
| `apiorganogramaanexos` | Anexos/documentos do organograma |

## 1.3 Receitas municipais

| Endpoint | Dados retornados |
|---|---|
| `apireceita` | Árvore completa de receitas: código, descrição, valores, saldos, percentuais e subníveis |
| `apireceitamensal` | Receita por mês/competência |
| `apireceitaorgao` | Receita por órgão/unidade |
| `apireceitalivre` | Consulta analítica/livre de receitas |
| `apirenunciafiscaliptu` | Renúncias fiscais relacionadas ao IPTU |

A resposta real de `apireceita` contém campos como `ColunaIdChar`, `ColunaDescricao`, `ColunaValor1` até `ColunaValor7`, `hasChildren` e `children`, permitindo reconstruir a hierarquia completa de receitas.

## 1.4 Despesas

| Endpoint | Dados retornados |
|---|---|
| `apidespesamensal` | Despesas agregadas mensalmente |
| `apidespesaorgao` | Despesas por órgão |
| `apidespesacredor` | Despesas por credor |
| `apidespesacredorliquidacao` | Liquidações vinculadas ao credor/despesa |
| `apidespesacredorpagamento` | Pagamentos vinculados ao credor |
| `apidespesacronologia` | Cronologia das despesas/pagamentos |
| `apidespesacronologiapagamentosanaliticos` | Pagamentos analíticos da cronologia |
| `apidespesaacao` | Despesas por ação orçamentária |
| `apidespesanatureza` | Despesas por natureza/classificação |
| `apidespesalivre` | Pesquisa analítica livre de despesas |
| `apirestopagar` | Restos a pagar |

## 1.5 Empenhos, liquidações e pagamentos

| Endpoint | Dados retornados |
|---|---|
| `apiempenho` | Empenhos públicos |
| `apiempenholiquidacao` | Liquidações relacionadas a determinado empenho |
| `apiempenhopagamento` | Pagamentos ligados ao empenho |
| `apiliquidacao` | Liquidações |
| `apiliquidacaopagamento` | Pagamentos vinculados a uma liquidação |
| `apipagamento` | Pagamentos efetuados |

Fluxo possível: **dotação → empenho → liquidação → pagamento → credor**.

## 1.6 Diárias e passagens

| Endpoint | Dados retornados |
|---|---|
| `apidiaria` | Diárias concedidas |
| `apidiariaitem` | Detalhamento/itens de uma diária |
| `apidiariapassagem` | Diárias e passagens/viagens relacionadas |

## 1.7 Servidores e pessoal

| Endpoint | Dados retornados |
|---|---|
| `apiservidorativo` | Servidores ativos e dados funcionais/remuneratórios exibidos pelo portal |
| `apiservidorafastado` | Servidores afastados |
| `apiservidorferias` | Informações públicas de férias |
| `apiservidorexonerado` | Servidores exonerados e atos correspondentes |
| `apiservidorcedido` | Servidores cedidos |
| `apiservidorcedidoremuneracao` | Remuneração pública de servidores cedidos |
| `apiservidorquadrovagas` | Quadro de cargos/vagas disponíveis e ocupados |
| `apiservidorqtdcargo` | Quantidade de cargos |
| `apiservidorplanocarreira` | Planos de carreira/cargos |

## 1.8 Concursos e processos seletivos

| Endpoint | Dados retornados |
|---|---|
| `apiconcurso` | Concursos/processos seletivos |
| `apiconcursoedital` | Editais de determinado concurso |
| `apiconcursocargos` | Cargos/vagas do concurso |
| `apiconcursocomissao` | Comissão organizadora |
| `apiconcursocandidato` | Dados públicos de candidatos/resultados associados |
| `apiprocesso` | Processos vinculados à área de concurso/processo seletivo |

## 1.9 Licitações

| Endpoint | Dados retornados |
|---|---|
| `apilicitacao` | Licitações: processos, modalidades, objeto, situação, datas etc. |
| `apilicitacaoitem` | Itens da licitação |
| `apilicitacaomembros` | Comissão/membros envolvidos |
| `apilicitacaoforn` | Fornecedores/participantes |
| `apilicitacaocontrato` | Contratos resultantes da licitação |
| `apilicitacaoata` | Atas relacionadas |
| `apilicitacaoanexos` | Editais e outros documentos/anexos |
| `apilicitacaoexecfinanceira` | Execução financeira relacionada |
| `apiata` | Atas de registro de preço/atas publicadas |

## 1.10 Contratos

| Endpoint | Dados retornados |
|---|---|
| `apicontrato` | Contratos públicos |
| `apicontratoitem` | Itens/objetos do contrato |
| `apicontratofiscal` | Fiscal(is) do contrato |
| `apicontratoorgao` | Órgãos/unidades relacionados |
| `apicontratoanexos` | Contrato e documentos anexos |
| `apicontratolicitacao` | Licitação de origem |
| `apicontratoalteracao` | Aditivos/alterações contratuais |
| `apicontratoalteracaoanexo` | Documentos das alterações/aditivos |

## 1.11 Adesão a atas

| Endpoint | Dados retornados |
|---|---|
| `apiadesaoata` | Adesões a atas de registro de preços |
| `apiadesaoataitem` | Itens aderidos |
| `apiadesaoatacentrocusto` | Centros de custo ligados à adesão |
| `apiadesaoatadocumento` | Documentos da adesão |

## 1.12 Convênios, repasses e emendas

| Endpoint | Dados retornados |
|---|---|
| `apiconveniorecebido` | Convênios em que o Município é convenente/recebedor |
| `apiconveniorecebidoanexos` | Anexos desses convênios |
| `apiconveniocedido` | Convênios/recursos concedidos pelo Município |
| `apirepasses` | Repasses financeiros |
| `apiemendaparlamentar` | Emendas parlamentares |
| `apiinterferenciafinanceira` | Desembolsos/interferências e execução financeira |

## 1.13 Patrimônio

| Endpoint | Dados retornados |
|---|---|
| `apipatrimonio` | Bens patrimoniais/móveis |
| `apipatrimonioimovel` | Bens imóveis municipais |

## 1.14 Frota e abastecimento

| Endpoint | Dados retornados |
|---|---|
| `apifrota` | Veículos oficiais e informações de frota |
| `apiabastecimento` | Abastecimentos da frota |
| `apiabastecimentodetail` | Detalhamento individual dos abastecimentos |

## 1.15 Previdência

| Endpoint | Dados retornados |
|---|---|
| `apiprevidencia` | Informações públicas da previdência municipal |

## 1.16 Controle interno

| Endpoint | Dados retornados |
|---|---|
| `apiadmlegisinterno` | Legislação relacionada ao controle interno |
| `apiadminstrucaonormativa` | Instruções normativas |
| `apiadmorientacaotecnica` | Orientações técnicas |
| `apiadmrecomendacaotecnica` | Recomendações técnicas |
| `apiadmnormativa` | Normativos administrativos |
| `apiadmlegislacao` | Legislação administrativa relacionada |

## 1.17 Ouvidoria e transparência ativa

| Endpoint | Dados retornados |
|---|---|
| `apiadmouvidor` | Informações públicas da Ouvidoria |
| `apiadmouvidoranexos` | Documentos/anexos da Ouvidoria |
| `apiadmouvidorgestao` | Dados/indicadores administrativos da Ouvidoria |
| `apiadmeventosocial` | Eventos de transparência/controle social |
| `apiadmeventosocialfoto` | Fotos desses eventos |
| `apiadmeventosocialmateria` | Matérias/publicações relacionadas |
| `apiadmeventosocialanexo` | Anexos dos eventos |
| `apiglossario` | Glossário do Portal da Transparência |

## 1.18 Saúde e documentos públicos

| Endpoint | Dados retornados |
|---|---|
| `apiadmunidadesaude` | Unidades de saúde cadastradas |
| `apianexospastaalertasaudevigilancia` | Alertas/documentos da Vigilância em Saúde |
| `apianexospastaboletimacidentesanimaispeconhentos` | Boletins de acidentes com animais peçonhentos |
| `apianexospastaescalaspoliclinicas` | Escalas de plantão das policlínicas |
| `apianexospastaescalasplantoesmedicos` | Escalas de plantões médicos |
| `apianexospastaescalasplantoeshmc` | Escalas do HMC |
| `apianexospastaescalasplantoesprontosocorro` | Escalas do pronto-socorro |

## 1.19 Contas fiscais, RGF, RREO e documentos

| Endpoint | Dados retornados |
|---|---|
| `apianexospastarreo` | Relatórios Resumidos da Execução Orçamentária — RREO |
| `apianexospastargf` | Relatórios de Gestão Fiscal — RGF |
| `apianexospastabc` | Balanços/documentos da categoria BC |
| `apianexospastabm` | Balanços/documentos da categoria BM |
| `apianexospastacontasanuais` | Contas anuais de governo |
| `apianexospastadecreto` | Decretos disponibilizados como documentos |
| `apianexospastarelatoriosanuais` | Relatórios anuais |
| `apianexospastatermocoperacao` | Termos de cooperação/documentos |
| `apianexospasta` | Plano/orçamento e demais documentos organizados em pastas |

## 1.20 COVID-19 — endpoints históricos ainda presentes

| Endpoint | Dados retornados |
|---|---|
| `apiarrecadacaocovid` | Recursos recebidos para COVID |
| `apidespesacredorcovid` | Despesas COVID por credor |
| `apidespesacredorliquidacaocovid` | Liquidações dessas despesas |
| `apidespesacredorliquidacaodoccovid` | Documentos das liquidações |
| `apidespesacredorpagamentocovid` | Pagamentos COVID por credor |
| `apidespesadotacaosaldocovid` | Dotação/saldo de despesas COVID |
| `apidespesalivrecovid` | Pesquisa livre de despesas COVID |
| `apidespesaorgaocovid` | Despesas COVID por órgão |
| `apiempenhocovid` | Empenhos COVID |
| `apiliquidacaocovid` | Liquidações COVID |
| `apipagamentocovid` | Pagamentos COVID |
| `apilicitacaocovid` | Licitações COVID |
| `apicontratocovid` | Contratos COVID |
| `apiadmlegislacaocovid` | Legislação COVID |
| `apiadmorientacaotecnicacovid` | Orientações técnicas COVID |
| `apiglossariocovid` | Glossário da seção COVID |

## 1.21 Endpoints de filtros (54)

Essas rotas alimentam os campos de seleção das telas: exercício, órgão, modalidade, situação, fornecedor, credor, classificação etc.

| Endpoint | Filtra |
|---|---|
| `apifilterabastecimento` | Abastecimentos |
| `apifilteradesaoata` | Adesões a atas |
| `apifilteradminstrucaonormativa` | Instruções normativas |
| `apifilteradmlegislacaocovid` | Legislação COVID |
| `apifilteradmorientacaotecnica` | Orientações técnicas |
| `apifilteradmorientacaotecnicacovid` | Orientações COVID |
| `apifilteradmrecomendacaotecnica` | Recomendações técnicas |
| `apifilteranexos` | Documentos/anexos |
| `apifilteranexospasta` | Documentos organizados por pasta |
| `apifilterarrecadacaocovid` | Recursos COVID |
| `apifilterata` | Atas |
| `apifilterconcurso` | Concursos/processos |
| `apifiltercontrato` | Contratos |
| `apifiltercontratocovid` | Contratos COVID |
| `apifilterconveniocedido` | Convênios concedidos |
| `apifilterconveniorecebido` | Convênios recebidos |
| `apifilterdespesaacao` | Despesa por ação |
| `apifilterdespesacredor` | Despesa por credor |
| `apifilterdespesacredorcovid` | Despesa COVID por credor |
| `apifilterdespesacronologia` | Cronologia de pagamentos |
| `apifilterdespesalivre` | Consulta livre de despesas |
| `apifilterdespesamensal` | Despesa mensal |
| `apifilterdespesanatureza` | Natureza da despesa |
| `apifilterdespesaorgao` | Despesa por órgão |
| `apifilterdespesaorgaocovid` | Despesas COVID por órgão |
| `apifilterdiaria` | Diárias |
| `apifilterdiariapassagem` | Diárias/passagens |
| `apifilteremendaparlamentar` | Emendas parlamentares |
| `apifilterempenho` | Empenhos |
| `apifilterempenhocovid` | Empenhos COVID |
| `apifilterfrota` | Frota |
| `apifilterinterferenciafinanceira` | Execução/interferência financeira |
| `apifilterlegislacaocontroleinterno` | Legislação de controle interno |
| `apifilterlicitacao` | Licitações |
| `apifilterlicitacaocovid` | Licitações COVID |
| `apifilterliquidacao` | Liquidações |
| `apifilterliquidacaocovid` | Liquidações COVID |
| `apifilterpagamento` | Pagamentos |
| `apifilterpagamentocovid` | Pagamentos COVID |
| `apifilterpatrimonio` | Patrimônio móvel |
| `apifilterpatrimonioimovel` | Patrimônio imobiliário |
| `apifilterprevidencia` | Previdência |
| `apifilterreceita` | Receita consolidada/por órgão |
| `apifilterreceitalivre` | Consulta livre de receitas |
| `apifilterreceitamensal` | Receita mensal |
| `apifilterrenunciafiscaliptu` | Renúncias de IPTU |
| `apifilterrepasses` | Repasses |
| `apifilterrestopagar` | Restos a pagar |
| `apifilterservidor` | Servidores ativos/exonerados |
| `apifilterservidorafastado` | Servidores afastados |
| `apifilterservidorcedido` | Servidores cedidos |
| `apifilterservidorferias` | Férias |
| `apifilterservidorplanocarreira` | Plano de carreira |
| `apifilterservidorquadrovagas` | Quadro de cargos/vagas |

---

# 2. API geográfica/cadastral — SmartGIS Cuiabá

Portal público:

```text
https://app.smartgis.net.br/cuiaba/publico/
```

Base da API:

```text
https://api.smartgis.net.br/cuiaba/prefeitura/api
```

## 2.1 Endpoints públicos

| Método | Endpoint | Retorna |
|---|---|---|
| GET | `/PublicConfig/Get` | Configuração pública do SIG, município, posição inicial do mapa, parâmetros cartográficos e módulos |
| GET | `/PublicSettings/GetSettings` | Recursos públicos habilitados e nomes das abas |
| GET | `/PublicConfig/GetMap?key={chave}` | Configuração de um mapa/camada específica |
| GET | `/PublicConfig/GetEstatisticaColors/` | Classes/cores usadas nas estatísticas geográficas |
| GET | `/PublicLote/Get/{id}` | Cadastro do lote + GeoJSON do polígono |
| GET | `/PublicLote/GetEstatisticasIptuBairro/{id}` | Estatísticas de IPTU do bairro do imóvel |
| GET | `/PublicLote/GetUnidade?id={id}&groupKey={grupo}` | Dados cadastrais da unidade/imóvel |
| GET | `/PublicLote/GetTributosUnidadeIptu/{id}` | Dados de IPTU da unidade |
| GET | `/PublicLote/GetTributosUnidadeIptuDetalhado/{id}` | IPTU detalhado |
| GET | `/PublicLote/GetTributosUnidadeItbi/{id}` | Dados de ITBI relacionados à unidade |
| GET | `/PublicLote/GetRelatorioUnidade/{id}` | Relatório público da unidade imobiliária |
| GET | `/PublicLote/GetRelatorioUnidadeRedeSim?inscricao={inscricao}` | Relatório cadastral para integração RedeSim |
| GET | `/PublicLote/GetAvaliacoes/{id}` | Avaliações imobiliárias registradas |
| GET | `/PublicLote/GetPhotos/{id}` | Fotos/metadados fotográficos relacionados ao lote |
| GET | `/PublicLote/GetPlaceHolderByModule` | Critérios aceitos pela busca pública |
| POST | `/PublicLote/ListUnidade` | Pesquisa/listagem de unidades imobiliárias |
| POST | `/PublicLote/IdentifyOnExtent` | Identifica lotes/unidades dentro de uma área geográfica |
| POST | `/PublicLote/ExportXlsx` | Exportação dos resultados públicos em Excel |

### Exemplo de dados retornados por `/PublicLote/Get/{id}`

A resposta validada contém campos como:

- `id`
- `inscricao`
- `geoJson`
- `unidadesCount`
- área do terreno
- testada real
- área construída
- endereço
- quadra
- número do lote
- bairro
- CEP
- presença de calçada
- presença de muro
- outros atributos cadastrais configurados no sistema

O placeholder oficial da busca informa que ela aceita:

```text
Inscrição do Imóvel, CPF/CNPJ do Proprietário
```

Não foram reproduzidos no levantamento registros pessoais individuais de proprietários.
## 2.2 Endpoints técnicos públicos do backend

| Endpoint | Retorna |
|---|---|
| `/Authentication/GetVersion` | Versão atual do sistema; validado como `4.0.0` |
| `/Authentication/GetSessionInfo` | Contexto da sessão atual/anônima |
| `/Module/ListActive` | Módulos habilitados no ambiente |

Na validação, `Module/ListActive` indicou módulos como:

- Auditor
- Administração
- GeoFinanceiro
- Observatório do Mercado Imobiliário
- Público
- Atendimento
- Consulta

O frontend também usa uma API externa GeoCloud, mas ela é infraestrutura terceirizada do SmartGIS e não foi contabilizada como API própria da Prefeitura.

---

# 3. API da Gazeta Municipal

Portal:

```text
https://gazetamunicipal.cuiaba.mt.gov.br/
```

Base atual:

```text
https://gazetamunicipal.cuiaba.mt.gov.br/api
```

## Endpoints

| Método | Endpoint | Retorna |
|---|---|---|
| GET | `/editions/published?page={n}` | Edições publicadas |
| GET | `/editions/published/{ano}/{mes}` | Todas as edições de um mês |
| POST | `/editions/searchES?page={n}&bucket_size=10` | Busca textual/Elasticsearch em todas as edições |
| GET | `/editions/viewPdf/{editionId}` | PDF integral da edição |
| GET | `/editions/downloadPdf/{editionId}` | Download do PDF |
| GET | `/legislations/published?page={n}` | Listagem geral de legislação, conforme o contexto da interface |
| GET | `/legislations/published/{ano}/{mes}?page={n}&perPage={qtd}` | Legislação publicada no mês |
| GET | `/legislations/published/{ano}/{mes}/{tipo}?page={n}&perPage={qtd}` | Legislação filtrada por tipo |
| POST | `/legislations/searchES?page={n}` | Busca textual de legislação; rota presente no frontend |
| GET | `/legislations/viewPdf/{id}` | Visualização do documento/PDF referenciado pela busca |
| GET | `/legislations/downloadPdf/{id}` | Download de legislação/documento |

## Campos das edições

A API retorna, entre outros:

- `id`
- `number`
- `edition_type_name`
- `suplement`
- `publication_date`
- `downloads`
- `views`

## Busca textual `searchES`

Além dos registros, retorna campos/agregações como:

- `edition_id`
- `edition_number`
- `page_number`
- `highlight`
- `publication_date`
- `suplement`
- total de resultados
- data mínima/máxima
- agregações por ano
- agregações por tipo de edição
- agregações por suplemento

Isso permite localizar uma expressão dentro de toda a Gazeta e descobrir a edição e a página onde ela aparece.

## Legislação

A consulta validada retorna, por item:

- `id`
- `number`
- `epigrafe`
- `date`
- `publication_date`
- `type`
- `page`
- `article_id`
- edição da Gazeta correspondente

Os tipos atualmente retornados incluem:

- Lei
- Ato
- Lei Complementar
- Decreto
- Projeto de Lei

**Observação:** resultados antigos de busca na web ainda mostram URLs com `/api/api/...`, mas o frontend atual e os testes realizados indicam que a base canônica usa apenas um `/api`.

---

# 4. Interfaces públicas sem API REST pública independente identificada

## 4.1 Portal do Contribuinte / Fazenda

```text
https://portalfazenda.cuiaba.mt.gov.br/portalfazenda/
```

Oferece IPTU, guias, taxas, certidões, processos e outros serviços. As páginas públicas analisadas são predominantemente ASP.NET WebForms/postback. Não foi encontrada uma API REST pública independente, `.asmx`, `.svc`, Swagger ou rota `/api/...` anônima claramente utilizável.

Os POSTs internos das páginas não foram contabilizados como “API pública”.

## 4.2 Portal antigo de Licitações

```text
http://licitacao.cuiaba.mt.gov.br/licitacao/
```

Aplicação JSP/HTML legada. A pesquisa pública existe, mas não foi identificada uma API JSON separada. Os dados estruturados modernos de licitação aparecem no Portal da Transparência (`apilicitacao`, `apicontrato`, `apiata`, etc.).

## 4.3 Portal Cidadão / SIGED

```text
https://cidadao.cuiaba.mt.gov.br/
```

Permite protocolar e acompanhar serviços. O frontend analisado é uma aplicação WebForms. Não foi encontrada API REST/JSON pública independente, WebMethod ou WebService público para as consultas anônimas.

## 4.4 SORP

```text
https://sorp.cuiaba.mt.gov.br/
```

O portal é oficial e possui denúncia, acompanhamento de protocolo e estatísticas públicas. Durante a inspeção técnica, o host expirou conexões diretas a partir do ambiente de análise; por isso nenhuma rota de backend foi inventada ou inferida sem validação.

**Status:** portal público confirmado; API de backend não confirmada.

---

# 5. NFS-e municipal — caso especial

Em 2026 houve transição para o padrão nacional de NFS-e. Conforme comunicação municipal publicada em agosto de 2026, o emissor e webservice municipal permaneceriam disponíveis até **31/10/2026**, com migração obrigatória para o padrão nacional em **01/11/2026**.

Esse webservice é uma **API transacional de emissão fiscal**, com autenticação/integração do contribuinte, e não uma API aberta de consulta pública. Por isso não foi somado às APIs públicas acima.

---

# 6. Resumo técnico

As três fontes públicas mais relevantes para consumo programático são:

1. **Portal da Transparência** — orçamento, receitas, despesas, credores, pessoal, contratos, licitações, convênios, frota, patrimônio, previdência, saúde, documentos e filtros auxiliares.
2. **SmartGIS Cuiabá** — cadastro imobiliário, geometrias em GeoJSON, IPTU/ITBI, avaliações, fotos, relatórios e consultas espaciais.
3. **Gazeta Municipal** — edições, legislação, PDFs e busca textual dentro das publicações.

## Totais encontrados

- **Portal da Transparência:** 194 endpoints referenciados pelo frontend atual.
- **SmartGIS:** 18 endpoints públicos principais `Public*`, mais endpoints técnicos públicos do backend.
- **Gazeta Municipal:** aproximadamente 11 rotas funcionais principais entre listagem, busca e PDFs.
- **Total descoberto:** mais de **220 rotas públicas/referenciadas** considerando as três famílias, sem contar páginas WebForms, formulários HTML e dependências terceirizadas.

---

# 7. Próximo passo possível

Este levantamento pode ser convertido em uma especificação técnica estilo OpenAPI, contendo para cada rota:

- URL completa
- método HTTP
- parâmetros
- filtros aceitos
- exemplo de request
- exemplo de response
- esquema dos campos retornados
- status de teste
- necessidade ou não de autenticação
- observações de estabilidade/legado

Isso permitiria criar uma **OpenAPI não oficial da Prefeitura de Cuiabá** para uso em integrações, ETL, BI, automações e pesquisa.

---

# 8. Segunda varredura — 29/09/2026

Esta seção amplia o levantamento original com sistemas e rotas que não haviam sido inventariados ou estavam classificados de forma incompleta. O critério continua sendo: registrar apenas URLs públicas/referenciadas por interfaces oficiais ou por documentação técnica confiável, separando consultas anônimas, páginas server-rendered, interfaces autenticadas e APIs transacionais.

## 8.1 SORP — Portal Integrado / Web Denúncias

Base pública:

```text
https://sorp.cuiaba.mt.gov.br/
```

Rotas públicas confirmadas no mapa do site e páginas oficiais:

| Método aparente | Rota | Função |
|---|---|---|
| GET | `/` | Página inicial do Portal SORP |
| GET/POST de formulário | `/denuncias/form` | Registro de denúncia/ocorrência |
| GET + consulta | `/acompanhar` | Consulta pública de denúncia por protocolo |
| GET | `/servicos` | Catálogo de serviços da SORP |
| GET | `/transparencia` | Estatísticas públicas agregadas de denúncias e resolução |
| GET | `/noticias` | Notícias e comunicados |
| GET | `/acessibilidade` | Declaração de acessibilidade |
| GET | `/privacidade` | Política de privacidade |
| GET | `/kids` | Área educativa SORP Kids |
| GET/POST de formulário | `/contato` | Serviço de Informação ao Cidadão / formulário de contato |
| GET | `/assuntos` | Assuntos de fiscalização e respectivas bases legais |
| GET | `/como-funciona` | Fluxo público do atendimento de denúncias |
| GET | `/termos` | Termos de uso; descreve funcionalidades do portal |
| GET | `/mapa-do-site` | Mapa de páginas e áreas do portal |

O mapa do site também referencia, sem expor necessariamente a rota completa no conteúdo indexado:

- login;
- criação de conta;
- recuperação de senha;
- validação 2FA;
- painel do cidadão;
- busca geral;
- área administrativa;
- gerenciadores de notícias, serviços, banners, FAQ e horários.

Funcionalidades confirmadas pelos próprios Termos/portal:

- registro e acompanhamento de denúncias;
- protocolo digital;
- anexos de fotos e vídeos;
- chat/histórico;
- notificações;
- lavratura eletrônica de Autos de Infração;
- cientificação eletrônica via DEC-Fiscal;
- gestão do Cadastro Municipal de Imóveis Urbanos em Situação Irregular (CMISI);
- consulta de protocolos e histórico;
- integração de fiscalização entre SORP, Procon, Bem-Estar Animal, Meio Ambiente e Defesa Civil.

**Status:** sistema público atual, com rotas de leitura e formulários de escrita. Os POSTs internos não foram acionados nesta varredura.

Fontes públicas:

- https://sorp.cuiaba.mt.gov.br/mapa-do-site
- https://sorp.cuiaba.mt.gov.br/acompanhar
- https://sorp.cuiaba.mt.gov.br/transparencia
- https://sorp.cuiaba.mt.gov.br/termos
- https://sorp.cuiaba.mt.gov.br/como-funciona

## 8.2 SIGEEC / Matrícula Web — Secretaria Municipal de Educação

Bases identificadas:

```text
https://matriculaweb.cuiaba.mt.gov.br/
https://siged.cuiaba.mt.gov.br/
```

Rotas públicas confirmadas:

| Rota | Função |
|---|---|
| `/matweb/login` | Portal Matrícula Web / autenticação |
| `/matweb/consultar_vaga` | Consulta pública de vagas, unidade escolar, fase, turno, aguardando vaga e listas |
| `/matweb/transparencia_vaga/` | Alias/entrada para Transparência de Vagas; redireciona para `consultar_vaga` |
| `/matweb/esqueci` | Recuperação de cadastro por CPF/e-mail ou celular/SMS |
| `/matweb/registro` | Cadastro de usuário/responsável; rota referenciada pelo botão Cadastrar |
| `/login` | Login do SIGEEC institucional |
| `/recuperar_cadastro` | Recuperação de senha do SIGEEC por CPF e e-mail |
| `/ainstitucional_usuario_servidor` | Cadastro de usuário para servidor / Avaliação Institucional |
| `/certificadof_consulta_publica` | Consulta pública de certificados de formação continuada por CPF |

A consulta de vagas expõe publicamente campos como:

- código de ano/fase;
- código de lotação;
- código de turno;
- unidade escolar;
- bairro;
- ano/fase;
- turno;
- total de vagas;
- quantidade aguardando vaga;
- lista de solicitações;
- solicitações canceladas.

**Status:** endpoints de páginas server-rendered e formulários. Não foi encontrada documentação OpenAPI pública nesta rodada.

Fontes públicas:

- https://matriculaweb.cuiaba.mt.gov.br/matweb/login
- https://siged.cuiaba.mt.gov.br/matweb/consultar_vaga
- https://siged.cuiaba.mt.gov.br/matweb/esqueci
- https://siged.cuiaba.mt.gov.br/login
- https://siged.cuiaba.mt.gov.br/recuperar_cadastro
- https://siged.cuiaba.mt.gov.br/ainstitucional_usuario_servidor
- https://matriculaweb.cuiaba.mt.gov.br/certificadof_consulta_publica

## 8.3 Portal Cidadão / SIGED — correção do inventário anterior

Base:

```text
https://cidadao.cuiaba.mt.gov.br/
```

O levantamento anterior classificava o portal apenas como WebForms sem API independente. Isso continua correto quanto à ausência de REST/JSON pública confirmada, mas existem vários endpoints públicos de consulta e catálogo que merecem ser inventariados.

| Rota | Função |
|---|---|
| `/` | Login / entrada do Portal de Serviços |
| `/consulta_publica.aspx` | Consulta pública de processos e documentos |
| `/detalhe_protocolo.aspx?cod_protocolo={id}` | Detalhe público de um processo/protocolo, situação, interessado, assunto, localização e histórico |
| `/servico_resumido.aspx?cod_assunto_documento_tipo={id}` | Resumo parametrizado de serviço da Carta de Serviços |
| `/servico_detalhado.aspx?cod_assunto_documento_tipo={id}` | Detalhamento completo do serviço, documentos, legislação, taxas, prazo e canais |
| `/consultar.aspx` | Consulta associada a CPF/CNPJ |
| `/cadastro_novo.aspx` | Cadastro de usuário, inclusive fluxo com certificado digital |
| `/recuperar_senha.aspx` | Recuperação de senha |
| `/ler_manual.aspx?cod_manual={id}` | Leitura/download de manuais parametrizados |

O endpoint `detalhe_protocolo.aspx` pode retornar, quando o processo é público:

- número do processo;
- data;
- situação;
- interessado;
- assunto;
- localização atual;
- histórico completo de tramitações;
- origem/destino;
- datas de recebimento;
- despachos de movimentação.

**Status:** endpoints públicos WebForms/server-rendered; úteis para consulta automatizada, embora não sejam uma API REST formal.

Fontes públicas:

- https://cidadao.cuiaba.mt.gov.br/consulta_publica.aspx
- https://cidadao.cuiaba.mt.gov.br/servico_resumido.aspx
- https://cidadao.cuiaba.mt.gov.br/servico_detalhado.aspx
- https://cidadao.cuiaba.mt.gov.br/cadastro_novo.aspx
- https://cidadao.cuiaba.mt.gov.br/recuperar_senha.aspx

## 8.4 GESCON.NET — processos da Secretaria Municipal de Fazenda/Economia

Interfaces públicas identificadas:

```text
https://cuiaba.gesconet.com.br/Web/Publico/Default.aspx?CodigoEmpresa=1
https://cuiaba.gesconet.com.br/Web/Publico/Abertura.aspx?CodigoEmpresa=1
https://cuiaba.gesconet.com.br/2.0/cuiaba/portalgescon/#/login
https://cuiaba.gesconet.com.br/2.0/cuiaba/gesconweb/
```

| Endpoint/interface | Função |
|---|---|
| `/Web/Publico/Default.aspx?CodigoEmpresa=1` | Entrada pública para consulta e abertura de processos |
| `/Web/Publico/Abertura.aspx?CodigoEmpresa=1` | Abertura de processos on-line, iniciando pela seleção da secretaria |
| `/2.0/cuiaba/portalgescon/#/login` | Portal GESCON 2.0 referenciado pelo site oficial da Prefeitura |
| `/2.0/cuiaba/gesconweb/` | Interface Gescon Web; a própria tela informa dependência de API |

**Status:** interface pública/semipública de processos; backend de API citado pela aplicação, mas a URL interna da API ainda não foi confirmada nesta rodada.

Fontes públicas:

- https://www.cuiaba.mt.gov.br/servicos-on-line
- https://cuiaba.gesconet.com.br/Web/Publico/Default.aspx?CodigoEmpresa=1
- https://cuiaba.gesconet.com.br/Web/Publico/Abertura.aspx?CodigoEmpresa=1

## 8.5 SISPREV Web — Cuiabá Prev

Entrada identificada:

```text
https://sisprev.cuiaba.mt.gov.br/sisprevweb/Login/LoginNew.aspx
```

Além de autenticação por login/senha, digital e certificado e-CPF/e-CNPJ, a própria tela pública oferece funcionalidades sem necessidade de entrar no sistema principal:

- Verificar autenticidade da CTC;
- Validar assinatura eletrônica;
- Emissão de Certidão de Tempo de Contribuição.

**Status:** sistema previdenciário autenticado com utilitários públicos de validação/emissão. As URLs internas específicas desses três utilitários ainda não foram expostas pelo índice público nesta rodada.

Fonte:

- https://sisprev.cuiaba.mt.gov.br/sisprevweb/Login/LoginNew.aspx

## 8.6 Aprovação Digital / licenciamento urbanístico e ambiental

A Prefeitura mantém referência oficial ao sistema Aprovação Digital para protocolar e acompanhar processos de alvará de obras, desmembramento/remembramento e licenciamento ambiental.
URL histórica/oficial referenciada:

```text
http://aprovadigital.cuiaba.mt.gov.br/aprovacao-digital.jsp
```

Fluxos confirmados pela Prefeitura:

- cadastro de profissional;
- geração de login/senha;
- protocolo de solicitação;
- upload de projeto e documentos;
- emissão/pagamento de taxas;
- acompanhamento de andamento;
- workflow entre fiscais, analistas e coordenadores;
- registro de pendências;
- devolução do processo ao interessado;
- emissão/assinatura do alvará.

**Status:** sistema transacional autenticado; a aplicação não expôs API REST pública indexada nesta rodada.

Fontes:

- https://www.cuiaba.mt.gov.br/servicos/aprovacao-digital
- https://cuiaba.mt.gov.br/noticias/cuiaba-lanca-sistema-digital-de-aprovacao-de-projetos

## 8.7 NFS-e municipal — Webservice SOAP ABRASF 2.04

O levantamento anterior mencionava o webservice sem registrar a URL técnica. A URL de produção atualmente divulgada pelo próprio sistema municipal é:

```text
https://wscuiaba.issnetonline.com.br/webservicenfse204/nfse.asmx
```

Ambiente de homologação referenciado por integrações técnicas:

```text
https://www.issnetonline.com.br/homologaabrasf/webservicenfse204/nfse.asmx
```

Características:

- provedor: ISSNet;
- layout: ABRASF 2.04;
- código IBGE de Cuiabá: 5103403;
- integração transacional para emissão/consulta de NFS-e e RPS;
- requer credenciais/certificados e regras fiscais do contribuinte;
- não é uma API pública anônima de consulta.

O sistema municipal informa que o webservice/local emissor permanece no período de transição até **31/10/2026**, com obrigatoriedade do Emissor Nacional a partir de **01/11/2026**.

Fontes:

- https://onlinecba.issnetonline.com.br/cuiaba/Login/Login.aspx
- https://wscuiaba.issnetonline.com.br/webservicenfse204/nfse.asmx

## 8.8 Outros sistemas oficiais identificados para investigação subsequente

Esta segunda varredura também confirmou links oficiais para sistemas que ainda precisam de extração técnica mais profunda para identificar endpoints internos, especialmente bundles JS, AJAX/WebMethods e serviços de backend:

- Cuiabá Regula / canal de denúncias;
- Controle de Resíduos;
- PontoWeb;
- Alvará Autodeclaratório;
- Balcão Único / Empresa Instantânea;
- Portal do Segurado / Cuiabá Prev;
- Portal de Integração / Cuiabá Prev;
- Perícia Médica;
- serviços de certidões e guias do Portal Fazenda;
- emissor ISSNet/Nota Cuiabana durante a transição de 2026.

Esses sistemas ficam marcados como **pendentes de aprofundamento**, não como inexistentes.


## 8.9 Portal Oferta Pública — regularização de passivo com fornecedores

Base:

```text
https://ofertapublica.cuiaba.mt.gov.br/
```

Rotas/entradas públicas confirmadas:

| Rota | Função |
|---|---|
| `/` | Login, editais, classificação final e áreas do credor |
| `/index.php?auth=register` | Cadastro de credores PF/PJ, representante legal e procurador |
| `/index.php?auth=forgot-password` | Recuperação de senha, rota referenciada pela interface |

Funcionalidades confirmadas:

- acesso por CPF/CNPJ e senha;
- cadastro de credor;
- confirmação de e-mail;
- juntada de documentação;
- identificação automática de créditos vinculados ao credor nas bases municipais;
- Restos a Pagar e DEA;
- habilitação interna;
- consulta de editais ativos/finalizados;
- classificação final;
- envio e histórico de lances/propostas;
- participação eletrônica nas sessões de Oferta Pública.

**Status:** aplicação transacional pública/autenticada. Foram apenas lidas páginas públicas; nenhum cadastro, lance ou envio foi realizado.

Fontes:

- https://ofertapublica.cuiaba.mt.gov.br/
- https://ofertapublica.cuiaba.mt.gov.br/index.php?auth=register
- https://www.cuiaba.mt.gov.br/noticias/prefeitura-de-cuiaba-lanca-portal-oferta-publica-para-regularizacao-de-debitos-com-fornecedores

## 8.10 Feiras Cuiabá — Gerenciador de Feiras

Base pública atual:

```text
https://feiras.cuiaba.mt.gov.br/
```

Rota administrativa indexada:

```text
https://feiras.cuiaba.mt.gov.br/home/login
```

Funcionalidades públicas confirmadas na página inicial:

- mapa/listagem de feiras;
- horários e segmentos;
- cadastro de interessado em ser feirante;
- envio de RG, CPF, comprovantes e fotos;
- acompanhamento de cadastro por protocolo + CPF;
- posição em lista de espera;
- área do feirante;
- gestão/fiscalização interna;
- geolocalização e fotos em fiscalização;
- gestão de inscrições, bancas e penalidades;
- exportação de relatórios;
- funcionalidades LGPD para titulares.

**Status:** sistema municipal atual, lançado em julho de 2026; frontend público e área restrita. As rotas internas de formulário/API ainda precisam ser extraídas diretamente dos assets públicos do sistema.

Fontes:

- https://feiras.cuiaba.mt.gov.br/
- https://feiras.cuiaba.mt.gov.br/home/login
- https://cuiaba.mt.gov.br/noticias/prefeitura-de-cuiaba-lanca-portal-para-modernizar-gestao-das-feiras-livres

## 8.11 Cuiabá Regula — Sistema Integrado de Atendimento/Denúncias

Base:

```text
https://www.cuiabaregula.cuiaba.mt.gov.br/
```

Funcionalidades públicas confirmadas:

- reclamações online;
- acompanhamento de solicitações;
- transparência/indicadores de desempenho;
- informações sobre água e esgoto, transporte público e estacionamento rotativo;
- portal exclusivo para concessionárias/permissionárias;
- canal de Ouvidoria Regulatória.

A Prefeitura informa que o portal de denúncias foi lançado em janeiro de 2026 e permite registro, acompanhamento e resolução de demandas sobre serviços públicos delegados.

**Status:** sistema público atual; URL base confirmada, mas as rotas internas específicas não foram expostas pelo índice público nesta rodada.

Fontes:

- https://www.cuiabaregula.cuiaba.mt.gov.br/
- https://www.cuiaba.mt.gov.br/noticias/cuiaba-lanca-portal-de-denuncias-da-cuiaba-regula

## 8.12 Ponto Web 2.0

Base:

```text
https://pontoweb.cuiaba.mt.gov.br/
```

Endpoint público de autenticação indexado:

```text
https://pontoweb.cuiaba.mt.gov.br/frmLogin.aspx?ReturnUrl=%2FAccount%2FLogin.aspx
```

Documentação pública do próprio sistema:

```text
https://pontoweb.cuiaba.mt.gov.br/Help/application.htm
https://pontoweb.cuiaba.mt.gov.br/ajuda/application.htm
```

A documentação expõe a existência de módulos para:

- marcação e manutenção de frequência;
- justificativas de faltas e atrasos;
- férias;
- horas extras;
- escalas e regimes de horários;
- cadastro de colaboradores;
- integração com sistemas de RH por CPF;
- relatórios de marcação, justificativas, faltas e servidores;
- alteração de senha;
- perfis Administrador, Gestor e Colaborador/Servidor.

**Status:** sistema autenticado de RH/ponto; não é uma API pública de consulta, mas possui documentação pública suficiente para mapear funcionalidades e endpoint de login.

## 8.13 Política/Portal de Dados Abertos

O site atual da Prefeitura contém um item de menu chamado **Dados Abertos** e o Decreto Municipal nº 10.035/2024 instituiu formalmente a Política de Dados Abertos, determinando a disponibilização de dados digitais estruturados e processáveis por máquina por meio de um Portal de Dados Abertos municipal.

Entretanto, nesta varredura não foi localizado um domínio/URL municipal dedicado e funcional para esse portal. Uma análise acadêmica publicada em 2026 também registrou que Cuiabá não apresentava um portal de dados abertos separado, mas permitia exportar dados de consultas predefinidas do Portal da Transparência.

**Status:** política e serviço anunciados; portal dedicado/API própria ainda não localizado. Não confundir com o Portal de Dados Abertos do Governo do Estado de Mato Grosso (`dadosabertos.mt.gov.br`).

## 8.14 Integrações internas/documentadas em contratação pública

Documentos públicos da Gazeta Municipal descrevem integrações técnicas do ecossistema de geoprocessamento municipal que não são, até o momento, APIs públicas anônimas confirmadas:

- API da solução de geoinformação para novas entradas de dados;
- integração com o sistema GAT para dados imobiliários e mobiliários;
- integração via webservice entre geoinformação e MVP (Movimentação Virtual de Processo);
- evolução/manutenção do SIGCUIABÁ;
- envio de ações fiscais para criação de processos no MVP.

Essas referências são importantes porque confirmam que há **webservices e APIs internas entre sistemas municipais**, embora suas URLs/credenciais não estejam publicamente documentadas.

## 8.15 Sistemas/serviços ainda pendentes de extração técnica

Após esta rodada, continuam merecendo investigação específica:

- Sistema de Gestão do PGRCC / Controle de Resíduos da Construção Civil, anunciado em 2026;
- Alvará Autodeclaratório;
- portal/integrações do Balcão Único – Empresa Instantânea;
- e-Leges / Legislação Tributária (`https://e-leges.com.br/cuiaba#!/dashboard`);
- Portal do Segurado e Portal de Integração do Cuiabá Prev;
- Perícia Médica;
- certidões, IPTU, ITBI e guias do Portal Fazenda;
- serviços de trânsito/multas;
- possível implementação futura/oculta do Portal de Dados Abertos municipal.
