"use client"

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useTranslation } from 'react-i18next';
import UserPreviewCard from '@/components/home/UserPreviewCard';
import UserCarousel from '@/components/home/UserCarousel';
import KpiCard from '@/components/KPICard';
import { FaLock } from 'react-icons/fa';
import Link from 'next/link';
import QuickLinks from '@/components/home/QuickLinks';

type AppUser = {
  id_app_user: string;
  application_name: string;
  created_at: string;
  created_by?: string | null;
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/app_users');
        const json = await res.json();
        if (!mounted) return;
        if (json?.success) {
          setUsers((json.data ?? []).slice(0, 5));
        }
      } catch (e) {
        // ignore for now
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, []);

  return (
    <MainLayout pageTitle={t('home') || 'Home'}>

      <div className="grid grid-cols-1 gap-6">

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: vertical KPIs */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <h2 className="text-lg font-semibold">{t('indicator_preview') || 'Indicador'}</h2>
            <div className="flex flex-col gap-4">
              <KpiCard title={t('active_keys') || 'Chaves Ativas'} value={String(users.length)} icon={FaLock} theme="info" description={t('active_keys_description') || 'Número de chaves ativas vinculadas.'} />
              <KpiCard title={t('expiring_soon') || 'Expiram em breve'} value={'0'} icon={FaLock} theme="warning" description={t('expiring_soon_description') || 'Chaves próximas do vencimento.'} />
            </div>
          </div>

          {/* Middle: carousel */}
          <div className="md:col-span-1">
            <div>
              <h2 className="text-lg font-semibold mb-3">{t('recently_changed_users') || 'Últimas alterações'}</h2>
              {loading && <div className="text-sm text-gray-500">{t('loading') || 'Carregando...'}</div>}
              {!loading && users.length === 0 && (
                <div className="text-sm text-gray-500">{t('no_recent_changes') || 'Nenhuma alteração recente'}</div>
              )}

              {!loading && users.length > 0 && (
                <UserCarousel users={users} index={index} setIndex={setIndex} />
              )}
            </div>
          </div>

          {/* Right column previously contained quick links; now content column will render quicklinks below carousel */}
        </section>

        {/* Quick links always below carousel */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">{t('quick_actions') || 'Funcionalidades'}</h2>
          <QuickLinks />
        </div>

      </div>

    </MainLayout>
  );
};

export default HomePage;