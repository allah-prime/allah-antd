---
title: PollingProgressIcon 轮询进度
toc: content
group:
  title: 工具
  order: 5
---

# PollingProgressIcon 轮询进度

## 何时使用
`PollingProgressIcon` 组件用于展示一个进度图标，并根据任务的状态显示不同的图标（开始、进行中、成功）。它适用于需要展示任务进度或状态的场景，并且可以通过工具提示提供更多信息。

## 代码演示

### 示例 1: 任务未开始

在这个示例中，任务还没有开始，因此图标显示为开始图标。用户可以点击图标来启动任务。

```jsx
import React, { useState } from 'react';
import PollingProgressIcon from './';

const TaskComponent = () => {
  const [taskStatus, setTaskStatus] = useState(0); // 0 表示未开始
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(10);

  const startTask = () => {
    setTaskStatus(2); // 2 表示任务进行中
    // 模拟任务进行
    setTimeout(() => {
      setTaskStatus(3); // 3 表示任务完成
    }, 2000);
  };

  return (
    <PollingProgressIcon
      data={{ status: taskStatus, statusText: '正在处理', current, count: total }}
      start={startTask}
      tips="点击开始任务"
    />
  );
};

export default TaskComponent;
```

### 示例 2: 任务进行中

在这个示例中，任务正在进行中，因此显示为进行中的图标，并且工具提示展示当前进度。

```jsx
import React from 'react';
import PollingProgressIcon from './';

const TaskComponent = () => {
  const taskData = {
    status: 2, // 2 表示任务进行中
    statusText: '处理中',
    current: 5,
    count: 10
  };

  return (
    <PollingProgressIcon
      data={taskData}
      start={() => {}}
      tips="任务正在处理中"
    />
  );
};

export default TaskComponent;
```

### 示例 3: 任务已完成

在这个示例中，任务已经完成，因此图标显示为成功图标。

```jsx
import React from 'react';
import PollingProgressIcon from './';

const TaskComponent = () => {
  const taskData = {
    status: 3, // 3 表示任务完成
    statusText: '任务完成',
    current: 10,
    count: 10
  };

  return (
    <PollingProgressIcon
      data={taskData}
      start={() => {}}
      tips="任务已完成"
    />
  );
};

export default TaskComponent;
```

## FAQ

**Q1: 组件中的图标颜色可以自定义吗？**

A1: 当前图标颜色是固定的，如果需要自定义颜色，可以通过修改 `iconStyle` 或直接传入样式属性来实现。

**Q2: 如何处理任务启动失败的情况？**

A2: 组件本身不处理任务启动的失败情况，你可以在 `start` 函数中添加错误处理逻辑，以便适当更新状态或提示用户。

**Q3: 组件如何响应任务状态的变化？**

A3: 组件会根据传入的 `data` 属性实时更新图标和工具提示。如果任务状态发生变化，需要确保状态数据通过 props 传递给组件以便更新显示。

---

