---
title: ApiParameterEditor API 参数
toc: content
group:
  title: 数据录入
  order: 3
demo:
  cols: 1
author: 何奥
---

# ApiParameterEditor API 参数
 
用于编辑符合特定 OpenAPI 规范的 API 参数列表。界面采用表格化树形编辑：行内修改字段名、类型、传入方式和说明，用缩进表达嵌套。类型后的 `*` 表示必传，`N` 表示允许为 null。

## 何时使用 {#when-to-use}

需要以图形化界面定义或修改 API 接口参数时，特别是需要支持嵌套的对象和数组结构，并且可能需要自定义参数类型或传入方法的选项。

## 代码演示

### 基本使用

`onChange` 回调返回的是**未经转换**的原始表单数据。如果需要提交给符合特定 OpenAPI 规范的 API，通常需要先调用导出的 `transformParamsForApi` 函数进行转换。

```tsx
import React, { useState } from 'react';
import { ApiParameterEditor, transformParamsForApi } from '..'; // 引入转换函数
import { Button } from 'antd';

export default () => {
  // state 中存储的是原始表单数据
  const [rawValue, setRawValue] = useState<any[]>([
    {
      name: 'userId',
      description: '用户ID',
      type: 'number',
      in: 'query',
      required: true,
    },
    {
      name: 'userInfo',
      description: '用户信息',
      type: 'object',
      in: 'body',
      required: false, // 父对象是否必填
      properties: [
        {
          name: 'name',
          description: '姓名',
          type: 'string',
          required: true, // 子属性是否必填
        },
        {
          name: 'age',
          description: '年龄',
          type: 'number',
          required: false,
        },
        {
          name: 'address',
          description: '地址信息',
          type: 'object',
          required: true, // 子对象是否必填
          properties: [
            {
              name: 'street',
              description: '街道',
              type: 'string',
              required: false,
            },
            {
              name: 'city',
              description: '城市',
              type: 'string',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      description: '标签列表',
      type: 'array_object',
      in: 'body',
      required: false,
      items: { // 定义数组项结构
         properties: [
           {
             name: 'id',
             description: '标签ID',
             type: 'number',
             required: false,
           },
           {
             name: 'tagName',
             description: '标签名',
             type: 'string',
             required: true,
           },
         ],
      }
    }
  ]);

  // onChange 获取原始值
  const handleChange = (newRawValue: any[]) => {
    console.log('原始值 (onChange):', JSON.stringify(newRawValue, null, 2));
    setRawValue(newRawValue);
  };

  // 模拟提交前进行转换
  const handleSubmit = () => {
    const transformedData = transformParamsForApi(rawValue);
    console.log('转换后的值 (准备提交):', JSON.stringify(transformedData, null, 2));
    // 在这里可以将 transformedData 发送给 API
  };

  return (
    <>
      <ApiParameterEditor value={rawValue} onChange={handleChange} />
      <Button onClick={handleSubmit} style={{ marginTop: 16 }}>
        打印转换后的值到控制台 (模拟提交)
      </Button>
    </>
  );
};
```

### 自定义选项

自定义选项的用法不变，但 `onChange` 仍然返回原始值。

```tsx
import React, { useState } from 'react';
import { ApiParameterEditor, transformParamsForApi } from '..';
import { Tag, Button } from 'antd';

const customParamTypes = [
  { label: <Tag color="blue">字符串</Tag>, value: 'string' },
  { label: <Tag color="green">数字</Tag>, value: 'number' },
  { label: '自定义对象', value: 'object' }, // 保持 value 为 object 以启用嵌套
];

const customInOptions = [
  { label: 'URL参数 (Query)', value: 'query' },
  { label: '请求体 (Body)', value: 'body' },
];

export default () => {
  const [rawValue, setRawValue] = useState<any[]>([]);

  const handleChange = (newRawValue: any[]) => {
    console.log('自定义选项 - 原始值 (onChange):', JSON.stringify(newRawValue, null, 2));
    setRawValue(newRawValue);
  };

  const handleSubmit = () => {
    const transformedData = transformParamsForApi(rawValue);
    console.log('自定义选项 - 转换后的值 (准备提交):', JSON.stringify(transformedData, null, 2));
  };

  return (
    <>
      <ApiParameterEditor
        value={rawValue}
        onChange={handleChange}
        paramTypeOptions={customParamTypes}
        inOptions={customInOptions}
        title="自定义类型和传入方式"
      />
      <h4 style={{marginTop: 20}}>隐藏标题</h4>
      <ApiParameterEditor
        value={rawValue} // 复用上面的 state 仅作演示
        onChange={handleChange}
        paramTypeOptions={customParamTypes}
        inOptions={customInOptions}
        title={false} // 传入 false 隐藏标题
        showHeader={false}
      />
      <Button onClick={handleSubmit} style={{ marginTop: 16 }}>
        打印转换后的值 (模拟提交)
      </Button>
    </>

  );
};
```


## API

| 属性             | 说明                                                                 | 类型                                              | 默认值                           | 版本 |
| :--------------- | :------------------------------------------------------------------- | :------------------------------------------------ | :------------------------------- | :--- |
| value            | 表单的值，**原始结构** 的参数数组                                    | `any[]`                                           | -                                |      |
| onChange         | 表单值变化时的回调，返回 **原始结构** 的值                             | `(value: any[]) => void`                          | -                                |      |
| paramTypeOptions | 自定义"参数类型"下拉框的选项数组                                     | `IOptions7<string>[]`                             | 默认 OpenAPI 常见类型          |      |
| inOptions        | 自定义"传入方法"下拉框的选项数组                                     | `IOptions7<string>[]`                             | `[Query, Body, Header, Path]`    |      |
| title            | 组件标题，传入 `false` 可隐藏标题                                       | `React.ReactNode \| false`                       | '参数列表'                       |      |
| showHeader       | 兼容旧用法。树形布局不再展示列头，该属性不会影响界面                    | `boolean`                                         | `true`                           |      |

### `transformParamsForApi(params: any[]): any[]` (导出函数)

用于将 `ApiParameterEditor` 输出的原始参数数组转换为符合特定 OpenAPI 规范的格式，主要处理 `required` 字段：

- **对象类型 (`object`)**: 其顶层的布尔 `required` 字段会被移除，然后根据其 `properties` 中原始 `required` 为 `true` 的属性 `name` 生成一个新的 `required` 字符串数组。
- **数组对象类型 (`array_object`)**: 如果 `items` 包含 `properties` 数组，会类似地处理 `items.properties` 中的 `required`，并在 `items` 上生成 `required` 数组 (需确认 OpenAPI 规范)。顶层的布尔 `required` 会被移除。
- **其他类型**: 顶层的布尔 `required` 字段会被移除。

**注意：** 你需要在调用 API **之前** 手动调用此函数进行转换。

### 注意

- 该组件依赖 `@ant-design/pro-components`。
- 数据转换逻辑 `transformParamsForApi` 是根据一种常见的 OpenAPI 参数结构设计的，如果你的 API 期望不同的结构，可能需要调整转换逻辑或不使用此函数。
- 对于 `Array<Object>` 类型，`transformParamsForApi` 目前假设 `items` 是一个包含 `properties` 的对象，并会尝试转换其内部的 `required`。请根据实际 API 需求确认此行为是否符合预期。
- 当自定义 `paramTypeOptions` 时，请确保 `value` 值为 `object` 或 `array_object` 的选项仍然存在（如果需要支持嵌套结构），因为内部依赖这些 `value` 来判断是否渲染子列表。

## FAQ

**Q: `required` 字段的转换逻辑是怎样的？**

A: 请参考上面 `transformParamsForApi` 函数的说明。转换函数处理对象和数组对象内部的 `required`，并移除顶层的布尔 `required`。

**Q: 如何获取未经转换的原始表单值？**

A: 组件目前只通过 `onChange` 回调转换后的值。如果需要原始值，可以考虑修改组件逻辑，增加一个回调返回原始值。

**Q: `required` 字段的转换逻辑是怎样的？**

A: 对于类型为 `object` 的参数，其 `required` 字段会变成一个数组，列出其 `properties` 中所有 `required` 为 `true` 的属性的 `name`。其他参数（包括顶层参数）的布尔 `required` 字段会被移除。 