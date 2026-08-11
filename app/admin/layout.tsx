import Link from "next/link";
import { Brand } from "@/components/brand";
import { FileText, LayoutDashboard, Users, WalletCards, Tag } from "lucide-react";
import { SYSTEM_VERSION } from "@/lib/version";

const links = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/associados", label: "Associados", icon: Users },
  { href: "/admin/financeiro", label: "Financeiro", icon: WalletCards },
  { href: "/admin/documentos", label: "Secretaria", icon: FileText },
  { href: "/admin/versao", label: "Versão do sistema", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f2e9]">
      <aside className="fixed inset-y-0 hidden w-64 border-r border-white/10 bg-[#102a32] p-6 text-white md:block">
        <Brand light />
        <p className="mt-12 text-[10px] font-bold uppercase tracking-[.2em] text-white/45">Gestão AMARBN</p>
        <nav className="mt-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white">
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 left-6 right-6 border-t border-white/10 pt-4 text-xs text-white/50">
          <p className="font-bold text-white/70">AMARBN System</p>
          <p className="mt-0.5 text-[11px] font-mono">v{SYSTEM_VERSION}</p>
        </div>
      </aside>
      <div className="md:ml-64">
        <header className="flex h-18 items-center justify-between border-b border-[#dce4de] bg-[#fffdf8] px-6 py-4">
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold">Administração</p>
            <span className="rounded-full bg-[#164b50]/10 border border-[#164b50]/30 px-2.5 py-0.5 text-[10px] font-black text-[#164b50]">
              v{SYSTEM_VERSION}
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6ad3a] text-sm font-black text-[#102a32]">AD</div>
        </header>
        {children}
      </div>
    </div>
  );
}
