"use client";

import { useState } from "react";
import { Radio, Play, Pause, Volume2, Signal } from "lucide-react";

export function RadioCard() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="radio" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#081b24] via-[#0d2a38] to-[#164b50] p-8 text-white shadow-2xl md:p-12">
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#f58220]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-[#1e65c9]/25 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.2fr_.8fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f58220]/40 bg-[#f58220]/15 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#ff9800]">
            <Radio size={14} className="animate-pulse" /> RADCOM · 104,9 FM
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-white md:text-5xl">
            Rádio Nordeste FM <span className="block text-2xl font-bold text-[#f58220] md:text-3xl">104,9 FM · Sua rádio cidadã</span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-white/80">
            A rádio comunitária oficial da AMARBN. Informação, cultura local, utilidade pública e a voz ativa dos moradores e agricultores rurais do Bairro do Nordeste.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold text-white/70">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Signal size={14} className="text-[#8cc63f]" /> Frequência Comunitária 104,9 MHz
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <Radio size={14} className="text-[#f58220]" /> Transmissão 24 horas
            </span>
          </div>
        </div>

        {/* Radio Live Player Card */}
        <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 to-black/30 p-6 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-tr from-[#f58220] to-[#ff9800] text-white shadow-md">
                <Radio size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#8cc63f]">Ao Vivo</p>
                <p className="text-sm font-extrabold text-white">Nordeste FM 104,9</p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-red-600/80 px-2.5 py-1 text-[10px] font-black uppercase text-white animate-pulse">
              ● NO AR
            </span>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">Slogan</p>
            <p className="mt-1 text-lg font-black tracking-tight text-[#f58220]">"Sua rádio cidadã"</p>
          </div>

          {/* Equalizer animation mockup */}
          <div className="mt-6 flex items-center justify-center gap-1.5 h-10">
            {[40, 75, 55, 90, 60, 80, 45, 70, 85, 50, 65].map((h, i) => (
              <div
                key={i}
                style={{ height: isPlaying ? `${h}%` : "20%" }}
                className={`w-1.5 rounded-full bg-[#8cc63f] transition-all duration-300 ${isPlaying ? "animate-bounce" : "opacity-40"}`}
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#f58220] py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#ff9800] hover:scale-[1.02]"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? "Pausar Rádio" : "Ouvir Ao Vivo"}
            </button>
            <div className="flex items-center gap-2 text-white/60">
              <Volume2 size={18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
