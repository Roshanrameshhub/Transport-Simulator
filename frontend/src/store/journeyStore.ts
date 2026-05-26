import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BookingResponse, RouteResponse } from '@/types/api';

export interface JourneyPreferences {
  start: string;
  end: string;
  selectedMode: string;
  preferTime: boolean;
  preferCost: boolean;
  timeWeight: number;
  costWeight: number;
}

export interface ActiveTicket {
  passengerName: string;
  journeyCode: string;
  clientBookingRef: string;
  bookingId: string;
  qrPayload: string;
  activatedAt: number;
}

interface JourneyState {
  preferences: JourneyPreferences;
  passengerName: string;
  routeResult: RouteResponse | null;
  lastBooking: BookingResponse | null;
  activeTicket: ActiveTicket | null;
  setPreferences: (prefs: Partial<JourneyPreferences>) => void;
  setPassengerName: (name: string) => void;
  setRouteResult: (route: RouteResponse | null) => void;
  setLastBooking: (booking: BookingResponse | null) => void;
  setActiveTicket: (ticket: ActiveTicket | null) => void;
  clearRoute: () => void;
}

const defaultPreferences: JourneyPreferences = {
  start: '',
  end: '',
  selectedMode: '',
  preferTime: true,
  preferCost: false,
  timeWeight: 0.5,
  costWeight: 0.5,
};

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      passengerName: '',
      routeResult: null,
      lastBooking: null,
      activeTicket: null,
      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      setPassengerName: (name) => set({ passengerName: name }),
      setRouteResult: (route) => set({ routeResult: route }),
      setLastBooking: (booking) => set({ lastBooking: booking }),
      setActiveTicket: (ticket) => set({ activeTicket: ticket }),
      clearRoute: () => set({ routeResult: null }),
    }),
    {
      name: 'chennai-transport-journey',
      partialize: (state) => ({
        preferences: state.preferences,
        passengerName: state.passengerName,
        lastBooking: state.lastBooking,
        activeTicket: state.activeTicket,
      }),
    },
  ),
);

export function preferencesToPlanParams(prefs: JourneyPreferences) {
  return {
    start: prefs.start,
    end: prefs.end,
    prefer_cost: prefs.preferCost,
    prefer_time: prefs.preferTime,
    selected_mode: prefs.selectedMode === 'Best Available' ? '' : prefs.selectedMode,
    time_weight: prefs.timeWeight,
    cost_weight: prefs.costWeight,
  };
}

export function preferencesToBookingRequest(
  prefs: JourneyPreferences,
  user?: string,
): import('@/types/api').BookingRequest {
  const passenger = user?.trim() || 'test_user';
  return {
    user: passenger,
    start: prefs.start,
    end: prefs.end,
    selected_mode: prefs.selectedMode === 'Best Available' || !prefs.selectedMode ? 'any' : prefs.selectedMode,
    prefer_cost: prefs.preferCost,
    prefer_time: prefs.preferTime,
    time_weight: prefs.timeWeight,
    cost_weight: prefs.costWeight,
  };
}
