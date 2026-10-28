import { useRef, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import { Button, Space, Switch, message } from 'antd';
import type { IBaseFilter, ITablePage } from '@allahjs/utils';
import { AhPageContent, createFilterItem, type IAhPageContentFunc } from '../../index';
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
  category?: string;
  /** 销售时间区间（组件自动转换为 {startDay,endDay}） */
  saleTimeObj?: { startDay?: string; endDay?: string };
  /** 支付时间区间（多日期区间演示，与销售时间同源） */
  payTimeObj?: { startDay?: string; endDay?: string };
  sort?: Record<string, boolean>;
};

const CATEGORY_OPTIONS = ['全部', '乳品饮料', '休闲零食', '粮油调味', '生鲜果蔬', '日用百货', '个护清洁'];

const columns = [
  { title: '商品名称', dataIndex: 'productName', key: 'productName', ellipsis: true },
  { title: '分类', dataIndex: 'category', key: 'category', width: 100 },
  {
    title: '销售金额（元）',
    dataIndex: 'amount',
    key: 'amount',
    width: 130,
    sorter: true
  },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 70 },
  { title: '所属门店', dataIndex: 'store', key: 'store', width: 120, ellipsis: true },
  { title: '支付方式', dataIndex: 'payType', key: 'payType', width: 90 },
  { title: '销售时间', dataIndex: 'saleTime', key: 'saleTime', width: 150 }
];

/**
 * 筛选增强演示：
 * - searchMode="submit"：条件只暂存，点「查询」统一提交（慢后端友好）
 * - syncUrl：筛选写入 URL，刷新/分享链接可还原
 * - 多日期区间 + 自定义排序选项 + createFilterItem 类型化表单项
 * - 「模拟请求失败」开关：失败提示 + 保留旧数据；关闭后点「查询」恢复
 */
export default () => {
  const pageRef = useRef<IAhPageContentFunc<SaleRow, DemoFilter>>(undefined);
  const failRef = useRef(false);
  const [failRequest, setFailRequest] = useState(false);

  const request = async (params: DemoFilter): Promise<ITablePage<SaleRow>> => {
    if (failRef.current) {
      throw new Error('模拟网络异常');
    }
    // 模拟网络延迟，肉眼确认 submit 模式确实只在点查询时发请求
    await new Promise((resolve) => setTimeout(resolve, 400));
    const filtered = SALES_RECORDS.filter(
      (row) =>
        (!params.keyword || row.productName.includes(params.keyword)) &&
        (!params.store || row.store === params.store) &&
        (!params.category || params.category === '全部' || row.category === params.category)
    );
    const bySaleTime = filterByDayRange(filtered, params.saleTimeObj, (row) => row.saleTime);
    const sorted = applySort(bySaleTime, params.sort, (row, key) => (row as Record<string, unknown>)[key]);
    return paginate(sorted, params);
  };

  return (
    <div style={{ height: 560 }}>
      <Space style={{ marginBottom: 8 }}>
        <Switch
          checkedChildren="请求失败"
          unCheckedChildren="请求正常"
          checked={failRequest}
          onChange={(checked) => {
            failRef.current = checked;
            setFailRequest(checked);
            if (!checked) {
              message.success('已恢复，点「查询」或「重置」重新加载');
            }
          }}
        />
        <Button size="small" onClick={() => pageRef.current?.refresh()}>
          刷新
        </Button>
      </Space>
      <AhPageContent<SaleRow, DemoFilter>
        pageRef={pageRef}
        searchMode="submit"
        syncUrl
        timeSearch={[
          { field: 'saleTimeObj', label: '销售时间' },
          { field: 'payTimeObj', label: '支付时间' }
        ]}
        sortSearch={{
          label: '排序',
          options: [
            { label: '金额从高到低', value: 'amountDesc', sort: { amount: false } },
            { label: '金额从低到高', value: 'amountAsc', sort: { amount: true } },
            { label: '数量从多到少', value: 'qtyDesc', sort: { quantity: false } }
          ]
        }}
        searchForm={[
          createFilterItem<DemoFilter>(
            'store',
            <ProFormSelect key="store" name="store" label="门店" allowClear options={STORE_OPTIONS} />
          ),
          createFilterItem<DemoFilter>(
            'category',
            <ProFormSelect
              key="category"
              name="category"
              label="分类"
              initialValue="全部"
              options={CATEGORY_OPTIONS.map((item) => ({ label: item, value: item }))}
            />
          )
        ]}
        defParams={{ pageNum: 1, pageSize: 10 }}
        request={request}
        columns={columns}
        containerHeight={480}
      />
    </div>
  );
};
