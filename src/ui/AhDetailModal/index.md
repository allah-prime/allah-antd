---
title: AhDetailModal 详情弹窗
group:
  title: 通用
  order: 1
demo:
  cols: 2
---

# AhDetailModal 详情弹窗

`AhDetailModal` 是一个基于 `Descriptions` 的详情展示组件。它负责渲染“详情内容”，不负责弹窗开关；如需弹窗场景，请与 `AhModal` 组合使用。

## 何时使用

- 需要按字段配置渲染详情内容
- 需要在详情中混合文本、图片、自定义渲染
- 需要在打开页面/弹窗时异步拉取详情数据

## 代码演示

> 说明：以下「基础用法 / 仅用 request 拉取详情 / 图片 + 自定义渲染 / 与 AhModal 组合」均为可交互示例；仅类型定义片段使用 `pure` 纯展示。

### 基础用法（直接传 currentItem）

```tsx
import React from 'react';
import { AhDetailModal, IDetailColumn } from '..';

type User = {
  id: number;
  name: string;
  phone: string;
  deptName: string;
};

const currentItem: User = {
  id: 1,
  name: '张三',
  phone: '13800000000',
  deptName: '研发一部'
};

const columns: IDetailColumn<User>[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '手机号', dataIndex: 'phone' },
  { title: '部门', dataIndex: 'deptName' }
];

export default () => {
  return <AhDetailModal currentItem={currentItem} columns={columns} />;
};
```

### 仅用 request 拉取详情

```tsx
import React from 'react';
import { AhDetailModal, IDetailColumn } from '..';

type User = {
  name: string;
  email: string;
  status: number;
};

const request = async (): Promise<User> => {
  return {
    name: '李四',
    email: 'lisi@example.com',
    status: 1
  };
};

const columns: IDetailColumn<User>[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '邮箱', dataIndex: 'email' },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      0: { text: '禁用' },
      1: { text: '启用' }
    }
  }
];

export default () => {
  return <AhDetailModal request={request} columns={columns} />;
};
```

### 图片 + 自定义渲染

```tsx
import React from 'react';
import { Tag } from 'antd';
import { AhDetailModal, IDetailColumn, DetailItemType } from '..';

type Goods = {
  id: number;
  name: string;
  cover: string;
  status: number;
};

const currentItem: Goods = {
  id: 101,
  name: '办公椅',
  cover: 'cover.png',
  status: 1
};

const columns: IDetailColumn<Goods>[] = [
  { title: '商品名', dataIndex: 'name' },
  {
    title: '封面',
    dataIndex: 'cover',
    detailType: DetailItemType.IMAGE,
    imageConfig: {
      width: 80,
      height: 80,
      busiScene: 'goods',
      relField: 'id'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value) => <Tag color={value === 1 ? 'green' : 'red'}>{value === 1 ? '上架' : '下架'}</Tag>
  }
];

export default () => {
  return <AhDetailModal currentItem={currentItem} columns={columns} />;
};
```

### 与 AhModal 组合（弹窗场景）

```tsx
import React, { useState } from 'react';
import { Button } from 'antd';
import { AhModal, AhDetailModal, IDetailColumn } from '..';

export default () => {
  const [open, setOpen] = useState(false);

  const columns: IDetailColumn[] = [
    { title: '姓名', dataIndex: 'name' },
    { title: '手机号', dataIndex: 'phone' }
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        查看详情
      </Button>

      <AhModal title="用户详情" open={open} onCancel={() => setOpen(false)} footer={null}>
        <AhDetailModal currentItem={{ name: '王五', phone: '13900000000' }} columns={columns} />
      </AhModal>
    </>
  );
};
```

## API

### AhDetailModal / IAhDetailModalProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| currentItem | 当前详情数据；存在时优先使用该数据渲染 | `T` | - |
| columns | 详情列配置 | `IDetailColumn<T>[]` | - |
| request | 异步请求详情数据的方法（无参） | `() => Promise<T>` | - |
| descriptionsProps | 透传给 antd `Descriptions` 的配置 | `Partial<DescriptionsProps>` | `{}` |

> 注意：当 `currentItem` 与 `request` 同时存在时，组件优先使用 `currentItem`。

### IDetailColumn

`IDetailColumn<T>` 继承 `Partial<ProColumns<T>>`，新增字段如下：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| detailType | 详情项类型 | `DetailItemType` | `text` |
| imageConfig | 图片配置（`detailType = image` 时生效） | `{ width?: number; height?: number; busiScene?: string; relField?: string }` | - |
| hideInDetail | 是否在详情中隐藏该字段 | `boolean` | `false` |

### DetailItemType

```ts | pure
enum DetailItemType {
  TEXT = 'text',
  IMAGE = 'image'
}
```

## 注意事项

- 组件内部使用 `useRequest({ manual: true })`，在 `currentItem` 或 `request` 变化时触发加载。
- 空值（`null / undefined / ''`）统一显示为 `-`。
- 图片类型依赖 `AhImagePreview`，默认 `width` / `height` 为 `50`，`relField` 默认 `'id'`。
- 建议为 `columns` 提供有效的 `dataIndex`，确保字段取值和渲染 key 稳定。