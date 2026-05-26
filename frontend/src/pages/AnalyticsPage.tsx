import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useJourneyStore } from '@/store/journeyStore';
import {
  buildAnalyticsSnapshot,
  CHART_COLORS,
  CHART_PALETTE,
} from '@/features/analytics/analyticsAdapter';
import { LIVE_METRO_STATS } from '@/lib/simulation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

const CHART_MIN_HEIGHT = 280;

function ChartContainer({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      className="w-full"
      style={{ minHeight: CHART_MIN_HEIGHT, height: CHART_MIN_HEIGHT }}
      role="img"
      aria-label={label}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default function AnalyticsPage() {
  const route = useJourneyStore((s) => s.routeResult);
  const lastBooking = useJourneyStore((s) => s.lastBooking);
  const snapshot = buildAnalyticsSnapshot(route);

  if (!snapshot.hasData) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <GlassCard className="text-center py-10">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
          <h2 className="text-xl font-bold">Analytics dashboard</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Plan a route to unlock segment charts, occupancy simulation, and environmental metrics.
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Plan journey</Link>
          </Button>
        </GlassCard>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Preview data (demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer label="Demo mode distribution">
              <PieChart>
                <Pie
                  data={[
                    { name: 'metro', value: 2 },
                    { name: 'bus', value: 1 },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  <Cell fill={CHART_COLORS.primary} />
                  <Cell fill={CHART_COLORS.emerald} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <GlassCard className="border-primary/20">
        <h2 className="text-2xl font-bold tracking-tight">Futuristic mobility dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Chennai network · Green {LIVE_METRO_STATS.greenLine.occupancy}% · Blue{' '}
          {LIVE_METRO_STATS.blueLine.occupancy}%
          {lastBooking ? ` · Booking ${lastBooking.booking_id.slice(0, 8)}…` : ''}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge>Confidence {snapshot.kpis.confidence}%</Badge>
          <Badge variant="outline">{snapshot.kpis.segments} segments</Badge>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mode distribution</CardTitle>
            <CardDescription>Share of modes in planned journey</CardDescription>
          </CardHeader>
          <CardContent>
            {snapshot.modeDistribution.length > 0 ? (
              <ChartContainer label="Mode distribution pie chart">
                <PieChart>
                  <Pie
                    data={snapshot.modeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {snapshot.modeDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_PALETTE[i % CHART_PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-12 text-center">No mode data</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cost per segment</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer label="Segment cost bar chart">
              <BarChart data={snapshot.segmentCosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="segment" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit=" ₹" />
                <Tooltip />
                <Bar dataKey="cost" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Cost (₹)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Time per segment</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer label="Segment time line chart">
              <LineChart data={snapshot.segmentTimes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="segment" />
                <YAxis unit=" min" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke={CHART_COLORS.cyan}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.primary }}
                  name="Minutes"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Occupancy simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer label="Occupancy by mode">
              <BarChart data={snapshot.occupancyByMode} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis type="category" dataKey="mode" width={56} />
                <Tooltip />
                <Bar dataKey="occupancy" fill={CHART_COLORS.violet} radius={[0, 4, 4, 0]} name="Occupancy %" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {snapshot.eco && (
        <GlassCard>
          <h3 className="font-semibold mb-3">Environmental impact</h3>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{snapshot.eco.greenScore}</p>
              <p className="text-xs text-muted-foreground">Green score</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{snapshot.eco.co2SavedKg}</p>
              <p className="text-xs text-muted-foreground">kg CO₂ saved</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{snapshot.eco.co2EmittedKg}</p>
              <p className="text-xs text-muted-foreground">kg emitted</p>
            </div>
            <div className="rounded-lg border p-3 text-center">
              <p className="text-2xl font-bold">{snapshot.eco.treesEquivalent}</p>
              <p className="text-xs text-muted-foreground">tree-day offset</p>
            </div>
          </div>
        </GlassCard>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary KPIs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-4">
          <Kpi label="Stops" value={String(snapshot.kpis.stops)} />
          <Kpi label="Segments" value={String(snapshot.kpis.segments)} />
          <Kpi label="Total time" value={`${snapshot.kpis.totalTime.toFixed(0)}m`} />
          <Kpi label="Total cost" value={`₹${snapshot.kpis.totalCost.toFixed(0)}`} />
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
