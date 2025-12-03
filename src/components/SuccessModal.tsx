'use client'

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  showOkButton?: boolean; // opcional
  variant?: 'success' | 'error';
}

export default function SuccessModal({ isOpen, onClose, message, showOkButton = false, variant = 'success' }: SuccessModalProps) {
  if (!isOpen) return null;

  const isError = variant === 'error';
  const bgColor = isError ? 'bg-rose-100' : 'bg-green-200';
  const iconColor = isError ? 'text-rose-700' : 'text-green-800';
  const buttonBg = isError ? 'bg-rose-600 hover:bg-rose-700' : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-[var(--color-card)] rounded-2xl shadow-lg w-full max-w-md p-6 text-center border border-[var(--color-divider)] text-[var(--color-foreground)]">
        <div className="flex justify-center mb-4">
          <div className={`${bgColor} rounded-full p-4`}>
            {isError ? (
              <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z" />
              </svg>
            ) : (
              <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        <p className="mb-6 text-[var(--color-foreground)]">{message}</p>

        {showOkButton && (
          <button onClick={onClose} className={`w-full py-3 ${buttonBg} rounded-lg font-medium text-lg transition-transform`}>
            OK
          </button>
        )}
      </div>
    </div>
  );
}