---
toc: content
group:
  title: 数据录入
  order: 1
---
# PgyDatePickerPlus
Pgy日期选择器增强版

## 何时使用
用于在应用中选择时间范围，支持不同时间单位的快速选择，例如“今日”、“本周”、“本月”和“本年”。可用于数据分析、报告和过滤操作等场景。

## 代码演示

### 示例 1: 基本使用

展示一个基础的日期选择器，允许用户选择时间范围。

```tsx
import React, { useState } from 'react';
import PgyDatePickerPlus from './';
import dayjs from 'dayjs';

const App = () => {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);

  const handlePickerChange = (dates: [dayjs.Dayjs, dayjs.Dayjs], type: string) => {
    setRange(dates);
    console.log('选中的日期:', dates, '类型:', type);
  };

  return (
    <PgyDatePickerPlus
      rangePickerValue={range}
      type="day"
      pickerChange={handlePickerChange}
      style={{ width: '300px' }}
    />
  );
};

export default App;
```

### 示例 2: 不同布局展示

展示如何使用不同的布局方式（单选按钮和下拉框）来控制日期选择器的显示。

```tsx
import React, { useState } from 'react';
import PgyDatePickerPlus from './';
import dayjs from 'dayjs';

const App = () => {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);
  const [layout, setLayout] = useState<'radio' | 'selectItem'>('radio');

  const handlePickerChange = (dates: [dayjs.Dayjs, dayjs.Dayjs], type: string) => {
    setRange(dates);
    console.log('选中的日期:', dates, '类型:', type);
  };

  return (
    <div>
      <button onClick={() => setLayout('radio')}>单选布局</button>
      <button onClick={() => setLayout('selectItem')}>下拉框布局</button>
      <PgyDatePickerPlus
        rangePickerValue={range}
        type="weekday"
        pickerChange={handlePickerChange}
        layout={layout}
        style={{ width: '300px' }}
      />
    </div>
  );
};

export default App;
```

### 示例 3: 不开启日期选择器

展示如何在不显示日期选择器的情况下，仅使用选择布局。

```tsx
import React, { useState } from 'react';
import PgyDatePickerPlus from './';
import dayjs from 'dayjs';

const App = () => {
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);

  const handlePickerChange = (dates: [dayjs.Dayjs, dayjs.Dayjs], type: string) => {
    setRange(dates);
    console.log('选中的日期:', dates, '类型:', type);
  };

  return (
    <PgyDatePickerPlus
      rangePickerValue={range}
      type="month"
      pickerChange={handlePickerChange}
      layout="selectItem"
      openDatePicker={false}
      style={{ width: '300px' }}
    />
  );
};

export default App;
```

## FAQ

**Q: 组件支持哪些日期类型？**  
A: 组件支持“hours”（今日）、“day”（本周）、“weekday”（本月）、“month”（本年）。

**Q: 可以自定义样式吗？**  
A: 可以通过`style`属性自定义样式。

**Q: 如何切换布局？**  
A: 可以通过`layout`属性选择“radio”布局或“selectItem”布局。

---
