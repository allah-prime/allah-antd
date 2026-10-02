/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Skeleton } from 'antd';
import { IFormColumns } from '../../theling-utils';
import AhImagePreview from '../AhImageRender/AhImagePreview';
import { buildNewFormItemPropsVer } from '../../theling-utils';

/**
 * 按照 title 类型的列对数据进行分组
 * @param columns 列配置数组
 * @returns 分组后的数据结构数组
 */
export const groupColumnsByTitle = <T extends Record<string, any>>(
  columns: IFormColumns<T>[]
): Array<{
  title?: string;
  columns: IFormColumns<T>[];
}> => {
  const groups: Array<{
    title?: string;
    columns: IFormColumns<T>[];
  }> = [];

  let currentGroup: IFormColumns<T>[] = [];
  let currentTitle: string | undefined;

  columns.forEach(column => {
    if (column.valueType === 'title') {
      // 如果遇到 title 类型，先保存之前的分组
      if (currentGroup.length > 0) {
        groups.push({
          title: currentTitle,
          columns: currentGroup
        });
      }
      // 开始新的分组
      currentTitle = column.title as string;
      currentGroup = [];
    } else {
      // 普通列加入当前分组
      currentGroup.push(column);
    }
  });

  // 处理最后一个分组
  if (currentGroup.length > 0) {
    groups.push({
      title: currentTitle,
      columns: currentGroup
    });
  }

  return groups;
};

const renderFunObj: any = {
  tag: (value: any) => {
    return value;
  }
};

/**
 * 渲染详情项内容
 * @param column 列配置
 * @param record 数据记录
 * @param emptyText 空值显示文本
 * @param primaryKey 主键字段名，用于文件类型的渲染
 * @returns 渲染内容
 */
export const renderItemContent = <T extends Record<string, any>>(
  column: IFormColumns<T>,
  record: T,
  emptyText: string = '暂无数据',
  primaryKey: string = 'id'
): React.ReactNode => {
  const { dataIndex, renderFunKey, valueType, valueEnum, fieldProps } = column;

  const value = record?.[dataIndex as keyof T];

  // render 是一个函数的key
  if (renderFunKey) {
    const renderFun = renderFunObj[renderFunKey];

    // 如果有自定义渲染函数，优先使用
    if (renderFun) {
      return renderFun(value, record, 0, { type: 'read' } as any, {} as any);
    }
  }

  // 处理空值
  if (value === null || value === undefined || value === '') {
    return emptyText;
  }

  // 根据 valueType 处理不同类型的数据
  switch (valueType) {
    case 'select':
      if (valueEnum) {
        const enumItem = (valueEnum as any)[value as string];
        return enumItem?.text || value;
      }
      // 处理 options 格式
      if (column.options) {
        const optionItem = column.options.find((opt: any) => opt.value === value);
        return optionItem?.label || value;
      }
      return value;

    case 'date':
      if (value && fieldProps?.format) {
        // 这里可以根据需要添加日期格式化逻辑
        return value;
      }
      return value;

    case 'switch':
      return value ? '是' : '否';

    case 'money':
      if (!fieldProps?.moneySymbol) {
        return value;
      }
      return `${fieldProps.moneySymbol}${value}`;
    case 'percent':
      return `${value}%`;
    // 如果是文件
    case 'image':
      return (
        <AhImagePreview
          relId={record[primaryKey]}
          busiScene={fieldProps?.busiScene || ''}
          style={{
            width: 60,
            height: 60,
            objectFit: 'cover',
            borderRadius: 4,
            cursor: 'pointer'
          }}
          {...fieldProps}
        />
      );
    default:
      return value;
  }
};

/**
 * 生成单个分组的 Descriptions items 配置
 * @param columns 列配置数组
 * @param data 数据源
 * @param emptyText 空值显示文本
 * @param primaryKey 主键字段名，用于文件类型的渲染
 * @returns DescriptionsProps['items'] 类型的数组
 */
export const generateDescriptionItems = <T extends Record<string, any>>(
  columns: IFormColumns<T>[],
  data: T | undefined,
  emptyText: string = '暂无数据',
  primaryKey: string = 'id'
) => {
  return columns
    .filter(item => {
      // 对数据进行
      const newColumn = buildNewFormItemPropsVer({ value: data }, item);
      return newColumn.show;
    })
    .map(column => {
      const { title, dataIndex } = column;
      return {
        key: dataIndex as string,
        label: title as string,
        children: data ? renderItemContent(column, data, emptyText, primaryKey) : emptyText
      };
    });
};

/**
 * 获取容器样式
 * @param minHeight 最小高度
 * @param showPlaceholderBorder 是否显示占位符边框
 * @returns 容器的样式对象
 */
export const getContainerStyle = (
  minHeight?: string | number,
  showPlaceholderBorder: boolean = false
): React.CSSProperties => {
  const style: React.CSSProperties = {};

  if (minHeight) {
    style.minHeight = typeof minHeight === 'number' ? `${minHeight}px` : minHeight;
  }

  if (showPlaceholderBorder) {
    style.border = '1px solid #d9d9d9';
    style.borderRadius = '6px';
    style.padding = '16px';
  }

  return style;
};

/**
 * 渲染默认占位内容
 * @param placeholder 自定义占位内容
 * @param minHeight 最小高度
 * @returns 占位内容的 JSX
 */
export const renderDefaultPlaceholder = (
  placeholder?: React.ReactNode,
  minHeight?: string | number
): React.ReactNode => {
  if (placeholder) {
    return placeholder;
  }

  // 使用 Skeleton 作为默认占位内容
  return (
    <div
      style={{
        padding: '20px 0',
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight
      }}
    >
      <Skeleton active paragraph={{ rows: 3 }} title={{ width: '30%' }} />
    </div>
  );
};
