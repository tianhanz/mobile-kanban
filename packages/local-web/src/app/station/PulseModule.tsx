import type { PulseModule as PulseModuleShape } from './mocks';
import { StModule } from './StationModule';

interface PulseModuleProps {
  label: string;
  data: PulseModuleShape;
}

export function PulseModule({ label, data }: PulseModuleProps) {
  return (
    <StModule label={label}>
      <div className="mb-2 flex items-center gap-4">
        {data.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <div
              className={`font-ibm-plex-sans text-[20px] font-bold leading-none tracking-[-.02em] ${
                stat.tone === 'warn' ? 'text-amber' : 'text-high'
              }`}
            >
              {stat.n}
            </div>
            <div className="font-ibm-plex-mono text-[9.5px] font-medium uppercase tracking-[.12em] text-low">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-dashed border-border pt-2 font-ibm-plex-mono text-[11px] tracking-[.02em] text-normal">
        {data.note}
      </div>
    </StModule>
  );
}
