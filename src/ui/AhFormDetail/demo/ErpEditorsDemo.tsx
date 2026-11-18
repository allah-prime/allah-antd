import type { IAntTreeNode, IFileObjVoBase } from '@allahjs/utils';
import { Button, InputNumber, Space, Typography, theme } from 'antd';
import React, { useRef, useState } from 'react';
import AhFormDetail from '../index';
import type { IAhFormDetailColumn } from '../types';

const departments = [
  { label: '华东', value: 'east', children: [{ label: '南通', value: 'nantong' }] }
];
const warehouses = [
  { id: 1, name: '原料仓' },
  { id: 2, name: '成品仓' }
];
const responsibilityNodes: IAntTreeNode[] = [
  { key: 'purchase', value: 'purchase', title: '采购组', label: '采购组', isLeaf: true }
];
const regionNodes: IAntTreeNode[] = [
  { key: 'cn', value: 'cn', title: '中国', label: '中国', isLeaf: false }
];
const provinces: IAntTreeNode[] = [
  { key: 'js', value: 'js', title: '江苏', label: '江苏', isLeaf: true }
];
const contacts = [{ label: '李敏', value: 'li' }, { label: '王平', value: 'wang' }];

const initialRecord = {
  id: 'order-101',
  attachments: [] as IFileObjVoBase[],
  department: undefined as string | undefined,
  deliveryArea: [] as string[],
  responsibility: [] as string[],
  serviceArea: [] as string[],
  contact: 'li',
  warehouse: undefined as (typeof warehouses)[number] | undefined,
  limits: { quantity: 8 },
  channels: ['online'],
  orderNumber: 'PO-20261118-001',
  supplierName: '南通广兴包装',
  deliveryDate: '2026-12-01',
  quantity: 120,
  unitPrice: 38.5,
  taxRate: 13,
  urgent: false,
  paymentMethod: 'monthly',
  remark: '到货前请联系仓库确认收货时间。'
};

export default function ErpEditorsDemo({
  layout = 'horizontal',
  column = 1,
  grouped = false
}: {
  layout?: 'horizontal' | 'vertical';
  column?: number;
  grouped?: boolean;
}) {
  const { token } = theme.useToken();
  const [record, setRecord] = useState(initialRecord);
  const [submitted, setSubmitted] = useState<string>();
  const [transferCount, setTransferCount] = useState(0);
  const hasRejectedUpload = useRef(false);
  const columns: IAhFormDetailColumn<typeof initialRecord>[] = [
    {
      title: '附件',
      dataIndex: 'attachments',
      editor: {
        type: 'upload',
        props: {
          busiScene: 'purchase-order',
          fileKeyRequest: async files => files.map(file => ({
            ...file,
            fileId: file.uid,
            dbFileId: file.uid,
            fileName: file.name,
            cosKey: `demo/${file.uid}`
          })),
          uploadRequest: async file => {
            if (file.name === 'retry.txt' && !hasRejectedUpload.current) {
              hasRejectedUpload.current = true;
              throw new Error('模拟网络中断，请重试');
            }
            setTransferCount(count => count + 1);
            return file.cosKey;
          }
        }
      }
    },
    { title: '部门', dataIndex: 'department', valueType: 'treeSelect', options: departments },
    { title: '送货地区', dataIndex: 'deliveryArea', valueType: 'cascader', options: departments },
    {
      title: '负责小组',
      dataIndex: 'responsibility',
      editor: {
        type: 'asyncTree',
        props: {
          title: '选择负责小组',
          asyncReq: async () => responsibilityNodes,
          initDataReq: async keys => responsibilityNodes.filter(node => keys.includes(node.value))
        },
        renderValue: value => responsibilityNodes.filter(node => value?.includes(node.value)).map(node => node.label).join('、') || '暂无数据'
      }
    },
    {
      title: '服务地区',
      dataIndex: 'serviceArea',
      editor: {
        type: 'asyncCascader',
        props: {
          asyncReq: async key => key === 'cn' ? provinces : regionNodes.map(node => ({ ...node })),
          valuesReq: async () => [{ label: '江苏', value: 'js' }],
          defStyle: true
        },
        renderValue: value => value?.length ? '江苏' : '暂无数据'
      }
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      editor: {
        type: 'selectSearch',
        props: {
          options: contacts,
          fetchOptions: async keyword => contacts.filter(contact => contact.label.includes(keyword))
        },
        renderValue: value => contacts.find(contact => contact.value === value)?.label || '暂无数据'
      }
    },
    {
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse-picker',
      editor: {
        type: 'modalSelect',
        title: '选择仓库',
        allowClear: true,
        renderPicker: ({ select }) => (
          <Space orientation="vertical" size={8}>
            {warehouses.map(warehouse => (
              <Button key={warehouse.id} onClick={() => select(warehouse)}>{warehouse.name}</Button>
            ))}
          </Space>
        )
      }
    },
    {
      title: '限额',
      dataIndex: ['limits', 'quantity'],
      editor: {
        type: 'custom',
        renderControl: ({ value, onChange, disabled }) => (
          <InputNumber min={1} value={value} onChange={onChange} disabled={disabled} />
        )
      },
      rules: [{ required: true, message: '请输入限额' }]
    },
    {
      title: '渠道',
      dataIndex: 'channels',
      valueType: 'checkbox',
      options: [{ label: '线上', value: 'online' }, { label: '线下', value: 'offline' }]
    },
    {
      title: '采购单号', dataIndex: 'orderNumber',
      rules: [{ required: true, message: '请输入采购单号' }]
    },
    {
      title: '供应商', dataIndex: 'supplierName',
      rules: [{ required: true, message: '请输入供应商名称' }]
    },
    { title: '交货日期', dataIndex: 'deliveryDate', valueType: 'date' },
    { title: '采购数量', dataIndex: 'quantity', valueType: 'digit' },
    { title: '含税单价', dataIndex: 'unitPrice', valueType: 'money' },
    { title: '税率', dataIndex: 'taxRate', valueType: 'percent' },
    { title: '是否加急', dataIndex: 'urgent', valueType: 'switch' },
    {
      title: '付款方式', dataIndex: 'paymentMethod', valueType: 'radio',
      options: [{ label: '月结', value: 'monthly' }, { label: '现付', value: 'cash' }]
    },
    { title: '备注', dataIndex: 'remark', valueType: 'textarea' }
  ];

  const displayedColumns = grouped
    ? [
        { title: '基础信息', valueType: 'title' as const },
        ...['orderNumber', 'supplierName', 'contact', 'department', 'responsibility', 'urgent']
          .map(key => columns.find(item => item.dataIndex === key)!),
        { title: '采购信息', valueType: 'title' as const },
        ...['quantity', 'unitPrice', 'taxRate', 'paymentMethod', 'deliveryDate', 'channels']
          .map(key => columns.find(item => item.dataIndex === key)!),
        { ...columns.find(item => item.dataIndex === 'warehouse')!, span: 1 },
        { ...columns.find(item => item.dataIndex === 'deliveryArea')!, span: 2 },
        { ...columns.find(item => Array.isArray(item.dataIndex))!, span: 1 },
        { ...columns.find(item => item.dataIndex === 'serviceArea')!, span: 2 },
        { ...columns.find(item => item.dataIndex === 'remark')!, span: 3 },
        { title: '附件', valueType: 'title' as const },
        { ...columns.find(item => item.dataIndex === 'attachments')!, span: 3 }
      ]
    : columns;

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <AhFormDetail
        dataSource={record}
        columns={displayedColumns}
        column={column}
        labelWidth={100}
        bordered={layout !== 'vertical'}
        descriptionsProps={{ layout }}
        editable
        onDataChange={setRecord}
      />
      <Space wrap size={8}>
        <Button
          type="primary"
          onClick={() => setSubmitted(JSON.stringify(record, (_key, value) => value === undefined ? null : value, 2))}
        >
          提交已确认数据
        </Button>
        <Typography.Text type="secondary">修改字段后先点击确认，再提交查看完整 JSON。</Typography.Text>
      </Space>
      <Typography.Text>模拟上传次数：{transferCount}</Typography.Text>
      {submitted && (
        <pre
          aria-label="提交的 JSON 数据"
          style={{
            margin: 0,
            padding: 16,
            borderRadius: token.borderRadiusLG,
            background: token.colorFillAlter,
            color: token.colorText,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere'
          }}
        >
          {submitted}
        </pre>
      )}
    </Space>
  );
}
