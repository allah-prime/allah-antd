import React from 'react';
import MonacoEditor, { IMonacoEditorProps } from './MonacoEditor';

/**
 * JSON 编辑器 - 使用统一配置系统
 */
const MonacoJson: React.FC<Omit<IMonacoEditorProps, 'language'>> = props => {
  return <MonacoEditor language="json" {...props} />;
};

export default MonacoJson;
