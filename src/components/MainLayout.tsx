"use client"

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar'; 
import Header from '@/components/Header'; 
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string; 
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle }) => {
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return true;
      const v = localStorage.getItem('sidebar_open');
      return v === null ? true : v === '1';
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sidebar_open', isSidebarOpen ? '1' : '0');
    } catch (e) {}
  }, [isSidebarOpen]);

  const [mainMarginLeft, setMainMarginLeft] = useState<string>('0');

  const recalcMargin = () => {
    if (typeof window === 'undefined') return;
    const lg = window.matchMedia('(min-width: 1024px)').matches;
    if (!lg) {
      setMainMarginLeft('0');
      return;
    }
    // sidebar left offset = 1rem (left-4). widths: open=w-64 (16rem), closed=w-24 (6rem)
    setMainMarginLeft(isSidebarOpen ? '17rem' : '7rem');
  };

  useEffect(() => {
    recalcMargin();
    window.addEventListener('resize', recalcMargin);
    return () => window.removeEventListener('resize', recalcMargin);
  }, [isSidebarOpen]);

  const contentClasses = isHomePage
    ? 'flex-1 transition-all duration-300 w-full'
    : 'flex-1 transition-all duration-300';

  return (
    <div className={`min-h-screen ${isHomePage ? '' : 'flex'}`}> 

      {!isHomePage && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />} 

      <main className={contentClasses} style={{ marginLeft: mainMarginLeft }}>
    
        <div className="m-4 rounded-xl shadow-lg min-h-[calc(100vh-2rem)] bg-[var(--color-card)] text-[var(--color-foreground)] border border-[var(--color-divider)]">
            
            <div className="px-8 py-6">
              <Header pageTitle={pageTitle} />
            </div>

            <div className="px-8 pb-8 w-full max-w-screen-xl mx-auto">
              {children}
            </div>
        </div>
      </main>
      
    </div>
  );
};

export default MainLayout;