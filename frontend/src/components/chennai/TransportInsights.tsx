import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { CHENNAI_INSIGHTS } from '@/lib/simulation';
import { GlassCard } from '@/components/ui/glass-card';

export function TransportInsights() {
  return (
    <GlassCard>
      <h3 className="mb-3 flex items-center gap-2 font-semibold">
        <Lightbulb className="h-4 w-4 text-amber-500" aria-hidden />
        Chennai corridor insights
      </h3>
      <ul className="space-y-2">
        {CHENNAI_INSIGHTS.map((tip, i) => (
          <motion.li
            key={tip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.12 }}
            className="rounded-lg border-l-2 border-primary/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground"
          >
            {tip}
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}
