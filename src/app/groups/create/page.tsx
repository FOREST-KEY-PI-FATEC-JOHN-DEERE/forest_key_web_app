"use client"

import FormCreateGroup from '@/components/groups/FormCreateGroup';
import MainLayout from '@/components/MainLayout';
import { useTranslation } from 'react-i18next';

export default function CreateGroupPage() {
  const { t } = useTranslation();
  return (
    <MainLayout pageTitle={t('create_group')} >
      <FormCreateGroup />
    </MainLayout>
  );
}
