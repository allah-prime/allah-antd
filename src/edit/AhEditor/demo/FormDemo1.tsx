import { mockFileUploader, mockImgUploader } from '@allahjs/tiptap';
import { fileUpload2Usage } from '../../../theling-utils';
import { Form } from 'antd';
import React, { useState } from 'react';
import AhEditor, { IAhEditorRenderMode } from '../index';

export default () => {
  const [form] = Form.useForm();
  const [renderMode, setRenderMode] = useState<IAhEditorRenderMode>('normal');
  const [editable, setEditable] = useState(true);

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <select onChange={(e) => setRenderMode(e.target.value as IAhEditorRenderMode)}>
          <option value="normal">normal</option>
          <option value="gov">gov</option>
          <option value="custom">custom</option>
          <option value="block">block</option>
        </select>
        <button type="button" onClick={() => setEditable(!editable)}>
          {editable ? '切换只读' : '切换编辑'}
        </button>
      </div>
      <Form form={form}>
        <Form.Item name="content" label="正文">
          <AhEditor
            usage={fileUpload2Usage.NORMAL}
            permission="public"
            renderMode={renderMode}
            preview={!editable}
            editorOpt={{
              imageUploader: mockImgUploader,
              fileUploader: mockFileUploader
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
};
