import { Link } from '@tanstack/react-router';
import { ThreadsIcon } from '@web/app/shell/icons/ThreadsIcon';

/**
 * PR3 temporary fallback for the Threads list.
 *
 * Extracting the workspace list from SharedAppLayout requires untangling
 * HostIdProvider / WorkspaceProvider / ExecutionProcessesProvider /
 * LogsPanelProvider / ActionsProvider / TerminalProvider / NiceModal from
 * the Vibe Kanban chrome. That rewiring is deferred to a later PR — for
 * now Threads lights up the tab, shows the Inbox banner above, and deep-
 * links to the legacy /workspaces URL for the actual list.
 */
export function ThreadsFallback() {
  return (
    <div className="mx-5 rounded-[14px] border border-border bg-surface p-6">
      <ThreadsIcon className="h-8 w-8 text-low" />
      <h2 className="mt-3 font-ibm-plex-sans text-lg font-semibold text-high">
        Your threads list lives in the legacy shell — for now.
      </h2>
      <p className="mt-2 text-sm leading-[1.5] text-low">
        The workspace/thread list is being unbundled from the Vibe Kanban app
        chrome. Until that lands, use the legacy shell below — it still works
        exactly as before.
      </p>
      <Link
        to="/workspaces"
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand bg-brand px-3 py-1.5 font-ibm-plex-mono text-[10px] font-semibold uppercase tracking-[.1em] text-on-brand transition-colors hover:bg-brand-hover"
      >
        Open threads in legacy shell →
      </Link>
    </div>
  );
}
