"use client";

import { Loader2 } from "lucide-react";
import { AppUser } from "./FormAddAppUsers";
import { getExpirationDate, renderExpirationBadge } from "./utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AppUserRowActions from "./AppUserRowActions";

interface TableAppUsersProps {
  users: AppUser[];
  loading: boolean;
  paginatedUsers: AppUser[];
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
}

export default function TableAppUsers({
  users,
  loading,
  paginatedUsers,
  onEdit,
  onDelete,
}: TableAppUsersProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const locale =
    i18n.language === "pt"
      ? "pt-BR"
      : i18n.language === "es"
      ? "es-ES"
      : "en-US";

  return (
    <div className="border rounded-md shadow-sm overflow-x-auto">
      <table className="min-w-full divide-y table-auto">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("app_user_name") || "Application User Name"}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("created_by") || "Created by"}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("updated_by") || "Updated by"}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("status") || "Status"}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("created_at") || "Created at"}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("last_update") || "Last update"}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {t("expires_at") || "Expires at"}
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
              {t("actions") || "Actions"}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {loading && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("loading") || "Loading..."}
                </div>
              </td>
            </tr>
          )}

          {!loading && paginatedUsers.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center">
                {t("no_users_registered") ||
                  "No application users registered yet."}
              </td>
            </tr>
          )}

          {!loading &&
            paginatedUsers.map((u) => {
              const createdAtDate = new Date(u.created_at);
              const lastUpdateDate = u.last_update
                ? new Date(u.last_update)
                : null;
              const expiresAtDate = getExpirationDate(
                u.created_at,
                u.expire_at
              );
              const isActive = u.status !== false;

              return (
                <tr
                  key={u.id_app_user}
                  className={`group transition-colors ${
                    isActive
                      ? "hover:bg-gray-50 dark:hover:bg-gray-700"
                      : "bg-gray-50 dark:bg-gray-800/60"
                  }`}
                >
                  <td className="px-4 py-4 align-top">
                    <div className="text-sm font-medium break-words">
                      {u.application_name}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-sm align-top break-words">
                    {u.created_by || "-"}
                  </td>

                  <td className="px-4 py-4 text-sm align-top break-words">
                    {u.changed_by || "-"}
                  </td>

                  <td className="px-4 py-4 text-sm align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold ${
                        isActive
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                    >
                      {isActive
                        ? t("active") || "Active"
                        : t("inactive") || "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap align-top">
                    {createdAtDate.toLocaleString(locale, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap align-top">
                    {lastUpdateDate
                      ? lastUpdateDate.toLocaleString(locale, {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </td>

                  <td className="px-4 py-4 text-sm whitespace-nowrap align-top">
                    <div className="flex flex-col gap-1">
                      <span>
                        {expiresAtDate.toLocaleDateString(locale, {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      {renderExpirationBadge(expiresAtDate)}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right text-sm whitespace-nowrap align-top">
                    <AppUserRowActions
                      onView={() =>
                        router.push(`/history/${u.id_app_user}`)
                      }
                      onEdit={() => onEdit(u)}
                      onDelete={() => onDelete(u)}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
