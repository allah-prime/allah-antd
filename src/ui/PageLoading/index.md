---
title: PageLoading 页面加载
toc: content
group:
  title: 布局
  order: 4
---

# PageLoading 页面加载

## 何时使用
`PageLoading` 组件用于在页面或数据加载过程中提供用户反馈，告知他们当前有操作正在进行。它非常适合用于动态加载页面或异步数据时，提升用户体验。

## 代码演示

### 示例 1: 基本使用
这是一个最基本的使用方式，当页面正在加载时，显示一个大号的旋转加载动画。

```jsx
import React from 'react';
import PageLoading from './';

const Example1 = () => {
  return (
    <div>
      <h2>页面正在加载，请稍候...</h2>
      <PageLoading />
    </div>
  );
};

export default Example1;
```

### 示例 2: 自定义样式
你可以自定义 `PageLoading` 组件的样式，以适应不同的布局需求。

```jsx
import React from 'react';
import PageLoading from './';

const Example2 = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <PageLoading />
    </div>
  );
};

export default Example2;
```

### 示例 3: 与异步数据加载结合
结合 `PageLoading` 组件与数据异步加载，你可以在数据还未加载完成时显示加载动画。

```jsx
import React, { useEffect, useState } from 'react';
import PageLoading from './';

const Example3 = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({ message: '数据加载完成' });
      setLoading(false);
    }, 2000); // 模拟2秒的加载时间
  }, []);

  return (
    <div>
      {loading ? (
        <PageLoading />
      ) : (
        <div>
          <h2>{data.message}</h2>
        </div>
      )}
    </div>
  );
};

export default Example3;
```

## FAQ

**Q: `PageLoading` 组件是否可以更改加载动画的大小？**  
A: 目前组件内部的 `Spin` 元素使用了固定大小的 `large`，如果需要更改大小，可以在 `PageLoading` 组件中修改 `Spin` 的 `size` 属性。

**Q: `PageLoading` 组件是否支持自定义加载提示文本？**  
A: 目前 `PageLoading` 组件只显示一个加载动画，没有提供显示自定义文本的功能。如果需要显示文本，可以修改 `PageLoading` 组件来实现这个功能。
