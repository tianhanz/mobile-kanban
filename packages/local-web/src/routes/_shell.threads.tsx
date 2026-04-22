import { createFileRoute } from '@tanstack/react-router';

function ThreadsRoute() {
  return (
    <div className="px-5 py-8">
      <h1 className="font-ibm-plex-sans text-xl font-semibold text-high">
        Threads
      </h1>
      <p className="mt-2 text-sm text-low">
        Placeholder — implementation arrives in commit 3.
      </p>
    </div>
  );
}

export const Route = createFileRoute('/_shell/threads')({
  component: ThreadsRoute,
});
