"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { SYSTEM_VERSION } from "@/lib/version";
import { loginAction } from "./actions";

export default function Login() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main className="grid min-h-screen bg-[#f5f2e9] lg:grid-cols-2">
      <section className="hidden bg-[#164b50] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <Brand light />
          <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-[10px] font-black text-white">
            v{SYSTEM_VERSION}
          </span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.25em] text-[#e6ad3a]">Área restrita</p>
          <h1 className="mt-4 max-w-md text-5xl font-black leading-none">A gestão que sua associação merece.</h1>
          <p className="mt-6 max-w-md text-white/70">Acesse o sistema para cuidar das pessoas, das contribuições e da história da AMARBN.</p>
        </div>
        <p className="text-xs text-white/50">AMARBN · Gestão associativa · v{SYSTEM_VERSION}</p>
      </section>

      <section className="flex items-center justify-center p-6">
        <form action={formAction} className="w-full max-w-sm rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-7 shadow-sm">
          <div className="flex items-center justify-between lg:hidden">
            <Brand />
            <span className="rounded-full bg-[#164b50]/10 border border-[#164b50]/30 px-2 py-0.5 text-[9px] font-black text-[#164b50]">
              v{SYSTEM_VERSION}
            </span>
          </div>
          <h2 className="mt-8 text-2xl font-black">Entrar no sistema</h2>
          <p className="mt-2 text-sm text-[#52656a]">Use seu e-mail e senha cadastrados.</p>

          {state?.error && (
            <div className="mt-4 rounded-lg bg-red-100 p-3 text-xs font-bold text-red-700">
              {state.error}
            </div>
          )}

          <label className="mt-7 block text-sm font-bold">
            E-mail
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className="mt-2 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-3 outline-none focus:border-[#3c8876]"
              placeholder="admin@amarbn.org.br ou associado@amarbn.org.br"
            />
          </label>

          <label className="mt-5 block text-sm font-bold">
            Senha
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-3 outline-none focus:border-[#3c8876]"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="mt-7 w-full rounded-full bg-[#164b50] px-4 py-3 font-bold text-white hover:bg-[#102a32] disabled:opacity-50"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>

          <div className="mt-6 rounded-lg bg-[#f0f4f2] p-3 text-xs text-[#52656a]">
            <p className="font-bold text-[#164b50]">Credenciais de teste:</p>
            <p className="mt-1">Admin: <code className="font-mono">admin@amarbn.org.br</code> / <code className="font-mono">admin123</code></p>
            <p className="mt-1">Associado: <code className="font-mono">associado@amarbn.org.br</code> / <code className="font-mono">associado123</code></p>
          </div>

          <Link href="/" className="mt-5 block text-center text-sm font-bold text-[#3c8876]">
            Voltar para o site
          </Link>
        </form>
      </section>
    </main>
  );
}
