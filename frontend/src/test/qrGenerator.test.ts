import { describe, expect, it, beforeEach } from 'vitest';
import {
  buildUniqueQrPayload,
  generateUniqueJourneyCode,
  isCodeRegistered,
  registerQrEntry,
} from '@/lib/qr/qrGenerator';

describe('qrGenerator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates unique journey codes', () => {
    const a = generateUniqueJourneyCode();
    const b = generateUniqueJourneyCode();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^CHN-/);
  });

  it('rejects duplicate registration', () => {
    const code = 'CHN-TEST-AAAA';
    const payload = '{"code":"CHN-TEST-AAAA"}';
    expect(registerQrEntry(code, payload)).toBe(true);
    expect(registerQrEntry(code, payload)).toBe(false);
    expect(isCodeRegistered(code)).toBe(true);
  });

  it('regenerates on payload collision', () => {
    const first = buildUniqueQrPayload('CHN-DUP-1111', 'Avadi', 'Porur', 'SCB-REF1');
    const second = buildUniqueQrPayload('CHN-DUP-1111', 'Avadi', 'Porur', 'SCB-REF2');
    expect(first.code).toBeTruthy();
    expect(second.code).toBeTruthy();
    expect(second.payload).not.toBe(first.payload);
  });
});
