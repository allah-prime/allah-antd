---
title: GridCards 九宫格拖拽组件
group:
  title: 拖拽组件
  order: 2
---

# GridCards 九宫格拖拽组件

GridCards 是一个可拖拽排序的九宫格布局组件，支持自定义列数、间距和样式。

## 基础用法

<code src="./demos/basic.tsx"></code>

## 自定义列数

<code src="./demos/columns.tsx"></code>

## 自定义卡片高度

<code src="./demos/height.tsx"></code>

## API

### GridCards

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选项数据 | `IOptions7<string>[]` | `[]` |
| onChange | 数据变化时的回调函数 | `(newValue: IOptions7<string>[], item: IOptions7<string>, index: number, type: string) => void` | - |
| onDelete | 删除选项时的回调函数 | `(item: IOptions7<string>, index: number) => void` | - |
| title | 标题 | `string` | `'九宫格配置'` |
| titleRender | 自定义标题渲染 | `ReactNode` | - |
| tips | 提示信息 | `ReactNode` | - |
| extraRender | 自定义额外操作按钮 | `(item: IOptions7<string>) => ReactNode` | - |
| columns | 列数 | `number` | `3` |
| gap | 格子间距 | `number` | `8` |
| cardHeight | 卡片高度 | `number \| string` | - |
| keepSquare | 是否保持卡片为正方形 | `boolean` | `true` |
| renderItem | 自定义渲染函数 | `(handleProps, listeners, item, isDragging, index) => ReactNode` | - | 