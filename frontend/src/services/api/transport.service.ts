import { apiClient } from './client';
import type {
  BookingRequest,
  BookingResponse,
  PlanRouteParams,
  RouteResponse,
} from '@/types/api';

/**
 * GET /route/plan — query params must match Swagger exactly.
 * Omits selected_mode when empty (same as legacy fetch client).
 */
export async function planRoute(params: PlanRouteParams): Promise<RouteResponse> {
  const query: Record<string, string | number | boolean> = {
    start: params.start,
    end: params.end,
    prefer_cost: params.prefer_cost,
    prefer_time: params.prefer_time,
    time_weight: params.time_weight,
    cost_weight: params.cost_weight,
  };

  if (params.selected_mode !== undefined && params.selected_mode !== '') {
    query.selected_mode = params.selected_mode;
  }

  const { data } = await apiClient.get<RouteResponse>('/route/plan', { params: query });
  return data;
}

/** POST /booking/create */
export async function createBooking(body: BookingRequest): Promise<BookingResponse> {
  const { data } = await apiClient.post<BookingResponse>('/booking/create', body);
  return data;
}

/** GET /booking/{booking_id} */
export async function getBooking(bookingId: string): Promise<BookingResponse> {
  const { data } = await apiClient.get<BookingResponse>(`/booking/${bookingId}`);
  return data;
}
