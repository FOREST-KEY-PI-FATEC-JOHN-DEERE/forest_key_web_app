"use client";

import LoginForm from "@/components/login/LoginForm";
import RegisterForm from "@/components/login/RegisterForm";
import { useState } from "react";


export default function Home() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {isLoginView ? (
        <LoginForm onSwitchToRegister={() => setIsLoginView(false)} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setIsLoginView(true)} />
      )}
    </div>
  );
}
