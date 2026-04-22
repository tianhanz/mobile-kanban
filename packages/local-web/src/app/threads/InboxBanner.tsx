import { useState } from 'react';

interface InboxItem {
  kind: 'needs-you';
  count: number;
  href?: string;
  onView?: () => void;
}

interface InboxBannerProps {
  items: InboxItem[];
}

export function InboxBanner({ items }: InboxBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || items.length === 0) return null;

  // PR3 only ever shows a single needs-you item; the array is the forward-
  // compatible shape PR4 will expand into a list of inbox types.
  const [first] = items;
  const countText = `${first.count} item${first.count === 1 ? '' : 's'}`;

  return (
    <div
      className="mx-5 mb-2.5 flex items-center gap-2.5 rounded-xl border border-brand-soft-2 bg-gradient-to-r from-brand-soft to-primary px-3.5 py-2.5 transition-transform active:scale-[.99]"
      role="status"
    >
      <button
        type="button"
        onClick={first.onView}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
      >
        <span className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-[7px] bg-brand text-sm font-bold text-on-brand">
          !
        </span>
        <span className="flex-1 text-[13.5px] font-medium tracking-[-.005em] text-high">
          <span className="font-bold text-brand">{countText}</span> need you
        </span>
        <span className="font-ibm-plex-mono text-[10px] font-semibold uppercase tracking-[.1em] text-brand-hover">
          View →
        </span>
      </button>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss inbox banner"
        className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-low hover:bg-brand-soft-2 hover:text-high"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M2 2l8 8M10 2l-8 8" />
        </svg>
      </button>
    </div>
  );
}
