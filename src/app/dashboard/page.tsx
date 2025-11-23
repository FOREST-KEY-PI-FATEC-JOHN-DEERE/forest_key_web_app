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
        const res = await fetch('/api/dashboard');
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
          Visão Estratégica
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* 1. Taxa de Conformidade de Renovação (KPI Principal) */}
          <div className="lg:col-span-2">
            <KpiCard
            title="Conformidade de Renovação"
            value={data?.compliance?.percent != null ? `${data.compliance.percent}%` : '—'}
            icon={FaCheckCircle}
            theme="success"
            description={data?.compliance ? `Conformidade ${data.compliance.compliant}/${data.compliance.total}` : 'Carregando...'}
            />
          </div>

          {/* 2. Usuários com Senha Expirada/Bloqueada */}
          <KpiCard
            title="Usuários Expirados"
            value={data?.expired ? `${data.expired.length} Usuários` : '—'}
            icon={FaUsersSlash}
            theme="warning"
            description={data?.expired ? 'Requer intervenção manual ou reset de senha.' : 'Carregando...'}
          />

          {/* 3. Média de Dias Até a Próxima Renovação */}
          <KpiCard
            title="Média Próxima Renovação"
            value={data?.averageNext?.averageDays != null ? `${data.averageNext.averageDays} Dias` : '—'}
            icon={FaCalendarAlt}
            theme="info"
            description={data?.averageNext ? 'Indica a saúde geral do ciclo de senhas.' : 'Carregando...'}
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold  mb-4 border-b  pb-2">
          Visão Tática e Risco
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          <KpiCard
            title="Força Média da Senha (proxy)"
            value={data?.passwordStrength?.percent != null ? `${data.passwordStrength.percent}%` : '—'}
            icon={FaShieldAlt}
            theme="success"
            description={data?.passwordStrength ? `Atualizadas nos últimos ${data.passwordStrength.recent} de ${data.passwordStrength.total}` : 'Carregando...'}
          />

          <KpiCard
            title="Vencimento Próximo (< 7 dias)"
            value={data?.nextDue ? `${data.nextDue.length} Usuários` : '—'}
            icon={FaUserClock}
            theme="warning"
            description={data?.nextDue ? 'Usuários com expiração nos próximos 7 dias.' : 'Carregando...'}
          />

          <div className="lg:col-span-2  shadow-lg rounded-xl p-6 ">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FaExclamationTriangle className="h-5 w-5 mr-2 text-red-500" />
                Top 5 Usuários de Alto Risco
              </h3>
              <div>
                <button
                  onClick={() => setScrollableTop5(s => !s)}
                  title={scrollableTop5 ? 'Expandir tabela' : 'Ativar rolagem'}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-white/60 dark:bg-gray-800/50 border border-gray-200/30 hover:bg-white/70 transition"
                >
                  {scrollableTop5 ? <FaExpandAlt className="w-4 h-4" /> : <FaCompressAlt className="w-4 h-4" />}
                  <span className="hidden sm:inline">{scrollableTop5 ? 'Expandir' : 'Scroll'}</span>
                </button>
              </div>
            </div>
            <div className={`${scrollableTop5 ? 'h-64 overflow-y-auto' : ''}`}>
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-gray-500">Usuário</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-gray-500">Dias</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-gray-500">Expira em</th>
                    <th className="p-3 text-left text-xs font-semibold uppercase text-gray-500">Última alteração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {loading && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-sm text-gray-500">Carregando...</td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-sm text-red-500">{String(error)}</td>
                    </tr>
                  )}

                  {!loading && data?.top5 && data.top5.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-sm text-gray-500">Nenhum usuário</td>
                    </tr>
                  )}

                  {!loading && data?.top5 && data.top5.map((u: any) => {
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
                  })}
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