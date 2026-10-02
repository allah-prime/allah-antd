import { mockFileUploader, mockImgUploader } from '@allahjs/tiptap';
import { fileUpload2Usage, updateMarkdownImgUrl } from '../../../theling-utils';
import { Button, Form, Input, Space, message } from 'antd';
import React, { useState } from 'react';
import AhNotion from '../index';

type FormValues = {
  title: string;
  content: string;
};

export default () => {
  const [form] = Form.useForm<FormValues>();
  const [formResult, setFormResult] = useState<FormValues | null>(null);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: '周报标题',
          content: '## 周报正文\n\n本周完成 Notion 风格编辑器接入。'
        }}
        onFinish={(values) => {
          // 业务保存前应将临时签换成 cosKey（此处演示调用）
          const content = updateMarkdownImgUrl(values.content);
          setFormResult({ ...values, content });
          message.success('表单已提交（content 已做 updateMarkdownImgUrl）');
        }}
      >
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="文档标题" />
        </Form.Item>
        <Form.Item
          label="正文"
          name="content"
          rules={[{ required: true, message: '请填写正文' }]}
        >
          <AhNotion
            usage={fileUpload2Usage.NORMAL}
            mode="md"
            permission="public"
            tideOpt={{
              imageUploader: mockImgUploader,
              fileUploader: mockFileUploader
            }}
            style={{
              minHeight: 220,
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              background: '#fff'
            }}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              提交表单
            </Button>
            <Button
              onClick={() => {
                form.setFieldsValue({
                  content: '## 从表单写入\n\n这是通过 Form.setFieldsValue 赋值的 Markdown。'
                });
              }}
            >
              表单写入 Markdown
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {formResult ? (
        <pre
          style={{
            marginTop: 12,
            padding: 12,
            background: '#fafafa',
            border: '1px solid #f0f0f0',
            borderRadius: 6,
            whiteSpace: 'pre-wrap'
          }}
        >
          {JSON.stringify(formResult, null, 2)}
        </pre>
      ) : null}
    </>
  );
};
