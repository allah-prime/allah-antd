import { Button, DatePicker, Form, Input, Select, Space, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import AhModal from '../../AhModal';
import AhSplitEditLayout from '../index';

interface Policy {
  enterpriseName: string;
  summary: string;
  content: string;
  publishDate?: Dayjs;
  publishDepartment: string;
  policyNumber?: string;
  policyLevel?: string;
}

const initialPolicy: Policy = {
  enterpriseName: '杭州星云科技有限公司',
  summary: '为符合条件的中小企业提供技术改造支持。',
  content: '',
  publishDepartment: ''
};

export default function PolicyDemo() {
  const [open, setOpen] = useState(false);
  const [policy, setPolicy] = useState<Policy>();

  const close = () => setOpen(false);
  const submit = (values: Policy) => {
    setPolicy(values);
    close();
  };

  return (
    <>
      <Space orientation="vertical" size={8}>
        <Button onClick={() => setOpen(true)}>编辑政策信息</Button>
        {policy && (
          <Typography.Text>
            已保存 {policy.enterpriseName} · {policy.summary} · {policy.publishDepartment}
          </Typography.Text>
        )}
      </Space>
      <AhModal
        title="政策信息"
        open={open}
        onCancel={close}
        width={960}
        height="72vh"
        destroyOnHidden
        styles={{ body: { padding: 0 } }}
        scrollYStyles={{ padding: 0 }}
      >
        <Form<Policy>
          layout="vertical"
          initialValues={policy ?? initialPolicy}
          onFinish={submit}
          style={{ height: '100%' }}
        >
          <AhSplitEditLayout
            header={
              <Form.Item
                name="enterpriseName"
                label="企业名称"
                rules={[{ required: true, message: '请输入企业名称' }]}
                style={{ marginBottom: 0 }}
              >
                <Input />
              </Form.Item>
            }
            sidebar={
              <>
                <Form.Item
                  name="publishDepartment"
                  label="发布部门"
                  rules={[{ required: true, message: '请输入发布部门' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="publishDate" label="发布时间">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="policyNumber" label="文号">
                  <Input />
                </Form.Item>
                <Form.Item name="policyLevel" label="政策级别">
                  <Select
                    options={[
                      { label: '国家级', value: 'national' },
                      { label: '省级', value: 'provincial' },
                      { label: '区县级', value: 'district' }
                    ]}
                  />
                </Form.Item>
              </>
            }
            footer={
              <Space>
                <Button onClick={close}>取消</Button>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Space>
            }
          >
            <Form.Item
              name="summary"
              label="政策摘要"
              rules={[{ required: true, message: '请输入政策摘要' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item name="content" label="政策正文">
              <Input.TextArea rows={12} />
            </Form.Item>
          </AhSplitEditLayout>
        </Form>
      </AhModal>
    </>
  );
}
