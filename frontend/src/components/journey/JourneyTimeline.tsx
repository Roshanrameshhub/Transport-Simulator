import { motion } from 'framer-motion';
import type { SegmentDetail } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatMinutes, cn } from '@/lib/utils';

const modeIcons: Record<string, string> = {
  bus: '🚌',
  metro: '🚇',
  car: '🚗',
  rapido: '🏍️',
  taxi: '🚕',
};

function trafficVariant(timeMins: number): 'success' | 'warning' | 'danger' {
  if (timeMins < 10) return 'success';
  if (timeMins < 30) return 'warning';
  return 'danger';
}

interface JourneyTimelineProps {
  segments: SegmentDetail[];
}

export function JourneyTimeline({ segments }: JourneyTimelineProps) {
  return (
    <ol className="relative space-y-0" aria-label="Journey segments timeline">
      {segments.map((segment, index) => (
        <li key={`${segment.from}-${segment.to}-${index}`} className="relative pb-10 last:pb-0">
          {index < segments.length - 1 && (
            <span
              className="absolute left-5 top-12 h-[calc(100%-2rem)] w-0.5 bg-border"
              aria-hidden
            />
          )}
          <motion.article
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            className={cn(
              'relative flex gap-4 rounded-xl border p-4 ml-0',
              'bg-card/80 backdrop-blur',
            )}
            aria-labelledby={`segment-title-${index}`}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl"
              aria-hidden
            >
              {modeIcons[segment.mode.toLowerCase()] ?? '🛣️'}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 id={`segment-title-${index}`} className="font-semibold text-foreground">
                  {segment.from} → {segment.to}
                </h4>
                <Badge variant={trafficVariant(segment.time_mins)}>
                  {formatMinutes(segment.time_mins)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {segment.mode_name} ({segment.mode}) · {segment.distance_km.toFixed(1)} km ·{' '}
                {formatCurrency(segment.cost)}
              </p>
            </div>
          </motion.article>
        </li>
      ))}
    </ol>
  );
}
