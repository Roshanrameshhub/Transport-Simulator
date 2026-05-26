import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Shield,
  User,
} from 'lucide-react';
import {
  preferencesToBookingRequest,
  useJourneyStore,
} from '@/store/journeyStore';
import { useCreateBooking } from '@/hooks/useTransportApi';
import { getApiErrorMessage } from '@/services/api/client';
import {
  buildUniqueQrPayload,
  generateUniqueJourneyCode,
} from '@/lib/qr/qrGenerator';
import { generateClientBookingRef, getModeMeta } from '@/lib/simulation';
import {
  clearPaymentTimers,
  retryOtp,
  startPaymentFlow,
  submitOtp,
} from '@/services/payment/paymentFlow.service';
import { formatOtpTimeRemaining } from '@/lib/otp/otpService';
import { useBookingFlowStore } from '@/store/bookingFlowStore';
import { toast } from '@/store/toastStore';
import { DigitalPass } from '@/components/booking/DigitalPass';
import { JourneyQrPanel } from '@/components/booking/JourneyQrPanel';
import { ReferenceScanner } from '@/components/scanner/ReferenceScanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

type BookingStep = 'details' | 'payment' | 'qr-verify' | 'activated';

export default function BookingPage() {
  const route = useJourneyStore((s) => s.routeResult);
  const preferences = useJourneyStore((s) => s.preferences);
  const passengerName = useJourneyStore((s) => s.passengerName);
  const setPassengerName = useJourneyStore((s) => s.setPassengerName);
  const setLastBooking = useJourneyStore((s) => s.setLastBooking);
  const setActiveTicket = useJourneyStore((s) => s.setActiveTicket);
  const activeTicket = useJourneyStore((s) => s.activeTicket);
  const bookingMutation = useCreateBooking();

  const paymentStatus = useBookingFlowStore((s) => s.paymentStatus);
  const otpSession = useBookingFlowStore((s) => s.otpSession);
  const setPaymentStatus = useBookingFlowStore((s) => s.setPaymentStatus);
  const setOtpSession = useBookingFlowStore((s) => s.setOtpSession);
  const indexBooking = useBookingFlowStore((s) => s.indexBooking);
  const resetPayment = useBookingFlowStore((s) => s.resetPayment);

  const [step, setStep] = useState<BookingStep>('details');
  const [localName, setLocalName] = useState(passengerName);
  const [otpInput, setOtpInput] = useState('');
  const [journeyCode, setJourneyCode] = useState('');
  const [clientRef, setClientRef] = useState('');
  const [qrPayload, setQrPayload] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [apiBookingId, setApiBookingId] = useState<string | null>(null);
  const [scannerDone, setScannerDone] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState('');

  useEffect(() => {
    if (activeTicket?.activatedAt) {
      setStep('activated');
      setApiBookingId(activeTicket.bookingId);
      setJourneyCode(activeTicket.journeyCode);
      setClientRef(activeTicket.clientBookingRef);
      setQrPayload(activeTicket.qrPayload);
    }
    return () => clearPaymentTimers();
  }, [activeTicket]);

  useEffect(() => {
    if (!otpSession) return;
    const id = setInterval(() => {
      setOtpCountdown(formatOtpTimeRemaining(otpSession.expiresAt));
    }, 1000);
    return () => clearInterval(id);
  }, [otpSession]);

  if (!route) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>No route selected</CardTitle>
          <CardDescription>Plan and select a route before booking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">Plan journey</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const start = route.path[0];
  const end = route.path[route.path.length - 1];
  const primaryMode = route.transport_modes_used[0] ?? 'metro';
  const vehicleHint =
    primaryMode === 'metro'
      ? 'metro gate validator'
      : primaryMode === 'bus'
        ? 'bus QR near the entrance'
        : `${getModeMeta(primaryMode).label} check-in`;

  const advanceToQrVerify = () => {
    const ref = generateClientBookingRef();
    const code = generateUniqueJourneyCode();
    const { payload, code: uniqueCode } = buildUniqueQrPayload(code, start, end, ref);
    setClientRef(ref);
    setJourneyCode(uniqueCode);
    setQrPayload(payload);
    setStep('qr-verify');
    toast.success('Payment confirmed', 'Scan vehicle QR and verify to activate ticket.');
  };

  const beginPayment = () => {
    if (!localName.trim()) {
      setVerifyError('Enter passenger name before payment.');
      toast.warning('Passenger name required');
      return;
    }
    setVerifyError(null);
    setPassengerName(localName.trim());
    setStep('payment');

    startPaymentFlow({
      onStatus: setPaymentStatus,
      onOtp: (session) => {
        setOtpSession(session);
        toast.success('OTP sent', `Simulated SMS code for demo (check console: ${session.code})`);
        console.info('[SimuChennai demo OTP]', session.code);
      },
      onPaid: advanceToQrVerify,
      onFailed: (msg) => {
        setVerifyError(msg);
        toast.error('Payment step failed', msg);
      },
      onTimeout: () => {
        setVerifyError('Payment timed out. Please retry.');
        toast.error('Payment timeout', 'Try again or check your network.');
      },
    });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSession) return;
    const updated = submitOtp(otpSession, otpInput, {
      onStatus: setPaymentStatus,
      onOtp: setOtpSession,
      onPaid: advanceToQrVerify,
      onFailed: (msg) => {
        setVerifyError(msg);
        toast.error('Invalid OTP', msg, () => {
          const s = retryOtp({
            onStatus: setPaymentStatus,
            onOtp: setOtpSession,
            onPaid: () => {},
            onFailed: () => {},
            onTimeout: () => {},
          });
          setOtpSession(s);
        });
      },
      onTimeout: () => {},
    });
    setOtpSession(updated);
  };

  const finalizeBooking = async () => {
    const body = preferencesToBookingRequest(preferences, localName.trim());
    try {
      const result = await bookingMutation.mutateAsync(body);
      setApiBookingId(result.booking_id);
      setLastBooking(result);
      indexBooking({
        bookingId: result.booking_id,
        clientRef,
        journeyCode,
        passengerName: localName.trim(),
        createdAt: Date.now(),
      });
      setActiveTicket({
        passengerName: localName.trim(),
        journeyCode,
        clientBookingRef: clientRef,
        bookingId: result.booking_id,
        qrPayload,
        activatedAt: Date.now(),
      });
      setStep('activated');
      resetPayment();
      toast.success('Ticket activated', 'Show digital pass to conductor.');
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setVerifyError(msg);
      toast.error('Activation failed', msg);
    }
  };

  const paymentStatusLabel: Record<string, string> = {
    pending: 'Awaiting confirmation',
    processing: 'Processing payment…',
    otp_sent: 'Enter OTP to confirm',
    verifying_otp: 'Verifying OTP…',
    paid: 'Paid',
    failed: 'Failed',
    timeout: 'Timed out',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-xl space-y-6">
      <GlassCard>
        <h2 className="text-xl font-bold">Smart ticket booking</h2>
        <p className="text-sm text-muted-foreground">
          {start} → {end} · {formatCurrency(route.total_cost)}
        </p>
      </GlassCard>

      <AnimatePresence mode="wait">
        {step === 'details' && (
          <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" aria-hidden />
                  Passenger details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passengerName">Passenger name</Label>
                  <Input
                    id="passengerName"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="e.g., Priya Raman"
                  />
                </div>
                <Button className="w-full" size="lg" onClick={() => setStep('payment')}>
                  Continue to payment
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" aria-hidden />
                  Payment
                </CardTitle>
                <CardDescription>
                  Flow: pending → processing → OTP → paid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-3xl font-bold text-primary">{formatCurrency(route.total_cost)}</p>
                <Badge variant="outline">{paymentStatusLabel[paymentStatus] ?? paymentStatus}</Badge>

                {paymentStatus === 'idle' && (
                  <Button className="w-full" size="lg" onClick={beginPayment} type="button">
                    Start payment
                  </Button>
                )}

                {(paymentStatus === 'pending' || paymentStatus === 'processing') && (
                  <p className="flex items-center justify-center gap-2 text-primary" role="status">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    {paymentStatusLabel[paymentStatus]}
                  </p>
                )}

                {(paymentStatus === 'otp_sent' || paymentStatus === 'verifying_otp') && otpSession && (
                  <form onSubmit={handleOtpSubmit} className="space-y-3 text-left">
                    <p className="text-sm text-muted-foreground">
                      OTP expires in {otpCountdown}
                    </p>
                    <Label htmlFor="otp">Enter 6-digit OTP</Label>
                    <Input
                      id="otp"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      className="text-center tracking-widest text-lg"
                    />
                    <Button type="submit" className="w-full" disabled={paymentStatus === 'verifying_otp'}>
                      Verify OTP
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        const s = retryOtp({
                          onStatus: setPaymentStatus,
                          onOtp: setOtpSession,
                          onPaid: () => {},
                          onFailed: () => {},
                          onTimeout: () => {},
                        });
                        setOtpSession(s);
                        toast.warning('New OTP sent');
                      }}
                    >
                      Resend OTP
                    </Button>
                  </form>
                )}

                {paymentStatus === 'timeout' && (
                  <Button onClick={beginPayment}>Retry payment</Button>
                )}

                {verifyError && (
                  <p className="text-sm text-destructive" role="alert">
                    {verifyError}
                  </p>
                )}
                <Button variant="ghost" type="button" onClick={() => { resetPayment(); setStep('details'); }}>
                  Back
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'qr-verify' && (
          <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
              <p className="text-sm font-medium">Payment successful — validate ride access</p>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" aria-hidden />
              Ref: {clientRef} · Journey: {journeyCode}
            </p>

            <JourneyQrPanel journeyCode={journeyCode} qrPayload={qrPayload} vehicleHint={vehicleHint} />

            <ReferenceScanner
              expected={{ journeyCode, clientRef }}
              qrPayloadForSimulation={qrPayload}
              onVerified={() => {
                setScannerDone(true);
                toast.success('Scanner verified');
              }}
              onError={(msg) => toast.error('Scanner error', msg)}
            />

            {scannerDone && (
              <Button
                className="w-full"
                size="lg"
                onClick={() => void finalizeBooking()}
                disabled={bookingMutation.isPending}
              >
                {bookingMutation.isPending ? 'Activating…' : 'Issue digital pass'}
              </Button>
            )}

            {verifyError && (
              <p className="text-sm text-destructive" role="alert">
                {verifyError}
              </p>
            )}
          </motion.div>
        )}

        {step === 'activated' && apiBookingId && (
          <motion.div key="pass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <DigitalPass
              passengerName={localName}
              bookingId={apiBookingId}
              journeyCode={journeyCode}
              clientRef={clientRef}
              route={route}
              qrPayload={qrPayload}
            />
            <Button variant="outline" asChild className="w-full">
              <Link to="/lookup">Look up booking</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
