import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PlanPage from '@/pages/PlanPage';
import { ThemeProvider } from '@/components/ThemeProvider';

vi.mock('@/hooks/useTransportApi', () => ({
  usePlanRoute: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

function renderPlanPage() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter>
          <PlanPage />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

describe('PlanPage accessibility', () => {
  it('has accessible form labels and submit button', () => {
    renderPlanPage();

    expect(screen.getByLabelText(/starting point/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm.*route/i })).toBeInTheDocument();
    expect(screen.getByRole('form', { name: /journey planner/i })).toBeInTheDocument();
  });

  it('renders transport mode select with aria label', () => {
    renderPlanPage();
    expect(screen.getByLabelText(/transport mode/i)).toBeInTheDocument();
  });
});
