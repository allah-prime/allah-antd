import { Button, message } from 'antd';
import { AhPageContent } from '../../index';

/** 百分比列宽 + ellipsis 演示（超长文案用于肉眼确认省略号） */
const LONG_NAME =
  '北京市市场监督管理局关于食品经营许可审查细则及跨区域协同监管事项说明（百分比列宽省略验证）';

const columns = [
  {
    title: '条目名称',
    dataIndex: 'standardItem',
    key: 'code',
    width: '40%',
    ellipsis: true
  },
  {
    title: '短id',
    dataIndex: 'shortId',
    key: 'code',
    width: '30%',
    ellipsis: true
  },
  {
    title: '编码',
    dataIndex: 'scopeCode',
    key: 'code',
    width: '30%',
    ellipsis: true
  }
];

const defParams = {
  pageSize: 10,
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
  }).then(async (res) => {
    const data = await res.json();
    const pageData = data.result.data;
    return {
      ...pageData,
      records: (pageData.records || []).map((item: any, index: number) => ({
        ...item,
        standardItem: `${LONG_NAME}-${index + 1}`,
        shortId: `${item.shortId || 'SID'}-EXTRA-LONG-IDENTIFIER-${index + 1}`,
        scopeCode: `${item.scopeCode || 'CODE'}-LONG-SCOPE-CODE-VALUE-${index + 1}`
      }))
    };
  });

export default () => (
  <div
    style={{
      height: 800
    }}
  >
    <AhPageContent
      defParams={defParams}
      request={request}
      columns={columns}
      footerRender={() => (
        <Button type="primary" size="small" onClick={() => message.info('点击了新增')}>
          新增
        </Button>
      )}
    />
  </div>
);
