# MeuLink · ALVEO

Central de entregáveis "ALVEO + Cliente": uma página pública por cliente (estilo link na bio)
para colar na descrição do grupo do WhatsApp, e um painel interno para cadastrar clientes,
seções e links. Identidade visual conforme o Manual de Marca ALVEO v1.0.

## Rodando localmente

```bash
npm install
npm run db:push     # cria as tabelas no SQLite (data/meulink.db)
npm run db:seed     # opcional: cria o "Cliente Exemplo"
npm run dev         # http://localhost:3000
```

- Painel: `http://localhost:3000/admin` (senha em `.env.local`, variável `ADMIN_PASSWORD`).
- Página do cliente: `http://localhost:3000/<slug>`.
- Cada clique passa por `/go/<id>`, que conta e redireciona.

## Variáveis de ambiente (`.env.local`)

| Variável | Para quê |
| --- | --- |
| `ADMIN_PASSWORD` | Senha única do painel. |
| `AUTH_SECRET` | Assina o cookie de sessão. Gere com `openssl rand -hex 32`. |
| `DATABASE_URL` | `file:./data/meulink.db` local; `libsql://...` (Turso) em produção. |
| `DATABASE_AUTH_TOKEN` | Token do Turso em produção. Vazio localmente. |
| `NEXT_PUBLIC_SITE_URL` | URL pública, usada no botão "Copiar link". |

## Deploy no subdomínio (ex.: `link.alveo.com.br`)

1. Crie um banco no [Turso](https://turso.tech) e copie `DATABASE_URL` + `DATABASE_AUTH_TOKEN`.
2. Rode `npm run db:push` apontando para esse banco (exporte as duas variáveis antes).
3. Suba o projeto na Vercel com todas as variáveis acima e `NEXT_PUBLIC_SITE_URL=https://link.alveo.com.br`.
4. Em Domains na Vercel, adicione o subdomínio e crie o CNAME indicado no DNS do domínio oficial.

## Estrutura

- `src/app/[slug]` página pública do cliente.
- `src/app/go/[id]` redirecionamento com contagem de cliques.
- `src/app/admin` painel (login por senha, lista, editor de cliente/seções/links).
- `src/app/admin/actions.ts` server actions (toda a escrita no banco passa por aqui).
- `src/db/schema.ts` tabelas `clients`, `sections`, `links` (Drizzle + libsql).
- `src/components/Logo.tsx` logotipo e símbolo vetoriais extraídos do manual de marca.
- `public/brand/` SVGs oficiais.
