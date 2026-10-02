import { LoadingOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import React from 'react';
import { viewportToPixels } from '../../theling-utils';
/**
 * 生成列表的加载状态，一般用在上拉加载的场景里面
 * @param data 数据
 */
export const buildListLoading = (data: {
  loading: boolean;
  noMore: boolean;
  total: number;
  pageNum: number;
  /**
   * 页面级别的loading
   */
  pageLoading?: boolean;
}) => {
  if (data.total === 0) {
    return null;
  }

  if (data.pageNum === 1 && data.pageLoading) {
    return null;
  }

  const handleLoadingTips = () => {
    if (data.loading && !data.pageLoading) {
      return (
        <div>
          <LoadingOutlined /> 正在努力加载数据~
        </div>
      );
    }
    if (data.noMore) {
      return <span>没有更多数据了~</span>;
    }
    return null;
  };

  const handleDataTips = () => {
    if (!data.noMore && !data.loading) {
      return (
        <div>
          <LoadingOutlined /> 正在努力加载数据~
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      {handleLoadingTips()}
      {handleDataTips()}
      <span style={{ float: 'right', fontSize: 12 }}>
        总计:
        {data.total || 0}
      </span>
    </div>
  );
};

export type IModelSizeObj = {
  height: string | number;
  marginTop: string | number;
  width: string | number;
  heightNum: number;
  widthNum: number;
};

/**
 * 获取弹出弹窗的大小
 * @param size 大小模式
 * @param width 宽度
 */
export const modelSize = (size: SizeType, width: number | string = 90): IModelSizeObj => {
  let modeSize: IModelSizeObj = {} as IModelSizeObj;
  switch (size) {
    case 'small':
      modeSize = {
        height: '76vh',
        marginTop: '12vh',
        width: typeof width === 'number' ? `${width - 20}%` : width,
        heightNum: 0,
        widthNum: 0
      };
      break;
    case 'middle':
    case 'medium':
      modeSize = {
        height: '82vh',
        marginTop: '9vh',
        width: typeof width === 'number' ? `${width - 10}%` : width,
        heightNum: 0,
        widthNum: 0
      };
      break;
    default:
      modeSize = {
        height: '90vh',
        marginTop: '5vh',
        width: typeof width === 'number' ? `${width}%` : width,
        heightNum: 0,
        widthNum: 0
      };
      break;
  }
  modeSize.heightNum = viewportToPixels(modeSize.height as string);
  modeSize.widthNum = viewportToPixels(modeSize.width as string);
  return modeSize;
};

/**
 * 带颜色的span
 */
export const ColorSpan: React.FC<{
  color?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ color = 'var(--ant-primary-color)', children, style = {} }) => (
  <span style={{ color, ...style }}>{children}</span>
);

/**
 * antd的状态颜色
 */
export const antdStatusColor = {
  success: '#52c41a',
  processing: '#1890ff',
  error: '#ff4d4f',
  default: '#d9d9d9',
  warning: '#faad14'
};

/**
 * 根据http状态码获取对应的颜色
 */
export const getHttpCodeColor = (code: number) => {
  if (code >= 200 && code < 300) {
    return antdStatusColor.success;
  }
  if (code >= 300 && code < 400) {
    return antdStatusColor.warning;
  }
  if (code >= 400 && code < 500) {
    return antdStatusColor.error;
  }
  if (code >= 500) {
    return antdStatusColor.error;
  }
  return antdStatusColor.warning;
};

export default {
  buildListLoading,
  modelSize,
  ColorSpan
};
