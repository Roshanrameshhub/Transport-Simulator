import { describe, expect, it } from 'vitest';
import {
  createOtpSession,
  recordOtpAttempt,
  validateOtp,
} from '@/lib/otp/otpService';

describe('otpService', () => {
  it('validates correct OTP', () => {
    const session = createOtpSession();
    expect(validateOtp(session, session.code)).toEqual({ valid: true });
  });

  it('rejects invalid OTP', () => {
    const session = createOtpSession();
    expect(validateOtp(session, '000000')).toEqual({ valid: false, reason: 'invalid' });
  });

  it('locks after max attempts', () => {
    let session = createOtpSession();
    for (let i = 0; i < session.maxAttempts; i++) {
      session = recordOtpAttempt(session);
    }
    expect(validateOtp(session, session.code).valid).toBe(false);
  });
});
