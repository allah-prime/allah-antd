# Changelog

本文件记录 `@allahjs/antd` 各版本的变更。

## 未发布（拟作为首个正式版本）

自初始导入以来的清理与重构，均由 @allahbin 提交。

### 移除

- 移除废弃/冗余组件：`AhMarkdown`、`ActionTimeline`、`Authorized`、`PgyDatePickerPlus`、`SelectTree`、`StandardFormRow`、`SysTree`、`waterMark`（ebf187e）
- 移除 `LongTag`、`TagSelect3`、`PageDev` 组件（fee4761）
- 移除全局样式体系 `src/ui/styles/`（base.less、tinyColor.less、colors 等，约 4700 行），改用内联样式与组件级样式（fee4761）
- 清理 `src/drag` 中的冗余类型定义（ahAntdTypes.ts 等）与无效依赖，`pnpm-lock.yaml` 精简约 1200 行（ebf187e）

### 变更

- 组件更名：`AhFormModal` → `AhEditModal`，并同步更新演示与文档（ebf187e）
- 全局工具类替换为内联样式，`AhModal`、`AhPage`、移动端组件（AhFlatList、AhSelectorItem、AhTagSelect）等同步调整（fee4761）
- dumi 文档站配置调整，新增 atom-route-prefix 插件；文档目录结构整理（hooks.md、ChartCard.md 等合并为各组件 index.md）（ebf187e、fee4761）

## 0.0.1（2026-10-04）

- 初始导入 `@allahjs/antd` 代码库（f222cde，tag `v0.0.1` 指向该提交，422 个文件）。
