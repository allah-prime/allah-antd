---
title: SelectSearch 搜索选择
toc: content
group:
  title: 数据录入
  order: 3
---

# SelectSearch 搜索选择
### 组件简介

`SelectSearch` 是一个增强型下拉选择框组件，结合了 `Ant Design` 的 `Select` 组件和搜索功能。它允许用户通过输入搜索框来过滤选项，还可以通过点击链接来添加新的选项。该组件可以配置不同的模式，如单选或多选，并支持自定义选项的渲染方式。

传入 `fetchOptions` 后组件进入**异步模式**：面板内搜索框输入时防抖请求远程接口（保留旧列表原地替换，不闪空白）；挂载及 `refreshDepend` 变化时预载默认列表并缓存，展开下拉时直接回显缓存列表并静默刷新，多选模式下也会显示搜索框。

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

### 示例 4: 异步获取数据

传入 `fetchOptions` 后进入异步模式：面板内搜索框输入时防抖调用远程接口（保留旧列表原地替换）；挂载时预载默认列表，展开下拉时直接回显缓存并静默刷新。本地示例（示例 1~3）不受影响，不传 `fetchOptions` 时仍为本地过滤。

<code src="./demo/AsyncDemo.tsx"></code>

异步模式核心属性：

```tsx | pure
<SelectSearch
  fetchOptions={keyword => getFruitList(keyword)} // 传入后进入异步模式
  fetchByValue={values => getByIdList(values)}    // 可选：value 解析不了 label 时自动按 value 反查
  debounceTimeout={500}      // 搜索防抖毫秒数，默认 800
  refreshDepend={[deptId]}   // 依赖变化时以空关键字重新请求
  options={[]}               // 异步模式下作为兜底选项合并进列表（可用于默认值回显）
/>
```

与 `DebounceSelect` 的区别：`DebounceSelect` 在选择框内输入触发搜索（antd 原生 `showSearch`）；`SelectSearch` 保留面板内搜索框的特色交互，并额外支持 `addItem`、`itemRender`。

### 示例 5: 默认值回显

异步模式下直接传 `value` 时，选项列表里没有对应项会导致 label 无法显示。组件提供两种回显机制，可按场景选用：

- **静态 options 兜底**：父组件已知 label（编辑表单时记录里就有 `deptId` + `deptName`），直接把 `{ label, value }` 传进现有 `options` 属性，组件会把它合并进异步列表。
- **`fetchByValue` 反查**：父组件只有 ID（深链等场景），组件发现当前列表解析不了 value 时自动调用反查接口。

<code src="./demo/DefaultDemo.tsx"></code>

## FAQ

**Q: 组件的 `itemRender` 属性是什么？**  
A: `itemRender` 是一个函数，用于自定义下拉框中选项的渲染方式。它接收选项和索引作为参数，并返回自定义的渲染内容。

**Q: 如何使用 `addItem` 属性？**  
A: `addItem` 是一个函数，当用户点击“创建新的选项”链接时会触发该函数。您可以在函数中实现添加新选项的逻辑。

**Q: 组件支持哪些模式？**  
A: 组件支持 `Select` 组件的所有模式，如单选模式和多选模式。可以通过 `mode` 属性进行设置。

**Q: 异步模式下如何触发搜索？**  
A: 在下拉面板顶部的搜索框中输入即可，输入会按 `debounceTimeout`（默认 800ms）防抖调用 `fetchOptions`，加载期间保留旧列表原地替换。展开下拉时直接回显缓存的默认列表（挂载/`refreshDepend` 变化时预载）并静默刷新，不会出现「旧数据 → 加载 → 新数据」的闪烁。

**Q: 异步模式和多选模式能同时用吗？**  
A: 可以。异步模式下多选（`mode="multiple"` 或 `"tags"`）也会显示面板内搜索框；本地过滤模式下多选不显示搜索框。

**Q: 异步模式下默认值怎么回显？**  
A: 两种机制任选：已知 label 时把 `{ label, value }` 传进 `options`（组件会兜底合并进异步列表）；只有 ID 时传 `fetchByValue`，组件发现 value 解析不了 label 会自动反查。见示例 5。

**Q: 异步模式下请求失败会怎样？**  
A: 组件内部做了竞态保护（只采纳最后一次请求的结果），请求失败会停止加载状态并显示默认的「无数据」提示。
