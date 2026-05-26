import { describe, expect, it } from 'vitest';
import axios from 'axios';
import { getApiErrorMessage } from '@/services/api/client';

describe('getApiErrorMessage', () => {
  it('extracts FastAPI detail string', () => {
    const error = new axios.AxiosError('fail', undefined, undefined, undefined, {
      status: 400,
      data: { detail: 'Invalid landmark' },
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
    });
    expect(getApiErrorMessage(error)).toBe('Invalid landmark');
  });

  it('returns offline message when no response', () => {
    const original = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    const error = new axios.AxiosError('Network Error');
    expect(getApiErrorMessage(error)).toMatch(/offline/i);
    Object.defineProperty(navigator, 'onLine', { value: original, configurable: true });
  });
});
