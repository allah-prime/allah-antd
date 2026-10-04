---
title: AhTagSelect
group:
  title: 数据录入
  order: 1
nav:
  title: 移动端
  order: 5
  path: /mobile
demo:
  cols: 2
---

# AhTagSelect 标签选择器

移动端标签选择器组件，支持搜索、分页加载、新增标签等功能。基于 `antd-mobile` 和自定义列表组件实现，提供良好的移动端交互体验。

## 功能特性

- **标签选择**: 支持从标签列表中选择单个标签
- **搜索功能**: 支持关键词搜索标签
- **分页加载**: 支持分页加载大量标签数据
- **新增标签**: 支持在搜索无结果时新增标签并自动选中
- **移动端优化**: 专为移动端设计的交互体验
- **表单集成**: 完美集成 antd-mobile 表单规范

## API 参数

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 当前选中的标签值 | `IOptions7<string>` | - |
| onChange | 选择变更回调函数 | `(value?: IOptions7<string>) => void` | - |
| request | 获取标签数据的接口函数 | `(p: any) => Promise<ITablePage<IOptions7<string>>>` | 使用全局配置 |
| addRequest | 新增标签的接口函数 | `(keyword: string, color?: string) => Promise<IOptions7<string>>` | 使用全局配置 |
| getContainer | 指定弹窗挂载的 HTML 节点 | `() => HTMLElement \| null` | `document.body` |

### 数据类型

```typescript
interface IOptions7<T> {
  key: string;
  label: string;
  value: T;
  description?: string;
}

interface ITablePage<T> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
}
```

## 使用示例


<code src="../demos/AhTagSelectDemo.tsx"></code>
