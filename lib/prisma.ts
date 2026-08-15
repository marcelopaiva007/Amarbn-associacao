import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { ConfigurationError } from "./errors";

// Uma única instância por processo. Em serverless cada invocação pode reusar o
// mesmo processo, e sem o cache global o Prisma abriria um pool novo por
// hot-reload em desenvolvimento.
declare global {
  var __amarbn_prisma: PrismaClient | undefined;
}

// A construção é preguiçosa de propósito: `next build` importa este módulo para
// coletar as rotas, e nesse momento o DATABASE_URL não precisa existir. O erro
// só aparece quando alguma consulta é realmente executada.
export function getPrisma(): PrismaClient {
  if (globalThis.__amarbn_prisma) {
    return globalThis.__amarbn_prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new ConfigurationError(
      "DATABASE_URL não está configurada. Defina a connection string do PostgreSQL " +
        "(Neon) nas variáveis de ambiente antes de usar o sistema."
    );
  }

  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  globalThis.__amarbn_prisma = client;
  return client;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
