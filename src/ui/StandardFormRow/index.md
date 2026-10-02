---
toc: content
group:
  title: 数据录入
  order: 1
---
# StandardFormRow
标准表单行

## 何时使用
用于在表单中分隔内容，使其更加整洁，支持不同的显示样式，如块状、网格状等。

## 代码演示

### 示例 1: 基本用法
展示一个简单的表单行。

```jsx
import React from 'react';
import StandardFormRow from './';

const BasicExample = () => (
  <StandardFormRow title="姓名">
    <input type="text" placeholder="请输入姓名" />
  </StandardFormRow>
);

export default BasicExample;
```

### 示例 2: 块状布局
展示块状布局的表单行。

```jsx
import React from 'react';
import StandardFormRow from './';

const BlockExample = () => (
  <StandardFormRow title="邮箱" block>
    <input type="email" placeholder="请输入邮箱" />
  </StandardFormRow>
);

export default BlockExample;
```

### 示例 3: 网格布局
展示网格布局的表单行。

```jsx
import React from 'react';
import StandardFormRow from './';

const GridExample = () => (
  <StandardFormRow title="电话" grid>
    <input type="tel" placeholder="请输入电话" />
  </StandardFormRow>
);

export default GridExample;
```

## FAQ

**Q: 如何使行最后一个不显示虚线？**  
A: 设置 `last` 属性为 `true`，例如 `<StandardFormRow title="地址" last>...</StandardFormRow>`。

---
