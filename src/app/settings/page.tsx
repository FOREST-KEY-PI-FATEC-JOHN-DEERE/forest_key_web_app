"use client";

import React from "react";
import MainLayout from "@/components/MainLayout";
import ProfileSettings from "@/components/settings/Profile";
import ThemeSettings from "@/components/settings/Theme";
import LanguageSettings from "@/components/settings/Language";
import { useTranslation } from "react-i18next";

const SettingsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
  return (
    <MainLayout pageTitle={t('setting_title') || 'Configuração'}>
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <ProfileSettings />
        <ThemeSettings />
        <LanguageSettings/>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
