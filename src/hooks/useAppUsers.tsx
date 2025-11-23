"use client";

import type { IApplicationUser } from "@/services/application_user.service";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { showSuccess, showError } from "@/utils/toast";

export function useAppUsers() {
  const [users, setUsers] = useState<IApplicationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<IApplicationUser | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/app_users");
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "Erro ao carregar usuários");

      setUsers(json.data as IApplicationUser[]);
    } catch (e: any) {
      console.error(e);
      showError("Erro ao carregar usuários", "Erro");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/app_users/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Erro ao deletar");

      setUsers((prev) => prev.filter((u) => u.id_app_user !== id));
      showSuccess("Usuário deletado!", "Sucesso");
    } catch (e: any) {
      console.error(e);
      showError("Erro ao deletar", "Erro");
    }
  }

  async function save(id: string, payload: Partial<IApplicationUser>) {
    try {
      const res = await fetch(`/api/app_users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Erro ao atualizar");

      const updated = json.data as IApplicationUser;

      setUsers((prev) =>
        prev.map((u) => (u.id_app_user === id ? updated : u))
      );

      showSuccess("Atualizado!", "Sucesso");
    } catch (e: any) {
      console.error(e);
      showError("Erro ao atualizar", "Erro");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    users,
    loading,
    editing,
    setEditing,
    remove,
    save,
    reload: load,
  };
}
