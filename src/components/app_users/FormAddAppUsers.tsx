"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, KeyRound, Info, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { generateStrongSecret } from "@/components/app_users/utils";
import { supabase } from "@/utils/supabase/client";
import type { IApplicationUser } from "@/services/application_user.service";

export type AppUser = IApplicationUser;

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
  const { t } = useTranslation();

  const [applicationName, setApplicationName] = useState("");
  const [secret, setSecret] = useState("");
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [passwordScore, setPasswordScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(
    null
  );

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          console.error("No user in localStorage");
          return;
        }

        const authUser = JSON.parse(storedUser);
        const userId: string | undefined = authUser.id;
        if (!userId) {
          console.error("User from localStorage has no id");
          return;
        }

        const { data: profile, error } = await supabase
          .from("User_Profile")
          .select("first_name, last_name")
          .eq("id_user", userId)
          .maybeSingle();

        if (error) {
          console.error("Error fetching User_Profile:", error);
          return;
        }

        if (!profile) {
          console.error("No profile found for id_user:", userId);
          return;
        }

        const fullName = [profile.first_name, profile.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();

        if (!fullName) {
          console.error("Profile found but with empty name:", profile);
          return;
        }

        setCurrentUserName(fullName);
        console.log("Loaded name from User_Profile:", fullName);
      } catch (err) {
        console.error("Error loading logged user:", err);
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
    setFeedback(null);

    if (!applicationName.trim()) {
      setFeedback({
        ok: false,
        msg:
          t("app_user_error_missing_name") ||
          "Please enter the application user name.",
      });
      return;
    }

    if (!secret.trim()) {
      setFeedback({
        ok: false,
        msg:
          t("app_user_error_missing_secret") ||
          "Generate or enter a password / token.",
      });
      return;
    }

    if (passwordScore < 4) {
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
      const res = await fetch("/api/app_users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_name: applicationName,
          password: secret,
          created_by: currentUserName,
        }),
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.error || "Unexpected error");

      if (result.data && onCreated) {
        onCreated(result.data as AppUser);
      }

      setApplicationName("");
      setSecret("");
      setPasswordScore(0);
      setFeedback(null);
      onClose();
    } catch (err: any) {
      setFeedback({
        ok: false,
        msg:
          err.message ||
          (t("unknown_error") as string) ||
          "Unexpected error while saving.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function PasswordStrengthBar() {
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
      <div className="flex items-center gap-2">
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

  const inputClass =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]";
  const labelClass = "text-sm font-medium flex items-center gap-1";

  if (!open) return null;

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
              {t("back_to_list") || "Back to List"}
            </button>

            <h2 className="text-[16px] font-semibold leading-tight mt-1">
              {t("new_app_user") || "New Application User"}
            </h2>

            {currentUserName && (
              <p className="text-[12px] mt-1">
                {(t("created_by") || "Created by") + " "}
                <strong>{currentUserName}</strong>
              </p>
            )}
          </div>
        </header>

        <section className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-2">
              <label className={labelClass}>
                {t("password_token") || "Password / Token"}
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

                <PasswordStrengthBar />
              </div>
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
                {t("cancel") || "Cancel"}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-[#2F5F1F] text-white disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {t("save_app_user") || "Save Application User"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
