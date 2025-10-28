"use client"

import React from 'react';
import MainLayout from '@/components/MainLayout';
import Image from 'next/image';
import logo from "../../../public/logo.png"
import { useTranslation } from 'react-i18next';

const Exemplos = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13"]

export default function NotificationPage() {
    const { t } = useTranslation();

    return (
        <MainLayout pageTitle={t('notifications')}>
            <div className="flex flex-row gap-6 h-[calc(100vh-200px)]">
                {/* Sidebar de Filtros */}
                <div className="w-1/4 bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        {t('filters')}
                    </h3>
                    {/* Aqui você pode adicionar os filtros específicos */}
                    <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-600 rounded-md shadow-sm">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Filtros em desenvolvimento
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de Notificações */}
                <div className="flex-1 h-full">
                    <div className="h-full overflow-auto pr-2">
                        <div className="space-y-4">
                            {Exemplos.map((ex, index) => (
                                <div 
                                    key={index} 
                                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Logo */}
                                        <div className="flex-shrink-0">
                                            <Image 
                                                src={logo} 
                                                className="w-16 h-16 rounded-full object-cover" 
                                                alt={t('company_logo')} 
                                            />
                                        </div>
                                        
                                        {/* Conteúdo da Notificação */}
                                        <div className="flex-1 mx-6">
                                            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
                                                Notificação {ex}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                {t('description')}
                                            </p>
                                        </div>
                                        
                                        {/* Botão de Ação */}
                                        <div className="flex-shrink-0">
                                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-200">
                                                {t('access')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}