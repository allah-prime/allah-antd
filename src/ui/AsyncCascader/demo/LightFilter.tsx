import { ProForm } from '@ant-design/pro-components';
import LightFilter from '../../LightFilter';
import { request } from '@allahjs/utils';
import AhProFormCascader from '../AhProFormCascader';

const getAsyncDta = (pcode: any) => {
  return request('http://theling.top:9002/cloud-service/cross/industry/asyncAntTree', {
    params: {
      pcode
    },
    method: 'get'
  }).then(res => res.map((i: any) => ({ ...i, isLeaf: !i.isLeaf })));
};

export default () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <>
      <LightFilter onValuesChange={onFinish}>
        <AhProFormCascader name="inxxx" label="行业" request={getAsyncDta} />
      </LightFilter>
      <h3>表单中使用</h3>
      <ProForm
        initialValues={{
          inxxx: ['A', '01']
        }}
        onFinish={async v => console.log(v)}
      >
        <AhProFormCascader name="inxxx" label="行业" request={getAsyncDta} />
      </ProForm>
    </>
  );
};
