/**
 * AhPageContent 演示用本地模拟数据（日常生活场景）：
 * - SALES_RECORDS：超市销售清单
 * - PROCURE_RECORDS：工厂采购单
 * - paginate：本地内存分页，返回 AhPageContent 需要的分页结构
 */

export type SaleRow = {
  /** 小票号 */
  id: string;
  /** 商品名称 */
  productName: string;
  /** 商品条码 */
  barcode: string;
  /** 商品分类 */
  category: string;
  /** 单价（元） */
  price: number;
  /** 数量 */
  quantity: number;
  /** 金额（元） */
  amount: number;
  /** 门店 */
  store: string;
  /** 收银员 */
  cashier: string;
  /** 支付方式 */
  payType: string;
  /** 销售时间 */
  saleTime: string;
};

export type ProcureRow = {
  /** 采购单号 */
  id: string;
  /** 物料名称 */
  materialName: string;
  /** 规格型号 */
  spec: string;
  /** 供应商 */
  supplier: string;
  /** 采购数量 */
  quantity: number;
  /** 单价（元） */
  unitPrice: number;
  /** 金额（元） */
  amount: number;
  /** 采购员 */
  buyer: string;
  /** 收货仓库 */
  warehouse: string;
  /** 状态 */
  status: string;
  /** 备注 */
  remark: string;
};

/** 门店下拉选项（供演示的筛选表单使用） */
export const STORE_OPTIONS = [
  { label: '朝阳大悦城店', value: '朝阳大悦城店' },
  { label: '海淀中关村店', value: '海淀中关村店' },
  { label: '西城西直门店', value: '西城西直门店' },
  { label: '丰台方庄店', value: '丰台方庄店' }
];

/** 商品池：[商品名称, 分类, 单价] */
const PRODUCT_POOL: [string, string, number][] = [
  ['蒙牛纯牛奶250ml×16盒整箱装', '乳品饮料', 49.9],
  ['伊利金典有机纯牛奶250ml×12盒', '乳品饮料', 65],
  ['农夫山泉饮用天然水550ml×24瓶', '乳品饮料', 32],
  ['可口可乐零度汽水330ml×24罐', '乳品饮料', 45],
  ['乐事薯片原味104g家庭分享装', '休闲零食', 8.9],
  ['奥利奥夹心饼干巧克力味97g', '休闲零食', 6.5],
  ['三只松鼠每日坚果750g礼盒装', '休闲零食', 89],
  ['旺旺雪饼原味84g×4包经济装', '休闲零食', 12.8],
  ['百草味蜜汁猪肉脯200g袋装', '休闲零食', 19.9],
  ['金龙鱼食用植物调和油5L桶装', '粮油调味', 62.9],
  ['海天生抽酱油1.28L瓶装', '粮油调味', 12.9],
  ['福临门东北大米5kg袋装', '粮油调味', 42.9],
  ['太太乐三鲜鸡精454g罐装', '粮油调味', 15.9],
  ['红富士苹果一级果2.5kg盒装', '生鲜果蔬', 25.8],
  ['海南香蕉约1kg把装', '生鲜果蔬', 9.9],
  ['有机西红柿约500g盒装', '生鲜果蔬', 7.8],
  ['冷鲜猪里脊肉300g盒装', '生鲜果蔬', 26.9],
  ['维达抽纸3层100抽×24包整箱', '日用百货', 79.9],
  ['蓝月亮洗衣液2kg瓶装', '日用百货', 29.9],
  ['妙洁保鲜盒三件套', '日用百货', 22.5],
  ['心相印卷纸10卷提装', '日用百货', 18.9],
  ['舒肤佳香柠沐浴露720ml', '个护清洁', 35.9],
  ['云南白药牙膏120g', '个护清洁', 19.9],
  ['立白洗洁精1.29kg瓶装', '个护清洁', 11.9]
];

const STORES = STORE_OPTIONS.map((item) => item.value);
const CASHIERS = ['王丽', '李静', '张敏', '刘洋', '陈晨'];
const PAY_TYPES = ['微信支付', '支付宝', '现金', '银行卡'];

/** 超市销售清单：48 条，覆盖多个门店与分类 */
export const SALES_RECORDS: SaleRow[] = Array.from({ length: 48 }, (_, i) => {
  const [productName, category, price] = PRODUCT_POOL[i % PRODUCT_POOL.length];
  const quantity = (i * 7) % 5 + 1;
  const day = (i % 20) + 1;
  return {
    id: `S202603${String(day).padStart(2, '0')}${String(i + 1).padStart(4, '0')}`,
    productName,
    barcode: `6901234${String(10000 + i * 37).slice(-6)}`,
    category,
    price,
    quantity,
    amount: Number((price * quantity).toFixed(2)),
    store: STORES[i % STORES.length],
    cashier: CASHIERS[i % CASHIERS.length],
    payType: PAY_TYPES[i % PAY_TYPES.length],
    saleTime: `2026-03-${String(day).padStart(2, '0')} ${String(9 + (i % 12)).padStart(2, '0')}:${String(
      (i * 13) % 60
    ).padStart(2, '0')}`
  };
});

/** 物料池：[物料名称, 规格型号, 单价] */
const MATERIAL_POOL: [string, string, number][] = [
  ['304不锈钢冷轧钢板', 'GB/T 3280 2.0mm×1219mm×2438mm', 158],
  ['6061-T6铝合金棒材', 'Φ50mm×3000mm', 86],
  ['热镀锌方通', '40×40×2.5mm×6m', 42.5],
  ['BV铜芯电线', 'BV2.5mm² 100m/卷', 168],
  ['深沟球轴承', '6204-2RS', 6.8],
  ['EPDM橡胶密封条', '9mm×3mm 50m/卷', 45],
  ['环氧树脂粉末涂料', 'RAL7035 25kg/袋', 320],
  ['碳钢平焊法兰', 'DN80 PN1.6', 58],
  ['六角头螺栓', 'M12×45 8.8级 200件/盒', 76],
  ['PVC-U排水管', 'DN110×4m', 39.9],
  ['亚克力导光板', '1220×2440×3mm', 145],
  ['工业铝型材', '4040欧标 6m/根', 62]
];

const SUPPLIERS = [
  '无锡宏达金属材料有限公司',
  '苏州联创新材料科技有限公司',
  '宁波恒力紧固件制造有限公司',
  '佛山金泰五金制品有限公司',
  '青岛瑞泰橡塑制品有限公司'
];
const BUYERS = ['赵建国', '孙志强', '周晓东'];
const WAREHOUSES = ['一号原料仓库', '二号五金仓库', '东区辅料仓库'];
const STATUSES = ['已入库', '待验收', '已入库', '部分到货'];
const REMARKS = [
  '按合同约定分两批交货，首批已到港，质检抽样合格后办理入库',
  '供应商发票随货同行，金额与采购订单核对无误后安排付款',
  '该物料为产线常备库存，低于安全库存时按经济批量补货',
  '需提供材质证明与出厂检验报告，验收不合格整批退回'
];

/** 工厂采购单：12 条 */
export const PROCURE_RECORDS: ProcureRow[] = Array.from({ length: 12 }, (_, i) => {
  const [materialName, spec, unitPrice] = MATERIAL_POOL[i % MATERIAL_POOL.length];
  const quantity = (i * 5) % 40 + 10;
  const day = (i % 18) + 1;
  return {
    id: `CG202603${String(day).padStart(2, '0')}${String(i + 1).padStart(3, '0')}`,
    materialName,
    spec,
    supplier: SUPPLIERS[i % SUPPLIERS.length],
    quantity,
    unitPrice,
    amount: Number((unitPrice * quantity).toFixed(2)),
    buyer: BUYERS[i % BUYERS.length],
    warehouse: WAREHOUSES[i % WAREHOUSES.length],
    status: STATUSES[i % STATUSES.length],
    remark: REMARKS[i % REMARKS.length]
  };
});

export type DemoPageParams = { pageNum?: number; pageSize?: number; keyword?: string };

/** 本地内存分页，返回 AhPageContent 消费的分页结构 */
export function paginate<T>(list: T[], params: DemoPageParams, predicate?: (row: T) => boolean) {
  const filtered = predicate ? list.filter(predicate) : list;
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 10;
  const start = (pageNum - 1) * pageSize;
  const records = filtered.slice(start, start + pageSize);
  return {
    records,
    list: records,
    total: filtered.length,
    size: pageSize,
    current: pageNum,
    pages: Math.ceil(filtered.length / pageSize)
  };
}

/**
 * 按日期区间过滤（配合组件的时间筛选：字段值为 {startDay, endDay} 字符串）。
 * getDate 返回 'YYYY-MM-DD HH:mm' 形式，只比较日期部分
 */
export function filterByDayRange<T>(
  list: T[],
  range: unknown,
  getDate: (row: T) => string
): T[] {
  if (!range || typeof range !== 'object') {
    return list;
  }
  const { startDay, endDay } = range as { startDay?: string; endDay?: string };
  if (!startDay && !endDay) {
    return list;
  }
  return list.filter((row) => {
    const day = getDate(row).slice(0, 10);
    if (startDay && day < startDay.slice(0, 10)) {
      return false;
    }
    if (endDay && day > endDay.slice(0, 10)) {
      return false;
    }
    return true;
  });
}

/** 应用排序对象（组件内置排序/列头排序合并后的结果），key 为字段名，true=升序 */
export function applySort<T>(list: T[], sort: unknown, getKey: (row: T, key: string) => unknown): T[] {
  if (!sort || typeof sort !== 'object') {
    return list;
  }
  const entries = Object.entries(sort as Record<string, unknown>);
  if (entries.length === 0) {
    return list;
  }
  const [key, asc] = entries[0];
  const dir = asc === true ? 1 : -1;
  return [...list].sort((a, b) => {
    const va = getKey(a, key);
    const vb = getKey(b, key);
    if (typeof va === 'number' && typeof vb === 'number') {
      return (va - vb) * dir;
    }
    return String(va).localeCompare(String(vb)) * dir;
  });
}
