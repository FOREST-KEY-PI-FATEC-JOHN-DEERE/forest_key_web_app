"use client";

import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type AppUserRowActionsProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function AppUserRowActions({
  onView,
  onEdit,
  onDelete,
}: AppUserRowActionsProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen((prev) => !prev);
  }

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
        type="button"
        onClick={handleToggle}
        className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleView}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-gray-100"
          >
            <Eye className="w-4 h-4" />
            {t("click_to_view_history") || "View history"}
          </button>

          <button
            type="button"
            onClick={handleEdit}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-gray-100"
          >
            <Pencil className="w-4 h-4" />
            {t("edit") || "Edit"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            {t("delete") || "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}
