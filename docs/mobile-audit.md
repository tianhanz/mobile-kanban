# Vibe Kanban 移动端改造审计报告

> 生成日期: 2026-04-19
> 分析版本: v0.1.36 (build 20260323174633)
> 分析方式: 逆向分析已构建产物 + GitHub 源码仓库 (BloopAI/vibe-kanban)

---

## 1. 技术栈清单

### 1.1 前端框架与构建

| 项目 | 技术 / 版本 |
|------|------------|
| 框架 | **React 18** + React Compiler (`babel-plugin-react-compiler`) |
| 语言 | **TypeScript 5.9** |
| 构建工具 | **Vite 7.3** |
| 包管理 | **pnpm** (workspace monorepo) |
| 桌面封装 | **Tauri** (`@tauri-apps/api`) |
| 错误监控 | Sentry (`@sentry/react`, `@sentry/vite-plugin`) |
| 埋点分析 | PostHog (`posthog-js`) |

### 1.2 UI 库

- **shadcn/ui 模式** — 使用 `class-variance-authority` + `clsx` + `tailwind-merge` 三件套
- **Radix UI** 原语: accordion, dialog, dropdown-menu, label, popover, select, separator, slot, switch, toggle-group, tooltip
- **Tailwind CSS v3.4** + `tailwindcss-animate` + `tailwind-scrollbar` + `@tailwindcss/container-queries`
- **图标**: `lucide-react` + `@phosphor-icons/react`
- **动画**: `framer-motion` v12.23
- **命令面板**: `cmdk`

### 1.3 状态管理

| 方案 | 用途 |
|------|------|
| **Zustand** v4.5 + Immer | 全局客户端状态 (stores/) |
| **TanStack React Query** v5.85 | 服务端数据缓存 |
| **TanStack Electric DB** + wa-sqlite | 本地优先数据层 (local-first) |
| **TanStack React Form** + Zod | 表单状态与校验 |

### 1.4 路由方案

- **TanStack Router** v1.161 (file-based routing，`@tanstack/router-plugin`)
- 路由文件位于 `packages/local-web/src/routes/`
- 路由树自动生成: `routeTree.gen.ts`
- 主要路由结构:
  - `_app.projects.$projectId` — 项目看板
  - `_app.projects.$projectId_.issues.$issueId` — Issue 详情
  - `_app.projects.$projectId_.issues.$issueId_.hosts.$hostId.workspaces.$workspaceId` — Workspace 视图
  - `_app.workspaces` / `_app.workspaces_.$workspaceId` — 独立 Workspace 列表与详情
  - `onboarding` / `onboarding_.sign-in` — 登录/注册

### 1.5 WebSocket / 实时通信

- **原生 WebSocket** — 无第三方库，自建传输层
- 传输抽象: `web-core/src/shared/lib/localApiTransport.ts` (`openWebSocket()` / `makeLocalApiRequest()`)
- 消息协议: **JSON Patch (RFC 6902)** 流式状态更新
- 核心消费方:
  - `web-core/src/shared/hooks/useJsonPatchWsStream.ts` — 通用 JSON Patch 流 hook
  - `web-core/src/shared/providers/TerminalProvider.tsx` — 终端 PTY 双向 I/O
  - Workspace 摘要实时更新、Scratch 存储流

---

## 2. 核心组件地图

### 2.1 Monorepo 包结构

| 包 | 路径 | 职责 |
|----|------|------|
| `@vibe/local-web` | `packages/local-web/` | Vite 入口、路由、Tailwind 配置、Tauri 集成 |
| `@vibe/web-core` | `packages/web-core/` | 业务逻辑、features、hooks、stores |
| `@vibe/ui` | `packages/ui/` | 共享 UI 组件库 (156+ 组件) |
| `shared` | `shared/` | 共享 TypeScript 类型 |
| `@vibe/remote-web` | `packages/remote-web/` | 云端部署变体 |

### 2.2 组件文件路径

#### 看板主视图 (Board / Kanban 容器)

| 组件 | 路径 | 说明 |
|------|------|------|
| KanbanContainer | `web-core/src/features/kanban/ui/KanbanContainer.tsx` | 看板主编排组件 (~1000+ 行)，拖拽、过滤、批量操作 |
| ProjectKanban | `web-core/src/pages/kanban/ProjectKanban.tsx` | 项目看板页面，`react-resizable-panels` 分栏布局 |
| LocalProjectKanban | `web-core/src/pages/kanban/LocalProjectKanban.tsx` | 本地项目看板变体 |
| KanbanBoard | `ui/src/components/KanbanBoard.tsx` | 底层看板渲染组件 |

#### 任务卡片 (TaskCard / IssueCard)

| 组件 | 路径 | 说明 |
|------|------|------|
| KanbanCardContent | `ui/src/components/KanbanCardContent.tsx` | 卡片内容渲染 |
| KanbanBadge | `ui/src/components/KanbanBadge.tsx` | 状态徽章 |
| KanbanAssignee | `ui/src/components/KanbanAssignee.tsx` | 指派人头像 |
| KanbanFilterBar | `ui/src/components/KanbanFilterBar.tsx` | 过滤工具栏 |
| BulkActionBarContainer | `web-core/src/features/kanban/ui/BulkActionBarContainer.tsx` | 批量操作栏 |

#### 任务详情面板 (IssuePanel / TaskDrawer)

| 组件 | 路径 | 说明 |
|------|------|------|
| KanbanIssuePanel | `ui/src/components/KanbanIssuePanel.tsx` | Issue 面板 UI 壳 |
| KanbanIssuePanelContainer | `web-core/src/pages/kanban/KanbanIssuePanelContainer.tsx` | 面板容器 + 数据获取 |
| IssueCommentsSectionContainer | `web-core/src/pages/kanban/IssueCommentsSectionContainer.tsx` | 评论区块 |
| IssueRelationshipsSectionContainer | `web-core/src/pages/kanban/IssueRelationshipsSectionContainer.tsx` | 关联关系 |
| IssueSubIssuesSectionContainer | `web-core/src/pages/kanban/IssueSubIssuesSectionContainer.tsx` | 子 Issue |
| IssueWorkspacesSectionContainer | `web-core/src/pages/kanban/IssueWorkspacesSectionContainer.tsx` | 关联 Workspace |
| ProjectRightSidebarContainer | `web-core/src/pages/kanban/ProjectRightSidebarContainer.tsx` | 右侧栏容器 |
| kanban-issue-panel-state.ts | `web-core/src/pages/kanban/kanban-issue-panel-state.ts` | 面板展开状态管理 |

#### Agent 对话流 (Workspace Chat)

| 组件 | 路径 | 说明 |
|------|------|------|
| workspace-chat feature | `web-core/src/features/workspace-chat/` | 对话入口、消息编辑、审批、TODO |
| ChatBoxBase | `ui/src/components/ChatBoxBase.tsx` | 聊天输入框基础组件 |
| ChatMarkdown | `ui/src/components/ChatMarkdown.tsx` | Markdown 渲染 |
| ChatUserMessage | `ui/src/components/ChatUserMessage.tsx` | 用户消息气泡 |
| ChatAssistantMessage | `ui/src/components/ChatAssistantMessage.tsx` | Agent 消息气泡 |

对话虚拟列表使用: `react-virtuoso` + `@virtuoso.dev/message-list`

#### Diff 查看器

| 组件 | 路径 | 说明 |
|------|------|------|
| @git-diff-view/react | 第三方库 | Git diff 分栏/统一视图 |
| @pierre/diffs | 第三方库 | 辅助 diff 渲染 |
| diff-style-overrides.css | `web-core/src/styles/diff-style-overrides.css` | 样式覆盖 (亮/暗主题) |
| edit-diff-overrides.css | `web-core/src/styles/edit-diff-overrides.css` | 编辑态 diff 样式 |

#### 终端输出 (Terminal / LogView)

| 组件 | 路径 | 说明 |
|------|------|------|
| TerminalProvider | `web-core/src/shared/providers/TerminalProvider.tsx` | 终端 WebSocket 管理 |
| xterm 集成 | `@xterm/xterm` + `@xterm/addon-fit` + `@xterm/addon-web-links` | 终端渲染 |
| ANSI 渲染 | `fancy-ansi` | ANSI 转义码高亮 |

#### 顶部导航 / 侧边栏

| 组件 | 路径 | 说明 |
|------|------|------|
| Navbar | `ui/src/components/Navbar.tsx` | 顶部导航栏 |
| AppBar | `ui/src/components/AppBar.tsx` | 应用栏 |
| MobileDrawer | `ui/src/components/MobileDrawer.tsx` | 移动端抽屉组件 (已存在) |

#### 其他重要组件

| 组件 | 路径 |
|------|------|
| Dialog | `ui/src/components/Dialog.tsx` |
| Button | `ui/src/components/Button.tsx` |
| Card | `ui/src/components/Card.tsx` |
| Badge | `ui/src/components/Badge.tsx` |
| FileTreeNode | `ui/src/components/FileTreeNode.tsx` |
| EmojiPicker | `ui/src/components/EmojiPicker.tsx` |
| ColorPicker | `ui/src/components/ColorPicker.tsx` |

---

## 3. 设计 Token 现状

### 3.1 颜色系统

颜色通过 **CSS 自定义属性 (HSL 格式)** 定义，在 Tailwind config 中引用。

**Tailwind 语义色 Token** (定义于 `tailwind.new.config.js`):

```
text-high      → --text-high       文本强调色
text-normal    → --text-normal     正常文本
text-low       → --text-low        弱文本
bg-primary     → --bg-primary      主背景
bg-secondary   → --bg-secondary    次要背景
bg-panel       → --bg-panel        面板背景
brand          → --brand           品牌主色 (橙色, HSL: 25 82% 54%)
brand-hover    → --brand-hover     品牌悬停
brand-secondary→ --brand-secondary 品牌辅助
error          → --error           错误色
success        → --success         成功色
merged         → --merged          合并状态色
text-on-brand  → --text-on-brand   品牌底色上的文字
border         → --border          边框色
```

**CSS 变量定义位置**: `web-core/src/app/styles/new/index.css`

该文件包含完整的亮/暗主题 token:
- `:root` — 亮色主题
- `.dark` — 暗色主题
- 支持 VS Code 嵌入覆盖 (`--vscode-editor-background` 等)
- 代码高亮 token (亮/暗主题各一套)

### 3.2 字体加载

- **Google Fonts 外部加载** — 通过 CSS `@import` 引入
- 主字体: **IBM Plex Sans** (`font-ibm-plex-sans`)
- 等宽字体: **IBM Plex Mono** (`font-ibm-plex-mono`)
- Emoji: **Noto Emoji**
- 辅助: **Roboto** (weight 500, 仅特定位置使用)
- **无 `@font-face` 声明** — 完全依赖 Google Fonts CDN

CSS 中的 `font-family` 定义:

```css
.font-ibm-plex-sans { font-family: IBM Plex Sans, "Noto Emoji", sans-serif; }
.font-ibm-plex-mono { font-family: IBM Plex Mono, monospace; }
```

终端专用: `"IBM Plex Mono", "SF Mono", Monaco, Consolas, monospace`

### 3.3 全局样式入口

| 文件 | 用途 |
|------|------|
| `web-core/src/app/styles/new/index.css` | **主入口** — @tailwind 指令 + 主题变量 + 全局样式 |
| `packages/local-web/tailwind.new.config.js` | Tailwind 配置 (darkMode, 自定义色、字号、动画) |
| `packages/local-web/postcss.config.cjs` | PostCSS 配置 (tailwindcss + autoprefixer) |
| `web-core/src/styles/diff-style-overrides.css` | Diff 查看器样式覆盖 |
| `web-core/src/styles/edit-diff-overrides.css` | 编辑态 Diff 样式 |
| `ui/src/styles/diff-style-overrides.css` | UI 包 Diff 样式 |

---

## 4. 响应式现状

### 4.1 断点使用情况

Tailwind 断点配置:

| 断点 | 像素值 | CSS 中响应式类数量 |
|------|--------|------------------|
| `xs` | 480px | 0 (定义了但未使用) |
| `sm` | 640px | **34 处** (22 个独立类) |
| `md` | 768px | **28 处** (19 个独立类) |
| `lg` | 1024px | **1 处** |
| `xl` | 1280px | **12 处** |
| `2xl` | 1536px | 0 |

**总计仅 75 个响应式类实例** — 响应式覆盖非常稀疏。

### 4.2 JS 端移动检测

- **`useIsMobile()` hook** — 位于 `web-core/src/shared/hooks/useIsMobile.ts`
- 断点: `max-width: 767px` (≤767px = mobile)
- 实现: `useSyncExternalStore` + `window.matchMedia`
- 另有 `isRealMobileDevice()` 函数做 UA 检测 (区分真实移动设备 vs 小窗口)

### 4.3 已有的移动适配

1. **`MobileDrawer`** 组件已存在于 `ui/src/components/`
2. **`MobileTab`** 标签系统: `'workspaces' | 'chat' | 'changes' | 'logs' | 'preview' | 'git'`
3. **`MobileFontScale`** 字体缩放: `'default' | 'small' | 'smaller'`，存于 `localStorage` (`vk-mobile-font-scale`)，通过 `--mobile-font-scale` CSS 变量生效
4. **ProjectKanban** 移动模式: 通过 `useIsMobile()` 切换，移动端显示全屏看板 **或** Issue 面板，不同时显示
5. **PWA 元标签**: `apple-mobile-web-app-capable`, `viewport-fit=cover`, `theme-color`
6. **`@media(max-width:767px)`**: 设置 `overscroll-behavior:none`, 移动字体缩放, 固定背景色

### 4.4 窗口缩小到 430px 时的问题

**会崩的地方:**

1. **`.w-[700px]` 硬编码宽度** — 无响应式前缀保护，在 430px 下溢出 270px，导致水平滚动条
2. **0–640px 断点真空区** — 从 0px 到 `sm:` (640px) 之间没有任何 CSS 响应式类。所有布局变化完全依赖 `isMobile` prop 的 JS 条件渲染
3. **`max-width` 约束冲突** — CSS 中有 `max-width: 400px`, `320px`, `300px`, `280px` 等值，在 430px 屏幕上可能导致内容区域被过度压缩，留出不合理的空白
4. **`react-resizable-panels` 分栏** — 看板 + Issue 详情的分栏布局在极窄屏幕上无法正常工作（移动端靠 JS 切换绕过，但如果切换逻辑不覆盖所有路由则会崩）
5. **xterm 终端** — `@xterm/addon-fit` 在 430px 下仅能容纳约 40-50 列字符，长命令/日志行会严重截断

---

## 5. 改造风险点

### 风险 1: 拖拽系统双库共存 — 移动触摸适配复杂度翻倍

**严重程度: 高**

项目同时使用了 **两套** 拖拽库:
- `@hello-pangea/dnd` — KanbanContainer 中使用 (看板列/卡片拖排)
- `@dnd-kit/core` + `@dnd-kit/sortable` — 其他拖拽场景

两套库的触摸事件处理策略不同。`@hello-pangea/dnd` 对移动端的支持已知较弱（基于 `react-beautiful-dnd` fork，长按触发延迟高，与 iOS 弹性滚动冲突）。改造时需要:
- 统一到一套方案，或分别适配触摸传感器
- 处理 `touchmove` 与卡片内滚动的冲突
- 配置合理的 `activationConstraint`（长按阈值 vs 距离阈值）

### 风险 2: react-resizable-panels 分栏布局无法优雅降级

**严重程度: 高**

`ProjectKanban` 使用 `react-resizable-panels` 做左右分栏（看板 | Issue 面板）。虽然当前移动端有 `useIsMobile()` 做条件渲染绕过，但:
- 分栏逻辑散布在多个路由组件中，**不是所有路由都检查了 isMobile**
- Workspace 详情页 (`hosts.$hostId.workspaces.$workspaceId`) 的分栏可能未适配
- `PanelResizeHandle` 拖动条在触摸屏上目标区域太小（约 4px），不符合 44px 最小触摸目标

### 风险 3: Lexical 富文本编辑器移动端键盘适配

**严重程度: 中**

Lexical 编辑器用于 Issue 评论和 Workspace 聊天输入。移动端虚拟键盘弹出时:
- `viewport-fit: cover` + 键盘弹出会推高 `visualViewport`，但 fixed 定位的输入框可能被键盘遮挡
- Lexical 的 toolbar（加粗/斜体/链接等）在小屏下可能溢出
- `@lexical/table` 表格编辑在触摸屏上几乎无法使用
- iOS Safari 的 `contentEditable` 光标定位问题是已知顽疾

### 风险 4: 字体全量依赖 Google Fonts CDN — 弱网/离线场景脆弱

**严重程度: 中**

四个字体族（IBM Plex Sans、IBM Plex Mono、Noto Emoji、Roboto）全部通过 Google Fonts `@import` 加载。移动端场景:
- 中国大陆用户无法直接访问 `fonts.googleapis.com`
- 弱网环境下字体加载延迟导致 FOIT/FOUT（闪烁/不可见文本）
- Tauri 桌面端有本地缓存兜底，但纯 Web 移动端没有
- 字体文件总量可达 500KB+，占移动首屏加载预算的很大比例

### 风险 5: xterm 终端在移动端体验极差

**严重程度: 中**

`@xterm/xterm` 是为桌面设计的终端模拟器:
- 430px 宽度仅 ≈40-50 列，长路径和命令输出严重截断
- 触摸交互无法精确定位光标
- 虚拟键盘遮挡终端内容
- `@xterm/addon-fit` 动态调整列数依赖容器 resize 事件，移动端键盘弹出/收起会反复触发
- 无法做文本选择和复制（移动端长按与终端事件冲突）
- 建议移动端降级为只读日志流视图 + 简化命令输入

---

## 附录: 已有移动端基础设施汇总

| 设施 | 状态 | 说明 |
|------|------|------|
| `useIsMobile()` hook | ✅ 已实现 | 767px 断点, `useSyncExternalStore` |
| `isRealMobileDevice()` | ✅ 已实现 | UA 检测 |
| `MobileDrawer` 组件 | ✅ 已存在 | `ui/src/components/MobileDrawer.tsx` |
| `MobileTab` 标签系统 | ✅ 已实现 | 6 个 tab: workspaces/chat/changes/logs/preview/git |
| `MobileFontScale` | ✅ 已实现 | 3 级字体缩放, localStorage 持久化 |
| PWA 元标签 | ✅ 已配置 | `apple-mobile-web-app-capable`, safe-area |
| CSS `max-width:767px` 规则 | ✅ 已存在 | overscroll, 字体缩放, 背景色 |
| Kanban 移动布局切换 | ✅ 部分实现 | ProjectKanban 已做，其他路由未覆盖 |
| Tailwind `xs` 断点 | ⚠️ 已定义未使用 | 480px 断点存在但无工具类引用 |
| Container queries | ⚠️ 插件已安装 | `@tailwindcss/container-queries` 已装但使用情况不明 |
| 拖拽触摸适配 | ❌ 未适配 | 两套库均未配置触摸传感器 |
| 终端移动降级 | ❌ 未实现 | xterm 原样渲染 |
| 字体本地化/离线 | ❌ 未实现 | 完全依赖 Google Fonts CDN |
