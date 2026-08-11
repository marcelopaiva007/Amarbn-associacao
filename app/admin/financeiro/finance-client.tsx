"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleDollarSign, FilePlus2, ReceiptText, CheckCircle2, X } from "lucide-react";
import { money } from "@/lib/utils";
import { generatePaymentsAction, markPaymentPaidAction } from "./actions";

export function FinanceClient({
  initialPayments,
  summary,
  initialStatus,
}: {
  initialPayments: any[];
  summary: { pendingAmount: number; paidAmount: number; overdueAmount: number };
  initialStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [payModalItem, setPayModalItem] = useState<any>(null);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [formError, setFormError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleFilterChange = (st: string) => {
    setStatusFilter(st);
    startTransition(() => {
      const params = new URLSearchParams();
      if (st !== "TODOS") params.set("status", st);
      router.push(`/admin/financeiro?${params.toString()}`);
    });
  };

  const handleGenerateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setInfoMessage("");
    const formData = new FormData(e.currentTarget);

    const res = await generatePaymentsAction(null, formData);
    if (res?.error) {
      setFormError(res.error);
    } else {
      setShowGenerateModal(false);
      setInfoMessage(`${res.count} parcelas geradas com sucesso!`);
      router.refresh();
    }
  };

  const handleMarkPaidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalItem) return;
    await markPaymentPaidAction(payModalItem.id, receiptNumber);
    setPayModalItem(null);
    setReceiptNumber("");
    router.refresh();
  };

  return (
    <main className="p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#3c8876]">Controle interno</p>
          <h1 className="mt-2 text-3xl font-black">Financeiro e carnês</h1>
          <p className="mt-2 text-[#52656a]">Registre parcelas, vencimentos e baixas de pagamento.</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#164b50] px-5 py-3 text-sm font-bold text-white hover:bg-[#102a32]"
        >
          <FilePlus2 size={17} /> Gerar parcelas
        </button>
      </div>

      {infoMessage && (
        <div className="mt-6 rounded-lg bg-emerald-100 p-3 text-xs font-bold text-emerald-800">
          {infoMessage}
        </div>
      )}

      {/* Metric Cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["A receber", money.format(summary.pendingAmount), "Parcelas em aberto"],
          ["Recebido", money.format(summary.paidAmount), "Total baixado"],
          ["Em atraso", money.format(summary.overdueAmount), "Parcelas vencidas"],
        ].map(([label, value, detail]) => (
          <section key={label} className="rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-6">
            <CircleDollarSign className="text-[#3c8876]" size={24} />
            <p className="mt-6 text-sm text-[#52656a]">{label}</p>
            <p className="mt-1 text-3xl font-black text-[#102a32]">{value}</p>
            <p className="mt-2 text-xs text-[#52656a]">{detail}</p>
          </section>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex rounded-lg border border-[#dce4de] bg-[#fffdf8] p-1 text-xs font-bold">
          {["TODOS", "PENDENTE", "PAGO", "ATRASADO"].map((st) => (
            <button
              key={st}
              onClick={() => handleFilterChange(st)}
              className={`rounded-md px-3 py-1.5 transition ${
                statusFilter === st ? "bg-[#164b50] text-white" : "text-[#52656a] hover:text-[#164b50]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#dce4de] bg-[#fffdf8]">
        {initialPayments.length === 0 ? (
          <section className="p-10 text-center">
            <ReceiptText className="mx-auto text-[#3c8876]" size={36} />
            <p className="mt-4 font-bold">Nenhuma parcela registrada.</p>
            <p className="mt-2 text-sm text-[#52656a]">
              Clique em “Gerar parcelas” para emitir as mensalidades para os associados ativos.
            </p>
          </section>
        ) : (
          <div className="divide-y divide-[#dce4de]">
            {initialPayments.map((pay) => (
              <div key={pay.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-base text-[#102a32]">{pay.memberName}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        pay.status === "PAGO"
                          ? "bg-emerald-100 text-emerald-800"
                          : pay.status === "PENDENTE"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {pay.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-[#52656a]">
                    <span>Matrícula: <strong>{pay.memberRegistration}</strong></span>
                    <span>Referência: <strong>{pay.reference}</strong></span>
                    <span>Vencimento: <strong>{pay.dueDate}</strong></span>
                    {pay.receiptNumber && <span>Recibo: <strong>{pay.receiptNumber}</strong></span>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-xl font-black text-[#164b50]">{money.format(pay.amount)}</p>
                  {pay.status !== "PAGO" && (
                    <button
                      onClick={() => setPayModalItem(pay)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                    >
                      <CheckCircle2 size={14} /> Dar baixa
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Gerar Parcelas */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#fffdf8] p-6 shadow-xl border border-[#dce4de]">
            <div className="flex items-center justify-between border-b border-[#dce4de] pb-4">
              <h2 className="text-lg font-black text-[#102a32]">Gerar Parcelas do Carnê</h2>
              <button onClick={() => setShowGenerateModal(false)} className="text-[#52656a]">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-xs font-bold text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleGenerateSubmit} className="mt-4 grid gap-4 text-sm">
              <label className="block font-bold">
                Mês de Referência (AAAA-MM) *
                <input
                  name="reference"
                  defaultValue="2026-09"
                  required
                  placeholder="2026-09"
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <label className="block font-bold">
                Data de Vencimento *
                <input
                  type="date"
                  name="dueDate"
                  defaultValue="2026-09-10"
                  required
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <label className="block font-bold">
                Valor da Mensalidade (R$) *
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  defaultValue="45.00"
                  required
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="rounded-full border border-[#dce4de] px-4 py-2 text-xs font-bold text-[#52656a]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#164b50] px-5 py-2 text-xs font-bold text-white hover:bg-[#102a32]"
                >
                  Gerar para Todos Ativos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Baixa */}
      {payModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#fffdf8] p-6 shadow-xl border border-[#dce4de]">
            <div className="flex items-center justify-between border-b border-[#dce4de] pb-4">
              <h2 className="text-lg font-black text-[#102a32]">Dar Baixa de Pagamento</h2>
              <button onClick={() => setPayModalItem(null)} className="text-[#52656a]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMarkPaidSubmit} className="mt-4 grid gap-4 text-sm">
              <p className="text-[#52656a]">
                Confirmar recebimento da parcela de <strong>{payModalItem.memberName}</strong> referente a{" "}
                <strong>{payModalItem.reference}</strong> no valor de{" "}
                <strong className="text-[#164b50]">{money.format(payModalItem.amount)}</strong>?
              </p>

              <label className="block font-bold">
                Número do Recibo / Comprovante (opcional)
                <input
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder={`REC-${Date.now().toString().substring(6)}`}
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPayModalItem(null)}
                  className="rounded-full border border-[#dce4de] px-4 py-2 text-xs font-bold text-[#52656a]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-emerald-700 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  Confirmar Baixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
