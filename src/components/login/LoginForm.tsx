"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';

import { Mail, Lock } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import authStorage from '@/utils/auth';

interface AuthFormProps {
  onSwitchToRegister: () => void;
  noWrapper?: boolean;
}

export default function LoginForm({ onSwitchToRegister, noWrapper = false }: AuthFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic client-side validation
    if (!email || !password) {
      const msg = t('login_error_required', 'Preencha e-mail e senha.');
      setError(msg);
      showError(msg, t('error', 'Erro'));
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const msg = t('login_error_invalid_email', 'E-mail inválido.');
      setError(msg);
      showError(msg, t('error', 'Erro'));
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || "Erro ao fazer login.";
        setError(message);
        showError(message, "Erro");
        setLoading(false);
        return;
      }

      authStorage.setToken(data.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('profile', JSON.stringify(data.profile));
      }

      showSuccess("Login realizado!", "Sucesso");
      router.push("/home");
    } catch (err) {
      showError("Erro inesperado. Tente novamente.", "Erro");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('welcome_back', 'Bem-vindo de volta')}</h1>
        <p className="text-sm text-gray-300">{t('login_subtitle', 'Entre com sua conta para continuar')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="login-email" className="text-xs font-semibold text-gray-300">{t('email', 'E-mail')}</label>
          <Input
            type="email"
            id="login-email"
            placeholder={t('placeholder_email', 'seu@exemplo.com')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="text-xs font-semibold text-gray-300">{t('password', 'Senha')}</label>
          <Input
            type="password"
            id="login-password"
            placeholder={t('placeholder_password', '********')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            className="mt-1"
          />
        </div>

        {error && <div role="alert" aria-live="polite" className="text-sm text-red-400">{error}</div>}

        <Button type="submit" isLoading={loading} className="w-full" size="lg">
          {t('login_button', 'Entrar')}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm">
        <span className="text-gray-400">{t('no_account', 'Não tem conta?')}</span>
        <button type="button" onClick={onSwitchToRegister} className="text-jd-green-600 font-semibold">{t('register_cta', 'Cadastre-se')}</button>
      </div>
    </>
  );

  if (noWrapper) return <>{formContent}</>;

  return (
    <div className="w-full max-w-xl p-10 rounded-3xl shadow-2xl border bg-white/5 backdrop-blur-sm animate-[fadeIn_0.3s_ease]">
      {formContent}
    </div>
  );
}
