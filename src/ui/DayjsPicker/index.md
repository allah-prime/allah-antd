---
title: DayjsPicker 日期时间
toc: content
group:
  title: 数据录入
  order: 3
---

# DayjsPicker 日期时间

把 antd 的 `DatePicker`、`TimePicker`、`Calendar` 再导出，给使用 dayjs 的项目一个统一入口。组件行为与 antd 相同。

## 何时使用

项目日期库是 dayjs，又不想在业务里分别从 antd 引入日期组件时使用。需要预设范围（今天、本周、本月）时用 [DatePickerPlus 日期选择](/ui/date-picker-plus)。

## 代码演示

```jsx
import React from 'react';
import { Space } from 'antd';
import { DatePicker, TimePicker, Calendar } from '@allahjs/antd';

export default () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <DatePicker />
    <TimePicker />
    <Calendar fullscreen={false} />
  </Space>
);
```

## 导出

| 导出名 | 说明 |
| --- | --- |
| `DatePicker` | antd DatePicker |
| `TimePicker` | antd TimePicker |
| `Calendar` | antd Calendar |

属性与 antd 对应组件一致。
