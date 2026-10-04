---
toc: content
group:
  title: 展示
  order: 0
---
# AhImageRender
异步图片渲染组件

## 何时使用
`AhImageRender` 组件用于在 React 应用中异步加载和显示图片。它通过 `cosKey` 或 `fileId` 作为输入参数来请求图片的 URL 并显示该图片。适用于需要从远程服务或 CDN 动态获取图片链接的场景。

## 代码演示

### 示例 1: 使用 `cosKey` 渲染图片
```jsx
import React from 'react';
import AhImageRender from './';

const App = () => {
  // 使用 cosKey 来获取图片 URL
  const cosKey = 'example-cos-key';

  return (
    <div>
      <h2>图片展示</h2>
      <AhImageRender cosKey={cosKey} />
    </div>
  );
};

export default App;
```

### 示例 2: 使用 `fileId` 渲染图片
```jsx
import React from 'react';
import AhImageRender from './';

const App = () => {
  // 使用 fileId 来获取图片 URL
  const fileId = 'example-file-id';

  return (
    <div>
      <h2>图片展示</h2>
      <AhImageRender fileId={fileId} />
    </div>
  );
};

export default App;
```

### 示例 3: `cosKey` 和 `fileId` 的优先级
```jsx
import React from 'react';
import AhImageRender from './';

const App = () => {
  // 同时提供 cosKey 和 fileId，优先使用 cosKey
  const cosKey = 'example-cos-key';
  const fileId = 'example-file-id';

  return (
    <div>
      <h2>图片展示</h2>
      <AhImageRender cosKey={cosKey} fileId={fileId} />
    </div>
  );
};

export default App;
```

### 示例 4: 批量渲染

```jsx
import React from 'react';
import AhImagePreview from './AhImagePreview';

const App = () => {
  // 模拟获取文件列表的接口
  const mockGetFileByRelId = async ({ relId, busiScene }) => {
    // 模拟异步请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      { dbFileId: 'file-001', fileName: '图片1.png', fileSize: 1024 },
      { dbFileId: 'file-002', fileName: '图片2.png', fileSize: 2048 },
      { dbFileId: 'file-003', fileName: '图片3.png', fileSize: 1536 }
    ];
  };

  // 模拟获取签名URL的接口
  const mockGetSignUrlByFileId = async (fileId) => {
    // 模拟异步请求延迟
    await new Promise(resolve => setTimeout(resolve, 200));

    // 返回固定的图片URL
    return 'https://plugin.jyfwyun.com/home-log.png';
  };

  return (
    <div>
      <h2>批量图片预览</h2>
      <div>
        <AhImagePreview
          containerStyle={{
            height: 120,
            width: 250,
            border: '1px solid #eee',
            padding: 10,
            borderRadius: 12,
            overflowY: 'auto',
            // 超出 换行
            flexWrap: 'wrap'
          }}
          relId="test-rel-id-001"
          busiScene="demo-scene"
          maxCount={3}
          style={{ width: 100, height: 100, borderRadius: 12 }}
          getFileByRelId={mockGetFileByRelId}
          getSignUrlByFileId={mockGetSignUrlByFileId}
        />
      </div>
    </div>
  );
};

export default App;
```

### 示例 5: 使用全局配置的批量渲染

```jsx
import React from 'react';
import AhImagePreview from './AhImagePreview';

const App = () => {
  return (
    <div>
      <h2>使用全局配置的图片预览</h2>
      <AhImagePreview
        relId="test-rel-id-002"
        busiScene="global-config-scene"
        maxCount={0}
        style={{ width: 100, height: 100, borderRadius: '12px' }}
      />
    </div>
  );
};

export default App;
```

## API

### AhImageRender

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| cosKey | COS 对象存储的 key | `string` | - |
| fileId | 文件 ID | `string` | - |
| style | 图片样式 | `React.CSSProperties` | - |
| className | 自定义样式类名 | `string` | - |

### AhImagePreview

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| relId | 关联ID | `string` | - |
| busiScene | 业务场景 | `string` | - |
| imageStyle | 图片样式 | `React.CSSProperties` | `{ width: 200, height: 200, borderRadius: 10 }` |
| maxCount | 显示图片数量限制，0表示显示全部 | `number` | `0` |
| className | 自定义样式类名 | `string` | - |
| style | 容器样式 | `React.CSSProperties` | - |
| preview | 图片预览配置 | `boolean \| { visible?: boolean; onVisibleChange?: (visible: boolean) => void; }` | `true` |
| fallback | 图片加载失败时的占位图 | `string` | - |
| getFileByRelId | 根据关联ID获取文件列表的接口 | `(params: { relId: string; busiScene: string }) => Promise<any[]>` | - |
| getSignUrlByFileId | 根据文件ID获取签名URL的接口 | `(fileId: string) => Promise<string>` | - |

### AhImagePreviewRef

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| refresh | 刷新图片列表 | `() => Promise<void>` |
| imageUrls | 当前图片URL列表 | `string[]` |
| fileList | 当前文件列表 | `any[]` |

## FAQ

**Q: 如果同时传递了 `cosKey` 和 `fileId`，组件会怎么处理？**  
A: 组件会优先使用 `cosKey` 来请求图片 URL。如果 `cosKey` 不存在，则使用 `fileId`。

**Q: AhImagePreview 组件如何配置接口？**  
A: 有两种方式：1) 通过 props 传入 `getFileByRelId` 和 `getSignUrlByFileId` 接口；2) 使用全局配置 `AhAntdConfig.getUploadConfig()`。props 传入的接口优先级更高。

**Q: `AhAntdConfig.getUploadConfig()` 如何配置？**  
A: `AhAntdConfig.getUploadConfig()` 应返回一个包含 `getSigUrlByKey`、`getSignUrlByFileId` 和 `getFileByRelId` 方法的对象。这些方法用于根据不同参数获取签名 URL 或文件列表。

---
