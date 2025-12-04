'use client';

import { useState } from 'react';
import SuccessModal from '../SuccessModal';

interface Option {
  label: string;
  value: string;
}

const users: Option[] = [
  { label: 'João Silva', value: 'joao' },
  { label: 'Maria Santos', value: 'maria' },
  { label: 'Carlos Oliveira', value: 'carlos' },
];

const adGroups: Option[] = [
  { label: 'Grupo - A', value: 'grupo-a' },
  { label: 'Grupo - B', value: 'grupo-b' },
];

const accessLevels: Option[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
];

export default function FormAddUser() {
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAccess, setSelectedAccess] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userLabel = users.find(u => u.value === selectedUser)?.label ?? '';
    const groupLabel = adGroups.find(g => g.value === selectedGroup)?.label ?? '';

    setModalMessage(`O usuário "${userLabel}" foi adicionado com sucesso ao grupo "${groupLabel}"!`);
    setModalOpen(true);

    setSelectedUser('');
    setSelectedAccess('');
    setSelectedGroup('');
  };

  const handleModalOk = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-center items-center p-4 font-sans">
        <div className="bg-[var(--color-card)] rounded-2xl shadow-2xl w-full max-w-lg p-10 border border-[var(--color-divider)]">
          <h1 className="text-2xl font-extrabold text-[var(--color-foreground)] border-b pb-3 mb-6">
            {"Adicionar Usuário ao Grupo AD"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                {"Usuário"} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--color-divider)] bg-[var(--color-card)] text-xs focus:ring-green-600 focus:border-green-600"
                required
              >
                <option value="">Selecione o usuário</option>
                {users.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
                {"Nível de Acesso"} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--color-divider)] bg-[var(--color-card)] text-xs focus:ring-green-600 focus:border-green-600"
                required
              >
                <option value="">Selecione o nível</option>
                {accessLevels.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
               {"Grupo AD"} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full p-3 rounded-lg border border-[var(--color-divider)] bg-[var(--color-card)] text-xs focus:ring-green-600 focus:border-green-600"
                required
              >
                <option value="">Selecione o grupo</option>
                {adGroups.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600  rounded-lg font-medium text-lg hover:bg-green-700 hover:scale-[1.01] transition-transform"
            >
              {"Adicionar Usuário"}
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
