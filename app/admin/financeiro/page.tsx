import { listPayments, getFinancialSummary } from "@/lib/db";
import { FinanceClient } from "./finance-client";

export const dynamic = "force-dynamic";

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || "TODOS";
  const [payments, summary] = await Promise.all([listPayments(status), getFinancialSummary()]);

  return <FinanceClient initialPayments={payments} summary={summary} initialStatus={status} />;
}
