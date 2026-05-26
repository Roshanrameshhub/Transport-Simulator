import { describe, expect, it, vi, beforeEach } from 'vitest';
import { apiClient } from '@/services/api/client';
import {
  createBooking,
  getBooking,
  planRoute,
} from '@/services/api/transport.service';
import { ROUTE_PLAN_QUERY_KEYS } from '@/lib/constants';

vi.mock('@/services/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('transport.service API contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /route/plan uses exact Swagger query param names', async () => {
    const mockResponse = {
      path: ['Avadi', 'Porur'],
      total_cost: 48,
      total_time: 35.4,
      transport_modes_used: ['metro'],
      arrival_time: '2026-05-25T12:00:00',
      detailed_segments: [],
    };
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockResponse });

    await planRoute({
      start: 'Avadi',
      end: 'Porur',
      prefer_cost: true,
      prefer_time: false,
      selected_mode: 'metro',
      time_weight: 0.5,
      cost_weight: 0.5,
    });

    expect(apiClient.get).toHaveBeenCalledWith('/route/plan', {
      params: {
        start: 'Avadi',
        end: 'Porur',
        prefer_cost: true,
        prefer_time: false,
        time_weight: 0.5,
        cost_weight: 0.5,
        selected_mode: 'metro',
      },
    });

    ROUTE_PLAN_QUERY_KEYS.forEach((key) => {
      const call = vi.mocked(apiClient.get).mock.calls[0][1]?.params as Record<string, unknown>;
      if (key === 'selected_mode') return;
      expect(call).toHaveProperty(key);
    });
  });

  it('omits selected_mode when empty (legacy behavior)', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { path: [], detailed_segments: [] } });

    await planRoute({
      start: 'Avadi',
      end: 'Porur',
      prefer_cost: true,
      prefer_time: false,
      selected_mode: '',
      time_weight: 1,
      cost_weight: 1,
    });

    const params = vi.mocked(apiClient.get).mock.calls[0][1]?.params as Record<string, unknown>;
    expect(params).not.toHaveProperty('selected_mode');
  });

  it('POST /booking/create sends BookingRequest body', async () => {
    const body = {
      user: 'test_user',
      start: 'Avadi',
      end: 'Porur',
      selected_mode: 'any',
      prefer_cost: false,
      prefer_time: true,
      time_weight: 0.5,
      cost_weight: 0.5,
    };
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        booking_id: 'uuid-1',
        status: 'Booked successfully',
        path: ['Avadi', 'Porur'],
        transport_modes_used: ['metro'],
        total_cost: 48,
        total_time: 35,
      },
    });

    await createBooking(body);

    expect(apiClient.post).toHaveBeenCalledWith('/booking/create', body);
  });

  it('GET /booking/{booking_id} uses path param', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { booking_id: 'abc', status: 'Found', path: [], transport_modes_used: [], total_cost: 0, total_time: 0 },
    });

    await getBooking('abc-123');

    expect(apiClient.get).toHaveBeenCalledWith('/booking/abc-123');
  });
});
