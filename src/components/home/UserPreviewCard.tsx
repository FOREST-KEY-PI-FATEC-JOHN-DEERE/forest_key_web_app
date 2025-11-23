"use client"

import React from 'react';
import { UserCircle } from 'lucide-react';

interface Props {
  id: string;
  name: string;
  created_at: string;
  created_by?: string | null;
  variant?: 'compact' | 'large';
}

const UserPreviewCard: React.FC<Props> = ({ id, name, created_at, created_by, variant = 'compact' }) => {
  const date = new Date(created_at);

  const timestamp = date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (variant === 'large') {
    return (
      <div className="w-full bg-[var(--color-card)] border border-gray-100 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between transition hover:shadow-lg h-full">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center text-white shadow-sm">
            <UserCircle className="w-8 h-8 opacity-90" />
          </div>
          <div className="flex-1">
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">{name}</div>
            <div className="text-sm text-gray-500 mt-1">{created_by || '-'}</div>
          </div>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">{timestamp}</div>
      </div>
    );
  }

  return (
    <div className="w-64 min-w-[16rem] bg-[var(--color-card)] border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex flex-col justify-between transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-slate-700 to-slate-500 flex items-center justify-center text-white shadow-sm">
          <UserCircle className="w-6 h-6 opacity-90" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{name}</div>
          <div className="text-xs text-gray-500">{created_by || '-'}</div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">{timestamp}</div>
    </div>
  );
};

export default UserPreviewCard;
