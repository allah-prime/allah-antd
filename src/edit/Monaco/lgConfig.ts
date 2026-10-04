import type { MonacoInstance } from './configMonaco';

export interface LanguageConfig {
  id: string;
  name: string;
  theme: 'vs-dark' | 'vs-light';
  defaultValue: string;
  options?: Record<string, any>;
  // 语法高亮配置
  tokenizer?: Record<string, any>;
  // 自动补全配置
  completionItems?: Array<{
    label: string;
    kind: number;
    insertText: string;
  }>;
  // 编辑器挂载时的自定义处理
  onMount?: (editor: any, monaco: MonacoInstance) => void;
}

// MySQL 语言配置
export const mysqlConfig: LanguageConfig = {
  id: 'mysql',
  name: 'MySQL',
  theme: 'vs-light',
  defaultValue: `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);`,
  tokenizer: {
    root: [
      [
        /\b(CREATE|ALTER|DROP|TABLE|INDEX|PRIMARY|KEY|UNIQUE|AUTO_INCREMENT|NOT NULL|DEFAULT|FOREIGN|REFERENCES)\b/i,
        'keyword'
      ],
      [/[a-zA-Z_]\w*/, 'identifier'],
      [/\d+/, 'number'],
      [/".*?"/, 'string'],
      [/'.*?'/, 'string'],
      [/--.*/, 'comment'],
      [/\/\*.*\*\//, 'comment']
    ]
  },
  completionItems: [
    { label: 'CREATE TABLE', kind: 17, insertText: 'CREATE TABLE ' },
    { label: 'ALTER TABLE', kind: 17, insertText: 'ALTER TABLE ' },
    { label: 'DROP TABLE', kind: 17, insertText: 'DROP TABLE ' },
    { label: 'PRIMARY KEY', kind: 17, insertText: 'PRIMARY KEY' },
    { label: 'FOREIGN KEY', kind: 17, insertText: 'FOREIGN KEY' }
  ],
  onMount: (editor: any, monaco: MonacoInstance) => {
    // 注册自定义语言
    monaco.languages.register({ id: 'mysql' });

    // 设置语法高亮
    monaco.languages.setMonarchTokensProvider('mysql', {
      // @ts-ignore
      tokenizer: mysqlConfig.tokenizer
    });

    // 设置自动补全
    monaco.languages.registerCompletionItemProvider('mysql', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions =
          mysqlConfig.completionItems?.map(item => ({
            ...item,
            range
          })) || [];

        return { suggestions };
      }
    });
  }
};

// JSON 语言配置
export const jsonConfig: LanguageConfig = {
  id: 'json',
  name: 'JSON',
  theme: 'vs-light',
  defaultValue: '',
  tokenizer: {
    root: [
      [/\d+/, { token: 'keyword' }],
      [/[a-zA-Z]+/, { token: 'string' }]
    ]
  },
  onMount: (editor: any) => {
    // JSON 格式化
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run();
    }, 500);
  }
};

// 纯文本配置
export const textConfig: LanguageConfig = {
  id: 'text',
  name: 'Text',
  theme: 'vs-light',
  defaultValue: '',
  onMount: (editor: any) => {
    // 文本格式化
    setTimeout(() => {
      editor.getAction('editor.action.formatDocument')?.run();
    }, 500);
  }
};

// JavaScript 语言配置
export const javascriptConfig: LanguageConfig = {
  id: 'javascript',
  name: 'JavaScript',
  theme: 'vs-light',
  defaultValue: `// JavaScript code here
function hello() {
  console.log('Hello World!');
}`,
  options: {
    formatOnType: true,
    formatOnPaste: true
  }
};

// TypeScript 语言配置
export const typescriptConfig: LanguageConfig = {
  id: 'typescript',
  name: 'TypeScript',
  theme: 'vs-light',
  defaultValue: `// TypeScript code here
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'John',
  age: 25
};`,
  options: {
    formatOnType: true,
    formatOnPaste: true
  }
};

// HTML 语言配置
export const htmlConfig: LanguageConfig = {
  id: 'html',
  name: 'HTML',
  theme: 'vs-light',
  defaultValue: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
  options: {
    formatOnType: true,
    formatOnPaste: true
  }
};

// CSS 语言配置
export const cssConfig: LanguageConfig = {
  id: 'css',
  name: 'CSS',
  theme: 'vs-light',
  defaultValue: `/* CSS styles here */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}`,
  options: {
    formatOnType: true,
    formatOnPaste: true
  }
};

// YAML 语言配置
export const yamlConfig: LanguageConfig = {
  id: 'yaml',
  name: 'YAML',
  theme: 'vs-light',
  defaultValue: `# YAML configuration
name: app-config
version: 1.0.0
settings:
  debug: true
  port: 3000`,
  options: {
    formatOnType: true,
    formatOnPaste: true
  }
};

// 语言配置映射
export const languageConfigs: Record<string, LanguageConfig> = {
  mysql: mysqlConfig,
  json: jsonConfig,
  text: textConfig,
  javascript: javascriptConfig,
  typescript: typescriptConfig,
  html: htmlConfig,
  css: cssConfig,
  yaml: yamlConfig
};

// 获取语言配置
export const getLanguageConfig = (languageKey: string): LanguageConfig => {
  return languageConfigs[languageKey] || textConfig;
};
