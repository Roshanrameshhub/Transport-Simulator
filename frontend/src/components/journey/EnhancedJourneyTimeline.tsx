import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { RouteResponse, SegmentDetail } from '@/types/api';
import {
  getEcoImpact,
  getOccupancyPercent,
  getRouteConfidenceScore,
} from '@/lib/simulation';
import { formatCurrency, formatMinutes, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GlassCard } from '@/components/ui/glass-card';

const modeIcons: Record<string, string> = {
  bus: '🚌',
  metro: '🚇',
  car: '🚗',
  rapido: '🏍️',
  taxi: '🚕',
};

interface EnhancedJourneyTimelineProps {
  route: RouteResponse;
}

export function EnhancedJourneyTimeline({ route }: EnhancedJourneyTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const segments = route.detailed_segments;
  const eco = getEcoImpact(route);
  const confidence = getRouteConfidenceScore(route);
  const totalFare = route.total_cost;

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % Math.max(segments.length, 1));
    }, 2800);
    return () => clearInterval(id);
  }, [segments.length]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-4">
        <GlassCard hover={false} className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Route confidence</p>
          <p className="text-2xl font-bold text-primary">{confidence}%</p>
        </GlassCard>
        <GlassCard hover={false} className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total fare</p>
          <p className="text-2xl font-bold">{formatCurrency(totalFare)}</p>
        </GlassCard>
        <GlassCard hover={false} className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Green score</p>
          <p className="text-2xl font-bold text-emerald-600">{eco.greenScore}</p>
        </GlassCard>
        <GlassCard hover={false} className="p-3 text-center">
          <p className="text-xs text-muted-foreground">CO₂ saved</p>
          <p className="text-2xl font-bold">{eco.co2SavedKg} kg</p>
        </GlassCard>
      </div>

      <ol className="relative space-y-0" aria-label="Enhanced journey timeline">
        {segments.map((segment: SegmentDetail, index) => {
          const isActive = index === activeIndex;
          const occ = getOccupancyPercent(segment.mode);
          const fareShare = ((segment.cost / totalFare) * 100).toFixed(0);

          return (
            <li key={`${segment.from}-${segment.to}-${index}`} className="relative pb-8 last:pb-0">
              {index < segments.length - 1 && (
                <span
                  className={cn(
                    'absolute left-6 top-14 h-[calc(100%-1.5rem)] w-0.5 transition-colors',
                    isActive ? 'bg-primary' : 'bg-border',
                  )}
                  aria-hidden
                />
              )}
              <motion.article
                layout
                animate={{
                  scale: isActive ? 1.02 : 1,
                  borderColor: isActive ? 'hsl(199 89% 42% / 0.5)' : undefined,
                }}
                className={cn(
                  'relative flex gap-4 rounded-xl border p-4 transition-shadow',
                  'bg-card/80 backdrop-blur',
                  isActive && 'shadow-lg ring-1 ring-primary/30',
                )}
              >
                <motion.div
                  animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 1.5 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 text-2xl"
                  aria-hidden
                >
                  {modeIcons[segment.mode.toLowerCase()] ?? '🛣️'}
                </motion.div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold">
                      {segment.from} → {segment.to}
                    </h4>
                    {isActive && (
                      <Badge variant="default" className="animate-pulse">
                        In transit
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {segment.mode_name} · {segment.distance_km.toFixed(1)} km
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">{formatMinutes(segment.time_mins)}</Badge>
                    <Badge variant="outline">{formatCurrency(segment.cost)}</Badge>
                    <Badge variant="secondary">{occ}% occupancy</Badge>
                    <Badge variant="outline">{fareShare}% of fare</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Segment ETA</p>
                    <Progress
                      value={isActive ? 65 : 100}
                      aria-label={`Segment ${index + 1} progress`}
                    />
                  </div>
                </div>
              </motion.article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
