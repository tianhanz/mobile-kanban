import { MILESTONES, type Milestone, type MilestoneCategory } from './mocks';

const CATEGORY_LABEL: Record<MilestoneCategory, string> = {
  achievement: 'Achievement',
  decision: 'Decision',
  lesson: 'Lesson',
  pattern: 'Pattern',
};

const CATEGORY_ICON: Record<MilestoneCategory, string> = {
  achievement: '🏆',
  decision: '🎯',
  lesson: '⚠',
  pattern: '💡',
};

const CATEGORY_BAND: Record<MilestoneCategory, string> = {
  achievement: 'before:bg-leaf',
  decision: 'before:bg-brand',
  lesson: 'before:bg-amber',
  pattern: 'before:bg-indigo',
};

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  return (
    <button
      type="button"
      className={`relative flex min-h-[130px] w-[200px] shrink-0 snap-start cursor-pointer flex-col gap-1.5 overflow-hidden rounded-[14px] border border-border bg-surface p-3 text-left transition-transform active:scale-[.99] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:content-[''] ${CATEGORY_BAND[milestone.cat]}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-lg leading-none" aria-hidden="true">
          {CATEGORY_ICON[milestone.cat]}
        </span>
        <span className="font-ibm-plex-mono text-[9px] font-bold uppercase tracking-[.16em] text-low">
          {CATEGORY_LABEL[milestone.cat]}
        </span>
      </div>
      <div className="line-clamp-3 flex-1 text-[13px] font-medium leading-[1.4] tracking-[-.01em] text-high">
        {milestone.title}
      </div>
      <div className="mt-auto flex items-center justify-between font-ibm-plex-mono text-[10px] tracking-[.02em] text-ink-dim">
        <span className="rounded-sm border border-border bg-secondary px-1.5 py-0.5 font-medium text-normal">
          {milestone.mission}
        </span>
        <span className={milestone.when === 'yesterday' ? 'text-leaf' : ''}>
          {milestone.when}
        </span>
      </div>
    </button>
  );
}

export function MilestonesRail() {
  return (
    <div
      className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-2 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="list"
      aria-label="Milestones"
    >
      {MILESTONES.map((milestone) => (
        <MilestoneCard key={milestone.title} milestone={milestone} />
      ))}
    </div>
  );
}
