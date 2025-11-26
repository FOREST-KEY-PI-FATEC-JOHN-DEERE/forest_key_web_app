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

    // Buscar nome do grupo
    useEffect(() => {
        async function loadGroup() {
            try {
                const res = await fetch(`/api/groups/${groupId}`);
                const json = await res.json();

                if (json.success && json.data) {
                    setGroupName(json.data.name || "");
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
            <AddUsersToGroup 
                groupId={groupId}
                onUserAdded={handleUserAdded}
            />

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
