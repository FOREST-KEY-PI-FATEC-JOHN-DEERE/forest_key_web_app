"use client"

import React, { useState } from 'react';
import { FaBell, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaChevronLeft, FaBars, FaHistory, FaUserCheck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/navigation";


const SIDEBAR_WIDTH_OPEN = 'w-64';
const SIDEBAR_WIDTH_CLOSED = 'w-24'; 
const LOGO_IMAGE_PATH = 'images/john deere logo.svg'; 
const JOHN_DEERE_GREEN = '#367c39';

interface MenuItemType {
  nameKey: string;
  icon: React.ElementType;
  href: string;
  current?: boolean;
}

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
      ? 'font-semibold rounded-lg' 
      : 'font-normal rounded-lg',
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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });

    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    localStorage.removeItem("user");

    router.push("/");
  }

  const menuItems: MenuItemType[] = [
    { nameKey: 'app_users', icon: FaUsers, href: '/app_users', current: false },
    { nameKey: 'notifications', icon: FaBell, href: '/notification', current: false },
    { nameKey: 'dashboard', icon: FaChartBar, href: '/dashboard', current: false },
    { nameKey: 'history', icon: FaHistory, href: '/history', current: false },
    { nameKey: 'groups', icon: FaUserCheck , href: '/groups/create', current: false },
  ];

const footerItems: MenuItemType[] = [
  { nameKey: 'settings', icon: FaCog, href: '/settings' },
];


  const sidebarWidth = isOpen ? SIDEBAR_WIDTH_OPEN : SIDEBAR_WIDTH_CLOSED;
  
  const sidebarClasses = [
    'shadow-xl',
    'flex flex-col z-50 p-4',
    sidebarWidth, 
    'rounded-2xl mt-4 mb-4 ml-4 sticky top-4 transition-all duration-300', 
    'min-h-[calc(100vh-2rem)]', 
  ].join(' ');
  
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
          className={`p-2 rounded-full transition duration-150`}
          style={{ color: isOpen ? JOHN_DEERE_GREEN : undefined }} 
        >
          {isOpen 
            ? <FaChevronLeft className="h-5 w-5" /> 
            : <FaBars className="h-5 w-5" />}
        </button>
      </div>
      <div className="h-px my-4" />

      <nav className="flex-1 pt-2 space-y-2 overflow-y-auto">
        <p className={`text-xs font-semibold uppercase mb-2 transition-opacity duration-200 ${isOpen ? 'opacity-100 px-3' : 'opacity-0 w-0'}`}>
            {t('menu')}
        </p>
        {menuItems.map((item) => (
          <SidebarLink
            key={item.nameKey}
            name={t(item.nameKey)}
            Icon={item.icon}
            href={item.href}
            current={item.current}
            isOpen={isOpen}
          />
        ))}
      </nav>

      <div className="pt-4 border-t space-y-2">
        {footerItems.map((item) => (
          <SidebarLink
            key={item.nameKey}
            name={t(item.nameKey)}
            Icon={item.icon}
            href={item.href}
            isOpen={isOpen}
          />
        ))}
      </div>

      <button
        onClick={handleLogout}
        className={`flex items-center py-2.5 transition duration-150 w-full
          ${isOpen ? 'px-3 justify-start' : 'justify-center'} 
          text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg`}
      >
        <FaSignOutAlt className="h-5 w-5" />
        <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 
          ${isOpen ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0'}`}>
          {t("logout")}
        </span>
      </button>

    </div>
  );
};

export default Sidebar;