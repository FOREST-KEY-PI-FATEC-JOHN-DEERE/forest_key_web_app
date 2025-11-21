"use client";

import { useState } from "react";

import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface AuthFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao fazer login.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("profile", JSON.stringify(data.profile));

      toast.success("Login realizado!");
      router.push("/dashboard");
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-[fadeIn_0.3s_ease]">
      
      {/* HEADER */}
      <div className="text-center mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Bem-vindo 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Entre com sua conta para continuar
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={20} className="text-gray-400" />}
        />

        <Input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={20} className="text-gray-400" />}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl text-white bg-main-green hover:bg-green-600 transition-all shadow-md disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      {/* FOOTER */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-sm text-main-green hover:underline font-medium"
        >
          Não tem conta? <span className="font-semibold">Cadastre-se</span>
        </button>
      </div>
    </div>
  );
}
