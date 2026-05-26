import { useCallback, useEffect, useRef, useState } from 'react';
import { usePlanRoute } from '@/hooks/useTransportApi';
import type { RouteResponse } from '@/types/api';
import type { JourneyPreferences } from '@/store/journeyStore';
import { preferencesToPlanParams } from '@/store/journeyStore';
import { getApiErrorMessage } from '@/services/api/client';

const DEBOUNCE_MS = 450;

export function useLiveRoutePreview(
  prefs: JourneyPreferences | null,
  enabled: boolean,
) {
  const planMutation = usePlanRoute();
  const [preview, setPreview] = useState<RouteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const refresh = useCallback(async () => {
    if (!prefs?.start?.trim() || !prefs?.end?.trim()) {
      setPreview(null);
      setError(null);
      return;
    }

    try {
      const result = await planMutation.mutateAsync(preferencesToPlanParams(prefs));
      setPreview(result);
      setError(null);
      return result;
    } catch (err) {
      setError(getApiErrorMessage(err));
      return null;
    }
  }, [prefs, planMutation]);

  useEffect(() => {
    if (!enabled || !prefs) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void refresh();
    }, DEBOUNCE_MS);

    return () => clearTimeout(timerRef.current);
  }, [
    enabled,
    prefs?.start,
    prefs?.end,
    prefs?.selectedMode,
    prefs?.preferTime,
    prefs?.preferCost,
    prefs?.timeWeight,
    prefs?.costWeight,
    refresh,
  ]);

  return {
    preview,
    setPreview,
    error,
    isUpdating: planMutation.isPending,
    refresh,
  };
}
