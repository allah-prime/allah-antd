import { IAhPageContentFunc, AhPageContent } from '../../index';
import { Button, Form, Segmented, Space } from 'antd';
import { useRef } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';

const columns = [
  {
    title: '条目名称',
    dataIndex: 'standardItem',
    key: 'code',
    width: '20%',
    ellipsis: true
  },
  {
    title: '短id',
    dataIndex: 'shortId',
    key: 'code',
    width: '20%',
    ellipsis: true
  },
  {
    title: '编码',
    dataIndex: 'scopeCode',
    key: 'code',
    width: '20%',
    ellipsis: true
  }
];

const request = (params: { pageNum: any; pageSize: any }) => {
  return fetch('https://api.jyfwyun.com/cloud-service/cross/search', {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    },
    referrer: 'https://jyfwyun.com/',
    body: `{"s":"1649664274429","searchType":"item","pageNum":${params.pageNum},"busiCombosObj":{},"pageSize": ${params.pageSize} ,"industryTypes":[],"searchSchema":"nlp","ac":"110000"}`,
    method: 'POST',
    mode: 'cors'
  }).then(async (res) => {
    const data = await res.json();
    return data.result.data;
  });
};
export default () => {
  const pageRef = useRef<IAhPageContentFunc<any, any>>(undefined);
  return (
    <div
      style={{
        height: 800
      }}
    >
      <Space>
        <Button
          onClick={() => {
            pageRef.current?.updateParams({
              keyword: '测试2',
              test1: 'Map'
            });
          }}
        >
          修改筛选条件
        </Button>
      </Space>
      <AhPageContent
        pageRef={pageRef}
        searchLayout="plugin"
        defParams={{
          pageSize: 10,
          pageNum: 1,
          keyword: '测试',
          test1: 'Satellite',
          test2: undefined
        }}
        searchForm={[
          <Form.Item name="test1" key="test1">
            <Segmented options={['Map', 'Transit', 'Satellite']} />
          </Form.Item>,
          <ProFormSelect
            name="test2"
            key="test2"
            options={[
              {
                label: '张三',
                value: '1'
              },
              {
                label: '张2',
                value: '2'
              }
            ]}
          />
        ]}
        containerHeight={500}
        request={request}
        columns={columns}
      />
    </div>
  );
};
