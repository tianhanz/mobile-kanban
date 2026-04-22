import type { SVGProps } from 'react';

export function MissionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M11 3l3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L2 10l6-1z" />
    </svg>
  );
}
