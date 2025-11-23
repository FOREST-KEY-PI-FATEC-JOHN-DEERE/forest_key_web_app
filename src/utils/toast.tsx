import toast, { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import React from 'react';

function ToastContent({ icon, title, message }: { icon: React.ReactNode; title?: string; message: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        {title && <div className="text-sm font-semibold">{title}</div>}
        <div className="text-sm opacity-90">{message}</div>
      </div>
    </div>
  );
}

export const showSuccess = (message: string, title?: string) => {
  toast.custom((t) => (
    <div
      className={`p-3 rounded-lg text-white ${t.visible ? 'animate-enter' : 'animate-leave'}`}
      style={{ backgroundColor: 'var(--color-main-green-600)' }}
    >
      <ToastContent icon={<CheckCircle className="text-white" />} title={title} message={message} />
    </div>
  ));
};

export const showError = (message: string, title?: string) => {
  toast.custom((t) => (
    <div className={`p-3 rounded-lg bg-rose-700 text-rose-50 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
      <ToastContent icon={<XCircle className="text-rose-50" />} title={title} message={message} />
    </div>
  ));
};

export const showInfo = (message: string, title?: string) => {
  toast.custom((t) => (
    <div className={`p-3 rounded-lg bg-slate-800 text-slate-100 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
      <ToastContent icon={<Info className="text-slate-100" />} title={title} message={message} />
    </div>
  ));
};

export default toast;
