"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, KeyRound, Info, Loader2 } from "lucide-react";
import { generateStrongSecret } from "@/components/app_users/utils";
import { supabase } from "@/utils/supabase/client";
import type { IApplicationUser } from "@/services/application_user.service";

type EditAppUserModalProps = {
  open: boolean;
  user: IApplicationUser | null;
  onClose: () => void;
  onSubmit: (payload: {
    application_name: string;
    password: string;
    changed_by: string;
  }) => Promise<void> | void;
};

export default function EditAppUserModal({
  open,
  user,
  onClose,
  onSubmit,
}: EditAppUserModalProps) {
  const [applicationName, setApplicationName] = useState("");
  const [secret, setSecret] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null
  );
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setApplicationName(user.application_name);
      setSecret("");
      setPasswordScore(0);
      setFeedback(null);
    }
  }, [user]);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const authUser = JSON.parse(storedUser);
        const userId: string | undefined = authUser.id;
        if (!userId) return;

        const { data: profile, error } = await supabase
          .from("User_Profile")
          .select("first_name, last_name")
          .eq("id_user", userId)
          .maybeSingle();

        if (error || !profile) return;

        const fullName = [profile.first_name, profile.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();

        if (!fullName) return;

        setCurrentUserName(fullName);
      } catch (err) {
        console.error("Erro ao carregar usuário logado:", err);
      }
    }

    loadCurrentUser();
  }, []);

  function handleGenerateSecret() {
    const newSecret = generateStrongSecret();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setFeedback(null);

    if (!applicationName.trim()) {
      setFeedback({ ok: false, msg: "Informe o nome do usuário de aplicação." });
      return;
    }

    if (!secret.trim()) {
      setFeedback({
        ok: false,
        msg: "Informe ou gere uma nova senha / token.",
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

    if (!currentUserName) {
      setFeedback({
        ok: false,
        msg: "Falha ao identificar o usuário logado.",
      });
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        application_name: applicationName,
        password: secret,
        changed_by: currentUserName,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        ok: false,
        msg: err.message || "Erro inesperado ao salvar.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]";
  const labelClass = "text-sm font-medium flex items-center gap-1";

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !submitting && onClose()}
      />

      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-md border border-gray-300 shadow-xl bg-white">
        <header className="flex items-start justify-between px-6 pt-4 pb-3 border-b border-gray-200">
          <div>
            <button
              className="flex items-center text-sm"
              disabled={submitting}
              onClick={onClose}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para a Lista
            </button>

            <h2 className="text-[16px] font-semibold leading-tight mt-1">
              Editar Usuário de Aplicação
            </h2>

            {currentUserName && (
              <p className="text-[12px] mt-1">
                Alterações registradas como{" "}
                <strong>{currentUserName}</strong>
              </p>
            )}
          </div>
        </header>

        <section className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className={labelClass}>
                Nome do Usuário de Aplicação
                <Info className="w-4 h-4 text-gray-400" />
              </label>

              <input
                className={inputClass}
                placeholder="Insira o nome do Usuário de Aplicação"
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Nova Senha / Token</label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <KeyRound className="w-4 h-4" /> Senha
                  </span>

                  <button
                    type="button"
                    onClick={handleGenerateSecret}
                    disabled={submitting}
                    className="text-[11px] font-semibold text-[#2F5F1F] underline"
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
              </div>

              <PasswordStrengthBar passwordScore={passwordScore} />
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
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-m"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-[#2F5F1F] text-white disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar alterações
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function PasswordStrengthBar({ passwordScore }: { passwordScore: number }) {
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-green-500",
    "bg-green-700",
  ];
  const labels = ["Fraca", "Razoável", "Boa", "Forte", "Muito Forte"];

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex flex-1 h-2 rounded overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 transition-colors ${
              i < passwordScore ? colors[passwordScore - 1] : "bg-transparent"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] uppercase tracking-wide">
        {passwordScore === 0 ? "Fraca" : labels[passwordScore - 1]}
      </span>
    </div>
  );
}
