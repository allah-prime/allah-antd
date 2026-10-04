import { request } from '@allahjs/utils';
import { Button, Card, Form, Modal } from 'antd';
import { useState } from 'react';
import AreaTable from '../index';
import AreaTableModal from '../AreaTableModal';

const Index = () => {
  const [value] = useState<string[]>(['120000', '350000']);
  const [visible, setVisible] = useState(false);

  const onChange = (e: string[]) => {
    console.log('e', e);
  };

  console.log(111);

  const asyncTreeData = (adminCode: string = '000000') =>
    request('http://theling.top:9002/opera-service/district/api/cross/asyncAntTree', {
      params: {
        adminCode
      },
      method: 'get'
    });

  const getTableData = (params: any) =>
    request('http://theling.top:9002/admin-service/sys/district/list', {
      params,
      manner: 'json'
    });

  const selectAllData = (params: any) =>
    request('http://theling.top:9002/opera-service/sys/district/allList', {
      params,
      manner: 'json'
    });

  const getDisList = (adminCode: string) =>
    request('http://theling.top:9002/opera-service/district/api/cross/optList', {
      params: {
        adminCode
      },
      method: 'get'
    });
  const disTypeOptReq = () =>
    request('http://theling.top:9002/opera-service/cross/dic/api/optList2', {
      params: {
        groupKey: 'dis.level'
      },
      cacheData: true
    });

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const initData = () => {
    getDisList('120000,350000').then(() => {
      console.log(12313);
      form2.setFieldsValue({
        adminCode: ['120000', '350000']
      });
    });
  };

  return (
    <div>
      <Card
        title="区域选择器"
        extra={
          <>
            <Button onClick={() => setVisible(true)}>弹窗测试1</Button>
          </>
        }
        style={{
          marginBottom: 20
        }}
      >
        <AreaTable
          selectTableData={getTableData}
          asyncTreeData={asyncTreeData}
          value={value}
          onChange={onChange}
          selectAllData={selectAllData}
          disTypeOptReq={disTypeOptReq}
          single
        />
      </Card>
      <Card
        title="区域选择器2 - 关闭互斥判断"
        style={{
          marginBottom: 20
        }}
      >
        <AreaTable
          selectTableData={getTableData}
          asyncTreeData={asyncTreeData}
          value={value}
          onChange={onChange}
          selectAllData={selectAllData}
          disTypeOptReq={disTypeOptReq}
          mutex={false}
        />
      </Card>
      <Modal width={850} open={visible} onOk={form.submit} onCancel={() => setVisible(false)}>
        <Form
          form={form}
          name="basic"
          initialValues={{ adminCode: ['120000', '350000'] }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item name="adminCode">
            <AreaTable
              selectTableData={getTableData}
              asyncTreeData={asyncTreeData}
              selectAllData={selectAllData}
              disTypeOptReq={disTypeOptReq}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Card title="表单测试">
        <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
          <Form.Item name="adminCode">
            <AreaTableModal
              selectTableData={getTableData}
              asyncTreeData={asyncTreeData}
              selectAllData={selectAllData}
              selectDefList={getDisList}
              disTypeOptReq={disTypeOptReq}
              single
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="表单测试2">
        <Form
          form={form2}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            adminCode: ['120000', '350000']
          }}
        >
          <Form.Item name="adminCode" label="适用区域">
            <AreaTableModal
              selectTableData={getTableData}
              asyncTreeData={asyncTreeData}
              selectAllData={selectAllData}
              selectDefList={getDisList}
              disTypeOptReq={disTypeOptReq}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <Button type="primary" onClick={initData}>
            赋值
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Index;
