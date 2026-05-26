import { parseQrPayload } from '@/lib/qr/qrGenerator';

export type ScannerVerificationResult =
  | { ok: true; code: string; ref?: string; source: 'qr' | 'manual' }
  | { ok: false; reason: 'mismatch' | 'invalid_format' | 'scanner_failed' | 'empty' };

export interface ScannerExpected {
  journeyCode: string;
  clientRef?: string;
  otp?: string;
}

export function verifyScannerInput(
  raw: string,
  expected: ScannerExpected,
  otpInput?: string,
): ScannerVerificationResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, reason: 'empty' };

  const parsed = parseQrPayload(trimmed);
  const code = (parsed?.code ?? trimmed).toUpperCase();
  const ref = parsed?.ref?.toUpperCase();

  if (!/^CHN-/.test(code) && !/^SCB-/.test(trimmed.toUpperCase())) {
    return { ok: false, reason: 'invalid_format' };
  }

  const codeMatch = code === expected.journeyCode.toUpperCase();
  const refMatch = expected.clientRef
    ? ref === expected.clientRef.toUpperCase() || trimmed.toUpperCase() === expected.clientRef.toUpperCase()
    : true;

  if (!codeMatch && !refMatch) {
    return { ok: false, reason: 'mismatch' };
  }

  if (expected.otp && otpInput) {
    const otpNorm = otpInput.replace(/\D/g, '');
    if (otpNorm.length < 4) return { ok: false, reason: 'mismatch' };
  }

  return {
    ok: true,
    code: codeMatch ? code : expected.journeyCode.toUpperCase(),
    ref: ref ?? expected.clientRef,
    source: trimmed.startsWith('{') ? 'qr' : 'manual',
  };
}

/** Simulates camera scan — returns payload after delay with small failure rate */
export async function simulateCameraScan(
  payload: string,
  failRate = 0.08,
): Promise<{ ok: true; data: string } | { ok: false; reason: 'scanner_failed' }> {
  await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800));
  if (Math.random() < failRate) {
    return { ok: false, reason: 'scanner_failed' };
  }
  return { ok: true, data: payload };
}
