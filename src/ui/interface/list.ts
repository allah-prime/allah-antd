import type { IOptions6, IOptions7 } from '../../theling-utils/@types/IZlData';
import React from 'react';

export type IListOptionsEvent = 'add' | 'del' | 'update' | 'move';

export interface IListOptionsProps {
  onChange?: (
    values: IOptions7<string>[],
    item: IOptions7<string>,
    index: number,
    type: IListOptionsEvent
  ) => void;
  onAdd?: (value: IOptions7<string>) => void;
  onDelete?: (value: IOptions7<string>, index: number) => void;
  value?: IOptions7<string>[];
  /**
   * 标题
   */
  title?: React.ReactNode;
  /**
   * 提示信息
   */
  tips?: string;
  /**
   * 标题的自定义渲染
   */
  titleRender?: () => React.ReactNode;
  //条目总数
  classifyValue?: {};
  /**
   * 是否允许自定义输入值
   */
  customValue?: boolean;
  /**
   * 提示
   */
  placeholder?: string;
  /**
   * 是否显示搜索框
   */
  search?: boolean;
  /**
   * 是否自定义右侧按钮
   */
  extraRender?: (item: IOptions7<string>) => React.ReactNode;
  /**
   * 输入框
   */
  inputRender?: boolean;
}

export interface IListSearchProps {
  /**
   * 选择变化的时候触发
   * @param value 已选的id集合
   * @param item 点击的那一项，通过checked来判断是选中还是取消
   * @param options 当前的全部选择项
   */
  onChange?: (value: string[], item?: IOptions7<string>, options?: IOptions7<string>[]) => void;
  options: IOptions7<string>[];
  // 自定义item渲染
  itemRender?: (item: IOptions6<string>) => React.ReactNode;
  // 类型，多选还是单选，默认单选
  type?: 'checkbox' | 'radio';
  value?: string[];
  optionsStyle?: React.CSSProperties;
  /**
   * 是否显示搜索框
   */
  showSearch?: boolean;
  //筛选条目总数
  classifyValue?: any;
  /**
   * 控制选择的值
   */
  checkKey?: string[];
}
