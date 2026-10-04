import { ProForm } from '@ant-design/pro-components';
import { request } from '@allahjs/utils';
import { Button, Form } from 'antd';
import React from 'react';
import AsyncTreeModal from '../../AsyncTree/AsyncTreeModal';
import AsyncTreePlus from '../../AsyncTree/AsyncTreePlus';
import '../../FileBox/index.less';

const getAsyncDta = (pcode: any) => {
  return request('http://theling.top:9002/cloud-service/cross/industry/asyncAntTree', {
    params: {
      pcode
    },
    method: 'get'
  });
};

const selectByCodes = (codes: string[]) => {
  return request('http://theling.top:9002/cloud-service/cross/industry/selectByCodes', {
    params: {
      codes: codes.join(';')
    },
    method: 'post'
  });
};
/**
 * 需要展开的节点数据
 * @param codes 当前的节点集合
 */
const selectParentCodes = (codes: string) => {
  return request('http://theling.top:9002/cloud-service/cross/industry/selectParentCodes', {
    params: {
      codes
    },
    method: 'post'
  });
};

const AsyncTree1 = () => {
  const formRef = React.useRef<any>(undefined);

  return (
    <div style={{ width: 800, height: 800 }}>
      <Button
        onClick={() => {
          formRef.current.setFieldsValue({
            industry: ['01'],
            industry2: ['01']
          });
        }}
      >
        重新赋值
      </Button>
      <Button
        onClick={() => {
          formRef.current.setFieldsValue({
            industry: ['12', '072', '089'],
            industry2: ['12', '072', '089']
          });
        }}
      >
        重新赋值2
      </Button>
      <ProForm
        formRef={formRef}
        onValuesChange={(v) => {
          console.log('onValuesChange', v);
        }}
        onFinish={async (v) => {
          console.log(v);
        }}
        initialValues={{
          industry2: ['042', '02', '29']
        }}
      >
        <Form.Item name="industry" label="行业">
          <AsyncTreePlus
            treeStyle={{
              height: 400,
              overflowY: 'auto'
            }}
            asyncReq={getAsyncDta}
            expandedKeysReq={selectParentCodes}
            disableLevel={2}
          />
        </Form.Item>
        <Form.Item name="industry2" label="行业">
          <AsyncTreeModal
            asyncReq={getAsyncDta}
            initDataReq={selectByCodes}
            expandedKeysReq={selectParentCodes}
          />
        </Form.Item>
      </ProForm>
    </div>
  );
};

export default AsyncTree1;
