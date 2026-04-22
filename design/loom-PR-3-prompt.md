# PR 3 · Responsive 5-tab shell + Station (mock)

> 这是给 Claude Code 的任务包。Claude 会在 Vibe Kanban 起的 worktree 里执行。
> 提交给 Vibe Kanban 作为 task prompt 使用（复制从 `## Task · 开始` 到文末的内容）。
> 顶部这一段是给 Tianhan 看的说明，不进入 prompt。

---

## 使用说明（给 Tianhan）

1. 先把 `pr-2.1-loom-rebrand` 分支合并到 master（包括那条 tailwind `.js → .cjs` fix 的收尾提交）
2. 在 Vibe Kanban 里新建 task，project 选 **loom**（原 vibe-kanban fork）
3. Agent 选 **Claude Code**
4. Title: `PR 3 · Responsive 5-tab shell + Station (mock)`
5. Description 贴下面 `## Task · 开始` 以下的全部内容
6. 派活，然后去 Threads tab 观察

Agent 会分 **4 个 commit** 完成这个 PR。每个 commit 后都可以独立审查、`pnpm run dev` 确认视觉。

本 PR 刻意**不触碰真实数据**——Station 的所有模块走写死的 mock。PR5 才做数据聚合。这样做的好处是这个 PR 可以快速 review / revert，不会和后续的 backend 工作耦合。

---

## Task · 开始

You're working in a worktree of **Loom** (a harness engineer's workstation, built on Vibe Kanban — a self-hosted agent-orchestration tool with a Rust backend and React/TypeScript frontend). This repo is a personal fork; **there are no upstream concerns** — you're free to restructure routes, rename files, and replace any UI layer you need to.

The previous PR (2.1) rebranded the product to Loom, installed the Claude-light palette, and renamed user-facing "Task" to "Thread". This PR is **PR 3** in the migration plan.

### Product context

Loom's navigation is organized into **5 tabs**, each named after a part of a weaving loom (the product's core metaphor):

| Tab | 部件 | 作用 |
|---|---|---|
| **Station** | 机架 + 仪表 | 默认首屏。展示织机状态 + 已织成的织物（milestones） |
| **Threads** | 线 | 当前正在织的活（agent 工作流，即现有的 workspace/task 列表） |
| **Dispatch** | 投梭 | 把新线穿过经纬，派一个新活（全屏派活表单） |
| **Missions** | 经线 | 贯穿整件织物的长期主题 |
| **Mind** | 染坊 | 线被染色、准备好的地方（Profile / Knowledge / Memory） |

The Station/Mind boundary is the rebrand's most important design decision: **Station = "我做出了什么"（外显的状态和产出），Mind = "我是什么样的人"（内在的认知和思考）**. Milestones live in Station, not Mind.

### Scope (what this PR does)

1. A **responsive tab shell**: bottom nav on mobile, left sidebar on desktop, using the same React tree (no duplicated components).
2. Station tab **fully implemented** — NOW segment with 5 modules (Agents / Infrastructure / Missions Pulse / Knowledge Pulse / Today's Rhythm) + LEGACY segment with a horizontal milestones rail. **All data is hardcoded mock** — do not wire this to any API.
3. Threads tab **wraps the existing workspace list** (`/_app/workspaces` content). Includes a dismissible orange Inbox banner at the top.
4. Dispatch / Missions / Mind tabs: **placeholder screens** with the correct title, tab icon lit up, and a "Coming in PR N" empty state. No real content.
5. Default landing: visiting `/` redirects to `/station`.

### Scope (what this PR does NOT do)

- **No real data aggregation.** Don't call `useAgents()`, read git status, count chunks, or anything else dynamic. Everything in Station is a static constant. PR5 handles data.
- **No CRUD on milestones, missions, or memory.** The `+ Mark milestone` button at the bottom of Station should render but only fire a toast when clicked.
- **No new routes for Dispatch forms, Mission detail, Memory editor.** These are separate PRs (PR4-6).
- **No backend changes.** No Rust edits, no new API routes, no database.
- **Do not remove existing routes.** `_app.workspaces.tsx`, `_app.projects.$projectId.tsx`, etc. must keep working — they're the content Threads tab wraps.

### Current route structure (for reference)

File-based TanStack Router in `packages/local-web/src/routes/`:

```
routes/
├── __root.tsx              # providers (i18n, theme, user, etc.)
├── index.tsx               # / — renders <RootRedirectPage/> (smart redirect based on login)
├── _app.tsx                # /_app layout — renders <SharedAppLayout/> (Vibe Kanban's
│                           #    app bar + sidebars + MobileDrawer + many providers)
├── _app.workspaces.tsx     # /workspaces — current Thread (task) list
├── _app.projects.$projectId.tsx
├── _app.hosts.$hostId.workspaces.tsx
├── _app.workspaces_.$workspaceId.tsx
├── ... (many other Vibe Kanban routes)
└── onboarding.tsx
```

`_app` is pathless, so `_app.foo.tsx` produces the URL `/foo` (not `/_app/foo`).

### Integration realities you must handle

Three facts about the current code that shape the plan:

**1. `SharedAppLayout` owns Vibe Kanban's chrome today.**
`_app.tsx` renders `<SharedAppLayout/>` which ships its own top app bar, sidebars, mobile drawer, and many context providers (org, auth, keyboard, notifications, etc.). You **cannot** just nest TabShell inside it — you'd double-stack navigation — and you **cannot** rip it out — the legacy Vibe Kanban routes (`/workspaces`, `/projects/...`) depend on it. **Solution**: add a new pathless route group `_shell` for the 5 Loom tabs that does NOT go through `_app`. Keep `_app.*` routes untouched. The two groups coexist at the same URL root.

**2. `index.tsx` uses a smart redirect, not a raw redirect.**
`<RootRedirectPage/>` routes users to onboarding / workspace-create / first-project based on login and org state. Do NOT replace it with a bare `redirect({ to: '/station' })` — you'd break onboarding. Instead, modify `RootRedirectPage.tsx` so the final "logged-in, has project" branch navigates to `/station` instead of `goToProject(...)`. Leave the onboarding / not-logged-in branches alone.

**3. `brand-soft` and `brand-soft-2` Tailwind tokens don't exist yet.**
The prototype uses `--brand-soft` / `--brand-soft-2` CSS variables (already in `index.css`), but `tailwind.new.config.cjs` only exposes `brand`, `brand-hover`, `brand-secondary`, `on-brand`. Add the two missing color tokens during Commit 1 (the Inbox banner in Commit 3 needs them):

```js
// in tailwind.new.config.cjs, theme.extend.colors:
'brand-soft':   "hsl(var(--brand-soft))",
'brand-soft-2': "hsl(var(--brand-soft-2))",
```

If the underlying CSS variables are defined as rgba (not HSL channels), you'll need to either (a) convert them to HSL in `index.css` following the existing pattern used for other `--_*` tokens, or (b) reference them directly via arbitrary values like `bg-[var(--loom-brand-soft)]`. Prefer (a) for consistency.

### Target route structure (what to build)

Add these files — **do not delete or rename existing ones**:

```
routes/
├── _shell.tsx              # pathless layout wrapping <TabShell>
├── _shell.station.tsx      # /station
├── _shell.threads.tsx      # /threads — embeds <WorkspaceList> extracted from _app.workspaces.tsx
├── _shell.dispatch.tsx     # /dispatch — placeholder
├── _shell.missions.tsx     # /missions — placeholder
└── _shell.mind.tsx         # /mind — placeholder
```

And modify:

- `_shell.tsx` renders `<TabShell><Outlet/></TabShell>`. TabShell includes the bottom-nav (mobile) and sidebar (desktop).
- `packages/web-core/src/pages/root/RootRedirectPage.tsx` → change the logged-in success branch to navigate to `/station` instead of `goToProject(...)`. Add a new helper to `useAppNavigation()` like `goToStation({ replace: true })` or just call `navigate({ to: '/station', replace: true })` inline.
- TanStack Router regenerates `routeTree.gen.ts` automatically when dev runs. **Don't edit it by hand** — if regeneration misfires, delete it and let `pnpm run local-web:dev` recreate it.

### Visual reference

The high-fidelity prototype is at `design/loom-v6.html` (mobile layout only). **Open it in a browser before starting.** It has:

- The exact styling of all 5 tab icons (copy the SVG stroke paths)
- Station NOW modules with the correct data shape
- LEGACY milestones horizontal rail
- Inbox banner at the top of Threads (orange soft-gradient)
- Bottom-nav styling (52px height, brand color on active state, mono-serif tab labels)

The desktop sidebar is **not** in the prototype — you'll design it to match the mobile nav's visual grammar (same icons, same active treatment), just rotated 90° and placed on the left at ≥768px. Sidebar width: 200px. Tab items stack vertically.

### Responsive strategy

- **Breakpoint**: 768px (Tailwind's `md:`)
- **< 768px** (mobile): `<TabShell>` renders `<BottomNav>` fixed to the bottom. Content scrolls in the middle. Safe-area padding for iOS home indicator.
- **≥ 768px** (desktop): `<TabShell>` renders `<Sidebar>` fixed to the left (200px wide). Content is a flex child that fills the remaining width, max-width on inner content rails so reading isn't miles wide.
- Use the same React components for both breakpoints. No `isMobile` boolean in app state — use Tailwind's responsive utilities on the shell itself.
- Tab icons and labels are identical across the two layouts.

### Color / style tokens (from PR2.1, already in `tailwind.new.config.cjs`)

Use existing Tailwind tokens — do NOT hardcode hex. Key tokens:

```
bg-primary / bg-secondary / bg-panel     # surfaces
text-high / text-normal / text-low       # ink
brand / brand-hover                      # accent
leaf / amber / err / indigo              # milestone category colors
font-ibm-plex-sans / font-ibm-plex-mono  # typography
border (rgba ink 8%)
```

**Milestone category → color band** (4px left border on each milestone card):

| Category | Icon | Color |
|---|---|---|
| Achievement | 🏆 | `leaf` |
| Decision | 🎯 | `brand` |
| Lesson | ⚠ | `amber` |
| Pattern | 💡 | `indigo` |

---

## Execution plan

Do this as **four sequential commits** in the same PR. Each commit must leave the app in a runnable state (`pnpm run dev` works, no TypeScript errors).

### Commit 1 · Responsive tab shell

**Commit message:** `feat: add responsive 5-tab shell (bottom-nav + sidebar)`

1. **Add `brand-soft` Tailwind tokens first.** Edit `packages/local-web/tailwind.new.config.cjs` to add:
   ```js
   'brand-soft':   "hsl(var(--brand-soft))",
   'brand-soft-2': "hsl(var(--brand-soft-2))",
   ```
   If `--brand-soft` / `--brand-soft-2` are defined as rgba in `packages/web-core/src/app/styles/new/index.css`, add a parallel HSL channel definition there following the pattern used for other `--_*` vars. Test with a throwaway `<div className="bg-brand-soft"/>` before committing.

2. Create `packages/local-web/src/app/shell/TabShell.tsx`. Export a component that:
   - Wraps `children` in a flex layout.
   - On mobile (`< md`): renders `<BottomNav>` fixed to bottom, content area above with `pb-[72px]` to clear the nav. Respect iOS safe-area via `pb-[calc(72px+env(safe-area-inset-bottom))]`.
   - On desktop (`≥ md`): renders `<Sidebar>` fixed to left (200px), content area `flex-1 ml-[200px]` to the right.

3. Create `packages/local-web/src/app/shell/BottomNav.tsx` and `.../Sidebar.tsx`. Both take a `tabs` array and derive the active tab from the URL. The tabs array is a shared constant in `.../tabs.ts`:
   ```ts
   export const LOOM_TABS = [
     { id: 'station',  to: '/station',  label: 'Station',  icon: StationIcon },
     { id: 'threads',  to: '/threads',  label: 'Threads',  icon: ThreadsIcon },
     { id: 'dispatch', to: '/dispatch', label: 'Dispatch', icon: DispatchIcon },
     { id: 'missions', to: '/missions', label: 'Missions', icon: MissionsIcon },
     { id: 'mind',     to: '/mind',     label: 'Mind',     icon: MindIcon },
   ] as const;
   ```

4. Create `packages/local-web/src/app/shell/icons/` with the 5 tab icon components. Copy the SVG stroke paths from `design/loom-v6.html` (search the file for `data-screen="s-station"` — the icons are immediately above each nav button, around lines 1255-1280). Each icon is a React component that accepts `className` so active state can tint it via `text-brand`.

5. Active state detection: use TanStack Router's `useRouterState()` + match on `location.pathname === tab.to || location.pathname.startsWith(tab.to + '/')`. Apply `text-high font-semibold` + icon color `text-brand` for the active tab; default is `text-low`.

6. Create `routes/_shell.tsx` as the pathless layout:
   ```tsx
   import { createFileRoute, Outlet } from '@tanstack/react-router';
   import { TabShell } from '@/app/shell/TabShell';

   export const Route = createFileRoute('/_shell')({
     component: () => <TabShell><Outlet/></TabShell>,
   });
   ```

7. Create empty `routes/_shell.station.tsx`, `_shell.threads.tsx`, `_shell.dispatch.tsx`, `_shell.missions.tsx`, `_shell.mind.tsx`. Each just renders a `<div>{label}</div>` placeholder — real content comes in later commits. Example scaffold for `_shell.station.tsx`:
   ```tsx
   import { createFileRoute } from '@tanstack/react-router';
   export const Route = createFileRoute('/_shell/station')({
     component: () => <div>Station</div>,
   });
   ```

8. Modify `packages/web-core/src/pages/root/RootRedirectPage.tsx`: change the logged-in success branch (where it currently calls `appNavigation.goToProject(...)`) to navigate to `/station` instead. Either add `goToStation()` to `useAppNavigation()`, or use `useNavigate()` and call `navigate({ to: '/station', replace: true })`. Do NOT alter the onboarding or workspaces-create branches.

**Verify:**
- `/`  → for a logged-in user, lands on `/station`. For an un-onboarded user, still goes to `/onboarding` (no regression).
- Click through all 5 tabs; active state follows the URL.
- Resize browser across 768px; the nav moves from bottom to left without layout flicker.
- Existing routes `/workspaces`, `/projects/...` still work (URL bar test) and render with their original Vibe Kanban chrome. They are NOT under TabShell — that's intentional.

### Commit 2 · Station tab with mock data

**Commit message:** `feat(station): implement Station tab with NOW + LEGACY segments (mock data)`

Target file: replace the Commit 1 placeholder in `routes/_shell.station.tsx` with the real implementation.

1. Create `packages/local-web/src/app/station/mocks.ts` — all mock data lives here, so PR5 can later swap it out in one place:

   ```ts
   export const AGENTS_TODAY = [
     { name: 'Claude Code',  status: 'ok',    meta: '42k tokens' },
     { name: 'Codex',        status: 'ok',    meta: '18k tokens' },
     { name: 'Gemini CLI',   status: 'amber', meta: 'quota reset in 9h' },
   ];
   export const AGENTS_SUMMARY = { dispatched: 14, done: 12, anomalies: 2 };

   export const INFRASTRUCTURE = [
     { label: 'OpenCloud node', value: '● online', tone: 'ok' },
     { label: 'Vibe Kanban',    value: 'v0.1.43 ✓', tone: 'default' },
     { label: 'Disk',           value: '74% · 68G free', tone: 'default' },
     { label: 'Uptime',         value: '14d 3h', tone: 'default' },
   ];

   export const MISSIONS_PULSE = {
     stats: [
       { n: '3',  label: 'Active' },
       { n: '1',  label: 'Cold', tone: 'warn' },
       { n: '+2', label: 'This week' },
     ],
     note: 'ASurf +2, others 0',
   };

   export const KNOWLEDGE_PULSE = {
     stats: [
       { n: '9',  label: 'Chunks' },
       { n: '5',  label: 'Topics' },
       { n: '23', label: 'Memories' },
     ],
     note: '2 distill ready · last distilled 3d ago',
   };

   export const TODAYS_RHYTHM = [
     { tone: 'urgent', text: '2 items need you in Threads' },
     { tone: 'warn',   text: 'ASurf focus stale 5 days' },
     { tone: 'info',   text: '2 distill proposals ready in Mind' },
   ];

   export const MILESTONES = [
     { cat: 'achievement', title: 'Paper repro: arxiv 2402.08xxx',         mission: 'asurf',    when: 'yesterday' },
     { cat: 'pattern',     title: '先写 verification 再派活',                mission: 'asurf',    when: '2 days' },
     { cat: 'decision',    title: '换用 claude-code 跑 repro',               mission: 'asurf',    when: '5 days' },
     { cat: 'lesson',      title: 'gemini-cli 在 DFT 上 hallucinate 参数',   mission: 'asurf',    when: '1 week' },
     { cat: 'achievement', title: 'Tailscale + tmux remote 配置完成',         mission: 'vk-mobile', when: '3 days' },
   ];
   ```

2. Build Station view (`_shell.station.tsx` + supporting components in `src/app/station/`):
   - **Header**: Loom logo (primary B3 SVG from `public/loom-logo.svg`), wordmark "Loom" next to it, an eyebrow row `● 14d 3h uptime`, an h1 `Your workstation. <span class="text-low">Here's how it's running.</span>`, and an avatar button top-right (`TH`).
   - **NOW divider**: a small section divider with the label "Now" (mono, small, tracking-wider, uppercase, text-low). Reuse for LEGACY.
   - **5 modules** in order: Agents · today, Infrastructure, Missions Pulse, Knowledge Pulse, Today's Rhythm.
     - Module card styling: `bg-panel rounded-lg border p-base` (use the Tailwind tokens).
     - Module label is mono, small, tracking-wider, uppercase, text-low, with optional `<span class="text-low font-normal"> · today</span>` suffix (Agents).
     - Agents rows: status dot (green `bg-leaf`, amber `bg-amber`) + name (`font-normal`) + right-aligned meta (mono).
     - Infrastructure rows: label left + value right, `tone:ok` shows green dot before value.
     - Pulse modules (Missions/Knowledge): 3-column grid of big number + small caps label, note line below.
     - Today's Rhythm: rows of dot + text, dot color per tone (urgent=err, warn=amber, info=indigo).
   - **LEGACY divider**, then a horizontal scrolling rail of 5 milestone cards (the `MILESTONES` array). Each card:
     - 4px left color band per `cat` (achievement→leaf, decision→brand, lesson→amber, pattern→indigo).
     - Top: icon + category label (mono, small, uppercase).
     - Title: `text-high font-medium`, `text-base` (PRD sizes).
     - Footer: mission chip (`bg-brand-soft text-brand-hover rounded-sm px-1`) + "when" (text-low, mono).
   - Below the rail: row with `[+ Mark milestone]` button (brand-colored primary). On click: fire a toast `"Mark milestone — coming in PR 4"`. Toast component: reuse any existing toast; if none, a `position: fixed` div that appears for 2s is fine.
   - `[View all →]` link right of LEGACY section heading — `onClick` shows the same placeholder toast.
3. Responsive: horizontal milestones rail keeps horizontal scroll on all sizes. On desktop, cap the outer container to `max-w-[720px]` and center it. Mobile uses full width.

**Verify:**
- `/station` renders the full Station view with all 5 NOW modules + 5 LEGACY cards.
- Numbers / labels match the mock exactly.
- The `+ Mark milestone` and `View all` buttons fire toast-like feedback.
- Desktop (≥768px): content is centered with sidebar on left; mobile: bottom nav visible, content scrolls under the header.

### Commit 3 · Threads tab wraps workspace list + Inbox banner

**Commit message:** `refactor: wrap existing workspace list in Threads tab with Inbox banner`

1. Identify the inner "thread list" UI currently rendered inside `SharedAppLayout` for the `/workspaces` route. This is likely `WorkspacesSidebarContainer` + the main content area of that page. Extract the list-rendering part into a reusable component `packages/local-web/src/app/threads/WorkspaceList.tsx`. The goal: a component that renders **just the list of threads/workspaces**, without SharedAppLayout's app bar or left-rail chrome. Do NOT delete `_app.workspaces.tsx` — it continues to work for URL-bar access.

2. If the existing workspace list is tightly coupled to SharedAppLayout's providers (Workspace, Actions, Organization, etc.), you have two acceptable choices:
   - **Preferred**: ensure `_shell.tsx` provides the minimum subset of providers `<WorkspaceList>` needs. Look at `AppRouteProviders` in `_app.tsx` for the list. Do NOT import SharedAppLayout into `_shell.tsx`.
   - **Acceptable fallback**: `_shell.threads.tsx` renders a lightweight "coming soon" message + a deep link to `/workspaces`. Flag this in the PR description. This keeps PR3 small and defers the provider-unbundling work to a later PR.

3. Replace the placeholder in `routes/_shell.threads.tsx`:
   - Render `<InboxBanner>` above `<WorkspaceList/>` (or the fallback message).
   - `<InboxBanner>` props: `items: InboxItem[]`. If empty, render nothing (the whole banner disappears). For PR3, pass a single mock item so the banner is visible for demo:
     ```ts
     const MOCK_INBOX = [{ kind: 'needs-you', count: 2, href: '#' }];
     ```
   - Banner styling: `mx-5 mb-2.5 px-3.5 py-2.5 bg-gradient-to-r from-brand-soft to-bg-primary border border-brand-soft-2 rounded-xl flex items-center gap-2.5`.
   - Content: 26×26 rounded brand-filled icon box with `!` inside, text `<span class="text-brand font-bold">2 items</span> need you`, right-side `VIEW →` in mono caps.

4. Add a small dev-only toggle: an X close button on the banner that hides it for the session (component-local `useState`). On next full reload it reappears. Do NOT persist this.

**Verify:**
- `/threads` shows the inbox banner at top + the thread list (or fallback message) below.
- `/workspaces` still works (same UI as before PR3).
- Clicking X on the banner hides it; refresh restores.
- Clicking a thread in the list opens its detail as before (no routing regression).

### Commit 4 · Placeholder screens for Dispatch / Missions / Mind

**Commit message:** `feat: add placeholder screens for Dispatch, Missions, and Mind tabs`

1. Each of `_shell.dispatch.tsx`, `_shell.missions.tsx`, `_shell.mind.tsx` renders a simple empty-state screen:
   - Centered column, `py-16`.
   - A muted icon (reuse the tab's icon at 48px, `text-low`).
   - An h2 with the tab name (`text-high`, `font-semibold`).
   - A subtitle in `text-low` describing what will live here:
     - Dispatch: *"Kick off a new thread. Coming in PR 4."*
     - Missions: *"Your long-lived projects. Coming in PR 4."*
     - Mind: *"Profile · Knowledge · Memory. Coming in PR 4."*
2. No interactive content. Just text.

**Verify:**
- All 5 tabs are reachable via nav. Active state works. Station/Threads have real content; the other three show the placeholder.
- `pnpm run check` passes (TypeScript + Rust).
- `pnpm run lint` passes (no new ESLint errors).

---

## Definition of Done

- [ ] Four commits landed, each with the messages above, each leaving the app runnable.
- [ ] `pnpm run dev` starts; visiting `http://localhost:<frontend-port>` lands on `/station`.
- [ ] All 5 tabs navigate correctly on mobile (bottom-nav) and desktop (sidebar). Resizing across 768px doesn't break layout.
- [ ] Station renders exactly the mock data listed in Commit 2 — no dynamic reads.
- [ ] Milestones rail scrolls horizontally and shows 5 cards with correct category colors.
- [ ] Threads tab renders the existing workspace list under the Inbox banner.
- [ ] Dispatch / Missions / Mind tabs render their placeholders.
- [ ] Existing routes like `/workspaces`, `/projects/$projectId` still work (tested by URL-bar navigation).
- [ ] `pnpm run check` and `pnpm run lint` pass.
- [ ] PR description summarizes what's in each of the four commits and links `design/loom-v6.html` as the visual reference.

## Out of scope (not in this PR)

- Any real-data wiring for Station modules (PR 5)
- Mission detail pages, Memory CRUD, Milestone CRUD (PR 4)
- Dispatch form (PR 4)
- Mind sub-sections (Profile / Knowledge / Memory pages) (PR 4-6)
- PWA / offline / HTTPS (PR 7)
- Independent domain (PR 8)
- Backend changes of any kind
- Renaming Rust crate names, DB tables, API routes, env vars

## If you get stuck

If any step is ambiguous, **stop and ask before guessing**:

- The prototype uses hardcoded pixel values in places — translate them to Tailwind tokens where equivalent tokens exist; if no matching token, use arbitrary values `p-[14px]` and leave a comment `// TODO: token`.
- If `routeTree.gen.ts` regeneration fails after creating new route files, delete it and let the Vite dev server regenerate it on next start.
- If the existing workspace list is too entangled with SharedAppLayout's providers to safely extract in this PR, fall back to the "coming soon" message in `_shell.threads.tsx` + deep link to `/workspaces` (Commit 3 explicitly allows this). Flag it in the PR description.
- Do NOT invent missing data — if the prototype references a value not in the mock spec above, copy from `design/loom-v6.html` directly and mention the addition in the PR description.

## Reference documents

Open these before you start and keep them open during implementation:

- `design/loom-v6.html` — high-fidelity mobile prototype (visual source of truth for this PR)
- `tianhanz-kb/docs/topics/loom/prd-v6.md` — complete product spec (sections §5, §6.1-6.5 cover this PR; §9 covers color/typography)
- `tianhanz-kb/docs/chunks/loom.md` — one-page product summary
- `design/loom-brand-kit.html` — color swatches + logo rules (consult if you hit ambiguity on palette usage)

(These may not be mounted in this worktree. If missing, proceed with the information in this prompt — it's deliberately self-contained.)

---

## 一个可执行的小提示（给 Tianhan）

PR3 比 PR2.1 复杂——它引入了完整的导航骨架 + Station 的全部视觉实现。prompt 里刻意把每个 commit 的产出讲到"拿起来就能验"的颗粒度，这样每 commit 都可以独立 review/revert。

如果 Claude Code 中途问你问题，最可能的几个点：

1. **"要不要提前抽出 BottomNav/Sidebar 的通用 props 接口？"** → 回答：**要**。Commit 1 里明确写了 `LOOM_TABS` 常量和 `tabs` 数组输入。
2. **"现有 workspace 列表和 SharedAppLayout 的 Providers 纠缠很深，抽不出来怎么办？"** → 回答：**接受 `_shell.threads.tsx` 先放个"coming soon" + 深链到 `/workspaces`**。这是 Commit 3 明写允许的 fallback，比硬拆出一堆 breaking 更稳。
3. **"Station 模块的排版在桌面看太窄/太宽怎么办？"** → 回答：**保持 720px max-width 居中，不为桌面另做布局**。桌面信息密度调整是 PR5 的事。
4. **"mock 数据要不要从 tianhanz-kb 里读真实 chunk 数量？"** → 回答：**不**。mock 就是写死的，PR3 不搭 KB 读取管道。

PR 合并后，你就有一个**视觉上完整**的 5-tab Loom 第一版。接下来 PR 4 上 Dispatch 表单 + Mission 详情，这些 placeholder 会逐个被替换成真东西。
