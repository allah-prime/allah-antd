import { Button, message } from 'antd';
import { AhPageContent } from '../../index';

/**
 * 横向滚动 + 列省略演示：
 * - 列宽总和 > 容器宽度时自动出现横向滚动
 * - 超长文案配合 ellipsis:true 按列宽显示省略号
 */
const LONG_NAME =
  '北京市市场监督管理局关于食品经营许可审查细则及跨区域协同监管事项说明（超长标题用于验证省略）';

const columns = [
  {
    title: '条目名称',
    dataIndex: 'standardItem',
    key: 'standardItem',
    width: 220,
    ellipsis: true,
    fixed: 'start' as const
  },
  {
    title: '短ID',
    dataIndex: 'shortId',
    key: 'shortId',
    width: 140,
    ellipsis: true
  },
  {
    title: '编码',
    dataIndex: 'scopeCode',
    key: 'scopeCode',
    width: 180,
    ellipsis: true
  },
  {
    title: '行业类型',
    dataIndex: 'industryType',
    key: 'industryType',
    width: 180,
    ellipsis: true,
    render: (text: any) => text || '食品生产与流通综合监管行业类型示例文本'
  },
  {
    title: '所属区域',
    dataIndex: 'areaName',
    key: 'areaName',
    width: 200,
    ellipsis: true,
    render: (text: any) => text || '北京市朝阳区望京街道科技园片区示例区域名称'
  },
  {
    title: '数据来源',
    dataIndex: 'dataSource',
    key: 'dataSource',
    width: 200,
    ellipsis: true,
    render: (text: any) => text || '国家企业信用信息公示系统同步数据来源'
  },
  {
    title: '更新人',
    dataIndex: 'updateUser',
    key: 'updateUser',
    width: 140,
    ellipsis: true,
    render: (text: any) => text || '系统管理员-张三丰'
  },
  {
    title: '备注说明',
    dataIndex: 'remark',
    key: 'remark',
    width: 240,
    ellipsis: true,
    render: () =>
      '本条记录用于演示横向滚动场景下固定列与省略号同时生效，请左右滑动表格查看更多字段'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (text: any) => text || '正常'
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'end' as const,
    render: () => (
      <a href="#" style={{ color: '#1890ff' }}>
        查看详情
      </a>
    )
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
  <div style={{ height: 500, maxWidth: 860, border: '1px dashed #d9d9d9', padding: 8 }}>
    <AhPageContent
      containerHeight={484}
      defParams={defParams}
      request={request}
      columns={columns}
      searchLayout="card"
      footerRender={() => (
        <Button type="primary" onClick={() => message.info('点击了新增')}>
          新增
        </Button>
      )}
    />
  </div>
);
