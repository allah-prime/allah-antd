---
nav:
  title: 工具
  order: 3
toc: content
group:
  title: 工具
  order: 3
---
# SettingDrawer
环境配置抽屉
### SettingDrawer 组件简介

`SettingDrawer` 组件是一个用于配置环境的抽屉组件。它允许用户从下拉列表中选择服务器地址，并保存选择的地址。用户可以通过点击右侧的图标按钮打开或关闭这个抽屉。组件会在用户选择服务器地址后刷新页面，以应用新的设置。

## 何时使用

使用 `SettingDrawer` 组件来提供一个设置面板，允许用户从一个预定义的服务器列表中选择并保存其设置。这在需要动态选择或切换环境配置的场景下特别有用，比如在开发和测试过程中。

## 代码演示

### 示例 1: 基本使用

在这个示例中，我们展示了 `SettingDrawer` 的基本用法。用户可以点击右侧的图标按钮来打开或关闭设置抽屉，并从下拉列表中选择服务器地址。

```jsx
import React from 'react';
import SettingDrawer from './';

const serverList = [
  { path: 'http://dev-server', name: '开发环境' },
  { path: 'http://test-server', name: '测试环境' },
  { path: 'http://prod-server', name: '生产环境' }
];

const App = () => (
  <div>
    <SettingDrawer ahServerList={serverList} />
  </div>
);

export default App;
```

### 示例 2: 自定义图标样式

在这个示例中，我们展示了如何通过自定义 CSS 来改变图标按钮的外观，以适应不同的主题或设计风格。

```jsx
import React from 'react';
import SettingDrawer from './';
import './index.less'; // 自定义样式文件

const serverList = [
  { path: 'http://dev-server', name: '开发环境' },
  { path: 'http://test-server', name: '测试环境' },
  { path: 'http://prod-server', name: '生产环境' }
];

const App = () => (
  <div>
    <SettingDrawer ahServerList={serverList} />
  </div>
);

export default App;
```

`customStyle.less` 示例：

```less
.ah_setting_drawer_handle {
  background-color: #4a90e2; // 自定义背景颜色
}
.ah_setting_drawer_handle:hover {
  background-color: #357abd; // 鼠标悬停时的颜色
}
```

### 示例 3: 动态更新服务器列表

在这个示例中，我们演示了如何动态更新服务器列表。用户可以通过按钮来更新服务器列表，并查看设置抽屉中显示的变化。

```jsx
import React, { useState } from 'react';
import SettingDrawer from './';

const initialServerList = [
  { path: 'http://dev-server', name: '开发环境' },
  { path: 'http://test-server', name: '测试环境' }
];

const updatedServerList = [
  { path: 'http://prod-server', name: '生产环境' },
  { path: 'http://staging-server', name: '预发布环境' }
];

const App = () => {
  const [serverList, setServerList] = useState(initialServerList);

  const updateServerList = () => {
    setServerList(updatedServerList);
  };

  return (
    <div>
      <button onClick={updateServerList}>更新服务器列表</button>
      <SettingDrawer ahServerList={serverList} />
    </div>
  );
};

export default App;
```

## FAQ

**Q: 如何自定义抽屉的宽度和位置？**

A: 可以通过调整 `Drawer` 组件的 `width` 和 `placement` 属性来自定义抽屉的宽度和位置。默认宽度设置为 `300`，位置设置为 `right`。

**Q: 如何处理服务器地址的选择？**

A: 在 `Select` 组件的 `onChange` 事件处理函数中，您可以获取选中的服务器地址并进行处理，比如保存到 `sessionStorage` 中并刷新页面。

**Q: 如何更改图标的样式？**

A: 可以通过自定义 CSS 来更改图标的样式。您可以修改 `.ah_setting_drawer_handle` 类来调整图标的外观。
