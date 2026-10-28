import { Button, message } from 'antd';
import { AhPageContent } from '../../index';
import { SALES_RECORDS, paginate } from './demoData';

/** 百分比列宽 + ellipsis 演示（超长商品名用于肉眼确认省略号） */
const LONG_NAME = '进口低温巴氏杀菌鲜牛奶950ml家庭装冷链直达会员惠选系列限定商品（百分比列宽省略验证）';

const columns = [
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: '40%',
    ellipsis: true
  },
  {
    title: '商品编码',
    dataIndex: 'barcode',
    key: 'barcode',
    width: '30%',
    ellipsis: true
  },
  {
    title: '所属门店',
    dataIndex: 'store',
    key: 'store',
    width: '30%',
    ellipsis: true
  }
];

const defParams = {
  pageSize: 10,
  pageNum: 1
};

const request = (params: { pageNum: any; pageSize: any }) =>
  paginate(
    SALES_RECORDS.map((item, index) => ({
      ...item,
      productName: `${LONG_NAME}-${index + 1}`,
      barcode: `${item.barcode}-EXTRA-LONG-BARCODE-IDENTIFIER-${index + 1}`
    })),
    params
  );

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
