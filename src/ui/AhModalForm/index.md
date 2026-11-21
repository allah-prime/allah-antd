---
title: AhModalForm 表单弹窗
toc: content
group:
  title: 通用
  order: 1
---

# AhModalForm 表单弹窗

基于 Ant Design ProForm 的整表单弹窗，适用于新增记录和整单编辑。校验通过后，`onFinish(values)` 接收整份表单数据。已有记录的详情查看和行内修改使用 `AhFormDetail`。

## 一体弹窗（列配置模式）

传入 `columns` 和 `dataSource` 后，AhModalForm 内部渲染 `AhFormDetail`，**详情、编辑、新增共用同一个弹窗**，适合字段不多（10 个及以下）、没有明细表和页签的档案，不再需要抽屉加另开的编辑弹窗。老的 `children` 用法不变。

- **详情态**（`view`）：只读，底栏「关闭」、`viewFooter` 里的额外按钮、「编辑」。`canEdit={false}` 时不显示「编辑」。
- **编辑态**（`edit`）：点「编辑」切换，底栏「取消」「保存」。取消回到详情态并丢弃草稿；保存成功回到详情态，显示 `onSave` 返回的新记录（返回 `true` 则把已提交值合并进当前记录）。
- **新增态**（`create`）：不传 `dataSource`，直接是空表单。取消直接关闭，保存成功后关闭。
- 宽度按字段数自动取：6 个及以下一栏 400px，7–10 个两栏 640px，更多三栏 `min(75vw, 1280px)`；可用 `column`、`width` 覆盖。
- 内置：紧凑底栏、关闭后销毁内容、编辑和新增态点遮罩不关闭、保存中防重复提交、校验失败保留输入并在字段上提示、`onSave` 抛错时用全局 message 提示并保持当前状态。
- 打开方式：调用方用 `defaultMode` 决定每次打开的起点（点行传 `view`，点新增传 `create`，列表里的「编辑」传 `edit`），换记录用 `dataSource`。
- test id：弹窗根节点 `<testId>-modal`（带 `data-mode="view|edit|create"`），编辑按钮 `<testId>-edit`，底栏按钮 `modal-ok`、`modal-cancel`。

<code src="./demo/ColumnsDemo.tsx"></code>

## 特性

- 基于 ProForm 和 Modal 组件封装
- 支持表单验证和提交
- 提供完整的类型定义
- 支持自定义触发器
- 支持表单重置和自动填充

> 注意 onCancel 和 setVisible 不要一起使用！！！

## 代码演示

### 基础用法

如果你不需要额外的操作表单，可以删除formRef的定义

```tsx
import React, { useRef } from 'react';
import AhModalForm from './';
import { Button } from 'antd';
import { ProFormText, ProFormInstance } from '@ant-design/pro-components';

export default () => {
  const [visible, setVisible] = React.useState(false);

  const formRef = useRef<ProFormInstance>(undefined);

  const onFinish = async (values) => {
    console.log(values);
    return true; // 返回 true 将自动关闭弹窗
  };

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开表单
      </Button>
      <AhModalForm
        formRef={formRef}
        title="基础表单"
        visible={visible}
        onCancel={() => {
          setVisible(false)
          formRef.current?.resetFields();
        }}
        onFinish={onFinish}
        initialValues={{}}
      >
        <ProFormText
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        />
      </AhModalForm>
    </>
  );
};
```

### 集成增删改

```tsx
import React, { useRef, useState } from 'react';
import { ProFormText, ProFormInstance } from '@ant-design/pro-components';
import { Button, Input, Table, Space, message } from 'antd';
import AhModalForm from './';

interface IUserForm {
  id?: number;
  username: string;
  email: string;
  password: string;
}

const AddUserModal: React.FC = () => {
  const formRef = useRef<ProFormInstance>(undefined);
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState<IUserForm[]>([]);
  const [editingUser, setEditingUser] = useState<IUserForm | null>(null);

  const handleFinish = async (values: IUserForm) => {
    console.log('提交的用户信息:', values);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingUser) {
      setUsers(prev => prev.map(user => (user.id === editingUser.id ? { ...values, id: editingUser.id } : user)));
      message.success('用户信息已更新');
    } else {
      setUsers(prev => [...prev, { ...values, id: Date.now() }]);
      message.success('用户已添加');
    }
    setVisible(false);
    setEditingUser(null)
    return true;
  };

  const handleEdit = (user: IUserForm) => {
    setEditingUser(user);
    setVisible(true);
  };

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    message.success('用户已删除');
  };
  
  console.log('visible', visible)

  return (
    <div>
      <Button type="primary" onClick={() => { setEditingUser(null); setVisible(true); }}>新增用户</Button>
      <Table dataSource={users} columns={[
        { title: '用户名', dataIndex: 'username', key: 'username' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        {
          title: '操作',
          key: 'action',
          render: (_: any, record: IUserForm) => (
            <Space>
              <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
              <Button type="link" danger onClick={() => handleDelete(record.id!)}>删除</Button>
            </Space>
          ),
        },
      ]} rowKey="id" style={{ marginTop: 16 }} />

      <AhModalForm<IUserForm>
        key={editingUser?.id || 'new'}
        title={editingUser ? "编辑用户" : "新增用户"}
        visible={visible}
        setVisible={setVisible}
        formRef={formRef}
        initialValues={editingUser || { username: '', email: '' }}
        onFinish={handleFinish}
      >
        <ProFormText
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
        />
      </AhModalForm>
    </div>
  );
};

export default AddUserModal;
```

### 使用触发器

```tsx
import React from 'react';
import { AhModalForm } from '..';
import { Button } from 'antd';
import { ProFormText } from '@ant-design/pro-components';

export default () => {
  const onFinish = async (values) => {
    console.log(values);
    return true;
  };

  return (
    <AhModalForm
      title="触发器示例"
      trigger={<Button type="primary">点击打开</Button>}
      onFinish={onFinish}
      initialValues={{}}
    >
      <ProFormText name="name" label="姓名" />
    </AhModalForm>
  );
};
```

## API

### AhModalForm

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modalProps | 弹窗属性配置 | `IAhModalProps` | - |
| width | 弹窗宽度 | `number \| string` | - |
| size | 弹窗大小 | `SizeType` | - |
| title | 弹窗标题 | `React.ReactNode` | - |
| visible | 是否显示 | `boolean` | - |
| setVisible | 设置显示状态的函数 | `(v: boolean) => void` | - |
| onOk | 确定按钮点击回调 | `() => void` | - |
| onCancel | 取消按钮点击回调 | `() => void` | - |
| onFinish | 表单提交回调，返回 true 时自动关闭弹窗 | `(v: T) => Promise<boolean>` | - |
| initialValues | 表单初始值（必传） | `T` | - |
| children | 表单内容 | `React.ReactNode` | - |
| trigger | 触发器 | `React.ReactElement` | - |
| formRef | 表单实例引用 | `React.MutableRefObject<ProFormInstance>` | - |
| onInit | 表单初始化完成回调 | `(values: T, form: ProFormInstance) => void` | - |
| onValuesChange | 表单值变化回调 | `(changedValues: Partial<T>, values: T) => void` | - |

### 列配置模式属性

传入 `columns` 后生效，`children`、`initialValues`、`onFinish` 不再使用。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 字段配置，传入即启用列配置模式 | `IAhFormDetailColumn<T>[]` | - |
| dataSource | 当前记录，新增时不传 | `T` | - |
| visible | 是否显示 | `boolean` | `false` |
| onCancel | 关闭弹窗（取消、关闭、遮罩、新增保存成功），由调用方把 `visible` 置为 `false` | `() => void` | - |
| defaultMode | 每次打开的初始状态 | `'view' \| 'edit' \| 'create'` | 有 `dataSource` 为 `view`，否则 `create` |
| mode / onModeChange | 受控状态与切换回调 | `IAhModalFormMode` / `(mode) => void` | - |
| canEdit | 详情态是否显示「编辑」 | `boolean` | `true` |
| onSave | 保存；返回 `false` 保持当前状态，返回对象刷新详情态，抛错会提示 | `(values, mode) => Promise<boolean \| T \| void>` | - |
| title / subTitle | 标题与灰色辅助文字，可按 `{ mode, record }` 返回 | `ReactNode \| (ctx) => ReactNode` | - |
| viewFooter | 详情态底栏额外按钮 | `ReactNode \| (ctx) => ReactNode` | - |
| viewExtra | 详情态字段下方的额外内容 | `ReactNode \| (ctx) => ReactNode` | - |
| column | 栏数 | `1 \| 2 \| 3` | 按字段数计算 |
| width | 弹窗宽度 | `number \| string` | 按栏数计算 |
| okText / cancelText / closeText / editText | 按钮文字 | `ReactNode` | 保存 / 取消 / 关闭 / 编辑 |
| testId | test id 前缀 | `string` | `ah` |
| formRef | 内部表单实例 | `IAhFormRef` | - |
| formDetailProps | 透传给 AhFormDetail 的其他属性 | `Partial<IAhFormDetailProps<T>>` | - |
| modalProps | 覆盖 AhModal 属性 | `IAhModalProps` | - |

### 注意事项

1. 经典用法下 `initialValues` 为必传参数，用于防止第一次渲染没有值的情况
2. `onFinish` 返回 `true` 时会自动关闭弹窗
3. 组件内部会自动处理表单的重置操作
4. 支持通过 `formRef` 获取表单实例进行操作
