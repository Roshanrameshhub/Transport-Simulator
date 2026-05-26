import { motion } from 'framer-motion';
import { Ban } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface ModeUnavailableBannerProps {
  mode: string;
}

export function ModeUnavailableBanner({ mode }: ModeUnavailableBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      role="alert"
    >
      <GlassCard className="border-rose-500/40 bg-rose-500/5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15">
            <Ban className="h-5 w-5 text-rose-600 dark:text-rose-400" aria-hidden />
          </div>
          <div>
            <p className="font-bold text-rose-800 dark:text-rose-200">
              Not available right now
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="capitalize font-medium">{mode}</span> cannot serve this corridor
              optimally at the moment. SimuChennai prepared smart alternatives below.
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
