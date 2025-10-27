"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  PlusCircle,
  Loader2,
  ArrowLeft,
  KeyRound,
  Info,
} from "lucide-react";

type AppUser = {
  id: string;
  display_name: string;
  system_name: string;
  owner_group: string | null;
  access_level: "read_only" | "read_write" | "admin";
  status: "active" | "suspended";
  login: string;
  created_at: string;
};

export default function AppUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [systemName, setSystemName] = useState("");
  const [ownerGroup, setOwnerGroup] = useState("");
  const [accessLevel, setAccessLevel] = useState("read_only");
  const [status, setStatus] = useState<"active" | "suspended">("active");

  const [loginUser, setLoginUser] = useState("");
  const [secret, setSecret] = useState("");
  const [notes, setNotes] = useState("");

  const [passwordScore, setPasswordScore] = useState(0); // 0-5
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const demo: AppUser[] = [
          {
            id: "1",
            display_name: "SAP_PRODUCTION_BOT",
            system_name: "SAP Produção",
            owner_group: "TI Florestal",
            access_level: "read_write",
            status: "active",
            login: "sap.bot.prod",
            created_at: "2025-10-27T12:31:00Z",
          },
          {
            id: "2",
            display_name: "LOGISTICS_SYNC_USER",
            system_name: "Portal Florestal",
            owner_group: "C&F Operações",
            access_level: "read_only",
            status: "suspended",
            login: "log.sync",
            created_at: "2025-10-20T09:15:00Z",
          },
        ];

        setUsers(demo);
      } catch (err: any) {
        setError(err.message || "Falha ao carregar usuários de aplicação.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  function generateSecret() {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{}<>?";
    const allChars = upper + lower + numbers + symbols;

    let newSecret = "";
    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      newSecret += allChars[randomIndex];
    }

    setSecret(newSecret);
    evaluateStrength(newSecret);
  }

  function evaluateStrength(pwd: string) {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    setPasswordScore(Math.min(score, 5));
  }

  function PasswordStrengthBar() {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-400",
      "bg-green-500",
      "bg-green-700",
    ];

    const labels = [
      "Fraca",
      "Razoável",
      "Boa",
      "Forte",
      "Muito Forte",
    ];

    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-1 h-2 rounded bg-gray-200 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 transition-colors ${
                i < passwordScore
                  ? colors[passwordScore - 1]
                  : "bg-transparent"
              }`}
            />
          ))}
        </div>
        <span className="text-[10px] uppercase text-gray-500 tracking-wide">
          {passwordScore === 0 ? "Fraca" : labels[passwordScore - 1]}
        </span>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!displayName.trim()) {
      setFeedback({
        ok: false,
        msg: "Por favor defina um nome de usuário de aplicação.",
      });
      return;
    }

    if (!systemName.trim()) {
      setFeedback({
        ok: false,
        msg: "Informe a qual sistema / aplicação este usuário pertence.",
      });
      return;
    }

    if (!loginUser.trim()) {
      setFeedback({
        ok: false,
        msg: "Informe o login / username desta credencial.",
      });
      return;
    }

    if (!secret.trim()) {
      setFeedback({
        ok: false,
        msg: "Gere ou informe uma senha / token.",
      });
      return;
    }

    if (passwordScore < 4) {
      setFeedback({
        ok: false,
        msg: "Senha fraca. Gere uma senha mais forte.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/app-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          system_name: systemName,
          owner_group: ownerGroup,
          access_level: accessLevel,
          status,
          login: loginUser,
          secret,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Falha ao salvar registro.");
      }

      setFeedback({
        ok: true,
        msg: "Usuário de aplicação cadastrado com sucesso.",
      });

      setSecret("");
      setPasswordScore(0);

      setUsers((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          display_name: displayName,
          system_name: systemName,
          owner_group: ownerGroup || null,
          access_level: accessLevel as AppUser["access_level"],
          status: status as AppUser["status"],
          login: loginUser,
          created_at: new Date().toISOString(),
        },
      ]);

      setDisplayName("");
      setSystemName("");
      setOwnerGroup("");
      setAccessLevel("read_only");
      setStatus("active");
      setLoginUser("");
      setSecret("");
      setNotes("");
      setPasswordScore(0);

      setIsModalOpen(false);
      setFeedback(null);
    } catch (err: any) {
      setFeedback({
        ok: false,
        msg: err.message || "Erro inesperado.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]";
  const labelClass =
    "text-sm font-medium text-gray-700 flex items-center gap-1";
  const sectionCardClass =
    "bg-white border border-gray-200 rounded-md shadow-sm";

  function CreateUserModal() {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => !submitting && setIsModalOpen(false)}
        />

        <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-md border border-gray-300 bg-white shadow-xl">
          <header className="flex items-start justify-between px-6 pt-4 pb-3 border-b border-gray-200">
            <div>
              <button
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                disabled={submitting}
                onClick={() => setIsModalOpen(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar para a Lista
              </button>

              <h2 className="text-[16px] font-semibold leading-tight text-[#0f1a2c] mt-1">
                Novo Usuário de Aplicação
              </h2>
              <p className="text-[11px] text-gray-500">
                Cadastro interno de credenciais de serviço.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="text-gray-700 hover:text-gray-900"
                title="Acessibilidade"
                disabled={submitting}
              >
                <Shield className="w-5 h-5" />
              </button>

              <div
                className="w-6 h-6 rounded-full border border-gray-400 bg-[url('/br-flag.svg')] bg-cover bg-center"
                title="PT-BR"
              />
            </div>
          </header>

          <section className="px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelClass}>
                    Nome do Usuário de Aplicação
                    <Info className="w-4 h-4 text-gray-400" />
                  </label>
                  <input
                    className={inputClass}
                    placeholder="ex: SAP_PRODUCAO_BOT"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Sistema / Aplicação</label>
                  <input
                    className={inputClass}
                    placeholder="ex: SAP Produção / Portal Florestal"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className={labelClass}>Grupo Responsável</label>
                  <input
                    className={inputClass}
                    placeholder="ex: TI Florestal"
                    value={ownerGroup}
                    onChange={(e) => setOwnerGroup(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Nível de Acesso</label>
                  <select
                    className={inputClass}
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                  >
                    <option value="read_only">Somente Leitura</option>
                    <option value="read_write">Leitura e Escrita</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "active" | "suspended")
                    }
                  >
                    <option value="active">Ativo</option>
                    <option value="suspended">Suspenso</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Credenciais de Acesso</label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <KeyRound className="w-4 h-4 text-gray-500" />
                        Login / Username
                      </span>
                    </div>
                    <input
                      className={inputClass + " font-mono"}
                      placeholder="usuario.conta"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <KeyRound className="w-4 h-4 text-gray-500" />
                        Senha / Token
                      </span>

                      <button
                        type="button"
                        onClick={generateSecret}
                        disabled={submitting}
                        className="text-[11px] font-semibold text-[#2F5F1F] hover:text-[#244c19] underline"
                      >
                        Gerar senha segura
                      </button>
                    </div>

                    <input
                      className={inputClass + " font-mono"}
                      placeholder="********"
                      type="text"
                      value={secret}
                      onChange={(e) => {
                        setSecret(e.target.value);
                        evaluateStrength(e.target.value);
                      }}
                    />

                    <PasswordStrengthBar />

                    <p className="text-[11px] text-gray-500">
                      Essa senha será criptografada e NÃO ficará visível após o cadastro.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className={labelClass}>Observações Internas</label>
                <textarea
                  className={inputClass + " min-h-[80px] resize-none"}
                  placeholder="ex: Conta usada pelo robô de integração logística noturna. Responsável: Joaquim Serrano."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {feedback && (
                <div
                  className={`text-sm rounded border px-3 py-2 ${
                    feedback.ok
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-red-600 bg-red-50 text-red-700"
                  }`}
                >
                  {feedback.msg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md bg-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-md bg-[#2F5F1F] hover:bg-[#244c19] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar Usuário de Aplicação
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col flex-1 bg-white min-h-screen">
 
      <header className="flex items-start justify-between px-4 sm:px-6 pt-4 pb-2 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-[16px] font-semibold leading-tight text-[#0f1a2c]">
            Lista de Usuários de Aplicação
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="text-gray-700 hover:text-gray-900"
            title="Acessibilidade"
          >
            <Shield className="w-5 h-5" />
          </button>

          <div
            className="w-7 h-7 rounded-full border-2 border-[#2F5F1F] bg-[url('/br-flag.svg')] bg-cover bg-center"
            title="PT-BR"
          />
        </div>
      </header>

      <section className="px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Usuários de Aplicação Registrados
              </span>
              <span className="text-[11px] text-gray-500">
                Contas técnicas utilizadas por sistemas, integrações e robôs de processo.
              </span>
            </div>

            <button
              onClick={() => {
                setDisplayName("");
                setSystemName("");
                setOwnerGroup("");
                setAccessLevel("read_only");
                setStatus("active");
                setLoginUser("");
                setSecret("");
                setNotes("");
                setPasswordScore(0);
                setFeedback(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-[#2F5F1F] text-white text-sm font-semibold px-3 py-2 hover:bg-[#244c19]"
            >
              <PlusCircle className="w-4 h-4" />
              Novo Usuário de Aplicação
            </button>
          </div>

          {error && (
            <div className="text-sm rounded border border-red-600 bg-red-50 text-red-700 px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <div className={sectionCardClass + " overflow-x-auto"}>
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                <tr>
                  <th className="py-2 px-4 font-medium text-[#0f1a2c]">
                    Nome
                  </th>
                  <th className="py-2 px-4 font-medium text-[#0f1a2c]">
                    Sistema
                  </th>
                  <th className="py-2 px-4 font-medium text-[#0f1a2c]">
                    Grupo
                  </th>
                  <th className="py-2 px-4 font-medium text-[#0f1a2c]">
                    Login
                  </th>
                  <th className="py-2 px-4 font-medium text-[#0f1a2c]">
                    Acesso
                  </th>
                  <th className="py-2 px-4 font-medium text-[#0f1a2c]">
                    Status
                  </th>
                  <th className="py-2 px-4 font-medium text-[#0f1a2c]">
                    Criado em
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-800">
                {loading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 px-4 text-center text-gray-500 text-sm"
                    >
                      Carregando...
                    </td>
                  </tr>
                )}

                {!loading && users.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 px-4 text-center text-gray-400 text-sm"
                    >
                      Nenhum usuário de aplicação cadastrado ainda.
                    </td>
                  </tr>
                )}

                {!loading &&
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#0f1a2c]">
                        {u.display_name}
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        {u.system_name}
                      </td>

                      <td className="py-3 px-4 text-gray-700">
                        {u.owner_group || "-"}
                      </td>

                      <td className="py-3 px-4 font-mono text-[12px] text-gray-800">
                        {u.login}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={
                            "inline-block rounded px-2 py-[2px] text-[11px] font-semibold " +
                            (u.access_level === "admin"
                              ? "bg-red-100 text-red-700 border border-red-300"
                              : u.access_level === "read_write"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                              : "bg-gray-100 text-gray-700 border border-gray-300")
                          }
                        >
                          {u.access_level === "admin"
                            ? "Administrador"
                            : u.access_level === "read_write"
                            ? "Leitura e Escrita"
                            : "Somente Leitura"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={
                            "inline-block rounded px-2 py-[2px] text-[11px] font-semibold " +
                            (u.status === "active"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : "bg-gray-200 text-gray-700 border border-gray-400")
                          }
                        >
                          {u.status === "active" ? "Ativo" : "Suspenso"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[12px] text-gray-500">
                        {new Date(u.created_at).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CreateUserModal />
    </main>
  );
}
