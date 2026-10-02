import { FileImageOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { docSuffix, exclSuffix, isImageFile, pdfSuffix } from '../../theling-utils';
import type { IFileObjVoBase } from '../../theling-utils/@types/IBase';
import { Button, Image, Modal, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadProps } from 'antd/lib/upload/Upload';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import AhAntdConfig from '../utils/AhAntdConfig';
import { downloadImage } from '../utils/AhNetWork';
import type { IUploadProps } from '../../types';
import './index.less';
import IconFont from '../IconSelect/IconFont';

export const getVideoDuration = (file: any) => {
  if (file.type?.startsWith('video/')) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      // 创建一个 URL 对象
      const fileURL = URL.createObjectURL(file.originFileObj);
      video.src = fileURL;

      video.addEventListener('loadedmetadata', () => {
        const duration = video.duration;
        resolve(Math.round(duration));
        URL.revokeObjectURL(fileURL);
      });
      video.addEventListener('error', () => {
        console.error('视频上传出错');
        return Promise.resolve(0);
      });
    });
  }
  return undefined;
};
export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

/**
 * 判断显示的图标
 * @param data
 * @param size
 */
export const attachFileSuffix = (data: string[], size = 18) => {
  const arr: React.ReactNode[] = [];

  new Set(data).forEach((item: string) => {
    if (docSuffix.includes(item)) {
      if (!arr.some((item: any) => item.props.type === 'icon-doc')) {
        arr.push(
          <IconFont key={item} type="icon-doc" style={{ fontSize: size, marginRight: 6 }} />
        );
      }
    } else if (pdfSuffix.includes(item)) {
      if (!arr.some((item: any) => item.props.type === 'icon-pdf')) {
        arr.push(
          <IconFont key={item} type="icon-pdf" style={{ fontSize: size, marginRight: 6 }} />
        );
      }
    } else if (exclSuffix.includes(item)) {
      if (!arr.some((item: any) => item.props.type === 'icon-xls')) {
        arr.push(
          <IconFont key={item} type="icon-xls" style={{ fontSize: size, marginRight: 6 }} />
        );
      }
    }
  });
  return arr;
};

// 根据文件的后缀名，返回对应的图标 - 如果是图片，就会显示预览
export const AhFileIcon: React.FC<{
  suffix: string;
  /**
   * 图标的大小
   */
  fontSize: number;
  /**
   * 实际的文件对象，如果这个文件没有被上传上去，就是这个
   */
  file: File;
  // 是否预览 - 如果是预览，就展示图片
  isPreview?: boolean;
  // 预览地址
  previewURL?: string;
}> = ({ suffix, file, fontSize = 18, isPreview, previewURL }) => {
  if (docSuffix.includes(suffix)) {
    return <IconFont type="icon-doc" style={{ fontSize, marginRight: 6 }} />;
  } else if (pdfSuffix.includes(suffix)) {
    return <IconFont type="icon-pdf" style={{ fontSize, marginRight: 6 }} />;
  } else if (exclSuffix.includes(suffix)) {
    return <IconFont type="icon-xls" style={{ fontSize, marginRight: 6 }} />;
  } else if (isImageFile(suffix)) {
    if (isPreview) {
      previewURL = previewURL || URL.createObjectURL(file);
      return <Image width={fontSize} src={previewURL} />;
    }
    return <FileImageOutlined style={{ fontSize, marginRight: 6 }} />;
  }
  return null;
};

const BuildUploadButton = ({
  boxType,
  selectText,
  disable
}: {
  boxType: UploadProps['listType'];
  selectText: string;
  disable: boolean | undefined;
}) => {
  if (disable) {
    return null;
  }
  if (boxType === 'picture') {
    return (
      <div>
        <Button>
          <UploadOutlined />
          点击上传
        </Button>
      </div>
    );
  }
  return (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">{selectText}</div>
    </div>
  );
};

const FileUpload2: React.FC<IUploadProps> = props => {
  const {
    fileSize = 2048000,
    maxNum = 10,
    multiple,
    selectText = '选择文件',
    listType = 'picture-card',
    value,
    disabled,
    onChange,
    uploadRef,
    style,
    onDownload,
    customUploadRender,
    uploadProps = {}
  } = props;

  const [fileList, setFileList] = useState<any[]>(value || []);

  const [previewVisible, setPreviewVisible] = useState(false);

  const [nowFile, setNowFile] = useState<IFileObjVoBase>();

  const updatePercent = (newFiles: IFileObjVoBase[]) => {
    setFileList([...newFiles]);
  };

  useEffect(() => {
    if (value) {
      setFileList(value);
    }
  }, [value]);

  useEffect(() => {
    const uploadConfig = AhAntdConfig.getUploadConfig();
    if (!props.fileKeyRequest && !uploadConfig.fileKeyRequest) {
      console.error('请定义fileKeyRequest方法');
    }
    if (!props.uploadRequest && !uploadConfig.uploadRequest) {
      console.error('请定义uploadRequest方法');
    }
  }, []);

  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(uploadRef, () => ({
    // 开始上传
    startUpload: async (relId?: string) => {
      if (fileList.length === 0) {
        return [];
      }
      const uploadConfig = AhAntdConfig.getUploadConfig();
      const fileKeyRequest = props.fileKeyRequest || uploadConfig.fileKeyRequest;
      const uploadRequest = props.uploadRequest || uploadConfig.uploadRequest;
      const uploadLocalRequest = uploadConfig.uploadLocalRequest;
      // 这里可以加自己的逻辑哦
      console.log('开始上传');
      const uploadFiles = async () => {
        const processedFiles = [];
        for (let i = 0; i < fileList.length; i++) {
          const item = fileList[i];
          const videoDuration = await getVideoDuration(item);
          const processedItem = {
            ...item,
            usage: props.usage,
            fileSize: item.size || 0,
            fileType: props.fileType,
            busiType: props.busiType,
            busiScene: props.busiScene,
            bucket: props.bucket,
            permission: props.permission,
            videoDuration,
            relId
          } as IFileObjVoBase;
          processedFiles.push(processedItem);
        }
        return processedFiles;
      };
      // 获取cos的key
      const newFiles = await fileKeyRequest!((await uploadFiles()) as any);
      // 将这个数据，调用上传接口进行上传
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        if (file.status === 'success') {
          continue;
        }
        file.status = 'uploading';
        if (props.bucket) {
          file.bucket = props.bucket!;
        }
        updatePercent(newFiles);
        // 确保只对有originFileObj的文件执行上传
        if (file.originFileObj) {
          // 根据 bucket 值决定使用哪个上传方法
          if (file.bucket === 'database') {
            console.log('originFileObj', file);
            // 使用本地上传方法，传递 fileId 和文件流
            if (uploadLocalRequest) {
              // 将File对象转换为FormData格式（最常用的上传格式）
              const formData = new FormData();
              // 添加其他文件元数据到FormData
              formData.append('zlFileId', file.zlFileId || '');
              formData.append('cosKey', file.cosKey || '');
              formData.append('fileName', file.name || '');
              formData.append('fileSize', String(file.size || 0));

              // 传递FormData和文件元数据
              await uploadLocalRequest({ formData, ...file }, (v: any) => {
                console.log('本地上传进度', v.percent);
                // 修改进度信息
                file.percent = v.percent * 100;
                updatePercent(newFiles);
              });
            } else {
              console.error('uploadLocalRequest 方法未定义，但 bucket 为 database');
            }
          } else {
            // 使用默认的上传方法
            await uploadRequest!(file as any, (v: any) => {
              console.log('上传进度', v.percent);
              // 修改进度信息
              file.percent = v.percent * 100;
              updatePercent(newFiles);
            });
          }
        }
        file.status = 'success';
        file.name = `(已上传)${file.name}`;
        updatePercent(newFiles);
      }
      setFileList(newFiles);
      onChange?.(newFiles as any);
      return newFiles;
    }
  }));

  const options: UploadProps = {
    onPreview: async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
      setNowFile({
        fileSize: file.size || 0,
        oldFile: false,
        suffix: file.name?.split('.')?.pop(),
        ...file
      } as IFileObjVoBase);
      setPreviewVisible(true);
    },
    onRemove: file => {
      const index = fileList.indexOf(file as IFileObjVoBase);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      console.log('file', file);
      // 判断文件大小
      if (file.size > fileSize) {
        Modal.error({
          title: '文件（图片）过大',
          content: `系统建议使用小于${
            fileSize / 1024 / 1000
          }M的文件（图片）进行上传，如果超出，请进行压缩或者拆分`
        });
        return false;
      }
      return false;
    },
    onChange: ({ fileList: newFileList, file }) => {
      file.percent = 0;
      file.status = 'done';
      setFileList([...(newFileList as IFileObjVoBase[])]);
      onChange?.(newFileList as IFileObjVoBase[]);
    },
    showUploadList: {
      showDownloadIcon: true,
      showRemoveIcon: true
    },
    onDownload: file => {
      if (file.url?.concat('http')) {
        if (onDownload) {
          onDownload(file);
        } else {
          downloadImage(file.url!, file.fileName!);
        }
      }
    },
    listType,
    multiple,
    fileList,
    disabled,
    ...uploadProps
  };

  if (customUploadRender) {
    return (
      <Upload {...options} accept={props.accept}>
        {customUploadRender(!!disabled, fileList)}
      </Upload>
    );
  }

  return (
    <div className="theling_upload" style={style}>
      <Upload {...options} accept={props.accept}>
        {fileList.length >= maxNum ? null : (
          <BuildUploadButton boxType={listType} selectText={selectText} disable={disabled} />
        )}
      </Upload>
      <div style={{ fontSize: 10, color: '#a6a6a6', marginTop: 10 }}>
        请确认上传的文件资料是非涉密文件资料
      </div>
      <Modal
        title={nowFile && nowFile.name}
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width="60%"
        styles={{
          body: {
            overflowY: 'auto'
          }
        }}
      >
        {previewFile(nowFile, { height: '75vh' })}
      </Modal>
    </div>
  );
};

export default FileUpload2;

// 预览的方法
export const previewFile = (file?: IFileObjVoBase, boxStyles?: any) => {
  const fileName = file?.fileName || file?.name || `未知文件.${file?.suffix}`;
  if (!file) {
    return null;
  }
  if (isImageFile(fileName)) {
    return <img alt="预览" style={{ width: '100%', height: '100%' }} src={file.preview} />;
  }
  if (file.suffix === 'pdf') {
    return (
      <div style={{ overflowY: 'scroll', height: '40vh', ...boxStyles }}>
        <iframe src={file.preview} width="100%" height="100%">
          此浏览器不支持PDF。请下载PDF以查看：
          <br />
          <a href={file.preview}>下载 PDF</a>
        </iframe>
      </div>
    );
  }
  return (
    <div>
      暂不支持预览此类型文件。请下载以查看：
      <div style={{ marginTop: '10px' }}>
        <a target="blank" href={file.preview} download={file.name}>
          {file.name}
        </a>
      </div>
    </div>
  );
};
