import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useLookupBooking } from '@/hooks/useLookupBooking';
import { useBookingFlowStore } from '@/store/bookingFlowStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { formatCurrency } from '@/lib/utils';

export default function LookupPage() {
  const [query, setQuery] = useState('');
  const { result, search, reset, isLoading } = useLookupBooking();
  const localBookings = useBookingFlowStore((s) => s.localBookings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void search(query);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <GlassCard>
        <CardHeader className="p-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-5 w-5 text-primary" aria-hidden />
            Lookup booking
          </CardTitle>
          <CardDescription>
            Search by API booking ID, client reference (SCB-…), or journey code (CHN-…)
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Label htmlFor="lookupQuery">Booking ID / reference</Label>
            <Input
              id="lookupQuery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="UUID, SCB-…, or CHN-…"
              aria-describedby="lookup-hint"
              disabled={isLoading}
            />
            <p id="lookup-hint" className="text-xs text-muted-foreground">
              Local index: {localBookings.length} recent booking(s) on this device
            </p>
          </div>
          <div className="flex gap-2 sm:flex-col sm:justify-end">
            <Button type="submit" disabled={!query.trim() || isLoading} className="sm:min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Searching…
                </>
              ) : (
                'Search'
              )}
            </Button>
            {result.status !== 'idle' && (
              <Button type="button" variant="outline" onClick={reset}>
                Clear
              </Button>
            )}
          </div>
        </form>
      </GlassCard>

      {isLoading && (
        <Card aria-busy="true" aria-label="Loading booking">
          <CardContent className="pt-6 space-y-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {!isLoading && result.status === 'idle' && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
            <Inbox className="h-10 w-10 opacity-40" aria-hidden />
            <p>Enter a booking ID or reference to retrieve your ticket details.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && result.status === 'empty' && (
        <Card role="alert">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircle className="h-10 w-10 text-amber-500" aria-hidden />
            <p className="font-medium">No booking found</p>
            <p className="text-sm text-muted-foreground">{result.error}</p>
            <Button variant="outline" onClick={() => search(query)}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden />
              Retry search
            </Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && result.status === 'error' && (
        <Card className="border-destructive/40" role="alert">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" aria-hidden />
            <p className="font-medium text-destructive">Lookup failed</p>
            <p className="text-sm text-muted-foreground">{result.error}</p>
            <Button onClick={() => search(query)}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && result.status === 'success' && result.data && (
        <BookingSuccessCard data={result.data} />
      )}
    </div>
  );
}

function BookingSuccessCard({ data }: { data: import('@/types/api').BookingResponse }) {
  return (
    <Card className="border-emerald-500/30">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
            Booking found
          </CardTitle>
          <Badge variant="success">{data.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          <span className="text-muted-foreground">Booking ID: </span>
          <span className="font-mono font-semibold break-all">{data.booking_id}</span>
        </p>
        <p>{data.path.join(' → ')}</p>
        <p>
          {formatCurrency(data.total_cost)} · {data.total_time.toFixed(1)} min
        </p>
        <div className="flex flex-wrap gap-1">
          {data.transport_modes_used.map((m) => (
            <Badge key={m} variant="outline" className="capitalize">
              {m}
            </Badge>
          ))}
        </div>
        <Button variant="outline" asChild className="w-full mt-2">
          <Link to="/booking">Book another journey</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
