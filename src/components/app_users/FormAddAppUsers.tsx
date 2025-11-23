"use client";

import { useState, useEffect } from "react";
import { Shield, ArrowLeft, KeyRound, Info, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { generateStrongSecret } from "@/components/app_users/utils"; // <- import do utils

export type AppUser = {
  id_app_user: number;
  created_at: string;
  application_name: string;
  created_by: string | null;
};

type FormAddAppUsersProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (user: AppUser) => void;
};

export default function FormAddAppUsers({
  open,
  onClose,
  onCreated,
}: FormAddAppUsersProps) {
  const [applicationName, setApplicationName] = useState("");
  const [secret, setSecret] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [passwordScore, setPasswordScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  // ---------- EFFECTS ----------
  useEffect(() => {
  function loadCurrentUser() {
    try {
      // Assuming you stored something like { id: '123', name: 'Alice' } in localStorage
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      setCurrentUserId(user.id);
      setCurrentUserName(user.mail);
      console.log(currentUserId)
    } catch (err) {
      console.error("Erro ao obter usuário logado do localStorage:", err);
    }
  }

  loadCurrentUser();
}, []);


  // ---------- FUNÇÕES ----------
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
  setFeedback(null);

  if (!applicationName.trim()) {
    setFeedback({ ok: false, msg: "Informe o nome do usuário de aplicação." });
    return;
  }
  if (!secret.trim()) {
    setFeedback({ ok: false, msg: "Gere ou informe uma senha / token." });
    return;
  }
  if (passwordScore < 4) {
    setFeedback({ ok: false, msg: "Senha fraca. Gere uma senha mais forte." });
    return;
  }
  if (!currentUserId) {
    setFeedback({ ok: false, msg: "Falha ao identificar o usuário logado." });
    return;
  }

  setSubmitting(true);

  try {
    const res = await fetch("/api/app_users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        application_name: applicationName,
        password: secret,
        created_by: "testes",
      }),
    });

    const result = await res.json();

    if (!result.success) throw new Error(result.error || "Erro inesperado");

    if (result.data && onCreated) {
      onCreated(result.data as AppUser);
    }

    setApplicationName("");
    setSecret("");
    setPasswordScore(0);
    setFeedback(null);
    onClose();
  } catch (err: any) {
    setFeedback({ ok: false, msg: err.message || "Erro inesperado ao salvar." });
  } finally {
    setSubmitting(false);
  }
}


  // ---------- COMPONENTES INTERNOS ----------
  function PasswordStrengthBar() {
    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-500", "bg-green-700"];
    const labels = ["Fraca", "Razoável", "Boa", "Forte", "Muito Forte"];

    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-1 h-2 rounded overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 transition-colors ${i < passwordScore ? colors[passwordScore - 1] : "bg-transparent"}`}
            />
          ))}
        </div>
        <span className="text-[10px] uppercase  tracking-wide">
          {passwordScore === 0 ? "Fraca" : labels[passwordScore - 1]}
        </span>
      </div>
    );
  }

  const inputClass = "w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]";
  const labelClass = "text-sm font-medium flex items-center gap-1";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => !submitting && onClose()} />

      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-md border border-gray-300 shadow-xl">
        <header className="flex items-start justify-between px-6 pt-4 pb-3 border-b border-gray-200">
          <div>
            <button className="flex items-center text-sm" disabled={submitting} onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar para a Lista
            </button>

            <h2 className="text-[16px] font-semibold leading-tight mt-1">
              Novo Usuário de Aplicação
            </h2>

            {currentUserName && (
              <p className="text-[12px]  mt-1">
                Criado automaticamente por <strong>{currentUserName}</strong>
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
              <label className={labelClass}>Senha / Token</label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <KeyRound className="w-4 h-4 " /> Senha
                  </span>

                  <button
                    type="button"
                    onClick={handleGenerateSecret} // <- aqui usamos a função do utils
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
              </div>
            </div>

            {feedback && (
              <div className={`text-sm rounded border px-3 py-2 ${feedback.ok ? "border-green-600 bg-green-50 text-green-700" : "border-red-600 bg-red-50 text-red-700"}`}>
                {feedback.msg}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button type="button" disabled={submitting} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-m" onClick={onClose}>
                Cancelar
              </button>

              <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold  rounded-md bg-[#2F5F1F] hover:bg-[#244c19] disabled:opacity-50 disabled:cursor-not-allowed">
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
