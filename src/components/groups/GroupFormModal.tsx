"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import AddUsersToGroup from "./AddUsersToGroup";
import UsersInGroup from "./UsersInGroup";
import SuccessModal from "@/components/SuccessModal";
import { supabase } from '@/utils/supabase/client';

interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGroup: { id_access_group: string; name: string | null; description?: string | null; owner?: string | null; backup?: string | null } | null;
  onSave: () => void;
}

export default function GroupFormModal({
  isOpen,
  onClose,
  currentGroup,
  onSave,
}: GroupFormModalProps) {
  const { t } = useTranslation();

  const [step, setStep] = useState<1 | 2>(1);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [backupId, setBackupId] = useState("");
  const [usersList, setUsersList] = useState<Array<any>>([]);
  // users provided by /api/users: { id_user, first_name, last_name, email? }
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdGroupId, setCreatedGroupId] = useState<string | null>(null);
  const [membersRefresh, setMembersRefresh] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState<'success' | 'error'>('success');
  

  const isEditing = !!currentGroup;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setGroupName(currentGroup?.name || "");
      setDescription(currentGroup?.description || "");
      setOwnerId(currentGroup?.owner || "");
      setBackupId(currentGroup?.backup || "");
      setCreatedGroupId(currentGroup?.id_access_group || null);
      setError(null);
      loadUsersForSelect();
      loadCurrentUserName();
    }
  }, [isOpen, currentGroup]);

  const loadCurrentUserName = async () => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (!stored) return;
      const authUser = JSON.parse(stored);
      const userId = authUser?.id;
      if (!userId) return;

      setCurrentUserId(userId);
    } catch (err) {
      // ignore
    }
  };

  const loadUsersForSelect = async () => {
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success) setUsersList(json.data || []);
    } catch (err) {
      // ignore silently
    }
  };

  const handleSaveStep1 = async () => {
    if (!groupName.trim()) {
      setError(t("group_name_required") || "Group name required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
        if (isEditing && currentGroup) {
        const res = await fetch(`/api/groups/${currentGroup.id_access_group}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: groupName.trim(),
              description,
              owner: ownerId || null,
              backup: backupId || null,
              created_by: currentUserId ?? null,
          }),
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.error || t("unknown_error"));
        setCreatedGroupId(currentGroup.id_access_group);
        } else {
        const res = await fetch(`/api/groups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: groupName.trim(),
              description,
              owner: ownerId || null,
              backup: backupId || null,
              created_by: currentUserId ?? null,
          }),
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.error || t("unknown_error"));

        const newGroup = json.data;
        setCreatedGroupId(newGroup?.id_access_group || null);
      }
      // move to step 2 (manage members)
      setStep(2);
    } catch (err: any) {
      setError(err.message || t("unknown_error"));
      setModalVariant('error');
      setModalMessage(err.message || t("unknown_error"));
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    // Close the form and call the parent's save handler; parent will show success modal
    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="w-full max-w-4xl rounded-xl shadow-xl bg-[var(--color-card)] text-[var(--color-foreground)] border border-[var(--color-divider)]">
        <div className="p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-semibold">{isEditing ? t("edit_group") : t("create_group")}</h2>
          <button aria-label="close" onClick={onClose} className="ml-4 rounded-md p-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-divider)]/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 && (
          <div>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">{error}</div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("group_name")}</label>
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-divider)] text-[var(--color-foreground)]" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("description") || "Description"}</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-divider)] text-[var(--color-foreground)]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("owner") || "Owner"}</label>
                  <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} className="w-full px-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-divider)] text-[var(--color-foreground)]">
                    <option value="">{t("select_user") || "Select user"}</option>
                    {usersList.map((u: any) => {
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
                        label = "Unknown";
                      }

                      return <option key={u.id_user} value={u.id_user}>{label}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{t("backup") || "Backup"}</label>
                  <select value={backupId} onChange={(e) => setBackupId(e.target.value)} className="w-full px-3 py-2 rounded-md bg-[var(--color-card)] border border-[var(--color-divider)] text-[var(--color-foreground)]">
                    <option value="">{t("select_user") || "Select user"}</option>
                    {usersList.map((u: any) => {
                      const name = `${u.first_name || ''} ${u.last_name || ''}`.trim();
                      const label = u.email || (name.length ? name : (u.id_user ? `${u.id_user.slice(0,8)}...` : "Unknown"));
                      return (
                        <option key={u.id_user} value={u.id_user}>{label}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={handleSaveStep1} disabled={loading || !groupName.trim()} className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                <span className="sr-only">{t('next') || 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">{t("add_members") || "Add members"}</h3>

            {createdGroupId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AddUsersToGroup groupId={createdGroupId} onUserAdded={() => setMembersRefresh((c) => c + 1)} />
                <UsersInGroup groupId={createdGroupId} refreshKey={membersRefresh} />
              </div>
            ) : (
              <div className="p-4 text-sm text-[var(--color-text-secondary)]">{t("group_create_first") || "Create the group first to manage members."}</div>
            )}

            <div className="flex justify-between gap-3 mt-6">
              <button type="button" onClick={() => setStep(1)} className="px-3 py-2 rounded-md border border-[var(--color-divider)] flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-3">
                <button type="button" onClick={handleFinish} className="px-4 py-2 rounded-md bg-blue-600 text-white">{t("finish") || "Finish"}</button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
    <SuccessModal isOpen={modalOpen} onClose={() => { setModalOpen(false); }} message={modalMessage} showOkButton={true} variant={modalVariant} />
    </>
  );
}
