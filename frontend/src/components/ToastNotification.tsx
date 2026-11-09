import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id?: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastProps> = ({
  type,
  message,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
    error: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200',
    info: 'bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950 dark:border-sky-800 dark:text-sky-200',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />,
  };

  return (
    <div
      role="alert"
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 border rounded-xl shadow-lg transition-all transform duration-300 max-w-md ${styles[type]}`}
    >
      {icons[type]}
      <p className="text-sm font-medium pr-2">{message}</p>
      <button
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
};
