"use client";
import { useState } from "react";
import MainLayout from '@/components/MainLayout';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

export default function HistoryPage() {
  const { t } = useTranslation();
  const [autoUpdate, setAutoUpdate] = useState(false);

  return (
    <MainLayout pageTitle={t('history')}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {t('application_id')}
          </h1>
        </div>

        <div className="flex gap-8 min-h-[70vh]">
          {/* Coluna principal */}
          <div className="flex-1 space-y-6">
            {/* Nome da Aplicação */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="bg-blue-600 text-white text-lg font-medium rounded-md px-4 py-3 inline-block">
                {t('generic_application')}
              </div>
            </div>

            {/* Campos */}
            <div className="space-y-4">
              {/* Campo 1 - Nome de Usuário */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('username')}
                </label>
                <input
                  type="text"
                  placeholder={t('placeholder_username')}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo 2 - Email */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  placeholder={t('placeholder_email')}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Campo 3 - Senha de Acesso */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('access_password')}
                  </label>

                  {/* Toggle de atualização automática */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t('automatic_update')}
                    </span>
                    <button
                      onClick={() => setAutoUpdate(!autoUpdate)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        autoUpdate ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          autoUpdate ? "translate-x-5" : ""
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>

                {/* Campo da senha */}
                {autoUpdate ? (
                  <div className="w-full border border-dashed border-gray-400 dark:border-gray-500 rounded-md px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                    {t('automatic_update')}
                  </div>
                ) : (
                  <input
                    type="password"
                    placeholder={t('placeholder_password')}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button className="px-8 py-2 bg-red-100 dark:bg-red-900 border border-red-500 text-red-700 dark:text-red-300 font-semibold rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition">
                {t('delete')}
              </button>
              <button className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition">
                {t('edit')}
              </button>
            </div>
          </div>

          {/* Seção de Histórico */}
          <div className="w-1/3 border-l border-gray-300 dark:border-gray-600 pl-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {t('history').toUpperCase()}
              </h2>
              <div className="flex gap-2">
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {/* Entrada 1 */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                  <div className="w-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    05/03/2025 08:30:00
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('password_changed_by')} - {t('system_caps')} - <br />
                    {t('reason')}: {t('automatic_update')}
                  </p>
                </div>
              </div>

              {/* Entrada 2 */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                  <div className="w-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    18/08/2025 09:45:12
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('password_changed_by')} - NOME RESPONSÁVEL - <br />
                    {t('reason')}: {t('expired_deadline')}
                  </p>
                </div>
              </div>

              {/* Entrada 3 */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    26/10/2025 10:10:45
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('password_changed_by')} - {t('system_caps')} - <br />
                    {t('reason')}: {t('automatic_update')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
