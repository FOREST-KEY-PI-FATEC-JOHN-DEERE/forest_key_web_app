"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section className="bg-[var(--color-card)] p-6 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-6">{t("theme_settings")}</h2>

      <div className="flex gap-4">
        {/* LIGHT BUTTON */}
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-colors duration-300
            ${theme === "light"
              ? "bg-yellow-400  shadow-md hover:bg-yellow-500"
              : " hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
        >
          <Sun size={20} />
          {t("light_theme")}
        </button>

        {/* DARK BUTTON */}
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-colors duration-300
            ${theme === "dark"
              ? "bg-blue-600  shadow-md hover:bg-blue-700"
              : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
        >
          <Moon size={20} />
          {t("dark_theme")}
        </button>
      </div>
    </section>
  );
};

export default ThemeSettings;
