# AGENTS.md — allah-antd

> `@allahjs/antd` —— 基于 antd v6 封装的 React 业务组件库（组件源码在 `src/ui`、`src/edit`）。

## 设计风格约束（必读）

本项目的 UI 实现必须遵循 Ant Design v6 的设计语言，规范全文见根目录 `design.md`（源自 https://ant.design/design.md）。写组件、样式、布局前先对照它，核心红线：

- **间距**：一律贴合 4px 栅格（4 / 8 / 16 / 24 / 32），禁止魔法数字（如 `padding: 11px`、`gap: 13px`）；对齐 antd 组件自身的历史值除外
- **字体**：只用 400（正文/控件）和 600（标题/表头）两种字重；基础字号 14px；不用斜体、不用 700+
- **颜色**：不要硬编码 `#FFF`、`#FAFAFA` 等颜色值，优先 antd token / CSS 变量（组件库内可用 `cssTokenSync` 生成的 `--ant-*` 变量）；三层表面模型（bg-layout / bg-container / bg-elevated）按角色取色
- **按钮层级**：同一决策区域只有一个 `primary` 按钮，其余降级为 `default`
- **预设彩色**（blue ~ lime）：只用于 Tag、图表和分类可视化，不做主 UI 颜色
- **动效**：时长/缓动用 antd token（`motionDuration*` / `motionEase*`），不自造 cubic-bezier
- **圆角**：控件 6px、卡片/弹层表面 8px、Tag/小件 4px，相邻元素不混用圆角
- **排布组件**：按钮组、图标组等用 antd 布局组件（`Space` / `Flex` / `Row`/`Col`），不裸排 DOM

## E2E 测试

E2E 回归用 Playwright（测试位于 `e2e/`，运行 `pnpm e2e`）：

- 目标页面用 dumi 的 `~demos/:id` 独立路由（只渲染 demo 本身，无文档站导航干扰），demo-id 规则：`{组件目录名}-{demo文件名}` 全小写，如 `ahformdetail-demo-editabledemo`
- dev server（9527）由 Playwright webServer 自动拉起或复用已在运行的实例
- 新组件的回归用例按 `e2e/<组件>.spec.ts` 扩展，选择器优先复用组件稳定的业务类名（如 `.ah-form-detail-cell`）

## Skills 约定

项目级 skill 真源在仓库内，修改后必须同步到用户主目录下的同名 skill（供其他项目全局使用）：

- 修改 `.agents/skills/ah-page-content/SKILL.md` 后，必须把它复制到用户主目录的 `~/.agents/skills/ah-page-content/SKILL.md`（即用户级 skill 目录，路径中的 `~` 为当前用户主目录）。

```bash
# 每次改动 .agents/skills/ah-page-content/SKILL.md 后执行（~ 为用户主目录）
mkdir -p ~/.agents/skills/ah-page-content
cp .agents/skills/ah-page-content/SKILL.md ~/.agents/skills/ah-page-content/SKILL.md
```

正反例：

```text
❌ 只改了仓库内的 .agents/skills/ah-page-content/SKILL.md 就结束任务
✅ 改完后复制同一份文件到 ~/.agents/skills/ah-page-content/SKILL.md 再结束
```

> 注意：反向（用户级 → 项目级）不适用，项目级文件是唯一真源，不要从用户级反向覆盖。
