import { Button } from 'antd';
import React, { useState } from 'react';
import AhModal from '../../AhModal';
import ErpEditorsDemo from './ErpEditorsDemo';

export default function ErpModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>打开采购详情</Button>
      <AhModal
        title="采购详情"
        open={open}
        onCancel={() => setOpen(false)}
        width={1000}
        height="80vh"
        scrollY
        scrollYPadding={24}
        footer={null}
      >
        <ErpEditorsDemo layout="vertical" column={3} grouped />
      </AhModal>
    </>
  );
}
