import type { RouteResponse, SegmentDetail } from '@/types/api';

/** Handcrafted Chennai smart-city simulation data — frontend only */
export const LIVE_METRO_STATS = {
  greenLine: { status: 'On Time', delay: 2, occupancy: 68 },
  blueLine: { status: 'Minor Delay', delay: 7, occupancy: 82 },
} as const;

export const LIVE_BUS_STATS = {
  mtcFleet: { active: 4120, onRoute: 3891, avgDelay: 11 },
  acServices: { active: 340, occupancy: 54 },
} as const;

export const CHENNAI_INSIGHTS = [
  'Velachery corridor sees 18% faster metro transfers before 9 AM.',
  'OMR bus lanes are moderately congested — consider metro + walk for Sholinganallur.',
  'Evening peak on GST Road: +12 min average for road modes.',
] as const;

const MODE_META: Record<string, { label: string; icon: string; tagline: string }> = {
  bus: { label: 'MTC Bus', icon: '🚌', tagline: 'Economical last-mile connectivity' },
  metro: { label: 'CMRL Metro', icon: '🚇', tagline: 'Fastest cross-city backbone' },
  car: { label: 'Cab / Car', icon: '🚗', tagline: 'Door-to-door comfort' },
  rapido: { label: 'Rapido Bike', icon: '🏍️', tagline: 'Quick weave through traffic' },
  taxi: { label: 'City Taxi', icon: '🚕', tagline: 'Reliable street hail' },
};

export function getModeMeta(mode: string) {
  return MODE_META[mode.toLowerCase()] ?? { label: mode, icon: '🛣️', tagline: 'Multi-modal segment' };
}

export function isPeakHour(date = new Date()): boolean {
  const h = date.getHours();
  return (h >= 8 && h < 11) || (h >= 17 && h < 21);
}

export function getPeakHourAlert(): string | null {
  if (!isPeakHour()) return null;
  const h = new Date().getHours();
  if (h < 12) return 'Morning peak active on Anna Salai & OMR — expect +8–15 min on road modes.';
  return 'Evening peak on GST & IT corridors — metro recommended for predictable ETA.';
}

export function getCongestionLevel(segments: SegmentDetail[]): 'low' | 'moderate' | 'high' {
  const roadModes = segments.filter((s) => ['car', 'taxi', 'rapido', 'bus'].includes(s.mode));
  const avgTime = roadModes.reduce((a, s) => a + s.time_mins, 0) / (roadModes.length || 1);
  if (avgTime < 12) return 'low';
  if (avgTime < 22) return 'moderate';
  return 'high';
}

export function getOccupancyPercent(mode: string): number {
  const base: Record<string, number> = {
    metro: 72,
    bus: 61,
    car: 38,
    taxi: 45,
    rapido: 52,
  };
  const peak = isPeakHour() ? 14 : 0;
  return Math.min(98, (base[mode.toLowerCase()] ?? 50) + peak + Math.floor(Math.random() * 8));
}

export function getEcoImpact(route: RouteResponse) {
  const km = route.detailed_segments.reduce((a, s) => a + s.distance_km, 0);
  const metroShare = route.transport_modes_used.filter((m) => m === 'metro').length;
  const co2Kg = Math.max(0.4, km * 0.12 - metroShare * 0.08);
  const treesEquiv = Math.round(co2Kg / 0.06);
  return {
    co2SavedKg: Number((km * 0.18 - co2Kg).toFixed(2)),
    co2EmittedKg: Number(co2Kg.toFixed(2)),
    treesEquivalent: treesEquiv,
    greenScore: Math.min(100, 55 + metroShare * 12 + (route.total_cost < 80 ? 8 : 0)),
  };
}

export function generateClientBookingRef(): string {
  return `SCB-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

export function deriveAiSuggestion(route: RouteResponse, preferTime: boolean, preferCost: boolean): string {
  if (preferCost && route.total_cost > 120) {
    return 'Switch one segment to MTC bus to trim fare ~₹25 without major time loss.';
  }
  if (preferTime && route.total_time > 45) {
    return 'Metro-first routing could shave 10–14 minutes during peak windows.';
  }
  if (route.transport_modes_used.includes('metro')) {
    return 'Your route uses CMRL — tap in at station QR validators when boarding.';
  }
  return 'Balanced multi-modal path — live ETA updates as Chennai traffic shifts.';
}

/** When both toggles on, time is prioritized over cost */
export function computeToggleWeights(preferTime: boolean, preferCost: boolean) {
  if (preferTime && preferCost) return { timeWeight: 0.65, costWeight: 0.35 };
  if (preferTime) return { timeWeight: 0.85, costWeight: 0.15 };
  if (preferCost) return { timeWeight: 0.15, costWeight: 0.85 };
  return { timeWeight: 0.5, costWeight: 0.5 };
}

export const LONG_ROUTE_THRESHOLD_MINS = 60;

export function isLongRoute(totalTimeMins: number): boolean {
  return totalTimeMins > LONG_ROUTE_THRESHOLD_MINS;
}

export function getLongRouteWarning(totalTimeMins: number): string | null {
  if (!isLongRoute(totalTimeMins)) return null;
  return `This route takes more time (${totalTimeMins.toFixed(0)} min). Consider faster alternatives below.`;
}

export function getRouteConfidenceScore(route: RouteResponse): number {
  const modes = new Set(route.transport_modes_used).size;
  const segFactor = Math.min(route.detailed_segments.length * 4, 20);
  return Math.min(98, 68 + modes * 8 + segFactor + (route.total_time < 45 ? 8 : 0));
}

export function simulateGpsProgress(totalMins: number, elapsedSec: number): number {
  return Math.min(100, (elapsedSec / (totalMins * 60)) * 100);
}
