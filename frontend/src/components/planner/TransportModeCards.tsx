import { motion } from 'framer-motion';
import { getModeMeta } from '@/lib/simulation';
import { cn } from '@/lib/utils';

const MODES = ['metro', 'bus', 'car', 'rapido', 'taxi'] as const;

interface TransportModeCardsProps {
  selected: string;
  onSelect: (mode: string) => void;
}

export function TransportModeCards({ selected, onSelect }: TransportModeCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5" role="listbox" aria-label="Transport modes">
      <motion.button
        type="button"
        role="option"
        aria-selected={selected === 'Best Available'}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('Best Available')}
        className={cn(
          'rounded-xl border p-3 text-left text-sm transition-colors',
          selected === 'Best Available'
            ? 'border-primary bg-primary/15 ring-2 ring-primary/40'
            : 'border-border/60 bg-card/50 hover:border-primary/40',
        )}
      >
        <span className="text-xl" aria-hidden>
          ✨
        </span>
        <p className="mt-1 font-semibold">Best Available</p>
        <p className="text-xs text-muted-foreground">Auto-optimized</p>
      </motion.button>

      {MODES.map((mode, i) => {
        const meta = getModeMeta(mode);
        const active = selected.toLowerCase() === mode;
        return (
          <motion.button
            key={mode}
            type="button"
            role="option"
            aria-selected={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mode)}
            className={cn(
              'rounded-xl border p-3 text-left text-sm transition-colors',
              active
                ? 'border-primary bg-primary/15 ring-2 ring-primary/40'
                : 'border-border/60 bg-card/50 hover:border-primary/40',
            )}
          >
            <span className="text-xl" aria-hidden>
              {meta.icon}
            </span>
            <p className="mt-1 font-semibold capitalize">{meta.label}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{meta.tagline}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
