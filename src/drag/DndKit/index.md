---
nav:
  title: 拖拽 组件
  order: 3
group:
  title: 工具
  order: 0
order: 3
---

# DroppableContainer

可拖拽容器

## 何时使用

`DroppableContainer` 组件用于创建一个可以接受拖拽项目的容器。它能够处理拖拽过程中的样式变更并适应不同的拖拽动画。

## 代码演示

<code src="./demo/basic.tsx" title="基础用法" desc=""></code>

# DroppableContainer

可拖拽容器

## 何时使用

`DroppableContainer` 组件用于创建一个可以接受拖拽项目的容器。它能够处理拖拽过程中的样式变更并适应不同的拖拽动画。

# SortableItem

可排序项目

## 何时使用

`SortableItem` 组件用于表示可拖拽并支持排序的项目。它在拖拽时能够显示不同的样式，并且支持自定义渲染。

# useDndKit

拖拽和排序管理

## 何时使用

`useDndKit` 是一个自定义 Hook，用于管理拖拽和排序的逻辑。它适用于需要复杂拖拽逻辑的应用，例如支持多个拖拽容器的场景。


## FAQ
**问:** `useDndKit` 的 `coordinateGetter` 属性有什么作用？
**答:** `coordinateGetter` 用于配置键盘拖拽时的坐标计算方式，可以自定义键盘拖拽的行为。

**问:** 如何使用 `renderItem` 属性？
**答:** `renderItem` 属性允许你提供自定义的渲染函数，以完全控制项目的显示方式。

**问:** `DroppableContainer` 的 `style` 属性如何生效？
**答:** `style` 属性允许你覆盖默认样式，例如更改容器的宽度、高度或背景颜色。
