"use client";
import { Loader2 } from "lucide-react";
import { AppUser } from "./FormAddAppUsers";
import { getExpirationDate, renderExpirationBadge } from "./utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface TableAppUsersProps {
  users: AppUser[];
  loading: boolean;
  paginatedUsers: AppUser[];
}

export default function TableAppUsers({ users, loading, paginatedUsers }: TableAppUsersProps) {
  const { t } = useTranslation();
  const router = useRouter();

  // Função para lidar com a navegação passando parâmetros na URL
  const handleNavigate = (u: AppUser) => {
    // Cria os parâmetros de busca (Query Params)
    const params = new URLSearchParams();

    // 1. Passamos o nome da aplicação
    if (u.application_name) {
        params.set("appName", u.application_name);
    }

    // 2. Passamos o nome de quem criou (ADICIONADO AGORA)
    if (u.created_by) {
        params.set("createdBy", u.created_by);
    }

    // Navega para a rota dinâmica /history/[id] com os query params
    router.push(`/history/${u.id_app_user}?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("app_user_name") || "Application User Name"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("created_by") || "Created by"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("responsible_user_id") || "Responsible User ID"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("created_at") || "Created at"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              {t("expires_at") || "Expires at"}
            </th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {loading && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("loading") || "Loading..."}
                </div>
              </td>
            </tr>
          )}

          {!loading && paginatedUsers.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-12 text-center text-gray-400 dark:text-gray-500"
              >
                {t("no_users_registered") ||
                  "No application users registered yet."}
              </td>
            </tr>
          )}

          {!loading &&
            paginatedUsers.map((u) => {
              const createdAtDate = new Date(u.created_at);
              const expiresAtDate = getExpirationDate(u.created_at);

              return (
                <tr
                  key={u.id_app_user}
                  onClick={() => handleNavigate(u)} 
                  className="group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {u.application_name}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {u.created_by || "-"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {u.id_app_user || "-"} 
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {createdAtDate.toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <span>
                        {expiresAtDate.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      {renderExpirationBadge(expiresAtDate)}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}