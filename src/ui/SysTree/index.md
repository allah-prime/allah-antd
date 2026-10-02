---
toc: content
group:
  title: 展示
  order: 0
---
# SysTree
SysTree 组件

## 何时使用
当你需要展示一个树形结构的数据，并且希望用户可以点击选择某个节点时，可以使用这个组件。它适用于需要层级展示的场景，例如组织架构、文件夹结构等。

## 代码演示

### 示例 1: 基本树形结构
展示一个简单的树形结构，用户可以点击节点查看详细信息。

```jsx
import React from 'react';
import SysTree from './';

const treeData = [
  {
    code: '1',
    pcode: '0',
    name: '根节点',
    id: '1',
    children: [
      {
        code: '1-1',
        pcode: '1',
        name: '子节点 1',
        id: '1-1',
      },
      {
        code: '1-2',
        pcode: '1',
        name: '子节点 2',
        id: '1-2',
        children: [
          {
            code: '1-2-1',
            pcode: '1-2',
            name: '子节点 2-1',
            id: '1-2-1',
          },
        ],
      },
    ],
  },
];

const App = () => {
  const handleSelect = (node) => {
    alert(`选择了节点: ${node.name}`);
  };

  return <SysTree treeList={treeData} onSelect={handleSelect} />;
};

export default App;
```

# SysTree
SysTree 组件

## 何时使用
当需要展示复杂的树形数据结构，并允许用户选择具体的节点以进行操作时，可以使用该组件。适用于动态数据加载和展示场景。

## 代码演示

### 示例 2: 动态加载树节点
在树节点点击时动态加载子节点数据。

```jsx
import React, { useState } from 'react';
import SysTree from './';

const initialTreeData = [
  {
    code: 'root',
    pcode: '0',
    name: '根节点',
    id: 'root',
  },
];

const App = () => {
  const [treeData, setTreeData] = useState(initialTreeData);

  const handleSelect = (node) => {
    if (node.children) return;

    // 模拟动态加载子节点
    const newChildren = [
      {
        code: `${node.id}-1`,
        pcode: node.id,
        name: '动态加载的节点 1',
        id: `${node.id}-1`,
      },
      {
        code: `${node.id}-2`,
        pcode: node.id,
        name: '动态加载的节点 2',
        id: `${node.id}-2`,
      },
    ];

    setTreeData((prevData) => 
      prevData.map((item) => 
        item.id === node.id ? { ...item, children: newChildren } : item
      )
    );
  };

  return <SysTree treeList={treeData} onSelect={handleSelect} />;
};

export default App;
```


# SysTree
SysTree 组件

## 何时使用
适用于需要展示多层级的数据结构，用户可以展开或折叠树节点查看详细数据的场景。支持用户选择节点进行操作。

## 代码演示

### 示例 3: 展开和折叠功能
展示如何控制树节点的展开和折叠状态。

```jsx
import React, { useState } from 'react';
import SysTree from './';

const treeData = [
  {
    code: '1',
    pcode: '0',
    name: '根节点',
    id: '1',
    children: [
      {
        code: '1-1',
        pcode: '1',
        name: '子节点 1',
        id: '1-1',
      },
      {
        code: '1-2',
        pcode: '1',
        name: '子节点 2',
        id: '1-2',
        children: [
          {
            code: '1-2-1',
            pcode: '1-2',
            name: '子节点 2-1',
            id: '1-2-1',
          },
        ],
      },
    ],
  },
];

const App = () => {
  const [expandedKeys, setExpandedKeys] = useState([]);

  const handleExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  return (
    <SysTree
      treeList={treeData}
      onSelect={(node) => alert(`选择了节点: ${node.name}`)}
    />
  );
};

export default App;
```

## FAQ
**Q: 如何在树节点被点击时获取节点的详细信息？**

A: 可以通过 `onSelect` 回调函数获取到被选中的节点信息。回调函数的参数是被点击的节点对象，里面包含了节点的所有属性信息。
**Q: 如何处理节点的动态加载？**

A: 你可以在 `onSelect` 回调中实现动态加载的逻辑，比如从服务器获取数据，并更新组件的状态来重新渲染树节点。
**Q: 如何控制树节点的展开和折叠？**

A: 在 Ant Design 的 `Tree` 组件中，展开和折叠节点的状态可以通过 `expandedKeys` 属性来控制。通过更新 `expandedKeys` 状态，你可以控制哪些节点是展开的，哪些是折叠的。
