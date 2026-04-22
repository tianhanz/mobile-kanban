/**
 * Station mock data — PR3 renders these verbatim. PR5 will replace this
 * module with live data readers behind the same shape; keep the named
 * exports stable so consumers don't shift when that lands.
 */

export type AgentStatus = 'ok' | 'amber' | 'still';

export interface AgentRow {
  name: string;
  status: AgentStatus;
  meta: string;
}

export const AGENTS_TODAY: AgentRow[] = [
  { name: 'Claude Code', status: 'ok', meta: '42k tokens' },
  { name: 'Codex', status: 'ok', meta: '18k tokens' },
  { name: 'Gemini CLI', status: 'amber', meta: 'quota reset in 9h' },
];

export const AGENTS_SUMMARY = {
  dispatched: 14,
  done: 12,
  anomalies: 2,
};

export type InfraTone = 'ok' | 'warn' | 'default';

export interface InfraRow {
  label: string;
  value: string;
  tone: InfraTone;
}

export const INFRASTRUCTURE: InfraRow[] = [
  { label: 'OpenCloud node', value: 'online', tone: 'ok' },
  { label: 'Vibe Kanban', value: 'v0.1.43 ✓', tone: 'default' },
  { label: 'Disk', value: '74% · 68G free', tone: 'default' },
  { label: 'Uptime', value: '14d 3h', tone: 'default' },
];

export type PulseStatTone = 'default' | 'warn';

export interface PulseStat {
  n: string;
  label: string;
  tone?: PulseStatTone;
}

export interface PulseModule {
  stats: PulseStat[];
  note: string;
}

export const MISSIONS_PULSE: PulseModule = {
  stats: [
    { n: '3', label: 'Active' },
    { n: '1', label: 'Cold', tone: 'warn' },
    { n: '+2', label: 'This week' },
  ],
  note: 'ASurf +2, others 0',
};

export const KNOWLEDGE_PULSE: PulseModule = {
  stats: [
    { n: '9', label: 'Chunks' },
    { n: '5', label: 'Topics' },
    { n: '23', label: 'Memories' },
  ],
  note: '2 distill ready · last distilled 3d ago',
};

export type RhythmTone = 'urgent' | 'warn' | 'info';

export interface RhythmRow {
  tone: RhythmTone;
  text: string;
}

export const TODAYS_RHYTHM: RhythmRow[] = [
  { tone: 'urgent', text: '2 items need you in Threads' },
  { tone: 'warn', text: 'ASurf focus stale 5 days' },
  { tone: 'info', text: '2 distill proposals ready in Mind' },
];

export type MilestoneCategory =
  | 'achievement'
  | 'decision'
  | 'lesson'
  | 'pattern';

export interface Milestone {
  cat: MilestoneCategory;
  title: string;
  mission: string;
  when: string;
}

export const MILESTONES: Milestone[] = [
  {
    cat: 'achievement',
    title: 'Paper repro: arxiv 2402.08xxx',
    mission: 'asurf',
    when: 'yesterday',
  },
  {
    cat: 'pattern',
    title: '先写 verification 再派活',
    mission: 'asurf',
    when: '2 days',
  },
  {
    cat: 'decision',
    title: '换用 claude-code 跑 repro',
    mission: 'asurf',
    when: '5 days',
  },
  {
    cat: 'lesson',
    title: 'gemini-cli 在 DFT 上 hallucinate 参数',
    mission: 'asurf',
    when: '1 week',
  },
  {
    cat: 'achievement',
    title: 'Tailscale + tmux remote 配置完成',
    mission: 'vk-mobile',
    when: '3 days',
  },
];

export const STATION_HEADER = {
  uptime: '14d 3h uptime',
  titleLead: 'Your workstation.',
  titleTail: "Here's how it's running.",
  avatar: 'TH',
};
