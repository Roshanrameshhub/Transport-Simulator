import { getBooking } from '@/services/api/transport.service';
import type { BookingResponse } from '@/types/api';
import { getApiErrorMessage } from '@/services/api/client';
import axios from 'axios';

export type LookupStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export interface LookupResult {
  status: LookupStatus;
  data?: BookingResponse;
  error?: string;
  query?: string;
}

export async function lookupBookingById(bookingId: string): Promise<LookupResult> {
  const query = bookingId.trim();
  if (!query) {
    return { status: 'empty', error: 'Enter a booking ID or reference number.' };
  }

  try {
    const data = await getBooking(query);
    if (!data?.booking_id) {
      return { status: 'empty', query, error: 'No booking found for this reference.' };
    }
    return { status: 'success', data, query };
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return {
        status: 'empty',
        query,
        error: 'Booking not found. Check the ID or complete activation first.',
      };
    }
    return { status: 'error', query, error: getApiErrorMessage(err) };
  }
}
