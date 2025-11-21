"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";

const ThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Apply theme to document root
  const applyTheme = (theme: "light" | "dark") => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#ededed");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--background", "#f5f5f5");
      root.style.setProperty("--foreground", "#171717");
    }
  };

  // Load theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      applyTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-6">{t("theme_settings")}</h2>

      <div className="flex gap-4">
        <button
          onClick={() => handleThemeChange("light")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-colors duration-300
            ${theme === "light"
              ? "bg-yellow-400 text-white shadow-md hover:bg-yellow-500"
              : "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
        >
          <Sun size={20} />
          {t("light_theme")}
        </button>

        <button
          onClick={() => handleThemeChange("dark")}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-colors duration-300
            ${theme === "dark"
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
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
