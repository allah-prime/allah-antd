---
nav: 研发
group:
  title: 介绍
  order: 0
order: 0
---

# 介绍

`allah-antd` 是一个基于 Ant Design 的企业级 UI 组件库，旨在提供更高效、更易用的组件和工具，帮助开发者快速构建企业级应用。

## 特性

- **丰富的组件**：提供了大量的企业级 UI 组件，包括表格、表单、模态框等
- **编辑器组件**：集成了多种编辑器组件，包括 Markdown 编辑器、代码编辑器等
- **拖拽组件**：提供了丰富的拖拽交互组件，支持列表拖拽、卡片拖拽等
- **TypeScript 支持**：完全使用 TypeScript 编写，提供完整的类型定义
- **高度可定制**：组件支持高度定制，满足不同业务场景的需求
- **企业级设计**：遵循企业级应用的设计规范，提供一致的用户体验

## 安装

```bash
# 使用 pnpm
pnpm add @allahjs/antd
```

## 使用

```tsx | pure
import { AhProTable } from '@allahjs/antd';
import { AhNotion } from '@allahjs/antd';
import { ListCards } from '@allahjs/antd';

// 使用组件
function App() {
  return (
    <div>
      <AhProTable {...props} />
      <AhNotion {...props} />
      <ListCards {...props} />
    </div>
  );
}
```

## 子包说明

allah-antd 包含以下子包：

- **@allahjs/antd**：基础 UI 组件，包括表格、表单、模态框等
- **@allahjs/antd**：编辑器组件，包括 Markdown 编辑器、代码编辑器等
- **@allahjs/antd**：拖拽组件，包括列表拖拽、卡片拖拽等

## 浏览器兼容性

- 现代浏览器和 IE11
