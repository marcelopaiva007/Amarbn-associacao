-- Dados institucionais iniciais. Execute apenas depois de definir os dados reais
-- da associação; nenhum usuário ou senha é criado automaticamente neste arquivo.
INSERT INTO "InstitutionalDocument" ("id", "title", "kind", "contentUrl", "description", "published", "createdAt", "updatedAt")
VALUES
  ('doc_estatuto_inicial', 'Estatuto social', 'ESTATUTO', 'PREENCHER_URL_DOCUMENTO', 'Substitua pelo arquivo oficial aprovado da AMARBN.', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
