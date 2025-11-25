"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";

interface SimpleUser {
  id_user: string;
  first_name: string | null;
  last_name: string | null;
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
  }, []);

  // Adicionar usuário ao grupo
  const handleAdd = async () => {
    if (!selectedUser) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: selectedUser,
          admin: admin,
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

        {users.map((u) => (
          <option key={u.id_user} value={u.id_user}>
            {u.first_name} {u.last_name}
          </option>
        ))}
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
