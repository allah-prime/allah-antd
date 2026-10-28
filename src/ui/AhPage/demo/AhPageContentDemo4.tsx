import { AhPageContent } from '../../index';

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
    title: '所属门店',
    dataIndex: 'store',
    key: 'store',
    width: '20%',
    ellipsis: true
  }
];

const request = async (params: { pageNum?: number; pageSize?: number }): Promise<any> => {
  return {
    records: [],
    list: [],
    total: 0,
    size: params.pageSize || 10,
    current: params.pageNum || 1,
    pages: 0
  };
};
export default () => (
  <div
    style={{
      height: 800
    }}
  >
    <AhPageContent defParams={{ pageSize: 10, pageNum: 1 }} request={request} columns={columns} />
  </div>
);
