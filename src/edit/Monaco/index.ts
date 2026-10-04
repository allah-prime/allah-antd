// Monaco 编辑器组件
export { default as MonacoEditor } from './MonacoEditor';
export type { IMonacoEditorProps } from './MonacoEditor';

// 专用语言编辑器
export { default as MonacoJson } from './MonacoJson';
export { default as MonacoMysql } from './MonacoMysql';
export { default as MonacoText } from './MonacoText';

// CDN / loader 配置工具
export { configMonacoCDN, configMonacoLoader } from './configMonaco';
export type { MonacoLoaderConfig } from './configMonaco';

// 语言配置
export {
  cssConfig, getLanguageConfig, htmlConfig, javascriptConfig, jsonConfig, languageConfigs,
  mysqlConfig, textConfig, typescriptConfig, yamlConfig
} from './lgConfig';
export type { LanguageConfig } from './lgConfig';

