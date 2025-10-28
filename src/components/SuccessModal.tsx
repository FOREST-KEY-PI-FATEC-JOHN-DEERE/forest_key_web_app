'use client'

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  showOkButton?: boolean; // opcional
}

export default function SuccessModal({ isOpen, onClose, message, showOkButton = false }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500/70 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 text-center">
        {/* Ícone de sucesso */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-200 rounded-full p-4">
            <svg
              className="w-6 h-6 text-green-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Mensagem */}
        <p className="text-gray-800 mb-6">{message}</p>

        {/* Botão OK */}
        {showOkButton && (
          <button
            onClick={onClose}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium text-lg hover:bg-green-700 transition-transform"
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
}  