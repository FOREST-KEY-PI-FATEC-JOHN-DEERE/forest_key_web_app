"use client"

import React from 'react';
import { useTranslation } from 'react-i18next';

const RecentActivity: React.FC = () => {
  const { t } = useTranslation();

  const items = [
    { id: 1, textKey: 'recent.login_success', time: '23/11 14:54', color: 'bg-green-400' },
    { id: 2, textKey: 'recent.permission_change', time: '23/11 13:10', color: 'bg-yellow-400' },
    { id: 3, textKey: 'recent.created_app_user', time: '23/11 09:02', color: 'bg-indigo-400' },
  ];

  return (
    <div className="hidden md:block bg-[var(--color-card)] p-4 rounded-lg">
      <h3 className="text-sm font-semibold mb-3">{t('recent_activity')}</h3>
      <ul className="flex flex-col gap-3">
        {items.map(it => (
          <li key={it.id} className="flex items-start gap-3">
            <div className={`w-2.5 h-2.5 rounded-full mt-1 ${it.color}`} />
            <div className="flex-1">
              <div className="text-sm text-gray-100">{t(it.textKey)}</div>
              <div className="text-xs text-gray-400 mt-0.5">{it.time}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentActivity;
