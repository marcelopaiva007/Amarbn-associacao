"use client";

import React, { useState } from "react";
import {
  Zap,
  BatteryCharging,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Flame,
  Gauge,
  Sliders,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Volume2,
  VolumeX,
  Leaf,
  Activity,
  Layers,
  Sparkles,
  Download,
  Send,
  Building2,
  SunMedium,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

export default function CentryBessPresentation() {
  const [activeTab, setActiveTab] = useState<
    "resumo" | "funcionalidade" | "comparativo" | "financeiro" | "equipamento"
  >("resumo");

  // Calculator State
  const [peakPowerKw, setPeakPowerKw] = useState(500);
  const [hoursPeakPerDay, setHoursPeakPerDay] = useState(3);
  const [tariffDiffRskwh, setTariffDiffRskwh] = useState(1.45);
  const [dieselPriceRl, setDieselPriceRl] = useState(6.20);
  const [outagesPerYear, setOutagesPerYear] = useState(12);

  // Financial Calculations
  const dailySavingsArbitrage = peakPowerKw * hoursPeakPerDay * tariffDiffRskwh;
  const monthlySavingsArbitrage = dailySavingsArbitrage * 22; // working days
  const annualSavingsArbitrage = monthlySavingsArbitrage * 12;

  const dieselConsumptionLitersPerHour = peakPowerKw * 0.25; // approx 0.25L/kWh
  const outageCostPerYear =
    outagesPerYear * (dieselConsumptionLitersPerHour * 2 * dieselPriceRl + 1500); // maintenance/fuel

  const totalAnnualSavings = annualSavingsArbitrage + outageCostPerYear;
  const estimatedCapexBess = peakPowerKw * 2200; // R$ 2200 per kW capacity estimate
  const estimatedCapexGen = peakPowerKw * 750;
  const netCapexDiff = estimatedCapexBess - estimatedCapexGen;
  const paybackYears = (netCapexDiff / totalAnnualSavings).toFixed(1);
  const tenYearROI = (
    ((totalAnnualSavings * 10 - estimatedCapexBess) / estimatedCapexBess) *
    100
  ).toFixed(0);

  return (
    <div className="min-h-screen bg-[#070D14] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {/* Top Header / Branding */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070D14]/90 backdrop-blur-xl px-4 lg:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 font-black text-black shadow-lg shadow-emerald-500/20">
              <Zap className="h-6 w-6 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-white">CENTRY</span>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-400 border border-emerald-500/20">
                  ENERGIA & TECNOLOGIA
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Soluções Corporativas em Armazenamento BESS</p>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 p-1.5 backdrop-blur-md">
            {[
              { id: "resumo", label: "Resumo" },
              { id: "funcionalidade", label: "Como Funciona" },
              { id: "comparativo", label: "BESS vs Gerador" },
              { id: "financeiro", label: "Estudo Financeiro" },
              { id: "equipamento", label: "Equipamentos" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-md shadow-emerald-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("financeiro")}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 transition hover:bg-emerald-500/20"
            >
              <Sliders className="h-3.5 w-3.5" />
              Simular ROI
            </button>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-extrabold text-black shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 hover:scale-[1.02]"
            >
              <Send className="h-3.5 w-3.5" /> Solicitar Proposta
            </a>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-[#0B1522] via-[#070D14] to-[#070D14] px-6 py-16 lg:py-24">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 right-10 h-80 w-80 rounded-full bg-teal-500/10 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-extrabold text-emerald-400 shadow-inner">
            <Sparkles className="h-3.5 w-3.5" /> Apresentação Executiva 2026
          </div>

          <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
                Armazenamento de Energia Inteligente{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  BESS CENTRY
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-300 max-w-2xl font-normal">
                Substitua ou complemente geradores a diesel com sistemas de armazenamento em baterias LFP de alta performance. Reduza custos na ponta (Peak Shaving), garanta backup instantâneo (&lt;10ms) e monetize sua infraestrutura de energia.
              </p>

              {/* Key Quick Badges */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur">
                  <p className="text-xs font-semibold text-slate-400">Tempo de Resposta</p>
                  <p className="mt-1 text-2xl font-black text-emerald-400">&lt; 10 ms</p>
                  <p className="text-[10px] text-slate-500">Sem interrupção (UPS)</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur">
                  <p className="text-xs font-semibold text-slate-400">Vida Útil</p>
                  <p className="mt-1 text-2xl font-black text-cyan-400">15+ Anos</p>
                  <p className="text-[10px] text-slate-500">6.000+ ciclos a 80% DoD</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur">
                  <p className="text-xs font-semibold text-slate-400">Emissão CO₂</p>
                  <p className="mt-1 text-2xl font-black text-teal-400">0 kg/h</p>
                  <p className="text-[10px] text-slate-500">Operação 100% limpa</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur">
                  <p className="text-xs font-semibold text-slate-400">Redução de OPEX</p>
                  <p className="mt-1 text-2xl font-black text-amber-400">Até 65%</p>
                  <p className="text-[10px] text-slate-500">Economia na Tarifa Ponta</p>
                </div>
              </div>
            </div>

            {/* Visual BESS Container Mock */}
            <div className="lg:col-span-5 relative">
              <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                      CENTRY BESS-1000kW / 2000kWh
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    SISTEMA ATIVO
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Energy Flow Animation representation */}
                  <div className="rounded-xl border border-slate-800 bg-[#0A131F] p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4 text-emerald-400" /> Modos de Operação Simultânea
                      </span>
                      <span className="text-emerald-400">100% Automação</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
                        <span className="text-slate-300">Peak Shaving (Corte de Demanda)</span>
                        <span className="font-mono font-bold text-emerald-400">ATIVO (-450 kW)</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
                        <span className="text-slate-300">Arbitragem de Tarifa (Fora-Ponta → Ponta)</span>
                        <span className="font-mono font-bold text-cyan-400">PROGRAMADO</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
                        <span className="text-slate-300">Backup Nobreak Crítico (UPS Mode)</span>
                        <span className="font-mono font-bold text-teal-400">STANDBY (&lt;8ms)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <p className="text-slate-400">Química de Célula</p>
                      <p className="font-bold text-white mt-0.5">LiFePO4 (LFP Tier-1)</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                      <p className="text-slate-400">Refrigeração</p>
                      <p className="font-bold text-white mt-0.5">Líquida Inteligente IP65</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area / Interactive Sections */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Section 1: RESUMO EXEC (Executive Summary) */}
        {activeTab === "resumo" && (
          <div className="space-y-12 animate-fadeIn">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h2 className="text-3xl font-extrabold text-white">1. Resumo Executivo</h2>
              <p className="mt-1 text-slate-400">
                A revolução no gerenciamento de energia industrial e comercial pela CENTRY.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl hover:border-emerald-500/40 transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">Economia Financeira Direta</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Redução drástica do custo de energia utilizando baterias para suprir a demanda nos horários de pico (Tarifa de Ponta), onde a eletricidade da concessionária custa até 5x mais.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl hover:border-teal-500/40 transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">Segurança & Continuidade</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Substituição instantânea em quedas de rede sem o tempo de acionamento do gerador diesel (10 a 15 segundos). Zero perda de dados ou parada de linha de produção.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl hover:border-cyan-500/40 transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">Descarbonização & ESG</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Zero emissões diretas de fumaça, fuligem ou compostos de carbono. Operação silenciosa permitindo instalação urbana e alinhamento com metas ESG da empresa.
                </p>
              </div>
            </div>

            {/* Applications Grid */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Aplicações Principais dos Sistemas CENTRY BESS</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <Building2 className="h-8 w-8 text-emerald-400 mb-3" />
                  <h4 className="font-bold text-white">Indústrias & Fábricas</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Evita multas por ultrapassagem de demanda contratada e garante estabilidade para maquinário sensível.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <SunMedium className="h-8 w-8 text-amber-400 mb-3" />
                  <h4 className="font-bold text-white">Usinas Fotovoltaicas</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Armazena o excedente de geração solar durante o dia para injetar na rede nos horários mais rentáveis.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <BatteryCharging className="h-8 w-8 text-cyan-400 mb-3" />
                  <h4 className="font-bold text-white">Data Centers & Hospitais</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Função UPS de resposta ultra-rápida (&lt;10ms) que protege servidores e equipamentos médicos críticos.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <Zap className="h-8 w-8 text-teal-400 mb-3" />
                  <h4 className="font-bold text-white">Eletropostos (EV Fast Charge)</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Fornece picos de alta potência para recarga ultra-rápida sem necessitar de extensão onerosa da rede elétrica.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: COMO FUNCIONA (Architecture & Workflows) */}
        {activeTab === "funcionalidade" && (
          <div className="space-y-12 animate-fadeIn">
            <div className="border-l-4 border-teal-500 pl-4">
              <h2 className="text-3xl font-extrabold text-white">2. Como Funciona o BESS</h2>
              <p className="mt-1 text-slate-400">
                Arquitetura eletromecânica integrando hardware LFP, inversores bidirecionais e inteligência artificial.
              </p>
            </div>

            {/* Interactive Architecture Flowchart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h3 className="text-xl font-bold text-white mb-6">Fluxo de Integrado de Energia</h3>
              <div className="grid gap-4 md:grid-cols-5 items-center text-center">
                {/* Step 1 */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 relative">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-white">Fontes de Entrada</h4>
                  <p className="mt-1 text-[11px] text-slate-400">Rede Concessionária / Usina Solar / Eólica</p>
                </div>

                <div className="hidden md:flex justify-center text-slate-600">
                  <ChevronRight className="h-6 w-6 text-emerald-400" />
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 relative shadow-lg shadow-emerald-500/10">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 font-bold mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-white">CENTRY PCS Inverter</h4>
                  <p className="mt-1 text-[11px] text-slate-400">Conversão Bidirecional AC/DC alta eficiência (&gt;98.5%)</p>
                </div>

                <div className="hidden md:flex justify-center text-slate-600">
                  <ChevronRight className="h-6 w-6 text-emerald-400" />
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 relative">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-white">Módulos de Células LFP</h4>
                  <p className="mt-1 text-[11px] text-slate-400">Armazenamento seguro LiFePO4 com BMS inteligente</p>
                </div>
              </div>

              {/* Core Control Layer */}
              <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/80 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">CENTRY EMS & Cloud Artificial Intelligence</h4>
                    <p className="text-xs text-slate-400">
                      Algoritmo preditivo analisa tarifa de energia, previsão de carga e clima para despachar energia no segundo exato de maior rentabilidade.
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="rounded-lg bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-400 border border-purple-500/30">
                    Telemetria IoT em Tempo Real
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Operating Modes Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">1. Peak Shaving (Corte de Demanda)</h3>
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  O sistema injeta energia armazenada quando a demanda do consumidor atinge os limites contratados, evitando cobranças de ultrapassagem tarifária extremamente elevadas.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-cyan-500/10 p-2.5 text-cyan-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">2. Arbitragem de Tarifa</h3>
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Carrega as baterias no horário Fora-Ponta (tarifa barata) e descarrega no horário de Ponta (tarifa cara), gerando lucro imediato pela diferença tarifária diária.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">3. Nobreak & Backup Instantâneo</h3>
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Em caso de apagão na rede elétrica, o CENTRY BESS assume as cargas críticas em menos de 10 milissegundos, sem que microcomputadores ou motores sintam qualquer variação.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-teal-500/10 p-2.5 text-teal-400">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">4. Suporte a Redes Frágeis & Solar</h3>
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Suaviza a intermitência da geração solar/eólica e corrige fator de potência e tensão em locais com rede elétrica instável no interior.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: BESS VS GERADOR DIESEL */}
        {activeTab === "comparativo" && (
          <div className="space-y-12 animate-fadeIn">
            <div className="border-l-4 border-amber-500 pl-4">
              <h2 className="text-3xl font-extrabold text-white">3. Matriz Comparativa: BESS vs Gerador a Diesel</h2>
              <p className="mt-1 text-slate-400">
                Por que as empresas estão migrando de motores a combustão para sistemas eletroquímicos de armazenamento.
              </p>
            </div>

            {/* Direct Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-slate-800 bg-slate-950 text-xs font-black uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Critério de Avaliação</th>
                    <th className="px-6 py-4 text-emerald-400 bg-emerald-500/5">CENTRY BESS (Baterias LFP)</th>
                    <th className="px-6 py-4 text-rose-400 bg-rose-500/5">Gerador a Diesel Tradicional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" /> Tempo de Resposta
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400 bg-emerald-500/5">
                      &lt; 10 milissegundos (Instantâneo / Nobreak)
                    </td>
                    <td className="px-6 py-4 text-rose-300 bg-rose-500/5">
                      10 a 15 segundos (Pausa nas máquinas/computadores)
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-400" /> Geração de Receita
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold bg-emerald-500/5">
                      SIM — Opera diariamente em Arbitragem & Peak Shaving
                    </td>
                    <td className="px-6 py-4 text-rose-300 bg-rose-500/5">
                      NÃO — Apenas centro de custo / despesa estática
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      <VolumeX className="h-4 w-4 text-slate-400" /> Ruído & Poluição Sonora
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold bg-emerald-500/5">
                      Silencioso (&lt; 55 dB — apito leve dos ventiladores)
                    </td>
                    <td className="px-6 py-4 text-rose-300 bg-rose-500/5">
                      Extremamente ruidoso (85 a 105 dB — exige atenuação)
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-slate-400" /> Emissões de Carbono (ESG)
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold bg-emerald-500/5">
                      Zero emissões locais (100% limpo no local de uso)
                    </td>
                    <td className="px-6 py-4 text-rose-300 bg-rose-500/5">
                      Alta emissão de CO₂, fumaça preta e fuligem NOx
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-slate-400" /> Custos de Manutenção (OPEX)
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold bg-emerald-500/5">
                      Quase Zero (&lt; 0.5% ao ano — sem troca de óleo/filtros)
                    </td>
                    <td className="px-6 py-4 text-rose-300 bg-rose-500/5">
                      Elevado (combustível caro, filtros, óleo, testes periódicos)
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-400" /> Licenciamento Ambiental
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-bold bg-emerald-500/5">
                      Simplificado (sem tanque de combustível combustível líquido)
                    </td>
                    <td className="px-6 py-4 text-rose-300 bg-rose-500/5">
                      Complexo (exige bacia de contenção de combustível)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Hybrid Solution Highlight Box */}
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/30">
                  Solução Híbrida Inteligente
                </span>
                <h3 className="text-xl font-bold text-white mt-2">Você já possui gerador a diesel?</h3>
                <p className="text-sm text-slate-300">
                  O CENTRY BESS pode ser integrado ao seu gerador existente. O BESS assume o pico inicial e cortes diários de tarifa, ativando o gerador apenas em apagões severos prolongados.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("financeiro")}
                className="shrink-0 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
              >
                Calcular Economia Híbrida
              </button>
            </div>
          </div>
        )}

        {/* Section 4: ESTUDO FINANCEIRO (Simulator & Financial ROI) */}
        {activeTab === "financeiro" && (
          <div className="space-y-12 animate-fadeIn">
            <div className="border-l-4 border-emerald-400 pl-4">
              <h2 className="text-3xl font-extrabold text-white">4. Estudo Financeiro Interativo</h2>
              <p className="mt-1 text-slate-400">
                Simule a economia anual, redução de custo na tarifa de ponta e retorno do investimento (Payback).
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sliders className="h-5 w-5 text-emerald-400" /> Parâmetros da sua Unidade
                </h3>

                {/* Slider 1: Demand kW */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Demanda em Horário de Pico</span>
                    <span className="text-emerald-400 font-mono text-sm">{peakPowerKw} kW</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={3000}
                    step={50}
                    value={peakPowerKw}
                    onChange={(e) => setPeakPowerKw(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>100 kW (Pequeno)</span>
                    <span>3.000 kW (Industrial)</span>
                  </div>
                </div>

                {/* Slider 2: Hours Peak */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Horas de Ponta Diárias</span>
                    <span className="text-emerald-400 font-mono text-sm">{hoursPeakPerDay} Horas</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={hoursPeakPerDay}
                    onChange={(e) => setHoursPeakPerDay(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>

                {/* Slider 3: Tariff Difference */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Diferença Tarifária (Ponta vs Fora-Ponta)</span>
                    <span className="text-emerald-400 font-mono text-sm">R$ {tariffDiffRskwh.toFixed(2)} / kWh</span>
                  </div>
                  <input
                    type="range"
                    min={0.50}
                    max={3.00}
                    step={0.05}
                    value={tariffDiffRskwh}
                    onChange={(e) => setTariffDiffRskwh(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>

                {/* Slider 4: Outages per year */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-300">Quedas de Energia na Rede / Ano</span>
                    <span className="text-amber-400 font-mono text-sm">{outagesPerYear} eventos</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={1}
                    value={outagesPerYear}
                    onChange={(e) => setOutagesPerYear(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                  />
                </div>
              </div>

              {/* Results Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Result KPI Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6">
                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Economia Anual Estimada</p>
                    <p className="mt-2 text-3xl font-black text-white">
                      R$ {(totalAnnualSavings / 1000).toFixed(0)} mil <span className="text-xs text-slate-400 font-normal">/ ano</span>
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      R$ {annualSavingsArbitrage.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} em tarifa + R${" "}
                      {outageCostPerYear.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} evitado em diesel.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-6">
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Payback Estimado</p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {paybackYears} <span className="text-sm text-slate-300 font-normal">Anos</span>
                    </p>
                    <p className="mt-1 text-[11px] text-slate-300">
                      Retorno total do investimento em projeto turn-key.
                    </p>
                  </div>
                </div>

                {/* 10-Year Cumulative Cashflow Simulation */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                  <h4 className="font-bold text-white mb-4">Fluxo de Caixa Acumulado em 10 Anos (Projeção)</h4>
                  <div className="space-y-3">
                    {[1, 3, 5, 8, 10].map((year) => {
                      const accumSavings = totalAnnualSavings * year;
                      const netProfit = accumSavings - estimatedCapexBess;
                      const isPositive = netProfit > 0;
                      return (
                        <div key={year} className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                          <span className="font-bold text-slate-300">Ano {year}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-slate-400">Economia: R$ {(accumSavings / 1000).toFixed(0)}k</span>
                            <span className={`font-mono font-bold ${isPositive ? "text-emerald-400" : "text-slate-400"}`}>
                              {isPositive ? `+ R$ ${(netProfit / 1000).toFixed(0)}k LÍQUIDO` : `Amortizando...`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: EQUIPAMENTO (Hardware & Safety Specs) */}
        {activeTab === "equipamento" && (
          <div className="space-y-12 animate-fadeIn">
            <div className="border-l-4 border-cyan-400 pl-4">
              <h2 className="text-3xl font-extrabold text-white">5. Equipamentos & Especificações Técnicas</h2>
              <p className="mt-1 text-slate-400">
                Engenharia de alta robustez com homologações internacionais de segurança.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Product Card 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400 w-fit mb-4">
                  <BatteryCharging className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">CENTRY ESS-250</h3>
                <p className="text-xs text-slate-400 mt-1">Solução Compacta para Comércio & Serviços</p>
                <div className="mt-6 space-y-2 text-xs divide-y divide-slate-800">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Capacidade</span>
                    <span className="font-bold text-white">250 kWh</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Potência Nominal</span>
                    <span className="font-bold text-white">125 kW</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Tensão Nominal</span>
                    <span className="font-bold text-white">380V / 440V Trifásico</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Proteção</span>
                    <span className="font-bold text-emerald-400">IP65 / NEMA 4X</span>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="rounded-2xl border border-emerald-500/50 bg-slate-900/90 p-6 relative shadow-xl shadow-emerald-500/10">
                <span className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black text-black uppercase">
                  Mais Vendido
                </span>
                <div className="rounded-lg bg-cyan-500/10 p-3 text-cyan-400 w-fit mb-4">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">CENTRY ESS-1000</h3>
                <p className="text-xs text-slate-400 mt-1">Container Industrial Modular 20ft</p>
                <div className="mt-6 space-y-2 text-xs divide-y divide-slate-800">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Capacidade</span>
                    <span className="font-bold text-white">1.000 kWh (1 MWh)</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Potência Nominal</span>
                    <span className="font-bold text-white">500 kW a 1.000 kW</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Refrigeração</span>
                    <span className="font-bold text-cyan-400">Líquida Dual-Loop</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Supressão Incêndio</span>
                    <span className="font-bold text-emerald-400">Novec 1230 / FM200</span>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
                <div className="rounded-lg bg-purple-500/10 p-3 text-purple-400 w-fit mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">CENTRY ESS-MEGA</h3>
                <p className="text-xs text-slate-400 mt-1">Para Usinas & Concessionárias (Utility Scale)</p>
                <div className="mt-6 space-y-2 text-xs divide-y divide-slate-800">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Capacidade</span>
                    <span className="font-bold text-white">2.5 MWh a 10 MWh+</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Container</span>
                    <span className="font-bold text-white">40ft HC ISO Standard</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Integração EMS</span>
                    <span className="font-bold text-purple-400">Protocolo IEC 61850</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-400">Normas</span>
                    <span className="font-bold text-emerald-400">NFPA 855 / UL 9540A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety & Compliance Checklist */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-400" /> Padrões de Segurança & Certificações Globais
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                <div className="flex items-start gap-3 rounded-lg bg-slate-950 p-3.5 border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">UL 9540 & UL 9540A</p>
                    <p className="text-slate-400 mt-0.5">Certificação de segurança contra propagação térmica de células.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-slate-950 p-3.5 border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">NFPA 855 Compliant</p>
                    <p className="text-slate-400 mt-0.5">Norma internacional para instalação de sistemas fixos de energia.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg bg-slate-950 p-3.5 border border-slate-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">IEC 62619 & UN 38.3</p>
                    <p className="text-slate-400 mt-0.5">Garantia para transporte e operação segura de baterias industriais.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CTA / Contact Section */}
      <footer id="contato" className="border-t border-slate-800 bg-[#04080E] px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black text-white">Pronto para transformar o custo de energia da sua empresa?</h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
            Nossos engenheiros especialistas realizam a análise de viabilidade técnica e financeira sem compromisso.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:contato@centry.com.br"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 font-black text-black shadow-xl shadow-emerald-500/20 transition hover:bg-emerald-400 hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" /> Solicitar Estudo de Viabilidade Gratuito
            </a>
          </div>
          <p className="mt-12 text-xs text-slate-600">
            © 2026 CENTRY Energia & Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
