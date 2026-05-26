import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface RouteDurationWarningProps {
  totalMinutes: number;
  message: string;
}

export function RouteDurationWarning({ totalMinutes, message }: RouteDurationWarningProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="alert">
      <GlassCard className="border-amber-500/50 bg-amber-500/10">
        <div className="flex items-start gap-3">
          <Timer className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-100">
              This route takes more time
            </p>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
            <p className="text-xs mt-2 font-mono text-amber-800 dark:text-amber-200">
              Estimated: {totalMinutes.toFixed(0)} minutes
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
