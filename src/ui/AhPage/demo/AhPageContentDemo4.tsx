import { AhPageContent } from '../../index';

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

const request = async (params: any): Promise<any> => {
  return {
    data: {} as any,
    records: []
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
