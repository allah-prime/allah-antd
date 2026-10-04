import {
  type IProgressInfo,
  type IUploadProps,
  type IWeChatResolvedMediaFile,
  type IWeChatUploadConfig
} from '../../types';
import { stringUtils, domUtils, imageUtils, fileUtils } from '@allahjs/utils';
import type { IFileObjVoBase } from '@allahjs/utils';
import { Button, ImageUploader, Toast } from 'antd-mobile';
import { AddOutline } from 'antd-mobile-icons';
import type { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import AhMobileConfig from '../utils/AhMobileConfig';
import FileIcon from './FileIcon';
import FilePreview from './FilePreview';
import './index.less';
import {
  acceptIncludesType,
  createUploadFileItem,
  getVideoDuration,
  isWeChatEnv
} from './utils';
import {
  canUseWeChatUpload,
  chooseWeChatImages,
  chooseWeChatVideo,
  previewWeChatImage
} from './wechat';

export interface IAhFileUploadProps extends Omit<IUploadProps, 'onDownload'> {
  /**
   * 下载回调
   */
  onDownload?: (file: IFileObjVoBase) => void;
  /**
   * 是否只显示图片上传器
   */
  imageOnly?: boolean;

  /**
   * 业务场景 -cycm会用到
   */
  busiScene?: string;
  /**
   * 数据索引 - 用于表单提交时，将文件上传结果与其他表单字段合并
   */
  dataIndex?: string;
  /**
   * 是否是详情模式
   */
  details?: boolean;
  /**
   * 媒体捕获方式，设置后可在移动端直接调起摄像头
   * - 'environment': 后置摄像头
   * - 'user': 前置摄像头
   * @example capture="environment" 可在安卓上触发录像
   */
  capture?: 'environment' | 'user';
}

const AhFileUpload: React.FC<IAhFileUploadProps> = props => {
  const {
    fileSize = 2048000,
    maxNum = 10,
    multiple = true,
    selectText = '选择文件',
    value,
    disabled,
    details,
    onChange,
    uploadRef,
    style,
    onDownload,
    accept,
    imageOnly = false,
    capture
  } = props;

  const [fileList, setFileList] = useState<IFileObjVoBase[]>(value || []);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<IFileObjVoBase>();
  const [previewMap, setPreviewMap] = useState<Record<string, string>>({});
  const browserInputRef = useRef<HTMLInputElement>(null);
  const readonly = disabled || details;

  const normalizeValueToArray = (rawValue: unknown): IFileObjVoBase[] => {
    if (!rawValue) {
      return [];
    }

    if (Array.isArray(rawValue)) {
      return rawValue as IFileObjVoBase[];
    }

    if (typeof rawValue === 'string') {
      const trimValue = rawValue.trim();
      if (!trimValue) {
        return [];
      }

      try {
        const parsed = JSON.parse(trimValue);
        if (Array.isArray(parsed)) {
          return parsed as IFileObjVoBase[];
        }
        if (parsed && typeof parsed === 'object') {
          return [parsed as IFileObjVoBase];
        }
      } catch {
        return [];
      }

      return [];
    }

    if (typeof rawValue === 'object') {
      return [rawValue as IFileObjVoBase];
    }

    return [];
  };

  const getUploadConfig = () => AhMobileConfig.getUploadConfig();

  const mergePreviewMap = (files: IFileObjVoBase[]) => {
    const nextPreviewMap = files.reduce<Record<string, string>>((accumulator, file) => {
      const previewUrl = file.preview || file.url || file.previewUrl;
      const uid = file.uid;

      if (previewUrl && uid) {
        accumulator[String(uid)] = previewUrl;
      }

      return accumulator;
    }, {});

    if (Object.keys(nextPreviewMap).length > 0) {
      setPreviewMap(prev => ({ ...prev, ...nextPreviewMap }));
    }
  };

  const updateFileList = (nextFileList: IFileObjVoBase[]) => {
    setFileList(nextFileList);
    onChange?.(nextFileList);
  };

  const appendFiles = (newFiles: IFileObjVoBase[]) => {
    if (newFiles.length === 0) {
      return;
    }

    mergePreviewMap(newFiles);
    updateFileList([...fileList, ...newFiles]);
  };

  useEffect(() => {
    const normalizedValue = normalizeValueToArray(value);

    if (normalizedValue.length === 0) {
      setFileList([]);
      return;
    }

    const nextPreviewMap: Record<string, string> = {};
    const processedValue = normalizedValue.map((file, index) => {
      const fileName = file.fileName || file.name || '未知文件';
      const suffix = file.suffix || fileName.split('.').pop()?.toLowerCase() || '';
      const uid = file.uid || file.dbFileId || file.fileId || `${fileName}-${index}`;
      const preview = file.preview || file.url || '';

      if (preview) {
        nextPreviewMap[String(uid)] = preview;
      }

      return {
        ...file,
        uid,
        name: fileName,
        fileName,
        dataIndex: props.dataIndex,
        suffix,
        size: file.size || file.fileSize || 0,
        fileSize: file.size || file.fileSize || 0,
        status: file.status || 'done',
        oldFile: !!file.originFileObj,
        preview
      };
    });

    setPreviewMap(prev => ({ ...prev, ...nextPreviewMap }));
    setFileList(processedValue);
  }, [props.dataIndex, value]);

  useEffect(() => {
    const uploadConfig = getUploadConfig();
    if (!props.fileKeyRequest && !uploadConfig.fileKeyRequest) {
      console.error('请定义fileKeyRequest方法');
    }
    if (!props.uploadRequest && !uploadConfig.uploadRequest) {
      console.error('请定义uploadRequest方法');
    }
  }, [props.fileKeyRequest, props.uploadRequest]);

  const openBrowserPicker = () => {
    browserInputRef.current?.click();
  };

  const createFileItemFromWeChat = async (mediaFile: IWeChatResolvedMediaFile) => {
    if (!mediaFile.file) {
      return null;
    }

    if (mediaFile.file.size > fileSize) {
      Toast.show({
        icon: 'fail',
        content: `文件大小不能超过${Math.round(fileSize / 1024 / 1024)}MB`
      });
      return null;
    }

    const fileItem = await createUploadFileItem(mediaFile.file, {
      usage: props.usage,
      bucket: props.bucket,
      permission: props.permission,
      preview: mediaFile.preview,
      uid: `${Date.now()}-${Math.random()}`
    });

    return {
      ...fileItem,
      previewUrl: mediaFile.preview || fileItem.preview || '',
      videoDuration: mediaFile.duration || 0
    } as IFileObjVoBase;
  };

  const collectBrowserFileItems = async (files: File[]) => {
    const nextFiles: IFileObjVoBase[] = [];

    for (const file of files) {
      if (file.size > fileSize) {
        Toast.show({
          icon: 'fail',
          content: `文件大小不能超过${Math.round(fileSize / 1024 / 1024)}MB`
        });
        continue;
      }

      if (fileList.length + nextFiles.length >= maxNum) {
        Toast.show({
          icon: 'fail',
          content: `最多只能上传${maxNum}个文件`
        });
        break;
      }

      const fileObj = await createUploadFileItem(file, {
        usage: props.usage,
        bucket: props.bucket,
        permission: props.permission
      });
      nextFiles.push(fileObj);
    }

    return nextFiles;
  };

  const handleBrowserFileChange = async (files: File[]) => {
    if (readonly) {
      return;
    }

    const nextFiles = await collectBrowserFileItems(files);
    appendFiles(nextFiles);
  };

  const handleWeChatImageSelect = async (wechatUpload: IWeChatUploadConfig) => {
    if (fileList.length >= maxNum) {
      Toast.show({
        icon: 'fail',
        content: `最多只能上传${maxNum}个文件`
      });
      return;
    }

    try {
      const selectedImages = await chooseWeChatImages(
        {
          count: multiple ? maxNum - fileList.length : 1
        },
        wechatUpload
      );
      const newFiles = (
        await Promise.all(selectedImages.map(image => createFileItemFromWeChat(image)))
      ).filter(Boolean) as IFileObjVoBase[];

      appendFiles(newFiles);
    } catch (error) {
      if (error instanceof Error && error.message.includes('用户取消')) {
        return;
      }

      console.error('微信图片选择失败:', error);
      if (wechatUpload.autoFallbackToInput !== false) {
        Toast.show({
          icon: 'fail',
          content: '微信图片选择失败，已切换系统文件选择'
        });
        openBrowserPicker();
        return;
      }

      Toast.show({
        icon: 'fail',
        content: '微信图片选择失败'
      });
    }
  };

  const handleWeChatVideoSelect = async (wechatUpload: IWeChatUploadConfig) => {
    if (fileList.length >= maxNum) {
      Toast.show({
        icon: 'fail',
        content: `最多只能上传${maxNum}个文件`
      });
      return;
    }

    try {
      const selectedVideo = await chooseWeChatVideo(
        {
          camera: capture === 'user' ? 'front' : 'back'
        },
        wechatUpload
      );

      if (!selectedVideo) {
        return;
      }

      const videoFileItem = await createFileItemFromWeChat(selectedVideo);
      if (videoFileItem) {
        appendFiles([videoFileItem]);
        return;
      }

      const canFallbackToInput = wechatUpload.autoFallbackToInput !== false;
      Toast.show({
        icon: 'fail',
        content: canFallbackToInput
          ? '当前微信视频无法直接上传，已切换系统文件选择'
          : '当前微信视频无法直接转换为可上传文件'
      });

      if (canFallbackToInput) {
        openBrowserPicker();
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('用户取消')) {
        return;
      }

      console.error('微信视频选择失败:', error);
      const canFallbackToInput = wechatUpload.autoFallbackToInput !== false;
      Toast.show({
        icon: 'fail',
        content: canFallbackToInput
          ? '当前微信环境不支持直接拍摄视频，已切换系统文件选择'
          : '当前微信环境不支持直接拍摄视频'
      });

      if (canFallbackToInput) {
        openBrowserPicker();
      }
    }
  };

  const handleSelectTrigger = async () => {
    if (readonly) {
      return;
    }

    const wechatUpload = getUploadConfig().wechatUpload;
    const supportsImage = imageOnly || acceptIncludesType(accept, 'image');
    const supportsVideo = acceptIncludesType(accept, 'video');

    if (!canUseWeChatUpload(wechatUpload)) {
      openBrowserPicker();
      return;
    }

    if (supportsVideo && !supportsImage) {
      await handleWeChatVideoSelect(wechatUpload as IWeChatUploadConfig);
      return;
    }

    if (supportsImage && !supportsVideo) {
      await handleWeChatImageSelect(wechatUpload as IWeChatUploadConfig);
      return;
    }

    openBrowserPicker();
  };

  useImperativeHandle(uploadRef, () => ({
    startUpload: async (
      relId?: string,
      config?: {
        tipsStart?: boolean;
        tipsEnd?: boolean;
      }
    ) => {
      if (fileList.length === 0) {
        return [];
      }
      if (!config) {
        config = {
          tipsStart: true,
          tipsEnd: true
        };
      }

      const uploadConfig = getUploadConfig();
      const fileKeyRequest = props.fileKeyRequest || uploadConfig.fileKeyRequest;
      const uploadRequest = props.uploadRequest || uploadConfig.uploadRequest;
      if (config.tipsStart) {
        Toast.show({
          icon: 'loading',
          content: '开始上传...',
          duration: 0
        });
      }

      try {
        const processedFiles: IFileObjVoBase[] = [];
        for (let index = 0; index < fileList.length; index += 1) {
          const item = fileList[index];
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

        const newFiles = await fileKeyRequest!(processedFiles);

        for (let index = 0; index < newFiles.length; index += 1) {
          const file = newFiles[index];
          if (file.status === 'success') {
            continue;
          }

          file.status = 'uploading';
          if (props.bucket) {
            file.bucket = props.bucket;
          }
          setFileList([...newFiles]);

          if (file.originFileObj) {
            file.oldFile = false;
            await uploadRequest!(file, (progress: IProgressInfo) => {
              file.percent = progress.percent * 100;
              setFileList([...newFiles]);
            });
          }

          file.status = 'success';
          file.name = `(已上传)${file.name}`;
        }

        setFileList(newFiles);
        onChange?.(newFiles);
        if (config.tipsEnd) {
          Toast.show({
            icon: 'success',
            content: '上传成功'
          });
        }
        return newFiles;
      } catch (error) {
        console.log('上传失败:', error);
        Toast.show({
          icon: 'fail',
          content: '上传失败'
        });
        throw error;
      }
    }
  }));

  const handleRemove = (index: number) => {
    if (readonly) {
      return;
    }

    const removedFile = fileList[index];
    const newFileList = [...fileList];
    newFileList.splice(index, 1);

    if (removedFile?.uid) {
      setPreviewMap(prev => {
        const nextMap = { ...prev };
        delete nextMap[String(removedFile.uid)];
        return nextMap;
      });
    }

    updateFileList(newFileList);
  };

  const handlePreview = async (file: IFileObjVoBase) => {
    const wechatUpload = getUploadConfig().wechatUpload;
    const currentUrl = file.preview || file.url;

    if (
      wechatUpload?.preferPreviewImage &&
      currentUrl &&
      fileUtils.isImageFile(file.fileName || file.name || '') &&
      canUseWeChatUpload(wechatUpload)
    ) {
      try {
        const imageUrls = fileList
          .map(item => item.preview || item.url)
          .filter((url): url is string => Boolean(url));
        const previewed = await previewWeChatImage(imageUrls, currentUrl, wechatUpload);

        if (previewed) {
          return;
        }
      } catch (error) {
        console.error('微信图片预览失败:', error);
      }
    }

    setPreviewFile(file);
    setPreviewVisible(true);
  };

  const handleDownload = (file: IFileObjVoBase) => {
    if (isWeChatEnv()) {
      if (file.url) {
        domUtils.copyToClipboard(file.url);
        Toast.show({ content: '复制成功，请打开浏览器进行下载', icon: 'success' });
      }
      return;
    }
    if (onDownload) {
      onDownload(file);
    } else if (file.url) {
      imageUtils.downloadImage(file.url, file.fileName || file.name || '文件');
    }
  };

  const tipsDom = (
    <>
      {fileList.length === 0 && <div className="upload-tip-nofile">未上传</div>}
      <div className="upload-tip">请确认上传的文件资料是非涉密文件资料</div>
    </>
  );

  const browserInputDom = (
    <input
      ref={browserInputRef}
      type="file"
      multiple={multiple}
      accept={accept}
      capture={capture}
      onChange={event => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
          void handleBrowserFileChange(files);
        }
        event.target.value = '';
      }}
      style={{ display: 'none' }}
    />
  );

  const wechatUpload = getUploadConfig().wechatUpload;
  const useWeChatImagePicker =
    !readonly &&
    canUseWeChatUpload(wechatUpload) &&
    (imageOnly || acceptIncludesType(accept, 'image'));

  if (imageOnly) {
    const imageItems: ImageUploadItem[] = fileList.map(file => ({
      url: previewMap[String(file.uid)] || file.previewUrl || file.preview || '',
      key: file.uid
    }));
    const disabledClass = disabled ? 'disabled' : '';
    const detailsClass = details ? 'details' : '';
    const showDelete = !readonly;

    return (
      <div
        className={`ah-file-upload ah-file-upload-${disabledClass} ah-file-upload-${detailsClass}`}
        style={style}
      >
        {browserInputDom}
        <ImageUploader
          deletable={showDelete}
          disableUpload={readonly || useWeChatImagePicker}
          value={imageItems}
          onChange={items => {
            if (readonly) {
              return;
            }

            if (items.length < imageItems.length) {
              const remainingFiles = fileList.filter(file => {
                const fileKey = file.uid || file.name || '';
                return items.some(item => item.key === fileKey);
              });

              updateFileList(remainingFiles);
            }
          }}
          upload={async file => {
            if (readonly) {
              throw new Error('详情模式下不允许上传文件');
            }

            const [fileObj] = await collectBrowserFileItems([file]);
            if (!fileObj) {
              throw new Error('文件未通过校验');
            }

            mergePreviewMap([fileObj]);
            updateFileList([...fileList, fileObj]);

            return {
              url: fileObj.preview || '',
              key: fileObj.uid
            };
          }}
          multiple={multiple}
          maxCount={maxNum}
          accept={accept}
          capture={capture}
        />
        {!readonly && fileList.length < maxNum && useWeChatImagePicker && (
          <div className="add-file-button">
            <button type="button" className="add-button" onClick={() => void handleSelectTrigger()}>
              <AddOutline fontSize={20} />
              <span>{selectText}</span>
            </button>
          </div>
        )}
        {tipsDom}
      </div>
    );
  }

  return (
    <div className="ah-file-upload" style={style}>
      {browserInputDom}
      {fileList.length > 0 && (
        <div className="file-list">
          {fileList.map((file, index) => (
            <div key={file.uid || index} className="file-item">
              <div
                className="file-info"
                onClick={disabled ? undefined : () => void handlePreview(file)}
              >
                <FileIcon
                  suffix={file.suffix!}
                  previewURL={fileUtils.isImageFile(file.name) ? file.preview || file.url : undefined}
                />
                <div className="file-details">
                  <div className="file-name">{`${file.name.substring(0, 5)}...`}</div>
                  <div className="file-size">
                    {file.size ? `${Math.round(file.size / 1024)}KB` : ''}
                  </div>
                  {file.status === 'uploading' && (
                    <div className="upload-progress">上传中 {file.percent || 0}%</div>
                  )}
                </div>
              </div>
              <div className="file-actions">
                {file.url && (
                  <Button size="mini" fill="none" onClick={() => handleDownload(file)}>
                    下载
                  </Button>
                )}
                {!readonly && (
                  <Button size="mini" fill="none" color="danger" onClick={() => handleRemove(index)}>
                    删除
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!readonly && fileList.length < maxNum && (
        <div className="add-file-button">
          <button type="button" className="add-button" onClick={() => void handleSelectTrigger()}>
            <AddOutline fontSize={20} />
            <span>{selectText}</span>
          </button>
        </div>
      )}
      {tipsDom}

      <FilePreview
        file={previewFile}
        visible={previewVisible}
        onClose={() => setPreviewVisible(false)}
      />
    </div>
  );
};

export default AhFileUpload;