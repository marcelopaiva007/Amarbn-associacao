import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

/**
 * Cria (ou atualiza) o usuário administrador da AMARBN.
 *
 * Nenhuma senha fica escrita neste arquivo. A senha vem de ADMIN_PASSWORD e,
 * se a variável não estiver definida, uma senha forte é sorteada e mostrada
 * uma única vez no terminal.
 *
 *   ADMIN_EMAIL="secretaria@amarbn.org.br" ADMIN_PASSWORD="..." npm run db:seed
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
const MIN_PASSWORD_LENGTH = 12;

function generatePassword(length = 20): string {
  return Array.from(randomBytes(length), (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("✗ DATABASE_URL não definida. Configure o .env antes de rodar o seed.");
    process.exit(1);
  }

  const email = (process.env.ADMIN_EMAIL || "admin@amarbn.org.br").toLowerCase();
  const providedPassword = process.env.ADMIN_PASSWORD;

  if (providedPassword && providedPassword.length < MIN_PASSWORD_LENGTH) {
    console.error(`✗ ADMIN_PASSWORD precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`);
    process.exit(1);
  }

  const password = providedPassword || generatePassword();
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: "ADMIN" },
      create: {
        email,
        passwordHash,
        name: process.env.ADMIN_NAME || "Administrador AMARBN",
        role: "ADMIN",
      },
    });

    console.log("✓ Usuário administrador pronto");
    console.log(`  E-mail: ${email}`);

    if (providedPassword) {
      console.log("  Senha:  (a definida em ADMIN_PASSWORD)");
    } else {
      console.log(`  Senha:  ${password}`);
      console.log("\n  ⚠ Anote esta senha agora — ela não será mostrada de novo.");
      console.log("    Guarde-a também em ADMIN_PASSWORD no ambiente de produção.");
    }
  } catch (error) {
    console.error("✗ Erro ao executar o seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
