"use client";

import { useState } from "react";

import { Mail, User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface AuthFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: AuthFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao cadastrar.");
        setLoading(false);
        return;
      }

      toast.success("Cadastro realizado! Confirme seu e-mail.");

      setTimeout(onSwitchToLogin, 1200);

    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-xl space-y-4">

      <h1 className="text-center text-xl font-bold">Criar Conta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            icon={<User size={20} />}
          />

          <Input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            icon={<User size={20} />}
          />
        </div>

        <Input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={20} />}
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={20} />}
        />

        <Input
          type="password"
          placeholder="Repita a senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock size={20} />}
        />

        <Button type="submit">
          CADASTRAR
        </Button>
      </form>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-sm text-main-green hover:underline mx-auto block"
      >
        Já tenho conta
      </button>
    </div>
  );
}
