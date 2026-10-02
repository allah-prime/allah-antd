import { mockFileUploader, mockImgUploader } from '@allahjs/tiptap';
import { fileUpload2Usage } from '../../../theling-utils';
import React, { useState } from 'react';
import AhEditor, { IAhEditorMode, IAhEditorRenderMode } from '../index';

const buttonStyle = {
  margin: '0 10px',
  padding: '5px 10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default () => {
  const [value, setValue] = useState<any>('Hello **AhEditor**');
  const [mode, setMode] = useState<IAhEditorMode>('md');
  const [editable, setEditable] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [renderMode, setRenderMode] = useState<IAhEditorRenderMode>('normal');

  return (
    <>
      <div>
        <span>渲染模式</span>&nbsp;
        <select onChange={(e) => setRenderMode(e.target.value as IAhEditorRenderMode)}>
          <option value="normal">normal</option>
          <option value="gov">gov</option>
          <option value="custom">custom</option>
          <option value="block">block（块编辑）</option>
        </select>
        <button type="button" onClick={() => setEditable(!editable)}>
          {editable ? '切换只读' : '切换编辑'}
        </button>
        <button type="button" onClick={() => setBordered(!bordered)}>
          {bordered ? '边框模式' : '无边框'}
        </button>
      </div>
      <AhEditor
        usage={fileUpload2Usage.NORMAL}
        permission="public"
        mode={mode}
        value={value}
        onChange={setValue}
        preview={!editable}
        renderMode={renderMode}
        bordered={bordered}
        editorOpt={{
          imageUploader: mockImgUploader,
          fileUploader: mockFileUploader
        }}
      />
      <div style={{ marginTop: 12 }}>
        <button type="button" style={buttonStyle} onClick={() => setMode('md')}>
          md 模式（默认）
        </button>
        <button type="button" style={buttonStyle} onClick={() => setMode('html')}>
          html 模式
        </button>
        <button type="button" style={buttonStyle} onClick={() => setMode('json')}>
          json 模式
        </button>
      </div>
      <pre style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
        {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
      </pre>
    </>
  );
};
