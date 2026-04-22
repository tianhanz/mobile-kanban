import { createFileRoute } from '@tanstack/react-router';
import { AgentsModule } from '@web/app/station/AgentsModule';
import { InfrastructureModule } from '@web/app/station/InfrastructureModule';
import { KNOWLEDGE_PULSE, MISSIONS_PULSE } from '@web/app/station/mocks';
import { MilestonesRail } from '@web/app/station/MilestonesRail';
import { PulseModule } from '@web/app/station/PulseModule';
import { RhythmModule } from '@web/app/station/RhythmModule';
import { SegDivider } from '@web/app/station/StationModule';
import { StationHeader } from '@web/app/station/StationHeader';
import { LocalToast } from '@web/app/shell/LocalToast';
import { useLocalToastState } from '@web/app/shell/useLocalToast';

function StationRoute() {
  const { toast, showToast } = useLocalToastState();

  return (
    <div className="mx-auto w-full max-w-[720px]">
      <StationHeader />

      <div className="flex flex-col pb-10">
        <SegDivider label="Now" />
        <AgentsModule />
        <InfrastructureModule />
        <PulseModule label="Missions pulse" data={MISSIONS_PULSE} />
        <PulseModule label="Knowledge pulse" data={KNOWLEDGE_PULSE} />
        <RhythmModule />

        <SegDivider label="Legacy" />
        <div className="flex items-baseline px-5 pb-2">
          <span className="font-ibm-plex-mono text-[10px] font-medium uppercase tracking-[.22em] text-low">
            Milestones
          </span>
          <button
            type="button"
            onClick={() =>
              showToast('View all milestones — coming in PR 4', 'default')
            }
            className="ml-auto font-ibm-plex-mono text-[10px] font-semibold uppercase tracking-[.1em] text-brand hover:text-brand-hover"
          >
            View all →
          </button>
        </div>

        <MilestonesRail />

        <div className="flex items-center px-5 pb-3.5 pt-1">
          <button
            type="button"
            onClick={() =>
              showToast('Mark milestone — coming in PR 4', 'brand')
            }
            className="rounded-full border border-brand bg-brand px-3 py-1.5 font-ibm-plex-mono text-[10px] font-semibold uppercase tracking-[.1em] text-on-brand transition-colors hover:bg-brand-hover"
          >
            + Mark milestone
          </button>
        </div>
      </div>

      {toast ? <LocalToast toast={toast} /> : null}
    </div>
  );
}

export const Route = createFileRoute('/_shell/station')({
  component: StationRoute,
});
