import { motion } from 'framer-motion';
import { MapPin, Sparkles, TrainFront } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

export function ChennaiHeroBanner() {
  return (
    <GlassCard className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Badge className="w-fit gap-1" variant="secondary">
            <Sparkles className="h-3 w-3" aria-hidden />
            SimuChennai Smart Mobility
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Chennai Smart-City Transport Command
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Live corridor intelligence across CMRL metro, MTC bus, and on-demand modes — plan,
            compare, and book with real-time ETA simulation.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <TrainFront className="h-3.5 w-3.5 text-primary" aria-hidden />
              50+ landmarks mapped
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
              Multi-modal routing engine
            </span>
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="grid grid-cols-2 gap-2 text-center text-xs md:min-w-[200px]"
          aria-hidden
        >
          {[
            { label: 'Metro lines', value: '2 live' },
            { label: 'Active buses', value: '3.9K' },
            { label: 'Avg ETA accuracy', value: '94%' },
            { label: 'Green score', value: 'A-' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border/50 bg-background/50 px-3 py-2 backdrop-blur"
            >
              <p className="font-bold text-foreground">{s.value}</p>
              <p className="text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </GlassCard>
  );
}
