import React, { useEffect } from 'react';
import { Descriptions, DescriptionsProps } from 'antd';
import { useRequest } from 'ahooks';
import { ProColumns } from '@ant-design/pro-components';
import { AhImagePreview } from '../index';

/**
 * 详情项类型枚举
 */
export enum DetailItemType {
  TEXT = 'text',
  IMAGE = 'image'
}

/**
 * 扩展的详情项配置接口，兼容 ProColumns
 */
export interface IDetailColumn<T = any> extends Partial<ProColumns<T>> {
  /** 详情项类型 */
  detailType?: DetailItemType;
  /** 图片配置（当detailType为image时使用） */
  imageConfig?: {
    /** 图片宽度 */
    width?: number;
    /** 图片高度 */
    height?: number;
    /** 业务场景 */
    busiScene?: string;
    /** 关联字段（默认使用id） */
    relField?: string;
  };
  /** 是否在详情中隐藏 */
  hideInDetail?: boolean;
}

/**
 * 通用详情弹窗组件属性接口
 */
export interface IAhDetailModalProps<T = any> {
  /** 当前项数据（可选，如果没有传入则调用 request 接口） */
  currentItem?: T;
  /** 详情项配置数组，兼容 ProColumns */
  columns: IDetailColumn<T>[];
  /** 请求函数，类似 ProTable 的 request */
  request?: () => Promise<T>;
  /** 描述列表配置 */
  descriptionsProps?: Partial<DescriptionsProps>;
}

/**
 * 通用详情弹窗组件
 */
const AhDetailModal: React.FC<IAhDetailModalProps> = ({
  currentItem,
  columns,
  request,
  descriptionsProps = {}
}) => {
  // 请求详情数据
  const { data: detailData = {}, ...detailReq } = useRequest(
    async () => {
      // 如果有传入 currentItem，直接使用
      if (currentItem) return currentItem;
      // 如果没有传入 currentItem 但有 request 函数，则调用接口
      if (request) {
        const result = await request();
        return result;
      }
      // 都没有则返回空对象
      return {};
    },
    {
      manual: true
    }
  );

  useEffect(() => {
    // 只要有数据源（currentItem 或 request）就执行
    if (currentItem || request) {
      detailReq.run();
    }
  }, [currentItem, request]);

  /**
   * 渲染详情项内容
   */
  const renderItemContent = (column: IDetailColumn, record: any) => {
    const { dataIndex, render, detailType, imageConfig } = column;
    const value = record[dataIndex as string];

    // 如果有自定义渲染函数，优先使用（兼容 ProColumns 的 render）
    if (render) {
      return render(value, record, 0, { type: 'read' } as any, {} as any);
    }

    // 处理空值
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    // 处理图片类型
    if (detailType === DetailItemType.IMAGE) {
      const { width = 50, height = 50, busiScene = '', relField = 'id' } = imageConfig || {};

      return (
        <AhImagePreview style={{ width, height }} relId={record[relField]} busiScene={busiScene} />
      );
    }

    // 默认返回文本值
    return value;
  };

  // 过滤出需要在详情中显示的列
  const detailColumns = columns.filter(column => !column.hideInDetail);

  const { styles: descStyles, ...restDescProps } = descriptionsProps;

  // 合并默认的描述列表配置
  const defaultDescriptionsProps = {
    title: '基础信息',
    bordered: true,
    column: 2,
    size: 'small' as const,
    styles: {
      ...descStyles,
      label: { width: '15%', ...(typeof descStyles === 'object' ? descStyles?.label : undefined) },
      content: { width: '35%', ...(typeof descStyles === 'object' ? descStyles?.content : undefined) }
    },
    style: { marginBottom: 24 },
    ...restDescProps
  };

  return (
    <Descriptions
      {...defaultDescriptionsProps}
      items={detailColumns.map((column) => ({
        key: String(column.dataIndex ?? column.title),
        label: column.title as string,
        children: renderItemContent(column, detailData)
      }))}
    />
  );
};

export default AhDetailModal;
