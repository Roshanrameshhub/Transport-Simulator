import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, User } from 'lucide-react';
import type { RouteResponse } from '@/types/api';
import { formatCurrency } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

interface DigitalPassProps {
  passengerName: string;
  bookingId: string;
  journeyCode: string;
  clientRef: string;
  route: RouteResponse;
  qrPayload: string;
}

export function DigitalPass({
  passengerName,
  bookingId,
  journeyCode,
  clientRef,
  route,
  qrPayload,
}: DigitalPassProps) {
  const start = route.path[0];
  const end = route.path[route.path.length - 1];

  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
      className="perspective-[1000px]"
    >
      <GlassCard className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-primary/20 via-card/80 to-cyan-600/10">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)] animate-[shimmer_3s_infinite]"
          aria-hidden
        />
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">SimuChennai</p>
              <h3 className="text-xl font-bold">Digital Travel Pass</h3>
            </div>
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              VALID
            </Badge>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2 text-sm">
              <p className="flex items-center gap-2 font-semibold">
                <User className="h-4 w-4" aria-hidden />
                {passengerName}
              </p>
              <p>
                <span className="text-muted-foreground">Route: </span>
                {start} → {end}
              </p>
              <p>
                <span className="text-muted-foreground">Fare: </span>
                {formatCurrency(route.total_cost)}
              </p>
              <p className="font-mono text-xs">
                Booking: {bookingId}
                <br />
                Journey: {journeyCode}
                <br />
                Ref: {clientRef}
              </p>
            </div>
            <div className="rounded-lg bg-white p-2">
              <QRCodeSVG value={qrPayload} size={88} level="M" aria-hidden />
            </div>
          </div>

          <p className="rounded-md bg-primary/10 px-3 py-2 text-center text-sm font-medium">
            Show this pass to the conductor / gate inspector
          </p>
          <div className="flex flex-wrap gap-1">
            {route.transport_modes_used.map((m) => (
              <Badge key={m} variant="outline" className="capitalize">
                {m}
              </Badge>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
