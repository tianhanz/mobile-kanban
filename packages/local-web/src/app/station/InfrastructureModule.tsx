import { INFRASTRUCTURE } from './mocks';
import { StModule } from './StationModule';

export function InfrastructureModule() {
  return (
    <StModule label="Infrastructure">
      <div className="flex flex-col gap-1.5">
        {INFRASTRUCTURE.map((row) => (
          <div
            key={row.label}
            className="flex items-center gap-2.5 text-[13px]"
          >
            <span className="min-w-[120px] text-normal tracking-tight">
              {row.label}
            </span>
            <span
              className={`ml-auto font-ibm-plex-mono text-[11.5px] font-medium tracking-[.02em] ${
                row.tone === 'ok'
                  ? 'text-leaf'
                  : row.tone === 'warn'
                    ? 'text-amber'
                    : 'text-high'
              }`}
            >
              {row.tone === 'ok' ? '● ' : ''}
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </StModule>
  );
}
