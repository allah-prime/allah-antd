import React, { useState } from 'react';
import { Button, Input, Space, Tag } from 'antd';
import AhFormDetail, { type IAhFormDetailColumn, type IAhFormDetailRenderer } from '../index';

interface Supplier {
  name: string;
  code?: string;
  status: string;
  source: string;
  region?: string;
  remark: string;
}

const columns: IAhFormDetailColumn<Supplier>[] = [
  { title: '供应商', dataIndex: 'name', valueType: 'text', disabled: true },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'inactive' }
    ]
  },
  {
    title: '供应商编码',
    dataIndex: 'code',
    valueType: 'text',
    renderFunKey: 'supplierCode',
    verRules: { required: true }
  },
  { title: '来源', dataIndex: 'source', valueType: 'text', renderFunKey: 'sourceTag' },
  { title: '地区', dataIndex: 'region', valueType: 'text', renderFunKey: 'region' },
  { title: '备注', dataIndex: 'remark', valueType: 'text', renderFunKey: 'tag' }
];

const renderFunObj: Record<string, IAhFormDetailRenderer<Supplier>> = {
  supplierCode: {
    renderValue: (value) => value ? <code>{value}</code> : '未分配编码',
    renderControl: ({ value, onChange, disabled }) => (
      <Input aria-label="供应商编码" value={value ?? ''} onChange={(event) => onChange(event.target.value)} disabled={disabled} />
    )
  },
  sourceTag: {
    renderValue: (value) => <Tag>{value}</Tag>
  }
};

const localSupplier: Supplier = {
  name: '本地供应商',
  code: 'SUP-001',
  status: 'active',
  source: '手工录入',
  region: '南通',
  remark: '常用供应商'
};
const newSupplier: Supplier = { name: '新供应商', status: 'inactive', source: '手工录入', remark: '待核实' };
const newSupplierColumns = columns.map((column) =>
  column.dataIndex === 'status' ? { ...column, title: '供应商状态' } : column
);

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 1200));

export default function ConfigDemo() {
  const [supplier, setSupplier] = useState<Supplier | undefined>(localSupplier);
  const [confirmed, setConfirmed] = useState<Supplier>();

  return (
    <Space orientation="vertical" size={16} style={{ display: 'flex' }}>
      <Space wrap>
        <Button onClick={() => setSupplier(localSupplier)}>查看本地供应商</Button>
        <Button onClick={() => setSupplier(newSupplier)}>切换新供应商</Button>
        <Button onClick={() => setSupplier(undefined)}>加载远程供应商</Button>
      </Space>
      <AhFormDetail
        formId="supplier"
        columns={supplier === newSupplier ? newSupplierColumns : columns}
        dataSource={supplier}
        request={async () => {
          await delay();
          return { ...localSupplier, name: '远程供应商', source: '远程导入' };
        }}
        renderFunObj={renderFunObj}
        editable
        onFieldSave={async () => {
          await delay();
          return true;
        }}
        onDataChange={setConfirmed}
      />
      {confirmed && <pre aria-label="保存结果">{JSON.stringify(confirmed, null, 2)}</pre>}
    </Space>
  );
}
