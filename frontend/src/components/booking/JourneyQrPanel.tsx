import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { ScanLine } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface JourneyQrPanelProps {
  journeyCode: string;
  qrPayload: string;
  vehicleHint: string;
}

export function JourneyQrPanel({ journeyCode, qrPayload, vehicleHint }: JourneyQrPanelProps) {
  return (
    <GlassCard className="text-center">
      <motion.div
        animate={{ boxShadow: ['0 0 0 0 rgba(14,165,233,0.4)', '0 0 0 12px rgba(14,165,233,0)', '0 0 0 0 rgba(14,165,233,0)'] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="mx-auto mb-4 inline-block rounded-2xl bg-white p-4"
      >
        <QRCodeSVG value={qrPayload} size={160} level="M" aria-label={`QR code for journey ${journeyCode}`} />
      </motion.div>
      <p className="flex items-center justify-center gap-2 font-semibold">
        <ScanLine className="h-4 w-4 text-primary" aria-hidden />
        Scan inside {vehicleHint}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Locate the validator QR near the door or metro gate. After scanning, enter your journey code below
        to activate your digital pass.
      </p>
      <p
        className="mt-4 font-mono text-2xl font-bold tracking-widest text-primary"
        aria-label={`Journey code ${journeyCode}`}
      >
        {journeyCode}
      </p>
    </GlassCard>
  );
}
