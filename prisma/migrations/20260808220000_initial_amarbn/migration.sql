-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SECRETARIA', 'FINANCEIRO', 'ASSOCIADO');
CREATE TYPE "MemberStatus" AS ENUM ('ATIVO', 'PENDENTE', 'INATIVO');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');
CREATE TYPE "DocumentKind" AS ENUM ('ESTATUTO', 'ATA', 'EDITAL', 'REGIMENTO', 'OUTRO');

CREATE TABLE "User" (
  "id" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL, "role" "Role" NOT NULL DEFAULT 'ASSOCIADO',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Member" (
  "id" TEXT NOT NULL, "registration" TEXT NOT NULL, "cpf" TEXT NOT NULL,
  "fullName" TEXT NOT NULL, "birthDate" TIMESTAMP(3), "phone" TEXT, "address" TEXT,
  "photoUrl" TEXT, "status" "MemberStatus" NOT NULL DEFAULT 'PENDENTE',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Payment" (
  "id" TEXT NOT NULL, "memberId" TEXT NOT NULL, "reference" TEXT NOT NULL,
  "dueDate" TIMESTAMP(3) NOT NULL, "amount" DECIMAL(10,2) NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE', "paidAt" TIMESTAMP(3),
  "receiptNumber" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "InstitutionalDocument" (
  "id" TEXT NOT NULL, "title" TEXT NOT NULL, "kind" "DocumentKind" NOT NULL,
  "referenceDate" TIMESTAMP(3), "contentUrl" TEXT NOT NULL, "description" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "InstitutionalDocument_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Assembly" (
  "id" TEXT NOT NULL, "title" TEXT NOT NULL, "scheduledAt" TIMESTAMP(3) NOT NULL,
  "location" TEXT, "agenda" TEXT, "minutesUrl" TEXT, "status" TEXT NOT NULL DEFAULT 'AGENDADA',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Assembly_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Member_registration_key" ON "Member"("registration");
CREATE UNIQUE INDEX "Member_cpf_key" ON "Member"("cpf");
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");
CREATE UNIQUE INDEX "Payment_memberId_reference_key" ON "Payment"("memberId", "reference");
CREATE INDEX "Payment_status_dueDate_idx" ON "Payment"("status", "dueDate");
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
