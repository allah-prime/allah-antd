import React from 'react';
import MonacoEditor, { IMonacoEditorProps } from './MonacoEditor';

/**
 * MySQL 编辑器 - 使用统一配置系统
 */
const MonacoMysql: React.FC<Omit<IMonacoEditorProps, 'language'>> = props => {
  return <MonacoEditor language="mysql" {...props} />;
};

export default MonacoMysql;
