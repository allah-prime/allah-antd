---
title: AhFormFilter 筛选表单
toc: content
group:
  title: 通用
  order: 1
---

# AhFormFilter 筛选表单

## 自定义表单筛选器

结合了 `LightFilter` 和 `BetaSchemaForm`，提供一个带有动态添加/移除筛选条件的表单筛选器。

## 何时使用 {#when-to-use}

- 当需要一个紧凑的筛选区域，但筛选条件较多时。
- 当需要用户可以自定义显示哪些筛选条件时。
- 当筛选条件分为常用（固定显示）和不常用（可选显示）两部分时。

## 代码演示

```tsx
import React, { useRef } from 'react';
import { AhFormFilter } from '..';
import type { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { Button } from 'antd';

interface FormData {
  name: string;
  status: 'open' | 'closed';
  created_at: string[];
  email: string;
  address: string;
  phone: string;
}

const columns: ProFormColumnsType<FormData>[] = [
  {
    title: '姓名',
    dataIndex: 'name',
    valueType: 'text',
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      open: '未解决',
      closed: '已解决',
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    valueType: 'text',
  },
  {
    title: '地址',
    dataIndex: 'address',
    valueType: 'text',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    valueType: 'text',
  },
];

const beforeCols: ProFormColumnsType<FormData>[] = [
 {
    title: '固定筛选',
    dataIndex: 'fixedFilter',
    valueType: 'text',
    formItemProps: {
      initialValue: '固定值'
    }
  },
]

export default () => {
  const formRef = useRef<ProFormInstance<FormData>>(undefined);
  const befFormRef = useRef<ProFormInstance<FormData>>(undefined);

  const handleFinish = async (values: FormData) => {
    console.log('表单提交:', values);
    // 合并两个表单的值
    const befValues = await befFormRef.current?.getFieldsValue();
    console.log('合并后的值:', { ...befValues, ...values });
    alert('提交成功，请看控制台输出');
  };

  const handleValuesChange = (changedValues: any, allValues: FormData) => {
     console.log('表单值变化:', changedValues, allValues);
     // 合并两个表单的值
     const befValues = befFormRef.current?.getFieldsValue();
     console.log('合并后的值:', { ...befValues, ...allValues });
  }

  return (
    <AhFormFilter<FormData>
      columns={columns}
      formRef={formRef}
      befFormRef={befFormRef}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
      defNum={2} // 默认显示前2个筛选条件
      disabledAttr={['name']} // 禁用 "姓名" 条件的选择
      beforeColumns={beforeCols} // 固定显示的筛选条件
      beforeForms={ <Button onClick={() => alert('Before Form Click')}>前置按钮</Button>} // 固定显示的额外内容
    />
  );
};
```

## API

| 参数          | 说明                                                                      | 类型                                                              | 默认值  |
| ------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------- |
| `defNum`      | 默认显示的筛选条件数量（从 `columns` 数组开头计算）                      | `number`                                                          | -       |
| `columns`     | 可选的筛选条件配置，基于 `@ant-design/pro-components` 的 `ProFormColumnsType` | `ProFormColumnsType<T>[]`                                         | `[]`    |
| `disabledAttr`| 禁用的筛选条件 `dataIndex` 列表，这些条件不能被移除或在 `AddFilter` 中勾选  | `string[]`                                                        | `[]`    |
| `onFinish`    | 表单提交（点击查询按钮）的回调                                                | `(values: T) => Promise<void>`                                   | -       |
| `onValuesChange` | 表单项值发生变化时的回调                                                  | `(changedValues: any, allValues: T) => void`                     | -       |
| `loading`     | 设置加载状态                                                              | `boolean`                                                         | `false` |
| `onFilter`    | 表单项值发生变化时的回调（功能同 `onValuesChange`）                          | `(values: T) => void`                                            | -       |
| `beforeForms` | 插入到固定筛选区域 (`LightFilter`) 的自定义 React 节点 (在 `beforeColumns` 之后) | `React.ReactNode`                                                 | -       |
| `beforeColumns`| 固定显示的筛选条件配置 (在 `LightFilter` 中, `beforeForms` 之前)        | `ProFormColumnsType<T>[]`                                         | `[]`    |
| `formRef`     | `BetaSchemaForm` (动态筛选部分) 的 `ref`                                  | `React.MutableRefObject<ProFormInstance<T> \| undefined>`          | -       |
| `befFormRef`  | `LightFilter` (固定筛选部分) 的 `ref`                                     | `React.MutableRefObject<ProFormInstance<T> \| undefined>`          | -       |
| `form`        | `BetaSchemaForm` (动态筛选部分) 的 `form` 实例 (用于外部控制)             | `FormInstance<T>`                                                 | -       |
| `befForm`     | `LightFilter` (固定筛选部分) 的 `form` 实例 (用于外部控制)                | `FormInstance<T>`                                                 | -       |

#### 注意

- `onFinish` 和 `onValuesChange` 回调函数的 `values` 参数仅包含当前触发事件的表单（`LightFilter` 或 `BetaSchemaForm`）的值。如果需要获取所有筛选条件的值，需要结合 `formRef` 和 `befFormRef` 手动获取。
- `AddFilter` 组件用于管理可选筛选条件的显示与隐藏，其选项根据 `columns` 动态生成。
- `beforeColumns` 和 `beforeForms` 用于定义固定显示在筛选区域头部的条件或元素。

## FAQ

**Q: 如何获取所有筛选条件的值？**

A: 在 `onFinish` 或 `onValuesChange` 回调中，可以通过 `formRef.current?.getFieldsValue()` 和 `befFormRef.current?.getFieldsValue()` 分别获取两个表单的值，然后合并它们。

**Q: 如何动态修改 `columns` 或 `beforeColumns`？**

A: 组件内部通过 `useEffect` 监听 `columns.length` 的变化来更新内部状态。如果需要动态修改 `columns` 或 `beforeColumns`，直接更新传入的 `props` 即可。请确保 `dataIndex` 的唯一性。

**Q: `onFilter` 和 `onValuesChange` 有什么区别？**

A: 在当前实现中，两者功能相同，都用于监听表单值的变化。可以根据语义选择使用。
