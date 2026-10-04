---
title: AhView
group:
  title: 视图
  order: 1
nav:
  title: 移动端
  order: 5
  path: /mobile
demo:
  cols: 2
---

# AhView 视图组件

在移动端，AhView 组件提供了基础的视图组件，用于展示和交互。从而避免onClick事件的触发。

## 代码演示

### 基础用法

```tsx
import React, { useState } from 'react';
import AhView from './index';

export default () => {
  const [value, setValue] = useState<Date>();

  const itemClick = (item: string) => {
    console.log(item);
  };

  return (
    <div style={{ padding: 16, height: 100, overflow: 'auto' }}>
      <AhView style={{ height: 150, backgroundColor: '#f5f5f5' }} onClick={() => itemClick('这是一个视图组件1')}>
        这是一个视图组件
      </AhView>
      <AhView style={{ height: 150, backgroundColor: '#f5f5f5' }} onClick={() => itemClick('这是一个视图组件2')}>
        这是一个视图组件
      </AhView>
      <AhView style={{ height: 150, backgroundColor: '#f5f5f5' }} onClick={() => itemClick('这是一个视图组件3')}>
        这是一个视图组件
      </AhView>
      <AhView style={{ height: 150, backgroundColor: '#f5f5f5' }} onClick={() => itemClick('这是一个视图组件4')}>  
        这是一个视图组件
      </AhView>
    </div>
  );
};
```