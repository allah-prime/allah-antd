---
toc: content
group:
  title: 数据录入
  order: 1
demo:
  cols: 2
---

# 异步多级联动组件

### 异步多级联动组件

```jsx
import React from 'react';
import { Space } from 'antd';
import { zlrequest } from '../../theling-utils';
import Index from './index';

const getAsyncDta = (adminCode = '000000') => {
  return zlrequest('http://theling.top:9002/admin-service/api/comm/asyncAntTree', {
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
import { zlrequest } from '../../theling-utils';
import AsyncCascader from './index';

const getAsyncDta = (pcode) => {
  return zlrequest('http://theling.top:9002/cloud-service/cross/industry/asyncAntTree', {
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
import { zlrequest } from '../../theling-utils';
import AsyncCascader from './index';

const getAsyncDta = (pcode) => {
  return zlrequest('http://theling.top:9002/cloud-service/cross/industry/asyncAntTree', {
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
