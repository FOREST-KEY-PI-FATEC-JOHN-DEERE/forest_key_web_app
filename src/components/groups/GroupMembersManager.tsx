"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import UsersInGroup from "./UsersInGroup";
import AddUsersToGroup from "./AddUsersToGroup";

interface GroupMembersManagerProps {
    groupId: string;
}

export default function GroupMembersManager({ groupId }: GroupMembersManagerProps) {
    const { t } = useTranslation();

    const [listKey, setListKey] = useState(0);
    const [groupName, setGroupName] = useState<string>("");
    const [groupOwner, setGroupOwner] = useState<string | null>(null);
    const [groupBackup, setGroupBackup] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [canAdd, setCanAdd] = useState<boolean>(false);

    // Buscar nome do grupo
    useEffect(() => {
        async function loadGroup() {
            try {
                const res = await fetch(`/api/groups/${groupId}`);
                const json = await res.json();

                if (json.success && json.data) {
                    setGroupName(json.data.name || "");
                    setGroupOwner(json.data.owner ?? null);
                    setGroupBackup(json.data.backup ?? null);
                }
            } catch (err) {
                console.error("Erro ao carregar nome do grupo", err);
            }
        }

        loadGroup();
    }, [groupId]);

    const handleUserAdded = useCallback(() => {
        setListKey(prev => prev + 1);
    }, []);

    // load current user id from localStorage and compute permission to add
    useEffect(() => {
        try {
            const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            if (stored) {
                const u = JSON.parse(stored);
                setCurrentUserId(u?.id || null);
            }
        } catch {}
    }, []);

    useEffect(() => {
        // compute canAdd when we have groupOwner/Backup/currentUserId
        async function evaluatePermission() {
            if (!currentUserId) {
                setCanAdd(false);
                return;
            }

            if (groupOwner === currentUserId || groupBackup === currentUserId) {
                setCanAdd(true);
                return;
            }

            try {
                const res = await fetch(`/api/groups/${groupId}/members`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    const found = json.data.find((m: any) => m.User_Profile?.id_user === currentUserId && m.admin === true);
                    setCanAdd(Boolean(found));
                } else {
                    setCanAdd(false);
                }
            } catch (err) {
                console.error('Error checking membership admin status', err);
                setCanAdd(false);
            }
        }

        evaluatePermission();
    }, [currentUserId, groupOwner, groupBackup, groupId]);

    return (
        <div
            className="
                container mx-auto 
                p-4 sm:p-6 lg:p-8 
                space-y-8 
                bg-[var(--color-card)] 
                text-[var(--color-foreground)]
                border border-[var(--color-divider)]
                rounded-lg 
                shadow-xl
            "
        >
            {/* ✦ TÍTULO COM NOME DO GRUPO */}
            <h1 className="
            text-2xl sm:text-3xl 
            font-semibold 
            text-[var(--color-foreground)]
        ">
             {t("group_members")}: {groupName}
            </h1>



            {/* ✦ Adicionar usuário */}
            {canAdd ? (
                <AddUsersToGroup 
                    groupId={groupId}
                    onUserAdded={handleUserAdded}
                />
            ) : (
                <div className="p-4 rounded-md bg-[var(--color-card)] border border-[var(--color-divider)] text-[var(--color-text-secondary)]">
                    {t('no_permission_add_members') || 'Você não tem permissão para adicionar membros a este grupo.'}
                </div>
            )}

            {/* ✦ Listar usuários */}
            <div className="pt-4">
                <UsersInGroup 
                    groupId={groupId}
                    key={listKey}
                />
            </div>
        </div>
    );
}
