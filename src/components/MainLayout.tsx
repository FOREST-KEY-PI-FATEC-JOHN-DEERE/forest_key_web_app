import React from 'react';

import Sidebar from '@/components/Sidebar'; 

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <Sidebar /> 
      
      <main className={`flex-1 transition-all duration-300`}>
        <div className="p-8 w-full max-w-screen-xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
};

export default MainLayout;