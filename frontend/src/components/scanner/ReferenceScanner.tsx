import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Keyboard, Loader2, ScanLine, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  simulateCameraScan,
  verifyScannerInput,
  type ScannerExpected,
} from '@/lib/scanner/scannerService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

export type ScannerPhase = 'idle' | 'scanning' | 'manual' | 'verified' | 'failed';

interface ReferenceScannerProps {
  expected: ScannerExpected;
  qrPayloadForSimulation: string;
  otpValue?: string;
  onVerified: (code: string) => void;
  onError?: (message: string) => void;
  className?: string;
}

export function ReferenceScanner({
  expected,
  qrPayloadForSimulation,
  otpValue,
  onVerified,
  onError,
  className,
}: ReferenceScannerProps) {
  const [phase, setPhase] = useState<ScannerPhase>('idle');
  const [manualCode, setManualCode] = useState('');
  const [manualOtp, setManualOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runVerify = (raw: string, otp?: string) => {
    const result = verifyScannerInput(raw, expected, otp ?? otpValue ?? manualOtp);
    if (result.ok) {
      setPhase('verified');
      setErrorMsg(null);
      onVerified(result.code);
      return true;
    }
    const msg =
      result.reason === 'mismatch'
        ? 'QR/reference mismatch. Use the code from your ticket.'
        : result.reason === 'invalid_format'
          ? 'Invalid format. Enter CHN-XXXX-XXXX or booking reference.'
          : 'Enter a code or scan again.';
    setErrorMsg(msg);
    setPhase('failed');
    onError?.(msg);
    return false;
  };

  const handleCameraScan = async () => {
    setPhase('scanning');
    setErrorMsg(null);
    const scan = await simulateCameraScan(qrPayloadForSimulation);
    if (!scan.ok) {
      setPhase('failed');
      const msg = 'Scanner failed — use manual entry or retry.';
      setErrorMsg(msg);
      onError?.(msg);
      return;
    }
    runVerify(scan.data, otpValue);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerify(manualCode, manualOtp);
  };

  return (
    <GlassCard className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <ScanLine className="h-5 w-5 text-primary" aria-hidden />
        <h3 className="font-semibold">Transport access scanner</h3>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={phase === 'scanning' ? 'default' : 'outline'}
          className="flex-1 gap-2"
          onClick={handleCameraScan}
          disabled={phase === 'scanning' || phase === 'verified'}
          aria-busy={phase === 'scanning'}
        >
          {phase === 'scanning' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Camera className="h-4 w-4" aria-hidden />
          )}
          Simulate camera scan
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => setPhase('manual')}
          disabled={phase === 'verified'}
        >
          <Keyboard className="h-4 w-4" aria-hidden />
          Manual entry
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'manual' && (
          <motion.form
            key="manual"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
            onSubmit={handleManualSubmit}
            className="space-y-3"
          >
            <div className="space-y-2">
              <Label htmlFor="manualRef">Journey code or reference</Label>
              <Input
                id="manualRef"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder={expected.journeyCode}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manualOtp">OTP (if required)</Label>
              <Input
                id="manualOtp"
                inputMode="numeric"
                maxLength={6}
                value={manualOtp}
                onChange={(e) => setManualOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit OTP"
              />
            </div>
            <Button type="submit" className="w-full">
              Verify & activate
            </Button>
          </motion.form>
        )}

        {phase === 'verified' && (
          <motion.div
            key="ok"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-300"
            role="status"
          >
            <CheckCircle2 className="h-5 w-5" aria-hidden />
            <span className="text-sm font-medium">Verified — ticket ready for conductor</span>
          </motion.div>
        )}

        {phase === 'failed' && errorMsg && (
          <motion.div
            key="err"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-sm">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
