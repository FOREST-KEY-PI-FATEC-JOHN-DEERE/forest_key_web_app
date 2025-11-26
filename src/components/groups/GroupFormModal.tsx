"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface GroupFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGroup: { id_access_group: string; name: string | null } | null;
  onSave: () => void;
}

export default function GroupFormModal({
  isOpen,
  onClose,
  currentGroup,
  onSave,
}: GroupFormModalProps) {
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!currentGroup;

  useEffect(() => {
    if (isOpen) {
      setGroupName(currentGroup?.name || "");
      setError(null);
    }
  }, [isOpen, currentGroup]);

  const handleSave = async () => {
    if (!groupName.trim()) {
      setError(t("group_name_required"));
      return;
    }

    setLoading(true);
    setError(null);

    const apiPath = isEditing
      ? `/api/groups/${currentGroup?.id_access_group}`
      : "/api/groups";

    const method = isEditing ? "PATCH" : "POST";

    try {
      const res = await fetch(apiPath, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName.trim() }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || t("unknown_error"));
      }

      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div
        className="
          w-full max-w-md 
          rounded-xl shadow-xl 
          p-6 
          bg-[var(--color-card)] 
          text-[var(--color-foreground)]
          border border-[var(--color-divider)]
        "
      >

        {/* Título */}
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? t("edit_group") : t("create_group")}
        </h2>

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {error && (
            <div className="
              mb-4 p-3 rounded-md 
              bg-red-100 dark:bg-red-900 
              text-red-700 dark:text-red-200
            ">
              {error}
            </div>
          )}

          {/* Campo Nome */}
          <div className="mb-4">
            <label
              className="
                block text-sm font-medium mb-1 
                text-[var(--color-foreground)]
              "
            >
              {t("group_name")}
            </label>

            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={loading}
              className="
                w-full px-3 py-2 rounded-md
                bg-[var(--color-card)]
                border border-[var(--color-divider)]
                text-[var(--color-foreground)]
                focus:ring-2
                outline-none
              "
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                px-4 py-2 rounded-md
                border border-[var(--color-divider)]
                text-[var(--color-foreground)]
                hover:bg-[var(--color-divider)]
                transition
              "
            >
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                px-4 py-2 rounded-md
                bg-blue-600 text-white
                hover:bg-blue-700 
                disabled:opacity-50
                transition
              "
            >
              {loading ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
