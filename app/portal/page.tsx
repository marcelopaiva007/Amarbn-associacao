import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, CreditCard, FileText, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { Brand } from "@/components/brand";
import { AssociateCard } from "@/components/associate-card";
import { money } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { findMemberByUserId, getPaymentsByMemberId, listDocuments, listAssemblies } from "@/lib/db";
import { logoutAction } from "@/app/login/actions";
import { SYSTEM_VERSION } from "@/lib/version";

export const dynamic = "force-dynamic";

export default async function Portal() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  let member = null;
  if (session.memberId) {
    member = await findMemberByUserId(session.userId);
  }

  const associate = {
    name: member?.fullName || session.name || "Associado AMARBN",
    registration: member?.registration || "AMR-2026-0001",
    status: member?.status || "ATIVO",
    photoUrl: member?.photoUrl || null,
  };

  const [payments, documents, assemblies] = await Promise.all([
    member ? getPaymentsByMemberId(member.id) : Promise.resolve([]),
    listDocuments(),
    listAssemblies(),
  ]);
  const pendingPayments = payments.filter((p: any) => p.status === "PENDENTE" || p.status === "ATRASADO");
  const nextPayment = pendingPayments[0];

  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <header className="flex items-center justify-between border-b border-[#dce4de] bg-[#fffdf8] px-6 py-4">
        <div className="flex items-center gap-3">
          <Brand />
          <span className="rounded-full bg-[#164b50]/10 border border-[#164b50]/30 px-2.5 py-0.5 text-[10px] font-black text-[#164b50]">
            v{SYSTEM_VERSION}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden text-sm text-[#52656a] sm:block">
            Olá, <strong>{associate.name.split(" ")[0]}</strong>
          </p>
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-1.5 text-xs font-bold text-[#52656a] hover:text-red-700">
              <LogOut size={18} /> <span className="hidden sm:inline">Sair</span>
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[360px_1fr]">
        <AssociateCard {...associate} />

        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#3c8876]">Portal do associado</p>
          <h1 className="mt-2 text-3xl font-black text-[#102a32]">Sua associação, no seu ritmo.</h1>

          {/* Next payment card */}
          <section className="mt-7 rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-6 shadow-sm">
            {nextPayment ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#52656a]">
                    Próxima parcela do carnê ({nextPayment.reference})
                  </p>
                  <p className="mt-1 text-3xl font-black text-[#164b50]">{money.format(nextPayment.amount)}</p>
                  <p className="mt-2 text-xs font-bold text-[#9a5b20]">
                    Vence em {nextPayment.dueDate}
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                  <p className="font-bold flex items-center gap-1">
                    <AlertCircle size={14} /> Pagamento em aberto
                  </p>
                  <p className="mt-1 text-[11px]">Realize a quitação junto à tesouraria da AMARBN.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-emerald-800">
                <CheckCircle2 size={24} />
                <div>
                  <p className="font-bold text-sm">Todas as mensalidades em dia!</p>
                  <p className="text-xs text-[#52656a]">Nenhuma parcela pendente de quitação no momento.</p>
                </div>
              </div>
            )}
          </section>

          {/* Carnê historico */}
          <section className="mt-6 rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-6">
            <h2 className="flex items-center gap-2 text-lg font-black text-[#102a32]">
              <CreditCard className="text-[#3c8876]" size={20} /> Histórico do Carnê
            </h2>
            <div className="mt-4 divide-y divide-[#dce4de]">
              {payments.length === 0 ? (
                <p className="py-4 text-xs text-[#52656a]">Nenhuma parcela registrada no seu histórico.</p>
              ) : (
                payments.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-bold text-[#102a32]">Parcela {p.reference}</p>
                      <p className="text-xs text-[#52656a]">Vencimento: {p.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#164b50]">{money.format(p.amount)}</p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                          p.status === "PAGO"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Documentos & Assembleias */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <section className="rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-6">
              <h2 className="flex items-center gap-2 text-base font-black text-[#102a32]">
                <FileText className="text-[#3c8876]" size={18} /> Documentos
              </h2>
              <div className="mt-3 space-y-2">
                {documents.slice(0, 3).map((d: any) => (
                  <a
                    key={d.id}
                    href={d.contentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg border border-[#dce4de] p-3 transition hover:border-[#3c8876]"
                  >
                    <p className="font-bold text-xs text-[#102a32]">{d.title}</p>
                    <p className="mt-0.5 text-[10px] text-[#52656a]">{d.kind}</p>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-6">
              <h2 className="flex items-center gap-2 text-base font-black text-[#102a32]">
                <CalendarDays className="text-[#3c8876]" size={18} /> Assembleias
              </h2>
              <div className="mt-3 space-y-2">
                {assemblies.slice(0, 3).map((a: any) => (
                  <div key={a.id} className="rounded-lg border border-[#dce4de] p-3">
                    <p className="font-bold text-xs text-[#102a32]">{a.title}</p>
                    <p className="mt-0.5 text-[10px] text-[#3c8876] font-bold">{a.scheduledAt}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
