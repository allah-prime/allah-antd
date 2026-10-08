---
title: Charts 图表
toc: content
group:
  title: 数据展示
  order: 2
---

# Charts 图表

仪表盘里用的统计卡片和数字趋势，包含 `ChartCard`、`Field`、`NumberInfo`、`Trend`。

## ChartCard 统计卡片

用于概览页的指标卡片：标题、合计、可选头像、操作、底部和自定义内容。

```jsx
import React from 'react';
import { ChartCard, Trend } from '@allahjs/antd';

export default () => (
  <ChartCard
    title="月销售额"
    total="¥15,000"
    footer={<Trend flag="up">10%</Trend>}
    contentHeight={46}
  >
    <div>图表区域</div>
  </ChartCard>
);
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `React.ReactNode` | - |
| `total` | 合计，可以是数字、节点或返回节点的函数 | `React.ReactNode \| number \| (() => React.ReactNode \| number)` | - |
| `action` | 标题右侧操作 | `React.ReactNode` | - |
| `avatar` | 左侧头像 | `React.ReactNode` | - |
| `footer` | 底部区域 | `React.ReactNode` | - |
| `contentHeight` | 内容区高度，设置后内容区固定高度 | `number` | - |

其余属性同 antd `Card`。

## Field 字段

一行标签加数值，放在卡片底部或详情里。

```jsx
import React from 'react';
import { Field } from '@allahjs/antd';

export default () => <Field label="转化率" value="12%" />;
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 标签 | `React.ReactNode` | - |
| `value` | 数值 | `React.ReactNode` | - |
| `style` | 样式 | `React.CSSProperties` | - |

## NumberInfo 数字信息

标题、副标题、合计和涨跌。`status` 为 `up` 或 `down` 时显示对应箭头。

```jsx
import React from 'react';
import { NumberInfo } from '@allahjs/antd';

export default () => (
  <NumberInfo title="本周访问" total={1280} suffix="次" status="up" subTotal={12} />
);
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 标题 | `React.ReactNode` | - |
| `subTitle` | 副标题 | `React.ReactNode` | - |
| `total` | 合计 | `React.ReactNode` | - |
| `subTotal` | 次级数字 | `number` | - |
| `status` | 涨跌 | `'up' \| 'down'` | - |
| `suffix` | 合计后缀 | `string` | - |
| `gap` | 合计与标题的间距 | `number` | - |
| `theme` | 主题类名后缀 | `string` | - |

## Trend 趋势

在文字后加上升或下降箭头。`colorful` 为 `false` 时箭头为灰色；`reverseColor` 为 `true` 时涨跌颜色对调。

```jsx
import React from 'react';
import { Trend } from '@allahjs/antd';

export default () => (
  <div>
    <Trend flag="up">12%</Trend>
    <Trend flag="down" reverseColor>
      3%
    </Trend>
  </div>
);
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `flag` | 方向 | `'up' \| 'down'` | - |
| `colorful` | 是否使用涨跌颜色 | `boolean` | `true` |
| `reverseColor` | 是否对调涨跌颜色 | `boolean` | `false` |
| `children` | 文案 | `React.ReactNode` | - |
