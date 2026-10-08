---
toc: content
group:
  title: 数据录入
  order: 1
---
# AhEditModal
编辑弹窗

### 组件简介

**英文名称**: AhEditModal  
**中文名称**: 编辑弹窗

**简介**: AhEditModal 是一个固定左右分栏布局（左 16 编辑区 / 右 8 配置区）的弹窗外壳，基于 `AhModal`，适用于详情编辑类场景。组件本身不创建表单实例，表单由调用方在外层使用 antd `Form` 管理（见下方 FAQ）。

> 与 `AhModalForm` 的区别：`AhModalForm` 基于 ProForm 自带表单状态机（对齐 pro-components 的 `ModalForm`，配合 `useAhModalForm` 使用）；`AhEditModal` 只是编辑弹窗的布局壳，表单完全自理。需要现成的表单弹窗用 `AhModalForm`，需要自定义左右分栏编辑布局用 `AhEditModal`。

## 何时使用
当你需要一个「左侧正文编辑 + 右侧元信息配置」的弹窗布局时使用这个组件。表单校验与提交由外层 antd `Form` 完成。

## 代码演示

### 示例 1: 基本用法
这是一个最简单的使用示例，它展示了如何创建一个基本的 AhEditModal 弹窗，里面包含了一个表单内容。

```jsx
import React, { useState } from 'react';
import AhEditModal from './';
import { Button } from 'antd';

const BasicExample = () => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);
  const handleOk = () => {
    console.log('点击确认');
    handleClose();
  };

  return (
    <div>
      <Button type="primary" onClick={handleOpen}>打开表单弹窗</Button>
      {visible && (
        <AhEditModal
          modalProps={{ open: visible }}
          onCancel={handleClose}
          onOk={handleOk}
          headerRender="基本表单弹窗"
          leftContentRender={<div style={{ padding: 16 }}>这里放你的表单内容</div>}
          rightRender={<div style={{ padding: 16 }}>这里放右侧配置区</div>}
        />
      )}
    </div>
  );
};

export default BasicExample;
```

### 示例 2: 自定义宽度和高度
在这个示例中，我们展示了如何自定义弹窗的宽度和高度。

```jsx
import React, { useState } from 'react';
import AhEditModal from './';
import { Button } from 'antd';

const CustomSizeExample = () => {
  const [visible, setVisible] = useState(false);

  const handleOpen = () => setVisible(true);
  const handleClose = () => setVisible(false);
  const handleOk = () => {
    console.log('点击确认');
    handleClose();
  };

  return (
    <div>
      <Button type="primary" onClick={handleOpen}>打开自定义尺寸弹窗</Button>
      {visible && (
        <AhEditModal
          modalProps={{ open: visible }}
          onCancel={handleClose}
          onOk={handleOk}
          width={800}
          height={600}
          headerRender="自定义尺寸表单弹窗"
          leftContentRender={<div style={{ padding: 16 }}>左侧内容</div>}
          rightRender={<div style={{ padding: 16 }}>右侧内容</div>}
        />
      )}
    </div>
  );
};

export default CustomSizeExample;
```

### 示例 3: 政策法规信息标记（全功能）
业务场景：弹窗顶部录入企业名称；左侧录入政策摘要、政策长文本；右侧录入发布时间、发布部门等元信息。

```jsx
import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, Select, Space, Tag, Typography, message } from 'antd';
import AhEditModal from './';

const { TextArea } = Input;

const PolicyMarkingExample = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOpen = () => {
    setOpen(true);
    setReqLoading(true);

    setTimeout(() => {
      form.setFieldsValue({
        enterpriseName: '杭州星云科技有限公司',
        policySummary: '本政策针对高新技术企业研发投入给予税收优惠，并明确申报窗口与材料要求。',
        publishDepartment: '省工业和信息化厅',
        policyLevel: '省级',
      });
      setReqLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log('政策法规标记结果：', values);
      message.success('保存成功');
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={handleOpen}>政策法规信息标记</Button>

      <Form form={form} layout="vertical">
        <AhEditModal
          width="88%"
          height="80vh"
          reqLoading={reqLoading}
          loading={loading}
          onOk={handleSubmit}
          onCancel={handleClose}
          open={open}
          headerRender={
            <Space>
              <Tag color="blue">政策标记</Tag>
              <Typography.Text type="secondary">
                请先确认企业主体，再补充政策正文与发布信息
              </Typography.Text>
            </Space>
          }
          titleRender={
            <Form.Item
              name="enterpriseName"
              label="企业名称"
              rules={[{ required: true, message: '请输入企业名称' }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="例如：杭州星云科技有限公司" />
            </Form.Item>
          }
          linkButtonRender={
            <Space>
              <Button size="small" onClick={() => message.info('已同步摘要到知识库')}>同步知识库</Button>
              <Button size="small" onClick={() => message.info('已生成标签建议')}>智能打标</Button>
            </Space>
          }
          leftContentRender={
            <>
              <Form.Item
                name="policySummary"
                label="政策摘要"
                rules={[{ required: true, message: '请输入政策摘要' }]}
              >
                <TextArea rows={6} placeholder="提炼政策核心条款、适用对象和扶持方式" />
              </Form.Item>

              <Form.Item
                name="policyContent"
                label="政策长文本"
                rules={[{ required: true, message: '请输入政策长文本' }]}
              >
                <TextArea rows={18} placeholder="粘贴政策正文，用于后续结构化抽取与问答" />
              </Form.Item>
            </>
          }
          rightRender={
            <>
              <Form.Item
                name="publishDate"
                label="发布时间"
                rules={[{ required: true, message: '请选择发布时间' }]}
              >
                <DatePicker style={{ width: '100%' }} placeholder="请选择发布时间" />
              </Form.Item>

              <Form.Item
                name="publishDepartment"
                label="发布部门"
                rules={[{ required: true, message: '请输入发布部门' }]}
              >
                <Input placeholder="例如：省工业和信息化厅" />
              </Form.Item>

              <Form.Item name="policyNo" label="文号">
                <Input placeholder="例如：浙经信发〔2026〕12号" />
              </Form.Item>

              <Form.Item
                name="policyLevel"
                label="政策级别"
                rules={[{ required: true, message: '请选择政策级别' }]}
              >
                <Select
                  placeholder="请选择政策级别"
                  options={[
                    { label: '国家级', value: '国家级' },
                    { label: '省级', value: '省级' },
                    { label: '市级', value: '市级' },
                    { label: '区县级', value: '区县级' },
                  ]}
                />
              </Form.Item>
            </>
          }
        />
      </Form>
    </>
  );
};

export default PolicyMarkingExample;
```

API

AhEditModal

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modalProps | 覆盖弹窗设置，继承自 antd Modal 和 AhModal 的所有属性 | ModalProps & IAhModalProps | - |
| open | 是否显示弹窗（等价于 modalProps.open） | boolean | - |
| visible | 是否显示弹窗（兼容旧写法，等价于 open） | boolean | - |
| width | 弹窗宽度 | number \| string | - |
| height | 弹窗高度 | number \| string | - |
| leftContentRender | 左侧内容区域渲染 | React.ReactNode \| React.ReactNode[] | - |
| leftContentRenderFun | 左侧内容区域渲染函数 | () => React.ReactNode \| React.ReactNode[] | - |
| linkButtonRender | 快捷按钮渲染 | React.ReactNode \| React.ReactNode[] | - |
| linkButtonRenderFun | 快捷按钮渲染函数 | () => React.ReactNode \| React.ReactNode[] | - |
| headerRender | 头部渲染 | React.ReactNode \| React.ReactNode[] | - |
| headerRenderFun | 头部渲染函数 | () => React.ReactNode \| React.ReactNode[] | - |
| rightRender | 右侧内容渲染 | React.ReactNode \| React.ReactNode[] | - |
| rightRenderFun | 右侧内容渲染函数 | () => React.ReactNode \| React.ReactNode[] | - |
| footerRender | 底部渲染 | React.ReactNode \| React.ReactNode[] | - |
| titleRender | 标题渲染 | React.ReactNode \| React.ReactNode[] | - |
| onOk | 确认按钮点击回调 | () => void | - |
| onCancel | 取消按钮点击回调 | () => void | - |
| loading | 提交时的loading状态，启用时取消按钮会被禁用 | boolean | false |
| closable | 是否显示关闭按钮 | boolean | true |
| titleName | 标题的表单字段名 | string | 'title' |
| titleRequired | 标题是否必填 | boolean | true |
| titlePlaceholder | 标题输入框占位文本 | string | '请输入标题' |
| disabled | 是否禁用 | boolean | false |
| reqLoading | 加载数据时的loading状态 | boolean | false |
| domId | 节点的id | string | - |


## FAQ

**Q: 如何处理表单提交？**  
A: 推荐在外层使用 antd `Form`，并在 `onOk` 中通过 `form.validateFields()` 完成校验与提交。

**Q: 如何配置弹窗的其他属性？**  
A: 你可以使用 `modalProps` 属性来传递 `AhModal` 的配置项，例如 `footer`、`title` 等。
