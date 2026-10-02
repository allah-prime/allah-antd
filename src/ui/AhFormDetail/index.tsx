/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import { IAhFormDetailProps } from './types';
import AhAntdConfig from '../utils/AhAntdConfig';
import { IFormColumns } from '../../theling-utils';
import {
  groupColumnsByTitle,
  generateDescriptionItems,
  getContainerStyle,
  renderDefaultPlaceholder
} from './utils';
export type { IAhFormDetailProps } from './types';

/**
 * AhFormDetail 详情展示组件
 * 基于 Ant Design Descriptions 组件封装，支持类似 ProDescriptions 的功能
 *
 * @param props 组件属性
 * @returns React.ReactElement
 */
const AhFormDetail = <T extends Record<string, any> = any>(props: IAhFormDetailProps<T>) => {
  const {
    columns,
    dataSource,
    request,
    emptyText = '暂无数据',
    descriptionsProps,
    minHeight,
    placeholder,
    showPlaceholderBorder = false,
    primaryKey = 'id'
  } = props;

  const [data, setData] = React.useState<T | undefined>(dataSource);
  const [loading, setLoading] = React.useState(false);

  // 当前的columns
  const [currentColumns, setCurrentColumns] = useState<IFormColumns<T>[]>([]);

  const initData = async () => {
    let newData = dataSource;
    let newColumns = columns;
    if (!dataSource && request) {
      newData = await request();
    }
    // 先获取表单配置，再获取数据
    const commReqConfig = AhAntdConfig.getCommReq();
    const formGroupReq = props.formGroupReq || commReqConfig.formGroupReq;
    // 获取表单配置
    if (!columns && formGroupReq) {
      newColumns = await formGroupReq(props.formId);
    }
    setData(newData);
    setCurrentColumns(newColumns || []);
  };

  useEffect(() => {
    setLoading(true);
    initData()
      .then(() => {
        // 数据初始化完成后的操作
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [props.formId]);

  const currentData = data || dataSource;

  // 如果正在加载数据，显示占位内容
  if (loading) {
    const containerStyle = getContainerStyle(minHeight, showPlaceholderBorder);
    return <div style={containerStyle}>{renderDefaultPlaceholder(placeholder, minHeight)}</div>;
  }

  /**
   * 渲染分组后的 Descriptions 组件
   * @returns 分组后的 JSX 元素数组
   */
  const renderGroupedDescriptions = () => {
    const groups = groupColumnsByTitle(currentColumns);

    const labelStyle = props.labelWidth
      ? {
          width: props.labelWidth
        }
      : {
          width: 180
        };

    return groups.map((group, index) => (
      <Descriptions
        key={group.title}
        title={group.title}
        column={props.column || { xs: 1, sm: 1, md: 1, lg: 1, xl: 2, xxl: 3 }}
        bordered
        items={generateDescriptionItems(group.columns, currentData, emptyText, primaryKey)}
        {...descriptionsProps}
        styles={{
          ...descriptionsProps?.styles,
          label: { ...labelStyle, ...(typeof descriptionsProps?.styles === 'object' ? descriptionsProps.styles.label : undefined) }
        }}
        style={{ marginBottom: index < groups.length - 1 ? 24 : 0 }}
      />
    ));
  };

  return <div>{renderGroupedDescriptions()}</div>;
};

export default AhFormDetail;
