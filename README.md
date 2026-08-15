# Sistema AMARBN

Sistema de gestão associativa com portal do associado, carteira digital, controle interno de parcelas e secretaria institucional.

## Banco de dados Neon

O projeto usa PostgreSQL no Neon. Por segurança, a senha do banco não é colocada no código nem enviada por mensagem.

Crie um projeto no painel Neon com o nome `amarbn-associacao`, usando PostgreSQL, e copie a *connection string* com pooler habilitado. No arquivo `.env`, criado a partir de `.env.example`, preencha:

```env
DATABASE_URL="connection-string-copiada-do-neon"
APP_SESSION_SECRET="uma-chave-aleatoria-longa"
```

Com a conexão preenchida, aplique a estrutura inicial:

```bash
npm install          # gera o Prisma Client automaticamente (postinstall)
npm run db:deploy    # aplica as migrations
npm run db:seed      # cria o usuário administrador
```

A migration cria as tabelas de usuários, associados, parcelas, documentos institucionais e assembleias.

## Primeiro acesso

Nenhuma senha fica escrita no repositório. O usuário administrador é criado pelo
`npm run db:seed`, que lê as variáveis de ambiente:

| Variável         | Padrão                  | Para que serve                                        |
| ---------------- | ----------------------- | ----------------------------------------------------- |
| `ADMIN_EMAIL`    | `admin@amarbn.org.br`   | E-mail de login do administrador                       |
| `ADMIN_NAME`     | `Administrador AMARBN`  | Nome exibido no sistema                                |
| `ADMIN_PASSWORD` | *(sorteada)*            | Senha do administrador; mínimo de 12 caracteres        |

Se `ADMIN_PASSWORD` não estiver definida, o seed sorteia uma senha forte e a
mostra **uma única vez** no terminal. Anote no gerenciador de senhas da
associação — ela não pode ser consultada depois, apenas redefinida rodando o
seed novamente.

Associados cadastrados pela tela **Admin → Associados** com e-mail recebem uma
senha provisória sorteada, exibida uma única vez na própria tela para a
secretaria entregar. Ela também não fica recuperável depois.

## Deploy na Vercel

Configure em *Settings → Environment Variables* (ambiente Production):

```env
DATABASE_URL        # connection string do Neon, com pooler
APP_SESSION_SECRET  # openssl rand -base64 48
```

O build roda `prisma generate` automaticamente. As migrations **não** são
aplicadas no build: rode `npm run db:deploy` apontando para o banco de produção
sempre que houver uma migration nova.

O acesso público ao endereço `*.vercel.app` depende de *Settings → Deployment
Protection*: com **Vercel Authentication** ligada, só quem tem conta na equipe
Vercel consegue abrir o site. Desligue essa proteção (ou use um domínio próprio,
que não é afetado por ela) quando o sistema estiver pronto para os associados.

## Segurança e LGPD

Os dados de associados, CPF, foto e histórico financeiro são dados pessoais. O acesso administrativo é limitado por perfil — `middleware.ts` verifica o papel gravado na sessão antes de liberar `/admin`, e associados são enviados de volta ao portal. As senhas são gravadas com bcrypt (12 rounds) e nunca em texto claro.

Continua valendo: a base não deve ser compartilhada, fotos e documentos devem ficar em armazenamento privado com download autenticado, e o registro de auditoria de acessos ainda precisa ser persistido (hoje só vai para o log da aplicação).

## Desenvolvimento

```bash
npm run dev          # servidor de desenvolvimento
npm run type-check   # TypeScript
npm test             # Jest
```
