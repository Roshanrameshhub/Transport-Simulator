import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  CalendarCheck,
  MapPinned,
  Search,
  TrainFront,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Plan journey', icon: MapPinned, end: true },
  { to: '/route', label: 'Route plan', icon: TrainFront },
  { to: '/booking', label: 'Booking', icon: CalendarCheck },
  { to: '/lookup', label: 'Lookup booking', icon: Search },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AppSidebar() {
  return (
    <aside
      className="hidden md:flex w-56 shrink-0 flex-col border-r border-border/60 bg-card/40 p-4"
      aria-label="Main navigation"
    >
      <div className="mb-8 px-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Smart Chennai
        </p>
        <h1 className="text-lg font-bold text-foreground">Transport</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
