import type { IFormColumns } from '@allahjs/utils';
import { Button } from 'antd';
import React, { useState } from 'react';
import AhModal from '../../AhModal';
import AhFormDetail from '../index';

const initialSupplier = {
  name: '广兴包装',
  contact: '李敏',
  phone: '13800138000'
};

const columns: IFormColumns<typeof initialSupplier>[] = [
  { title: '供应商名称', dataIndex: 'name', valueType: 'text' },
  {
    title: '联系人',
    dataIndex: 'contact',
    valueType: 'text',
    rules: [{ required: true, message: '请输入联系人' }]
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    valueType: 'text',
    rules: [
      { required: true, message: '请输入联系电话' },
      { pattern: /^1\d{10}$/, message: '请输入 11 位手机号' }
    ]
  }
];

export default function ModalEditableDemo() {
  const [open, setOpen] = useState(false);
  const [supplier, setSupplier] = useState(initialSupplier);

  return (
    <>
      <Button onClick={() => setOpen(true)}>查看供应商详情</Button>
      <AhModal
        title="供应商详情"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <AhFormDetail
          columns={columns}
          dataSource={supplier}
          column={1}
          labelWidth={120}
          editable
          onDataChange={setSupplier}
        />
      </AhModal>
    </>
  );
}
