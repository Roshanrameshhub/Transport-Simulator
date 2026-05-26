import { useCallback, useState } from 'react';
import { lookupBookingById, type LookupResult, type LookupStatus } from '@/services/booking/lookup.service';
import { useBookingFlowStore } from '@/store/bookingFlowStore';
import { toast } from '@/store/toastStore';

export function useLookupBooking() {
  const [result, setResult] = useState<LookupResult>({ status: 'idle' });
  const resolveBookingId = useBookingFlowStore((s) => s.resolveBookingId);

  const search = useCallback(async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) {
      setResult({ status: 'empty', error: 'Enter a booking ID or reference number.' });
      return;
    }

    setResult({ status: 'loading', query });

    const resolvedId = resolveBookingId(query) ?? query;
    const lookup = await lookupBookingById(resolvedId);
    setResult(lookup);

    if (lookup.status === 'success') {
      toast.success('Booking found', `Status: ${lookup.data?.status}`);
    } else if (lookup.status === 'empty') {
      toast.warning('No booking found', lookup.error);
    } else if (lookup.status === 'error') {
      toast.error('Lookup failed', lookup.error, () => search(query));
    }
  }, [resolveBookingId]);

  const reset = useCallback(() => setResult({ status: 'idle' }), []);

  return {
    result,
    status: result.status as LookupStatus,
    search,
    reset,
    isLoading: result.status === 'loading',
  };
}
