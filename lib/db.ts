import bcrypt from "bcryptjs";
import { getPrisma } from "./prisma";
import type { MemberStatus, PaymentStatus, DocumentKind } from "@/app/generated/prisma/client";

// Camada de acesso a dados da AMARBN. Toda leitura e escrita passa por aqui e
// termina no PostgreSQL — não existe mais estado em memória, que se perdia a
// cada reinício do serverless.

// As telas renderizam datas direto como texto, então a conversão de Date para
// string acontece aqui e não em cada componente.
function dateOnly(value: Date | null): string | null {
  return value ? value.toISOString().slice(0, 10) : null;
}

function dateTimeLabel(value: Date): string {
  return `${value.toISOString().slice(0, 10)} ${value.toISOString().slice(11, 16)}`;
}

function parseDateOnly(value: string): Date {
  return new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
}

// `datetime-local` devolve "2026-09-24T19:00" sem fuso. Guardamos como UTC para
// que o horário exibido seja exatamente o que a secretaria digitou.
function parseDateTime(value: string): Date {
  const normalized = value.trim().replace(" ", "T");
  const withSeconds = normalized.length === 16 ? `${normalized}:00` : normalized;
  return new Date(`${withSeconds}.000Z`);
}

type MemberRow = {
  id: string;
  registration: string;
  cpf: string;
  fullName: string;
  birthDate: Date | null;
  phone: string | null;
  address: string | null;
  photoUrl: string | null;
  status: MemberStatus;
  joinedAt: Date;
  userId: string | null;
  createdAt: Date;
};

function toMemberDto(member: MemberRow) {
  return {
    id: member.id,
    registration: member.registration,
    cpf: member.cpf,
    fullName: member.fullName,
    birthDate: dateOnly(member.birthDate),
    phone: member.phone,
    address: member.address,
    photoUrl: member.photoUrl,
    status: member.status,
    joinedAt: dateOnly(member.joinedAt),
    userId: member.userId,
    createdAt: member.createdAt.toISOString(),
  };
}

type PaymentRow = {
  id: string;
  memberId: string;
  reference: string;
  dueDate: Date;
  amount: unknown;
  status: PaymentStatus;
  paidAt: Date | null;
  receiptNumber: string | null;
  createdAt: Date;
  member?: { fullName: string; registration: string };
};

function toPaymentDto(payment: PaymentRow) {
  return {
    id: payment.id,
    memberId: payment.memberId,
    memberName: payment.member?.fullName ?? "",
    memberRegistration: payment.member?.registration ?? "",
    reference: payment.reference,
    dueDate: dateOnly(payment.dueDate),
    // Decimal do Prisma não atravessa a fronteira servidor/cliente do React.
    amount: Number(payment.amount),
    status: payment.status,
    paidAt: payment.paidAt ? payment.paidAt.toISOString() : null,
    receiptNumber: payment.receiptNumber,
    createdAt: payment.createdAt.toISOString(),
  };
}

// User / Auth Queries
export async function findUserByEmail(email: string) {
  return getPrisma().user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function findUserById(id: string) {
  return getPrisma().user.findUnique({ where: { id } });
}

export async function findMemberByUserId(userId: string) {
  const member = await getPrisma().member.findUnique({ where: { userId } });
  return member ? toMemberDto(member) : null;
}

// Members Queries
export async function listMembers(search?: string, status?: string) {
  const where: Record<string, unknown> = {};

  if (status && status !== "TODOS") {
    where.status = status as MemberStatus;
  }

  if (search && search.trim() !== "") {
    const term = search.trim();
    where.OR = [
      { fullName: { contains: term, mode: "insensitive" } },
      { cpf: { contains: term } },
      { registration: { contains: term, mode: "insensitive" } },
    ];
  }

  const members = await getPrisma().member.findMany({ where, orderBy: { fullName: "asc" } });
  return members.map(toMemberDto);
}

/**
 * Cadastra o associado e, quando há e-mail, o login de acesso ao portal.
 * A senha provisória é sorteada e devolvida uma única vez para a secretaria
 * entregar ao associado — nunca é possível lê-la de novo depois disso.
 */
export async function createMember(data: {
  fullName: string;
  cpf: string;
  registration: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
}): Promise<{ memberId: string; temporaryPassword: string | null }> {
  const temporaryPassword = data.email ? generateTemporaryPassword() : null;

  const member = await getPrisma().member.create({
    data: {
      registration: data.registration,
      cpf: data.cpf,
      fullName: data.fullName,
      birthDate: data.birthDate ? parseDateOnly(data.birthDate) : null,
      phone: data.phone || null,
      address: data.address || null,
      status: "ATIVO",
      user: data.email
        ? {
            create: {
              email: data.email.toLowerCase(),
              passwordHash: bcrypt.hashSync(temporaryPassword as string, 12),
              name: data.fullName,
              role: "ASSOCIADO",
            },
          }
        : undefined,
    },
  });

  return { memberId: member.id, temporaryPassword };
}

const PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function generateTemporaryPassword(length = 12): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => PASSWORD_ALPHABET[byte % PASSWORD_ALPHABET.length]).join("");
}

export async function updateMemberStatus(id: string, status: "ATIVO" | "PENDENTE" | "INATIVO") {
  await getPrisma().member.update({ where: { id }, data: { status } });
}

// Financial / Payments Queries
export async function listPayments(statusFilter?: string) {
  const where =
    statusFilter && statusFilter !== "TODOS" ? { status: statusFilter as PaymentStatus } : {};

  const payments = await getPrisma().payment.findMany({
    where,
    include: { member: { select: { fullName: true, registration: true } } },
    orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }],
  });

  return payments.map(toPaymentDto);
}

export async function getPaymentsByMemberId(memberId: string) {
  const payments = await getPrisma().payment.findMany({
    where: { memberId },
    include: { member: { select: { fullName: true, registration: true } } },
    orderBy: { dueDate: "asc" },
  });

  return payments.map(toPaymentDto);
}

/**
 * Gera a parcela do mês para cada associado ativo. Associados que já têm a
 * parcela daquela referência são ignorados, então rodar duas vezes não duplica
 * a cobrança.
 */
export async function generateMonthlyPayments(
  reference: string,
  dueDate: string,
  amount: number
): Promise<number> {
  const prisma = getPrisma();
  const activeMembers = await prisma.member.findMany({
    where: { status: "ATIVO" },
    select: { id: true },
  });

  if (activeMembers.length === 0) {
    return 0;
  }

  const result = await prisma.payment.createMany({
    data: activeMembers.map((member) => ({
      memberId: member.id,
      reference,
      dueDate: parseDateOnly(dueDate),
      amount,
      status: "PENDENTE" as PaymentStatus,
    })),
    skipDuplicates: true,
  });

  return result.count;
}

export async function markPaymentAsPaid(paymentId: string, receiptNumber?: string) {
  await getPrisma().payment.update({
    where: { id: paymentId },
    data: {
      status: "PAGO",
      paidAt: new Date(),
      receiptNumber: receiptNumber || `REC-${Date.now()}`,
    },
  });
}

export async function getFinancialSummary() {
  const prisma = getPrisma();

  const [byStatus, activeMembersCount, docsCount] = await Promise.all([
    prisma.payment.groupBy({ by: ["status"], _sum: { amount: true } }),
    prisma.member.count({ where: { status: "ATIVO" } }),
    prisma.institutionalDocument.count({ where: { published: true } }),
  ]);

  const sumFor = (status: PaymentStatus) =>
    Number(byStatus.find((row) => row.status === status)?._sum.amount ?? 0);

  return {
    pendingAmount: sumFor("PENDENTE"),
    paidAmount: sumFor("PAGO"),
    overdueAmount: sumFor("ATRASADO"),
    activeMembersCount,
    docsCount,
  };
}

// Documents Queries
export async function listDocuments() {
  const documents = await getPrisma().institutionalDocument.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    kind: doc.kind,
    referenceDate: dateOnly(doc.referenceDate),
    contentUrl: doc.contentUrl,
    description: doc.description,
    published: doc.published,
    createdAt: doc.createdAt.toISOString(),
  }));
}

export async function createDocument(data: {
  title: string;
  kind: string;
  contentUrl: string;
  description?: string;
}) {
  const doc = await getPrisma().institutionalDocument.create({
    data: {
      title: data.title,
      kind: data.kind as DocumentKind,
      referenceDate: new Date(),
      contentUrl: data.contentUrl,
      description: data.description || null,
      published: true,
    },
  });

  return doc.id;
}

// Assemblies Queries
export async function listAssemblies() {
  const assemblies = await getPrisma().assembly.findMany({ orderBy: { scheduledAt: "desc" } });

  return assemblies.map((assembly) => ({
    id: assembly.id,
    title: assembly.title,
    scheduledAt: dateTimeLabel(assembly.scheduledAt),
    location: assembly.location,
    agenda: assembly.agenda,
    status: assembly.status,
    createdAt: assembly.createdAt.toISOString(),
  }));
}

export async function createAssembly(data: {
  title: string;
  scheduledAt: string;
  location?: string;
  agenda?: string;
}) {
  const assembly = await getPrisma().assembly.create({
    data: {
      title: data.title,
      scheduledAt: parseDateTime(data.scheduledAt),
      location: data.location || null,
      agenda: data.agenda || null,
      status: "AGENDADA",
    },
  });

  return assembly.id;
}

// Aliases for API route compatibility
export const getUserByEmail = findUserByEmail;
export const getUserById = findUserById;
export const getMemberByUserId = findMemberByUserId;
