import React from 'react';
import AhFormDetail from '../index';
import type { IFormColumns } from '@allahjs/utils';

/**
 * 单字段编辑示例
 */
const EditableDemo: React.FC = () => {
  const dataSource = {
    name: '张三',
    state: 'open',
    date: '2024-01-15',
    age: 28,
    enabled: true,
    remark: '这是一段备注信息，点击铅笔后可以直接编辑'
  };

  const columns: IFormColumns<any>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
      rules: [{ required: true, message: '请输入姓名' }]
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部' },
        open: { text: '未解决' },
        closed: { text: '已解决' }
      }
    },
    {
      title: '日期',
      dataIndex: 'date',
      valueType: 'date'
    },
    {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit'
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      valueType: 'switch'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea'
    }
  ];

  // 模拟单字段保存请求，返回 false 可以让字段停留在编辑态
  const handleFieldSave = async (value: any, column: IFormColumns<any>) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`保存字段 ${String(column.dataIndex)}:`, value);
    return true;
  };

  return (
    <AhFormDetail
      columns={columns}
      dataSource={dataSource}
      editable
      onFieldSave={handleFieldSave}
      labelWidth={120}
    />
  );
};

export default EditableDemo;
