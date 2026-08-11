"use server";

import { revalidatePath } from "next/cache";
import { generateMonthlyPayments, markPaymentAsPaid } from "@/lib/db";

export async function generatePaymentsAction(prevState: any, formData: FormData) {
  const reference = formData.get("reference")?.toString().trim();
  const dueDate = formData.get("dueDate")?.toString().trim();
  const amountStr = formData.get("amount")?.toString();

  if (!reference || !dueDate || !amountStr) {
    return { error: "Informe a referência, data de vencimento e o valor." };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    return { error: "Valor inválido." };
  }

  const count = generateMonthlyPayments(reference, dueDate, amount);
  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
  revalidatePath("/portal");
  return { success: true, count };
}

export async function markPaymentPaidAction(paymentId: string, receiptNumber?: string) {
  markPaymentAsPaid(paymentId, receiptNumber);
  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
  revalidatePath("/portal");
}
