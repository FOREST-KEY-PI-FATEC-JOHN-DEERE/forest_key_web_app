"use client";

import { Loader2 } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onCancel,
  onConfirm,
  loading,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => { if (!loading) onCancel(); }}
      />
      <div className="relative z-10 w-full max-w-sm rounded-md bg-[var(--color-card)] text-[var(--color-foreground)] shadow-xl border border-[var(--color-divider)] p-6">
        {title && <h2 className="text-sm font-semibold mb-2">{title}</h2>}
        <p className="text-xs mb-4 text-[var(--color-foreground)]">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-3 py-1.5 text-xs rounded-md border border-[var(--color-divider)] text-[var(--color-foreground)] bg-[var(--color-card)]"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-red-600 text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
