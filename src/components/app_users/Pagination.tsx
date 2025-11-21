"use client";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  goToPage,
  pageSize,
  setPageSize,
  totalItems,
}: PaginationProps) {
  const { t } = useTranslation();

  // Cria os números de página para renderizar
  const renderPageNumbers = () => {
    const pages: number[] = [];
    const maxToShow = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxToShow - 1);

    if (end - start < maxToShow - 1) {
      start = Math.max(1, end - maxToShow + 1);
    }

    for (let p = start; p <= end; p++) pages.push(p);
    return pages.map((p) => (
      <button
        key={p}
        type="button"
        onClick={() => goToPage(p)}
        className={`px-2 py-1 text-xs rounded border ${
          p === currentPage
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
      >
        {p}
      </button>
    ));
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-gray-600 dark:text-gray-300">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <span>{t("show") || "Show"}</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            goToPage(1);
          }}
          className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 text-[12px]"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>{t("per_page") || "per page"}</span>
      </div>

      {/* Page numbers */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-40"
          >
            «
          </button>
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-40"
          >
            ‹
          </button>

          {renderPageNumbers()}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-40"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-700 disabled:opacity-40"
          >
            »
          </button>
        </div>
      )}

      {/* Total items */}
      <div className="flex items-center justify-end">
        <span>
          {t("total") || "Total"}: <strong>{totalItems}</strong> {t("records") || "records"}
        </span>
      </div>
    </div>
  );
}
