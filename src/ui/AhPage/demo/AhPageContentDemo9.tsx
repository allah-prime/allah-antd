import type { IBaseFilter, ITablePage } from '@allahjs/utils';
import { AhPageContent, type IAhFilterField, type IAhSortField } from '../../index';
import {
  SALES_RECORDS,
  STORE_OPTIONS,
  applySort,
  filterByDayRange,
  paginate,
  type SaleRow
} from './demoData';

type DemoFilter = IBaseFilter & {
  keyword?: string;
  store?: string;
  category?: string[];
  payType?: string[];
  saleTimeObj?: { startDay?: string; endDay?: string };
  sort?: Record<string, boolean>;
};

const columns = [
  { title: '商品名称', dataIndex: 'productName', key: 'productName', ellipsis: true },
  { title: '分类', dataIndex: 'category', key: 'category', width: 100 },
  { title: '销售金额（元）', dataIndex: 'amount', key: 'amount', width: 130 },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 70 },
  { title: '所属门店', dataIndex: 'store', key: 'store', width: 120, ellipsis: true },
  { title: '支付方式', dataIndex: 'payType', key: 'payType', width: 90 },
  { title: '销售时间', dataIndex: 'saleTime', key: 'saleTime', width: 150 }
];

const CATEGORIES = ['乳品饮料', '休闲零食', '粮油调味', '生鲜果蔬', '日用百货', '个护清洁'];

const filterFields: IAhFilterField[] = [
  { name: 'store', label: '门店', defaultVisible: true, options: STORE_OPTIONS as never },
  {
    name: 'category',
    label: '分类',
    type: 'multiSelect',
    defaultVisible: true,
    options: CATEGORIES.map((item) => ({ label: item, value: item }))
  },
  {
    name: 'payType',
    label: '支付方式',
    type: 'multiSelect',
    options: [
      { label: '微信支付', value: '微信支付', color: '#1aad19' },
      { label: '支付宝', value: '支付宝', color: '#1677ff' },
      { label: '现金', value: '现金', color: '#fa8c16' },
      { label: '银行卡', value: '银行卡', color: '#722ed1' }
    ]
  },
  { name: 'saleTimeObj', label: '销售时间', type: 'dateRange' }
];

const sortFields: IAhSortField[] = [
  { field: 'amount', label: '销售金额', group: '系统字段', typeLabel: '小数输入', type: 'number' },
  { field: 'quantity', label: '数量', group: '系统字段', typeLabel: '整数输入', type: 'number' },
  { field: 'saleTime', label: '销售时间', group: '系统属性', typeLabel: '日期时间选择', type: 'date' },
  { field: 'productName', label: '商品名称', group: '系统属性', typeLabel: '单行文本输入', type: 'text' }
];

const request = async (params: DemoFilter): Promise<ITablePage<SaleRow>> => {
  const filtered = SALES_RECORDS.filter(
    (row) =>
      (!params.keyword || row.productName.includes(params.keyword)) &&
      (!params.store || row.store === params.store) &&
      (!params.category?.length || params.category.includes(row.category)) &&
      (!params.payType?.length || params.payType.includes(row.payType))
  );
  const byTime = filterByDayRange(filtered, params.saleTimeObj, (row) => row.saleTime);
  const sorted = applySort(byTime, params.sort, (row, key) => (row as Record<string, unknown>)[key]);
  return paginate(sorted, params);
};

/**
 * 筛选视图管理：filterFields 声明式条件 + 多条件排序 + 视图保存/切换/清除变更。
 * 视图默认存 localStorage（按页面路径隔离）。
 */
export default () => (
  <div style={{ height: 560 }}>
    <AhPageContent<SaleRow, DemoFilter>
      filterFields={filterFields}
      sortSearch={{ fields: sortFields }}
      defParams={{ pageNum: 1, pageSize: 10 }}
      request={request}
      columns={columns}
      containerHeight={540}
    />
  </div>
);

