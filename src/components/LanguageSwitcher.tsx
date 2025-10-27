'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; 

const LANGUAGES = [
  { code: 'pt', name: 'Português', flagPath: '/images/flag-pt.png' },
  { code: 'en', name: 'English', flagPath: '/images/flag-en.png' },
  { code: 'es', name: 'Español', flagPath: '/images/flag-es.png' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n, ready } = useTranslation(); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []); 

  
  const currentLangCode = (ready && isClient) 
    ? i18n.language.substring(0, 2) 
    : 'pt';
    
  const currentLang = LANGUAGES.find(lang => lang.code === currentLangCode) || LANGUAGES[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsMenuOpen(false); 
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  if (!ready || !isClient) {
      return <div className="p-2 h-10 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />;
  }


  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-principal-azul"
        title={`Idioma Atual: ${currentLang.name}`}
      >
        <img
          src={currentLang.flagPath}
          alt={currentLang.name}
          className="h-6 w-6 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-600"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
             {currentLang.code.toUpperCase()}
        </span>
      </button>

      {isMenuOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-600 overflow-hidden"
          style={{ transform: 'translateY(5px)' }} 
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 disabled:opacity-50"
              disabled={lang.code === currentLangCode}
            >
              <img
                src={lang.flagPath}
                alt={lang.name}
                className="h-5 w-5 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-600 mr-3"
              />
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;