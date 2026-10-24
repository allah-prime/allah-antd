---
toc: content
group:
  title: 展示
  order: 1
---

# Monaco 编辑器组件

基于 Monaco Editor 的代码编辑器组件集合，支持多种编程语言和配置选项。

> 组件默认使用 Monaco 的运行时静态资源。如果你所在环境访问外网不稳定，建议在应用入口使用 `configMonacoCDN` 或 `configMonacoLoader` 切换到自有 CDN。

## 何时使用

- 需要在网页应用中集成代码编辑器时
- 需要支持多种编程语言语法高亮和自动补全
- 需要 JSON、SQL、JavaScript 等特定语言的格式化编辑
- 需要可配置的代码编辑功能

## 组件概览

### MonacoEditor - 统一编辑器组件

支持通过 `language` 参数配置不同语言模式的通用编辑器。

### 专用语言编辑器

- **MonacoJson**: JSON 编辑器，支持自动格式化
- **MonacoMysql**: MySQL 编辑器，支持 SQL 语法高亮和自动补全
- **MonacoText**: 纯文本编辑器

## 代码演示

### 示例 1: 统一 MonacoEditor 组件

```tsx
import React from 'react';
import { MonacoEditor } from '..';

const UnifiedEditor = () => {
  const [code, setCode] = React.useState('');

  return (
    <div>
      <h2>MySQL 编辑器</h2>
      <MonacoEditor language="mysql" value={code} onValueChange={setCode} height={300} />

      <h2>JSON 编辑器</h2>
      <MonacoEditor
        language="json"
        value='{"name": "example"}'
        onValueChange={setCode}
        height={200}
      />

      <h2>JavaScript 编辑器</h2>
      <MonacoEditor
        language="javascript"
        value="console.log('Hello World!');"
        onValueChange={setCode}
        height={200}
      />
    </div>
  );
};

export default UnifiedEditor;
```

### 示例 2: 基本 JSON 编辑器（使用专用组件）

```tsx
import React from 'react';
import { MonacoJson } from '..';

const BasicJsonEditor = () => {
  const [jsonValue, setJsonValue] = React.useState('{ "name": "John", "age": 30 }');

  return (
    <div>
      <h2>基本 JSON 编辑器</h2>
      <MonacoJson value={jsonValue} onValueChange={setJsonValue} />
    </div>
  );
};

export default BasicJsonEditor;
```

### 示例 3: MySQL 编辑器

```tsx
import React from 'react';
import { MonacoMysql } from '..';

const SqlEditor = () => {
  const [sql, setSql] = React.useState(`CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);`);

  return (
    <div>
      <h2>MySQL 编辑器</h2>
      <MonacoMysql value={sql} onValueChange={setSql} height={250} />
    </div>
  );
};

export default SqlEditor;
```

### 示例 4: 多语言编辑器

```tsx
import React from 'react';
import { MonacoEditor } from '..';

const MultiLanguageEditor = () => {
  const languages = [
    { key: 'text', name: '纯文本', defaultValue: '这是一段纯文本内容' },
    { key: 'json', name: 'JSON', defaultValue: '{"message": "Hello World"}' },
    { key: 'javascript', name: 'JavaScript', defaultValue: 'console.log("Hello World!");' },
    {
      key: 'typescript',
      name: 'TypeScript',
      defaultValue: 'const message: string = "Hello World";'
    },
    { key: 'html', name: 'HTML', defaultValue: '<div>Hello World</div>' },
    { key: 'css', name: 'CSS', defaultValue: 'body { margin: 0; }' },
    { key: 'yaml', name: 'YAML', defaultValue: 'name: app-config\nversion: 1.0.0' },
    { key: 'mysql', name: 'MySQL', defaultValue: 'SELECT * FROM users;' }
  ];

  const [selectedLanguage, setSelectedLanguage] = React.useState('text');
  const [code, setCode] = React.useState(languages[0].defaultValue);

  return (
    <div>
      <h2>多语言编辑器</h2>
      <select
        value={selectedLanguage}
        onChange={(e) => {
          setSelectedLanguage(e.target.value);
          const lang = languages.find((l) => l.key === e.target.value);
          setCode(lang?.defaultValue || '');
        }}
      >
        {languages.map((lang) => (
          <option key={lang.key} value={lang.key}>
            {lang.name}
          </option>
        ))}
      </select>

      <MonacoEditor language={selectedLanguage} value={code} onValueChange={setCode} height={300} />
    </div>
  );
};

export default MultiLanguageEditor;
```

### 示例 5: 自定义样式和选项

```tsx
import React from 'react';
import { MonacoEditor } from '..';

const CustomStyledEditor = () => {
  const [code, setCode] = React.useState('const message = "Hello World!";');

  return (
    <div>
      <h2>自定义样式编辑器</h2>
      <MonacoEditor
        language="javascript"
        value={code}
        onValueChange={setCode}
        height={400}
        options={{
          fontSize: 16,
          lineHeight: 24,
          minimap: { enabled: true },
          wordWrap: 'on',
          formatOnType: true,
          formatOnPaste: true,
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          selectOnLineNumbers: true
        }}
      />
    </div>
  );
};

export default CustomStyledEditor;
```

下面两段是配置写法，文档站不会执行。`https://your-cdn.com` 只是占位地址，真正跑起来会把全局 loader 指到一个不存在的 CDN，页面上所有编辑器都会加载失败。

### 示例 6: 使用自定义 CDN

```tsx | pure
import React from 'react';
import { MonacoEditor, configMonacoCDN } from '..';

configMonacoCDN('https://your-cdn.com/monaco-editor/0.56.0/min/vs');

const EditorWithCustomCDN = () => {
  const [code, setCode] = React.useState('SELECT * FROM users;');

  return <MonacoEditor language="mysql" value={code} onValueChange={setCode} height={240} />;
};

export default EditorWithCustomCDN;
```

### 示例 7: 组件级传入 loaderConfig

```tsx | pure
import React from 'react';
import { MonacoEditor } from '..';

const EditorWithLoaderConfig = () => {
  const [code, setCode] = React.useState('{"name":"allah"}');

  return (
    <MonacoEditor
      language="json"
      value={code}
      onValueChange={setCode}
      loaderConfig={{
        paths: { vs: 'https://your-cdn.com/monaco-editor/0.56.0/min/vs' }
      }}
      height={240}
    />
  );
};

export default EditorWithLoaderConfig;
```

## 支持的语言

| 语言       | Key          | 主题     | 特性                    |
| ---------- | ------------ | -------- | ----------------------- |
| 纯文本     | `text`       | vs-light | 基础文本编辑            |
| JSON       | `json`       | vs-dark  | 自动格式化              |
| JavaScript | `javascript` | vs-dark  | 语法高亮                |
| TypeScript | `typescript` | vs-dark  | 语法高亮                |
| HTML       | `html`       | vs-light | 语法高亮                |
| CSS        | `css`        | vs-light | 语法高亮                |
| YAML       | `yaml`       | vs-light | 语法高亮                |
| MySQL      | `mysql`      | vs-light | SQL 语法高亮 + 自动补全 |

## API 参考

### MonacoEditor Props

| 属性          | 类型                                               | 默认值   | 说明                                          |
| ------------- | -------------------------------------------------- | -------- | --------------------------------------------- |
| language      | `string`                                           | `'text'` | 语言类型，可选                                |
| value         | `string`                                           | -        | 编辑器内容                                    |
| onValueChange | `(value: string \| undefined) => void`             | -        | 内容变化回调                                  |
| height        | `number \| string`                                 | `200`    | 编辑器高度                                    |
| options       | `object`                                           | `{}`     | Monaco 编辑器选项                             |
| onChange      | `(value: string \| undefined, event: any) => void` | -        | Monaco 原生 change 事件                       |
| loaderConfig  | `MonacoLoaderConfig`                               | -        | 自定义 Monaco loader 配置，可用于指定私有 CDN |
| theme         | `string`                                           | -        | 主题（自动根据语言配置）                      |

### 专用组件 Props

`MonacoJson`、`MonacoMysql`、`MonacoText` 等专用组件的 Props 与 `MonacoEditor` 相同，但不包含 `language` 参数。

## FAQ

**Q: 如何设置编辑器的高度？**  
A: 可以通过 `height` 属性来设置编辑器的高度。例如，`height={300}` 会将编辑器的高度设置为 300 像素，也可以使用字符串如 `height="50vh"`。

**Q: 如何在编辑器中启用或禁用格式化功能？**  
A: 可以通过 `options` 属性中的 `formatOnType` 和 `formatOnPaste` 选项来启用或禁用格式化功能。例如，将 `formatOnType` 设置为 `true` 可以在每次输入时自动格式化代码。

**Q: 组件支持哪些语言？**  
A: 支持纯文本、JSON、JavaScript、TypeScript、HTML、CSS、YAML、MySQL 等多种语言。使用 `MonacoEditor` 组件时通过 `language` 参数指定，或使用对应的专用组件。

**Q: 如何获取编辑器中的当前值？**  
A: 可以通过 `onValueChange` 回调函数来获取编辑器中的当前值。每当编辑器的内容发生变化时，这个回调函数会被调用，并传递当前的代码值。

**Q: 如何切换到自己的 CDN？**  
A: 推荐在应用入口调用 `configMonacoCDN('你的CDN地址/min/vs')`。如果只想对单个编辑器生效，也可以通过 `loaderConfig` 属性传入 `paths.vs`。

**Q: 如何添加新的语言支持？**  
A: 可以在 `lgConfig.ts` 文件中添加新的语言配置，然后在 `languageConfigs` 中注册即可。

**Q: 默认使用什么语言？**  
A: `MonacoEditor` 组件默认使用 `'text'`（纯文本）语言模式。专用组件如 `MonacoJson` 会自动使用对应的语言。

**Q: 如何自定义主题？**  
A: 可以在语言配置中设置 `theme` 属性，支持 `vs-dark` 和 `vs-light` 两种主题。也可以通过 `options.theme` 覆盖默认主题。

---
