import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SegmentDetail } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RouteAnalyticsChartProps {
  segments: SegmentDetail[];
}

export function RouteAnalyticsChart({ segments }: RouteAnalyticsChartProps) {
  const data = segments.map((s, i) => ({
    name: `${s.from.slice(0, 8)}…`,
    time: Number(s.time_mins.toFixed(1)),
    cost: Number(s.cost.toFixed(1)),
    index: i + 1,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Segment analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="h-64 w-full"
          role="img"
          aria-label="Bar chart comparing segment travel time in minutes"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit=" min" />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="time" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Time (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
