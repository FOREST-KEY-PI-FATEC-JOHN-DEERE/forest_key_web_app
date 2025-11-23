"use client"

import React from 'react';
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

  const contentClasses = isHomePage 
    ? 'flex-1 transition-all duration-300 w-full'
    : 'flex-1 transition-all duration-300'; 

  return (
    <div className={`min-h-screen ${isHomePage ? '' : 'flex'}`}> 
      

      {!isHomePage && <Sidebar />} 
      
      <main className={contentClasses}>
    
        <div className="m-4  rounded-xl shadow-lg min-h-[calc(100vh-2rem)]">
            
            <div className="px-8">
              <Header pageTitle={pageTitle} />
            </div>
            <br></br>

            <div className="px-8 pb-8 w-full max-w-screen-xl mx-auto">
              {children}
            </div>
        </div>
      </main>
      
    </div>
  );
};

export default MainLayout;