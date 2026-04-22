import { useEffect } from 'react';
import {
  createFileRoute,
  useParams,
  useLocation,
} from '@tanstack/react-router';
import { SequenceTrackerProvider } from '@/shared/keyboard/SequenceTracker';
import { SequenceIndicator } from '@/shared/keyboard/SequenceIndicator';
import { useWorkspaceShortcuts } from '@/shared/keyboard/useWorkspaceShortcuts';
import { useIssueShortcuts } from '@/shared/keyboard/useIssueShortcuts';
import { useKeyShowHelp, Scope } from '@/shared/keyboard';
import { KeyboardShortcutsDialog } from '@/shared/dialogs/shared/KeyboardShortcutsDialog';
import { ReleaseNotesDialog } from '@/shared/dialogs/global/ReleaseNotesDialog';
import { useUserSystem } from '@/shared/hooks/useUserSystem';
import { SharedAppLayout } from '@/shared/components/ui-new/containers/SharedAppLayout';
import { LoomRouteProviders } from '@web/app/providers/LoomRouteProviders';

function KeyboardShortcutsHandler() {
  useKeyShowHelp(
    () => {
      KeyboardShortcutsDialog.show();
    },
    { scope: Scope.GLOBAL }
  );
  useWorkspaceShortcuts();
  useIssueShortcuts();
  return null;
}

function ReleaseNotesHandler() {
  const { config, updateAndSaveConfig } = useUserSystem();
  const location = useLocation();

  useEffect(() => {
    if (!config || !config.remote_onboarding_acknowledged) return;

    const pathname = location.pathname;
    if (pathname.startsWith('/onboarding')) {
      return;
    }

    let cancelled = false;

    const showReleaseNotes = async () => {
      if (config.show_release_notes) {
        await ReleaseNotesDialog.show();
        if (!cancelled) {
          await updateAndSaveConfig({ show_release_notes: false });
        }
        ReleaseNotesDialog.hide();
      }
    };

    void showReleaseNotes();

    return () => {
      cancelled = true;
    };
  }, [config, updateAndSaveConfig, location.pathname]);

  return null;
}

function AppLayoutRouteComponent() {
  const { hostId } = useParams({ strict: false });

  return (
    <LoomRouteProviders hostId={hostId}>
      <ReleaseNotesHandler />
      <SequenceTrackerProvider>
        <SequenceIndicator />
        <KeyboardShortcutsHandler />
        <SharedAppLayout />
      </SequenceTrackerProvider>
    </LoomRouteProviders>
  );
}

export const Route = createFileRoute('/_app')({
  component: AppLayoutRouteComponent,
});
