import type { IAhFormDetailColumn } from '../../AhFormDetail';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import AhModalForm, { type IAhModalFormMode } from '../index';

interface ICurrency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  rate: string;
}

const columns: IAhFormDetailColumn<ICurrency>[] = [
  { title: '编码', dataIndex: 'code', valueType: 'text', rules: [{ required: true, message: '请填写编码' }] },
  { title: '名称', dataIndex: 'name', valueType: 'text', rules: [{ required: true, message: '请填写名称' }] },
  { title: '符号', dataIndex: 'symbol', valueType: 'text' },
  { title: '当前汇率', dataIndex: 'rate', valueType: 'text', rules: [{ required: true, message: '请填写汇率' }] }
];

const initialRows: ICurrency[] = [
  { id: 1, code: 'USD', name: '美元', symbol: '$', rate: '7.1' },
  { id: 2, code: 'EUR', name: '欧元', symbol: '€', rate: '7.8' }
];

/** 详情、编辑、新增共用一个弹窗：4 个字段，宽度自动取一栏 400px */
export default function ColumnsDemo() {
  const [rows, setRows] = useState(initialRows);
  const [current, setCurrent] = useState<ICurrency | undefined>();
  const [mode, setMode] = useState<IAhModalFormMode>('view');
  const [visible, setVisible] = useState(false);

  const open = (row: ICurrency | undefined, next: IAhModalFormMode) => {
    setCurrent(row);
    setMode(next);
    setVisible(true);
  };

  const resolveTitle = ({ mode: m }: { mode: IAhModalFormMode }) => {
    if (m === 'create') return '新增币种';
    if (m === 'edit') return '编辑币种';
    return current?.name;
  };

  return (
    <>
      <Space orientation="vertical">
        {rows.map((row) => (
          <Button key={row.id} data-testid={`row-${row.code}`} onClick={() => open(row, 'view')}>
            {row.code} {row.name}（{row.rate}）
          </Button>
        ))}
        <Button type="primary" data-testid="add" onClick={() => open(undefined, 'create')}>
          新增币种
        </Button>
      </Space>
      <AhModalForm<ICurrency>
        testId="demo"
        visible={visible}
        columns={columns}
        dataSource={current}
        defaultMode={mode}
        title={resolveTitle}
        subTitle={({ mode: m, record }) => (m === 'view' ? record?.code : undefined)}
        onCancel={() => setVisible(false)}
        onSave={async (values, saveMode) => {
          if (saveMode === 'create') {
            setRows((list) => [...list, { ...values, id: Date.now() }]);
            return true;
          }
          const next = { ...current!, ...values };
          setRows((list) => list.map((row) => (row.id === next.id ? next : row)));
          setCurrent(next);
          return next;
        }}
      />
    </>
  );
}
