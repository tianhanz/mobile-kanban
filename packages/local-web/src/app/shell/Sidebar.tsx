import { Link, useRouterState } from '@tanstack/react-router';
import { LOOM_TABS, type LoomTab } from './tabs';

function isTabActive(tab: LoomTab, pathname: string): boolean {
  return pathname === tab.to || pathname.startsWith(tab.to + '/');
}

export function Sidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <nav
      className="fixed left-0 top-0 bottom-0 z-40 hidden w-[200px] flex-col border-r border-border bg-primary md:flex"
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-2 px-5 py-5">
        <svg
          viewBox="0 0 120 120"
          width="24"
          height="24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line
            x1="32"
            y1="20"
            x2="32"
            y2="90"
            stroke="hsl(var(--brand))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="38"
            y1="20"
            x2="38"
            y2="90"
            stroke="hsl(var(--brand))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="44"
            y1="20"
            x2="44"
            y2="90"
            stroke="hsl(var(--brand))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="26"
            y1="90"
            x2="98"
            y2="90"
            stroke="hsl(var(--text-high))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <line
            x1="26"
            y1="78"
            x2="98"
            y2="78"
            stroke="hsl(var(--text-high))"
            strokeWidth="8"
            strokeLinecap="round"
            opacity=".5"
          />
        </svg>
        <span className="font-ibm-plex-sans text-lg font-semibold tracking-tight text-high">
          Loom
        </span>
      </div>

      <div className="flex flex-col gap-1 px-3 pt-2">
        {LOOM_TABS.map((tab) => {
          const active = isTabActive(tab, pathname);
          const { Icon } = tab;
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-ibm-plex-sans text-sm transition-colors ${
                active
                  ? 'bg-secondary text-high font-semibold'
                  : 'text-low font-medium hover:bg-secondary/60 hover:text-normal'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`grid h-[22px] w-[22px] place-items-center ${
                  active ? 'text-brand' : ''
                }`}
              >
                <Icon />
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
