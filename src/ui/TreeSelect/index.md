---
title: TreeSelect 树选择
toc: content
group:
  title: 数据录入
  order: 3
---

# TreeSelect 树选择

## 组件简介

TreeSelect 是一款支持异步加载、懒加载、搜索和多选功能的树选择组件。  
它可以动态加载树节点数据，并支持标签形式展示选中项，适用于复杂的树形结构数据选择场景。

## 使用场景

- 需要选择树形结构数据时。
- 需要支持异步加载和懒加载功能时。
- 需要通过关键字搜索树节点时。
- 需要限制最大选择数量时。

## 代码示例

### 高级用法（演示用数据 + 异步加载子节点）

```tsx
import React, { useState } from 'react';
import {TreeSelect , TreeNode } from '..';

// 顶层节点（模拟后端返回）
const topLevelData: TreeNode[] = [
  { label: '餐饮', value: 'catering', isLeaf: true },

  { label: '零售', value: 'retail', isLeaf: false },

  { label: '教育', value: 'education', isLeaf: true },

  { label: '科技', value: 'tech', isLeaf: true }
];

// 子节点（根据 parentId 返回）
const childrenMap: Record<string, TreeNode[]> = {
  retail: [
    { label: '超市', value: 'supermarket', isLeaf: true },
    { label: '便利店', value: 'convenience', isLeaf: true },
    {
      label: '百货',
      value: 'department',
      isLeaf: false
    }
  ],
  department: [
    { label: '女装', value: 'women', isLeaf: true },
    { label: '男装', value: 'men', isLeaf: true },
    { label: '儿童', value: 'kids', isLeaf: true }
  ]
};

/** request(): parentId 不传 → 加载顶层；传 → 加载对应的 children */
const mockRequest = async (parentId?: string): Promise<TreeNode[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (!parentId) {
        // 顶层
        resolve(topLevelData);
      } else {
        // 子级
        resolve(childrenMap[parentId] || []);
      }
    }, 400);
  });
};

/** defValReq(): 模拟后端返回带 text/treeIds 的默认值 */
const mockDefValReq = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          value: 'women',
          other: {
            treeIds: ['women'],
            text: '零售;百货;女装',
            color: '#1E40AF'
          }
        }
      ]);
    }, 300);
  });
};

const AhDemo = () => {
  const [value, setValue] = useState<string[]>([]);
  const [display, setDisplay] = useState<any[]>([]);

  return (
    <div style={{ padding: 20 }}>
      <h3>TreeSelect 组件 Demo（最新版可用）</h3>

      <TreeSelect
        value={value}
        request={mockRequest}
        defValReq={mockDefValReq}
        onChange={(vals, displayItems) => {
          setValue(vals);
          setDisplay(displayItems);
        }}
        maxSelect={20}
      />

      <div style={{ marginTop: 20 }}>
        <h4>当前选中的 value：</h4>
        <pre>{JSON.stringify(value, null, 2)}</pre>

        <h4>展示 selectedDisplay：</h4>
        <pre>{JSON.stringify(display, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AhDemo;

```

## API

| 参数       | 说明                     | 类型                                     | 默认值 |
|------------|--------------------------|------------------------------------------|--------|
| `value`    | 当前选中的值数组         | `string[]`                               | `[]`   |
| `onChange` | 选中值变化时的回调函数   | `(value: string[], tagItems: TreeNode[]) => void` | -      |
| `request`  | 异步加载树节点数据的函数 | `(keyword?: string) => Promise<TreeNode[]>` | -      |
| `defValReq`| 根据值数组获取默认节点   | `(values: string[]) => Promise<TreeNode[]>` | -      |
| `maxSelect`| 最大可选数量             | `number`                                 | -      |

## 数据结构

### TreeNode

```ts
interface TreeNode {
  label: string; // 节点显示的标签
  value: string; // 节点的唯一值
  children?: TreeNode[]; // 子节点
  disabled?: boolean; // 是否禁用
  isLeaf?: boolean; // 是否为叶子节点
}
```

## 注意事项

- `request` 函数必须返回 `TreeNode[]` 类型的数据。
- 如果未传递 `defValReq`，默认值加载功能将不可用。
- `maxSelect` 用于限制最大选择数量，超出限制时不会触发 `onChange`。

## FAQ

**Q: 如何实现懒加载子节点？**
A: 在 `request` 函数中，根据父节点的 `value` 加载其子节点数据。

**Q: 如何限制最大选择数量？**
A: 通过 `maxSelect` 参数设置最大选择数量，超出限制时不会更新选中值。

**Q: 是否支持搜索功能？**
A: 支持，通过 `request` 函数根据关键字动态加载匹配的节点数据。
