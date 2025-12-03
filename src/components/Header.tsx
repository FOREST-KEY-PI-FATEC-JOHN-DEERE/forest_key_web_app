"use client"

import React from 'react';
import { FaUniversalAccess } from 'react-icons/fa'; // Ícone de acessibilidade
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  pageTitle: string; // Título da página (ex: "Lista de Usuários de Aplicação")
}

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  return (
    // O Header é fixo no topo, com largura total e sombra
   <header className="sticky top-0 z-40 w-full">
      <div className="flex justify-between items-center h-20 px-8">
        
        {/* Lado Esquerdo: Título da Página */}
        <h1 className="text-2xl font-bold">
          {pageTitle}
        </h1>
        
        {/* Lado Direito: Acessibilidade e Idioma */}
        <div className="flex items-center space-x-4">
          
          {/* Ícone de Acessibilidade (Pode ser um botão funcional ou apenas um ícone) */}
          {/* <button
            className="p-2 rounded-full transition duration-150"
            title="Opções de Acessibilidade"
          >
            <FaUniversalAccess className="h-7 w-7" />
          </button> */}
          
          {/* Seletor de Idioma com a Bandeira */}
          <LanguageSwitcher />
          
        </div>
      </div>
      
      <div className="h-px w-full" />
    </header>
  );
};

export default Header;