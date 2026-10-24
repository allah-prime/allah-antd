import { AhPageContent } from '../../index';

const columns = [
  {
    title: '条目名称',
    dataIndex: 'standardItem',
    key: 'code',
    width: '25%',
    ellipsis: true
  },
  {
    title: '短ID',
    dataIndex: 'shortId',
    key: 'code',
    width: '20%',
    ellipsis: true
  },
  {
    title: '编码',
    dataIndex: 'scopeCode',
    key: 'code',
    width: '25%',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: '15%',
    render: (text: any) => text || '正常'
  },
  {
    title: '操作',
    key: 'action',
    width: '15%',
    render: () => (
      <a href="#" style={{ color: '#1890ff' }}>
        查看详情
      </a>
    )
  }
];

const defParams = {
  pageSize: 50, // 设置较大的pageSize来获取更多数据
  pageNum: 1
};

const request = (params: { pageNum: any; pageSize: any }) =>
  fetch('https://api.jyfwyun.com/cloud-service/cross/search', {
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
