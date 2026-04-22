import { createFileRoute, Outlet, useParams } from '@tanstack/react-router';
import { TabShell } from '@web/app/shell/TabShell';
import { LoomRouteProviders } from '@web/app/providers/LoomRouteProviders';

function ShellRouteComponent() {
  const { hostId } = useParams({ strict: false });

  return (
    <LoomRouteProviders hostId={hostId}>
      <TabShell>
        <Outlet />
      </TabShell>
    </LoomRouteProviders>
  );
}

export const Route = createFileRoute('/_shell')({
  component: ShellRouteComponent,
});
