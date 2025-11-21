"use client";

import React from "react";
import MainLayout from "@/components/MainLayout";
import ProfileSettings from "@/components/settings/Profile";
import ThemeSettings from "@/components/settings/Theme";
import LanguageSettings from "@/components/settings/Language";

const SettingsPage: React.FC = () => {
  return (
    <MainLayout pageTitle="Settings">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <ProfileSettings />
        <ThemeSettings />
        <LanguageSettings/>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
