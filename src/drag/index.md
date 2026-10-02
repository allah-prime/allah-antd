---
nav:
  title: 拖拽组件
  order: 3
group:
  title: 介绍
  order: 0
order: 3
---

# 拖拽组件概述

`@allahjs/antd` 是 allah-antd 的拖拽组件包，提供了多种拖拽交互组件，满足不同的拖拽需求。

## 组件列表

### 拖拽组件

- [ListCards](/drags/list-cards) - 卡片列表拖拽组件，支持卡片拖拽排序
- [ListOptions](/drags/list-options) - 选项列表拖拽组件，支持选项拖拽排序
- [DndKit](/drags/dnd-kit) - DndKit 封装组件，基于 @dnd-kit/core，提供更多拖拽功能

## 安装

```bash
# 使用 pnpm
$ pnpm add @allahjs/antd
```

## 使用

```jsx | pure
import { ListCards, ListOptions, DndKit } from './src';

// 使用卡片列表拖拽组件
function CardList() {
  const [items, setItems] = useState([
    { id: 1, title: '卡片1' },
    { id: 2, title: '卡片2' },
    { id: 3, title: '卡片3' },
  ]);

  return (
    <ListCards
      items={items}
      renderItem={(item) => (
        <div>{item.title}</div>
      )}
      onChange={setItems}
    />
  );
}

// 使用选项列表拖拽组件
function OptionList() {
  const [options, setOptions] = useState([
    { id: 1, label: '选项1' },
    { id: 2, label: '选项2' },
    { id: 3, label: '选项3' },
  ]);

  return (
    <ListOptions
      options={options}
      renderOption={(option) => (
        <div>{option.label}</div>
      )}
      onChange={setOptions}
    />
  );
}

// 使用 DndKit 组件
function DndKitExample() {
  const [items, setItems] = useState([
    { id: 1, content: '项目1' },
    { id: 2, content: '项目2' },
    { id: 3, content: '项目3' },
  ]);

  return (
    <DndKit
      items={items}
      renderItem={(item) => (
        <div>{item.content}</div>
      )}
      onChange={setItems}
    />
  );
}
```

## 特性

### ListCards

ListCards 是一个卡片列表拖拽组件，具有以下特性：

- 支持卡片拖拽排序
- 支持自定义卡片渲染
- 支持拖拽过程中的动画效果
- 支持拖拽结束后的回调
- 支持禁用拖拽
- 支持自定义拖拽句柄
- 支持横向和纵向排列

### ListOptions

ListOptions 是一个选项列表拖拽组件，具有以下特性：

- 支持选项拖拽排序
- 支持自定义选项渲染
- 支持拖拽过程中的动画效果
- 支持拖拽结束后的回调
- 支持禁用拖拽
- 支持自定义拖拽句柄
- 支持多列布局

### DndKit

DndKit 是一个基于 @dnd-kit/core 的封装组件，具有以下特性：

- 提供更底层的拖拽功能
- 支持自定义拖拽逻辑
- 支持多种拖拽策略
- 支持拖拽传感器配置
- 支持拖拽修饰器
- 支持拖拽约束
- 支持拖拽排序
- 支持多个拖拽上下文

## 配置

各拖拽组件支持丰富的配置项，详情请参考各组件的文档：

- [ListCards 配置](/drags/list-cards#api)
- [ListOptions 配置](/drags/list-options#api)
- [DndKit 配置](/drags/dnd-kit#api) 
