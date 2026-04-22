import { createFileRoute } from '@tanstack/react-router';

function DispatchRoute() {
  return (
    <div className="px-5 py-8">
      <h1 className="font-ibm-plex-sans text-xl font-semibold text-high">
        Dispatch
      </h1>
      <p className="mt-2 text-sm text-low">
        Placeholder — implementation arrives in commit 4.
      </p>
    </div>
  );
}

export const Route = createFileRoute('/_shell/dispatch')({
  component: DispatchRoute,
});
