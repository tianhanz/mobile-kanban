import { Link, useRouterState } from '@tanstack/react-router';
import { LOOM_TABS, type LoomTab } from './tabs';

function isTabActive(tab: LoomTab, pathname: string): boolean {
  return pathname === tab.to || pathname.startsWith(tab.to + '/');
}

export function BottomNav() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-primary/95 backdrop-blur-md md:hidden"
      style={{
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        paddingTop: '8px',
        paddingLeft: '8px',
        paddingRight: '8px',
      }}
      aria-label="Primary navigation"
    >
      <div className="grid grid-cols-5 gap-0 mx-auto w-full max-w-[400px]">
        {LOOM_TABS.map((tab) => {
          const active = isTabActive(tab, pathname);
          const { Icon } = tab;
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`relative flex h-[52px] flex-col items-center justify-center gap-[3px] rounded-[10px] font-ibm-plex-sans text-[10px] tracking-[.02em] transition-colors ${
                active
                  ? 'text-high font-semibold'
                  : 'text-low font-medium hover:text-normal'
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
