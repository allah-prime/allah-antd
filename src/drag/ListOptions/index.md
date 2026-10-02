---
nav:
  title: 拖拽组件
  order: 3
group:
  title: 列表
  order: 0
order: 3
---


# ListOptions

```jsx
import React from 'react';
import { Button, Input, Modal } from 'antd';
import { ListOptions } from '..';
import '../../ui/ItemBar/index.less';

export default () => {

  const [optionsVisible, setOptionsVisible] = React.useState(false);

  const [value, setValue] = React.useState([
    {
      label: '选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1选项1',
      value: '1',
    },
    {
      label: '选项2',
      value: '2',
    },
    {
      label: '选项3',
      value: '3',
    },
  ]);

  return (
    <>
      <div style={{ width: 500 }}>
        <ListOptions tips="更新后将同步更新相关事项对应的选项" value={value} onChange={v => setValue(v)} />
      </div>
      <Button onClick={() => setOptionsVisible(true)}>
        显示选项
      </Button>
      <Modal open={optionsVisible} closable={false} onCancel={() => setOptionsVisible(false)}>
        <ListOptions tips="更新后将同步更新相关事项对应的选项" onChange={v => {console.log(v);setValue(v)}} value={value} />
      </Modal>
    </>
  )
}
```

## 常见用法

### 监听文本框编辑事件

组件在输入框失去焦点的时候会触发onChange事件，会返回一个当前的数组，以及这次onChange事件是由哪个下标的index触发的。

```
onChange?: (values: IOptions6<string>[], index: number) => void;
```
