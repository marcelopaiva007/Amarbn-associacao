"use server";

import { revalidatePath } from "next/cache";
import { createMember, updateMemberStatus } from "@/lib/db";

export async function createMemberAction(prevState: any, formData: FormData) {
  const fullName = formData.get("fullName")?.toString().trim();
  const cpf = formData.get("cpf")?.toString().trim();
  const registration = formData.get("registration")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const address = formData.get("address")?.toString().trim();
  const birthDate = formData.get("birthDate")?.toString();

  if (!fullName || !cpf || !registration) {
    return { error: "Nome completo, CPF e Matrícula são obrigatórios." };
  }

  try {
    createMember({ fullName, cpf, registration, email, phone, address, birthDate });
    revalidatePath("/admin/associados");
    return { success: true };
  } catch (err: any) {
    if (err.message?.includes("UNIQUE")) {
      return { error: "CPF ou Matrícula já cadastrados." };
    }
    return { error: "Erro ao cadastrar associado." };
  }
}

export async function toggleMemberStatusAction(memberId: string, currentStatus: string) {
  const newStatus = currentStatus === "ATIVO" ? "INATIVO" : "ATIVO";
  updateMemberStatus(memberId, newStatus);
  revalidatePath("/admin/associados");
}
