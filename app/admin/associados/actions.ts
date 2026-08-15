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
    const { temporaryPassword } = await createMember({
      fullName,
      cpf,
      registration,
      email,
      phone,
      address,
      birthDate,
    });
    revalidatePath("/admin/associados");
    // A senha provisória só existe nesta resposta: é exibida uma vez para a
    // secretaria entregar ao associado e não fica gravada em lugar nenhum.
    return { success: true, email, temporaryPassword };
  } catch (err: any) {
    if (err.code === "P2002") {
      const field = Array.isArray(err.meta?.target) ? err.meta.target.join(", ") : "";
      if (field.includes("email")) {
        return { error: "Este e-mail já está em uso por outro cadastro." };
      }
      return { error: "CPF ou Matrícula já cadastrados." };
    }
    console.error("Erro ao cadastrar associado:", err);
    return { error: "Erro ao cadastrar associado." };
  }
}

export async function toggleMemberStatusAction(memberId: string, currentStatus: string) {
  const newStatus = currentStatus === "ATIVO" ? "INATIVO" : "ATIVO";
  await updateMemberStatus(memberId, newStatus);
  revalidatePath("/admin/associados");
}
