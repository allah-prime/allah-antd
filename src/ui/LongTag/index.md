---
toc: content
group:
  title: 展示
  order: 0
---
# LongTag
长标签

## 何时使用
`LongTag` 组件用于展示标签信息，适用于需要显示带有样式的文本标签的场景。比如用于显示分类名称、状态标签等。

## 代码演示

### 示例 1: 基本使用
```jsx
import React from 'react';
import LongTag from './';

const BasicExample = () => (
  <div>
    <LongTag name="重要标签" />
  </div>
);

export default BasicExample;
```

### 示例 2: 自定义标签样式
```jsx
import React from 'react';
import LongTag from './';
import './index.less'; // 自定义样式文件

const CustomStyledExample = () => (
  <div>
    <LongTag name="自定义样式" style="index" />
  </div>
);

export default CustomStyledExample;
```

### 示例 3: 标签的展示效果
```jsx
import React from 'react';
import LongTag from './';

const DisplayExample = () => (
  <div>
    <LongTag name="标签1" style="highlight" />
    <LongTag name="标签2" style="highlight" />
    <LongTag name="标签3" />
  </div>
);

export default DisplayExample;
```

## FAQ
1. **如何调整标签的样式？**
  - 你可以通过传递 `style` 属性来指定标签的样式。样式类名需在对应的 CSS 文件中定义。

2. **组件是否支持自定义样式？**
  - 是的，你可以通过 `style` 属性传递自定义的 CSS 类名，来实现不同的样式效果。

3. **如何设置标签文本？**
  - 通过 `name` 属性设置标签的文本内容。该属性是必填的。
