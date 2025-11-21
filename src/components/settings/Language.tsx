"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>("en");

  // Load language from localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) {
      setLanguage(storedLang);
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300 mt-6">
      <h2 className="text-2xl font-semibold mb-6">{t("language_settings")}</h2>

      <div className="flex items-center gap-3">
        <Globe size={20} className="text-gray-700 dark:text-gray-300" />
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        >
          <option value="en">English</option>
          <option value="pt">Português</option>
          <option value="es">Español</option>
          {/* Adicione outros idiomas aqui */}
        </select>
      </div>
    </section>
  );
};

export default LanguageSettings;
