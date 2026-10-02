import React from 'react';
import AhEditor from '../AhEditor';
import type { IAhEditorProps } from '../AhEditor';

export interface IAhMarkdownProps extends Omit<IAhEditorProps, 'renderMode' | 'mode' | 'editorOpt' | 'tideOpt'> {
  /**
   * 编辑器模式，默认 md
   */
  mode?: IAhEditorProps['mode'];
  /**
   * 透传底层编辑器 props
   */
  editorOpt?: IAhEditorProps['editorOpt'];
  /**
   * @deprecated 请使用 editorOpt
   */
  tideOpt?: IAhEditorProps['tideOpt'];
}

/**
 * Markdown 编辑器（基于 AhEditor normal 模式）
 * @deprecated 业务请使用 AhNotion
 */
const AhMarkdown: React.FC<IAhMarkdownProps> = ({ mode = 'md', editorOpt, tideOpt, ...props }) => {
  const editorProps: IAhEditorProps = {
    ...props,
    mode,
    renderMode: 'normal',
    editorOpt: {
      ...(editorOpt || tideOpt),
      showToolbar: (editorOpt || tideOpt)?.showToolbar ?? false,
      bordered: (editorOpt || tideOpt)?.bordered ?? false
    }
  };

  return <AhEditor {...editorProps} />;
};

export default AhMarkdown;
