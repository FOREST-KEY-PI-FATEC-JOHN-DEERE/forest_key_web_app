"use client";

import { Loader2 } from "lucide-react";

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
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !loading && onCancel()}
      />
      <div className="relative z-10 w-full max-w-sm rounded-md bg-white shadow-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold mb-2">
          Confirmar exclusão
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Tem certeza que deseja excluir o usuário de aplicação{" "}
          <strong>{appName ?? ""}</strong>? Esta ação não pode ser
          desfeita.
        </p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm()}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md bg-red-600 text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
