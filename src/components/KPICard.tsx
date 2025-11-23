import React from 'react';
import { FaArrowUp, FaExclamationTriangle, FaCheckCircle, FaLock } from 'react-icons/fa';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  theme: 'success' | 'warning' | 'danger' | 'info'; // Define a cor do card
  description?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, theme, description }) => {
  const themeClasses = {
    success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/15',
    warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/15',
    danger: 'text-rose-600 bg-rose-50 dark:bg-rose-900/15',
    info: 'text-sky-600 bg-sky-50 dark:bg-sky-900/15',
  };

  return (
    <div className="bg-[var(--color-card)]/80 backdrop-blur-sm border border-gray-200/6 dark:border-gray-700/30 shadow-sm rounded-xl p-6 flex flex-col justify-between h-full transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`p-3 rounded-lg flex items-center justify-center shadow-sm ring-1 ring-white/6 ${themeClasses[theme]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex-1 flex items-center justify-center">
        <p className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100">{value}</p>
      </div>

      {description && (
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default KpiCard;