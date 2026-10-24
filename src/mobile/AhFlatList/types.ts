import type { ReactNode, CSSProperties } from 'react';
import type { SearchBarProps } from 'antd-mobile';
import type { IBaseFilter, ITablePage } from '@allahjs/utils';

// 组件ref方法接口
export interface IAhFlatListFunc<T, F> {
  /** 刷新列表 */
  refresh: () => void;
  /** 异步刷新列表 */
  asyncRefresh: () => Promise<void>;
  /** 更新查询参数 */
  updateParams: (params: F) => void;
  /** 获取列表数据 */
  getListData: () => T[];
  /** 更新数据 */
  updateData: (data: T[]) => void;
  /** 追加数据 */
  appendData: (data: T[]) => void;
  /** 更新单条数据 */
  updateOneData: (item: T, index?: number) => void;
}

// 搜索表单配置
export interface ISearchFormConfig extends Partial<SearchBarProps> {
  /** 是否显示搜索框 */
  show?: boolean;
  /** 搜索框占位符 */
  placeholder?: string;
  /** 是否显示取消按钮 */
  showCancelButton?: boolean;
}

// 组件props接口
export interface IAhFlatListProps<T, F = IBaseFilter> {
  /** 搜索表单配置 */
  searchForm?: ISearchFormConfig;
  /** 数据请求函数 */
  request: (params: F) => Promise<ITablePage<T>>;
  /** 默认查询参数 */
  defParams?: F;
  /** 组件ref */
  pageRef?: React.MutableRefObject<IAhFlatListFunc<T, F> | undefined>;
  /** 自定义渲染单个项目 */
  itemRender?: (item: T, index: number) => ReactNode;
  /** 自定义渲染多个项目 */
  itemsRender?: (items: T[]) => ReactNode;
  /** 是否显示搜索关键词 */
  showKeyword?: boolean;
  /** 搜索结果为空后渲染的内容 */
  emptyRender?: (params?: F) => ReactNode;
  /** 没有更多数据时的自定义渲染 */
  noMoreRender?: ReactNode;
  /** 组件样式 */
  style?: CSSProperties;
  /** 组件类名 */
  className?: string;
  /** 列表容器样式 */
  listStyle?: CSSProperties;
  /** 列表容器类名 */
  listClassName?: string;
  backgroundColor?: string;
  rowKey?: string;
  containerStyle?: CSSProperties;
  /** 搜索参数变化回调 */
  onParamsChange?: (params: F) => void;
  /** 搜索防抖延迟时间(ms) */
  debounceTime?: number;
  /** 下拉刷新提示文字 */
  pullingText?: ReactNode;
  /** 释放刷新提示文字 */
  canReleaseText?: ReactNode;
  /** 刷新中提示文字 */
  refreshingText?: ReactNode;
  /** 刷新完成提示文字 */
  completeText?: ReactNode;
  /** 加载更多提示文字 */
  loadMoreText?: ReactNode;
  /** 没有更多数据提示文字 */
  noMoreText?: ReactNode;
  /** 是否显示搜索框 */
  showSearchInput?: boolean;
  /** 列表容器高度 */
  containerHeight?: number;
}

export default {};
