"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';

import { Mail, User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { showSuccess, showError } from "@/utils/toast";
import Input from "../ui/Input";
import Button from "../ui/Button";
import authStorage from '@/utils/auth';

interface AuthFormProps {
  onSwitchToLogin: () => void;
  noWrapper?: boolean;
}

export default function RegisterForm({ onSwitchToLogin, noWrapper = false }: AuthFormProps) {
  const { t } = useTranslation();
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      const msg = t('register_error_required', 'Preencha todos os campos.');
      setError(msg);
      showError(msg, t('error', 'Erro'));
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      const msg = t('register_error_password_length', 'A senha deve ter ao menos 8 caracteres.');
      setError(msg);
      showError(msg, t('error', 'Erro'));
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Senhas não coincidem.");
      showError("Senhas não coincidem.", "Erro");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || "Erro ao cadastrar.";
        setError(message);
        showError(message, "Erro");
        setLoading(false);
        return;
      }

      showSuccess("Cadastro realizado! Confirme seu e-mail.", "Sucesso");

      setTimeout(onSwitchToLogin, 1200);

    } catch {
      showError("Erro inesperado. Tente novamente.", "Erro");
    }

    setLoading(false);
  };

  const formContent = (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">{t('create_account', 'Criar conta')}</h1>
        <p className="text-sm text-gray-300">{t('register_subtitle', 'Preencha os dados para criar sua conta')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-300">{t('first_name', 'Nome')}</label>
              <Input type="text" placeholder={t('placeholder_display_name', 'First name')} value={first_name} onChange={(e) => setfirst_name(e.target.value)} icon={<User size={18} />} className="mt-1" />
          </div>

          <div>
            <label className="text-xs text-gray-300">{t('last_name', 'Sobrenome')}</label>
              <Input type="text" placeholder={t('placeholder_display_name', 'Last name')} value={last_name} onChange={(e) => setlast_name(e.target.value)} icon={<User size={18} />} className="mt-1" />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-300">{t('email', 'E-mail')}</label>
          <Input type="email" placeholder={t('placeholder_email', 'seu@exemplo.com')} value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={18} />} className="mt-1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-300">{t('password', 'Senha')}</label>
            <Input type="password" placeholder={t('placeholder_password', 'Senha')} value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock size={18} />} className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-gray-300">{t('confirm_password', 'Repita a senha')}</label>
            <Input type="password" placeholder={t('placeholder_confirm_password', 'Repita a senha')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<Lock size={18} />} className="mt-1" />
          </div>
        </div>

        {error && <div role="alert" aria-live="polite" className="text-sm text-red-400">{error}</div>}

        <Button type="submit" isLoading={loading} className="w-full" size="lg">{t('register_button', 'CADASTRAR')}</Button>
      </form>

      <div className="mt-6 text-center">
        <button type="button" onClick={onSwitchToLogin} className="text-sm text-jd-green-600 font-semibold">{t('already_have_account', 'Já tenho conta')}</button>
      </div>
    </>
  );

  if (noWrapper) return <>{formContent}</>;

  return (
    <div className="w-full max-w-2xl p-10 rounded-3xl shadow-2xl bg-white/5 backdrop-blur-sm">
      {formContent}
    </div>
  );
}
