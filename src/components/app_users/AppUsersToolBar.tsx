"use client";
import { PlusCircle, Loader2 } from "lucide-react";

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
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Filtrar por aplicação, responsável, ID ou data..."
      className="w-full sm:w-64 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]"
    />

      <div className="flex items-center gap-3">
        <button onClick={() => setIsModalOpen(true)}>
          <PlusCircle /> New User
        </button>

        <button onClick={handleMassPasswordUpdate} disabled={massUpdating || usersLength === 0}>
          {massUpdating ? <Loader2 className="animate-spin" /> : "Update all passwords"}
        </button>
      </div>
    </div>
  );
}
