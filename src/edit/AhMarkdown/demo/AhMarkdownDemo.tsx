import { fileUpload2Usage } from '@allahjs/utils';
import { Button, Form } from 'antd';
import React, { useState } from 'react';
import AhMarkdown from '../index';

const Index = () => {
  const formRef = React.useRef<any>(undefined);
  const [previewText, setPreviewText] = useState<string>('');

  const onFinish = (values: any) => {
    setPreviewText(values.data1);
  };

  const setEditorValue = () => {
    const value =
      '## insert(content:string)\n' +
      '在光标处或者指定行+偏移量插入内容\n' +
      '>insert(\\`content\\`, \\`isSelect\\`, \\`anchor\\`, \\`focus\\`)\n' +
      '- \\`content\\` 被插入的文本\n' +
      '- \\`isSelect\\` 是否选中刚插入的内容，默认false，不选中\n' +
      '- \\`anchor\\` [x,y] 代表x+1行，y+1字符偏移量，默认false 会从光标处插入\n' +
      '- \\`focus\\` 保持编辑器处于focus状态，默认true，选中编辑器（用户可以继续输入）';
    formRef.current.setFieldsValue({
      data1: value
    });
  };

  return (
    <div>
      <Form
        ref={formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item name="data1" rules={[{ required: true, message: '内容不能为空!' }]}>
          <AhMarkdown
            style={{
              width: '100%',
              height: 500
            }}
            usage={fileUpload2Usage.NORMAL}
            id="AhMarkdown3"
            permission="public"
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Button type="primary" onClick={setEditorValue}>
        设置编辑器的值
      </Button>
      <h3>---------------------------预览---------------------------</h3>
      <AhMarkdown
        style={{
          width: '100%',
          height: 500
        }}
        id="AhMarkdown2"
        usage={fileUpload2Usage.NORMAL}
        value={previewText}
        preview
        permission="public"
      />
    </div>
  );
};

export default Index;
