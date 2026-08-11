import { hashPassword } from "./auth";

// Global in-memory database store for Vercel Serverless & Local
declare global {
  var __amarbn_db: any;
}

function initMemoryDb() {
  if (globalThis.__amarbn_db) {
    return globalThis.__amarbn_db;
  }

  const now = new Date().toISOString();

  const users = [
    {
      id: "usr_admin_01",
      email: "admin@amarbn.org.br",
      passwordHash: hashPassword("admin123"),
      name: "Administrador AMARBN",
      role: "ADMIN",
      createdAt: now,
    },
    {
      id: "usr_assoc_01",
      email: "associado@amarbn.org.br",
      passwordHash: hashPassword("associado123"),
      name: "Carlos Eduardo Silva",
      role: "ASSOCIADO",
      createdAt: now,
    },
  ];

  const members = [
    {
      id: "mbr_01",
      registration: "AMR-2026-0001",
      cpf: "123.456.789-00",
      fullName: "Carlos Eduardo Silva",
      birthDate: "1985-04-12",
      phone: "(81) 98877-6655",
      address: "Rua das Palmeiras, 120 - Nordeste - Recife/PE",
      photoUrl: null,
      status: "ATIVO",
      joinedAt: "2024-01-15",
      userId: "usr_assoc_01",
      createdAt: now,
    },
    {
      id: "mbr_02",
      registration: "AMR-2026-0002",
      cpf: "987.654.321-11",
      fullName: "Maria Alice Oliveira",
      birthDate: "1990-08-22",
      phone: "(81) 99112-3344",
      address: "Av. Principal, 450 - Nordeste - Recife/PE",
      photoUrl: null,
      status: "ATIVO",
      joinedAt: "2024-02-10",
      userId: null,
      createdAt: now,
    },
  ];

  const payments = [
    {
      id: "pay_01",
      memberId: "mbr_01",
      memberName: "Carlos Eduardo Silva",
      memberRegistration: "AMR-2026-0001",
      reference: "2026-08",
      dueDate: "2026-08-10",
      amount: 45.0,
      status: "PAGO",
      paidAt: now,
      receiptNumber: "REC-2026-0801",
      createdAt: now,
    },
    {
      id: "pay_02",
      memberId: "mbr_01",
      memberName: "Carlos Eduardo Silva",
      memberRegistration: "AMR-2026-0001",
      reference: "2026-09",
      dueDate: "2026-09-10",
      amount: 45.0,
      status: "PENDENTE",
      paidAt: null,
      receiptNumber: null,
      createdAt: now,
    },
    {
      id: "pay_03",
      memberId: "mbr_02",
      memberName: "Maria Alice Oliveira",
      memberRegistration: "AMR-2026-0002",
      reference: "2026-08",
      dueDate: "2026-08-10",
      amount: 45.0,
      status: "PENDENTE",
      paidAt: null,
      receiptNumber: null,
      createdAt: now,
    },
  ];

  const documents = [
    {
      id: "doc_01",
      title: "Estatuto Social AMARBN",
      kind: "ESTATUTO",
      referenceDate: "2024-01-01",
      contentUrl: "#",
      description: "Estatuto social consolidado da associação dos moradores e agricultores",
      published: 1,
      createdAt: now,
    },
    {
      id: "doc_02",
      title: "Ata da Assembleia Geral Ordinária 2026",
      kind: "ATA",
      referenceDate: "2026-03-15",
      contentUrl: "#",
      description: "Ata de prestação de contas e planejamento agrícola",
      published: 1,
      createdAt: now,
    },
  ];

  const assemblies = [
    {
      id: "ass_01",
      title: "Assembleia Geral Ordinária de Setembro",
      scheduledAt: "2026-09-24 19:00",
      location: "Sede Social AMARBN / Auditório",
      agenda: "1. Prestação de contas do trimestre\n2. Feira agrícola comunitária\n3. Assuntos gerais",
      status: "AGENDADA",
      createdAt: now,
    },
  ];

  const store = { users, members, payments, documents, assemblies };
  globalThis.__amarbn_db = store;
  return store;
}

const db = initMemoryDb();

// User / Auth Queries
export function findUserByEmail(email: string) {
  return db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserById(id: string) {
  return db.users.find((u: any) => u.id === id) || null;
}

export function findMemberByUserId(userId: string) {
  return db.members.find((m: any) => m.userId === userId) || null;
}

// Members Queries
export function listMembers(search?: string, status?: string) {
  let list = db.members;

  if (status && status !== "TODOS") {
    list = list.filter((m: any) => m.status === status);
  }

  if (search && search.trim() !== "") {
    const s = search.trim().toLowerCase();
    list = list.filter(
      (m: any) =>
        m.fullName.toLowerCase().includes(s) ||
        m.cpf.includes(s) ||
        m.registration.toLowerCase().includes(s)
    );
  }

  return list;
}

export function createMember(data: {
  fullName: string;
  cpf: string;
  registration: string;
  email?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
}) {
  const now = new Date().toISOString();
  const memberId = `mbr_${Date.now()}`;
  let userId: string | null = null;

  if (data.email) {
    userId = `usr_${Date.now()}`;
    db.users.push({
      id: userId,
      email: data.email,
      passwordHash: hashPassword("123456"),
      name: data.fullName,
      role: "ASSOCIADO",
      createdAt: now,
    });
  }

  const newMember = {
    id: memberId,
    registration: data.registration,
    cpf: data.cpf,
    fullName: data.fullName,
    birthDate: data.birthDate || null,
    phone: data.phone || null,
    address: data.address || null,
    photoUrl: null,
    status: "ATIVO",
    joinedAt: now.substring(0, 10),
    userId,
    createdAt: now,
  };

  db.members.push(newMember);
  return memberId;
}

export function updateMemberStatus(id: string, status: "ATIVO" | "PENDENTE" | "INATIVO") {
  const m = db.members.find((x: any) => x.id === id);
  if (m) m.status = status;
}

// Financial / Payments Queries
export function listPayments(statusFilter?: string) {
  let list = db.payments;

  if (statusFilter && statusFilter !== "TODOS") {
    list = list.filter((p: any) => p.status === statusFilter);
  }

  return list;
}

export function getPaymentsByMemberId(memberId: string) {
  return db.payments.filter((p: any) => p.memberId === memberId);
}

export function generateMonthlyPayments(reference: string, dueDate: string, amount: number) {
  const now = new Date().toISOString();
  let count = 0;
  const activeMembers = db.members.filter((m: any) => m.status === "ATIVO");

  for (const m of activeMembers) {
    const exists = db.payments.some((p: any) => p.memberId === m.id && p.reference === reference);
    if (!exists) {
      db.payments.push({
        id: `pay_${Date.now()}_${count}`,
        memberId: m.id,
        memberName: m.fullName,
        memberRegistration: m.registration,
        reference,
        dueDate,
        amount,
        status: "PENDENTE",
        paidAt: null,
        receiptNumber: null,
        createdAt: now,
      });
      count++;
    }
  }

  return count;
}

export function markPaymentAsPaid(paymentId: string, receiptNumber?: string) {
  const now = new Date().toISOString();
  const p = db.payments.find((x: any) => x.id === paymentId);
  if (p) {
    p.status = "PAGO";
    p.paidAt = now;
    p.receiptNumber = receiptNumber || `REC-${Date.now()}`;
  }
}

export function getFinancialSummary() {
  const pendingAmount = db.payments
    .filter((p: any) => p.status === "PENDENTE")
    .reduce((acc: number, p: any) => acc + p.amount, 0);

  const paidAmount = db.payments
    .filter((p: any) => p.status === "PAGO")
    .reduce((acc: number, p: any) => acc + p.amount, 0);

  const overdueAmount = db.payments
    .filter((p: any) => p.status === "ATRASADO")
    .reduce((acc: number, p: any) => acc + p.amount, 0);

  const activeMembersCount = db.members.filter((m: any) => m.status === "ATIVO").length;
  const docsCount = db.documents.filter((d: any) => d.published === 1).length;

  return { pendingAmount, paidAmount, overdueAmount, activeMembersCount, docsCount };
}

// Documents Queries
export function listDocuments() {
  return db.documents.filter((d: any) => d.published === 1);
}

export function createDocument(data: { title: string; kind: string; contentUrl: string; description?: string }) {
  const now = new Date().toISOString();
  const id = `doc_${Date.now()}`;
  db.documents.push({
    id,
    title: data.title,
    kind: data.kind,
    referenceDate: now.substring(0, 10),
    contentUrl: data.contentUrl,
    description: data.description || null,
    published: 1,
    createdAt: now,
  });
  return id;
}

// Assemblies Queries
export function listAssemblies() {
  return db.assemblies;
}

export function createAssembly(data: { title: string; scheduledAt: string; location?: string; agenda?: string }) {
  const now = new Date().toISOString();
  const id = `ass_${Date.now()}`;
  db.assemblies.push({
    id,
    title: data.title,
    scheduledAt: data.scheduledAt,
    location: data.location || null,
    agenda: data.agenda || null,
    status: "AGENDADA",
    createdAt: now,
  });
  return id;
}
