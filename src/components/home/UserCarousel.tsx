"use client"

import React from 'react';
import UserPreviewCard from './UserPreviewCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type AppUser = {
  id_app_user: string;
  application_name: string;
  created_at: string;
  created_by?: string | null;
};

interface Props {
  users: AppUser[];
  index: number;
  setIndex: (i: number) => void;
}

const UserCarousel: React.FC<Props> = ({ users, index, setIndex }) => {
  if (!users || users.length === 0) return null;

  // show ~2.5 cards: each card 40% width
  const cardWidth = 40; // percent
  const gap = 4; // percentage gap

  // translate so that index is centered (attempt)
  const offset = Math.max(0, (index - 1) * (cardWidth + gap));

  return (
    <div className="bg-transparent">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <button aria-label="prev" onClick={() => setIndex((index - 1 + users.length) % users.length)} className="p-2 rounded-full bg-white/5 dark:bg-white/5 border border-white/5 hover:bg-white/10 transition">
            <ChevronLeft className="w-4 h-4 text-white/90" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex items-stretch gap-4 transition-transform duration-500" style={{ transform: `translateX(-${offset}%)` }}>
            {users.map((u, i) => {
              const isActive = i === index;
              return (
                <div key={u.id_app_user} style={{ flex: '0 0 40%' }} className={`transform transition duration-300 ${isActive ? 'scale-100' : 'scale-95 opacity-90'}`}>
                  <UserPreviewCard variant="large" id={u.id_app_user} name={u.application_name} created_at={u.created_at} created_by={u.created_by} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-shrink-0">
          <button aria-label="next" onClick={() => setIndex((index + 1) % users.length)} className="p-2 rounded-full bg-white/5 dark:bg-white/5 border border-white/5 hover:bg-white/10 transition">
            <ChevronRight className="w-4 h-4 text-white/90" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {users.map((u, i) => (
          <button key={u.id_app_user} onClick={() => setIndex(i)} className={`w-3 h-3 rounded-full ${i === index ? 'bg-indigo-500' : 'bg-gray-300'}`} />
        ))}
      </div>
    </div>
  );
};

export default UserCarousel;
