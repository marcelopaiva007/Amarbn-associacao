"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, FilePlus2, FileText, CalendarDays, X, ExternalLink, MapPin } from "lucide-react";
import { createDocumentAction, createAssemblyAction } from "./actions";

export function DocumentsClient({
  initialDocuments,
  initialAssemblies,
}: {
  initialDocuments: any[];
  initialAssemblies: any[];
}) {
  const router = useRouter();
  const [showDocModal, setShowDocModal] = useState(false);
  const [showAssModal, setShowAssModal] = useState(false);
  const [docError, setDocError] = useState("");
  const [assError, setAssError] = useState("");

  const handleDocSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDocError("");
    const formData = new FormData(e.currentTarget);
    const res = await createDocumentAction(null, formData);

    if (res?.error) {
      setDocError(res.error);
    } else {
      setShowDocModal(false);
      router.refresh();
    }
  };

  const handleAssSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAssError("");
    const formData = new FormData(e.currentTarget);
    const res = await createAssemblyAction(null, formData);

    if (res?.error) {
      setAssError(res.error);
    } else {
      setShowAssModal(false);
      router.refresh();
    }
  };

  return (
    <main className="p-6 md:p-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#3c8876]">Secretaria</p>
        <h1 className="mt-2 text-3xl font-black">Documentos e assembleias</h1>
        <p className="mt-2 text-[#52656a]">Central de atas, estatuto, editais e registro de assembleias.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Acervo Institucional */}
        <section className="flex flex-col justify-between rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-7">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-[#3c8876]" size={28} />
                <h2 className="text-xl font-black text-[#102a32]">Acervo institucional</h2>
              </div>
              <button
                onClick={() => setShowDocModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#164b50] px-4 py-2 text-xs font-bold text-[#164b50] hover:bg-[#164b50] hover:text-white"
              >
                <FilePlus2 size={16} /> Adicionar documento
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#52656a]">
              Publique o estatuto, regimento, atas e editais para consulta dos associados.
            </p>

            <div className="mt-6 divide-y divide-[#dce4de]">
              {initialDocuments.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#52656a]">Nenhum documento publicado.</p>
              ) : (
                initialDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-4">
                    <div>
                      <span className="rounded bg-[#f0f4f2] px-2 py-0.5 text-[10px] font-bold text-[#164b50]">
                        {doc.kind}
                      </span>
                      <h4 className="mt-1 font-bold text-sm text-[#102a32]">{doc.title}</h4>
                      {doc.description && <p className="text-xs text-[#52656a]">{doc.description}</p>}
                    </div>
                    <a
                      href={doc.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3c8876] hover:text-[#164b50]"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Assembleias */}
        <section className="flex flex-col justify-between rounded-2xl border border-[#dce4de] bg-[#fffdf8] p-7">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarPlus className="text-[#3c8876]" size={28} />
                <h2 className="text-xl font-black text-[#102a32]">Assembleias</h2>
              </div>
              <button
                onClick={() => setShowAssModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-[#164b50] px-4 py-2 text-xs font-bold text-[#164b50] hover:bg-[#164b50] hover:text-white"
              >
                <CalendarPlus size={16} /> Agendar assembleia
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#52656a]">
              Organize convocações, pauta, data, local e vinculação de atas.
            </p>

            <div className="mt-6 divide-y divide-[#dce4de]">
              {initialAssemblies.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#52656a]">Nenhuma assembleia agendada.</p>
              ) : (
                initialAssemblies.map((ass) => (
                  <div key={ass.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#102a32]">{ass.title}</h4>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {ass.status}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#3c8876] font-bold">
                      <CalendarDays size={14} /> {ass.scheduledAt}
                    </p>
                    {ass.location && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#52656a]">
                        <MapPin size={12} /> {ass.location}
                      </p>
                    )}
                    {ass.agenda && (
                      <p className="mt-2 rounded-lg bg-[#f0f4f2] p-2 text-xs text-[#52656a] whitespace-pre-line">
                        {ass.agenda}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Modal Adicionar Documento */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#fffdf8] p-6 shadow-xl border border-[#dce4de]">
            <div className="flex items-center justify-between border-b border-[#dce4de] pb-4">
              <h2 className="text-lg font-black text-[#102a32]">Publicar Novo Documento</h2>
              <button onClick={() => setShowDocModal(false)} className="text-[#52656a]">
                <X size={20} />
              </button>
            </div>

            {docError && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-xs font-bold text-red-700">
                {docError}
              </div>
            )}

            <form onSubmit={handleDocSubmit} className="mt-4 grid gap-4 text-sm">
              <label className="block font-bold">
                Título do Documento *
                <input
                  name="title"
                  placeholder="Ex: Estatuto Social Consolidado 2026"
                  required
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <label className="block font-bold">
                Tipo *
                <select
                  name="kind"
                  defaultValue="ESTATUTO"
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                >
                  <option value="ESTATUTO">Estatuto</option>
                  <option value="ATA">Ata</option>
                  <option value="EDITAL">Edital</option>
                  <option value="REGIMENTO">Regimento</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </label>

              <label className="block font-bold">
                Link do Arquivo / PDF *
                <input
                  name="contentUrl"
                  defaultValue="/docs/documento.pdf"
                  required
                  placeholder="URL do arquivo ou /docs/arquivo.pdf"
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <label className="block font-bold">
                Descrição Breve
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Resumo do documento para os associados"
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="rounded-full border border-[#dce4de] px-4 py-2 text-xs font-bold text-[#52656a]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#164b50] px-5 py-2 text-xs font-bold text-white hover:bg-[#102a32]"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agendar Assembleia */}
      {showAssModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#fffdf8] p-6 shadow-xl border border-[#dce4de]">
            <div className="flex items-center justify-between border-b border-[#dce4de] pb-4">
              <h2 className="text-lg font-black text-[#102a32]">Agendar Nova Assembleia</h2>
              <button onClick={() => setShowAssModal(false)} className="text-[#52656a]">
                <X size={20} />
              </button>
            </div>

            {assError && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-xs font-bold text-red-700">
                {assError}
              </div>
            )}

            <form onSubmit={handleAssSubmit} className="mt-4 grid gap-4 text-sm">
              <label className="block font-bold">
                Título da Assembleia *
                <input
                  name="title"
                  placeholder="Ex: Assembleia Geral Extraordinária"
                  required
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <label className="block font-bold">
                Data e Horário *
                <input
                  name="scheduledAt"
                  placeholder="Ex: 2026-10-15 19:30"
                  defaultValue="2026-10-15 19:30"
                  required
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <label className="block font-bold">
                Local / Link Online
                <input
                  name="location"
                  placeholder="Sede Social AMARBN / Google Meet"
                  defaultValue="Sede Social AMARBN"
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <label className="block font-bold">
                Pauta do Encontro
                <textarea
                  name="agenda"
                  rows={3}
                  placeholder="Itens da pauta a serem votados"
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssModal(false)}
                  className="rounded-full border border-[#dce4de] px-4 py-2 text-xs font-bold text-[#52656a]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#164b50] px-5 py-2 text-xs font-bold text-white hover:bg-[#102a32]"
                >
                  Agendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
