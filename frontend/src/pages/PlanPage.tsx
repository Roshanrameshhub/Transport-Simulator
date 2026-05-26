import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Clock, Coins, Loader2, Route } from 'lucide-react';
import { planJourneySchema, type PlanJourneyFormValues } from '@/features/planner/schemas';
import {
  fetchModeAlternatives,
  fetchFasterAlternatives,
  getUnavailableMessage,
  isSelectedModeAvailable,
  type ModeAlternative,
} from '@/features/planner/modeAnalysis';
import { useLiveRoutePreview } from '@/hooks/useLiveRoutePreview';
import { useJourneyStore } from '@/store/journeyStore';
import { CHENNAI_LANDMARKS } from '@/lib/constants';
import {
  computeToggleWeights,
  getLongRouteWarning,
  isLongRoute,
  simulateGpsProgress,
} from '@/lib/simulation';
import { ModeUnavailableBanner } from '@/components/planner/ModeUnavailableBanner';
import { RouteDurationWarning } from '@/components/planner/RouteDurationWarning';
import { ChennaiHeroBanner } from '@/components/chennai/ChennaiHeroBanner';
import { LiveTransportStats } from '@/components/chennai/LiveTransportStats';
import { TransportInsights } from '@/components/chennai/TransportInsights';
import { LiveRoutePreview } from '@/components/planner/LiveRoutePreview';
import { ModeRecommendationCards } from '@/components/planner/ModeRecommendationCards';
import { TransportModeCards } from '@/components/planner/TransportModeCards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GlassCard } from '@/components/ui/glass-card';

export default function PlanPage() {
  const navigate = useNavigate();
  const { preferences, setPreferences, setRouteResult } = useJourneyStore();
  const [alternatives, setAlternatives] = useState<ModeAlternative[]>([]);
  const [fasterAlternatives, setFasterAlternatives] = useState<ModeAlternative[]>([]);
  const [altLoading, setAltLoading] = useState(false);
  const [fasterLoading, setFasterLoading] = useState(false);
  const [gpsProgress, setGpsProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlanJourneyFormValues>({
    resolver: zodResolver(planJourneySchema),
    defaultValues: {
      start: preferences.start,
      end: preferences.end,
      selectedMode: preferences.selectedMode || 'Best Available',
      preferTime: preferences.preferTime,
      preferCost: preferences.preferCost,
      timeWeight: preferences.timeWeight,
      costWeight: preferences.costWeight,
    },
  });

  const watched = watch();
  const livePrefs = useMemo(
    () => ({
      start: watched.start,
      end: watched.end,
      selectedMode: watched.selectedMode,
      preferTime: watched.preferTime,
      preferCost: watched.preferCost,
      timeWeight: watched.timeWeight,
      costWeight: watched.costWeight,
    }),
    [watched],
  );

  const canPreview = Boolean(livePrefs.start?.trim() && livePrefs.end?.trim());
  const { preview, setPreview, error: previewError, isUpdating, refresh } = useLiveRoutePreview(
    livePrefs,
    canPreview,
  );

  const modeUnavailable =
    preview &&
    !isSelectedModeAvailable(watched.selectedMode, preview);

  useEffect(() => {
    if (!preview || !modeUnavailable) {
      setAlternatives([]);
      return;
    }

    let cancelled = false;
    setAltLoading(true);
    fetchModeAlternatives(livePrefs, watched.selectedMode)
      .then((alts) => {
        if (!cancelled) setAlternatives(alts);
      })
      .finally(() => {
        if (!cancelled) setAltLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [preview?.total_time, modeUnavailable, watched.selectedMode, livePrefs.start, livePrefs.end]);

  useEffect(() => {
    if (!preview || !isLongRoute(preview.total_time)) {
      setFasterAlternatives([]);
      return;
    }
    let cancelled = false;
    setFasterLoading(true);
    fetchFasterAlternatives(livePrefs, preview.total_time)
      .then((alts) => {
        if (!cancelled) setFasterAlternatives(alts);
      })
      .finally(() => {
        if (!cancelled) setFasterLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [preview?.total_time, livePrefs.start, livePrefs.end]);

  useEffect(() => {
    if (!preview) {
      setGpsProgress(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setGpsProgress(simulateGpsProgress(preview.total_time, elapsed % (preview.total_time * 60 + 1)));
    }, 800);
    return () => clearInterval(id);
  }, [preview?.total_time, preview?.total_cost]);

  const applyToggleWeights = (preferTime: boolean, preferCost: boolean) => {
    const w = computeToggleWeights(preferTime, preferCost);
    setValue('timeWeight', w.timeWeight);
    setValue('costWeight', w.costWeight);
    setPreferences({ preferTime, preferCost, timeWeight: w.timeWeight, costWeight: w.costWeight });
  };

  const handlePreferTime = (checked: boolean) => {
    setValue('preferTime', checked);
    applyToggleWeights(checked, watched.preferCost);
  };

  const handlePreferCost = (checked: boolean) => {
    setValue('preferCost', checked);
    applyToggleWeights(watched.preferTime, checked);
  };

  const handleModeSelect = (mode: string) => {
    setValue('selectedMode', mode);
    setPreferences({ selectedMode: mode });
  };

  const handleApplyAlternative = (alt: ModeAlternative) => {
    setValue('selectedMode', alt.mode);
    setPreview(alt.route);
    setPreferences({ selectedMode: alt.mode });
    setAlternatives([]);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    setPreferences({
      start: values.start,
      end: values.end,
      selectedMode: values.selectedMode,
      preferTime: values.preferTime,
      preferCost: values.preferCost,
      timeWeight: values.timeWeight,
      costWeight: values.costWeight,
    });

    try {
      const result = preview ?? (await refresh());
      if (result) {
        setRouteResult(result);
        navigate('/route');
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <ChennaiHeroBanner />
      <LiveTransportStats />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-6 w-6 text-primary" aria-hidden />
                Plan your journey
              </CardTitle>
              <CardDescription>
                Save Time & Save Money recalculate routes live — no extra API changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6" noValidate aria-label="Journey planner form">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start">Starting point</Label>
                    <Input
                      id="start"
                      list="landmarks-start"
                      placeholder="e.g., Avadi"
                      aria-invalid={!!errors.start}
                      {...register('start')}
                    />
                    <datalist id="landmarks-start">
                      {CHENNAI_LANDMARKS.map((l) => (
                        <option key={l} value={l} />
                      ))}
                    </datalist>
                    {errors.start && (
                      <p className="text-sm text-destructive">{errors.start.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">Destination</Label>
                    <Input
                      id="end"
                      list="landmarks-end"
                      placeholder="e.g., Porur"
                      aria-invalid={!!errors.end}
                      {...register('end')}
                    />
                    <datalist id="landmarks-end">
                      {CHENNAI_LANDMARKS.map((l) => (
                        <option key={l} value={l} />
                      ))}
                    </datalist>
                    {errors.end && (
                      <p className="text-sm text-destructive">{errors.end.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Transport mode</Label>
                  <TransportModeCards
                    selected={watched.selectedMode}
                    onSelect={handleModeSelect}
                  />
                </div>

                <GlassCard hover={false} className="p-4">
                  <p className="mb-3 text-sm font-medium">Travel priorities</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" aria-hidden />
                        <Label htmlFor="preferTime" className="font-semibold">
                          Save Time
                        </Label>
                      </div>
                      <Switch
                        id="preferTime"
                        checked={watched.preferTime}
                        onCheckedChange={handlePreferTime}
                        aria-label="Save time preference"
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-emerald-500" aria-hidden />
                        <Label htmlFor="preferCost" className="font-semibold">
                          Save Money
                        </Label>
                      </div>
                      <Switch
                        id="preferCost"
                        checked={watched.preferCost}
                        onCheckedChange={handlePreferCost}
                        aria-label="Save money preference"
                      />
                    </div>
                  </div>
                  {(watched.preferTime || watched.preferCost) && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="timeWeight" className="text-xs">
                          Time weight (live)
                        </Label>
                        <Input
                          id="timeWeight"
                          type="number"
                          step="0.05"
                          min={0}
                          max={1}
                          {...register('timeWeight', { valueAsNumber: true })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="costWeight" className="text-xs">
                          Cost weight (live)
                        </Label>
                        <Input
                          id="costWeight"
                          type="number"
                          step="0.05"
                          min={0}
                          max={1}
                          {...register('costWeight', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  )}
                </GlassCard>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting || isUpdating || !canPreview}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Confirming route…
                    </>
                  ) : (
                    'Confirm & view full route'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {modeUnavailable && preview && (
            <>
              <ModeUnavailableBanner mode={watched.selectedMode} />
              <ModeRecommendationCards
                message={getUnavailableMessage(watched.selectedMode)}
                alternatives={alternatives}
                onApply={handleApplyAlternative}
                loading={altLoading}
              />
            </>
          )}

          {preview && isLongRoute(preview.total_time) && (
            <>
              <RouteDurationWarning
                totalMinutes={preview.total_time}
                message={getLongRouteWarning(preview.total_time) ?? ''}
              />
              {(fasterAlternatives.length > 0 || fasterLoading) && (
                <ModeRecommendationCards
                  message="Faster alternatives for this corridor"
                  alternatives={fasterAlternatives}
                  onApply={handleApplyAlternative}
                  loading={fasterLoading}
                />
              )}
            </>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <LiveRoutePreview
            route={preview}
            isUpdating={isUpdating}
            error={previewError}
            preferTime={watched.preferTime}
            preferCost={watched.preferCost}
            etaProgress={gpsProgress}
          />
          <TransportInsights />
        </div>
      </div>
    </div>
  );
}
