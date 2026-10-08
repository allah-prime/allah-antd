---
title: FooterToolbar 底部工具栏
toc: content
group:
  title: 布局
  order: 4
---

# FooterToolbar 底部工具栏

## 何时使用

`FooterToolbar` 组件用于固定在内容区域的底部，随着页面滚动而保持在视口底部。这个组件常用于长页面的数据搜集和提交工作，确保用户在页面底部也可以访问到提交或操作按钮。

## 代码演示

### 基本使用

下面是一个基本的示例，展示了如何使用 `FooterToolbar` 组件，并在页面底部添加取消和提交按钮。

```jsx
import React from 'react';
import FooterToolbar from '../FooterToolbar/index';
import { Button } from 'antd';

export default () => (
  <div style={{ background: '#f7f7f7', padding: 24 }}>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <p>Content Content Content Content</p>
    <FooterToolbar extra="extra information">
      <Button>Cancel</Button>
      <Button type="primary">Submit</Button>
    </FooterToolbar>
  </div>
);
```

### 带额外信息的页脚

在此示例中，我们在 `FooterToolbar` 组件中使用了 `extra` 属性来显示额外的信息，该信息会被放置在工具栏的左侧，而工具栏内容（如按钮）则位于右侧。

```jsx
import React from 'react';
import FooterToolbar from '../FooterToolbar/index';
import { Button } from 'antd';

export default () => (
  <div style={{ background: '#f7f7f7', padding: 24 }}>
    <p>More content to illustrate scrolling...</p>
    <FooterToolbar extra={<div>Additional Info</div>}>
      <Button>Cancel</Button>
      <Button type="primary">Submit</Button>
    </FooterToolbar>
  </div>
);
```

### 高度自定义的页脚

如果需要进一步自定义页脚的内容，可以使用更复杂的组件作为 `extra` 或 `children`。例如，在以下示例中，我们使用了多个按钮和一个自定义的内容区域。

```jsx
import React from 'react';
import FooterToolbar from '../FooterToolbar/index';
import { Button } from 'antd';

const CustomContent = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span>Custom Message</span>
    <Button style={{ marginLeft: 8 }} type="dashed">Help</Button>
  </div>
);

export default () => (
  <div style={{ background: '#f7f7f7', padding: 24 }}>
    <p>Extended content to show scrolling...</p>
    <FooterToolbar extra={<CustomContent />}>
      <Button>Cancel</Button>
      <Button type="primary">Submit</Button>
    </FooterToolbar>
  </div>
);
```

## FAQ

**Q: `FooterToolbar` 组件是否支持自定义样式？**

A: 是的，`FooterToolbar` 组件支持自定义样式。你可以通过外部样式表或内联样式来调整工具栏的样式和布局。

**Q: 如何在 `FooterToolbar` 中添加更多操作按钮？**

A: 你可以在 `FooterToolbar` 的 `children` 属性中添加更多的按钮或组件。所有的内容都会自动对齐到工具栏的右侧。

**Q: `extra` 属性中的内容如何对齐？**

A: `extra` 属性中的内容会被对齐到工具栏的左侧，通常用于展示额外的信息或操作。
