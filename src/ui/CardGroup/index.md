---
toc: content
group:
  title: 展示
  order: 0
---
# CardList
卡片列表
## 何时使用
当你需要在页面上展示一组卡片，并且需要支持新增功能时，可以使用 `CardList` 组件。它允许你灵活地控制每个卡片的内容以及新增卡片的行为。

## 代码演示

### 示例 1: 基本用法

展示一个包含基本卡片列表的示例，其中包含一个用于新增卡片的按钮。

```jsx
import React from 'react';
import CardList from './CardList';
import { Card } from 'antd';

const itemRender = (item, index) => (
  <Card title={`Card ${index + 1}`}>
    <p>{item.content}</p>
  </Card>
);

const data = [
  { id: '1', content: 'Card 1 Content' },
  { id: '2', content: 'Card 2 Content' },
  { id: '3', content: 'Card 3 Content' },
];

const App = () => {
  const handleAddClick = () => {
    alert('Add card clicked!');
  };

  return (
    <CardList
      data={data}
      itemRender={itemRender}
      addClick={handleAddClick}
      style={{ padding: 20 }}
    />
  );
};

export default App;
```

### 示例 2: 自定义新增图标

展示一个包含自定义图标的卡片列表，其中“新增”按钮使用了自定义图标。

```jsx
import React from 'react';
import CardList from './CardList';
import { Card } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

const itemRender = (item, index) => (
  <Card title={`Card ${index + 1}`}>
    <p>{item.content}</p>
  </Card>
);

const data = [
  { id: '1', content: 'Card 1 Content' },
  { id: '2', content: 'Card 2 Content' },
];

const App = () => {
  const handleAddClick = () => {
    alert('Add card clicked!');
  };

  return (
    <CardList
      data={data}
      itemRender={itemRender}
      addClick={handleAddClick}
      addIcon={<PlusCircleOutlined style={{ fontSize: '24px' }} />}
      style={{ padding: 20 }}
    />
  );
};

export default App;
```

### 示例 3: 自定义卡片高度和间距

展示一个卡片列表，其中卡片的高度和间距都经过自定义设置。

```jsx
import React from 'react';
import CardList from './CardList';
import { Card } from 'antd';

const itemRender = (item, index) => (
  <Card title={`Card ${index + 1}`}>
    <p>{item.content}</p>
  </Card>
);

const data = [
  { id: '1', content: 'Card 1 Content' },
  { id: '2', content: 'Card 2 Content' },
  { id: '3', content: 'Card 3 Content' },
];

const App = () => {
  const handleAddClick = () => {
    alert('Add card clicked!');
  };

  return (
    <CardList
      data={data}
      itemRender={itemRender}
      addClick={handleAddClick}
      height={200}
      gutter={[16, 16]}
      style={{ padding: 20 }}
    />
  );
};

export default App;
```

## FAQ

**Q1: `itemKey` 属性有什么作用？**

`itemKey` 用于指定每个卡片的唯一标识符，默认为 `'id'`。如果你的数据中使用了不同的字段作为标识符，可以通过设置 `itemKey` 来指定。

**Q2: `addClick` 属性是必需的吗？**

`addClick` 是可选的。如果你不需要“新增”卡片的功能，可以省略这个属性。

**Q3: 如何修改卡片的样式？**

你可以通过传递自定义的 `style` 属性来修改整个组件的样式，或者在 `itemRender` 函数中自定义每个卡片的样式。
