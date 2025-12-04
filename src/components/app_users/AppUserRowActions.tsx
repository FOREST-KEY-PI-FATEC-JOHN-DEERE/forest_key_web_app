"use client";

import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from 'react-dom';
import { useTranslation } from "react-i18next";

type AppUserRowActionsProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  forceUp?: boolean;
  isSmallList?: boolean;
};

export default function AppUserRowActions({
  onView,
  onEdit,
  onDelete,
  forceUp = false,
  isSmallList = false,
}: AppUserRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [positionUp, setPositionUp] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuStyles, setMenuStyles] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: isSmallList ? 192 : 160 });
  const { t } = useTranslation();

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen((prev) => !prev);
  }

  useLayoutEffect(() => {
    if (!open) return;
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const width = isSmallList ? 192 : 160;

    setPortalOpen(true);
    setMenuVisible(false);
    const id = requestAnimationFrame(() => {
      const menu = menuRef.current;
      const menuHeight = menu ? menu.offsetHeight : 0;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let up = false;
      if (forceUp) up = true;
      else if (spaceBelow < menuHeight && spaceAbove > menuHeight) up = true;

      const top = up ? rect.top - menuHeight - 8 : rect.bottom + 8;
      const leftRaw = rect.right - width;
      const left = Math.min(Math.max(8, leftRaw), window.innerWidth - width - 8);

      setPositionUp(up);
      setMenuStyles({ top, left, width });
      setMenuVisible(true);
    });

    return () => cancelAnimationFrame(id);
  }, [open, forceUp, isSmallList]);

  // close on outside click
  useLayoutEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!portalOpen) return;
      const menu = menuRef.current;
      const btn = buttonRef.current;
      if (menu && !menu.contains(e.target as Node) && btn && !btn.contains(e.target as Node)) {
        setOpen(false);
        setPortalOpen(false);
        setMenuVisible(false);
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [portalOpen]);

  function handleView(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(false);
    onView();
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(false);
    onEdit();
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen(false);
    onDelete();
  }

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`${isSmallList ? 'p-2' : 'p-1'} rounded-full hover:bg-gray-200 text-gray-600`}
        aria-label="Actions"
      >
        <MoreHorizontal className={`${isSmallList ? 'w-6 h-6' : 'w-5 h-5'}`} />
      </button>

      {portalOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menuStyles.top, left: menuStyles.left, width: menuStyles.width }}
          className={`${menuVisible ? '' : 'invisible'} rounded-md shadow-lg bg-[var(--color-card)] border border-[var(--color-divider)] z-40`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); setPortalOpen(false); setMenuVisible(false); handleView(e); }}
            className={`${isSmallList ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'} flex w-full items-center gap-2 text-left hover:bg-[var(--color-divider)]/10`}
          >
            <Eye className="w-4 h-4" />
            {t('view_history') || 'View history'}
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); setPortalOpen(false); setMenuVisible(false); handleEdit(e); }}
            className={`${isSmallList ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'} flex w-full items-center gap-2 text-left hover:bg-[var(--color-divider)]/10`}
          >
            <Pencil className="w-4 h-4" />
            {t('edit') || 'Edit'}
            {t("edit") || "Edit"}
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); setPortalOpen(false); setMenuVisible(false); handleDelete(e); }}
            className={`${isSmallList ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-xs'} flex w-full items-center gap-2 text-left text-red-600 hover:bg-red-50`}
          >
            <Trash2 className="w-4 h-4" />
            {t('delete') || 'Delete'}
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
