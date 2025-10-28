"use client"

import FormAddUser from '@/components/FormAddUser';
import MainLayout from '@/components/MainLayout';
import { useTranslation } from 'react-i18next';

export default function AddUserPage() {
  const { t } = useTranslation();
  return (
    <MainLayout pageTitle={t('add_user')}>
      <FormAddUser />
    </MainLayout>
  );
}
