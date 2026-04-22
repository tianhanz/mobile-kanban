import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

interface TabShellProps {
  children: ReactNode;
}

/**
 * Responsive shell for the 5 Loom tabs.
 *
 * Mobile (< md): <BottomNav> fixed to the bottom, content scrolls above it.
 * Desktop (>= md): <Sidebar> fixed to the left (200px), content fills the rest.
 *
 * The same React tree is rendered at both breakpoints — Tailwind's `md:`
 * responsive utilities toggle which nav is visible.
 */
export function TabShell({ children }: TabShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-primary text-normal md:flex-row">
      <Sidebar />
      <main
        className="flex min-h-screen flex-1 flex-col md:ml-[200px]"
        style={{
          // On mobile, reserve room for the fixed BottomNav (52px + padding +
          // iOS home indicator). The desktop sidebar doesn't need this.
          paddingBottom: 'calc(72px + env(safe-area-inset-bottom))',
        }}
      >
        {/* On desktop the padding-bottom above is unnecessary; clear it. */}
        <div className="flex-1 md:pb-0">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
