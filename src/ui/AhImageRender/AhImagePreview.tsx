import { IFileObjVoBase } from '../../theling-utils';
import { Image, Spin } from 'antd';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import AhAntdConfig from '../utils/AhAntdConfig';
import AhModal from '../AhModal';
import { defImgUrl } from './index';
import './AhImagePreview.less';

/**
 * 组件属性定义
 */
interface AhImagePreviewProps {
  /** 关联ID */
  relId: string;
  /** 文件类型，video 时按视频展示，其它按图片展示 */
  type?: 'video' | 'image';
  /** 业务场景 */
  busiScene?: string;
  /** 图片样式 */
  style?: React.CSSProperties;
  /** 显示图片数量限制，0表示显示全部 */
  maxCount?: number;
  /** 自定义样式类名 */
  className?: string;
  /** 容器样式 */
  containerStyle?: React.CSSProperties;
  /** 图片预览组配置 */
  preview?:
    | boolean
    | {
        open?: boolean;
        onOpenChange?: (open: boolean) => void;
        /** @deprecated 请使用 open */
        visible?: boolean;
        /** @deprecated 请使用 onOpenChange */
        onVisibleChange?: (visible: boolean) => void;
      };
  /** 图片加载失败时的占位图 */
  fallback?: string;
  /** 根据关联ID获取文件列表的接口 */
  getFileByRelId?: (params: {
    relId: string;
    busiScene?: string;
    useType?: string;
  }) => Promise<IFileObjVoBase[]>;
  /** 根据文件ID获取签名URL的接口 */
  getSignUrlByFileId?: (fileId: string) => Promise<string>;
  showDefImg?: boolean;
  useType?: string;
}

/**
 * 组件暴露的方法接口
 */
export interface AhImagePreviewRef {
  /** 刷新图片列表 */
  refresh: () => Promise<void>;
  /** 文件列表 */
  fileList: IFileObjVoBase[];
}

/**
 * 图片预览组件
 * 根据relId和busiScene获取图片列表并提供预览功能
 */
const AhImagePreview = forwardRef<AhImagePreviewRef, AhImagePreviewProps>((props, ref) => {
  const {
    relId,
    type,
    busiScene,
    style = {
      width: 200,
      height: 200,
      borderRadius: 10
    },
    maxCount = 0,
    className,
    containerStyle,
    preview = true,
    fallback = defImgUrl,
    showDefImg = true,
    useType
  } = props;

  // 响应式数据 - 只保留一个fileList状态
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<IFileObjVoBase[]>([]);
  const [videoModal, setVideoModal] = useState<{ visible: boolean; src: string; title: string }>({
    visible: false,
    src: '',
    title: ''
  });
  const thumbnailStyle = {
    width: style?.width,
    height: style?.height,
    borderRadius: style?.borderRadius
  };

  /**
   * 判断当前文件是否按视频渲染
   * 规则：优先使用外部传入type，其次根据文件后缀兜底判断
   */
  const isVideoFile = useCallback(
    (file: IFileObjVoBase) => {
      if (type === 'video') {
        return true;
      }
      if (type === 'image') {
        return false;
      }

      const suffix = (file?.suffix || '').toString().trim().toLowerCase().replace(/^\./, '');
      const videoSuffixSet = new Set([
        'mp4',
        'avi',
        'mov',
        'wmv',
        'flv',
        'mkv',
        'webm',
        'm4v',
        '3gp'
      ]);
      return videoSuffixSet.has(suffix);
    },
    [type]
  );
  /**
   * 计算显示的图片列表 - 直接从fileList中过滤，并且只显示有previewUrl的文件
   */
  const displayImages = React.useMemo(() => {
    const validImages = fileList.filter((file) => file.previewUrl);
    if (maxCount > 0) {
      return validImages.slice(0, maxCount);
    }
    return validImages;
  }, [fileList, maxCount]);

  /**
   * 获取图片列表数据
   */
  const fetchImages = useCallback(async () => {
    if (!relId || !busiScene) {
      return;
    }

    const uploadConfig = AhAntdConfig.getUploadConfig();

    // 优先使用props传入的接口，否则使用全局配置
    const getFileByRelId = props.getFileByRelId || uploadConfig.getFileByRelId;
    const getSignUrlByFileId = props.getSignUrlByFileId || uploadConfig.getSignUrlByFileId;

    // 检查必要的配置 - 参考AhImageRender的错误处理方式
    if (!getFileByRelId || !getSignUrlByFileId) {
      console.error('无效的配置信息，请补充getFileByRelId或getSignUrlByFileId');
      return;
    }

    try {
      setLoading(true);

      // 调用接口获取附件列表
      const imgList = await getFileByRelId?.({
        relId,
        busiScene,
        useType: useType
      });

      console.log('获取图片列表:', imgList);

      if (imgList && imgList.length > 0) {
        // 并行获取所有图片的签名URL并填充到previewUrl字段
        const fileListWithUrls = await Promise.all(
          imgList.map(async (item: IFileObjVoBase) => {
            try {
              const previewUrl = await getSignUrlByFileId?.(item.zlFileId || item.fileId);
              return {
                ...item,
                previewUrl
              };
            } catch (error) {
              console.warn(`获取文件${item.fileId}的预览URL失败:`, error);
              return {
                ...item,
                previewUrl: fallback // 失败时使用默认图片
              };
            }
          })
        );

        // @ts-ignore
        setFileList(fileListWithUrls);
      } else {
        setFileList([]);
      }
    } catch (err: any) {
      console.error('获取图片失败:', err);
      setFileList([]);
    } finally {
      setLoading(false);
    }
  }, [relId, busiScene, props.getFileByRelId, props.getSignUrlByFileId, fallback]);

  /**
   * 图片加载错误处理
   */
  const handleImageError = useCallback(
    (index: number) => {
      console.warn(`图片加载失败，索引: ${index}`);
      // 更新对应文件的previewUrl为默认图片
      setFileList((prev) => {
        const newList = [...prev];
        const displayIndex = fileList.findIndex((_, i) => i === index);
        if (displayIndex !== -1 && newList[displayIndex]) {
          newList[displayIndex] = {
            ...newList[displayIndex],
            previewUrl: fallback
          };
        }
        return newList;
      });
    },
    [fileList, fallback]
  );

  // 监听props变化，重新获取图片
  useEffect(() => {
    if (relId && busiScene) {
      fetchImages();
    }
  }, [relId, busiScene, fetchImages]);

  // 暴露方法给父组件
  useImperativeHandle(
    ref,
    () => ({
      refresh: fetchImages,
      fileList
    }),
    [fetchImages, fileList]
  );

  // 渲染加载状态
  if (loading) {
    return (
      <div className={`ah-image-preview-container ${className || ''}`} style={containerStyle}>
        <div className="loading-container">
          <Spin size="small" />
          <span className="loading-text">加载中...</span>
        </div>
      </div>
    );
  }

  // 渲染图片列表
  if (displayImages.length > 0) {
    return (
      <div className={`ah-image-preview-container ${className || ''}`} style={containerStyle}>
        <Image.PreviewGroup
          preview={
            typeof preview === 'boolean'
              ? preview
              : (() => {
                  const { visible, onVisibleChange, open, onOpenChange, ...restPreview } = preview;
                  return {
                    onChange: (current: number, prev: number) =>
                      console.log(`current index: ${current}, prev index: ${prev}`),
                    open: open ?? visible,
                    onOpenChange: onOpenChange ?? onVisibleChange,
                    ...restPreview
                  };
                })()
          }
        >
          {displayImages.map((file, index) => (
            <div
              key={file.fileId}
              className="image-item"
              style={{
                borderRadius: style?.borderRadius || 0
              }}
            >
              {isVideoFile(file) ? (
                <div
                  onClick={() =>
                    setVideoModal({
                      visible: true,
                      src: file.previewUrl,
                      title: file.fileName || `视频${index + 1}`
                    })
                  }
                >
                  <video
                    src={file.previewUrl}
                    style={{
                      display: 'block',
                      objectFit: 'cover',
                      ...thumbnailStyle
                    }}
                    onError={() => handleImageError(index)}
                  />
                </div>
              ) : (
                <Image
                  src={file.previewUrl}
                  style={style}
                  fallback={fallback}
                  onError={() => handleImageError(index)}
                  alt={file.fileName || `图片${index + 1}`}
                />
              )}
            </div>
          ))}
        </Image.PreviewGroup>
        <AhModal
          open={videoModal.visible}
          title={videoModal.title}
          footer={null}
          centered
          width={860}
          onCancel={() => setVideoModal((v) => ({ ...v, visible: false, src: '' }))}
          styles={{ body: { padding: '12px 0 0' } }}
          destroyOnHidden
        >
          <video
            src={videoModal.src}
            controls
            autoPlay
            style={{ width: '100%', maxHeight: '70vh', display: 'block', background: '#000' }}
          />
        </AhModal>
      </div>
    );
  }
  if (showDefImg) {
    // 渲染无图片状态 - 显示默认图片
    return (
      <div className={`ah-image-preview-container ${className || ''}`} style={containerStyle}>
        <div className="no-image-container">
          <div className="image-item">
            <Image
              src={fallback}
              style={style}
              className="default-image"
              alt="默认图片"
              preview={false}
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
});

AhImagePreview.displayName = 'AhImagePreview';

export default AhImagePreview;
