'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from './SuccessModal';

export default function FormCreateGroup() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [backup, setBackup] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mensagem do modal
    setModalMessage(
      `O grupo "${title}" foi criado com sucesso! Agora você pode adicionar usuários a ele.`
    );

    setModalOpen(true);

    // Limpa os campos do formulário
    setTitle('');
    setDescription('');
    setOwner('');
    setBackup('');
  };

  const handleModalOk = () => {
    setModalOpen(false);
    router.push('/groups/add-user'); // redireciona após clicar OK
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-10">
          <h1 className="text-2xl font-extrabold text-gray-900 border-b pb-3 mb-6">
            Criar Grupo AD
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Grupo AD <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Grupo - A"
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-500 text-xs focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva as permissões e o escopo de atuação do grupo."
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-500 text-xs focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proprietário <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Ex: Nome_Sobrenome"
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-500 text-xs focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={backup}
                onChange={(e) => setBackup(e.target.value)}
                placeholder="Ex: Nome_Substituto"
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-500 text-xs focus:ring-green-600 focus:border-green-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium text-lg hover:bg-green-700 hover:scale-[1.01] transition-transform"
            >
              Criar Grupo
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
