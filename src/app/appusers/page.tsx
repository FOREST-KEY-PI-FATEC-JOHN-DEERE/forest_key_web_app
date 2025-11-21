"use client";

import { useEffect, useMemo, useState } from "react";
import { Shield, PlusCircle, Loader2 } from "lucide-react";
import FormAddAppUsers, { AppUser } from "@/components/FormAddAppUsers";
import MainLayout from "@/components/MainLayout";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function AppUsersPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [massUpdating, setMassUpdating] = useState(false);
  const [massUpdateMessage, setMassUpdateMessage] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const sectionCardClass =
    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("Application_User")
        .select("id, created_at, application_name, created_by, id_user")
        .order("created_at", { ascending: false });

      if (error) {
        setError(
          error.message ||
            t("load_failed") ||
            "Falha ao carregar usuários de aplicação."
        );
      } else if (data) {
        setUsers(data as AppUser[]);
      }

      setLoading(false);
    };
    fetchData();
  }, [t]);

  function generateStrongSecret() {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{}<>?";
    const allChars = upper + lower + numbers + symbols;

    let newSecret = "";
    for (let i = 0; i < 16; i++) {
      newSecret += allChars[Math.floor(Math.random() * allChars.length)];
    }
    return newSecret;
  }

  function getExpirationDate(createdAt: string) {
    const base = new Date(createdAt);
    base.setDate(base.getDate() + 45);
    return base;
  }

  function renderExpirationBadge(expiresAtDate: Date) {
    const now = new Date();
    const diffMs = expiresAtDate.getTime() - now.getTime();
    const daysToExpire = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (daysToExpire > 10) return null;
    const safeDays = daysToExpire <= 0 ? 1 : daysToExpire;

    let badgeClass =
      "inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] font-semibold ";
    const label = `${t("expires_in") ?? "Expires in"} ${safeDays} ${
      t("days") ?? "days"
    }`;

    if (safeDays <= 3) {
      badgeClass +=
        "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-300";
    } else if (safeDays <= 6) {
      badgeClass +=
        "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-300";
    } else {
      badgeClass +=
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-300";
    }

    return <span className={badgeClass}>{label}</span>;
  }

  async function handleMassPasswordUpdate() {
    setMassUpdating(true);
    setMassUpdateMessage(null);

    try {
      if (users.length === 0) {
        setMassUpdateMessage(t("no_users_to_update") || "No users to update.");
        setMassUpdating(false);
        return;
      }

      const updates = users.map((u) => ({
        id: u.id,
        newPassword: generateStrongSecret(),
      }));

      for (const item of updates) {
        const nowIso = new Date().toISOString();
        const { error } = await supabase
          .from("Application_User")
          .update({
            password: item.newPassword,
            created_at: nowIso,
          })
          .eq("id", item.id);

        if (error) throw error;
      }

      setMassUpdateMessage(
        t("mass_update_success") || "Passwords updated successfully!"
      );
    } catch (err: any) {
      const baseMsg =
        t("mass_update_error_prefix") || "Error updating passwords: ";
      setMassUpdateMessage(
        baseMsg + (err.message || t("unknown_error") || "Unknown error.")
      );
    } finally {
      setMassUpdating(false);
    }
  }

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;

    return users.filter((u) => {
      const app = u.application_name?.toLowerCase() ?? "";
      const createdBy = u.created_by?.toLowerCase() ?? "";
      const idUser = u.id_user?.toString() ?? "";
      const createdAtStr = new Date(u.created_at).toLocaleDateString("pt-BR");

      return (
        app.includes(term) ||
        createdBy.includes(term) ||
        idUser.includes(term) ||
        createdAtStr.includes(term)
      );
    });
  }, [users, searchTerm]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  function goToPage(page: number) {
    const target = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(target);
  }

  function renderPageNumbers() {
    const pages: number[] = [];
    const maxToShow = 5;
    let start = Math.max(1, safeCurrentPage - 2);
    let end = Math.min(totalPages, start + maxToShow - 1);

    if (end - start < maxToShow - 1) {
      start = Math.max(1, end - maxToShow + 1);
    }

    for (let p = start; p <= end; p++) {
      pages.push(p);
    }

    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goToPage(1)}
          disabled={safeCurrentPage === 1}
          className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-40"
        >
          «
        </button>
        <button
          type="button"
          onClick={() => goToPage(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-40"
        >
          ‹
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => goToPage(p)}
            className={`px-2 py-1 text-xs rounded border ${
              p === safeCurrentPage
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => goToPage(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-40"
        >
          ›
        </button>
        <button
          type="button"
          onClick={() => goToPage(totalPages)}
          disabled={safeCurrentPage === totalPages}
          className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-40"
        >
          »
        </button>
      </div>
    );
  }

  return (
    <MainLayout pageTitle={t("app_users") || "Application Users"}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {t("registered_app_users") || "Registered Application Users"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("technical_accounts_description") ||
                "Technical accounts used by systems, integrations, and automation bots."}
            </p>
          </div>

          <button
            className="inline-flex text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            title={t("accessibility") || "Accessibility"}
          >
            <Shield className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 max-w-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  t("filter_placeholder") ||
                  "Filter by application, owner, ID or date..."
                }
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]"
              />
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setMassUpdateMessage(null);
                }}
                className="inline-flex items-center gap-2 rounded-md bg-[#2F5F1F] text-white text-sm font-semibold px-3 py-2 hover:bg-[#244c19]"
              >
                <PlusCircle className="w-4 h-4" />
                {t("new_app_user") || "New Application User"}
              </button>

              <button
                onClick={handleMassPasswordUpdate}
                disabled={massUpdating || users.length === 0}
                className="inline-flex items-center gap-2 rounded-md bg-[#0f1a2c] text-white text-sm font-semibold px-3 py-2 hover:bg-[#0c1521] disabled:opacity-50"
              >
                {massUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("updating") || "Updating..."}
                  </>
                ) : (
                  t("update_all_passwords") || "Update all passwords"
                )}
              </button>
            </div>
          </div>
        </div>

        {massUpdateMessage && (
          <div
            className={`text-sm rounded-lg border px-4 py-3 ${
              massUpdateMessage.toLowerCase().includes("sucesso") ||
              massUpdateMessage.toLowerCase().includes("success")
                ? "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400"
                : "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
            }`}
          >
            {massUpdateMessage}
          </div>
        )}

        {error && (
          <div className="text-sm rounded-lg border border-red-300 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-3">
            {error}
          </div>
        )}

        <div className={sectionCardClass + " overflow-x-auto"}>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("id") || "ID"}
                </th>
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
                      key={u.id}
                      onClick={() => router.push(`/history?appUserId=${u.id}`)}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {u.id}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {u.application_name}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {u.created_by || "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {u.id_user ?? "-"}
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

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span>{t("show") || "Show"}</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const value = Number(e.target.value);
                setPageSize(value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-[12px]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>{t("per_page") || "per page"}</span>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center">{renderPageNumbers()}</div>
          )}

          <div className="flex items-center justify-end">
            <span>
              {t("total") || "Total"}: <strong>{totalItems}</strong>{" "}
              {t("records") || "records"}
            </span>
          </div>
        </div>
      </div>

      <FormAddAppUsers
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(user) => setUsers((prev) => [user, ...prev])}
      />
    </MainLayout>
  );
}
