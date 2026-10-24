import React from 'react';
import {
  FileExcelOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FileZipOutlined
} from '@ant-design/icons';

/**
 * 单个文件
 */
export interface IFileItem {
  /**
   * 文件的地址
   */
  filePath: string;
  /**
   * 文件的id
   */
  fileId: string;
  /**
   * 文件的名称
   */
  fileName: string;
  /**
   * 文件的后缀名
   */
  suffix: string;
}

/**
 * 文件的id
 */
interface IFileId {
  fileId: string;
}

export interface IFileBoxProps {
  /**
   * 需要显示的文件列表
   */
  fileList?: IFileItem[];
  /**
   * 文件下载的方法
   */
  downloadFile?: (obj: IFileId) => void;
  /**
   * 需要显示的单个文件
   */
  fileObj?: IFileItem;
  /**
   * 自定义的样式
   */
  styles?: React.CSSProperties;
  /**
   * 显示删除
   */
  showDelete?: boolean;
  /**
   * 删除的回调
   */
  deleteFile?: (obj: IFileId) => void;
  /**
   * 尾部渲染
   */
  suffixRender?: React.ReactElement | React.ReactNode;
  /**
   * 尾部渲染
   */
  bodyStyles?: React.CSSProperties;
  /**
   * 需要展示的图片个数
   */
  showNum?: number;
}

/**
 * 判断是否照片文件
 * @param suffix
 */
export const isImageFile = (suffix: string) => {
  const rgx = '(JPEG|jpeg|JPG|jpg|gif|GIF|HEIC|heic|BMP|bmp|PNG|png)$';
  const re = new RegExp(rgx, 'i');
  const fileExt = suffix.replace(/.+\./, '');
  return re.test(fileExt);
};

export function buildFileType(str: string) {
  switch (str) {
    case 'pdf':
      return <FilePptOutlined />;
    case 'pptx':
      return <FilePptOutlined />;
    case 'ppt':
      return <FilePptOutlined />;
    case 'txt':
      return <FileTextOutlined />;
    case 'doc':
      return <FileWordOutlined />;
    case 'docx':
      return <FileWordOutlined />;
    case 'xls':
      return <FileExcelOutlined />;
    case 'xlsx':
      return <FileExcelOutlined />;
    case 'rar':
      return <FileZipOutlined />;
    case 'zip':
      return <FileZipOutlined />;
    default:
      return <FileUnknownOutlined />;
  }
}

export interface IState {
  photoIndex: number;
  isOpen: boolean;
  // 图片数组
  fileList: IFileItem[];
}
