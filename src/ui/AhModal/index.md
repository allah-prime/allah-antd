---
toc: content
group:
  title: 展示
  order: 0
---

# AhModal

AhModal 是一个基于 Ant Design Modal 组件的增强版模态框组件，提供了更多的配置选项和样式定制能力。它支持自定义宽高、滚动区域、加载状态、标题扩展等功能。

## 特性

- 支持自定义宽度和高度
- 支持垂直滚动区域
- 内置加载状态
- 支持自定义底部按钮
- 支持标题右侧扩展区域
- 灵活的样式定制
- 默认居中

## 代码演示

### 基础用法

```tsx
import React, { useState } from 'react';
import { AhModal } from '..';
import { Button } from 'antd';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开模态框
      </Button>
      <AhModal title="基础模态框" open={visible} onCancel={() => setVisible(false)} width={500}>
        <p>这是一个基础的模态框示例</p>
      </AhModal>
    </>
  );
};
```

### 动态调整宽高

```tsx
import React, { useState } from 'react';
import { AhModal } from '..';
import { Button, Slider, Space, Typography } from 'antd';

export default () => {
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);

  const sliders = (
    <Space direction="vertical" style={{ width: 260 }}>
      <Space align="center">
        <Typography.Text style={{ width: 70, display: 'inline-block', fontSize: 12 }}>
          宽：{width}px
        </Typography.Text>
        <Slider
          min={300}
          max={1200}
          value={width}
          onChange={setWidth}
          style={{ width: 160 }}
        />
      </Space>
      <Space align="center">
        <Typography.Text style={{ width: 70, display: 'inline-block', fontSize: 12 }}>
          高：{height}px
        </Typography.Text>
        <Slider
          min={200}
          max={800}
          value={height}
          onChange={setHeight}
          style={{ width: 160 }}
        />
      </Space>
    </Space>
  );

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开模态框
      </Button>
      <AhModal
        title="动态宽高模态框"
        open={visible}
        onCancel={() => setVisible(false)}
        width={width}
        height={height}
        scrollY
        rightFooter={
          <Button type="primary" onClick={() => setVisible(false)}>
            确定
          </Button>
        }
      >
        {sliders}
        <p>拖动标题右侧的滑块可实时调整模态框宽高</p>
        <p>当前宽度：{width}px</p>
        <p>当前高度：{height}px</p>
        <div style={{ height: 200, background: '#f0f0f0', marginTop: 20 }}>
          <p style={{ padding: 10 }}>这是一个内容区域，可以滚动查看更多内容</p>
        </div>
      </AhModal>
    </>
  );
};
```

### 嵌入页面容器

```tsx
import React, { useState } from 'react';
import { AhModal, AhCardListPage, CardList } from '..';
import { Button } from 'antd';
import { asyncUtils } from '@allahjs/utils';

const columns = [
  {
    title: '条目名称',
    dataIndex: 'standardItem',
    key: 'code',
    width: 300,
    ellipsis: true
  },
  {
    title: '短id',
    dataIndex: 'shortId',
    key: 'code',
    width: 300,
    ellipsis: true
  },
  {
    title: '编码',
    dataIndex: 'scopeCode',
    key: 'code',
    width: 300,
    ellipsis: true
  }
];

const request = async (_params: any): Promise<any> => {
  await asyncUtils.delay(1200);
  return {
    data: {} as any,
    records: []
  };
};

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开模态框
      </Button>
      <AhModal title="基础模态框" open={visible} onCancel={() => setVisible(false)} width={500} height={400}  >
        <AhCardListPage
          subHeight={180}
          itemsRender={(items) => (
            <CardList
              data={items}
              itemRender={(item) => (
                <Card
                  style={{
                    height: 200
                  }}
                >
                  asda
                </Card>
              )}
            />
          )}
          defParams={{ pageSize: 10, pageNum: 1 }}
          request={request}
        />
      </AhModal>
    </>
  );
};
```

### 带滚动区域的模态框

```tsx
import React, { useState } from 'react';
import { AhModal } from '..';
import { Button } from 'antd';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开滚动模态框
      </Button>
      <AhModal
        title="滚动区域示例"
        open={visible}
        onCancel={() => setVisible(false)}
        width={600}
        height="70vh"
        scrollY
        rightFooter={
          <Button type="primary" onClick={() => setVisible(false)}>
            确定
          </Button>
        }
      >
        <div style={{ height: '1000px', padding: '20px' }}>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
          <p>这是一个长内容区域，可以滚动查看更多内容</p>
        </div>
      </AhModal>
    </>
  );
};
```

### 加载状态模态框

```tsx
import React, { useState } from 'react';
import { AhModal } from '..';
import { Button } from 'antd';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        显示加载中
      </Button>
      <AhModal
        title="加载中..."
        open={visible}
        onCancel={() => setVisible(false)}
        loading={true}
        width={400}
        height={300}
        footer={
          <div>
            <Button>asddas</Button>
          </div>
        }
      >
        <p>数据加载中，请稍候...</p>
      </AhModal>
    </>
  );
};
```

## API

### AhModal

| 参数           | 说明             | 类型                  | 默认值           |
| -------------- | ---------------- | --------------------- | ---------------- |
| width          | 模态框宽度       | `number \| string`    | `75%`            |
| height         | 模态框高度       | `number \| string`    | `根据内容自适应` |
| top            | 距离顶部的距离   | `number \| string`    | -                |
| loading        | 是否显示加载状态 | `boolean`             | `false`          |
| rightFooter    | 右侧底部按钮     | `React.ReactNode`     | -                |
| scrollY        | 是否开启垂直滚动 | `boolean`             | `false`          |
| scrollYHeight  | 滚动区域高度     | `number \| string`    | 同 height        |
| scrollYStyles  | 滚动区域样式     | `React.CSSProperties` | -                |
| scrollYPadding | 滚动区域内边距   | `number \| string`    | `12px`           |
| titleExtra     | 标题右侧区域     | `React.ReactNode`     | -                |

除了以上属性外，组件还支持所有 antd Modal 的属性。

## 注意事项

1. 当设置 `scrollY` 为 `true` 时，内容区域会自动开启垂直滚动，此时可以通过 `scrollYHeight` 控制滚动区域的高度
2. `height` 属性会影响整个模态框的高度，而 `scrollYHeight` 只影响滚动区域的高度
3. 当使用 `rightFooter` 时，模态框底部会自动添加一条分割线
4. 组件会自动处理模态框的关闭按钮，无需额外配置
5. 标题区域支持字符串和自定义 React 节点两种方式
