---
title: FileUpload2 文件上传
toc: content
group:
  title: 数据录入
  order: 3
---

# FileUpload2 文件上传

## 何时使用
`FileUpload2` 组件用于文件上传的场景，支持单个或多个文件的选择和上传。它允许用户选择文件，并在上传过程中显示上传进度。该组件也可以展示上传文件的预览，支持图片、PDF 和其他文档格式。

使用Ref的形式来对文件进行上传，组件会自动跳过已经上传过的文件

## 代码演示

### 示例 1：基本使用

```jsx
import React from 'react';
import FileUpload2 from './FileUpload2';

const BasicUpload = () => {
  const handleChange = (fileList) => {
    console.log('文件列表更新：', fileList);
  };

  return (
    <FileUpload2
      fileSize={2048000}  // 最大文件大小2MB
      maxNum={5}          // 最多上传5个文件
      onChange={handleChange}
    />
  );
};

export default BasicUpload;
```

### 示例 2：限制文件类型和大小

```jsx
import React from 'react';
import FileUpload2 from './FileUpload2';

const FileTypeUpload = () => {
  const handleChange = (fileList) => {
    console.log('文件列表更新：', fileList);
  };

  return (
    <FileUpload2
      fileSize={1048576}  // 最大文件大小1MB
      maxNum={3}          // 最多上传3个文件
      accept=".jpg,.png,.pdf"  // 仅接受图片和PDF文件
      onChange={handleChange}
    />
  );
};

export default FileTypeUpload;
```

### 示例 3：自定义上传按钮和预览功能

```jsx
import React from 'react';
import FileUpload2 from './FileUpload2';

const CustomUploadButton = ({ isDisabled, fileList }) => {
  return (
    <div>
      {isDisabled ? (
        <div>上传功能已禁用</div>
      ) : (
        <div>点击上传文件</div>
      )}
    </div>
  );
};

const CustomUpload = () => {
  const handleChange = (fileList) => {
    console.log('文件列表更新：', fileList);
  };

  const handleDownload = (file) => {
    console.log('下载文件：', file);
  };

  return (
    <FileUpload2
      fileSize={2048000}
      maxNum={5}
      customUploadRender={(isDisabled, fileList) => (
        <CustomUploadButton isDisabled={isDisabled} fileList={fileList} />
      )}
      onChange={handleChange}
      onDownload={handleDownload}
    />
  );
};

export default CustomUpload;
```

### 示例4：picture-card

```tsx
import { fileUpload2Usage } from '@allahjs/utils';
import FileUpload2 from './FileUpload2'

export default () => {
  return (
    <FileUpload2 usage={fileUpload2Usage.NORMAL} listType="picture-card" />
  )
}
```

### 示例5：默认值

```tsx
import { fileUpload2Usage } from '@allahjs/utils';
import FileUpload2 from './FileUpload2';
import { data } from './demo/config';

export default () => {
  return (
    <FileUpload2 value={data} usage={fileUpload2Usage.NORMAL} listType="picture" />
  )
}
```


### 示例6：text

```tsx
import { fileUpload2Usage } from '@allahjs/utils';
import FileUpload2 from './FileUpload2';

export default () => {
  return (
    <FileUpload2 usage={fileUpload2Usage.NORMAL} listType="text" />
  )
}
```

## FAQ

**Q: `FileUpload2` 组件支持哪些文件类型的预览？**

A: `FileUpload2` 组件支持图片文件、PDF 文件以及其他类型的文件。对于图片文件，组件会直接显示预览；对于 PDF 文件，组件会显示内嵌的 PDF 阅读器；对于其他类型的文件，组件会提供下载链接。

**Q: 组件如何处理文件大小限制？**

A: `FileUpload2` 组件会在文件选择之前检查文件大小。如果文件超出设置的最大大小限制，将显示错误提示，并阻止文件上传。

**Q: 如何自定义上传按钮的显示？**

A: 可以通过 `customUploadRender` 属性自定义上传按钮的显示方式。传入一个函数，该函数接收 `isDisabled` 和 `fileList` 作为参数，并返回自定义的上传按钮组件。

## FileImportModal 导入弹窗

在 `FileUpload2` 外面套一层导入弹窗。文件上传完成后把 `fileId` 交给 `importReq`，并用 `useScheduleRequest` 跟进异步任务进度。

```jsx
import React from 'react';
import { FileImportModal } from '@allahjs/antd';

export default () => (
  <FileImportModal
    label="导入"
    importReq={async (fileId) => {
      return importService.start(fileId);
    }}
  />
);
```

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `importReq` | 上传完成后的导入请求，返回异步任务 | `(fileId: string) => Promise<IAsyncTaskScheduleVo>` | - |
| `label` | 按钮文案 | `string` | - |
| `uploadProps` | 传给 `FileUpload2` 的配置 | `IUploadProps` | - |
| `icon` | 按钮图标 | `React.ReactNode` | - |
| `type` | 按钮类型 | `ButtonType` | - |
| `onClick` | 点击按钮时调用，返回 `true` 才打开弹窗 | `() => boolean` | - |
