"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

import MainLayout from "@/components/MainLayout";
import FormAddAppUsers, {
  AppUser,
} from "@/components/app_users/FormAddAppUsers";
import TableAppUsers from "@/components/app_users/Table";
import SearchAndActions from "@/components/app_users/AppUsersToolBar";
import Pagination from "@/components/app_users/Pagination";
import { generateStrongSecret } from "@/components/app_users/utils";

export default function AppUsersPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [massUpdating, setMassUpdating] = useState(false);
  const [massUpdateMessage, setMassUpdateMessage] =
    useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/app_users");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Error fetching users");
      setUsers(json.data);
    } catch (err: any) {
      setError(
        err.message || t("load_failed") || "Falha ao carregar usuários."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [t]);

  const handleMassPasswordUpdate = async () => {
    setMassUpdating(true);
    setMassUpdateMessage(null);

    try {
      if (users.length === 0) {
        setMassUpdateMessage(
          t("no_users_to_update") || "No users to update."
        );
        return;
      }

      for (const u of users) {
        const newPass = generateStrongSecret();
        const res = await fetch(`/api/app_users/${u.id_app_user}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPass }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Erro ao atualizar senhas");
        }
      }

      await fetchUsers();

      setMassUpdateMessage(
        t("mass_update_success") || "Passwords updated successfully!"
      );
    } catch (err: any) {
      setMassUpdateMessage(
        (t("mass_update_error_prefix") || "Error updating passwords: ") +
          (err.message || t("unknown_error") || "Unknown error")
      );
    } finally {
      setMassUpdating(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;

    return users.filter((u) => {
      const app = u.application_name?.toLowerCase() ?? "";
      const createdBy = u.created_by?.toLowerCase() ?? "";
      const createdAtStr = new Date(u.created_at).toLocaleDateString("pt-BR");
      const responsible = (u as any).responsible_user_id
        ? (u as any).responsible_user_id.toLowerCase()
        : "";

      return (
        app.includes(term) ||
        createdBy.includes(term) ||
        createdAtStr.includes(term) ||
        responsible.includes(term)
      );
    });
  }, [users, searchTerm]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  const goToPage = (page: number) =>
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  return (
    <MainLayout pageTitle={t("app_users") || "Application Users"}>
      <div className="space-y-6">
        <SearchAndActions
          searchTerm={searchTerm}
          setSearchTerm={(v) => {
            setSearchTerm(v);
            setCurrentPage(1);
          }}
          setIsModalOpen={setIsModalOpen}
          handleMassPasswordUpdate={handleMassPasswordUpdate}
          massUpdating={massUpdating}
          usersLength={users.length}
        />

        {massUpdateMessage && (
          <div
            className={`relative text-sm rounded-lg border px-4 py-3 pr-10
              ${
                massUpdateMessage.toLowerCase().includes("success")
                  ? "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400"
                  : "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
              }`}
          >
            <button
              type="button"
              onClick={() => setMassUpdateMessage(null)}
              className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {massUpdateMessage}
          </div>
        )}

        {error && (
          <div className="text-sm rounded-lg border border-red-300 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-3">
            {error}
          </div>
        )}

        <TableAppUsers
          users={users}
          loading={loading}
          paginatedUsers={paginatedUsers}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            goToPage={goToPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalItems={totalItems}
          />
        )}
      </div>

      <FormAddAppUsers
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={(user) => setUsers((prev) => [user, ...prev])}
      />
    </MainLayout>
  );
}
