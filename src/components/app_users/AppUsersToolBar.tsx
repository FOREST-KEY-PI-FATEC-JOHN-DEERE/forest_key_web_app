"use client";

import { PlusCircle, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchAndActionsProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  setIsModalOpen: (v: boolean) => void;
  handleMassPasswordUpdate: () => void;
  massUpdating: boolean;
  usersLength: number;
}

export default function SearchAndActions({
  searchTerm,
  setSearchTerm,
  setIsModalOpen,
  handleMassPasswordUpdate,
  massUpdating,
  usersLength,
}: SearchAndActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={
          t("filter_placeholder") ||
          "Filter by application, owner, ID or date..."
        }
        className="w-full sm:w-64 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
        >
          <PlusCircle className="w-4 h-4" />
          {t("new_app_user") || "New Application User"}
        </button>

        <button
          type="button"
          onClick={handleMassPasswordUpdate}
          disabled={massUpdating || usersLength === 0}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          {massUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("update_all_passwords") || "Update all passwords"
          )}
        </button>
      </div>
    </div>
  );
}
