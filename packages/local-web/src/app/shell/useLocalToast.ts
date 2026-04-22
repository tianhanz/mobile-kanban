import { useCallback, useEffect, useState } from 'react';

export type ToastTone = 'default' | 'brand';

export interface ToastState {
  key: number;
  message: string;
  tone: ToastTone;
}

/**
 * A minimal local toast suitable for PR3's placeholder feedback (e.g. the
 * `+ Mark milestone` button). Intentionally scoped to a single component so
 * we don't prematurely add a global toast dependency — when real toasts
 * land (PR4+), swap this hook out.
 */
export function useLocalToastState() {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'default') => {
      setToast({ key: Date.now(), message, tone });
    },
    []
  );

  return { toast, showToast };
}
