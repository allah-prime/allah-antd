---
toc: content
group:
  title: 数据录入
  order: 1
demo:
  cols: 2
---

# 异步下拉搜索组件

## 何时使用

- 需要一个异步下拉搜索组件时
- 需要一个下拉搜索组件，但是需要防抖

## 示例


```jsx
import React from 'react';
import {Space, Form, Button} from 'antd';
import {zlrequest} from '../../theling-utils';
import DebounceSelect from './index';

const getAsyncDta = (keywrod) => {
  return zlrequest('http://theling.top:9002/ent-basic-data-service/api/comm/cross/depart/opt7List', {
    params: {
      keywrod,
      pageNum: 1,
      pageSize: 10
    },
    manner: 'json'
  }).then(res => res.map(i => ({...i, isLeaf: !i.isLeaf})));
}

const defValue = [
  {
    label: '选项1选项1选项',
    value: '1',
    description: '我是简要描述',
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
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="list"
          name="list"
          rules={[{required: true, message: '这个是必填的!'}]}
        >
          <DebounceSelect placeholder="请输入关键词进行搜索" fetchOptions={getAsyncDta} />
        </Form.Item>
        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
```
