---
title: ItemBar 项目栏
toc: content
group:
  title: 布局
  order: 4
demo:
  cols: 2
---

# ItemBar 项目栏

```jsx
import React from 'react';
import { Space } from 'antd';
import { SnippetsTwoTone } from '@ant-design/icons';
import { TableDropdown } from '@ant-design/pro-components';
import ItemBar from './index';

export default () => (
  <ItemBar
    icon={<SnippetsTwoTone style={{ marginRight: 10 }} />}
    key={"id"}
    item={{id: "dsada", name:'asddadad', isNew: true}}
    extraRender={() => (
      <Space>
        <span style={{ color: '#87d068' }}>可用</span>
        <TableDropdown
          key="actionGroup"
          menus={[{ key: 'delItem', name: '解除关联' }]}
        />
      </Space>
    )}
    title="你好"
  />
)
```

## 显示new

```jsx
import React from 'react';
import { Space } from 'antd';
import { SnippetsTwoTone } from '@ant-design/icons';
import { TableDropdown } from '@ant-design/pro-components';
import ItemBar from './index';

export default () => (
  <ItemBar
    icon={<SnippetsTwoTone style={{ marginRight: 10 }} />}
    key={"id"}
    item={{id: "dsada", name:'asddadad', isNew: true}}
    extraText={'2020-12-12'}
    extraMenu={[{ key: 'delItem', name: '解除关联' }]}
    title="你好"
  />
)
```
