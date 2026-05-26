const OTP_TTL_MS = 5 * 60 * 1000;

export interface OtpSession {
  code: string;
  expiresAt: number;
  attempts: number;
  maxAttempts: number;
}

export function generateOtp(length = 6): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

export function createOtpSession(maxAttempts = 5): OtpSession {
  return {
    code: generateOtp(),
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    maxAttempts,
  };
}

export type OtpValidationResult =
  | { valid: true }
  | { valid: false; reason: 'invalid' | 'expired' | 'max_attempts' | 'empty' };

export function validateOtp(session: OtpSession | null, input: string): OtpValidationResult {
  if (!session) return { valid: false, reason: 'empty' };
  if (Date.now() > session.expiresAt) return { valid: false, reason: 'expired' };
  if (session.attempts >= session.maxAttempts) return { valid: false, reason: 'max_attempts' };

  const normalized = input.replace(/\D/g, '');
  if (normalized.length < 4) return { valid: false, reason: 'empty' };
  if (normalized === session.code) return { valid: true };
  return { valid: false, reason: 'invalid' };
}

export function recordOtpAttempt(session: OtpSession): OtpSession {
  return { ...session, attempts: session.attempts + 1 };
}

export function formatOtpTimeRemaining(expiresAt: number): string {
  const sec = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
