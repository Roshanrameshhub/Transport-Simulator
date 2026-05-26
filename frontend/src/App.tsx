import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AppProviders } from '@/providers/AppProviders';
import { Skeleton } from '@/components/ui/skeleton';

const PlanPage = lazy(() => import('@/pages/PlanPage'));
const RoutePage = lazy(() => import('@/pages/RoutePage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const LookupPage = lazy(() => import('@/pages/LookupPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));

function PageLoader() {
  return (
    <div className="space-y-4 p-4" role="status" aria-label="Loading page">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route
                index
                element={
                  <Suspense fallback={<PageLoader />}>
                    <PlanPage />
                  </Suspense>
                }
              />
              <Route
                path="route"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <RoutePage />
                  </Suspense>
                }
              />
              <Route
                path="booking"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <BookingPage />
                  </Suspense>
                }
              />
              <Route
                path="lookup"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <LookupPage />
                  </Suspense>
                }
              />
              <Route
                path="analytics"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <AnalyticsPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AppProviders>
  );
}
