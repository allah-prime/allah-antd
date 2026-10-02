### 代码演示

#### 基本用法

展示一个简单的 `ItemListCard`，仅用于展示数据，没有操作按钮。

```jsx
import React from 'react';
import { ItemListCard } from '../..';
import { List } from 'antd';

const data = [
  { id: 1, title: '项目一', description: '这是项目一的描述' },
  { id: 2, title: '项目二', description: '这是项目二的描述' },
  { id: 3, title: '项目三', description: '这是项目三的描述' },
];

const BasicExample = () => (
  <ItemListCard title="基本展示" data={data}>
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  </ItemListCard>
);

export default BasicExample;
```

#### 包含操作按钮

展示一个包含添加、关联和刷新按钮的 `ItemListCard`，并展示如何处理按钮的点击事件。

```jsx
import React from 'react';
import { ItemListCard } from '../..';
import { List, message } from 'antd';

const data = [
  { id: 1, title: '项目一', description: '这是项目一的描述' },
  { id: 2, title: '项目二', description: '这是项目二的描述' },
  { id: 3, title: '项目三', description: '这是项目三的描述' },
];

const handleAddClick = () => {
  message.info('添加按钮被点击');
};

const handleRelFunClick = () => {
  message.info('关联按钮被点击');
};

const handleRefreshClick = () => {
  message.info('刷新按钮被点击');
};

const InteractiveExample = () => (
  <ItemListCard
    title="操作示例"
    data={data}
    addClick={handleAddClick}
    refresh={handleRefreshClick}
    relFun={handleRelFunClick}
  >
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  </ItemListCard>
);

export default InteractiveExample;
```

#### 加载状态

展示 `ItemListCard` 组件在加载状态下的表现。

```jsx
import React, { useState } from 'react';
import { ItemListCard } from '../..';
import { Button, List } from 'antd';

const data = [
  { id: 1, title: '项目一', description: '这是项目一的描述' },
  { id: 2, title: '项目二', description: '这是项目二的描述' },
];

const LoadingExample = () => {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <Button onClick={handleLoad} style={{ marginBottom: 16 }}>
        模拟加载
      </Button>
      <ItemListCard
        title="加载示例"
        data={data}
        refreshLoading={loading}
        refresh={handleRefresh}
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </ItemListCard>
    </div>
  );
};

export default LoadingExample;
```

#### 自定义标题和额外内容

展示如何自定义标题区域的图标和额外内容。

```jsx
import React from 'react';
import { ItemListCard } from '../..';
import { List, Tag, Badge } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const data = [
  { id: 1, title: '重要项目', description: '这是一个重要项目', priority: 'high' },
  { id: 2, title: '普通项目', description: '这是一个普通项目', priority: 'normal' },
];

const CustomExample = () => (
  <ItemListCard
    title="自定义示例"
    data={data}
    titleIconRender={<StarOutlined style={{ color: '#faad14', marginLeft: 8 }} />}
    extra={<Badge count={data.length} />}
    addClick={() => console.log('添加')}
  >
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          extra={
            <Tag color={item.priority === 'high' ? 'red' : 'blue'}>
              {item.priority === 'high' ? '高优先级' : '普通'}
            </Tag>
          }
        >
          <List.Item.Meta
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  </ItemListCard>
);

export default CustomExample;
```

#### 禁用状态

展示组件在禁用状态下的表现。

```jsx
import React from 'react';
import { ItemListCard } from '../..';
import { List } from 'antd';

const data = [
  { id: 1, title: '项目一', description: '这是项目一的描述' },
  { id: 2, title: '项目二', description: '这是项目二的描述' },
];

const DisabledExample = () => (
  <ItemListCard
    title="禁用状态"
    data={data}
    disabled
    addClick={() => console.log('这不会被触发')}
    refresh={() => console.log('这不会被触发')}
  >
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            title={item.title}
            description={item.description}
          />
        </List.Item>
      )}
    />
  </ItemListCard>
);

export default DisabledExample;
```

### API

#### ItemListCard

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 卡片标题 | `string \| React.ReactNode` | - |
| data | 数据源 | `T[]` | `[]` |
| addClick | 添加按钮点击回调 | `() => void` | - |
| refresh | 刷新按钮点击回调 | `() => void` | - |
| relFun | 关联按钮点击回调 | `() => void` | - |
| refreshLoading | 是否显示加载状态 | `boolean` | `false` |
| titleIconRender | 标题右侧自定义图标 | `React.ReactNode \| React.ReactNode[]` | - |
| extra | 头部右侧额外内容 | `React.ReactNode` | - |
| disabled | 是否禁用操作按钮 | `boolean` | `false` |
| style | 容器样式 | `React.CSSProperties` | - |
| listStyle | 列表区域样式 | `React.CSSProperties` | `{ maxHeight: 360, overflowY: 'auto', overflowX: 'hidden' }` |
| children | 子内容 | `React.ReactNode` | - |

#### 注意事项

- 当 `disabled` 为 `true` 时，所有操作按钮将不可点击
- `refreshLoading` 会在整个卡片上显示 Spin 加载效果
- 操作按钮只有在传入对应回调函数时才会显示
- 当 `data` 为空数组时，内容区域不会显示任何内容

### FAQ

**Q: `refreshLoading` 属性的作用是什么？**

A: `refreshLoading` 属性用于控制 `Spin` 组件的显示状态。当设置为 `true` 时，组件将显示加载动画，通常用于数据请求或其他异步操作时的用户提示。

**Q: `titleIconRender` 如何使用？**

A: `titleIconRender` 是一个可以自定义的 React 组件，用于在标题区域展示额外的图标或元素。你可以传入单个元素或元素数组来自定义标题的显示内容。

**Q: 操作按钮的显示逻辑是什么？**

A: 操作按钮的显示基于传入的回调函数：
- `addClick` - 显示添加按钮（方块图标）
- `relFun` - 显示关联按钮（链接图标）  
- `refresh` - 显示刷新按钮（刷新图标）

只有传入对应的回调函数，按钮才会显示。

**Q: 如何自定义列表的滚动区域？**

A: 通过 `listStyle` 属性可以自定义列表区域的样式，包括高度、滚动行为等。默认最大高度为 360px，超出时显示垂直滚动条。
