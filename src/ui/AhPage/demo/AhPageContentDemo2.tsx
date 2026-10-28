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
    width: '15%'
  },
  {
    title: '所属门店',
    dataIndex: 'store',
    key: 'store',
    width: '25%',
    ellipsis: true
  }
];

const request = (params: { pageNum: any; pageSize: any }) => paginate(SALES_RECORDS, params);

export default () => (
  <div
    style={{
      height: 800
    }}
  >
    <AhPageContent
      searchLayout="card"
      defParams={{ pageSize: 10, pageNum: 1 }}
      containerHeight={500}
      request={request}
      columns={columns}
    />
  </div>
);
