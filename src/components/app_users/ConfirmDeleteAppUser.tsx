"use client";

import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

type ConfirmDeleteAppUserProps = {
  open: boolean;
  appName?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
};

export default function ConfirmDeleteAppUser({
  open,
  appName,
  onCancel,
  onConfirm,
  loading,
}: ConfirmDeleteAppUserProps) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !loading && onCancel()}
      />
      <div className="relative z-10 w-full max-w-sm rounded-md bg-white shadow-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold mb-2">
          {t("confirm_delete_title") || "Confirm deletion"}
        </h2>

        <p className="text-xs text-gray-600 mb-4">
          {(t("confirm_delete_message_prefix") ||
            "Are you sure you want to delete the application user")}{" "}
          <strong>{appName ?? ""}</strong>?{" "}
          {t("confirm_delete_message_suffix") ||
            "This action cannot be undone."}
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700"
          >
            {t("cancel") || "Cancel"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-red-600 text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            {t("delete") || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
