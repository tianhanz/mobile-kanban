import { TODAYS_RHYTHM, type RhythmTone } from './mocks';
import { StModule } from './StationModule';

function Dot({ tone }: { tone: RhythmTone }) {
  const cls =
    tone === 'urgent'
      ? 'bg-brand shadow-[0_0_6px_rgba(201,111,77,0.45)]'
      : tone === 'warn'
        ? 'bg-amber'
        : 'bg-indigo';
  return (
    <span
      className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${cls}`}
      aria-hidden="true"
    />
  );
}

export function RhythmModule() {
  return (
    <StModule label="Today's rhythm">
      <div className="flex flex-col gap-1.5">
        {TODAYS_RHYTHM.map((row) => (
          <div
            key={row.text}
            className="flex items-start gap-2.5 py-0.5 text-[13px] leading-[1.4] text-normal"
          >
            <Dot tone={row.tone} />
            <div className="min-w-0 flex-1">{row.text}</div>
          </div>
        ))}
      </div>
    </StModule>
  );
}
