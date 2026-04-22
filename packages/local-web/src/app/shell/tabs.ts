import type { ComponentType, SVGProps } from 'react';
import { StationIcon } from './icons/StationIcon';
import { ThreadsIcon } from './icons/ThreadsIcon';
import { DispatchIcon } from './icons/DispatchIcon';
import { MissionsIcon } from './icons/MissionsIcon';
import { MindIcon } from './icons/MindIcon';

export type LoomTabId =
  | 'station'
  | 'threads'
  | 'dispatch'
  | 'missions'
  | 'mind';

export interface LoomTab {
  id: LoomTabId;
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const LOOM_TABS: readonly LoomTab[] = [
  { id: 'station', to: '/station', label: 'Station', Icon: StationIcon },
  { id: 'threads', to: '/threads', label: 'Threads', Icon: ThreadsIcon },
  { id: 'dispatch', to: '/dispatch', label: 'Dispatch', Icon: DispatchIcon },
  { id: 'missions', to: '/missions', label: 'Missions', Icon: MissionsIcon },
  { id: 'mind', to: '/mind', label: 'Mind', Icon: MindIcon },
] as const;
