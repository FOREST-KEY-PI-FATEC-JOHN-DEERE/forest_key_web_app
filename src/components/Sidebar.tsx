"use client"

import React, { useState } from 'react';
import { FaBell, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaChevronLeft, FaBars } from 'react-icons/fa';

const menuItems = [
  { name: 'Usuários de Aplicação', icon: FaUsers, href: '/users', current: false },
  { name: 'Notificações', icon: FaBell, href: '/notifications', current: false },
  { name: 'Dashboard', icon: FaChartBar, href: '/dashboard', current: true }, 
];

const footerItems = [
  { name: 'Configurações', icon: FaCog, href: '/settings' },
  { name: 'Sair', icon: FaSignOutAlt, href: '/logout' },
];

const SIDEBAR_WIDTH_OPEN = 'w-64';
const SIDEBAR_WIDTH_CLOSED = 'w-24'; 
const LOGO_IMAGE_PATH = 'images/john deere logo.svg'; 
const JOHN_DEERE_GREEN = '#367c39';

const AVATAR_SIZE_OPEN = 'w-28 h-28';
const AVATAR_SIZE_CLOSED = 'w-12 h-12';


interface SidebarLinkProps {
  name: string;
  Icon: React.ElementType;
  href: string;
  current?: boolean;
  isOpen: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ name, Icon, href, current = false, isOpen }) => {
  const linkClasses = [
    'flex items-center py-2.5 transition duration-150',
    isOpen ? 'px-3' : 'justify-center',
    current 
      ? 'font-semibold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-700/50 rounded-lg' 
      : 'font-normal text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg',
  ].join(' ');

  return (
    <a href={href} className={linkClasses}>
      <Icon className="h-5 w-5 shrink-0" />
      <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0'}`}>
        {name}
      </span>
    </a>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const sidebarWidth = isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED;
  
  const sidebarClasses = [
    'bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700',
    'flex flex-col z-50 p-4',
    sidebarWidth, 
    'rounded-2xl mt-4 mb-4 ml-4 sticky top-4 transition-all duration-300', 
    'min-h-[calc(100vh-2rem)]', 
  ].join(' ');
  
  const avatarSize = isOpen ? AVATAR_SIZE_OPEN : AVATAR_SIZE_CLOSED;
  const avatarClasses = `${avatarSize} rounded-full bg-gray-500 mx-auto mb-3 transition-all duration-300`;

  return (
    <div className={sidebarClasses}>
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} h-16 mb-4`}>
        <div className={`overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
            <img 
              src={LOGO_IMAGE_PATH} 
              alt="Logo John Deere"
              className="h-8 w-auto" 
            />
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-500 transition duration-150`}
          style={{ color: isOpen ? JOHN_DEERE_GREEN : undefined }} 
        >
          {isOpen 
            ? <FaChevronLeft className="h-5 w-5" /> 
            : <FaBars className="h-5 w-5" />}
        </button>
      </div>

      <div className={`text-center pt-4 pb-6 ${isOpen ? 'mx-0' : 'mx-auto'} transition-all duration-300`}>
        <div className={avatarClasses} role="img" aria-label="Avatar do Usuário">
        </div>
        <p className={`text-base font-medium text-gray-900 dark:text-white transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            João Deere
        </p>
      </div>
      
      <div className="h-px bg-gray-300 dark:bg-gray-600 my-4" />

      <nav className="flex-1 pt-2 space-y-2 overflow-y-auto">
        <p className={`text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 transition-opacity duration-200 ${isOpen ? 'opacity-100 px-3' : 'opacity-0 w-0'}`}>
            Menu
        </p>
        {menuItems.map((item) => (
          <SidebarLink
            key={item.name}
            name={item.name}
            Icon={item.icon}
            href={item.href}
            current={item.current}
            isOpen={isOpen}
          />
        ))}
      </nav>

      <div className="pt-4 border-t border-gray-300 dark:border-gray-600 space-y-2">
        {footerItems.map((item) => (
          <SidebarLink
            key={item.name}
            name={item.name}
            Icon={item.icon}
            href={item.href}
            isOpen={isOpen}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;