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
    success: 'bg-green-500/10 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    warning: 'bg-yellow-500/10 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    danger: 'bg-red-500/10 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    info: 'bg-blue-500/10 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col justify-between h-full border border-gray-200 dark:border-gray-700 transition duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`p-2 rounded-full ${themeClasses[theme]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>

      {description && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};

export default KpiCard;