---
title: FileBox 文件盒
toc: content
group:
  title: 数据展示
  order: 2
---

# FileBox 文件盒

## 何时使用

当需要提供文件下载功能时，无论是图片（如jpg、png）还是其他文件类型（如txt、pdf）。

## 代码演示

### 示例 1：展示图片文件

展示一个图片文件，点击图片即可下载。

```tsx
import React from 'react';
import FileBox from './';

const App = () => {
  const fileList = [
    { fileId: '1', fileName: 'example.jpg', filePath: 'https://th.bing.com/th/id/OIP.Y3IxBKKM0e-_w8ZX1GoPvgHaD4?rs=1&pid=ImgDetMain', type: 'image/jpeg', suffix: 'jpg' }
  ];

  return (
    <div style={{ display: 'flex' }}>
      <FileBox fileList={fileList} />
    </div>
  );
};

export default App;
```

### 示例 2：展示非图片文件并提供下载方法

展示一个PDF文件，并且需要传入下载方法来处理文件下载。

```tsx
import React from 'react';
import FileBox from './';

const App = () => {
  const fileList = [
    { fileId: '2', fileName: 'document.pdf', filePath: 'https://th.bing.com/th/id/OIP.Y3IxBKKM0e-_w8ZX1GoPvgHaD4?rs=1&pid=ImgDetMain', type: 'application/pdf', suffix: 'pdf' }
  ];

  const handleDownload = (file: { id: string }) => {
    console.log(`Downloading file with ID: ${file.id}`);
    // 实际下载逻辑应实现此处
  };

  return (
    <div style={{ display: 'flex' }}>
      <FileBox
        fileList={fileList}
        downloadFile={handleDownload}
      />
    </div>
  );
};

export default App;
```

### 示例 3：带删除功能的文件展示

展示文件并允许用户删除文件，点击删除按钮会触发删除操作。

```tsx
import React from 'react';
import FileBox from './';

const App = () => {
  const fileList = [
    { fileId: '3', fileName: 'example.txt', filePath: 'https://th.bing.com/th/id/OIP.Y3IxBKKM0e-_w8ZX1GoPvgHaD4?rs=1&pid=ImgDetMain', type: 'text/plain', suffix: 'txt' }
  ];

  const handleDelete = (file: { id: string }) => {
    console.log(`Deleting file with ID: ${file.id}`);
    // 实际删除逻辑应实现此处
  };

  return (
    <div style={{ display: 'flex' }}>
      <FileBox
        fileList={fileList}
        showDelete={true}
        deleteFile={handleDelete}
      />
    </div>
  );
};

export default App;
```

## FAQ

**Q: `downloadFile` 方法的作用是什么？**

A: `downloadFile` 方法用于处理非图片类型文件的下载。对于图片类型文件，可以直接使用 URL 进行下载，而非图片文件则需要通过该方法提供具体的下载逻辑。

**Q: `showDelete` 和 `deleteFile` 是什么？**

A: `showDelete` 用于控制是否显示删除按钮。如果设置为 `true`，组件会显示删除按钮。`deleteFile` 是删除操作的回调函数，用于处理文件删除的实际逻辑。

**Q: 如何处理自定义样式？**

A: 通过 `styles` 属性可以传入自定义的样式来改变组件的外观。此属性是 `React.CSSProperties` 类型，可以直接传入样式对象。

---
