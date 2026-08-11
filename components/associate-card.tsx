import { QrCode, ShieldCheck, User } from "lucide-react";
import { initials } from "@/lib/utils";

type Props = {
  name: string;
  registration: string;
  photoUrl?: string | null;
  validUntil?: string;
  status?: string;
};

export function AssociateCard({
  name,
  registration,
  photoUrl,
  validUntil = "31/12/2026",
  status = "ATIVO",
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d2a38] via-[#164b50] to-[#081b24] p-7 text-white shadow-2xl transition hover:scale-[1.01]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#f58220]/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#8cc63f]/20 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.25em] text-[#f58220]">Carteira Digital</p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-white">AMARBN</h2>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#8cc63f]/40 bg-[#8cc63f]/20 px-3 py-1 text-[10px] font-bold text-[#8cc63f] backdrop-blur-sm">
          <ShieldCheck size={12} /> {status}
        </span>
      </div>

      <div className="relative mt-8 flex items-center gap-4">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-16 w-16 shrink-0 rounded-2xl border-2 border-[#f58220] object-cover shadow-lg"
          />
        ) : (
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-[#1e65c9] to-[#3b82f6] text-xl font-black text-white shadow-lg">
            {initials(name)}
          </div>
        )}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Associado(a)</p>
          <p className="text-base font-extrabold text-white">{name}</p>
          <p className="mt-0.5 text-xs text-white/70">
            Matrícula <strong className="font-mono text-white">{registration}</strong>
          </p>
        </div>
      </div>

      <div className="relative mt-8 flex items-end justify-between border-t border-white/15 pt-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Validade</p>
          <p className="mt-0.5 text-xs font-bold text-[#f58220]">{validUntil}</p>
        </div>
        <div className="rounded-xl bg-white/10 p-2 backdrop-blur-sm border border-white/20">
          <QrCode className="text-[#f58220]" size={32} />
        </div>
      </div>
    </section>
  );
}
