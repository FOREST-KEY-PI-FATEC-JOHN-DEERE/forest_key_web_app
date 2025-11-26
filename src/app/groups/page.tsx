"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Plus, Users, Edit2, Trash2 } from "lucide-react";
import GroupFormModal from "@/components/groups/GroupFormModal";
import { useRouter } from "next/navigation";


interface AccessGroup {
  id_access_group: string;
  name: string | null;
  created_at: string;
}

export default function GroupsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState<AccessGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AccessGroup | null>(null);

  const loadGroups = async () => {
    try {
      const res = await fetch("/api/groups");
      const json = await res.json();

      if (json.success) {
        setGroups(json.data);
      }
    } catch (err) {
      console.error("Falha ao carregar grupos", err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadGroups();
      setLoading(false);
    })();
  }, []);

  const openCreateModal = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  const openEditModal = (group: AccessGroup) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este grupo?")) return;

    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: "DELETE",
      });

      const json = await res.json();

      if (json.success) {
        loadGroups();
      }
    } catch (err) {
      alert("Erro desconhecido");
    }
  };

  return (
    <MainLayout pageTitle="Gerenciamento  Grupos">
      <div className="space-y-7">

        {/* Cabeçalho */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-[var(--color-foreground)]">
            Gerenciamento de Grupos
          </h1>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-4" />
            Criar Grupo
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {loading && (
            <p className="text-[var(--color-text-secondary)]">Carregando...</p>
          )}

          {!loading && groups.length === 0 && (
            <p className="text-[var(--color-text-secondary)]">
              Nenhum grupo encontrado.
            </p>
          )}

          {groups.map((g) => (
            <div
              key={g.id_access_group}
              className="
                w-full p-4 
                bg-[var(--color-card)] 
                text-[var(--color-foreground)]
                border border-[var(--color-divider)]
                rounded-lg 
                flex flex-col sm:flex-row 
                justify-between sm:items-center
                gap-4 sm:gap-0
                hover:shadow-md 
                transition
              "
            >
              <p className="font-semibold text-[var(--color-foreground)]">
                {g.name}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    router.push(`/groups/${g.id_access_group}/members`)
                  }
                  className="p-2 rounded-md hover:bg-[var(--color-divider)] transition"
                >
                  <Users className="w-5 h-5 text-blue-300" />
                </button>

                <button
                  onClick={() => openEditModal(g)}
                  className="p-2 rounded-md hover:bg-[var(--color-divider)] transition"
                >
                  <Edit2 className="w-5 h-5 text-green-600" />
                </button>

                <button
                  onClick={() => handleDelete(g.id_access_group)}
                  className="p-2 rounded-md hover:bg-[var(--color-divider)] transition"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GroupFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentGroup={editingGroup}
        onSave={() => {
          setModalOpen(false);
          loadGroups();
        }}
      />
    </MainLayout>
  );
}
