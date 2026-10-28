import { AhPageContent } from '../../index';
import { ProFormSelect } from '@ant-design/pro-components';
import { SALES_RECORDS, STORE_OPTIONS, paginate } from './demoData';

const columns = [
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: 180,
    ellipsis: true
  },
  {
    title: '商品编码',
    dataIndex: 'barcode',
    key: 'barcode',
    width: 120,
    ellipsis: true
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 100
  },
  {
    title: '销售金额（元）',
    dataIndex: 'amount',
    key: 'amount',
    width: 120
  },
  {
    title: '所属门店',
    dataIndex: 'store',
    key: 'store',
    ellipsis: true
  }
];

const request = (params: { pageNum: any; pageSize: any; store?: string }) =>
  paginate(SALES_RECORDS, params, params.store ? (row) => row.store === params.store : undefined);

export default () => (
  <div
    style={{
      height: 800
    }}
  >
    <AhPageContent
      searchLayout="plugin"
      defParams={{ pageSize: 10, pageNum: 1 }}
      containerHeight={500}
      rowSelection={{}}
      rowKey="id"
      searchForm={[
        <ProFormSelect
          key="store"
          label="门店"
          name="store"
          allowClear
          options={STORE_OPTIONS}
        />
      ]}
      request={request}
      columns={columns}
    />
  </div>
);
