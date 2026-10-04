import ATiptap, { ANotion } from '@allahjs/tiptap';
import type { IANotionProps, IATiptapProps } from '@allahjs/tiptap';
import React, { useEffect, useMemo } from 'react';
import { IFileObjVoBase } from '@allahjs/utils';
import { IUseType, AhAntdConfig } from '../../ui';
import { fileUpload } from '../utils/fileUpload';
import type { IUploadProps, IProgressInfo } from '../../types';

type IATiptapRenderMode = NonNullable<IATiptapProps['renderMode']>;

/** 业务侧 renderMode；`block` 为块编辑别名，等价于底层 `notion` */
export type IAhEditorRenderMode = IATiptapRenderMode | 'block';

/** 回传 / 赋值的数据格式 */
export type IAhEditorMode = NonNullable<IATiptapProps['mode']>;

export type IAhEditorProps = {
  /**
   * 富文本中的图片、文件的权限，是公开的还是私有的，这个配置会透传给对应的上传接口
   */
  permission?: IUploadProps['permission'];
  /**
   * 获取文件的返回地址接口
   */
  generateSignUrlReq?: (file: IFileObjVoBase) => Promise<string>;
  /**
   * 获取文件的keys
   */
  fileKeyRequest?: (files: IFileObjVoBase[]) => Promise<IFileObjVoBase[]>;
  /**
   * 文件上传接口
   */
  uploadFile?: (
    key: string,
    file: any,
    bucket?: string,
    onProgress?: (v: IProgressInfo) => void
  ) => Promise<string>;
  bucket?: string;
  usage: IUseType;
  /**
   * 回传 / 赋值的数据格式。
   * - `md`：Markdown 字符串（默认）
   * - `html`：HTML 字符串
   * - `json`：Tiptap JSON 对象
   * @default 'md'
   */
  mode?: IAhEditorMode;
  value?: IATiptapProps['value'];
  onChange?: IATiptapProps['onChange'];
  bordered?: IATiptapProps['bordered'];
  /**
   * 渲染的模式：gov 公文 / normal 普通 / custom 自定义 / block 块编辑（底层 notion）
   */
  renderMode?: IAhEditorRenderMode;
  /**
   * 是否是预览模式
   */
  preview?: boolean;
  /**
   * 编辑器容器样式
   */
  style?: IATiptapProps['style'];
  /**
   * 编辑器高度。传 `'auto'` 时随内容撑开、不出现内部滚动条。
   */
  height?: IATiptapProps['height'];
  /**
   * 透传底层编辑器 props。
   * block 模式可传 IANotionProps（extraExtensions / mentionItems / slashItems 等）；
   * 其它模式为 IATiptapProps（含 mentionItems，所有模式均支持 @ 提及）。
   */
  editorOpt?: IATiptapProps & Partial<IANotionProps>;
  /**
   * @deprecated 请使用 editorOpt
   */
  tideOpt?: IATiptapProps & Partial<IANotionProps>;
};

const resolveRenderMode = (renderMode?: IAhEditorRenderMode): IATiptapRenderMode | undefined => {
  if (renderMode === 'block') {
    return 'notion';
  }
  return renderMode;
};

const AhEditor: React.FC<IAhEditorProps> = ({
  value,
  onChange,
  preview = false,
  mode = 'md',
  style,
  height,
  ...props
}) => {
  const uploadConfig = AhAntdConfig.getUploadConfig();

  const fileKeyRequest = props.fileKeyRequest || uploadConfig.fileKeyRequest;
  const generateSignUrlReq = props.generateSignUrlReq || uploadConfig.generateSignUrlReq;
  const uploadFile = props.uploadFile || uploadConfig.uploadFile;
  const editorOpt = props.editorOpt || props.tideOpt;
  const renderMode = resolveRenderMode(
    (editorOpt?.renderMode as IAhEditorRenderMode) || props.renderMode
  );

  const {
    imageUploader: customImageUploader,
    fileUploader: customFileUploader,
    height: editorHeight,
    ...restEditorOpt
  } = editorOpt || {};
  const resolvedHeight = editorHeight ?? height;

  useEffect(() => {
    if (typeof props.permission === 'undefined') {
      console.error('富文本编辑器permission参数未配置，文件上传后将默认仅登录后可查看');
    }
    if (!fileKeyRequest || !generateSignUrlReq || !uploadFile) {
      console.error(
        '富文本编辑器上传配置错误：需配置 fileKeyRequest、uploadFile、generateSignUrlReq，否则图片与文件均无法上传'
      );
    }
  }, []);

  const mediaUploader = useMemo(() => {
    return async (file: File, onProgress: (progress: number) => void) => {
      const urlObj = await fileUpload(
        file,
        fileKeyRequest,
        uploadFile,
        generateSignUrlReq,
        props.usage,
        props.permission,
        props.bucket,
        ({ percent }) => {
          const p = typeof percent === 'number' ? percent : 0;
          onProgress(p <= 1 ? p * 100 : p);
        }
      );
      return urlObj.url;
    };
  }, [
    fileKeyRequest,
    uploadFile,
    generateSignUrlReq,
    props.usage,
    props.permission,
    props.bucket
  ]);

  const imageUploader = customImageUploader || mediaUploader;
  const fileUploader = customFileUploader || customImageUploader || mediaUploader;

  if (renderMode === 'notion') {
    return (
      <ANotion
        {...restEditorOpt}
        value={value}
        onChange={onChange}
        mode={mode}
        editable={!preview}
        imageUploader={imageUploader}
        fileUploader={fileUploader}
        style={style}
        height={resolvedHeight}
      />
    );
  }

  return (
    <ATiptap
      {...restEditorOpt}
      value={value}
      onChange={onChange}
      mode={mode}
      imageUploader={imageUploader}
      fileUploader={fileUploader}
      editable={!preview}
      renderMode={renderMode}
      bordered={props.bordered}
      style={style}
      height={resolvedHeight}
    />
  );
};

export default AhEditor;
