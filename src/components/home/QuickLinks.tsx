"use client"

import React from 'react';
import Link from 'next/link';
import { Key, Users, Layout, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LinkItem { href: string; keyLabel: string; icon: React.ElementType; color?: string }

const QuickLinks: React.FC = () => {
  const { t } = useTranslation();

  const items: LinkItem[] = [
    { href: '/app_users', keyLabel: 'app_users', icon: Key, color: 'from-indigo-600 to-violet-500' },
    { href: '/groups', keyLabel: 'groups', icon: Users, color: 'from-emerald-500 to-teal-400' },
    { href: '/dashboard', keyLabel: 'dashboard', icon: Layout, color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <Link key={it.href} href={it.href} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-white/3 dark:bg-gray-800/50 border border-white/5 hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white bg-gradient-to-br ${it.color} shadow-md`}> 
                <Icon className="w-6 h-6 opacity-95" />
              </div>
              <span className="text-sm font-semibold text-gray-100">{t(it.keyLabel)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{t('go')}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickLinks;
