import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUserSystem } from '@/shared/hooks/useUserSystem';
import { getFirstProjectDestination } from '@/shared/lib/firstProjectDestination';
import { useOrganizationStore } from '@/shared/stores/useOrganizationStore';
import { useUiPreferencesStore } from '@/shared/stores/useUiPreferencesStore';
import { useAppNavigation } from '@/shared/hooks/useAppNavigation';

export function RootRedirectPage() {
  const { config, loading, loginStatus } = useUserSystem();
  const setSelectedOrgId = useOrganizationStore((s) => s.setSelectedOrgId);
  const appNavigation = useAppNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !config) {
      return;
    }

    let isActive = true;
    void (async () => {
      if (!config.remote_onboarding_acknowledged) {
        appNavigation.goToOnboarding({ replace: true });
        return;
      }

      if (loginStatus?.status !== 'loggedin') {
        appNavigation.goToWorkspacesCreate({ replace: true });
        return;
      }

      // Prime selected org/project from persisted scratch store so deep
      // links inside the tab shell still know the user's last context.
      const { selectedOrgId, selectedProjectId } =
        useUiPreferencesStore.getState();

      await getFirstProjectDestination(
        setSelectedOrgId,
        selectedOrgId,
        selectedProjectId
      );
      if (!isActive) {
        return;
      }

      // Loom lands on Station regardless of project state — the tab shell
      // owns navigation from here. If the user has no project, Station's
      // empty states guide them; if they do, Threads lists their workspaces.
      void navigate({ to: '/station', replace: true });
    })();

    return () => {
      isActive = false;
    };
  }, [
    appNavigation,
    config,
    loading,
    loginStatus?.status,
    navigate,
    setSelectedOrgId,
  ]);

  return (
    <div className="h-screen bg-primary flex items-center justify-center">
      <p className="text-low">Loading...</p>
    </div>
  );
}
