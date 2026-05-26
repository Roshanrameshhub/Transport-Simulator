import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ className, hover = true, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/20 bg-card/60 p-5 shadow-xl backdrop-blur-xl',
        'dark:border-white/10 dark:bg-card/40',
        hover && 'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:border-primary/30',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
