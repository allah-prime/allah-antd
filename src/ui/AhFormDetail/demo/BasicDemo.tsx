import React from 'react';
import { AhFormDetail } from '../index';
import type { ProColumns } from '@ant-design/pro-components';

/**
 * 基础用法示例
 */
const BasicDemo: React.FC = () => {
  const dataSource = {
    id: '1',
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    createTime: '2024-01-15',
    department: '技术部',
    position: '前端工程师',
  };

  const columns: ProColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '部门',
      dataIndex: 'department',
    },
    {
      title: '职位',
      dataIndex: 'position',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
    },
  ];

  return (
    <AhFormDetail
      title="用户基本信息"
      columns={columns}
      dataSource={dataSource}
      bordered
      column={2}
      size="default"
    />
  );
};

export default BasicDemo;