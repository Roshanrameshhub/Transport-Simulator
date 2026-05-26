import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }].slice(-5) }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 6000);
    return id;
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success(title: string, description?: string) {
    useToastStore.getState().push({ title, description, variant: 'success' });
  },
  error(title: string, description?: string, onRetry?: () => void) {
    useToastStore.getState().push({
      title,
      description,
      variant: 'error',
      actionLabel: onRetry ? 'Retry' : undefined,
      onAction: onRetry,
    });
  },
  warning(title: string, description?: string) {
    useToastStore.getState().push({ title, description, variant: 'warning' });
  },
};
