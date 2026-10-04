---
nav:
  title: 编辑器
  order: 2
group:
  title: 介绍
  order: 0
order: 2
---

# 编辑器组件概述

`@allahjs/antd` 是 allah-antd 的编辑器组件包，提供了多种编辑器组件，满足不同的编辑需求。

## 组件列表

### 编辑器组件

- [AhEditor](/edits/ah-editor) - 通用富文本编辑器，基于 @allahjs/tiptap，`renderMode` 支持 gov / normal / custom / block
- [AhNotion](/edits/ah-notion) - **推荐** Notion 风格块编辑器
- [Monaco](/edits/monaco) - Monaco 编辑器，基于 Monaco Editor，提供 VS Code 级别的编辑体验
- [AhMarkdown](/edits/ah-markdown) - ~~已废弃~~，请改用 AhNotion

> **业务约定**：富文本只用 `AhEditor`（传统编辑）和 `AhNotion`（块编辑）。

## 安装

```bash
# 使用 pnpm
$ pnpm add @allahjs/antd
```

## 使用

```jsx | pure
import { AhEditor, AhNotion, MonacoEditor, configMonacoCDN } from './';
import { fileUpload2Usage } from '@allahjs/utils';

configMonacoCDN('https://your-cdn.com/monaco-editor/0.56.0/min/vs');

// 块编辑器（推荐）
function NotionEditor() {
  return (
    <AhNotion
      mode="md"
      usage={fileUpload2Usage.NORMAL}
      value="# Hello World"
      onChange={(value) => console.log(value)}
      permission="public"
    />
  );
}

// 公文 / 普通富文本
function RichTextEditor() {
  return (
    <AhEditor
      mode="html"
      usage={fileUpload2Usage.NORMAL}
      value="<p>Hello World</p>"
      onChange={(value) => console.log(value)}
      permission="public"
    />
  );
}

// 使用 Monaco 编辑器
function CodeEditor() {
  return (
    <MonacoEditor
      value="function hello() { console.log('Hello World'); }"
      language="javascript"
      onChange={(value) => console.log(value)}
    />
  );
}
```

## 特性

### AhNotion

AhNotion 是 Notion 风格块编辑器，具有以下特性：

- 输入 `/` 插入标题、列表、引用、代码块、图片和表格
- 划词弹出格式栏（加粗、高亮、对齐等）
- 左侧句柄拖拽重排块
- 默认按 Markdown 读写
- 等价于 `AhEditor` 的 `renderMode="block"`

### AhEditor

AhEditor 是基于 @allahjs/tiptap 的富文本编辑器，具有以下特性：

- 支持公文（gov）/ 普通（normal）/ 自定义（custom）渲染模式
- 支持 `renderMode="block"` 开启块编辑（业务推荐直接用 AhNotion）
- 支持 HTML / Markdown / JSON 读写
- 支持图片与文件上传
- 支持预览模式

### Monaco

Monaco 是一个基于 Monaco Editor 的代码编辑器，具有以下特性：

- 提供 VS Code 级别的编辑体验
- 支持多种编程语言
- 支持智能提示和自动补全
- 支持代码格式化
- 支持代码折叠
- 支持多光标编辑
- 支持搜索和替换
- 支持主题切换
- 支持通过自定义 CDN 加载 Monaco 静态资源，避免依赖外网

## Monaco CDN 配置

Monaco 依赖运行时静态资源。默认情况下会从外部 CDN 拉取资源；如果你的网络环境不稳定，建议在应用入口提前配置为你自己的 CDN。

```tsx | pure
import { configMonacoCDN } from './';

configMonacoCDN('https://your-cdn.com/monaco-editor/0.56.0/min/vs');
```

如果你需要同时设置国际化等 loader 选项，可以使用完整配置：

```tsx | pure
import { configMonacoLoader } from './';

configMonacoLoader({
  paths: { vs: 'https://your-cdn.com/monaco-editor/0.56.0/min/vs' },
  'vs/nls': { availableLanguages: { '*': 'zh-cn' } }
});
```

说明：`vs` 需要指向 `monaco-editor` 包中的 `min/vs` 目录。

## 配置

各编辑器组件支持丰富的配置项，详情请参考各组件的文档：

- [AhEditor 配置](/edits/ah-editor)
- [AhNotion 配置](/edits/ah-notion)
- [Monaco 配置](/edits/monaco#api)
