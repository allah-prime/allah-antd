import { Button, type FormInstance } from 'antd';
import { useRef, useState } from 'react';
import AhModal from '../../AhModal';
import AhFormDetail, { type IAhFormDetailColumn } from '../index';

const initialRecord = { code: 'MAT-001', name: '机箱外壳', spec: 'SPCC' };
const columns: IAhFormDetailColumn<typeof initialRecord>[] = [
  { title: '编码', dataIndex: 'code', disabled: true },
  { title: '名称', dataIndex: 'name', rules: [{ required: true, message: '请输入名称' }] },
  { title: '规格', dataIndex: 'spec' }
];

export default function FullEditDemo() {
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState(initialRecord);
  const formRef = useRef<FormInstance | undefined>(undefined);

  const save = async () => {
    const form = formRef.current;
    if (!form) return;
    const values = await form.validateFields().catch(() => undefined);
    if (!values) return;
    setRecord({ ...record, ...values });
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>编辑物料</Button>
      <p>
        {record.name} / {record.spec}
      </p>
      <AhModal
        title="编辑物料"
        open={open}
        destroyOnHidden
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        okText="保存"
        cancelText="取消"
        onOk={save}
        onCancel={() => setOpen(false)}
      >
        <AhFormDetail
          mode="edit"
          columns={columns}
          dataSource={record}
          formRef={formRef}
          column={1}
          descriptionsProps={{ layout: 'vertical' }}
        />
      </AhModal>
    </>
  );
}
