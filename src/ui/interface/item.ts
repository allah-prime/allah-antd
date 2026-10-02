import React from 'react';
import type { MenuItemProps } from 'antd';

export interface ITemBarFunc<T> {
  tagRender?: (i: T) => React.ReactElement | undefined;
  /**
   * 右侧渲染
   * @param i
   */
  extraRender?: (
    i: T,
    newDom?: ({ marginRight }: { marginRight?: number }) => React.ReactNode
  ) => React.ReactNode;
  /**
   * 右侧的菜单
   * @param i
   */
  extraMenu?: MenuItemProps &
    {
      name: React.ReactNode;
      key: string;
      title?: string;
    }[];
  /**
   * 菜单选择后的事件
   */
  onMenuSelect?: (key: string) => void;
  /**
   * 右侧的文字 这个在new的前面
   */
  extraText?: React.ReactElement | undefined;
  /**
   * 左侧icon位置渲染
   * @param i
   */
  iconRender?: (i: T) => React.ReactElement | undefined;
  /**
   * 右侧元素
   */
  extra?: string | React.ReactNode;
  title?: string | React.ReactNode;
  icon?: string | React.ReactNode;
  tag?: string | React.ReactNode;
  barTitleKey?: string;
  clickMatter?: (item: any) => void;
  // 是否开启编辑功能
  editable?: boolean;
  // 是否显示底部的线
  boxShadow?: boolean;
  // 返回值监听
  onChange?: (value: string) => void;
  // 输入框失去焦点
  onBlur?: () => void;
  disabled?: boolean;
  // 重新排序的方法
  onDragEnd?: (result: any) => void;
  /**
   * 外部的样式
   */
  bodyStyle?: React.CSSProperties;
}

export interface ItemBarProps<T> extends ITemBarFunc<T> {
  item: any;
}

export interface IItemListCardProps<T> extends ITemBarFunc<T> {
  addClick?: () => void;
  refresh?: () => void;
  // 关联的点击回调，如果传递了这个就显示关联的按钮
  relFun?: () => void;
  // 标题右侧的icon渲染
  titleIconRender?: React.ReactNode | React.ReactNode[];
  // 刷新的进度信息
  refreshLoading?: boolean;
  data: T[];
  barKey: string;
  clickMatter?: (item: any) => void;
  //是否被禁用掉
  disabled?: boolean;
  style?: React.CSSProperties;
  /**
   * 渲染列表的样式
   */
  listStyle?: React.CSSProperties;
  children?: React.ReactNode;
}
