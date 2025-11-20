"use client";

type AppUsersFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function AppUsersFilter({ value, onChange }: AppUsersFilterProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Filtrar por aplicação, responsável, ID ou data..."
      className="w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F5F1F] focus:border-[#2F5F1F]"
    />
  );
}
