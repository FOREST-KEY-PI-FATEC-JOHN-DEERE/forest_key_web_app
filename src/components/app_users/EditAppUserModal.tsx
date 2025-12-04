"use client";

import { useEffect, useState } from "react";
import SuccessModal from "@/components/SuccessModal";
import { ArrowLeft, KeyRound, Info, Loader2, X } from "lucide-react";
import { generateStrongSecret } from "@/components/app_users/utils";
import { supabase } from "@/utils/supabase/client";
import type { IApplicationUser } from "@/services/application_user.service";
import { useTranslation } from "react-i18next";

type EditAppUserModalProps = {
  open: boolean;
  user: IApplicationUser | null;
  onClose: () => void;
  onSubmit: (payload: {
    application_name: string;
    changed_by: string;
    id_access_group?: string | null;
    password?: string; // senha opcional
  }) => Promise<void> | void;
};

export default function EditAppUserModal({
  open,
  user,
  onClose,
  onSubmit,
}: EditAppUserModalProps) {
  const { t } = useTranslation();

  const [applicationName, setApplicationName] = useState("");
  const [secret, setSecret] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState<'success' | 'error'>('success');
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [groups, setGroups] = useState<Array<{ id_access_group: string; name: string }>>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setApplicationName(user.application_name);
      setSecret("");
      setPasswordScore(0);
      setFeedback(null);
      setSelectedGroupId(user.id_access_group ?? null);
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
        console.error("Error loading logged user:", err);
      }
    }

    loadCurrentUser();

    (async function loadGroups() {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const authUser = JSON.parse(storedUser);
          const groupsRes = await fetch('/api/groups/mine', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: authUser.id }),
          });

          const json = await groupsRes.json();
          if (json.success) setGroups(json.data || []);
        } else {
          setGroups([]);
        }
      } catch (err) {
        console.error('Erro ao carregar grupos para select', err);
        setGroups([]);
      }
    })();
  }, []);

  function handleGenerateSecret() {
    const newSecret = generateStrongSecret();
    setSecret(newSecret);
    evaluateStrength(newSecret);
  }

  function evaluateStrength(pwd: string) {
    if (!pwd) {
      setPasswordScore(0);
      return;
    }

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

    // Nome continua obrigatório (não pode ficar vazio)
    if (!applicationName.trim()) {
      setFeedback({
        ok: false,
        msg:
          t("app_user_error_missing_name") ||
          "Please enter the application user name.",
      });
      return;
    }

    const hasPasswordChange = secret.trim().length > 0;

    // Só valida força da senha se o usuário realmente quiser mudar a senha
    if (hasPasswordChange && passwordScore < 4) {
      setFeedback({
        ok: false,
        msg:
          t("app_user_error_weak_password") ||
          "Weak password. Please generate a stronger one.",
      });
      return;
    }

    if (!currentUserName) {
      setFeedback({
        ok: false,
        msg:
          t("app_user_error_missing_current_user") ||
          "Failed to identify the signed in user.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload: {
        application_name: string;
        changed_by: string;
        password?: string;
      } = {
        application_name: applicationName,
        changed_by: currentUserName,
      };

      // Só manda a senha se ela tiver sido preenchida
      if (hasPasswordChange) {
        payload.password = secret;
      }

      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      console.error(err);
      setFeedback({
        ok: false,
        msg:
          err.message ||
          (t("unknown_error") as string) ||
          "Unexpected error while saving.",
      });
      setModalVariant('error');
      setModalMessage(err.message || "Erro inesperado ao salvar.");
      setModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]";
  const labelClass = "text-sm font-medium flex items-center gap-1";

  if (!open || !user) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !submitting && onClose()}
      />

      <div className="relative z-10 w-full max-w-3xl rounded-md shadow-xl bg-[var(--color-card)] text-[var(--color-foreground)] border border-[var(--color-divider)]">
        <div className="p-6 max-h-[85vh] overflow-y-auto">
        <header className="flex items-start justify-between px-6 pt-4 pb-3 border-b border-gray-200">
          <div>
            <h2 className="text-[16px] font-semibold leading-tight mt-1">
              {t("edit_app_user") || "Edit Application User"}
            </h2>
          </div>
          <button aria-label="close" onClick={onClose} className="ml-4 rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-divider)]/20">
            <X className="w-5 h-5" />
          </button>
        </header>

        <section className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do usuário de aplicação */}
            <div className="space-y-2">
              <label className={labelClass}>
                {t("app_user_name") || "Application User Name"}
                <Info className="w-4 h-4 text-gray-400" />
              </label>

              <input
                className={inputClass}
                placeholder={
                  t("app_user_name_placeholder") ||
                  "Enter the Application User name"
                }
                value={applicationName}
                onChange={(e) => setApplicationName(e.target.value)}
              />
            </div>

            {/* Senha / Token opcional */}
            <div className="space-y-2">
              <label className={labelClass}>
                {t("new_password_token") || "New Password / Token"}
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                    <KeyRound className="w-4 h-4" />{" "}
                    {t("access_password") || "Password"}
                  </span>

                  <button
                    type="button"
                    onClick={handleGenerateSecret}
                    disabled={submitting}
                    className="text-[11px] font-semibold text-[#2F5F1F] underline"
                  >
                    {t("generate_secure_password") || "Generate secure password"}
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

                <p className="text-[11px] text-gray-500">
                  {t("password_optional_hint") ||
                    "Fill this field only if you want to change the password / token."}
                </p>

                {secret.trim().length > 0 && (
                  <PasswordStrengthBar passwordScore={passwordScore} />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>{t('link_to_group') || 'Link to Access Group'}</label>
              <select
                className="w-full px-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-divider)] text-[var(--color-foreground)]"
                value={selectedGroupId ?? ""}
                onChange={(e) => {
                  const id = e.target.value || null;
                  setSelectedGroupId(id);
                }}
              >
                <option value="">{t('none') || '-- None --'}</option>
                {groups.map((g) => (
                  <option key={g.id_access_group} value={g.id_access_group}>{g.name}</option>
                ))}
              </select>
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
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-[color:var(--color-main-green)] text-white disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("save_changes") || "Save changes"}
              </button>
            </div>
          </form>
        </section>
        </div>
      </div>
    </div>
    <SuccessModal isOpen={modalOpen} onClose={() => { setModalOpen(false); if (modalVariant === 'success') onClose(); }} message={modalMessage} showOkButton={true} variant={modalVariant} />
    </>
  );
}

function PasswordStrengthBar({ passwordScore }: { passwordScore: number }) {
  const { t } = useTranslation();

  const labels = [
    t("weak") || "Weak",
    t("fair") || "Fair",
    t("good") || "Good",
    t("strong") || "Strong",
    t("very_strong") || "Very Strong",
  ];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-green-500",
    "bg-green-700",
  ];

  const label =
    passwordScore === 0 ? labels[0] : labels[passwordScore - 1] ?? labels[0];

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
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </div>
  );
}