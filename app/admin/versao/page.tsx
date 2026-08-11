import { CheckCircle2, GitBranch, History, ShieldCheck, Tag } from "lucide-react";
import { SYSTEM_VERSION, BUILD_DATE, RELEASE_NOTES } from "@/lib/version";

export const dynamic = "force-dynamic";

export default function VersionPage() {
  return (
    <main className="p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#3c8876]">Informações do Sistema</p>
          <h1 className="mt-2 text-3xl font-black text-[#102a32]">Versão & Atualizações</h1>
          <p className="mt-2 text-[#52656a]">Registro oficial de compilações, versões e atualizações implantadas.</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#164b50] bg-[#164b50]/10 px-5 py-2.5 text-sm font-black text-[#164b50]">
          <Tag size={16} /> Versão Atual: {SYSTEM_VERSION}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <section className="rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-6 shadow-sm">
          <Tag className="text-[#3c8876]" size={26} />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#52656a]">Versão do Sistema</p>
          <p className="mt-1 text-3xl font-black text-[#102a32]">v{SYSTEM_VERSION}</p>
          <p className="mt-2 text-xs text-[#52656a]">Compilação de Produção</p>
        </section>

        <section className="rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-6 shadow-sm">
          <GitBranch className="text-[#3c8876]" size={26} />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#52656a]">Último Deploy</p>
          <p className="mt-1 text-2xl font-black text-[#102a32]">{BUILD_DATE}</p>
          <p className="mt-2 text-xs text-[#52656a]">Implantado via Vercel Cloud</p>
        </section>

        <section className="rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-6 shadow-sm">
          <ShieldCheck className="text-[#3c8876]" size={26} />
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#52656a]">Status do Ambiente</p>
          <p className="mt-1 text-2xl font-black text-emerald-700">100% Operacional</p>
          <p className="mt-2 text-xs text-[#52656a]">Todos os módulos ativos</p>
        </section>
      </div>

      <section className="mt-10 rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-7 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-black text-[#102a32]">
          <History className="text-[#3c8876]" size={22} /> Histórico de Versões & Notas de Lançamento
        </h2>
        <div className="mt-6 divide-y divide-[#dce4de]">
          {RELEASE_NOTES.map((rel) => (
            <div key={rel.version} className="py-6 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#164b50] px-3 py-1 text-xs font-black text-white">
                  {rel.version}
                </span>
                <span className="text-xs font-bold text-[#52656a]">{rel.date}</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-[#102a32]">
                {rel.changes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#52656a]">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#3c8876]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
