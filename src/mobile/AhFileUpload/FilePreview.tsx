import { isImageFile, StringUtils } from '../../theling-utils';
import type { IFileObjVoBase } from '../../theling-utils/@types/IBase';
import { downloadImage } from '../../theling-utils/utils/ZlNetWork';
import { Image, Modal, Toast } from 'antd-mobile';
import React from 'react';
import FileIcon from './FileIcon';
import { isWeChatEnv } from './utils';

interface FilePreviewProps {
  file?: IFileObjVoBase;
  visible: boolean;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, visible, onClose }) => {
  if (!file) return null;
  const fileName = file?.fileName || file?.name || `未知文件.${file?.suffix}`;
  const renderContent = () => {
    if (isImageFile(fileName)) {
      const imgSrc = file.preview || file.url;
      return (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <Image src={imgSrc} width="100%" fit="contain" style={{ maxHeight: '70vh' }} />
        </div>
      );
    }
    const videoSuffixes = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'm4v'];
    if (videoSuffixes.includes((file.suffix || '').toLowerCase())) {
      const videoSrc = file.preview || file.url;
      return (
        <div style={{ padding: '8px 0' }}>
          <video
            src={videoSrc}
            controls
            playsInline
            style={{ width: '100%', maxHeight: '60vh', background: '#000' }}
          />
        </div>
      );
    }
    if (file.suffix === 'pdf') {
      return (
        <div style={{ height: '60vh', overflow: 'auto' }}>
          <iframe
            src={file.preview || file.url}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          >
            此浏览器不支持PDF预览
          </iframe>
        </div>
      );
    }
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <FileIcon suffix={file.suffix || ''} size={48} />
        <div style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
          暂不支持预览此类型文件
        </div>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>{fileName}</div>
      </div>
    );
  };
  const isWeChat = isWeChatEnv();
  return (
    <Modal
      visible={visible}
      title={fileName}
      onClose={onClose}
      content={renderContent()}
      closeOnAction
      actions={[
        isWeChat
          ? {
              key: 'copy',
              text: '复制链接',
              onClick: () => {
                if (file.url) {
                  StringUtils.copyToClipboard(file.url);
                  Toast.show({ content: '复制成功，请打开浏览器进行下载', icon: 'success' });
                }
              }
            }
          : {
              key: 'download',
              text: '下载',
              onClick: () => {
                if (file.url) {
                  downloadImage(file.url, fileName);
                }
              }
            },
        {
          key: 'close',
          text: '关闭',
          onClick: onClose
        }
      ]}
    />
  );
};

export default FilePreview;
