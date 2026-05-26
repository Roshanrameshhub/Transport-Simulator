import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground bg-[radial-gradient(ellipse_at_top,hsl(199_89%_42%/0.08),transparent_50%)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <AppHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <main
          id="main-content"
          className="flex-1 overflow-auto p-4 md:p-6 lg:p-8"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
