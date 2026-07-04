import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 animate-slide-in-right
        px-5 py-3.5 rounded-xl shadow-2xl backdrop-blur-xl border max-w-sm
        ${
          type === 'success'
            ? 'bg-emerald-50/90 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-50/90 dark:bg-red-500/15 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300'
        }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold font-mono">
          {type === 'success' ? '✓' : '✕'}
        </span>
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
