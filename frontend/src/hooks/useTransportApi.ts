import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createBooking,
  getBooking,
  planRoute,
} from '@/services/api/transport.service';
import type { BookingRequest, PlanRouteParams } from '@/types/api';

export const transportKeys = {
  all: ['transport'] as const,
  plan: (params: PlanRouteParams) => [...transportKeys.all, 'plan', params] as const,
  booking: (id: string) => [...transportKeys.all, 'booking', id] as const,
};

export function usePlanRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PlanRouteParams) => planRoute(params),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(transportKeys.plan(variables), data);
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: BookingRequest) => createBooking(body),
    onMutate: async () => {
      return { optimisticAt: Date.now() };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(transportKeys.booking(data.booking_id), data);
    },
  });
}

export function useGetBooking(bookingId: string, enabled = true) {
  return useQuery({
    queryKey: transportKeys.booking(bookingId),
    queryFn: () => getBooking(bookingId),
    enabled: enabled && bookingId.length > 0,
    staleTime: 60_000,
    retry: 1,
  });
}
