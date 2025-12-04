"use client";

import { PlusCircle, Loader2 } from "lucide-react";
import Button from '@/components/ui/Button';
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
        placeholder={t('filter_placeholder') || 'Filtrar por aplicação, responsável, ID ou data...'}
        className="w-full sm:w-64 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]"
      />

      <div className="flex items-center gap-3">
        <Button onClick={() => setIsModalOpen(true)} size="md" variant="primary" intent="positive" className="inline-flex items-center gap-2 min-w-[160px] justify-center">
          <PlusCircle className="w-4 h-4" />
          {t('create_user') || 'Novo Usuário'}
        </Button>

        <Button
          onClick={handleMassPasswordUpdate}
          size="md"
          variant="secondary"
          intent="none"
          className="inline-flex items-center gap-2 min-w-[200px] justify-center"
          disabled={massUpdating || usersLength === 0}
        >
          {massUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("update_all_passwords") || "Update all passwords"
          )}
        </Button>
      </div>
    </div>
  );
}
