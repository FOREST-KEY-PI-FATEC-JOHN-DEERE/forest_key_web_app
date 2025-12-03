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
import { supabase } from "@/utils/supabase/client";

import EditAppUserModal from "@/components/app_users/EditAppUserModal";
import ConfirmDeleteAppUser from "@/components/app_users/ConfirmDeleteAppUser";

export default function AppUsersPage() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);

  const [massUpdating, setMassUpdating] = useState(false);
  const [massUpdateMessage, setMassUpdateMessage] =
    useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const authUser = JSON.parse(storedUser);
        const userId: string | undefined = authUser.id;
        if (!userId) return;

        const { data: profile, error } = await supabase
          .from("User_Profile")
          .select("first_name, last_name")
          .eq("id_user", userId)
          .maybeSingle();

        if (error || !profile) return;

        const fullName = [profile.first_name, profile.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();

        if (!fullName) return;

        setCurrentUserName(fullName);
      } catch (err) {
        console.error("Erro ao carregar usuário logado:", err);
      }
    }

    loadCurrentUser();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const authUser = JSON.parse(storedUser);
          const userId: string | undefined = authUser.id;

          // try to fetch current user's full name from profile
          let fullName: string | null = null;
          if (userId) {
            const { data: profile } = await supabase
              .from("User_Profile")
              .select("first_name, last_name")
              .eq("id_user", userId)
              .maybeSingle();

            if (profile) {
              fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
            }
          }

          const res = await fetch("/api/app_users/mine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: authUser.id, userFullName: fullName }),
          });

          const json = await res.json();
          if (!json.success) throw new Error(json.error || "Error fetching users");
          setUsers(json.data);
          return;
        } catch (e) {
          console.warn("Falling back to global app users due to error", e);
        }
      }

      // Fallback: fetch all app users
      const res2 = await fetch("/api/app_users");
      const json2 = await res2.json();
      if (!json2.success) throw new Error(json2.error || "Error fetching users");
      setUsers(json2.data);
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
      const activeUsers = users.filter((u) => u.status !== false);

      if (activeUsers.length === 0) {
        setMassUpdateMessage(
          t("no_users_to_update") || "Nenhum usuário ativo para atualizar."
        );
        return;
      }

      for (const u of activeUsers) {
        const newPass = generateStrongSecret();
        const res = await fetch(`/api/app_users/${u.id_app_user}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: newPass,
            changed_by: currentUserName ?? "Sistema",
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || "Erro ao atualizar senhas");
        }
      }

      await fetchUsers();

      setMassUpdateMessage(
        t("mass_update_success") || "Senhas atualizadas com sucesso!"
      );
    } catch (err: any) {
      setMassUpdateMessage(
        (t("mass_update_error_prefix") ||
          "Erro ao atualizar senhas: ") +
          (err.message || t("unknown_error") || "Erro desconhecido")
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
      const changedBy = u.changed_by?.toLowerCase() ?? "";
      const statusLabel = u.status === false ? "inativo" : "ativo";
      const createdAtStr = new Date(u.created_at).toLocaleDateString("pt-BR");

      return (
        app.includes(term) ||
        createdBy.includes(term) ||
        changedBy.includes(term) ||
        statusLabel.includes(term) ||
        createdAtStr.includes(term)
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
  async function handleConfirmDelete() {
    if (!deletingUser) return;

    try {
      const res = await fetch(`/api/app_users/${deletingUser.id_app_user}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Erro ao desativar");
      await fetchUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingUser(null);
    }
  }

  function handleEditSaved(updated: AppUser) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id_app_user === updated.id_app_user ? updated : u
      )
    );
  }

  return (
    <MainLayout pageTitle={t("app_users") || "Application Users"}>
      <div className="space-y-6">
        <SearchAndActions
          searchTerm={searchTerm}
          setSearchTerm={(v) => {
            setSearchTerm(v);
            setCurrentPage(1);
          }}
          setIsModalOpen={setIsCreateModalOpen}
          handleMassPasswordUpdate={handleMassPasswordUpdate}
          massUpdating={massUpdating}
          usersLength={users.length}
        />

        {massUpdateMessage && (
          <div
            className={`relative text-sm rounded-lg border px-4 py-3 pr-10
              ${
                massUpdateMessage.toLowerCase().includes("sucesso") ||
                massUpdateMessage.toLowerCase().includes("success")
                  ? "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400"
                  : "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}>
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
          onEdit={(user) => setEditingUser(user)}
          onDelete={(user) => setDeletingUser(user)}
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

      {/* Modal de criação */}
      <FormAddAppUsers
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(user) => setUsers((prev) => [user, ...prev])}
      />

      <EditAppUserModal
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={async (payload) => {
          if (!editingUser) return;
          // ensure we forward access_group fields if present in payload
          const body = {
            ...payload,
            id_access_group: (payload as any).id_access_group ?? editingUser.id_access_group ?? null,
          };

          const res = await fetch(`/api/app_users/${editingUser.id_app_user}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const json = await res.json();
          if (!json.success) throw new Error(json.error || "Erro ao atualizar");

          handleEditSaved(json.data as AppUser);
        }}
      />

      <ConfirmDeleteAppUser
        open={!!deletingUser}
        appName={deletingUser?.application_name ?? ""}
        onCancel={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
      />
    </MainLayout>
  );
}
