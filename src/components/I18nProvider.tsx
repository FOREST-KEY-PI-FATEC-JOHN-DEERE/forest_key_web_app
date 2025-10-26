'use client';

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n'; // 🚨 IMPORTANTE: Certifique-se de que este caminho está correto!

interface I18nProviderProps {
  children: React.ReactNode;
}

// Este componente envolve sua aplicação e injeta a instância do i18n
const AppI18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};

export default AppI18nProvider;