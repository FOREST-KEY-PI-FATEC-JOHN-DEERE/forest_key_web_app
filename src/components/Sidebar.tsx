"use client"

import React, { useState, useEffect } from 'react';
import { FaBell, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaChevronLeft, FaBars, FaHistory, FaUserCheck, FaHome } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/navigation";


const SIDEBAR_WIDTH_OPEN = 'w-64';
const SIDEBAR_WIDTH_CLOSED = 'w-24'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const classes: string[] = ['flex items-center py-2.5 transition-all duration-200 relative overflow-hidden'];
  if (isOpen) classes.push('px-4'); else classes.push('justify-center px-2');

  // base text/icon colors
  if (!current) classes.push('text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/40');

  // when expanded and active, add extra left padding to reveal the accent bar
  if (current && isOpen) classes.push('pl-6');

  return (
    <Link href={href} aria-current={current ? 'page' : undefined} className={classes.join(' ')}>
      {/* Expanded left accent bar */}
      {current && isOpen && (
        <span
          aria-hidden
          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full shadow-sm"
          style={{ backgroundImage: 'linear-gradient(180deg, var(--color-main-green-600), var(--color-main-green-400))' }}
        />
      )}

      {/* Icon container - when collapsed and active show a small pill behind the icon */}
      <span className={`inline-flex items-center justify-center shrink-0 ${isOpen ? '' : 'relative'}`}>
        {(!isOpen && current) ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-3 w-3 rounded-full bg-[color:var(--color-main-green-600)] shadow-sm" aria-hidden />
          </span>
        ) : null}

        <Icon className={`h-5 w-5 ${current ? 'text-[color:var(--color-main-green-600)]' : ''}`} />
      </span>

      <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-200 ${isOpen ? 'opacity-100 ml-3' : 'opacity-0 w-0'}`}>
        {name}
      </span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return true;
      const v = localStorage.getItem('sidebar_open');
      return v === null ? true : v === '1';
    } catch (e) {
      return true;
    }
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      localStorage.setItem('sidebar_open', isOpen ? '1' : '0');
    } catch (e) {
      // ignore
    }
  }, [isOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error('Logout failed');

      localStorage.removeItem("token");
      localStorage.removeItem("profile");
      localStorage.removeItem("user");

      // lightweight toast helper (keeps UX clear on sign out)
      // import from utils/toast
      // show success then navigate home
      const { showSuccess } = await import('@/utils/toast');
      showSuccess(t('logout_success') || 'Signed out successfully');

      router.push("/");
    } catch (err) {
      const { showError } = await import('@/utils/toast');
      showError(t('logout_error') || 'Failed to sign out');
      setIsLoggingOut(false);
    }
  }

  const menuItems: MenuItemType[] = [
    { nameKey: 'home', icon: FaHome, href: '/', current: false },
    { nameKey: 'app_users', icon: FaUsers, href: '/app_users', current: false },
    { nameKey: 'groups', icon: FaUserCheck , href: '/groups', current: false },
    { nameKey: 'dashboard', icon: FaChartBar, href: '/dashboard', current: false },
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
    'backdrop-blur-sm bg-white/60 dark:bg-gray-800/60',
  ].join(' ');
  
  return (
    <div className={sidebarClasses}>
      <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} h-16 mb-4`}>
        <div className={`overflow-hidden transition-all duration-300 flex items-center ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          {/* <div className="rounded-full bg-white/90 dark:bg-gray-900/70 p-1 shadow-sm mr-2 flex items-center justify-center" aria-hidden>
            <img
              src={LOGO_IMAGE_PATH}
              alt="Logo John Deere"
              className="h-8 w-auto block"
            />
          </div> */}
          <div className={`transition-transform duration-300 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'}`}>
            <span className="font-semibold text-sm">Forest Key</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? t('collapse') || 'Collapse sidebar' : t('expand') || 'Expand sidebar'}
          className={`p-2 rounded-full transition duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
        >
          {isOpen 
            ? <FaChevronLeft className="h-5 w-5" /> 
            : <FaBars className="h-5 w-5" />}
        </button>
      </div>
      <div className="h-px my-4" />

      <nav className="flex-1 pt-2 space-y-2 overflow-y-auto" aria-label={t('main_navigation') || 'Main navigation'} role="navigation">
        <p className={`text-xs font-semibold uppercase mb-2 transition-all duration-200 ${isOpen ? 'opacity-100 px-3 translate-y-0' : 'opacity-0 -translate-y-1 w-0'}`}>
            {t('menu')}
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <SidebarLink
              key={item.nameKey}
              name={t(item.nameKey)}
              Icon={item.icon}
              href={item.href}
              current={isActive}
              isOpen={isOpen}
            />
          );
        })}
      </nav>

      <div className="pt-4 border-t space-y-2">
        {footerItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <SidebarLink
              key={item.nameKey}
              name={t(item.nameKey)}
              Icon={item.icon}
              href={item.href}
              current={isActive}
              isOpen={isOpen}
            />
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        aria-disabled={isLoggingOut}
        aria-label={t('logout')}
        className={`flex items-center py-2.5 transition duration-150 w-full
          ${isOpen ? 'px-3 justify-start' : 'justify-center'} 
          text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg ${isLoggingOut ? 'opacity-60 cursor-not-allowed' : ''}`}
        role="button"
      >
        {isLoggingOut ? (
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        ) : (
          <FaSignOutAlt className="h-5 w-5" />
        )}
        <span className={`text-sm whitespace-nowrap overflow-hidden transition-all duration-300 
          ${isOpen ? 'opacity-100 w-auto ml-3' : 'opacity-0 w-0'}`}>
          {t("logout")}
        </span>
      </button>

    </div>
  );
};

export default Sidebar;