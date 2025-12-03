"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";

type HistoryItem = {
  date: string;
  responsible: string;
  reason: string;
};

type ApplicationData = {
  id_app_user: string;
  application_name: string;
  password: string;
  created_at: string;
  created_by: string | null;
  last_update?: string | null;
  changed_by?: string | null;
  status?: boolean | null;
};

export default function HistoryPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();

  const applicationId = params.id as string;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [applicationData, setApplicationData] = useState<ApplicationData | null>(
    null
  );
  const [userName, setUserName] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!applicationId) return;
      setIsLoading(true);

      try {
        const res = await fetch(`/api/app_users/${applicationId}`);
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error || "Erro ao carregar aplicação");
        }

        const app: ApplicationData = json.data;
        setApplicationData(app);
        setUserName(app.created_by ?? "");

        const { data: historyRows, error: historyError } = await supabase
          .from("History")
          .select("created_at, changed_by")
          .eq("id_app_user", applicationId)
          .order("created_at", { ascending: false });

        if (historyError) {
          throw historyError;
        }

        const formattedHistory: HistoryItem[] = (historyRows ?? []).map(
          (row: any) => ({
            date: row.created_at,
            responsible: row.changed_by || "Sistema",
            reason: "Atualização de senha",
          })
        );

        setHistory(formattedHistory);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [applicationId]);

  return (
    <MainLayout pageTitle={t("history")}>
      <div className="space-y-6 relative">
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
            {t("back") || "Back"}
          </h1>
        </div>

        <div className="flex gap-8 min-h-[70vh]">
          <div className="flex-1 space-y-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="bg-blue-600 text-white text-lg font-medium rounded-md px-4 py-3 inline-block">
                <span className="opacity-80 font-normal mr-2">
                  {t("application_name_label") || "Application name"}:
                </span>
                {applicationData?.application_name ??
                  t("generic_application")}
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  {t("created_by") || "Created by"}
                </label>
                <input
                  type="text"
                  value={userName}
                  readOnly
                  placeholder={!userName ? (t('loading') || 'Loading...') : ""}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t("access_password") || "Access password"}
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {t("view_password") || "View password"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${
                        showPassword
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          showPassword ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={
                    showPassword
                      ? applicationData?.password || ""
                      : "●●●●●●●●●●●●●●●●●●"
                  }
                  readOnly
                  className={`w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    !showPassword ? "text-[10px] tracking-widest" : ""
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="w-1/3 border-l border-gray-300 dark:border-gray-600 pl-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
              {t("history").toUpperCase()}
            </h2>
            <div className="space-y-6">
              {isLoading ? (
                <p className="text-sm text-gray-500">
                  {t("loading") || "Loading..."}
                </p>
              ) : history.length === 0 ? (
                <p className="text-sm text-gray-500 italic">
                  {t("no_history_changes") ||
                    "No changes history"}
                </p>
              ) : (
                history.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
                      <div className="w-px flex-1 bg-gray-300 dark:bg-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {new Date(item.date).toLocaleString("pt-BR")}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {t("password_changed_by") || "Senha alterada por"} -{" "}
                        <strong>{item.responsible}</strong>
                        <br />
                        {t("reason") || "Motivo"}: {item.reason}
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
