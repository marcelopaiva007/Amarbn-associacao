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
npm run db:generate
npx prisma migrate deploy
```

A migration cria as tabelas de usuários, associados, parcelas, documentos institucionais e assembleias. O arquivo `prisma/seed.sql` é apenas um ponto de partida institucional e deve receber a URL real do estatuto antes de ser executado.

## Segurança e LGPD

Os dados de associados, CPF, foto e histórico financeiro são dados pessoais. O acesso administrativo deve ser limitado por perfil, a base não deve ser compartilhada e fotos/documentos devem ficar em armazenamento privado com download autenticado. A aplicação ainda precisa da implementação do login real, perfis de permissão e auditoria antes de ir ao ar.
