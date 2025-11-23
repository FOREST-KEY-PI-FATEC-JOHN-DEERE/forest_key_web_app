"use client"

import React from 'react';
import Link from 'next/link';
import { Key, Users, Layout } from 'lucide-react';

interface LinkItem { href: string; label: string; icon: React.ElementType; color?: string }

const QuickLinks: React.FC = () => {
  const items: LinkItem[] = [
    { href: '/app_users', label: 'App Users', icon: Key, color: 'from-indigo-500 to-purple-500' },
    { href: '/groups', label: 'Groups', icon: Users, color: 'from-green-400 to-teal-500' },
    { href: '/dashboard', label: 'Dashboard', icon: Layout, color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Link key={it.href} href={it.href} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/5 dark:bg-gray-800/60 border border-white/5 hover:bg-white/6 transition">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-md flex items-center justify-center text-white bg-gradient-to-br ${it.color}`}>
                <Icon className="w-5 h-5 opacity-90" />
              </div>
              <span className="text-sm font-medium text-gray-100">{it.label}</span>
            </div>
            <span className="text-xs text-gray-400">Abrir →</span>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickLinks;
