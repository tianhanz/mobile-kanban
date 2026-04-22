import { createFileRoute } from '@tanstack/react-router';
import { InboxBanner } from '@web/app/threads/InboxBanner';
import { ThreadsFallback } from '@web/app/threads/ThreadsFallback';

const MOCK_INBOX = [{ kind: 'needs-you' as const, count: 2 }];

function ThreadsRoute() {
  return (
    <div className="mx-auto w-full max-w-[720px]">
      <header className="px-5 pb-3 pt-6">
        <div className="mb-2 flex items-center gap-1.5 font-ibm-plex-mono text-[10.5px] tracking-[.06em] text-low">
          <span
            className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(201,111,77,0.45)]"
            aria-hidden="true"
          />
          3 agents running
        </div>
        <h1 className="font-ibm-plex-sans text-[22px] font-semibold leading-tight tracking-[-.01em] text-high">
          Agents in motion. <span className="text-low">Tap to watch.</span>
        </h1>
      </header>

      <div className="pb-10 pt-2">
        <InboxBanner items={MOCK_INBOX} />
        <ThreadsFallback />
      </div>
    </div>
  );
}

export const Route = createFileRoute('/_shell/threads')({
  component: ThreadsRoute,
});
