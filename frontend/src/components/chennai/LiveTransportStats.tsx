import { motion } from 'framer-motion';
import { Bus, TrainFront } from 'lucide-react';
import { LIVE_BUS_STATS, LIVE_METRO_STATS } from '@/lib/simulation';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

export function LiveTransportStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <GlassCard>
        <div className="mb-3 flex items-center gap-2">
          <TrainFront className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="font-semibold">CMRL Metro Live</h3>
        </div>
        <div className="space-y-3 text-sm">
          {Object.entries(LIVE_METRO_STATS).map(([line, data], i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 px-3 py-2"
            >
              <span className="capitalize">{line.replace(/([A-Z])/g, ' $1')}</span>
              <div className="flex items-center gap-2">
                <Badge variant={data.delay > 5 ? 'warning' : 'success'}>{data.status}</Badge>
                <span className="text-muted-foreground">{data.occupancy}% full</span>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="mb-3 flex items-center gap-2">
          <Bus className="h-5 w-5 text-primary" aria-hidden />
          <h3 className="font-semibold">MTC Bus Network</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border/40 bg-background/40 p-3">
            <p className="text-2xl font-bold">{LIVE_BUS_STATS.mtcFleet.onRoute}</p>
            <p className="text-muted-foreground">Buses on route</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-background/40 p-3">
            <p className="text-2xl font-bold">+{LIVE_BUS_STATS.mtcFleet.avgDelay}m</p>
            <p className="text-muted-foreground">Avg delay</p>
          </div>
          <div className="col-span-2 rounded-lg border border-border/40 bg-background/40 p-3">
            <p className="font-medium">AC services · {LIVE_BUS_STATS.acServices.occupancy}% occupancy</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
