---
title: DragModal 可拖拽弹窗
group:
  title: 拖拽组件
  order: 2
nav:
  title: 组件
  path: /components
---

# DragModal 可拖拽弹窗

可拖拽、可调整大小的模态弹窗，支持固定位置和全屏显示。

## 何时使用

需要可拖拽、可调整大小、支持固定位置或全屏显示的弹窗组件。

## 代码演示

### 基础用法

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { DragModal } from '..';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开弹窗
      </Button>
      <DragModal
        domId="DragModal1"
        visible={visible}
        title="可拖拽弹窗"
        onClose={() => setVisible(false)}
      >
        <div style={{ height: 200 }}>
          可以拖拽标题区域来移动弹窗
          <br />
          可以通过右下角调整弹窗大小
        </div>
      </DragModal>
    </>
  );
};
```

### 自定义位置

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { DragModal } from '..';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        自定义位置弹窗
      </Button>
      <DragModal
        domId="DragModal2"
        visible={visible}
        title="自定义位置弹窗"
        initialX={200}
        initialY={200}
        onClose={() => setVisible(false)}
      >
        <div style={{ height: 200 }}>
          这个弹窗初始位置在 (200, 200)
        </div>
      </DragModal>
    </>
  );
};
```

### 固定弹窗

```tsx
import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { DragModal } from '..';

export default () => {
  const [visible, setVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  return (
    <>
      <Space>
        <Button type="primary" onClick={() => setVisible(true)}>
          打开弹窗
        </Button>
        <Button onClick={() => setIsPinned(!isPinned)}>
          {isPinned ? '取消固定' : '固定弹窗'}
        </Button>
      </Space>
      <DragModal
        domId="DragModal3"
        visible={visible}
        title="可固定弹窗"
        isPinned={isPinned}
        onPinnedChange={setIsPinned}
        onClose={() => setVisible(false)}
      >
        <div style={{ height: 200 }}>
          点击右上角的图钉按钮可以固定弹窗
        </div>
      </DragModal>
    </>
  );
};
```

### 全屏弹窗

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { DragModal } from '..';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开弹窗
      </Button>
      <DragModal
        domId="DragModal4"
        visible={visible}
        title="可全屏弹窗"
        onClose={() => setVisible(false)}
      >
        <div style={{ height: 200 }}>
          点击右上角的全屏按钮可以切换全屏显示
        </div>
      </DragModal>
    </>
  );
};
```

### 自定义样式

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { DragModal } from '..';

export default () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        自定义样式弹窗
      </Button>
      <DragModal
        domId="DragModal5"
        visible={visible}
        title="自定义样式弹窗"
        width={600}
        headerStyle={{ backgroundColor: '#f0f5ff' }}
        bodyStyle={{ backgroundColor: '#f9fafb', padding: 32 }}
        footerStyle={{ backgroundColor: '#f0f5ff' }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
        footer={<Button onClick={() => setVisible(false)}>关闭</Button>}
        onClose={() => setVisible(false)}
      >
        <div style={{ height: 200 }}>
          这个弹窗使用了自定义样式
        </div>
      </DragModal>
    </>
  );
};
```

### 自定义挂载容器

```tsx
import React, { useState, useRef } from 'react';
import { Button, Space } from 'antd';
import { DragModal } from '..';

export default () => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Space direction="vertical">
        <Button type="primary" onClick={() => setVisible1(true)}>
          挂载到指定元素
        </Button>
        <Button type="primary" onClick={() => setVisible2(true)}>
          挂载到选择器元素
        </Button>
        <Button type="primary" onClick={() => setVisible3(true)}>
          通过函数获取容器
        </Button>
      </Space>
      
      {/* 自定义容器 */}
      <div 
        ref={containerRef}
        id="custom-modal-container"
        style={{ 
          position: 'relative', 
          height: 400, 
          border: '2px dashed #d9d9d9', 
          marginTop: 16,
          borderRadius: 8
        }}
      >
        <p style={{ padding: 16, margin: 0, color: '#666' }}>
          这是一个自定义容器，弹窗将挂载到这里
        </p>
      </div>

      {/* 挂载到指定元素 */}
      <DragModal
        domId="DragModal6"
        visible={visible1}
        title="挂载到指定元素"
        getContainer={containerRef.current}
        onClose={() => setVisible1(false)}
      >
        <div style={{ height: 150 }}>
          这个弹窗挂载到了上面的自定义容器中
        </div>
      </DragModal>

      {/* 挂载到选择器元素 */}
      <DragModal
        domId="DragModal7"
        visible={visible2}
        title="挂载到选择器元素"
        getContainer="#custom-modal-container"
        onClose={() => setVisible2(false)}
      >
        <div style={{ height: 150 }}>
          这个弹窗通过CSS选择器挂载到容器中
        </div>
      </DragModal>

      {/* 通过函数获取容器 */}
      <DragModal
        domId="DragModal8"
        visible={visible3}
        title="通过函数获取容器"
        getContainer={() => document.getElementById('custom-modal-container')!}
        onClose={() => setVisible3(false)}
      >
        <div style={{ height: 150 }}>
          这个弹窗通过函数获取挂载容器
        </div>
      </DragModal>
    </>
  );
 };
```

## API

### DragModal

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否可见 | boolean | false |
| title | 标题 | ReactNode | - |
| width | 宽度 | number \| string | 520 |
| children | 内容 | ReactNode | - |
| footer | 页脚内容 | ReactNode | - |
| afterClose | 对话框关闭后的回调 | () => void | - |
| closable | 是否显示关闭按钮 | boolean | true |
| onClose | 关闭时的回调函数 | () => void | - |
| maskClosable | 点击遮罩层是否关闭 | boolean | true |
| mask | 是否展示遮罩 | boolean | true |
| maskStyle | 遮罩样式 | CSSProperties | - |
| wrapClassName | 对话框外层容器类名 | string | - |
| wrapStyle | 对话框外层容器样式 | CSSProperties | - |
| bodyStyle | 对话框内容样式 | CSSProperties | - |
| footerStyle | 页脚内容样式 | CSSProperties | - |
| headerStyle | 标题样式 | CSSProperties | - |
| zIndex | 对话框z-index | number | 1000 |
| minWidth | 对话框最小宽度 | number | 300 |
| minHeight | 对话框最小高度 | number | 200 |
| initialX | 初始位置X | number | - |
| initialY | 初始位置Y | number | - |
| domId | 拖拽ID | string | 'draggable-modal' |
| position | 位置信息 | { x: number; y: number } | - |
| isPinned | 是否固定 | boolean | false |
| onPinnedChange | 固定状态变化回调 | (isPinned: boolean) => void | - |
| resizable | 是否可调整大小 | boolean | true |
| onResize | 调整大小时的回调 | (size: { width: number; height: number }) => void | - |
| onResizeEnd | 调整大小结束回调 | () => void | - |
| destroyOnClose | 关闭时是否销毁组件 | boolean | false |
| getContainer | 指定 Modal 挂载的 HTML 节点 | HTMLElement \| (() => HTMLElement) \| string \| false | document.body |

## 注意事项

- 最小宽高默认为300px/200px，可通过minWidth/minHeight自定义
- 固定模式下点击遮罩层不会关闭弹窗
- 弹窗默认居中显示，可通过initialX/initialY设置初始位置
- 使用position属性可实现受控的位置管理
- destroyOnClose可在关闭时销毁组件内容，减少内存占用
