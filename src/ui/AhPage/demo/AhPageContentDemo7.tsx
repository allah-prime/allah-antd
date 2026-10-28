import { Button, message } from 'antd';
import { AhPageContent } from '../../index';
import { PROCURE_RECORDS, paginate } from './demoData';

/**
 * 横向滚动 + 列省略演示（工厂采购单）：
 * - 列宽总和 > 容器宽度时自动出现横向滚动
 * - 超长文案配合 ellipsis:true 按列宽显示省略号
 */
const LONG_MATERIAL =
  '无锡宏达精密机械制造有限公司定制304不锈钢冲压件模具开发与批量供货合同明细（超长标题用于验证省略）';

const columns = [
  {
    title: '采购单号',
    dataIndex: 'id',
    key: 'id',
    width: 220,
    ellipsis: true,
    fixed: 'start' as const
  },
  {
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
    width: 240,
    ellipsis: true
  },
  {
    title: '规格型号',
    dataIndex: 'spec',
    key: 'spec',
    width: 180,
    ellipsis: true
  },
  {
    title: '供应商',
    dataIndex: 'supplier',
    key: 'supplier',
    width: 200,
    ellipsis: true
  },
  {
    title: '采购数量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100
  },
  {
    title: '单价（元）',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 100
  },
  {
    title: '金额（元）',
    dataIndex: 'amount',
    key: 'amount',
    width: 100
  },
  {
    title: '采购员',
    dataIndex: 'buyer',
    key: 'buyer',
    width: 110
  },
  {
    title: '收货仓库',
    dataIndex: 'warehouse',
    key: 'warehouse',
    width: 180,
    ellipsis: true
  },
  {
    title: '备注说明',
    dataIndex: 'remark',
    key: 'remark',
    width: 240,
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100
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
  paginate(
    PROCURE_RECORDS.map((item, index) => ({
      ...item,
      materialName: `${LONG_MATERIAL}-${index + 1}`
    })),
    params
  );

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
