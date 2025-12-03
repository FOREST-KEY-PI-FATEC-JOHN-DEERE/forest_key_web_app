"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";

interface SimpleUser {
  id_user: string;
  first_name: string | null;
  last_name: string | null;
  email?: string | null;
}

interface Props {
  groupId: string;
  onUserAdded: () => void;
}

export default function AddUsersToGroup({ groupId, onUserAdded }: Props) {
  const { t } = useTranslation();

  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Carregar lista de usuários
  const loadAvailableUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const json = await res.json();

      if (json.success) {
        setUsers(json.data);
      }
    } catch (err) {
      console.error("Erro ao carregar usuários", err);
    }
  };

  useEffect(() => {
    loadAvailableUsers();
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (stored) {
        const authUser = JSON.parse(stored);
        setCurrentUserId(authUser?.id || null);
      }
    } catch {}
  }, []);

  // Adicionar usuário ao grupo
  const handleAdd = async () => {
    if (!selectedUser) return;

    // Basic validation: ensure selectedUser looks like a uuid (length 36) or at least non-empty
    if (typeof selectedUser !== 'string' || selectedUser.length < 8) {
      alert(t("invalid_user_selected") || "Invalid user selected");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: selectedUser,
          admin: admin,
          created_by: currentUserId ?? null,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        alert(json.error || t("unknown_error"));
      } else {
        onUserAdded();
        setSelectedUser("");
        setAdmin(false);
      }
    } catch {
      alert(t("unknown_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        p-6 rounded-xl 
        bg-[var(--color-card)]
        text-[var(--color-foreground)]
        border border-[var(--color-divider)]
        shadow-sm space-y-4
      "
    >
      {/* Título interno */}
      <h3 className="text-lg font-medium text-[var(--color-foreground)]">
        {t("add_user")}
      </h3>

      {/* SELECT de Usuário */}
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="
          w-full px-3 py-2 rounded-md
          bg-[var(--color-card)]
          border border-[var(--color-divider)]
          text-[var(--color-foreground)]
          focus:ring-2
        "
      >
        <option value="">{t("select_user")}</option>

        {users.map((u) => {
          const name = `${u.first_name || ''} ${u.last_name || ''}`.trim();
          let label = "";
          if (name && u.email) {
            label = `${name} (${u.email})`;
          } else if (name) {
            label = name;
          } else if (u.email) {
            label = u.email;
          } else if (u.id_user) {
            label = `${u.id_user.slice(0,8)}...`;
          } else {
            label = t('unknown') || 'Unknown';
          }

          return (
            <option key={u.id_user} value={u.id_user}>
              {label}
            </option>
          );
        })}
      </select>

      {/* SELECT do nível de acesso */}
      <div className="space-y-2">
        <label className="font-medium text-[var(--color-foreground)]">
          {t("access_level")}
        </label>

        <select
          value={admin ? "admin" : "user"}
          onChange={(e) => setAdmin(e.target.value === "admin")}
          className="
            w-full px-3 py-2 rounded-md
            bg-[var(--color-card)]
            border border-[var(--color-divider)]
            text-[var(--color-foreground)]
            focus:ring-2
          "
        >
          <option value="admin">{t("Admin")}</option>
          <option value="user">{t("User")}</option>
        </select>
      </div>

      {/* Botão de adicionar */}
      <Button
        onClick={handleAdd}
        
        disabled={loading || !selectedUser}
        className="w-full flex justify-center items-center"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <UserPlus className="w-5 h-5 mr-2" />
            {t("add_user")}
          </>
        )}
      </Button>
    </div>
  );
}
