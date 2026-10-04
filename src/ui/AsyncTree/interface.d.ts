import type { IAntTreeNode } from '@allahjs/utils';
import type { TreeProps } from 'antd/lib/tree/Tree';
import React from 'react';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { IAhModalProps } from '../AhModal';

export type ITreeSelectData = { selected: boolean; data: IAntTreeNode };
export type IAsyncTreeMiniProps = {
  // 左侧的地区树接口
  asyncTreeData: (v?: string) => Promise<IAntTreeNode[]>;
  // 树节点的配置
  treeProps?: TreeProps<IAntTreeNode>;
  treeSelect?: (data: ITreeSelectData) => void;
  children?: any;
};

/**
 * 树组件的ref
 */
export type IAsyncTreePlusFun = {
  /**
   * 根据code删除指定的数据
   */
  deleteByValue: (item: IAntTreeNode) => void;

  /**
   * 刷新
   */
  asyncRefresh: (code: string) => void;
  refresh: (code: string) => Promise<void>;
};
/**
 * 异步树组件，支持指定默认值！！！
 */
export type IAsyncTreePlusProps = {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 值 - form用
   */
  value?: string[];
  /**
   * 回调 - form用
   */
  onChange?: (v: string[]) => void;
  /**
   * 异步获取数据
   */
  asyncReq: IAsyncTreeMiniProps['asyncTreeData'];
  /**
   * 获取需要展开的节点，默认值展示的时候用的
   */
  expandedKeysReq?: (v: string) => Promise<string[]>;
  /**
   * 自定义的title渲染
   */
  titleRender?: (item: IAntTreeNode) => any;
  /**
   * 节点的点击事件
   */
  onSelect?: (selectedKeys: React.Key[], info: any) => void;
  /**
   * 反馈需要显示的数据
   */
  onItemChange?: (v: IAntTreeNode[]) => void;

  /**
   * 树钩子
   */
  treeRef?: React.MutableRefObject<IAsyncTreePlusFun | undefined>;
  /**
   * 样式
   */
  treeStyle?: React.CSSProperties;
  /**
   * 禁用层级字段
   */
  disableLevel?: number;
  /**
   * 是否展示复选框
   */
  checkable?: boolean;
  /**
   * 是否展示连接线
   */
  showLine?: boolean;
};

export interface IAsyncTreeModalProps extends IAsyncTreePlusProps {
  /**
   * 初始化数据的接口
   * @param params 表单value的数组
   */
  initDataReq?: (params: string[]) => Promise<IAntTreeNode[]>;
  /**
   * 大小设置 - 默认是中号
   */
  size?: SizeType;
  /**
   * 新增的文字
   */
  addText?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 样式
   */
  style?: React.CSSProperties;
  /**
   * 禁用提示
   */
  disabledTips?: string;
  children?: any;
  /**
   * 弹窗的props
   */
  modalProps?: IAhModalProps;
}
