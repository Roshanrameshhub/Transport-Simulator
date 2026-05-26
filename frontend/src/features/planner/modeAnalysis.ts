import type { RouteResponse } from '@/types/api';
import { planRoute } from '@/services/api/transport.service';
import type { JourneyPreferences } from '@/store/journeyStore';
import { preferencesToPlanParams } from '@/store/journeyStore';

const ALTERNATIVE_MODES = ['metro', 'bus', 'car', 'rapido', 'taxi'] as const;

export interface ModeAlternative {
  mode: string;
  route: RouteResponse;
  reason: string;
  savings?: string;
}

export function isSelectedModeAvailable(
  selectedMode: string,
  route: RouteResponse,
): boolean {
  if (!selectedMode || selectedMode === 'Best Available') return true;
  const wanted = selectedMode.toLowerCase();
  return route.transport_modes_used.some((m) => m.toLowerCase() === wanted);
}

export function getUnavailableMessage(selectedMode: string): string {
  return `${selectedMode} is not available on the optimal path for this corridor. SimuChennai found faster multi-modal alternatives below.`;
}

export async function fetchModeAlternatives(
  prefs: JourneyPreferences,
  excludeMode?: string,
): Promise<ModeAlternative[]> {
  const modes = ALTERNATIVE_MODES.filter((m) => m !== excludeMode?.toLowerCase());
  const base = preferencesToPlanParams(prefs);

  const results = await Promise.allSettled(
    modes.map(async (mode) => {
      const route = await planRoute({ ...base, selected_mode: mode });
      return { mode, route };
    }),
  );

  const alternatives: ModeAlternative[] = [];

  for (const r of results) {
    if (r.status !== 'fulfilled') continue;
    const { mode, route } = r.value;
    if (!route.path.length) continue;

    const reason =
      mode === 'metro'
        ? 'Fastest backbone — reliable during peak'
        : mode === 'bus'
          ? 'Budget-friendly MTC connection'
          : mode === 'car'
            ? 'Comfortable door-to-door'
            : mode === 'rapido'
              ? 'Agile last-mile through local streets'
              : 'Classic taxi availability';

    alternatives.push({
      mode,
      route,
      reason,
      savings:
        mode === 'bus'
          ? `~₹${Math.max(5, Math.round(route.total_cost * 0.15))} less vs cab`
          : mode === 'metro'
            ? `${route.total_time.toFixed(0)} min total`
            : undefined,
    });
  }

  return alternatives
    .sort((a, b) => a.route.total_time - b.route.total_time)
    .slice(0, 3);
}

/** Faster routes when journey exceeds threshold — prioritizes metro/rapido */
export async function fetchFasterAlternatives(
  prefs: JourneyPreferences,
  currentTime: number,
): Promise<ModeAlternative[]> {
  const alts = await fetchModeAlternatives(prefs);
  return alts
    .filter((a) => a.route.total_time < currentTime - 5)
    .sort((a, b) => a.route.total_time - b.route.total_time)
    .slice(0, 3);
}
