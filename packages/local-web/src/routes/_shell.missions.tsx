import { createFileRoute } from '@tanstack/react-router';
import { MissionsIcon } from '@web/app/shell/icons/MissionsIcon';
import { PlaceholderScreen } from '@web/app/shell/PlaceholderScreen';

function MissionsRoute() {
  return (
    <PlaceholderScreen
      title="Missions"
      subtitle="Your long-lived projects. Coming in PR 4."
      Icon={MissionsIcon}
    />
  );
}

export const Route = createFileRoute('/_shell/missions')({
  component: MissionsRoute,
});
