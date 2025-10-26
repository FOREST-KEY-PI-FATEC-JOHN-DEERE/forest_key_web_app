"use client"

import React from 'react';
import Sidebar from '@/components/Sidebar'; 
import Header from '@/components/Header'; 

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string; 
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle }) => {
  const contentClasses = 'flex-1 transition-all duration-300'; 

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <Sidebar /> 
      
<main className={contentClasses}>
        
        {/* NOVO CONTÊINER: Aplica margens externas, arredondamento e fundo branco ao conteúdo */}
        <div className="m-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg min-h-[calc(100vh-2rem)]">
            
            {/* O Header fica aqui, com padding horizontal para o contêiner */}
            <div className="px-8">
              <Header pageTitle={pageTitle} />
            </div>
            <br></br>
            {/* O conteúdo da página */}
            <div className="px-8 pb-8 w-full max-w-screen-xl mx-auto">
              {children}
            </div>
        </div>
      </main>
      
    </div>
  );
};

export default MainLayout;