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
import MainLayout from '@/components/MainLayout';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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

    const getLabel = () => {
      if (passwordScore === 0) return t('weak');
      const labels = [t('weak'), t('fair'), t('good'), t('strong'), t('very_strong')];
      return labels[passwordScore - 1];
    };

    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-1 h-2 rounded bg-gray-200 dark:bg-gray-600 overflow-hidden">
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
        <span className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide">
          {getLabel()}
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
          className="absolute inset-0 bg-black/50 dark:bg-black/60"
          onClick={() => !submitting && setIsModalOpen(false)}
        />

        <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-xl">
          <header className="flex items-start justify-between px-6 pt-4 pb-3 border-b border-gray-200 dark:border-gray-600">
            <div>
              <button
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                disabled={submitting}
                onClick={() => setIsModalOpen(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('back_to_list')}
              </button>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2">
                {t('new_app_user')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('internal_credentials')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                title={t('accessibility')}
                disabled={submitting}
              >
                <Shield className="w-5 h-5" />
              </button>
            </div>
          </header>

          <section className="px-6 py-6 bg-white dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('app_user_name')}
                    <Info className="w-4 h-4 text-gray-400" />
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ex: SAP_PRODUCAO_BOT"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('system_application')}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ex: SAP Produção / Portal Florestal"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('responsible_group')}
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ex: TI Florestal"
                    value={ownerGroup}
                    onChange={(e) => setOwnerGroup(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('access_level')}
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                  >
                    <option value="read_only">{t('read_only')}</option>
                    <option value="read_write">{t('read_write')}</option>
                    <option value="admin">{t('administrator')}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('status')}
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "active" | "suspended")
                    }
                  >
                    <option value="active">{t('active')}</option>
                    <option value="suspended">{t('suspended')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('access_credentials')}
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-400 flex items-center gap-1">
                        <KeyRound className="w-4 h-4 text-gray-500" />
                        {t('login_username')}
                      </span>
                    </div>
                    <input
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      placeholder="usuario.conta"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-400 flex items-center gap-1">
                        <KeyRound className="w-4 h-4 text-gray-500" />
                        {t('password_token')}
                      </span>

                      <button
                        type="button"
                        onClick={generateSecret}
                        disabled={submitting}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
                      >
                        {t('generate_secure_password')}
                      </button>
                    </div>

                    <input
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      placeholder="********"
                      type="text"
                      value={secret}
                      onChange={(e) => {
                        setSecret(e.target.value);
                        evaluateStrength(e.target.value);
                      }}
                    />

                    <PasswordStrengthBar />

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('encrypted_password_notice')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('internal_notes')}
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-none"
                  placeholder="ex: Conta usada pelo robô de integração logística noturna. Responsável: Joaquim Serrano."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {feedback && (
                <div
                  className={`text-sm rounded-lg border px-4 py-3 ${
                    feedback.ok
                      ? "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "border-red-300 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {feedback.msg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('save_app_user')}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    );
  }

  return (
    <MainLayout pageTitle={t('app_users')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {t('registered_app_users')}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('technical_accounts_description')}
            </p>
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
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            {t('new_app_user')}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 p-4">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('system')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('group')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('login')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('access_level')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('created_at')}
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('loading')}
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                      {t('no_users_registered')}
                    </td>
                  </tr>
                )}

                {!loading &&
                  users.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => window.location.href = '/history'}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      title={t('click_to_view_history')}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {u.display_name}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {u.system_name}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {u.owner_group || "-"}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-800 dark:text-gray-200">
                          {u.login}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            u.access_level === "admin"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                              : u.access_level === "read_write"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {u.access_level === "admin"
                            ? t('administrator')
                            : u.access_level === "read_write"
                            ? t('read_write')
                            : t('read_only')}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            u.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {u.status === "active" ? t('active') : t('suspended')}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(u.created_at).toLocaleDateString(undefined, {
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

        <CreateUserModal />
      </div>
    </MainLayout>
  );
}
