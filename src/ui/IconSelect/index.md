---
title: IconSelect 图标选择
toc: content
group:
  title: 数据录入
  order: 3
---

# IconSelect 图标选择

`IconSelect` 是一个使用 Ant Design 组件构建的图标选择控件，适用于用户需要从一组选项中选择一个图标的场景。该组件包括搜索功能，允许用户快速找到所需的图标并进行选择。

## 何时使用

- 需要让用户从一组选项中选择一个图标时使用。
- 适合用于表单、配置界面等需要用户自定义设置图标的情况。

## 代码演示

### 示例 1: 基本用法

实现一个基本的图标选择功能，用户可以点击按钮打开图标选择面板。

![img.png](./demo/img.png)

```
import React, { useState } from 'react';  
import IconSelect from './';  

const iconList = [  
  { icon_id: '1', name: 'Home', font_class: 'home', unicode: 'e900', unicode_decimal: 59648 },  
  { icon_id: '2', name: 'User', font_class: 'user', unicode: 'e901', unicode_decimal: 59649 },  
  { icon_id: '3', name: 'Settings', font_class: 'settings', unicode: 'e902', unicode_decimal: 59650 },  
];  

const BasicUsageExample = () => {  
  const [selectedIcon, setSelectedIcon] = useState('');  

  return (  
    <div>  
      <h3>选择一个图标:</h3>  
      <IconSelect  
        value={selectedIcon}  
        onChange={setSelectedIcon}  
        iconList={iconList}  
      />  
      <p>当前选择的图标: {selectedIcon || '无'}</p>  
    </div>  
  );  
};  

export default BasicUsageExample;
```

### 示例 2: 图标选中回调

展示如何通过 `onChange` 属性使用用户选择的图标信息。

### 示例 3: 图标搜索功能

展示搜索功能，让用户快速找到所需的图标。

## FAQ

- **如何自定义图标列表？**
  在 `iconList` 属性中传入自定义图标数据。

---

接下来，我会逐个提供示例代码。我们从第一个示例开始。
