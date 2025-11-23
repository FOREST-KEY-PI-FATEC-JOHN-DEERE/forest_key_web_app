"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>("en");

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
    <section className="bg-[var(--color-card)] p-6 rounded-xl shadow-md transition-colors duration-300 mt-6">
      <h2 className="text-2xl font-semibold mb-6">{t("language_settings")}</h2>

      <div className="flex items-center gap-3">
        <Globe size={20} />
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-4 py-2 border rounded-lg  focus:outline-none transition-colors"
        >
          <option value="en">English</option>
          <option value="pt">Português</option>
          <option value="es">Español</option>
        </select>
      </div>
    </section>
  );
};

export default LanguageSettings;
