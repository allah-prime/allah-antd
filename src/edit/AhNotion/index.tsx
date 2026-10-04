import type { IANotionProps } from '@allahjs/tiptap';
import React from 'react';
import AhEditor, { IAhEditorProps } from '../AhEditor';

export type IAhNotionProps = Omit<IAhEditorProps, 'renderMode' | 'editorOpt' | 'tideOpt'> & {
  /**
   * 透传给底层 ANotion 的 props（mentionItems / slashItems / extraExtensions 等）
   */
  editorOpt?: Partial<IANotionProps>;
  /**
   * @deprecated 请使用 editorOpt
   */
  tideOpt?: Partial<IANotionProps>;
};

/**
 * Notion 风格块编辑器，等价于 AhEditor 的 renderMode="block"
 */
const AhNotion: React.FC<IAhNotionProps> = (props) => {
  const { editorOpt, tideOpt, ...rest } = props;
  return (
    <AhEditor
      {...(rest as IAhEditorProps)}
      renderMode="block"
      editorOpt={editorOpt || tideOpt}
    />
  );
};

export default AhNotion;
