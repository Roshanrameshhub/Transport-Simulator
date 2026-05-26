import { motion, AnimatePresence } from 'framer-motion';
import { Clock, IndianRupee, Leaf, Loader2, AlertTriangle } from 'lucide-react';
import type { RouteResponse } from '@/types/api';
import {
  deriveAiSuggestion,
  getCongestionLevel,
  getEcoImpact,
  getPeakHourAlert,
} from '@/lib/simulation';
import { formatCurrency } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface LiveRoutePreviewProps {
  route: RouteResponse | null;
  isUpdating: boolean;
  error: string | null;
  preferTime: boolean;
  preferCost: boolean;
  etaProgress?: number;
}

export function LiveRoutePreview({
  route,
  isUpdating,
  error,
  preferTime,
  preferCost,
  etaProgress = 0,
}: LiveRoutePreviewProps) {
  const peak = getPeakHourAlert();

  if (!route && !isUpdating && !error) {
    return (
      <GlassCard className="border-dashed text-center text-sm text-muted-foreground">
        Enter start & destination — toggle Save Time or Save Money for live recalculation.
      </GlassCard>
    );
  }

  const congestion = route ? getCongestionLevel(route.detailed_segments) : 'low';
  const eco = route ? getEcoImpact(route) : null;

  return (
    <GlassCard className="relative">
      <AnimatePresence mode="wait">
        {isUpdating && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm"
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Updating route" />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mb-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {route && (
        <motion.div
          key={`${route.total_cost}-${route.total_time}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">Live route preview</h3>
            <div className="flex flex-wrap gap-2">
              {preferTime && <Badge variant="secondary">Save Time</Badge>}
              {preferCost && <Badge variant="secondary">Save Money</Badge>}
              <Badge
                variant={
                  congestion === 'high' ? 'danger' : congestion === 'moderate' ? 'warning' : 'success'
                }
              >
                {congestion} congestion
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-3">
              <Clock className="h-4 w-4 text-primary" aria-hidden />
              <div>
                <p className="text-xs text-muted-foreground">ETA</p>
                <p className="font-bold">{route.total_time.toFixed(1)} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-3">
              <IndianRupee className="h-4 w-4 text-primary" aria-hidden />
              <div>
                <p className="text-xs text-muted-foreground">Fare</p>
                <p className="font-bold">{formatCurrency(route.total_cost)}</p>
              </div>
            </div>
            {eco && (
              <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-3">
                <Leaf className="h-4 w-4 text-emerald-500" aria-hidden />
                <div>
                  <p className="text-xs text-muted-foreground">Green score</p>
                  <p className="font-bold">{eco.greenScore}/100</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Simulated journey progress</span>
              <span>{Math.round(etaProgress)}%</span>
            </div>
            <Progress value={etaProgress} aria-label="ETA progress" />
          </div>

          <p className="text-sm text-muted-foreground">{route.path.join(' → ')}</p>
          <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm">
            {deriveAiSuggestion(route, preferTime, preferCost)}
          </p>

          {peak && (
            <p className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
              {peak}
            </p>
          )}
        </motion.div>
      )}
    </GlassCard>
  );
}
