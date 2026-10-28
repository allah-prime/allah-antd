import { IAhPageContentFunc, AhPageContent } from '../../index';
import { Button, Form, Segmented, Space } from 'antd';
import { useRef } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import { SALES_RECORDS, STORE_OPTIONS, paginate } from './demoData';

const columns = [
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '20%',
    ellipsis: true
  },
  {
    title: '商品编码',
    dataIndex: 'barcode',
    key: 'barcode',
    width: '20%',
    ellipsis: true
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: '20%'
  },
  {
    title: '销售金额（元）',
    dataIndex: 'amount',
    key: 'amount',
    width: '20%'
  },
  {
    title: '所属门店',
    dataIndex: 'store',
    key: 'store',
    width: '20%',
    ellipsis: true
  }
];

const request = (params: { pageNum: any; pageSize: any; keyword?: string; category?: string }) =>
  paginate(
    SALES_RECORDS,
    params,
    (row) =>
      (!params.keyword || row.productName.includes(params.keyword)) &&
      (!params.category || params.category === '全部' || row.category === params.category)
  );

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
              keyword: '洗衣',
              category: '日用百货'
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
          keyword: '牛奶',
          category: '全部'
        }}
        searchForm={[
          <Form.Item name="category" key="category">
            <Segmented options={['全部', '乳品饮料', '休闲零食', '粮油调味', '日用百货']} />
          </Form.Item>,
          <ProFormSelect name="store" key="store" options={STORE_OPTIONS} />
        ]}
        containerHeight={500}
        request={request}
        columns={columns}
      />
    </div>
  );
};
