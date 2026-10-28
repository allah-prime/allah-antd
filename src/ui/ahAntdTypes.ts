import { ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { IAhProTableProps } from './AhProTable/AhProTable';
import React from 'react';
import { ITablePage } from '@allahjs/utils';
import type { IUseItemTableProps, IUseAhPageConfigProps } from './hooks/interface';

/**
 * 搜索区域的props
 */
export type ISearchContentProps = {
  /**
   * 搜索表单扩充，你可以传递一个数组进来，它会渲染在keyword搜索的前面
   */
  searchForm?: React.ReactNode;
  /**
   * 搜索表单数组
   */
  searchForms?: React.ReactNode[];
  /**
   * 渲染搜索区域的右侧，一般是一些按钮
   */
  searchExtra?: React.ReactNode;
  /**
   * 筛选条件 - 标题
   */
  title?: string | React.ReactNode;
  /**
   * 筛选条件标题图标。不传时使用 antd 的 FilterOutlined；传入时按 iconfont 的 type 渲染
   */
  iconFontType?: string;
  /**
   * 在筛标题的右侧
   */
  titleExtra?: React.ReactNode;
  /**
   * 是否显示收起和展开按钮
   */
  showExpand?: boolean;
  /**
   * 自定义头部渲染
   */
  headerRender?: (props: ISearchContentProps) => React.ReactNode;
  /**
   * 是否显示展开收起
   */
  showOpenHide?: boolean;
  /**
   * 自定义class
   */
  className?: string;
};

/** 声明式筛选字段 */
export type IAhFilterField = {
  /** 对应请求参数的 key */
  name: string;
  label: string;
  /** 值控件类型，默认 select */
  type?: 'select' | 'multiSelect' | 'input' | 'dateRange';
  options?: Array<{ label: string; value: string | number; color?: string }>;
  /** 与 options 二选一，key 为值、value 为文案 */
  valueEnum?: Record<string, React.ReactNode>;
  /** 菜单类字段的选项超过该数量时显示搜索框，默认 8 */
  searchThreshold?: number;
  /** 透传给值控件（antd Select / Input / RangePicker） */
  fieldProps?: Record<string, unknown>;
  /** 默认以 chip 外露（即使没有值），如「状态类型」「处理人」 */
  defaultVisible?: boolean;
};

/** 排序字段 */
export type IAhSortField = {
  field: string;
  label: string;
  /** 字段分组（如「系统字段」「自定义属性」），下拉按分组展示 */
  group?: string;
  /** 字段类型提示，显示在下拉项右侧（如「日期时间选择」） */
  typeLabel?: string;
  /** 值类型，决定升降序默认文案：date「最晚 → 最早」、number「大 → 小」、text「Z → A」 */
  type?: 'date' | 'number' | 'text';
  /** 降序文案，优先于 type 默认值 */
  descLabel?: string;
  /** 升序文案，优先于 type 默认值 */
  ascLabel?: string;
};

/** 筛选视图 */
export type IAhFilterView = {
  id: string;
  name: string;
  /** 视图快照：筛选参数 + keyword + sort（不含分页） */
  params: Record<string, unknown>;
};

export type IAhFilterViewsConfig = {
  /** 本地存储 key 后缀，默认取 location.pathname */
  storageKey?: string;
  /** 传入则受控（不再读写 localStorage） */
  views?: IAhFilterView[];
  /** 受控：当前选中的视图 id，undefined 为内置「全部」 */
  activeViewId?: string;
  /** 内置默认视图名称，默认「全部」 */
  defaultViewName?: string;
  /** 新建/更新/重命名视图（同 id 即更新） */
  onSave?: (view: IAhFilterView) => void;
  onDelete?: (id: string) => void;
  /** 切换视图，id 为 undefined 表示回到默认视图 */
  onSelect?: (id?: string) => void;
};

export type IAhCardListPageFunc<T, F> = {
  /**
   * 刷新
   */
  refresh: () => Promise<ITablePage<T>>;
  asyncRefresh: () => void;
  /**
   * 更新参数
   */
  updateParams: (v: F) => void;
  /**
   * 获取当前的全部数据
   */
  getListData?: () => ITablePage<T>;
  /**
   * 更新数据 - 你需要先使用getListData来获取数据
   */
  updateData: (v: ITablePage<T>) => void;
  /**
   * 更新数据 - 这个会根据主键去找到那个数据进行更新
   */
  updateOneData: (v: T) => void;
  /**
   * 添加数据到列表
   */
  addData: (items: T | T[]) => void;
  /**
   * 根据主键删除数据
   */
  deleteData: (id: any) => void;
};

export type IAhPageContentFunc<T, F> = {
  /**
   * 刷新
   */
  refresh: (resetPageIndex?: boolean | undefined) => Promise<void>;
  asyncRefresh: (resetPageIndex?: boolean | undefined) => void;
  /**
   * 更新参数
   */
  updateParams: (v: F) => void;
  /**
   * 更新参数
   * @param v
   */
  setParams: (v: F) => void;
  /**
   * 获取列表数据
   */
  getListData?: () => Promise<ITablePage<T>>;
};

export type IAhPageContentProps<T, F> = IUseAhPageConfigProps<T> & {
  /**
   * 需要减去的高度 - 默认160，如果是子页面的话，需要设置为206
   */
  subHeight?: number;
  /**
   * 搜索表单扩充，你可以传递一个数组进来，它会渲染在keyword搜索的前面。
   * 也支持 render-prop 形态：(form) => ReactNode，可拿到表单实例。
   */
  searchForm?: ISearchContentProps['searchForm'] | ((form?: ProFormInstance) => React.ReactNode);
  /**
   * 请求函数
   */
  request: IUseItemTableProps<T, F>['request'];
  /**
   * 表格的配置
   */
  columns: ProColumns<any, any>[];
  /**
   * 表格的主键
   */
  rowKey?: string;
  /**
   * 默认的查询参数 - 该数据为非响应式的，该数据的变化不会触发列表的刷新
   */
  defParams?: IUseItemTableProps<T, F>['defValue'];
  /**
   * 受控的params - 该数据是响应式的，该数据的变化会触发列表的刷新
   */
  params?: IUseItemTableProps<T, F>['defValue'];
  /**
   * 修改params
   */
  setParams?: React.Dispatch<React.SetStateAction<F>>;
  /**
   * 表格横向滚动宽度（可选覆盖）。
   * 未传时：像素列宽按总和计算；百分比列宽不设 scroll.x（兼容 ellipsis，勿用 max-content）。
   */
  xScroll?: number;
  /**
   * 表格的额外配置
   */
  tableProps?: IAhProTableProps<any, any, any>;
  /**
   * SearchContent的额外配置
   */
  searchContentProps?: ISearchContentProps;
  /**
   * 子元素
   */
  children?: React.ReactNode;

  /**
   * 页面的钩子
   */
  pageRef?: React.MutableRefObject<IAhPageContentFunc<T, F> | undefined>;
  /**
   * 搜索区域的渲染
   */
  searchRender?: (update: (v: F) => void) => React.ReactNode;
  /**
   * 搜索区域的渲染
   */
  searchContentRender?: (update: (v: F) => void) => React.ReactNode;
  /**
   * 最外层的样式
   */
  style?: React.CSSProperties;
  /**
   * 搜索区域的样式 卡片还是div
   */
  searchLayout?: 'card' | 'div' | 'plugin';
  /**
   * 搜索区域的样式
   */
  searchLayoutStyle?: React.CSSProperties;
  /**
   * 防抖时间
   */
  debounceTime?: number;
  /**
   * 是否开启选择操作
   */
  rowSelection?: IAhProTableProps<any, any, any>['rowSelection'];
  /**
   * 是否显示关键词搜索 - 默认显示
   */
  showKeyword?: boolean;
  /**
   * 当这一行被点击的时候
   */
  onRowClick?: (v: T) => void;
  /**
   * 底部的渲染
   */
  footerRender?: () => React.ReactNode;
  /**
   * 表格背景色
   */
  background?: string;
  /**
   * 筛选条件开关
   */
  needSearch?: boolean;
  /**
   * 显示时间筛选的开关。true 为单字段（field/timeName）；
   * 传数组可配置多个日期区间，如 [{ field: 'saleTimeObj', label: '销售时间' }, ...]。
   * 注意：默认发送 creTimeObj={startDay,endDay}，后端未实现该参数的项目建议关闭。
   */
  timeSearch?: boolean | Array<{ field: string; label?: string }>;
  /**
   * 时间字段类型（默认是创建时间）
   */
  field?: string;
  /**
   * 时间类型中文（默认是创建时间）
   */
  timeName?: string;
  /**
   * 显示排序筛选的开关。true 用默认两项（更新排序/创建排序）；
   * 传对象可自定义字段名、标题与选项，每个选项声明自己写入的 sort 对象。
   */
  sortSearch?:
    | boolean
    | {
        name?: string;
        label?: string;
        /** 旧版单选预设（仅给 options 时回退为单选下拉） */
        options?: Array<{ label: string; value: string; sort: Record<string, boolean> }>;
        /** 多条件排序的可选字段（div 新布局「排序 · N个条件」弹层）。sort 值 false 为降序、true 为升序 */
        fields?: IAhSortField[];
      };
  /**
   * 声明式筛选字段：配置即表单，div 新布局据此渲染「筛选 N个条件」弹层与外露 chip。
   * 与 searchForm 同源（searchForm 是手写 DOM），未传时沿用 searchForm/LightFilter 渲染
   */
  filterFields?: IAhFilterField[];
  /**
   * 筛选视图管理（保存/切换/删除视图）。默认存 localStorage；传入 views 则完全受控
   */
  filterViews?: IAhFilterViewsConfig | false;
  /**
   * 查询触发模式：instant 即时触发（默认，行为不变）；submit 表单与关键词变更只暂存，点「查询」统一提交
   */
  searchMode?: 'instant' | 'submit';
  /**
   * 筛选条件同步到 URL query（默认 false）。刷新、分享链接、前进后退可还原筛选状态。
   * 传入对象可指定只同步的参数 key 白名单
   */
  syncUrl?: boolean | { keys?: string[] };
  /**
   * 请求失败回调。默认 message.error 提示并保留旧数据；传此函数则接管提示
   */
  onError?: (e: unknown) => void;
  /**
   * 搜索区是否可折叠（默认 div 布局可折叠，card/plugin 不可）
   */
  searchCollapsible?: boolean;
  /**
   * 是否显示「重置」按钮 - 默认显示，一键还原全部筛选（含折叠区暂存值）
   */
  showReset?: boolean;
};

export type IAhCardListPageProps<T, F> = IUseAhPageConfigProps<T> & {
  /**
   * 搜索表单，如果不传则使用默认的搜索表单
   */
  searchForm?: ISearchContentProps['searchForm'];
  /**
   * 请求函数
   */
  request: IUseItemTableProps<T, F>['request'];
  /**
   * 默认的查询参数
   */
  defParams?: IUseItemTableProps<T, F>['defValue'];
  /**
   * SearchContent的额外配置
   */
  searchContentProps?: ISearchContentProps;
  /**
   * 上传之前的钩子
   */
  pageRef?: React.MutableRefObject<IAhCardListPageFunc<T, F> | undefined>;
  /**
   * 搜索区域的渲染
   */
  searchRender?: (update: (v: F) => void) => React.ReactNode;
  /**
   * 搜索区域的渲染
   */
  searchContentRender?: (update: (v: F) => void) => React.ReactNode;
  /**
   * 最外层的样式
   */
  style?: React.CSSProperties;
  /**
   * 内部容器的样式
   */
  containerStyle?: React.CSSProperties;
  /**
   * 搜索区域的样式 卡片还是div
   */
  searchLayout?: 'card' | 'div' | 'plugin';
  /**
   * 防抖时间
   */
  debounceTime?: number;
  itemRender?: (list: T, index: number) => React.ReactNode;
  itemsRender?: (list: T[]) => React.ReactNode;
  /**
   * 是否显示关键词搜索 - 默认显示
   */
  showKeyword?: boolean;
  /**
   * 表格横向滚动宽度（可选覆盖）。
   * 未传时：像素列宽按总和计算；百分比列宽不设 scroll.x（兼容 ellipsis，勿用 max-content）。
   */
  xScroll?: number;
  /**
   * 背景颜色
   */
  backgroundColor?: string;
  /**
   * 没数据的时候渲染内容
   */
  noMoreRender?: React.ReactNode;
  /**
   * 参数变化
   */
  onParamsChange?: (params: F) => void;
  /**
   * 数据的key
   */
  rowKey?: string;
  /**
   * 是否展示头部筛选
   */
  showHeader?: boolean;
  /**
   * 是否展示搜索框
   */
  showSearchInput?: boolean;
};

export default {};
