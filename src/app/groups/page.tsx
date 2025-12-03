"use client";

import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useTranslation } from 'react-i18next';
import MainLayout from "@/components/MainLayout";
import { Plus, Users, Edit2, Trash2 } from "lucide-react";
import Button from '@/components/ui/Button';
import GroupRowActions from '@/components/groups/GroupRowActions';
import Pagination from '@/components/app_users/Pagination';
import GroupFormModal from "@/components/groups/GroupFormModal";
import SuccessModal from "@/components/SuccessModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";


interface AccessGroup {
  id_access_group: string;
  name: string | null;
  description: string | null;
  created_at: string;
  created_by: string | null;
  owner?: string | null;
  backup?: string | null;
}

export default function GroupsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [groups, setGroups] = useState<AccessGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersMap, setUsersMap] = useState<Record<string, { first_name: string | null; last_name: string | null; email?: string | null }>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AccessGroup | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successShowOk, setSuccessShowOk] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadGroups = async () => {
    try {
      const resUsers = await fetch("/api/users");
      const jsonUsers = await resUsers.json();
      // Prefer querying the server for groups related to the currently authenticated user
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (stored) {
          const u = JSON.parse(stored);
          const userId = u?.id || null;
          if (userId) {
            const resMine = await fetch('/api/groups/mine', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
            const jsonMine = await resMine.json();
            if (jsonMine.success) {
              setGroups(jsonMine.data || []);
            } else {
              setGroups([]);
            }
          } else {
            setGroups([]);
          }
        } else {
          // no logged user -> do not expose full groups list here
          setGroups([]);
        }
      } catch (err) {
        console.error('Erro ao carregar grupos filtrados:', err);
        setGroups([]);
      }

      if (jsonUsers.success) {
        const map: Record<string, { first_name: string | null; last_name: string | null; email?: string | null }> = {};
        (jsonUsers.data || []).forEach((u: any) => {
          if (u?.id_user) map[u.id_user] = { first_name: u.first_name ?? null, last_name: u.last_name ?? null, email: u.email ?? null };
        });
        setUsersMap(map);
      }
    } catch (err) {
      console.error("Falha ao carregar grupos", err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (stored) {
          const u = JSON.parse(stored);
          setCurrentUserId(u?.id || null);
        }
      } catch {}

      await loadGroups();
      setLoading(false);
    })();
  }, []);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return groups;
    return groups.filter((g) => {
      const name = (g.name || '').toLowerCase();
      const desc = (g.description || '').toLowerCase();
      const createdBy = (g.created_by || '').toLowerCase();
      const createdAt = new Date(g.created_at).toLocaleDateString('pt-BR');
      return name.includes(term) || desc.includes(term) || createdBy.includes(term) || createdAt.includes(term);
    });
  }, [groups, searchTerm]);

  const totalItems = filteredGroups.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedGroups = filteredGroups.slice((safeCurrentPage - 1) * pageSize, (safeCurrentPage - 1) * pageSize + pageSize);
  const groupsIsSmall = paginatedGroups.length < 5;
  const groupsIsVerySmall = paginatedGroups.length === 1;
  const groupsPadding = groupsIsVerySmall ? 'py-8' : (groupsIsSmall ? 'py-6' : 'py-4');

  const goToPage = (page: number) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  const openCreateModal = () => {
    setEditingGroup(null);
    setModalOpen(true);
  };

  const openEditModal = (group: AccessGroup) => {
    setEditingGroup(group);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!toDeleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/groups/${toDeleteId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        await loadGroups();
        // show brief success without OK button for delete flow
        setSuccessMessage(t('group_deleted') || 'Group deleted');
        setSuccessShowOk(false);
        setSuccessModalOpen(true);
      } else {
        alert(json.error || t('unknown_error') || 'Erro desconhecido');
      }
    } catch (err) {
      alert("Erro desconhecido");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  };

  return (
    <MainLayout pageTitle="Gerenciamento  Grupos">
      <div className="space-y-7">

        {/* Cabeçalho */}
        <div className="flex justify-between items-end gap-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={t('search_groups') || 'Search groups...'}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded border bg-[var(--color-card)] text-[var(--color-foreground)] border-[var(--color-divider)]"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="text-sm text-gray-500">{t('clear') || 'Clear'}</button>
            )}
          </div>

            <Button onClick={openCreateModal} className="flex items-center gap-2" size="md">
            <Plus className="w-4 h-4" />
            {t('create_group') || 'Create Group'}
          </Button>
        </div>

        {/* Table List */}
        <div className="border rounded-md shadow-sm overflow-x-auto bg-[var(--color-card)] text-[var(--color-foreground)] border-[var(--color-divider)]">
          <table className="min-w-full divide-y">
            <thead>
              <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('group_name') || 'Group name'}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('owner') || 'Owner'}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('backup') || 'Backup'}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('created_at') || 'Created at'}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('created_by') || 'Created by'}</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">{t('actions') || 'Actions'}</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    {t('loading') || 'Loading...'}
                  </td>
                </tr>
              )}

              {!loading && paginatedGroups.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    {t('no_groups_found') || 'No groups found.'}
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedGroups.map((g, i) => (
                  <tr key={g.id_access_group} className="group transition-colors hover:bg-[var(--color-divider)]/10">
                    <td className={`px-6 ${groupsPadding} whitespace-nowrap`}>
                      <div className="text-sm font-medium">{g.name}</div>
                    </td>

                    <td className={`px-6 ${groupsPadding} whitespace-nowrap text-sm`}>
                      {(() => {
                        const id = g.owner;
                        if (!id) return <span className="text-[var(--color-text-secondary)]">-</span>;
                        const u = usersMap[id];
                        if (!u) return <span className="text-[var(--color-text-secondary)]">{id.slice(0,8)}...</span>;
                        const name = `${u.first_name || ''} ${u.last_name || ''}`.trim();
                        return name ? `${name} ${u.email ? `(${u.email})` : ''}` : (u.email || id.slice(0,8)+'...');
                      })()}
                    </td>

                    <td className={`px-6 ${groupsPadding} whitespace-nowrap text-sm`}>
                      {(() => {
                        const id = g.backup;
                        if (!id) return <span className="text-[var(--color-text-secondary)]">-</span>;
                        const u = usersMap[id];
                        if (!u) return <span className="text-[var(--color-text-secondary)]">{id.slice(0,8)}...</span>;
                        const name = `${u.first_name || ''} ${u.last_name || ''}`.trim();
                        return name ? `${name} ${u.email ? `(${u.email})` : ''}` : (u.email || id.slice(0,8)+'...');
                      })()}
                    </td>

                    <td className={`px-6 ${groupsPadding} whitespace-nowrap text-sm`}>
                      {new Date(g.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className={`px-6 ${groupsPadding} whitespace-nowrap text-sm`}>
                      {(() => {
                        const id = g.created_by;
                        if (!id) return <span className="text-[var(--color-text-secondary)]">-</span>;
                        const u = usersMap[id];
                        if (!u) return <span className="text-[var(--color-text-secondary)]">{id.slice(0,8)}...</span>;
                        const name = `${u.first_name || ''} ${u.last_name || ''}`.trim();
                        return name ? `${name} ${u.email ? `(${u.email})` : ''}` : (u.email || id.slice(0,8)+'...');
                      })()}
                    </td>

                    <td className={`px-6 ${groupsPadding} whitespace-nowrap text-right text-sm`}>
                      <div className="flex items-center justify-end">
                        <GroupRowActions
                          onMembers={() => router.push(`/groups/${g.id_access_group}/members`)}
                          onEdit={() => openEditModal(g)}
                          onDelete={() => handleDelete(g.id_access_group)}
                          showEditDelete={Boolean(currentUserId && (currentUserId === g.owner || currentUserId === g.backup || currentUserId === g.created_by))}
                          forceUp={!groupsIsSmall && i >= Math.max(0, paginatedGroups.length - 3)}
                          isSmallList={groupsIsSmall}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              pageSize={pageSize}
              setPageSize={(s) => { setPageSize(s); setCurrentPage(1); }}
              totalItems={totalItems}
            />
          </div>
        )}
      </div>

      <GroupFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentGroup={editingGroup}
        onSave={async () => {
          setModalOpen(false);
          await loadGroups();
          setSuccessMessage(editingGroup ? (t('group_updated') || 'Group updated') : (t('group_created') || 'Group created'));
          setSuccessShowOk(true);
          setSuccessModalOpen(true);
        }}
      />
      <SuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} message={successMessage} showOkButton={successShowOk} variant={'success'} />
      <ConfirmModal
        open={confirmOpen}
        title={t('confirm_delete_group') || 'Confirm delete'}
        message={t('confirm_delete_group_message') || 'Are you sure you want to delete this group?'}
        confirmLabel={t('delete') || 'Excluir'}
        cancelLabel={t('cancel') || 'Cancelar'}
        onCancel={() => { setConfirmOpen(false); setToDeleteId(null); }}
        onConfirm={handleDeleteConfirmed}
        loading={deleting}
      />
    </MainLayout>
  );
}
