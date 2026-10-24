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

const request = (params: { pageNum: any; pageSize: any }) => {
  return fetch('https://api.jyfwyun.com/cloud-service/cross/search', {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    },
    referrer: 'https://jyfwyun.com/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: `{"s":"1649664274429","searchType":"item","pageNum":${params.pageNum},"busiCombosObj":{},"pageSize": ${params.pageSize} ,"industryTypes":[],"searchSchema":"nlp","ac":"110000"}`,
    method: 'POST',
    mode: 'cors'
  }).then(async res => {
    const data = await res.json();
    return data.result.data;
  });
};
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
