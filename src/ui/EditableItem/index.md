---
title: EditableItem 可编辑项
toc: content
group:
  title: 数据录入
  order: 3
---

# EditableItem 可编辑项
## 何时使用
当你需要一个可以编辑的文本字段，并希望用户能够在视图中快速切换到编辑模式时使用。
## 代码演示

### 示例 1: 基本用法
```jsx
import React from 'react';
import EditableItem from './';

const BasicExample = () => {
  const handleChange = (value) => {
    console.log('Changed value:', value);
  };

  return (
    <EditableItem value="Click to edit" onChange={handleChange} />
  );
};

export default BasicExample;
```

### 示例 2: 处理空值
```jsx
import React from 'react';
import EditableItem from './';

const EmptyValueExample = () => {
  const handleChange = (value) => {
    console.log('Changed value:', value);
  };

  return (
    <EditableItem value="" onChange={handleChange} />
  );
};

export default EmptyValueExample;
```

### 示例 3: 动态更新值
```jsx
import React, { useState } from 'react';
import EditableItem from './';

const DynamicUpdateExample = () => {
  const [value, setValue] = useState('Initial value');

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <EditableItem value={value} onChange={handleChange} />
  );
};

export default DynamicUpdateExample;
```

## FAQ
**Q: 这个组件如何处理点击“检查”按钮？**  
A: 当用户点击“检查”按钮或按下 Enter 键时，组件将退出编辑模式，并触发 `onChange` 回调函数，将新的值传递给它。
