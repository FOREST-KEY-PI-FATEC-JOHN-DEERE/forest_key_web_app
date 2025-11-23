"use client"

import React from 'react';

const RecentActivity: React.FC = () => {
  const items = [
    { id: 1, text: 'Login em 23/11/2025', time: '14:54' },
    { id: 2, text: 'Alteração de permissão', time: '13:10' },
    { id: 3, text: 'Criado novo app_user', time: '09:02' },
  ];

  return (
    <div className="hidden md:block bg-[var(--color-card)] p-4 rounded-lg">
      <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
      <ul className="flex flex-col gap-3">
        {items.map(it => (
          <li key={it.id} className="text-sm text-gray-300 flex items-center justify-between">
            <span>{it.text}</span>
            <span className="text-xs text-gray-400">{it.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentActivity;
