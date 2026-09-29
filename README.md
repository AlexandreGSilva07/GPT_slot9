# Cuiabá API Atlas

Explorador unificado das APIs, endpoints, páginas de consulta, formulários e webservices já mapeados no levantamento da Prefeitura de Cuiabá.

## Fonte de verdade

O arquivo `data/apis_publicas_prefeitura_cuiaba_mt.md` é o inventário original. O catálogo exibido na aplicação é extraído automaticamente desse arquivo.

## O que o sistema faz

- cataloga todas as rotas e URLs documentadas no MD;
- resolve automaticamente as bases do Portal da Transparência, SmartGIS e Gazeta Municipal;
- mantém páginas WebForms, formulários e webservices transacionais no mesmo inventário;
- permite busca e filtros por sistema, tipo e executabilidade;
- executa consultas de leitura por um proxy server-side;
- permite POST somente em rotas mapeadas como leitura/exportação sem efeito transacional;
- disponibiliza o inventário estruturado em `/api/catalog`;
- disponibiliza o MD original em `/api/source`.

## Segurança de execução

O sistema não dispara automaticamente cadastros, denúncias, envio de e-mail, emissão fiscal, lances ou outras operações transacionais. Essas rotas continuam registradas e acessíveis como referência/link oficial.

## Desenvolvimento

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Origem

Projeto experimental/não oficial. Os dados e serviços pertencem às respectivas fontes públicas municipais/terceirizadas documentadas no inventário.
