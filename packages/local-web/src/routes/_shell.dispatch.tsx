import { createFileRoute } from '@tanstack/react-router';
import { DispatchIcon } from '@web/app/shell/icons/DispatchIcon';
import { PlaceholderScreen } from '@web/app/shell/PlaceholderScreen';

function DispatchRoute() {
  return (
    <PlaceholderScreen
      title="Dispatch"
      subtitle="Kick off a new thread. Coming in PR 4."
      Icon={DispatchIcon}
    />
  );
}

export const Route = createFileRoute('/_shell/dispatch')({
  component: DispatchRoute,
});
