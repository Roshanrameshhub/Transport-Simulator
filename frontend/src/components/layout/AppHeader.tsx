import { NavLink } from 'react-router-dom';
import { Menu, Moon, Sun, TrainFront } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

const mobileNav = [
  { to: '/', label: 'Plan', end: true },
  { to: '/route', label: 'Route' },
  { to: '/booking', label: 'Book' },
  { to: '/lookup', label: 'Lookup' },
  { to: '/analytics', label: 'Stats' },
];

export function AppHeader() {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <TrainFront className="h-5 w-5 text-primary" aria-hidden />
          <span className="font-semibold">Chennai Transport</span>
        </div>

        <nav
          className="flex md:hidden flex-1 justify-center gap-1 overflow-x-auto"
          aria-label="Mobile navigation"
        >
          {mobileNav.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium',
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            type="button"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu" type="button">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
