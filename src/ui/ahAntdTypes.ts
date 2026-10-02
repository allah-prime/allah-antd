import { ProColumns } from '@ant-design/pro-components';
import { IAhProTableProps } from './AhProTable/AhProTable';
import React from 'react';
import { ITablePage } from '../theling-utils/@types/IZlData';
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
   * 筛选条件 - 标题图标
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
   * 搜索表单扩充，你可以传递一个数组进来，它会渲染在keyword搜索的前面
   */
  searchForm?: ISearchContentProps['searchForm'];
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
   * 显示时间筛选的开关
   */
  timeSearch?: boolean;
  /**
   * 时间字段类型（默认是创建时间）
   */
  field?: string;
  /**
   * 时间类型中文（默认是创建时间）
   */
  timeName?: string;
  /**
   * 显示排序筛选的开关
   */
  sortSearch?: boolean;
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
