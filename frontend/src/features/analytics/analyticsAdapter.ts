import type { RouteResponse, SegmentDetail } from '@/types/api';
import { getEcoImpact, getOccupancyPercent } from '@/lib/simulation';

/** Chart-safe hex colors (Recharts does not resolve CSS variables reliably) */
export const CHART_COLORS = {
  primary: '#0ea5e9',
  cyan: '#06b6d4',
  emerald: '#10b981',
  amber: '#f59e0b',
  violet: '#8b5cf6',
  rose: '#f43f5e',
} as const;

export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.cyan,
  CHART_COLORS.emerald,
  CHART_COLORS.amber,
  CHART_COLORS.violet,
];

export interface AnalyticsSnapshot {
  hasData: boolean;
  modeDistribution: { name: string; value: number }[];
  segmentCosts: { segment: string; cost: number; time: number; mode: string }[];
  segmentTimes: { segment: string; minutes: number }[];
  kpis: {
    stops: number;
    segments: number;
    totalTime: number;
    totalCost: number;
    confidence: number;
  };
  eco: ReturnType<typeof getEcoImpact> | null;
  occupancyByMode: { mode: string; occupancy: number }[];
}

export function buildAnalyticsSnapshot(route: RouteResponse | null): AnalyticsSnapshot {
  if (!route || !route.detailed_segments?.length) {
    return {
      hasData: false,
      modeDistribution: [],
      segmentCosts: [],
      segmentTimes: [],
      kpis: { stops: 0, segments: 0, totalTime: 0, totalCost: 0, confidence: 0 },
      eco: null,
      occupancyByMode: [],
    };
  }

  const modeCount = route.transport_modes_used.reduce<Record<string, number>>((acc, mode) => {
    acc[mode] = (acc[mode] ?? 0) + 1;
    return acc;
  }, {});

  const modeDistribution = Object.entries(modeCount).map(([name, value]) => ({ name, value }));

  const segmentCosts = route.detailed_segments.map((s: SegmentDetail, i) => ({
    segment: `S${i + 1}`,
    cost: Number(s.cost.toFixed(1)),
    time: Number(s.time_mins.toFixed(1)),
    mode: s.mode,
  }));

  const segmentTimes = route.detailed_segments.map((s, i) => ({
    segment: `S${i + 1}`,
    minutes: Number(s.time_mins.toFixed(1)),
  }));

  const uniqueModes = [...new Set(route.transport_modes_used)];
  const confidence = Math.min(
    98,
    72 + uniqueModes.length * 6 + (route.total_time < 50 ? 10 : 0),
  );

  return {
    hasData: true,
    modeDistribution,
    segmentCosts,
    segmentTimes,
    kpis: {
      stops: route.path.length,
      segments: route.detailed_segments.length,
      totalTime: route.total_time,
      totalCost: route.total_cost,
      confidence,
    },
    eco: getEcoImpact(route),
    occupancyByMode: uniqueModes.map((mode) => ({
      mode,
      occupancy: getOccupancyPercent(mode),
    })),
  };
}

export function buildFallbackAnalytics() {
  return {
    modeDistribution: [
      { name: 'metro', value: 2 },
      { name: 'bus', value: 1 },
    ],
    message: 'Plan a route to see live journey analytics.',
  };
}
