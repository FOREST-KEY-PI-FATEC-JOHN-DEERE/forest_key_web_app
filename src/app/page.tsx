"use client";

import LoginForm from "@/components/login/LoginForm";
import RegisterForm from "@/components/login/RegisterForm";
import { useState } from "react";
import LanguageSwitcher from '@/components/LanguageSwitcher';


export default function Home() {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-jd-gradient-soft p-8 relative">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-12 flex items-center justify-center bg-transparent">
          <div className="max-w-lg mx-auto text-center">
            <img src="/images/login_image.png" alt="Login illustration" width={520} height={420} className="mx-auto max-w-full h-auto" loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="p-12 flex items-center justify-center" style={{ backgroundColor: 'var(--color-card)' }}>
          <div className="w-full" style={{ maxWidth: 'var(--auth-panel-max-w, 420px)' }}>
            {isLoginView ? (
              <LoginForm noWrapper onSwitchToRegister={() => setIsLoginView(false)} />
            ) : (
              <RegisterForm noWrapper onSwitchToLogin={() => setIsLoginView(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
