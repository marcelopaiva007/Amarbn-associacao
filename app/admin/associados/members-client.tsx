"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, X, CheckCircle, Ban, Mail, Phone, MapPin, KeyRound } from "lucide-react";
import { createMemberAction, toggleMemberStatusAction } from "./actions";

export function MembersClient({
  initialMembers,
  initialSearch,
  initialStatus,
}: {
  initialMembers: any[];
  initialSearch: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [formError, setFormError] = useState("");
  // Senha provisória do associado recém-cadastrado. Existe só nesta tela: a
  // secretaria anota e entrega, e ela não pode ser consultada de novo.
  const [newCredentials, setNewCredentials] = useState<{
    email: string;
    temporaryPassword: string;
  } | null>(null);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    startTransition(() => {
      const params = new URLSearchParams();
      if (val) params.set("q", val);
      if (status !== "TODOS") params.set("status", status);
      router.push(`/admin/associados?${params.toString()}`);
    });
  };

  const handleStatusFilter = (val: string) => {
    setStatus(val);
    startTransition(() => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (val !== "TODOS") params.set("status", val);
      router.push(`/admin/associados?${params.toString()}`);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    const formData = new FormData(e.currentTarget);

    const res = await createMemberAction(null, formData);
    if (res?.error) {
      setFormError(res.error);
      return;
    }

    router.refresh();
    if (res?.temporaryPassword && res.email) {
      setNewCredentials({ email: res.email, temporaryPassword: res.temporaryPassword });
    } else {
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setNewCredentials(null);
    setFormError("");
  };

  return (
    <main className="p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#3c8876]">Cadastro</p>
          <h1 className="mt-2 text-3xl font-black">Associados</h1>
          <p className="mt-2 text-[#52656a]">Cadastre e mantenha os dados dos associados atualizados.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#164b50] px-5 py-3 text-sm font-bold text-white hover:bg-[#102a32]"
        >
          <UserPlus size={17} /> Novo associado
        </button>
      </div>

      {/* Filters & Search */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 rounded-xl border border-[#dce4de] bg-[#fffdf8] px-4 py-3 sm:w-80">
          <Search size={18} className="text-[#52656a]" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Pesquisar nome, CPF ou matrícula..."
          />
        </div>

        <div className="flex rounded-lg border border-[#dce4de] bg-[#fffdf8] p-1 text-xs font-bold">
          {["TODOS", "ATIVO", "PENDENTE", "INATIVO"].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusFilter(st)}
              className={`rounded-md px-3 py-1.5 transition ${
                status === st ? "bg-[#164b50] text-white" : "text-[#52656a] hover:text-[#164b50]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#dce4de] bg-[#fffdf8]">
        {initialMembers.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-bold">Nenhum associado encontrado.</p>
            <p className="mt-2 text-sm text-[#52656a]">Tente ajustar a busca ou cadastre um novo associado.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#dce4de]">
            {initialMembers.map((member) => (
              <div key={member.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg">{member.fullName}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        member.status === "ATIVO"
                          ? "bg-emerald-100 text-emerald-800"
                          : member.status === "PENDENTE"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#52656a]">
                    <span>Matrícula: <strong className="text-[#102a32]">{member.registration}</strong></span>
                    <span>CPF: <strong className="text-[#102a32]">{member.cpf}</strong></span>
                    {member.phone && <span className="flex items-center gap-1"><Phone size={12} />{member.phone}</span>}
                    {member.email && <span className="flex items-center gap-1"><Mail size={12} />{member.email}</span>}
                  </div>
                  {member.address && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-[#52656a]">
                      <MapPin size={12} /> {member.address}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startTransition(() => toggleMemberStatusAction(member.id, member.status))}
                    disabled={isPending}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
                      member.status === "ATIVO"
                        ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {member.status === "ATIVO" ? (
                      <>
                        <Ban size={14} /> Desativar
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} /> Ativar
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Novo Associado */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#fffdf8] p-6 shadow-xl border border-[#dce4de]">
            <div className="flex items-center justify-between border-b border-[#dce4de] pb-4">
              <h2 className="text-xl font-black text-[#102a32]">
                {newCredentials ? "Associado cadastrado" : "Cadastrar Novo Associado"}
              </h2>
              <button onClick={closeModal} className="text-[#52656a] hover:text-[#102a32]">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-lg bg-red-100 p-3 text-xs font-bold text-red-700">
                {formError}
              </div>
            )}

            {newCredentials ? (
              <div className="mt-5 text-sm">
                <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
                  <KeyRound className="mt-0.5 shrink-0 text-amber-700" size={18} />
                  <div>
                    <p className="font-bold text-amber-900">Senha provisória de acesso</p>
                    <p className="mt-1 text-xs text-amber-900">
                      Anote e entregue ao associado agora. Por segurança, esta senha não pode ser
                      consultada novamente.
                    </p>
                  </div>
                </div>

                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#52656a]">
                      E-mail
                    </dt>
                    <dd className="mt-1 rounded-lg border border-[#dce4de] bg-white px-3 py-2 font-mono text-[#102a32]">
                      {newCredentials.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-[#52656a]">
                      Senha provisória
                    </dt>
                    <dd className="mt-1 rounded-lg border border-[#dce4de] bg-white px-3 py-2 font-mono text-lg font-bold tracking-wide text-[#102a32]">
                      {newCredentials.temporaryPassword}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full bg-[#164b50] px-5 py-2 text-xs font-bold text-white hover:bg-[#102a32]"
                  >
                    Anotei, pode fechar
                  </button>
                </div>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="mt-4 grid gap-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block font-bold">
                  Matrícula *
                  <input
                    name="registration"
                    defaultValue={`AMR-2026-000${Math.floor(Math.random() * 90 + 10)}`}
                    required
                    className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                  />
                </label>

                <label className="block font-bold">
                  CPF *
                  <input
                    name="cpf"
                    placeholder="000.000.000-00"
                    required
                    className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                  />
                </label>
              </div>

              <label className="block font-bold">
                Nome completo *
                <input
                  name="fullName"
                  placeholder="Nome do associado"
                  required
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block font-bold">
                  E-mail (acesso ao portal)
                  <input
                    type="email"
                    name="email"
                    placeholder="associado@email.com"
                    className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                  />
                </label>

                <label className="block font-bold">
                  Telefone
                  <input
                    name="phone"
                    placeholder="(81) 99999-9999"
                    className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                  />
                </label>
              </div>

              <label className="block font-bold">
                Endereço
                <input
                  name="address"
                  placeholder="Rua, número, bairro, cidade"
                  className="mt-1 w-full rounded-lg border border-[#dce4de] bg-white px-3 py-2 outline-none focus:border-[#3c8876]"
                />
              </label>

              <div className="mt-4 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[#dce4de] px-4 py-2 text-xs font-bold text-[#52656a]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#164b50] px-5 py-2 text-xs font-bold text-white hover:bg-[#102a32]"
                >
                  Salvar Associado
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
