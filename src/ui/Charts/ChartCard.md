---
toc: content
group:
  title: 展示
  order: 0
---
# ChartCard
排行卡片

## 何时使用

用于简单展示数据变化的卡片，适合在仪表盘或数据概览页面中使用。

## 代码演示

### 示例 1: 基本展示

```tsx
import React from 'react';
import { ChartCard } from './';

const data = {
  title: '月销售额',
  value: '$15,000',
  trend: 'up',
  percentage: '10%',
  chartData: [100, 200, 300, 400, 500],
};

const Example1 = () => (
  <ChartCard
    title={data.title}
    value={data.value}
    trend={data.trend}
    percentage={data.percentage}
    chartData={data.chartData}
  />
);

export default Example1;
```

### 示例 2: 多种状态展示

```tsx
import React from 'react';
import { ChartCard } from './';

const data = [
  {
    title: '日访问量',
    value: '1,200',
    trend: 'up',
    percentage: '5%',
    chartData: [50, 100, 150, 200, 250],
  },
  {
    title: '活跃用户',
    value: '8,000',
    trend: 'down',
    percentage: '3%',
    chartData: [300, 250, 200, 150, 100],
  },
];

const Example2 = () => (
  <div>
    {data.map((item, index) => (
      <ChartCard
        key={index}
        title={item.title}
        value={item.value}
        trend={item.trend}
        percentage={item.percentage}
        chartData={item.chartData}
      />
    ))}
  </div>
);

export default Example2;
```

### 示例 3: 自定义数据展示

```tsx
import React from 'react';
import { ChartCard } from './ChartCard';

const customData = {
  title: '用户增长',
  value: '5,000',
  trend: 'up',
  percentage: '8%',
  chartData: [150, 200, 250, 300, 350],
};

const Example3 = () => (
  <ChartCard
    title={customData.title}
    value={customData.value}
    trend={customData.trend}
    percentage={customData.percentage}
    chartData={customData.chartData}
    style={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
  />
);

export default Example3;
```

## FAQ

### 如何调整图表的颜色？

您可以通过传递自定义 `style` 属性来改变图表的颜色。例如，在 `Example3` 中，我们使用了 `style={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}` 来修改背景色和圆角。

### 如何更新卡片数据？

可以通过改变传入 `ChartCard` 组件的 `title`、`value`、`trend`、`percentage` 和 `chartData` 属性来更新卡片的数据。
