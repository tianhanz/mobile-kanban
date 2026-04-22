# PR 2.1 · Loom Rebrand + Light Palette

> 这是给 Claude Code 的任务包。Claude 会在 Vibe Kanban 起的 worktree 里执行。
> 提交给 Vibe Kanban 作为 task prompt 使用（复制从 `## Task · 开始` 到文末的内容）。
> 顶部这一段是给 Tianhan 看的说明，不进入 prompt。

---

## 使用说明（给 Tianhan）

1. 在 Vibe Kanban 里新建 task，project 选 **vibe-kanban**（或你 fork 后的名字）
2. Agent 选 **Claude Code**
3. Title: `PR 2.1 · Loom rebrand + light palette`
4. Description 贴下面 `## Task · 开始` 以下的全部内容
5. 派活，然后去 Threads tab 观察

Agent 会分三个 commit 完成这个 PR。你可以在每个 commit 后审查。

---

## Task · 开始

You're working in a worktree of `vibe-kanban`, a self-hosted agent-orchestration tool (Rust backend + React/TypeScript frontend). This repo has already been forked for personal use — you should assume **no upstream concerns**: feel free to rename, remove, replace anything. The goal of this PR is to rebrand the product from "Vibe Kanban" to "Loom" and install a new visual palette.

This is **PR 2.1** in a larger migration plan. Your scope is strictly UI-level branding and color. Do not touch backend business logic, database schemas, API routes, or agent integration code. If you encounter such code with "vibe-kanban" in it (e.g., config keys, API paths, database tables), **leave it alone** — a later PR will handle backend renaming.

### Product context

Loom is a "harness engineer's workstation" — the rebrand is part of positioning the product as an independent identity rather than a Vibe Kanban fork. The visual language is:

- **Claude-light aesthetic**: warm off-white background, charcoal text, softened Claude-orange accent
- **Not industrial, not playful** — closer to Linear or Notion in tone
- **Typography**: IBM Plex Sans for UI, IBM Plex Mono for labels/timestamps

### Color palette (authoritative)

Add these as the canonical CSS variables. If variables already exist with other names for similar purposes, **replace them** — do not try to keep both systems.

```css
/* Surfaces */
--bg:           #faf9f7;
--surface:      #ffffff;
--surface-2:    #f3f1ed;
--surface-3:    #eae7e0;

/* Ink (text + high-contrast elements) */
--ink:          #1a1714;
--ink-2:        #3a342c;    /* user message bubbles, secondary emphasis */
--ink-dim:      #8a8173;
--ink-faint:    #b5ac9c;

/* Lines and separators */
--line:         rgba(26,23,20,.08);
--line-2:       rgba(26,23,20,.14);

/* Brand — softened Claude orange */
--brand:        #c96f4d;
--brand-hover:  #b55a3c;
--brand-soft:   rgba(201,111,77,.08);
--brand-soft-2: rgba(201,111,77,.14);

/* Semantic */
--leaf:         #6b8e4e;    /* success, milestone:achievement */
--leaf-soft:    rgba(107,142,78,.1);
--amber:        #c89040;    /* warning, milestone:lesson */
--amber-soft:   rgba(200,144,64,.1);
--err:          #b94a4a;
--err-soft:     rgba(185,74,74,.08);
--indigo:       #6b6a8e;    /* milestone:pattern */
--indigo-soft:  rgba(107,106,142,.1);

/* Fonts */
--sans:         'IBM Plex Sans', system-ui, sans-serif;
--mono:         'IBM Plex Mono', ui-monospace, monospace;
```

### Logo (B3 · woven L)

The Loom logo is a stylized L woven from warp threads (brand color) and weft threads (ink color). **Do not redesign it.** Use exactly these SVG sources.

**Primary (use at 32px and larger):**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <!-- warps · mission · brand -->
  <line x1="32" y1="20" x2="32" y2="90" stroke="#c96f4d" stroke-width="3" stroke-linecap="round"/>
  <line x1="38" y1="20" x2="38" y2="90" stroke="#c96f4d" stroke-width="3" stroke-linecap="round"/>
  <line x1="44" y1="20" x2="44" y2="90" stroke="#c96f4d" stroke-width="3" stroke-linecap="round"/>
  <!-- wefts · task · ink -->
  <line x1="26" y1="90" x2="98" y2="90" stroke="#1a1714" stroke-width="5" stroke-linecap="round"/>
  <line x1="26" y1="78" x2="98" y2="78" stroke="#1a1714" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
</svg>
```

**Compact (use at 24px and smaller — favicon, small UI):**

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <line x1="38" y1="20" x2="38" y2="88" stroke="#c96f4d" stroke-width="14" stroke-linecap="round"/>
  <line x1="28" y1="88" x2="94" y2="88" stroke="#1a1714" stroke-width="14" stroke-linecap="round"/>
</svg>
```

Save these to `frontend/public/` (or equivalent static assets directory) as:
- `loom-logo.svg` (primary)
- `loom-favicon.svg` (compact)

Use them wherever the app currently references Vibe Kanban's logo or favicon.

---

## Execution plan

Do this as **three sequential commits** in the same PR. After each commit, verify your work compiles and the app still runs before moving to the next stage.

### Stage 1 · Install the light palette

**Commit message:** `style: install Claude-light color palette`

1. Find the file(s) where CSS variables are defined globally (likely `frontend/src/index.css`, `App.css`, `theme.ts`, or a Tailwind config).
2. Replace the current color system with the palette above. **Keep** any semantic variable names that other components reference (e.g., if components use `var(--primary)`, map `--primary` to `#c96f4d`).
3. If the codebase uses Tailwind with a theme config, update `tailwind.config.js` to reflect the new tokens.
4. Audit any hardcoded hex values outside the theme file — replace ad-hoc colors with semantic tokens where reasonable (don't go crazy; fix obvious ones).
5. Import IBM Plex Sans and IBM Plex Mono. Add to the HTML head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Apply `font-family: var(--sans)` to the body.

**Verify before committing:**
- `npm run dev` or equivalent starts without errors
- Main dashboard page renders in new colors (no glaring wrong-color elements)
- Fonts load (IBM Plex Sans visible on body text)

### Stage 2 · Rebrand visible identity to Loom

**Commit message:** `feat: rebrand product identity to Loom`

1. **Title tag**: change `<title>Vibe Kanban</title>` → `<title>Loom</title>` wherever it appears (index.html, SSR templates, etc.)
2. **Favicon**: replace the existing favicon link with:
   ```html
   <link rel="icon" type="image/svg+xml" href="/loom-favicon.svg">
   ```
   Ensure `loom-favicon.svg` is in the static assets dir from the earlier step.
3. **PWA manifest** (if it exists — `manifest.json` or `site.webmanifest`): update `name`, `short_name`, `description` to reflect Loom. Update icons to point to the new SVGs (you may need to also generate 192x192 and 512x512 PNGs — if that's nontrivial, leave a TODO comment and use the SVG only for now).
4. **Meta tags**: update `og:title`, `og:description`, `theme-color` (`#faf9f7`) if present.
5. **Header / sidebar brand area**: wherever the app currently displays "Vibe Kanban" as its product name in the UI (navigation, sidebar, empty states, login page if any), replace with the Loom wordmark — logo SVG + "Loom" text side by side. Use the primary SVG above for this.
6. **package.json**: update `name` from `vibe-kanban` to `loom`. Update `description` to something like `"A harness engineer's workstation"`.
7. **README.md**: update the top heading and first paragraph to reflect Loom as the product name. Keep most of the technical docs intact — we're rebranding, not rewriting history. A simple note like "Loom is built on Vibe Kanban's agent orchestration engine" is fine if you want to preserve the lineage.

**Do NOT change:**
- Backend Rust crate names / package names
- Database schema, table names, config keys with "vibe_kanban" in them
- API route paths
- Environment variable names (e.g., `VIBE_KANBAN_PORT`)
- Any git history or commit author info

**Verify before committing:**
- Browser tab shows "Loom" with the new favicon
- App UI displays Loom wordmark instead of Vibe Kanban text
- Nothing in backend is broken (start the backend, it should boot)

### Stage 3 · Terminology: Task → Thread (UI only)

**Commit message:** `refactor: rename user-facing "Task" to "Thread"`

In Loom's product language, a unit of agent work is called a **Thread**, not a Task. This aligns the vocabulary with the Threads tab (where such units live) and the Loom weaving metaphor.

**Scope — UI text only:**

1. Search the frontend for user-visible strings containing "task" (case-insensitive). Replace with "thread" when it refers to a unit of agent work. Examples:
   - "New task" → "New thread"
   - "Task detail" → "Thread detail"
   - "Recent tasks" → "Recent threads"
   - "All tasks" → "All threads"
2. Update button labels, empty states, toast messages, and headers accordingly.
3. **Do NOT rename:**
   - TypeScript types / interfaces (`Task`, `TaskId`, `TaskStatus` etc.) — these are implementation details
   - API response fields (`task_id`, `task_status`) — backend contract
   - React component names (`TaskCard`, `TaskList`) — internal naming
   - CSS class names (`.task-item`) — would break styles
   - URL paths (`/tasks/:id`) — would break bookmarks and the backend
   - Database column names
4. **Edge cases to use your judgment on:**
   - Generic English phrases like "your task today is..." in marketing copy — leave as English
   - Function names like `createTask()` — leave alone (implementation)
   - Tooltips / aria-labels — update if user-facing

**Verify before committing:**
- App compiles and runs
- Navigating through the UI, you see "Thread" instead of "Task" in visible labels
- No TypeScript errors from overzealous renaming

---

## Definition of Done

This PR is done when:

- [ ] Three commits landed, each with the messages above
- [ ] Frontend builds without errors (`npm run build` or equivalent)
- [ ] Backend still builds and starts (`cargo run` or equivalent)
- [ ] Browser tab title shows "Loom"
- [ ] Favicon is the compact B3 logo (small L-shaped mark)
- [ ] The app's primary UI uses the new warm palette — no leftover dark backgrounds or high-saturation blues
- [ ] In the UI, "Thread" replaces "Task" in visible labels
- [ ] `package.json` name is `loom`
- [ ] A short PR description summarizes what's in each of the three commits

## Out of scope (do not do in this PR)

- Renaming Rust crates or internal type names
- Changing API routes or database
- Adding new UI features (that's PR 3+)
- 5-tab mobile layout (PR 3)
- Station dashboard implementation (PR 5)
- Memory / milestone features (PR 4-6)
- Anything that requires running migrations

## If you get stuck

If any step is ambiguous (e.g., you can't find the CSS variable definition, or there are multiple theme files), **stop and ask before guessing**. Write a comment in the PR description with the specific question. Do not invent a solution that might conflict with existing patterns.

Prefer reading 2-3 existing files to understand the codebase's conventions before making large edits.

## Reference documents (already in the kb)

The following documents describe the product; consult them if you need more context:

- `tianhanz-kb/docs/chunks/loom.md` — product chunk (if exists)
- Loom PRD v6 — complete product spec
- Loom Brand Kit v1.0 — full visual system

(These may not be mounted in this worktree. If not, proceed using the information in this prompt.)

---

## 一个可执行的小提示（给 Tianhan）

这个 prompt 写得偏长，因为它**嵌入了所有 Claude Code 需要的上下文**（配色 hex、SVG 源码、工作流程、边界）。这是刻意的——你不会想让 Agent 去猜 `#c96f4d` 或者擅自设计 logo。

一旦它跑完三个 commit，你就有了一个视觉上完整的 Loom 第一版。接下来 PR 3 上 5-tab mobile 就有了地基。

如果 Vibe Kanban 开始派活后 Agent 跑跑卡住了问你问题，它问什么你就答什么。大概率会问的点：

1. "配色变量现在分散在 X 个文件，是否都迁移？" → 回答：**都迁移**
2. "backend 里发现 `Vibe Kanban` 字符串是否改？" → 回答：**不改**
3. "有一些 test 里硬编码了旧 hex，是否更新？" → 回答：**更新**
