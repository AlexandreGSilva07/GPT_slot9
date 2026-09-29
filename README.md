# Cuiabá Dados

Hub municipal experimental que transforma o inventário de APIs e endpoints públicos de Cuiabá em um produto utilizável.

## O que aparece para o usuário

- visão geral da cidade;
- finanças públicas;
- compras, licitações e contratos;
- pessoas e serviço público;
- cidade, patrimônio e território;
- saúde;
- educação;
- Diário Oficial e legislação;
- serviços e processos;
- busca unificada sobre os dados coletados.

## Como as APIs são usadas

O arquivo `data/apis_publicas_prefeitura_cuiaba_mt.md` continua sendo o inventário técnico de referência.

Antes de cada publicação, `scripts/collect-data.mjs`:

1. lê o inventário;
2. identifica as rotas públicas das famílias Portal da Transparência, SmartGIS e Gazeta Municipal;
3. consulta automaticamente todas as rotas GET que podem ser chamadas sem parâmetros;
4. mantém registradas as rotas parametrizadas e ações não seguras para chamada automática;
5. consolida as respostas em `public/data/municipal-snapshot.json`;
6. preserva o último retorno válido quando uma fonte falha temporariamente ou responde com rate limit.

O GitHub Pages publica o dashboard já com esse snapshot.

## Atualização

O workflow `.github/workflows/pages.yml` coleta os dados antes do build e também possui execução agendada.

## Desenvolvimento

```bash
npm install
npm run collect
npm run dev
```

Build estático:

```bash
npm run build
```

Projeto não oficial. Os dados pertencem às respectivas fontes públicas municipais e sistemas documentados no inventário.
