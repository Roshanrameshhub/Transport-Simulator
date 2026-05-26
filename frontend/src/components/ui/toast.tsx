import { X } from 'lucide-react';
import { useToastStore, type Toast } from '@/store/toastStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const variantStyles: Record<Toast['variant'], string> = {
  default: 'border-border bg-card',
  success: 'border-emerald-500/40 bg-emerald-500/10',
  error: 'border-destructive/40 bg-destructive/10',
  warning: 'border-amber-500/40 bg-amber-500/10',
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn(
            'pointer-events-auto rounded-lg border p-4 shadow-lg backdrop-blur-md',
            variantStyles[t.variant],
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm">{t.title}</p>
              {t.description && (
                <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="rounded p-1 hover:bg-muted"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {t.actionLabel && t.onAction && (
            <Button size="sm" variant="outline" className="mt-2" onClick={t.onAction}>
              {t.actionLabel}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
