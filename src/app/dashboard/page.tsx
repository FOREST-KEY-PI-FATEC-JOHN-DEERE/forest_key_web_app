"use client"

import React from 'react';
import MainLayout from '@/components/MainLayout';
import { FaExclamationTriangle, FaShieldAlt, FaCalendarAlt, FaChartLine, FaUsersSlash, FaUserClock, FaSkullCrossbones, FaCheckCircle } from 'react-icons/fa';
import KpiCard from '@/components/KPICard';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
    const { t } = useTranslation();

  return (
    <MainLayout pageTitle={t('dashboard')}>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
          Visão Estratégica
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Taxa de Conformidade de Renovação (KPI Principal) */}
          <KpiCard
            title="Conformidade de Renovação"
            value="92.5%"
            icon={FaCheckCircle}
            theme="success"
            description="Meta de 90%. Tendência de alta (+1.5% no mês)."
          />

          {/* 2. Usuários com Senha Expirada/Bloqueada */}
          <KpiCard
            title="Usuários Bloqueados"
            value="12 Usuários"
            icon={FaUsersSlash}
            theme="warning"
            description="Requer intervenção manual ou reset de senha."
          />

          {/* 3. Média de Dias Até a Próxima Renovação */}
          <KpiCard
            title="Média Próxima Renovação"
            value="28 Dias"
            icon={FaCalendarAlt}
            theme="info"
            description="Indica a saúde geral do ciclo de senhas."
          />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
          Visão Tática e Risco
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <KpiCard
            title="Força Média da Senha"
            value="Forte"
            icon={FaShieldAlt}
            theme="success"
            description="75% das senhas classificadas como Forte/Excelente."
          />
          
          <KpiCard
            title="Vencimento Próximo (< 7 dias)"
            value="45 Usuários"
            icon={FaUserClock}
            theme="warning"
            description="Alerta de proatividade. Notificação enviada."
          />

          <KpiCard
            title="Senhas Vazadas/Críticas"
            value="5 Senhas"
            icon={FaSkullCrossbones}
            theme="danger"
            description="Alerta CRÍTICO! Exigem renovação imediata."
          />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
          Detalhes e Ações
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaChartLine className="h-5 w-5 mr-2 text-blue-500" />
              Tendência de Conformidade Mensal
            </h3>
            <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
              [Gráfico de Linha: Taxa de Conformidade vs. Tempo]
            </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaExclamationTriangle className="h-5 w-5 mr-2 text-red-500" />
              Top 5 Usuários de Alto Risco
            </h3>
            <div className="h-64 overflow-y-auto">
              <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase">Risco</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-2">J. Silva</td><td className="p-2 text-red-500 font-semibold">Crítico</td></tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-2">M. Santos</td><td className="p-2 text-red-500 font-semibold">Crítico</td></tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-2">A. Costa</td><td className="p-2 text-yellow-600 font-semibold">Alto</td></tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-2">P. Oliveira</td><td className="p-2 text-yellow-600 font-semibold">Alto</td></tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="p-2">L. Souza</td><td className="p-2 text-orange-500 font-semibold">Médio</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

export default DashboardPage;