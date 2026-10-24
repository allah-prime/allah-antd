---
title: AhFilePreview 文件预览
toc: content
group:
  title: 数据展示
  order: 2
---

# AhFilePreview 文件预览

按文件 ID 或文件对象预览附件。图片走 `AhImageRender`，PDF 和 Word 在弹窗里打开。

## 何时使用

- 列表或详情里要点开附件
- 同时有图片、PDF、Word 等格式
- 文件地址需要通过 `fileId` 换签名 URL

## 代码演示

```jsx
import React from 'react';
import { AhFilePreview } from '@allahjs/antd';

export default () => <AhFilePreview fileIds={['file-id-1', 'file-id-2']} width={600} height={600} />;
```

默认通过 `AhAntdConfig.getUploadConfig().getSignUrlByFileId` 换预览地址。也可以传入 `request` 自己取文件信息，或直接给带 `previewUrl` 的 `fileList`。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `fileIds` | 文件 ID 列表 | `string[]` | - |
| `fileList` | 文件对象列表，优先于 `fileIds` | `IFileObjVoBase[]` | - |
| `width` | 预览宽度 | `number` | `600` |
| `height` | 预览高度 | `number` | `600` |
| `request` | 按文件 ID 换文件信息 | `(fileIds: string[]) => Promise<IFileObjVoBase[]>` | 全局上传配置 |
| `style` | 容器样式 | `React.CSSProperties` | - |
