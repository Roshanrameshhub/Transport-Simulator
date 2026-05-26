import { motion } from 'framer-motion';
import type { RouteResponse } from '@/types/api';
import {
  getCongestionLevel,
  getEcoImpact,
  getOccupancyPercent,
  getPeakHourAlert,
  isPeakHour,
} from '@/lib/simulation';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RouteStatusPanelProps {
  route: RouteResponse;
  gpsProgress: number;
}

export function RouteStatusPanel({ route, gpsProgress }: RouteStatusPanelProps) {
  const congestion = getCongestionLevel(route.detailed_segments);
  const eco = getEcoImpact(route);
  const peak = getPeakHourAlert();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <GlassCard>
        <h3 className="mb-3 font-semibold">Live transport status</h3>
        <div className="flex flex-wrap gap-2">
          {route.transport_modes_used.map((mode) => (
            <Badge key={mode} variant="outline" className="gap-1 capitalize">
              <span
                className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
                aria-hidden
              />
              {mode} · {getOccupancyPercent(mode)}% occ.
            </Badge>
          ))}
        </div>
        {isPeakHour() && (
          <Badge variant="warning" className="mt-3">
            Peak hour active
          </Badge>
        )}
      </GlassCard>

      <GlassCard>
        <h3 className="mb-3 font-semibold">Simulated GPS tracking</h3>
        <Progress value={gpsProgress} className="mb-2" aria-label="GPS journey progress" />
        <p className="text-xs text-muted-foreground">
          {gpsProgress < 100
            ? `En route — ${Math.round(gpsProgress)}% of corridor covered`
            : 'Arrived at destination zone'}
        </p>
      </GlassCard>

      <GlassCard>
        <h3 className="mb-3 font-semibold">Environmental impact</h3>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-2 text-sm">
          <p>
            CO₂ saved vs solo cab:{' '}
            <span className="font-semibold text-emerald-600">{eco.co2SavedKg} kg</span>
          </p>
          <p>
            Trip emissions: <span className="font-semibold">{eco.co2EmittedKg} kg</span>
          </p>
          <p className="text-muted-foreground">≈ {eco.treesEquivalent} trees/day offset</p>
          <Badge variant="success">Green score {eco.greenScore}</Badge>
          {congestion === 'high' && (
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">
              High congestion on road segments — metro segments unaffected.
            </p>
          )}
        </motion.div>
      </GlassCard>

      {peak && (
        <GlassCard className="lg:col-span-3 border-amber-500/30">
          <p className="text-sm text-amber-800 dark:text-amber-200">{peak}</p>
        </GlassCard>
      )}
    </div>
  );
}
