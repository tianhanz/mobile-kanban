import { type ReactNode } from 'react';
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react';
import { TerminalProvider } from '@/shared/providers/TerminalProvider';
import { HostIdProvider } from '@/shared/providers/HostIdProvider';
import { WorkspaceProvider } from '@/shared/providers/WorkspaceProvider';
import { ExecutionProcessesProvider } from '@/shared/providers/ExecutionProcessesProvider';
import { LogsPanelProvider } from '@/shared/providers/LogsPanelProvider';
import { ActionsProvider } from '@/shared/providers/ActionsProvider';
import { useWorkspaceContext } from '@/shared/hooks/useWorkspaceContext';

/**
 * Bridges the selectedSessionId coming out of WorkspaceProvider into
 * ExecutionProcessesProvider. Lives inside WorkspaceProvider in the tree
 * below.
 */
function ExecutionProcessesProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { selectedSessionId } = useWorkspaceContext();

  return (
    <ExecutionProcessesProvider sessionId={selectedSessionId}>
      {children}
    </ExecutionProcessesProvider>
  );
}

/**
 * The shared provider stack that both the legacy Vibe Kanban shell
 * (`_app.*` routes + SharedAppLayout) and the Loom 5-tab shell
 * (`_shell.*` routes + TabShell) depend on.
 *
 * Provider order matters — ExecutionProcessesProviderWrapper reads from
 * WorkspaceProvider, NiceModal dialogs (CommandBar / Settings) depend on
 * ActionsProvider, and TerminalProvider is folded into the stack so
 * consumers don't have to re-mount it separately.
 *
 * `hostId` is applied as `key` on the outermost provider so that
 * switching hosts (e.g. local → remote cloud) atomically remounts the
 * whole stack, matching the behaviour of the pre-extraction code.
 */
export function LoomRouteProviders({
  children,
  hostId,
}: {
  children: ReactNode;
  hostId: string | undefined;
}) {
  return (
    <HostIdProvider key={hostId ?? 'local'}>
      <WorkspaceProvider>
        <ExecutionProcessesProviderWrapper>
          <LogsPanelProvider>
            <ActionsProvider>
              <NiceModalProvider>
                <TerminalProvider>{children}</TerminalProvider>
              </NiceModalProvider>
            </ActionsProvider>
          </LogsPanelProvider>
        </ExecutionProcessesProviderWrapper>
      </WorkspaceProvider>
    </HostIdProvider>
  );
}
