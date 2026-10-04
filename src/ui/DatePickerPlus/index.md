---
toc: content
group:
  title: 数据录入
  order: 1
---
## DatePickerPlus
# 日期选择器增强版

## 何时使用
`DatePickerPlus` 组件是一个增强的日期选择器，适用于需要快速选择日期范围的场景。它允许用户选择特定的日期范围或预设的时间段，如“今天”、“本周”、“本月”和“本年”。此组件适用于报表分析、数据筛选等功能，提供了良好的用户体验和交互性。

## 代码演示

### 示例 1：基本用法
在这个示例中，我们将展示如何使用 `DatePickerPlus` 组件来选择日期范围，并在选择日期后打印出所选的日期。

```jsx
import React from 'react';
import DatePickerPlus from './';

const BasicUsage = () => {
  const handlePickerChange = (dates) => {
    console.log('选择的日期范围:', dates);
  };

  return (
    <div>
      <h2>基本用法</h2>
      <DatePickerPlus pickerChange={handlePickerChange} />
    </div>
  );
};

export default BasicUsage;
```

### 示例 2：选择类型切换
这个示例展示了如何使用 `DatePickerPlus` 组件的不同选择类型（单选或下拉选择）。

```jsx
import React from 'react';
import DatePickerPlus from './';

const TypeSwitching = () => {
  const handlePickerChange = (dates) => {
    console.log('选择的日期范围:', dates);
  };

  return (
    <div>
      <h2>选择类型切换</h2>
      <DatePickerPlus 
        pickerChange={handlePickerChange} 
        layout="selectItem" 
        type="month" 
      />
    </div>
  );
};

export default TypeSwitching;
```

### 示例 3：自定义样式
在这个示例中，我们将演示如何自定义 `DatePickerPlus` 的样式，并且可以根据选择的日期范围进行不同的处理。

```jsx
import React from 'react';
import DatePickerPlus from './';

const CustomStyleExample = () => {
  const handlePickerChange = (dates) => {
    alert(`您选择的日期范围是：${dates[0].format('YYYY-MM-DD')} 到 ${dates[1].format('YYYY-MM-DD')}`);
  };

  return (
    <div>
      <h2>自定义样式示例</h2>
      <DatePickerPlus 
        pickerChange={handlePickerChange} 
        style={{ width: 300 }} 
        layout="radio" 
      />
    </div>
  );
};

export default CustomStyleExample;
```

## FAQ
**Q1: 如何修改组件的默认样式？**  
A: 可以通过 `style` 属性传入自定义样式，例如：`style={{ width: 300 }}`。

**Q2: 该组件是否支持自定义选择的时间段？**  
A: 是的，您可以使用 `layout` 属性来选择显示方式（`radio` 或 `selectItem`），并通过 `type` 属性设置默认选择的时间段。

**Q3: 如何获取选中的日期范围？**  
A: 通过 `pickerChange` 回调函数，您可以获取到选择的日期范围。该函数的参数为 `[Dayjs, Dayjs]` 类型。
