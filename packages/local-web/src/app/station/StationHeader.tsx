import { STATION_HEADER } from './mocks';

export function StationHeader() {
  return (
    <header className="px-5 pb-3 pt-6">
      <div className="mb-3.5 flex items-center gap-2">
        <svg
          viewBox="0 0 120 120"
          width="28"
          height="28"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <line
            x1="32"
            y1="20"
            x2="32"
            y2="90"
            stroke="hsl(var(--brand))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="38"
            y1="20"
            x2="38"
            y2="90"
            stroke="hsl(var(--brand))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="44"
            y1="20"
            x2="44"
            y2="90"
            stroke="hsl(var(--brand))"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="26"
            y1="90"
            x2="98"
            y2="90"
            stroke="hsl(var(--text-high))"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <line
            x1="26"
            y1="78"
            x2="98"
            y2="78"
            stroke="hsl(var(--text-high))"
            strokeWidth="8"
            strokeLinecap="round"
            opacity=".5"
          />
        </svg>
        <span className="font-ibm-plex-sans text-[22px] font-bold tracking-tight text-high">
          Loom
        </span>
        <button
          type="button"
          className="ml-auto grid h-9 w-9 place-items-center rounded-full bg-secondary font-ibm-plex-mono text-xs font-bold text-high"
          aria-label="Account"
        >
          {STATION_HEADER.avatar}
        </button>
      </div>
      <div className="mb-2 flex items-center gap-1.5 font-ibm-plex-mono text-[10.5px] tracking-[.06em] text-low">
        <span
          className="h-1.5 w-1.5 rounded-full bg-leaf shadow-[0_0_6px_rgba(107,142,78,0.45)]"
          aria-hidden="true"
        />
        {STATION_HEADER.uptime}
      </div>
      <h1 className="font-ibm-plex-sans text-[22px] font-semibold leading-tight tracking-[-.01em] text-high">
        {STATION_HEADER.titleLead}{' '}
        <span className="text-low">{STATION_HEADER.titleTail}</span>
      </h1>
    </header>
  );
}
