import type { ToastState } from './useLocalToast';

interface LocalToastProps {
  toast: ToastState | null;
}

export function LocalToast({ toast }: LocalToastProps) {
  if (!toast) return null;
  return (
    <div
      key={toast.key}
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed left-1/2 bottom-24 z-[200] -translate-x-1/2 rounded-full px-5 py-2.5 font-ibm-plex-sans text-sm font-medium shadow-[0_10px_30px_rgba(26,23,20,0.25)] ${
        toast.tone === 'brand'
          ? 'bg-brand text-on-brand'
          : 'bg-[hsl(var(--text-high))] text-[hsl(var(--bg-primary))]'
      }`}
      style={{ animation: 'loom-toast-rise .25s ease-out' }}
    >
      {toast.message}
      <style>{`
        @keyframes loom-toast-rise {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
