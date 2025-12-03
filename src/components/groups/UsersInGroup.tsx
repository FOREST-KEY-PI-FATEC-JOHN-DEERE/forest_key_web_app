"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Loader2, UserX } from "lucide-react";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ConfirmModal";

interface UserInGroup {
    id_access_group_user: string;
    id_user: string;
    admin: boolean;
    first_name: string | null;
    last_name: string | null;
}

interface UsersInGroupProps {
    groupId: string;
    refreshKey?: number;
}

export default function UsersInGroup({ groupId, refreshKey }: UsersInGroupProps) {
    const { t } = useTranslation();
    const [users, setUsers] = useState<UserInGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

   
    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/groups/${groupId}/members`);
            const json = await res.json();

            if (json.success) {
                const formattedUsers: UserInGroup[] = (json.data ?? []).map((item: any) => ({
                    id_access_group_user: item.id_access_group_user,
                    id_user: item.User_Profile?.id_user,
                    admin: item.admin,
                    first_name: item.User_Profile?.first_name,
                    last_name: item.User_Profile?.last_name,
                }));

                setUsers(formattedUsers);
            } else {
                setError(json.error || t("error_loading_members"));
            }
        } catch {
            setError(t("unexpected_error_loading"));
        } finally {
            setLoading(false);
        }
    }, [groupId, t]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers, refreshKey]);

    
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [toRemoveId, setToRemoveId] = useState<string | null>(null);

    const openConfirm = (id_access_group_user: string) => {
        setToRemoveId(id_access_group_user);
        setConfirmOpen(true);
    };

    const handleRemoveConfirmed = async () => {
        if (!toRemoveId) return;
        setConfirmOpen(false);
        setLoading(true);

        try {
            const res = await fetch(
                `/api/groups/${groupId}/members/${toRemoveId}`,
                { method: "DELETE" }
            );

            const json = await res.json();
            if (!json.success) throw new Error(json.error);

            loadUsers();
        } catch (err: any) {
            alert(err.message || t("error_removing"));
        } finally {
            setLoading(false);
            setToRemoveId(null);
        }
    };

    return (
        <div className="space-y-4">

            {/* ✔ Título padronizado */}
            <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
                {t("users_in_group")}
            </h3>

            {/* Erro */}
            {error && (
                <div className="p-3 rounded-md bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("loading")}
                </div>
            )}

            {/* Nenhum usuário */}
            {!loading && users.length === 0 && (
                <div className="
                    flex items-center gap-2 p-4 
                    rounded-lg border border-[var(--color-divider)]
                    bg-[var(--color-card)]
                    text-[var(--color-text-secondary)]
                ">
                    <UserX className="w-5 h-5" />
                    <p>{t("no_users_found")}</p>
                </div>
            )}

            {/* Lista de usuários */}
            {!loading &&
                users.length > 0 &&
                users.map((u) => (
                    <div
                        key={u.id_access_group_user}
                        className="
                            w-full p-4
                            bg-[var(--color-card)]
                            border border-[var(--color-divider)]
                            text-[var(--color-foreground)]
                            rounded-lg 
                            flex justify-between items-center
                            hover:shadow-md transition
                        "
                    >
                        <div className="truncate">
                            <p className="font-medium text-[var(--color-foreground)] truncate">
                                {u.first_name || "Usuário"} {u.last_name || ""}
                                {u.admin && (
                                    <span
                                        className="
                                            ml-2 px-2 py-0.5 text-xs font-semibold
                                            rounded-full
                                            bg-yellow-200 text-yellow-900
                                            dark:bg-yellow-900 dark:text-yellow-300
                                        "
                                    >
                                        Admin
                                    </span>
                                )}
                            </p>

                            <p className="text-xs text-[var(--color-text-secondary)]">
                                ID Ligação: {u.id_access_group_user.slice(0, 8)}...
                            </p>

                            <p className="text-xs text-[var(--color-text-secondary)]">
                                ID Usuário: {u.id_user.slice(0, 8)}...
                            </p>
                        </div>

                        {/* Botão Remover */}
                        <Button
                            onClick={() => openConfirm(u.id_access_group_user)}
                            intent="negative"
                            size="sm"
                            className="shrink-0"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            <ConfirmModal
                open={confirmOpen}
                title={t("confirm_delete") || "Confirm deletion"}
                message={t("confirm_delete_member_message") || "Tem certeza que deseja remover este membro do grupo?"}
                confirmLabel={t("delete") || "Excluir"}
                cancelLabel={t("cancel") || "Cancelar"}
                onCancel={() => { setConfirmOpen(false); setToRemoveId(null); }}
                onConfirm={handleRemoveConfirmed}
                loading={loading}
            />
        </div>
    );
}
