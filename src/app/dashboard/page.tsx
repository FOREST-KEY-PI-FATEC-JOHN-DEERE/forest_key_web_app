"use client"

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { FaExclamationTriangle, FaShieldAlt, FaCalendarAlt, FaChartLine, FaUsersSlash, FaUserClock, FaCheckCircle, FaExpandAlt, FaCompressAlt } from 'react-icons/fa';
import KpiCard from '@/components/KPICard';
import { useTranslation } from 'react-i18next';
import ComplianceChart from '@/components/dashboard/ComplianceChart';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [scrollableTop5, setScrollableTop5] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const stored = localStorage.getItem('user');
        let res;
        if (stored) {
          let fullName: string | null = null;
          try {
            const authUser = JSON.parse(stored);
            const userId = authUser?.id;
            // try to fetch profile full name
            try {
              const { data: profile } = await fetch('/api/users').then(r => r.json()).then(j => ({ data: j.data?.find((p: any) => p.id_user === userId) }));
              if (profile) fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim();
            } catch {}

            res = await fetch('/api/dashboard', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: userId, userFullName: fullName }),
            });
          } catch {
            res = await fetch('/api/dashboard');
          }
        } else {
          res = await fetch('/api/dashboard');
        }

        const json = await res.json();
        if (!mounted) return;
        if (json?.success) setData(json.data);
        else setError(json?.error || 'Failed to load dashboard');
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  return (
    <MainLayout pageTitle={t('dashboard')}>

      <section className="mb-10">
        <h2 className="text-xl font-semibold  mb-4 border-b  pb-2">
          {t('strategic_view') || 'Strategic view'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* 1. Taxa de Conformidade de Renovação (KPI Principal) */}
          <div className="lg:col-span-2">
            <KpiCard
            title={t('renewal_compliance') || 'Renewal compliance'}
            value={data?.compliance?.percent != null ? `${data.compliance.percent}%` : '—'}
            icon={FaCheckCircle}
            theme="success"
            description={data?.compliance ? `${t('compliance_count_prefix') || 'Compliant'} ${data.compliance.compliant}/${data.compliance.total}` : (t('loading') || 'Loading...')}
            />
          </div>

          {/* 2. Usuários com Senha Expirada/Bloqueada */}
          <KpiCard
            title={t('expired_users') || 'Expired users'}
            value={data?.expired ? `${data.expired.length} ${t('users') || 'Users'}` : '—'}
            icon={FaUsersSlash}
            theme="warning"
            description={data?.expired ? (t('expired_requires_manual') || 'Requires manual intervention or password reset.') : (t('loading') || 'Loading...')}
          />

          {/* 3. Média de Dias Até a Próxima Renovação */}
          <KpiCard
            title={t('avg_next_renewal') || 'Avg next renewal'}
            value={data?.averageNext?.averageDays != null ? `${data.averageNext.averageDays} ${t('days') || 'Days'}` : '—'}
            icon={FaCalendarAlt}
            theme="info"
            description={data?.averageNext ? (t('avg_next_description') || 'Indicates general health of the password cycle.') : (t('loading') || 'Loading...')}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold  mb-4 border-b  pb-2">
          {t('tactical_view') || 'Tactical view & risk'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          <KpiCard
            title={t('password_strength_proxy') || 'Password strength (proxy)'}
            value={data?.passwordStrength?.percent != null ? `${data.passwordStrength.percent}%` : '—'}
            icon={FaShieldAlt}
            theme="success"
            description={data?.passwordStrength ? (t('password_strength_recent', { recent: data.passwordStrength.recent, total: data.passwordStrength.total }) || `Updated in the last ${data.passwordStrength.recent} of ${data.passwordStrength.total}`) : (t('loading') || 'Loading...')}
          />

          <KpiCard
            title={t('next_due_7_days') || 'Next due (< 7 days)'}
            value={data?.nextDue ? `${data.nextDue.length} ${t('users') || 'Users'}` : '—'}
            icon={FaUserClock}
            theme="warning"
            description={data?.nextDue ? (t('next_due_description') || 'Users with expiry in the next 7 days.') : (t('loading') || 'Loading...')}
          />

          <div className="lg:col-span-2  shadow-lg rounded-xl p-6 ">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FaExclamationTriangle className="h-5 w-5 mr-2 text-red-500" />
                {t('top5_high_risk') || 'Top 5 high risk users'}
              </h3>
            </div>
            <div className="h-64 overflow-y-hidden hover:overflow-y-auto transition-all">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-gray-500">{t('user') || 'User'}</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-gray-500">{t('days') || 'Days'}</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-gray-500">{t('expires_at') || 'Expires at'}</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-gray-500">{t('last_update') || 'Last update'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-sm text-gray-500">{t('loading') || 'Loading...'}</td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-sm text-red-500">{String(error)}</td>
                    </tr>
                  )}

                  {!loading && data?.top5 && (() => {
                    const filteredTop5 = (data.top5 || []).filter((u: any) => {
                      if (!u.expire_at) return false;
                      const daysToExpire = Math.ceil((Date.parse(u.expire_at) - Date.now()) / (1000 * 60 * 60 * 24));
                      return daysToExpire <= 7; // include expired (negative) and <=7 days
                    });

                    if (filteredTop5.length === 0) {
                      return (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-sm text-gray-500">{t('no_users_found') || 'No users'}</td>
                        </tr>
                      );
                    }

                    return filteredTop5.map((u: any) => {
                    const daysToExpire = u.expire_at ? Math.max(0, Math.round((new Date(u.expire_at).getTime() - Date.now()) / (1000*60*60*24))) : null;
                    const initials = (u.application_name || '').split(' ').map((s: string)=> s[0]).slice(0,2).join('').toUpperCase();
                    return (
                      <tr key={u.id_app_user} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                        <td className="p-3 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 font-semibold">{initials || 'U'}</div>
                            <div>
                              <div className="font-medium text-gray-800 dark:text-gray-100">{u.application_name}</div>
                              <div className="text-xs text-gray-500">{u.changed_by || u.created_by}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 align-top">
                          <div className={`text-sm font-semibold ${daysToExpire !== null && daysToExpire <= 7 ? 'text-red-600' : 'text-gray-700 dark:text-gray-200'}`}>
                            {daysToExpire !== null ? `${daysToExpire}d` : '—'}
                          </div>
                        </td>
                        <td className="p-3 align-top text-xs text-gray-500">{u.expire_at ? new Date(u.expire_at).toLocaleString() : '—'}</td>
                        <td className="p-3 align-top text-xs text-gray-500">{u.last_update ? new Date(u.last_update).toLocaleString() : '—'}</td>
                      </tr>
                    );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* <section>
        <h2 className="text-xl font-semibold  mb-4 border-b  pb-2">
          Detalhes e Ações
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          <div className="lg:col-span-3  shadow-lg rounded-xl p-6 ">
            <h3 className="text-lg font-semibold  flex items-center">
              <FaChartLine className="h-5 w-5 mr-2 text-blue-500" />
              Tendência de Conformidade Mensal
            </h3>
            <div className="h-64  rounded-lg ">
              <ComplianceChart />
            </div>
          </div>

          
        </div>
      </section> */}

    </MainLayout>
  );
};

export default DashboardPage;