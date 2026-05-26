import {
  createOtpSession,
  recordOtpAttempt,
  validateOtp,
  type OtpSession,
} from '@/lib/otp/otpService';
import type { PaymentStatus } from '@/store/bookingFlowStore';

const PAYMENT_TIMEOUT_MS = 90_000;
const PROCESSING_MS = 1800;

export interface PaymentFlowCallbacks {
  onStatus: (status: PaymentStatus) => void;
  onOtp: (session: OtpSession) => void;
  onPaid: () => void;
  onFailed: (message: string) => void;
  onTimeout: () => void;
}

let processingTimer: ReturnType<typeof setTimeout> | null = null;
let timeoutTimer: ReturnType<typeof setTimeout> | null = null;

export function clearPaymentTimers() {
  if (processingTimer) clearTimeout(processingTimer);
  if (timeoutTimer) clearTimeout(timeoutTimer);
  processingTimer = null;
  timeoutTimer = null;
}

export function startPaymentFlow(callbacks: PaymentFlowCallbacks): void {
  clearPaymentTimers();
  callbacks.onStatus('pending');

  processingTimer = setTimeout(() => {
    callbacks.onStatus('processing');
    processingTimer = setTimeout(() => {
      const session = createOtpSession();
      callbacks.onOtp(session);
      callbacks.onStatus('otp_sent');
    }, PROCESSING_MS);
  }, 600);

  timeoutTimer = setTimeout(() => {
    callbacks.onStatus('timeout');
    callbacks.onTimeout();
    clearPaymentTimers();
  }, PAYMENT_TIMEOUT_MS);
}

export function submitOtp(
  session: OtpSession,
  input: string,
  callbacks: PaymentFlowCallbacks,
): OtpSession {
  callbacks.onStatus('verifying_otp');
  const result = validateOtp(session, input);

  if (result.valid) {
    clearPaymentTimers();
    callbacks.onStatus('paid');
    callbacks.onPaid();
    return session;
  }

  const updated = recordOtpAttempt(session);
  const reason =
    result.reason === 'expired'
      ? 'OTP expired. Request a new payment to continue.'
      : result.reason === 'max_attempts'
        ? 'Too many OTP attempts. Please retry payment.'
        : 'Invalid OTP. Check the SMS code and try again.';

  callbacks.onFailed(reason);
  callbacks.onStatus(result.reason === 'expired' ? 'failed' : 'otp_sent');
  return updated;
}

export function retryOtp(callbacks: PaymentFlowCallbacks): OtpSession {
  const session = createOtpSession();
  callbacks.onOtp(session);
  callbacks.onStatus('otp_sent');
  return session;
}
