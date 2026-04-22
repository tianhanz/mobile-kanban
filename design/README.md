# Loom · Design 归档

本目录存放 Loom 设计资产中**只在本 repo 有意义**的部分：交互原型 HTML、logo 选型记录、PR 任务包。

不是 source of truth — 文档型规范（PRD、brand kit、memory architecture）的权威版本在 [tianhanz-kb](https://github.com/tianhanz/tianhanz-kb) 里。本目录的 HTML 文件是那些规范的可视化/交互形态。

## 文件清单

| 文件 | 用途 | 何时打开 |
|------|------|----------|
| `loom-v6.html` | 5 tab 移动端高保真原型，含可点交互 | 实现 PR 时对照 UI |
| `loom-brand-kit.html` | B3 logo 解剖、4 种变体、配色 swatch、Do/Don't 规范 | 改 logo / 配色前 |
| `loom-logo-candidates.html` | Logo 选型过程归档（12 个候选 → B3） | 仅作历史参考 |
| `loom-PR-2.1-prompt.md` | 给 Claude Code 的 PR 2.1 任务包原文 | 复盘 PR 决策 |

## Source of truth（在 tianhanz-kb）

- `docs/topics/loom/prd-v6.md` — 产品完整定义
- `docs/topics/loom/brand-kit.md` — 视觉规范 markdown 版
- `docs/topics/loom/memory-architecture-v1.md` — 跨 agent 共享记忆架构
- `docs/chunks/loom.md` — Loom 项目的 KB chunk（路由入口）

## 维护规则

- 新 PR 的 prompt 写完后，归档一份到本目录命名 `loom-PR-<版本>-prompt.md`
- 原型迭代到新版本时，新文件命名 `loom-v<N>.html`，旧版本保留作历史
- 文档型 markdown 不要在本目录新增 — 全部去 KB
