"use client";
import { useEffect, useState } from "react";
import MainLayout from '@/components/MainLayout';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function HistoryPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const applicationId = params.id; 
  
  // 1. CAPTURAR DADOS DA URL
  const urlAppName = searchParams.get('appName');
  const urlCreatedBy = searchParams.get('createdBy');
  const urlPassword = searchParams.get('password');

  // Estado para controlar a visualização da senha (Toggle)
  const [showPassword, setShowPassword] = useState(false);
  // Estado para controlar o carregamento
  const [isLoading, setIsLoading] = useState(true);
  
  const [applicationData, setApplicationData] = useState<any>({
    id: applicationId,
    application_name: urlAppName || null, 
    password: urlPassword || "" 
  });

  const [userName, setUserName] = useState(urlCreatedBy || ""); 
  const [history, setHistory] = useState<any[]>([]);

  // Carregamento de Dados do Banco (Supabase)
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Busca dados da Aplicação
        const { data: appData, error: appError } = await supabase
          .from("Application_User")
          .select(`id, application_name, password, created_at, created_by, id_user`)
          .eq("id", applicationId)
          .single();

        if (appError) throw appError;

        if (appData) {
          setApplicationData((prev: any) => ({ ...prev, ...appData }));
          
          if (appData.created_by) {
             setUserName(appData.created_by);
          }
        }

        // Busca histórico (MODIFICADO PARA USAR id_app_user)
        const { data: historyData } = await supabase
          .from("Application_History") 
          .select(`created_at, reason, id_user, Users ( name )`)
          .eq("id_app_user", applicationId) 
          .order("created_at", { ascending: false });

        if (historyData) {
          const formattedHistory = historyData.map((item: any) => ({
            date: item.created_at,
            responsible: item.Users?.name || "Usuário Desconhecido", 
            reason: item.reason || "Atualização"
          }));
          setHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (applicationId) {
      loadData();
    }
  }, [applicationId]);

  return (
    <MainLayout pageTitle={t('history')}>
      <div className="space-y-6 relative">

        {/* Cabeçalho e Botão Voltar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 
            onClick={() => router.back()} 
            className="text-xl font-semibold text-gray-800 dark:text-gray-200 cursor-pointer hover:underline"
          >
            {t('Retornar') || "Retornar"}
          </h1>
        </div>

        <div className="flex gap-8 min-h-[70vh]">

          {/* Coluna Principal */}
          <div className="flex-1 space-y-6">

            {/* Cartão de Título */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="bg-blue-600 text-white text-lg font-medium rounded-md px-4 py-3 inline-block">
                <span className="opacity-80 font-normal mr-2">
                  {t('Nome da aplicação') || "Nome da aplicação"}:
                </span>
                {applicationData?.application_name ?? t('generic_application')}
                
                {/* Exibição do ID */}
                
              </div>
            </div>

            {/* Campos do Formulário */}
            <div className="space-y-4">

              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('created_by') || "Criado por"}
                </label>
                <input
                  type="text"
                  value={userName} 
                  readOnly
                  placeholder={!userName ? "Carregando..." : ""}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Campo Senha */}
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('access_password')}
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t('Visualizar senha') || "Visualizar senha"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        showPassword ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          showPassword ? "translate-x-5" : ""
                        }`}
                      ></span>
                    </button>
                  </div>
                </div>

                <input
                  type="text" 
                  value={
                    showPassword 
                      ? (applicationData?.password || "") 
                      : "●●●●●●●●●●●●●●●●●●"
                  }
                  readOnly
                  className={`w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${!showPassword ? 'text-[10px] tracking-widest' : ''}`} 
                />
              </div>

            </div>
          </div>

          {/* Histórico Lateral */}
          <div className="w-1/3 border-l border-gray-300 dark:border-gray-600 pl-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
              {t('history').toUpperCase()}
            </h2>
            <div className="space-y-6">
              
              {isLoading ? (
                 <p className="text-sm text-gray-500">{t('loading') || 'Carregando...'}</p>
              ) : history.length === 0 ? (
                 <p className="text-sm text-gray-500 italic">
                    {t('Sem histórico de alterações') || "Sem histórico de alterações"}
                 </p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                      <div className="w-px flex-1 bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {new Date(item.date).toLocaleString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {t('password_changed_by')} - <strong>{item.responsible}</strong> <br />
                        {t('reason')}: {item.reason}
                      </p>
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}