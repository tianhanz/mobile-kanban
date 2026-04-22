import { createFileRoute } from '@tanstack/react-router';
import { MindIcon } from '@web/app/shell/icons/MindIcon';
import { PlaceholderScreen } from '@web/app/shell/PlaceholderScreen';

function MindRoute() {
  return (
    <PlaceholderScreen
      title="Mind"
      subtitle="Profile · Knowledge · Memory. Coming in PR 4."
      Icon={MindIcon}
    />
  );
}

export const Route = createFileRoute('/_shell/mind')({
  component: MindRoute,
});
