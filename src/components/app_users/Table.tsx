"use client";

import { Loader2 } from "lucide-react";
import { AppUser } from "./FormAddAppUsers";
import { getExpirationDate, renderExpirationBadge } from "./utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import AppUserRowActions from "./AppUserRowActions";
import { useEffect, useState } from "react";

interface TableAppUsersProps {
  users: AppUser[];
  loading: boolean;
  paginatedUsers: AppUser[];
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
}

export default function TableAppUsers({
  users,
  loading,
  paginatedUsers,
  onEdit,
  onDelete,
}: TableAppUsersProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [adminMap, setAdminMap] = useState<Record<string, boolean>>({});
  const isSmall = paginatedUsers.length < 5;
  const isVerySmall = paginatedUsers.length === 1;
  const rowPadding = isVerySmall ? 'py-8' : (isSmall ? 'py-6' : 'py-4');

  const locale =
    i18n.language === "pt"
      ? "pt-BR"
      : i18n.language === "es"
      ? "es-ES"
      : "en-US";

  useEffect(() => {
    let mounted = true;
    async function loadAdmins() {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        const authUser = stored ? JSON.parse(stored) : null;
        const userId: string | null = authUser?.id ?? null;
        if (!mounted) return;
        setCurrentUserId(userId);

        if (!userId) return;

        const groupIds = Array.from(new Set(paginatedUsers.map((p) => p.id_access_group).filter(Boolean) as string[]));
        const results: Record<string, boolean> = {};

        await Promise.all(groupIds.map(async (gid) => {
          try {
            const res = await fetch(`/api/groups/${gid}/members`);
            const json = await res.json();
            if (!json.success) {
              results[gid] = false;
              return;
            }
            const found = (json.data || []).find((m: any) => (m.id_user === userId || m.User_Profile?.id_user === userId) && m.admin === true);
            results[gid] = Boolean(found);
          } catch (err) {
            results[gid] = false;
          }
        }));

        if (!mounted) return;
        setAdminMap((prev: Record<string, boolean>) => ({ ...prev, ...results }));
      } catch (err) {
        // ignore
      }
    }

    loadAdmins();
    return () => { mounted = false; };
  }, [paginatedUsers]);
    i18n.language === "pt"
      ? "pt-BR"
      : i18n.language === "es"
      ? "es-ES"
      : "en-US";

  return (
    <div className="w-full overflow-visible">
      <div className="border rounded-md shadow-sm overflow-auto w-full max-w-full bg-[var(--color-card)] text-[var(--color-foreground)] border-[var(--color-divider)]">
        <table className="min-w-full divide-y table-auto">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('app_user_name') || 'Application User'}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('created_by') || 'Created by'}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('changed_by') || 'Changed by'}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('status') || 'Status'}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('created_at') || 'Created at'}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('last_update') || 'Last update'}</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">{t('expires_at') || 'Expires at'}</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">{t('actions') || 'Actions'}</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('loading') || 'Loading...'}
                  </div>
                </td>
              </tr>
            )}

            {!loading && paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  {t('no_users_registered') || 'No application users registered yet.'}
                </td>
              </tr>
            )}

            {!loading && paginatedUsers.map((u, i) => {
              const createdAtDate = new Date(u.created_at);
              const lastUpdateDate = u.last_update ? new Date(u.last_update) : null;
              const expiresAtDate = getExpirationDate(u.created_at, u.expire_at);
              const isActive = u.status !== false;

              return (
                <tr
                  key={u.id_app_user}
                  className={`group transition-colors ${isActive ? 'hover:bg-[var(--color-divider)]/10 dark:hover:bg-[var(--color-divider)]/20' : 'bg-[var(--color-card)]/90'}`}>

                  <td className={`px-4 ${rowPadding} align-top break-words`}>
                    <div className="text-sm font-medium break-words">{u.application_name}</div>
                  </td>

                  <td className={`px-4 ${rowPadding} align-top text-sm`}>{u.created_by || '-'}</td>

                  <td className={`px-4 ${rowPadding} align-top text-sm`}>{u.changed_by || '-'}</td>

                  <td className={`px-4 ${rowPadding} align-top text-sm whitespace-nowrap`}>
                    <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-semibold ${isActive ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
                      {isActive ? (t('active') || 'Active') : (t('inactive') || 'Inactive')}
                    </span>
                  </td>

                  <td className={`px-4 ${rowPadding} align-top text-sm whitespace-nowrap`}>{createdAtDate.toLocaleString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>

                  <td className={`px-4 ${rowPadding} align-top text-sm whitespace-nowrap`}>{lastUpdateDate ? lastUpdateDate.toLocaleString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>

                  <td className={`px-4 ${isSmall ? 'py-6' : rowPadding} align-top text-sm whitespace-nowrap`}>
                    <div className="flex flex-col gap-1">
                      <span>{expiresAtDate.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      {renderExpirationBadge(expiresAtDate)}
                    </div>
                  </td>

                  <td className={`px-6 ${rowPadding} align-top text-right text-sm whitespace-nowrap`}>
                    <AppUserRowActions
                      onView={() => router.push(`/history/${u.id_app_user}`)}
                      onEdit={() => onEdit(u)}
                      onDelete={() => onDelete(u)}
                      showEditDelete={Boolean(currentUserId && u.id_access_group && adminMap[u.id_access_group])}
                      forceUp={!isSmall && i >= Math.max(0, paginatedUsers.length - 3)}
                      isSmallList={isSmall}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
