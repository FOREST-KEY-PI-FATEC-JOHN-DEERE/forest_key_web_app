"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptTranslations from "@/translations/pt/common.json";
import enTranslations from "@/translations/en/common.json";
import esTranslations from "@/translations/es/common.json";

const resources = {
  pt: { translation: ptTranslations },
  en: { translation: enTranslations },
  es: { translation: esTranslations },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "pt",
      interpolation: { escapeValue: false },
    });
}

export default i18n;