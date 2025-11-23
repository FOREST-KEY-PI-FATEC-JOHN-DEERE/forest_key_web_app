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

  console.log(users)

  return (
    <div className=" border  rounded-md shadow-sm overflow-x-auto">
      <table className="min-w-full divide-y">
            <thead className="">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">
                  {t("app_user_name") || "Application User Name"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">
                  {t("created_by") || "Created by"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">
                  {t("responsible_user_id") || "Responsible User ID"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">
                  {t("created_at") || "Created at"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium   uppercase tracking-wider">
                  {t("expires_at") || "Expires at"}
                </th>
              </tr>
            </thead>

        <tbody className=" divide-y ">
                      {loading && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-6 py-8 text-center"
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
                            className="px-6 py-12 text-center "
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
                              onClick={() => router.push(`/history?appUserId=${u.id_app_user}`)}
                              className="group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
        
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium">
                                  {u.application_name}
                                </div>
                              </td>
        
                              <td className="px-6 py-4 whitespace-nowrap text-sm  ">
                                {u.created_by || "-"}
                              </td>
        
                              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                                {createdAtDate.toLocaleString("pt-BR", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
        
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
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
