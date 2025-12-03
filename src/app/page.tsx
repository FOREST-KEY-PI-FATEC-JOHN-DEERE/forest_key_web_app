"use client";

import LoginForm from "@/components/login/LoginForm";
import RegisterForm from "@/components/login/RegisterForm";
import { useState, useEffect } from "react";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Image from 'next/image';


export default function Home() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [imgStatus, setImgStatus] = useState<'unknown'|'ok'|'error'>('unknown');

  useEffect(() => {
    let mounted = true;
    fetch('/images/login_image.png', { method: 'HEAD' }).then(r => {
      if (!mounted) return;
      setImgStatus(r.ok ? 'ok' : 'error');
    }).catch(() => { if (mounted) setImgStatus('error'); });
    return () => { mounted = false };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-jd-gradient-soft p-8 relative">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="flex bg-transparent">
            <div className="hidden md:flex items-stretch">
              <div className="w-full h-full">
                <Image src="/images/login_image.png" alt="Login illustration" width={1200} height={1200} className="w-full h-full object-cover" priority />
              </div>
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
