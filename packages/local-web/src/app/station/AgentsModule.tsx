import { AGENTS_SUMMARY, AGENTS_TODAY, type AgentStatus } from './mocks';
import { StModule } from './StationModule';

function StatusDot({ status }: { status: AgentStatus }) {
  const color =
    status === 'ok'
      ? 'bg-leaf shadow-[0_0_6px_rgba(107,142,78,0.45)]'
      : status === 'amber'
        ? 'bg-amber shadow-[0_0_6px_rgba(200,144,64,0.45)]'
        : 'bg-low';
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${color}`}
      aria-hidden="true"
    />
  );
}

export function AgentsModule() {
  return (
    <StModule label="Agents" sub="· today">
      <div className="mb-2.5 flex flex-col gap-1.5">
        {AGENTS_TODAY.map((agent) => (
          <div
            key={agent.name}
            className="flex items-center gap-2.5 py-1 text-[13px] text-normal"
          >
            <StatusDot status={agent.status} />
            <span className="min-w-[92px] font-ibm-plex-mono text-[11.5px] font-semibold tracking-[.02em] text-high">
              {agent.name}
            </span>
            <span className="flex-1 font-ibm-plex-mono text-[11.5px] tracking-[.02em] text-low">
              {agent.meta}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-dashed border-border pt-2 font-ibm-plex-mono text-[11px] tracking-[.02em] text-normal">
        <span className="font-bold text-high">{AGENTS_SUMMARY.dispatched}</span>{' '}
        dispatched ·{' '}
        <span className="font-bold text-high">{AGENTS_SUMMARY.done}</span> done
        · <span className="text-amber">{AGENTS_SUMMARY.anomalies} ⚠</span>
      </div>
    </StModule>
  );
}
