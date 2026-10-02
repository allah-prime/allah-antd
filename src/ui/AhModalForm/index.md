---
toc: content
group:
  title: 数据录入
  order: 1
---

# AhModalForm

这是一个基于 Ant Design ProForm 的模态表单组件，提供了更便捷的表单弹窗操作方式。

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

### 注意事项

1. `initialValues` 为必传参数，用于防止第一次渲染没有值的情况
2. `onFinish` 返回 `true` 时会自动关闭弹窗
3. 组件内部会自动处理表单的重置操作
4. 支持通过 `formRef` 获取表单实例进行操作
