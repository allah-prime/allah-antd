import { docSuffix, exclSuffix, pdfSuffix, fileUtils } from '@allahjs/utils';
import { Image } from 'antd-mobile';
import { FileOutline, PictureOutline } from 'antd-mobile-icons';
import React from 'react';

interface FileIconProps {
  suffix: string;
  size?: number;
  file?: File;
  previewURL?: string;
}

const FileIcon: React.FC<FileIconProps> = ({ suffix, size = 24, previewURL }) => {
  if (docSuffix.includes(suffix)) {
    return <FileOutline fontSize={size} color="#1890ff" />;
  } else if (pdfSuffix.includes(suffix)) {
    return <FileOutline fontSize={size} color="#ff4d4f" />;
  } else if (exclSuffix.includes(suffix)) {
    return <FileOutline fontSize={size} color="#52c41a" />;
  } else if (fileUtils.isImageFile(suffix)) {
    if (previewURL) {
      return <Image src={previewURL} width={size} height={size} fit="cover" />;
    }
    return <PictureOutline fontSize={size} color="#722ed1" />;
  }
  return <FileOutline fontSize={size} color="#8c8c8c" />;
};

export default FileIcon;
