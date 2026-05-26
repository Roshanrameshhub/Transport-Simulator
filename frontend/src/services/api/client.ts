import axios, { type AxiosError } from 'axios';
import type { ApiErrorBody } from '@/types/api';
import { API_BASE_URL } from '@/lib/constants';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
  timeout: 30000,
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const detail = axiosError.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    if (axiosError.response?.status === 404) return 'Resource not found.';
    if (axiosError.response?.status === 400) return 'Invalid request. Check your inputs.';
    if (!axiosError.response) {
      return navigator.onLine
        ? 'Unable to reach the transport API. Is the backend running?'
        : 'You appear to be offline. Reconnect to plan routes.';
    }
    return `Request failed (${axiosError.response.status}).`;
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}
