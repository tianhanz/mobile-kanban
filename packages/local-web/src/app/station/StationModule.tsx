import type { ReactNode } from 'react';

interface SegDividerProps {
  label: string;
}

export function SegDivider({ label }: SegDividerProps) {
  return (
    <div className="my-1 flex items-center gap-3 px-6 py-2">
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
      <span className="font-ibm-plex-mono text-[10px] font-bold uppercase tracking-[.3em] text-normal">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" aria-hidden="true" />
    </div>
  );
}

interface StModuleProps {
  label: string;
  sub?: string;
  children: ReactNode;
}

export function StModule({ label, sub, children }: StModuleProps) {
  return (
    <section className="mx-4 mb-2.5 rounded-[14px] border border-border bg-surface p-3.5">
      <div className="mb-2.5 flex items-center gap-2 font-ibm-plex-mono text-[9.5px] font-semibold uppercase tracking-[.22em] text-low">
        <span>{label}</span>
        {sub ? (
          <span className="font-normal tracking-[.12em] text-ink-dim">
            {sub}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  );
}
