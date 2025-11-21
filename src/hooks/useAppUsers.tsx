"use client";

import { deleteAppUser, getAllAppUsers, IApplicationUser, updateAppUser } from "@/services/application_user.service";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";

export function useAppUsers() {
  const [users, setUsers] = useState<IApplicationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<IApplicationUser | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await getAllAppUsers();
      setUsers(data);
    } catch (e: any) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: any) {
    try {
      await deleteAppUser(id);
      setUsers(prev => prev.filter(u => u.id_app_user !== id));
      toast.success("Usuário deletado!");
    } catch {
      toast.error("Erro ao deletar");
    }
  }

  async function save(id: any, payload: Partial<IApplicationUser>) {
    try {
      const updated = await updateAppUser(id, payload);

      setUsers(prev =>
        prev.map(u => (u.id_app_user === id ? updated : u))
      );

      toast.success("Atualizado!");
    } catch {
      toast.error("Erro ao atualizar");
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
  };
}
