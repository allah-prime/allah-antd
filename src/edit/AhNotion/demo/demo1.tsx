import { mockFileUploader, mockImgUploader } from '@allahjs/tiptap';
import { fileUpload2Usage } from '../../../theling-utils';
import React, { useState } from 'react';
import AhNotion from '../index';

const INITIAL_MARKDOWN = `# AhNotion

输入 \`/\` 插入标题、列表、引用、代码块、图片和表格。划词后可设置加粗、高亮和对齐。

也可粘贴 / 拖放图片与文件（文档 Demo 使用 mock 上传；业务请走 AhAntdConfig）。

## 列表示例

- 无序列表
- 支持 Markdown 粘贴

1. 有序列表
2. 拖拽左侧句柄可调整块顺序

- [ ] 任务未完成
- [x] 任务已完成

> 划词会出现加粗、斜体、下划线、高亮、链接和对齐。

\`\`\`js
console.log('hello notion');
\`\`\`
`;

export default () => {
  const [value, setValue] = useState(INITIAL_MARKDOWN);
  const [editable, setEditable] = useState(true);

  return (
    <>
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => setEditable((v) => !v)}>
          {editable ? '切换为只读' : '切换为编辑'}
        </button>
      </div>
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: 8,
          minHeight: 420,
          background: '#fff',
          overflow: 'visible'
        }}
      >
        <AhNotion
          usage={fileUpload2Usage.NORMAL}
          mode="md"
          value={value}
          preview={!editable}
          onChange={setValue}
          permission="public"
          // 仅文档 Demo：本地 mock。业务环境删除 tideOpt 上传覆盖，使用 AhAntdConfig
          tideOpt={{
            imageUploader: mockImgUploader,
            fileUploader: mockFileUploader
          }}
        />
      </div>
    </>
  );
};
