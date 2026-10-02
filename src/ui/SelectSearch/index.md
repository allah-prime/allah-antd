---
toc: content
group:
  title: 数据录入
  order: 1
---
# SelectSearch
`SelectSearch` 组件
### 组件简介

`SelectSearch` 是一个增强型下拉选择框组件，结合了 `Ant Design` 的 `Select` 组件和搜索功能。它允许用户通过输入搜索框来过滤选项，还可以通过点击链接来添加新的选项。该组件可以配置不同的模式，如单选或多选，并支持自定义选项的渲染方式。


## 何时使用
使用 `SelectSearch` 组件时，您希望在下拉选择框中集成搜索功能和选项添加功能。这对于需要在选项较多时提供快速筛选和添加功能的场景非常有用。

## 代码演示

### 示例 1: 基本使用

这个示例展示了 `SelectSearch` 的基本用法，包括搜索功能和选项选择。

```tsx
import React, { useState } from 'react';
import SelectSearch from './'; // 组件路径可能需要调整

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' }
];

const BasicUsage = () => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <SelectSearch
      options={options}
      onChange={handleChange}
      value={selectedValue}
      placeholder="请选择水果"
    />
  );
};

export default BasicUsage;
```

### 示例 2: 自定义选项渲染

这个示例展示了如何通过 `itemRender` 属性自定义选项的渲染方式。

```tsx
import React, { useState } from 'react';
import SelectSearch from './'; // 组件路径可能需要调整

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' }
];

const CustomItemRender = (item: any, index: number) => (
  <div key={index} style={{ padding: '8px' }}>
    {item.label} ({item.value})
  </div>
);

const CustomRenderExample = () => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <SelectSearch
      options={options}
      onChange={handleChange}
      value={selectedValue}
      itemRender={CustomItemRender}
      placeholder="请选择水果"
    />
  );
};

export default CustomRenderExample;
```

### 示例 3: 添加新选项功能

这个示例展示了如何使用 `addItem` 属性添加新的选项到下拉框中。

```tsx
import React, { useState } from 'react';
import SelectSearch from './'; // 组件路径可能需要调整

const initialOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' }
];

const AddItemExample = () => {
  const [options, setOptions] = useState(initialOptions);
  const [selectedValue, setSelectedValue] = useState<string | undefined>();

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleAddItem = () => {
    const newValue = prompt('请输入新选项的值:');
    if (newValue) {
      setOptions([...options, { value: newValue, label: newValue }]);
    }
  };

  return (
    <SelectSearch
      options={options}
      onChange={handleChange}
      value={selectedValue}
      addItem={handleAddItem}
      placeholder="请选择水果"
    />
  );
};

export default AddItemExample;
```

## FAQ

**Q: 组件的 `itemRender` 属性是什么？**  
A: `itemRender` 是一个函数，用于自定义下拉框中选项的渲染方式。它接收选项和索引作为参数，并返回自定义的渲染内容。

**Q: 如何使用 `addItem` 属性？**  
A: `addItem` 是一个函数，当用户点击“创建新的选项”链接时会触发该函数。您可以在函数中实现添加新选项的逻辑。

**Q: 组件支持哪些模式？**  
A: 组件支持 `Select` 组件的所有模式，如单选模式和多选模式。可以通过 `mode` 属性进行设置。
