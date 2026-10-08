---
title: AsyncCascader 异步级联
toc: content
group:
  title: 数据录入
  order: 3
demo:
  cols: 2
---

# AsyncCascader 异步级联

### 异步多级联动组件

```jsx
import React from 'react';
import { Space } from 'antd';
import { request } from '@allahjs/utils';
import Index from './index';

const getAsyncDta = (adminCode = '000000') => {
  return request('http://theling.top:9002/admin-service/api/comm/asyncAntTree', {
    params: {
      adminCode
    },
    method: 'get'
  });
};

const defValue = [
  {
    label: '北京市',
    value: '110000',
    description: '我是简要描述'
  }
];

export default () => {
  return <Index value={defValue} asyncReq={getAsyncDta} label="区域" />;
};
```

### 在筛选中使用

<code src="./demo/LightFilter.tsx"></code>

### 在表单中使用1

```jsx
import React from 'react';
import { Space, Form, Button } from 'antd';
import { request } from '@allahjs/utils';
import AsyncCascader from './index';

const getAsyncDta = (pcode) => {
  return request('http://theling.top:9002/cloud-service/cross/industry/asyncAntTree', {
    params: {
      pcode
    },
    method: 'get'
  });
};

const defValue = [
  {
    label: '选项1选项1选项',
    value: '1',
    description: '我是简要描述'
  }
];

export default () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // 禁用配置
  const [disabled, setDisabled] = React.useState(false);

  return (
    <>
      <Button onClick={() => setDisabled(!disabled)}>{disabled ? '启用' : '禁用'}</Button>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="list" name="list" rules={[{ required: true, message: '这个是必填的!' }]}>
          <AsyncCascader
            asyncReq={getAsyncDta}
            disabled={disabled}
            showTips={false}
            cascaderProps={{ multiple: true }}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
```

### 在表单中使用2

```jsx
import React from 'react';
import { Space, Form, Button } from 'antd';
import { request } from '@allahjs/utils';
import AsyncCascader from './index';

const getAsyncDta = (pcode) => {
  return request('http://theling.top:9002/cloud-service/cross/industry/asyncAntTree', {
    params: {
      pcode
    },
    method: 'get'
  });
};

const defValue = [
  {
    label: '选项1选项1选项',
    value: '1',
    description: '我是简要描述'
  }
];

export default () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="list" name="list" rules={[{ required: true, message: '这个是必填的!' }]}>
        <AsyncCascader asyncReq={getAsyncDta} placeholder="请选择" />
      </Form.Item>
      <Form.Item label="list2" name="list2" rules={[{ required: true, message: '这个是必填的!' }]}>
        <AsyncCascader bordered={false} asyncReq={getAsyncDta} placeholder="请选择" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
```

<API src="./index.tsx"></API>

## AhProFormCascader 表单级联

包了一层 `ProFormCascader`，用 `request` 拉第一级数据，展开时继续异步加载。不能靠它设置默认值；需要默认值时用弹窗选择。

```jsx
import React from 'react';
import { AhProFormCascader } from '@allahjs/antd';

export default () => (
  <AhProFormCascader
    name="region"
    label="地区"
    request={() => fetchRegions()}
  />
);
```

除 `request` 外，其余属性透传给 `ProFormCascader`。字段默认 `variant` 为 `borderless`，`changeOnSelect` 为 `true`。
