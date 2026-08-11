import Link from "next/link";
import { Brand } from "./brand";
import { SYSTEM_VERSION } from "@/lib/version";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#e2e8e4] bg-[#f7f5ef]/90 px-6 py-4 backdrop-blur-md transition-all">
        <div className="flex items-center gap-3">
          <Brand />
          <span className="rounded-full bg-[#164b50]/10 border border-[#164b50]/30 px-2.5 py-0.5 text-[10px] font-black text-[#164b50]">
            v{SYSTEM_VERSION}
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-[#586c73] md:flex">
          <Link href="/centry-bess" className="font-extrabold text-[#164b50] transition hover:text-[#0d363a]">Apresentação BESS</Link>
          <Link href="/#associacao" className="transition hover:text-[#0d363a]">A Associação</Link>
          <Link href="/#radio" className="transition hover:text-[#0d363a]">Rádio 104,9 FM</Link>
          <Link href="/#servicos" className="transition hover:text-[#0d363a]">Serviços</Link>
          <Link href="/#contato" className="transition hover:text-[#0d363a]">Contato</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-[#0d363a] px-5 py-2 text-xs font-bold text-[#0d363a] transition hover:bg-[#0d363a] hover:text-white"
          >
            Entrar
          </Link>
          <Link
            href="/portal"
            className="rounded-full bg-[#0d363a] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#185e56] hover:shadow"
          >
            Portal do Associado
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
