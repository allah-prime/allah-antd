import { AhPageContent } from '../../index';
import { SALES_RECORDS, paginate } from './demoData';

const columns = [
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '25%',
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
    width: '15%'
  },
  {
    title: '销售金额（元）',
    dataIndex: 'amount',
    key: 'amount',
    width: '10%'
  },
  {
    title: '所属门店',
    dataIndex: 'store',
    key: 'store',
    width: '10%',
    ellipsis: true
  },
  {
    title: '收银员',
    dataIndex: 'cashier',
    key: 'cashier',
    width: '10%'
  },
  {
    title: '支付方式',
    dataIndex: 'payType',
    key: 'payType',
    width: '10%'
  }
];

const defParams = {
  pageSize: 50, // 设置较大的pageSize来展示全部数据
  pageNum: 1
};

const request = (params: { pageNum: any; pageSize: any }) => paginate(SALES_RECORDS, params);

export default () => (
  <div style={{ height: 500 }}>
    <AhPageContent
      containerHeight={500}
      defParams={defParams}
      request={request}
      columns={columns}
      tableProps={{
        pagination: false
      }}
      searchLayout="card"
    />
  </div>
);
