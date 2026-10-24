---
title: UserMonitor 用户监听
toc: content
group:
  title: 工具
  order: 5
---

# UserMonitor 用户监听

监听页面上的点击、按键、鼠标移动和滚轮。用户停止操作超过设定时间后执行回调，用来做空闲超时，例如自动登出。

## 何时使用

需要根据用户是否还在操作页面来触发一次逻辑时使用。它没有界面。

## 代码演示

```jsx
import { useEffect } from 'react';
import { UserMonitor } from '@allahjs/antd';

export default () => {
  useEffect(() => {
    const monitor = new UserMonitor(
      () => {
        console.log('用户已空闲');
      },
      10 * 60 * 1000,
      true,
    );
    return () => monitor.remove();
  }, []);

  return null;
};
```

## API

`new UserMonitor(func, clientTime, conditionFunc)`

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `func` | 空闲后执行的回调 | `() => void` | - |
| `clientTime` | 空闲多久后触发，单位毫秒 | `number` | `600000` |
| `conditionFunc` | 为 `true` 时才执行回调 | `boolean` | `false` |

| 方法 | 说明 |
| --- | --- |
| `saveClient()` | 重置空闲计时 |
| `remove()` | 清除计时器并卸下事件监听 |
