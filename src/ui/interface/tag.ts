import type { IOptions7 } from '@allahjs/utils';
import { IListOptionsEvent } from './list';
import React from 'react';
import type { IUseCustomFormItemProps } from '../hooks/interface';

export type ITagListProps = {
  /**
   * 默认值，如果是表单的话，就不要设置了
   */
  value?: IOptions7<string>[];
  /**
   * 监听事件，如果是表单的话，就不要设置了
   */
  onChange?: (v: IOptions7<string>[]) => void;
};
export type ITagSwitchProps = {
  /**
   * 数据
   */
  options?: IOptions7<string>[];
  /**
   * 当数据变化时触发
   */
  onValueChange?: (value: string) => void;
  /**
   * 异步获取数据的方法
   */
  groupListReq?: () => Promise<IOptions7<string>[]>;
  /**
   * 数据被修改后的回调
   */
  groupChangeReq?: (type: IListOptionsEvent, item: IOptions7<string>) => Promise<void>;
  /**
   * 左侧标题，如果传递了，就显示左边的内容
   */
  leftTitle?: string;
  /**
   * 点击的key
   */
  leftKey?: string;
};

export interface ITagItem extends IOptions7<string> {
  color?: string;
}

/**
 * 标签组件的ref
 */
export type ITagRefFun = {
  /**
   * 初始化数据
   */
  initData: () => void;
};

export interface ITagManageCommProps {
  /**
   * 表单的值
   */
  value?: string[];
  /**
   * 返回当前选择的全部数据
   * @param itemList 全部选择的值
   */
  onChange?: (ids: string[], itemList?: ITagItem[]) => void;
  /**
   * 调用这个接口，得到列表中药显示的数据
   * <br />
   * 这个是必选传递的，如果不调用接口，也需要这个方法来进行操作！！！
   */
  request: (keyword?: string) => Promise<ITagItem[]>;
  /**
   * 新增标签的回调，这个是必须要的，不然再选就没有id了
   * @param v
   */
  newTagRequest?: (v: ITagItem) => Promise<string>;

  /**
   * 调用这个接口，获取已选择好的标签
   */
  defValReq: IUseCustomFormItemProps<ITagItem>['defValReq'];
}

export interface ITagManageProps extends ITagManageCommProps {
  /**
   * 当选择组件的值发生了变化，需要把这个组件的值传递给显示组件
   */
  updateNewList?: (v: ITagItem[]) => void;
  /**
   * loading状态
   */
  setLoading?: IUseCustomFormItemProps<ITagItem>['setLoading'];

  /**
   *  钩子
   */
  tagRef?: React.MutableRefObject<ITagRefFun | undefined>;
  /**
   * 显示还是隐藏
   */
  visible?: boolean;
  /**
   * 初始化完成的回调
   */
  initFinish?: () => void;
  /**
   * 是否显示创建标签按钮 - 默认显示
   */
  showAdd?: boolean;
  /**
   * 是否选择标签颜色
   */
  isTagColor?: boolean;
}
