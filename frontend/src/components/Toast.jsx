import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { ToastContext } from '../lib/toast';

const variants = {
  success: { Icon: CheckCircle2, color: 'text-emerald-700' },
  error: { Icon: XCircle, color: 'text-red-700' },
  info: { Icon: Info, color: 'text-sky-700' },
};

export function Toast({ message, variant = 'info', onDismiss }) {
  const { Icon, color } = variants[variant] || variants.info;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
      <Icon size={20} aria-hidden="true" className={`mt-0.5 shrink-0 ${color}`} />
      <p className="min-w-0 flex-1 break-words text-sm text-slate-900">{message}</p>
      <button type="button" onClick={onDismiss} aria-label="Fechar notificação" className="shrink-0 rounded p-1 text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"><X size={18} aria-hidden="true" /></button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [announcement, setAnnouncement] = useState({ message: '', variant: 'info', id: 0 });
  const nextId = useRef(0);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((message, { variant = 'info', duration = 5000 } = {}) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, message, variant }]);
    setAnnouncement({ id, message, variant });
    if (duration > 0) timers.current.set(id, setTimeout(() => dismiss(id), duration));
    return id;
  }, [dismiss]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => { activeTimers.forEach(clearTimeout); activeTimers.clear(); };
  }, []);

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div role="status" aria-atomic="true" className="sr-only">{announcement.variant !== 'error' && <span key={announcement.id}>{announcement.message}</span>}</div>
      <div role="alert" aria-atomic="true" className="sr-only">{announcement.variant === 'error' && <span key={announcement.id}>{announcement.message}</span>}</div>
      <div role="region" aria-label="Notificações" className="fixed bottom-4 right-4 z-50 flex max-h-[70vh] w-[calc(100%-2rem)] max-w-sm flex-col gap-3 overflow-y-auto">
        {toasts.map((toast) => <Toast key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />)}
      </div>
    </ToastContext.Provider>
  );
}
