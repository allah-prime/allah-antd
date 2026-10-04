import { IFileObjVoBase, fileUtils } from '@allahjs/utils';
import { Button, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { buildFileType, isImageFile } from '../FileBox/utils';
import AhAntdConfig from '../utils/AhAntdConfig';
import AhImageRender from '../AhImageRender';

export interface AhFilePreviewProps {
  /** 文件ID列表 */
  fileIds?: string[];
  /** 文件对象列表 */
  fileList?: IFileObjVoBase[];
  /** 预览宽度 */
  width?: number;
  /** 预览高度 */
  height?: number;
  /** 自定义请求方法,用于获取文件信息 */
  request?: (fileIds: string[]) => Promise<IFileObjVoBase[]>;
  /** 自定义样式 */
  style?: React.CSSProperties;
}

const getFileType = (suffix?: string) => {
  if (!suffix) return 'other';
  const ext = suffix.toLowerCase();
  if (fileUtils.isImageFile(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (ext === 'doc' || ext === 'docx') return 'word';
  return 'other';
};

async function defaultBatchRequest(fileIds: string[]): Promise<IFileObjVoBase[]> {
  const uploadConfig = AhAntdConfig.getUploadConfig();
  if (!uploadConfig.getSignUrlByFileId) {
    console.error('无效的配置信息，请补充getSignUrlByFileId');
    return [];
  }
  const result: IFileObjVoBase[] = [];
  for (const id of fileIds) {
    try {
      const url = await uploadConfig.getSignUrlByFileId(id);
      result.push({ fileId: id, previewUrl: url } as IFileObjVoBase);
    } catch {
      result.push({ fileId: id } as IFileObjVoBase);
    }
  }
  return result;
}

function needFetchUrl(file: IFileObjVoBase) {
  return !file.previewUrl;
}

const AhFilePreview: React.FC<AhFilePreviewProps> = ({
  fileIds,
  fileList: propFileList,
  width = 600,
  height = 600,
  request,
  style
}) => {
  const [fileList, setFileList] = useState<IFileObjVoBase[]>(propFileList || []);
  const [loading, setLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<IFileObjVoBase | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // 优先fileList
    if (propFileList && propFileList.length) {
      // 检查fileList里是否有缺url的
      const needFetch = propFileList.filter(needFetchUrl);
      if (needFetch.length > 0) {
        setLoading(true);
        const fetch = request || defaultBatchRequest;
        fetch(needFetch.map(f => f.fileId!))
          .then(res => {
            // 合并已有fileList和新获取的url
            const merged = propFileList.map(f => {
              if (needFetchUrl(f)) {
                const found = res.find(r => r.fileId === f.fileId);
                return found ? { ...f, ...found } : f;
              }
              return f;
            });
            setFileList(merged);
          })
          .finally(() => setLoading(false));
      } else {
        setFileList(propFileList);
      }
    } else if (fileIds && fileIds.length) {
      setLoading(true);
      const fetch = request || defaultBatchRequest;
      fetch(fileIds)
        .then(res => setFileList(res || []))
        .finally(() => setLoading(false));
    }
  }, [fileIds, propFileList, request]);

  const handlePreview = (file: IFileObjVoBase) => {
    console.log('点击的文件', file);
    setPreviewFile(file);
    setModalOpen(true);
  };

  const renderPreview = () => {
    if (!previewFile) return null;
    const type = getFileType(previewFile.suffix);
    const url = previewFile.previewUrl || previewFile.url;
    if (type === 'image') {
      return (
        <AhImageRender
          fileId={previewFile.fileId}
          cosKey={previewFile.cosKey}
          width={width}
          height={height}
          imageProps={{ style: { objectFit: 'contain', width, height } }}
        />
      );
    }
    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #eee'
        }}
      >
        <div style={{ fontSize: 32 }}>{buildFileType(previewFile?.suffix || 'pdf')}</div>
        <div style={{ margin: 8 }}>{previewFile.fileName || previewFile.fileId}</div>
        <Button disabled={false} type="link" href={url} target="_blank" download>
          下载
        </Button>
      </div>
    );
  };

  if (loading) {
    return <Spin style={{ width: '100%', minHeight: 100 }} />;
  }

  if (!fileList || fileList.length === 0) {
    return <div style={style}>暂无文件</div>;
  }

  return (
    <div style={{ ...style }}>
      {fileList.map(file => (
        <span
          key={file.fileId}
          style={{
            color: '#1677ff',
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: 16,
            textDecoration: 'underline',
            fontSize: 16
          }}
          onClick={() => handlePreview(file)}
        >
          {file.fileName || file.fileId}
        </span>
      ))}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={width + 40}
        styles={{ body: { textAlign: 'center' } }}
        destroyOnHidden
        title={previewFile?.fileName || previewFile?.fileId}
      >
        {renderPreview()}
      </Modal>
    </div>
  );
};

export default AhFilePreview;
