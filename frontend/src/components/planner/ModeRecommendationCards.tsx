import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { ModeAlternative } from '@/features/planner/modeAnalysis';
import { getModeMeta } from '@/lib/simulation';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

interface ModeRecommendationCardsProps {
  message: string;
  alternatives: ModeAlternative[];
  onApply: (alt: ModeAlternative) => void;
  loading?: boolean;
}

export function ModeRecommendationCards({
  message,
  alternatives,
  onApply,
  loading,
}: ModeRecommendationCardsProps) {
  if (!alternatives.length && !loading) return null;

  return (
    <GlassCard className="border-amber-500/30 bg-amber-500/5">
      <div className="mb-4 flex items-start gap-2">
        <Sparkles className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
        <div>
          <h3 className="font-semibold text-amber-800 dark:text-amber-200">AI mobility suggestions</h3>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Scanning alternative corridors…</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {alternatives.map((alt, i) => {
            const meta = getModeMeta(alt.mode);
            return (
              <motion.div
                key={alt.mode}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border/50 bg-background/60 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>
                    {meta.icon}
                  </span>
                  <div>
                    <p className="font-semibold capitalize">{alt.mode}</p>
                    <p className="text-xs text-muted-foreground">{alt.reason}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm">
                  {formatCurrency(alt.route.total_cost)} · {alt.route.total_time.toFixed(0)} min
                </p>
                {alt.savings && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">{alt.savings}</p>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full gap-1"
                  onClick={() => onApply(alt)}
                >
                  Use this route
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
