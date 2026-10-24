import React from 'react';
import AhFormDetail from '../index';
import type { ProColumns } from '@ant-design/pro-components';

/**
 * 多种数据类型示例
 */
const TypesDemo: React.FC = () => {
  const dataSource = {
    date: '20240115',
    money: 1212100,
    money2: -12345.33,
    state: 'open',
    switch: true,
    percent: 85,
    text: '这是一个普通文本',
  };

  const columns: ProColumns[] = [
    {
      title: '普通文本',
      dataIndex: 'text',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '时间',
      dataIndex: 'date',
      valueType: 'date',
    },
    {
      title: '开关状态',
      dataIndex: 'switch',
      valueType: 'switch',
    },
    {
      title: '金额（带符号）',
      dataIndex: 'money',
      valueType: 'money',
      fieldProps: {
        moneySymbol: '$',
      },
    },
    {
      title: '金额（无符号）',
      dataIndex: 'money2',
      valueType: 'money',
      fieldProps: {
        moneySymbol: false,
      },
    },
    {
      title: '百分比',
      dataIndex: 'percent',
      valueType: 'percent',
    },
  ];

  return (
    <AhFormDetail
      title="多种数据类型展示"
      columns={columns}
      dataSource={dataSource}
      bordered
      column={2}
      size="default"
    />
  );
};

export default TypesDemo;