import type { ComponentType, SVGProps } from 'react';

interface PlaceholderScreenProps {
  title: string;
  subtitle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export function PlaceholderScreen({
  title,
  subtitle,
  Icon,
}: PlaceholderScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col items-center justify-center px-6 py-16 text-center">
      <span
        className="grid h-12 w-12 place-items-center text-low"
        aria-hidden="true"
      >
        <Icon width={48} height={48} />
      </span>
      <h2 className="mt-4 font-ibm-plex-sans text-xl font-semibold tracking-[-.01em] text-high">
        {title}
      </h2>
      <p className="mt-2 max-w-[320px] text-sm leading-[1.5] text-low">
        {subtitle}
      </p>
    </div>
  );
}
