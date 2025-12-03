'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from '../SuccessModal';
import { useTranslation } from 'react-i18next';

export default function FormCreateGroup() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [backup, setBackup] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setModalMessage(
      t('group_created_message', { name: title }) || `Group "${title}" created successfully!`
    );

    setModalOpen(true);

    // Clear fields
    setTitle('');
    setDescription('');
    setOwner('');
    setBackup('');
  };

  const handleModalOk = () => {
    setModalOpen(false);
    router.push('/groups/add-user');
  };

  return (
    <>
      <div className="flex justify-center items-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-10">
          <h1 className="text-2xl font-extrabold text-gray-900 border-b pb-3 mb-6">
            {t('create_group') || 'Create group'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('group_name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('group_name_placeholder') || 'Ex: Group - A'}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white  text-xs focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('description')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('group_description_placeholder') || 'Describe the permissions and scope of the group.'}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white  text-xs focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('owner')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder={t('owner_placeholder') || 'Ex: First_Lastname'}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white  text-xs focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('backup')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={backup}
                onChange={(e) => setBackup(e.target.value)}
                placeholder={t('backup_placeholder') || 'Ex: Substitute_Name'}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white  text-xs focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600  rounded-lg font-medium text-lg hover:bg-green-700 hover:scale-[1.01] transition-transform"
            >
              {t('create_group') || 'Create group'}
            </button>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={modalOpen}
        onClose={handleModalOk}
        message={modalMessage}
        showOkButton={true}
      />
    </>
  );
}
