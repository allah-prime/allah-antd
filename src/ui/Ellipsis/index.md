---
toc: content
group:
  title: 展示
  order: 0
demo:
  cols: 2
---
# Ellipsis
文本省略组件

## 何时使用
`Ellipsis` 组件用于展示长文本时对文本进行省略，并提供工具提示功能，确保在文本被截断时用户可以通过悬停查看完整内容。它可以根据字符长度或行数来控制文本的显示，支持自定义省略号和前后缀。

## 代码演示

### 示例 1: 简单的文本省略
在这个示例中，文本会根据指定的长度进行省略，超出的部分会以省略号显示，用户可以通过悬停查看完整文本。

```jsx
import React from 'react';
import Ellipsis from './';

const SimpleEllipsisExample = () => (
  <Ellipsis length={10} tooltip>
    这是一个很长很长的文本，用于测试省略功能。
  </Ellipsis>
);

export default SimpleEllipsisExample;
```

### 示例 2: 根据行数进行省略
在这个示例中，文本根据行数进行省略，适用于文本块的显示。用户可以悬停查看完整文本。

```jsx
import React from 'react';
import Ellipsis from './';

const LineEllipsisExample = () => (
  <Ellipsis lines={2} tooltip>
    这是一个长文本的测试示例。我们通过设置行数来进行文本省略。这种方式适用于需要在指定行数内显示文本的场景。
  </Ellipsis>
);

export default LineEllipsisExample;
```

### 示例 3: 自定义省略号和前后缀
在这个示例中，我们演示了如何自定义省略号、前缀和后缀。这样可以更好地与其他 UI 组件进行集成。

```jsx
import React from 'react';
import Ellipsis from './';

const CustomEllipsisExample = () => (
  <Ellipsis 
    length={15} 
    tooltip 
    omitStr="…"
    prefix="开始: "
    suffix=" :结束"
  >
    这里是一个包含自定义前缀、后缀和省略号的长文本示例。
  </Ellipsis>
);

export default CustomEllipsisExample;
```

## FAQ

**Q: `Ellipsis` 组件如何处理长文本？**

A: 组件可以通过指定字符长度或行数来处理长文本。超出部分将被省略，用户悬停时会显示完整文本的工具提示。

**Q: 组件是否支持自定义省略号？**

A: 是的，`Ellipsis` 组件支持自定义省略号、前缀和后缀。

**Q: 组件如何决定使用行数还是字符长度来进行省略？**

A: 组件会优先使用行数进行省略。如果指定了 `lines` 属性，则按照行数进行处理；如果没有指定行数，则根据 `length` 属性来处理字符长度。
