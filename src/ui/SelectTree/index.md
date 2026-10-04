---
toc: content
group:
  title: 展示
  order: 0
---
# SelectTree
选择树

## 何时使用
当需要在树状结构中选择某个节点，并且节点数据需要异步加载时使用。

## 代码演示

### 示例 1: 基础树选择

展示一个基础的异步加载树选择示例，加载数据并进行节点选择。

```jsx
import React from 'react';
import SelectTree from './';

const fetchTreeData = async (parentId) => {
  // 模拟异步获取数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { code: '1', pcode: '0', name: '节点1', ac: '001', nodeType: '1' },
        { code: '2', pcode: '1', name: '节点2', ac: '002', nodeType: '0' }
      ]);
    }, 1000);
  });
};

const App = () => {
  const handleCurrentMapData = (value) => {
    console.log('选中的节点值:', value);
  };

  return (
    <SelectTree
      currentMapData={handleCurrentMapData}
      asyncTreeData={fetchTreeData}
      treePcode="0"
      defLabel="选择节点"
    />
  );
};

export default App;
```

### 示例 2: 动态加载数据

展示如何动态加载树数据，根据不同的根节点加载不同的数据。

```jsx
import React, { useState } from 'react';
import SelectTree from './';

const fetchTreeData = async (parentId) => {
  // 模拟异步获取数据
  return new Promise(resolve => {
    setTimeout(() => {
      if (parentId === '0') {
        resolve([
          { code: '1', pcode: '0', name: '根节点1', ac: '001', nodeType: '1' },
          { code: '2', pcode: '0', name: '根节点2', ac: '002', nodeType: '1' }
        ]);
      } else {
        resolve([
          { code: '3', pcode: parentId, name: '子节点1', ac: '003', nodeType: '0' }
        ]);
      }
    }, 1000);
  });
};

const App = () => {
  const [rootNode, setRootNode] = useState('0');

  const handleCurrentMapData = (value) => {
    console.log('选中的节点值:', value);
  };

  return (
    <div>
      <SelectTree
        currentMapData={handleCurrentMapData}
        asyncTreeData={fetchTreeData}
        treePcode={rootNode}
        defLabel="选择节点"
      />
      <button onClick={() => setRootNode('1')}>切换到根节点1</button>
      <button onClick={() => setRootNode('2')}>切换到根节点2</button>
    </div>
  );
};

export default App;
```

### 示例 3: 显示加载状态

展示如何在数据加载过程中显示不同的状态。

```jsx
import React from 'react';
import SelectTree from './';

const fetchTreeData = async (parentId) => {
  // 模拟异步获取数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { code: '1', pcode: '0', name: '根节点1', ac: '001', nodeType: '1' },
        { code: '2', pcode: '0', name: '根节点2', ac: '002', nodeType: '1' }
      ]);
    }, 2000); // 增加延迟以模拟加载状态
  });
};

const App = () => {
  const handleCurrentMapData = (value) => {
    console.log('选中的节点值:', value);
  };

  return (
    <SelectTree
      currentMapData={handleCurrentMapData}
      asyncTreeData={fetchTreeData}
      treePcode="0"
      defLabel="选择节点"
    />
  );
};

export default App;
```

## FAQ

**Q: 组件如何处理异步数据加载？**

A: 组件通过`asyncTreeData`属性传入的异步函数来加载数据。数据加载完成后，`treeData`状态会更新，从而刷新树选择组件的内容。

**Q: 如何处理树的根节点变化？**

A: 可以通过更新`treePcode`属性来切换根节点，从而动态加载不同的树数据。

**Q: 如何显示加载状态？**

A: 在树数据未加载完成之前，组件会显示"加载中..."，数据加载完成后会展示树选择组件。

---
