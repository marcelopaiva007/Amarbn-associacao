"use server";

import { revalidatePath } from "next/cache";
import { createDocument, createAssembly } from "@/lib/db";

export async function createDocumentAction(prevState: any, formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const kind = formData.get("kind")?.toString().trim();
  const contentUrl = formData.get("contentUrl")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!title || !kind || !contentUrl) {
    return { error: "Título, tipo e arquivo/link são obrigatórios." };
  }

  await createDocument({ title, kind, contentUrl, description });
  revalidatePath("/admin/documentos");
  revalidatePath("/admin");
  revalidatePath("/portal");
  return { success: true };
}

export async function createAssemblyAction(prevState: any, formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const scheduledAt = formData.get("scheduledAt")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const agenda = formData.get("agenda")?.toString().trim();

  if (!title || !scheduledAt) {
    return { error: "Título e data/horário são obrigatórios." };
  }

  await createAssembly({ title, scheduledAt, location, agenda });
  revalidatePath("/admin/documentos");
  revalidatePath("/admin");
  revalidatePath("/portal");
  return { success: true };
}
