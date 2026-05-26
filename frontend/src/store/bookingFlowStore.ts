import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OtpSession } from '@/lib/otp/otpService';

export type PaymentStatus =
  | 'idle'
  | 'pending'
  | 'processing'
  | 'otp_sent'
  | 'verifying_otp'
  | 'paid'
  | 'failed'
  | 'timeout';

export interface LocalBookingIndex {
  bookingId: string;
  clientRef: string;
  journeyCode: string;
  passengerName: string;
  createdAt: number;
}

interface BookingFlowState {
  paymentStatus: PaymentStatus;
  otpSession: OtpSession | null;
  paymentStartedAt: number | null;
  localBookings: LocalBookingIndex[];
  setPaymentStatus: (status: PaymentStatus) => void;
  setOtpSession: (session: OtpSession | null) => void;
  setPaymentStartedAt: (ts: number | null) => void;
  indexBooking: (entry: LocalBookingIndex) => void;
  resolveBookingId: (query: string) => string | null;
  resetPayment: () => void;
}

export const useBookingFlowStore = create<BookingFlowState>()(
  persist(
    (set, get) => ({
      paymentStatus: 'idle',
      otpSession: null,
      paymentStartedAt: null,
      localBookings: [],
      setPaymentStatus: (paymentStatus) => set({ paymentStatus }),
      setOtpSession: (otpSession) => set({ otpSession }),
      setPaymentStartedAt: (paymentStartedAt) => set({ paymentStartedAt }),
      indexBooking: (entry) =>
        set((s) => ({
          localBookings: [
            entry,
            ...s.localBookings.filter((b) => b.bookingId !== entry.bookingId),
          ].slice(0, 50),
        })),
      resolveBookingId: (query) => {
        const q = query.trim();
        if (!q) return null;
        const bookings = get().localBookings;
        const byId = bookings.find((b) => b.bookingId === q);
        if (byId) return byId.bookingId;
        const byRef = bookings.find(
          (b) => b.clientRef.toUpperCase() === q.toUpperCase(),
        );
        if (byRef) return byRef.bookingId;
        const byCode = bookings.find(
          (b) => b.journeyCode.toUpperCase() === q.toUpperCase(),
        );
        if (byCode) return byCode.bookingId;
        return q;
      },
      resetPayment: () =>
        set({
          paymentStatus: 'idle',
          otpSession: null,
          paymentStartedAt: null,
        }),
    }),
    {
      name: 'simuchennai-booking-flow',
      partialize: (s) => ({ localBookings: s.localBookings }),
    },
  ),
);
