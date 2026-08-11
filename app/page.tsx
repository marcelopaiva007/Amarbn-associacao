import Link from "next/link";
import { ArrowRight, FileText, Landmark, WalletCards, UsersRound, ShieldCheck, CheckCircle2, Sprout, Radio } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { RadioCard } from "@/components/radio-card";

const items = [
  {
    icon: WalletCards,
    title: "Mensalidades & Carnês",
    text: "Transparência total no acompanhamento das contribuições, vencimentos e quitação de parcelas dos associados.",
  },
  {
    icon: FileText,
    title: "Secretaria & Documentos",
    text: "Estatuto social, atas de assembleias, editais de convocação e comunicados sempre atualizados para consulta.",
  },
  {
    icon: Sprout,
    title: "Moradores & Agricultura",
    text: "Ações comunitárias e projetos de incentivo aos moradores e produtores agrícolas da nossa região.",
  },
];

export default function Home() {
  return (
    <SiteShell>
      <main>
        {/* Hero Section with Official Brand Colors */}
        <section className="relative overflow-hidden bg-[#0d2a38] px-6 py-20 text-white md:px-12 md:py-28">
          <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#f58220]/20 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#8cc63f]/15 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.2fr_.8fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f58220]/40 bg-[#f58220]/15 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#ff9800]">
                <ShieldCheck size={14} /> AMARBN · Gestão Comunitária
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[0.98] tracking-tight md:text-6xl">
                Associação dos Moradores e Agricultores Rurais do Bairro do Nordeste
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
                União, representatividade e transparência. Acompanhe suas mensalidades, acesse documentos oficiais e participe ativamente da nossa comunidade.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f58220] px-7 py-3.5 font-bold text-white shadow-lg transition hover:bg-[#ff9800] hover:scale-[1.02]"
                >
                  Acessar portal do associado <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
                >
                  Área administrativa
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm aspect-square rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 to-transparent p-8 backdrop-blur-md shadow-2xl">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 p-6 text-center">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-tr from-[#1e65c9] to-[#3b82f6] text-white shadow-md">
                  <Landmark size={48} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#8cc63f]">Gestão 100% Transparente</p>
                  <p className="mt-2 text-sm font-bold text-white/90">Moradores e agricultores unidos por uma associação fortalecida.</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#8cc63f]">
                  <CheckCircle2 size={14} /> Estatuto e finanças em dia
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Radio Comunitária Nordeste FM 104,9 FM Section */}
        <section className="mx-auto max-w-6xl px-6 pt-16 md:px-12">
          <RadioCard />
        </section>

        {/* Services Section */}
        <section id="servicos" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
          <div className="mb-14 flex max-w-3xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.25em] text-[#1e65c9]">Recursos da Associação</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0d2a38] md:text-4xl">
                Serviços essenciais aos associados.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#586c73]">
              Informações, prestações de contas e comunicados em tempo real.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {items.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="group rounded-3xl border border-[#e2e8e4] bg-[#ffffff] p-8 shadow-sm transition hover:-translate-y-1 hover:border-[#1e65c9]/40 hover:shadow-md"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eff6ff] text-[#1e65c9] transition group-hover:bg-[#1e65c9] group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold text-[#0d2a38]">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#586c73]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Institutional Section */}
        <section id="associacao" className="border-y border-[#e2e8e4] bg-[#ffffff] px-6 py-20 md:px-12">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-xs font-black uppercase tracking-[.25em] text-[#8cc63f]">Transparência e Governança</p>
            <h2 className="mt-4 mx-auto max-w-4xl text-3xl font-black tracking-tight text-[#0d2a38] md:text-5xl">
              Decisões registradas. Direitos respeitados. Comunidade fortalecida.
            </h2>
            <p className="mt-6 mx-auto max-w-2xl text-base text-[#586c73]">
              AMARBN — Associação dos Moradores e Agricultores Rurais do Bairro do Nordeste.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contato" className="bg-[#081b24] px-6 py-12 text-white md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-extrabold text-base tracking-tight text-white">
              AMARBN — Associação dos Moradores e Agricultores Rurais do Bairro do Nordeste
            </p>
            <p className="mt-1 text-xs text-white/60">Área administrativa e portal do associado.</p>
          </div>
          <p className="text-xs text-white/40">© 2026 AMARBN. Todos os direitos reservados.</p>
        </div>
      </footer>
    </SiteShell>
  );
}
