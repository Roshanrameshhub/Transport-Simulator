import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, IndianRupee, MapPin, Ticket } from 'lucide-react';
import { useJourneyStore } from '@/store/journeyStore';
import { deriveAiSuggestion } from '@/lib/simulation';
import { EnhancedJourneyTimeline } from '@/components/journey/EnhancedJourneyTimeline';
import { RouteAnalyticsChart } from '@/components/charts/RouteAnalyticsChart';
import { RouteStatusPanel } from '@/components/route/RouteStatusPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { formatCurrency } from '@/lib/utils';

export default function RoutePage() {
  const navigate = useNavigate();
  const route = useJourneyStore((s) => s.routeResult);
  const preferences = useJourneyStore((s) => s.preferences);
  const [gpsProgress, setGpsProgress] = useState(12);

  useEffect(() => {
    if (!route) return;
    const id = setInterval(() => {
      setGpsProgress((p) => {
        const next = p + 2.5;
        return next >= 100 ? 12 : next;
      });
    }, 1200);
    return () => clearInterval(id);
  }, [route?.total_time]);

  if (!route) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <CardHeader>
          <CardTitle>No route found</CardTitle>
          <CardDescription>Plan a journey first to see your optimized route.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">Plan journey</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const arrival = route.arrival_time
    ? new Date(route.arrival_time).toLocaleString()
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-5xl space-y-6"
    >
      <GlassCard className="border-primary/25">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mobility command — active route</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {deriveAiSuggestion(route, preferences.preferTime, preferences.preferCost)}
            </p>
          </div>
          <Button size="lg" onClick={() => navigate('/booking')} className="shrink-0">
            <Ticket className="h-4 w-4" aria-hidden />
            Book ({formatCurrency(route.total_cost)})
          </Button>
        </div>
      </GlassCard>

      <RouteStatusPanel route={route} gpsProgress={gpsProgress} />

      <Card>
        <CardHeader>
          <CardTitle>Route summary</CardTitle>
          <CardDescription>Multi-modal journey across Chennai</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            <span className="font-medium text-muted-foreground">Path: </span>
            {route.path.join(' → ')}
          </p>
          <div className="flex flex-wrap gap-2">
            {route.transport_modes_used.map((mode) => (
              <Badge key={mode} variant="secondary" className="capitalize">
                {mode}
              </Badge>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <Clock className="h-4 w-4 text-primary" aria-hidden />
              <div>
                <p className="text-xs text-muted-foreground">Est. time</p>
                <p className="font-semibold">{route.total_time.toFixed(1)} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <IndianRupee className="h-4 w-4 text-primary" aria-hidden />
              <div>
                <p className="text-xs text-muted-foreground">Total cost</p>
                <p className="font-semibold">{formatCurrency(route.total_cost)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <MapPin className="h-4 w-4 text-primary" aria-hidden />
              <div>
                <p className="text-xs text-muted-foreground">Arrival</p>
                <p className="font-semibold text-sm">{arrival}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Animated journey timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedJourneyTimeline route={route} />
        </CardContent>
      </Card>

      <RouteAnalyticsChart segments={route.detailed_segments} />
    </motion.div>
  );
}
