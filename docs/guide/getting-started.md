---
nav: 研发
group:
  title: 介绍
  order: 0
order: 0
---

# 快速上手

本文将介绍如何在项目中使用 allah-antd。

## 环境准备

首先你需要有 [Node.js](https://nodejs.org/en/) 环境，推荐使用 Node.js 14.x 及以上版本。

## 安装

### 使用 pnpm 安装

```bash
# 使用 pnpm
$ pnpm add @allahjs/antd
```

如果你只需要使用部分功能，也可以只安装对应的子包：

```bash
# 只安装 UI 组件
$ pnpm install @allahjs/antd --save

# 只安装编辑器组件
$ pnpm install @allahjs/antd --save

# 只安装拖拽组件
$ pnpm install @allahjs/antd --save
```

## 示例

```jsx | pure
import React from 'react';
import { AhProTable } from '@allahjs/antd';
import { AhNotion } from '@allahjs/antd';
import { ListCards } from '@allahjs/antd';
import { fileUpload2Usage } from '@allahjs/antd';

const App = () => (
  <>
    {/* UI 组件示例 */}
    <AhProTable
      columns={[
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
      ]}
      request={async (params) => {
        // 模拟请求
        return {
          data: [
            { id: 1, name: '张三', age: 18 },
            { id: 2, name: '李四', age: 20 },
          ],
          success: true,
          total: 2,
        };
      }}
    />

    {/* 块编辑器示例 */}
    <AhNotion
      mode="md"
      usage={fileUpload2Usage.NORMAL}
      value="# Hello World"
      onChange={(value) => console.log(value)}
      permission="public"
    />

    {/* 拖拽组件示例 */}
    <ListCards
      items={[
        { id: 1, title: '卡片1' },
        { id: 2, title: '卡片2' },
      ]}
      renderItem={(item) => (
        <div>{item.title}</div>
      )}
      onChange={(items) => console.log(items)}
    />
  </>
);

export default App;
```
## 按需加载

allah-antd 支持基于 ES modules 的 tree shaking，直接引入组件即可，无需额外配置。

```jsx | pure
import { AhProTable } from '@allahjs/antd';
```

## 使用 TypeScript

allah-antd 使用 TypeScript 编写，提供了完整的类型定义文件。

```tsx | pure
import { AhProTable } from '@allahjs/antd';
import type { AhProTableProps } from '@allahjs/antd';

const App: React.FC = () => {
  const columns: AhProTableProps['columns'] = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
  ];

  return (
    <AhProTable
      columns={columns}
      request={async (params) => {
        // 模拟请求
        return {
          data: [
            { id: 1, name: '张三', age: 18 },
            { id: 2, name: '李四', age: 20 },
          ],
          success: true,
          total: 2,
        };
      }}
    />
  );
};

export default App;
```

## 主题定制

allah-antd 支持基于 Ant Design 的主题定制，你可以通过修改 Ant Design 的主题变量来定制组件的样式。

```jsx | pure
// 在 ConfigProvider 中配置主题
import { ConfigProvider } from 'antd';

const App = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1890ff',
      },
    }}
  >
    <YourApp />
  </ConfigProvider>
);
```

## 常见问题

### 如何解决依赖冲突？

如果你的项目中已经使用了 Ant Design，可能会出现依赖冲突的问题。建议使用 pnpm 作为包管理工具，它可以更好地处理依赖冲突。
