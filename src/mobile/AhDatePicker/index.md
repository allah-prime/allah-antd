---
title: AhDatePicker
group:
  title: 数据录入
  order: 1
nav:
  title: 移动端
  order: 5
  path: /mobile
demo:
  cols: 2
---

# AhDatePicker 日期时间选择器

基于 antd-mobile DatePicker 和 Picker 封装的日期时间选择器组件，支持日期、时间、日期时间和时分秒选择。

## 何时使用 {#when-to-use}

- 需要选择日期的场景
- 需要选择时间（时分）的场景  
- 需要选择日期时间的场景
- 需要选择时分秒的场景

## 代码演示

### 基础用法

```tsx
import React, { useState } from 'react';
import { AhDatePicker } from '..';

export default () => {
  const [value, setValue] = useState<Date>();

  return (
    <AhDatePicker
      label="选择日期"
      value={value}
      onChange={setValue}
      placeholder="请选择日期"
    />
  );
};
```

### 时间选择（时分）

```tsx
import React, { useState } from 'react';
import { AhDatePicker } from '..';

export default () => {
  const [value, setValue] = useState<Date>();

  return (
    <AhDatePicker
      label="选择时间"
      mode="time"
      value={value}
      onChange={setValue}
      placeholder="请选择时间"
    />
  );
};
```

### 时分秒选择

```tsx
import React, { useState } from 'react';
import { AhDatePicker } from '..';

export default () => {
  const [value, setValue] = useState<Date>();

  return (
    <AhDatePicker
      label="选择时分秒"
      mode="second"
      value={value}
      onChange={setValue}
      placeholder="请选择时分秒"
    />
  );
};
```

### 日期时间选择

```tsx
import React, { useState } from 'react';
import { AhDatePicker } from '..';

export default () => {
  const [value, setValue] = useState<Date>();

  return (
    <AhDatePicker
      label="选择日期时间"
      mode="datetime"
      value={value}
      onChange={setValue}
      placeholder="请选择日期时间"
    />
  );
};
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 时间选择器的模式 | `'date' \| 'time' \| 'datetime' \| 'second'` | `'date'` |
| value | 当前值 | `Date \| string \| number \| undefined` | - |
| onChange | 值变化时的回调 | `(value: Date) => void` | - |
| label | 标签文本 | `string` | - |
| placeholder | 占位符 | `string` | `'请选择'` |
| disabled | 是否禁用 | `boolean` | `false` |
| title | 选择器标题 | `string` | - |

### mode 说明

- `date`: 日期选择，格式为 `YYYY-MM-DD`，使用 antd-mobile DatePicker
- `time`: 时间选择（时分），格式为 `HH:mm`，使用 antd-mobile Picker 实现
- `datetime`: 日期时间选择，格式为 `YYYY-MM-DD HH:mm`，使用 antd-mobile DatePicker
- `second`: 时分秒选择，格式为 `HH:mm:ss`，使用 antd-mobile Picker 实现

#### 注意

- 当 `mode` 为 `'time'` 或 `'second'` 时，组件内部使用 antd-mobile 的 Picker 组件实现，因为 DatePicker 不支持单独的时分秒选择
- 时分秒模式下，会显示对应的滚轮选择器（时分 或 时分秒）
- 时间模式选择的值会自动与当前日期组合成完整的 Date 对象
- 组件基于 antd-mobile，在移动端有更好的体验

## FAQ

**Q: 为什么时分秒选择要单独实现？**  
A: 根据 antd-mobile 官方文档说明，DatePicker 的值类型是 Date 对象，需要从年开始一直往下选择，只有时、分的参数是不能构建一个 Date 对象的。因此时分秒选择使用 Picker 组件自行实现。

**Q: 如何设置默认时间？**  
A: 可以通过 `value` 属性设置默认时间，支持 Date 对象、时间戳或时间字符串。

**Q: 时分秒模式下如何获取完整的时间？**  
A: 在 `onChange` 回调中会返回完整的 Date 对象，时间部分为选择的时分秒，日期部分为当前日期。

**Q: 可以自定义时间格式吗？**  
A: 组件内部会根据 `mode` 自动选择合适的显示格式，如需自定义可以在外部处理 `onChange` 返回的 Date 对象。 
