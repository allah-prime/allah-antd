import React from 'react';
import MonacoEditor, { IMonacoEditorProps } from './MonacoEditor';

/**
 * 纯文本编辑器 - 使用统一配置系统
 */
const MonacoText: React.FC<Omit<IMonacoEditorProps, 'language'>> = props => {
  return <MonacoEditor language="text" {...props} />;
};

export default MonacoText;
