import { createFileRoute, Outlet } from '@tanstack/react-router';
import { TabShell } from '@web/app/shell/TabShell';

function ShellRouteComponent() {
  return (
    <TabShell>
      <Outlet />
    </TabShell>
  );
}

export const Route = createFileRoute('/_shell')({
  component: ShellRouteComponent,
});
