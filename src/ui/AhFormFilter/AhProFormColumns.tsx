import type { ProFormColumnsType } from '@ant-design/pro-components';
import { ProForm } from '@ant-design/pro-components';
import React from 'react';
import AsyncCascader from '../AsyncCascader';

export type IAhFormFilterProps = {
  columns?: ProFormColumnsType[];
};

/**
 * 使用switch来生成表单
 * @param item 表单项
 */
export const buildFormItem = (item: ProFormColumnsType): React.ReactNode => {
  switch (item.valueType as any) {
    case 'asyncCascader':
      return (
        <ProForm name={item.dataIndex as string}>
          <AsyncCascader label={item.title as string} asyncReq={item.request as any} />
        </ProForm>
      );
    default:
      return null;
  }
};

/**
 * 表单组渲染
 */
const AhProFormColumns: React.FC<IAhFormFilterProps> = ({ columns = [] }) => {
  if (columns.length === 0) {
    return null;
  }
  return <>{columns.map(buildFormItem)}</>;
};

export default AhProFormColumns;
